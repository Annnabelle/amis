import { Form, Input } from 'antd'
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom'
import { useAppSelector } from '../../../store';
import MainLayout from '../../../components/layout';
import Heading from '../../../components/mainHeading';
import CustomButton from '../../../components/button';
import FormComponent from '../../../components/formComponent';
import { useEffect } from 'react';
import { getProductById } from '../../../store/products';
import { useDispatch } from 'react-redux';
import { useNavigationBack } from '../../../utils/utils';

const ProductsView = () => {
    const { id } = useParams<{ id: string }>();
    const dispatch = useDispatch()
    const { t, i18n } = useTranslation();
    const navigateBack = useNavigationBack();
    const productById = useAppSelector((state) => state.products.productById)

    if (!id) {
        throw new Error("Company ID is required but not found in route params");
    }

    const [form] = Form.useForm()

    //  useEffect(() => {
    //     if (id) {
    //         dispatch(getProductById({ id }));
    //     }
    // }, [dispatch, id]);

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


  return (
    <MainLayout>
        <Heading title={t('products.view')} >
             <CustomButton onClick={() => navigateBack(`/organization/${id}/products`)}>{t('btn.back')}</CustomButton>
        </Heading>
        <div className="box">
            <div className="box-container">
                {productById && (
                    <FormComponent>
                        <div className="form-inputs form-inputs-row">
                            <Form.Item className="input" name="name" label={t('products.addProductForm.label.name')}>
                                <Input className="input" size='large' placeholder={productById.name} disabled/>
                            </Form.Item>
                            <Form.Item className="input" name="shortName" label={t('products.addProductForm.label.shortName')}>
                                <Input className="input" size='large' placeholder={productById.shortName} disabled />
                            </Form.Item>
                        </div>
                        <div className="form-inputs form-inputs-row">
                            <Form.Item className="input" name="description" label={t('products.addProductForm.label.description')}>
                                <Input className="input" size='large' placeholder={productById.description ?? ''} disabled/>
                            </Form.Item>
                            <Form.Item className="input" name="gtin" label={t('products.addProductForm.label.gtin')}>
                                <Input className="input" size='large' placeholder={productById.gtin} disabled />
                            </Form.Item>
                        </div>
                        <div className="form-inputs form-inputs-row">
                            <Form.Item className="input" name="barcode" label={t('products.addProductForm.label.barcode')}>
                                <Input className="input" size='large' placeholder={productById.barcode} disabled/>
                            </Form.Item>
                            <Form.Item className="input" name="icps" label={t('products.addProductForm.label.icps')}>
                                <Input className="input" size='large' placeholder={productById.icps} disabled />
                            </Form.Item>
                        </div>
                        <div className="form-inputs form-inputs-row">
                            <Form.Item className="input" name="productType" label={t('products.addProductForm.label.productType')}>
                                <Input className="input" size='large' placeholder={productById.productType} disabled/>
                            </Form.Item>
                            <Form.Item className="input" name="aggregationQuantity" label={t('products.addProductForm.label.aggregationQuantity')}>
                                <Input className="input" size='large' placeholder={String(productById.aggregationQuantity)} disabled />
                            </Form.Item>
                        </div>
                        <div className="form-inputs form-inputs-row">
                            {/* <Form.Item className="input" name="expiration" label={t('products.addProductForm.label.expiration')}>
                                <Input className="input" size='large' placeholder={String(productById.expiration)} disabled/>
                            </Form.Item> */}
                            <Form.Item className="input" name={['measurement', 'unit']} label={t('products.addProductForm.label.unit')}>
                                <Input className="input" size='large' placeholder={productById.measurement.unit} disabled />
                            </Form.Item>
                        </div>
                        <div className="form-inputs form-inputs-row">
                            <Form.Item className="input" name={['measurement', 'amount']} label={t('products.addProductForm.label.amount')}>
                                <Input className="input" size='large' placeholder={String(productById.measurement.amount)} disabled/>
                            </Form.Item>
                            <Form.Item className="input" name={['weight', 'net']} label={t('products.addProductForm.label.net')}>
                                <Input className="input" size='large' placeholder={String(productById.weight.net)} disabled />
                            </Form.Item>
                        </div>
                            <div className="form-inputs form-inputs-row">
                            <Form.Item className="input" name={['weight', 'gross']} label={t('products.addProductForm.label.gross')}>
                                <Input className="input" size='large' placeholder={String(productById.weight.gross)} disabled/>
                            </Form.Item>
                            <Form.Item className="input" name="price" label={t('products.addProductForm.label.price')}>
                                <Input className="input" size='large' placeholder={String(productById.price)} disabled />
                            </Form.Item>
                        </div>
                    </FormComponent>
                )}
            </div>
        </div>

    </MainLayout>
  )
}

export default ProductsView