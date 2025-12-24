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

    console.log('====================================');
    console.log("markingCodeById", markingCodeById);
    console.log('====================================');

    const batchData = markingCodeById?.batches

    console.log('====================================');
    console.log("productData", batchData);
    console.log('====================================');

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
                        onClick={() => navigate(`/orders`)}
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