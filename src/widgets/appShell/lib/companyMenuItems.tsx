import {
  ApiOutlined,
  AppstoreOutlined,
  CarOutlined,
  ClusterOutlined,
  CodeOutlined,
  FileDoneOutlined,
  FileProtectOutlined,
  SafetyCertificateOutlined,
  ShoppingCartOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import type { TFunction } from "i18next";
import type { ReactNode } from "react";

import { canAccessEndpoint } from "entities/access/lib";
import { AccessModules, type AccessModule, type UserAccess } from "entities/access/types";
import {
  endpointAccessMap,
  type StaticEndpointAccess,
} from "shared/config/endpointAccessMap";
import { routes } from "shared/config/routes";

/** Порядок групп в меню компании. Системное меню не группируется. */
export const COMPANY_MENU_GROUPS = ["marking", "shipping", "company"] as const;

export type CompanyMenuGroup = (typeof COMPANY_MENU_GROUPS)[number];

export type CompanyModuleMenuItem = {
  module: AccessModule;
  access: StaticEndpointAccess | readonly StaticEndpointAccess[];
  key: string;
  icon: ReactNode;
  path: string;
  label: string;
  group: CompanyMenuGroup;
};

/**
 * Разделы компании в меню.
 *
 * Порядок задан здесь: по нему идут и боковое меню, и мобильное, и выбор
 * раздела при входе в компанию.
 */
export const buildCompanyModuleItems = ({
  companyId,
  modules,
  access,
  t,
}: {
  companyId: string;
  modules: AccessModule[];
  access: UserAccess;
  t: TFunction;
}): CompanyModuleMenuItem[] => {
  const frontendModuleOrder: CompanyModuleMenuItem[] = [
    {
      module: AccessModules.CompanyMemberships,
      access: endpointAccessMap.companyMembershipsList,
      key: 'memberships',
      group: 'company',
      icon: <TeamOutlined />,
      path: routes.companyMemberships(companyId),
      label: t('navigation.companyMemberships'),
    },
    {
      module: AccessModules.Products,
      access: endpointAccessMap.productsList,
      key: 'products',
      group: 'marking',
      icon: <AppstoreOutlined />,
      path: routes.products(companyId),
      label: t('navigation.products'),
    },
    {
      module: AccessModules.Orders,
      access: endpointAccessMap.ordersList,
      key: 'orders',
      group: 'marking',
      icon: <CodeOutlined />,
      path: routes.markingCodeOrders(companyId),
      label: t('navigation.markingCodes'),
    },
    {
      module: AccessModules.Orders,
      access: endpointAccessMap.ownedCodesList,
      key: 'codes',
      group: 'marking',
      icon: <CodeOutlined />,
      path: routes.ownedCodes(companyId),
      label: t('navigation.ownedCodes'),
    },
    {
      module: AccessModules.Reports,
      access: endpointAccessMap.aggregationReportsList,
      key: 'agregations',
      group: 'marking',
      icon: <ClusterOutlined />,
      path: routes.aggregations(companyId),
      label: t('navigation.agregations'),
    },
    {
      module: AccessModules.Reports,
      access: endpointAccessMap.customsCodesList,
      key: 'customs-codes',
      group: 'marking',
      icon: <SafetyCertificateOutlined />,
      path: routes.customsCodes(companyId),
      label: 'АИК',
    },
    {
      module: AccessModules.SalesOrders,
      access: endpointAccessMap.salesOrdersList,
      key: 'sales-orders',
      group: 'shipping',
      icon: <ShoppingCartOutlined />,
      path: routes.salesOrders(companyId),
      label: t('navigation.deals'),
    },
    {
      module: AccessModules.DeliveryRoutes,
      access: endpointAccessMap.deliveryRoutesList,
      key: 'delivery-routes',
      group: 'shipping',
      icon: <CarOutlined />,
      path: routes.deliveryRoutes(companyId),
      label: t('navigation.routes'),
    },
    {
      module: AccessModules.Vehicles,
      access: endpointAccessMap.vehiclesList,
      key: 'vehicles',
      group: 'company',
      icon: <CarOutlined />,
      path: routes.vehicles(companyId),
      label: t('navigation.vehicles'),
    },
    {
      module: AccessModules.Invoices,
      access: endpointAccessMap.invoicesList,
      key: 'invoices',
      group: 'shipping',
      icon: <FileDoneOutlined />,
      path: routes.invoices(companyId),
      label: t('navigation.invoices'),
    },
    {
      module: AccessModules.Waybills,
      access: endpointAccessMap.waybillsList,
      key: 'waybills',
      group: 'shipping',
      icon: <FileProtectOutlined />,
      path: routes.waybills(companyId),
      label: t('navigation.waybills'),
    },
    {
      module: AccessModules.Integrations,
      access: [
        endpointAccessMap.integrationsXTraceRead,
        endpointAccessMap.integrationsFakturaUzRead,
      ],
      key: 'integrations',
      group: 'company',
      icon: <ApiOutlined />,
      path: routes.companyIntegrations(companyId),
      label: t('navigation.integrations'),
    },
  ];

  return frontendModuleOrder.filter((item) => {
    if (!modules.includes(item.module)) return false;

    const endpoints = Array.isArray(item.access) ? item.access : [item.access];

    return endpoints.some((endpoint) =>
      canAccessEndpoint({
        access,
        endpoint,
        companyId,
      })
    );
  });
};

