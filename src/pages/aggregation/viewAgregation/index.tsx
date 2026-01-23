import React, {useEffect, useMemo, useState} from "react";
import {useParams} from "react-router-dom";
import {useAppDispatch, useAppSelector} from "../../../store";
import {fetchAggregationUnits, fetchOneAggregationReport} from "../../../store/aggregation";
import MainLayout from "../../../components/layout";
import CustomButton from "../../../components/button";
import Heading from "../../../components/mainHeading";
import {useTranslation} from "react-i18next";
import {useNavigationBack} from "../../../utils/utils.ts";
import AgregationReport from "./reports.tsx";
import ComponentTable from "../../../components/table";
import {UnitsColumns} from "../../../tableData/agregationReport";
import type { UnitCodeType} from "../../../tableData/agregationReport/types.ts";
import type {ExportAggregationReportParams} from "../../../types/export";
import {downloadReport} from "../../../store/export";
import ExportDropdownButton from "../../../components/exportDropdown";

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
    const dispatch = useAppDispatch();

    const units = useAppSelector((state) => state.aggregations.units)
    const [exportLoading, setExportLoading] = useState<ExportLoadingState>(null);

    useEffect(() => {
        if (id) dispatch(fetchOneAggregationReport({ id }));
    }, [id, dispatch]);

    useEffect(() => {
        if (id) dispatch(fetchAggregationUnits({aggregationId: id }));
    }, [id, dispatch]);

    const codesData = useMemo(() => {
        if (!id || !units[id]?.data) return [];

        return units[id].data.map((unit, index) => ({
            number: index + 1,
            key: `${unit.unitId}-${index}`,
            parentCode: String(unit.unitNumber),
            codeNumber: unit.codeNumber,
            code: unit.code,
        }));
    }, [units, id]);

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
                    <div className="box-container-items">
                        <ComponentTable<UnitCodeType>
                            columns={UnitsColumns(t)}
                            data={codesData}
                        />
                    </div>
                </div>
            </div>
        </MainLayout>
    );
};

export default AggregationReportPage;
