import { Tag, type TableProps } from "antd";
import type { SystemEmployeeTableDataType } from "./types";
import CustomButton from "shared/ui/button";
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
    render: (user: UserPreview) => <UserPreviewCard user={user} />,
  },
  {
    title: t("systemEmployees.fields.roles"),
    dataIndex: "roles",
    key: "roles",
    className: "no-ellipsis",
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
    width: 120,
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
        <div className="system-employees-table-actions">
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
              {t("systemEmployees.actions.editRoles")}
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
              {t("systemEmployees.actions.revoke")}
            </CustomButton>
          )}
        </div>
      );
    },
  },
];
