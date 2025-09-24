import { Form, Input } from 'antd'
import { IoSearch } from 'react-icons/io5'
import { useAppDispatch, useAppSelector } from '../../store'
import { toast } from 'react-toastify'
import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import MainLayout from '../../components/layout'
import Heading from '../../components/mainHeading'
import ComponentTable from '../../components/table'
import CustomButton from '../../components/button'
import ModalWindow from '../../components/modalWindow'
import FormComponent from '../../components/formComponent'
import { createProduct, deleteProduct, getAllProducts, getProductById, searchProducts, updateProduct } from '../../store/products'
import { ProductsTableColumns } from '../../tableData/products'
import type { ProductTableDataType } from '../../tableData/products/types'
import type { CreateProduct, ProductResponse } from '../../types/products'
import { useParams } from 'react-router-dom'

const Products = () => {
    const { id } = useParams<{ id: string }>();
    const { t, i18n } = useTranslation();
    const dispatch = useAppDispatch()
    const products = useAppSelector((state) => state.products.products)
    const dataLimit = useAppSelector((state) => state.products.limit)
    const dataPage = useAppSelector((state) => state.products.page)
    const dataTotal = useAppSelector((state) => state.products.total)
    const productById = useAppSelector((state) => state.products.productById)

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
            barcode: productById.barcode,
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
        dispatch(getAllProducts({
            page: 1,
            limit: 10,
            sortOrder: 'asc',
            status: 'active',
            sortBy: 'name',
            companyId: id,
        })) 
    }, [dispatch, id])

   const ProductsData = useMemo(() => {
        return products.map((product, index) => ({
            key: product.id,                
            number: index + 1,         
            name: product.name,
            productType: product.productType,
            icps: product.icps,
            gtin: product.gtin,
            measurement: product.measurement.unit ,
            status: 'product.status',
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
            const newData = {...values, companyId: id}
            const resultAction = await dispatch(createProduct(newData));
        
            if (createProduct.fulfilled.match(resultAction)) {
                toast.success(t('products.messages.success.createProduct'));
                setTimeout(() => {
                    handleModal('addProduct', false);
                    window.location.reload(); 
                }, 1000); 
            } else {
                toast.error(t('products.messages.error.createProduct'));
            }
        } catch (err) {
            toast.error((err as string) || t('users.messages.error.createProduct'));
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
        }
    };

    useEffect(() => {
        if (selectedProductId){
            dispatch(getProductById({id: selectedProductId}))
        }
    }, [dispatch, selectedProductId])

    const handleEditProduct = (record: ProductTableDataType) => {
        const product = products.find((p) => p.id === record.key) ?? null;
        if (product) {
            setSelectedProductId(product.id);
            setModalState((prev) => ({
            ...prev,
            editProduct: true,
            productData: product
            }));
        }
    };


    const handleUpdateProduct = async (values: any) => {
        if (!selectedProductId) return;

        try {
            const resultAction = await dispatch(
             updateProduct({ id: selectedProductId, data: values })
            );

            if (updateProduct.fulfilled.match(resultAction)) {
                toast.success(t('products.messages.success.updateProduct'));
                handleModal("editProduct", false);

                await dispatch(getAllProducts({  
                    page: 1,
                    limit: 10,
                    sortOrder: 'asc',
                    status: 'active',
                    sortBy: 'name',
                    companyId: id, 
                }));
                await dispatch(getProductById({ id: selectedProductId }));
                } else {
                toast.error(t('products.messages.error.updateProduct'));
            }
        } catch (err) {
            toast.error((err as string) || t('products.messages.error.updateProduct'));
        }
    };

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
        const value = e.target.value;
        if (value.trim().length > 0) {
            dispatch(searchProducts({ query: value, page: 1, limit: 10, sortOrder: 'asc' }));
        } else {
            dispatch(getAllProducts({   
            page: 1,
            limit: 10,
            sortOrder: 'asc',
            status: 'active',
            sortBy: 'name',
            companyId: id, }));
        }
    };

  return (
    <MainLayout>
        <Heading title={t('products.title')} subtitle={t('users.subtitle')} totalAmount='100'>
            <CustomButton onClick={() => handleModal('addProduct', true)}>{t('products.btnAdd')}</CustomButton>
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
                                {/* <div className="form-inputs">
                                    <Form.Item
                                        className="input"
                                        name="searchExpert"
                                    >
                                        <Select
                                            size="large"
                                            className='input'
                                            placeholder='Выберите роль'
                                            options={chooseRole}
                                            allowClear
                                        />
                                    </Form.Item>
                                </div> */}
                        </div>
                    </div>
                </div>
                <div className="box-container-items">
                    <ComponentTable<ProductTableDataType> 
                        columns={ProductsTableColumns(t, handleEditProduct, handleDeleteProduct)}
                        data={ProductsData}
                        onRowClick={(record) => handleRowClick('Product', 'retrieve', record)}
                    />
                </div>
            </div>
        </div>
        <ModalWindow
            titleAction={t('products.modalWindow.adding')}
            title={t('products.modalWindow.product')}
            openModal={modalState.addProduct}
            closeModal={() => handleModal('addProduct', false)}
            >
            <FormComponent onFinish={handleRegisterProduct}>
                <div className="form-inputs">
                <Form.Item
                    className="input"
                    name="name"
                    label={t('products.addProductForm.label.name')}
                    rules={[
                    { required: true, message: t('products.validation.required') },
                    { min: 2, message: t('products.validation.min2') },
                    ]}
                >
                    <Input className="input" size="large" placeholder={t('products.addProductForm.placeholder.name')} />
                </Form.Item>

                <Form.Item
                    className="input"
                    name="shortName"
                    label={t('products.addProductForm.label.shortName')}
                    rules={[
                    { required: true, message: t('products.validation.required') },
                    { max: 50, message: t('products.validation.max50') },
                    ]}
                >
                    <Input className="input" size="large" placeholder={t('products.addProductForm.placeholder.shortName')} />
                </Form.Item>
                </div>

                <div className="form-inputs">
                <Form.Item
                    className="input"
                    name="description"
                    label={t('products.addProductForm.label.description')}
                    rules={[{ max: 200, message: t('products.validation.max200') }]}
                >
                    <Input className="input" size="large" placeholder={t('products.addProductForm.placeholder.description')} />
                </Form.Item>

                <Form.Item
                    className="input"
                    name="gtin"
                    label={t('products.addProductForm.label.gtin')}
                    rules={[
                    { required: true, message: t('products.validation.required') },
                    { pattern: /^(?:\d{8}|\d{12}|\d{13}|\d{14})$/, message: t('products.validation.gtin') },
                    ]}
                >
                    <Input className="input" size="large" placeholder={t('products.addProductForm.placeholder.gtin')} />
                </Form.Item>
                </div>

                <div className="form-inputs">
                <Form.Item
                    className="input"
                    name="barcode"
                    label={t('products.addProductForm.label.barcode')}
                    rules={[
                    { required: true, message: t('products.validation.required') },
                    { pattern: /^\d{8,14}$/, message: t('products.validation.barcode') },
                    ]}
                >
                    <Input className="input" size="large" placeholder={t('products.addProductForm.placeholder.barcode')} />
                </Form.Item>

                <Form.Item
                    className="input"
                    name="icps"
                    label={t('products.addProductForm.label.icps')}
                    rules={[
                    { required: true, message: t('products.validation.required') },
                    { pattern: /^\d{14}$/, message: t('products.validation.icps') },
                    ]}
                >
                    <Input className="input" size="large" placeholder={t('products.addProductForm.placeholder.icps')} />
                </Form.Item>
                </div>

                <div className="form-inputs">
                <Form.Item
                    className="input"
                    name="productType"
                    label={t('products.addProductForm.label.productType')}
                    rules={[{ required: true, message: t('products.validation.required') }]}
                >
                    <Input className="input" size="large" placeholder={t('products.addProductForm.placeholder.productType')} />
                </Form.Item>

                <Form.Item
                    className="input"
                    name="aggregationQuantity"
                    label={t('products.addProductForm.label.aggregationQuantity')}
                    rules={[
                    { required: true, message: t('products.validation.required') },
                    { pattern: /^\d+$/, message: t('products.validation.number') },
                    ]}
                >
                    <Input className="input" size="large" placeholder={t('products.addProductForm.placeholder.aggregationQuantity')} />
                </Form.Item>
                </div>

                <div className="form-inputs">
                <Form.Item
                    className="input"
                    name="expiration"
                    label={t('products.addProductForm.label.expiration')}
                    rules={[
                    { required: true, message: t('products.validation.required') },
                    { pattern: /^\d+$/, message: t('products.validation.number') },
                    ]}
                >
                    <Input className="input" size="large" placeholder={t('products.addProductForm.placeholder.expiration')} />
                </Form.Item>

                <Form.Item
                    className="input"
                    name={['measurement', 'unit']}
                    label={t('products.addProductForm.label.unit')}
                    rules={[
                    { required: true, message: t('products.validation.required') },
                    { max: 10, message: t('products.validation.max10') },
                    ]}
                >
                    <Input className="input" size="large" placeholder={t('products.addProductForm.placeholder.unit')} />
                </Form.Item>
                </div>

                <div className="form-inputs">
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

                <div className="form-inputs">
                <Form.Item
                    className="input"
                    name={['weight', 'gross']}
                    label={t('products.addProductForm.label.gross')}
                    rules={[
                    { required: true, message: t('products.validation.required') },
                    { pattern: /^\d+(\.\d+)?$/, message: t('products.validation.decimal') },
                    ]}
                >
                    <Input className="input" size="large" placeholder={t('products.addProductForm.placeholder.gross')} />
                </Form.Item>

                <Form.Item
                    className="input"
                    name="price"
                    label={t('products.addProductForm.label.price')}
                    rules={[
                    { required: true, message: t('products.validation.required') },
                    { pattern: /^\d+(\.\d{1,2})?$/, message: t('products.validation.price') },
                    ]}
                >
                    <Input className="input" size="large" placeholder={t('products.addProductForm.placeholder.price')} />
                </Form.Item>
                </div>

                <CustomButton type="submit">{t('btn.create')}</CustomButton>
            </FormComponent>
            </ModalWindow>

        {productById && selectedProductId && (
            <ModalWindow titleAction={t('products.modalWindow.viewing')} title={t('products.modalWindow.product')} openModal={modalState.retrieveProduct} closeModal={() => handleModal('retrieveProduct', false)}>
                <FormComponent>
                    <div className="form-inputs">
                        <Form.Item className="input" name="name" label={t('users.addUserForm.label.name')}>
                            <Input className="input" size='large' placeholder={productById.name} disabled/>
                        </Form.Item>
                        <Form.Item className="input" name="shortName" label={t('users.addUserForm.label.shortName')}>
                            <Input className="input" size='large' placeholder={productById.shortName} disabled />
                        </Form.Item>
                    </div>
                    <div className="form-inputs">
                        <Form.Item className="input" name="description" label={t('users.addUserForm.label.description')}>
                            <Input className="input" size='large' placeholder={productById.description ?? ''} disabled/>
                        </Form.Item>
                        <Form.Item className="input" name="gtin" label={t('users.addUserForm.label.gtin')}>
                            <Input className="input" size='large' placeholder={productById.gtin} disabled />
                        </Form.Item>
                    </div>
                    <div className="form-inputs">
                        <Form.Item className="input" name="barcode" label={t('users.addUserForm.label.barcode')}>
                            <Input className="input" size='large' placeholder={productById.barcode} disabled/>
                        </Form.Item>
                        <Form.Item className="input" name="icps" label={t('users.addUserForm.label.icps')}>
                            <Input className="input" size='large' placeholder={productById.icps} disabled />
                        </Form.Item>
                    </div>
                    <div className="form-inputs">
                        <Form.Item className="input" name="productType" label={t('users.addUserForm.label.productType')}>
                            <Input className="input" size='large' placeholder={productById.productType} disabled/>
                        </Form.Item>
                        <Form.Item className="input" name="aggregationQuantity" label={t('users.addUserForm.label.aggregationQuantity')}>
                            <Input className="input" size='large' placeholder={String(productById.aggregationQuantity)} disabled />
                        </Form.Item>
                    </div>
                    <div className="form-inputs">
                        <Form.Item className="input" name="expiration" label={t('users.addUserForm.label.expiration')}>
                            <Input className="input" size='large' placeholder={String(productById.expiration)} disabled/>
                        </Form.Item>
                        <Form.Item className="input" name={['measurement', 'unit']} label={t('users.addUserForm.label.unit')}>
                            <Input className="input" size='large' placeholder={productById.measurement.unit} disabled />
                        </Form.Item>
                    </div>
                    <div className="form-inputs">
                        <Form.Item className="input" name={['measurement', 'amount']} label={t('users.addUserForm.label.amount')}>
                            <Input className="input" size='large' placeholder={String(productById.measurement.amount)} disabled/>
                        </Form.Item>
                        <Form.Item className="input" name={['weight', 'net']} label={t('users.addUserForm.label.net')}>
                            <Input className="input" size='large' placeholder={String(productById.weight.net)} disabled />
                        </Form.Item>
                    </div>
                     <div className="form-inputs">
                        <Form.Item className="input" name={['weight', 'gross']} label={t('users.addUserForm.label.gross')}>
                            <Input className="input" size='large' placeholder={String(productById.weight.gross)} disabled/>
                        </Form.Item>
                        <Form.Item className="input" name="price" label={t('users.addUserForm.label.price')}>
                            <Input className="input" size='large' placeholder={String(productById.price)} disabled />
                        </Form.Item>
                    </div>
                </FormComponent>
            </ModalWindow>
        )}
        {productById && selectedProductId && (
            <ModalWindow
                titleAction={t('products.modalWindow.editing')}
                title={t('products.modalWindow.product')}
                openModal={modalState.editProduct}
                closeModal={() => handleModal("editProduct", false)}
            >
                <FormComponent
                    form={form}
                    onFinish={(values) => {
                        handleUpdateProduct(values);
                    }}
                >
                    <div className="form-inputs">
                        <Form.Item className="input" name="name" label={t('products.addProductForm.label.name')}  
                            initialValue={productById.name}
                            rules={[
                                { required: true, message: t('products.validation.required') },
                                { min: 2, message: t('products.validation.min2') },
                            ]}
                        >
                            <Input className="input" size="large" placeholder={t('products.addProductForm.placeholder.name')}  />
                        </Form.Item>
                        <Form.Item className="input" name="shortName" label={t('products.addProductForm.label.shortName')} 
                            initialValue={productById.shortName}
                            rules={[
                                { required: true, message: t('products.validation.required') },
                                { max: 50, message: t('products.validation.max50') },
                            ]}
                        >
                            <Input className="input" size="large" placeholder={t('products.addProductForm.placeholder.shortName')}  />
                        </Form.Item>
                    </div>
                    <div className="form-inputs">
                        <Form.Item className="input" name="description" label={t('products.addProductForm.label.description')}   
                            initialValue={productById.description}
                            rules={[{ max: 200, message: t('products.validation.max200') }]}
                        >
                            <Input className="input" size="large" placeholder={t('products.addProductForm.placeholder.description')} />
                        </Form.Item>
                        <Form.Item className="input" name="gtin" label={t('products.addProductForm.label.gtin')} 
                            initialValue={productById.gtin}
                            rules={[
                                { required: true, message: t('products.validation.required') },
                                { pattern: /^(?:\d{8}|\d{12}|\d{13}|\d{14})$/, message: t('products.validation.gtin') },
                            ]}
                        >
                            <Input className="input" size="large" placeholder={t('products.addProductForm.placeholder.gtin')}  />
                        </Form.Item>
                    </div>
                    <div className="form-inputs">
                        <Form.Item className="input" name="barcode" label={t('products.addProductForm.label.barcode')}
                            initialValue={productById.barcode}
                            rules={[
                                { required: true, message: t('products.validation.required') },
                                { pattern: /^\d{8,14}$/, message: t('products.validation.barcode') },
                            ]}
                        >
                            <Input className="input" size="large" placeholder={t('products.addProductForm.placeholder.barcode')}  />
                        </Form.Item>
                        <Form.Item className="input" name="icps" label={t('products.addProductForm.label.icps')}
                            initialValue={productById.icps}
                            rules={[
                                { required: true, message: t('products.validation.required') },
                                { pattern: /^\d{14}$/, message: t('products.validation.icps') },
                            ]}
                        >
                            <Input className="input" size="large" placeholder={t('products.addProductForm.placeholder.icps')} />
                        </Form.Item>
                    </div>
                    <div className="form-inputs">
                        <Form.Item className="input" name="productType" label={t('products.addProductForm.label.productType')}
                            initialValue={productById.productType}
                            rules={[{ required: true, message: t('products.validation.required') }]}
                        >
                            <Input className="input" size="large" placeholder={t('products.addProductForm.placeholder.productType')}  />
                        </Form.Item>
                        <Form.Item className="input" name="aggregationQuantity" label={t('products.addProductForm.label.aggregationQuantity')}
                            initialValue={productById.aggregationQuantity}
                            rules={[
                                { required: true, message: t('products.validation.required') },
                                { pattern: /^\d+$/, message: t('products.validation.number') },
                            ]}
                        >
                            <Input className="input" size="large" placeholder={t('products.addProductForm.placeholder.aggregationQuantity')} />
                        </Form.Item>
                    </div>
                    <div className="form-inputs">
                        <Form.Item className="input" name="expiration" label={t('products.addProductForm.label.expiration')}  
                            initialValue={productById.expiration}
                            rules={[
                                { required: true, message: t('products.validation.required') },
                                { pattern: /^\d+$/, message: t('products.validation.number') },
                            ]}
                        >
                            <Input className="input" size="large" placeholder={t('products.addProductForm.placeholder.expiration')} />
                        </Form.Item>
                        <Form.Item className="input" name={['measurement', 'unit']} label={t('products.addProductForm.label.unit')}
                            initialValue={productById.measurement.unit}
                            rules={[
                                { required: true, message: t('products.validation.required') },
                                { max: 10, message: t('products.validation.max10') },
                            ]}
                        >
                            <Input className="input" size="large" placeholder={t('products.addProductForm.placeholder.unit')}   />
                        </Form.Item>
                    </div>
                    <div className="form-inputs">
                        <Form.Item className="input" name={['measurement', 'amount']} label={t('products.addProductForm.label.amount')}
                            initialValue={productById.measurement.amount}
                            rules={[
                                { required: true, message: t('products.validation.required') },
                                { pattern: /^\d+(\.\d+)?$/, message: t('products.validation.decimal') },
                            ]}
                        >
                            <Input className="input" size="large" placeholder={t('products.addProductForm.placeholder.amount')} />
                        </Form.Item>
                        <Form.Item className="input" name={['weight', 'net']} label={t('products.addProductForm.label.net')}
                            initialValue={productById.weight.net}
                            rules={[
                                { required: true, message: t('products.validation.required') },
                                { pattern: /^\d+(\.\d+)?$/, message: t('products.validation.decimal') },
                            ]}
                        >
                            <Input className="input" size="large" placeholder={t('products.addProductForm.placeholder.net')}  />
                        </Form.Item>
                    </div>
                    <div className="form-inputs">
                        <Form.Item className="input" name={['weight', 'gross']} label={t('products.addProductForm.label.gross')} 
                            initialValue={productById.weight.gross}
                            rules={[
                                { required: true, message: t('products.validation.required') },
                                { pattern: /^\d+(\.\d+)?$/, message: t('products.validation.decimal') },
                            ]}
                        >
                            <Input className="input" size="large" placeholder={t('products.addProductForm.placeholder.gross')} />
                        </Form.Item>
                        <Form.Item className="input" name='price' label={t('products.addProductForm.label.price')} 
                            initialValue={productById.price}
                            rules={[
                                { required: true, message: t('products.validation.required') },
                                { pattern: /^\d+(\.\d{1,2})?$/, message: t('products.validation.price') },
                            ]}
                        >
                            <Input className="input" size="large" placeholder={t('products.addProductForm.placeholder.price')}  />
                        </Form.Item>
                    </div>
                    <CustomButton type="submit">{t('btn.save')} </CustomButton>
                </FormComponent>
            </ModalWindow>
        )}
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