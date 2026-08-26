import { Tag } from "antd";
import type { TFunction } from "i18next";
import { getAvailableLeadStatusActions } from "entities/leads/lib/statusActions";
import { LeadStatus, type LeadStatus as LeadStatusType } from "entities/leads/types";
import CustomButton from "shared/ui/button";
import { FormatUzbekPhoneNumber } from "shared/lib";
import { statusColors } from "shared/ui/statuses";
import type { AdaptiveColumn } from "shared/ui/table/types";
import type { LeadTableDataType } from "./types";

type LeadStatusChangeHandler = (
  record: LeadTableDataType,
  status: LeadStatusType
) => void;

const getLeadStatusActionLabelKey = (status: LeadStatusType) => {
  if (status === LeadStatus.InProgress) {
    return "leads.actions.startProgress";
  }

  if (status === LeadStatus.Completed) {
    return "leads.actions.complete";
  }

  if (status === LeadStatus.Rejected) {
    return "leads.actions.reject";
  }

  return `leads.statuses.${status}`;
};

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
    render: (text: string) => <p className="table-text">{FormatUzbekPhoneNumber(text)}</p>,
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
    render: (status: LeadStatusType) => (
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
  {
    title: t("leads.fields.actions"),
    key: "actions",
    flex: 1.7,
    className: "no-ellipsis",
    render: (_: unknown, record) => {
      const statusActions = getAvailableLeadStatusActions(record.status);

      if (!options.canUpdateStatus || !statusActions.length) {
        return null;
      }

      return (
        <div
          className="leads-status-cell"
          onClick={(event) => event.stopPropagation()}
          onMouseDown={(event) => event.stopPropagation()}
        >
          {statusActions.map((nextStatus) => (
            <CustomButton
              key={nextStatus}
              className="leads-status-action-btn"
              size="sm"
              variant={nextStatus === LeadStatus.Rejected ? "danger" : "primary"}
              onClick={() => options.onStatusChange?.(record, nextStatus)}
            >
              {t(getLeadStatusActionLabelKey(nextStatus))}
            </CustomButton>
          ))}
        </div>
      );
    },
  },
];
