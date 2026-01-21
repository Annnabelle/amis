import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../store";
import {useEffect} from "react";
import { getOrganizationById, updateOrganization } from "../../../store/organization";
import { toast } from "react-toastify";
import MainLayout from "../../../components/layout";
import Heading from "../../../components/mainHeading";
import CustomButton from "../../../components/button";
import FormComponent from "../../../components/formComponent";
import {Form, Input} from "antd";
import {type LanguageKey, useNavigationBack} from "../../../utils/utils";
import {fetchReferencesByType} from "../../../store/references";

const OrganizationsEdit = () => {
    const { t, i18n } = useTranslation();
    const navigateBack = useNavigationBack();
    const dispatch = useAppDispatch()
    const { id } = useParams<{ id: string }>();
    const organizationById = useAppSelector((state) => state.organizations.organizationById)
    const [form] = Form.useForm()
    const lang = i18n.language as LanguageKey;
    // const productGroupReferences = useAppSelector(
    //     (state) => state.references.references.productGroup
    // ) ?? [];

    useEffect(() => {
        dispatch(fetchReferencesByType("productGroup"));
    }, [dispatch]);

    useEffect(() => {
        if (organizationById) {
            form.setFieldsValue({
                displayName: organizationById.displayName,

                productGroups: organizationById.productGroups,

                tin: organizationById.tin,

                legalName: organizationById.legalName[lang],

                director: organizationById.director,

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

                accessCodes: {
                    gcpCode: organizationById.accessCodes?.gcpCode,
                    xTrace: {
                        token: organizationById.accessCodes?.xTrace?.token,
                        expireDate: organizationById.accessCodes?.xTrace?.expireDate
                            ? new Date(organizationById.accessCodes.xTrace.expireDate)
                            : undefined,
                        id: organizationById.accessCodes?.xTrace?.id,
                    },
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


    const handleUpdateOrganization = async (values: any) => {
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
            <div className="btns-group">
                <CustomButton type="submit">{t('btn.save')} </CustomButton>
                <CustomButton onClick={() => navigateBack('/organization')}>{t('btn.back')}</CustomButton>
            </div>
        </Heading>
        <div className="box">
            <div className="box-container">
                {organizationById  && (
                    <>
                        <div className="form-inputs form-inputs-row">
                            <Form.Item className="input" name="displayName" label={t('organizations.addUserForm.label.displayName')} initialValue={organizationById.displayName}>
                                <Input className="input" size="large" placeholder={t('organizations.addUserForm.placeholder.displayName')}  />
                            </Form.Item>
                        </div>
                        <div className="form-inputs form-inputs-row">
                            {/*<Form.Item className="input"  name="tin" label={t('organizations.addUserForm.label.tin')} initialValue={organizationById.tin}>*/}
                            {/*    <Input className="input" size="large" placeholder={t('organizations.addUserForm.placeholder.tin')}  />*/}
                            {/*</Form.Item>*/}
                            {/*<Form.Item className="input" name="legalName" label={t('organizations.addUserForm.label.legalName')} initialValue={organizationById.legalName}>*/}
                            {/*    <Input className="input" size="large" placeholder={t('organizations.addUserForm.placeholder.legalName')}  />*/}
                            {/*</Form.Item>*/}
                        </div>
                        <div className="form-inputs form-inputs-row">
                            <Form.Item className="input" name="director" label={t('organizations.addUserForm.label.director')} initialValue={organizationById.director}>
                                <Input className="input" size="large" placeholder={t('organizations.addUserForm.placeholder.director')}  />
                            </Form.Item>
                        </div>
                        <div className="form-divider-title">
                            <h4 className="title">{t('organizations.subtitles.address')} </h4>
                        </div>
                        <div className="form-inputs form-inputs-row">
                            <Form.Item className="input" name={['address', 'region']} label={t('organizations.addUserForm.label.region')} initialValue={organizationById.address.region}>
                                <Input className="input" size="large" placeholder={t('organizations.addUserForm.placeholder.region')} />
                            </Form.Item>
                            <Form.Item className="input" name={['address', 'district']} label={t('organizations.addUserForm.label.district')} initialValue={organizationById.address.district}>
                                <Input className="input" size="large"  placeholder={t('organizations.addUserForm.placeholder.district')}  />
                            </Form.Item>
                        </div>
                        <div className="form-inputs form-inputs-row">
                            <Form.Item className="input" name={['address', 'address']} label={t('organizations.addUserForm.label.address')} initialValue={organizationById.address.address}>
                                <Input className="input" size="large"  placeholder={t('organizations.addUserForm.placeholder.address')}  />
                            </Form.Item>
                        </div>
                        <div className="form-divider-title">
                            <h4 className="title">{t('organizations.subtitles.bankDetails')}</h4>
                        </div>
                        <div className="form-inputs form-inputs-row">
                            <Form.Item className="input" name={['bankDetails', 'bankName']} label={t('organizations.addUserForm.label.bankName')} initialValue={organizationById?.bankDetails?.bankName}>
                                <Input className="input" size="large" placeholder={t('organizations.addUserForm.placeholder.bankName')}  />
                            </Form.Item>
                            <Form.Item className="input" name={['bankDetails', 'ccea']} label={t('organizations.addUserForm.label.ccea')} initialValue={organizationById?.bankDetails?.ccea}>
                                <Input className="input" size="large" placeholder={t('organizations.addUserForm.placeholder.ccea')}  />
                            </Form.Item>
                        </div>
                        <div className="form-inputs form-inputs-row">
                            <Form.Item className="input" name={['bankDetails', 'account']} label={t('organizations.addUserForm.label.account')} initialValue={organizationById?.bankDetails?.account}>
                                <Input className="input" size="large" placeholder={t('organizations.addUserForm.placeholder.account')}   />
                            </Form.Item>
                            <Form.Item className="input" name={['bankDetails', 'mfo']} label={t('organizations.addUserForm.label.mfo')} initialValue={organizationById?.bankDetails?.mfo}>
                                <Input className="input" size="large" placeholder={t('organizations.addUserForm.placeholder.mfo')} />
                            </Form.Item>
                        </div>
                        <div className="form-divider-title">
                            <h4 className="title">{t('organizations.subtitles.contactDetails')} </h4>
                        </div>
                        <div className="form-inputs form-inputs-row">
                            <Form.Item className="input" name={['contacts', 'phone']} label={t('organizations.addUserForm.label.phone')}initialValue={organizationById.contacts.phone}>
                                <Input className="input" size="large" placeholder={t('organizations.addUserForm.placeholder.phone')}  />
                            </Form.Item>
                            <Form.Item className="input" name={['contacts', 'email']} label={t('organizations.addUserForm.label.email')} initialValue={organizationById.contacts.email}>
                                <Input className="input" size="large"  placeholder={t('organizations.addUserForm.placeholder.email')}   />
                            </Form.Item>
                        </div>
                        <div className="form-inputs form-inputs-row">
                            <Form.Item className="input" name={['contacts', 'url']} label={t('organizations.addUserForm.label.url')} initialValue={organizationById.contacts.url}>
                                <Input className="input" size="large" placeholder={t('organizations.addUserForm.placeholder.url')}  />
                            </Form.Item>
                            <Form.Item className="input" name={['contacts', 'person']} label={t('organizations.addUserForm.label.person')} initialValue={organizationById.contacts.person}>
                                <Input className="input" size="large" placeholder={t('organizations.addUserForm.placeholder.person')}  />
                            </Form.Item>
                        </div>
                        <div className="form-inputs form-inputs-row">
                            <Form.Item className="input" name={['accessCodes', 'gcpCode']} label={t('organizations.addUserForm.label.gcpCode')} initialValue={organizationById.accessCodes.gcpCode}>
                                <Input className="input" size="large" placeholder={t('organizations.addUserForm.placeholder.gcpCode')}  />
                            </Form.Item>
                            {/*<Form.Item className="input" name={['accessCodes', 'omsId']} label={t('organizations.addUserForm.label.omsId')} initialValue={organizationById.accessCodes.gcpCode}>*/}
                            {/*    <Input className="input" size="large" placeholder={t('organizations.addUserForm.placeholder.omsId')}  />*/}
                            {/*</Form.Item>*/}
                        </div>
                        <div className="form-inputs">
                            <Form.Item className="input" name={['accessCodes', 'xTrace', 'token']} label={t('organizations.addUserForm.label.turonToken')} initialValue={organizationById.accessCodes.xTrace.token}>
                                <Input className="input" size="large" placeholder={t('organizations.addUserForm.placeholder.turonToken')}  />
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

export default OrganizationsEdit