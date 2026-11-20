import { beforeEach, describe, expect, it, vi } from "vitest";
import { CoreErrorCodes } from "@edem2000/amis.contracts";

/**
 * Сессия на клиенте: access-токен в памяти, срок сессии от сервера, признак
 * истёкшей сессии по машинному коду. Раньше токены лежали в localStorage,
 * а срок и признак угадывались.
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

vi.stubGlobal("localStorage", createStorage());
vi.stubGlobal("window", {
  localStorage,
  dispatchEvent: () => true,
});

const {
  clearAuthStorage,
  getSessionEnd,
  isSessionExpiredResponse,
  isStoredSessionExpired,
  saveAuthSession,
  saveAuthTokens,
} = await import("shared/lib/authSession");
const { getAccessToken } = await import("shared/lib/authToken");

const inAnHour = () => Date.now() + 60 * 60 * 1000;

describe("хранение сессии", () => {
  beforeEach(() => {
    clearAuthStorage();
  });

  it("держит access-токен в памяти, а не в localStorage", () => {
    saveAuthTokens({ accessToken: "access-1", sessionEnd: inAnHour() });

    expect(getAccessToken()).toBe("access-1");
    expect(localStorage.getItem("accessToken")).toBeNull();
    expect(localStorage.getItem("refreshToken")).toBeNull();
  });

  it("берёт конец сессии от сервера", () => {
    const sessionEnd = inAnHour();

    saveAuthTokens({ accessToken: "access-1", sessionEnd });

    expect(getSessionEnd()).toBe(sessionEnd);
    expect(isStoredSessionExpired()).toBe(false);
  });

  it("считает сессию истёкшей, когда её срок прошёл", () => {
    saveAuthTokens({ accessToken: "access-1", sessionEnd: Date.now() - 1 });

    expect(isStoredSessionExpired()).toBe(true);
  });

  it("без сессии ничего не истекает", () => {
    expect(getSessionEnd()).toBeNull();
    expect(isStoredSessionExpired()).toBe(false);
  });

  it("кеширует пользователя для первой отрисовки", () => {
    saveAuthSession({
      user: { id: "user-1" },
      accessToken: "access-1",
      sessionEnd: inAnHour(),
    });

    expect(localStorage.getItem("user")).toBe('{"id":"user-1"}');
  });

  it("выход убирает и токен из памяти, и срок сессии", () => {
    saveAuthTokens({ accessToken: "access-1", sessionEnd: inAnHour() });

    clearAuthStorage();

    expect(getAccessToken()).toBeNull();
    expect(getSessionEnd()).toBeNull();
  });
});

describe("признак истёкшей сессии в ответе", () => {
  it("видит отказ guard'а: 401 без машинного кода", () => {
    expect(
      isSessionExpiredResponse(401, {
        statusCode: 401,
        message: "Invalid or expired token",
      })
    ).toBe(true);
  });

  it("видит код AuthenticationRequired", () => {
    expect(
      isSessionExpiredResponse(401, {
        success: false,
        errorCode: CoreErrorCodes.AuthenticationRequired,
      })
    ).toBe(true);
  });

  it("не принимает бизнес-ошибку за истёкшую сессию", () => {
    expect(
      isSessionExpiredResponse(401, {
        success: false,
        errorCode: CoreErrorCodes.InvalidCredentials,
        errorMessage: { ru: "Неверные данные" },
      })
    ).toBe(false);
  });

  it("не разбирает текст: слово token в сообщении больше ничего не решает", () => {
    expect(
      isSessionExpiredResponse(401, {
        success: false,
        errorCode: CoreErrorCodes.UserLoginBlocked,
        errorMessage: { ru: "token в тексте бизнес-ошибки" },
      })
    ).toBe(false);
  });

  it("оставляет 403 нехваткой прав, а не концом сессии", () => {
    expect(isSessionExpiredResponse(403, { message: "jwt expired" })).toBe(
      false
    );
  });

  it("не трогает прочие ответы", () => {
    expect(isSessionExpiredResponse(200, { success: true })).toBe(false);
    expect(isSessionExpiredResponse(undefined, undefined)).toBe(false);
  });
});
