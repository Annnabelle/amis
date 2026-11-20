import { Alert } from 'antd';
import { useEffect, type CSSProperties, type ReactNode } from 'react';
import { Link, useLocation, type LinkProps } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAppSelector } from 'app/store';
import { canAccessEndpoint, useCan } from 'entities/access/lib';
import { resolveSectionKeys } from 'entities/access/lib/permissionSections';
import type { StaticEndpointAccess } from 'shared/config/endpointAccessMap';
import { parseCompanyFromPath } from 'shared/lib/companyPath';

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

type RequiredDataAlertProps = {
  endpoints: readonly StaticEndpointAccess[];
  errors?: readonly (string | null | undefined)[];
};

export const RequiredDataAlert = ({
  endpoints,
  errors = [],
}: RequiredDataAlertProps) => {
  const { t } = useTranslation();
  const location = useLocation();
  const access = useAppSelector((state) => state.access.data);
  const currentCompanyId = useAppSelector(
    (state) => state.access.currentCompanyId
  );
  const routeCompanyId = parseCompanyFromPath(location.pathname);
  const companyId = routeCompanyId ?? currentCompanyId;
  const missingPermissions = access
    ? endpoints
        .filter(
          (endpoint) =>
            !canAccessEndpoint({ access, endpoint, companyId })
        )
        .map((endpoint) => endpoint.permission)
    : [];
  const requestErrors = [
    ...new Set(
      errors.filter((error): error is string => Boolean(error))
    ),
  ];
  const missingSections = resolveSectionKeys(missingPermissions).map((key) =>
    t(key),
  );
  const details = [...new Set([...missingPermissions, ...requestErrors])];
  const missingPermissionsKey = missingPermissions.join(',');

  useEffect(() => {
    if (!missingPermissionsKey) return;

    /** Машинные имена прав — разработчику, а не в консоль живого приложения. */
    if (import.meta.env.DEV) {
      console.error('[Access contract violation]', {
        path: location.pathname,
        missingPermissions: missingPermissionsKey.split(','),
      });
    }
  }, [location.pathname, missingPermissionsKey]);

  if (details.length === 0) return null;

  return (
    <Alert
      type="error"
      showIcon
      message={t('common.requiredDataUnavailable')}
      description={
        <div>
          {missingSections.length > 0 && (
            <div>
              {t('common.missingPermissions')}: {missingSections.join(', ')}
            </div>
          )}
          {requestErrors.map((error) => (
            <div key={error}>{error}</div>
          ))}
        </div>
      }
      style={{ marginBottom: 16 }}
    />
  );
};

