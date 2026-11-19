import { canAccessEndpoint } from 'entities/access/lib';
import { AccessModules, type UserAccess } from 'entities/access/types';
import { endpointAccessMap } from 'shared/config/endpointAccessMap';
import type { RouteAccess } from './accessMap';

export const canAccessRoute = ({
  access,
  routeAccess,
  companyId,
}: {
  access: UserAccess;
  routeAccess: RouteAccess;
  companyId?: string | null;
}) => {
  const endpoints = Array.isArray(routeAccess) ? routeAccess : [routeAccess];

  return endpoints.some((endpoint) =>
    canAccessEndpoint({
      access,
      endpoint,
      companyId,
    })
  );
};

export const resolveFallbackPath = (
  access: UserAccess,
  options?: { mobile?: boolean }
) => {
  const systemCandidates = [
    [AccessModules.Users, endpointAccessMap.usersList, '/users'],
    [AccessModules.Companies, endpointAccessMap.companiesList, '/organization'],
    [AccessModules.Leads, endpointAccessMap.leadsList, '/leads'],
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
    [AccessModules.Vehicles, endpointAccessMap.vehiclesList, 'vehicles'],
    [AccessModules.Invoices, endpointAccessMap.invoicesList, 'invoices'],
    [AccessModules.Waybills, endpointAccessMap.waybillsList, 'waybills'],
    [AccessModules.Integrations, [endpointAccessMap.integrationsXTraceRead, endpointAccessMap.integrationsFakturaUzRead], 'integrations'],
  ] as const;

  for (const company of access.companies) {
    const section = companyCandidates.find(
      ([module, endpoint]) =>
        company.modules.includes(module) &&
        canAccessRoute({
          access,
          routeAccess: endpoint,
          companyId: company.companyId,
        })
    )?.[2];

    if (section) {
      if (options?.mobile) {
        return `/organization/${company.companyId}`;
      }

      return `/organization/${company.companyId}/${section}`;
    }
  }

  return '/welcome';
};
