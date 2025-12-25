import type { LoginForm } from '../../types/users';
import { Form, Input } from 'antd';
import { useAppDispatch } from '../../store';
import { Login } from '../../store/users';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
// import mainBG from '../../assets/main-bg.png';
import mainBG from '../../assets/bg-black.png';
import FormComponent from '../../components/formComponent';
import CustomButton from '../../components/button';
import useFormInstance from 'antd/es/form/hooks/useFormInstance';
import './styles.sass';

const LoginPage = () => {
    const form = useFormInstance();
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { t } = useTranslation();
    const onFinish = (values: LoginForm) => {
        dispatch(Login(values)).unwrap()
            .then(() => {
                toast.success(t('login.messages.successLogin'));
                setTimeout(() => {
                    navigate('/home');
                }, 1000); 

            })
            .catch((error) => {
                toast.error(t('login.messages.errorLogin'));
                console.error(error);
            }); 
    };


  return (
    <div className="login-page">
        <div className="login-page-background">
            <img className='img' src={mainBG} alt="mainBG" />
        </div>
        <div className="login-page-container">
            <div className="login-page-header">
                <h1 className="login-page-header-logo">LOGO</h1>
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
                                    <Input placeholder={t('users.addUserForm.placeholder.password')} className='input' size='large'/>
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