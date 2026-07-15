import type { LoginForm } from 'entities/users/types';
import {useEffect, useState} from "react";
import { Form, Input, Spin } from 'antd';
import {useAppDispatch, useAppSelector} from 'app/store';
import { Login } from 'entities/users/model';
import { clearAccess } from 'entities/access/model';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { resolveFallbackPath } from 'app/routes/PermissionRoute';
import lightMainBG from 'shared/assets/main-bg.png';
import darkMainBG from 'shared/assets/bg-black.png';
import FormComponent from 'shared/ui/formComponent';
import CustomButton from 'shared/ui/button';
import useFormInstance from 'antd/es/form/hooks/useFormInstance';
import { useTheme } from 'app/themeContext';
import './styles.sass';

const mobileToastPosition = () =>
    window.matchMedia('(max-width: 600px)').matches ? 'bottom-center' : undefined;

const isMobileViewport = () =>
    window.matchMedia('(max-width: 900px)').matches;

const LoginPage = () => {
    const form = useFormInstance();
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const isAuthenticated = useAppSelector(state => state.users.isAuthenticated);
    const access = useAppSelector(state => state.access.data);
    const accessLoading = useAppSelector(state => state.access.loading);
    const accessError = useAppSelector(state => state.access.error);
    const { t } = useTranslation();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { isDarkTheme } = useTheme();

    const onFinish = (values: LoginForm) => {
        if (isSubmitting) return;

        setIsSubmitting(true);
        dispatch(clearAccess());
        dispatch(Login(values)).unwrap()
            .then(() => {
                toast.success(t('login.messages.successLogin'), {
                    position: mobileToastPosition(),
                });
            })
            .catch(() => {
                toast.error(t('login.messages.errorLogin'));
                setIsSubmitting(false);
            }); 
    };

    useEffect(() => {
        if (!isAuthenticated || accessLoading) {
            return;
        }

        if (access) {
            navigate(resolveFallbackPath(access, { mobile: isMobileViewport() }), { replace: true });
            return;
        }

        if (accessError) {
            navigate('/welcome', { replace: true });
        }
    }, [access, accessError, accessLoading, isAuthenticated, navigate]);

    const loginBackground = isDarkTheme ? darkMainBG : lightMainBG;

  return (
    <div className="login-page">
        <div className="login-page-background">
            <img className='img' src={loginBackground} alt="login background" />
        </div>
        <div className="login-page-container">
            <div className="login-page-header">
                <h1 className="login-page-header-logo">AMIS</h1>
            </div>
            <div className="login-page-form-container">
                <div className="form-container">
                    <div className="form-items">
                        <div className="form-title">
                            <h3 className="title">{t('login.btn.login')}</h3>
                        </div>
                        <FormComponent onFinish={onFinish} form={form}>
                            <div className="form-inputs">
                                <Form.Item label={t('login.username')} className='input'  name="email" rules={[{ required: true, message: 'Это поле обязательно для заполнения' }]}>
                                    <Input placeholder={t('login.enterUserName')} className='input' size='large'/>
                                </Form.Item>
                                <Form.Item label={t('users.addUserForm.label.password')} className='input'  name="password" rules={[{ required: true, message: 'Это поле обязательно для заполнения' }]}>
                                    <Input.Password type="password" placeholder={t('users.addUserForm.placeholder.password')} className='input' size='large'/>
                                </Form.Item>
                            </div>
                            <div className="form-inputs">
                                <CustomButton type="submit" className='btn-submit' disabled={isSubmitting}>
                                    {isSubmitting ? <><Spin size="small" /> {t('login.btn.signIn')}</> : t('login.btn.signIn')}
                                </CustomButton>
                            </div>
                        </FormComponent>
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}

export default LoginPage


