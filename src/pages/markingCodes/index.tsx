import { Form, Select} from 'antd'
import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import MainLayout from 'shared/ui/layout'
import Heading from 'shared/ui/mainHeading'
import ComponentTable from 'shared/ui/table'
import CustomButton from 'shared/ui/button'
import ModalWindow from 'shared/ui/modalWindow'
import { MarkingCodesTableColumns } from 'entities/markingCodes/ui/tableData/markingCodes'
import type { MarkingCodesTableDataType } from 'entities/markingCodes/ui/tableData/markingCodes/types'
import { useGetMarkingCodeOrdersQuery } from 'entities/markingCodes/api'
import OrderForm from './createOrder'
import { useGetReferencesByTypeQuery } from 'entities/references/api'
import type { OrderBatchPopulated } from 'entities/markingCodes/types'
import type { OrderListQueryRequestDto } from 'entities/markingCodes/dtos';
import { useSearchProductsQuery } from 'entities/products/api'
import {useCreateUtilizationReportMutation} from "entities/utilization/api";
import {notifyUtilizationReportsCreated} from "entities/utilization/lib/notifyCreated";
import { useCreateCustomsCodeOrderMutation } from "entities/customsCodes/api";
import {toast} from "react-toastify";
import { BatchStatus } from "shared/types/dtos";
import {
    hasStatusInCatalog,
    LifecycleScope,
    StatusEntity,
} from "shared/config/statusCatalog";
import { getStatusLabel } from "shared/lib/useStatusLabel";
import {useParams} from "react-router-dom";
import {useSearchCompanyMembershipsQuery} from "entities/companyMemberships/api";
import {getBackendErrorMessage} from "shared/lib/getBackendErrorMessage.ts";
import { CompanyImportStage } from 'entities/companyImport/types';
import CompanyImportStageButton from 'widgets/companyImport/stageButton';
import FilterBar from "shared/ui/filterBar/filterBar.tsx";
import FilterBarItem from "shared/ui/filterBar/filterBarItems.tsx";
import { useCan } from "entities/access/lib";
import { getApiErrorMessage } from "shared/api";
import { endpointAccessMap } from 'shared/config/endpointAccessMap';
import { RequiredDataAlert } from 'entities/access/ui';
import { LifecycleTargetEntity } from 'entities/lifecycle/lib';
import { useRecentStatusChanges, useStatusChangeListRefresh } from 'shared/lib/statusChanges';

