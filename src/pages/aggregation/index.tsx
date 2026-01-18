import { useAppDispatch, useAppSelector } from '../../store'
import {useEffect, useMemo, useState} from 'react'
import { useTranslation } from 'react-i18next'
import MainLayout from '../../components/layout'
import Heading from '../../components/mainHeading'
import ComponentTable from "../../components/table";
import {type ApiErrorResponse, createAggregationReport, fetchAggregations} from "../../store/aggregation";
import {AggregationColumns} from "../../tableData/aggregation";
import type {AggregationDataType} from "../../tableData/aggregation/types.ts";
import CustomButton from "../../components/button";
import FormComponent from "../../components/formComponent";
import {DatePicker, Form, Select} from "antd";
import ModalWindow from "../../components/modalWindow";
import dayjs from "dayjs";
import type {CreateAggregationReport} from "../../types/aggregation";
import {fetchMarkingCodes} from "../../store/markingCodes";
import {toast} from "react-toastify";
import {useParams} from "react-router-dom";
import type {AggregationReportStatus} from "../../dtos";
import { searchProducts} from "../../store/products";

const Aggregations = () => {
    const { t , i18n} = useTranslation();
    const params = useParams();
    const orgId = params.id;
    const dispatch = useAppDispatch()
    const aggregations = useAppSelector((state) => state.aggregations.aggregations)
    const dataLimit = useAppSelector((state) => state.aggregations.limit)
    const dataPage = useAppSelector((state) => state.aggregations.page)
    const dataTotal = useAppSelector((state) => state.aggregations.total)
    const orders = useAppSelector(state => state.markingCodes.data);
    const error = useAppSelector(state => state.aggregations.error);
    const [parentOptions, setParentOptions] = useState<{ label: string; value: string }[]>([]);
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
        selectedProductId, // 🔥 ВАЖНО
    ]);



    useEffect(() => {
        if (modalState.addAggregation) {
            dispatch(fetchMarkingCodes({ page: 1, limit: 15 }));
        }
    }, [modalState.addAggregation, dispatch]);

    useEffect(() => {
        if (error) {
            const lang = i18n.language as "ru" | "en" | "uz";
            toast.error(error.errorMessage?.[lang] ?? t("aggregations.messages.createError"));
        }
    }, [error, i18n.language, t]);


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
            submittedAt: new Date(aggregation.submittedAt).toLocaleDateString(),
            status: aggregation.status.toLowerCase(),
        }))
    }, [aggregations, dataPage, dataLimit])

    useEffect(() => {
        const filteredParent = orders.filter(
            item => item.orderStatus === 'codes_utilized'
        );

        setParentOptions(
            filteredParent.map(item => ({
                label: `${item.batchNumber} - ${truncateString(item.productName, 30)} (${t(`markingCodes.packageType.${item.packageType.toLowerCase()}`)})`,
                value: `${item.orderId}|${item.batchId}`,
            }))
        );
    }, [orders, t]);

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
                label: `${item.batchNumber} - ${truncateString(item.productName, 30)} (${t(`markingCodes.packageType.${item.packageType.toLowerCase()}`)})`,
                value: `${item.orderId}|${item.batchId}`,
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
            companyId: orgId!,
        };

        dispatch(createAggregationReport(payload))
            .unwrap()
            .then(() => {
                toast.success(t("aggregations.messages.createSuccess"));
                handleModal("addAggregation", false);
                dispatch(fetchAggregations({ page: 1, limit: 10, companyId: orgId! }));
            })
            .catch((err: ApiErrorResponse) => {
                console.error(err);
            });
    };

    const handleProductSearch = (value: string) => {
        if (!value) return;

        dispatch(searchProducts({
            query: value,
            page: 1,
            limit: 10,
        }));
    };

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
                            <div className="box-container-items-item-filters filters-large filters-large-inputs">
                                <div className="form-inputs">
                                    <Form.Item name="status" className="input">
                                        <Select
                                            size="large"
                                            className="input"
                                            allowClear
                                            placeholder={t('search.selectStatus')}
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
                                </div>
                                <div className="form-inputs">
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
                                </div>
                                <div className="form-inputs">
                                    <Form.Item
                                        name="product"
                                        className="input"
                                    >
                                        <Select
                                            size="large"
                                            showSearch
                                            className="input"
                                            placeholder={t('search.selectProduct')}
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

                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="box-container-items">
                        <ComponentTable<AggregationDataType>
                            columns={AggregationColumns(t, orgId)}
                            data={AggregationsData}
                        />
                    </div>
                </div>
                <ModalWindow
                    // titleAction={t('products.modalWindow.adding')}
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
                                    format="YYYY-MM-DD HH:mm"
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