import type { ReactNode } from 'react';
import { useTheme } from 'app/themeContext';
import lightMainBG from 'shared/assets/main-bg.png';
import darkMainBG from 'shared/assets/bg-black.png';
import './styles.sass';

type AuthShellProps = {
  title: string;
  subtitle?: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
  wide?: boolean;
};

const AuthShell = ({ title, subtitle, children, footer, wide = false }: AuthShellProps) => {
  const { isDarkTheme } = useTheme();
  const background = isDarkTheme ? darkMainBG : lightMainBG;

  return (
    <div className="auth-page">
      <div className="auth-page-background">
        <img className="img" src={background} alt="" />
      </div>
      <div className="auth-page-container">
        <div className="auth-page-header">
          <h1 className="auth-page-header-logo">AMIS</h1>
        </div>
        <div className="auth-page-form-container">
          <div className={`auth-card${wide ? ' auth-card--wide' : ''}`}>
            <div className="auth-card-items">
              <h3 className="auth-card-title">{title}</h3>
              {subtitle && <p className="auth-card-subtitle">{subtitle}</p>}
              {children}
              {footer && <div className="auth-card-footer">{footer}</div>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthShell;
