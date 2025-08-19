import { Form, Input, Select } from 'antd'
import { UsersTableColumns } from '../../tableData/users'
import { IoSearch } from 'react-icons/io5'
import { useAppDispatch, useAppSelector } from '../../store'
import { toast } from 'react-toastify'
import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { deleteUser, getAllUsers, getUserById, registerUser, updateUser } from '../../store/users'
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

const Users = () => {
    const { t, i18n } = useTranslation();
    const dispatch = useAppDispatch()
    const users = useAppSelector((state) => state.users.users)
    const dataLimit = useAppSelector((state) => state.users.limit)
    const dataPage = useAppSelector((state) => state.users.page)
    const dataTotal = useAppSelector((state) => state.users.total)
    const userById = useAppSelector((state) => state.users.userById)

    const [form] = Form.useForm()

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

    useEffect(() => {
        dispatch(getAllUsers({
            page: 1,
            limit: 10,
            sortOrder: 'asc',
        })) 
    }, [dispatch])

   const UsersData = useMemo(() => {
        return users.map((user, index) => ({
            key: user.id,                
            number: index + 1,         
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            role: user.role?.name.en || 'Без роли',
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

     const handleRowClick = (type: 'User', action: 'retrieve' | 'edit' | 'delete', record: UserTableDataType) => {
        console.log(`Clicked on ${type}, action: ${action}, record:`, record);
        if (type === 'User'){
            const user = users.find((user) => user.id === record.key) ?? null
            setSelectedUserId(record.key);

            setModalState((prev) => ({
                ...prev,
                [`${action}${type}`]: true,
                userData: user
            }));
        }
    };

    useEffect(() => {
        if (selectedUserId){
            dispatch(getUserById({id: selectedUserId}))
        }
    }, [dispatch, selectedUserId])

    const handleEditUser = (record: UserTableDataType) => {
        const user = users.find((u) => u.id === record.key) ?? null;
        if (user) {
            setSelectedUserId(user.id);
            setModalState((prev) => ({
            ...prev,
            editUser: true,
            userData: user
            }));
        }
    };


    const handleUpdateUser = async (values: any) => {
        if (!selectedUserId) return;

        try {
            const resultAction = await dispatch(
             updateUser({ id: selectedUserId, data: values })
            );

            if (updateUser.fulfilled.match(resultAction)) {
                toast.success(t('users.messages.success.updateUser'));
                handleModal("editUser", false);

                await dispatch(getAllUsers({ page: 1, limit: 10, sortOrder: 'asc' }));
                await dispatch(getUserById({ id: selectedUserId }));
                } else {
                toast.error(t('users.messages.error.updateUser'));
            }
        } catch (err) {
            toast.error((err as string) || t('users.messages.error.updateUser'));
        }
    };

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

    const statusOption = [
        { value: "active", label: t('users.status.active') },
        { value: "inactive", label: t('users.status.inactive') },
    ]
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
                                    <Form.Item
                                        className="input"
                                        name="searchExpert"
                                    >
                                        <Input
                                            size="large"
                                            className='input'
                                            placeholder={t('search.byName')}
                                            suffix={<IoSearch />}
                                            allowClear
                                        />
                                    </Form.Item>
                                </div>
                                {/* <div className="form-inputs">
                                    <Form.Item
                                        className="input"
                                        name="searchExpert"
                                    >
                                        <Select
                                            size="large"
                                            className='input'
                                            placeholder='Выберите роль'
                                            options={chooseRole}
                                            allowClear
                                        />
                                    </Form.Item>
                                </div> */}
                        </div>
                    </div>
                </div>
                <div className="box-container-items">
                    <ComponentTable<UserTableDataType> 
                        columns={UsersTableColumns(handleEditUser, handleDeleteUser)}
                        data={UsersData}
                        onRowClick={(record) => handleRowClick('User', 'retrieve', record)}
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
        {userById && selectedUserId && (
            <ModalWindow titleAction={t('users.modalWindow.viewing')} title={t('users.modalWindow.user')} openModal={modalState.retrieveUser} closeModal={() => handleModal('retrieveUser', false)}>
                <FormComponent>
                    <div className="form-inputs">
                        <Form.Item className="input" name="firstName" label={t('users.addUserForm.label.firstName')}>
                            <Input className="input" size='large' placeholder={userById.firstName} disabled/>
                        </Form.Item>
                        <Form.Item className="input" name="lastName" label={t('users.addUserForm.label.lastName')}>
                            <Input className="input" size='large' placeholder={userById.lastName} disabled />
                        </Form.Item>
                    </div>
                    <div className="form-inputs">
                        <Form.Item
                            className="input"
                            name="phone"
                            label={t('users.addUserForm.label.phone')}
                        >
                            <Input className="input" size='large' placeholder={userById.phone} disabled />
                        </Form.Item>
                        <Form.Item className="input" name="email" label={t('users.addUserForm.label.email')}>
                            <Input className="input" size='large' placeholder={userById.email} disabled />
                        </Form.Item>
                    </div>
                    <div className="form-inputs">
                        <Form.Item className="input" name="role" label={t('users.addUserForm.label.role')} >
                            <Select className='input' size="large" options={roleOption} placeholder={userById.role?.name.ru} disabled/>
                        </Form.Item>
                    </div>
                </FormComponent>
            </ModalWindow>
        )}
        {userById && selectedUserId && (
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
                    <CustomButton type="submit">{t('btn.save')} </CustomButton>
                </FormComponent>
            </ModalWindow>
        )}
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