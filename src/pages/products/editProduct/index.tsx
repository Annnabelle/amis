import {Form} from 'antd'
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from 'app/store';
import { useEffect } from 'react';
import { getProductById, updateProduct } from 'entities/products/model';
import type { UpdateProductDto } from 'entities/products/dtos';
import { toast } from 'react-toastify';
import MainLayout from 'shared/ui/layout';
import Heading from 'shared/ui/mainHeading';
import CustomButton from 'shared/ui/button';
import { useNavigationBack } from 'shared/lib';
import FormComponent from 'shared/ui/formComponent';
import { FormActions, FormGrid, FormRow, SelectField, TextAreaField, TextField } from 'shared/ui/form';
import {fetchReferencesByType} from "entities/references/model";
import { endpointAccessMap } from 'shared/config/endpointAccessMap';
import { RequiredDataAlert } from 'entities/access/ui';

const ProductsEdit = () => {
    const { id } = useParams<{ id: string }>();
    const { t, i18n } = useTranslation();
    const dispatch = useAppDispatch()
    const referencesError = useAppSelector((state) => state.references.error);
    const productError = useAppSelector((state) => state.products.error);
    const referencesLoading = useAppSelector((state) => state.references.loading);
    const productLoading = useAppSelector((state) => state.products.isLoading);
    const requiredDataUnavailable =
        referencesLoading ||
        productLoading ||
        Boolean(referencesError) ||
        Boolean(productError);
    const productById = useAppSelector((state) => state.products.productById)
    const navigateBack = useNavigationBack();
    const productGroupReferences =
        useAppSelector(state => state.references.references.productGroup) ?? [];
    const countryReferences =
        useAppSelector(state => state.references.references.countryCode) ?? [];
    type Lang = 'ru' | 'en' | 'uz';

    const currentLang = (i18n.language.split('-')[0] as Lang) || 'en';

    if (!id) {
        throw new Error("Company ID is required but not found in route params");
    }

    useEffect(() => {
        dispatch(fetchReferencesByType("countryCode"));
    }, [dispatch]);

    const [form] = Form.useForm()

    useEffect(() => {
        dispatch(fetchReferencesByType("productGroup"));
    }, [dispatch]);

    useEffect(() => {
        if (productById) {
            form.setFieldsValue({
            name: productById.name,
            shortName: productById.shortName,
            description: productById.description,
            gtin: productById.gtin,
            icps: productById.icps,
            productType: productById.productGroup,
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

    const handleUpdateProduct = async (values: UpdateProductDto) => {
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
        <RequiredDataAlert
            endpoints={[
                endpointAccessMap.productsRead,
                endpointAccessMap.referencesRead,
            ]}
            errors={[productError, referencesError]}
        />
        <FormComponent
            form={form}
            onFinish={(values) => {
                handleUpdateProduct(values);
            }}
        >
            <Heading title={t('products.edit')} subtitle={t('users.subtitle')}>
                <FormActions>
                    <CustomButton type="submit" disabled={requiredDataUnavailable}>{t('btn.save')} </CustomButton>
                   <CustomButton onClick={() => navigateBack(`/organization/${id}/products`)}>{t('btn.back')}</CustomButton>
                </FormActions>
            </Heading>
            <div className="box">
                <div className="box-container">
                    {productById && (
                        <FormGrid>
                            <FormRow>
                                <TextField name="name" label={t('products.addProductForm.label.name')} initialValue={productById.name} rules={[ { required: true, message: t('products.validation.required') }, { min: 2, message: t('products.validation.min2') }, ]} placeholder={t('products.addProductForm.placeholder.name')} />
                                <TextField name="shortName" label={t('products.addProductForm.label.shortName')} initialValue={productById.shortName} rules={[ { required: true, message: t('products.validation.required') }, ]} placeholder={t('products.addProductForm.placeholder.shortName')} />
                            </FormRow>
                            <FormRow>
                                <SelectField
                                    name="manufacturerCountry"
                                    label={t('products.addProductForm.label.manufacturerCountry')}
                                    initialValue={productById.manufacturerCountry}
                                    rules={[
                                        { required: true, message: t('products.addProductForm.validation.required.manufacturerCountry') },
                                    ]}
                                    showSearch
                                    allowClear
                                    placeholder={t('products.addProductForm.placeholder.manufacturerCountry')}
                                    optionFilterProp="label"
                                    filterOption={(input, option) =>
                                        (option?.label ?? '').toString().toLowerCase().includes(input.toLowerCase())
                                    }
                                    options={countryReferences.map(ref => ({
                                        label: ref.title?.[currentLang] ?? ref.title?.ru ?? ref.title?.en ?? ref.alias,
                                        value: ref.alias,
                                    }))}
                                />

                                <TextField name="expiration" label={t('products.addProductForm.label.expiration')} initialValue={productById.expiration} rules={[ { required: true, message: t('products.addProductForm.validation.required.expiration') }, { pattern: /^\d+$/, message: t('products.validation.number') }, ]} type="number" placeholder={t('products.addProductForm.placeholder.expiration')} />
                            </FormRow>
                            <FormRow>
                                <TextAreaField name="description" label={t('products.addProductForm.label.description')} initialValue={productById.description} rules={[{ max: 200, message: t('products.validation.max200') }]} placeholder={t('products.addProductForm.placeholder.description')} />
                            </FormRow>
                            <FormRow>
                                <TextField name={['gtin', 'unit']} label={t('products.gtin.unit')} initialValue={productById.gtin.unit} rules={[ { required: true, message: t('products.addProductForm.validation.required.gtin') }, { pattern: /^\d{14}$/, message: t('products.addProductForm.validation.pattern.gtin') }, ]} placeholder={t('products.addProductForm.placeholder.icps')} />
                                <TextField name={['gtin', 'group']} label={t('products.gtin.group')} initialValue={productById.gtin.group} rules={[ { required: false}, { pattern: /^\d{14}$/, message: t('products.addProductForm.validation.pattern.gtin') }, ]} placeholder={t('products.addProductForm.placeholder.gtin')} />
                            </FormRow>
                            <FormRow>
                                <TextField name={['gtin', 'box_lv_1']} label={t('products.gtin.box_lv_1')} initialValue={productById.gtin.box_lv_1} rules={[ { required: false}, { pattern: /^\d{14}$/, message: t('products.addProductForm.validation.pattern.gtin') }, ]} placeholder={t('products.addProductForm.placeholder.gtin')} />
                                <TextField name={['gtin', 'box_lv_2']} label={t('products.gtin.box_lv_2')} initialValue={productById.gtin.box_lv_2} rules={[ { required: false}, { pattern: /^\d{14}$/, message: t('products.addProductForm.validation.pattern.gtin') }, ]} placeholder={t('products.addProductForm.placeholder.gtin')} />
                            </FormRow>
                            <FormRow>
                                <TextField name="icps" label={t('products.addProductForm.label.icps')} initialValue={productById.icps} rules={[ { required: true, message: t('products.validation.required') }, { pattern: /^\d{14}$/, message: t('products.validation.icps') }, ]} placeholder={t('products.addProductForm.placeholder.icps')} />
                                <SelectField
                                    name="productType"
                                    label={t('products.addProductForm.label.productType')}
                                    initialValue={productById.productGroup}
                                    rules={[
                                        { required: true, message: t('products.addProductForm.validation.required.productType') }
                                    ]}
                                    key={currentLang}
                                    placeholder={t('products.addProductForm.placeholder.productType')}
                                    options={productGroupReferences.map(ref => ({
                                        label: ref.title?.[currentLang as Lang] ?? ref.title?.ru ?? ref.title?.en ?? ref.alias,
                                        value: ref.alias,
                                    }))}
                                />
                            </FormRow>
                            <FormRow>
                                {/* <TextField name="expiration" label={t('products.addProductForm.label.expiration')} initialValue={productById.expiration} rules={[ { required: true, message: t('products.validation.required') }, { pattern: /^\d+$/, message: t('products.validation.number') }, ]} placeholder={t('products.addProductForm.placeholder.expiration')} /> */}
                                <TextField name="aggregationQuantity" label={t('products.addProductForm.label.aggregationQuantity')} initialValue={productById.aggregationQuantity} rules={[ { required: true, message: t('products.addProductForm.validation.required.aggregationQuantity') }, { pattern: /^\d+$/, message: t('products.validation.number') }, ]} placeholder={t('products.addProductForm.placeholder.aggregationQuantity')} />
                                <TextField name={['measurement', 'unit']} label={t('products.addProductForm.label.unit')} initialValue={productById.measurement.unit} rules={[ { required: true, message: t('products.addProductForm.validation.required.measurementUnit') }, { max: 10, message: t('products.validation.max10') }, ]} placeholder={t('products.addProductForm.placeholder.unit')} />

                            </FormRow>
                            <FormRow>
                                <TextField name={['measurement', 'amount']} label={t('products.addProductForm.label.amount')} initialValue={productById.measurement.amount} rules={[ { required: true, message: t('products.validation.required') }, { pattern: /^\d+(\.\d+)?$/, message: t('products.validation.decimal') }, ]} placeholder={t('products.addProductForm.placeholder.amount')} />
                                <TextField name={['weight', 'net']} label={t('products.addProductForm.label.net')} initialValue={productById.weight.net} rules={[ { required: true, message: t('products.validation.required') }, { pattern: /^\d+(\.\d+)?$/, message: t('products.validation.decimal') }, ]} placeholder={t('products.addProductForm.placeholder.net')} />
                            </FormRow>
                            <FormRow>
                                <TextField name={['weight', 'gross']} label={t('products.addProductForm.label.gross')} initialValue={productById.weight.gross} rules={[ { required: true, message: t('products.validation.required') }, { pattern: /^\d+(\.\d+)?$/, message: t('products.validation.decimal') }, ]} placeholder={t('products.addProductForm.placeholder.gross')} />
                                <TextField name='price' label={t('products.addProductForm.label.price')} initialValue={productById.price} rules={[ { required: true, message: t('products.validation.required') }, { pattern: /^\d+(\.\d{1,2})?$/, message: t('products.validation.price') }, ]} placeholder={t('products.addProductForm.placeholder.price')} />
                            </FormRow>
                            <FormActions>
                                <CustomButton variant="outline" type="submit" disabled={requiredDataUnavailable}>{t('btn.save')} </CustomButton>
                            </FormActions>
                        </FormGrid>
                    )}
                </div>
            </div>
        </FormComponent>
    </MainLayout>
  )
}

export default ProductsEdit


