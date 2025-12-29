import { Form, Input } from 'antd'
import { useAppDispatch, useAppSelector } from '../../store'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import MainLayout from '../../components/layout'
import Heading from '../../components/mainHeading'
import { getAllOrganizations, getOrganizationById } from '../../store/organization'
import CustomButton from '../../components/button'
import FormComponent from '../../components/formComponent'
import { useNavigate, useParams } from 'react-router-dom'
import { useNavigationBack } from '../../utils/utils'

const OrganizationsInner = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate()
    const { t } = useTranslation();
    const dispatch = useAppDispatch()
    const navigateBack = useNavigationBack();
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
        dispatch(getAllOrganizations({
            page: 1,
            limit: 10,
            sortOrder: 'asc',
        })) 
    }, [dispatch])



    useEffect(() => {
        if (id){
            dispatch(getOrganizationById({id: id}))
        }
    }, [dispatch, id])

    const handleProductNavigation = (id: any) => {
        navigate(`/organization/${id}/products`); 
    }


    // const companyTypeOption = [
    //     { value: "type1", label: 'Type1'},
    //     { value: "inactive", label: 'Inactive' },
    // ];

  return (
    <MainLayout>
        <Heading title={t('organizations.title')} subtitle={t('organizations.subtitle')} totalAmount='100'>
            <div className="btns-group">
                <CustomButton className='outline' onClick={() => navigateBack('/users')}>{t('btn.back')}</CustomButton>
                <CustomButton onClick={() => handleProductNavigation(id)}>{t('btn.toProducts')}</CustomButton>
            </div>
        </Heading>
        <div className="box">
            <div className="box-container">
                <div className="box-container-items">
                    <div className="box-container-items-item">
                        {organizationById  && (
                            <FormComponent>
                                <div className="form-inputs form-inputs-organization">
                                    {/*<Form.Item*/}
                                    {/*className="input"*/}
                                    {/*name="companyType"*/}
                                    {/*label={t('organizations.addUserForm.label.companyType')}*/}
                                    {/*>*/}
                                    {/*<Select*/}
                                    {/*    className="input"*/}
                                    {/*    size="large"*/}
                                    {/*    options={companyTypeOption}*/}
                                    {/*    placeholder={organizationById?.companyType ?? ''}*/}
                                    {/*    disabled*/}
                                    {/*/>*/}
                                    {/*</Form.Item>*/}

                                    <Form.Item
                                        className="input"
                                        name="displayName"
                                        label={t('organizations.addUserForm.label.displayName')}
                                    >
                                        <Input
                                            className="input"
                                            size="large"
                                            placeholder={organizationById?.displayName ?? ''}
                                            disabled
                                        />
                                    </Form.Item>
                                    <Form.Item
                                        className="input"
                                        name="productGroup"
                                        label={t('organizations.addUserForm.label.productGroup')}
                                    >
                                        <Input
                                            className="input"
                                            size="large"
                                            placeholder={organizationById?.productGroup ?? ''}
                                            disabled
                                        />
                                    </Form.Item>
                                </div>

                                <div className="form-inputs form-inputs-organization">
                                    <Form.Item
                                        className="input"
                                        name="tin"
                                        label={t('organizations.addUserForm.label.tin')}
                                    >
                                        <Input
                                            className="input"
                                            size="large"
                                            placeholder={organizationById?.tin ?? ''}
                                            disabled
                                        />
                                    </Form.Item>
                                    <Form.Item
                                        className="input"
                                        name="legalName"
                                        label={t('organizations.addUserForm.label.legalName')}
                                    >
                                        <Input
                                            className="input"
                                            size="large"
                                            placeholder={organizationById?.legalName ?? ''}
                                            disabled
                                        />
                                    </Form.Item>
                                </div>

                                <div className="form-inputs form-inputs-organization">

                                    <Form.Item
                                        className="input"
                                        name="director"
                                        label={t('organizations.addUserForm.label.director')}
                                    >
                                        <Input
                                            className="input"
                                            size="large"
                                            placeholder={organizationById?.director ?? ''}
                                            disabled
                                        />
                                    </Form.Item>
                                </div>

                                <div className="form-divider-title">
                                    <h4 className="title">{t('organizations.subtitles.address')}</h4>
                                </div>

                                <div className="form-inputs form-inputs-organization">
                                    <Form.Item
                                        className="input"
                                        name={['address', 'region']}
                                        label={t('organizations.addUserForm.label.region')}
                                    >
                                        <Input
                                            className="input"
                                            size="large"
                                            placeholder={organizationById?.address?.region ?? ''}
                                            disabled
                                        />
                                    </Form.Item>

                                    <Form.Item
                                        className="input"
                                        name={['address', 'district']}
                                        label={t('organizations.addUserForm.label.district')}
                                    >
                                        <Input
                                            className="input"
                                            size="large"
                                            placeholder={organizationById?.address?.district ?? ''}
                                            disabled
                                        />
                                    </Form.Item>
                                </div>

                                <div className="form-inputs form-inputs-organization">
                                    <Form.Item
                                        className="input"
                                        name={['address', 'address']}
                                        label={t('organizations.addUserForm.label.address')}
                                    >
                                        <Input
                                            className="input"
                                            size="large"
                                            placeholder={organizationById?.address?.address ?? ''}
                                            disabled
                                        />
                                    </Form.Item>
                                </div>

                                <div className="form-divider-title">
                                    <h4 className="title">{t('organizations.subtitles.bankDetails')}</h4>
                                </div>

                                <div className="form-inputs form-inputs-organization">
                                    <Form.Item
                                        className="input"
                                        name={['bankDetails', 'bankName']}
                                        label={t('organizations.addUserForm.label.bankName')}
                                    >
                                        <Input
                                            className="input"
                                            size="large"
                                            placeholder={organizationById?.bankDetails?.bankName ?? ''}
                                            disabled
                                        />
                                    </Form.Item>

                                    <Form.Item
                                        className="input"
                                        name={['bankDetails', 'ccea']}
                                        label={t('organizations.addUserForm.label.ccea')}
                                    >
                                        <Input
                                            className="input"
                                            size="large"
                                            placeholder={organizationById?.bankDetails?.ccea ?? ''}
                                            disabled
                                        />
                                    </Form.Item>
                                </div>

                                <div className="form-inputs form-inputs-organization">
                                    <Form.Item
                                        className="input"
                                        name={['bankDetails', 'account']}
                                        label={t('organizations.addUserForm.label.account')}
                                    >
                                        <Input
                                            className="input"
                                            size="large"
                                            placeholder={organizationById?.bankDetails?.account ?? ''}
                                            disabled
                                        />
                                    </Form.Item>

                                    <Form.Item
                                        className="input"
                                        name={['bankDetails', 'mfo']}
                                        label={t('organizations.addUserForm.label.mfo')}
                                    >
                                        <Input
                                            className="input"
                                            size="large"
                                            placeholder={organizationById?.bankDetails?.mfo ?? ''}
                                            disabled
                                        />
                                    </Form.Item>
                                </div>

                                <div className="form-divider-title">
                                    <h4 className="title">{t('organizations.subtitles.contactDetails')}</h4>
                                </div>

                                <div className="form-inputs form-inputs-organization">
                                    <Form.Item
                                        className="input"
                                        name={['contacts', 'phone']}
                                        label={t('organizations.addUserForm.label.phone')}
                                    >
                                        <Input
                                            className="input"
                                            size="large"
                                            placeholder={organizationById?.contacts?.phone ?? ''}
                                            disabled
                                        />
                                    </Form.Item>

                                    <Form.Item
                                        className="input"
                                        name={['contacts', 'email']}
                                        label={t('organizations.addUserForm.label.email')}
                                    >
                                        <Input
                                            className="input"
                                            size="large"
                                            placeholder={organizationById?.contacts?.email ?? ''}
                                            disabled
                                        />
                                    </Form.Item>
                                </div>

                                <div className="form-inputs form-inputs-organization">
                                    <Form.Item
                                        className="input"
                                        name={['contacts', 'url']}
                                        label={t('organizations.addUserForm.label.url')}
                                    >
                                        <Input
                                            className="input"
                                            size="large"
                                            placeholder={organizationById?.contacts?.url ?? ''}
                                            disabled
                                        />
                                    </Form.Item>

                                    <Form.Item
                                        className="input"
                                        name={['contacts', 'person']}
                                        label={t('organizations.addUserForm.label.person')}
                                    >
                                        <Input
                                            className="input"
                                            size="large"
                                            placeholder={organizationById?.contacts?.person ?? ''}
                                            disabled
                                        />
                                    </Form.Item>
                                </div>

                                <div className="form-inputs form-inputs-organization">
                                    <Form.Item
                                        className="input"
                                        name={['accessCodes', 'gcpCode']}
                                        label={t('organizations.addUserForm.label.gcpCode')}
                                    >
                                        <Input
                                            className="input"
                                            size="large"
                                            placeholder={organizationById?.accessCodes?.gcpCode ?? ''}
                                            disabled
                                        />
                                    </Form.Item>

                                    <Form.Item
                                        className="input"
                                        name={['accessCodes', 'omsId']}
                                        label={t('organizations.addUserForm.label.omsId')}
                                    >
                                        <Input
                                            className="input"
                                            size="large"
                                            placeholder={organizationById?.accessCodes?.omsId ?? ''}
                                            disabled
                                        />
                                    </Form.Item>
                                </div>

                                <div className="form-inputs form-inputs-organization">
                                    <Form.Item
                                        className="input"
                                        name={['accessCodes', 'turonToken']}
                                        label={t('organizations.addUserForm.label.turonToken')}
                                    >
                                        <Input
                                            className="input"
                                            size="large"
                                            placeholder={organizationById?.accessCodes?.turonToken ?? ''}
                                            disabled
                                        />
                                    </Form.Item>
                                </div>
                                </FormComponent>

                        )}
                    </div>
                </div>
            </div>
        </div>

    </MainLayout>
  )
}

export default OrganizationsInner