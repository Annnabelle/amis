import { Button, DatePicker, Form, Input, InputNumber, Select } from 'antd';
import { CloseOutlined, PlusOutlined } from '@ant-design/icons';
import MainLayout from 'shared/ui/layout';
import Heading from 'shared/ui/mainHeading';
import CustomButton from 'shared/ui/button';
import FormComponent from 'shared/ui/formComponent';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from 'app/store';
import { toast } from 'react-toastify';
import { createSalesOrder } from 'entities/salesOrders/model';
import { mapSalesOrderFormToCreateDto, type SalesOrderFormValues } from 'entities/salesOrders/mappers';
import { searchProducts } from 'entities/products/model';
import { getBackendErrorMessage } from 'shared/lib/getBackendErrorMessage.ts';
import { useEffect, useMemo } from 'react';
import { SalesOrderPriorities } from 'shared/types/dtos';

const SalesOrdersCreate = () => {
  const navigate = useNavigate();
  const { orgId } = useParams<{ orgId: string }>();
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const products = useAppSelector((state) => state.products.products);
  const [form] = Form.useForm<SalesOrderFormValues>();
  const listPath = orgId
    ? `/organization/${orgId}/sales-orders`
    : '/sales-orders';

  const items = Form.useWatch('items', form);

  const digitsOnlyParser = (maxDigits?: number) => (value?: string) => {
    const digits = value?.replace(/\D/g, '') ?? '';
    return maxDigits ? digits.slice(0, maxDigits) : digits;
  };

  const totalAmount = useMemo(() => {
    const safeItems = Array.isArray(items) ? items : [];

    const toBigInt = (value: unknown) => {
      const digits = String(value ?? '').replace(/\D/g, '');
      if (!digits) return 0n;
      try {
        return BigInt(digits);
      } catch {
        return 0n;
      }
    };

    return safeItems.reduce((sum, item) => {
      const quantity = toBigInt(item?.quantity);
      const unitPrice = toBigInt(item?.unitPrice);
      return sum + quantity * unitPrice;
    }, 0n);
  }, [items]);

  const formattedTotalAmount = useMemo(() => new Intl.NumberFormat().format(totalAmount), [totalAmount]);

  const allowOnlyDigitsKeyDown = (maxDigits?: number) => (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.ctrlKey || e.metaKey || e.altKey) return;

    const allowedKeys = [
      'Backspace',
      'Delete',
      'Tab',
      'ArrowLeft',
      'ArrowRight',
      'Home',
      'End',
      'Enter',
    ];
    if (allowedKeys.includes(e.key)) return;

    if (!/^\d$/.test(e.key)) {
      e.preventDefault();
      return;
    }

    if (!maxDigits) return;

    const currentValue = e.currentTarget.value ?? '';
    const selectionStart = e.currentTarget.selectionStart ?? currentValue.length;
    const selectionEnd = e.currentTarget.selectionEnd ?? currentValue.length;
    const hasSelection = selectionEnd > selectionStart;

    if (!hasSelection && currentValue.length >= maxDigits) {
      e.preventDefault();
    }
  };

  const allowOnlyDigitsPaste = (maxDigits?: number) => (e: React.ClipboardEvent<HTMLInputElement>) => {
    const text = e.clipboardData.getData('text');
    if (!/^\d*$/.test(text)) {
      e.preventDefault();
      return;
    }

    if (!maxDigits) return;

    const currentValue = e.currentTarget.value ?? '';
    const selectionStart = e.currentTarget.selectionStart ?? currentValue.length;
    const selectionEnd = e.currentTarget.selectionEnd ?? currentValue.length;
    const selectionLength = Math.max(0, selectionEnd - selectionStart);
    const nextLength = currentValue.length - selectionLength + text.length;

    if (nextLength > maxDigits) {
      e.preventDefault();
    }
  };

  useEffect(() => {
    if (!orgId) return;
    dispatch(
      searchProducts({
        query: '',
        page: 1,
        limit: 10,
        sortOrder: 'asc',
        companyId: orgId,
      })
    );
  }, [dispatch, orgId]);

  const handleProductSearch = (value: string) => {
    if (!orgId || !value.trim()) return;
    dispatch(
      searchProducts({
        query: value,
        page: 1,
        limit: 10,
        sortOrder: 'asc',
        companyId: orgId,
      })
    );
  };

  const handleCreateSalesOrder = async (values: SalesOrderFormValues) => {
    if (!orgId) {
      toast.error(t('salesOrders.validation.companyRequired'));
      return;
    }

    try {
      const payload = mapSalesOrderFormToCreateDto(values, orgId);
      await dispatch(createSalesOrder(payload)).unwrap();
      toast.success(t('salesOrders.messages.success.create'));
      form.resetFields();
      navigate(listPath);
    } catch (error: any) {
      toast.error(
        getBackendErrorMessage(error, t('common.error'))
      );
    }
  };

  return (
    <MainLayout>
      <Heading title={t('salesOrders.title')} subtitle={t('common.create')} />
      <div className="box">
        <div className="box-container">
          <div className="box-container-items">
            <FormComponent
              form={form}
              onFinish={handleCreateSalesOrder}
              initialValues={{
                fulfillment: { priority: 'normal' },
              }}
            >
              <div className="form-divider-title">
                <h4 className="title">{t('salesOrders.createSections.recipient', { defaultValue: 'Получатель' })}</h4>
              </div>
              <div className="form-inputs form-inputs-organization">
                <Form.Item
                  className="input"
                  name={["customer", "tin"]}
                  label={t('salesOrders.createFields.companyTin', { defaultValue: 'ИНН компании' })}
                  rules={[
                    {
                      required: true,
                      message: t('salesOrders.createValidation.companyTinRequired', {
                        defaultValue: 'ИНН компании обязателен',
                      }),
                    },
                  ]}
                >
                  <Input
                    className="input"
                    size="large"
                    placeholder={t('salesOrders.createPlaceholders.companyTin', {
                      defaultValue: 'ИНН компании',
                    })}
                  />
                </Form.Item>
                <Form.Item
                  className="input"
                  name={["customer", "name"]}
                  label={t('salesOrders.createFields.companyName', { defaultValue: 'Название компании' })}
                  rules={[
                    {
                      required: true,
                      message: t('salesOrders.createValidation.companyNameRequired', {
                        defaultValue: 'Название компании обязательно',
                      }),
                    },
                  ]}
                >
                  <Input
                    className="input"
                    size="large"
                    placeholder={t('salesOrders.createPlaceholders.companyName', {
                      defaultValue: 'Название компании',
                    })}
                  />
                </Form.Item>
              </div>
              <div className="form-inputs form-inputs-organization">
                <Form.Item
                  className="input"
                  name={["customer", "address"]}
                  label={t('salesOrders.createFields.companyAddress', { defaultValue: 'Адрес компании' })}
                  rules={[
                    {
                      required: true,
                      message: t('salesOrders.createValidation.companyAddressRequired', {
                        defaultValue: 'Адрес компании обязателен',
                      }),
                    },
                  ]}
                >
                  <Input
                    className="input"
                    size="large"
                    placeholder={t('salesOrders.createPlaceholders.companyAddress', {
                      defaultValue: 'Адрес компании',
                    })}
                  />
                </Form.Item>
              </div>

              <div className="form-divider-title">
                <h4 className="title">{t('salesOrders.sections.contract')}</h4>
              </div>
              <div className="form-inputs form-inputs-organization">
                <Form.Item
                  className="input"
                  name={["contract", "number"]}
                  label={t('salesOrders.fields.contractNumber')}
                  dependencies={[["contract", "date"]]}
                  rules={[
                    ({ getFieldValue }) => ({
                      validator(_, value) {
                        const dateValue = getFieldValue(["contract", "date"]);
                        if (!dateValue || value) return Promise.resolve();
                        return Promise.reject(new Error(t('salesOrders.validation.contractNumberRequired')));
                      },
                    }),
                  ]}
                >
                  <Input className="input" size="large" placeholder={t('salesOrders.placeholders.contractNumber')} />
                </Form.Item>
                <Form.Item
                  className="input"
                  name={["contract", "date"]}
                  label={t('salesOrders.fields.contractDate')}
                  dependencies={[["contract", "number"]]}
                  rules={[
                    ({ getFieldValue }) => ({
                      validator(_, value) {
                        const numberValue = getFieldValue(["contract", "number"]);
                        if (!numberValue || value) return Promise.resolve();
                        return Promise.reject(new Error(t('salesOrders.validation.contractDateRequired')));
                      },
                    }),
                  ]}
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
                <h4 className="title">{t('salesOrders.sections.items')}</h4>
              </div>
              <Form.List name="items" initialValue={[{}]}>
                {(fields, { add, remove }) => (
                  <div className="create-order-items">
                    {fields.map((field, index) => (
                      <div key={field.key} className="form-inputs create-order-items-item sales-order-items-item">
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
                            onSearch={handleProductSearch}
                            options={products.map((product) => ({
                              value: product.id,
                              label: product.name,
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

                        {index === fields.length - 1 ? (
                          <Button
                            type="primary"
                            className="create-order-btn"
                            icon={<PlusOutlined />}
                            onClick={() => add()}
                          />
                        ) : (
                          <Button
                            danger
                            className="create-order-btn"
                            icon={<CloseOutlined />}
                            onClick={() => remove(field.name)}
                          />
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </Form.List>

              <div className="sales-order-items-total">
                <div className="sales-order-items-total__label">{t('salesOrders.fields.totalAmount')}</div>
                <div className="sales-order-items-total__value">{formattedTotalAmount}</div>
              </div>

              <div className="form-inputs">
                <Form.Item className="input" name="comment" label={t('salesOrders.fields.comment')}>
                  <Input.TextArea className="input" rows={3} placeholder={t('salesOrders.placeholders.comment')} style={{ resize: 'none' }} />
                </Form.Item>
              </div>

              <div className="form-btns-group">
                <CustomButton className="outline" onClick={() => navigate(listPath)}>
                  {t('btn.cancel')}
                </CustomButton>
                <CustomButton type="submit">{t('salesOrders.actions.create')}</CustomButton>
              </div>
            </FormComponent>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default SalesOrdersCreate;
