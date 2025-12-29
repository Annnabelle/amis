import { useAppDispatch, useAppSelector } from '../../store'
import {useEffect} from 'react'
import { useTranslation } from 'react-i18next'
import {getBatch} from '../../store/markingCodes'
import {Link, useParams} from "react-router-dom";
import BatchItem from "./batchItem.tsx";
import {Tag} from "antd";
import {statusColors} from "../../components/statuses.tsx";
import "./styles.sass"

const getStatusColor = (status?: string | null) => {
    if (!status) return 'default';

    return statusColors[status.toLowerCase()] ?? 'default';
};


const MarkingCodeProductBatches = () => {
    const { t } = useTranslation();
    const dispatch = useAppDispatch()
    const orderProductBatch = useAppSelector((state) => state.markingCodes.batch)
    const { orderId, batchId } = useParams<{
        orderId: string;
        batchId: string;
    }>();

    useEffect(() => {
        if (!orderId || !batchId) return;
        dispatch(getBatch({orderId: orderId, batchId: batchId}))
    }, [dispatch]);

    return (
        <div className="box batch-inner-box">
            <div className="box-batch-container">

                {/* ===== PRODUCT ===== */}
                <section className="batch-section">
                    <h4 className="section-title">{t("markingCodes.batches.batchData.productName")}:</h4>
                    {orderProductBatch?.productName && (
                        <div className="product-title">
                            <Link to={`/products/${orderProductBatch.productId}`}>
                                {orderProductBatch.productName}
                            </Link>
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
                            <Link to={`/orders/${orderProductBatch?.order.id}`}>
                                {orderProductBatch?.order.orderNumber}
                            </Link>
                        </BatchItem>

                        <BatchItem label={t('markingCodes.batches.batchData.executor')}>
                            {orderProductBatch?.order.userId}
                        </BatchItem>

                        <BatchItem label={t('markingCodes.batches.batchData.orderTime')}>
                            {orderProductBatch?.order.orderedAt}
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
                                {t(`markingCodes.batches.batchesOrderStatus.${orderProductBatch?.status?.toLowerCase()}`)}
                            </Tag>
                        </BatchItem>

                        <BatchItem label={t('markingCodes.batches.batchData.batchStatusInTuron')}>
                            <Tag color={getStatusColor(orderProductBatch?.externalStatus)}>
                                {t(
                                    `markingCodes.batches.batchData.externalStatus.${orderProductBatch?.externalStatus?.toLowerCase()}`
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
                                {t(`markingCodes.batches.orderNotExternalStatus.${orderProductBatch?.order?.status?.toLowerCase()}`)}
                            </Tag>
                        </BatchItem>

                        <BatchItem label={t('markingCodes.batches.batchData.turonOrderStatus')}>
                            <Tag color={getStatusColor(orderProductBatch?.order?.externalStatus)} >
                                {t(`markingCodes.markingCodesOrderStatus.${orderProductBatch?.order?.externalStatus?.toLowerCase()}`)}
                            </Tag>
                        </BatchItem>
                    </div>
                </section>

            </div>
        </div>

    )
}

export default MarkingCodeProductBatches