import { formatDateTimeSeconds } from 'shared/lib/formatDate';
const MarkingCodes = () => {
    const { t } = useTranslation();
    const { id } = useParams<{ id: string }>();
    const orgId = id
    const canCreateOrder = useCan(endpointAccessMap.ordersCreate);
    const canCreateUtilization = useCan(endpointAccessMap.utilizationReportsCreate);
    const [createUtilizationReport] = useCreateUtilizationReportMutation();
    const canCreateCustomsCode = useCan(endpointAccessMap.customsCodesCreate);
    const canSearchCompanyMemberships = useCan(endpointAccessMap.companyMembershipsSearch);
    const canListProducts = useCan(endpointAccessMap.productsList);

    const [createCustomsCodeOrder] = useCreateCustomsCodeOrderMutation();

    const { error: packTypeReferencesError } =
        useGetReferencesByTypeQuery("cisType");
    const referencesError = packTypeReferencesError
        ? getApiErrorMessage(packTypeReferencesError, t('common.error'))
        : null;
    const [productQuery, setProductQuery] = useState('');
    const { data: productsPage } = useSearchProductsQuery(
        { query: productQuery, page: 1, limit: 10, sortOrder: 'asc' },
        { skip: !canListProducts }
    );
    const products = useMemo(() => productsPage?.items ?? [], [productsPage]);
    const [membershipQuery, setMembershipQuery] = useState('');
    const { data: searchedMembershipsPage } = useSearchCompanyMembershipsQuery(
        { companyId: orgId ?? '', query: membershipQuery },
        { skip: !orgId || !membershipQuery }
    );
    const searchedMemberships = useMemo(
        () => searchedMembershipsPage?.items ?? [],
        [searchedMembershipsPage]
    );
    const [queryParams, setQueryParams] = useState<OrderListQueryRequestDto>({
        page: 1,
        limit: 10,
    });
    const [createdCustomsCodeBatchIds, setCreatedCustomsCodeBatchIds] = useState<Set<string>>(new Set());
    const [creatingCustomsCodeBatchIds, setCreatingCustomsCodeBatchIds] = useState<Set<string>>(new Set());

    const {
        data: markingCodesPage,
        refetch: refreshMarkingCodes,
    } = useGetMarkingCodeOrdersQuery(queryParams);
    const markingCodes = useMemo(
        () => markingCodesPage?.items ?? [],
        [markingCodesPage]
    );
    const dataTotal = markingCodesPage?.total ?? 0;

     const MarkingCodesData = useMemo(() => {
        return markingCodes.map((markingCode, index) => ({
            key: index.toString() + 1,
            number: index + 1,
            batchNumber: markingCode.batchNumber,
            batchId: markingCode.batchId,
            productId: markingCode.productId,
            orderId: markingCode.orderId,
            orderNumber: markingCode.orderNumber,
            isPaid: markingCode.isPaid,
            productName: markingCode.productName,
            gtin: markingCode.gtin,
            totalQuantity: markingCode.totalQuantity,
            orderedQuantity: markingCode.orderedQuantity,
            remainderQuantity: markingCode.remainderQuantity,
            orderedAt: formatDateTimeSeconds(markingCode.orderedAt),
            codesHaveBeenExported:
                markingCode.totalQuantity === markingCode.orderedQuantity
                    ? t('common.yes')
                    : t('common.no'),
            packageType: markingCode.packageType,
            status: markingCode.status ?? null,
            externalStatus: markingCode.externalStatus ?? null,
            hasAggregatedCustomsCode: markingCode.hasAggregatedCustomsCode,
        }))
    }, [markingCodes, t])

    // Признак приходит в самой строке партии: выборка заказов АИК отдельным
    // запросом обрезается пагинацией, и обработанные партии из неё выпадают.
    const customsCodeBatchIds = useMemo(() => {
        const batchIds = new Set(
            markingCodes
                .filter((markingCode) => markingCode.hasAggregatedCustomsCode)
                .map((markingCode) => markingCode.batchId)
        );

        createdCustomsCodeBatchIds.forEach((batchId) => batchIds.add(batchId));

        return batchIds;
    }, [createdCustomsCodeBatchIds, markingCodes]);

    const [modalState, setModalState] = useState<{
        addMarkingCodes: boolean;
        retrieveMarkingCodes: boolean;
        markingCodesData: OrderBatchPopulated | null; 
      }>({
        addMarkingCodes: false,
        retrieveMarkingCodes: false,
        markingCodesData: null, 
      });

    const handleModal = (modalName: string, value: boolean) => {
        setModalState((prev) => ({...prev, [modalName] : value}));
    }

    const handleOrderCreated = () => {
        handleModal('addMarkingCodes', false);
        refreshMarkingCodes();
    };

    useStatusChangeListRefresh(
        [LifecycleTargetEntity.MarkingCodeOrder, LifecycleTargetEntity.MarkingCodeOrderBatch],
        refreshMarkingCodes
    );

    const recentStatusChanges = useRecentStatusChanges([
        LifecycleTargetEntity.MarkingCodeOrder,
        LifecycleTargetEntity.MarkingCodeOrderBatch,
    ]);

    /**
     * Статусы фильтра — из каталога статусов: коды совпадают с теми, что
     * ждёт бэкенд, а подписи приходят оттуда же, откуда в ленте и карточках.
     */
    const statusOptions = useMemo(
        () =>
            Object.values(BatchStatus)
                .filter((status) =>
                    hasStatusInCatalog(
                        StatusEntity.MarkingCodeOrderBatch,
                        LifecycleScope.Internal,
                        status
                    )
                )
                .map((status) => ({
                    value: status,
                    label: getStatusLabel(
                        t,
                        StatusEntity.MarkingCodeOrderBatch,
                        LifecycleScope.Internal,
                        status
                    ),
                })),
        [t]
    );

    const handleProductSearch = (value: string) => {
        if (value.trim()) {
          setProductQuery(value);
        }
      };

    const updateQueryParam = <K extends keyof OrderListQueryRequestDto>(
        key: K,
        value: OrderListQueryRequestDto[K]
        ) => {
        setQueryParams(prev => ({
            ...prev,
            page: 1,
            [key]: value || undefined,
        }));
    };

    const handleAppoint = async (
        e: React.MouseEvent,
        record: MarkingCodesTableDataType
    ) => {
        e.stopPropagation();

        try {
            const result = await createUtilizationReport({
                orderId: record.orderId,
                batchId: record.batchId,
            }).unwrap();

            notifyUtilizationReportsCreated(
                t,
                result.map((report) => report.reportNumber)
            );
        } catch (error: unknown) {
            toast.error(
                getBackendErrorMessage(error, t('common.error'))
            );
        }
    };

    const handleCreateCustomsCode = async (
        e: React.MouseEvent,
        record: MarkingCodesTableDataType
    ) => {
        e.stopPropagation();

        if (!orgId) return;
        if (
            creatingCustomsCodeBatchIds.has(record.batchId) ||
            customsCodeBatchIds.has(record.batchId)
        ) return;

        try {
            setCreatingCustomsCodeBatchIds((prev) => new Set(prev).add(record.batchId));

            await createCustomsCodeOrder({ batchId: record.batchId }).unwrap();

            setCreatedCustomsCodeBatchIds((prev) => new Set(prev).add(record.batchId));
            toast.success(t('customsCodes.messages.createSuccess'));
            void refreshMarkingCodes();
        } catch (error: unknown) {
            toast.error(
                getApiErrorMessage(error, t('customsCodes.messages.createError'))
            );
        } finally {
            setCreatingCustomsCodeBatchIds((prev) => {
                const next = new Set(prev);
                next.delete(record.batchId);
                return next;
            });
        }
    };


    return (
    <MainLayout>
        <RequiredDataAlert
            endpoints={[endpointAccessMap.referencesRead]}
            errors={[referencesError]}
        />
        <Heading title={t('markingCodes.title')} subtitle={t('markingCodes.subtitle')} totalAmount={`${dataTotal}`}>
            <div className="btns-group">
                <CompanyImportStageButton companyId={orgId} stage={CompanyImportStage.Orders} />
                {canCreateOrder && (
                    <CustomButton onClick={() => handleModal('addMarkingCodes', true)}>{t('markingCodes.order')}</CustomButton>
                )}
            </div>
        </Heading>
        <div className="box">
            <div className="box-container">
                <div className="box-container-items">
                    <div className="box-container-items-item">
                        <FilterBar className="filters-large">
                            {canSearchCompanyMemberships && (
                            <FilterBarItem>
                                <Form.Item name="user" className="input">
                                        <Select
                                            size="large"
                                            placeholder={
                                                <span className="custom-placeholder">
                                                    {t("search.byName")}
                                                </span>
                                            }
                                            showSearch
                                            allowClear
                                            filterOption={false}
                                            onSearch={(value) => {
                                                if (value.trim() && orgId) {
                                                    setMembershipQuery(value);
                                                }
                                            }}
                                            onChange={(value) => updateQueryParam('userId', value)}
                                            options={searchedMemberships.map(membership => ({
                                                value: membership.userId,
                                                label: `${membership.user?.firstName ?? ''} ${membership.user?.lastName ?? ''}`.trim(),
                                            }))}
                                        />

                                </Form.Item>
                            </FilterBarItem>
                            )}
                            {canListProducts && (
                            <FilterBarItem>
                                <Form.Item name="product" className="input">
                                    <Select
                                        size="large"
                                        placeholder={
                                            <span className="custom-placeholder">
                                                {t("search.selectProduct")}
                                            </span>
                                        }
                                        optionLabelProp="label"
                                        showSearch
                                        className="input"
                                        filterOption={false}
                                        allowClear
                                        onSearch={handleProductSearch}
                                        options={products.map((product) => ({
                                            value: product.id,     // 🆔 отправляем ID
                                            label: product.name,   // 👀 показываем NAME
                                        }))}
                                        onChange={(value) => updateQueryParam('productId', value)}
                                    />
                                </Form.Item>
                            </FilterBarItem>
                            )}
                            <FilterBarItem>
                                <Form.Item name="status" className="input">
                                    <Select
                                        size="large"
                                        placeholder={
                                            <span className="custom-placeholder">
                                                {t('search.selectStatus')}
                                            </span>
                                        }
                                        allowClear
                                        options={statusOptions}
                                        onChange={(value) => updateQueryParam('status', value)}
                                    />
                                </Form.Item>
                            </FilterBarItem>
                        </FilterBar>
                    </div>
                </div>
                <div className="box-container-items">
                    <ComponentTable<MarkingCodesTableDataType>
                        columns={MarkingCodesTableColumns(
                            t,
                            orgId,
                            canCreateUtilization,
                            canCreateCustomsCode,
                            customsCodeBatchIds,
                            creatingCustomsCodeBatchIds,
                            handleAppoint,
                            handleCreateCustomsCode
                        )}
                        data={MarkingCodesData}
                        rowClassName={(record) =>
                            recentStatusChanges.has(record.batchId) ||
                            recentStatusChanges.has(record.orderId)
                                ? 'row-status-changed'
                                : ''
                        }
                        scroll={{ x: 1620 }}
                        pagination={{
                            current: queryParams.page,
                            pageSize: queryParams.limit,
                            total: dataTotal,
                            showSizeChanger: { showSearch: false },
                            pageSizeOptions: ['10', '20', '30', '40', '50'],
                            locale: { items_per_page: '' },
                            onChange: (page, limit) => {
                                setQueryParams(prev => ({
                                ...prev,
                                page,
                                limit: limit || prev.limit || 10,
                                }));
                            },
                        }}
                    />
                </div>
            </div>
        </div>
        <ModalWindow
            // width={"auto"}
            className="modal-large"
            openModal={modalState.addMarkingCodes}
            closeModal={() => handleModal('addMarkingCodes', false)}
            title={t('markingCodes.orderCreation.title')}
        >
            <OrderForm onCreated={handleOrderCreated} />
        </ModalWindow>

    </MainLayout>
  )
}

export default MarkingCodes


