import { useTranslation } from 'react-i18next'
import {useGetOrderBatchQuery} from 'entities/markingCodes/api'
import {useParams} from "react-router-dom";
import BatchItem from "./batchItem.tsx";
import {Tag} from "antd";
import {statusColors} from "shared/ui/statuses.tsx";
import { UserPreviewCardById } from 'entities/users/ui/userPreviewCard'
import "./styles.sass"
import { PermissionLink } from "entities/access/ui";
import { endpointAccessMap } from 'shared/config/endpointAccessMap';
import { StatusEntity, LifecycleScope } from "shared/config/statusCatalog";
import { getStatusLabel } from "shared/lib/useStatusLabel";

import { formatDateTimeSeconds } from 'shared/lib/formatDate';
const getStatusColor = (status?: string | null) => {
    if (!status) return 'default';

    return statusColors[status.toLowerCase()] ?? 'default';
};


const MarkingCodeProductBatches = () => {
    const { t } = useTranslation();
    const { orgId, orderId, batchId } = useParams<{
        orgId: string;
        orderId: string;
        batchId: string;
    }>();
    const { data: orderProductBatch } = useGetOrderBatchQuery(
        { orderId: orderId ?? '', batchId: batchId ?? '' },
        { skip: !orderId || !batchId }
    );

    return (
        <div className="box batch-inner-box">
            <div className="box-batch-container">

                {/* ===== PRODUCT ===== */}
                <section className="batch-section">
                    <h4 className="section-title">{t("markingCodes.batches.batchData.productName")}:</h4>
                    {orderProductBatch?.productName && (
                        <div className="product-title">
                            <PermissionLink
                                endpoint={endpointAccessMap.productsRead}
                                to={
                                    orgId
                                        ? `/organization/${orgId}/products/${orderProductBatch.productId}`
                                        : "/organization"
                                }
                            >
                                {orderProductBatch.productName}
                            </PermissionLink>
                        </div>
                    )}

                    <div className="grid">
                        {orderProductBatch?.gtin && (
                            <BatchItem label={t('markingCodes.batches.batchData.gtin')}>
                                {orderProductBatch.gtin}
                            </BatchItem>
                        )}

                        {orderProductBatch?.packageType && (
                            <BatchItem label={t('markingCodes.batches.batchData.packagingType')}>
                                {t(`markingCodes.packageType.${orderProductBatch.packageType.toLowerCase()}`)}
                            </BatchItem>
                        )}

                        {orderProductBatch?.quantity && (
                            <BatchItem label={t('markingCodes.batches.batchData.numberOfMarkingCodes')}>
                                {orderProductBatch.quantity}
                            </BatchItem>
                        )}
                    </div>
                </section>

                {/* ===== ORDER ===== */}
                <section className="batch-section">
                    <h4 className="section-title">{t('markingCodes.batches.sections.order')}</h4>

                    <div className="grid">
                        <BatchItem label={t('markingCodes.batches.batchData.orderNumber')}>
                            <PermissionLink
                                endpoint={endpointAccessMap.ordersRead}
                                to={
                                    orgId
                                        ? `/organization/${orgId}/orders/${orderProductBatch?.order.id}`
                                        : "/organization"
                                }
                            >
                                {orderProductBatch?.order.orderNumber}
                            </PermissionLink>
                        </BatchItem>

                        <BatchItem label={t('markingCodes.batches.batchData.executor')}>
                            {orderProductBatch?.order.userId ? (
                                <div style={{ width: 360, maxWidth: '100%' }}>
                                    <UserPreviewCardById userId={orderProductBatch.order.userId} compact />
                                </div>
                            ) : (
                                orderProductBatch?.order.userId
                            )}
                        </BatchItem>

                        <BatchItem label={t('markingCodes.batches.batchData.orderTime')}>
                            {orderProductBatch?.order?.orderedAt
                                ? formatDateTimeSeconds(orderProductBatch.order.orderedAt)
                                : '—'}
                        </BatchItem>

                        <BatchItem label={t('markingCodes.batches.batchData.turonOrderID')}>
                            {orderProductBatch?.order.providerOrderId}
                        </BatchItem>
                    </div>
                </section>

                {/* ===== BATCH STATUSES ===== */}
                <section className="batch-section">
                    <h4 className="section-title">{t('markingCodes.batches.sections.batchStatus')}</h4>

                    <div className="grid">
                        <BatchItem label={t('markingCodes.batches.batchData.batchStatus')}>
                            <Tag color={getStatusColor(orderProductBatch?.status)}>
                                {getStatusLabel(t, StatusEntity.MarkingCodeOrderBatch, LifecycleScope.Internal, orderProductBatch?.status?.toLowerCase())}
                            </Tag>
                        </BatchItem>

                        <BatchItem label={t('markingCodes.batches.batchData.batchStatusInTuron')}>
                            <Tag color={getStatusColor(orderProductBatch?.externalStatus)}>
                                {getStatusLabel(
                                    t,
                                    StatusEntity.MarkingCodeOrderBatch,
                                    LifecycleScope.External,
                                    orderProductBatch?.externalStatus
                                )}
                            </Tag>
                        </BatchItem>
                    </div>
                </section>

                {/* ===== ORDER STATUSES ===== */}
                <section className="batch-section">
                    <h4 className="section-title">{t('markingCodes.batches.sections.orderStatus')}</h4>

                    <div className="grid">
                        <BatchItem label={t('markingCodes.batches.batchData.orderStatus')}>
                            <Tag color={getStatusColor(orderProductBatch?.order?.status)}>
                                {getStatusLabel(t, StatusEntity.MarkingCodeOrder, LifecycleScope.Internal, orderProductBatch?.order?.status?.toLowerCase())}
                            </Tag>
                        </BatchItem>

                        <BatchItem label={t('markingCodes.batches.batchData.turonOrderStatus')}>
                            <Tag color={getStatusColor(orderProductBatch?.order?.externalStatus)} >
                                {getStatusLabel(t, StatusEntity.MarkingCodeOrder, LifecycleScope.External, orderProductBatch?.order?.externalStatus)}
                            </Tag>
                        </BatchItem>
                    </div>
                </section>

            </div>
        </div>

    )
}

export default MarkingCodeProductBatches


