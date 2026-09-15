import { useEffect, useMemo } from 'react';
import { Empty, Spin } from 'antd';
import MainLayout from 'shared/ui/layout';
import Heading from 'shared/ui/mainHeading';
import CustomButton from 'shared/ui/button';
import StatusBadge from 'shared/ui/statusBadge';
import { getSalesOrderStatusBadgeVariant } from 'shared/ui/statusBadge/variants';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import dayjs from 'dayjs';
import { useAppDispatch, useAppSelector } from 'app/store';
import { getSalesOrderById } from 'entities/salesOrders/model';
import { fetchDistrictsByRegion, fetchRegions } from 'entities/references/model';
import type { Reference } from 'entities/references/types';
import { UserPreviewCardById } from 'entities/users/ui/userPreviewCard';
import type { SalesOrderAddressResponse } from 'entities/salesOrders/types';
import { isLanguage } from 'shared/types/dtos';
import {
  DetailCard,
  DetailGrid,
  DetailItems,
  DetailStat,
  DetailStatsGrid,
  RouteMetaChip,
} from 'shared/ui/details';
import './styles.sass';

const SalesOrdersDetails = () => {
  const navigate = useNavigate();
  const { orgId, id } = useParams<{ orgId: string; id: string }>();
  const { t, i18n } = useTranslation();
  const dispatch = useAppDispatch();
  const order = useAppSelector((state) => state.salesOrders.orderById);
  const isLoading = useAppSelector((state) => state.salesOrders.isLoading);
  const { references, districtsByRegionId } = useAppSelector((state) => state.references);
  const currentLanguage = isLanguage(i18n.language) ? i18n.language : 'ru';
  const regions = references.regions ?? [];
  const empty = '-';
  const listPath = orgId
    ? `/organization/${orgId}/sales-orders`
    : '/organization';

  useEffect(() => {
    if (!id) return;
    dispatch(getSalesOrderById({ id }));
  }, [dispatch, id]);

  useEffect(() => {
    dispatch(fetchRegions());
  }, [dispatch]);

  const senderRegionId = order?.sender?.addressDetails.regionId;
  const customerRegionId = order?.customer.addressDetails.regionId;

  useEffect(() => {
    [senderRegionId, customerRegionId].forEach((regionId) => {
      if (regionId && !districtsByRegionId[regionId]) {
        dispatch(fetchDistrictsByRegion(regionId));
      }
    });
  }, [senderRegionId, customerRegionId, districtsByRegionId, dispatch]);

  const items = useMemo(() => order?.items ?? [], [order]);

  const formatOptionalNumber = (value?: number) =>
    value !== undefined ? new Intl.NumberFormat(undefined, { maximumFractionDigits: 2 }).format(value) : empty;
  const formatCurrency = (value?: number) =>
    value !== undefined ? `${formatOptionalNumber(value)} ${t('waybills.fields.sum')}` : empty;
  const formatDistance = (value?: number) =>
    value !== undefined ? `${formatOptionalNumber(value)} ${t('waybills.units.km', { defaultValue: 'км' })}` : empty;
  const formatLocation = (addressDetails: SalesOrderAddressResponse) =>
    addressDetails.location
      ? `${addressDetails.location.latitude}, ${addressDetails.location.longitude}`
      : empty;

  const getReferenceValue = (reference: Reference) => reference.id ?? reference.alias;
  const getReferenceLabel = (reference: Reference) =>
    reference.title[currentLanguage] || reference.title.ru || reference.alias;

  const getRegionLabel = (regionId?: string) => {
    if (!regionId) return empty;
    if (regions.length === 0) return '';
    const region = regions.find((item) => getReferenceValue(item) === regionId);
    return region ? getReferenceLabel(region) : regionId;
  };

  const getDistrictLabel = (regionId?: string, districtId?: string) => {
    if (!regionId || !districtId) return empty;
    const districts = districtsByRegionId[regionId];
    if (!districts) return '';
    const district = districts.find((item) => getReferenceValue(item) === districtId);
    return district ? getReferenceLabel(district) : districtId;
  };

  if (isLoading || !order || order.id !== id) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-96">
          <Spin size="large" />
        </div>
      </MainLayout>
    );
  }

  const headerMetaChips = [
    {
      label: t('salesOrders.fields.dueDate'),
      value: order.fulfillment.dueDate ? dayjs(order.fulfillment.dueDate).format('DD.MM.YYYY') : empty,
    },
    { label: t('salesOrders.fields.priority'), value: t(`salesOrders.priority.${order.fulfillment.priority}`) },
    {
      label: t('salesOrders.fields.paymentMethod'),
      value: order.fulfillment.paymentMethod
        ? t(`salesOrders.paymentMethods.${order.fulfillment.paymentMethod}`)
        : empty,
    },
  ];

  const senderItems = order.sender
    ? [
        { label: t('salesOrders.createFields.region'), value: getRegionLabel(order.sender.addressDetails.regionId) },
        {
          label: t('salesOrders.createFields.district'),
          value: getDistrictLabel(order.sender.addressDetails.regionId, order.sender.addressDetails.districtId),
        },
        { label: t('salesOrders.createFields.address'), value: order.sender.addressDetails.address ?? empty },
        { label: t('salesOrders.fields.location'), value: formatLocation(order.sender.addressDetails) },
      ]
    : [];

  const customerItems = [
    { label: t('salesOrders.createFields.companyName'), value: order.customer.name },
    { label: t('salesOrders.createFields.companyTin'), value: order.customer.tin },
    {
      label: t('salesOrders.createFields.companyAddress'),
      value: order.customer.addressDetails.address || order.customer.address || empty,
    },
    { label: t('salesOrders.createFields.region'), value: getRegionLabel(order.customer.addressDetails.regionId) },
    {
      label: t('salesOrders.createFields.district'),
      value: getDistrictLabel(order.customer.addressDetails.regionId, order.customer.addressDetails.districtId),
    },
    { label: t('salesOrders.fields.location'), value: formatLocation(order.customer.addressDetails) },
  ];

  const contractItems = [
    { label: t('salesOrders.fields.contractNumber'), value: order.contract?.number ?? empty },
    {
      label: t('salesOrders.fields.contractDate'),
      value: order.contract?.date ? dayjs(order.contract.date).format('DD.MM.YYYY') : empty,
    },
  ];

  const deliveryItems = order.delivery
    ? [
        {
          label: t('waybills.fields.deliveryType'),
          value: t(`waybills.deliveryTypes.${order.delivery.type}`, { defaultValue: order.delivery.type }),
        },
        { label: t('waybills.fields.costPerDistanceUnit'), value: formatCurrency(order.delivery.costPerDistanceUnit) },
        { label: t('waybills.fields.totalDistance'), value: formatDistance(order.delivery.totalDistance) },
        { label: t('waybills.fields.deliveryTotalCost'), value: formatCurrency(order.delivery.totalCost) },
      ]
    : [];

  const totalStats = [
    { label: t('salesOrders.fields.orderedQuantity'), value: order.totals.orderedQuantity ?? empty },
    { label: t('salesOrders.fields.assignedQuantity'), value: order.totals.assignedQuantity ?? empty },
    { label: t('salesOrders.fields.deliveredQuantity'), value: order.totals.deliveredQuantity ?? empty },
    { label: t('salesOrders.fields.amount'), value: order.totals.amount ?? empty },
  ];

  return (
    <MainLayout>
      <Heading title={t('salesOrders.detailsTitle')} subtitle={t('common.details')}>
        <div className="btns-group">
          <CustomButton variant="outline" onClick={() => navigate(listPath)}>
            {t('common.backToList')}
          </CustomButton>
        </div>
      </Heading>
      <div className="box">
        <div className="box-container">
          <div className="box-container-items">
            <div className="route-overview-card">
              <div className="route-overview-head">
                <div className="route-overview-title">
                  <span className="label">{t('salesOrders.fields.orderNumber')}</span>
                  <h2>{order.salesOrderNumber}</h2>
                </div>
                <div className="route-overview-status">
                  <span className="label inline-label">{t('salesOrders.fields.status')}</span>
                  <span className="detail-separator">:</span>
                  <StatusBadge variant={getSalesOrderStatusBadgeVariant(order.status)}>
                    {t(`salesOrders.statuses.${order.status}`)}
                  </StatusBadge>
                </div>
              </div>
              <div className="route-overview-meta">
                {headerMetaChips.map((item) => (
                  <RouteMetaChip key={String(item.label)} label={item.label} value={item.value} />
                ))}
              </div>
              {(order.createdAt || order.createdBy) && (
                <DetailGrid variant="single" style={{ marginTop: 16, marginBottom: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
                    {order.createdBy && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span className="label inline-label">{t('common.createdBy')}:</span>
                        <UserPreviewCardById userId={order.createdBy} compact />
                      </div>
                    )}
                    {order.createdAt && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span className="label inline-label">{t('salesOrders.fields.createdAt')}:</span>
                        <span className="value">{dayjs(order.createdAt).format('DD.MM.YYYY')}</span>
                      </div>
                    )}
                  </div>
                </DetailGrid>
              )}
            </div>

            <DetailGrid variant="main">
              {senderItems.length > 0 && (
                <DetailCard title={t('salesOrders.createSections.sender')}>
                  <DetailItems items={senderItems} />
                </DetailCard>
              )}
              <DetailCard title={t('salesOrders.sections.customer')}>
                <DetailItems items={customerItems} />
              </DetailCard>
            </DetailGrid>

            <DetailGrid variant="main">
              {deliveryItems.length > 0 && (
                <DetailCard title={t('waybills.sections.delivery')}>
                  <DetailItems items={deliveryItems} />
                </DetailCard>
              )}
              <DetailCard title={t('salesOrders.sections.contract')}>
                <DetailItems items={contractItems} />
              </DetailCard>
            </DetailGrid>

            <DetailGrid variant="single">
              <DetailCard full title={t('salesOrders.sections.totals')}>
                <DetailStatsGrid>
                  {totalStats.map((stat) => (
                    <DetailStat key={String(stat.label)} label={stat.label} value={stat.value} />
                  ))}
                </DetailStatsGrid>
              </DetailCard>
            </DetailGrid>

            <DetailGrid variant="single">
              <DetailCard full title={t('salesOrders.sections.items')}>
                {items.length === 0 ? (
                  <Empty description={t('salesOrders.details.itemsEmpty')} />
                ) : (
                  <div className="sales-order-items-table">
                    <div className="sales-order-items-head">
                      <span>{t('salesOrders.fields.product')}</span>
                      <span>{t('salesOrders.fields.orderedQuantityShort', { defaultValue: t('salesOrders.fields.orderedQuantity') })}</span>
                      <span>{t('salesOrders.fields.assignedQuantityShort', { defaultValue: t('salesOrders.fields.assignedQuantity') })}</span>
                      <span>{t('salesOrders.fields.deliveredQuantityShort', { defaultValue: t('salesOrders.fields.deliveredQuantity') })}</span>
                      <span>{t('salesOrders.fields.price', { defaultValue: t('salesOrders.fields.unitPrice') })}</span>
                      <span>{t('salesOrders.fields.amountShort', { defaultValue: t('salesOrders.fields.amount') })}</span>
                    </div>
                    {items.map((item) => (
                      <div key={item.id} className="sales-order-item-row">
                        <div className="sales-order-item-product">
                          <span className="sales-order-item-name">{item.product.name}</span>
                          {item.packageCode && (
                            <span className="sales-order-item-subname">{item.packageCode}</span>
                          )}
                          {item.comment && (
                            <span className="sales-order-item-subname">{item.comment}</span>
                          )}
                        </div>
                        <div className="sales-order-item-cell">
                          <span className="sales-order-item-cell-label">
                            {t('salesOrders.fields.orderedQuantityShort', { defaultValue: t('salesOrders.fields.orderedQuantity') })}
                          </span>
                          <span>{item.quantities.ordered ?? empty}</span>
                        </div>
                        <div className="sales-order-item-cell">
                          <span className="sales-order-item-cell-label">
                            {t('salesOrders.fields.assignedQuantityShort', { defaultValue: t('salesOrders.fields.assignedQuantity') })}
                          </span>
                          <span>{item.quantities.assigned ?? empty}</span>
                        </div>
                        <div className="sales-order-item-cell">
                          <span className="sales-order-item-cell-label">
                            {t('salesOrders.fields.deliveredQuantityShort', { defaultValue: t('salesOrders.fields.deliveredQuantity') })}
                          </span>
                          <span>{item.quantities.delivered ?? empty}</span>
                        </div>
                        <div className="sales-order-item-cell">
                          <span className="sales-order-item-cell-label">
                            {t('salesOrders.fields.price', { defaultValue: t('salesOrders.fields.unitPrice') })}
                          </span>
                          <span>{formatOptionalNumber(item.commercial?.unitPrice)}</span>
                        </div>
                        <div className="sales-order-item-cell">
                          <span className="sales-order-item-cell-label">
                            {t('salesOrders.fields.amountShort', { defaultValue: t('salesOrders.fields.amount') })}
                          </span>
                          <span>{formatOptionalNumber(item.commercial?.amount)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </DetailCard>
            </DetailGrid>

            {order.comment && (
              <DetailGrid variant="single">
                <DetailCard full title={t('salesOrders.sections.comment')}>
                  <div className="detail-text-block">{order.comment}</div>
                </DetailCard>
              </DetailGrid>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default SalesOrdersDetails;
