import { useAppDispatch, useAppSelector } from 'app/store'
import { useCallback, useEffect, useMemo, useState } from 'react'
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
import {notifyUtilizationReportsCreated} from "entities/utilization/lib/notifyCreated";
import {getBackendErrorMessage} from "shared/lib/getBackendErrorMessage.ts";
import dayjs from "dayjs";
import { useCan } from "entities/access/lib";
import { LifecycleTargetType } from 'entities/lifecycle/lib';
import { StatusChangeEntity } from 'entities/lifecycle/lib/statusChangeEntities';
import { useStatusChangeRefresh } from 'shared/lib/statusChanges';
import { useLifecycleTab } from 'widgets/lifecycle/useLifecycleTab';
import EntityTabs, { OVERVIEW_TAB_KEY } from 'shared/ui/entityTabs';
import { endpointAccessMap } from 'shared/config/endpointAccessMap';
import { StatusEntity, StatusScope } from "shared/config/statusCatalog";
import { getStatusLabel } from "shared/lib/useStatusLabel";

const Batches = () => {
    const navigate = useNavigate()
    const { t } = useTranslation();
    const dispatch = useAppDispatch()
    const canCreateUtilization = useCan(endpointAccessMap.utilizationReportsCreate);
    const { orgId, orderId } = useParams<{
        orgId: string;
        orderId: string;
    }>();
    const markingCodeById = useAppSelector((state) => state.markingCodes.markingCodeById)
    const { banner: lifecycleBanner, items: lifecycleTabItems } = useLifecycleTab({
        targetId: orderId,
        target: LifecycleTargetType.MarkingCodeOrder,
    });
    const [tablePage, setTablePage] = useState(1);
    const [tablePageSize, setTablePageSize] = useState(10);

    useEffect(() => {
        if (orderId){
            dispatch(getMarkingCodeById({id: orderId}))
        }
    }, [dispatch, orderId])

    const refreshOrder = useCallback(() => {
        if (orderId) {
            dispatch(getMarkingCodeById({ id: orderId }));
        }
    }, [dispatch, orderId]);

    // Статус заказа меняет обработчик очереди: карточка перечитывает себя сама.
    useStatusChangeRefresh(StatusChangeEntity.MarkingCodeOrder, orderId, refreshOrder);
    // Переходы партий приходят отдельными событиями со своими id, поэтому
    // карточка слушает набор id своих партий.
    const batchIds = useMemo(
        () => markingCodeById?.batches?.map((batch) => batch.id) ?? [],
        [markingCodeById?.batches],
    );

    useStatusChangeRefresh(
        StatusChangeEntity.MarkingCodeOrderBatch,
        batchIds,
        refreshOrder,
    );

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

        const created: string[] = [];
        let failure: unknown = null;

        for (const batch of batchData) {
            try {
                const results = await dispatch(
                    createUtilizationReport({
                        orderId: markingCodeById.id,
                        batchId: batch.id,
                    })
                ).unwrap();

                created.push(...results.map((report) => report.reportNumber));
            } catch (error: unknown) {
                failure = failure ?? error;
            }
        }

        notifyUtilizationReportsCreated(t, created);

        if (failure) {
            toast.error(getBackendErrorMessage(failure, t('common.error')));
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
                    value: `${dayjs(markingCodeById?.orderedAt).format('DD.MM.YYYY HH:mm:ss')  || ''}`
                },
                orderStatus: {
                    title: `${t('markingCodes.batches.orderStatus')}:`,
                    value: markingCodeById?.status
                        ? getStatusLabel(t, StatusEntity.MarkingCodeOrder, StatusScope.Internal, markingCodeById.status)
                        : ''
                },
                turonOrderID: {
                    title: `${t('markingCodes.batches.turonOrderID')}:`,
                    value: `${markingCodeById?.providerOrderId || ''}`
                }
            }}
        >
            <div className="btns-group">
                {canCreateUtilization &&
                    markingCodeById?.status?.toString() === OrderStatus.CodesReceived && (
                    <CustomButton
                        onClick={handleApplyAll}
                    >
                        {t('btn.applyAll')}
                    </CustomButton>
                )}
                <CustomButton variant='outline' onClick={() => navigate(`/organization/${orgId}/orders`)}>{t("markingCodes.backToOrders")}</CustomButton>
            </div>
        </Heading>
        {/* Незакрытая серия ошибок видна на любой вкладке — это главный сигнал карточки. */}
        {lifecycleBanner}

        <EntityTabs
            defaultActiveKey={OVERVIEW_TAB_KEY}
            items={[
                {
                    key: OVERVIEW_TAB_KEY,
                    label: t('lifecycle.tabs.overview'),
                    children: (
                        <div className="box">
                            <div className="box-container">
                                <div className="box-container-items">
                                    <ComponentTable<BatchTableDataType>
                                        columns={MarkingCodeTableColumns(t, orgId)}
                                        data={MarkingCodeData}
                                        pagination={{
                                            current: tablePage,
                                            pageSize: tablePageSize,
                                            total: MarkingCodeData?.length || 0,
                                            showSizeChanger: { showSearch: false },
                                            pageSizeOptions: ['10', '20', '30', '40', '50'],
                                            locale: { items_per_page: '' },
                                            onChange: (page, pageSize) => {
                                                const newLimit = pageSize || tablePageSize;
                                                const isPageSizeChanged = newLimit !== tablePageSize;
                                                setTablePageSize(newLimit);
                                                setTablePage(isPageSizeChanged ? 1 : page);
                                            },
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                    ),
                },
                ...lifecycleTabItems,
            ]}
        />
    </MainLayout>
  )
}

export default Batches

