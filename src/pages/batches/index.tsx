import { useAppDispatch, useAppSelector } from '../../store'
import { useEffect, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate, useParams } from 'react-router-dom'
import type { BatchTableDataType } from '../../tableData/markingCodes/types'
import { MarkingCodeTableColumns } from '../../tableData/markingCode'
import MainLayout from '../../components/layout'
import Heading from '../../components/mainHeading'
import ComponentTable from '../../components/table'
import { getMarkingCodeById } from '../../store/markingCodes'
import CustomButton from '../../components/button'
import { formatDate } from '../../utils/utils'
import {OrderStatus} from "../../dtos/markingCodes";
import {toast} from "react-toastify";
import {createUtilizationReport} from "../../store/utilization";

const Batches = () => {
    const navigate = useNavigate()
    const { t, i18n } = useTranslation();
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

        let successCount = 0;

        for (const batch of batchData) {
            try {
                const result = await dispatch(
                    createUtilizationReport({
                        orderId: markingCodeById.id,
                        batchId: batch.id,
                    })
                ).unwrap();

                successCount++;

                toast.success(
                    `Батч ${batch.batchNumber}: отчет №${result.reportNumber} создан`
                );
            } catch (err: any) {
                const lang = i18n.language as 'ru' | 'uz' | 'en';

                const backendMessage =
                    err?.errorMessage?.[lang] ||
                    err?.errorMessage?.ru || // fallback
                    t('common.error');       // общий перевод

                toast.error(backendMessage);
            }
        }

        if (successCount > 0) {
            toast.success(`Создано новых отчетов: ${successCount}`);
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
                    value: `${formatDate(markingCodeById?.orderedAt) || ''}`
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