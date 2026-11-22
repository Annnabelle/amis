import {useEffect, useMemo, useState} from 'react'
import { useTranslation } from 'react-i18next'
import MainLayout from 'shared/ui/layout'
import Heading from 'shared/ui/mainHeading'
import ComponentTable from "shared/ui/table";
import { DEFAULT_PAGINATION } from 'shared/config/pagination';
import {
    useCreateAggregationReportMutation,
    useGetAggregationReportsQuery,
} from "entities/aggregation/api";
import { getApiErrorMessage } from "shared/api";
import {AggregationColumns} from "entities/aggregation/ui/tableData/aggregation";
import type {AggregationDataType} from "entities/aggregation/ui/tableData/aggregation/types";
import CustomButton from "shared/ui/button";
import FormComponent from "shared/ui/formComponent";
import {DatePicker, Form, Select} from "antd";
import ModalWindow from "shared/ui/modalWindow";
import dayjs, { type Dayjs } from "dayjs";
import type {CreateAggregationReport} from "entities/aggregation/types";
import {useGetMarkingCodeOrdersQuery} from "entities/markingCodes/api";
import {toast} from "react-toastify";
import {useParams} from "react-router-dom";
import { PackageType, type AggregationReportStatus } from "shared/types/dtos";
import { useSearchProductsQuery } from "entities/products/api";
import {useSubmitGuard} from "shared/lib/useSubmitGuard";
import FilterBar from "shared/ui/filterBar/filterBar";
import FilterBarItem from "shared/ui/filterBar/filterBarItems";
import { useCan } from "entities/access/lib";
import { endpointAccessMap } from 'shared/config/endpointAccessMap';
import { RequiredDataAlert } from 'entities/access/ui';
import { LifecycleTargetEntity } from 'entities/lifecycle/lib';
import { useRecentStatusChanges, useStatusChangeListRefresh } from 'shared/lib/statusChanges';
import { StatusEntity, LifecycleScope } from "shared/config/statusCatalog";
import { getStatusLabel } from "shared/lib/useStatusLabel";

const packageTypeOrder: Record<string, number> = {
    [PackageType.BoxLv2]: 0,
    [PackageType.BoxLv1]: 1,
    [PackageType.Group]: 2,
    [PackageType.Unit]: 3,
};

const getPackageTypeOrder = (packageType?: string) =>
    packageType ? packageTypeOrder[packageType.toLowerCase()] ?? Number.MAX_SAFE_INTEGER : Number.MAX_SAFE_INTEGER;

/** Значения формы создания агрегации: партии приходят строкой "orderId|batchId". */
type AggregationFormValues = {
    parent: string;
    child: string;
    documentDate: Dayjs;
};

