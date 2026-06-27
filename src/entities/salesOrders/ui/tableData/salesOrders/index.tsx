import { Tag } from "antd";
import type { TFunction } from "i18next";
import { statusColors } from "shared/ui/statuses.tsx";
import type { AdaptiveColumn } from "shared/ui/table/types.ts";
import type { SalesOrdersTableDataType } from "./types";
import { PermissionLink } from "entities/access/ui";
import { endpointAccessMap } from 'shared/config/endpointAccessMap';

const getPriorityColor = (priority?: string) => {
  if (!priority) return "default";

  switch (priority.toLowerCase()) {
    case "urgent":
      return "red";
    case "high":
      return "gold";
    case "normal":
      return "blue";
    case "low":
      return "green";
    default:
      return "default";
  }
};

export const SalesOrdersTableColumns = (
  t: TFunction,
  orgId?: string
): AdaptiveColumn<SalesOrdersTableDataType>[] => [
  {
    title: t("salesOrders.table.orderNumber"),
    dataIndex: "orderNumber",
    key: "orderNumber",
    flex: 1.5,
    render: (_, record) => (
      <PermissionLink
        endpoint={endpointAccessMap.salesOrdersRead}
        className="table-text link"
        to={
          orgId
            ? `/organization/${orgId}/sales-orders/${record.key}`
            : '/organization'
        }
      >
        {record.orderNumber}
      </PermissionLink>
    ),
  },
  {
    title: t("salesOrders.table.customerName"),
    dataIndex: "customerName",
    key: "customerName",
    flex: 3.2,
    render: (text: string) => (
      <p className="table-text" style={{ overflow: "hidden", textOverflow: "ellipsis" }}>
        {text}
      </p>
    ),
  },
  {
    title: t("salesOrders.table.customerTin"),
    dataIndex: "customerTin",
    key: "customerTin",
    flex: 2,
    render: (text: string) => <p className="table-text">{text}</p>,
  },
  {
    title: t("salesOrders.table.dueDate"),
    dataIndex: "dueDate",
    key: "dueDate",
    flex: 1.5,
    render: (text: string) => <p className="table-text">{text}</p>,
  },
  {
    title: t("salesOrders.table.priority"),
    dataIndex: "priority",
    key: "priority",
    flex: 1.5,
    className: "no-ellipsis",
    render: (_: string, record) => (
      <Tag
        color={getPriorityColor(record.priorityKey)}
        style={{
          margin: 0,
          display: "inline-block",
          maxWidth: "140px",
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        }}
      >
        {record.priority}
      </Tag>
    ),
  },
  {
    title: t("salesOrders.table.orderedQuantity"),
    dataIndex: "orderedQuantity",
    key: "orderedQuantity",
    flex: 1.5,
    align: "center",
    render: (text: string | number) => (
      <p className="table-text" style={{ textAlign: "center", width: "100%" }}>
        {text}
      </p>
    ),
  },
  {
    title: t("salesOrders.table.deliveredQuantity"),
    dataIndex: "deliveredQuantity",
    key: "deliveredQuantity",
    flex: 1.5,
    align: "center",
    render: (text: string | number) => (
      <p className="table-text" style={{ textAlign: "center", width: "100%" }}>
        {text}
      </p>
    ),
  },
  {
    title: t("salesOrders.table.status"),
    dataIndex: "status",
    key: "status",
    flex: 1.8,
    className: "no-ellipsis",
    render: (status: string) => {
      if (!status) return null;
      const key = status.toLowerCase();
      return (
        <Tag
          color={statusColors[key] ?? statusColors[status] ?? "blue"}
          style={{
            display: "inline-block",
            maxWidth: "140px",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {t(`salesOrders.statuses.${key}`)}
        </Tag>
      );
    },
  },
];
