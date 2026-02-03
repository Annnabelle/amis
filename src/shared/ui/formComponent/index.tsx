import React, { type ReactNode } from 'react';
import { Form, type FormInstance } from 'antd';
import './styles.sass';

interface FormComponentProps {
  children: ReactNode;
  onFinish?: (values: any) => void;
  onValuesChange?: (changedValues: any, allValues: any) => void; // 👈 добавляем
  form?: FormInstance;
  initialValues?: any;
}

const FormComponent: React.FC<FormComponentProps> = ({
  children,
  onFinish,
  onValuesChange, // 👈 добавляем
  form,
  initialValues,
}) => {
  const [defaultForm] = Form.useForm();
  const usedForm = form ?? defaultForm;

  return (
    <Form
      form={usedForm}
      layout="vertical"
      onFinish={onFinish}
      onValuesChange={onValuesChange} // 👈 прокидываем дальше
      className="form"
      initialValues={initialValues}
    >
      {children}
    </Form>
  );
};

export default FormComponent;



