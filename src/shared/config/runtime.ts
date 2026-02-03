declare global {
  interface Window {
    __CONFIG__?: {
      API_BASE_URL?: string;
      ENV?: string;
    };
  }
}

export const config = {
  apiBaseUrl: window.__CONFIG__?.API_BASE_URL || 'http://localhost:3000',
  env: window.__CONFIG__?.ENV || 'development'
};



