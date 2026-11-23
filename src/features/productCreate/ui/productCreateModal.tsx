import { useRef } from "react";
import { useTranslation } from "react-i18next";
import type { FormInstance } from "antd";

import { RequiredDataAlert } from "entities/access/ui";
import type { Reference } from "entities/references/types";
import type { CreateProduct } from "entities/products/types";
import { endpointAccessMap } from "shared/config/endpointAccessMap";
import CustomButton from "shared/ui/button";
import FormComponent from "shared/ui/formComponent";
import ModalWindow from "shared/ui/modalWindow";
import {
  FormActions,
  FormGrid,
  FormRow,
  SelectField,
  TextAreaField,
  TextField,
} from "shared/ui/form";

type ProductCreateModalProps = {
  form: FormInstance<CreateProduct>;
  open: boolean;
  onClose: () => void;
  onSubmit: (values: CreateProduct) => void;
  isCreating: boolean;
  productGroups: Reference[];
  countries: Reference[];
  /** Язык подписей справочников. */
  language: string;
  getTitle: (title: Reference["title"] | undefined, fallback?: string) => string;
  /** Справочники и карточка компании грузятся: без них форму не заполнить. */
  isReferencesLoading: boolean;
  referencesError?: string | null;
  companyError?: string | null;
};

/** Заведение товара: названия, товарная группа и параметры упаковки. */
const ProductCreateModal = ({
  form,
  open,
  onClose,
  onSubmit: submitRegisterProduct,
  isCreating: isCreatingProduct,
  productGroups: companyProductGroups,
  countries: countryReferences,
  language: currentLang,
  getTitle,
  isReferencesLoading,
  referencesError,
  companyError,
}: ProductCreateModalProps) => {
  const { t } = useTranslation();
  /** Короткое имя повторяет полное, пока его не правили руками. */
  const shortNameEdited = useRef(false);

  return (
    <ModalWindow
        titleAction={t('products.modalWindow.adding')}
        title={t('products.modalWindow.product')}
        openModal={open}
        closeModal={onClose}
        className="modal-large"
        >
        <RequiredDataAlert
            endpoints={[
                endpointAccessMap.companiesRead,
                endpointAccessMap.referencesRead,
            ]}
            errors={[companyError, referencesError]}
        />
        <FormComponent onFinish={submitRegisterProduct}
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
            <FormGrid>
            <FormRow>
                <TextField name="name" label={t('products.addProductForm.label.name')} rules={[ { required: true, message: t('products.addProductForm.validation.required.name') }, ]} placeholder={t('products.addProductForm.placeholder.name')} />

                <TextField name="shortName" label={t('products.addProductForm.label.shortName')} rules={[ { required: true, message: t('products.addProductForm.validation.required.shortName') }, ]} placeholder={t('products.addProductForm.placeholder.shortName')} />
            </FormRow>
            <FormRow>
                <SelectField
                    name="manufacturerCountry"
                    label={t('products.addProductForm.label.manufacturerCountry')}
                    rules={[
                        {
                            required: true,
                            message: t('products.addProductForm.validation.required.manufacturerCountry'),
                        },
                    ]}
                    showSearch
                    allowClear
                    placeholder={t('products.addProductForm.placeholder.manufacturerCountry')}
                    optionFilterProp="label"
                    filterOption={(input, option) =>
                        (option?.label ?? '')
                            .toString()
                            .toLowerCase()
                            .includes(input.toLowerCase())
                    }
                    options={countryReferences.map(ref => ({
                        label: getTitle(ref.title, ref.alias),
                        value: ref.alias,
                    }))}
                />

                <TextField name="expiration" label={t('products.addProductForm.label.expiration')} rules={[ { required: true, message: t('products.addProductForm.validation.required.expiration'), }, ]} placeholder={t('products.addProductForm.placeholder.expiration')} />
            </FormRow>
            <FormRow>
                <TextAreaField name="description" label={t('products.addProductForm.label.description')} placeholder={t('products.addProductForm.placeholder.description')} />
            </FormRow>

            <FormRow>
                <TextField name={['gtin', 'unit']} label={t('products.gtin.unit')} rules={[ { required: true, message: t('products.addProductForm.validation.required.gtin') }, { pattern: /^\d{14}$/, message: t('products.addProductForm.validation.pattern.gtin') }, ]} placeholder={t('products.addProductForm.placeholder.gtin')} />
                <TextField name={['gtin', 'group']} label={t('products.gtin.group')} rules={[ { required: false}, { pattern: /^\d{14}$/, message: t('products.addProductForm.validation.pattern.gtin') }, ]} placeholder={t('products.addProductForm.placeholder.gtin')} />
            </FormRow>

            <FormRow>
                <TextField name={['gtin', 'box_lv_1']} label={t('products.gtin.box_lv_1')} rules={[ { required: false}, { pattern: /^\d{14}$/, message: t('products.addProductForm.validation.pattern.gtin') }, ]} placeholder={t('products.addProductForm.placeholder.gtin')} />
                <TextField name={['gtin', 'box_lv_2']} label={t('products.gtin.box_lv_2')} rules={[ { required: false}, { pattern: /^\d{14}$/, message: t('products.addProductForm.validation.pattern.gtin') }, ]} placeholder={t('products.addProductForm.placeholder.gtin')} />
            </FormRow>

            <FormRow>
                <TextField name="icps" label={t('products.addProductForm.label.icps')} placeholder={t('products.addProductForm.placeholder.icps')} />
                <SelectField
                    name="productGroup"
                    label={t('products.addProductForm.label.productType')}
                    rules={[
                        { required: true, message: t('products.addProductForm.validation.required.productType') }
                    ]}
                    key={currentLang}
                    placeholder={t('products.addProductForm.placeholder.productType')}
                    options={companyProductGroups.map(ref => ({
                        label: getTitle(ref.title, ref.alias),
                        value: ref.alias,
                    }))}
                />

                {/*<Form.Item*/}
                {/*    className="input"*/}
                {/*    name="productType"*/}
                {/*    label={t('products.addProductForm.label.productType')}*/}
                {/*    rules={[*/}
                {/*        { required: true, message: t('products.addProductForm.validation.required.productType') }*/}
                {/*    ]}*/}
                {/*>*/}
                {/*    <Select*/}
                {/*        key={currentLang} // перерендер при смене языка*/}
                {/*        className="input"*/}
                {/*        size="large"*/}
                {/*        placeholder={t('products.addProductForm.placeholder.productType')}*/}
                {/*        options={productGroupReferences.map(ref => ({*/}
                {/*            label: ref.title?.[currentLang as Lang] ?? ref.title?.ru ?? ref.title?.en ?? ref.alias,*/}
                {/*            value: ref.alias,*/}
                {/*        }))}*/}
                {/*    />*/}
                {/*</Form.Item>*/}

            </FormRow>

            <FormRow>
                {/* <TextField name="expiration" label={t('products.addProductForm.label.expiration')} rules={[ { required: true, message: t('products.addProductForm.validation.required.expiration') }, { pattern: /^\d+$/, message: t('products.addProductForm.validation.pattern.expiration') }, ]} placeholder={t('products.addProductForm.placeholder.expiration')} /> */}
                <TextField name="aggregationQuantity" label={t('products.addProductForm.label.aggregationQuantity')} rules={[ { required: true, message: t('products.addProductForm.validation.required.aggregationQuantity') }, { pattern: /^\d+$/, message: t('products.addProductForm.validation.pattern.aggregationQuantity') }, ]} placeholder={t('products.addProductForm.placeholder.aggregationQuantity')} />

                <TextField name={['measurement', 'unit']} label={t('products.addProductForm.label.unit')} rules={[ { required: false, message: t('products.addProductForm.validation.required.measurementUnit') }, { max: 10, message: t('products.addProductForm.validation.pattern.measurementUnit') }, ]} placeholder={t('products.addProductForm.placeholder.unit')} />

            </FormRow>

            <FormRow>
                <TextField name={['measurement', 'amount']} label={t('products.addProductForm.label.amount')} rules={[ { required: false, message: t('products.addProductForm.validation.required.requiredField') }, { pattern: /^\d+(\.\d+)?$/, message: t('products.validation.decimal') }, ]} placeholder={t('products.addProductForm.placeholder.amount')} />

                <TextField name={['weight', 'net']} label={t('products.addProductForm.label.net')} rules={[ { required: false, message: t('products.addProductForm.validation.required.requiredField') }, { pattern: /^\d+(\.\d+)?$/, message: t('products.validation.decimal') }, ]} placeholder={t('products.addProductForm.placeholder.net')} />
            </FormRow>

            <FormRow>
                <TextField name={['weight', 'gross']} label={t('products.addProductForm.label.gross')} rules={[ { required: false, message: t('products.addProductForm.validation.required.measurementAmount') }, { pattern: /^\d+(\.\d+)?$/, message: t('products.addProductForm.validation.pattern.measurementAmount') }, ]} placeholder={t('products.addProductForm.placeholder.gross')} />

                <TextField name="price" label={t('products.addProductForm.label.price')} rules={[ { required: false, message: t('products.addProductForm.validation.required.weightNet') }, { pattern: /^\d+(\.\d{1,2})?$/, message: t('products.addProductForm.validation.pattern.weightNet') }, ]} placeholder={t('products.addProductForm.placeholder.price')} />
            </FormRow>

            <FormActions>
                <CustomButton
                    type="submit"
                    loading={isCreatingProduct}
                    disabled={
                        isReferencesLoading ||
                        Boolean(companyError) ||
                        Boolean(referencesError)
                    }
                >
                    {t('btn.create')}
                </CustomButton>
            </FormActions>
            </FormGrid>
        </FormComponent>
    </ModalWindow>
  );
};

export default ProductCreateModal;
