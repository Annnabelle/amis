import {Link, useParams} from "react-router-dom";
import BatchItem from "../../markingCodeProduct/batchItem.tsx";
import React, {useEffect} from "react";
import {useTranslation} from "react-i18next";
import {useAppDispatch, useAppSelector} from "app/store";
import {fetchOneAggregationReport} from "entities/aggregation/model";
import "../../markingCodeProduct/styles.sass"
import {Tag} from "antd";
import {statusColors} from "shared/ui/statuses.tsx";

const getStatusColor = (status?: string | null) => {
    if (!status) return 'default';

    return statusColors[status.toLowerCase()] ?? 'default';
};

const AgregationReport: React.FC = () => {
    const { orderId, id } = useParams<{
        orderId: string;
        id: string;
    }>();
    const { t } = useTranslation();
    const dispatch = useAppDispatch();

    const reportData = useAppSelector(
        (state) => state.aggregations.oneAggregation
    );

    useEffect(() => {
        if (id) dispatch(fetchOneAggregationReport({ id }));
    }, [id, dispatch]);

    return (
        <div className="box batch-inner-box">
            <div className="box-batch-container">
                <section className="batch-section">
                    <h4 className="section-title">{t("aggregations.agregationReportPage.productName")}:</h4>
                    {reportData?.product.name && (
                        <div className="product-title">
                            <Link to={`/organization/${orderId}/products/${reportData?.product.id}`}>
                                {reportData?.product.name}
                            </Link>
                        </div>
                    )}
                </section>
                <section className="batch-section">
                    <h4 className="section-title">{t("aggregations.agregationReportPage.orders")}:</h4>
                    <div className="grid">
                        {reportData?.parent.orderNumber && (
                            <BatchItem label={t("aggregations.agregationReportPage.parentOrderNumber")}>
                                {reportData?.parent.orderNumber}
                            </BatchItem>
                        )}

                        {reportData?.child.orderNumber && (
                            <BatchItem label={t("aggregations.agregationReportPage.childOrderNumber")}>
                                {reportData?.child.orderNumber}
                            </BatchItem>
                        )}
                    </div>
                </section>
                <section className="batch-section">
                    <h4 className="section-title">{t("aggregations.agregationReportPage.batches")}: </h4>
                    <div className="grid">
                        {reportData?.parent.batchNumber && (
                            <BatchItem label={t("aggregations.agregationReportPage.parentBatchNumber")}>
                                {reportData?.parent.batchNumber}
                            </BatchItem>
                        )}

                        {reportData?.child.batchNumber && (
                            <BatchItem label={t("aggregations.agregationReportPage.childBatchNumber")}>
                                {reportData?.child.batchNumber}
                            </BatchItem>
                        )}
                    </div>
                </section>
                <section className="batch-section">
                    <h4 className="section-title">{t("aggregations.agregationReportPage.aggregations")}:</h4>
                    <div className="grid">
                        {reportData?.aggregationQuantity && (
                            <BatchItem label={t("aggregations.agregationReportPage.aggregationQuantity")}>
                                {reportData?.aggregationQuantity}
                            </BatchItem>
                        )}

                        {reportData?.quantityPerPackage && (
                            <BatchItem label={t("aggregations.agregationReportPage.quantityPerPackage")}>
                                {reportData?.quantityPerPackage}
                            </BatchItem>
                        )}
                    </div>
                </section>
                <section className="batch-section">
                    <div className="grid">
                        {reportData?.productionOrderNumber && (
                            <BatchItem label={t("aggregations.agregationReportPage.productionOrderNumber")}>
                                {reportData?.productionOrderNumber}
                            </BatchItem>
                        )}
                    </div>
                </section>
                <section className="batch-section">
                    <div className="grid">
                        {reportData?.status && (
                            <BatchItem label={t("markingCodes.tableTitles.status")}>
                                {/*{reportData?.status}*/}

                                <Tag color={getStatusColor(reportData?.status)}>
                                    {t(`aggregations.aggregationReportStatus.${reportData?.status}`)}
                                </Tag>
                            </BatchItem>
                        )}
                    </div>
                </section>
            </div>
        </div>

    )
}

export default AgregationReport


