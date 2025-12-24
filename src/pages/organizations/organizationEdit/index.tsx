import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../store";
import { useEffect } from "react";
import { getOrganizationById, updateOrganization } from "../../../store/organization";
import { toast } from "react-toastify";
import MainLayout from "../../../components/layout";
import Heading from "../../../components/mainHeading";
import CustomButton from "../../../components/button";
import FormComponent from "../../../components/formComponent";
import { Form, Input, Select } from "antd";
import { useNavigationBack } from "../../../utils/utils";

const OrganizationsEdit = () => {
    const { t } = useTranslation();
    const navigateBack = useNavigationBack();
    const dispatch = useAppDispatch()
    const { id } = useParams<{ id: string }>();
    const organizationById = useAppSelector((state) => state.organizations.organizationById)
    const [form] = Form.useForm()

    useEffect(() => {
        if (organizationById) {
            form.setFieldsValue({
                  companyType: organizationById.companyType,
                  displayName: organizationById.displayName,
                  productGroup: organizationById.productGroup,
                  tin: organizationById.tin,
                  legalName: organizationById.legalName,
                  director: organizationById.director,
                  address: {
                    region: organizationById.address?.region,
                    district: organizationById.address?.district,
                    address: organizationById.address?.address
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
                    omsId: organizationById.accessCodes?.omsId,
                    turonToken: organizationById.accessCodes?.turonToken,
                  },
                  status: organizationById.status,
                  deleted: organizationById.deleted,
                  deletedAt: organizationById.deletedAt
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

    const companyTypeOption = [
        { value: "type1", label: 'Type1'},
        { value: "inactive", label: 'Inactive' },
    ];

  return (
    <MainLayout>
        <Heading title={t('organizations.title')} subtitle={t('organizations.subtitle')} totalAmount='100'>
            <CustomButton onClick={() => navigateBack('/organization')}>{t('btn.back')}</CustomButton>
        </Heading>
        <div className="box">
            <div className="box-container">
                {organizationById  && (
                    <FormComponent
                        form={form}
                        onFinish={(values) => {
                            handleUpdateOrganization(values);
                        }}
                    >
                        <div className="form-inputs form-inputs-row">
                            <Form.Item className="input" name="companyType" label={t('organizations.addUserForm.label.companyType')}   initialValue={organizationById.companyType}>
                                <Select className='input' size="large" options={companyTypeOption} placeholder={t('organizations.addUserForm.placeholder.companyType')} />
                            </Form.Item>
                            <Form.Item className="input" name="displayName" label={t('organizations.addUserForm.label.displayName')} initialValue={organizationById.displayName}>
                                <Input className="input" size="large" placeholder={t('organizations.addUserForm.placeholder.displayName')}  />
                            </Form.Item>
                        </div>
                        <div className="form-inputs form-inputs-row">
                            <Form.Item className="input"  name="productGroup" label={t('organizations.addUserForm.label.productGroup')} initialValue={organizationById.productGroup}>
                                <Input className="input" size="large" placeholder={t('organizations.addUserForm.placeholder.productGroup')}   />
                            </Form.Item>
                            <Form.Item className="input"  name="tin" label={t('organizations.addUserForm.label.tin')} initialValue={organizationById.tin}>
                                <Input className="input" size="large" placeholder={t('organizations.addUserForm.placeholder.tin')}  />
                            </Form.Item>
                        </div>
                        <div className="form-inputs form-inputs-row">
                            <Form.Item className="input" name="legalName" label={t('organizations.addUserForm.label.legalName')} initialValue={organizationById.legalName}>
                                <Input className="input" size="large" placeholder={t('organizations.addUserForm.placeholder.legalName')}  />
                            </Form.Item>
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
                            <Form.Item className="input" name={['bankDetails', 'bankName']} label={t('organizations.addUserForm.label.bankName')} initialValue={organizationById.bankDetails.bankName}>
                                <Input className="input" size="large" placeholder={t('organizations.addUserForm.placeholder.bankName')}  />
                            </Form.Item>
                            <Form.Item className="input" name={['bankDetails', 'ccea']} label={t('organizations.addUserForm.label.ccea')} initialValue={organizationById.bankDetails.ccea}>
                                <Input className="input" size="large" placeholder={t('organizations.addUserForm.placeholder.ccea')}  />
                            </Form.Item>
                        </div>
                        <div className="form-inputs form-inputs-row">
                            <Form.Item className="input" name={['bankDetails', 'account']} label={t('organizations.addUserForm.label.account')} initialValue={organizationById.bankDetails.account}>
                                <Input className="input" size="large" placeholder={t('organizations.addUserForm.placeholder.account')}   />
                            </Form.Item>
                            <Form.Item className="input" name={['bankDetails', 'mfo']} label={t('organizations.addUserForm.label.mfo')} initialValue={organizationById.bankDetails.mfo}>
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
                            <Form.Item className="input" name={['accessCodes', 'omsId']} label={t('organizations.addUserForm.label.omsId')} initialValue={organizationById.accessCodes.omsId}>
                                <Input className="input" size="large" placeholder={t('organizations.addUserForm.placeholder.omsId')}  />
                            </Form.Item>
                        </div>
                        <div className="form-inputs">
                            <Form.Item className="input" name={['accessCodes', 'turonToken']} label={t('organizations.addUserForm.label.turonToken')} initialValue={organizationById.accessCodes.turonToken}>
                                <Input className="input" size="large" placeholder={t('organizations.addUserForm.placeholder.turonToken')}  />
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

export default OrganizationsEdit