import { Form, Input, Tag } from 'antd'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'
import {getUserById } from 'entities/users/model'
import { useAppDispatch, useAppSelector } from 'app/store'
import MainLayout from 'shared/ui/layout'
import Heading from 'shared/ui/mainHeading'
import FormComponent from 'shared/ui/formComponent'
import CustomButton from 'shared/ui/button'
import { FormatUzbekPhoneNumber, useNavigationBack } from 'shared/lib'

const UsersRetrieve = () => {
    const { id } = useParams();
    const { t } = useTranslation();
    const dispatch = useAppDispatch();
    const userById = useAppSelector((state) => state.users.userById);
    const organizations = useAppSelector((state) => state.organizations.organizations);
    const navigateBack = useNavigationBack();
    const userOrganizations = userById
        ? organizations.filter((org) => userById.companyIds.includes(org.id))
        : [];

    useEffect(() => {
        if (id) {
            dispatch(getUserById({ id }));
        }
    }, [dispatch, id]);
   

  return (
    <MainLayout>
        <Heading title={t('users.modalWindow.viewing') + " " + t('users.modalWindow.user') + ":" + " " + userById?.firstName} subtitle={t('organizations.subtitle')}>
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
                                            <Input className="input" size='large' placeholder={FormatUzbekPhoneNumber(userById.phone)} disabled />
                                        </Form.Item>
                                    )}
                                    {userById.email && (
                                        <Form.Item className="input" name="email" label={t('users.addUserForm.label.email')}>
                                            <Input className="input" size='large' placeholder={userById.email} disabled />
                                        </Form.Item>
                                    )}
                                </div>
                                {userOrganizations.length > 0 && (
                                    <div className="form-inputs">
                                        <Form.Item
                                            className="input"
                                            label={t("users.companies")}
                                        >
                                            {userOrganizations.map((org) => (
                                                <Tag key={org.id}>{org.displayName}</Tag>
                                            ))}
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


