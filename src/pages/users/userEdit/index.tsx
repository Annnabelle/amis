import { Form, Input, Select, Spin, Tag } from 'antd'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'
import {assignUserToCompany, clearUserById, getUserById, unassignUserToCompany, updateUser } from '../../../store/users'
import { useAppDispatch, useAppSelector } from '../../../store'
import { IoSearch } from 'react-icons/io5'
import { getAllOrganizations, searchOrganizations } from '../../../store/organization'
import { useNavigationBack } from '../../../utils/utils'
import { toast } from 'react-toastify'
import MainLayout from '../../../components/layout'
import Heading from '../../../components/mainHeading'
import FormComponent from '../../../components/formComponent'
import CustomButton from '../../../components/button'
import PhoneInput from '../../../components/phoneInput'

const UsersEdit = () => {
    const { id } = useParams();
    const { t } = useTranslation();
    const dispatch = useAppDispatch();
    const userById = useAppSelector((state) => state.users.userById);
    const organizations = useAppSelector((state) => state.organizations.organizations);
    const [form] = Form.useForm()
    const isLoadingOrganizations = useAppSelector((state) => state.organizations.isLoading);
    const [searchValue, setSearchValue] = useState("");
    const [assignedOrganizations, setAssignedOrganizations] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const isUserLoading = useAppSelector((state) => state.users.isLoading);
    const navigateBack = useNavigationBack();
    const [isInitialLoading, setIsInitialLoading] = useState(true);

    useEffect(() => {
        if (id) {
            // dispatch(clearUserById());
            dispatch(getUserById({ id })).finally(() => setIsInitialLoading(false));
        }
    }, [dispatch, id]);

    
    const handleAssignOrganization = async (companyId: string) => {
        if (!id) return;
        setIsLoading(true);
        try {
            const resultAction = await dispatch(
                assignUserToCompany({ userId: id, companyId })
            );

            if (assignUserToCompany.fulfilled.match(resultAction)) {
                const org = organizations.find((o) => o.id === companyId);

                setAssignedOrganizations((prev) => [
                    ...prev,
                    {
                    ...resultAction.payload,
                    displayName: org?.displayName || resultAction.payload.displayName,
                    },
                ]);

                toast.success(t("organizations.messages.success.assignOrganization"));
            }
        } finally {
            setIsLoading(false);
        }
    };
    
    
    const handleUnAssignOrganization = async (companyId: string) => {
        if (!id) return;
        console.log('====================================');
        console.log(id, companyId);
        console.log('====================================');
        try {
            const resultAction = await dispatch(
                unassignUserToCompany({ userId: id, companyId })
            );
            if (unassignUserToCompany.fulfilled.match(resultAction)) {
                setAssignedOrganizations((prev) =>
                    prev.filter((org) => org.id !== companyId)
                );
                toast.success(t("organizations.messages.success.unassignOrganization"));
            }
        } catch {
            toast.error(t("organizations.messages.error.unassignOrganization"));
        }
    };

    useEffect(() => {
        if (userById && organizations.length > 0) {
            const assigned = organizations.filter((org) =>
            userById.companyIds?.includes(org.id));
            setAssignedOrganizations(assigned);
        }
    }, [userById, organizations]);

    useEffect(() => {
        if (userById) {
            form.setFieldsValue({
            firstName: userById.firstName,
            lastName: userById.lastName,
            phone: userById.phone,
            email: userById.email,
            role: userById.role?.alias,
            status: userById.status,
            })
        }
    }, [userById, form])

    const handleUpdateUser = async (values: any) => {
        if (!id) {
            toast.error(t('users.messages.error.updateUser'));
            return;
        }
        try {
            const resultAction = await dispatch(
                updateUser({ id: id, data: values })
            );

            if (updateUser.fulfilled.match(resultAction)) {
                toast.success(t('users.messages.success.updateUser'));

                await dispatch(getUserById({ id: id }));
            } else {
                toast.error(t('users.messages.error.updateUser'));
            }
        } catch (err) {
            toast.error((err as string) || t('users.messages.error.updateUser'));
        }
    };

    const statusOption = [
        { value: "active", label: t('users.status.active') },
        { value: "inactive", label: t('users.status.inactive') },
    ]

    if (isInitialLoading || isUserLoading || !userById || userById.id !== id) {
        return (
            <MainLayout>
            <div className="flex items-center justify-center h-96">
                <Spin size="large" />
            </div>
            </MainLayout>
        );
    }


  return (
    <MainLayout>
        <Heading 
            title={
                !isInitialLoading 
                ? `${t('users.modalWindow.editing')} ${t('users.modalWindow.user')}: ${userById?.firstName || ""}`
                : t('users.modalWindow.editing')
            } 
            subtitle={t('organizations.subtitle')} totalAmount='100'> 
                <CustomButton onClick={() => navigateBack('/users')}>{t('btn.back')}</CustomButton>
        </Heading>
        <div className="box">
            <div className="box-container">
                <div className="box-container-items">
                    <div className="box-container-items-item">
                        {userById && (
                            <FormComponent
                                form={form}
                                onFinish={(values) => {
                                    handleUpdateUser(values);
                                }}
                                initialValues={userById}
                            >
                                <div className="form-inputs form-inputs-row">
                                    <Form.Item className="input" name="firstName" label={t('users.addUserForm.label.firstName')} >
                                        <Input className="input" size="large" placeholder={t('users.addUserForm.placeholder.firstName')}  />
                                    </Form.Item>
                                    <Form.Item className="input" name="lastName" label={t('users.addUserForm.label.lastName')}>
                                        <Input className="input" size="large" placeholder={t('users.addUserForm.placeholder.lastName')}  />
                                    </Form.Item>
                                </div>
                                <div className="form-inputs form-inputs-row">
                                    <Form.Item className="input" name="phone" label={t('users.addUserForm.label.phone')} >
                                        <PhoneInput />
                                    </Form.Item>
                                    <Form.Item className="input" name="email" label={t('users.addUserForm.label.email')} >
                                        <Input className="input" size="large" placeholder={t('users.addUserForm.placeholder.email')}  />
                                    </Form.Item>
                                </div>
                                <div className="form-inputs">
                                    <Form.Item className="input" name="status" label="Статус" >
                                        <Select className='input' size="large" options={statusOption}/>
                                    </Form.Item>
                                </div>
                                <div className="form-inputs">
                                    <Form.Item
                                        className="input"
                                        label={t("organizations.assignToCompany")}
                                    >
                                        <Select
                                            showSearch
                                            className="input"
                                            size="large"
                                            value={searchValue || undefined}
                                            placeholder={t("search.byOrganization")}
                                            suffixIcon={<IoSearch />}
                                            filterOption={false}
                                            onSearch={(value) => {
                                                setSearchValue(value);
                                                if (value.trim()) {
                                                    dispatch(
                                                        searchOrganizations({ query: value, page: 1, limit: 10, sortOrder: "asc" })
                                                    );
                                                } else {
                                                    dispatch(getAllOrganizations({ page: 1, limit: 10, sortOrder: "asc" }));
                                                }
                                            }}
                                            onSelect={(companyId) => {
                                                handleAssignOrganization(companyId);
                                                setSearchValue("");
                                            }}
                                            notFoundContent={isLoadingOrganizations ? <Spin size="small" /> : t("search.noResults")}
                                            options={organizations
                                                .filter((org) => !assignedOrganizations.some((a) => a.id === org.id))
                                                .map((org) => ({
                                                    value: org.id,
                                                    label: org.displayName,
                                                }))}
                                            >
                                            </Select>
                                    </Form.Item>
                                    <div>
                                        {isLoadingOrganizations ? (
                                            <Spin />
                                        ) : (
                                            assignedOrganizations.map((organization) => (
                                                <Tag
                                                    key={organization.id}
                                                    closable
                                                    onClose={() => handleUnAssignOrganization(organization.id)}
                                                    color="blue"
                                                >
                                                    {organization.displayName || <Spin size="small" />}
                                                </Tag>
                                            ))
                                        )}
                                    </div>
                                </div>
                                <CustomButton type="submit">{t('btn.save')} </CustomButton>
                            </FormComponent>
                        )}
                    </div>
                </div>
            </div>
        </div>

    </MainLayout>
  )
}

export default UsersEdit