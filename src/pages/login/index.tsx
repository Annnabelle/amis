import type { LoginForm } from 'entities/users/types';
import { Form, Input } from 'antd';
import {useAppDispatch, useAppSelector} from 'app/store';
import { Login } from 'entities/users/model';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import mainBG from 'shared/assets/bg-black.png';
import FormComponent from 'shared/ui/formComponent';
import CustomButton from 'shared/ui/button';
import useFormInstance from 'antd/es/form/hooks/useFormInstance';
import './styles.sass';
import './styles.sass';
import {useEffect} from "react";

const LoginPage = () => {
    const form = useFormInstance();
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const isAuthenticated = useAppSelector(state => state.users.isAuthenticated);
    const { t } = useTranslation();
    const onFinish = (values: LoginForm) => {
        dispatch(Login(values)).unwrap()
            .then(() => {
                toast.success(t('login.messages.successLogin'));

            })
            .catch((error) => {
                toast.error(t('login.messages.errorLogin'));
                console.error(error);
            }); 
    };

    useEffect(() => {
        if (isAuthenticated) {
            navigate('/organization');
        }
    }, [isAuthenticated, navigate]);


  return (
    <div className="login-page">
        <div className="login-page-background">
            <img className='img' src={mainBG} alt="mainBG" />
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
                                <CustomButton type="submit" className='btn-submit'>
                                    {t('login.btn.signIn')}    
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


