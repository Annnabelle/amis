import { Form, Select} from 'antd'
import { useAppDispatch, useAppSelector } from '../../store'
import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import MainLayout from '../../components/layout'
import Heading from '../../components/mainHeading'
import ComponentTable from '../../components/table'
import CustomButton from '../../components/button'
import ModalWindow from '../../components/modalWindow'
import { MarkingCodesTableColumns } from '../../tableData/markingCodes'
import type { MarkingCodesTableDataType } from '../../tableData/markingCodes/types'
import { fetchMarkingCodes  } from '../../store/markingCodes'
import OrderForm from './createOrder'
import { formatDate } from '../../utils/utils'
import { fetchReferencesByType } from '../../store/references'
import type { OrderBatchPopulatedResponse } from '../../types/markingCodes'
import type { OrderListQueryParams } from '../../dtos/markingCodes'
import { searchProducts } from '../../store/products'
import {createUtilizationReport} from "../../store/utilization";
import {toast} from "react-toastify";
import {useParams} from "react-router-dom";

const MarkingCodes = () => {
    const { t, i18n  } = useTranslation();
    const { id } = useParams<{ id: string }>();
    const orgId = id
    const dispatch = useAppDispatch()
    const markingCodes = useAppSelector((state) => state.markingCodes.data)
    const dataLimit = useAppSelector((state) => state.markingCodes.limit)
    const dataPage = useAppSelector((state) => state.markingCodes.page)
    const dataTotal = useAppSelector((state) => state.markingCodes.total)
    const packTypeReferences =
        useAppSelector(state => state.references.references.cisType) ?? [];
    const { products } = useAppSelector((state) => state.products);
    const [queryParams, setQueryParams] = useState<OrderListQueryParams>({
        page: dataPage || 1,
        // companyId: id,
        limit: dataLimit || 10,
    });
    useEffect(() => {
        dispatch(fetchMarkingCodes(queryParams));
    }, [dispatch, queryParams]);

    useEffect(() => {
        dispatch(fetchReferencesByType("cisType"));
    }, [dispatch]);

    const packageTypeMap = useMemo(() => {
        const lang = i18n.language as keyof (typeof packTypeReferences)[number]["title"];

        return packTypeReferences.reduce<Record<string, string>>((acc, ref) => {
            acc[ref.alias] = ref.title[lang] ?? ref.title.en;
            return acc;
        }, {});
    }, [packTypeReferences, i18n.language]);

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
            totalQuantity: markingCode.totalQuantity,
            orderedQuantity: markingCode.orderedQuantity,
            remainderQuantity: markingCode.remainderQuantity,
            orderedAt: formatDate(markingCode.orderedAt),
            codesHaveBeenExported:
                markingCode.totalQuantity === markingCode.orderedQuantity
                    ? t('common.yes')
                    : t('common.no'),
            packageType: markingCode.packageType,
            status: markingCode.status ?? null,
            externalStatus: markingCode.externalStatus ?? null,
        }))
    }, [markingCodes, dataPage, dataLimit, packageTypeMap])

    const [modalState, setModalState] = useState<{
        addMarkingCodes: boolean;
        retrieveMarkingCodes: boolean;
        markingCodesData: OrderBatchPopulatedResponse | null; 
      }>({
        addMarkingCodes: false,
        retrieveMarkingCodes: false,
        markingCodesData: null, 
      });

    const handleModal = (modalName: string, value: boolean) => {
        setModalState((prev) => ({...prev, [modalName] : value}));
    }

    const packageTypeOptions = useMemo(() => {
        return packTypeReferences.map((ref) => ({
            value: ref.alias,
            label: ref.title[i18n.language as keyof typeof ref.title] ?? ref.title.en, // fallback
        }));
    }, [packTypeReferences, i18n.language]);

    const statusOptions = [
        { label: t('markingCodes.markingCodesOrderStatus.created'), value: "CREATED" },
        { label:  t('markingCodes.markingCodesOrderStatus.pending') , value: "PENDING" },
        { label: t('markingCodes.markingCodesOrderStatus.ready'), value: "READY" },
        { label: t('markingCodes.markingCodesOrderStatus.rejected'), value: "REJECTED" },
        { label: t('markingCodes.markingCodesOrderStatus.closed'), value: "CLOSED"},
        { label:  t('markingCodes.markingCodesOrderStatus.outsourced'), value: "OUTSOURCED" },
    ];

    const handleProductSearch = (value: string) => {
        if (value.trim()) {
          dispatch(
            searchProducts({
              query: value,
              page: 1,
              limit: 10,
              sortOrder: "asc",
            })
          );
        }
      };

    const updateQueryParam = <K extends keyof OrderListQueryParams>(
        key: K,
        value: OrderListQueryParams[K]
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
            const result = await dispatch(
                createUtilizationReport({
                    orderId: record.orderId,
                    batchId: record.batchId,
                })
            ).unwrap();

            console.log("result", result)

            toast.success(
                `Созданы отчеты о нанесении: номер ${result.reportNumber}`
            );
        } catch (error: any) {
            toast.error(
                error || 'Ошибка при создании отчета о нанесении'
            );
        }
    };


    return (
    <MainLayout>
        <Heading title={t('markingCodes.title')} subtitle={t('markingCodes.subtitle')} totalAmount={`${dataTotal}`}>
            <div className="btns-group">
                <CustomButton onClick={() => handleModal('addMarkingCodes', true)}>{t('markingCodes.order')}</CustomButton>
            </div>
        </Heading>
        <div className="box">
            <div className="box-container">
                <div className="box-container-items">
                    <div className="box-container-items-item">
                        <div className="box-container-items-item-filters filters-large">
                            {/*<div className="form-inputs">*/}
                            {/*    <Form.Item name="searchByName" className="input">*/}
                            {/*        <Input*/}
                            {/*            size="large"*/}
                            {/*            className="input"*/}
                            {/*            placeholder={t('search.byName')}*/}
                            {/*            suffix={<IoSearch />}*/}
                            {/*            allowClear*/}
                            {/*            onChange={handleSearchChange}*/}
                            {/*        />*/}
                            {/*    </Form.Item>*/}
                            {/*</div>*/}
                            <div className="form-inputs">
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
                            </div>
                            <div className="form-inputs">
                                <Form.Item name="packageType" className="input">
                                    <Select
                                        size="large"
                                        placeholder={
                                            <span className="custom-placeholder">
                                                {t('search.packageType')}
                                            </span>
                                        }
                                        allowClear
                                        options={packageTypeOptions}
                                        onChange={(value) => updateQueryParam('packageType', value)}
                                    />
                                </Form.Item>
                            </div>
                            <div className="form-inputs">
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
                            </div>
                            {/* <div className="form-inputs">
                                <Form.Item name="paymentType" className="input">
                                    <Select
                                        size="large"
                                        placeholder={
                                            <span className="custom-placeholder">
                                                {t('search.selectOrderPaymentType')}
                                            </span>
                                        }
                                        allowClear
                                        options={paymentTypeOptions}
                                        onChange={(value) => updateQueryParam('paymentType', value)}
                                    />
                                </Form.Item>
                            </div> */}
                        </div>
                    </div>
                </div>
                <div className="box-container-items">
                    <ComponentTable<MarkingCodesTableDataType>
                        columns={MarkingCodesTableColumns(t, orgId, handleAppoint)}
                        data={MarkingCodesData}
                        pagination={{
                            current: queryParams.page,
                            pageSize: queryParams.limit,
                            total: dataTotal,
                            onChange: (page, limit) => {
                                setQueryParams(prev => ({
                                ...prev,
                                page,
                                limit,
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
            <OrderForm />
        </ModalWindow>

    </MainLayout>
  )
}

export default MarkingCodes