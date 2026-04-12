import { Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";
import GlobalLoader from "shared/ui/loader";

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
const Router: React.FC = () => {
  return (
    <Suspense fallback={<GlobalLoader loading={true}/>}>
      <Routes>
        <Route path='/' element={<LoginPage />} />
        <Route path='/users' element={<Users />} />
        <Route path="/users/:id" element={<UsersRetrieve />} />
        <Route path="/users/:id/edit" element={<UsersEdit />} />
        {/* <Route path='/products' element={<Products/>}/> */}
        <Route path='/organization' element={<Organizations/>}/>
        <Route path='/organization/:id' element={<OrganizationsInner/>}/>
        <Route path= '/organization/:id/products' element={<Products/>}/>
        <Route path='/profile' element={<UserSettings/>}/>
        <Route path='/audit-logs' element={<AuditLogsPage/>}/>
        <Route path='/organization/:orgId/products/:id' element={<ProductsView/>}/>
        <Route path='/organization/:id/edit' element={<OrganizationsEdit/>}/>
        <Route path='/organization/:orgId/products/:id/edit' element={<ProductsEdit/>}/>
        <Route path='/organization/:id/orders' element={<MarkingCodes/>}/>
        <Route path='/organization/:orgId/orders/:orderId' element={<Batches/>}/>
        <Route path='/organization/:orgId/orderId/:orderId/batchId/:batchId' element={<MarkingCodeProduct/>}/>
        <Route path='/organization/:id/agregations' element={<Aggregations/>}/>
        <Route path='/organization/:orgId/aggregations/:id' element={<AggregationReportPage/>}/>
        <Route path='/organization/:orgId/sales-orders' element={<SalesOrdersList/>} />
        <Route path='/organization/:orgId/sales-orders/create' element={<SalesOrdersCreate/>} />
        <Route path='/organization/:orgId/sales-orders/:id' element={<SalesOrdersDetails/>} />
        <Route path='/organization/:orgId/delivery-routes' element={<DeliveryRoutesList/>} />
        <Route path='/organization/:orgId/delivery-routes/create' element={<DeliveryRoutesCreate/>} />
        <Route path='/organization/:orgId/delivery-routes/:id' element={<DeliveryRoutesDetails/>} />
        <Route path='/organization/:orgId/delivery-routes/:id/loading' element={<DeliveryRoutesLoading/>} />
        <Route path='/organization/:orgId/delivery-routes/:id/return' element={<DeliveryRoutesReturn/>} />
        <Route path='/organization/:orgId/delivery-tasks' element={<DeliveryTasksList/>} />
        <Route path='/organization/:orgId/delivery-tasks/:id' element={<DeliveryTasksDetails/>} />
        <Route path='/organization/:orgId/delivery-tasks/:id/scan' element={<DeliveryTasksScan/>} />
        <Route path='/organization/:orgId/invoices' element={<InvoicesList/>} />
        <Route path='/organization/:orgId/invoices/:id' element={<InvoicesDetails/>} />
        <Route path='/sales-orders' element={<SalesOrdersList/>} />
        <Route path='/sales-orders/create' element={<SalesOrdersCreate/>} />
        <Route path='/sales-orders/:id' element={<SalesOrdersDetails/>} />
        <Route path='/delivery-routes' element={<DeliveryRoutesList/>} />
        <Route path='/delivery-routes/create' element={<DeliveryRoutesCreate/>} />
        <Route path='/delivery-routes/:id' element={<DeliveryRoutesDetails/>} />
        <Route path='/delivery-routes/:id/loading' element={<DeliveryRoutesLoading/>} />
        <Route path='/delivery-routes/:id/return' element={<DeliveryRoutesReturn/>} />
        <Route path='/delivery-tasks' element={<DeliveryTasksList/>} />
        <Route path='/delivery-tasks/:id' element={<DeliveryTasksDetails/>} />
        <Route path='/delivery-tasks/:id/scan' element={<DeliveryTasksScan/>} />
        <Route path='/invoices' element={<InvoicesList/>} />
        <Route path='/invoices/:id' element={<InvoicesDetails/>} />
      </Routes>
    </Suspense>
  );
};

export default Router;



