import {useMemo, useState} from 'react'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'
import MainLayout from 'widgets/appShell'
import Heading from 'shared/ui/mainHeading'
import {
    useGetOrderBatchQuery,
    useGetOrderProductCodesQuery,
} from 'entities/markingCodes/api'
import { getApiErrorMessage } from 'shared/api'
import ComponentTable from "shared/ui/table";
import type {OrderProductDataType} from "entities/markingCodes/ui/tableData/orderProduct/types.ts";
import {OrderProductTableColumns} from "entities/markingCodes/ui/tableData/orderProduct";
import MarkingCodeProductBatches from "./batches.tsx";
import { endpointAccessMap } from 'shared/config/endpointAccessMap';
import { RequiredDataAlert } from 'entities/access/ui';
import { LifecycleTargetEntity } from 'entities/lifecycle/lib';
import { useLifecycleTab } from 'widgets/lifecycle/useLifecycleTab';
import EntityTabs, { OVERVIEW_TAB_KEY } from 'shared/ui/entityTabs';

const MarkingCodeProduct = () => {
    const { t } = useTranslation();
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const { orderId, batchId } = useParams<{
        orderId: string;
        batchId: string;
    }>();
    const {
        data: orderProduct,
        error: orderProductError,
    } = useGetOrderProductCodesQuery(
        { orderId: orderId ?? '', batchId: batchId ?? '', page, limit },
        { skip: !orderId || !batchId }
    );
    const { data: orderProductBatch, error: batchError } = useGetOrderBatchQuery(
        { orderId: orderId ?? '', batchId: batchId ?? '' },
        { skip: !orderId || !batchId }
    );
    const requestRejection = orderProductError ?? batchError;
    const requestError = requestRejection
        ? getApiErrorMessage(requestRejection, t('common.error'))
        : null;
    const { banner: lifecycleBanner, items: lifecycleTabItems } = useLifecycleTab({
        targetId: batchId,
        target: LifecycleTargetEntity.MarkingCodeOrderBatch,
    });

    const OrderProductData = useMemo(() => {
        if (!orderProduct) {
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
        <RequiredDataAlert
            endpoints={[endpointAccessMap.codesRead, endpointAccessMap.ordersRead]}
            errors={[requestError]}
        />
        <Heading 
            title={`${t('markingCodes.tableTitles.batchNumber')}: ${orderProductBatch?.batchNumber}`}
        />
        {/* Незакрытая серия ошибок видна на любой вкладке — это главный сигнал карточки. */}
        {lifecycleBanner}

        <EntityTabs
            defaultActiveKey={OVERVIEW_TAB_KEY}
            items={[
                {
                    key: OVERVIEW_TAB_KEY,
                    label: t('lifecycle.tabs.overview'),
                    children: (
                        <>
                            <MarkingCodeProductBatches/>
                            <div className="box">
                                <div className="box-container">
                                    <div className="box-container-items">
                                        <ComponentTable<OrderProductDataType>
                                            columns={OrderProductTableColumns(t)}
                                            data={OrderProductData}
                                            pagination={{
                                                current: paginationCurrent,
                                                pageSize: paginationPageSize,
                                                total: paginationTotal,
                                                showSizeChanger: { showSearch: false },
                                                pageSizeOptions: ['10', '20', '30', '40', '50'],
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
                        </>
                    ),
                },
                ...lifecycleTabItems,
            ]}
        />
    </MainLayout>
  )
}

export default MarkingCodeProduct

