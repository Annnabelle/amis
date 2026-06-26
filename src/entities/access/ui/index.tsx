import type { CSSProperties, ReactNode } from 'react';
import { Link, type LinkProps } from 'react-router-dom';
import { useCan, type PermissionScope } from 'entities/access/lib';
import type { Permission } from 'entities/access/types';

type CanProps = {
  permission: Permission;
  scope: PermissionScope;
  children: ReactNode;
  fallback?: ReactNode;
};

export const Can = ({
  permission,
  scope,
  children,
  fallback = null,
}: CanProps) =>
  useCan(permission, scope) ? children : fallback;

type PermissionLinkProps = Omit<LinkProps, 'children'> & {
  permission: Permission;
  scope: PermissionScope;
  children: ReactNode;
  fallbackStyle?: CSSProperties;
};

export const PermissionLink = ({
  permission,
  scope,
  children,
  fallbackStyle,
  ...linkProps
}: PermissionLinkProps) => {
  const allowed = useCan(permission, scope);

  if (!allowed) {
    return <span style={fallbackStyle}>{children}</span>;
  }

  return <Link {...linkProps}>{children}</Link>;
};