const Aggregations = () => {
    const [aggregationForm] = Form.useForm();
    const { t } = useTranslation();
    const params = useParams();
    const orgId = params.id;
    const canCreateAggregation = useCan(endpointAccessMap.aggregationReportsCreate);
    const canListProducts = useCan(endpointAccessMap.productsList);
    const [pagination, setPagination] = useState({ ...DEFAULT_PAGINATION });
    const [chosenParentOrderId, setChosenParentOrderId] = useState<string | null>(null);
    const [chosenParentBatchId, setChosenParentBatchId] = useState<string | null>(null);
    const [productQuery, setProductQuery] = useState('');
    const { data: productsPage, isFetching: productsLoading } =
        useSearchProductsQuery({ query: productQuery, page: 1, limit: 10 });
    const products = useMemo(() => productsPage?.items ?? [], [productsPage]);
    const [modalState, setModalState] = useState<{
        addAggregation: boolean;
    }>({
        addAggregation: false,
    });
    const [selectedProductId, setSelectedProductId] = useState<string | undefined>(undefined);

    const [filters, setFilters] = useState<{
        search?: string;
        status?: AggregationReportStatus;
        dateFrom?: Date;
        dateTo?: Date;
    }>({});

    const {
        data: aggregationsPage,
        error,
        refetch: refreshAggregations,
    } = useGetAggregationReportsQuery(
        {
            page: pagination.page,
            limit: pagination.limit,
            status: filters.status,
            dateFrom: filters.dateFrom?.toISOString(),
            dateTo: filters.dateTo?.toISOString(),
            productId: selectedProductId,
        },
        { skip: !orgId }
    );
    const [createAggregationReport] = useCreateAggregationReportMutation();
    const aggregations = useMemo(
        () => aggregationsPage?.items ?? [],
        [aggregationsPage]
    );
    const dataPage = pagination.page;
    const dataLimit = pagination.limit;
    const dataTotal = aggregationsPage?.total ?? 0;

    /** Партии для выбора родителя и ребёнка нужны только в модальном окне. */
    const {
        data: ordersPage,
        isFetching: ordersLoading,
        error: ordersRequestError,
    } = useGetMarkingCodeOrdersQuery(
        { page: 1, limit: 20, status: "codes_utilized" },
        { skip: !modalState.addAggregation }
    );
    const orders = useMemo(() => ordersPage?.items ?? [], [ordersPage]);
    const ordersError = ordersRequestError
        ? getApiErrorMessage(ordersRequestError, t("common.error"))
        : null;

    useStatusChangeListRefresh(
        LifecycleTargetEntity.AggregationReport,
        refreshAggregations
    );

    const recentStatusChanges = useRecentStatusChanges(
        LifecycleTargetEntity.AggregationReport
    );

    useEffect(() => {
        if (!error) return;

        toast.error(
            getApiErrorMessage(error, t("aggregations.messages.createError"))
        );
    }, [error, t]);

    const handleModal = (modalName: string, value: boolean) => {
        setModalState((prev) => ({...prev, [modalName] : value}));
    }

    const AggregationsData = useMemo(() => {
        return aggregations.map((aggregation, index) => ({
            key: index.toString() + 1,
            number: index + 1,
            aggregationNumber: aggregation.aggregationNumber,
            id: aggregation.id,
            batchNumberParent: aggregation.parent.batchNumber,
            orderIdParent: aggregation.parent.orderId,
            batchIdParent: aggregation.parent.batchId,
            batchNumberChild: aggregation.child.batchNumber,
            childOrderId: aggregation.child.orderId,
            batchOrderId: aggregation.child.orderId,
            productName: aggregation.productName,
            aggregationQuantity: String(aggregation.aggregationQuantity),
            quantityPerPackage: String(aggregation.quantityPerPackage),
            submittedAt: dayjs(aggregation.submittedAt).format('DD.MM.YYYY'),
            status: aggregation.status.toLowerCase(),
        }))
    }, [aggregations])

    const childOptions = useMemo(() => {
        if (!chosenParentOrderId || !chosenParentBatchId) return [];

        const parentBatch = orders.find(
            (item) =>
                item.orderId === chosenParentOrderId &&
                item.batchId === chosenParentBatchId
        );
        const parentPackageTypeOrder = getPackageTypeOrder(parentBatch?.packageType);

        return orders
            .map((item, index) => ({ item, index }))
            .filter(
                ({ item }) =>
                    item.status === 'codes_utilized' &&
                    item.batchId !== chosenParentBatchId &&
                    getPackageTypeOrder(item.packageType) > parentPackageTypeOrder
            )
            .sort((a, b) => {
                const aMatchesParentOrder = a.item.orderId === chosenParentOrderId;
                const bMatchesParentOrder = b.item.orderId === chosenParentOrderId;

                if (aMatchesParentOrder !== bMatchesParentOrder) {
                    return aMatchesParentOrder ? -1 : 1;
                }

                return a.index - b.index;
            })
            .map(({ item }) => ({
                value: `${item.orderId}|${item.batchId}`,
                label: (
                    <div className="select-option">
          <span className="select-option__name">
            {item.batchNumber} – {truncateString(item.productName, 30)}
          </span>
                        <span className="select-option__type">
            {t(`markingCodes.packageType.${item.packageType.toLowerCase()}`)}
          </span>
                    </div>
                ),
            }));
    }, [orders, chosenParentOrderId, chosenParentBatchId, t]);



    function truncateString(str: string, num: number) {
        if (str.length <= num) {
            return str;
        }
        return str.slice(0, num) + '...';
    }

    const handleCreateAggregation = async (values: AggregationFormValues) => {
        const [parentOrderId, parentBatchId] = values.parent.split('|');
        const [childOrderId, childBatchId] = values.child.split('|');

        const payload: CreateAggregationReport = {
            documentDate: values.documentDate.toDate(),
            parentOrderId,
            parentBatchId,
            childOrderId,
            childBatchId,
        };

        try {
            await createAggregationReport(payload).unwrap();
            toast.success(t("aggregations.messages.createSuccess"));
            handleModal("addAggregation", false);
            setPagination((prev) => ({ ...prev, page: 1 }));
        } catch (err) {
            toast.error(
                getApiErrorMessage(err, t("aggregations.messages.createError"))
            );
        }
    };

    const { isSubmitting: isCreatingAggregation, onSubmit: submitCreateAggregation } =
        useSubmitGuard(handleCreateAggregation);

    const handleProductSearch = (value: string) => {
        if (!value) return;

        setProductQuery(value);
    };


    const parentOptions = useMemo(() => {
        return orders
            .filter(item => item.orderStatus === 'codes_utilized')
            .map(item => ({
                value: `${item.orderId}|${item.batchId}`,
                label: (
                    <div className="select-option">
                    <span className="select-option__name">
                        {item.batchNumber} – {item.productName}
                    </span>
                        <span className="select-option__type">
                        {t(`markingCodes.packageType.${item.packageType.toLowerCase()}`)}
                    </span>
                    </div>
                ),
            }));
    }, [orders, t]);


    const columns = useMemo(() => AggregationColumns(t, orgId), [orgId, t]);


    return (
        <MainLayout>
            <Heading
                title={`${t('aggregations.title')}`}
                subtitle={t('markingCodes.subtitle')} totalAmount={`${dataTotal}`}
            >
                {canCreateAggregation && (
                    <CustomButton onClick={() => handleModal('addAggregation', true)}>{t('aggregations.btnAdd')}</CustomButton>
                )}
            </Heading>
            <div className="box">
                <div className="box-container">
                    <div className="box-container-items">
                        <div className="box-container-items-item">
                            <FilterBar className="filters-large filters-large-inputs">
                                {canListProducts && (
                                <FilterBarItem>
                                    <Form.Item name="status" className="input">
                                        <Select
                                            size="large"
                                            className="input"
                                            placeholder={
                                                <span className="custom-placeholder">
                                                    {t('search.selectStatus')}
                                                </span>
                                            }
                                            allowClear
                                            options={[
                                                { label: getStatusLabel(t, StatusEntity.AggregationReport, LifecycleScope.Internal, 'new'), value: 'new' },
                                                { label: getStatusLabel(t, StatusEntity.AggregationReport, LifecycleScope.Internal, 'requested'), value: 'requested' },
                                                { label: getStatusLabel(t, StatusEntity.AggregationReport, LifecycleScope.Internal, 'vendor_pending'), value: 'vendor_pending' },
                                                { label: getStatusLabel(t, StatusEntity.AggregationReport, LifecycleScope.Internal, 'partially_processed'), value: 'partially_processed' },
                                                { label: getStatusLabel(t, StatusEntity.AggregationReport, LifecycleScope.Internal, 'success'), value: 'success' },
                                                { label: getStatusLabel(t, StatusEntity.AggregationReport, LifecycleScope.Internal, 'error'), value: 'error' },
                                            ]}
                                            onChange={(value) =>
                                                setFilters(prev => ({
                                                    ...prev,
                                                    status: value,
                                                }))
                                            }
                                        />
                                    </Form.Item>
                                </FilterBarItem>
                                )}
                                <FilterBarItem>
                                    <Form.Item name="dateRange" className="input">
                                        <DatePicker.RangePicker
                                            size="large"
                                            placeholder={[t('search.chooseDate'), t('search.chooseDate')]}
                                            className="input"
                                            onChange={(dates) => {
                                                setFilters(prev => ({
                                                    ...prev,
                                                    dateFrom: dates?.[0]?.toDate(),
                                                    dateTo: dates?.[1]?.toDate(),
                                                }));
                                            }}
                                        />
                                    </Form.Item>
                                </FilterBarItem>
                                <FilterBarItem>
                                    <Form.Item
                                        name="product"
                                        className="input"
                                    >
                                        <Select
                                            size="large"
                                            showSearch
                                            className="input"
                                            placeholder={
                                                <span className="custom-placeholder">
                                                    {t('search.selectProduct')}
                                                </span>
                                            }
                                            filterOption={false}
                                            allowClear
                                            loading={productsLoading}
                                            optionLabelProp="label"
                                            dropdownMatchSelectWidth={false}
                                            onSearch={handleProductSearch}
                                            onClear={() => {
                                                setSelectedProductId(undefined);
                                            }}
                                            onChange={(productId) => {
                                                setSelectedProductId(productId);
                                            }}
                                            options={products?.map(product => ({
                                                value: product.id,
                                                label: product.name,
                                            }))}
                                        />
                                    </Form.Item>
                                </FilterBarItem>
                            </FilterBar>
                        </div>
                    </div>
                    <div className="box-container-items">
                        <ComponentTable<AggregationDataType>
                            columns={columns}
                            data={AggregationsData}
                            rowClassName={(record) =>
                                recentStatusChanges.has(record.id) ? 'row-status-changed' : ''
                            }
                            pagination={{
                                current: dataPage,
                                pageSize: dataLimit || 10,
                                total: dataTotal,
                                showSizeChanger: { showSearch: false },
                                pageSizeOptions: ['10', '20', '30', '40', '50'],
                                locale: { items_per_page: '' },
                                onChange: (page, pageSize) =>
                                    setPagination((prev) => ({
                                        page,
                                        limit: pageSize || prev.limit,
                                    })),
                            }}
                        />
                    </div>
                </div>
                <ModalWindow
                    title={t('aggregations.addAggregation')}
                    openModal={modalState.addAggregation}
                    closeModal={() => handleModal('addAggregation', false)}
                    className="modal-large"
                >
                    <RequiredDataAlert
                        endpoints={[endpointAccessMap.ordersList]}
                        errors={[ordersError]}
                    />
                    <FormComponent form={aggregationForm} onFinish={submitCreateAggregation}>
                        <div className="form-inputs">
                            <Form.Item
                                name="parent"
                                label={t("aggregations.addAggregationFields.parentBatch")}
                                rules={[{ required: true, message: t("products.addProductForm.validation.required.requiredField") }]}
                                className="input"
                            >
                                <Select
                                    className="input"
                                    options={parentOptions}
                                    size="large"
                                    onChange={(value) => {
                                        const [orderId, batchId] = value.split('|');
                                        setChosenParentOrderId(orderId);
                                        setChosenParentBatchId(batchId);
                                        aggregationForm.setFieldValue("child", undefined);
                                    }}
                                />
                            </Form.Item>

                            <Form.Item
                                name="child"
                                label={t("aggregations.addAggregationFields.childBatch")}
                                className="input"
                                rules={[{ required: true, message: t("products.addProductForm.validation.required.requiredField") }]}
                            >
                                <Select size="large" className="input" options={childOptions} />
                            </Form.Item>
                        </div>
                        <div className="form-inputs">
                            <Form.Item
                                name="documentDate"
                                label={t("aggregations.addAggregationFields.packagingDate")}
                                initialValue={dayjs()}
                                rules={[
                                    { required: true, message: t("products.addProductForm.validation.required.requiredField") }
                                ]}
                                className="input"
                            >
                                <DatePicker
                                    size="large"
                                    className="input"
                                    showTime
                                    format="DD.MM.YYYY HH:mm"
                                />
                            </Form.Item>
                        </div>



                        <CustomButton
                            type="submit"
                            loading={isCreatingAggregation}
                            disabled={ordersLoading || Boolean(ordersError)}
                        >
                            {t('btn.create')}
                        </CustomButton>
                    </FormComponent>
                </ModalWindow>
            </div>
        </MainLayout>
    )
}

export default Aggregations


