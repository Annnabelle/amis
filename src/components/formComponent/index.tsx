import React, { type ReactNode } from 'react';
import { Form, type FormInstance  } from 'antd';
import './styles.sass';

interface FormComponentProps {
    children: ReactNode;
    onFinish?: (values: any) => void;
    form?: FormInstance; 
    initialValues?: any;
}

const FormComponent: React.FC<FormComponentProps> = ({ children, onFinish,  form, initialValues  }) => {
    const [defaultForm] = Form.useForm();
    const usedForm = form ?? defaultForm;

    return (
        <Form form={usedForm} layout='vertical' onFinish={onFinish} className='form' initialValues={initialValues}>
            {children}
        </Form>
    );
};

export default FormComponent;