import { type TableProps, Dropdown, Menu, Button } from 'antd';
import { HiDotsHorizontal } from 'react-icons/hi';
import CustomButton from '../../components/button';
import type { ProductTableDataType } from './types';
import type { TFunction } from 'i18next';

export const ProductsTableColumns = (t: TFunction, onEdit: (record: ProductTableDataType) => void, onDelete: (record: ProductTableDataType) => void) : TableProps<ProductTableDataType>["columns"] => [
  { 
    title: '№',
    dataIndex: "number",
    key: "number",
    render: (text) => <p className="table-text">{text}</p>,
  },
  {
    title: t('products.addProductForm.label.name'),
    dataIndex: "name",
    key: "name",
    render: (text) => <p className="table-text">{text}</p>
  },
  {
    title: t('products.addProductForm.label.productType'),
    dataIndex: "productType",
    key: "productType",
    render: (text) => <p className="table-text">{text}</p>
  },
  {
    title: t('products.addProductForm.label.icps'),
    dataIndex: "icps",
    key: "icps",
    render: (text) => <p className="table-text">{text}</p>,
  },
  {
    title: t('products.addProductForm.label.gtin'),
    dataIndex: "gtin",
    key: "gtin",
    render: (text) => <p className="table-text">{text}</p>
  },
  {
    title: t('products.addProductForm.label.unit'),
    dataIndex: "measurement",
    key: "measurement",
    render: (text) => <p className="table-text">{text}</p>,
  },
  {
    title: t('products.status'),
    dataIndex: "status",
    key: "status",
    render: (text) => <p className="table-text">{text}</p>,
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