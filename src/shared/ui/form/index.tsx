import type { ReactNode } from 'react';
import './styles.sass';

type FormLayoutProps = {
  children: ReactNode;
  className?: string;
};

export const FormGrid = ({ children, className = '' }: FormLayoutProps) => {
  const classNames = ['form-grid', className].filter(Boolean).join(' ');

  return <div className={classNames}>{children}</div>;
};

export const FormRow = ({ children, className = '' }: FormLayoutProps) => {
  const classNames = ['form-inputs', 'form-inputs-row', className]
    .filter(Boolean)
    .join(' ');

  return <div className={classNames}>{children}</div>;
};

export const FormActions = ({ children, className = '' }: FormLayoutProps) => {
  const classNames = ['form-actions', 'btns-group', className]
    .filter(Boolean)
    .join(' ');

  return <div className={classNames}>{children}</div>;
};
