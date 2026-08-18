import { Select, Tag } from "antd";
import type { TFunction } from "i18next";
import { LeadStatuses, type LeadStatus } from "entities/leads/types";
import { statusColors } from "shared/ui/statuses";
import type { AdaptiveColumn } from "shared/ui/table/types";
import type { LeadTableDataType } from "./types";

type LeadStatusChangeHandler = (
  record: LeadTableDataType,
  status: LeadStatus
) => void;

export const LeadsTableColumns = (
  t: TFunction,
  options: {
    canUpdateStatus?: boolean;
    onStatusChange?: LeadStatusChangeHandler;
  } = {}
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
    render: (status: LeadStatus, record) => {
      if (!options.canUpdateStatus) {
        return (
          <Tag color={statusColors[status] ?? "default"} style={{ margin: 0 }}>
            {t(`leads.statuses.${status}`)}
          </Tag>
        );
      }

      return (
        <div
          className="leads-status-cell"
          onClick={(event) => event.stopPropagation()}
          onMouseDown={(event) => event.stopPropagation()}
        >
          <Select
            className="leads-status-select"
            popupClassName="leads-status-select-popup"
            size="middle"
            value={status}
            popupMatchSelectWidth={false}
            options={LeadStatuses.map((leadStatus) => ({
              value: leadStatus,
              label: t(`leads.statuses.${leadStatus}`),
            }))}
            onChange={(nextStatus) => {
              if (nextStatus === status) {
                return;
              }

              options.onStatusChange?.(record, nextStatus);
            }}
          />
        </div>
      );
    },
  },
  {
    title: t("leads.fields.createdAt"),
    dataIndex: "createdAt",
    key: "createdAt",
    flex: 1.3,
    render: (text: string) => <p className="table-text">{text}</p>,
  },
];
