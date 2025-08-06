import { Form, Input } from 'antd';
import mainBG from '../../assets/main-bg.png';
import './styles.sass';
import FormComponent from '../../components/formComponent';
import Button from '../../components/button';

const LoginPage = () => {

    const [form] = Form.useForm();

    const onFinish = (values: any) => {
        console.log('Received values:', values);
    }

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
                            <Form.Item label="Логин" className='form-item'>
                                <Input placeholder="Введите логин" className='input'/>
                            </Form.Item>
                            <Form.Item label="Пароль" className='form-item'>
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