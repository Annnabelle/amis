import type { ReactNode } from 'react';
import type { StatusBadgeVariant } from './variants';
import './styles.sass';

export type StatusBadgeMode = 'compact' | 'full';

type StatusBadgeProps = {
  variant?: StatusBadgeVariant;
  mode?: StatusBadgeMode;
  children: ReactNode;
  className?: string;
  title?: string;
};

const StatusBadge = ({
  variant = 'default',
  mode = 'full',
  children,
  className = '',
  title,
}: StatusBadgeProps) => {
  const classNames = ['status-badge', className].filter(Boolean).join(' ');

  return (
    <span
      className={classNames}
      data-variant={variant}
      data-mode={mode}
      title={title}
    >
      {children}
    </span>
  );
};

export type { StatusBadgeVariant };
export default StatusBadge;
