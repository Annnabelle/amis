import React, {useEffect, useMemo} from "react";
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

const AggregationReportPage: React.FC = () => {
    const { orderId, id } = useParams<{
        orderId: string;
        id: string;
    }>();
    const { t } = useTranslation();
    const navigateBack = useNavigationBack();
    const dispatch = useAppDispatch();

    const units = useAppSelector((state) => state.aggregations.units)
    // const dataLimit = useAppSelector((state) => state.aggregations.limit)
    // const dataPage = useAppSelector((state) => state.aggregations.page)
    // const dataTotal = useAppSelector((state) => state.aggregations.total)

    useEffect(() => {
        if (id) dispatch(fetchOneAggregationReport({ id }));
    }, [id, dispatch]);

    useEffect(() => {
        if (id) dispatch(fetchAggregationUnits({aggregationId: id }));
    }, [id, dispatch]);

    console.log("units", units)

    // const codesData = [];
    // reportData?.units.forEach((unit, index) => {
    //     unit.codes.forEach((code, codeIndex) => {
    //         codesData.push( {
    //             key: unit.id,
    //             number: index + 1,
    //             codeNumber: codeIndex,
    //             parentCode: unit.unitSerialNumber,
    //             code: code,
    //         })
    //     })
    // })

    const codesData = useMemo(() => {
        if (!id || !units[id]?.data) return [];

        return units[id].data.map((unit, index) => ({
            number: index + 1,                  // порядковый номер
            key: `${unit.unitId}-${index}`,                  // уникальный ключ для строки
            parentCode: String(unit.unitNumber),        // номер/серия юнита
            codeNumber: unit.codeNumber,        // порядковый номер кода
            code: unit.code,                    // сам код
        }));
    }, [units, id]);

    return (
        <MainLayout>
            <Heading title={t('aggregations.agregationReportPage.aggregation')} subtitle={t('organizations.subtitle')}>
                    <CustomButton className='outline' onClick={() => navigateBack(`/organization/${orderId}/agregations`)}>{t('btn.back')}</CustomButton>
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
