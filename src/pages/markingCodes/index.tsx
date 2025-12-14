import { Form, Input, Select} from 'antd'
import { IoSearch } from 'react-icons/io5'
import { useAppDispatch, useAppSelector } from '../../store'
import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { getAllOrganizations, searchOrganizations } from '../../store/organization'
import { useNavigate } from 'react-router-dom'
import MainLayout from '../../components/layout'
import Heading from '../../components/mainHeading'
import ComponentTable from '../../components/table'
import CustomButton from '../../components/button'
import ModalWindow from '../../components/modalWindow'
import { MarkingCodesTableColumns } from '../../tableData/markingCodes'
import type { MarkingCodesTableDataType } from '../../tableData/markingCodes/types'
import { fetchMarkingCodes } from '../../store/markingCodes'
import type { GetMarkingCodes } from '../../types/markingCodes'
import OrderForm from './createOrder'
import { formatDate } from '../../utils/utils'
import { fetchReferencesByType } from '../../store/references'

const MarkingCodes = () => {
    const navigate = useNavigate()
    const { t, i18n  } = useTranslation();
    const dispatch = useAppDispatch()
    const markingCodes = useAppSelector((state) => state.markingCodes.data)
    const dataLimit = useAppSelector((state) => state.markingCodes.limit)
    const dataPage = useAppSelector((state) => state.markingCodes.page)
    const dataTotal = useAppSelector((state) => state.markingCodes.total)
    const references = useAppSelector((state) => state.references.data)
    const [form] = Form.useForm()

    useEffect(() => {
        dispatch(fetchMarkingCodes({ page: dataPage, limit: dataLimit}))
    }, [dispatch])

    useEffect(() => {
        dispatch(fetchReferencesByType("cisType"));
    }, [dispatch]);

    console.log('====================================');
    console.log("references", references);
    console.log('====================================');

    console.log('====================================');
    console.log("markingCodes", markingCodes);
    console.log('====================================');

    const packageTypeMap = useMemo(() => {
        const lang = i18n.language as keyof (typeof references)[number]["title"];

        return references.reduce<Record<string, string>>((acc, ref) => {
            acc[ref.alias] = ref.title[lang] ?? ref.title.en;
            return acc;
        }, {});
    }, [references, i18n.language]);

    const MarkingCodesData = useMemo(() => {
        return markingCodes.map((markingCode, index) => ({
            key: markingCode.id,                
            number: index + 1,  
            orderNumber: markingCode.orderNumber,
            isPaid: markingCode.isPaid,
            productName: markingCode.productName,
            totalQuantity: markingCode.totalQuantity,
            orderedQuantity: markingCode.orderedQuantity,
            remainderQuantity: markingCode.remainderQuantity,
            orderedAt: formatDate(markingCode.orderedAt),
            packageType: packageTypeMap[markingCode.packageType] ?? markingCode.packageType,
            status: markingCode.status,
        }))
    }, [markingCodes, t]);

    const [modalState, setModalState] = useState<{
        addMarkingCodes: boolean;
        retrieveMarkingCodes: boolean;
        markingCodesData: GetMarkingCodes | null; 
      }>({
        addMarkingCodes: false,
        retrieveMarkingCodes: false,
        markingCodesData: null, 
      });

    const handleModal = (modalName: string, value: boolean) => {
        setModalState((prev) => ({...prev, [modalName] : value}));
    }
     const handleRowClick = (type: 'MarkingCodes', action: 'retrieve' | 'edit' | 'delete', record: MarkingCodesTableDataType) => {
        console.log(`Clicked on ${type}, action: ${action}, record:`, record);
        if (type === "MarkingCodes" && action === "retrieve") {
            navigate(`/marking-codes/${record.key}`);
        }
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        if (value.trim().length > 0) {
            dispatch(searchOrganizations({ query: value, page: 1, limit: 10, sortOrder: 'asc' }));
        } else {
            dispatch(getAllOrganizations({ page: 1, limit: 10, sortOrder: 'asc' }));
        }
    };

    const productOptions = [
        { label: "Product A", value: "A" },
        { label: "Product B", value: "B" },
    ];

    const packageTypeOptions = useMemo(() => {
        return references.map((ref) => ({
            value: ref.alias,
            label: ref.title[i18n.language as keyof typeof ref.title] ?? ref.title.en, // fallback
        }));
    }, [references, i18n.language]);



    const statusOptions = [
        { label: t('markingCodes.markingCodesOrderStatus.created'), value: "CREATED" },
        { label:  t('markingCodes.markingCodesOrderStatus.pending') , value: "PENDING" },
        { label: t('markingCodes.markingCodesOrderStatus.ready'), value: "READY" },
        { label: t('markingCodes.markingCodesOrderStatus.rejected'), value: "REJECTED" },
        { label: t('markingCodes.markingCodesOrderStatus.closed'), value: "CLOSED"},
        { label:  t('markingCodes.markingCodesOrderStatus.outsourced'), value: "OUTSOURCED" },
    ];

    const paymentTypeOptions = [
        { label: "Cash", value: "cash" },
        { label: "Card", value: "card" },
    ];

    const handleSelectChange = (value: any, field: any) => {
        console.log("Selected:", field, value);
        // Здесь можно отправлять запрос или фильтровать данные
    };



  return (
    <MainLayout>
        <Heading title={t('markingCodes.title')} subtitle={t('markingCodes.subtitle')} totalAmount='100'>
            <div className="btns-group">
                <CustomButton onClick={() => handleModal('addMarkingCodes', true)}>{t('markingCodes.order')}</CustomButton>
            </div>
        </Heading>
        <div className="box">
            <div className="box-container">
                <div className="box-container-items">
                    <div className="box-container-items-item">
                        <div className="box-container-items-item-filters filters-large">
                            <div className="form-inputs">
                                <Form.Item name="searchByName" className="input">
                                    <Input
                                        size="large"
                                        className="input"
                                        placeholder={t('search.byName')}
                                        suffix={<IoSearch />}
                                        allowClear
                                        onChange={handleSearchChange}
                                    />
                                </Form.Item>
                            </div>
                            <div className="form-inputs">
                                <Form.Item name="product" className="input">
                                    <Select
                                        size="large"
                                        placeholder={
                                            <span className="custom-placeholder">
                                                {t("search.selectProduct")}
                                            </span>
                                        }
                                        allowClear
                                        options={productOptions}
                                        onChange={handleSelectChange}
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
                                        onChange={handleSelectChange}
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
                                        onChange={handleSelectChange}
                                    />
                                </Form.Item>
                            </div>
                            <div className="form-inputs">
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
                                        onChange={handleSelectChange}
                                    />
                                </Form.Item>
                            </div>

                        </div>
                    </div>
                </div>
                <div className="box-container-items">
                    <ComponentTable<MarkingCodesTableDataType> 
                        columns={MarkingCodesTableColumns(t, handleRowClick)}
                        data={MarkingCodesData}
                        onRowClick={(record) => handleRowClick('MarkingCodes', 'retrieve', record)}
                        pagination={{
                            current: dataPage || 1,
                            pageSize: dataLimit || 10,
                            total: dataTotal || 0,
                            onChange: (newPage, newLimit) => {
                                dispatch(getAllOrganizations({ page: newPage, limit: newLimit, sortOrder: "asc" }));
                            },
                        }}
                    />
                </div>
            </div>
        </div>
        <ModalWindow
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