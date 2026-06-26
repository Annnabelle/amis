import { Routes, Route } from "react-router-dom";
import { lazy, Suspense, type ReactNode } from "react";
import GlobalLoader from "shared/ui/loader";
import { PermissionRoute } from "./PermissionRoute";
import { routeAccess, type RouteAccess } from "./accessMap";

const LoginPage = lazy(() => import("pages/login"));
const Users = lazy(() => import("pages/users"));
const Products = lazy(() => import("pages/products"));
const Organizations = lazy(() => import("pages/organizations"))
const OrganizationsInner = lazy(() => import('pages/organizationInner'))
const UserSettings = lazy(() => import('pages/user-settings'))
const UsersRetrieve = lazy(() => import('pages/users/userRetrieve'))
const UsersEdit = lazy(() => import('pages/users/userEdit'))
const AuditLogsPage = lazy(() => import('pages/auditLogs'))
const ProductsView = lazy(() => import("pages/products/viewPage")) 
const OrganizationsEdit = lazy(() => import("pages/organizations/organizationEdit"))
const ProductsEdit = lazy(() => import("pages/products/editProduct"))
const MarkingCodes = lazy(() => import("pages/markingCodes"))
const Batches = lazy(() => import("pages/batches"));
const MarkingCodeProduct = lazy(() => import("pages/markingCodeProduct"));
const Aggregations = lazy(() => import("pages/aggregation"));
const AggregationReportPage = lazy(() => import("pages/aggregation/viewAgregation"))
const SalesOrdersList = lazy(() => import("pages/salesOrders/list"));
const SalesOrdersCreate = lazy(() => import("pages/salesOrders/create"));
const SalesOrdersDetails = lazy(() => import("pages/salesOrders/details"));
const DeliveryRoutesList = lazy(() => import("pages/deliveryRoutes/list"));
const DeliveryRoutesCreate = lazy(() => import("pages/deliveryRoutes/create"));
const DeliveryRoutesDetails = lazy(() => import("pages/deliveryRoutes/details"));
const DeliveryRoutesLoading = lazy(() => import("pages/deliveryRoutes/loading"));
const DeliveryRoutesReturn = lazy(() => import("pages/deliveryRoutes/return"));
const DeliveryTasksList = lazy(() => import("pages/deliveryTasks/list"));
const DeliveryTasksDetails = lazy(() => import("pages/deliveryTasks/details"));
const DeliveryTasksScan = lazy(() => import("pages/deliveryTasks/scan"));
const InvoicesList = lazy(() => import("pages/invoices/list"));
const InvoicesDetails = lazy(() => import("pages/invoices/details"));

const protectedPage = (access: RouteAccess, page: ReactNode) => (
  <PermissionRoute access={access}>{page}</PermissionRoute>
);

const Router: React.FC = () => {
  return (
    <Suspense fallback={<GlobalLoader loading={true}/>}>
      <Routes>
        <Route path='/' element={<LoginPage />} />
        <Route path='/users' element={protectedPage(routeAccess.usersList, <Users />)} />
        <Route path="/users/:id" element={protectedPage(routeAccess.usersRead, <UsersRetrieve />)} />
        <Route path="/users/:id/edit" element={protectedPage(routeAccess.usersUpdate, <UsersEdit />)} />
        <Route path='/organization' element={protectedPage(routeAccess.companiesList, <Organizations/>)}/>
        <Route path='/organization/:id' element={protectedPage(routeAccess.companiesRead, <OrganizationsInner/>)}/>
        <Route path= '/organization/:id/products' element={protectedPage(routeAccess.productsList, <Products/>)}/>
        <Route path='/profile' element={<UserSettings/>}/>
        <Route path='/audit-logs' element={protectedPage(routeAccess.auditList, <AuditLogsPage/>)}/>
        <Route path='/organization/:orgId/products/:id' element={protectedPage(routeAccess.productsRead, <ProductsView/>)}/>
        <Route path='/organization/:id/edit' element={protectedPage(routeAccess.companiesUpdate, <OrganizationsEdit/>)}/>
        <Route path='/organization/:orgId/products/:id/edit' element={protectedPage(routeAccess.productsUpdate, <ProductsEdit/>)}/>
        <Route path='/organization/:id/orders' element={protectedPage(routeAccess.ordersList, <MarkingCodes/>)}/>
        <Route path='/organization/:orgId/orders/:orderId' element={protectedPage(routeAccess.ordersRead, <Batches/>)}/>
        <Route path='/organization/:orgId/orderId/:orderId/batchId/:batchId' element={protectedPage(routeAccess.ordersRead, <MarkingCodeProduct/>)}/>
        <Route path='/organization/:id/agregations' element={protectedPage(routeAccess.reportsList, <Aggregations/>)}/>
        <Route path='/organization/:orgId/aggregations/:id' element={protectedPage(routeAccess.reportsRead, <AggregationReportPage/>)}/>
        <Route path='/organization/:orgId/sales-orders' element={protectedPage(routeAccess.salesOrdersList, <SalesOrdersList/>)} />
        <Route path='/organization/:orgId/sales-orders/create' element={protectedPage(routeAccess.salesOrdersCreate, <SalesOrdersCreate/>)} />
        <Route path='/organization/:orgId/sales-orders/:id' element={protectedPage(routeAccess.salesOrdersRead, <SalesOrdersDetails/>)} />
        <Route path='/organization/:orgId/delivery-routes' element={protectedPage(routeAccess.deliveryRoutesList, <DeliveryRoutesList/>)} />
        <Route path='/organization/:orgId/delivery-routes/create' element={protectedPage(routeAccess.deliveryRoutesCreate, <DeliveryRoutesCreate/>)} />
        <Route path='/organization/:orgId/delivery-routes/:id' element={protectedPage(routeAccess.deliveryRoutesRead, <DeliveryRoutesDetails/>)} />
        <Route path='/organization/:orgId/delivery-routes/:id/loading' element={protectedPage(routeAccess.deliveryRoutesRead, <DeliveryRoutesLoading/>)} />
        <Route path='/organization/:orgId/delivery-routes/:id/return' element={protectedPage(routeAccess.deliveryRoutesRead, <DeliveryRoutesReturn/>)} />
        <Route path='/organization/:orgId/delivery-tasks' element={protectedPage(routeAccess.deliveryTasksList, <DeliveryTasksList/>)} />
        <Route path='/organization/:orgId/delivery-tasks/:id' element={protectedPage(routeAccess.deliveryTasksRead, <DeliveryTasksDetails/>)} />
        <Route path='/organization/:orgId/delivery-tasks/:id/scan' element={protectedPage(routeAccess.deliveryTasksRead, <DeliveryTasksScan/>)} />
        <Route path='/organization/:orgId/invoices' element={protectedPage(routeAccess.invoicesList, <InvoicesList/>)} />
        <Route path='/organization/:orgId/invoices/:id' element={protectedPage(routeAccess.invoicesRead, <InvoicesDetails/>)} />
      </Routes>
    </Suspense>
  );
};

export default Router;



