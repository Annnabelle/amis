import {type TableProps, Dropdown, Menu, Button, Tag} from 'antd';
import { HiDotsHorizontal } from 'react-icons/hi';
import CustomButton from '../../components/button';
import type { OrganizationTableDataType } from './types';
import type { TFunction } from 'i18next';
import {statusColors} from "../../components/statuses.tsx";

export const OrganizationsTableColumns = (t: TFunction, handleRowClick: (type: "Company", action: "retrieve" | "edit" | "delete", record: OrganizationTableDataType) => void, onDelete: (record: OrganizationTableDataType) => void) : TableProps<OrganizationTableDataType>["columns"] => [
  { 
    title: '№',
    dataIndex: "number",
    key: "number",
    render: (text) => <p className="table-text">{text}</p>,
  },
  {
    title: t('organizations.addUserForm.label.displayName'),
    dataIndex: "displayName",
    key: "displayName",
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
    title: t('organizations.addUserForm.label.director'),
    dataIndex: "director",
    key: "director",
    render: (text) => <p className="table-text">{text}</p>
  },
  {
    title: t('organizations.addUserForm.label.legalName'),
    dataIndex: "legalName",
    key: "legalName",
    render: (text) => <p
        style={{
          maxWidth: 100,
          overflow: "hidden",
          whiteSpace: "nowrap",
          textOverflow: "ellipsis",
        }}
        className="table-text">{text}</p>,
  },
  {
    title: t('organizations.addUserForm.label.phone'),
    dataIndex: "contacts",
    key: "contacts",
    render: (text) => <p className="table-text">{text}</p>
  },
  {
    title: t('organizations.status'),
    dataIndex: "status",
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
                    onClick={(e) =>  {e.stopPropagation(); handleRowClick("Company", "edit", record);}}
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
                    onClick={(e) => { e.stopPropagation(); onDelete(record)}}
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
