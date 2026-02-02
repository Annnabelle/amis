import { Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";
import GlobalLoader from "../components/loader";

const LoginPage = lazy(() => import("../pages/login"));
const Users = lazy(() => import("../pages/users"));
const Products = lazy(() => import( "../pages/products"));
const Organizations = lazy(() => import ("../pages/organizations"))
const OrganizationsInner = lazy(() => import('../pages/organizationInner'))
const UserSettings = lazy(() => import('../pages/user-settings'))
const UsersRetrieve = lazy(() => import('../pages/users/userRetrieve'))
const UsersEdit = lazy(() => import('../pages/users/userEdit'))
const AuditLogsPage = lazy(() => import('../pages/auditLogs'))
const ProductsView = lazy(() => import("../pages/products/viewPage")) 
const OrganizationsEdit = lazy(() => import("../pages/organizations/organizationEdit"))
const ProductsEdit = lazy(() => import("../pages/products/editProduct"))
const MarkingCodes = lazy(() => import("../pages/markingCodes"))
const Batches = lazy(() => import("../pages/batches"));
const MarkingCodeProduct = lazy(() => import( "../pages/markingCodeProduct"));
const Aggregations = lazy(() => import("../pages/aggregation"));
const AggregationReportPage = lazy(() => import("../pages/aggregation/viewAgregation"))
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
      </Routes>
    </Suspense>
  );
};

export default Router;
