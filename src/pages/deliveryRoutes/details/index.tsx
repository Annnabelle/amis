import { useEffect } from 'react';
import dayjs from 'dayjs';
import MainLayout from 'shared/ui/layout';
import Heading from 'shared/ui/mainHeading';
import CustomButton from 'shared/ui/button';
import { Empty, Spin } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from 'app/store';
import { getDeliveryRouteById } from 'entities/deliveryRoutes/model';

const DeliveryRoutesDetails = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { id, orgId } = useParams<{ id: string; orgId?: string }>();
  const { t } = useTranslation();

  const route = useAppSelector((state) => state.deliveryRoutes.routeById);
  const isLoading = useAppSelector((state) => state.deliveryRoutes.loadingById);

  const backPath = orgId ? `/organization/${orgId}/delivery-routes` : '/delivery-routes';
  const canOpenReturn = route?.status === 'in_transit' || route?.status === 'loaded';

  useEffect(() => {
    if (id) {
      dispatch(getDeliveryRouteById(id));
    }
  }, [dispatch, id]);

  if (isLoading) {
    return (
      <MainLayout>
        <Heading title={t('deliveryRoutes.detailsTitle')} subtitle={t('common.details')} />
        <div className="box">
          <div className="box-container">
            <div className="box-container-items">
              <Spin size="large" />
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (!route) {
    return (
      <MainLayout>
        <Heading title={t('deliveryRoutes.detailsTitle')} subtitle={t('common.details')} />
        <div className="box">
          <div className="box-container">
            <div className="box-container-items">
              <Empty description={t('common.dataNotFound')} />
              <div className="btns-group">
                <CustomButton className="outline" onClick={() => navigate(backPath)}>
                  {t('common.backToList')}
                </CustomButton>
              </div>
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  const summaryItems = [
    { label: t('deliveryRoutes.fields.routeDate'), value: dayjs(route.schedule.routeDate).format('DD.MM.YYYY') },
  ];

  const vehicleItems = [
    { label: t('deliveryRoutes.fields.vehicleName'), value: route.vehicle.name || '-' },
    { label: t('deliveryRoutes.fields.plateNumber'), value: route.vehicle.plateNumber || '-' },
  ];

  const crewItems = [
    { label: t('deliveryRoutes.fields.driverName'), value: route.crew?.driverName || '-' },
    { label: t('deliveryRoutes.fields.agentName'), value: route.crew?.agentName || '-' },
  ];

  const totalItems = [
    { label: t('deliveryRoutes.fields.taskCount'), value: route.totals.taskCount },
    { label: t('deliveryRoutes.fields.plannedQuantity'), value: route.totals.plannedQuantity },
    { label: t('deliveryRoutes.fields.loadedQuantity'), value: route.totals.loadedQuantity },
    { label: t('deliveryRoutes.fields.deliveredQuantity'), value: route.totals.deliveredQuantity },
    { label: t('deliveryRoutes.fields.returnedQuantity'), value: route.totals.returnedQuantity },
  ];

  const timestampItems = [
    {
      label: t('deliveryRoutes.fields.registeredAt'),
      value: dayjs(route.timestamps.registeredAt).format('DD.MM.YYYY HH:mm'),
    },
    route.timestamps.loadingStartedAt
      ? {
          label: t('deliveryRoutes.fields.loadingStartedAt'),
          value: dayjs(route.timestamps.loadingStartedAt).format('DD.MM.YYYY HH:mm'),
        }
      : null,
    route.timestamps.departedAt
      ? {
          label: t('deliveryRoutes.fields.departedAt'),
          value: dayjs(route.timestamps.departedAt).format('DD.MM.YYYY HH:mm'),
        }
      : null,
  ].filter(Boolean) as Array<{ label: string; value: string }>;

  return (
    <MainLayout>
      <Heading 
        title={`${t('deliveryRoutes.detailsTitle')} - ${route.routeNumber}`} 
        subtitle={t('common.details')} 
      >
        <div className="btns-group">
          <CustomButton
            className="primary"
            onClick={() => navigate(`${backPath}/${route.id}/loading`)}
          >
            {t('deliveryRoutes.actions.openLoading')}
          </CustomButton>
          <CustomButton
            className="outline"
            onClick={() => navigate(`${backPath}/${route.id}/return`)}
            disabled={!canOpenReturn}
          >
            {t('deliveryRoutes.actions.openReturn')}
          </CustomButton>
        </div>
      </Heading>
      <div className="box">
        <div className="box-container">
          <div className="box-container-items">
            <div className="route-overview-card">
              <div className="route-overview-head">
                <div className="route-overview-title">
                  <span className="label">{t('deliveryRoutes.fields.routeNumber')}</span>
                  <h2>{route.routeNumber}</h2>
                </div>
                <div className="route-overview-status">
                  <span className="label inline-label">{t('deliveryRoutes.fields.status')}</span>
                  <span className="detail-separator">:</span>
                  <span className={`status-badge ${route.status}`}>
                    {t(`deliveryRoutes.status.${route.status}`)}
                  </span>
                </div>
              </div>
              <div className="route-overview-meta">
                {summaryItems.map((item) => (
                  <div className="route-meta-chip" key={item.label}>
                    <span className="label">{item.label}</span>
                    <span className="value">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="detail-grid detail-grid-main">
              <div className="detail-card">
                <h4>{t('deliveryRoutes.sections.vehicle')}</h4>
                <div className="detail-items">
                  {vehicleItems.map((item) => (
                    <div className="detail-item" key={item.label}>
                      <span className="label inline-label">{item.label}</span>
                      <span className="detail-separator">:</span>
                      <span className="value">{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="detail-card">
                <h4>{t('deliveryRoutes.sections.crew')}</h4>
                {route.crew ? (
                  <div className="detail-items">
                    {crewItems.map((item) => (
                      <div className="detail-item" key={item.label}>
                        <span className="label inline-label">{item.label}</span>
                        <span className="detail-separator">:</span>
                        <span className="value">{item.value}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <Empty description={t('deliveryRoutes.details.crewEmpty')} />
                )}
              </div>
            </div>

            <div className="detail-grid detail-grid-secondary">
              <div className="detail-card detail-card-wide">
                <h4>{t('deliveryRoutes.sections.totals')}</h4>
                <div className="detail-stats-grid">
                  {totalItems.map((item) => (
                    <div className="detail-stat" key={item.label}>
                      <span className="label">{item.label}</span>
                      <span className="value">{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="detail-card">
                <h4>{t('deliveryRoutes.sections.timestamps')}</h4>
                <div className="detail-items">
                  {timestampItems.map((item) => (
                    <div className="detail-item" key={item.label}>
                      <span className="label inline-label">{item.label}</span>
                      <span className="detail-separator">:</span>
                      <span className="value">{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="detail-grid detail-grid-single">
              <div className="detail-card detail-card-full">
                <h4>{t('deliveryRoutes.fields.comment')}</h4>
                <div className="detail-text-block">
                  {route.comment || '-'}
                </div>
              </div>
            </div>

            <div className="btns-group">
              <CustomButton className="outline" onClick={() => navigate(backPath)}>
                {t('common.backToList')}
              </CustomButton>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default DeliveryRoutesDetails;
