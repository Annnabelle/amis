import { beforeEach, describe, expect, it, vi } from "vitest";
import type { AxiosRequestConfig, AxiosResponse } from "axios";

/**
 * Молчаливое продление сессии в интерцепторе: один refresh на все
 * ожидающие запросы, по одному повтору на запрос, выход — только когда
 * продлить нечем.
 */
const createStorage = () => {
  const values = new Map<string, string>();

  return {
    getItem: (key: string) => values.get(key) ?? null,
    setItem: (key: string, value: string) => void values.set(key, value),
    removeItem: (key: string) => void values.delete(key),
    clear: () => values.clear(),
    key: () => null,
    length: 0,
  } as unknown as Storage;
};

const dispatched: Event[] = [];

vi.stubGlobal("localStorage", createStorage());
vi.stubGlobal("window", {
  __CONFIG__: { API_BASE_URL: "http://localhost:3000" },
  location: { pathname: "/" },
  localStorage,
  dispatchEvent: (event: Event) => {
    dispatched.push(event);
    return true;
  },
});

const axiosInstance = (await import("shared/lib/axiosInstance")).default;

const unauthorized = (config: AxiosRequestConfig, data: unknown) => ({
  isAxiosError: true,
  config,
  response: { status: 401, data, statusText: "Unauthorized", headers: {}, config },
});

const ok = (config: AxiosRequestConfig, data: unknown): AxiosResponse =>
  ({
    status: 200,
    statusText: "OK",
    data,
    headers: {},
    config,
  }) as AxiosResponse;

const refreshBody = {
  success: true,
  user: { id: "user-1" },
  tokens: { accessToken: "access-2", refreshToken: "refresh-2" },
};

type AdapterPlan = {
  refreshCalls: number;
  protectedCalls: number;
  refreshAnswer: (config: AxiosRequestConfig) => Promise<AxiosResponse>;
};

const plan: AdapterPlan = {
  refreshCalls: 0,
  protectedCalls: 0,
  refreshAnswer: (config) => Promise.resolve(ok(config, refreshBody)),
};

axiosInstance.defaults.adapter = (config: AxiosRequestConfig) => {
  const url = String(config.url);

  if (url.endsWith("/auth/refresh")) {
    plan.refreshCalls += 1;

    return plan.refreshAnswer(config);
  }

  plan.protectedCalls += 1;

  // Пока лежит старый токен — отказ; после продления запрос проходит.
  if (config.headers?.Authorization === "Bearer access-2") {
    return Promise.resolve(ok(config, { success: true }));
  }

  return Promise.reject(unauthorized(config, { statusCode: 401, message: "Invalid or expired token" }));
};

describe("продление сессии в интерцепторе", () => {
  beforeEach(() => {
    localStorage.clear();
    localStorage.setItem("accessToken", "access-1");
    localStorage.setItem("refreshToken", "refresh-1");
    dispatched.length = 0;
    plan.refreshCalls = 0;
    plan.protectedCalls = 0;
    plan.refreshAnswer = (config) => Promise.resolve(ok(config, refreshBody));
  });

  it("продлевает сессию один раз на все ожидающие запросы и повторяет их", async () => {
    const responses = await Promise.all([
      axiosInstance.get("/users/me"),
      axiosInstance.get("/users/me/access"),
    ]);

    expect(plan.refreshCalls).toBe(1);
    expect(responses.every((response) => response.status === 200)).toBe(true);
    expect(localStorage.getItem("accessToken")).toBe("access-2");
    expect(localStorage.getItem("refreshToken")).toBe("refresh-2");
    expect(dispatched.map((event) => event.type)).toContain(
      "auth-session-refreshed"
    );
  });

  it("выходит из системы, когда продлить не удалось", async () => {
    plan.refreshAnswer = (config) =>
      Promise.reject(unauthorized(config, { success: false, errorCode: 10074 }));

    await expect(axiosInstance.get("/users/me")).rejects.toBeDefined();

    expect(localStorage.getItem("accessToken")).toBeNull();
    expect(dispatched.map((event) => event.type)).toContain(
      "auth-session-expired"
    );
  });

  it("не продлевает сессию, когда refresh-токена нет", async () => {
    localStorage.removeItem("refreshToken");

    await expect(axiosInstance.get("/users/me")).rejects.toBeDefined();

    expect(plan.refreshCalls).toBe(0);
    expect(dispatched.map((event) => event.type)).toContain(
      "auth-session-expired"
    );
  });

  it("повторяет запрос с телом, не перекодируя его дважды", async () => {
    const bodies: unknown[] = [];

    const previous = axiosInstance.defaults.adapter;

    axiosInstance.defaults.adapter = (config: AxiosRequestConfig) => {
      const url = String(config.url);

      if (url.endsWith("/auth/refresh")) {
        plan.refreshCalls += 1;

        return plan.refreshAnswer(config);
      }

      bodies.push(config.data);

      if (config.headers?.Authorization === "Bearer access-2") {
        return Promise.resolve(ok(config, { success: true }));
      }

      return Promise.reject(
        unauthorized(config, { statusCode: 401, message: "Invalid or expired token" })
      );
    };

    await axiosInstance.post("/users", { email: "a@b.c" });

    axiosInstance.defaults.adapter = previous;

    expect(bodies).toHaveLength(2);
    expect(bodies[1]).toBe(JSON.stringify({ email: "a@b.c" }));
  });

  it("не выходит из системы из-за ответа ручки входа", async () => {
    plan.refreshAnswer = (config) => Promise.resolve(ok(config, refreshBody));

    await expect(
      axiosInstance.post("/auth/login", { email: "a@b.c", password: "x" })
    ).rejects.toBeDefined();

    expect(plan.refreshCalls).toBe(0);
    expect(localStorage.getItem("accessToken")).toBe("access-1");
  });
});
