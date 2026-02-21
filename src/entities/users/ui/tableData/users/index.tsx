import {type TableProps, Dropdown, Menu, Button, Tag} from 'antd';
import type { UserTableDataType } from './types';
import { HiDotsHorizontal } from 'react-icons/hi';
import CustomButton from 'shared/ui/button';
import type { TFunction } from 'i18next';
import {statusColors} from "shared/ui/statuses.tsx";
export const UsersTableColumns = (
  t: TFunction,
  handleRowClick: (type: "User", action: "retrieve" | "edit" | "delete", record: UserTableDataType) => void
): TableProps<UserTableDataType>["columns"] => [
  {
    title: t('users.addUserForm.label.email'),
    dataIndex: "email",
    key: "email",
    render: (text) => <p
        style={{
          maxWidth: 100,
          overflow: "hidden",
          whiteSpace: "nowrap",
          textOverflow: "ellipsis",
        }}
        className="table-text">{text}</p>
  },
  {
    title: t('users.addUserForm.label.firstName'),
    dataIndex: "firstName",
    key: "firstName",
    render: (text) => <p className="table-text">{text}</p>
  },
  {
    title: t('users.addUserForm.label.lastName'),
    dataIndex: "lastName",
    key: "lastName",
    render: (text) => <p className="table-text">{text}</p>,
  },
  {
    title: t('users.addUserForm.label.role'),
    dataIndex: "role",
    key: "role",
    render: (text) => <p className="table-text">{text}</p>
  },
  {
    title: t('users.addUserForm.label.lastLoggedInAt'),
    dataIndex: "lastLoggedInAt",
    key: "lastLoggedInAt",
    render: (text) => <p className="table-text">{text}</p>,
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
      <Dropdown
        overlay={
          <Menu
            items={[
              {
                key: "edit",
                label: (
                  <CustomButton
                    type="button"
                    className="outline"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRowClick("User", "edit", record);
                    }}
                  >
                    {t('btn.edit')}
                  </CustomButton>
                ),
              },
              {
                key: "delete",
                label: (
                  <CustomButton
                    type="button"
                    className="danger"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRowClick("User", "delete", record);
                    }}
                  >
                    {t('btn.delete')}
                  </CustomButton>
                ),
              },
            ]}
          />
        }
        trigger={["click"]}
        placement="bottomRight"
      >
        <Button onClick={(e) => e.stopPropagation()} type="text" icon={<HiDotsHorizontal />} />
      </Dropdown>
    ),
  },
];





