import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "app/store";
import {useEffect} from "react";
import { getOrganizationById, updateOrganization } from "entities/organization/model";
import type { UpdateCompanyDto } from "entities/organization/dtos";
import { toast } from "react-toastify";
import MainLayout from "shared/ui/layout";
import Heading from "shared/ui/mainHeading";
import CustomButton from "shared/ui/button";
import FormComponent from "shared/ui/formComponent";
import { FormActions, FormGrid, FormRow, TextField } from "shared/ui/form";
import {Form} from "antd";
import {useNavigationBack} from "shared/lib";

const OrganizationsEdit = () => {
    const { t } = useTranslation();
    const navigateBack = useNavigationBack();
    const dispatch = useAppDispatch()
    const { id } = useParams<{ id: string }>();
    const organizationById = useAppSelector((state) => state.organizations.organizationById)
    const [form] = Form.useForm()
    // const productGroupReferences = useAppSelector(
    //     (state) => state.references.references.productGroup
    // ) ?? [];

    useEffect(() => {
        if (organizationById) {
            form.setFieldsValue({
                displayName: organizationById.displayName,

                tin: organizationById.tin,

                legalName: organizationById.legalName,

                director: organizationById.responsibleEmployees.director?.name
                    ? [
                        organizationById.responsibleEmployees.director.name.last,
                        organizationById.responsibleEmployees.director.name.first,
                        organizationById.responsibleEmployees.director.name.middle,
                    ].filter(Boolean).join(" ")
                    : undefined,

                address: {
                    region: organizationById.address?.region,
                    district: organizationById.address?.district,
                    address: organizationById.address?.address,
                },

                bankDetails: {
                    bankName: organizationById.bankDetails?.bankName,
                    ccea: organizationById.bankDetails?.ccea,
                    account: organizationById.bankDetails?.account,
                    mfo: organizationById.bankDetails?.mfo,
                },

                contacts: {
                    phone: organizationById.contacts?.phone,
                    email: organizationById.contacts?.email,
                    url: organizationById.contacts?.url,
                    person: organizationById.contacts?.person,
                },

                status: organizationById.status,
                isTest: organizationById.isTest,
            })
        }
    }, [organizationById, form])

    useEffect(() => {
        if (id){
            dispatch(getOrganizationById({id: id}))
        }
    }, [dispatch, id])

    const directorName = organizationById?.responsibleEmployees.director?.name
        ? [
            organizationById.responsibleEmployees.director.name.last,
            organizationById.responsibleEmployees.director.name.first,
            organizationById.responsibleEmployees.director.name.middle,
        ].filter(Boolean).join(" ")
        : "";


    const handleUpdateOrganization = async (values: UpdateCompanyDto) => {
        if (!id) return;

        try {
            const resultAction = await dispatch(
             updateOrganization({ id: id, data: values })
            );

            if (updateOrganization.fulfilled.match(resultAction)) {
                toast.success(t('organizations.messages.success.updateUser'));
                    await dispatch(getOrganizationById({ id: id }));
                } else {
                toast.error(t('organizations.messages.error.updateUser'));
            }
        } catch (err) {
            toast.error((err as string) || t('organizations.messages.error.updateUser'));
        }
    };

    // const referencesProductGroups = useMemo(() => {
    //     return productGroupReferences.reduce((acc, item) => {
    //         acc[item.alias] = item.title[lang] ?? ""; // title is MultiLanguage, pick current lang
    //         return acc;
    //     }, {} as Record<string, string>);
    // }, [productGroupReferences, lang]);

  return (
    <MainLayout>
        <FormComponent
            form={form}
            onFinish={(values) => {
                handleUpdateOrganization(values);
            }}
        >
        <Heading title={organizationById?.displayName ?? ''} isTest={organizationById?.isTest} subtitle={t('organizations.subtitle')}>
            <FormActions>
                <CustomButton type="submit">{t('btn.save')} </CustomButton>
                <CustomButton onClick={() => navigateBack('/organization')}>{t('btn.back')}</CustomButton>
            </FormActions>
        </Heading>
        <div className="box">
            <div className="box-container">
                {organizationById  && (
                    <FormGrid>
                        <FormRow>
                            <TextField name="displayName" label={t('organizations.addUserForm.label.displayName')} initialValue={organizationById.displayName} placeholder={t('organizations.addUserForm.placeholder.displayName')} />
                        </FormRow>
                        <FormRow>
                            <TextField name="director" label={t('organizations.addUserForm.label.director')} initialValue={directorName} placeholder={t('organizations.addUserForm.placeholder.director')} />
                        </FormRow>
                        <div className="form-divider-title">
                            <h4 className="title">{t('organizations.subtitles.address')} </h4>
                        </div>
                        <FormRow>
                            <TextField name={['address', 'region']} label={t('organizations.addUserForm.label.region')} initialValue={organizationById.address.region} placeholder={t('organizations.addUserForm.placeholder.region')} />
                            <TextField name={['address', 'district']} label={t('organizations.addUserForm.label.district')} initialValue={organizationById.address.district} placeholder={t('organizations.addUserForm.placeholder.district')} />
                        </FormRow>
                        <FormRow>
                            <TextField name={['address', 'address']} label={t('organizations.addUserForm.label.address')} initialValue={organizationById.address.address} placeholder={t('organizations.addUserForm.placeholder.address')} />
                        </FormRow>
                        <div className="form-divider-title">
                            <h4 className="title">{t('organizations.subtitles.bankDetails')}</h4>
                        </div>
                        <FormRow>
                            <TextField name={['bankDetails', 'bankName']} label={t('organizations.addUserForm.label.bankName')} initialValue={organizationById?.bankDetails?.bankName} placeholder={t('organizations.addUserForm.placeholder.bankName')} />
                            <TextField name={['bankDetails', 'ccea']} label={t('organizations.addUserForm.label.ccea')} initialValue={organizationById?.bankDetails?.ccea} placeholder={t('organizations.addUserForm.placeholder.ccea')} />
                        </FormRow>
                        <FormRow>
                            <TextField name={['bankDetails', 'account']} label={t('organizations.addUserForm.label.account')} initialValue={organizationById?.bankDetails?.account} placeholder={t('organizations.addUserForm.placeholder.account')} />
                            <TextField name={['bankDetails', 'mfo']} label={t('organizations.addUserForm.label.mfo')} initialValue={organizationById?.bankDetails?.mfo} placeholder={t('organizations.addUserForm.placeholder.mfo')} />
                        </FormRow>
                        <div className="form-divider-title">
                            <h4 className="title">{t('organizations.subtitles.contactDetails')} </h4>
                        </div>
                        <FormRow>
                            <TextField name={['contacts', 'phone']} label={t('organizations.addUserForm.label.phone')}initialValue={organizationById.contacts.phone} placeholder={t('organizations.addUserForm.placeholder.phone')} />
                            <TextField name={['contacts', 'email']} label={t('organizations.addUserForm.label.email')} initialValue={organizationById.contacts.email} placeholder={t('organizations.addUserForm.placeholder.email')} />
                        </FormRow>
                        <FormRow>
                            <TextField name={['contacts', 'url']} label={t('organizations.addUserForm.label.url')} initialValue={organizationById.contacts.url} placeholder={t('organizations.addUserForm.placeholder.url')} />
                            <TextField name={['contacts', 'person']} label={t('organizations.addUserForm.label.person')} initialValue={organizationById.contacts.person} placeholder={t('organizations.addUserForm.placeholder.person')} />
                        </FormRow>
                        <FormActions>
                            <CustomButton variant="outline" type="submit">{t('btn.save')} </CustomButton>
                        </FormActions>
                    </FormGrid>
                )}
            </div>
        </div>
        </FormComponent>
    </MainLayout>
  )
}

export default OrganizationsEdit


