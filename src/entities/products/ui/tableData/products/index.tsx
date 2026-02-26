import { type TableProps, Dropdown, Menu, Button } from 'antd';
import { HiDotsHorizontal } from 'react-icons/hi';
import CustomButton from 'shared/ui/button';
import type { ProductTableDataType } from './types';
import type { TFunction } from 'i18next';

export const ProductsTableColumns = (t: TFunction,  handleRowClick:(type: "Product", action: "retrieve" | "edit" | "delete",record: ProductTableDataType) => void, onDelete: (record: ProductTableDataType) => void) : TableProps<ProductTableDataType>["columns"] => [
  {
    title: t('products.addProductForm.label.name'),
    dataIndex: "name",
    key: "name",
    width: 460,
    render: (text) => <p className="table-text">{text}</p>
  },
  {
    title: t('products.addProductForm.label.productType'),
    dataIndex: "productGroup",
    key: "productGroup",
    width: 220,
    render: (text) => <p className="table-text">{text}</p>
  },
  {
    title: t('products.addProductForm.label.gtin'),
    dataIndex: "gtin",
    key: "gtin",
    width: 110,
    render: (text) => <p className="table-text">{text}</p>
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
      <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
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
                      onClick={(e) =>  {e.stopPropagation(); handleRowClick("Product", "edit", record);}}
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
      </div>
    ),
  },
];



