import { Tag } from "antd";
import type { TFunction } from "i18next";
import { PermissionLink } from "entities/access/ui";
import { getWaybillStatusKey } from "entities/waybills/lib/status";
import { endpointAccessMap } from "shared/config/endpointAccessMap";
import { statusColors } from "shared/ui/statuses";
import type { AdaptiveColumn } from "shared/ui/table/types";
import type { WaybillsTableDataType } from "./types";

const renderText = (text: string | number) => (
  <p className="table-text" title={String(text)}>
    {text}
  </p>
);

const shortenMiddle = (value: string, maxLength = 18) => {
  if (value.length <= maxLength) return value;

  const sideLength = Math.floor((maxLength - 3) / 2);
  return `${value.slice(0, sideLength)}...${value.slice(-sideLength)}`;
};

const getStatusLabel = (t: TFunction, status: string, prefix: string) => {
  if (prefix.includes("external")) {
    const externalLabel = t(`${prefix}.${status}`, { defaultValue: "" });
    if (externalLabel) return externalLabel;
  }

  const normalizedKey = getWaybillStatusKey(status);
  return t(`${prefix}.${normalizedKey}`, { defaultValue: status });
};

const renderStatus = (t: TFunction, status: string, prefix: string) => {
  if (!status || status === "-") return renderText("-");

  const colorKey = prefix.includes("external") ? status : getWaybillStatusKey(status);
  const label = getStatusLabel(t, status, prefix);

  return (
    <Tag
      className="invoice-status-tag"
      color={statusColors[colorKey] ?? statusColors[getWaybillStatusKey(status)] ?? "blue"}
      title={label}
    >
      <span className="invoice-status-tag-label">{label}</span>
    </Tag>
  );
};

export const WaybillsTableColumns = (
  t: TFunction,
  orgId?: string
): AdaptiveColumn<WaybillsTableDataType>[] => [
  {
    title: t("waybills.table.waybillNumber"),
    dataIndex: "waybillNumber",
    key: "waybillNumber",
    flex: 1.8,
    render: (_, record) => (
      <PermissionLink
        endpoint={endpointAccessMap.waybillsRead}
        className="table-text link"
        title={record.waybillNumber}
        to={orgId ? `/organization/${orgId}/waybills/${record.key}` : "/organization"}
      >
        {shortenMiddle(record.waybillNumber)}
      </PermissionLink>
    ),
  },
  {
    title: t("waybills.table.date"),
    dataIndex: "date",
    key: "date",
    flex: 1.3,
    render: renderText,
  },
  {
    title: t("waybills.table.route"),
    dataIndex: "senderName",
    key: "route",
    flex: 3,
    render: (_, record) => (
      <div className="table-route-cell" title={`${record.senderName} -> ${record.consigneeName}`}>
        <span>{record.senderName}</span>
        <span className="table-route-cell-arrow">-&gt;</span>
        <span>{record.consigneeName}</span>
      </div>
    ),
  },
  {
    title: t("waybills.table.deliveryCost"),
    dataIndex: "deliveryCost",
    key: "deliveryCost",
    flex: 1.4,
    align: "center",
    render: renderText,
  },
  {
    title: t("waybills.table.externalStatus"),
    dataIndex: "externalStatus",
    key: "externalStatus",
    flex: 1.8,
    className: "no-ellipsis",
    render: (status: string) => renderStatus(t, status, "waybills.externalStatuses"),
  },
  {
    title: t("waybills.table.status"),
    dataIndex: "status",
    key: "status",
    flex: 1.5,
    className: "no-ellipsis",
    render: (status: string) => renderStatus(t, status, "waybills.statuses"),
  },
  {
    title: t("waybills.table.createdAt"),
    dataIndex: "createdAt",
    key: "createdAt",
    flex: 1.3,
    render: renderText,
  },
];
