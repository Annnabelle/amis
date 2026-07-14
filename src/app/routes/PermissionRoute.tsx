import type { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAppSelector } from 'app/store';
import { canAccessEndpoint } from 'entities/access/lib';
import {
  AccessModules,
  type UserAccess,
} from 'entities/access/types';
import GlobalLoader from 'shared/ui/loader';
import { endpointAccessMap } from 'shared/config/endpointAccessMap';
import type { RouteAccess } from './accessMap';
import { useIsMobile } from 'shared/lib';

const getCompanyIdFromPath = (pathname: string) => {
  const segments = pathname.split('/').filter(Boolean);
  return segments[0] === 'organization' && segments.length > 1
    ? segments[1]
    : null;
};

export const resolveFallbackPath = (access: UserAccess) => {
  const systemCandidates = [
    [AccessModules.Users, endpointAccessMap.usersList, '/users'],
    [AccessModules.Companies, endpointAccessMap.companiesList, '/organization'],
    [AccessModules.Audit, endpointAccessMap.auditList, '/audit-logs'],
  ] as const;
  const systemPath = systemCandidates.find(
    ([module, endpoint]) =>
      access.system.modules.includes(module) &&
      canAccessEndpoint({ access, endpoint })
  )?.[2];

  if (systemPath) {
    return systemPath;
  }

  const companyCandidates = [
    [AccessModules.CompanyMemberships, endpointAccessMap.companyMembershipsList, 'memberships'],
    [AccessModules.Products, endpointAccessMap.productsList, 'products'],
    [AccessModules.Orders, endpointAccessMap.ordersList, 'orders'],
    [AccessModules.Reports, endpointAccessMap.aggregationReportsList, 'agregations'],
    [AccessModules.SalesOrders, endpointAccessMap.salesOrdersList, 'sales-orders'],
    [AccessModules.DeliveryRoutes, endpointAccessMap.deliveryRoutesList, 'delivery-routes'],
    [AccessModules.Invoices, endpointAccessMap.invoicesList, 'invoices'],
  ] as const;

  for (const company of access.companies) {
    const section = companyCandidates.find(
      ([module, endpoint]) =>
        company.modules.includes(module) &&
        canAccessEndpoint({
          access,
          endpoint,
          companyId: company.companyId,
        })
    )?.[2];

    if (section) {
      return `/organization/${company.companyId}/${section}`;
    }
  }

  return '/welcome';
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
  const isMobile = useIsMobile();
  const companyId = getCompanyIdFromPath(location.pathname);

  if (loading || (!userAccess && !error)) {
    return <GlobalLoader loading />;
  }

  if (!userAccess) {
    return <Navigate to="/" replace />;
  }

  const allowed = canAccessEndpoint({
    access: userAccess,
    endpoint: requiredAccess,
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
