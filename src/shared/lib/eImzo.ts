type EImzoRequest = {
  name?: string;
  plugin?: string;
  arguments?: unknown[];
};

type EImzoResponse<T = unknown> = {
  success?: boolean;
  reason?: string;
  keyId?: string;
  pkcs7_64?: string;
  certificates?: EImzoCertificate[];
} & T;

type EImzoApiKey = {
  domain: string;
  key: string;
};

export type EImzoCertificate = {
  disk: string;
  path: string;
  name: string;
  alias: string;
  serialNumber?: string;
  subjectName?: string;
  validFrom?: string;
  validTo?: string;
  issuerName?: string;
  TIN?: string;
  O?: string;
  CN?: string;
};

const E_IMZO_HOST = '127.0.0.1';
const E_IMZO_HTTPS_PORT = 64443;
const E_IMZO_HTTP_PORT = 64646;
const REQUEST_TIMEOUT_MS = 30_000;

const apiKeys: EImzoApiKey[] = [
  {
    domain: 'localhost',
    key: '4a5f33b0f0e1a4f8c8cb93a5f80b9f2d1436df8dd9e31ef0f0ad390af8bd25e0',
  },
  {
    domain: '127.0.0.1',
    key: '4a5f33b0f0e1a4f8c8cb93a5f80b9f2d1436df8dd9e31ef0f0ad390af8bd25e0',
  },
];

const getSocketUrl = () => {
  const isHttps = window.location.protocol === 'https:';
  const protocol = isHttps ? 'wss' : 'ws';
  const port = isHttps ? E_IMZO_HTTPS_PORT : E_IMZO_HTTP_PORT;

  return `${protocol}://${E_IMZO_HOST}:${port}/service/cryptapi`;
};

const normalizeReason = (reason?: string) => {
  if (!reason) return 'E-IMZO did not return an error description';

  if (reason.includes('DISK I/O')) {
    return 'Key was not found. Check that the key file is in the DSKEYS folder.';
  }

  if (reason.includes('Bad password')) {
    return 'Invalid key password.';
  }

  return reason;
};

class EImzoClient {
  private socket: WebSocket | null = null;
  private connectedPromise: Promise<WebSocket> | null = null;
  private requestId = 0;
  private apiKeysInstalled = false;

  private connect() {
    if (this.socket?.readyState === WebSocket.OPEN) {
      return Promise.resolve(this.socket);
    }

    if (this.connectedPromise) {
      return this.connectedPromise;
    }

    this.connectedPromise = new Promise<WebSocket>((resolve, reject) => {
      const socket = new WebSocket(getSocketUrl());
      const timeoutId = window.setTimeout(() => {
        socket.close();
        reject(new Error('Could not connect to E-IMZO. Check that the app is running.'));
      }, REQUEST_TIMEOUT_MS);

      socket.onopen = () => {
        window.clearTimeout(timeoutId);
        this.socket = socket;
        resolve(socket);
      };

      socket.onerror = () => {
        window.clearTimeout(timeoutId);
        reject(new Error('E-IMZO is unavailable. Start e-imzo.exe and try again.'));
      };

      socket.onclose = () => {
        this.socket = null;
        this.connectedPromise = null;
        this.apiKeysInstalled = false;
      };
    });

    return this.connectedPromise;
  }

  private async request<T = unknown>(payload: EImzoRequest): Promise<EImzoResponse<T>> {
    const socket = await this.connect();
    const id = String(++this.requestId);

    return new Promise((resolve, reject) => {
      const timeoutId = window.setTimeout(() => {
        socket.removeEventListener('message', handleMessage);
        reject(new Error('E-IMZO is not responding. Try again.'));
      }, REQUEST_TIMEOUT_MS);

      const handleMessage = (event: MessageEvent<string>) => {
        let response: EImzoResponse<T> & { id?: string };

        try {
          response = JSON.parse(event.data);
        } catch {
          return;
        }

        if (response.id !== id) return;

        window.clearTimeout(timeoutId);
        socket.removeEventListener('message', handleMessage);

        if (response.success === false) {
          reject(new Error(normalizeReason(response.reason)));
          return;
        }

        resolve(response);
      };

      socket.addEventListener('message', handleMessage);
      socket.send(JSON.stringify({ ...payload, id }));
    });
  }

  async installApiKeys() {
    if (this.apiKeysInstalled) return;

    await this.request({
      name: 'apikey',
      arguments: [apiKeys],
    });

    this.apiKeysInstalled = true;
  }

  async listCertificates() {
    await this.installApiKeys();

    const response = await this.request<{ certificates: EImzoCertificate[] }>({
      plugin: 'pfx',
      name: 'list_all_certificates',
    });

    return response.certificates ?? [];
  }

  async loadKey(certificate: EImzoCertificate) {
    await this.installApiKeys();

    const response = await this.request<{ keyId: string }>({
      plugin: 'pfx',
      name: 'load_key',
      arguments: [certificate.disk, certificate.path, certificate.name, certificate.alias],
    });

    if (!response.keyId) {
      throw new Error('E-IMZO did not return a key id.');
    }

    return response.keyId;
  }

  async createDetachedPkcs7(documentBase64: string, keyId: string) {
    await this.installApiKeys();

    const response = await this.request<{ pkcs7_64: string }>({
      plugin: 'pkcs7',
      name: 'create_pkcs7',
      arguments: [documentBase64, keyId, 'yes'],
    });

    if (!response.pkcs7_64) {
      throw new Error('E-IMZO did not return a signed document.');
    }

    return response.pkcs7_64;
  }
}

export const eImzoClient = new EImzoClient();

export const getCertificateTitle = (certificate: EImzoCertificate) => {
  const owner = certificate.CN || certificate.O || certificate.subjectName || certificate.alias;
  const tin = certificate.TIN ? `TIN ${certificate.TIN}` : null;
  const serial = certificate.serialNumber ? `serial ${certificate.serialNumber}` : null;

  return [owner, tin, serial].filter(Boolean).join(' | ');
};
