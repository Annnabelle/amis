declare global {
  interface Window {
    __CONFIG__?: RuntimeConfigSource;
  }
}

export type RuntimeConfigSource = {
  API_BASE_URL?: string;
  ENV?: string;
  E_IMZO_API_KEYS?: string[];
  YANDEX_MAPS_JS_API_KEY?: string;
  YANDEX_GEOCODER_API_KEY?: string;
};

export type RuntimeConfig = {
  apiBaseUrl: string;
  env: string;
  eImzoApiKeys: string[];
  yandexMapsJsApiKey?: string;
  yandexGeocoderApiKey?: string;
};

/**
 * Адрес API на дев-сервере. Подставляется только при npm run dev: свежий клон
 * запускается без настройки, а собранное приложение обязано получить адрес от
 * окружения.
 */
const DEV_API_BASE_URL = 'http://127.0.0.1:3000';

export const readRuntimeConfig = (
  source: RuntimeConfigSource | undefined,
  isDev: boolean,
): RuntimeConfig => ({
  apiBaseUrl: source?.API_BASE_URL ?? (isDev ? DEV_API_BASE_URL : ''),
  env: source?.ENV ?? (isDev ? 'development' : ''),
  eImzoApiKeys: source?.E_IMZO_API_KEYS ?? [],
  yandexMapsJsApiKey: source?.YANDEX_MAPS_JS_API_KEY,
  yandexGeocoderApiKey: source?.YANDEX_GEOCODER_API_KEY,
});

/**
 * Чего не хватает в конфигурации, человеческим языком.
 *
 * Пустой список — конфигурация годна. Непустой означает, что приложение
 * работать не может: без адреса API каждый запрос уйдёт в никуда, и молчаливая
 * подстановка localhost превратила бы это в «не работает по-разному в разных
 * сетях».
 */
export const validateRuntimeConfig = (value: RuntimeConfig): string[] => {
  const problems: string[] = [];

  if (!value.apiBaseUrl) {
    problems.push('API_BASE_URL — адрес бэкенда');
  }

  if (!value.env) {
    problems.push('ENV — имя окружения');
  }

  return problems;
};

export const config = readRuntimeConfig(
  typeof window === 'undefined' ? undefined : window.__CONFIG__,
  import.meta.env.DEV,
);

export const runtimeConfigProblems = validateRuntimeConfig(config);
