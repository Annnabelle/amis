import { DownOutlined, UpOutlined } from "@ant-design/icons";
import { Empty } from "antd";
import { useState } from "react";
import { useTranslation } from "react-i18next";

import type { DeliveryTask } from "entities/deliveryTasks/types";
import { getDeliveryTaskStatusBadgeVariant } from "shared/ui/statusBadge/variants";
import { activateOnKey } from "shared/lib/keyboardActivate";
import { useIsMobile } from "shared/lib/useIsMobile";
import CustomButton from "shared/ui/button";
import { DetailCard } from "shared/ui/details";
import StatusBadge from "shared/ui/statusBadge";

type RouteTasksCardProps = {
  tasks: DeliveryTask[];
  tasksLoading: boolean;
  canStartDelivery: boolean;
  onStartDelivery: (taskId: string) => void;
};

/**
 * Задачи рейса карточками.
 *
 * Карточка раскрывается по клику: в свёрнутом виде видно клиента и статус,
 * в раскрытом — позиции и действия.
 */
const RouteTasksCard = ({
  tasks,
  tasksLoading,
  canStartDelivery,
  onStartDelivery: handleStartDelivery,
}: RouteTasksCardProps) => {
  const { t } = useTranslation();
  const isMobile = useIsMobile();
  const [expandedTasks, setExpandedTasks] = useState<Set<number>>(new Set());

  const toggleTaskExpanded = (index: number) => {
    const next = new Set(expandedTasks);

    if (next.has(index)) {
      next.delete(index);
    } else {
      next.add(index);
    }

    setExpandedTasks(next);
  };

  const expandAllTasks = () => {
    setExpandedTasks(new Set(tasks.map((_, index) => index)));
  };

  const collapseAllTasks = () => {
    setExpandedTasks(new Set());
  };

  return (
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
                <DownOutlined /> {isMobile ? t('common.expand') : t('common.expandAll')}
              </button>
              <button
                className="route-task-control-btn"
                onClick={collapseAllTasks}
                aria-label={t('common.collapseAll')}
                title={t('common.collapseAll')}
              >
                <UpOutlined /> {isMobile ? t('common.collapse') : t('common.collapseAll')}
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
                    role="button"
                    tabIndex={0}
                    aria-expanded={expandedTasks.has(index)}
                    onKeyDown={activateOnKey(() => toggleTaskExpanded(index))}
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
  );
};

export default RouteTasksCard;
