import type { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAppSelector } from 'app/store';
import { canAccess } from 'entities/access/lib';
import {
  AccessModules,
  Permissions,
  type UserAccess,
} from 'entities/access/types';
import GlobalLoader from 'shared/ui/loader';
import type { RouteAccess } from './accessMap';

const getCompanyIdFromPath = (pathname: string) => {
  const segments = pathname.split('/').filter(Boolean);
  return segments[0] === 'organization' && segments.length > 2
    ? segments[1]
    : null;
};

const resolveFallbackPath = (access: UserAccess) => {
  const systemCandidates = [
    [AccessModules.Users, Permissions.UsersList, '/users'],
    [AccessModules.Companies, Permissions.CompaniesList, '/organization'],
    [AccessModules.Audit, Permissions.AuditList, '/audit-logs'],
  ] as const;
  const systemPath = systemCandidates.find(
    ([module, permission]) =>
      access.system.modules.includes(module) &&
      canAccess({ access, permission, scope: 'GLOBAL' })
  )?.[2];

  if (systemPath) {
    return systemPath;
  }

  const companyCandidates = [
    [AccessModules.Products, Permissions.ProductsList, 'products'],
    [AccessModules.Orders, Permissions.OrdersList, 'orders'],
    [AccessModules.Reports, Permissions.ReportsList, 'agregations'],
    [AccessModules.SalesOrders, Permissions.SalesOrdersList, 'sales-orders'],
    [AccessModules.DeliveryRoutes, Permissions.DeliveryRoutesList, 'delivery-routes'],
    [AccessModules.Invoices, Permissions.InvoicesList, 'invoices'],
  ] as const;

  for (const company of access.companies) {
    const section = companyCandidates.find(
      ([module, permission]) =>
        company.modules.includes(module) &&
        canAccess({
          access,
          permission,
          scope: 'COMPANY',
          companyId: company.companyId,
        })
    )?.[2];

    if (section) {
      return `/organization/${company.companyId}/${section}`;
    }
  }

  return '/';
};

type PermissionRouteProps = {
  access: RouteAccess;
  children: ReactNode;
};

export const PermissionRoute = ({
  access: requiredAccess,
  children,
}: PermissionRouteProps) => {
  const location = useLocation();
  const userAccess = useAppSelector((state) => state.access.data);
  const loading = useAppSelector((state) => state.access.loading);
  const error = useAppSelector((state) => state.access.error);
  const companyId = getCompanyIdFromPath(location.pathname);

  if (loading || (!userAccess && !error)) {
    return <GlobalLoader loading />;
  }

  if (!userAccess) {
    return <Navigate to="/" replace />;
  }

  const allowed = canAccess({
    access: userAccess,
    permission: requiredAccess.permission,
    scope: requiredAccess.scope,
    companyId,
  });

  if (allowed) {
    return children;
  }

  return <Navigate to={resolveFallbackPath(userAccess)} replace />;
};
