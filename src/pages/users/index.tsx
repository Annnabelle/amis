import { Form, Input, Select } from 'antd'
import type { UserTableDataType } from '../../tableData/users/types'
import { UsersTableColumns } from '../../tableData/users'
import { IoSearch } from 'react-icons/io5'
import MainLayout from '../../components/layout'
import Heading from '../../components/mainHeading'
import ComponentTable from '../../components/table'
import { useAppDispatch, useAppSelector } from '../../store'
import { useEffect, useMemo, useState } from 'react'
import { deleteUser, getAllUsers, getUserById, registerUser, updateUser } from '../../store/users'
import dayjs from 'dayjs'
import CustomButton from '../../components/button'
import type { AddUserForm, UserResponse } from '../../types/users'
import ModalWindow from '../../components/modalWindow'
import FormComponent from '../../components/formComponent'
import { toast } from 'react-toastify'
import type { Language } from '../../dtos'
import PhoneInput from '../../components/phoneInput'

const Users = () => {
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
            key: user.id,                // настоящий id (для действий, запросов и т.д.)
            number: index + 1,           // порядковый номер (для отображения в таблице)
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
                toast.success('User created successfully');
                setTimeout(() => {
                    handleModal('addUser', false);
                    window.location.reload(); 
                }, 1000); 
            } else {
                toast.error('error?)');
            }
        } catch (err) {
        toast.error((err as string) || 'error 2?_');
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
                toast.success("Пользователь успешно обновлен");
                handleModal("editUser", false);

                await dispatch(getAllUsers({ page: 1, limit: 10, sortOrder: 'asc' }));
                await dispatch(getUserById({ id: selectedUserId })); // 🔑 обновляем данные выбранного юзера
                } else {
                toast.error("Ошибка при обновлении пользователя");
            }
        } catch (err) {
            toast.error((err as string) || "Ошибка при обновлении");
        }
    };



    // внутри Users компонента

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
                toast.success("Пользователь успешно удален");
                handleModal("deleteUser", false);

                // переполучаем список юзеров
                await dispatch(getAllUsers({ page: 1, limit: 10, sortOrder: "asc" }));
            } else {
                toast.error("Ошибка при удалении пользователя");
            }
        } catch (err) {
            toast.error((err as string) || "Ошибка при удалении");
        }
    };



    const roleOption = [
        { value: "admin", label: 'Администратор'},
        { value: "intl_officer", label: "Сотрудник международного управления"},
        { value: "junior_intl_officer", label: 'Младший сотрудник международного управления' },
        { value: "manager", label: 'Руководство'},
        { value: "employee", label: 'Другие сотрудники'},
    ];

    const statusOption = [
        { value: "active", label: 'Активный' },
        { value: "inactive", label: 'Неактивный' },
    ]
  return (
    <MainLayout>
        <Heading title="Пользователи">
            <CustomButton onClick={() => handleModal('addUser', true)}>Добавить</CustomButton>
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
                                            placeholder='Поиск по имени'
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
        <ModalWindow titleAction='Добавление' title='юзера' openModal={modalState.addUser} closeModal={() => handleModal('addUser', false)}>
            <FormComponent onFinish={handleRegisterUser}>
                <div className="form-inputs">
                    <Form.Item className="input" name="firstName" label="Имя" >
                        <Input className="input" size='large' placeholder='введите имя'/>
                    </Form.Item>
                    <Form.Item className="input" name="lastName" label="Фамилия">
                        <Input className="input" size='large' placeholder='введите фамилию' />
                    </Form.Item>
                </div>
                <div className="form-inputs">
                    <Form.Item
                        className="input"
                        name="phone"
                        label="Телефон"
                        // rules={[{ required: true, message: "Введите номер телефона" }]}
                    >
                        <PhoneInput />
                    </Form.Item>
                    <Form.Item className="input" name="email" label="Почта">
                        <Input className="input" size='large' placeholder='введите почту' />
                    </Form.Item>
                </div>
                <div className="form-inputs">
                    <Form.Item className="input" name="role" label="Роль" >
                        <Select className='input' size="large" options={roleOption} placeholder='выберите роль'/>
                    </Form.Item>
                    <Form.Item className="input" name="password" label="Пароль">
                        <Input className="input" size='large' placeholder='придумайте пароль' />
                    </Form.Item>
                </div>
                <CustomButton type="submit">Создать</CustomButton>
            </FormComponent>
        </ModalWindow>
        {userById && selectedUserId && (
            <ModalWindow titleAction='Просмотр' title='пользователя' openModal={modalState.retrieveUser} closeModal={() => handleModal('retrieveUser', false)}>
                <FormComponent>
                    <div className="form-inputs">
                        <Form.Item className="input" name="firstName" label="Имя">
                            <Input className="input" size='large' placeholder={userById.firstName} disabled/>
                        </Form.Item>
                        <Form.Item className="input" name="lastName" label="Фамилия">
                            <Input className="input" size='large' placeholder={userById.lastName} disabled />
                        </Form.Item>
                    </div>
                    <div className="form-inputs">
                        <Form.Item
                            className="input"
                            name="phone"
                            label="Телефон"
                        >
                            <Input className="input" size='large' placeholder={userById.phone} disabled />
                        </Form.Item>
                        <Form.Item className="input" name="email" label="Почта">
                            <Input className="input" size='large' placeholder={userById.email} disabled />
                        </Form.Item>
                    </div>
                    <div className="form-inputs">
                        <Form.Item className="input" name="role" label="Роль" >
                            <Select className='input' size="large" options={roleOption} placeholder={userById.role?.name.ru} disabled/>
                        </Form.Item>
                        <Form.Item className="input" name="status" label="Статус" >
                            <Select className='input' size="large" options={roleOption} placeholder={userById.status} disabled/>
                        </Form.Item>
                    </div>
                </FormComponent>
            </ModalWindow>
        )}
        {userById && selectedUserId && (
            <ModalWindow
                titleAction="Редактирование"
                title="пользователя"
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
                        <Form.Item className="input" name="firstName" label="Имя" initialValue={userById.firstName}>
                            <Input className="input" size="large" placeholder="Имя" />
                        </Form.Item>
                        <Form.Item className="input" name="lastName" label="Фамилия" initialValue={userById.lastName}>
                            <Input className="input" size="large" placeholder="Фамилия" />
                        </Form.Item>
                    </div>
                    <div className="form-inputs">
                        <Form.Item className="input" name="phone" label="Телефон" initialValue={userById.phone}>
                            <PhoneInput />
                        </Form.Item>
                        <Form.Item className="input" name="email" label="Почта" initialValue={userById.email}>
                            <Input className="input" size="large" placeholder="Почта" />
                        </Form.Item>
                    </div>
                    <div className="form-inputs">
                         <Form.Item className="input" name="status" label="Статус" >
                            <Select className='input' size="large" defaultValue={userById.status} options={statusOption}/>
                        </Form.Item>
                    </div>
                    <CustomButton type="submit">Сохранить</CustomButton>
                </FormComponent>
            </ModalWindow>
        )}
        <ModalWindow
            titleAction="Удаление"
            title="пользователя"
            openModal={modalState.deleteUser}
            closeModal={() => handleModal("deleteUser", false)}
            classDangerName='danger-title'
            >
            <div className="delete-modal">
                <div className="delete-modal-title">
                    <p className='title'>
                        Вы уверены, что хотите удалить пользователя: {" "}
                    </p>
                    <p className="subtitle">{modalState.userData?.firstName} {modalState.userData?.lastName} ? </p>
                </div>
                <div className="delete-modal-btns">
                    <CustomButton className="danger" onClick={confirmDeleteUser}>
                        Удалить
                    </CustomButton>
                    <CustomButton onClick={() => handleModal("deleteUser", false)} className="outline">
                        Отмена
                    </CustomButton>
                </div>
            </div>
        </ModalWindow>

    </MainLayout>
  )
}

export default Users