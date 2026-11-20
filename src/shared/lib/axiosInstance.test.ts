import { beforeEach, describe, expect, it, vi } from "vitest";
import type { AxiosRequestConfig, AxiosResponse } from "axios";

/**
 * Продление сессии в интерцепторе: refresh-токен клиенту не виден (httpOnly-
 * cookie), поэтому продление — это запрос с пустым телом. Один на все
 * ожидающие запросы, по одному повтору на запрос, выход — когда продлить нечем.
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

const axiosModule = await import("shared/lib/axiosInstance");
const axiosInstance = axiosModule.default;
const { clearAccessToken, getAccessToken, setAccessToken } = await import(
  "shared/lib/authToken"
);

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

const sessionEnd = new Date("2026-11-27T10:00:00.000Z");

const refreshBody = {
  success: true,
  user: { id: "user-1" },
  tokens: {
    accessToken: "access-2",
    refreshExpiresAt: sessionEnd.toISOString(),
  },
};

const plan = {
  refreshCalls: 0,
  refreshBodies: [] as unknown[],
  refreshAnswer: (config: AxiosRequestConfig) =>
    Promise.resolve(ok(config, refreshBody)),
};

const answer = (config: AxiosRequestConfig) => {
  if (String(config.url).endsWith("/auth/refresh")) {
    plan.refreshCalls += 1;
    plan.refreshBodies.push(config.data);

    return plan.refreshAnswer(config);
  }

  // Пока лежит старый токен — отказ; после продления запрос проходит.
  if (config.headers?.Authorization === "Bearer access-2") {
    return Promise.resolve(ok(config, { success: true }));
  }

  return Promise.reject(
    unauthorized(config, { statusCode: 401, message: "Invalid or expired token" })
  );
};

axiosInstance.defaults.adapter = answer;

describe("продление сессии в интерцепторе", () => {
  beforeEach(() => {
    localStorage.clear();
    setAccessToken("access-1");
    dispatched.length = 0;
    plan.refreshCalls = 0;
    plan.refreshBodies = [];
    plan.refreshAnswer = (config) => Promise.resolve(ok(config, refreshBody));
    axiosInstance.defaults.adapter = answer;
  });

  it("посылает cookie и не кладёт refresh-токен в тело", () => {
    expect(axiosInstance.defaults.withCredentials).toBe(true);
  });

  it("продлевает сессию один раз на все ожидающие запросы и повторяет их", async () => {
    const responses = await Promise.all([
      axiosInstance.get("/users/me"),
      axiosInstance.get("/users/me/access"),
    ]);

    expect(plan.refreshCalls).toBe(1);
    expect(plan.refreshBodies).toEqual(["{}"]);
    expect(responses.every((response) => response.status === 200)).toBe(true);
    expect(getAccessToken()).toBe("access-2");
    expect(localStorage.getItem("sessionEnd")).toBe(String(sessionEnd.getTime()));
    expect(dispatched.map((event) => event.type)).toContain(
      "auth-session-refreshed"
    );
  });

  it("повторяет запрос с телом, не перекодируя его дважды", async () => {
    const bodies: unknown[] = [];

    axiosInstance.defaults.adapter = (config: AxiosRequestConfig) => {
      if (!String(config.url).endsWith("/auth/refresh")) {
        bodies.push(config.data);
      }

      return answer(config);
    };

    await axiosInstance.post("/users", { email: "a@b.c" });

    expect(bodies).toHaveLength(2);
    expect(bodies[1]).toBe(JSON.stringify({ email: "a@b.c" }));
  });

  it("выходит из системы, когда продлить не удалось", async () => {
    plan.refreshAnswer = (config) =>
      Promise.reject(unauthorized(config, { success: false, errorCode: 10074 }));

    await expect(axiosInstance.get("/users/me")).rejects.toBeDefined();

    expect(getAccessToken()).toBeNull();
    expect(localStorage.getItem("sessionEnd")).toBeNull();
    expect(dispatched.map((event) => event.type)).toContain(
      "auth-session-expired"
    );
  });

  it("не продлевает сессию, когда её и не было", async () => {
    clearAccessToken();

    await expect(axiosInstance.get("/users/me")).rejects.toBeDefined();

    expect(plan.refreshCalls).toBe(0);
    expect(dispatched).toHaveLength(0);
  });

  it("не выходит из системы из-за ответа ручки входа", async () => {
    await expect(
      axiosInstance.post("/auth/login", { email: "a@b.c", password: "x" })
    ).rejects.toBeDefined();

    expect(plan.refreshCalls).toBe(0);
    expect(getAccessToken()).toBe("access-1");
  });

  it("поднимает сессию после перезагрузки страницы", async () => {
    clearAccessToken();

    const tokens = await axiosModule.refreshAuthSession();

    expect(tokens).toEqual({
      accessToken: "access-2",
      sessionEnd: sessionEnd.getTime(),
    });
    expect(getAccessToken()).toBe("access-2");
  });
});
