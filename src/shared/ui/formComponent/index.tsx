import { useEffect, type ReactNode } from 'react';
import { Form, type FormInstance, type FormProps } from 'antd';
import type { Store } from 'antd/es/form/interface';
import { useTranslation } from 'react-i18next';
import './styles.sass';

interface FormComponentProps<TValues extends Store = Store> {
  children: ReactNode;
  onFinish?: FormProps<TValues>['onFinish'];
  onValuesChange?: FormProps<TValues>['onValuesChange'];
  form?: FormInstance<TValues>;
  initialValues?: FormProps<TValues>['initialValues'];
}

const FormComponent = <TValues extends Store = Store>({
  children,
  onFinish,
  onValuesChange,
  form,
  initialValues,
}: FormComponentProps<TValues>) => {
  const { i18n } = useTranslation();
  const [defaultForm] = Form.useForm<TValues>();
  const usedForm = form ?? defaultForm;

  useEffect(() => {
    const erroredFieldNames = usedForm
      .getFieldsError()
      .filter(({ errors }) => errors.length > 0)
      .map(({ name }) => name);

    if (erroredFieldNames.length === 0) {
      return;
    }

    void usedForm.validateFields(erroredFieldNames).catch(() => undefined);
  }, [i18n.language, usedForm]);

  return (
    <Form<TValues>
      form={usedForm}
      layout="vertical"
      onFinish={onFinish}
      onValuesChange={onValuesChange}
      className="form"
      initialValues={initialValues}
    >
      {children}
    </Form>
  );
};

export default FormComponent;



