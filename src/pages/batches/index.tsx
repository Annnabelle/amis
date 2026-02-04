import { useAppDispatch, useAppSelector } from 'app/store'
import { useEffect, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate, useParams } from 'react-router-dom'
import type { BatchTableDataType } from 'entities/markingCodes/ui/tableData/markingCodes/types'
import { MarkingCodeTableColumns } from 'entities/markingCodes/ui/tableData/markingCode'
import MainLayout from 'shared/ui/layout'
import Heading from 'shared/ui/mainHeading'
import ComponentTable from 'shared/ui/table'
import { getMarkingCodeById } from 'entities/markingCodes/model'
import CustomButton from 'shared/ui/button'
import {OrderStatus} from "entities/markingCodes/dtos";
import {toast} from "react-toastify";
import {createUtilizationReport} from "entities/utilization/model";
import {getBackendErrorMessage} from "shared/lib/getBackendErrorMessage.ts";
import dayjs from "dayjs";

const Batches = () => {
    const navigate = useNavigate()
    const { t } = useTranslation();
    const dispatch = useAppDispatch()
    const { orgId, orderId } = useParams<{
        orgId: string;
        orderId: string;
    }>();
    const markingCodeById = useAppSelector((state) => state.markingCodes.markingCodeById)

    useEffect(() => {
        if (orderId){
            dispatch(getMarkingCodeById({id: orderId}))
        }
    }, [dispatch, orderId])

    const batchData = markingCodeById?.batches

    const MarkingCodeData = useMemo(() => {
        return batchData?.map((batch, index) => ({
            key: index + 1,
            id: markingCodeById?.id,
            batchNumber: batch.batchNumber,
            batchId: batch.id,
            gtin: batch.gtin,
            packageType: batch.packageType,
            productId: batch.productId,
            productName: batch.productName,
            quantity: batch.quantity,
            serialNumberType: batch.serialNumberType,
            serialNumbers: batch.serialNumbers,
            status: batch.status ?? '',
        }))
    }, [batchData, markingCodeById]);

    const handleApplyAll = async () => {
        if (!markingCodeById || !batchData?.length) {
            toast.warning(t("markingCodes.applyAll.noBatchesToApply"));
            return;
        }

        for (const batch of batchData) {
            try {
                const results = await dispatch(
                    createUtilizationReport({
                        orderId: markingCodeById.id,
                        batchId: batch.id,
                    })
                ).unwrap();

                results.forEach((report) => {
                    toast.success(
                        `Батч ${batch.batchNumber}: отчет №${report.reportNumber} создан`
                    );
                });

            } catch (error: any) {
                toast.error(
                    getBackendErrorMessage(error, t('common.error'))
                );
            }
        }

        dispatch(getMarkingCodeById({ id: markingCodeById.id }));
    };

    return (
    <MainLayout>
        <Heading
            title={`${t('markingCodes.orderNumber')}: ${markingCodeById?.orderNumber || ''}`}
            extraSubtitles={{
                orderNumber: {
                    title: `${t('markingCodes.batches.orderNumber')}:`,
                    value: `${markingCodeById?.orderNumber || ''}`
                },
                orderTime: {
                    title: `${t('markingCodes.batches.orderTime')}:`,
                    value: `${dayjs(markingCodeById?.orderedAt).format('DD-MM-YYYY HH:mm:ss')  || ''}`
                },
                orderStatus: {
                    title: `${t('markingCodes.batches.orderStatus')}:`,
                    value: markingCodeById?.status
                        ? t(`markingCodes.batches.orderNotExternalStatus.${markingCodeById.status}`)
                        : ''
                },
                turonOrderID: {
                    title: `${t('markingCodes.batches.turonOrderID')}:`,
                    value: `${markingCodeById?.providerOrderId || ''}`
                }
            }}
        >
            <div className="btns-group">
                {markingCodeById?.status?.toString() === OrderStatus.CodesReceived && (
                    <CustomButton
                        onClick={handleApplyAll}
                    >
                        {t('btn.applyAll')}
                    </CustomButton>
                )}
                <CustomButton className='outline' onClick={() => navigate(`/organization/${orgId}/orders`)}>{t("markingCodes.backToOrders")}</CustomButton>
            </div>
        </Heading>
        <div className="box">
            <div className="box-container">
                <div className="box-container-items">
                    <ComponentTable<BatchTableDataType>
                        columns={MarkingCodeTableColumns(t, orgId)}
                        data={MarkingCodeData}
                    />
                </div>
            </div>
        </div>
    </MainLayout>
  )
}

export default Batches


