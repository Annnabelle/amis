import { Form, Input, Select, Tag } from 'antd'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'
import {getUserById } from '../../../store/users'
import { useAppDispatch, useAppSelector } from '../../../store'
import MainLayout from '../../../components/layout'
import Heading from '../../../components/mainHeading'
import FormComponent from '../../../components/formComponent'
import CustomButton from '../../../components/button'
import { useNavigationBack } from '../../../utils/utils'

const UsersRetrieve = () => {
    const { id } = useParams();
    const { t } = useTranslation();
    const dispatch = useAppDispatch();
    const userById = useAppSelector((state) => state.users.userById);
    const organizations = useAppSelector((state) => state.organizations.organizations);
    const navigateBack = useNavigationBack();
    useEffect(() => {
        if (id) {
            dispatch(getUserById({ id }));
        }
    }, [dispatch, id]);
   

    const roleOption = [
        { value: "superadmin", label: t('users.userRole.superadmin') },
        { value: "admin", label: t('users.userRole.admin') },
        { value: "operator", label: t('users.userRole.operator') },
    ];

  return (
    <MainLayout>
        <Heading title={t('users.modalWindow.viewing') + " " + t('users.modalWindow.user') + ":" + " " + userById?.firstName} subtitle={t('organizations.subtitle')} totalAmount='100'>
            <CustomButton onClick={() => navigateBack('/users')}>{t('btn.back')}</CustomButton>
        </Heading>
        <div className="box">
            <div className="box-container">
                <div className="box-container-items">
                    <div className="box-container-items-item">
                        {userById  && (
                            <FormComponent>
                                <div className="form-inputs form-inputs-row">
                                    {userById.firstName && (
                                        <Form.Item className="input" name="firstName" label={t('users.addUserForm.label.firstName')}>
                                            <Input className="input" size='large' placeholder={userById.firstName} disabled/>
                                        </Form.Item>
                                    )}
                                    {userById.lastName && (
                                        <Form.Item className="input" name="lastName" label={t('users.addUserForm.label.lastName')}>
                                            <Input className="input" size='large' placeholder={userById.lastName} disabled />
                                        </Form.Item>
                                    )}
                                </div>
                                <div className="form-inputs form-inputs-row">
                                    {userById.phone && (
                                        <Form.Item
                                            className="input"
                                            name="phone"
                                            label={t('users.addUserForm.label.phone')}
                                        >
                                            <Input className="input" size='large' placeholder={userById.phone} disabled />
                                        </Form.Item>
                                    )}
                                    {userById.email && (
                                        <Form.Item className="input" name="email" label={t('users.addUserForm.label.email')}>
                                            <Input className="input" size='large' placeholder={userById.email} disabled />
                                        </Form.Item>
                                    )}
                                </div>
                                {userById.role?.name && (
                                    <div className="form-inputs">
                                        <Form.Item className="input" name="role" label={t('users.addUserForm.label.role')} >
                                            <Select className='input' size="large" options={roleOption} placeholder={userById.role?.name.ru} disabled/>
                                        </Form.Item>
                                    </div>
                                )}
                                {userById.companyIds && (
                                    <div className="form-inputs">
                                        <Form.Item
                                            className="input"
                                            label={t("users.companies")}
                                        >
                                            {organizations?.map((org) =>
                                                userById.companyIds?.includes(org.id) ? (
                                                    <Tag key={org.id}>{org.displayName}</Tag>
                                                ) : null
                                            )}
                                        </Form.Item>
                                    </div>
                                )}
                            </FormComponent>
                        )}
                    </div>
                </div>
            </div>
        </div>

    </MainLayout>
  )
}

export default UsersRetrieve