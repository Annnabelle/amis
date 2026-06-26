import { Permissions, type Permission } from 'entities/access/types';
import type { PermissionScope } from 'entities/access/lib';

export type RouteAccess = {
  permission: Permission;
  scope: PermissionScope;
};

export const routeAccess = {
  usersList: { permission: Permissions.UsersList, scope: 'GLOBAL' },
  usersRead: { permission: Permissions.UsersRead, scope: 'GLOBAL' },
  usersUpdate: { permission: Permissions.UsersUpdate, scope: 'GLOBAL' },

  companiesList: { permission: Permissions.CompaniesList, scope: 'GLOBAL' },
  companiesRead: { permission: Permissions.CompaniesRead, scope: 'GLOBAL' },
  companiesUpdate: { permission: Permissions.CompaniesUpdate, scope: 'GLOBAL' },

  auditList: { permission: Permissions.AuditList, scope: 'GLOBAL' },

  productsList: { permission: Permissions.ProductsList, scope: 'COMPANY' },
  productsRead: { permission: Permissions.ProductsRead, scope: 'COMPANY' },
  productsUpdate: { permission: Permissions.ProductsUpdate, scope: 'COMPANY' },

  ordersList: { permission: Permissions.OrdersList, scope: 'COMPANY' },
  ordersRead: { permission: Permissions.OrdersRead, scope: 'COMPANY' },

  reportsList: { permission: Permissions.ReportsList, scope: 'COMPANY' },
  reportsRead: { permission: Permissions.ReportsRead, scope: 'COMPANY' },

  salesOrdersList: { permission: Permissions.SalesOrdersList, scope: 'COMPANY' },
  salesOrdersCreate: { permission: Permissions.SalesOrdersCreate, scope: 'COMPANY' },
  salesOrdersRead: { permission: Permissions.SalesOrdersRead, scope: 'COMPANY' },

  deliveryRoutesList: { permission: Permissions.DeliveryRoutesList, scope: 'COMPANY' },
  deliveryRoutesCreate: { permission: Permissions.DeliveryRoutesCreate, scope: 'COMPANY' },
  deliveryRoutesRead: { permission: Permissions.DeliveryRoutesRead, scope: 'COMPANY' },

  deliveryTasksList: { permission: Permissions.DeliveryTasksList, scope: 'COMPANY' },
  deliveryTasksRead: { permission: Permissions.DeliveryTasksRead, scope: 'COMPANY' },

  invoicesList: { permission: Permissions.InvoicesList, scope: 'COMPANY' },
  invoicesRead: { permission: Permissions.InvoicesRead, scope: 'COMPANY' },
} as const satisfies Record<string, RouteAccess>;

