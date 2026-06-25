import { Tag } from "antd";
import { Link } from "react-router-dom";
import type { TFunction } from "i18next";
import { getInvoiceStatusKey } from "entities/invoices/lib/status";
import { statusColors } from "shared/ui/statuses.tsx";
import type { AdaptiveColumn } from "shared/ui/table/types.ts";
import type { InvoicesTableDataType } from "./types";

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
  const key = prefix.includes("external") ? status : getInvoiceStatusKey(status);
  return t(`${prefix}.${key}`, { defaultValue: status });
};

const renderStatus = (t: TFunction, status: string, prefix: string) => {
  if (!status || status === "-") return renderText("-");

  const colorKey = prefix.includes("external") ? status : getInvoiceStatusKey(status);
  const label = getStatusLabel(t, status, prefix);

  return (
    <Tag
      className="invoice-status-tag"
      color={statusColors[colorKey] ?? statusColors[status] ?? "blue"}
      title={label}
    >
      <span className="invoice-status-tag-label">{label}</span>
    </Tag>
  );
};

export const InvoicesTableColumns = (
  t: TFunction,
  orgId?: string
): AdaptiveColumn<InvoicesTableDataType>[] => [
  {
    title: t("invoices.table.invoiceNumber"),
    dataIndex: "invoiceNumber",
    key: "invoiceNumber",
    flex: 1.8,
    render: (_, record) => (
      <Link
        className="table-text link"
        title={record.invoiceNumber}
        to={
          orgId
            ? `/organization/${orgId}/invoices/${record.key}`
            : '/organization'
        }
      >
        {shortenMiddle(record.invoiceNumber)}
      </Link>
    ),
  },
  {
    title: t("invoices.table.invoiceDate"),
    dataIndex: "invoiceDate",
    key: "invoiceDate",
    flex: 1.4,
    render: renderText,
  },
  {
    title: t("invoices.table.receiver"),
    dataIndex: "receiverName",
    key: "receiverName",
    flex: 2.6,
    render: (text: string) => (
      <p className="table-text" title={text} style={{ overflow: "hidden", textOverflow: "ellipsis" }}>
        {text}
      </p>
    ),
  },
  {
    title: t("invoices.table.sender"),
    dataIndex: "senderName",
    key: "senderName",
    flex: 2.4,
    render: (text: string) => (
      <p className="table-text" title={text} style={{ overflow: "hidden", textOverflow: "ellipsis" }}>
        {text}
      </p>
    ),
  },
  {
    title: t("invoices.table.amountWithoutVat"),
    dataIndex: "amountWithoutVat",
    key: "amountWithoutVat",
    flex: 1.6,
    align: "center",
    render: (text: string | number) => (
      <p className="table-text" title={String(text)} style={{ overflow: "hidden", textOverflow: "ellipsis" }}>
        {text}
      </p>
    ),
  },
  {
    title: t("invoices.table.itemsQuantity"),
    dataIndex: "itemsQuantity",
    key: "itemsQuantity",
    flex: 1.2,
    align: "center",
    render: (text: string | number) => (
      <p className="table-text" style={{ textAlign: "center", width: "100%" }}>
        {text}
      </p>
    ),
  },
  {
    title: t("invoices.table.unitsQuantity"),
    dataIndex: "unitsQuantity",
    key: "unitsQuantity",
    flex: 1.2,
    align: "center",
    render: (text: string | number) => (
      <p className="table-text" style={{ textAlign: "center", width: "100%" }}>
        {text}
      </p>
    ),
  },
  {
    title: (
      <span
        style={{
          display: "block",
          width: "100%",
          minWidth: 0,
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        }}
      >
        {t("invoices.table.externalStatus")}
      </span>
    ),
    dataIndex: "externalStatus",
    key: "externalStatus",
    flex: 1.7,
    className: "no-ellipsis",
    render: (status: string) => renderStatus(t, status, "invoices.externalStatuses"),
  },
  {
    title: t("invoices.table.status"),
    dataIndex: "status",
    key: "status",
    flex: 1.5,
    className: "no-ellipsis",
    render: (status: string) => renderStatus(t, status, "invoices.statuses"),
  },
  {
    title: t("invoices.table.createdAt"),
    dataIndex: "createdAt",
    key: "createdAt",
    flex: 1.4,
    render: renderText,
  },
];
