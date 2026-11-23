import { AutoComplete, DatePicker, Form, Input, Select } from 'antd';
import { notify } from 'shared/lib/notify';
import { routes } from "shared/config/routes";
import MainLayout from 'widgets/appShell';
import Heading from 'shared/ui/mainHeading';
import CustomButton from 'shared/ui/button';
import FormComponent from 'shared/ui/formComponent';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useCreateDeliveryRouteMutation } from 'entities/deliveryRoutes/api';
import { mapDeliveryRouteFormToCreateDto, type DeliveryRouteFormValues } from 'entities/deliveryRoutes/mappers';
import { getApiErrorMessage } from 'shared/api';
import { useSubmitGuard } from 'shared/lib/useSubmitGuard';
import { useGetSalesOrdersQuery } from 'entities/salesOrders/api';
import { useSearchCompanyMembershipsQuery } from 'entities/companyMemberships/api';
import { CompanyMembershipState, CompanyRole } from 'entities/companyMemberships/types';
import { useGetVehiclesQuery } from 'entities/vehicles/api';
import { useGetCompaniesQuery } from 'entities/organization/api';
import { useAppDispatch } from 'app/store';
import { VehicleFormModal } from 'entities/vehicles/ui/vehicleFormModal';
import type { Vehicle } from 'entities/vehicles/types';
import dayjs from 'dayjs';
import ComponentTable from 'shared/ui/table';
import type { AdaptiveColumn } from 'shared/ui/table/types';
import { PermissionLink, RequiredDataAlert } from 'entities/access/ui';
import { endpointAccessMap } from 'shared/config/endpointAccessMap';

import { buildOrderSelectionSummary } from 'features/deliveryRouteCreate/lib/orderSelectionSummary';
import {
  buildAvailableOrders,
  formatVehicleLabel,
  hasNoVehicleMatches,
  type AvailableOrderRow,
} from 'features/deliveryRouteCreate/lib/availableOrders';
import SelectedOrdersPreview from 'features/deliveryRouteCreate/ui/selectedOrdersPreview';
/** Вариант в подсказке экипажа: кроме подписи нужен id сотрудника. */
type CrewMemberOption = {
  value: string;
  userId: string;
};

