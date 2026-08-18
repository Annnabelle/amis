import { Tag, type TableProps } from "antd";
import type { TFunction } from "i18next";
import { CompanyMembershipState, type CompanyRole } from "entities/companyMemberships/types";
import type { CompanyMembershipTableDataType } from "./types";
import type { UserPreview } from "entities/users/types";
import UserPreviewCard from "entities/users/ui/userPreviewCard";
import { ActionDropdownButton } from "shared/ui/table/cells";
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
    width: "30%",
    render: (user: UserPreview) => <UserPreviewCard user={user} />,
  },
  {
    title: t("companyMemberships.fields.roles"),
    dataIndex: "roles",
    key: "roles",
    className: "no-ellipsis",
    width: "30%",
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
    width: "18%",
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
    width: "14%",
    render: (text) => <p className="table-text">{text}</p>,
  },
  {
    title: "",
    key: "action",
    className: "no-ellipsis",
    width: 72,
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
        <ActionDropdownButton
          actions={[
            permissions.canRead && {
              key: "read",
              label: t("common.details"),
              variant: "outline",
              onClick: () => handleAction("read", record),
            },
            canEdit && {
              key: "edit",
              label: t("companyMemberships.actions.editRoles"),
              variant: "outline",
              onClick: () => handleAction("edit", record),
            },
            canRevoke && {
              key: "delete",
              label: t("companyMemberships.actions.revoke"),
              variant: "danger",
              onClick: () => handleAction("delete", record),
            },
          ]}
        />
      );
    },
  },
];
