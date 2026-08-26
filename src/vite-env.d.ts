/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_YANDEX_MAPS_JS_API_KEY?: string;
  readonly VITE_YANDEX_GEOCODER_API_KEY?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}


