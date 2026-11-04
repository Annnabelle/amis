import type { TFunction } from "i18next";
import type { AdaptiveColumn } from "shared/ui/table/types";
import StatusBadge from "shared/ui/statusBadge";
import type { StatusBadgeVariant } from "shared/ui/statusBadge";
import type { CodeExternalStatus } from "entities/ownedCodes/types";
import type { OwnedCodesTableDataType } from "./types";

/** Шкала та же, что у статусов остальных сущностей: см. statusCatalog. */
const statusVariants: Record<string, StatusBadgeVariant> = {
  RECEIVED: "info",
  APPLIED: "cyan",
  INTRODUCED: "success",
  WITHDRAWN: "neutral",
  WRITTEN_OFF: "danger",
};

export const OwnedCodesTableColumns = (
  t: TFunction
): AdaptiveColumn<OwnedCodesTableDataType>[] => [
  {
    title: t("ownedCodes.tableTitles.code"),
    dataIndex: "code",
    key: "code",
    // Код длиннее всех остальных колонок вместе: ему нужен свой минимум,
    // иначе равная доля сжимает его до многоточия на второй же букве.
    flex: 2,
    minWidth: 260,
    // Код длинный и его читают глазами по частям: моноширинный и целиком.
    render: (text) => <p className="table-text table-text-mono">{text}</p>,
  },
  {
    title: t("ownedCodes.tableTitles.gtin"),
    dataIndex: "gtin",
    key: "gtin",
    minWidth: 150,
    render: (text) => <p className="table-text">{text}</p>,
  },
  {
    title: t("ownedCodes.tableTitles.packageType"),
    dataIndex: "packageType",
    key: "packageType",
    minWidth: 130,
    render: (text) => (
      <p className="table-text">{t(`markingCodes.packageType.${text}`)}</p>
    ),
  },
  {
    title: t("ownedCodes.tableTitles.status"),
    dataIndex: "status",
    key: "status",
    minWidth: 160,
    render: (status: CodeExternalStatus | undefined) =>
      status ? (
        <StatusBadge variant={statusVariants[status] ?? "default"}>
          {t(`ownedCodes.statuses.${status}`)}
        </StatusBadge>
      ) : (
        <p className="table-text">—</p>
      ),
  },
  {
    title: t("ownedCodes.tableTitles.parentCode"),
    dataIndex: "parentCode",
    key: "parentCode",
    minWidth: 200,
    render: (text) => <p className="table-text table-text-mono">{text}</p>,
  },
  {
    title: t("ownedCodes.tableTitles.lastSyncedAt"),
    dataIndex: "lastSyncedAt",
    key: "lastSyncedAt",
    minWidth: 160,
    render: (text) => <p className="table-text">{text}</p>,
  },
];
