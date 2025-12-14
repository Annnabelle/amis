import { Form } from 'antd'
import { useAppDispatch, useAppSelector } from '../../store'
import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate, useParams } from 'react-router-dom'
import type { MarkingCodeTableDataType } from '../../tableData/markingCodes/types'
import { MarkingCodeTableColumns } from '../../tableData/markingCode'
import MainLayout from '../../components/layout'
import Heading from '../../components/mainHeading'
import ComponentTable from '../../components/table'
import type { OrderResponse } from '../../types/markingCodes'
import { getMarkingCodeById } from '../../store/markingCodes'
import CustomButton from '../../components/button'

const MarkingCodeProduct = () => {
    const navigate = useNavigate()
    const { t } = useTranslation();
    const dispatch = useAppDispatch()
    const markingCodeById = useAppSelector((state) => state.markingCodes.markingCodeById)
    const [form] = Form.useForm()
    const { id } = useParams<{ id: string }>();

     useEffect(() => {
        if (id){
            dispatch(getMarkingCodeById({id: id}))
        }
    }, [dispatch, id])

    const productData = markingCodeById?.products

    const MarkingCodeData = useMemo(() => {
        return productData?.map((product, index) => ({
            key: index.toString() + 1,
            productId: product.productId,
            name: product.name,
            gtin: product.gtin,
            quantity: product.quantity,
            cisType: product.cisType,
            serialNumberType: product.serialNumberType,
            serialNumbers: product.serialNumbers?.join(', ') ?? '',
        }))
    }, [productData]);

    const [modalState, setModalState] = useState<{
        retrieveMarkingCode: boolean;
        markingCodeData: OrderResponse | null; 
      }>({
        retrieveMarkingCode: false,
        markingCodeData: null, 
      });

    const handleModal = (modalName: string, value: boolean) => {
        setModalState((prev) => ({...prev, [modalName] : value}));
    }

    const handleRowClick = (type: 'MarkingCode', action: 'retrieve' | 'edit' | 'delete', record: MarkingCodeTableDataType) => {
        console.log(`Clicked on ${type}, action: ${action}, record:`, record);
        if (type === "MarkingCode" && action === "retrieve") {
            navigate(`/marking-code/1`); //${record.key}
        }
    };
  return (
    <MainLayout>
        <Heading 
            title={`${t('markingCodes.markingCodes')}`}
        >
            <CustomButton className='outline' onClick={() => navigate(`/marking-codes/${id}`)}>
                {t("markingCodes.backToBatches")}
            </CustomButton>
        </Heading>
        <div className="box">
            <div className="box-container">
                <div className="box-container-items">
                    <ComponentTable<MarkingCodeTableDataType> 
                        columns={MarkingCodeTableColumns(t, handleRowClick)}
                        data={MarkingCodeData}
                        onRowClick={(record) => handleRowClick('MarkingCode', 'retrieve', record)}
                    />
                </div>
            </div>
        </div>
    </MainLayout>
  )
}

export default MarkingCodeProduct