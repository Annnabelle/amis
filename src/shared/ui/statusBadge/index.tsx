import type { ReactNode } from 'react';
import { getStatusBadgeVariant, type StatusBadgeVariant } from './variants';
import './styles.sass';

export type StatusBadgeMode = 'compact' | 'full';

type StatusBadgeProps = {
  status?: string | null;
  variant?: StatusBadgeVariant;
  mode?: StatusBadgeMode;
  children: ReactNode;
  className?: string;
  title?: string;
};

const StatusBadge = ({
  status,
  variant,
  mode = 'full',
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
      data-mode={mode}
      data-status={status ?? undefined}
      title={title}
    >
      {children}
    </span>
  );
};

export type { StatusBadgeVariant };
export default StatusBadge;
