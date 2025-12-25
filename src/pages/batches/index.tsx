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
    const { t } = useTranslation();
    const dispatch = useAppDispatch()
    const markingCodeById = useAppSelector((state) => state.markingCodes.markingCodeById)
    const { id } = useParams<{ id: string }>();

     useEffect(() => {
        if (id){
            dispatch(getMarkingCodeById({id: id}))
        }
    }, [dispatch, id])

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
        if (!markingCodeById || !batchData || batchData.length === 0) {
            toast.warning(t('markingCodes.applyAll.noBatchesToApply'));
            return;
        }

        let successCount = 0;
        let alreadyAppliedCount = 0;

        for (const batch of batchData) {
            try {
                const result = await dispatch(
                    createUtilizationReport({
                        orderId: markingCodeById.id,
                        batchId: batch.id,
                    })
                ).unwrap();

                const reportsArray = result;
                const reportNum = Array.isArray(reportsArray) && reportsArray.length > 0
                    ? reportsArray[0].reportNumber
                    : null;

                if (reportNum) {
                    // Новый отчёт успешно создан
                    successCount++;
                    toast.success(`Батч ${batch.batchNumber}: отчет №${reportNum} создан`);
                } else {
                    // Отчёт уже был создан ранее
                    alreadyAppliedCount++;
                    toast.info(`Батч ${batch.batchNumber}: отчет уже был создан ранее`);
                }
            } catch (err: any) {
                const msg = err?.message || 'Ошибка создания отчета';
                toast.error(`Батч ${batch.batchNumber}: ${msg}`);
            }
        }

        // Итоговое сообщение
        if (successCount > 0) {
            toast.success(`Создано новых отчетов: ${successCount}`);
        }
        if (alreadyAppliedCount > 0) {
            toast.info(`Уже были созданы ранее: ${alreadyAppliedCount} батч(ей)`);
        }

        // Обновляем данные в любом случае — статусы могли измениться
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
                <CustomButton className='outline' onClick={() => navigate(`/orders`)}>{t("markingCodes.backToOrders")}</CustomButton>
            </div>
        </Heading>
        <div className="box">
            <div className="box-container">
                <div className="box-container-items">
                    <ComponentTable<BatchTableDataType>
                        columns={MarkingCodeTableColumns(t)}
                        data={MarkingCodeData}
                    />
                </div>
            </div>
        </div>
    </MainLayout>
  )
}

export default Batches