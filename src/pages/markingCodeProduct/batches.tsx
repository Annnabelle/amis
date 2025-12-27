import { useAppDispatch, useAppSelector } from '../../store'
import {useEffect} from 'react'
import { useTranslation } from 'react-i18next'
import {getBatch} from '../../store/markingCodes'
import {Link, useParams} from "react-router-dom";

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
        <div className="box">
            <div className="box-batch-container">
                <div className="box-batch-container-items">
                    {orderProductBatch?.batchNumber && (
                        <div className="box-batch-container-items-item">
                            <div className="box-batch-container-items-item-title">
                                <h5 className="title"> {t("markingCodes.batches.batchData.batchNumber")} :</h5>
                            </div>
                            <div className="box-batch-container-items-item-subtitle">
                                <p className="subtitle">{orderProductBatch?.batchNumber}</p>
                            </div>
                        </div>
                    )}
                    {orderProductBatch?.packageType && (
                        <div className="box-batch-container-items-item">
                            <div className="box-batch-container-items-item-title">
                                <h5 className="title">{t("markingCodes.batches.batchData.packagingType")} :</h5>
                            </div>
                            <div className="box-batch-container-items-item-subtitle">
                                <p className="subtitle">
                                    {t(`markingCodes.packageType.${orderProductBatch?.packageType?.toLowerCase()}`)}
                                </p>
                            </div>
                        </div>
                    )}
                </div>
                <div className="box-batch-container-items">
                    {orderProductBatch?.order.orderNumber && (
                        <div className="box-batch-container-items-item">
                            <div className="box-batch-container-items-item-title">
                                <h5 className="title">{t("markingCodes.batches.batchData.orderNumber")} :</h5>
                            </div>
                            <div className="box-batch-container-items-item-subtitle">
                                <Link to={`/orders/${orderProductBatch.order.id}`} className="subtitle link">{orderProductBatch?.order.orderNumber}</Link>
                            </div>
                        </div>
                    )}
                    {orderProductBatch?.order.userId && (
                        <div className="box-batch-container-items-item">
                            <div className="box-batch-container-items-item-title">
                                <h5 className="title">{t("markingCodes.batches.batchData.executor")} :</h5>
                            </div>
                            <div className="box-batch-container-items-item-subtitle">
                                <p className="subtitle">{orderProductBatch?.order.userId}</p>
                            </div>
                        </div>
                    )}
                </div>
                <div className="box-batch-container-items">
                    {orderProductBatch?.productName && (
                        <div className="box-batch-container-items-item">
                            <div className="box-batch-container-items-item-title">
                                <h5 className="title">{t("markingCodes.batches.batchData.productName")} :</h5>
                            </div>
                            <div className="box-batch-container-items-item-subtitle">
                                <Link to={`/products/${orderProductBatch.productId}`} className="subtitle link">{orderProductBatch?.productName}</Link>
                            </div>
                        </div>
                    )}
                    {orderProductBatch?.gtin && (
                        <div className="box-batch-container-items-item">
                            <div className="box-batch-container-items-item-title">
                                <h5 className="title">{t("markingCodes.batches.batchData.gtin")} :</h5>
                            </div>
                            <div className="box-batch-container-items-item-subtitle">
                                <p className="subtitle">{orderProductBatch?.gtin}</p>
                            </div>
                        </div>
                    )}
                </div>
                <div className="box-batch-container-items">
                    {orderProductBatch?.order?.orderedAt && (
                        <div className="box-batch-container-items-item">
                            <div className="box-batch-container-items-item-title">
                                <h5 className="title">{t("markingCodes.batches.batchData.orderTime")} :</h5>
                            </div>
                            <div className="box-batch-container-items-item-subtitle">
                                <p className="subtitle">{orderProductBatch?.order?.orderedAt}</p>
                            </div>
                        </div>
                    )}
                    {orderProductBatch?.quantity && (
                        <div className="box-batch-container-items-item">
                            <div className="box-batch-container-items-item-title">
                                <h5 className="title">{t("markingCodes.batches.batchData.numberOfMarkingCodes")} :</h5>
                            </div>
                            <div className="box-batch-container-items-item-subtitle">
                                <p className="subtitle">{orderProductBatch?.quantity}</p>
                            </div>
                        </div>
                    )}
                </div>
                <div className="box-batch-container-items">
                    {orderProductBatch?.order?.providerOrderId && (
                        <div className="box-batch-container-items-item">
                            <div className="box-batch-container-items-item-title">
                                <h5 className="title">{t("markingCodes.batches.batchData.turonOrderID")} :</h5>
                            </div>
                            <div className="box-batch-container-items-item-subtitle">
                                <p className="subtitle">{orderProductBatch?.order?.providerOrderId}</p>
                            </div>
                        </div>
                    )}
                    {orderProductBatch?.status && (
                        <div className="box-batch-container-items-item">
                            <div className="box-batch-container-items-item-title">
                                <h5 className="title">{t("markingCodes.batches.batchData.batchStatus")} :</h5>
                            </div>
                            <div className="box-batch-container-items-item-subtitle">
                                <p className="subtitle">
                                    {t(`markingCodes.batches.batchesOrderStatus.${orderProductBatch?.status.toLowerCase()}`)}
                                </p>
                            </div>
                        </div>
                    )}
                </div>
                <div className="box-batch-container-items">
                    {orderProductBatch?.order?.status && (
                        <div className="box-batch-container-items-item">
                            <div className="box-batch-container-items-item-title">
                                <h5 className="title">{t("markingCodes.batches.batchData.orderStatus")} :</h5>
                            </div>
                            <div className="box-batch-container-items-item-subtitle">
                                <p className="subtitle">
                                    {t(`markingCodes.batches.orderNotExternalStatus.${orderProductBatch?.order?.status.toLowerCase()}`)}
                                </p>
                            </div>
                        </div>
                    )}
                    {orderProductBatch?.order?.externalStatus && (
                        <div className="box-batch-container-items-item">
                            <div className="box-batch-container-items-item-title">
                                <h5 className="title">{t("markingCodes.batches.batchData.turonOrderStatus")} :</h5>
                            </div>
                            <div className="box-batch-container-items-item-subtitle">
                                <p className="subtitle">
                                    {t(`markingCodes.markingCodesOrderStatus.${orderProductBatch?.order?.externalStatus.toLowerCase()}`)}
                                </p>
                            </div>
                        </div>
                    )}
                </div>
                <div className="box-batch-container-items">
                    {orderProductBatch?.externalStatus && (
                        <div className="box-batch-container-items-item">
                            <div className="box-batch-container-items-item-title">
                                <h5 className="title">{t("markingCodes.batches.batchData.batchStatusInTuron")} :</h5>
                            </div>
                            <div className="box-batch-container-items-item-subtitle">
                                <p className="subtitle">
                                    {t(`markingCodes.batches.batchData.externalStatus.${orderProductBatch?.externalStatus.toLowerCase()}`)}
                                 </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default MarkingCodeProductBatches