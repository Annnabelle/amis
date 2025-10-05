import { Form, Input } from 'antd'
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../../../store';
import { useEffect, useState } from 'react';
import { getProductById, updateProduct } from '../../../store/products';
import { toast } from 'react-toastify';
import MainLayout from '../../../components/layout';
import Heading from '../../../components/mainHeading';
import CustomButton from '../../../components/button';
import { useNavigationBack } from '../../../utils/utils';
import FormComponent from '../../../components/formComponent';

const ProductsEdit = () => {
    const { id } = useParams<{ id: string }>();
    const { t, i18n } = useTranslation();
    const dispatch = useAppDispatch()
    const productById = useAppSelector((state) => state.products.productById)
    const navigateBack = useNavigationBack();
    const [isChanged, setIsChanged] = useState(false);
    const [initialValues, setInitialValues] = useState<any>(null);

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
        if (id){
            dispatch(getProductById({id: id}))
        }
    }, [dispatch, id])

    const handleUpdateProduct = async (values: any) => {
        if (!id) return;

        try {
            const resultAction = await dispatch(
             updateProduct({ id: id, data: values })
            );

            if (updateProduct.fulfilled.match(resultAction)) {
                toast.success(t('products.messages.success.updateProduct'));

                await dispatch(getProductById({ id: id }));
                } else {
                toast.error(t('products.messages.error.updateProduct'));
            }
        } catch (err) {
            toast.error((err as string) || t('products.messages.error.updateProduct'));
        }
    };

  return (
    <MainLayout>
        <Heading title={t('products.edit')} subtitle={t('users.subtitle')} totalAmount='100'>
           <CustomButton onClick={() => navigateBack(`/organization/${id}/products`)}>{t('btn.back')}</CustomButton>
        </Heading>
        <div className="box">
            <div className="box-container">
                {productById && (
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
                                    {pattern: /^\d{14}$/,  message: t('products.validation.gtin') },
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
                            {/* <Form.Item className="input" name="expiration" label={t('products.addProductForm.label.expiration')}  
                                initialValue={productById.expiration}
                                rules={[
                                    { required: true, message: t('products.validation.required') },
                                    { pattern: /^\d+$/, message: t('products.validation.number') },
                                ]}
                            >
                                <Input className="input" size="large" placeholder={t('products.addProductForm.placeholder.expiration')} />
                            </Form.Item> */}
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
                )}
            </div>
        </div>

    </MainLayout>
  )
}

export default ProductsEdit