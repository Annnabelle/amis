import { useEffect, useState } from 'react';
import MainLayout from 'shared/ui/layout';
import Heading from 'shared/ui/mainHeading';
import CustomButton from 'shared/ui/button';
import StatusBadge from 'shared/ui/statusBadge';
import {
  getDeliveryRouteStatusBadgeVariant,
  getDeliveryTaskStatusBadgeVariant,
} from 'shared/ui/statusBadge/variants';
import { Empty } from 'antd';
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
import { DownOutlined, LeftOutlined, UpOutlined } from '@ant-design/icons';
import { useIsMobile } from 'shared/lib';
import { toast } from 'react-toastify';
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
import { formatDate, formatDateTime } from 'shared/lib/formatDate';
import './styles.sass';

const DeliveryRoutesDetails = () => {
  const navigate = useNavigate();
  const { id, orgId } = useParams<{ id: string; orgId?: string }>();
  const { t } = useTranslation();
  const isMobile = useIsMobile();
  const [expandedTasks, setExpandedTasks] = useState<Set<number>>(new Set());
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
  const backPath = orgId ? `/organization/${orgId}/delivery-routes` : '/organization';
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
  const canOpenReturn = Boolean(
    canStartReturn &&
      route?.status &&
      ['in_transit', 'returning'].includes(route.status)
  );
  const loadingButtonLabel = isMobile
    ? 'Начать погрузку'
    : t('deliveryRoutes.actions.openLoading');
  const returnButtonLabel = isMobile
    ? 'Начать возврат'
    : t('deliveryRoutes.actions.openReturn');
  const showCloseRoute = Boolean(
    canCloseRoute && route?.status === 'delivered'
  );
  const closeRouteButtonLabel = t('deliveryRoutes.actions.close');
  const taskScanPath = (taskId: string) =>
    orgId ? `/organization/${orgId}/delivery-tasks/${taskId}/scan` : '/organization';

  useEffect(() => {
    if (route?.status && route.status !== 'loaded') {
      setTransitStarted(false);
    }
  }, [route?.status]);

  const toggleTaskExpanded = (index: number) => {
    setExpandedTasks((prev) => {
      const next = new Set(prev);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });
  };

  const expandAllTasks = () => {
    setExpandedTasks(new Set(tasks.map((_, index) => index)));
  };

  const collapseAllTasks = () => {
    setExpandedTasks(new Set());
  };

  const handleOpenLoading = async () => {
    if (!route?.id) return;

    try {
      await startDeliveryRouteLoading(route.id).unwrap();
      navigate(`${backPath}/${route.id}/loading`);
    } catch (error) {
      toast.error(
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
      toast.success(
        t('deliveryRoutes.messages.success.startTransit', {
          defaultValue: 'Машина отправлена',
        })
      );
    } catch (error) {
      setTransitStarted(false);
      toast.error(
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

      navigate(`${backPath}/${route.id}/return`);
    } catch (error) {
      toast.error(
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
      toast.success(t('deliveryRoutes.messages.success.close'));
    } catch (error) {
      toast.error(
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
      toast.error(
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
        {isMobile && (
          <div className="mobile-route-toolbar">
            <div className="mobile-route-toolbar-back">
              <CustomButton variant="outline" onClick={() => navigate(backPath)}>
                <LeftOutlined />
              </CustomButton>
            </div>
          </div>
        )}
        {!isMobile && (
          <Heading title={t('deliveryRoutes.detailsTitle')} subtitle={t('common.details')} />
        )}
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

  return (
    <MainLayout>
      {isMobile && (
        <div className="mobile-route-toolbar">
          <div className="mobile-route-toolbar-back">
            <CustomButton variant="outline" onClick={() => navigate(backPath)}>
              <LeftOutlined />
            </CustomButton>
          </div>
          <div className="mobile-route-toolbar-actions">
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
          </div>
        </div>
      )}
      {!isMobile && (
        <Heading 
          title={headingTitle}
          subtitle={headingSubtitle}
        >
          <div className={`btns-group ${isMobile ? 'mobile-route-actions is-hidden-mobile' : ''}`}>
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
          </div>
        </Heading>
      )}
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
              <DetailCard
                full
                headerWithActions
                title={t('deliveryRoutes.sections.tasks')}
                actions={
                  tasks.length > 0 && (
                    <div className="route-task-controls">
                      <button
                        className="route-task-control-btn"
                        onClick={expandAllTasks}
                        aria-label={t('common.expandAll')}
                        title={t('common.expandAll')}
                      >
                        <DownOutlined /> {isMobile ? 'Развернуть' : t('common.expandAll')}
                      </button>
                      <button
                        className="route-task-control-btn"
                        onClick={collapseAllTasks}
                        aria-label={t('common.collapseAll')}
                        title={t('common.collapseAll')}
                      >
                        <UpOutlined /> {isMobile ? 'Свернуть' : t('common.collapseAll')}
                      </button>
                    </div>
                  )
                }
              >
                {tasks.length === 0 && !tasksLoading ? (
                  <Empty description={t('deliveryRoutes.details.tasksEmpty')} />
                ) : (
                  <div className="route-preview-section">
                    <div className="route-preview-orders-details">
                      {tasks.map((task, index) => (
                        <div
                          key={task.id}
                          className={`route-task-card ${expandedTasks.has(index) ? 'expanded' : 'collapsed'}`}
                        >
                          <div
                            className="route-task-header"
                            onClick={() => toggleTaskExpanded(index)}
                            style={{ cursor: 'pointer' }}
                          >
                            <div className="route-task-main">
                              <div className="route-task-topline">
                                <span className="route-task-number">{task.taskNumber}</span>
                                <div className="route-task-customer-block">
                                  <span className="route-task-customer-name">{task.customer.name}</span>
                                  <span className="route-task-customer-meta">
                                    {t('deliveryRoutes.taskTable.customerTin')}: {task.customer.tin}
                                  </span>
                                </div>
                              </div>

                              <div className="route-task-metrics">
                                <div className="route-task-metric">
                                  <span className="route-task-metric-label">{t('deliveryRoutes.taskTable.plannedQuantity')}</span>
                                  <span className="route-task-metric-value">{task.totals.plannedQuantity}</span>
                                </div>
                                <div className="route-task-metric">
                                  <span className="route-task-metric-label">{t('deliveryRoutes.taskTable.deliveredQuantity')}</span>
                                  <span className="route-task-metric-value">{task.totals.deliveredQuantity}</span>
                                </div>
                                <div className="route-task-metric">
                                  <span className="route-task-metric-label">{t('deliveryRoutes.taskTable.amount')}</span>
                                  <span className="route-task-metric-value">
                                    {task.totals.amount != null ? task.totals.amount.toLocaleString() : '-'}
                                  </span>
                                </div>
                              </div>
                            </div>

                            <div className="route-task-side">
                              <StatusBadge variant={getDeliveryTaskStatusBadgeVariant(task.status)}>
                                {t(`statuses.${task.status}`, { defaultValue: task.status })}
                              </StatusBadge>
                              <span className="route-task-invoice">
                                {task.invoice?.externalId || task.invoice?.status || task.invoice?.invoiceId || '-'}
                              </span>
                              {canStartDelivery && !['delivered', 'cancelled'].includes(task.status) && (
                                <CustomButton
                                  className="route-task-primary-action"
                                  disabled={task.status === 'handover_in_progress'}
                                  onClick={(event) => {
                                    event.stopPropagation();
                                    if (task.status === 'handover_in_progress') return;
                                    void handleStartDelivery(task.id);
                                  }}
                                >
                                  {t('deliveryTasks.actions.startDelivery', {
                                    defaultValue:
                                      task.status === 'in_transit' ? 'Открыть выдачу' : 'Начать выдачу',
                                  })}
                                </CustomButton>
                              )}
                            </div>
                            <div className="route-task-expand-icon">
                              {expandedTasks.has(index) ? <UpOutlined /> : <DownOutlined />}
                            </div>
                          </div>

                          {expandedTasks.has(index) && (
                            <div className="route-task-expanded">
                              <div className="route-task-expanded-meta">
                                <div className="route-task-expanded-item">
                                  <span className="route-task-expanded-label">{t('deliveryRoutes.taskTable.invoice')}</span>
                                  <span className="route-task-expanded-value">
                                    {task.invoice?.externalId || task.invoice?.status || task.invoice?.invoiceId || '-'}
                                  </span>
                                </div>
                                <div className="route-task-expanded-item">
                                  <span className="route-task-expanded-label">{t('deliveryRoutes.taskTable.comment')}</span>
                                  <span className="route-task-expanded-value">{task.comment || '-'}</span>
                                </div>
                              </div>

                              <div className="route-task-items-list">
                                <div className="route-task-items-head">
                                  <span>{t('salesOrders.fields.product')}</span>
                                  <span>{t('deliveryRoutes.taskTable.plannedQuantity')}</span>
                                  <span>{t('deliveryRoutes.taskTable.deliveredQuantity')}</span>
                                  <span>{t('deliveryRoutes.taskTable.amount')}</span>
                                </div>
                                {task.items.map((item) => (
                                  <div key={item.salesOrderItemId} className="route-task-item-row">
                                    <div className="route-task-item-product">
                                      <span className="route-task-item-name">{item.product.name}</span>
                                      {item.product.shortName && (
                                        <span className="route-task-item-subname">{item.product.shortName}</span>
                                      )}
                                    </div>
                                    <div className="route-task-item-cell">
                                      <span className="route-task-item-cell-label">{t('deliveryRoutes.taskTable.plannedQuantity')}</span>
                                      <span>{item.quantities.planned}</span>
                                    </div>
                                    <div className="route-task-item-cell">
                                      <span className="route-task-item-cell-label">{t('deliveryRoutes.taskTable.deliveredQuantity')}</span>
                                      <span>{item.quantities.delivered}</span>
                                    </div>
                                    <div className="route-task-item-cell">
                                      <span className="route-task-item-cell-label">{t('deliveryRoutes.taskTable.amount')}</span>
                                      <span>
                                        {item.commercial?.amount != null
                                          ? item.commercial.amount.toLocaleString()
                                          : '-'}
                                      </span>
                                    </div>
                                  </div>
                                ))}
                                {!task.items.length && (
                                  <div className="route-task-item-row route-task-item-row-empty">
                                    <span>-</span>
                                    <span>-</span>
                                    <span>-</span>
                                    <span>-</span>
                                    <span>-</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </DetailCard>
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
