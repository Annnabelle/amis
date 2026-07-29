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
const E_IMZO_LAUNCH_URL = 'eimzo://';
const REQUEST_TIMEOUT_MS = 30_000;

const apiKeys = [
  'localhost',
  '96D0C1491615C82B9A54D9989779DF825B690748224C2B04F500F370D51827CE2644D8D4A82C18184D73AB8530BB8ED537269603F61DB0D03D2104ABF789970B',
  '127.0.0.1',
  'A7BCFA5D490B351BE0754130DF03A068F855DB4333D43921125B9CF2670EF6A40370C646B90401955E1F7BC9CDBF59CE0B2C5467D820BE189C845D0B79CFC96F',
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
  private apiKeysInstalled = false;

  private request<T = unknown>(payload: EImzoRequest): Promise<EImzoResponse<T>> {
    return new Promise((resolve, reject) => {
      const socket = new WebSocket(getSocketUrl());
      let settled = false;

      const finish = (callback: () => void) => {
        if (settled) return;
        settled = true;
        window.clearTimeout(timeoutId);

        if (
          socket.readyState === WebSocket.OPEN ||
          socket.readyState === WebSocket.CONNECTING
        ) {
          socket.close();
        }

        callback();
      };

      const timeoutId = window.setTimeout(() => {
        finish(() => reject(new Error('E-IMZO is not responding. Try again.')));
      }, REQUEST_TIMEOUT_MS);

      socket.onopen = () => {
        socket.send(JSON.stringify(payload));
      };

      socket.onerror = () => {
        finish(() => reject(new Error('E-IMZO is unavailable. Start e-imzo.exe and try again.')));
      };

      socket.onclose = (event) => {
        if (!settled && event.code !== 1000) {
          finish(() => reject(new Error('E-IMZO connection was closed. Start e-imzo.exe and try again.')));
        }
      };

      socket.onmessage = (event: MessageEvent<string>) => {
        let response: EImzoResponse<T> & { id?: string };

        try {
          response = JSON.parse(event.data);
        } catch {
          return;
        }

        if (response.success === false) {
          finish(() => reject(new Error(normalizeReason(response.reason))));
          return;
        }

        finish(() => resolve(response));
      };
    });
  }

  async installApiKeys() {
    if (this.apiKeysInstalled) return;

    await this.request({
      name: 'apikey',
      arguments: apiKeys,
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

  async createPkcs7(
    documentBase64: string,
    keyId: string,
    options: { detached?: boolean } = {}
  ) {
    await this.installApiKeys();

    const response = await this.request<{ pkcs7_64: string }>({
      plugin: 'pkcs7',
      name: 'create_pkcs7',
      arguments: [documentBase64, keyId, options.detached ? 'yes' : 'no'],
    });

    if (!response.pkcs7_64) {
      throw new Error('E-IMZO did not return a signed document.');
    }

    return response.pkcs7_64;
  }

  openApplication() {
    window.location.href = E_IMZO_LAUNCH_URL;
  }

  async createDetachedPkcs7(documentBase64: string, keyId: string) {
    return this.createPkcs7(documentBase64, keyId, { detached: true });
  }
}

export const eImzoClient = new EImzoClient();

export const getCertificateTitle = (certificate: EImzoCertificate) => {
  const owner = certificate.name || certificate.CN || certificate.O || certificate.subjectName || certificate.alias;
  const tin = certificate.TIN ? `TIN ${certificate.TIN}` : null;
  const serial = certificate.serialNumber ? `serial ${certificate.serialNumber}` : null;

  return [owner, tin, serial].filter(Boolean).join(' | ');
};
