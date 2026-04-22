import { Tag } from "antd";
import { Link } from "react-router-dom";
import type { TFunction } from "i18next";
import { statusColors } from "shared/ui/statuses.tsx";
import type { AdaptiveColumn } from "shared/ui/table/types.ts";
import type { SalesOrdersTableDataType } from "./types";

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
      <Link
        className="table-text link"
        to={
          orgId
            ? `/organization/${orgId}/sales-orders/${record.key}`
            : `/sales-orders/${record.key}`
        }
      >
        {record.orderNumber}
      </Link>
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
    render: (_: string, record) => (
      <Tag color={getPriorityColor(record.priorityKey)} style={{ margin: 0 }}>
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
  // {
  //   title: "",
  //   key: "action",
  //   flex: 1,
  //   render: (_, record) => (
  //     <Dropdown
  //       overlay={
  //         <Menu
  //           items={[
  //             {
  //               key: "delete",
  //               label: (
  //                 <CustomButton
  //                   type="button"
  //                   className="danger"
  //                   onClick={(e) => {
  //                     e.stopPropagation();
  //                     onDelete?.(record);
  //                   }}
  //                 >
  //                   {t("btn.delete")}
  //                 </CustomButton>
  //               ),
  //             },
  //           ]}
  //         />
  //       }
  //       trigger={["click"]}
  //       placement="bottomRight"
  //     >
  //       <Button
  //         onClick={(e) => e.stopPropagation()}
  //         type="text"
  //         icon={<HiDotsHorizontal />}
  //         style={{ width: "100%", display: "flex", justifyContent: "center" }}
  //       />
  //     </Dropdown>
  //   ),
  // },
];
