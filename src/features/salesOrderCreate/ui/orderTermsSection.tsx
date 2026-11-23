import { DatePicker, Form, Input, InputNumber, Radio, Select, Tooltip } from "antd";
import { InfoCircleOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";

import { SalesOrderDeliveryType } from "@edem2000/amis.contracts";
import { SalesOrderPaymentMethod, SalesOrderPriorities } from "shared/types/dtos";
import { decimalParser } from "features/salesOrderCreate/lib/numericInput";

type OrderTermsSectionProps = {
  /** Расстояние считает маршрут или прямая между точками. */
  deliveryDistanceSource: "route" | "geo" | null;
  formattedDeliveryTotalCost: string;
};

/** Договор, сроки, оплата и доставка заказа. */
const OrderTermsSection = ({
  deliveryDistanceSource,
  formattedDeliveryTotalCost,
}: OrderTermsSectionProps) => {
  const { t } = useTranslation();

  return (
    <>
            <div className="form-divider-title">
              <h4 className="title">{t('salesOrders.sections.contract')}</h4>
            </div>
            <div className="form-inputs form-inputs-organization">
              <Form.Item
                className="input"
                name={["contract", "number"]}
                label={t('salesOrders.fields.contractNumber')}
                rules={[{ required: true, message: t('salesOrders.validation.contractNumberRequired') }]}
              >
                <Input className="input" size="large" placeholder={t('salesOrders.placeholders.contractNumber')} />
              </Form.Item>
              <Form.Item
                className="input"
                name={["contract", "date"]}
                label={t('salesOrders.fields.contractDate')}
                rules={[{ required: true, message: t('salesOrders.validation.contractDateRequired') }]}
              >
                <DatePicker className="input" size="large" placeholder={t('salesOrders.placeholders.contractDate')} />
              </Form.Item>
            </div>

            <div className="form-divider-title">
              <h4 className="title">{t('salesOrders.sections.fulfillment')}</h4>
            </div>
            <div className="form-inputs form-inputs-organization">
              <Form.Item
                className="input"
                name={["fulfillment", "dueDate"]}
                label={t('salesOrders.createFields.expectedDate', { defaultValue: 'Ожидаемая дата' })}
                rules={[
                  {
                    required: true,
                    message: t('salesOrders.createValidation.expectedDateRequired', {
                      defaultValue: 'Ожидаемая дата обязательна',
                    }),
                  },
                ]}
              >
                <DatePicker
                  className="input"
                  size="large"
                  placeholder={t('salesOrders.createPlaceholders.expectedDate', {
                    defaultValue: 'Ожидаемая дата',
                  })}
                />
              </Form.Item>
              <Form.Item
                className="input"
                name={["fulfillment", "priority"]}
                label={t('salesOrders.fields.priority')}
                rules={[{ required: true, message: t('salesOrders.validation.priorityRequired') }]}
              >
                <Select
                  className="input"
                  size="large"
                  options={SalesOrderPriorities.map((priority) => ({
                    value: priority,
                    label: t(`salesOrders.priority.${priority}`),
                  }))}
                  placeholder={t('salesOrders.priority.normal')}
                />
              </Form.Item>
            </div>

            <div className="form-divider-title">
              <h4 className="title">{t('salesOrders.sections.paymentMethod')}</h4>
            </div>
            <div className="form-inputs">
              <Form.Item
                className="input"
                name={["fulfillment", "paymentMethod"]}
                rules={[{ required: true, message: t('salesOrders.validation.paymentMethodRequired') }]}
              >
                <Radio.Group size="large">
                  <Radio value={SalesOrderPaymentMethod.Cash}>{t('salesOrders.paymentMethods.cash')}</Radio>
                  <Radio value={SalesOrderPaymentMethod.Transfer}>{t('salesOrders.paymentMethods.transfer')}</Radio>
                </Radio.Group>
              </Form.Item>
            </div>

            <div className="form-divider-title">
              <h4 className="title">{t('waybills.sections.delivery')}</h4>
            </div>
            <div className="form-inputs form-inputs-organization">
              <Form.Item
                className="input"
                name={["delivery", "type"]}
                label={t('waybills.fields.deliveryType')}
                rules={[{ required: true, message: t('waybills.fields.deliveryType') }]}
              >
                <Select
                  className="input"
                  size="large"
                  options={Object.values(SalesOrderDeliveryType).map((type) => ({
                    value: type,
                    label: t(`waybills.deliveryTypes.${type}`),
                  }))}
                />
              </Form.Item>
              <Form.Item
                className="input"
                name={["delivery", "costPerDistanceUnit"]}
                label={t('waybills.fields.costPerKilometer', { defaultValue: 'Цена за 1 км' })}
                rules={[{ required: true, message: t('salesOrders.validation.costPerKilometerRequired') }]}
              >
                <InputNumber<string | number>
                  min={0}
                  precision={2}
                  type="text"
                  size="large"
                  className="input"
                  style={{ width: "100%" }}
                  addonAfter={t('waybills.fields.sum', { defaultValue: 'сум' })}
                  parser={decimalParser(10, 2)}
                  inputMode="decimal"
                />
              </Form.Item>
              <Form.Item
                className="input"
                name={["delivery", "totalDistance"]}
                label={
                  <span>
                    {t('waybills.fields.totalDistance')}
                    {deliveryDistanceSource === "geo" && (
                      <Tooltip
                        open
                        placement="top"
                        title={t('waybills.fields.geoDistanceFallbackTooltip', {
                          defaultValue: 'Маршрут недоступен, указано прямое расстояние между выбранными точками',
                        })}
                      >
                        <InfoCircleOutlined style={{ color: 'var(--status-warning-color)', marginLeft: 6 }} />
                      </Tooltip>
                    )}
                  </span>
                }
              >
                <InputNumber<string | number>
                  min={0}
                  precision={1}
                  type="text"
                  size="large"
                  className="input"
                  style={{ width: "100%" }}
                  addonAfter="км"
                  parser={decimalParser(10, 1)}
                  inputMode="decimal"
                />
              </Form.Item>
            </div>

            <div className="sales-order-items-total">
              <div className="sales-order-items-total__label">
                {t('waybills.fields.deliveryTotalCost', { defaultValue: 'Общая стоимость доставки' })}
              </div>
              <div className="sales-order-items-total__value">{formattedDeliveryTotalCost}</div>
            </div>

    </>
  );
};

export default OrderTermsSection;
