import { Tag} from 'antd';
import { ActionDropdownButton, TextCell } from 'shared/ui/table/cells';
import type { OrganizationTableDataType } from './types';
import type { TFunction } from 'i18next';
import {statusColors} from "shared/ui/statuses.tsx";
import type {AdaptiveColumn} from "shared/ui/table/types.ts";

export const OrganizationsTableColumns = (
  t: TFunction,
  onDelete: (record: OrganizationTableDataType) => void,
  canDelete: boolean
) : AdaptiveColumn<OrganizationTableDataType>[] => [
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
              <TextCell value={text} />
            </div>
        ),
    },
  {
    title: t('organizations.addUserForm.label.tin'),
    dataIndex: "tin",
    flex: 2,
    key: "tin",
    render: (text) => <TextCell value={text} />
  },
  {
    title: t('organizations.addUserForm.label.legalName'),
    dataIndex: "legalName",
    flex: 3,
    key: "legalName",
    render: (text) => <TextCell value={text} />
  },
  {
    title: t('organizations.addUserForm.label.director'),
    dataIndex: "director",
      flex: 2,
    key: "director",
    render: (text) => <TextCell value={text} />
  },
  {
    title: t('organizations.addUserForm.label.phone'),
    dataIndex: "contacts",
      flex: 2,
    key: "contacts",
    render: (text) => <TextCell value={text} />
  },
  {
    title: t('organizations.addUserForm.label.vatCode'),
    dataIndex: "vatCode",
    flex: 2,
    key: "vatCode",
    render: (text) => <TextCell value={text} />
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
      <ActionDropdownButton
        actions={[
          canDelete && {
            key: "delete",
            label: t('btn.delete'),
            className: "danger",
            onClick: () => onDelete(record),
          },
        ]}
      />
    ),
  },
];




