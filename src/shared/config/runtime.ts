declare global {
  interface Window {
    __CONFIG__?: {
      API_BASE_URL?: string;
      ENV?: string;
      E_IMZO_API_KEYS?: string[],
    };
  }
}

export const config = {
  apiBaseUrl: window.__CONFIG__?.API_BASE_URL || 'http://localhost:3000',
  env: window.__CONFIG__?.ENV || 'development',
  eImzoApiKeys: window.__CONFIG__?.E_IMZO_API_KEYS || [],
};



