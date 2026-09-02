import { useState } from 'react';
import { Form, Input } from 'antd';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { LuMailCheck } from 'react-icons/lu';
import { useAppDispatch } from 'app/store';
import { forgotPassword, type AccountActionError } from 'entities/users/model';
import AuthShell from 'pages/auth/authShell';
import FormComponent from 'shared/ui/formComponent';
import CustomButton from 'shared/ui/button';

type ForgotPasswordFormValues = {
  email: string;
};

const ForgotPasswordPage = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState<string | null>(null);

  const onFinish = ({ email }: ForgotPasswordFormValues) => {
    if (isSubmitting) return;

    setIsSubmitting(true);
    dispatch(forgotPassword({ email }))
      .unwrap()
      .then(() => {
        setSubmittedEmail(email.trim());
      })
      .catch((error: AccountActionError) => {
        toast.error(error?.message || t('common.error'));
      })
      .finally(() => setIsSubmitting(false));
  };

  if (submittedEmail) {
    return (
      <AuthShell
        title={t('auth.forgotPassword.checkInbox.title')}
        footer={<Link to="/">{t('auth.backToLogin')}</Link>}
      >
        <div className="auth-message">
          <LuMailCheck className="auth-message-icon" />
          <p>{t('auth.forgotPassword.checkInbox.intro')}</p>
          <p className="auth-message-email">{submittedEmail}</p>
          <p>{t('auth.forgotPassword.checkInbox.hint')}</p>
        </div>
      </AuthShell>
    );
  }

  return (
    <AuthShell
      title={t('auth.forgotPassword.title')}
      subtitle={t('auth.forgotPassword.subtitle')}
      footer={<Link to="/">{t('auth.backToLogin')}</Link>}
    >
      <FormComponent onFinish={onFinish}>
        <div className="form-inputs">
          <Form.Item
            className="input"
            name="email"
            label={t('auth.forgotPassword.emailLabel')}
            rules={[
              { required: true, message: t('users.addUserForm.required.email') },
              { type: 'email', message: t('users.addUserForm.pattern.email') },
            ]}
          >
            <Input
              className="input"
              size="large"
              inputMode="email"
              autoComplete="email"
              placeholder={t('users.addUserForm.placeholder.email')}
            />
          </Form.Item>
        </div>

        <CustomButton type="submit" loading={isSubmitting} disabled={isSubmitting}>
          {t('auth.forgotPassword.submit')}
        </CustomButton>
      </FormComponent>
    </AuthShell>
  );
};

export default ForgotPasswordPage;
