import {Form, Input, Tag} from 'antd'
import { useAppDispatch, useAppSelector } from '../../store'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import MainLayout from '../../components/layout'
import Heading from '../../components/mainHeading'
import { getAllOrganizations, getOrganizationById } from '../../store/organization'
import CustomButton from '../../components/button'
import FormComponent from '../../components/formComponent'
import { useNavigate, useParams } from 'react-router-dom'
import {type LanguageKey, useNavigationBack} from '../../utils/utils'
import dayjs from "dayjs";
import {fetchReferencesByType} from "../../store/references";

const OrganizationsInner = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate()
    const { t, i18n } = useTranslation();
    const dispatch = useAppDispatch()
    const navigateBack = useNavigationBack();
    const organizationById = useAppSelector((state) => state.organizations.organizationById)

    const [form] = Form.useForm()

    const lang = i18n.language as LanguageKey;
    const productGroupReferences = useAppSelector(
        (state) => state.references.references.productGroup
    ) ?? [];

    useEffect(() => {
        dispatch(fetchReferencesByType("productGroup"));
    }, [dispatch]);

    useEffect(() => {
        if (organizationById) {
            form.setFieldsValue({
                  // companyType: organizationById.companyType,
                  tin: organizationById.tin,
                  displayName: organizationById.displayName,
                    name: {
                          ru: organizationById.name.ru,
                        en: organizationById.name.en,
                        uz: organizationById.name.uz,
                    },
                  legalName:  {
                      ru: organizationById.legalName.ru,
                      en: organizationById.legalName.en,
                      uz: organizationById.legalName.uz,
                  },
                    productGroups: organizationById.productGroups,
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
                      xTrace: {
                          id: organizationById.accessCodes?.xTrace.id,
                          token: organizationById.accessCodes?.xTrace.token,
                          expireDate: organizationById.accessCodes?.xTrace.expireDate,
                          updateDate: organizationById.accessCodes?.xTrace.updateDate
                      },
                  },
                  status: organizationById.status,
                  deleted: organizationById.deleted,
                  deletedAt: organizationById.deletedAt,
                    isTest: organizationById.isTest,
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

  return (
    <MainLayout>
        <Heading title={organizationById?.displayName ?? ''} isTest={organizationById?.isTest} subtitle={t('organizations.subtitle')} totalAmount='100'>
            <div className="btns-group">
                <CustomButton className='outline' onClick={() => navigateBack('/organization')}>{t('btn.back')}</CustomButton>
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
                                    <Form.Item
                                        name="tin"
                                        className='input'
                                        label={t("organizations.addUserForm.label.tin")}
                                    >
                                        <Input
                                            size="large"
                                            className="input"
                                            disabled
                                            readOnly
                                            placeholder={organizationById?.tin}
                                        />
                                    </Form.Item>
                                    <Form.Item
                                        className='input'
                                        name={["accessCodes", "xTrace", "token"]}
                                        label={t("organizations.addUserForm.label.xTraceToken")}
                                    >
                                        <Input
                                            size="large"
                                            className="input"
                                            disabled
                                            readOnly
                                            placeholder={organizationById?.accessCodes?.xTrace?.token}
                                        />
                                    </Form.Item>
                                </div>
                                <div className="form-inputs form-inputs-organization">
                                    {organizationById?.accessCodes?.xTrace?.expireDate && (
                                        <Form.Item
                                            className="input"
                                            name={["accessCodes", "xTrace", "expireDate"]}
                                            label={t('organizations.addUserForm.label.expireDate')}
                                        >
                                            <Input
                                                className="input"
                                                size="large"
                                                placeholder={dayjs(organizationById?.accessCodes?.xTrace?.expireDate).format("YYYY-MM-DD hh:mm")}
                                                disabled
                                            />
                                        </Form.Item>
                                    )}
                                </div>
                                <div className="form-inputs form-inputs-organization">
                                    {organizationById?.displayName && (
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
                                    )}
                                    {organizationById?.director && (
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
                                    )}
                                </div>
                                {organizationById?.productGroups && (
                                    <div className="form-inputs form-inputs-row form-inputs-product-groups">
                                        <Form.Item
                                            className="input"
                                            label={t("organizations.addUserForm.label.productGroup")}
                                            shouldUpdate={(prev, cur) => prev.productGroups !== cur.productGroups}
                                        >
                                            {() => {
                                                const productGroups = form.getFieldValue("productGroups") as string[];

                                                if (!Array.isArray(productGroups) || productGroups.length === 0) {
                                                    return <Input size="large" className="input input-hidden" disabled placeholder="—" />;
                                                }

                                                return (
                                                    <Input
                                                        size="large"
                                                        className="input product-groups-preview"
                                                        disabled
                                                        value="" // 🔥 пустое значение, чтобы не дублировался текст
                                                        prefix={
                                                            <div>
                                                                {productGroups.map((alias: string) => {
                                                                    const ref = productGroupReferences.find(r => r.alias === alias);
                                                                    const title = ref?.title?.[lang] ?? ref?.title?.ru ?? alias;

                                                                    return (
                                                                        <Tag
                                                                            key={alias}
                                                                            color="blue"
                                                                            style={{
                                                                                margin: 0,
                                                                                fontSize: 12,
                                                                                padding: "4px 6px",
                                                                            }}
                                                                        >
                                                                            {title}
                                                                        </Tag>
                                                                    );
                                                                })}
                                                            </div>
                                                        }
                                                    />
                                                );
                                            }}
                                        </Form.Item>
                                    </div>
                                )}
                                {organizationById?.name && (
                                    <div className="form-inputs form-inputs-organization">
                                        {organizationById?.name?.ru && (
                                            <Form.Item className="input" name={["name", "ru"]} label={`${t('organizations.addUserForm.label.companyName')} EN`}>
                                                <Input
                                                    className="input"
                                                    size="large"
                                                    placeholder={organizationById?.name?.ru}
                                                    disabled
                                                />
                                            </Form.Item>
                                        )}
                                        {organizationById?.name?.en && (
                                            <Form.Item className="input" name={["name", "en"]} label={`${t('organizations.addUserForm.label.companyName')} EN`}>
                                                <Input
                                                    className="input"
                                                    size="large"
                                                    placeholder={organizationById?.name?.en}
                                                    disabled
                                                />
                                            </Form.Item>
                                        )}
                                    </div>
                                )}
                                <div className="form-inputs">
                                    {organizationById?.name?.uz && (
                                        <Form.Item className="input" name={["name", "uz"]} label={`${t('organizations.addUserForm.label.companyName')} UZ`}>
                                            <Input
                                                className="input"
                                                size="large"
                                                placeholder={organizationById?.name?.uz}
                                                disabled
                                            />
                                        </Form.Item>
                                    )}
                                </div>
                                {organizationById?.legalName && (
                                    <div className="form-inputs form-inputs-row">
                                        {organizationById?.legalName?.ru && (
                                            <Form.Item className="input" name={["legalName", "ru"]} label={`${t('organizations.addUserForm.label.legalName')} RU`}>
                                                <Input
                                                    className="input"
                                                    size="large"
                                                    placeholder={organizationById?.legalName?.ru}
                                                    disabled
                                                />
                                            </Form.Item>
                                        )}
                                        {organizationById?.legalName?.en && (
                                            <Form.Item className="input" name={["legalName", "en"]} label={`${t('organizations.addUserForm.label.legalName')} EN`}>
                                                <Input
                                                    className="input"
                                                    size="large"
                                                    placeholder={organizationById?.legalName?.en}
                                                    disabled
                                                />
                                            </Form.Item>
                                        )}
                                    </div>
                                )}
                                {(organizationById?.legalName?.uz || organizationById?.director) && (
                                    <div className="form-inputs form-inputs-row">
                                    {organizationById?.legalName?.uz && (
                                        <Form.Item className="input" name={["legalName", "uz"]} label={`${t('organizations.addUserForm.label.legalName')} UZ`}>
                                            <Input
                                                className="input"
                                                size="large"
                                                placeholder={organizationById?.legalName?.uz}
                                                disabled
                                            />
                                        </Form.Item>
                                    )}
                                    {organizationById?.director && (
                                        <Form.Item className="input" name="director" label={t('organizations.addUserForm.label.director')}>
                                            <Input
                                                className="input"
                                                size="large"
                                                placeholder={organizationById?.director}
                                            />
                                        </Form.Item>
                                    )}
                                </div>
                                )}
                                <div className="form-divider-title">
                                    <h4 className="title">{t('organizations.subtitles.address')}</h4>
                                </div>

                                <div className="form-inputs form-inputs-organization">
                                    {organizationById?.address?.region && (
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
                                    )}
                                    {organizationById?.address?.district && (
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
                                    )}
                                </div>

                                <div className="form-inputs form-inputs-organization">
                                    {organizationById?.address?.address && (
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
                                    )}
                                </div>

                                <div className="form-divider-title">
                                    <h4 className="title">{t('organizations.subtitles.bankDetails')}</h4>
                                </div>

                                <div className="form-inputs form-inputs-organization">
                                    {organizationById?.bankDetails?.bankName && (
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
                                    )}
                                    {organizationById?.bankDetails?.ccea  && (
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
                                    )}
                                </div>

                                <div className="form-inputs form-inputs-organization">
                                    {organizationById?.bankDetails?.account && (
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
                                    )}
                                    {organizationById?.bankDetails?.mfo  && (
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
                                    )}
                                </div>

                                <div className="form-divider-title">
                                    <h4 className="title">{t('organizations.subtitles.contactDetails')}</h4>
                                </div>

                                <div className="form-inputs form-inputs-organization">
                                    {organizationById?.contacts?.phone && (
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
                                    )}
                                    {organizationById?.contacts?.email && (
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
                                    )}
                                </div>

                                <div className="form-inputs form-inputs-organization">
                                    {organizationById?.contacts?.url && (
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
                                    )}
                                    {organizationById?.contacts?.person && (
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
                                    )}
                                </div>

                                <div className="form-inputs form-inputs-organization">
                                    {organizationById?.accessCodes?.gcpCode && (
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
                                    )}

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