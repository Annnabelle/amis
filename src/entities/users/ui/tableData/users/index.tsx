import {type TableProps, Tag} from 'antd';
import type { UserTableDataType } from './types';
import { ActionDropdownButton, TextCell } from 'shared/ui/table/cells';
import type { TFunction } from 'i18next';
import {statusColors} from "shared/ui/statuses.tsx";
export const UsersTableColumns = (
  t: TFunction,
  handleRowClick: (type: "User", action: "retrieve" | "edit" | "delete", record: UserTableDataType) => void,
  permissions: { canUpdate: boolean; canDelete: boolean }
): TableProps<UserTableDataType>["columns"] => [
  {
    title: t('users.addUserForm.label.email'),
    dataIndex: "email",
    key: "email",
    render: (text) => <TextCell value={text} maxWidth={100} />
  },
  {
    title: t('users.addUserForm.label.firstName'),
    dataIndex: "firstName",
    key: "firstName",
    render: (text) => <TextCell value={text} />
  },
  {
    title: t('users.addUserForm.label.lastName'),
    dataIndex: "lastName",
    key: "lastName",
    render: (text) => <TextCell value={text} />,
  },
  {
    title: t('users.addUserForm.label.role'),
    dataIndex: "role",
    key: "role",
    render: (text) => <TextCell value={text} />
  },
  {
    title: t('users.addUserForm.label.lastLoggedInAt'),
    dataIndex: "lastLoggedInAt",
    key: "lastLoggedInAt",
    render: (text) => <TextCell value={text} />,
  },
  {
    title: t('organizations.status'),
    dataIndex: "status",
      className: "no-ellipsis",
    key: "status",
  render: (status: string) => (
      status ? (
          <Tag color={statusColors[status]}
               style={{
                   maxWidth: 150,
                   overflow: "hidden",
                   whiteSpace: "nowrap",
                   textOverflow: "ellipsis",
               }}
          >
              {t(`statuses.${status}`)}
          </Tag>
      ) : null
  ),
  },
  {
    title: '',
    key: "action",
    render: (_, record) => (
      <ActionDropdownButton
        actions={[
          permissions.canUpdate && {
            key: "edit",
            label: t('btn.edit'),
            variant: "outline",
            onClick: () => handleRowClick("User", "edit", record),
          },
          permissions.canDelete && {
            key: "delete",
            label: t('btn.delete'),
            variant: "danger",
            onClick: () => handleRowClick("User", "delete", record),
          },
        ]}
      />
    ),
  },
];





