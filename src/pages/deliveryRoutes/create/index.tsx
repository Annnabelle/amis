import { AutoComplete, DatePicker, Form, Input, Select, Tag } from 'antd';
import { DownOutlined, UpOutlined } from '@ant-design/icons';
import type { ChangeEvent } from 'react';
import MainLayout from 'shared/ui/layout';
import Heading from 'shared/ui/mainHeading';
import CustomButton from 'shared/ui/button';
import FormComponent from 'shared/ui/formComponent';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from 'app/store';
import { toast } from 'react-toastify';
import { useEffect, useMemo, useRef, useState } from 'react';
import { createDeliveryRoute } from 'entities/deliveryRoutes/model';
import { mapDeliveryRouteFormToCreateDto, type DeliveryRouteFormValues } from 'entities/deliveryRoutes/mappers';
import { getBackendErrorMessage } from 'shared/lib/getBackendErrorMessage.ts';
import { getSalesOrders } from 'entities/salesOrders/model';
import { searchUsers } from 'entities/users/model';
import dayjs from 'dayjs';
import ComponentTable from 'shared/ui/table';
import type { AdaptiveColumn } from 'shared/ui/table/types.ts';

const getPriorityColor = (priority?: string) => {
  if (!priority) return 'default';

  switch (priority.toLowerCase()) {
    case 'urgent':
      return 'red';
    case 'high':
      return 'gold';
    case 'normal':
      return 'blue';
    case 'low':
      return 'green';
    default:
      return 'default';
  }
};

