import { useCallback, useMemo, useState } from 'react';
import { Button, Input, Tag } from 'antd';
import { useTranslation } from 'react-i18next';
import './styles.sass';

type ScanStatus = 'accepted' | 'rejected';

export interface ScanResult {
  status: ScanStatus;
  reason?: string;
}

export interface ScanItem {
  code: string;
  status: ScanStatus;
  reason?: string;
  ts: string;
}

interface DataMatrixScannerProps {
  title: string;
  subtitle?: string;
  helperText?: string;
  onScan?: (code: string) => ScanResult | Promise<ScanResult>;
  lastScans?: ScanItem[];
  acceptedCount?: number;
  rejectedCount?: number;
  inputPlaceholder?: string;
  primaryActionLabel?: string;
  onPrimaryAction?: () => void;
}

const DataMatrixScanner: React.FC<DataMatrixScannerProps> = ({
  title,
  subtitle,
  helperText,
  onScan,
  lastScans,
  acceptedCount,
  rejectedCount,
  inputPlaceholder,
  primaryActionLabel,
  onPrimaryAction,
}) => {
  const { t } = useTranslation();
  const [value, setValue] = useState('');
  const [localScans, setLocalScans] = useState<ScanItem[]>([]);

  const scans = lastScans ?? localScans;
  const resolvedPlaceholder = inputPlaceholder ?? t('scanner.placeholder');

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

  const handleSubmit = useCallback(async () => {
    const code = value.trim();
    if (!code) return;

    if (onScan) {
      const result = await onScan(code);
      pushScan(code, result);
    } else {
      pushScan(code, { status: 'accepted' });
    }

    setValue('');
  }, [onScan, pushScan, value]);

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

      <div className="dm-scanner-input">
        <Input
          autoFocus
          size="large"
          value={value}
          placeholder={resolvedPlaceholder}
          onChange={(event) => setValue(event.target.value)}
          onPressEnter={handleSubmit}
        />
        <Button type="primary" size="large" onClick={handleSubmit}>
          {t('scanner.scan')}
        </Button>
        {primaryActionLabel && onPrimaryAction && (
          <Button size="large" onClick={onPrimaryAction}>
            {primaryActionLabel}
          </Button>
        )}
      </div>

      <div className="dm-scanner-list">
        <p className="dm-scanner-list-title">{t('scanner.latestScans')}</p>
        {scans.length === 0 && (
          <div className="dm-scanner-empty">{t('scanner.empty')}</div>
        )}
        {scans.map((item) => (
          <div key={`${item.code}-${item.ts}`} className={`dm-scanner-item ${item.status}`}>
            <div className="dm-scanner-item-code">{item.code}</div>
            <div className="dm-scanner-item-meta">
              <Tag color={item.status === 'accepted' ? 'green' : 'red'}>
                {item.status === 'accepted' ? t('scanner.accepted') : t('scanner.rejected')}
              </Tag>
              {item.reason && <span className="dm-scanner-item-reason">{item.reason}</span>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DataMatrixScanner;
