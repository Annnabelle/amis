import { Tag, type TableProps } from "antd";
import type { SystemEmployeeTableDataType } from "./types";
import { ActionDropdownButton } from "shared/ui/table/cells";
import { statusColors } from "shared/ui/statuses";
import type { TFunction } from "i18next";
import UserPreviewCard from "entities/users/ui/userPreviewCard";
import type { UserPreview } from "entities/users/types";
import { UserSystemAccessState, type SystemRole } from "entities/systemEmployees/types";

export const SystemEmployeesTableColumns = (
  t: TFunction,
  handleAction: (
    action: "read" | "edit" | "delete",
    record: SystemEmployeeTableDataType
  ) => void,
  permissions: { canRead: boolean; canUpdate: boolean; canDelete: boolean },
  roleLabels: Record<string, string> = {},
  assignableRoleAliases: ReadonlySet<string> = new Set<string>(),
  currentUserId?: string
): TableProps<SystemEmployeeTableDataType>["columns"] => [
  {
    title: t("common.user"),
    dataIndex: "user",
    key: "user",
    className: "no-ellipsis",
    width: "30%",
    render: (user: UserPreview) => <UserPreviewCard user={user} />,
  },
  {
    title: t("systemEmployees.fields.roles"),
    dataIndex: "roles",
    key: "roles",
    className: "no-ellipsis",
    width: "30%",
    render: (roles: SystemRole[]) => (
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
    title: t("systemEmployees.fields.state"),
    dataIndex: "state",
    key: "state",
    className: "no-ellipsis",
    width: "18%",
    render: (state: UserSystemAccessState) => (
      <Tag color={statusColors[state] ?? "default"}>
        {t(`systemEmployees.states.${state}`)}
      </Tag>
    ),
  },
  {
    title: t("systemEmployees.fields.createdAt"),
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
        record.state === UserSystemAccessState.Declined ||
        record.state === UserSystemAccessState.Disabled;
      const hasOnlyAssignableRoles = record.roles.every((role) =>
        assignableRoleAliases.has(role)
      );
      const isCurrentUser = record.user.id === currentUserId;
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
              label: t("systemEmployees.actions.editRoles"),
              variant: "outline",
              onClick: () => handleAction("edit", record),
            },
            canRevoke && {
              key: "delete",
              label: t("systemEmployees.actions.revoke"),
              variant: "danger",
              onClick: () => handleAction("delete", record),
            },
          ]}
        />
      );
    },
  },
];
