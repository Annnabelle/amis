export type ZxingFormat = "data_matrix" | "qr_code";

export type ZxingVideoScannerOptions = {
  videoElement: HTMLVideoElement;
  formats?: ZxingFormat[];
  onResult: (code: string) => void | Promise<void>;
  onError?: (error: unknown) => void;
};

type ZxingBrowserModule = typeof import("@zxing/browser");
type ZxingLibraryModule = typeof import("@zxing/library");

type ScannerControls = {
  stop: () => void;
};

const DEFAULT_FORMATS: ZxingFormat[] = ["data_matrix"];

const ZXING_FORMAT_MAP = {
  data_matrix: "DATA_MATRIX",
  qr_code: "QR_CODE",
} as const;

const loadZxing = async (): Promise<{
  browser: ZxingBrowserModule;
  library: ZxingLibraryModule;
}> => {
  const [browser, library] = await Promise.all([
    import("@zxing/browser"),
    import("@zxing/library"),
  ]);

  return { browser, library };
};

const selectPreferredDeviceId = async (
  BrowserCodeReader: ZxingBrowserModule["BrowserCodeReader"]
): Promise<string | undefined> => {
  const devices = await BrowserCodeReader.listVideoInputDevices();
  if (!devices.length) return undefined;

  const preferredDevice = devices.find((device) =>
    /back|rear|environment|camera 0|traseira/i.test(device.label)
  );

  return preferredDevice?.deviceId ?? devices[0].deviceId;
};

export class ZxingVideoScanner {
  private readonly videoElement: HTMLVideoElement;
  private readonly onResult: (code: string) => void | Promise<void>;
  private readonly onError?: (error: unknown) => void;
  private readonly formats: ZxingFormat[];
  private controls: ScannerControls | null = null;
  private disposed = false;

  constructor(options: ZxingVideoScannerOptions) {
    this.videoElement = options.videoElement;
    this.onResult = options.onResult;
    this.onError = options.onError;
    this.formats = options.formats ?? DEFAULT_FORMATS;
  }

  static isSupported(): boolean {
    return Boolean(navigator.mediaDevices?.getUserMedia);
  }

  async start(): Promise<void> {
    if (this.disposed) {
      throw new Error("Scanner has been disposed");
    }

    if (this.controls) return;

    const { browser, library } = await loadZxing();
    const {
      BrowserCodeReader,
      BrowserDatamatrixCodeReader,
      BrowserMultiFormatReader,
      BrowserQRCodeReader,
    } = browser;
    const { DecodeHintType, NotFoundException, BarcodeFormat } = library;

    const mappedFormats = this.formats.map(
      (format) => BarcodeFormat[ZXING_FORMAT_MAP[format]]
    );

    const hints = new Map();
    hints.set(DecodeHintType.POSSIBLE_FORMATS, mappedFormats);
    hints.set(DecodeHintType.TRY_HARDER, true);

    const reader =
      this.formats.length === 1 && this.formats[0] === "data_matrix"
        ? new BrowserDatamatrixCodeReader(hints)
        : this.formats.length === 1 && this.formats[0] === "qr_code"
          ? new BrowserQRCodeReader(hints)
          : new BrowserMultiFormatReader(hints);

    reader.possibleFormats = mappedFormats;

    const deviceId = await selectPreferredDeviceId(BrowserCodeReader);
    this.controls = await reader.decodeFromVideoDevice(
      deviceId,
      this.videoElement,
      async (result, error) => {
        if (result) {
          await this.onResult(result.getText());
          return;
        }

        if (error && !(error instanceof NotFoundException)) {
          this.onError?.(error);
        }
      }
    );
  }

  async stop(): Promise<void> {
    this.controls?.stop();
    this.controls = null;

    const stream = this.videoElement.srcObject;
    if (stream instanceof MediaStream) {
      stream.getTracks().forEach((track) => track.stop());
      this.videoElement.srcObject = null;
    }

    const { browser } = await loadZxing();
    browser.BrowserCodeReader.cleanVideoSource(this.videoElement);
  }

  async dispose(): Promise<void> {
    await this.stop();
    this.disposed = true;
  }
}
