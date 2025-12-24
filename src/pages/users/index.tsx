import { Form, Input, Select } from 'antd'
import { UsersTableColumns } from '../../tableData/users'
import { IoSearch } from 'react-icons/io5'
import { useAppDispatch, useAppSelector } from '../../store'
import { toast } from 'react-toastify'
import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { deleteUser, getAllUsers, getUserById, registerUser, searchUsers } from '../../store/users'
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
import { getAllOrganizations } from '../../store/organization'
import { useNavigate } from 'react-router-dom'

const Users = () => {
    const { t, i18n } = useTranslation();
    const dispatch = useAppDispatch()
    const navigate = useNavigate();
    const users = useAppSelector((state) => state.users.users)
    const dataLimit = useAppSelector((state) => state.users.limit)
    const dataPage = useAppSelector((state) => state.users.page)
    const dataTotal = useAppSelector((state) => state.users.total)

    const [form] = Form.useForm()

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
            status: t(`statuses.${user.status}`), 
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

    useEffect(() => {
        if (modalState.editUser || modalState.retrieveUser) {
            dispatch(getAllOrganizations({ page: 1, limit: 1000, sortOrder: "asc" }));
        }
    }, [modalState.editUser, modalState.retrieveUser, dispatch]);

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


  return (
    <MainLayout>
        <Heading title={t('users.title')} subtitle={t('users.subtitle')} totalAmount='100'>
            <div className="btns-group">
                <CustomButton className='outline' onClick={() => navigate(`/audit-logs`)}>{t('navigation.audit')}</CustomButton>
                <CustomButton onClick={() => handleModal('addUser', true)}>{t('users.btnAdd')}</CustomButton>
            </div>
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
        <ModalWindow  className="modal-large" titleAction={t('users.modalWindow.adding')} title={t('users.modalWindow.user')} openModal={modalState.addUser} closeModal={() => handleModal('addUser', false)}>
            <FormComponent onFinish={handleRegisterUser}>
                <div className="form-inputs form-inputs-row">
                    <Form.Item
                        className="input"
                        name="firstName"
                        label={t('users.addUserForm.label.firstName')}
                        rules={[
                            { required: true, message: t('users.addUserForm.required.firstName') },
                        ]}
                    >
                    <Input
                        className="input"
                        size="large"
                        placeholder={t('users.addUserForm.placeholder.firstName')}
                    />
                    </Form.Item>

                    <Form.Item
                        className="input"
                        name="lastName"
                        label={t('users.addUserForm.label.lastName')}
                        rules={[
                            { required: true, message: t('users.addUserForm.required.lastName') },
                        ]}
                    >
                    <Input
                        className="input"
                        size="large"
                        placeholder={t('users.addUserForm.placeholder.lastName')}
                    />
                    </Form.Item>
                </div>

                <div className="form-inputs form-inputs-row">
                    <Form.Item
                        className="input"
                        name="phone"
                        label={t('users.addUserForm.label.phone')}
                        rules={[
                            { required: true, message: t('users.addUserForm.required.phone') },
                            { pattern: /^\+?[0-9]{9,15}$/, message: t('users.addUserForm.pattern.phone') }
                        ]}
                    >
                    <PhoneInput />
                    </Form.Item>

                    <Form.Item
                        className="input"
                        name="email"
                        label={t('users.addUserForm.label.email')}
                        rules={[
                            { required: true, message: t('users.addUserForm.required.email') },
                            { type: "email", message: t('users.addUserForm.pattern.email') }
                        ]}
                    >
                    <Input
                        className="input"
                        size="large"
                        placeholder={t('users.addUserForm.placeholder.email')}
                    />
                    </Form.Item>
                </div>

                <div className="form-inputs form-inputs-row">
                    <Form.Item
                        className="input"
                        name="role"
                        label={t('users.addUserForm.label.role')}
                        rules={[
                            { required: true, message: t('users.addUserForm.required.role') }
                        ]}
                    >
                    <Select
                        className="input"
                        size="large"
                        options={roleOption}
                        placeholder={t('users.addUserForm.placeholder.role')}
                    />
                    </Form.Item>

                    <Form.Item
                        className="input"
                        name="password"
                        label={t('users.addUserForm.label.password')}
                        rules={[
                            { required: true, message: t('users.addUserForm.required.password') },
                            { min: 8, message: t('users.addUserForm.pattern.passwordMinLength') }
                        ]}
                    >
                    <Input.Password
                        className="input"
                        size="large"
                        placeholder={t('users.addUserForm.placeholder.password')}
                    />
                    </Form.Item>
                </div>

                <CustomButton type="submit">{t('btn.create')}</CustomButton>
            </FormComponent>
        </ModalWindow>
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