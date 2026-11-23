import { canAccessEndpoint } from 'entities/access/lib';
import { routes } from "shared/config/routes";
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
    [AccessModules.Users, endpointAccessMap.usersList, routes.users()],
    [AccessModules.Companies, endpointAccessMap.companiesList, routes.companies()],
    [AccessModules.Leads, endpointAccessMap.leadsList, routes.leads()],
    [AccessModules.Audit, endpointAccessMap.auditList, routes.auditLogs()],
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
    [AccessModules.CompanyMemberships, endpointAccessMap.companyMembershipsList, routes.companyMemberships],
    [AccessModules.Products, endpointAccessMap.productsList, routes.products],
    [AccessModules.Orders, endpointAccessMap.ordersList, routes.markingCodeOrders],
    [AccessModules.Reports, endpointAccessMap.aggregationReportsList, routes.aggregations],
    [AccessModules.SalesOrders, endpointAccessMap.salesOrdersList, routes.salesOrders],
    [AccessModules.DeliveryRoutes, endpointAccessMap.deliveryRoutesList, routes.deliveryRoutes],
    [AccessModules.Vehicles, endpointAccessMap.vehiclesList, routes.vehicles],
    [AccessModules.Invoices, endpointAccessMap.invoicesList, routes.invoices],
    [AccessModules.Waybills, endpointAccessMap.waybillsList, routes.waybills],
    [AccessModules.Integrations, [endpointAccessMap.integrationsXTraceRead, endpointAccessMap.integrationsFakturaUzRead], routes.companyIntegrations],
  ] as const;

  for (const company of access.companies) {
    const buildSectionPath = companyCandidates.find(
      ([module, endpoint]) =>
        company.modules.includes(module) &&
        canAccessRoute({
          access,
          routeAccess: endpoint,
          companyId: company.companyId,
        })
    )?.[2];

    if (buildSectionPath) {
      if (options?.mobile) {
        return routes.company(company.companyId);
      }

      return buildSectionPath(company.companyId);
    }
  }

  return routes.welcome();
};
