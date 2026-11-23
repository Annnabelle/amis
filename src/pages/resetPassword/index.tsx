import { useState } from 'react';
import { routes } from "shared/config/routes";
import { Form, Input } from 'antd';
import { Link, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { useResetPasswordMutation } from 'entities/users/api';
import { getApiErrorMessage } from 'shared/api';
import AuthShell from 'pages/auth/authShell';
import FormComponent from 'shared/ui/formComponent';
import CustomButton from 'shared/ui/button';

type ResetPasswordFormValues = {
  password: string;
  confirmPassword: string;
};

const ResetPasswordPage = () => {
  const { t } = useTranslation();
  const [resetPassword] = useResetPasswordMutation();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') ?? '';
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const onFinish = ({ password }: ResetPasswordFormValues) => {
    if (isSubmitting || !token) return;

    setIsSubmitting(true);
    resetPassword({ token, password })
      .unwrap()
      .then(() => setDone(true))
      .catch((error: unknown) => {
        toast.error(getApiErrorMessage(error, t('auth.resetPassword.error')));
      })
      .finally(() => setIsSubmitting(false));
  };

  if (!token) {
    return (
      <AuthShell
        title={t('auth.resetPassword.errorTitle')}
        footer={<Link to={routes.forgotPassword()}>{t('auth.forgotPassword.title')}</Link>}
      >
        <p>{t('auth.errors.missingToken')}</p>
      </AuthShell>
    );
  }

  if (done) {
    return (
      <AuthShell
        title={t('auth.resetPassword.successTitle')}
        footer={<Link to={routes.login()}>{t('auth.backToLogin')}</Link>}
      >
        <p>{t('auth.resetPassword.successDescription')}</p>
        <Link to={routes.login()}>
          <CustomButton>{t('auth.goToLogin')}</CustomButton>
        </Link>
      </AuthShell>
    );
  }

  return (
    <AuthShell
      title={t('auth.resetPassword.title')}
      subtitle={t('auth.resetPassword.subtitle')}
    >
      <FormComponent onFinish={onFinish}>
        <div className="form-inputs">
          <Form.Item
            className="input"
            name="password"
            label={t('auth.resetPassword.label.password')}
            rules={[
              { required: true, message: t('users.addUserForm.required.password') },
              { min: 6, message: t('auth.passwordMinLength') },
            ]}
          >
            <Input.Password
              type="password"
              className="input"
              size="large"
              autoComplete="new-password"
              placeholder={t('auth.resetPassword.placeholder.password')}
            />
          </Form.Item>

          <Form.Item
            className="input"
            name="confirmPassword"
            label={t('auth.resetPassword.label.confirmPassword')}
            dependencies={['password']}
            rules={[
              { required: true, message: t('auth.resetPassword.required.confirmPassword') },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error(t('auth.resetPassword.passwordsDontMatch')));
                },
              }),
            ]}
          >
            <Input.Password
              type="password"
              className="input"
              size="large"
              autoComplete="new-password"
              placeholder={t('auth.resetPassword.placeholder.confirmPassword')}
            />
          </Form.Item>
        </div>

        <CustomButton type="submit" loading={isSubmitting} disabled={isSubmitting}>
          {t('auth.resetPassword.submit')}
        </CustomButton>
      </FormComponent>
    </AuthShell>
  );
};

export default ResetPasswordPage;
