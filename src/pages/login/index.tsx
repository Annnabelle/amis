import type { LoginForm } from '../../types/users';
import { Form, Input } from 'antd';
import { useAppDispatch } from '../../store';
import { Login } from '../../store/users';
import mainBG from '../../assets/main-bg.png';
import FormComponent from '../../components/formComponent';
import Button from '../../components/button';
import useFormInstance from 'antd/es/form/hooks/useFormInstance';
import './styles.sass';
import { toast } from 'react-toastify';

const LoginPage = () => {
    const form = useFormInstance();
    const dispatch = useAppDispatch();
    const onFinish = (values: LoginForm) => {
        // dispatch(Login(values));
        dispatch(Login(values)).unwrap()
            .then(() => {
                toast.success('Успешный вход');
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
                            <Form.Item label="Логин" className='form-item'  name="email" rules={[{ required: true, message: 'Это поле обязательно для заполнения' }]}>
                                <Input placeholder="Введите логин" className='input' />
                            </Form.Item>
                            <Form.Item label="Пароль" className='form-item' name="password" rules={[{ required: true, message: 'Это поле обязательно для заполнения' }]}>
                                <Input placeholder="Введите пароль" className='input'/>
                            </Form.Item>
                            <div className="form-item">
                                <Button type="submit" className='btn-submit'>
                                    Войти   
                                </Button>
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