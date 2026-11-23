import { CloseOutlined, PlusOutlined } from "@ant-design/icons";
import { Form, Input, InputNumber, Select } from "antd";
import { useTranslation } from "react-i18next";

import type { ProductPackage } from "entities/products/types";
import type { SalesOrderFormValues } from "entities/salesOrders/mappers";
import {
  allowOnlyDigitsKeyDown,
  allowOnlyDigitsPaste,
  digitsOnlyParser,
} from "features/salesOrderCreate/lib/numericInput";
import CustomButton from "shared/ui/button";

type PackagesState = Record<
  string,
  { loading: boolean; loaded: boolean; options: ProductPackage[] }
>;

type OrderItemsSectionProps = {
  items: SalesOrderFormValues["items"] | undefined;
  products: { id: string; name: string }[];
  productsLoading: boolean;
  packagesByProductId: PackagesState;
  getPackageLabel: (pkg: ProductPackage) => string;
  onProductSearch: (value: string) => void;
  onProductChange: (fieldName: number, productId?: string) => void;
};

/** Позиции заказа: товар, упаковка, количество и цена по каждой. */
const OrderItemsSection = ({
  items,
  products,
  productsLoading,
  packagesByProductId,
  getPackageLabel,
  onProductSearch: handleProductSearch,
  onProductChange: handleItemProductChange,
}: OrderItemsSectionProps) => {
  const { t } = useTranslation();

  return (
          <Form.List name="items" initialValue={[{}]}>
            {(fields, { add, remove }) => (
              <div className="create-order-items">
                {fields.map((field, index) => {
                  const rowProductId = Array.isArray(items)
                    ? (items[field.name]?.productId as string | undefined)
                    : undefined;
                  const rowPackages = rowProductId
                    ? packagesByProductId[rowProductId]
                    : undefined;

                  return (
                  <div key={field.key} className="sales-order-item-card">
                    <div className="sales-order-item-card__header">
                      <span className="sales-order-item-card__title">
                        {t('salesOrders.sections.item', { defaultValue: 'Позиция' })} {index + 1}
                      </span>
                      <div className="sales-order-item-card__actions">
                        {fields.length > 1 && (
                          <CustomButton
                            variant="danger"
                            className="create-order-btn"
                            icon={<CloseOutlined />}
                            iconOnly
                            onClick={() => remove(field.name)}
                            aria-label={t("btn.delete", { defaultValue: "Удалить" })}
                          />
                        )}
                        {index === fields.length - 1 && (
                          <CustomButton
                            className="create-order-btn"
                            icon={<PlusOutlined />}
                            iconOnly
                            onClick={() => add()}
                            aria-label={t("btn.add", { defaultValue: "Добавить" })}
                          />
                        )}
                      </div>
                    </div>

                    <div className="form-inputs sales-order-item-card__row sales-order-item-card__row--primary">
                      <Form.Item
                        className="input sales-order-item sales-order-item--product"
                        name={[field.name, "productId"]}
                        label={t('salesOrders.fields.product')}
                        rules={[{ required: true, message: t('salesOrders.validation.itemProductRequired') }]}
                      >
                        <Select
                          className="input"
                          size="large"
                          placeholder={t('salesOrders.fields.product')}
                          showSearch
                          filterOption={false}
                          optionLabelProp="label"
                          dropdownMatchSelectWidth={false}
                          loading={productsLoading}
                          onSearch={handleProductSearch}
                          onChange={(value) => handleItemProductChange(field.name, value)}
                          options={products.map((product) => ({
                            value: product.id,
                            label: product.name,
                          }))}
                        />
                      </Form.Item>

                      <Form.Item
                        className="input sales-order-item sales-order-item--package"
                        name={[field.name, "packageCode"]}
                        label={t('salesOrders.fields.packageCodeShort')}
                        rules={[{ required: true, message: t('salesOrders.validation.itemPackageRequired') }]}
                      >
                        <Select
                          className="input"
                          size="large"
                          placeholder={t('salesOrders.fields.packageCodeShort')}
                          loading={rowPackages?.loading}
                          disabled={!rowProductId || rowPackages?.loading}
                          notFoundContent={
                            rowPackages?.loading
                              ? t('common.loading', { defaultValue: '...' })
                              : undefined
                          }
                          options={(rowPackages?.options ?? []).map((pkg) => ({
                            value: pkg.code,
                            label: getPackageLabel(pkg),
                          }))}
                        />
                      </Form.Item>

                      <Form.Item
                        className="input sales-order-item sales-order-item--quantity"
                        name={[field.name, "quantity"]}
                        label={t('salesOrders.fields.quantity')}
                        rules={[{ required: true, message: t('salesOrders.validation.itemQuantityRequired') }]}
                      >
                        <InputNumber<string | number>
                          min={1}
                          max={9999999999}
                          precision={0}
                          type="text"
                          size="large"
                          className="input"
                          style={{ width: "100%", minWidth: 120 }}
                          placeholder={t('salesOrders.placeholders.quantity')}
                          parser={digitsOnlyParser(10)}
                          inputMode="numeric"
                          onKeyDown={allowOnlyDigitsKeyDown(10)}
                          onPaste={allowOnlyDigitsPaste(10)}
                        />
                      </Form.Item>
                    </div>

                    <div className="form-inputs sales-order-item-card__row sales-order-item-card__row--secondary">
                      <Form.Item
                        className="input sales-order-item sales-order-item--unit-price"
                        name={[field.name, "unitPrice"]}
                        label={t('salesOrders.fields.unitPrice')}
                        rules={[{ required: true, message: t('salesOrders.validation.itemUnitPriceRequired') }]}
                      >
                        <InputNumber<string | number>
                          min={100}
                          max={9999999}
                          precision={0}
                          type="text"
                          size="large"
                          className="input"
                          style={{ width: "100%", minWidth: 140 }}
                          placeholder={t('salesOrders.placeholders.unitPrice')}
                          parser={digitsOnlyParser(7)}
                          inputMode="numeric"
                          onKeyDown={allowOnlyDigitsKeyDown(7)}
                          onPaste={allowOnlyDigitsPaste(7)}
                        />
                      </Form.Item>

                      <Form.Item
                        className="input sales-order-item sales-order-item--comment"
                        name={[field.name, "comment"]}
                        label={t('salesOrders.fields.comment')}
                      >
                        <Input className="input" size="large" placeholder={t('salesOrders.placeholders.itemComment')} />
                      </Form.Item>
                    </div>
                  </div>
                  );
                })}
              </div>
            )}
          </Form.List>
  );
};

export default OrderItemsSection;
