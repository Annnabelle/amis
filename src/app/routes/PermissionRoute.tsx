import type { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAppSelector } from 'app/store';
import GlobalLoader from 'shared/ui/loader';
import type { RouteAccess } from './accessMap';
import { canAccessRoute, resolveFallbackPath } from './routeAccessPath';
import { useIsMobile } from 'shared/lib';
import { parseCompanyFromPath } from 'shared/lib/companyPath';

type PermissionRouteProps = {
  access: RouteAccess;
  children: ReactNode;
};

export const PermissionRoute = ({
  access: requiredAccess,
  children,
}: PermissionRouteProps) => {
  const location = useLocation();
  const isAuthenticated = useAppSelector((state) => state.users.isAuthenticated);
  const userAccess = useAppSelector((state) => state.access.data);
  const loading = useAppSelector((state) => state.access.loading);
  const error = useAppSelector((state) => state.access.error);
  const isMobile = useIsMobile();
  const companyId = parseCompanyFromPath(location.pathname);

  /** Без входа прав никто не запросит — ждать нечего, сразу на страницу входа. */
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  if (loading || (!userAccess && !error)) {
    return <GlobalLoader loading />;
  }

  if (!userAccess) {
    return <Navigate to="/" replace />;
  }

  const allowed = canAccessRoute({
    access: userAccess,
    routeAccess: requiredAccess,
    companyId,
  });

  const segments = location.pathname.split('/').filter(Boolean);
  const isMobileCompanyNavigation =
    isMobile &&
    segments[0] === 'organization' &&
    (segments.length === 1 || segments.length === 2);

  if (allowed || isMobileCompanyNavigation) {
    return children;
  }

  if (isMobile) {
    return (
      <Navigate
        to={companyId ? `/organization/${companyId}` : '/organization'}
        replace
      />
    );
  }

  return <Navigate to={resolveFallbackPath(userAccess)} replace />;
};
