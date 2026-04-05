import { useEffect, useMemo } from 'react';
import MainLayout from 'shared/ui/layout';
import Heading from 'shared/ui/mainHeading';
import { Form, Input } from 'antd';
import CustomButton from 'shared/ui/button';
import FormComponent from 'shared/ui/formComponent';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import dayjs from 'dayjs';
import { useAppDispatch, useAppSelector } from 'app/store';
import { getSalesOrderById } from 'entities/salesOrders/model';

const SalesOrdersDetails = () => {
  const navigate = useNavigate();
  const { orgId, id } = useParams<{ orgId: string; id: string }>();
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const order = useAppSelector((state) => state.salesOrders.orderById);
  const empty = '';
  const listPath = orgId
    ? `/organization/${orgId}/sales-orders`
    : '/sales-orders';
  useEffect(() => {
    if (!id) return;
    dispatch(getSalesOrderById({ id }));
  }, [dispatch, id]);

  const items = useMemo(() => order?.items ?? [], [order]);

  return (
    <MainLayout>
      <Heading title={t('salesOrders.detailsTitle')} subtitle={t('common.details')}>
        <div className="btns-group">
          <CustomButton className="outline" onClick={() => navigate(listPath)}>
            {t('common.backToList')}
          </CustomButton>
        </div>
      </Heading>
      <div className="box">
        <div className="box-container">
          <div className="box-container-items">
            {order && (
              <FormComponent>
                <div className="form-inputs form-inputs-row">
                  <Form.Item className="input" label={t('salesOrders.fields.orderNumber')}>
                    <Input
                      className="input"
                      size="large"
                      disabled
                      placeholder={order.contract?.number ?? order.id}
                    />
                  </Form.Item>
                  <Form.Item className="input" label={t('salesOrders.fields.status')}>
                    <Input
                      className="input"
                      size="large"
                      disabled
                      placeholder={t(`salesOrders.statuses.${order.status}`)}
                    />
                  </Form.Item>
                </div>
                <div className="form-inputs form-inputs-row">
                  <Form.Item className="input" label={t('salesOrders.fields.priority')}>
                    <Input
                      className="input"
                      size="large"
                      disabled
                      placeholder={t(`salesOrders.priority.${order.fulfillment.priority}`)}
                    />
                  </Form.Item>
                  <Form.Item className="input" label={t('salesOrders.fields.dueDate')}>
                    <Input
                      className="input"
                      size="large"
                      disabled
                      placeholder={
                        order.fulfillment.dueDate
                          ? dayjs(order.fulfillment.dueDate).format('DD.MM.YYYY')
                          : empty
                      }
                    />
                  </Form.Item>
                </div>
                <div className="form-inputs form-inputs-row">
                  <Form.Item className="input" label={t('salesOrders.fields.createdAt')}>
                    <Input
                      className="input"
                      size="large"
                      disabled
                      placeholder={order.createdAt ? dayjs(order.createdAt).format('DD.MM.YYYY') : empty}
                    />
                  </Form.Item>
                  <Form.Item className="input" label={t('salesOrders.fields.updatedAt')}>
                    <Input
                      className="input"
                      size="large"
                      disabled
                      placeholder={order.updatedAt ? dayjs(order.updatedAt).format('DD.MM.YYYY') : empty}
                    />
                  </Form.Item>
                </div>
                <div className="form-inputs form-inputs-row">
                  <Form.Item className="input" label={t('salesOrders.fields.createdBy')}>
                    <Input className="input" size="large" disabled placeholder={order.createdBy} />
                  </Form.Item>
                  <Form.Item className="input" label={t('salesOrders.fields.updatedBy')}>
                    <Input
                      className="input"
                      size="large"
                      disabled
                      placeholder={order.updatedBy ?? empty}
                    />
                  </Form.Item>
                </div>

                <div className="form-divider-title">
                  <h4 className="title">{t('salesOrders.sections.customer')}</h4>
                </div>
                <div className="form-inputs form-inputs-row">
                  <Form.Item className="input" label={t('salesOrders.fields.customerName')}>
                    <Input className="input" size="large" disabled placeholder={order.customer.name} />
                  </Form.Item>
                  <Form.Item className="input" label={t('salesOrders.fields.customerTin')}>
                    <Input className="input" size="large" disabled placeholder={order.customer.tin} />
                  </Form.Item>
                </div>
                <div className="form-inputs form-inputs-row">
                  <Form.Item className="input" label={t('salesOrders.fields.customerAddress')}>
                    <Input className="input" size="large" disabled placeholder={order.customer.address ?? empty} />
                  </Form.Item>
                </div>

                <div className="form-divider-title">
                  <h4 className="title">{t('salesOrders.sections.contract')}</h4>
                </div>
                <div className="form-inputs form-inputs-row">
                  <Form.Item className="input" label={t('salesOrders.fields.contractNumber')}>
                    <Input className="input" size="large" disabled placeholder={order.contract?.number ?? empty} />
                  </Form.Item>
                  <Form.Item className="input" label={t('salesOrders.fields.contractDate')}>
                    <Input
                      className="input"
                      size="large"
                      disabled
                      placeholder={
                        order.contract?.date
                          ? dayjs(order.contract.date).format('DD.MM.YYYY')
                          : empty
                      }
                    />
                  </Form.Item>
                </div>

                <div className="form-divider-title">
                  <h4 className="title">{t('salesOrders.sections.totals')}</h4>
                </div>
                <div className="form-inputs form-inputs-row">
                  <Form.Item className="input" label={t('salesOrders.fields.orderedQuantity')}>
                    <Input
                      className="input"
                      size="large"
                      disabled
                      placeholder={
                        order.totals.orderedQuantity !== undefined
                          ? String(order.totals.orderedQuantity)
                          : empty
                      }
                    />
                  </Form.Item>
                  <Form.Item className="input" label={t('salesOrders.fields.assignedQuantity')}>
                    <Input
                      className="input"
                      size="large"
                      disabled
                      placeholder={
                        order.totals.assignedQuantity !== undefined
                          ? String(order.totals.assignedQuantity)
                          : empty
                      }
                    />
                  </Form.Item>
                </div>
                <div className="form-inputs form-inputs-row">
                  <Form.Item className="input" label={t('salesOrders.fields.deliveredQuantity')}>
                    <Input
                      className="input"
                      size="large"
                      disabled
                      placeholder={
                        order.totals.deliveredQuantity !== undefined
                          ? String(order.totals.deliveredQuantity)
                          : empty
                      }
                    />
                  </Form.Item>
                  <Form.Item className="input" label={t('salesOrders.fields.amount')}>
                    <Input
                      className="input"
                      size="large"
                      disabled
                      placeholder={order.totals.amount !== undefined ? String(order.totals.amount) : empty}
                    />
                  </Form.Item>
                </div>

                <div className="form-divider-title">
                  <h4 className="title">{t('salesOrders.sections.items')}</h4>
                </div>
                <div className="create-order-items">
                  {items.length ? (
                    items.map((item) => (
                      <div key={item.id} className="form-inputs create-order-items-item">
                        <Form.Item className="input" label={t('salesOrders.fields.product')}>
                          <Input className="input" size="large" placeholder={item.product.name} disabled />
                        </Form.Item>
                        <Form.Item className="input" label={t('salesOrders.fields.orderedQuantity')}>
                          <Input
                            className="input"
                            size="large"
                            placeholder={
                              item.quantities.ordered !== undefined
                                ? String(item.quantities.ordered)
                                : empty
                            }
                            disabled
                          />
                        </Form.Item>
                        <Form.Item className="input" label={t('salesOrders.fields.assignedQuantity')}>
                          <Input
                            className="input"
                            size="large"
                            placeholder={
                              item.quantities.assigned !== undefined
                                ? String(item.quantities.assigned)
                                : empty
                            }
                            disabled
                          />
                        </Form.Item>
                        <Form.Item className="input" label={t('salesOrders.fields.deliveredQuantity')}>
                          <Input
                            className="input"
                            size="large"
                            placeholder={
                              item.quantities.delivered !== undefined
                                ? String(item.quantities.delivered)
                                : empty
                            }
                            disabled
                          />
                        </Form.Item>
                        <Form.Item className="input" label={t('salesOrders.fields.unitPrice')}>
                          <Input
                            className="input"
                            size="large"
                            placeholder={
                              item.commercial?.unitPrice !== undefined
                                ? String(item.commercial.unitPrice)
                                : empty
                            }
                            disabled
                          />
                        </Form.Item>
                        <Form.Item className="input" label={t('salesOrders.fields.amount')}>
                          <Input
                            className="input"
                            size="large"
                            placeholder={
                              item.commercial?.amount !== undefined
                                ? String(item.commercial.amount)
                                : empty
                            }
                            disabled
                          />
                        </Form.Item>
                        <Form.Item className="input" label={t('salesOrders.fields.comment')}>
                          <Input className="input" size="large" placeholder={item.comment ?? empty} disabled />
                        </Form.Item>
                      </div>
                    ))
                  ) : (
                    <Input className="input" size="large" placeholder={empty} disabled />
                  )}
                </div>

                <div className="form-divider-title">
                  <h4 className="title">{t('salesOrders.sections.comment')}</h4>
                </div>
                <div className="form-inputs">
                  <Form.Item className="input" label={t('salesOrders.fields.comment')}>
                    <Input.TextArea className="input" rows={3} disabled placeholder={order.comment ?? empty} />
                  </Form.Item>
                </div>
              </FormComponent>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default SalesOrdersDetails;
