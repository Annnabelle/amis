import { type TableProps } from 'antd';
import { ActionDropdownButton, TextCell } from 'shared/ui/table/cells';
import type { ProductTableDataType } from './types';
import type { TFunction } from 'i18next';

export const ProductsTableColumns = (
  t: TFunction,
  handleRowClick:(type: "Product", action: "retrieve" | "edit" | "delete",record: ProductTableDataType) => void,
  onDelete: (record: ProductTableDataType) => void,
  permissions: { canUpdate: boolean; canDelete: boolean }
) : TableProps<ProductTableDataType>["columns"] => [
  {
    title: t('products.addProductForm.label.name'),
    dataIndex: "name",
    key: "name",
    width: 460,
    render: (text) => <TextCell value={text} />
  },
  {
    title: t('products.addProductForm.label.productType'),
    dataIndex: "productGroup",
    key: "productGroup",
    width: 220,
    render: (text) => <TextCell value={text} />
  },
  {
    title: t('products.addProductForm.label.gtin'),
    dataIndex: "gtin",
    key: "gtin",
    width: 110,
    render: (text) => <TextCell value={text} />
  },
  // {
  //   title: t('products.status'),
  //   dataIndex: "status",
  //   key: "status",
  //   render: (text) => <p className="table-text">{text}</p>,
  // },
  {
    title: '',
    key: "action",
    width: 72,
    render: (_, record) => (
      <ActionDropdownButton
        actions={[
          permissions.canUpdate && {
            key: "edit",
            label: t('btn.edit'),
            variant: "outline",
            onClick: () => handleRowClick("Product", "edit", record),
          },
          permissions.canDelete && {
            key: "delete",
            label: t('btn.delete'),
            variant: "danger",
            onClick: () => onDelete(record),
          },
        ]}
      />
    ),
  },
];



