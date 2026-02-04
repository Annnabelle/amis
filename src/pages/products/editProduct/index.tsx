import {Form, Input, Select} from 'antd'
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from 'app/store';
import { useEffect } from 'react';
import { getProductById, updateProduct } from 'entities/products/model';
import { toast } from 'react-toastify';
import MainLayout from 'shared/ui/layout';
import Heading from 'shared/ui/mainHeading';
import CustomButton from 'shared/ui/button';
import { useNavigationBack } from 'shared/lib';
import FormComponent from 'shared/ui/formComponent';
import TextArea from "antd/es/input/TextArea";
import {fetchReferencesByType} from "entities/references/model";

const ProductsEdit = () => {
    const { id } = useParams<{ id: string }>();
    const { t, i18n } = useTranslation();
    const dispatch = useAppDispatch()
    const productById = useAppSelector((state) => state.products.productById)
    const navigateBack = useNavigationBack();
    const productGroupReferences =
        useAppSelector(state => state.references.references.productGroup) ?? [];
    const countryReferences =
        useAppSelector(state => state.references.references.countryCode) ?? [];
    const supportedLangs = ['ru', 'en', 'uz'] as const;

    type Lang = typeof supportedLangs[number];

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
        <FormComponent
            form={form}
            onFinish={(values) => {
                handleUpdateProduct(values);
            }}
        >
            <Heading title={t('products.edit')} subtitle={t('users.subtitle')}>
                <div className="btns-group">
                    <CustomButton type="submit">{t('btn.save')} </CustomButton>
                   <CustomButton onClick={() => navigateBack(`/organization/${id}/products`)}>{t('btn.back')}</CustomButton>
                </div>
            </Heading>
            <div className="box">
                <div className="box-container">
                    {productById && (
                        <>
                            <div className="form-inputs  form-inputs-row">
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
                            <div className="form-inputs form-inputs-row">
                                <Form.Item
                                    className="input"
                                    name="manufacturerCountry"
                                    label={t('products.addProductForm.label.manufacturerCountry')}
                                    initialValue={productById.manufacturerCountry}
                                    rules={[
                                        { required: true, message: t('products.addProductForm.validation.required.manufacturerCountry') },
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
                                            (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                                        }
                                        options={countryReferences.map(ref => ({
                                            label: ref.title?.[currentLang] ?? ref.title?.ru ?? ref.title?.en ?? ref.alias,
                                            value: ref.alias,
                                        }))}
                                    />
                                </Form.Item>

                                <Form.Item
                                    className="input"
                                    name="expiration"
                                    label={t('products.addProductForm.label.expiration')}
                                    initialValue={productById.expiration}
                                    rules={[
                                        { required: true, message: t('products.addProductForm.validation.required.expiration') },
                                        { pattern: /^\d+$/, message: t('products.validation.number') },
                                    ]}
                                >
                                    <Input
                                        type="number"
                                        className="input"
                                        size="large"
                                        placeholder={t('products.addProductForm.placeholder.expiration')}
                                    />
                                </Form.Item>
                            </div>
                            <div className="form-inputs  form-inputs-row">
                                <Form.Item className="input" name="description" label={t('products.addProductForm.label.description')}
                                    initialValue={productById.description}
                                    rules={[{ max: 200, message: t('products.validation.max200') }]}
                                >
                                    <TextArea className="input" size="large" placeholder={t('products.addProductForm.placeholder.description')} />
                                </Form.Item>
                            </div>
                            <div className="form-inputs  form-inputs-row">
                                <Form.Item className="input" name={['gtin', 'unit']} label={t('products.gtin.unit')}
                                           initialValue={productById.gtin.unit}
                                           rules={[
                                               { required: true, message: t('products.addProductForm.validation.required.gtin') },
                                               { pattern: /^\d{14}$/, message: t('products.addProductForm.validation.pattern.gtin') },
                                           ]}
                                >
                                    <Input className="input" size="large" placeholder={t('products.addProductForm.placeholder.icps')} />
                                </Form.Item>
                                <Form.Item className="input" name={['gtin', 'group']} label={t('products.gtin.group')}
                                           initialValue={productById.gtin.group}
                                           rules={[
                                               { required: false},
                                               { pattern: /^\d{14}$/, message: t('products.addProductForm.validation.pattern.gtin') },
                                           ]}
                                >
                                    <Input className="input" size="large" placeholder={t('products.addProductForm.placeholder.gtin')}/>
                                </Form.Item>
                            </div>
                            <div className="form-inputs  form-inputs-row">
                                <Form.Item className="input" name={['gtin', 'box_lv_1']} label={t('products.gtin.box_lv_1')}
                                           initialValue={productById.gtin.box_lv_1}
                                           rules={[
                                               { required: false},
                                               { pattern: /^\d{14}$/, message: t('products.addProductForm.validation.pattern.gtin') },
                                           ]}
                                >
                                    <Input className="input" size="large" placeholder={t('products.addProductForm.placeholder.gtin')} />
                                </Form.Item>
                                <Form.Item className="input" name={['gtin', 'box_lv_2']} label={t('products.gtin.box_lv_2')}
                                           initialValue={productById.gtin.box_lv_2}
                                           rules={[
                                               { required: false},
                                               { pattern: /^\d{14}$/, message: t('products.addProductForm.validation.pattern.gtin') },
                                           ]}
                                >
                                    <Input className="input" size="large" placeholder={t('products.addProductForm.placeholder.gtin')} />
                                </Form.Item>
                            </div>
                            <div className="form-inputs  form-inputs-row">
                                <Form.Item className="input" name="icps" label={t('products.addProductForm.label.icps')}
                                           initialValue={productById.icps}
                                           rules={[
                                               { required: true, message: t('products.validation.required') },
                                               { pattern: /^\d{14}$/, message: t('products.validation.icps') },
                                           ]}
                                >
                                    <Input className="input" size="large" placeholder={t('products.addProductForm.placeholder.icps')} />
                                </Form.Item>
                                <Form.Item
                                    className="input"
                                    name="productType"
                                    label={t('products.addProductForm.label.productType')}
                                    initialValue={productById.productType}
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
                            <div className="form-inputs  form-inputs-row">
                                {/* <Form.Item className="input" name="expiration" label={t('products.addProductForm.label.expiration')}
                                    initialValue={productById.expiration}
                                    rules={[
                                        { required: true, message: t('products.validation.required') },
                                        { pattern: /^\d+$/, message: t('products.validation.number') },
                                    ]}
                                >
                                    <Input className="input" size="large" placeholder={t('products.addProductForm.placeholder.expiration')} />
                                </Form.Item> */}
                                <Form.Item className="input" name="aggregationQuantity" label={t('products.addProductForm.label.aggregationQuantity')}
                                           initialValue={productById.aggregationQuantity}
                                           rules={[
                                               { required: true, message: t('products.addProductForm.validation.required.aggregationQuantity') },
                                               { pattern: /^\d+$/, message: t('products.validation.number') },
                                           ]}
                                >
                                    <Input className="input" size="large" placeholder={t('products.addProductForm.placeholder.aggregationQuantity')} />
                                </Form.Item>
                                <Form.Item className="input" name={['measurement', 'unit']} label={t('products.addProductForm.label.unit')}
                                    initialValue={productById.measurement.unit}
                                    rules={[
                                        { required: true, message: t('products.addProductForm.validation.required.aggregationQuantity') },
                                        { max: 10, message: t('products.validation.max10') },
                                    ]}
                                >
                                    <Input className="input" size="large" placeholder={t('products.addProductForm.placeholder.unit')}   />
                                </Form.Item>

                            </div>
                            <div className="form-inputs  form-inputs-row">
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
                            <div className="form-inputs  form-inputs-row">
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
                            <CustomButton className="outline" type="submit">{t('btn.save')} </CustomButton>
                        </>
                    )}
                </div>
            </div>
        </FormComponent>
    </MainLayout>
  )
}

export default ProductsEdit


