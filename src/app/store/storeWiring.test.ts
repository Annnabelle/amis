import { beforeEach, describe, expect, it, vi } from "vitest";

/**
 * Связка стора: редьюсеры и middleware RTK Query, матчеры в слайсах сессии и
 * сканирования, запись сессии из onQueryStarted и сброс кеша при смене
 * компании и выходе. Типы это не ловят, а ломается тут всё сразу.
 */
const axiosRequest = vi.hoisted(() => vi.fn());

vi.mock("shared/lib/axiosInstance", () => ({
  default: { request: axiosRequest },
}));

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

vi.stubGlobal("localStorage", createStorage());
vi.stubGlobal("window", {
  __CONFIG__: { API_BASE_URL: "http://localhost:3000" },
  location: { pathname: "/" },
  addEventListener: () => undefined,
  removeEventListener: () => undefined,
  dispatchEvent: () => true,
  localStorage,
});

const userDto = {
  id: "user-1",
  firstName: "Иван",
  lastName: "Петров",
  email: "ivan@example.com",
  phone: "+998901234567",
  status: "active",
  preferences: { language: "ru", theme: "light" },
  emailVerifiedAt: null,
  lastLoggedInAt: null,
};

const loginResponse = {
  status: 200,
  data: {
    success: true,
    user: userDto,
    tokens: { accessToken: "access-1", refreshToken: "refresh-1" },
  },
};

const scanSessionResponse = {
  status: 200,
  data: {
    success: true,
    scanSession: {
      id: "session-1",
      companyId: "company-1",
      status: "active",
      type: "loading",
      routeId: "route-1",
      counters: { accepted: 0, rejected: 0 },
      timestamps: { startedAt: new Date().toISOString() },
      userId: "user-1",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  },
};

const vehiclesResponse = {
  status: 200,
  data: { success: true, data: [], total: 0, page: 1, limit: 10 },
};

/** Стор держит состояние между тестами, поэтому поднимаем его заново. */
const freshStore = async () => {
  vi.resetModules();
  localStorage.clear();

  const [{ store }, { usersApi }, { vehiclesApi }, { scanSessionsApi }] =
    await Promise.all([
      import("app/store"),
      import("entities/users/api"),
      import("entities/vehicles/api"),
      import("entities/scanSessions/api"),
    ]);

  return { store, usersApi, vehiclesApi, scanSessionsApi };
};

beforeEach(() => {
  axiosRequest.mockReset();
});

describe("связка стора", () => {
  it("вход записывает сессию в слайс и в хранилище", async () => {
    const { store, usersApi } = await freshStore();
    axiosRequest.mockResolvedValue(loginResponse);

    await store.dispatch(
      usersApi.endpoints.login.initiate({
        email: "ivan@example.com",
        password: "secret",
      })
    );

    const { users } = store.getState();

    expect(users.isAuthenticated).toBe(true);
    expect(users.currentUser?.id).toBe("user-1");
    expect(users.accessToken).toBe("access-1");
    expect(localStorage.getItem("accessToken")).toBe("access-1");
    expect(localStorage.getItem("sessionEnd")).not.toBeNull();
  });

  it("отказ входа не роняет сессию и не пишет токены", async () => {
    const { store, usersApi } = await freshStore();
    axiosRequest.mockRejectedValue({
      isAxiosError: true,
      response: {
        status: 401,
        data: { success: false, errorCode: 4010, errorMessage: { ru: "Неверный пароль" } },
      },
    });

    const result = await store.dispatch(
      usersApi.endpoints.login.initiate({
        email: "ivan@example.com",
        password: "wrong",
      })
    );

    expect("error" in result && result.error).toBeTruthy();
    expect(store.getState().users.isAuthenticated).toBe(false);
    expect(localStorage.getItem("accessToken")).toBeNull();
  });

  it("смена компании сбрасывает кеш запросов", async () => {
    const { store, vehiclesApi } = await freshStore();
    const { setCurrentCompanyId } = await import("entities/access/model");
    axiosRequest.mockResolvedValue(vehiclesResponse);

    await store.dispatch(
      vehiclesApi.endpoints.getVehicles.initiate({ page: 1, limit: 10 })
    );
    expect(Object.keys(store.getState().api.queries)).toHaveLength(1);

    store.dispatch(setCurrentCompanyId("company-2"));

    expect(Object.keys(store.getState().api.queries)).toHaveLength(0);
  });

  it("повторная установка той же компании кеш не трогает", async () => {
    const { store, vehiclesApi } = await freshStore();
    const { setCurrentCompanyId } = await import("entities/access/model");
    axiosRequest.mockResolvedValue(vehiclesResponse);

    store.dispatch(setCurrentCompanyId("company-1"));
    await store.dispatch(
      vehiclesApi.endpoints.getVehicles.initiate({ page: 1, limit: 10 })
    );

    /** Маршрут присылает ту же компанию на каждый переход по страницам. */
    store.dispatch(setCurrentCompanyId("company-1"));

    expect(Object.keys(store.getState().api.queries)).toHaveLength(1);
  });

  it("выход сбрасывает кеш запросов", async () => {
    const { store, usersApi, vehiclesApi } = await freshStore();
    axiosRequest.mockResolvedValue(loginResponse);
    await store.dispatch(
      usersApi.endpoints.login.initiate({
        email: "ivan@example.com",
        password: "secret",
      })
    );

    axiosRequest.mockResolvedValue(vehiclesResponse);
    await store.dispatch(
      vehiclesApi.endpoints.getVehicles.initiate({ page: 1, limit: 10 })
    );
    expect(Object.keys(store.getState().api.queries)).toHaveLength(1);

    const { logout } = await import("entities/users/model");
    store.dispatch(logout());

    expect(store.getState().users.isAuthenticated).toBe(false);
    expect(Object.keys(store.getState().api.queries)).toHaveLength(0);
  });

  it("слайс сканирования слышит результат мутации", async () => {
    const { store, scanSessionsApi } = await freshStore();
    axiosRequest.mockResolvedValue(scanSessionResponse);

    await store.dispatch(
      scanSessionsApi.endpoints.createScanSession.initiate({
        type: "loading",
        routeId: "route-1",
      })
    );

    const { scanSessions } = store.getState();

    expect(scanSessions.currentSession?.id).toBe("session-1");
    expect(scanSessions.isCreating).toBe(false);
    expect(scanSessions.error).toBeNull();
  });
});
