import { useEffect, useRef, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAppDispatch } from 'app/store';
import { verifyEmail, type AccountActionError } from 'entities/users/model';
import AuthShell from 'pages/auth/authShell';
import CustomButton from 'shared/ui/button';

type Status = 'loading' | 'success' | 'error' | 'missing-token';

const VerifyEmailPage = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') ?? '';
  const [status, setStatus] = useState<Status>(token ? 'loading' : 'missing-token');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const requestedRef = useRef(false);

  useEffect(() => {
    if (!token || requestedRef.current) return;
    requestedRef.current = true;

    dispatch(verifyEmail({ token }))
      .unwrap()
      .then(() => setStatus('success'))
      .catch((error: AccountActionError) => {
        setErrorMessage(error?.message ?? t('auth.verifyEmail.error'));
        setStatus('error');
      });
  }, [dispatch, t, token]);

  if (status === 'loading') {
    return (
      <AuthShell title={t('auth.verifyEmail.title')}>
        <p>{t('auth.verifyEmail.loading')}</p>
      </AuthShell>
    );
  }

  if (status === 'success') {
    return (
      <AuthShell
        title={t('auth.verifyEmail.successTitle')}
        footer={<Link to="/">{t('auth.backToLogin')}</Link>}
      >
        <p>{t('auth.verifyEmail.successDescription')}</p>
        <Link to="/">
          <CustomButton>{t('auth.goToLogin')}</CustomButton>
        </Link>
      </AuthShell>
    );
  }

  return (
    <AuthShell
      title={t('auth.verifyEmail.errorTitle')}
      footer={<Link to="/register">{t('auth.register.title')}</Link>}
    >
      <p>{status === 'missing-token' ? t('auth.errors.missingToken') : errorMessage}</p>
    </AuthShell>
  );
};

export default VerifyEmailPage;
