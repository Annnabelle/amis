import { describe, expect, it } from "vitest";

import { readRuntimeConfig, validateRuntimeConfig } from "shared/config/runtime";

const complete = {
  API_BASE_URL: "https://api-stage.amis.uz",
  ENV: "stage",
  YANDEX_MAPS_JS_API_KEY: "maps-key",
};

describe("конфигурация окружения", () => {
  it("берёт значения из window.__CONFIG__", () => {
    const config = readRuntimeConfig(complete, false);

    expect(config.apiBaseUrl).toBe("https://api-stage.amis.uz");
    expect(config.env).toBe("stage");
    expect(config.yandexMapsJsApiKey).toBe("maps-key");
    expect(validateRuntimeConfig(config)).toEqual([]);
  });

  it("в собранном приложении пустая конфигурация — отказ, а не localhost", () => {
    const config = readRuntimeConfig(undefined, false);

    expect(config.apiBaseUrl).toBe("");
    expect(validateRuntimeConfig(config)).toHaveLength(2);
  });

  it("в дев-режиме подставляется локальный бэкенд", () => {
    const config = readRuntimeConfig(undefined, true);

    expect(config.apiBaseUrl).toBe("http://127.0.0.1:3000");
    expect(config.env).toBe("development");
    expect(validateRuntimeConfig(config)).toEqual([]);
  });

  it("неполная конфигурация называет недостающее поле", () => {
    const config = readRuntimeConfig({ ENV: "production" }, false);

    expect(validateRuntimeConfig(config)).toEqual(["API_BASE_URL — адрес бэкенда"]);
  });

  it("необязательные ключи остаются пустыми без шума", () => {
    const config = readRuntimeConfig({ API_BASE_URL: "https://api.amis.uz", ENV: "production" }, false);

    expect(config.eImzoApiKeys).toEqual([]);
    expect(config.yandexMapsJsApiKey).toBeUndefined();
    expect(validateRuntimeConfig(config)).toEqual([]);
  });
});
