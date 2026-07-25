import type { ReactNode } from 'react';
import { getStatusBadgeVariant, type StatusBadgeVariant } from './variants';
import './styles.sass';

type StatusBadgeProps = {
  status?: string | null;
  variant?: StatusBadgeVariant;
  children: ReactNode;
  className?: string;
  title?: string;
};

const StatusBadge = ({
  status,
  variant,
  children,
  className = '',
  title,
}: StatusBadgeProps) => {
  const statusVariant = variant ?? getStatusBadgeVariant(status);
  const classNames = ['status-badge', className].filter(Boolean).join(' ');

  return (
    <span
      className={classNames}
      data-variant={statusVariant}
      data-status={status ?? undefined}
      title={title}
    >
      {children}
    </span>
  );
};

export default StatusBadge;
