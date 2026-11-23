import { DeleteOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";

import type { ScanAttempt } from "entities/scanSessions/types";

export type ScanGroup = {
  productId: string;
  productName: string;
  scans: ScanAttempt[];
};

type ScanListProps = {
  groups: ScanGroup[];
  rejected: ScanAttempt[];
  /** Удаление скана доступно не везде и не всем. */
  onDelete?: (code: string) => void;
  deleteLabel?: string;
  errorsTitle: string;
};

/** Журнал сканирования: принятые коды по товарам и отдельно отклонённые. */
const ScanList = ({ groups, rejected, onDelete, deleteLabel, errorsTitle }: ScanListProps) => {
  const { t } = useTranslation();

  return (
    <div className="loading-scans-groups">
      {groups.length === 0 && rejected.length === 0 && (
        <div className="dm-scanner-empty">{t("scanner.empty")}</div>
      )}

      {groups.map((group) => (
        <section key={group.productId} className="loading-scan-group">
          <div className="loading-scan-group-title">
            <span>{group.productName}</span>
            <span className="loading-scan-group-count">{group.scans.length}</span>
          </div>
          <div className="loading-scan-group-items">
            {group.scans.map((scan) => (
              <div key={`${scan.code}-${scan.ts}`} className="loading-scan-item accepted">
                <div className="loading-scan-item-code">{scan.code}</div>
                {onDelete && (
                  <button
                    type="button"
                    className="loading-scan-item-delete"
                    aria-label={deleteLabel}
                    title={deleteLabel}
                    onClick={() => onDelete(scan.code)}
                  >
                    <DeleteOutlined />
                  </button>
                )}
              </div>
            ))}
          </div>
        </section>
      ))}

      {rejected.length > 0 && (
        <section className="loading-scan-group loading-scan-group-errors">
          <div className="loading-scan-group-title">
            <span>{errorsTitle}</span>
            <span className="loading-scan-group-count">{rejected.length}</span>
          </div>
          <div className="loading-scan-group-items">
            {rejected.map((scan) => (
              <div key={`${scan.code}-${scan.ts}`} className="loading-scan-item rejected">
                <div className="loading-scan-item-code">{scan.code}</div>
                <div className="loading-scan-item-reason">{scan.reason}</div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default ScanList;
