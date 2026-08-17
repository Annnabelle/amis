import { Tag } from "antd";
import type { TFunction } from "i18next";
import { statusColors } from "shared/ui/statuses";
import type { AdaptiveColumn } from "shared/ui/table/types";
import type { LeadTableDataType } from "./types";

export const LeadsTableColumns = (
  t: TFunction
): AdaptiveColumn<LeadTableDataType>[] => [
  {
    title: t("leads.fields.name"),
    dataIndex: "name",
    key: "name",
    flex: 1.6,
    render: (text: string) => <p className="table-text">{text}</p>,
  },
  {
    title: t("leads.fields.phone"),
    dataIndex: "phone",
    key: "phone",
    flex: 1.5,
    render: (text: string) => <p className="table-text">{text}</p>,
  },
  {
    title: t("leads.fields.company"),
    dataIndex: "company",
    key: "company",
    flex: 2,
    render: (text: string) => <p className="table-text">{text}</p>,
  },
  {
    title: t("leads.fields.status"),
    dataIndex: "status",
    key: "status",
    flex: 1.4,
    className: "no-ellipsis",
    render: (status: string) => (
      <Tag color={statusColors[status] ?? "default"} style={{ margin: 0 }}>
        {t(`leads.statuses.${status}`)}
      </Tag>
    ),
  },
  {
    title: t("leads.fields.createdAt"),
    dataIndex: "createdAt",
    key: "createdAt",
    flex: 1.3,
    render: (text: string) => <p className="table-text">{text}</p>,
  },
];
