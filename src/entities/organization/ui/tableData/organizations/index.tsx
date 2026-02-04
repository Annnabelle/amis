import { Dropdown, Menu, Button, Tag} from 'antd';
import { HiDotsHorizontal } from 'react-icons/hi';
import CustomButton from 'shared/ui/button';
import type { OrganizationTableDataType } from './types';
import type { TFunction } from 'i18next';
import {statusColors} from "shared/ui/statuses.tsx";
import type {AdaptiveColumn} from "shared/ui/table/types.ts";

export const OrganizationsTableColumns = (t: TFunction, onDelete: (record: OrganizationTableDataType) => void) : AdaptiveColumn<OrganizationTableDataType>[] => [
  { 
    title: '№',
    dataIndex: "number",
      className: "number-column",
    key: "number",
    render: (text) => <p className="table-text"
                         style={{
                             maxWidth: "50px",
                             width: "50px"
                         }}
    >{text}</p>,
  },
    {
        title: t('organizations.name'),
        dataIndex: "displayName",
        key: "displayName",
        flex: 4,
        render: (text, record) => (
            <div
                style={{
                    display: 'flex',
                }}
            >
                {record.isTest && (
                    <Tag className="test-flag" color="blue-inverse" style={{ margin: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',  marginRight: '10px' }}>
                        Тест
                    </Tag>
                )}
              <span
                  style={{
                      overflow: "hidden",
                      whiteSpace: "nowrap",
                      textOverflow: "ellipsis",
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
    render: (text) => <p className="table-text" style={{
        overflow: "hidden",
        whiteSpace: "nowrap",
        textOverflow: "ellipsis",
    }}>{text}</p>
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
      flex: 1,
      className: "no-ellipsis",
    key: "status",
      ellipsis: false,
    render: (status: string) => (
        status ? (
            <Tag color={statusColors[status]}
                 className="company-status"
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
       ellipsis: false,
    render: (_, record) => (
      <Dropdown
        overlay={
          <Menu
            items={[
              // {
              //   key: "edit",
              //   label: (
              //     <CustomButton
              //       type="button"
              //       className="outline"
              //       onClick={(e) =>  {e.stopPropagation(); handleRowClick("Company", "edit", record);}}
              //     >
              //      {t('btn.edit')}
              //     </CustomButton>
              //   ),
              // },
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




