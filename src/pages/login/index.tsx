import type { LoginForm } from '../../types/users';
import { Form, Input } from 'antd';
import { useAppDispatch } from '../../store';
import { Login } from '../../store/users';
import mainBG from '../../assets/main-bg.png';
import FormComponent from '../../components/formComponent';
import CustomButton from '../../components/button';
import useFormInstance from 'antd/es/form/hooks/useFormInstance';
import './styles.sass';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
    const form = useFormInstance();
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const onFinish = (values: LoginForm) => {
        // dispatch(Login(values));
        dispatch(Login(values)).unwrap()
            .then(() => {
                toast.success('Успешный вход');
                setTimeout(() => {
                    navigate('/home');
                }, 1000); // Пауза в 1 секунду перед переходом

            })
            .catch((error) => {
                toast.error('Ошибка входа, проверьте логин и пароль');
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
                            <h3 className="title">Вход</h3>
                        </div>
                        <FormComponent onFinish={onFinish} formProps={form}>
                            <div className="form-inputs">
                                <Form.Item label="Логин" className='input'  name="email" rules={[{ required: true, message: 'Это поле обязательно для заполнения' }]}>
                                    <Input placeholder="Введите логин" className='input' size='large'/>
                                </Form.Item>
                                <Form.Item label="Пароль" className='input'  name="password" rules={[{ required: true, message: 'Это поле обязательно для заполнения' }]}>
                                    <Input placeholder="Введите пароль" className='input' size='large'/>
                                </Form.Item>
                            </div>
                            <div className="form-inputs">
                                <CustomButton type="submit" className='btn-submit'>
                                    Войти   
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