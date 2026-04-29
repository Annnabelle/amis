import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Alert, Button, Tag } from 'antd';
import { CameraOutlined, LoadingOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { ZxingVideoScanner, useIsMobile } from 'shared/lib';
import { CAMERA_DUPLICATE_COOLDOWN, SCAN_PROCESSING_DELAY } from './constants';
import type { DataMatrixScannerProps, ScanItem, ScanResult, ScannerStage } from './types';
import { normalizeScannedCode, wait } from './utils';
import './styles.sass';

export type { DataMatrixScannerProps, ScanItem, ScanResult };

const DataMatrixScanner: React.FC<DataMatrixScannerProps> = ({
  title,
  subtitle,
  helperText,
  onScan,
  lastScans,
  acceptedCount,
  rejectedCount,
  primaryActionLabel,
  onPrimaryAction,
  enableCamera = false,
  scanDisabled = false,
  scanInProgress = false,
  cameraAutoStart = false,
  lastScansContent,
  onCameraClose,
}) => {
  const { t } = useTranslation();
  const isMobile = useIsMobile();
  const [localScans, setLocalScans] = useState<ScanItem[]>([]);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [cameraSupported] = useState(() => ZxingVideoScanner.isSupported());
  const [cameraStarting, setCameraStarting] = useState(false);
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraAutoStartPending, setCameraAutoStartPending] = useState(cameraAutoStart);
  const [mobileCameraVisible, setMobileCameraVisible] = useState(false);
  const [scannerStage, setScannerStage] = useState<ScannerStage>('idle');
  const [detectedCode, setDetectedCode] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const scannerRef = useRef<ZxingVideoScanner | null>(null);
  const lastDetectedRef = useRef<{ code: string; ts: number } | null>(null);
  const processingRef = useRef(false);

  const scans = lastScans ?? localScans;

  const counts = useMemo(() => {
    if (typeof acceptedCount === 'number' && typeof rejectedCount === 'number') {
      return { accepted: acceptedCount, rejected: rejectedCount };
    }

    return scans.reduce(
      (acc, item) => {
        if (item.status === 'accepted') acc.accepted += 1;
        if (item.status === 'rejected') acc.rejected += 1;
        return acc;
      },
      { accepted: 0, rejected: 0 }
    );
  }, [acceptedCount, rejectedCount, scans]);

  const pushScan = useCallback((code: string, result: ScanResult) => {
    const next: ScanItem = {
      code,
      status: result.status,
      reason: result.reason,
      ts: new Date().toISOString(),
    };

    setLocalScans((prev) => [next, ...prev].slice(0, 20));
  }, []);

  const scannerStatus = useMemo(() => {
    if (scannerStage === 'error') {
      return {
        tone: 'error',
        text: cameraError ?? t('scanner.status.error'),
      };
    }

    if (scannerStage === 'processing' || scanInProgress) {
      return {
        tone: 'processing',
        text: t('scanner.status.processing'),
      };
    }

    if (scannerStage === 'code_detected' && detectedCode) {
      return {
        tone: 'detected',
        text: t('scanner.status.detected', { code: detectedCode }),
      };
    }

    if (scannerStage === 'camera_active' && cameraActive) {
      return {
        tone: 'active',
        text: t('scanner.status.cameraActive'),
      };
    }

    if (scannerStage === 'starting' || cameraStarting) {
      return {
        tone: 'processing',
        text: t('scanner.status.starting'),
      };
    }

    return {
      tone: 'idle',
      text: t('scanner.status.idle'),
    };
  }, [cameraActive, cameraError, cameraStarting, detectedCode, scanInProgress, scannerStage, t]);

  const handleScan = useCallback(
    async (code: string) => {
      if (processingRef.current || scanDisabled || scanInProgress) return;

      processingRef.current = true;
      setScannerStage('processing');
      try {
        if (onScan) {
          const result = await onScan(code);
          pushScan(code, result);
        } else {
          pushScan(code, { status: 'accepted' });
        }
      } catch (error) {
        pushScan(code, {
          status: 'rejected',
          reason: error instanceof Error ? error.message : t('scanner.scanFailed'),
        });
      } finally {
        await wait(SCAN_PROCESSING_DELAY);
        processingRef.current = false;
        setDetectedCode(null);
        setScannerStage(cameraActive ? 'camera_active' : 'idle');
      }
    },
    [cameraActive, onScan, pushScan, scanDisabled, scanInProgress, t]
  );

  const stopCamera = useCallback(async (notifyParent = true) => {
    const scanner = scannerRef.current;
    scannerRef.current = null;

    setCameraAutoStartPending(false);
    await scanner?.stop();
    processingRef.current = false;
    setDetectedCode(null);
    setCameraActive(false);
    setMobileCameraVisible(false);
    setScannerStage('idle');

    if (notifyParent) {
      await onCameraClose?.();
    }
  }, [onCameraClose]);

  const startCamera = useCallback(async () => {
    if (!enableCamera || cameraActive || cameraStarting) return;
    if (!cameraSupported || !videoRef.current) {
      setCameraError(t('scanner.cameraUnsupported'));
      setScannerStage('error');
      return;
    }

    setCameraStarting(true);
    setCameraError(null);
    setScannerStage('starting');

    try {
      const scanner = new ZxingVideoScanner({
        videoElement: videoRef.current,
        formats: ['data_matrix'],
        onResult: async (rawCode) => {
          const code = normalizeScannedCode(rawCode);
          if (!code) return;

          const now = Date.now();
          const lastDetected = lastDetectedRef.current;
          if (
            lastDetected &&
            lastDetected.code === code &&
            now - lastDetected.ts < CAMERA_DUPLICATE_COOLDOWN
          ) {
            return;
          }

          lastDetectedRef.current = { code, ts: now };
          setDetectedCode(code);
          setScannerStage('code_detected');
          await handleScan(code);
        },
        onError: (error) => {
          if (error instanceof Error) {
            setCameraError(error.message || t('scanner.cameraError'));
            setScannerStage('error');
          }
        },
      });

      scannerRef.current = scanner;
      await scanner.start();
      setCameraActive(true);
      setCameraAutoStartPending(false);
      setScannerStage('camera_active');
    } catch {
      setCameraError(t('scanner.cameraError'));
      setScannerStage('error');
      scannerRef.current?.dispose();
      scannerRef.current = null;
      setCameraActive(false);
    } finally {
      setCameraStarting(false);
    }
  }, [cameraActive, cameraStarting, cameraSupported, enableCamera, handleScan, t]);

  useEffect(() => {
    if (enableCamera && cameraAutoStart) {
      if (isMobile) {
        setMobileCameraVisible(true);
      }
      setCameraAutoStartPending(true);
    } else {
      setCameraAutoStartPending(false);
    }
  }, [cameraAutoStart, enableCamera, isMobile]);

  useEffect(() => {
    if (enableCamera && cameraAutoStartPending && (!isMobile || mobileCameraVisible)) {
      void startCamera();
    }
  }, [cameraAutoStartPending, enableCamera, isMobile, mobileCameraVisible, startCamera]);

  useEffect(() => {
    if (!enableCamera) {
      void stopCamera(false);
      setCameraError(null);
      setDetectedCode(null);
    }
  }, [enableCamera, stopCamera]);

  const handleStartCameraClick = useCallback(() => {
    if (isMobile) {
      setMobileCameraVisible(true);
      setCameraAutoStartPending(true);
      return;
    }

    void startCamera();
  }, [isMobile, startCamera]);

  const renderCameraBlock = () => (
    <div className="dm-scanner-camera-block">
      <div className="dm-scanner-camera-actions">
        <Button
          type="primary"
          size="large"
          icon={cameraStarting ? <LoadingOutlined /> : <CameraOutlined />}
          onClick={handleStartCameraClick}
          loading={cameraStarting}
          disabled={cameraActive}
        >
          {t('scanner.startCamera')}
        </Button>
      </div>

      <div className={`dm-scanner-camera-preview ${cameraActive ? 'active' : ''}`}>
        <video ref={videoRef} muted playsInline />
        <div className="dm-scanner-camera-target" aria-hidden="true">
          <div className="dm-scanner-camera-target-frame" />
        </div>
        {!cameraActive && !(isMobile && mobileCameraVisible) && (
          <div className="dm-scanner-camera-placeholder">
            {cameraSupported ? t('scanner.cameraIdle') : t('scanner.cameraUnsupported')}
          </div>
        )}
      </div>

      {cameraError && <Alert type="error" showIcon message={cameraError} />}
    </div>
  );

  const renderSessionActions = (isMobileLayout = false, includePrimaryAction = true) => (
    <>
      {includePrimaryAction && primaryActionLabel && onPrimaryAction && (
        isMobileLayout ? (
          <button
            type="button"
            className="dm-scanner-mobile-camera-primary"
            onClick={onPrimaryAction}
          >
            {primaryActionLabel}
          </button>
        ) : (
          <Button
            type="primary"
            size="large"
            className="dm-scanner-session-primary"
            onClick={onPrimaryAction}
          >
            {primaryActionLabel}
          </Button>
        )
      )}
      <button
        type="button"
        className={isMobileLayout ? 'dm-scanner-mobile-camera-close' : 'dm-scanner-session-close'}
        onClick={() => void stopCamera()}
        disabled={!cameraActive && !cameraError}
      >
        {t('scanner.stopScanning', { defaultValue: 'Завершить сканирование' })}
      </button>
    </>
  );

  useEffect(
    () => () => {
      void scannerRef.current?.dispose();
      scannerRef.current = null;
    },
    []
  );

  return (
    <div className="dm-scanner">
      <div className="dm-scanner-header">
        <div>
          <h3 className="dm-scanner-title">{title}</h3>
          {subtitle && <p className="dm-scanner-subtitle">{subtitle}</p>}
        </div>
        <div className="dm-scanner-counters">
          <div className="dm-scanner-counter">
            <span className="dm-scanner-counter-label">{t('scanner.accepted')}</span>
            <span className="dm-scanner-counter-value accepted">{counts.accepted}</span>
          </div>
          <div className="dm-scanner-counter">
            <span className="dm-scanner-counter-label">{t('scanner.rejected')}</span>
            <span className="dm-scanner-counter-value rejected">{counts.rejected}</span>
          </div>
        </div>
      </div>

      {helperText && <p className="dm-scanner-helper">{helperText}</p>}

      {enableCamera && (
        <div className={`dm-scanner-status dm-scanner-status-${scannerStatus.tone}`}>
          <span className="dm-scanner-status-dot" />
          <span>{scannerStatus.text}</span>
        </div>
      )}

      <div className={`dm-scanner-main ${enableCamera ? 'with-camera' : 'without-camera'}`}>
        {enableCamera && !isMobile && renderCameraBlock()}

        <div className="dm-scanner-list">
          <p className="dm-scanner-list-title">{t('scanner.latestScans')}</p>
          {lastScansContent ?? (
            <>
              {scans.length === 0 && <div className="dm-scanner-empty">{t('scanner.empty')}</div>}
              {scans.map((item) => (
                <div key={`${item.code}-${item.ts}`} className={`dm-scanner-item ${item.status}`}>
                  <div className="dm-scanner-item-top">
                    <Tag color={item.status === 'accepted' ? 'green' : 'red'}>
                      {item.status === 'accepted' ? t('scanner.accepted') : t('scanner.rejected')}
                    </Tag>
                  </div>
                  <div className="dm-scanner-item-code" title={item.code}>
                    {item.code}
                  </div>
                  {item.reason && (
                    <div className="dm-scanner-item-reason">
                      {item.reason}
                    </div>
                  )}
                  {!item.reason && item.status === 'accepted' && (
                    <div className="dm-scanner-item-reason dm-scanner-item-reason-muted">
                      {t('scanner.accepted')}
                    </div>
                  )}
                  {!item.reason && item.status === 'rejected' && (
                    <div className="dm-scanner-item-reason dm-scanner-item-reason-muted">
                      {t('scanner.rejected')}
                    </div>
                  )}
                </div>
              ))}
            </>
          )}
        </div>
      </div>
      {enableCamera && !isMobile && (
        <div className="dm-scanner-session-actions">
          {renderSessionActions()}
        </div>
      )}
      {enableCamera && isMobile && mobileCameraVisible && (
        <div className="dm-scanner-mobile-camera">
          <div className="dm-scanner-mobile-camera-header">
            <div className="dm-scanner-mobile-camera-title">
              <span>{title}</span>
              {!cameraError && <small>{scannerStatus.text}</small>}
            </div>
          </div>
          {renderCameraBlock()}
          <div className="dm-scanner-mobile-camera-footer">
            {renderSessionActions(true, false)}
          </div>
        </div>
      )}
    </div>
  );
};

export default DataMatrixScanner;
