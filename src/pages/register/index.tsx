import { useState } from 'react';
import { Form, Input } from 'antd';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { useAppDispatch } from 'app/store';
import { registerAccount, type AccountActionError } from 'entities/users/model';
import type { RegisterForm } from 'entities/users/types';
import AuthShell from 'pages/auth/authShell';
import FormComponent from 'shared/ui/formComponent';
import CustomButton from 'shared/ui/button';
import PhoneInput from 'shared/ui/phoneInput';

const EMAIL_DELIVERY_FAILED = 10051;

const RegisterPage = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState<string | null>(null);

  const onFinish = (values: RegisterForm) => {
    if (isSubmitting) return;

    setIsSubmitting(true);
    dispatch(registerAccount(values))
      .unwrap()
      .then((user) => {
        setSubmittedEmail(user.email);
      })
      .catch((error: AccountActionError) => {
        const message = error?.message || t('auth.register.messages.error');
        if (error?.errorCode === EMAIL_DELIVERY_FAILED) {
          toast.error(t('auth.errors.emailDeliveryFailed'));
        } else {
          toast.error(message);
        }
      })
      .finally(() => setIsSubmitting(false));
  };

  if (submittedEmail) {
    return (
      <AuthShell
        title={t('auth.register.checkInbox.title')}
        footer={<Link to="/">{t('auth.backToLogin')}</Link>}
      >
        <p>{t('auth.register.checkInbox.description', { email: submittedEmail })}</p>
      </AuthShell>
    );
  }

  return (
    <AuthShell
      title={t('auth.register.title')}
      footer={
        <>
          {t('auth.register.haveAccount')} <Link to="/">{t('auth.backToLogin')}</Link>
        </>
      }
    >
      <FormComponent onFinish={onFinish}>
        <div className="form-inputs form-inputs-row">
          <Form.Item
            className="input"
            name="firstName"
            label={t('users.addUserForm.label.firstName')}
            rules={[{ required: true, message: t('users.addUserForm.required.firstName') }]}
          >
            <Input className="input" size="large" placeholder={t('users.addUserForm.placeholder.firstName')} />
          </Form.Item>
          <Form.Item
            className="input"
            name="lastName"
            label={t('users.addUserForm.label.lastName')}
            rules={[{ required: true, message: t('users.addUserForm.required.lastName') }]}
          >
            <Input className="input" size="large" placeholder={t('users.addUserForm.placeholder.lastName')} />
          </Form.Item>
        </div>

        <div className="form-inputs form-inputs-row">
          <Form.Item
            className="input"
            name="phone"
            label={t('users.addUserForm.label.phone')}
            rules={[
              { required: true, message: t('users.addUserForm.required.phone') },
              { pattern: /^\+?[0-9]{9,15}$/, message: t('users.addUserForm.pattern.phone') },
            ]}
          >
            <PhoneInput />
          </Form.Item>
          <Form.Item
            className="input"
            name="email"
            label={t('users.addUserForm.label.email')}
            rules={[
              { required: true, message: t('users.addUserForm.required.email') },
              { type: 'email', message: t('users.addUserForm.pattern.email') },
            ]}
          >
            <Input className="input" size="large" placeholder={t('users.addUserForm.placeholder.email')} />
          </Form.Item>
        </div>

        <div className="form-inputs form-inputs-row">
          <Form.Item
            className="input"
            name="pinfl"
            label={t('users.addUserForm.label.pinfl')}
            rules={[
              {
                validator: (_, value) =>
                  !value || /^[0-9]{14}$/.test(value)
                    ? Promise.resolve()
                    : Promise.reject(new Error(t('users.addUserForm.pattern.pinfl'))),
              },
            ]}
          >
            <Input
              className="input"
              size="large"
              inputMode="numeric"
              maxLength={14}
              placeholder={t('users.addUserForm.placeholder.pinfl')}
            />
          </Form.Item>
          <Form.Item
            className="input"
            name="password"
            label={t('users.addUserForm.label.password')}
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
        </div>

        <CustomButton type="submit" loading={isSubmitting} disabled={isSubmitting}>
          {t('auth.register.submit')}
        </CustomButton>
      </FormComponent>
    </AuthShell>
  );
};

export default RegisterPage;
