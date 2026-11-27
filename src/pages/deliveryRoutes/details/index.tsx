import { useEffect, useState } from 'react';
import { notify } from 'shared/lib/notify';
import PageHeader from 'shared/ui/pageHeader';
import { routes } from "shared/config/routes";
import MainLayout from 'widgets/appShell';
import CustomButton from 'shared/ui/button';
import StatusBadge from 'shared/ui/statusBadge';
import { getDeliveryRouteStatusBadgeVariant } from 'shared/ui/statusBadge/variants';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  useCloseDeliveryRouteMutation,
  useGetDeliveryRouteByIdQuery,
  useStartDeliveryRouteLoadingMutation,
  useStartDeliveryRouteReturnMutation,
  useStartDeliveryRouteTransitMutation,
} from 'entities/deliveryRoutes/api';
import { UserPreviewCardById } from 'entities/users/ui/userPreviewCard';
import {
  useGetDeliveryTasksQuery,
  useStartDeliveryTaskHandoverMutation,
} from 'entities/deliveryTasks/api';
import { Empty } from 'antd';
import { useIsMobile } from 'shared/lib/useIsMobile';
import { getBackendErrorMessage } from 'shared/lib/getBackendErrorMessage';
import { useCan } from 'entities/access/lib';
import { endpointAccessMap } from 'shared/config/endpointAccessMap';
import {
  DetailCard,
  DetailGrid,
  DetailItems,
  DetailStat,
  DetailStatsGrid,
  RouteMetaChip,
} from 'shared/ui/details';
import { LifecycleTargetEntity } from 'entities/lifecycle/lib';
import { useLifecycleTab } from 'widgets/lifecycle/useLifecycleTab';
import EntityTabs, { OVERVIEW_TAB_KEY } from 'shared/ui/entityTabs';
import RouteTasksCard from 'features/deliveryRouteDetails/ui/routeTasksCard';
import { formatDate, formatDateTime } from 'shared/lib/formatDate';
import './styles.sass';

