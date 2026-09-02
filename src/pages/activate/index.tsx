import { useState } from 'react';
import { Form, Input } from 'antd';
import { Link, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { useAppDispatch } from 'app/store';
import { setPassword, type AccountActionError } from 'entities/users/model';
import AuthShell from 'pages/auth/authShell';
import FormComponent from 'shared/ui/formComponent';
import CustomButton from 'shared/ui/button';

type ActivateForm = {
  password: string;
  confirmPassword: string;
};

const ActivatePage = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') ?? '';
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const onFinish = (values: ActivateForm) => {
    if (isSubmitting || !token) return;

    setIsSubmitting(true);
    dispatch(setPassword({ token, password: values.password }))
      .unwrap()
      .then(() => setDone(true))
      .catch((error: AccountActionError) => {
        toast.error(error?.message ?? t('auth.activate.error'));
      })
      .finally(() => setIsSubmitting(false));
  };

  if (!token) {
    return (
      <AuthShell
        title={t('auth.activate.errorTitle')}
        footer={<Link to="/">{t('auth.backToLogin')}</Link>}
      >
        <p>{t('auth.errors.missingToken')}</p>
      </AuthShell>
    );
  }

  if (done) {
    return (
      <AuthShell
        title={t('auth.activate.successTitle')}
        footer={<Link to="/">{t('auth.backToLogin')}</Link>}
      >
        <p>{t('auth.activate.successDescription')}</p>
        <Link to="/">
          <CustomButton>{t('auth.goToLogin')}</CustomButton>
        </Link>
      </AuthShell>
    );
  }

  return (
    <AuthShell title={t('auth.activate.title')} subtitle={t('auth.activate.subtitle')}>
      <FormComponent onFinish={onFinish}>
        <div className="form-inputs">
          <Form.Item
            className="input"
            name="password"
            label={t('auth.activate.label.password')}
            rules={[
              { required: true, message: t('users.addUserForm.required.password') },
              { min: 6, message: t('users.addUserForm.pattern.passwordMinLength') },
            ]}
          >
            <Input.Password
              type="password"
              className="input"
              size="large"
              placeholder={t('users.addUserForm.placeholder.password')}
            />
          </Form.Item>

          <Form.Item
            className="input"
            name="confirmPassword"
            label={t('auth.activate.label.confirmPassword')}
            dependencies={['password']}
            rules={[
              { required: true, message: t('auth.activate.required.confirmPassword') },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error(t('auth.activate.passwordsDontMatch')));
                },
              }),
            ]}
          >
            <Input.Password
              type="password"
              className="input"
              size="large"
              placeholder={t('auth.activate.placeholder.confirmPassword')}
            />
          </Form.Item>
        </div>

        <CustomButton type="submit" loading={isSubmitting} disabled={isSubmitting}>
          {t('auth.activate.submit')}
        </CustomButton>
      </FormComponent>
    </AuthShell>
  );
};

export default ActivatePage;
