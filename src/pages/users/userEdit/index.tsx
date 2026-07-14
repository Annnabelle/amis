import { Form, Input, Select, Spin } from 'antd'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'
import { getUserById, updateUser } from 'entities/users/model'
import { useAppDispatch, useAppSelector } from 'app/store'
import { useNavigationBack } from 'shared/lib'
import { toast } from 'react-toastify'
import MainLayout from 'shared/ui/layout'
import Heading from 'shared/ui/mainHeading'
import FormComponent from 'shared/ui/formComponent'
import CustomButton from 'shared/ui/button'
import PhoneInput from 'shared/ui/phoneInput'
import { useCan } from 'entities/access/lib';
import { endpointAccessMap } from 'shared/config/endpointAccessMap';

const UsersEdit = () => {
    const { id } = useParams();
    const { t } = useTranslation();
    const dispatch = useAppDispatch();
    const canListCompanies = useCan(endpointAccessMap.companiesList);
    const userById = useAppSelector((state) => state.users.userById);
    const [form] = Form.useForm()
    const isUserLoading = useAppSelector((state) => state.users.isLoading);
    const navigateBack = useNavigationBack();
    const [isInitialLoading, setIsInitialLoading] = useState(true);

    useEffect(() => {
        if (id) {
            // dispatch(clearUserById());
            dispatch(getUserById({ id })).finally(() => setIsInitialLoading(false));
        }
    }, [dispatch, id]);

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
        <FormComponent
            form={form}
            onFinish={(values) => {
                handleUpdateUser(values);
            }}
            initialValues={userById}
        >
        <Heading 
            title={
                !isInitialLoading 
                ? `${t('users.modalWindow.editing')} ${t('users.modalWindow.user')}: ${userById?.firstName || ""}`
                : t('users.modalWindow.editing')
            } 
            subtitle={t('organizations.subtitle')}>
            <div className="btns-group">
                <CustomButton type="submit">{t('btn.save')} </CustomButton>
                <CustomButton onClick={() => navigateBack('/users')}>{t('btn.back')}</CustomButton>
            </div>
        </Heading>
        <div className="box">
            <div className="box-container">
                <div className="box-container-items">
                    <div className="box-container-items-item">
                        {userById && (
                            <>
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
                                {canListCompanies && (
                                <div className="form-inputs">
                                    <Form.Item className="input" name="status" label="Статус" >
                                        <Select className='input' size="large" options={statusOption}/>
                                    </Form.Item>
                                </div>
                                )}
                                <CustomButton className="outline" type="submit">{t('btn.save')} </CustomButton>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>

    </FormComponent>
    </MainLayout>
  )
}

export default UsersEdit


