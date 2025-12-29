import {Form, Input} from 'antd'
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom'
import { useAppSelector, useAppDispatch } from '../../../store';
import MainLayout from '../../../components/layout';
import Heading from '../../../components/mainHeading';
import CustomButton from '../../../components/button';
import FormComponent from '../../../components/formComponent';
import {useEffect, useState} from 'react';
import { getProductById } from '../../../store/products';
import { useNavigationBack } from '../../../utils/utils';
import TextArea from "antd/es/input/TextArea";
import {fetchReferencesByType} from "../../../store/references";

const ProductsView = () => {
    const params = useParams();
    const orgId = params.orgId;
    const productId = params.id;
    const dispatch = useAppDispatch()
    const { t, i18n } = useTranslation();
    const navigateBack = useNavigationBack();
    const productById = useAppSelector((state) => state.products.productById)
    const countryReferences =
        useAppSelector((state) => state.references.references.countryCode) ?? [];

    const supportedLangs = ['ru', 'en', 'uz'] as const;
    type Lang = typeof supportedLangs[number];

    const currentLang = (i18n.language.split('-')[0] as Lang) || 'en';
    const [countryLabel, setCountryLabel] = useState<string>("");

    useEffect(() => {
        dispatch(fetchReferencesByType("countryCode"));
    }, [dispatch]);


    useEffect(() => {
        if (productById?.manufacturerCountry && countryReferences.length) {
            const country = countryReferences.find(
                (ref) => ref.alias === productById.manufacturerCountry
            );
            setCountryLabel(
                country?.title?.[currentLang] ?? country?.title?.ru ?? country?.title?.en ?? productById.manufacturerCountry
            );
        }
    }, [productById, countryReferences, currentLang]);

    if (!productId) {
        throw new Error("Company ID is required but not found in route params");
    }

    const [form] = Form.useForm()

     useEffect(() => {
        if (productId) {
            dispatch(getProductById({id: productId}));
        }
    }, [dispatch, productId]);

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
                manufacturerCountry: productById.manufacturerCountry,
                expiration: productById.expiration,
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
             <CustomButton onClick={() => navigateBack(`/organization/${orgId}/products`)}>{t('btn.back')}</CustomButton>
        </Heading>
        <div className="box">
            <div className="box-container">
                {productById && (
                    <FormComponent>
                        <div className="form-inputs form-inputs-row">
                            {productById.name && (
                                <Form.Item className="input" name="name" label={t('products.addProductForm.label.name')}>
                                    <Input className="input" size='large' placeholder={productById.name} disabled/>
                                </Form.Item>
                            )}
                            {productById.shortName && (
                                <Form.Item className="input" name="shortName" label={t('products.addProductForm.label.shortName')}>
                                    <Input className="input" size='large' placeholder={productById.shortName} disabled />
                                </Form.Item>
                            )}
                        </div>
                        <div className="form-inputs form-inputs-row">
                            {productById.manufacturerCountry && (
                                <Form.Item className="input" name="manufacturerCountry" label={t('products.addProductForm.label.manufacturerCountry')}>
                                    <Input className="input" size='large' placeholder={countryLabel} disabled />
                                </Form.Item>
                            )}
                            {productById.expiration && (
                                <Form.Item className="input" name="expiration" label={t('products.addProductForm.label.expiration')}>
                                    <Input className="input" size='large' placeholder={productById.expiration.toString()} disabled />
                                </Form.Item>
                            )}
                        </div>

                        {productById.description && (
                            <div className="form-inputs form-inputs-row">
                                <Form.Item className="input" name="description" label={t('products.addProductForm.label.description')}>
                                    <TextArea className="input" size='large' placeholder={productById.description ?? ''} disabled/>
                                </Form.Item>
                            </div>
                        )}
                        <div className="form-inputs form-inputs-row">
                            {productById.gtin.unit && (
                                <Form.Item className="input" name={['gtin', 'unit']} label={t('products.gtin.unit')}>
                                    <Input className="input" size='large' placeholder={productById.gtin.unit} disabled />
                                </Form.Item>
                            )}
                            {productById.gtin.group && (
                                <Form.Item className="input" name={['gtin', 'group']} label={t('products.gtin.group')}>
                                    <Input className="input" size='large' placeholder={productById.gtin.group} disabled />
                                </Form.Item>
                            )}
                        </div>
                        <div className="form-inputs form-inputs-row">
                            {productById.gtin.box_lv_1 && (
                                <Form.Item className="input" name={['gtin', 'box_lv_1']} label={t('products.gtin.box_lv_1')}>
                                    <Input className="input" size='large' placeholder={productById.gtin.box_lv_1} disabled />
                                </Form.Item>
                            )}
                            {productById.gtin.box_lv_2 && (
                                <Form.Item className="input" name={['gtin', 'box_lv_2']} label={t('products.gtin.box_lv_2')}>
                                    <Input className="input" size='large' placeholder={productById.gtin.box_lv_2} disabled />
                                </Form.Item>
                            )}
                        </div>
                        <div className="form-inputs form-inputs-row">
                            {productById.icps && (
                                <Form.Item className="input" name="icps" label={t('products.addProductForm.label.icps')}>
                                    <Input className="input" size='large' placeholder={productById.icps} disabled />
                                </Form.Item>
                            )}
                            {productById.productType && (
                                <Form.Item className="input" name="productType" label={t('products.addProductForm.label.productType')}>
                                    <Input className="input" size='large' placeholder={productById.productType} disabled/>
                                </Form.Item>
                            )}
                        </div>
                        <div className="form-inputs form-inputs-row">
                            {productById.aggregationQuantity && (
                                <Form.Item className="input" name="aggregationQuantity" label={t('products.addProductForm.label.aggregationQuantity')}>
                                    <Input className="input" size='large' placeholder={String(productById.aggregationQuantity)} disabled />
                                </Form.Item>
                            )}
                            {productById.measurement.unit && (
                                <Form.Item className="input" name={['measurement', 'unit']} label={t('products.addProductForm.label.unit')}>
                                    <Input className="input" size='large' placeholder={productById.measurement.unit} disabled />
                                </Form.Item>
                            )}
                        </div>
                        <div className="form-inputs form-inputs-row">
                            {productById.measurement.amount && (
                                <Form.Item className="input" name={['measurement', 'amount']} label={t('products.addProductForm.label.amount')}>
                                    <Input className="input" size='large' placeholder={String(productById.measurement.amount)} disabled/>
                                </Form.Item>
                            )}
                            {productById.weight.net && (
                                <Form.Item className="input" name={['weight', 'net']} label={t('products.addProductForm.label.net')}>
                                    <Input className="input" size='large' placeholder={String(productById.weight.net)} disabled />
                                </Form.Item>
                            )}
                        </div>
                            <div className="form-inputs form-inputs-row">
                                {productById.weight.gross && (
                                    <Form.Item className="input" name={['weight', 'gross']} label={t('products.addProductForm.label.gross')}>
                                        <Input className="input" size='large' placeholder={String(productById.weight.gross)} disabled/>
                                    </Form.Item>
                                )}
                                {productById.price && (
                                    <Form.Item className="input" name="price" label={t('products.addProductForm.label.price')}>
                                        <Input className="input" size='large' placeholder={String(productById.price)} disabled />
                                    </Form.Item>
                                )}
                        </div>
                    </FormComponent>
                )}
            </div>
        </div>

    </MainLayout>
  )
}

export default ProductsView