import { Dropdown, Menu, Button, Tag} from 'antd';
import { HiDotsHorizontal } from 'react-icons/hi';
import CustomButton from '../../components/button';
import type { OrganizationTableDataType } from './types';
import type { TFunction } from 'i18next';
import {statusColors} from "../../components/statuses.tsx";
import type {AdaptiveColumn} from "../../components/table/types.ts";

export const OrganizationsTableColumns = (t: TFunction, handleRowClick: (type: "Company", action: "retrieve" | "edit" | "delete", record: OrganizationTableDataType) => void, onDelete: (record: OrganizationTableDataType) => void) : AdaptiveColumn<OrganizationTableDataType>[] => [
  { 
    title: '№',
    dataIndex: "number",
      flex: 1,
    key: "number",
    render: (text) => <p className="table-text">{text}</p>,
  },
    {
        title: t('organizations.name'),
        dataIndex: "displayName",
        key: "displayName",
        flex: 2,
        render: (text, record) => (
            <div
            >
                {record.isTest && (
                    <Tag className="test-flag" color="blue-inverse" style={{ margin: 0 }}>
                        Тест
                    </Tag>
                )}
              <span
                  style={{
                      overflow: "hidden",
                      whiteSpace: "nowrap",
                      textOverflow: "ellipsis",
                      width: "100%",
                      maxWidth: "100%",
                      minWidth: "100%",
                  }}
                  className="table-text"
              >
                {text}
              </span>
            </div>
        ),
    },
  {
    title: t('organizations.addUserForm.label.director'),
    dataIndex: "director",
      flex: 2,
    key: "director",
    render: (text) => <p className="table-text">{text}</p>
  },
  {
    title: t('organizations.addUserForm.label.phone'),
    dataIndex: "contacts",
      flex: 2,
    key: "contacts",
    render: (text) => <p className="table-text">{text}</p>
  },
  {
    title: t('organizations.status'),
    dataIndex: "status",
      flex: 2,
    key: "status",
    render: (status: string) => (
        status ? (
            <Tag color={statusColors[status]}
            >
                {t(`statuses.${status}`)}
            </Tag>
        ) : null
    ),
  },
   {
    title: '',
    key: "action",
       flex: 1,
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
        <Button onClick={(e) => e.stopPropagation()} type="text" icon={<HiDotsHorizontal />} style={{width: "100%", display: "flex", justifyContent: "center" }} />
      </Dropdown>
    ),
  },
];
