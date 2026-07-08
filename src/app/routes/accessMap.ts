import {
  endpointAccessMap,
  type StaticEndpointAccess,
} from 'shared/config/endpointAccessMap';

export type RouteAccess = StaticEndpointAccess;

export const routeAccess = {
  usersList: endpointAccessMap.usersList,
  usersRead: endpointAccessMap.usersRead,
  usersUpdate: endpointAccessMap.usersUpdate,
  systemEmployeesList: endpointAccessMap.systemEmployeesList,

  companiesList: endpointAccessMap.companiesList,
  companiesRead: endpointAccessMap.companiesRead,
  companiesUpdate: endpointAccessMap.companiesUpdate,

  auditList: endpointAccessMap.auditList,

  productsList: endpointAccessMap.productsList,
  productsRead: endpointAccessMap.productsRead,
  productsUpdate: endpointAccessMap.productsUpdate,

  ordersList: endpointAccessMap.ordersList,
  ordersRead: endpointAccessMap.ordersRead,
  codesRead: endpointAccessMap.codesRead,

  reportsList: endpointAccessMap.aggregationReportsList,
  reportsRead: endpointAccessMap.aggregationReportsRead,

  salesOrdersList: endpointAccessMap.salesOrdersList,
  salesOrdersCreate: endpointAccessMap.salesOrdersCreate,
  salesOrdersRead: endpointAccessMap.salesOrdersRead,

  deliveryRoutesList: endpointAccessMap.deliveryRoutesList,
  deliveryRoutesCreate: endpointAccessMap.deliveryRoutesCreate,
  deliveryRoutesRead: endpointAccessMap.deliveryRoutesRead,

  deliveryTasksList: endpointAccessMap.deliveryRouteTasksList,
  deliveryTasksRead: endpointAccessMap.deliveryTasksRead,

  invoicesList: endpointAccessMap.invoicesList,
  invoicesRead: endpointAccessMap.invoicesRead,
} as const satisfies Record<string, RouteAccess>;

