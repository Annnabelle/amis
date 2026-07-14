import { Tag, type TableProps } from "antd";
import type { TFunction } from "i18next";
import { CompanyMembershipState, type CompanyRole } from "entities/companyMemberships/types";
import type { CompanyMembershipTableDataType } from "./types";
import type { UserPreview } from "entities/users/types";
import UserPreviewCard from "entities/users/ui/userPreviewCard";
import CustomButton from "shared/ui/button";
import { statusColors } from "shared/ui/statuses";

export const CompanyMembershipsTableColumns = (
  t: TFunction,
  handleAction: (
    action: "read" | "edit" | "delete",
    record: CompanyMembershipTableDataType
  ) => void,
  permissions: { canRead: boolean; canUpdate: boolean; canDelete: boolean },
  roleLabels: Record<string, string> = {},
  assignableRoleAliases: ReadonlySet<string> = new Set<string>(),
  currentUserId?: string
): TableProps<CompanyMembershipTableDataType>["columns"] => [
  {
    title: t("common.user"),
    dataIndex: "user",
    key: "user",
    className: "no-ellipsis",
    render: (user: UserPreview) => <UserPreviewCard user={user} />,
  },
  {
    title: t("companyMemberships.fields.roles"),
    dataIndex: "roles",
    key: "roles",
    className: "no-ellipsis",
    render: (roles: CompanyRole[]) => (
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
        {roles.map((role) => (
          <Tag key={role} style={{ width: "auto" }}>
            {roleLabels[role] ?? role}
          </Tag>
        ))}
      </div>
    ),
  },
  {
    title: t("companyMemberships.fields.state"),
    dataIndex: "state",
    key: "state",
    className: "no-ellipsis",
    width: 120,
    render: (state: CompanyMembershipState) => (
      <Tag color={statusColors[state] ?? "default"}>
        {t(`companyMemberships.states.${state}`)}
      </Tag>
    ),
  },
  {
    title: t("companyMemberships.fields.createdAt"),
    dataIndex: "createdAt",
    key: "createdAt",
    width: 110,
    render: (text) => <p className="table-text">{text}</p>,
  },
  {
    title: "",
    key: "action",
    className: "no-ellipsis",
    width: 320,
    render: (_, record) => {
      const isTerminalState =
        record.state === CompanyMembershipState.Declined ||
        record.state === CompanyMembershipState.Disabled;
      const hasOnlyAssignableRoles = record.roles.every((role) =>
        assignableRoleAliases.has(role)
      );
      const isCurrentUser = record.userId === currentUserId;
      const canEdit =
        permissions.canUpdate &&
        !isTerminalState &&
        hasOnlyAssignableRoles;
      const canRevoke =
        permissions.canDelete &&
        !isTerminalState &&
        !isCurrentUser &&
        hasOnlyAssignableRoles;

      if (!permissions.canRead && !canEdit && !canRevoke) {
        return null;
      }

      return (
        <div className="company-memberships-table-actions">
          {permissions.canRead && (
            <CustomButton
              type="button"
              className="outline"
              onClick={(event) => {
                event.stopPropagation();
                handleAction("read", record);
              }}
            >
              {t("common.details")}
            </CustomButton>
          )}
          {canEdit && (
            <CustomButton
              type="button"
              className="outline"
              onClick={(event) => {
                event.stopPropagation();
                handleAction("edit", record);
              }}
            >
              {t("companyMemberships.actions.editRoles")}
            </CustomButton>
          )}
          {canRevoke && (
            <CustomButton
              type="button"
              className="danger"
              onClick={(event) => {
                event.stopPropagation();
                handleAction("delete", record);
              }}
            >
              {t("companyMemberships.actions.revoke")}
            </CustomButton>
          )}
        </div>
      );
    },
  },
];
