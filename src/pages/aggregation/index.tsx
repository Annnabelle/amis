import { useAppDispatch, useAppSelector } from '../../store'
import {useEffect, useMemo, useState} from 'react'
import { useTranslation } from 'react-i18next'
import MainLayout from '../../components/layout'
import Heading from '../../components/mainHeading'
import ComponentTable from "../../components/table";
import {createAggregationReport, fetchAggregations} from "../../store/aggregation";
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

const Aggregations = () => {
    const { t } = useTranslation();
    const dispatch = useAppDispatch()
    const aggregations = useAppSelector((state) => state.aggregations.aggregations)
    const dataLimit = useAppSelector((state) => state.aggregations.limit)
    const dataPage = useAppSelector((state) => state.aggregations.page)
    const orders = useAppSelector(state => state.markingCodes.data);
    const [parentOptions, setParentOptions] = useState<{ label: string; value: string }[]>([]);
    const [chosenParentOrderId, setChosenParentOrderId] = useState<string | null>(null);
    const [chosenParentBatchId, setChosenParentBatchId] = useState<string | null>(null);
    const [modalState, setModalState] = useState<{
        addAggregation: boolean;
    }>({
        addAggregation: false,
    });

    useEffect(() => {
        dispatch(fetchAggregations({  page: dataPage || 1, limit: dataLimit || 10 }));
    }, [dispatch]);

    console.log("aggregations", aggregations)

    useEffect(() => {
        if (modalState.addAggregation) {
            dispatch(fetchMarkingCodes({ page: 1, limit: 15 }));
        }
    }, [modalState.addAggregation, dispatch]);

    const handleModal = (modalName: string, value: boolean) => {
        setModalState((prev) => ({...prev, [modalName] : value}));
    }

    const AggregationsData = useMemo(() => {
        return aggregations.map((aggregation, index) => ({
            key: index.toString() + 1,
            number: String(index + 1),
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
        // Формируем опции родительских партий
        const filteredParent = orders.filter(item => item.status === 'codes_utilized');
        setParentOptions(
            filteredParent.map(item => ({
                label: `${item.batchNumber}`,
                value: `${item.orderId}`,
            }))
        );
    }, [orders]);

    useEffect(() => {
        const filteredParent = orders.filter(item => item.status === 'codes_utilized');
        setParentOptions(
            filteredParent.map(item => ({
                label: `${item.batchNumber}`,
                value: `${item.orderId}|${item.batchId}`,
            }))
        );
    }, [orders]);



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
                label: `${item.batchNumber}`,
                value: `${item.orderId}|${item.batchId}`,
            }));
    }, [orders, chosenParentOrderId, chosenParentBatchId]);


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
                toast.success('Агрегация успешно создана!');
                handleModal('addAggregation', false);
                dispatch(fetchAggregations({ page: 1, limit: 10 }));
            })
            .catch((err: any) => {
                console.error(err);
                toast.error(`Ошибка создания агрегации: ${err}`);
            });
    };


    return (
        <MainLayout>
            <Heading
                title={`${t('aggregations.title')}`}
            >
                <CustomButton onClick={() => handleModal('addAggregation', true)}>{t('aggregations.btnAdd')}</CustomButton>
            </Heading>
            <div className="box">
                <div className="box-container">
                    <div className="box-container-items">
                        <div className="box-container-items-item">
                            <div className="box-container-items-item-filters filters-large filters-large-inputs">
                                {/*filters*/}
                            </div>
                        </div>
                    </div>
                    <div className="box-container-items">
                        <ComponentTable<AggregationDataType>
                            columns={AggregationColumns(t)}
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
                                rules={[{ required: true, message: t("products.addProductForm.validation.required.requiredField") }]}
                                className="input"
                            >
                                <DatePicker size="large" className="input" />
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