const DeliveryRoutesCreate = () => {
  const navigate = useNavigate();
  const { orgId } = useParams<{ orgId: string }>();
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const organizations = useAppSelector((state) => state.organizations.organizations);
  const orders = useAppSelector((state) => state.salesOrders.orders);
  const isOrdersLoading = useAppSelector((state) => state.salesOrders.isLoading);
  const searchedUsers = useAppSelector((state) => state.users.searchedUsers);
  const [form] = Form.useForm<DeliveryRouteFormValues>();
  const [selectedOrderIds, setSelectedOrderIds] = useState<string[]>([]);
  const [selectedCompanyId, setSelectedCompanyId] = useState<string | undefined>(orgId);
  const [expandedCards, setExpandedCards] = useState<Set<number>>(new Set());
  const isSelectingDriverRef = useRef(false);
  const isSelectingAgentRef = useRef(false);
  const companyId = orgId ?? selectedCompanyId;
  const listPath = orgId ? `/organization/${orgId}/delivery-routes` : '/delivery-routes';
  const initialValues = useMemo(
    () => ({
      schedule: {
        routeDate: dayjs(),
      },
    }),
    []
  );

  const normalizePlateNumber = (value: string) => {
    const raw = value.toUpperCase().replace(/[^0-9A-Z]/g, '');
    const region = raw.slice(0, 2).replace(/\D/g, '');
    const rest = raw.slice(2);

    if (!region) {
      return '';
    }

    if (/^[A-Z]/.test(rest)) {
      const letter = rest.slice(0, 1);
      const digits = rest.slice(1, 4).replace(/\D/g, '');
      const tail = rest.slice(4, 7).replace(/[^A-Z]/g, '');
      return [region, letter, digits, tail].filter(Boolean).join(' ').slice(0, 11);
    }

    const lettersIndex = rest.search(/[A-Z]/);
    if (lettersIndex >= 0) {
      const digits = rest.slice(0, 3).replace(/\D/g, '');
      const tail = rest.slice(3).replace(/[^A-Z]/g, '').slice(0, 3);
      return [region, digits, tail].filter(Boolean).join(' ').slice(0, 11);
    }

    const digits = rest.replace(/\D/g, '').slice(0, 6);
    if (digits.length <= 3) {
      return [region, digits].filter(Boolean).join(' ').slice(0, 6);
    }

    return [region, digits.slice(0, 3), digits.slice(3)].filter(Boolean).join(' ').slice(0, 11);
  };

  const handlePlateNumberChange = (event: ChangeEvent<HTMLInputElement>) => {
    const normalized = normalizePlateNumber(event.target.value);
    const vehicle = form.getFieldValue('vehicle') || {};
    form.setFieldsValue({ vehicle: { ...vehicle, plateNumber: normalized } });
  };

  useEffect(() => {
    if (!orgId) return;
    form.setFieldsValue({ companyId: orgId });
    setSelectedCompanyId(orgId);
  }, [form, orgId]);

  useEffect(() => {
    if (!companyId) return;
    setSelectedOrderIds([]);
    dispatch(
      getSalesOrders({
        page: 1,
        limit: 50,
        sortOrder: 'asc',
        companyId,
      })
    );
  }, [dispatch, companyId]);

  const toggleCardExpanded = (index: number) => {
    const newExpanded = new Set(expandedCards);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedCards(newExpanded);
  };

  const expandAllCards = (customersCount: number) => {
    setExpandedCards(new Set(Array.from({ length: customersCount }, (_, i) => i)));
  };

  const collapseAllCards = () => {
    setExpandedCards(new Set());
  };

  const handleCreateDeliveryRoute = async (values: DeliveryRouteFormValues) => {
    const finalCompanyId = orgId ?? values.companyId;
    if (!finalCompanyId) {
      toast.error(t('deliveryRoutes.validation.companyRequired'));
      return;
    }

    if (!selectedOrderIds.length) {
      toast.error(t('deliveryRoutes.validation.salesOrdersRequired'));
      return;
    }

    try {
      const payload = mapDeliveryRouteFormToCreateDto(
        { ...values, salesOrderIds: selectedOrderIds },
        finalCompanyId
      );
      await dispatch(createDeliveryRoute(payload)).unwrap();
      toast.success(t('deliveryRoutes.messages.success.create'));
      form.resetFields();
      navigate(listPath);
    } catch (error: any) {
      toast.error(
        getBackendErrorMessage(error, t('deliveryRoutes.messages.error.create'))
      );
    }
  };

  type AvailableOrderRow = {
    key: string;
    customer: string;
    salesOrderNumber: string;
    dueDate: string;
    priority: string;
    ordered: number;
    assigned: number;
    delivered: number;
    remaining: number;
  };

  const availableOrders = useMemo<AvailableOrderRow[]>(() => {
    if (!companyId) return [];
    return orders
      .map((order) => {
        const ordered = order.totals.orderedQuantity ?? 0;
        const assigned = order.totals.assignedQuantity ?? 0;
        const delivered = order.totals.deliveredQuantity ?? 0;
        const salesOrderNumber = order.salesOrderNumber;
        const remaining = Math.max(0, ordered - assigned);

        return {
          key: order.id,
          customer: order.customer.name,
          dueDate: order.fulfillment.dueDate
            ? dayjs(order.fulfillment.dueDate).format('DD.MM.YYYY')
            : '-',
          priority: t(`salesOrders.priority.${order.fulfillment.priority}`),
          ordered,
          salesOrderNumber,
          assigned,
          delivered,
          remaining,
        };
      })
      .filter((row) => row.remaining > 0);
  }, [orders, t]);

  useEffect(() => {
    const availableIds = new Set(availableOrders.map((row) => row.key));
    setSelectedOrderIds((prev) => prev.filter((id) => availableIds.has(id)));
  }, [availableOrders]);

  const selectedOrdersPreview = useMemo(() => {
    const selectedOrders = orders.filter(order => selectedOrderIds.includes(order.id));

    const uniqueCustomers = new Set(selectedOrders.map(order => order.customer.name));
    const customerCount = uniqueCustomers.size;
    const customerList = Array.from(uniqueCustomers);

    const aggregatedProducts = selectedOrders.reduce((acc, order) => {
      order.items.forEach(item => {
        const productName = item.product.name;
        const quantity = item.quantities.ordered;
        acc[productName] = (acc[productName] || 0) + quantity;
      });
      return acc;
    }, {} as Record<string, number>);

    const totalVolume = selectedOrders.reduce((sum, order) => sum + (order.totals.orderedQuantity ?? 0), 0);
    const totalAmount = selectedOrders.reduce((sum, order) => sum + (order.totals.amount ?? 0), 0);

    const dueDates = selectedOrders.map(order => dayjs(order.fulfillment.dueDate));
    const earliestDueDate = dueDates.length > 0 ? dueDates.reduce((min, date) => date.isBefore(min) ? date : min) : null;
    const latestDueDate = dueDates.length > 0 ? dueDates.reduce((max, date) => date.isAfter(max) ? date : max) : null;

    const priorities = selectedOrders.map(order => order.fulfillment.priority);
    const priorityCounts = priorities.reduce((acc, priority) => {
      acc[priority] = (acc[priority] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const customersDetails = selectedOrders.map(order => ({
      name: order.customer.name,
      tin: order.customer.tin,
      address: order.customer.address,
      salesOrderNumber: order.salesOrderNumber ?? '-',
      contractDate: order.contract?.date ? dayjs(order.contract.date).format('DD.MM.YYYY') : '-',
      dueDate: dayjs(order.fulfillment.dueDate).format('DD.MM.YYYY'),
      priority: order.fulfillment.priority,
      items: order.items.map(item => ({
        productName: item.product.name,
        quantity: item.quantities.ordered,
        unitPrice: item.commercial?.unitPrice ?? 0,
        amount: item.commercial?.amount ?? 0,
        comment: item.comment
      })),
      totalQuantity: order.totals.orderedQuantity,
      totalAmount: order.totals.amount
    }));

    return {
      orderCount: selectedOrderIds.length,
      customerCount,
      customerList,
      aggregatedProducts,
      totalVolume,
      totalAmount,
      earliestDueDate,
      latestDueDate,
      priorityCounts,
      customersDetails,
    };
  }, [selectedOrderIds, orders]);

  const availableOrdersColumns = useMemo<AdaptiveColumn<AvailableOrderRow>[]>(
    () => [
      {
        title: t("salesOrders.table.orderNumber"),
        dataIndex: "salesOrderNumber",
        key: "salesOrderNumber",
        flex: 1.5,
        render: (_, record) => (
          <Link
            className="table-text link"
            to={
              orgId
                ? `/organization/${orgId}/sales-orders/${record.key}`
                : `/sales-orders/${record.key}`
            }
          >
            {record.salesOrderNumber}
          </Link>
        ),
      },
      {
        title: t('salesOrders.table.customerName'),
        dataIndex: 'customer',
        key: 'customer',
        flex: 2,
        render: (text: string) => (
          <p className="table-text" style={{ overflow: 'visible', textOverflow: 'ellipsis' }}>
            {text}
          </p>
        ),
      },
      {
        title: t('salesOrders.table.dueDate'),
        dataIndex: 'dueDate',
        key: 'dueDate',
        flex: 1,
        render: (text: string) => <p className="table-text">{text}</p>,
      },
      {
        title: t('salesOrders.table.priority'),
        dataIndex: 'priority',
        key: 'priority',
        flex: 1,
        render: (text: string) => <p className="table-text">{text}</p>,
      },
      {
        title: t('salesOrders.table.orderedQuantity'),
        dataIndex: 'ordered',
        key: 'ordered',
        flex: 1,
        align: 'center',
        render: (text: number) => (
          <p className="table-text" style={{ textAlign: 'center', width: '100%' }}>
            {text}
          </p>
        ),
      },
      // {
      //   title: t('salesOrders.table.assignedQuantity'),
      //   dataIndex: 'assigned',
      //   key: 'assigned',
      //   flex: 1,
      //   align: 'center',
      //   render: (text: number) => (
      //     <p className="table-text" style={{ textAlign: 'center', width: '100%' }}>
      //       {text}
      //     </p>
      //   ),
      // },
      // {
      //   title: t('salesOrders.table.deliveredQuantity'),
      //   dataIndex: 'delivered',
      //   key: 'delivered',
      //   flex: 1,
      //   align: 'center',
      //   render: (text: number) => (
      //     <p className="table-text" style={{ textAlign: 'center', width: '100%' }}>
      //       {text}
      //     </p>
      //   ),
      // },
      {
        title: t('deliveryRoutes.fields.remainingToAssign'),
        dataIndex: 'remaining',
        key: 'remaining',
        flex: 1,
        align: 'center',
        render: (text: number) => (
          <p className="table-text" style={{ textAlign: 'center', width: '100%' }}>
            {text}
          </p>
        ),
      },
    ],
    [t]
  );

  return (
    <MainLayout>
      <Heading title={t('deliveryRoutes.title')} subtitle={t('common.create')} />
      <div className="box">
        <div className="box-container">
          <div className="box-container-items delivery-route-create-form">
            <FormComponent
              form={form}
              initialValues={initialValues}
              onFinish={handleCreateDeliveryRoute}
              onValuesChange={(changedValues) => {
                if (changedValues.companyId) {
                  setSelectedCompanyId(changedValues.companyId);
                }
              }}
            >
              <div className="form-divider-title">
                <h4 className="title">{t('deliveryRoutes.sections.info')}</h4>
              </div>
              {!orgId && (
                <div className="form-inputs form-inputs-organization">
                  <Form.Item
                    className="input"
                    name="companyId"
                    label={t('deliveryRoutes.fields.company')}
                    rules={[{ required: true, message: t('deliveryRoutes.validation.companyRequired') }]}
                  >
                    <Select
                      className="input"
                      size="large"
                      placeholder={t('deliveryRoutes.placeholders.selectCompany')}
                      options={organizations.map((org) => ({
                        value: org.id,
                        label: org.displayName,
                      }))}
                    />
                  </Form.Item>
                </div>
              )}
              <div className="form-inputs form-inputs-organization">
                <Form.Item
                  className="input"
                  name={["schedule", "routeDate"]}
                  label={t('deliveryRoutes.fields.routeDate')}
                  rules={[{ required: true, message: t('deliveryRoutes.validation.routeDateRequired') }]}
                >
                  <DatePicker className="input" size="large" placeholder={t('deliveryRoutes.placeholders.routeDate')} />
                </Form.Item>
                <Form.Item className="input" name={["vehicle", "name"]} label={t('deliveryRoutes.fields.vehicle')}>
                  <Input className="input" size="large" placeholder={t('deliveryRoutes.placeholders.vehicle')} />
                </Form.Item>
                <Form.Item 
                  className="input" 
                  name={["vehicle", "plateNumber"]} 
                  label={t('deliveryRoutes.fields.plateNumber')}
                  rules={[
                    {
                      validator: async (_, value) => {
                        if (!value) {
                          return Promise.resolve();
                        }

                        const raw = value.replace(/\s+/g, '');
                        const region = parseInt(raw.slice(0, 2), 10);
                        if (Number.isNaN(region) || region < 1 || region > 95) {
                          return Promise.reject(new Error(t('deliveryRoutes.validation.plateNumberInvalid')));
                        }

                        const privatePattern = /^\d{2}[A-Z]\d{3}[A-Z]{2}$/;
                        const businessPattern = /^\d{2}\d{3}[A-Z]{3}$/;
                        const foreignPattern = /^\d{2}\d{6}$/;

                        if (privatePattern.test(raw) || businessPattern.test(raw) || foreignPattern.test(raw)) {
                          return Promise.resolve();
                        }

                        return Promise.reject(new Error(t('deliveryRoutes.validation.plateNumberInvalid')));
                      }
                    }
                  ]}
                >
                  <Input
                    className="input"
                    size="large"
                    placeholder={t('deliveryRoutes.placeholders.plateNumber')}
                    maxLength={11}
                    onChange={handlePlateNumberChange}
                  />
                </Form.Item>
              </div>
              <div className="form-inputs form-inputs-organization">
                <Form.Item className="input" name={["crew", "driverName"]} label={t('deliveryRoutes.fields.driver')}>
                  <AutoComplete
                    className="input"
                    size="large"
                    placeholder={t('deliveryRoutes.placeholders.driver')}
                    filterOption={false}
                    allowClear
                    onSearch={(value) => {
                      if (value.trim()) {
                        dispatch(searchUsers({ query: value, page: 1, limit: 10, sortOrder: 'asc' }));
                      }
                    }}
                    options={searchedUsers.map((user) => ({
                      value: `${user.firstName} ${user.lastName}`,
                      userId: user.id,
                    }))}
                    onSelect={(value, option) => {
                      isSelectingDriverRef.current = true;
                      const currentCrew = form.getFieldValue('crew') || {};
                      form.setFieldsValue({
                        crew: {
                          ...currentCrew,
                          driverName: value,
                          driverId: (option as any)?.userId as string | undefined,
                        },
                      });
                      setTimeout(() => {
                        isSelectingDriverRef.current = false;
                      }, 0);
                    }}
                    onChange={(value) => {
                      if (isSelectingDriverRef.current) {
                        isSelectingDriverRef.current = false;
                        return;
                      }

                      const currentCrew = form.getFieldValue('crew') || {};
                      form.setFieldsValue({
                        crew: {
                          ...currentCrew,
                          driverName: value?.toString() || undefined,
                          driverId: undefined,
                        },
                      });
                    }}
                    onClear={() => {
                      const currentCrew = form.getFieldValue('crew') || {};
                      form.setFieldsValue({
                        crew: {
                          ...currentCrew,
                          driverName: undefined,
                          driverId: undefined,
                        },
                      });
                    }}
                  />
                </Form.Item>
                <Form.Item className="input" name={["crew", "driverId"]} hidden>
                  <Input />
                </Form.Item>

                <Form.Item className="input" name={["crew", "agentName"]} label={t('deliveryRoutes.fields.agent')}>
                  <AutoComplete
                    className="input"
                    size="large"
                    placeholder={t('deliveryRoutes.placeholders.agent')}
                    filterOption={false}
                    allowClear
                    onSearch={(value) => {
                      if (value.trim()) {
                        dispatch(searchUsers({ query: value, page: 1, limit: 10, sortOrder: 'asc' }));
                      }
                    }}
                    options={searchedUsers.map((user) => ({
                      value: `${user.firstName} ${user.lastName}`,
                      userId: user.id,
                    }))}
                    onSelect={(value, option) => {
                      isSelectingAgentRef.current = true;
                      const currentCrew = form.getFieldValue('crew') || {};
                      form.setFieldsValue({
                        crew: {
                          ...currentCrew,
                          agentName: value,
                          agentId: (option as any)?.userId as string | undefined,
                        },
                      });
                      setTimeout(() => {
                        isSelectingAgentRef.current = false;
                      }, 0);
                    }}
                    onChange={(value) => {
                      if (isSelectingAgentRef.current) {
                        isSelectingAgentRef.current = false;
                        return;
                      }

                      const currentCrew = form.getFieldValue('crew') || {};
                      form.setFieldsValue({
                        crew: {
                          ...currentCrew,
                          agentName: value?.toString() || undefined,
                          agentId: undefined,
                        },
                      });
                    }}
                    onClear={() => {
                      const currentCrew = form.getFieldValue('crew') || {};
                      form.setFieldsValue({
                        crew: {
                          ...currentCrew,
                          agentName: undefined,
                          agentId: undefined,
                        },
                      });
                    }}
                  />
                </Form.Item>
                <Form.Item className="input" name={["crew", "agentId"]} hidden>
                  <Input />
                </Form.Item>
              </div>

              <div className="form-divider-title">
                <h4 className="title">{t('deliveryRoutes.sections.availableOrders')}</h4>
              </div>
              <div className="table-wrapper" style={{ overflowX: 'auto' }}>
                <ComponentTable<AvailableOrderRow>
                  columns={availableOrdersColumns}
                  data={availableOrders}
                  loading={isOrdersLoading}
                  pagination={false}
                  rowSelection={{
                    selectedRowKeys: selectedOrderIds,
                    onChange: (keys) => setSelectedOrderIds(keys as string[]),
                    hideSelectAll: true,
                  }}
                />
              </div>

              <div className="form-divider-title">
                <h4 className="title">{t('deliveryRoutes.sections.preview')}</h4>
              </div>

              {selectedOrderIds.length > 0 && (
                // <div className="route-preview">
                  <div className="route-preview-section">
                    {/* <h5 className="section-title"><InboxOutlined /> {t('deliveryRoutes.preview.selectedOrders')}</h5> */}
                    <div className="route-preview-orders-details">
                      {selectedOrdersPreview.customersDetails.length > 0 && (
                        <div className="expand-controls">
                          <button 
                            className="expand-btn expand-all" 
                            onClick={() => expandAllCards(selectedOrdersPreview.customersDetails.length)}
                          >
                            <DownOutlined /> {t('common.expandAll')}
                          </button>
                          <button 
                            className="expand-btn collapse-all" 
                            onClick={collapseAllCards}
                          >
                            <UpOutlined /> {t('common.collapseAll')}
                          </button>
                        </div>
                      )}
                      {selectedOrdersPreview.customersDetails.map((customer, index) => (
                        <div 
                          key={index} 
                          className={`order-detail-card ${expandedCards.has(index) ? 'expanded' : 'collapsed'}`}
                        >
                          <div 
                            className="order-header"
                            onClick={() => toggleCardExpanded(index)}
                            style={{ cursor: 'pointer' }}
                          >
                            <div className="expand-icon">
                              {expandedCards.has(index) ? <UpOutlined /> : <DownOutlined />}
                            </div>
                            <div className="customer-info">
                              <h6 className="customer-name">{customer.name}</h6>
                              <div className="customer-details">
                                <span className="detail-item">
                                  <span className="label">{t('deliveryRoutes.preview.tin')}:</span> {customer.tin}
                                </span>
                                <span className="detail-item">
                                  <span className="label">{t('deliveryRoutes.preview.address')}:</span> {customer.address}
                                </span>
                                <span className="detail-item">
                                  <span className="label">{t('salesOrders.fields.orderNumber')}:</span> {customer.salesOrderNumber}
                                </span>
                                <span className="detail-item">
                                  <span className="label">{t('deliveryRoutes.preview.contractDate')}:</span> {customer.contractDate}
                                </span>
                                <span className="detail-item highlight">
                                  <span className="label">{t('deliveryRoutes.preview.orderedQuantity')}:</span> {customer.totalQuantity}
                                </span>
                                <span className="detail-item highlight">
                                  <span className="label">{t('deliveryRoutes.preview.totalAmount')}:</span> {customer.totalAmount}
                                </span>
                              </div>
                            </div>
                            <div className="order-meta">
                              <Tag color={getPriorityColor(customer.priority)} style={{ margin: 0 }}>
                                {t(`salesOrders.priority.${customer.priority}`)}
                              </Tag>
                              <span className="due-date">{customer.dueDate}</span>
                            </div>
                          </div>

                          {expandedCards.has(index) && (
                            <div className="items-table">
                              <div className="table-header">
                                <span className="col-product">{t('salesOrders.fields.product')}</span>
                                <span className="col-quantity">{t('deliveryRoutes.preview.orderedQuantity')}</span>
                                <span className="col-price">{t('deliveryRoutes.preview.unitPrice')}</span>
                                <span className="col-amount">{t('deliveryRoutes.preview.amount')}</span>
                                <span className="col-comment">{t('deliveryRoutes.preview.comment')}</span>
                              </div>
                              {customer.items.map((item, itemIndex) => (
                                <div key={itemIndex} className="table-row">
                                  <span className="col-product">{item.productName}</span>
                                  <span className="col-quantity">{item.quantity}</span>
                                  <span className="col-price">{item.unitPrice}</span>
                                  <span className="col-amount">{item.amount}</span>
                                  <span className="col-comment">{item.comment || '-'}</span>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}

                      <div className="orders-summary">
                        <div className="summary-stats">
                          <div className="stat">
                            <span className="stat-label">{t('deliveryRoutes.preview.ordersSelected')}:</span>
                            <span className="stat-value">{selectedOrdersPreview.orderCount}</span>
                          </div>
                          <div className="stat">
                            <span className="stat-label">{t('deliveryRoutes.preview.totalVolume')}:</span>
                            <span className="stat-value">{selectedOrdersPreview.totalVolume}</span>
                          </div>
                          <div className="stat">
                            <span className="stat-label">{t('deliveryRoutes.preview.totalAmount')}:</span>
                            <span className="stat-value">{selectedOrdersPreview.totalAmount}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                // {/* </div> */}
              )}

              <div className="form-btns-group">
                <CustomButton className="outline" onClick={() => navigate(listPath)}>
                  {t('btn.cancel')}
                </CustomButton>
                <CustomButton type="submit">{t('deliveryRoutes.actions.create')}</CustomButton>
              </div>
            </FormComponent>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default DeliveryRoutesCreate;
