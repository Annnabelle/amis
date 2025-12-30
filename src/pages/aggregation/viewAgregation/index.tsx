import React, {useEffect, useMemo} from "react";
import {useParams} from "react-router-dom";
import {useAppDispatch, useAppSelector} from "../../../store";
import {fetchOneAggregationReport} from "../../../store/aggregation";
import MainLayout from "../../../components/layout";
import CustomButton from "../../../components/button";
import Heading from "../../../components/mainHeading";
import {useTranslation} from "react-i18next";
import {useNavigationBack} from "../../../utils/utils.ts";
import AgregationReport from "./reports.tsx";
import ComponentTable from "../../../components/table";
import {UnitsColumns} from "../../../tableData/agregationReport";
import type {AggregationUnitDataType} from "../../../tableData/agregationReport/types.ts";

const AggregationReportPage: React.FC = () => {
    const { orderId, id } = useParams<{
        orderId: string;
        id: string;
    }>();
    const { t } = useTranslation();
    const navigateBack = useNavigationBack();
    const dispatch = useAppDispatch();

    const reportData = useAppSelector(
        (state) => state.aggregations.oneAggregation
    );

    useEffect(() => {
        if (id) dispatch(fetchOneAggregationReport({ id }));
    }, [id, dispatch]);

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
        if (!reportData?.units) return [];

        const result: {
            number: number,
                key: string
                parentCode: string,
                codeNumber: number,
                code: string,
        }[] = [];

        reportData.units.forEach((unit, index) => {
            unit.codes.forEach((code, codeIndex) => {
                result.push({
                    number: index + 1,
                    key: unit.id,
                    parentCode: unit.unitSerialNumber,
                    codeNumber: codeIndex + 1,
                    code: code,
                });
            });
        });

        return result;
    }, [reportData]);

    // console.log("codesData", codesData)
    // const unitsData = useMemo(() => {
    //     return reportData?.units.map((unit, index) => ({
    //         key: unit.id,
    //         number: index + 1,
    //         unitSerialNumber: unit.unitSerialNumber,
    //         aggregationItemsCount: unit.aggregationItemsCount,
    //         aggregationUnitCapacity: unit.aggregationUnitCapacity,
    //         codesCount: unit.codes.length,
    //         shouldBeUnbundled: unit.shouldBeUnbundled === undefined ? "-" : unit.shouldBeUnbundled ? t('common.yes')
    //             : t('common.no'),
    //         state: unit.state.toLowerCase()
    //     })) || [];
    // }, [reportData]);

    return (
        <MainLayout>
            <Heading title={t('aggregations.agregationReportPage.aggregation')} subtitle={t('organizations.subtitle')}>
                    <CustomButton className='outline' onClick={() => navigateBack(`/organization/${orderId}/agregations`)}>{t('btn.back')}</CustomButton>
            </Heading>
            <AgregationReport/>
            <div className="box">
                <div className="box-container">
                    <div className="box-container-items">
                        <ComponentTable<AggregationUnitDataType>
                            columns={UnitsColumns(t)}
                            // @ts-expect-error
                            data={codesData}
                        />
                    </div>
                </div>
            </div>
        </MainLayout>
    );
};

export default AggregationReportPage;
