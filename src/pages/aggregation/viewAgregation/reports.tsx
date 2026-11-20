import { useParams } from "react-router-dom";
import BatchItem from "../../markingCodeProduct/batchItem";
import React from "react";
import { useTranslation } from "react-i18next";
import { useGetAggregationReportByIdQuery } from "entities/aggregation/api";
import "../../markingCodeProduct/styles.sass"
import { Tag } from "antd";
import { statusColors } from "shared/ui/statuses";
import { PermissionLink } from "entities/access/ui";
import { endpointAccessMap } from 'shared/config/endpointAccessMap';
import { StatusEntity, LifecycleScope } from "shared/config/statusCatalog";
import { getStatusLabel } from "shared/lib/useStatusLabel";

const getStatusColor = (status?: string | null) => {
    if (!status) return 'default';

    return statusColors[status.toLowerCase()] ?? 'default';
};

const AgregationReport: React.FC = () => {
    const { orgId, id } = useParams<{
        orgId: string;
        id: string;
    }>();
    const { t } = useTranslation();

    const { data: reportData } = useGetAggregationReportByIdQuery(
        { id: id ?? '' },
        { skip: !id }
    );

    return (
        <div className="box batch-inner-box">
            <div className="box-batch-container">
                <section className="batch-section">
                    <h4 className="section-title">{t("aggregations.agregationReportPage.productName")}:</h4>
                    {reportData?.product.name && (
                        <div className="product-title">
                            <PermissionLink
                                endpoint={endpointAccessMap.productsRead}
                                to={`/organization/${orgId}/products/${reportData?.product.id}`}
                            >
                                {reportData?.product.name}
                            </PermissionLink>
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
                                    {getStatusLabel(t, StatusEntity.AggregationReport, LifecycleScope.Internal, reportData?.status)}
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


