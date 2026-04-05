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
import { useEffect } from 'react';
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
                <h4 className="title">{t('salesOrders.sections.customer')}</h4>
              </div>
              <div className="form-inputs form-inputs-organization">
                <Form.Item
                  className="input"
                  name={["customer", "tin"]}
                  label={t('salesOrders.fields.customerTin')}
                  rules={[{ required: true, message: t('salesOrders.validation.customerTinRequired') }]}
                >
                  <Input className="input" size="large" placeholder={t('salesOrders.placeholders.customerTin')} />
                </Form.Item>
                <Form.Item
                  className="input"
                  name={["customer", "name"]}
                  label={t('salesOrders.fields.customerName')}
                  rules={[{ required: true, message: t('salesOrders.validation.customerNameRequired') }]}
                >
                  <Input className="input" size="large" placeholder={t('salesOrders.placeholders.customerName')} />
                </Form.Item>
              </div>
              <div className="form-inputs form-inputs-organization">
                <Form.Item
                  className="input"
                  name={["customer", "address"]}
                  label={t('salesOrders.fields.customerAddress')}
                >
                  <Input className="input" size="large" placeholder={t('salesOrders.placeholders.customerAddress')} />
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
                  <DatePicker className="input" size="large" />
                </Form.Item>
              </div>

              <div className="form-divider-title">
                <h4 className="title">{t('salesOrders.sections.fulfillment')}</h4>
              </div>
              <div className="form-inputs form-inputs-organization">
                <Form.Item
                  className="input"
                  name={["fulfillment", "dueDate"]}
                  label={t('salesOrders.fields.dueDate')}
                  rules={[{ required: true, message: t('salesOrders.validation.dueDateRequired') }]}
                >
                  <DatePicker className="input" size="large" />
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
                      <div key={field.key} className="form-inputs create-order-items-item">
                        <Form.Item
                          className="input"
                          name={[field.name, "productId"]}
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
                          className="input"
                          name={[field.name, "quantity"]}
                          rules={[{ required: true, message: t('salesOrders.validation.itemQuantityRequired') }]}
                        >
                          <InputNumber
                            min={1}
                            size="large"
                            className="input"
                            style={{ width: "100%", minWidth: 120 }}
                            placeholder="0"
                          />
                        </Form.Item>

                        <Form.Item
                          className="input"
                          name={[field.name, "unitPrice"]}
                          rules={[{ required: true, message: t('salesOrders.validation.itemUnitPriceRequired') }]}
                        >
                          <InputNumber
                            min={0}
                            size="large"
                            className="input"
                            style={{ width: "100%", minWidth: 140 }}
                            placeholder="0"
                          />
                        </Form.Item>

                        <Form.Item className="input" name={[field.name, "comment"]}>
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

              <div className="form-divider-title">
              </div>
              <div className="form-inputs">
                <Form.Item className="input" name="comment" label={t('salesOrders.fields.comment')}>
                  <Input.TextArea className="input" rows={3} placeholder={t('salesOrders.placeholders.comment')} />
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
