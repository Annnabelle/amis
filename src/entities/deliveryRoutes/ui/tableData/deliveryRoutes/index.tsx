import type { TableProps } from "antd";
import type { TFunction } from "i18next";
import type { DeliveryRoutesTableDataType } from "./types";

export const DeliveryRoutesTableColumns = (
  t: TFunction
): TableProps<DeliveryRoutesTableDataType>["columns"] => [
  {
    title: t("deliveryRoutes.fields.routeNumber"),
    dataIndex: "routeNumber",
    key: "routeNumber",
    render: (text) => <p className="table-text">{text}</p>,
  },
  {
    title: t("deliveryRoutes.fields.plateNumber"),
    dataIndex: "plateNumber",
    key: "plateNumber",
    render: (text) => <p className="table-text">{text || "-"}</p>,
  },
  {
    title: t("deliveryRoutes.fields.routeDate"),
    dataIndex: "routeDate",
    key: "routeDate",
    render: (text) => <p className="table-text">{text}</p>,
  },
  {
    title: t("deliveryRoutes.fields.status"),
    dataIndex: "status",
    key: "status",
    width: 160,
    render: (status) => (
      <span className={`status-badge ${status}`}>
        {t(`deliveryRoutes.status.${status}`)}
      </span>
    ),
  },
];
