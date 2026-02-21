import { useAppDispatch, useAppSelector } from 'app/store'
import {useEffect, useMemo, useState} from 'react'
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
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const { orderId, batchId } = useParams<{
        orderId: string;
        batchId: string;
    }>();

    useEffect(() => {
        if (!orderId || !batchId) return;

        dispatch(getOrderProduct({ orderId, batchId, page, limit }));
    }, [dispatch, orderId, batchId, page, limit]);

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

    const paginationCurrent =
        orderProduct && 'page' in orderProduct ? orderProduct.page : page;
    const paginationPageSize =
        orderProduct && 'limit' in orderProduct ? orderProduct.limit : limit;
    const paginationTotal =
        orderProduct && 'total' in orderProduct ? orderProduct.total : 0;

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
                        pagination={{
                            current: paginationCurrent,
                            pageSize: paginationPageSize,
                            total: paginationTotal,
                            showSizeChanger: { showSearch: false },
                            pageSizeOptions: ['10', '15', '20', '25'],
                            locale: { items_per_page: '' },
                            onChange: (nextPage, nextPageSize) => {
                                if (!orderId || !batchId) return;
                                const newLimit = nextPageSize || paginationPageSize;
                                const isPageSizeChanged = newLimit !== paginationPageSize;
                                setLimit(newLimit);
                                setPage(isPageSizeChanged ? 1 : nextPage);
                            },
                        }}
                    />
                </div>
            </div>
        </div>
    </MainLayout>
  )
}

export default MarkingCodeProduct


