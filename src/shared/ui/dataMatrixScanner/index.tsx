import { useEffect, useRef, useState } from "react";
import { BrowserMultiFormatReader } from "@zxing/browser";
import { BarcodeFormat, DecodeHintType, NotFoundException } from "@zxing/library";
import CustomButton from "shared/ui/button";
import "./styles.sass";

interface DataMatrixScannerProps {
  open: boolean;
  onClose: () => void;
  onResult: (text: string) => void;
}

const DataMatrixScanner = ({ open, onClose, onResult }: DataMatrixScannerProps) => {
  const [scanError, setScanError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const controlsRef = useRef<{ stop: () => void } | null>(null);

  useEffect(() => {
    if (!open) {
      controlsRef.current?.stop();
      controlsRef.current = null;
      setScanError(null);
      return;
    }

    const hints = new Map();
    hints.set(DecodeHintType.POSSIBLE_FORMATS, [BarcodeFormat.DATA_MATRIX]);
    const reader = new BrowserMultiFormatReader(hints, {
      delayBetweenScanAttempts: 200,
      delayBetweenScanSuccess: 800,
    });
    const videoElement = videoRef.current;

    if (!videoElement) {
      setScanError("Не удалось открыть камеру");
      return;
    }

    reader
      .decodeFromConstraints(
        {
          audio: false,
          video: {
            facingMode: { ideal: "environment" },
            width: { ideal: 1280 },
            height: { ideal: 720 },
          },
        },
        videoElement,
        (result, error, controls) => {
          if (controls && !controlsRef.current) controlsRef.current = controls;
          if (result) {
            onResult(result.getText());
            onClose();
            controls?.stop();
            return;
          }
          if (error && !(error instanceof NotFoundException)) {
            setScanError("Ошибка сканера. Проверьте доступ к камере.");
          }
        }
      )
      .then((controls) => {
        if (!controlsRef.current) controlsRef.current = controls;
      })
      .catch(() => {
        setScanError("Не удалось получить доступ к камере.");
      });

    return () => {
      controlsRef.current?.stop();
      controlsRef.current = null;
    };
  }, [open, onClose, onResult]);

  if (!open) return null;

  return (
    <div className="scanner-overlay" role="dialog" aria-modal="true">
      <div className="scanner-card">
        <div className="scanner-header">
          <div className="scanner-title">Сканер DataMatrix</div>
          <CustomButton type="button" className="btn-scan-close" onClick={onClose}>
            Закрыть
          </CustomButton>
        </div>
        <div className="scanner-video">
          <video ref={videoRef} className="scanner-video-el" muted playsInline />
          <div className="scanner-hint">Наведите камеру на код</div>
        </div>
        {scanError && <div className="scanner-error">{scanError}</div>}
      </div>
    </div>
  );
};

export default DataMatrixScanner;
