import { DownOutlined, UpOutlined } from "@ant-design/icons";
import { Tag } from "antd";
import { useState } from "react";
import { useTranslation } from "react-i18next";

import {
  getPriorityColor,
  type OrderSelectionSummary,
} from "features/deliveryRouteCreate/lib/orderSelectionSummary";
import { activateOnKey } from "shared/lib/keyboardActivate";

type SelectedOrdersPreviewProps = {
  summary: OrderSelectionSummary;
};

/**
 * Что уедет рейсом: карточки клиентов с позициями и общие цифры.
 *
 * Карточки раскрываются по одной или все сразу — состояние раскрытия нужно
 * только этому блоку.
 */
const SelectedOrdersPreview = ({ summary }: SelectedOrdersPreviewProps) => {
  const { t } = useTranslation();
  const [expandedCards, setExpandedCards] = useState<Set<number>>(new Set());

  const toggleCardExpanded = (index: number) => {
    const next = new Set(expandedCards);

    if (next.has(index)) {
      next.delete(index);
    } else {
      next.add(index);
    }

    setExpandedCards(next);
  };

  const expandAllCards = (customersCount: number) => {
    setExpandedCards(new Set(Array.from({ length: customersCount }, (_, index) => index)));
  };

  const collapseAllCards = () => {
    setExpandedCards(new Set());
  };

  return (
        // <div className="route-preview">
          <div className="route-preview-section">
    {/* <h5 className="section-title"><InboxOutlined /> {t('deliveryRoutes.preview.selectedOrders')}</h5> */}
    <div className="route-preview-orders-details">
    {summary.customersDetails.length > 0 && (
      <div className="expand-controls">
        <button 
          className="expand-btn expand-all" 
          onClick={() => expandAllCards(summary.customersDetails.length)}
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
              {summary.customersDetails.map((customer, index) => (
                <div 
                  key={index} 
                  className={`order-detail-card ${expandedCards.has(index) ? 'expanded' : 'collapsed'}`}
                >
                  <div 
                    className="order-header"
                    role="button"
                    tabIndex={0}
                    aria-expanded={expandedCards.has(index)}
                    onKeyDown={activateOnKey(() => toggleCardExpanded(index))}
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
                      <Tag color={getPriorityColor(customer.priority)} className="tag-flat">
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
                    <span className="stat-value">{summary.orderCount}</span>
                  </div>
                  <div className="stat">
                    <span className="stat-label">{t('deliveryRoutes.preview.totalVolume')}:</span>
                    <span className="stat-value">{summary.totalVolume}</span>
                  </div>
                  <div className="stat">
                    <span className="stat-label">{t('deliveryRoutes.preview.totalAmount')}:</span>
                    <span className="stat-value">{summary.totalAmount}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        // {/* </div> */}
  );
};

export default SelectedOrdersPreview;