const DeliveryRoutesCreate = () => {
  const navigate = useNavigate();
  const { orgId } = useParams<{ orgId: string }>();
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { data: companiesPage } = useGetCompaniesQuery(
    { page: 1, limit: 1000, sortOrder: 'asc' },
    { skip: Boolean(orgId) }
  );
  const organizations = useMemo(
    () => companiesPage?.items ?? [],
    [companiesPage]
  );


  const [createDeliveryRoute] = useCreateDeliveryRouteMutation();
  /** Поиск сотрудника идёт по введённой строке и роли поля, которое его просит. */
  const [membershipSearch, setMembershipSearch] = useState<{
    query: string;
    role: CompanyRole;
  } | null>(null);
  const [form] = Form.useForm<DeliveryRouteFormValues>();
  const [selectedOrderIds, setSelectedOrderIds] = useState<string[]>([]);
  const [selectedCompanyId, setSelectedCompanyId] = useState<string | undefined>(orgId);
  const [vehicleSearchValue, setVehicleSearchValue] = useState('');
  const [isVehicleModalOpen, setIsVehicleModalOpen] = useState(false);
  const isSelectingDriverRef = useRef(false);
  const isSelectingAgentRef = useRef(false);
  const companyId = orgId ?? selectedCompanyId;
  const {
    data: ordersPage,
    isFetching: isOrdersLoading,
    error: ordersRequestError,
  } = useGetSalesOrdersQuery(
    { page: 1, limit: 50, sortOrder: 'asc' },
    { skip: !companyId }
  );
  const orders = useMemo(() => ordersPage?.items ?? [], [ordersPage]);
  const ordersError = ordersRequestError
    ? getApiErrorMessage(ordersRequestError, t('common.error'))
    : null;
  const {
    data: vehiclesPage,
    isFetching: isVehiclesLoading,
    error: vehiclesRequestError,
  } = useGetVehiclesQuery(
    { page: 1, limit: 100, sortOrder: 'asc' },
    { skip: !companyId }
  );
  const vehicles = useMemo(() => vehiclesPage?.items ?? [], [vehiclesPage]);
  const {
    data: searchedMembershipsPage,
    error: companyMembershipsRequestError,
  } = useSearchCompanyMembershipsQuery(
    {
      companyId: companyId ?? '',
      query: membershipSearch?.query ?? '',
      page: 1,
      limit: 10,
      state: CompanyMembershipState.Active,
      role: membershipSearch?.role,
    },
    { skip: !companyId || !membershipSearch }
  );
  const searchedMemberships = useMemo(
    () => searchedMembershipsPage?.items ?? [],
    [searchedMembershipsPage]
  );
  const companyMembershipsError = companyMembershipsRequestError
    ? getApiErrorMessage(companyMembershipsRequestError, t('users.messages.error.loadUsers'))
    : null;
  const vehiclesError = vehiclesRequestError
    ? getApiErrorMessage(vehiclesRequestError, t('vehicles.messages.error.load'))
    : null;
  const listPath = orgId ? routes.deliveryRoutes(orgId) : routes.companies();
  const initialValues = useMemo(
    () => ({
      schedule: {
        routeDate: dayjs(),
      },
    }),
    []
  );

  useEffect(() => {
    if (!orgId) return;
    form.setFieldsValue({ companyId: orgId });
    setSelectedCompanyId(orgId);
  }, [form, orgId]);

  useEffect(() => {
    if (!companyId) return;
    setSelectedOrderIds([]);
  }, [dispatch, companyId]);

  const handleCreateDeliveryRoute = async (values: DeliveryRouteFormValues) => {
    const finalCompanyId = orgId ?? values.companyId;
    if (!finalCompanyId) {
      notify.error(t('deliveryRoutes.validation.companyRequired'));
      return;
    }

    if (!selectedOrderIds.length) {
      notify.error(t('deliveryRoutes.validation.salesOrdersRequired'));
      return;
    }

    try {
      const payload = mapDeliveryRouteFormToCreateDto(
        { ...values, salesOrderIds: selectedOrderIds },
        finalCompanyId
      );
      await createDeliveryRoute(payload).unwrap();
      notify.success(t('deliveryRoutes.messages.success.create'));
      form.resetFields();
      navigate(listPath);
    } catch (error: unknown) {
      notify.error(
        getApiErrorMessage(error, t('deliveryRoutes.messages.error.create'))
      );
    }
  };

  const { isSubmitting, onSubmit } = useSubmitGuard(handleCreateDeliveryRoute);

  const handleUserSearch = (value: string, role: CompanyRole) => {
    if (!value.trim() || !companyId) return;

    setMembershipSearch({ query: value, role });
  };

  const availableOrders = useMemo(
    () => (companyId ? buildAvailableOrders(orders, t) : []),
    [companyId, orders, t]
  );

  useEffect(() => {
    const availableIds = new Set(availableOrders.map((row) => row.key));
    setSelectedOrderIds((prev) => prev.filter((id) => availableIds.has(id)));
  }, [availableOrders]);

  const selectedOrdersPreview = useMemo(
    () => buildOrderSelectionSummary(orders, selectedOrderIds),
    [orders, selectedOrderIds]
  );

  const vehicleOptions = useMemo(
    () =>
      vehicles.map((vehicle) => ({
        value: vehicle.id,
        label: formatVehicleLabel(vehicle),
        vehicle,
      })),
    [vehicles]
  );

  const noVehicleMatches = useMemo(
    () => hasNoVehicleMatches(vehicleOptions, vehicleSearchValue, isVehiclesLoading),
    [isVehiclesLoading, vehicleOptions, vehicleSearchValue]
  );

  const selectedVehicleId = Form.useWatch(['vehicle', 'vehicleId'], form);
  const selectedVehicle = useMemo(
    () => vehicles.find((vehicle) => vehicle.id === selectedVehicleId) ?? null,
    [vehicles, selectedVehicleId]
  );

  const applyVehicle = (vehicle: Vehicle) => {
    form.setFieldsValue({
      vehicle: {
        vehicleId: vehicle.id,
        name: vehicle.name,
        plateNumber: vehicle.plateNumber,
      },
    });
    setVehicleSearchValue('');
  };

  const clearVehicle = () => {
    form.setFieldsValue({
      vehicle: { vehicleId: undefined, name: undefined, plateNumber: undefined },
    });
  };

  const availableOrdersColumns = useMemo<AdaptiveColumn<AvailableOrderRow>[]>(
    () => [
      {
        title: t("salesOrders.table.orderNumber"),
        dataIndex: "salesOrderNumber",
        key: "salesOrderNumber",
        flex: 1,
        render: (_, record) => (
          <PermissionLink
            endpoint={endpointAccessMap.salesOrdersRead}
            className="table-text link"
            to={
              orgId
                ? routes.salesOrder(orgId, record.key)
                : routes.companies()
            }
          >
            {record.salesOrderNumber}
          </PermissionLink>
        ),
      },
      {
        title: t('salesOrders.table.customerName'),
        dataIndex: 'customer',
        key: 'customer',
        flex: 1,
        render: (text: string) => (
          <p className="table-text">
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
          <p className="table-text table-text-center">
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
      //     <p className="table-text table-text-center">
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
      //     <p className="table-text table-text-center">
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
          <p className="table-text table-text-center">
            {text}
          </p>
        ),
      },
    ],
    [orgId, t]
  );

  return (
    <MainLayout>
      <Heading title={t('deliveryRoutes.title')} subtitle={t('common.create')} />
      <RequiredDataAlert
        endpoints={[
          endpointAccessMap.salesOrdersList,
          endpointAccessMap.companyMembershipsSearch,
          endpointAccessMap.vehiclesList,
        ]}
        errors={[ordersError, companyMembershipsError, vehiclesError]}
      />
      <div className="box">
        <div className="box-container">
          <div className="box-container-items delivery-route-create-form">
            <FormComponent
              form={form}
              initialValues={initialValues}
              onFinish={onSubmit}
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
                  name={["vehicle", "vehicleId"]}
                  label={t('deliveryRoutes.fields.vehicle')}
                >
                  <Select
                    className="input"
                    size="large"
                    allowClear
                    showSearch
                    loading={isVehiclesLoading}
                    options={vehicleOptions}
                    optionFilterProp="label"
                    placeholder={t('vehicles.placeholders.selectVehicle')}
                    searchValue={vehicleSearchValue}
                    onSearch={(value) => setVehicleSearchValue(value)}
                    notFoundContent={
                      noVehicleMatches ? (
                        <div className="vehicle-select-empty">
                          <p className="vehicle-select-empty-text">
                            {t('deliveryRoutes.vehicleCard.notFound')}
                          </p>
                          <CustomButton
                            type="button"
                            size="sm"
                            onClick={() => setIsVehicleModalOpen(true)}
                          >
                            {t('vehicles.actions.create')}
                          </CustomButton>
                        </div>
                      ) : null
                    }
                    onSelect={(_, option) => applyVehicle(option.vehicle)}
                    onClear={clearVehicle}
                  />
                </Form.Item>
                <Form.Item
                  className="input"
                  name={["schedule", "routeDate"]}
                  label={t('deliveryRoutes.fields.routeDate')}
                  rules={[{ required: true, message: t('deliveryRoutes.validation.routeDateRequired') }]}
                >
                  <DatePicker className="input" size="large" placeholder={t('deliveryRoutes.placeholders.routeDate')} />
                </Form.Item>
                <Form.Item className="input" name={["vehicle", "name"]} hidden>
                  <Input />
                </Form.Item>
                <Form.Item className="input" name={["vehicle", "plateNumber"]} hidden>
                  <Input />
                </Form.Item>
              </div>

              {selectedVehicle && (
                <div className="vehicle-select-card">
                  <div className="vehicle-select-card-header">
                    <span className="vehicle-select-card-name">{selectedVehicle.name}</span>
                    <span className="vehicle-select-card-plate">{selectedVehicle.plateNumber}</span>
                    <button
                      type="button"
                      className="vehicle-select-card-clear"
                      onClick={clearVehicle}
                    >
                      {t('common.change')}
                    </button>
                  </div>
                  <div className="vehicle-select-card-details">
                    <span className="detail-item">
                      <span className="label">{t('vehicles.fields.type')}:</span>{' '}
                      {t(`vehicles.types.${selectedVehicle.type}`)}
                    </span>
                    <span className="detail-item">
                      <span className="label">{t('vehicles.fields.brand')}:</span>{' '}
                      {selectedVehicle.characteristics.brand}
                    </span>
                    <span className="detail-item">
                      <span className="label">{t('vehicles.fields.model')}:</span>{' '}
                      {selectedVehicle.characteristics.model}
                    </span>
                    {selectedVehicle.characteristics.loadCapacityKg != null && (
                      <span className="detail-item">
                        <span className="label">{t('vehicles.fields.loadCapacityKg')}:</span>{' '}
                        {selectedVehicle.characteristics.loadCapacityKg}
                      </span>
                    )}
                    {selectedVehicle.characteristics.volumeCapacityM3 != null && (
                      <span className="detail-item">
                        <span className="label">{t('vehicles.fields.volumeCapacityM3')}:</span>{' '}
                        {selectedVehicle.characteristics.volumeCapacityM3}
                      </span>
                    )}
                  </div>
                </div>
              )}
              <div className="form-inputs form-inputs-organization">
                <Form.Item className="input" name={["crew", "driverName"]} label={t('deliveryRoutes.fields.driver')}>
                  <AutoComplete<string, CrewMemberOption>
                    className="input"
                    size="large"
                    placeholder={t('deliveryRoutes.placeholders.driver')}
                    filterOption={false}
                    allowClear
                    onSearch={(value) => handleUserSearch(value, CompanyRole.Driver)}
                    options={searchedMemberships.map((membership) => ({
                      value: `${membership.user?.firstName ?? ''} ${membership.user?.lastName ?? ''}`.trim(),
                      userId: membership.userId,
                    }))}
                    onSelect={(value, option) => {
                      isSelectingDriverRef.current = true;
                      const currentCrew = form.getFieldValue('crew') || {};
                      form.setFieldsValue({
                        crew: {
                          ...currentCrew,
                          driverName: value,
                          driverId: option.userId,
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
                  <AutoComplete<string, CrewMemberOption>
                    className="input"
                    size="large"
                    placeholder={t('deliveryRoutes.placeholders.agent')}
                    filterOption={false}
                    allowClear
                    onSearch={(value) => handleUserSearch(value, CompanyRole.DeliveryAgent)}
                    options={searchedMemberships.map((membership) => ({
                      value: `${membership.user?.firstName ?? ''} ${membership.user?.lastName ?? ''}`.trim(),
                      userId: membership.userId,
                    }))}
                    onSelect={(value, option) => {
                      isSelectingAgentRef.current = true;
                      const currentCrew = form.getFieldValue('crew') || {};
                      form.setFieldsValue({
                        crew: {
                          ...currentCrew,
                          agentName: value,
                          agentId: option.userId,
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
              <div className="delivery-route-orders-table">
                <ComponentTable<AvailableOrderRow>
                  columns={availableOrdersColumns}
                  data={availableOrders}
                  loading={isOrdersLoading}
                  pagination={false}
                  scroll={false}
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
                <SelectedOrdersPreview summary={selectedOrdersPreview} />
              )}
              <div className="form-btns-group">
                <CustomButton variant="outline" onClick={() => navigate(listPath)}>
                  {t('btn.cancel')}
                </CustomButton>
                <CustomButton
                  type="submit"
                  loading={isSubmitting}
                  disabled={
                    isOrdersLoading || Boolean(ordersError) || Boolean(companyMembershipsError)
                  }
                >
                  {t('deliveryRoutes.actions.create')}
                </CustomButton>
              </div>
            </FormComponent>
          </div>
        </div>
      </div>
      <VehicleFormModal
        mode="create"
        open={isVehicleModalOpen}
        onClose={() => setIsVehicleModalOpen(false)}
        companyId={companyId}
        initialPlateNumber={vehicleSearchValue}
        onSaved={(vehicle) => {
          applyVehicle(vehicle);
          setIsVehicleModalOpen(false);
        }}
      />
    </MainLayout>
  );
};

export default DeliveryRoutesCreate;
