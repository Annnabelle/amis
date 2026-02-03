import { useAppDispatch, useAppSelector } from 'app/store'
import {useEffect, useMemo} from 'react'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'
import MainLayout from 'shared/ui/layout'
import Heading from 'shared/ui/mainHeading'
import {getBatch, getOrderProduct} from 'entities/markingCodes/model'
import ComponentTable from "shared/ui/table";
import type {OrderProductDataType} from "entities/markingCodes/ui/tableData/orderProduct/types.ts";
import {OrderProductTableColumns} from "entities/markingCodes/ui/tableData/orderProduct";
import MarkingCodeProductBatches from "./batches.tsx";

const MarkingCodeProduct = () => {
    const { t } = useTranslation();
    const dispatch = useAppDispatch()
    const orderProduct = useAppSelector((state) => state.markingCodes.orderProductCodes)
    const orderProductBatch = useAppSelector((state) => state.markingCodes.batch)
    const dataLimit = useAppSelector((state) => state.markingCodes.limit)
    const dataPage = useAppSelector((state) => state.markingCodes.page)
    const { orderId, batchId } = useParams<{
        orderId: string;
        batchId: string;
    }>();

    useEffect(() => {
        if (!orderId || !batchId) return;

        dispatch(getOrderProduct({ orderId, batchId, page: dataPage || 1, limit: dataLimit || 10 }));
    }, [dispatch, orderId, batchId]);

    useEffect(() => {
        if (!orderId || !batchId) return;
        dispatch(getBatch({orderId: orderId, batchId: batchId}))
    }, [dispatch]);

    const OrderProductData = useMemo(() => {
        if (!orderProduct || !orderProduct.success || !('data' in orderProduct)) {
            return [];
        }

        return orderProduct.data.map((product, index) => ({
            key: `${index + 1}`,
            code: product.code,
            status: product.status,
        }));
    }, [orderProduct]);

    return (
    <MainLayout>
        <Heading 
            title={`${t('markingCodes.tableTitles.batchNumber')}: ${orderProductBatch?.batchNumber}`}
        />
        <MarkingCodeProductBatches/>
        <div className="box">
            <div className="box-container">
                {/*<div className="box-container-items">*/}
                {/*    <div className="box-container-items-item">*/}
                {/*        /!*<div className="box-container-items-item-filters filters-large filters-large-inputs">*!/*/}
                {/*        /!*   *!/*/}
                {/*        /!*</div>*!/*/}
                {/*    </div>*/}
                {/*</div>*/}
                <div className="box-container-items">
                    <ComponentTable<OrderProductDataType>
                        columns={OrderProductTableColumns(t)}
                        data={OrderProductData}
                    />
                </div>
            </div>
        </div>
    </MainLayout>
  )
}

export default MarkingCodeProduct


