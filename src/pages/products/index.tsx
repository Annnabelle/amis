import {Form, Input, Select} from 'antd'
import { IoSearch } from 'react-icons/io5'
import { useAppDispatch, useAppSelector } from '../../store'
import { toast } from 'react-toastify'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import MainLayout from '../../components/layout'
import Heading from '../../components/mainHeading'
import ComponentTable from '../../components/table'
import CustomButton from '../../components/button'
import ModalWindow from '../../components/modalWindow'
import FormComponent from '../../components/formComponent'
import { createProduct, deleteProduct, getAllProducts, getProductById, searchProducts } from '../../store/products'
import { ProductsTableColumns } from '../../tableData/products'
import type { ProductTableDataType } from '../../tableData/products/types'
import type { CreateProduct, ProductResponse } from '../../types/products'
import { useNavigate, useParams } from 'react-router-dom'
import TextArea from "antd/es/input/TextArea";
import {fetchReferencesByType} from "../../store/references";

const Products = () => {
    const { id } = useParams<{ id: string }>();
    const { t, i18n } = useTranslation();
    const navigate = useNavigate()
    const dispatch = useAppDispatch()
    const products = useAppSelector((state) => state.products.products)
    const dataLimit = useAppSelector((state) => state.products.limit)
    const dataPage = useAppSelector((state) => state.products.page)
    const dataTotal = useAppSelector((state) => state.products.total)
    const productById = useAppSelector((state) => state.products.productById)
    const shortNameEdited = useRef(false);
    const [isSearching, setIsSearching] = useState(false);
    const countryReferences =
        useAppSelector(state => state.references.references.countryCode) ?? [];

    const productGroupReferences =
        useAppSelector(state => state.references.references.productGroup) ?? [];
    const supportedLangs = ['ru', 'en', 'uz'] as const;
    type Lang = typeof supportedLangs[number];

    const currentLang = (i18n.language.split('-')[0] as Lang) || 'en';


    useEffect(() => {
        dispatch(fetchReferencesByType("countryCode"));
        dispatch(fetchReferencesByType("productGroup"));
    }, [dispatch]);


    console.log("referencesCoutry", countryReferences)

    console.log("referencesCoutry", productGroupReferences)

    if (!id) {
        throw new Error("Company ID is required but not found in route params");
    }

    const [form] = Form.useForm()

    useEffect(() => {
        if (productById) {
            form.setFieldsValue({
            name: productById.name,
            shortName: productById.shortName,
            description: productById.description,
            gtin: productById.gtin,
            icps: productById.icps,
            productType: productById.productType,
            aggregationQuantity: productById.aggregationQuantity,
            unit: productById.measurement.unit,
            amount: productById.measurement.amount,
            net: productById.weight.net,
            gross: productById.weight.gross,
            price: productById.price,
            })
        }
    }, [productById, form])

    useEffect(() => {
        if (!isSearching) {
            dispatch(
            getAllProducts({
                page: dataPage || 1,
                limit: dataLimit || 10,
                sortOrder: "asc",
                companyId: id,
            })
            );
        }
    }, [dispatch, id, dataPage, dataLimit, isSearching]);

   const ProductsData = useMemo(() => {
        return products.map((product, index) => ({
            key: product.id,
            number: index + 1,
            name: product.name,
            productType: product.productType,
            icps: product.icps,
            gtin: product.gtin.unit,
            measurement: product?.measurement?.unit ,
            // status: product,
            action: 'Действие',
        }))
    }, [products]);

    const [modalState, setModalState] = useState<{
        addProduct: boolean;
        editProduct: boolean;
        retrieveProduct: boolean;
        deleteProduct: boolean;
        productData: ProductResponse | null; 
      }>({
        addProduct: false,
        editProduct: false,
        retrieveProduct: false,
        deleteProduct: false,
        productData: null, 
      });

    const handleModal = (modalName: string, value: boolean) => {
        setModalState((prev) => ({...prev, [modalName] : value}));
    }

    const handleRegisterProduct = async (values: CreateProduct) => {
        try {
            const newData = { ...values, companyId: id };

            await dispatch(createProduct(newData)).unwrap();

            toast.success(t("products.messages.success.createProduct"));

            // очистка полей формы
            form.resetFields();

            // закрытие модалки через 1 секунду
            setTimeout(() => {
                handleModal("addProduct", false);
                // если нужно, можно убрать window.location.reload()
            }, 1000);

        } catch (err: any) {
            toast.error(err || t("products.messages.error.createProduct"));
        }
    };


    const [selectedProductId, setSelectedProductId] = useState<string | null>(null);

    const handleRowClick = (type: 'Product', action: 'retrieve' | 'edit' | 'delete', record: ProductTableDataType) => {
        console.log(`Clicked on ${type}, action: ${action}, record:`, record);
        if (type === 'Product'){
            const product = products.find((user) => user.id === record.key) ?? null
            setSelectedProductId(record.key);

            setModalState((prev) => ({
                ...prev,
                [`${action}${type}`]: true,
                productData: product
            }));
            if (action === "retrieve") {
                navigate(`/products/${record.key}`);
            }
            if(action === 'edit'){
                navigate(`/products/edit/${record.key}`)
            }
        }
    };

    useEffect(() => {
        if (selectedProductId){
            dispatch(getProductById({id: selectedProductId}))
        }
    }, [dispatch, selectedProductId])


    const handleDeleteProduct = (record: ProductTableDataType) => {
        const product = products.find((u) => u.id === record.key) ?? null;
        if (product) {
            setSelectedProductId(product.id);
            setModalState((prev) => ({
            ...prev,
            deleteProduct: true,
            productData: product,
            }));
        }
    };

    const confirmDeleteProduct = async () => {
        if (!modalState.productData) return;

        try {
            const resultAction = await dispatch(
            deleteProduct({ id: modalState.productData.id })
            );

            if (deleteProduct.fulfilled.match(resultAction)) {
                toast.success(t('products.messages.success.deleteProduct'));
                handleModal("deleteProduct", false);

                await dispatch(getAllProducts({ 
                    page: 1,
                    limit: 10,
                    sortOrder: 'asc',
                    status: 'active',
                    sortBy: 'name',
                    companyId: "68aad743aad6b8936a833ef7", 
                }));
            } else {
                toast.error(t('products.messages.error.deleteProduct'));
            }
        } catch (err) {
            toast.error((err as string) || t('products.messages.error.deleteProduct'));
        }
    };


    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.trim();

        if (value.length > 0) {
            setIsSearching(true);
            dispatch(
            searchProducts({
                query: value,
                page: 1,
                limit: dataLimit || 10,
                sortOrder: "asc",
            })
            );
        } else {
            setIsSearching(false);
            dispatch(
            getAllProducts({
                page: 1,
                limit: dataLimit || 10,
                sortOrder: "asc",
                companyId: id,
            })
            );
        }
    };


  return (
    <MainLayout>
        <Heading title={t('products.title')} subtitle={t('users.subtitle')} totalAmount='100'>
            <div className="btns-group">
                <CustomButton className='outline' onClick={() => navigate(`/audit-logs`)}>{t('navigation.audit')}</CustomButton>
                <CustomButton onClick={() => handleModal('addProduct', true)}>{t('products.btnAdd')}</CustomButton>
            </div>
        </Heading>
        <div className="box">
            <div className="box-container">
                <div className="box-container-items">
                    <div className="box-container-items-item">
                        <div className="box-container-items-item-filters">
                            <div className="form-inputs">
                                <Form.Item name="searchExpert" className="input">
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
                        </div>
                    </div>
                </div>
                <div className="box-container-items">
                    <ComponentTable<ProductTableDataType>
                        columns={ProductsTableColumns(t, handleRowClick, handleDeleteProduct)}
                        data={ProductsData}
                        onRowClick={(record) => handleRowClick('Product', 'retrieve', record)}
                        pagination={{
                            current: dataPage || 1,
                            pageSize: dataLimit || 10,
                            total: dataTotal || 0,
                            onChange: (newPage, newLimit) => {
                            dispatch(getAllProducts({ page: newPage, limit: newLimit, sortOrder: "asc", companyId: id }));
                            },
                        }}
                    />
                </div>
            </div>
        </div>
        <ModalWindow
            titleAction={t('products.modalWindow.adding')}
            title={t('products.modalWindow.product')}
            openModal={modalState.addProduct}
            closeModal={() => handleModal('addProduct', false)}
            className="modal-large"
            >
            <FormComponent onFinish={handleRegisterProduct}
              form={form}
                onValuesChange={(changedValues) => {
                    // если пользователь сам вводит shortName — запоминаем
                    if (changedValues.shortName !== undefined) {
                    shortNameEdited.current = true;
                    }

                    // если пользователь меняет name и shortName еще не редактировали — копируем
                    if (changedValues.name !== undefined && !shortNameEdited.current) {
                    form.setFieldsValue({ shortName: changedValues.name });
                    }
                }}
            >
                <div className="form-inputs form-inputs-row">
                    <Form.Item
                        className="input"
                        name="name"
                        label={t('products.addProductForm.label.name')}
                        rules={[
                            { required: true, message: t('products.addProductForm.validation.required.name') },
                        ]}
                    >
                        <Input className="input" size="large" placeholder={t('products.addProductForm.placeholder.name')} />
                    </Form.Item>

                    <Form.Item
                        className="input"
                        name="shortName"
                        label={t('products.addProductForm.label.shortName')}
                        rules={[
                        { required: true, message: t('products.addProductForm.validation.required.shortName') },
                        ]}
                    >
                        <Input className="input" size="large" placeholder={t('products.addProductForm.placeholder.shortName')} />
                    </Form.Item>
                </div>
                <div className="form-inputs form-inputs-row">
                    <Form.Item
                        className="input"
                        name="manufacturerCountry"
                        label={t('products.addProductForm.label.manufacturerCountry')}
                        rules={[
                            {
                                required: true,
                                message: t('products.addProductForm.validation.required.manufacturerCountry'),
                            },
                        ]}
                    >
                        <Select
                            showSearch
                            allowClear
                            size="large"
                            className="input"
                            placeholder={t('products.addProductForm.placeholder.manufacturerCountry')}
                            optionFilterProp="label"
                            filterOption={(input, option) =>
                                (option?.label ?? '')
                                    .toString()
                                    .toLowerCase()
                                    .includes(input.toLowerCase())
                            }
                            options={countryReferences.map(ref => ({
                                label:
                                    ref.title?.[currentLang] ?? // текущий язык
                                    ref.title?.ru ??
                                    ref.title?.en ??
                                    ref.alias,
                                value: ref.alias, // будет отправляться в POST
                            }))}
                        />
                    </Form.Item>

                    <Form.Item
                        className="input"
                        name="expiration"
                        label={t('products.addProductForm.label.expiration')}
                        rules={[
                            { required: true, message: t('products.addProductForm.validation.required.expiration') },
                            {
                                pattern: /^[0-9]{1,2}$/,
                                message: t('products.messages.error.invalidExpiration') // добавь новую строку перевода
                            },
                        ]}
                    >
                        <Input
                            min={0}
                            max={99}
                            step={1}
                            type="number"
                            className="input" size="large" placeholder={t('products.addProductForm.placeholder.expiration')} />
                    </Form.Item>
                </div>


                <div className="form-inputs form-inputs-row">
                    <Form.Item
                        className="input"
                        name="description"
                        label={t('products.addProductForm.label.description')}
                    >
                        <TextArea className="input" size="large" placeholder={t('products.addProductForm.placeholder.description')} />
                    </Form.Item>
                </div>

                <div className="form-inputs form-inputs-row">
                    <Form.Item
                        className="input"
                        name={['gtin', 'unit']}
                        label={t('products.gtin.unit')}
                        rules={[
                            { required: true, message: t('products.addProductForm.validation.required.gtin') },
                            { pattern: /^\d{14}$/, message: t('products.addProductForm.validation.pattern.gtin') },
                        ]}
                    >
                        <Input className="input" size="large" placeholder={t('products.addProductForm.placeholder.gtin')} />
                    </Form.Item>
                    <Form.Item
                        className="input"
                        name={['gtin', 'group']}
                        label={t('products.gtin.group')}
                        rules={[
                            { required: false},
                            { pattern: /^\d{14}$/, message: t('products.addProductForm.validation.pattern.gtin') },
                        ]}
                    >
                        <Input className="input" size="large" placeholder={t('products.addProductForm.placeholder.gtin')} />
                    </Form.Item>
                </div>

                <div className="form-inputs form-inputs-row">
                    <Form.Item
                        className="input"
                        name={['gtin', 'box_lv_1']}
                        label={t('products.gtin.box_lv_1')}
                        rules={[
                            { required: false},
                            { pattern: /^\d{14}$/, message: t('products.addProductForm.validation.pattern.gtin') },
                        ]}
                    >
                        <Input className="input" size="large" placeholder={t('products.addProductForm.placeholder.gtin')} />
                    </Form.Item>
                    <Form.Item
                        className="input"
                        name={['gtin', 'box_lv_2']}
                        label={t('products.gtin.box_lv_2')}
                        rules={[
                            { required: false},
                            { pattern: /^\d{14}$/, message: t('products.addProductForm.validation.pattern.gtin') },
                        ]}
                    >
                        <Input className="input" size="large" placeholder={t('products.addProductForm.placeholder.gtin')} />
                    </Form.Item>
                </div>

                <div className="form-inputs form-inputs-row">
                    <Form.Item
                        className="input"
                        name="icps"
                        label={t('products.addProductForm.label.icps')}
                        rules={[
                            { required: true, message:  t('products.addProductForm.validation.required.icps') },
                            { pattern: /^\d{14}$/, message: t('products.addProductForm.validation.pattern.icps')  },
                        ]}
                    >
                        <Input className="input" size="large" placeholder={t('products.addProductForm.placeholder.icps')} />
                    </Form.Item>
                    <Form.Item
                        className="input"
                        name="productType"
                        label={t('products.addProductForm.label.productType')}
                        rules={[
                            { required: true, message: t('products.addProductForm.validation.required.productType') }
                        ]}
                    >
                        <Select
                            key={currentLang} // перерендер при смене языка
                            className="input"
                            size="large"
                            placeholder={t('products.addProductForm.placeholder.productType')}
                            options={productGroupReferences.map(ref => ({
                                label: ref.title?.[currentLang as Lang] ?? ref.title?.ru ?? ref.title?.en ?? ref.alias,
                                value: ref.alias,
                            }))}
                        />
                    </Form.Item>

                </div>

                <div className="form-inputs form-inputs-row">
                    {/* <Form.Item
                        className="input"
                        name="expiration"
                        label={t('products.addProductForm.label.expiration')}
                        rules={[
                        { required: true, message: t('products.addProductForm.validation.required.expiration') },
                        { pattern: /^\d+$/, message: t('products.addProductForm.validation.pattern.expiration') },
                        ]}
                    >
                        <Input className="input" size="large" placeholder={t('products.addProductForm.placeholder.expiration')} />
                    </Form.Item> */}
                    <Form.Item
                        className="input"
                        name="aggregationQuantity"
                        label={t('products.addProductForm.label.aggregationQuantity')}
                        rules={[
                            { required: true, message: t('products.addProductForm.validation.required.aggregationQuantity') },
                            { pattern: /^\d+$/, message: t('products.addProductForm.validation.pattern.aggregationQuantity') },
                        ]}
                    >
                        <Input className="input" size="large" placeholder={t('products.addProductForm.placeholder.aggregationQuantity')} />
                    </Form.Item>

                    <Form.Item
                        className="input"
                        name={['measurement', 'unit']}
                        label={t('products.addProductForm.label.unit')}
                        rules={[
                        { required: true, message: t('products.addProductForm.validation.required.measurementUnit') },
                        { max: 10, message: t('products.addProductForm.validation.pattern.measurementUnit') },
                        ]}
                    >
                        <Input className="input" size="large" placeholder={t('products.addProductForm.placeholder.unit')} />
                    </Form.Item>

                </div>

                <div className="form-inputs form-inputs-row">
                    <Form.Item
                        className="input"
                        name={['measurement', 'amount']}
                        label={t('products.addProductForm.label.amount')}
                        rules={[
                        { required: true, message: t('products.validation.required') },
                        { pattern: /^\d+(\.\d+)?$/, message: t('products.validation.decimal') },
                        ]}
                    >
                        <Input className="input" size="large" placeholder={t('products.addProductForm.placeholder.amount')} />
                    </Form.Item>

                    <Form.Item
                        className="input"
                        name={['weight', 'net']}
                        label={t('products.addProductForm.label.net')}
                        rules={[
                        { required: true, message: t('products.validation.required') },
                        { pattern: /^\d+(\.\d+)?$/, message: t('products.validation.decimal') },
                        ]}
                    >
                        <Input className="input" size="large" placeholder={t('products.addProductForm.placeholder.net')} />
                    </Form.Item>
                </div>

                <div className="form-inputs form-inputs-row">
                    <Form.Item
                        className="input"
                        name={['weight', 'gross']}
                        label={t('products.addProductForm.label.gross')}
                        rules={[
                        { required: true, message: t('products.addProductForm.validation.required.measurementAmount') },
                        { pattern: /^\d+(\.\d+)?$/, message: t('products.addProductForm.validation.pattern.measurementAmount') },
                        ]}
                    >
                        <Input className="input" size="large" placeholder={t('products.addProductForm.placeholder.gross')} />
                    </Form.Item>

                    <Form.Item
                        className="input"
                        name="price"
                        label={t('products.addProductForm.label.price')}
                        rules={[
                        { required: true, message: t('products.addProductForm.validation.required.weightNet') },
                        { pattern: /^\d+(\.\d{1,2})?$/, message: t('products.addProductForm.validation.pattern.weightNet') },
                        ]}
                    >
                        <Input className="input" size="large" placeholder={t('products.addProductForm.placeholder.price')} />
                    </Form.Item>
                </div>

                <CustomButton type="submit">{t('btn.create')}</CustomButton>
            </FormComponent>
        </ModalWindow>
        <ModalWindow
            titleAction={t('products.modalWindow.deletion')}
            title={t('products.modalWindow.product')}
            openModal={modalState.deleteProduct}
            closeModal={() => handleModal("deleteProduct", false)}
            classDangerName='danger-title'
            >
            <div className="delete-modal">
                <div className="delete-modal-title">
                    <p className='title'>
                        {t('products.deleteUserQuestion')}: {" "}
                    </p>
                    <p className="subtitle">{modalState.productData?.name} ? </p>
                </div>
                <div className="delete-modal-btns">
                    <CustomButton className="danger" onClick={confirmDeleteProduct}>
                        {t('btn.delete')}
                    </CustomButton>
                    <CustomButton onClick={() => handleModal("deleteProduct", false)} className="outline">
                        {t('btn.cancel')}
                    </CustomButton>
                </div>
            </div>
        </ModalWindow>

    </MainLayout>
  )
}

export default Products