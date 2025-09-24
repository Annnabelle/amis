import { Form, Input, Select} from 'antd'
import { IoSearch } from 'react-icons/io5'
import { useAppDispatch, useAppSelector } from '../../store'
import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import MainLayout from '../../components/layout'
import Heading from '../../components/mainHeading'
import ComponentTable from '../../components/table'
import { createOrganization, deleteOrganization, getAllOrganizations, getOrganizationById, searchOrganizations, updateOrganization } from '../../store/organization'
import { OrganizationsTableColumns } from '../../tableData/organizations'
import type { OrganizationTableDataType } from '../../tableData/organizations/types'
import type { CompanyResponse, CreateCompany } from '../../types/organization'  
import { toast } from 'react-toastify'
import CustomButton from '../../components/button'
import ModalWindow from '../../components/modalWindow'
import FormComponent from '../../components/formComponent'
import { useNavigate } from 'react-router-dom'

const Organizations = () => {
    const navigate = useNavigate()
    const { t } = useTranslation();
    const dispatch = useAppDispatch()
    const organizations = useAppSelector((state) => state.organizations.organizations)
    const dataLimit = useAppSelector((state) => state.organizations.limit)
    const dataPage = useAppSelector((state) => state.organizations.page)
    const dataTotal = useAppSelector((state) => state.organizations.total)
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

   const OrganizationsData = useMemo(() => {
        return organizations.map((organization, index) => ({
            key: organization.id,                
            number: index + 1,         
            displayName: organization.displayName,
            director: organization.director,
            legalName: organization.legalName,
            contacts: organization.contacts.phone ?? '',
            status: organization.status,
            action: 'Действие', 
        }))
    }, [organizations]);

    const [modalState, setModalState] = useState<{
        addCompany: boolean;
        editCompany: boolean;
        retrieveCompany: boolean;
        deleteCompany: boolean;
        companyData: CompanyResponse | null; 
      }>({
        addCompany: false,
        editCompany: false,
        retrieveCompany: false,
        deleteCompany: false,
        companyData: null, 
      });

    const handleModal = (modalName: string, value: boolean) => {
        setModalState((prev) => ({...prev, [modalName] : value}));
    }

    const handleCreateCompany = async (values: CreateCompany) => {
        try {
            const resultAction = await dispatch(createOrganization(values));
        
            if (createOrganization.fulfilled.match(resultAction)) {
                toast.success(t('organizations.messages.success.createUser')); //заменить
                setTimeout(() => {
                    handleModal('addCompany', false);
                    window.location.reload(); 
                }, 1000); 
            } else {
                toast.error(t('organizations.messages.error.createUser')); //заменить
            }
        } catch (err) {
            toast.error((err as string) || t('organizations.messages.error.createUser')); //заменить
        }
    };

    const [selectedOrganizationId, setSelectedOrganizationId] = useState<string | null>(null);

     const handleRowClick = (type: 'Company', action: 'retrieve' | 'edit' | 'delete', record: OrganizationTableDataType) => {
        console.log(`Clicked on ${type}, action: ${action}, record:`, record);
        if (type === "Company" && action === "retrieve") {
            navigate(`/organization/${record.key}`); 
        }
    };

    useEffect(() => {
        if (selectedOrganizationId){
            dispatch(getOrganizationById({id: selectedOrganizationId}))
        }
    }, [dispatch, selectedOrganizationId])

    const handleEditOrganization = (record: OrganizationTableDataType) => {
        const organization = organizations.find((organization) => organization.id === record.key) ?? null;
        if (organization) {
            setSelectedOrganizationId(organization.id);
            setModalState((prev) => ({
            ...prev,
            editCompany: true,
            companyData: organization
            }));
        }
    };


    const handleUpdateOrganization = async (values: any) => {
        if (!selectedOrganizationId) return;

        try {
            const resultAction = await dispatch(
             updateOrganization({ id: selectedOrganizationId, data: values })
            );

            if (updateOrganization.fulfilled.match(resultAction)) {
                toast.success(t('organizations.messages.success.updateUser'));
                handleModal("editCompany", false);

                await dispatch(getAllOrganizations({ page: 1, limit: 10, sortOrder: 'asc' }));
                await dispatch(getOrganizationById({ id: selectedOrganizationId }));
                } else {
                toast.error(t('organizations.messages.error.updateUser'));
            }
        } catch (err) {
            toast.error((err as string) || t('organizations.messages.error.updateUser'));
        }
    };

    const handleDeleteOrganization = (record: OrganizationTableDataType) => {
        const organization = organizations.find((o) => o.id === record.key) ?? null;
            if (organization) {
                setSelectedOrganizationId(organization.id);
                setModalState((prev) => ({
                ...prev,
                deleteCompany: true,
                companyData: organization
                }));
            }
    };

    const confirmDeleteOrganization = async () => {
        if (!modalState.companyData) return;

        try {
            const resultAction = await dispatch(
                deleteOrganization({ id: modalState.companyData.id })
            );

            if (deleteOrganization.fulfilled.match(resultAction)) {
                toast.success(t('organizations.messages.success.deleteUser'));
                handleModal("deleteCompany", false);

                await dispatch(getAllOrganizations({ page: 1, limit: 10, sortOrder: "asc" }));
            } else {
                toast.error(t('organizations.messages.error.deleteUser'));
            }
        } catch (err) {
            toast.error((err as string) || t('organizations.messages.error.deleteUser'));
        }
    };


    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        if (value.trim().length > 0) {
            dispatch(searchOrganizations({ query: value, page: 1, limit: 10, sortOrder: 'asc' }));
        } else {
            dispatch(getAllOrganizations({ page: 1, limit: 10, sortOrder: 'asc' }));
        }
    };

    const companyTypeOption = [
        { value: "type1", label: 'Type1'},
        { value: "inactive", label: 'Inactive' },
    ];

  return (
    <MainLayout>
        <Heading title={t('organizations.title')} subtitle={t('organizations.subtitle')} totalAmount='100'>
            <CustomButton onClick={() => handleModal('addCompany', true)}>{t('organizations.btnAdd')}</CustomButton>
        </Heading>
        <div className="box">
            <div className="box-container">
                <div className="box-container-items">
                    <div className="box-container-items-item">
                        <div className="box-container-items-item-filters">
                               <div className="form-inputs">
                                    <Form.Item name="searchExpert" className="input">
                                        <Input
                                            size="large"
                                            className="input"
                                            placeholder={t('search.byOrganization')}
                                            suffix={<IoSearch />}
                                            allowClear
                                            onChange={handleSearchChange}
                                        />
                                    </Form.Item>
                                </div>
                        </div>
                    </div>
                </div>
                <div className="box-container-items">
                    <ComponentTable<OrganizationTableDataType> 
                        columns={OrganizationsTableColumns(t, handleEditOrganization, handleDeleteOrganization)}
                        data={OrganizationsData}
                        onRowClick={(record) => handleRowClick('Company', 'retrieve', record)}
                    />
                </div>
            </div>
        </div>
        <ModalWindow titleAction={t('organizations.modalWindow.adding')} title={t('organizations.modalWindow.organization')} openModal={modalState.addCompany} closeModal={() => handleModal('addCompany', false)}>
            <FormComponent onFinish={handleCreateCompany}>
                <div className="form-inputs">
                    <Form.Item className="input" name="companyType" label={t('organizations.addUserForm.label.companyType')}  >
                        <Select className='input' size="large" options={companyTypeOption} placeholder={t('organizations.addUserForm.placeholder.companyType')}/>
                    </Form.Item>
                    <Form.Item className="input" name="displayName" label={t('organizations.addUserForm.label.displayName')}>
                        <Input className="input" size="large" placeholder={t('organizations.addUserForm.placeholder.displayName')} />
                    </Form.Item>
                </div>
                <div className="form-inputs">
                    <Form.Item className="input"  name="productGroup" label={t('organizations.addUserForm.label.productGroup')}>
                        <Input className="input" size="large" placeholder={t('organizations.addUserForm.placeholder.productGroup')} />
                    </Form.Item>
                    <Form.Item className="input"  name="tin" label={t('organizations.addUserForm.label.tin')}>
                        <Input className="input" size="large" placeholder={t('organizations.addUserForm.placeholder.tin')} />
                    </Form.Item>
                </div>
                <div className="form-inputs">
                    <Form.Item className="input" name="legalName" label={t('organizations.addUserForm.label.legalName')}>
                        <Input className="input" size="large" placeholder={t('organizations.addUserForm.placeholder.legalName')} />
                    </Form.Item>
                    <Form.Item className="input" name="director" label={t('organizations.addUserForm.label.director')}>
                        <Input className="input" size="large" placeholder={t('organizations.addUserForm.placeholder.director')} />
                    </Form.Item>
                </div>

                <div className="form-divider-title">
                    <h4 className="title">{t('organizations.subtitles.address')}</h4>
                </div>

                {/* AddressDto */}
                <div className="form-inputs">
                    <Form.Item className="input" name={['address', 'region']} label={t('organizations.addUserForm.label.region')}>
                        <Input className="input" size="large" placeholder={t('organizations.addUserForm.placeholder.region')} />
                    </Form.Item>
                    <Form.Item className="input" name={['address', 'district']} label={t('organizations.addUserForm.label.district')}>
                        <Input className="input" size="large" placeholder={t('organizations.addUserForm.placeholder.district')} />
                    </Form.Item>
                </div>
                <div className="form-inputs">
                    <Form.Item className="input" name={['address', 'address']} label={t('organizations.addUserForm.label.address')}>
                        <Input className="input" size="large" placeholder={t('organizations.addUserForm.placeholder.address')} />
                    </Form.Item>
                </div>

                <div className="form-divider-title">
                    <h4 className="title">{t('organizations.subtitles.bankDetails')}</h4>
                </div>

                <div className="form-inputs">
                    <Form.Item className="input" name={['bankDetails', 'bankName']} label={t('organizations.addUserForm.label.bankName')}>
                        <Input className="input" size="large" placeholder={t('organizations.addUserForm.placeholder.bankName')} />
                    </Form.Item>
                    <Form.Item className="input" name={['bankDetails', 'ccea']} label={t('organizations.addUserForm.label.ccea')}>
                        <Input className="input" size="large" placeholder={t('organizations.addUserForm.placeholder.ccea')} />
                    </Form.Item>
                </div>
                 <div className="form-inputs">
                    <Form.Item className="input" name={['bankDetails', 'account']} label={t('organizations.addUserForm.label.account')}>
                        <Input className="input" size="large" placeholder={t('organizations.addUserForm.placeholder.account')} />
                    </Form.Item>
                    <Form.Item className="input" name={['bankDetails', 'mfo']} label={t('organizations.addUserForm.label.mfo')}>
                        <Input className="input" size="large" placeholder={t('organizations.addUserForm.placeholder.mfo')} />
                    </Form.Item>
                </div>

                 <div className="form-divider-title">
                    <h4 className="title">{t('organizations.subtitles.contactDetails')} </h4>
                </div>

                {/* ContactsDto */}
                <div className="form-inputs">
                    <Form.Item className="input" name={['contacts', 'phone']} label={t('organizations.addUserForm.label.phone')}>
                        <Input className="input" size="large" placeholder={t('organizations.addUserForm.placeholder.phone')} />
                    </Form.Item>
                    <Form.Item className="input" name={['contacts', 'email']} label={t('organizations.addUserForm.label.email')}>
                        <Input className="input" size="large" placeholder={t('organizations.addUserForm.placeholder.email')} />
                    </Form.Item>
                </div>

                <div className="form-inputs">
                    <Form.Item className="input" name={['contacts', 'url']} label={t('organizations.addUserForm.label.url')}>
                        <Input className="input" size="large" placeholder={t('organizations.addUserForm.placeholder.url')} />
                    </Form.Item>
                    <Form.Item className="input" name={['contacts', 'person']} label={t('organizations.addUserForm.label.person')}>
                        <Input className="input" size="large" placeholder={t('organizations.addUserForm.placeholder.person')} />
                    </Form.Item>
                </div>

                {/* AccessCodesDto */}
                <div className="form-inputs">
                    <Form.Item className="input" name={['accessCodes', 'gcpCode']} label={t('organizations.addUserForm.label.gcpCode')}>
                        <Input className="input" size="large" placeholder={t('organizations.addUserForm.placeholder.gcpCode')} />
                    </Form.Item>
                    <Form.Item className="input" name={['accessCodes', 'omsId']} label={t('organizations.addUserForm.label.omsId')}>
                        <Input className="input" size="large" placeholder={t('organizations.addUserForm.placeholder.omsId')} />
                    </Form.Item>
                </div>

                 <div className="form-inputs">
                    <Form.Item className="input" name={['accessCodes', 'turonToken']} label={t('organizations.addUserForm.label.turonToken')}>
                        <Input className="input" size="large" placeholder={t('organizations.addUserForm.placeholder.turonToken')} />
                    </Form.Item>
                </div>

                <CustomButton type="submit">{t('btn.create')}</CustomButton>
            </FormComponent>
        </ModalWindow>
        {organizationById && selectedOrganizationId && (
            <ModalWindow
                titleAction={t('organizations.modalWindow.editing')}
                title={t('organizations.modalWindow.organization')}
                openModal={modalState.editCompany}
                closeModal={() => handleModal("editCompany", false)}
            >
                <FormComponent
                  form={form}
                    onFinish={(values) => {
                        handleUpdateOrganization(values);
                    }}
                >
                    <div className="form-inputs">
                        <Form.Item className="input" name="companyType" label={t('organizations.addUserForm.label.companyType')}   initialValue={organizationById.companyType}>
                            <Select className='input' size="large" options={companyTypeOption} placeholder={t('organizations.addUserForm.placeholder.companyType')} />
                        </Form.Item>
                        <Form.Item className="input" name="displayName" label={t('organizations.addUserForm.label.displayName')} initialValue={organizationById.displayName}>
                            <Input className="input" size="large" placeholder={t('organizations.addUserForm.placeholder.displayName')}  />
                        </Form.Item>
                    </div>
                    <div className="form-inputs">
                        <Form.Item className="input"  name="productGroup" label={t('organizations.addUserForm.label.productGroup')} initialValue={organizationById.productGroup}>
                            <Input className="input" size="large" placeholder={t('organizations.addUserForm.placeholder.productGroup')}   />
                        </Form.Item>
                        <Form.Item className="input"  name="tin" label={t('organizations.addUserForm.label.tin')} initialValue={organizationById.tin}>
                            <Input className="input" size="large" placeholder={t('organizations.addUserForm.placeholder.tin')}  />
                        </Form.Item>
                    </div>
                    <div className="form-inputs">
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

                    {/* AddressDto */}
                    <div className="form-inputs">
                        <Form.Item className="input" name={['address', 'region']} label={t('organizations.addUserForm.label.region')} initialValue={organizationById.address.region}>
                            <Input className="input" size="large" placeholder={t('organizations.addUserForm.placeholder.region')} />
                        </Form.Item>
                        <Form.Item className="input" name={['address', 'district']} label={t('organizations.addUserForm.label.district')} initialValue={organizationById.address.district}>
                            <Input className="input" size="large"  placeholder={t('organizations.addUserForm.placeholder.district')}  />
                        </Form.Item>
                    </div>
                    <div className="form-inputs">
                        <Form.Item className="input" name={['address', 'address']} label={t('organizations.addUserForm.label.address')} initialValue={organizationById.address.address}>
                            <Input className="input" size="large"  placeholder={t('organizations.addUserForm.placeholder.address')}  />
                        </Form.Item>
                    </div>

                    <div className="form-divider-title">
                        <h4 className="title">{t('organizations.subtitles.bankDetails')}</h4>
                    </div>

                    <div className="form-inputs">
                        <Form.Item className="input" name={['bankDetails', 'bankName']} label={t('organizations.addUserForm.label.bankName')} initialValue={organizationById.bankDetails.bankName}>
                            <Input className="input" size="large" placeholder={t('organizations.addUserForm.placeholder.bankName')}  />
                        </Form.Item>
                        <Form.Item className="input" name={['bankDetails', 'ccea']} label={t('organizations.addUserForm.label.ccea')} initialValue={organizationById.bankDetails.ccea}>
                            <Input className="input" size="large" placeholder={t('organizations.addUserForm.placeholder.ccea')}  />
                        </Form.Item>
                    </div>
                    <div className="form-inputs">
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

                    {/* ContactsDto */}
                    <div className="form-inputs">
                        <Form.Item className="input" name={['contacts', 'phone']} label={t('organizations.addUserForm.label.phone')}initialValue={organizationById.contacts.phone}>
                            <Input className="input" size="large" placeholder={t('organizations.addUserForm.placeholder.phone')}  />
                        </Form.Item>
                        <Form.Item className="input" name={['contacts', 'email']} label={t('organizations.addUserForm.label.email')} initialValue={organizationById.contacts.email}>
                            <Input className="input" size="large"  placeholder={t('organizations.addUserForm.placeholder.email')}   />
                        </Form.Item>
                    </div>

                    <div className="form-inputs">
                        <Form.Item className="input" name={['contacts', 'url']} label={t('organizations.addUserForm.label.url')} initialValue={organizationById.contacts.url}>
                            <Input className="input" size="large" placeholder={t('organizations.addUserForm.placeholder.url')}  />
                        </Form.Item>
                        <Form.Item className="input" name={['contacts', 'person']} label={t('organizations.addUserForm.label.person')} initialValue={organizationById.contacts.person}>
                            <Input className="input" size="large" placeholder={t('organizations.addUserForm.placeholder.person')}  />
                        </Form.Item>
                    </div>

                    {/* AccessCodesDto */}
                    <div className="form-inputs">
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
            </ModalWindow>
        )}
        <ModalWindow
            titleAction={t('organizations.modalWindow.deletion')}
            title={t('organizations.modalWindow.organization')}
            openModal={modalState.deleteCompany}
            closeModal={() => handleModal("deleteCompany", false)}
            classDangerName='danger-title'  
            >
            <div className="delete-modal">
                <div className="delete-modal-title">
                    <p className='title'>
                        {t('organizations.deleteUserQuestion')}: {" "}
                    </p>
                    <p className="subtitle">{modalState.companyData?.legalName} ? </p>
                </div>
                <div className="delete-modal-btns">
                    <CustomButton className="danger" onClick={confirmDeleteOrganization}>
                        {t('btn.delete')}
                    </CustomButton>
                    <CustomButton onClick={() => handleModal("deleteUser", false)} className="outline">
                        {t('btn.cancel')}
                    </CustomButton>
                </div>
            </div>
        </ModalWindow>

    </MainLayout>
  )
}

export default Organizations