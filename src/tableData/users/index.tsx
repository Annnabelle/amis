import { type TableProps, Dropdown, Menu, Button } from 'antd';
import type { UserTableDataType } from './types';
import { HiDotsHorizontal } from 'react-icons/hi';
import CustomButton from '../../components/button';

export const UsersTableColumns = ( onEdit: (record: UserTableDataType) => void,
  onDelete: (record: UserTableDataType) => void): TableProps<UserTableDataType>["columns"] => [
  {
    title: '№',
    dataIndex: "number",
    key: "number",
    render: (text) => <p className="table-text">{text}</p>,
  },
  {
    title: 'Логин',
    dataIndex: "email",
    key: "email",
    render: (text) => <p className="table-text">{text}</p>
  },
  {
    title: 'Имя',
    dataIndex: "firstName",
    key: "firstName",
    render: (text) => <p className="table-text">{text}</p>
  },
  {
    title: 'Фамилия',
    dataIndex: "lastName",
    key: "lastName",
    render: (text) => <p className="table-text">{text}</p>,
  },
  {
    title: 'Роль',
    dataIndex: "role",
    key: "role",
    render: (text) => <p className="table-text">{text}</p>
  },
  {
    title: 'Последняя активность',
    dataIndex: "lastLoggedInAt",
    key: "lastLoggedInAt",
    render: (text) => <p className="table-text">{text}</p>,
  },
  {
    title: 'Статус',
    dataIndex: "status",
    key: "status",
    render: (text) => <p className="table-text">{text}</p>
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
                    onClick={(e) =>  {e.stopPropagation(); onEdit(record)}}
                  >
                    Редактировать
                  </CustomButton>
                ),
              },
              {
                key: "delete",
                label: (
                  <CustomButton
                    type="button"
                    className="danger"
                    onClick={(e) => { e.stopPropagation(); onDelete(record)}}
                  >
                    Удалить
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
