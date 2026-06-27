import type { CSSProperties, ReactNode } from 'react';
import { Link, type LinkProps } from 'react-router-dom';
import { useCan } from 'entities/access/lib';
import type { StaticEndpointAccess } from 'shared/config/endpointAccessMap';

type CanProps = {
  endpoint: StaticEndpointAccess;
  children: ReactNode;
  fallback?: ReactNode;
};

export const Can = ({
  endpoint,
  children,
  fallback = null,
}: CanProps) =>
  useCan(endpoint) ? children : fallback;

type PermissionLinkProps = Omit<LinkProps, 'children'> & {
  endpoint: StaticEndpointAccess;
  children: ReactNode;
  fallbackStyle?: CSSProperties;
};

export const PermissionLink = ({
  endpoint,
  children,
  fallbackStyle,
  ...linkProps
}: PermissionLinkProps) => {
  const allowed = useCan(endpoint);

  if (!allowed) {
    return <span style={fallbackStyle}>{children}</span>;
  }

  return <Link {...linkProps}>{children}</Link>;
};

