import { useAppDispatch, useAppSelector } from 'app/store'
import {useEffect, useMemo, useState} from 'react'
import { useTranslation } from 'react-i18next'
import MainLayout from 'shared/ui/layout'
import Heading from 'shared/ui/mainHeading'
import ComponentTable from "shared/ui/table";
import {type ApiErrorResponse, createAggregationReport, fetchAggregations} from "entities/aggregation/model";
import {AggregationColumns} from "entities/aggregation/ui/tableData/aggregation";
import type {AggregationDataType} from "entities/aggregation/ui/tableData/aggregation/types.ts";
import CustomButton from "shared/ui/button";
import FormComponent from "shared/ui/formComponent";
import {DatePicker, Form, Select} from "antd";
import ModalWindow from "shared/ui/modalWindow";
import dayjs from "dayjs";
import type {CreateAggregationReport} from "entities/aggregation/types";
import {fetchMarkingCodes} from "entities/markingCodes/model";
import {toast} from "react-toastify";
import {useParams} from "react-router-dom";
import type {AggregationReportStatus} from "shared/types/dtos";
import { searchProducts} from "entities/products/model";
import {getBackendErrorMessage} from "shared/lib/getBackendErrorMessage.ts";
import FilterBar from "shared/ui/filterBar/filterBar.tsx";
import FilterBarItem from "shared/ui/filterBar/filterBarItems.tsx";

const Aggregations = () => {
    const { t } = useTranslation();
    const params = useParams();
    const orgId = params.id;
    const dispatch = useAppDispatch()
    const aggregations = useAppSelector((state) => state.aggregations.aggregations)
    const dataLimit = useAppSelector((state) => state.aggregations.limit)
    const dataPage = useAppSelector((state) => state.aggregations.page)
    const dataTotal = useAppSelector((state) => state.aggregations.total)
    const orders = useAppSelector(state => state.markingCodes.data);
    const error = useAppSelector(state => state.aggregations.error);
    const [chosenParentOrderId, setChosenParentOrderId] = useState<string | null>(null);
    const [chosenParentBatchId, setChosenParentBatchId] = useState<string | null>(null);
    const products = useAppSelector(state => state.products.products);
    const productsLoading = useAppSelector(state => state.products.isLoading);
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

    useEffect(() => {
        if (!orgId) return;

        dispatch(
            fetchAggregations({
                page: dataPage || 1,
                limit: dataLimit || 10,
                companyId: orgId,
                status: filters.status,
                dateFrom: filters.dateFrom,
                dateTo: filters.dateTo,
                productId: selectedProductId,
            })
        );
    }, [
        dispatch,
        orgId,
        dataPage,
        dataLimit,
        filters,
        selectedProductId,
    ]);

    useEffect(() => {
        if (modalState.addAggregation) {
            dispatch(
                fetchMarkingCodes({
                    page: 1,
                    limit: 20,
                    companyId: orgId,
                    status: "codes_utilized",
                })
            );
        }
    }, [modalState.addAggregation, dispatch]);

    useEffect(() => {
        if (!error) return;

        toast.error(
            getBackendErrorMessage(error, t("aggregations.messages.createError"))
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
            submittedAt: dayjs(aggregation.submittedAt).format('DD-MM-YYYY'),
            status: aggregation.status.toLowerCase(),
        }))
    }, [aggregations, dataPage, dataLimit])

    const childOptions = useMemo(() => {
        if (!chosenParentOrderId || !chosenParentBatchId) return [];

        return orders
            .filter(
                item =>
                    item.status === 'codes_utilized' &&
                    item.orderId === chosenParentOrderId &&
                    item.batchId !== chosenParentBatchId
            )
            .map(item => ({
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

    const handleCreateAggregation = (values: any) => {
        const [parentOrderId, parentBatchId] = values.parent.split('|');
        const [childOrderId, childBatchId] = values.child.split('|');

        const payload: CreateAggregationReport = {
            documentDate: values.documentDate.toDate(),
            parentOrderId,
            parentBatchId,
            childOrderId,
            childBatchId,
        };

        dispatch(createAggregationReport(payload))
            .unwrap()
            .then(() => {
                toast.success(t("aggregations.messages.createSuccess"));
                handleModal("addAggregation", false);
                dispatch(fetchAggregations({ page: 1, limit: dataLimit || 10, companyId: orgId! }));
            })
            .catch((err: ApiErrorResponse) => {
                toast.error(
                    getBackendErrorMessage(err, t("aggregations.messages.createError"))
                );
            });
    };

    const handleProductSearch = (value: string) => {
        if (!value) return;

        dispatch(searchProducts({
            query: value,
            page: 1,
            limit: 10,
            companyId: orgId
        }));
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


    return (
        <MainLayout>
            <Heading
                title={`${t('aggregations.title')}`}
                subtitle={t('markingCodes.subtitle')} totalAmount={`${dataTotal}`}
            >
                <CustomButton onClick={() => handleModal('addAggregation', true)}>{t('aggregations.btnAdd')}</CustomButton>
            </Heading>
            <div className="box">
                <div className="box-container">
                    <div className="box-container-items">
                        <div className="box-container-items-item">
                            <FilterBar className="filters-large filters-large-inputs">
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
                                                { label: t('aggregations.aggregationReportStatus.new'), value: 'new' },
                                                { label: t('aggregations.aggregationReportStatus.requested'), value: 'requested' },
                                                { label: t('aggregations.aggregationReportStatus.vendor_pending'), value: 'vendor_pending' },
                                                { label: t('aggregations.aggregationReportStatus.partially_processed'), value: 'partially_processed' },
                                                { label: t('aggregations.aggregationReportStatus.success'), value: 'success' },
                                                { label: t('aggregations.aggregationReportStatus.error'), value: 'error' },
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
                            columns={AggregationColumns(t, orgId)}
                            data={AggregationsData}
                            pagination={{
                                current: dataPage,
                                pageSize: dataLimit || 10,
                                total: dataTotal,
                                showSizeChanger: { showSearch: false },
                                pageSizeOptions: ['10', '15', '20', '25'],
                                locale: { items_per_page: '' },
                                onChange: (page, pageSize) => {
                                    if (!orgId) return;
                                    dispatch(
                                        fetchAggregations({
                                            page,
                                            limit: pageSize || dataLimit || 10,
                                            companyId: orgId,
                                            status: filters.status,
                                            dateFrom: filters.dateFrom,
                                            dateTo: filters.dateTo,
                                            productId: selectedProductId,
                                        })
                                    );
                                },
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
                    <FormComponent onFinish={handleCreateAggregation}>
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
                                    format="DD-MM-YYYY HH:mm"
                                />
                            </Form.Item>
                        </div>



                        <CustomButton type="submit">
                            {t('btn.create')}
                        </CustomButton>
                    </FormComponent>
                </ModalWindow>
            </div>
        </MainLayout>
    )
}

export default Aggregations


