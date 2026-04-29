import { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import MainLayout from 'shared/ui/layout';
import Heading from 'shared/ui/mainHeading';
import CustomButton from 'shared/ui/button';
import { Empty } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from 'app/store';
import {
  getDeliveryRouteById,
  startDeliveryRouteLoading,
  startDeliveryRouteReturn,
  startDeliveryRouteTransit,
} from 'entities/deliveryRoutes/model';
import { getDeliveryTasks, startDeliveryTaskDelivery } from 'entities/deliveryTasks/model';
import { DownOutlined, LeftOutlined, UpOutlined } from '@ant-design/icons';
import { useIsMobile } from 'shared/lib';
import { toast } from 'react-toastify';
import { getBackendErrorMessage } from 'shared/lib/getBackendErrorMessage';
import { isAgentRole, isWarehouseRole } from 'shared/lib/userRoles';

const DeliveryRoutesDetails = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { id, orgId } = useParams<{ id: string; orgId?: string }>();
  const { t } = useTranslation();
  const isMobile = useIsMobile();
  const [expandedTasks, setExpandedTasks] = useState<Set<number>>(new Set());
  const [transitStarted, setTransitStarted] = useState(false);
  const [isBootstrapping, setIsBootstrapping] = useState(true);

  const route = useAppSelector((state) => state.deliveryRoutes.routeById);
  const isLoading = useAppSelector((state) => state.deliveryRoutes.loadingById);
  const tasks = useAppSelector((state) => state.deliveryTasks.tasks);
  const tasksLoading = useAppSelector((state) => state.deliveryTasks.isLoading);
  const currentUser = useAppSelector((state) => state.users.currentUser);

  const backPath = orgId ? `/organization/${orgId}/delivery-routes` : '/delivery-routes';
  const isWarehouseUser = isWarehouseRole(currentUser);
  const isAgentUser = isAgentRole(currentUser);
  const canOpenLoading = Boolean(
    isWarehouseUser &&
      route?.status &&
      ['assigned_to_warehouse', 'ready_for_loading', 'loading', 'loaded'].includes(route.status)
  );
  const canStartTransit = Boolean((isAgentUser || isWarehouseUser) && route?.status === 'loaded' && !transitStarted);
  const canStartDelivery = Boolean(isAgentUser && route?.status === 'in_transit');
  const transitButtonLabel = t('deliveryRoutes.actions.startTransit', {
    defaultValue: isAgentUser ? 'Начать поездку' : 'Отправить машину',
  });
  const canOpenReturn = Boolean(
    isWarehouseUser &&
      route?.status &&
      ['in_transit', 'returning'].includes(route.status)
  );
  const loadingButtonLabel = isMobile
    ? 'Начать погрузку'
    : t('deliveryRoutes.actions.openLoading');
  const returnButtonLabel = isMobile
    ? 'Начать возврат'
    : t('deliveryRoutes.actions.openReturn');
  const taskScanPath = (taskId: string) =>
    orgId ? `/organization/${orgId}/delivery-tasks/${taskId}/scan` : `/delivery-tasks/${taskId}/scan`;
  useEffect(() => {
    let isMounted = true;

    if (!id) {
      setIsBootstrapping(false);
      return () => {
        isMounted = false;
      };
    }

    setIsBootstrapping(true);

    Promise.allSettled([
      dispatch(getDeliveryRouteById(id)).unwrap(),
      dispatch(getDeliveryTasks({ routeId: id })).unwrap(),
    ]).finally(() => {
      if (isMounted) {
        setIsBootstrapping(false);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [dispatch, id]);

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
      await dispatch(startDeliveryRouteLoading(route.id)).unwrap();
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
      await dispatch(startDeliveryRouteTransit(route.id)).unwrap();
      await dispatch(getDeliveryRouteById(route.id));
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
        await dispatch(startDeliveryRouteReturn(route.id)).unwrap();
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

  const handleStartDelivery = async (taskId: string) => {
    try {
      await dispatch(startDeliveryTaskDelivery(taskId)).unwrap();
      if (route?.id) {
        await dispatch(getDeliveryTasks({ routeId: route.id }));
      }
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

  const isCurrentRouteLoaded = route?.id === id;

  if (isBootstrapping || (isLoading && !isCurrentRouteLoaded)) {
    return null;
  }

  if (!isCurrentRouteLoaded || !route) {
    return (
      <MainLayout>
        {isMobile && (
          <div className="mobile-route-toolbar">
            <div className="mobile-route-toolbar-back">
              <CustomButton className="outline" onClick={() => navigate(backPath)}>
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

  const headingTitle = `${t('deliveryRoutes.detailsTitle')} - ${route.routeNumber}`;
  const headingSubtitle = t('common.details');

  return (
    <MainLayout>
      {isMobile && (
        <div className="mobile-route-toolbar">
          <div className="mobile-route-toolbar-back">
            <CustomButton className="outline" onClick={() => navigate(backPath)}>
              <LeftOutlined />
            </CustomButton>
          </div>
          <div className="mobile-route-toolbar-actions">
            {isWarehouseUser && (
              <CustomButton
                className="primary"
                onClick={() => void handleOpenLoading()}
                disabled={!canOpenLoading}
              >
                {loadingButtonLabel}
              </CustomButton>
            )}
            {canOpenReturn && (
              <CustomButton
                className="outline"
                onClick={() => void handleOpenReturn()}
              >
                {returnButtonLabel}
              </CustomButton>
            )}
            {canStartTransit && (
              <CustomButton
                className="outline"
                onClick={() => void handleStartTransit()}
              >
                {transitButtonLabel}
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
            {isWarehouseUser && (
              <CustomButton
                className="primary"
                onClick={() => void handleOpenLoading()}
                disabled={!canOpenLoading}
              >
                {loadingButtonLabel}
              </CustomButton>
            )}
            {canOpenReturn && (
              <CustomButton
                className="outline"
                onClick={() => void handleOpenReturn()}
              >
                {returnButtonLabel}
              </CustomButton>
            )}
            {canStartTransit && (
              <CustomButton
                className="outline"
                onClick={() => void handleStartTransit()}
              >
                {transitButtonLabel}
              </CustomButton>
            )}
          </div>
        </Heading>
      )}
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
                    <span className={`status-badge ${route.status}`}>
                      {t(`deliveryRoutes.status.${route.status}`)}
                    </span>
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
                      <span className={`status-badge ${route.status}`}>
                        {t(`deliveryRoutes.status.${route.status}`)}
                      </span>
                    </div>
                  </>
                )}
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
            {route.comment && (
              <div className="detail-grid detail-grid-single">
                <div className="detail-card detail-card-full">
                  <h4>{t('deliveryRoutes.fields.comment')}</h4>
                  <div className="detail-text-block">
                    {route.comment || '-'}
                  </div>
                </div>
              </div>
            )}
            <div className="detail-grid detail-grid-single">
              <div className="detail-card detail-card-full">
                <div className="detail-card-header detail-card-header-with-actions">
                  <h4>{t('deliveryRoutes.sections.tasks')}</h4>
                  {tasks.length > 0 && (
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
                  )}
                </div>
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
                                  <span className="route-task-metric-label">{t('deliveryRoutes.taskTable.loadedQuantity')}</span>
                                  <span className="route-task-metric-value">{task.totals.loadedQuantity}</span>
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
                              <span className={`status-badge ${task.status}`}>
                                {t(`statuses.${task.status}`, { defaultValue: task.status })}
                              </span>
                              <span className="route-task-invoice">
                                {task.invoice?.externalId || task.invoice?.status || task.invoice?.invoiceId || '-'}
                              </span>
                              {canStartDelivery && !['delivered', 'cancelled'].includes(task.status) && (
                                <CustomButton
                                  className="primary"
                                  disabled={task.status === 'handover_in_progress'}
                                  onClick={(event) => {
                                    event.stopPropagation();
                                    if (task.status === 'handover_in_progress') return;
                                    void handleStartDelivery(task.id);
                                  }}
                                >
                                  {t('deliveryTasks.actions.startDelivery', {
                                    defaultValue:
                                      task.status === 'delivering' || task.status === 'partially_delivered'
                                        ? 'Открыть выдачу'
                                        : 'Начать выдачу',
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
                                  <span>{t('deliveryRoutes.taskTable.loadedQuantity')}</span>
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
                                      <span className="route-task-item-cell-label">{t('deliveryRoutes.taskTable.loadedQuantity')}</span>
                                      <span>{item.quantities.loaded}</span>
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
