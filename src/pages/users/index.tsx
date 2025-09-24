import { Form, Input, Select, Spin, Tag } from 'antd'
import { UsersTableColumns } from '../../tableData/users'
import { IoSearch } from 'react-icons/io5'
import { useAppDispatch, useAppSelector } from '../../store'
import { toast } from 'react-toastify'
import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { assignUserToCompany, deleteUser, getAllUsers, getUserById, registerUser, searchUsers, unassignUserToCompany, updateUser } from '../../store/users'
import type { UserTableDataType } from '../../tableData/users/types'
import type { AddUserForm, UserResponse } from '../../types/users'
import type { Language } from '../../dtos'
import MainLayout from '../../components/layout'
import Heading from '../../components/mainHeading'
import ComponentTable from '../../components/table'
import dayjs from 'dayjs'
import CustomButton from '../../components/button'
import ModalWindow from '../../components/modalWindow'
import FormComponent from '../../components/formComponent'
import PhoneInput from '../../components/phoneInput'
import type { LangKey } from '../../utils/consts'
import { getAllOrganizations, searchOrganizations } from '../../store/organization'
import { useNavigate } from 'react-router-dom'

const Users = () => {
    const { t, i18n } = useTranslation();
    const dispatch = useAppDispatch()
    const navigate = useNavigate();
    const users = useAppSelector((state) => state.users.users)
    const dataLimit = useAppSelector((state) => state.users.limit)
    const dataPage = useAppSelector((state) => state.users.page)
    const dataTotal = useAppSelector((state) => state.users.total)
    const userById = useAppSelector((state) => state.users.userById)
    // const [searchValue, setSearchValue] = useState("");
    const organizations = useAppSelector((state) => state.organizations.organizations);
    // const isLoadingOrganizations = useAppSelector((state) => state.organizations.isLoading);
    // const [assignedOrganizations, setAssignedOrganizations] = useState<any[]>([]);
    // const [isLoading, setIsLoading] = useState(false);

    const [form] = Form.useForm()

    // const handleAssignOrganization = async (companyId: string) => {
    //     if (!selectedUserId) return;
    //     setIsLoading(true);
    //     try {
    //         const resultAction = await dispatch(
    //         assignUserToCompany({ userId: selectedUserId, companyId })
    //         );

    //         if (assignUserToCompany.fulfilled.match(resultAction)) {
    //         const org = organizations.find((o) => o.id === companyId);

    //         setAssignedOrganizations((prev) => [
    //             ...prev,
    //             {
    //             ...resultAction.payload,
    //             displayName: org?.displayName || resultAction.payload.displayName,
    //             },
    //         ]);

    //         toast.success(t("organizations.messages.success.assignOrganization"));
    //         }
    //     } finally {
    //         setIsLoading(false);
    //     }
    // };


    // const handleUnAssignOrganization = async (companyId: string) => {
    //     if (!selectedUserId) return;
    //     try {
    //         const resultAction = await dispatch(
    //             unassignUserToCompany({ userId: selectedUserId, companyId })
    //         );
    //         if (unassignUserToCompany.fulfilled.match(resultAction)) {
    //             setAssignedOrganizations((prev) =>
    //                 prev.filter((org) => org.id !== companyId)
    //             );
    //             toast.success(t("organizations.messages.success.unassignOrganization"));
    //         }
    //     } catch {
    //         toast.error(t("organizations.messages.error.unassignOrganization"));
    //     }
    // };

    // useEffect(() => {
    //     if (userById && organizations.length > 0) {
    //         const assigned = organizations.filter((org) =>
    //         userById.companyIds?.includes(org.id)
    //         );
    //         setAssignedOrganizations(assigned);
    //     }
    // }, [userById, organizations]);



    // useEffect(() => {
    //     if (userById) {
    //         form.setFieldsValue({
    //         firstName: userById.firstName,
    //         lastName: userById.lastName,
    //         phone: userById.phone,
    //         email: userById.email,
    //         role: userById.role?.alias,
    //         status: userById.status,
    //         })
    //     }
    // }, [userById, form])

    useEffect(() => {
        dispatch(getAllUsers({
            page: dataPage || 1,
            limit: dataLimit || 10,
            sortOrder: 'asc',
        }));
    }, [dispatch, dataPage, dataLimit]);

    const UsersData = useMemo(() => {
        return users.map((user, index) => ({
            key: user.id,                
            number: index + 1,         
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            role: user.role?.name?.[i18n.language as LangKey] || user.role?.name?.ru || 'Без роли',
            lastLoggedInAt: user.lastLoggedInAt ? dayjs(user.lastLoggedInAt).format('DD.MM.YYYY') : '-',
            status: user.status,
            action: 'Действие', 
        }))
    }, [users]);

    const [modalState, setModalState] = useState<{
        addUser: boolean;
        editUser: boolean;
        retrieveUser: boolean;
        deleteUser: boolean;
        userData: UserResponse | null; 
      }>({
        addUser: false,
        editUser: false,
        retrieveUser: false,
        deleteUser: false,
        userData: null, 
      });

    const handleModal = (modalName: string, value: boolean) => {
        setModalState((prev) => ({...prev, [modalName] : value}));
    }

    const handleRegisterUser = async (values: AddUserForm) => {
        try {
            const newFormData = {...values,   language: "ru" as Language, }
            const resultAction = await dispatch(registerUser(newFormData));
        
            if (registerUser.fulfilled.match(resultAction)) {
                toast.success(t('users.messages.success.createUser'));
                setTimeout(() => {
                    handleModal('addUser', false);
                    window.location.reload(); 
                }, 1000); 
            } else {
                toast.error(t('users.messages.error.createUser'));
            }
        } catch (err) {
            toast.error((err as string) || t('users.messages.error.createUser'));
        }
    };

    const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

    const handleRowClick = (
        type: "User",
        action: "retrieve" | "edit" | "delete",
        record: UserTableDataType
        ) => {
        if (type === "User") {
            const user = users.find((user) => user.id === record.key) ?? null;
            setSelectedUserId(record.key);

            setModalState((prev) => ({
            ...prev,
            [`${action}${type}`]: true,
            userData: user,
            }));

            if (record.key) {
                dispatch(getUserById({ id: record.key }));

                dispatch(getAllOrganizations({ page: 1, limit: 1000, sortOrder: "asc" }));
            }
            if (action === "retrieve") {
                navigate(`/users/${record.key}`);
            }
                if (action === "edit") {
                navigate(`/users/${record.key}/edit`);
            }
                if (action === "delete") {
                handleDeleteUser(record);
            }
        }
    };


    // useEffect(() => {
    //     if (selectedUserId){
    //         dispatch(getUserById({id: selectedUserId}))
    //     }
    // }, [dispatch, selectedUserId])

    // const handleEditUser = (record: UserTableDataType) => {
    //     const user = users.find((u) => u.id === record.key) ?? null;
    //     if (user) {
    //         setSelectedUserId(user.id);
    //         setModalState((prev) => ({
    //         ...prev,
    //         editUser: true,
    //         userData: user
    //         }));
    //     }
    // };

    useEffect(() => {
        if (modalState.editUser || modalState.retrieveUser) {
            dispatch(getAllOrganizations({ page: 1, limit: 1000, sortOrder: "asc" }));
        }
    }, [modalState.editUser, modalState.retrieveUser, dispatch]);

    // const handleUpdateUser = async (values: any) => {
    //     if (!selectedUserId) return;

    //     try {
    //         const resultAction = await dispatch(
    //          updateUser({ id: selectedUserId, data: values })
    //         );

    //         if (updateUser.fulfilled.match(resultAction)) {
    //             toast.success(t('users.messages.success.updateUser'));
    //             handleModal("editUser", false);

    //             await dispatch(getAllUsers({ page: 1, limit: 10, sortOrder: 'asc' }));
    //             await dispatch(getUserById({ id: selectedUserId }));
    //             } else {
    //             toast.error(t('users.messages.error.updateUser'));
    //         }
    //     } catch (err) {
    //         toast.error((err as string) || t('users.messages.error.updateUser'));
    //     }
    // };

    const handleDeleteUser = (record: UserTableDataType) => {
        const user = users.find((u) => u.id === record.key) ?? null;
        if (user) {
            setSelectedUserId(user.id);
            setModalState((prev) => ({
            ...prev,
            deleteUser: true,
            userData: user,
            }));
        }
    };

    const confirmDeleteUser = async () => {
        if (!modalState.userData) return;

        try {
            const resultAction = await dispatch(
            deleteUser({ id: modalState.userData.id })
            );

            if (deleteUser.fulfilled.match(resultAction)) {
                toast.success(t('users.messages.success.deleteUser'));
                handleModal("deleteUser", false);

                await dispatch(getAllUsers({ page: 1, limit: 10, sortOrder: "asc" }));
            } else {
                toast.error(t('users.messages.error.deleteUser'));
            }
        } catch (err) {
            toast.error((err as string) || t('users.messages.error.deleteUser'));
        }
    };

    const roleOption = [
        { value: "superadmin", label: t('users.userRole.superadmin') },
        { value: "admin", label: t('users.userRole.admin') },
        { value: "operator", label: t('users.userRole.operator') },
    ];

    // const statusOption = [
    //     { value: "active", label: t('users.status.active') },
    //     { value: "inactive", label: t('users.status.inactive') },
    // ]

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        if (value.trim().length > 0) {
            dispatch(searchUsers({ query: value, page: 1, limit: 10, sortOrder: 'asc' }));
        } else {
            dispatch(getAllUsers({ page: 1, limit: 10, sortOrder: 'asc' }));
        }
    };


    const handleTableChange = (pagination: any) => {
        dispatch(getAllUsers({
            page: pagination.current,
            limit: pagination.pageSize,
            sortOrder: 'asc',
        }));
    };

  return (
    <MainLayout>
        <Heading title={t('users.title')} subtitle={t('users.subtitle')} totalAmount='100'>
            <CustomButton onClick={() => handleModal('addUser', true)}>{t('users.btnAdd')}</CustomButton>
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
                                        placeholder={t('search.byName')}
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
                    <ComponentTable<UserTableDataType>
                        columns={UsersTableColumns(t, handleRowClick)}
                        data={UsersData}
                        onRowClick={(record) => handleRowClick("User", "retrieve", record)}
                        pagination={{
                            current: dataPage || 1,
                            pageSize: dataLimit || 10,
                            total: dataTotal || 0,
                            onChange: (newPage, newLimit) => {
                            dispatch(getAllUsers({ page: newPage, limit: newLimit, sortOrder: "asc" }));
                            },
                        }}
                    />
                </div>
            </div>
        </div>
        <ModalWindow titleAction={t('users.modalWindow.adding')} title={t('users.modalWindow.user')} openModal={modalState.addUser} closeModal={() => handleModal('addUser', false)}>
            <FormComponent onFinish={handleRegisterUser}>
                <div className="form-inputs">
                    <Form.Item className="input" name="firstName" label={t('users.addUserForm.label.firstName')} >
                        <Input className="input" size='large' placeholder={t('users.addUserForm.placeholder.firstName')} />
                    </Form.Item>
                    <Form.Item className="input" name="lastName" label={t('users.addUserForm.label.lastName')}>
                        <Input className="input" size='large' placeholder={t('users.addUserForm.placeholder.lastName')} />
                    </Form.Item>
                </div>
                <div className="form-inputs">
                    <Form.Item
                        className="input"
                        name="phone"
                        label={t('users.addUserForm.label.phone')}
                        // rules={[{ required: true, message: "Введите номер телефона" }]}
                    >
                        <PhoneInput />
                    </Form.Item>
                    <Form.Item className="input" name="email" label={t('users.addUserForm.label.email')}>
                        <Input className="input" size='large' placeholder={t('users.addUserForm.placeholder.email')} />
                    </Form.Item>
                </div>
                <div className="form-inputs">
                    <Form.Item className="input" name="role" label={t('users.addUserForm.label.role')}  >
                        <Select className='input' size="large" options={roleOption} placeholder={t('users.addUserForm.placeholder.role')}/>
                    </Form.Item>
                    <Form.Item className="input" name="password" label={t('users.addUserForm.label.password')} >
                        <Input className="input" size='large' placeholder={t('users.addUserForm.placeholder.password')} />
                    </Form.Item>
                </div>
                <CustomButton type="submit">{t('btn.create')}</CustomButton>
            </FormComponent>
        </ModalWindow>
        {/* {userById && selectedUserId && (
            <ModalWindow
                titleAction={t('users.modalWindow.editing')}
                title={t('users.modalWindow.user')}
                openModal={modalState.editUser}
                closeModal={() => handleModal("editUser", false)}
            >
                <FormComponent
                    form={form}
                    onFinish={(values) => {
                        handleUpdateUser(values);
                    }}
                >
                    <div className="form-inputs">
                        <Form.Item className="input" name="firstName" label={t('users.addUserForm.label.firstName')}  initialValue={userById.firstName}>
                            <Input className="input" size="large" placeholder={t('users.addUserForm.placeholder.firstName')}  />
                        </Form.Item>
                        <Form.Item className="input" name="lastName" label={t('users.addUserForm.label.lastName')} initialValue={userById.lastName}>
                            <Input className="input" size="large" placeholder={t('users.addUserForm.placeholder.lastName')}  />
                        </Form.Item>
                    </div>
                    <div className="form-inputs">
                        <Form.Item className="input" name="phone" label={t('users.addUserForm.label.phone')}  initialValue={userById.phone}>
                            <PhoneInput />
                        </Form.Item>
                        <Form.Item className="input" name="email" label={t('users.addUserForm.label.email')}  initialValue={userById.email}>
                            <Input className="input" size="large" placeholder={t('users.addUserForm.placeholder.email')}  />
                        </Form.Item>
                    </div>
                    <div className="form-inputs">
                         <Form.Item className="input" name="status" label="Статус" >
                            <Select className='input' size="large" defaultValue={userById.status} options={statusOption}/>
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
            </ModalWindow>
        )} */}
        <ModalWindow
            titleAction={t('users.modalWindow.deletion')}
            title={t('users.modalWindow.user')}
            openModal={modalState.deleteUser}
            closeModal={() => handleModal("deleteUser", false)}
            classDangerName='danger-title'
            >
            <div className="delete-modal">
                <div className="delete-modal-title">
                    <p className='title'>
                        {t('users.deleteUserQuestion')}: {" "}
                    </p>
                    <p className="subtitle">{modalState.userData?.firstName} {modalState.userData?.lastName} ? </p>
                </div>
                <div className="delete-modal-btns">
                    <CustomButton className="danger" onClick={confirmDeleteUser}>
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

export default Users