import { beforeEach, describe, expect, it, vi } from "vitest";
import { CoreErrorCodes } from "@edem2000/amis.contracts";

/**
 * Срок сессии и признак истёкшей сессии. Оба раньше угадывались — константой
 * на час и поиском подстрок в тексте ошибки.
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
  getSessionEnd,
  isSessionExpiredResponse,
  isStoredSessionExpired,
  readTokenExpiry,
  saveAuthTokens,
} = await import("shared/lib/authSession");

const tokenWithExp = (expSeconds: number | null) => {
  const payload = expSeconds === null ? { sub: "user-1" } : { exp: expSeconds };
  const encoded = btoa(JSON.stringify(payload))
    .replace(/\+/g, "-")
    .replace(/\//g, "_");

  return `header.${encoded}.signature`;
};

describe("срок сессии", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("читает exp из токена", () => {
    const exp = Math.floor(Date.now() / 1000) + 900;

    expect(readTokenExpiry(tokenWithExp(exp))).toBe(exp * 1000);
  });

  it("возвращает null, если токен не разбирается", () => {
    expect(readTokenExpiry("not-a-token")).toBeNull();
    expect(readTokenExpiry("header..signature")).toBeNull();
    expect(readTokenExpiry(tokenWithExp(null))).toBeNull();
  });

  it("берёт конец сессии из refresh-токена: до него access продлевается", () => {
    const accessExp = Math.floor(Date.now() / 1000) + 60;
    const refreshExp = Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60;

    saveAuthTokens({
      accessToken: tokenWithExp(accessExp),
      refreshToken: tokenWithExp(refreshExp),
    });

    expect(getSessionEnd()).toBe(refreshExp * 1000);
    expect(isStoredSessionExpired()).toBe(false);
  });

  it("откатывается на час, если exp в токене нет", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-11-20T10:00:00.000Z"));

    saveAuthTokens({
      accessToken: tokenWithExp(null),
      refreshToken: tokenWithExp(null),
    });

    expect(getSessionEnd()).toBe(
      new Date("2026-11-20T11:00:00.000Z").getTime()
    );

    vi.useRealTimers();
  });

  it("считает сессию истёкшей, когда refresh-токен уже не живёт", () => {
    saveAuthTokens({
      accessToken: tokenWithExp(Math.floor(Date.now() / 1000) - 3600),
      refreshToken: tokenWithExp(Math.floor(Date.now() / 1000) - 1),
    });

    expect(isStoredSessionExpired()).toBe(true);
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
