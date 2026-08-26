declare global {
  interface Window {
    __CONFIG__?: {
      API_BASE_URL?: string;
      ENV?: string;
      E_IMZO_API_KEYS?: string[],
      YANDEX_MAPS_JS_API_KEY?: string,
      YANDEX_GEOCODER_API_KEY?: string,
    };
  }
}

export const config = {
  apiBaseUrl: window.__CONFIG__?.API_BASE_URL || 'http://localhost:3000',
  env: window.__CONFIG__?.ENV || 'development',
  eImzoApiKeys: window.__CONFIG__?.E_IMZO_API_KEYS || [],
  yandexMapsJsApiKey:
    window.__CONFIG__?.YANDEX_MAPS_JS_API_KEY ||
    import.meta.env.VITE_YANDEX_MAPS_JS_API_KEY,
  yandexGeocoderApiKey:
    window.__CONFIG__?.YANDEX_GEOCODER_API_KEY ||
    import.meta.env.VITE_YANDEX_GEOCODER_API_KEY,
};



