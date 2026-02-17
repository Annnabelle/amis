import React, {useEffect, useMemo, useState} from "react";
import {useParams} from "react-router-dom";
import {useAppDispatch, useAppSelector} from "app/store";
import {fetchAggregationUnits, fetchOneAggregationReport} from "entities/aggregation/model";
import MainLayout from "shared/ui/layout";
import CustomButton from "shared/ui/button";
import Heading from "shared/ui/mainHeading";
import {useTranslation} from "react-i18next";
import {useNavigationBack} from "shared/lib";
import AgregationReport from "./reports.tsx";
import ComponentTable from "shared/ui/table";
import {UnitsColumns} from "entities/aggregation/ui/tableData/agregationReport";
import type { UnitCodeType} from "entities/aggregation/ui/tableData/agregationReport/types.ts";
import type {ExportAggregationReportParams} from "entities/export/types";
import {downloadReport} from "entities/export/model";
import ExportDropdownButton from "shared/ui/exportDropdown";
import {getBackendErrorMessage} from "shared/lib/getBackendErrorMessage.ts";
import {toast} from "react-toastify";
import {Pagination, Select} from "antd";

type ExportLoadingState = {
    type: "group" | "unit";
    format: "short" | "long";
} | null;

const AggregationReportPage: React.FC = () => {
    const { orderId, id } = useParams<{
        orderId: string;
        id: string;
    }>();
    const { t } = useTranslation();
    const navigateBack = useNavigationBack();
    const aggregation = useAppSelector(
        (state) => state.aggregations.oneAggregation
    );

    const exportError = useAppSelector(state => state.export.error);
    const dispatch = useAppDispatch();

    const units = useAppSelector((state) => state.aggregations.units)
    const unitsData = id ? (units[id]?.data ?? []) : [];
    const unitsTotal = id ? (units[id]?.total ?? 0) : 0;
    const [exportLoading, setExportLoading] = useState<ExportLoadingState>(null);
    const [groupsLimit, setGroupsLimit] = useState<2 | 3 | 4 | 5>(2);
    const [page, setPage] = useState(1);


    useEffect(() => {
        if (!exportError) return;

        toast.error(
            getBackendErrorMessage(exportError, t('common.error'))
        );
    }, [exportError, t]);

    useEffect(() => {
        if (id) dispatch(fetchOneAggregationReport({ id }));
    }, [id, dispatch]);

    useEffect(() => {
        if (!id) return;

        dispatch(
            fetchAggregationUnits({
                aggregationId: id,
                limit: groupsLimit,
                page,
            })
        );
    }, [id, dispatch, page, groupsLimit]);

    const codesData = useMemo(() => {
        if (!id || unitsData.length === 0) return [];

        const startIndex = (page - 1) * unitsData.length;

        return unitsData.map((unit, index) => ({
            number: startIndex + index + 1,
            key: `${unit.unitId}-${index}`,
            parentCode: String(unit.unitNumber),
            codeNumber: unit.codeNumber,
            code: unit.code,
        }));
    }, [unitsData, id, page]);

    useEffect(() => {
        if (id) dispatch(fetchOneAggregationReport({ id }));
    }, [id, dispatch]);

    const handleExport = async (
        type: "group" | "unit",
        format: "short" | "long"
    ) => {
        if (!id || !aggregation?.productionOrderNumber) return;

        const params: ExportAggregationReportParams = {
            format,
            ext: "csv",
            type,
        };

        setExportLoading({ type, format });

        try {
            await dispatch(
                downloadReport({
                    aggregationId: id,
                    params,
                })
            ).unwrap();

        } finally {
            setExportLoading(null);
        }
    };

    return (
        <MainLayout>
            <Heading title={t('aggregations.agregationReportPage.aggregation')} subtitle={t('organizations.subtitle')}>
                    <div className="btns-group export-dropdown">
                            <ExportDropdownButton
                                type="group"
                                loading={exportLoading?.type === "group"}
                                label={t("aggregations.exportGrouped")}
                                onExport={handleExport}
                                t={t}
                            />

                            <ExportDropdownButton
                                type="unit"
                                loading={exportLoading?.type === "unit"}
                                label={t("aggregations.exportUnit")}
                                onExport={handleExport}
                                t={t}
                            />

                            <CustomButton
                                className="outline"
                                onClick={() => navigateBack(`/organization/${orderId}/agregations`)}
                            >
                                {t("btn.back")}
                            </CustomButton>
                    </div>
            </Heading>
            <AgregationReport/>
            <div className="box">
                <div className="box-container">
                    <Select
                        value={groupsLimit}
                        style={{ width: 220 }}
                        onChange={(value) => {
                            setPage(1);
                            setGroupsLimit(value);
                        }}
                        options={[
                            { value: 2, label: `2 ${t("groups.groups")}` },
                            { value: 3, label: `3 ${t("groups.groups")}` },
                            { value: 4, label: `4 ${t("groups.groups")}` },
                            { value: 5, label: `5 ${t("groups.groups")}` },
                        ]}
                    />

                    <div className="box-container-items">
                        <ComponentTable<UnitCodeType>
                            columns={UnitsColumns(t)}
                            data={codesData}
                            pagination={false}
                        />
                    </div>
                    <Pagination
                        current={page}
                        pageSize={1}
                        total={totalPages}
                        showSizeChanger={false}
                        onChange={(nextPage) => {
                            setPage(nextPage);
                        }}
                        style={{ marginLeft: "auto" }}
                    />
                </div>
            </div>
        </MainLayout>
    );
};

export default AggregationReportPage;