const DeliveryRoutesDetails = () => {
  const navigate = useNavigate();
  const { id, orgId } = useParams<{ id: string; orgId?: string }>();
  const { t } = useTranslation();
  const isMobile = useIsMobile();
  const [transitStarted, setTransitStarted] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  const { data: route, isLoading } = useGetDeliveryRouteByIdQuery(id ?? '', {
    skip: !id,
  });
  const [startDeliveryRouteLoading] = useStartDeliveryRouteLoadingMutation();
  const [startDeliveryRouteTransit] = useStartDeliveryRouteTransitMutation();
  const [startDeliveryRouteReturn] = useStartDeliveryRouteReturnMutation();
  const [closeDeliveryRoute] = useCloseDeliveryRouteMutation();
  const canListTasks = useCan(endpointAccessMap.deliveryRouteTasksList);
  const { data: tasks = [], isFetching: tasksLoading } = useGetDeliveryTasksQuery(
    { routeId: id ?? '' },
    { skip: !id || !canListTasks }
  );
  const [startDeliveryTaskHandover] = useStartDeliveryTaskHandoverMutation();
  const backPath = orgId ? routes.deliveryRoutes(orgId) : routes.companies();
  const canStartLoading = useCan(endpointAccessMap.deliveryRoutesStartLoading);
  const canStartTransitPermission = useCan(endpointAccessMap.deliveryRoutesStartTransit);
  const canStartReturn = useCan(endpointAccessMap.deliveryRoutesStartReturn);
  const canCloseRoute = useCan(endpointAccessMap.deliveryRoutesClose);
  const canStartHandover = useCan(endpointAccessMap.deliveryTasksStartHandover);
  const { banner: lifecycleBanner, items: lifecycleTabItems } = useLifecycleTab({
    targetId: id,
    target: LifecycleTargetEntity.DeliveryRoute,
  });
  const canOpenLoading = Boolean(
    canStartLoading &&
      route?.status &&
      ['assigned_to_warehouse', 'ready_for_loading', 'loading', 'loaded'].includes(route.status)
  );
  const canStartTransit = Boolean(
    canStartTransitPermission &&
      route?.status === 'loaded' &&
      !transitStarted
  );
  const canStartDelivery = Boolean(
    canStartHandover &&
      route?.status === 'in_transit'
  );
  const transitButtonLabel = t('deliveryRoutes.actions.startTransit', {
    defaultValue: 'Начать перевозку',
  });
  // Остаток в машине остаётся и после закрытия развоза: недобор по задачам
  // делает рейс partially_delivered, и принять товар обратно нужно именно тогда.
  const canOpenReturn = Boolean(
    canStartReturn &&
      route?.status &&
      ['in_transit', 'returning', 'partially_delivered', 'delivered'].includes(
        route.status
      )
  );
  const loadingButtonLabel = isMobile
    ? 'Начать погрузку'
    : t('deliveryRoutes.actions.openLoading');
  const returnButtonLabel = isMobile
    ? 'Начать возврат'
    : t('deliveryRoutes.actions.openReturn');
  const showCloseRoute = Boolean(
    canCloseRoute &&
      route?.status &&
      ['delivered', 'partially_delivered', 'returned'].includes(route.status)
  );
  const closeRouteButtonLabel = t('deliveryRoutes.actions.close');
  const taskScanPath = (taskId: string) =>
    orgId ? routes.deliveryTaskScan(orgId, taskId) : routes.companies();

  useEffect(() => {
    if (route?.status && route.status !== 'loaded') {
      setTransitStarted(false);
    }
  }, [route?.status]);

  const handleOpenLoading = async () => {
    if (!route?.id) return;

    try {
      await startDeliveryRouteLoading(route.id).unwrap();
      navigate(routes.deliveryRouteLoading(orgId, route.id));
    } catch (error) {
      notify.error(
        getBackendErrorMessage(
          error,
          t('deliveryRoutes.messages.error.startLoading', {
            defaultValue: 'Не удалось начать погрузку',
          })
        )
      );
    }
  };

  const handleStartTransit = async () => {
    if (!route?.id) return;

    try {
      setTransitStarted(true);
      // Карточка перезапросится сама: мутация инвалидирует тег рейса.
      await startDeliveryRouteTransit(route.id).unwrap();
      notify.success(
        t('deliveryRoutes.messages.success.startTransit', {
          defaultValue: 'Машина отправлена',
        })
      );
    } catch (error) {
      setTransitStarted(false);
      notify.error(
        getBackendErrorMessage(
          error,
          t('deliveryRoutes.messages.error.startTransit', {
            defaultValue: 'Не удалось отправить машину',
          })
        )
      );
    }
  };

  const handleOpenReturn = async () => {
    if (!route?.id) return;

    try {
      if (route.status === 'in_transit') {
        await startDeliveryRouteReturn(route.id).unwrap();
      }

      navigate(routes.deliveryRouteReturn(orgId, route.id));
    } catch (error) {
      notify.error(
        getBackendErrorMessage(
          error,
          t('deliveryRoutes.messages.error.startReturn', {
            defaultValue: 'Не удалось начать возврат',
          })
        )
      );
    }
  };

  const handleCloseRoute = async () => {
    if (!route?.id || isClosing) return;

    try {
      setIsClosing(true);
      await closeDeliveryRoute(route.id).unwrap();
      notify.success(t('deliveryRoutes.messages.success.close'));
    } catch (error) {
      notify.error(
        getBackendErrorMessage(
          error,
          t('deliveryRoutes.messages.error.close')
        )
      );
    } finally {
      setIsClosing(false);
    }
  };

  const handleStartDelivery = async (taskId: string) => {
    try {
      // Список задач рейса перезапросится сам: мутация инвалидирует тег.
      await startDeliveryTaskHandover(taskId).unwrap();
      navigate(taskScanPath(taskId));
    } catch (error) {
      notify.error(
        getBackendErrorMessage(
          error,
          t('deliveryTasks.messages.error.startDelivery', {
            defaultValue: 'Не удалось начать выдачу',
          })
        )
      );
    }
  };

  if (isLoading) {
    return null;
  }

  if (!route) {
    return (
      <MainLayout>
        <PageHeader
          title={t('deliveryRoutes.detailsTitle')}
          subtitle={t('common.details')}
          onBack={() => navigate(backPath)}
        />
        <div className="box">
          <div className="box-container">
            <div className="box-container-items">
              <Empty description={t('common.dataNotFound')} />
              <div className="btns-group">
                <CustomButton variant="outline" onClick={() => navigate(backPath)}>
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
    { label: t('deliveryRoutes.fields.routeDate'), value: formatDate(route.schedule.routeDate) },
  ];

  const vehicleItems = [
    { label: t('deliveryRoutes.fields.vehicleName'), value: route.vehicle.name || '-' },
    { label: t('deliveryRoutes.fields.plateNumber'), value: route.vehicle.plateNumber || '-' },
  ];

  const crewItems = [
    {
      label: t('deliveryRoutes.fields.driverName'),
      value: route.crew?.driverId ? (
        <UserPreviewCardById userId={route.crew.driverId} compact />
      ) : route.crew?.driverName || '-',
    },
    {
      label: t('deliveryRoutes.fields.agentName'),
      value: route.crew?.agentId ? (
        <UserPreviewCardById userId={route.crew.agentId} compact />
      ) : route.crew?.agentName || '-',
    },
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
      value: formatDateTime(route.timestamps.registeredAt),
    },
    route.timestamps.loadingStartedAt
      ? {
          label: t('deliveryRoutes.fields.loadingStartedAt'),
          value: formatDateTime(route.timestamps.loadingStartedAt),
        }
      : null,
    route.timestamps.departedAt
      ? {
          label: t('deliveryRoutes.fields.departedAt'),
          value: formatDateTime(route.timestamps.departedAt),
        }
      : null,
  ].filter(Boolean) as Array<{ label: string; value: string }>;

  const headingTitle = `${t('deliveryRoutes.detailsTitle')} - ${route.routeNumber}`;
  const headingSubtitle = t('common.details');

  const routeActions = (
    <>
      {canStartLoading && (
        <CustomButton
          onClick={() => void handleOpenLoading()}
          disabled={!canOpenLoading}
        >
          {loadingButtonLabel}
        </CustomButton>
      )}
      {canOpenReturn && (
        <CustomButton
          variant="outline"
          onClick={() => void handleOpenReturn()}
        >
          {returnButtonLabel}
        </CustomButton>
      )}
      {canStartTransit && (
        <CustomButton
          variant="outline"
          onClick={() => void handleStartTransit()}
        >
          {transitButtonLabel}
        </CustomButton>
      )}
      {showCloseRoute && (
        <CustomButton
          onClick={() => void handleCloseRoute()}
          disabled={isClosing}
        >
          {closeRouteButtonLabel}
        </CustomButton>
      )}
    </>
  );

  return (
    <MainLayout>
      <PageHeader
        title={headingTitle}
        subtitle={headingSubtitle}
        onBack={() => navigate(backPath)}
        actions={routeActions}
      />
      {lifecycleBanner}
      <EntityTabs
        defaultActiveKey={OVERVIEW_TAB_KEY}
        items={[
          {
            key: OVERVIEW_TAB_KEY,
            label: t('lifecycle.tabs.overview'),
            children: (
      <div className="box">
        <div className="box-container">
          <div className="box-container-items">
            <div className="route-overview-card">
              <div className="route-overview-head">
                {isMobile ? (
                  <div className="route-overview-inline-row">
                    <div className="route-overview-inline">
                      <span className="label inline-label">{t('deliveryRoutes.fields.routeNumber')}</span>
                      <span className="detail-separator">:</span>
                      <h2>{route.routeNumber}</h2>
                    </div>
                    <StatusBadge variant={getDeliveryRouteStatusBadgeVariant(route.status)}>
                      {t(`deliveryRoutes.status.${route.status}`)}
                    </StatusBadge>
                  </div>
                ) : (
                  <>
                    <div className="route-overview-title">
                      <span className="label">{t('deliveryRoutes.fields.routeNumber')}</span>
                      <h2>{route.routeNumber}</h2>
                    </div>
                    <div className="route-overview-status">
                      <span className="label inline-label">{t('deliveryRoutes.fields.status')}</span>
                      <span className="detail-separator">:</span>
                      <StatusBadge variant={getDeliveryRouteStatusBadgeVariant(route.status)}>
                        {t(`deliveryRoutes.status.${route.status}`)}
                      </StatusBadge>
                    </div>
                  </>
                )}
              </div>
              <div className="route-overview-meta">
                {summaryItems.map((item) => (
                  <RouteMetaChip key={item.label} label={item.label} value={item.value} />
                ))}
              </div>
              {route.createdBy && (
                <DetailGrid variant="single" style={{ marginTop: 16 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                    <span className="label inline-label">{t('common.createdBy')}:</span>
                    <UserPreviewCardById userId={route.createdBy} compact />
                  </div>
                </DetailGrid>
              )}
            </div>

            <DetailGrid variant="main">
              <DetailCard title={t('deliveryRoutes.sections.vehicle')}>
                <DetailItems items={vehicleItems} />
              </DetailCard>

              <DetailCard title={t('deliveryRoutes.sections.crew')}>
                {route.crew ? (
                  <DetailItems items={crewItems} />
                ) : (
                  <Empty description={t('deliveryRoutes.details.crewEmpty')} />
                )}
              </DetailCard>
            </DetailGrid>

            <DetailGrid variant="secondary">
              <DetailCard wide title={t('deliveryRoutes.sections.totals')}>
                <DetailStatsGrid>
                  {totalItems.map((item) => (
                    <DetailStat key={item.label} label={item.label} value={item.value} />
                  ))}
                </DetailStatsGrid>
              </DetailCard>

              <DetailCard title={t('deliveryRoutes.sections.timestamps')}>
                <DetailItems items={timestampItems} />
              </DetailCard>
            </DetailGrid>
            {route.comment && (
              <DetailGrid variant="single">
                <DetailCard full title={t('deliveryRoutes.fields.comment')}>
                  <div className="detail-text-block">
                    {route.comment || '-'}
                  </div>
                </DetailCard>
              </DetailGrid>
            )}
            {canListTasks && (
            <DetailGrid variant="single">
              <RouteTasksCard
                tasks={tasks}
                tasksLoading={tasksLoading}
                canStartDelivery={canStartDelivery}
                onStartDelivery={(taskId) => void handleStartDelivery(taskId)}
              />
            </DetailGrid>
            )}

            <div className="btns-group">
              <CustomButton variant="outline" onClick={() => navigate(backPath)}>
                {t('common.backToList')}
              </CustomButton>
            </div>
          </div>
        </div>
      </div>
            ),
          },
          ...lifecycleTabItems,
        ]}
      />
    </MainLayout>
  );
};

export default DeliveryRoutesDetails;
