import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { lazy, Suspense, type ReactNode } from "react";
import ErrorBoundary from "shared/ui/errorBoundary";
import GlobalLoader from "shared/ui/loader";
import { PermissionRoute } from "./PermissionRoute";
import { GuestRoute } from "./GuestRoute";
import { AuthRoute } from "./AuthRoute";
import { routeAccess, type RouteAccess } from "./accessMap";
import { routePatterns, routes } from "shared/config/routes";

const LoginPage = lazy(() => import("pages/login"));
const RegisterPage = lazy(() => import("pages/register"));
const VerifyEmailPage = lazy(() => import("pages/verifyEmail"));
const ActivatePage = lazy(() => import("pages/activate"));
const ForgotPasswordPage = lazy(() => import("pages/forgotPassword"));
const ResetPasswordPage = lazy(() => import("pages/resetPassword"));
const ProfilePage = lazy(() => import("pages/profile"));
const WelcomePage = lazy(() => import("pages/welcome"));
const Users = lazy(() => import("pages/users/list"));
const SystemEmployees = lazy(() => import("pages/systemEmployees"));
const Leads = lazy(() => import("pages/leads/list"));
const LeadDetails = lazy(() => import("pages/leads/details"));
const CompanyMemberships = lazy(() => import("pages/companyMemberships"));
const Products = lazy(() => import("pages/products/list"));
const Organizations = lazy(() => import("pages/organizations/list"))
const OrganizationsInner = lazy(() => import('pages/organizations/details'))
const ChangePasswordPage = lazy(() => import('pages/changePassword'))
const UsersRetrieve = lazy(() => import('pages/users/details'))
const UsersEdit = lazy(() => import('pages/users/edit'))
const AuditLogsPage = lazy(() => import('pages/auditLogs'))
const ProductsView = lazy(() => import("pages/products/details")) 
const OrganizationsEdit = lazy(() => import("pages/organizations/edit"))
const ProductsEdit = lazy(() => import("pages/products/edit"))
const MarkingCodes = lazy(() => import("pages/markingCodes/list"))
const Batches = lazy(() => import("pages/markingCodes/order"));
const OwnedCodes = lazy(() => import("pages/ownedCodes"));
const MarkingCodeProduct = lazy(() => import("pages/markingCodes/batch"));
const Aggregations = lazy(() => import("pages/aggregation/list"));
const AggregationReportPage = lazy(() => import("pages/aggregation/details"))
const CustomsCodesPage = lazy(() => import("pages/customsCodes/list"));
const CustomsCodeDetails = lazy(() => import("pages/customsCodes/details"));
const SalesOrdersList = lazy(() => import("pages/salesOrders/list"));
const SalesOrdersCreate = lazy(() => import("pages/salesOrders/create"));
const SalesOrdersDetails = lazy(() => import("pages/salesOrders/details"));
const DeliveryRoutesList = lazy(() => import("pages/deliveryRoutes/list"));
const DeliveryRoutesCreate = lazy(() => import("pages/deliveryRoutes/create"));
const DeliveryRoutesDetails = lazy(() => import("pages/deliveryRoutes/details"));
const DeliveryRoutesLoading = lazy(() => import("pages/deliveryRoutes/loading"));
const DeliveryRoutesReturn = lazy(() => import("pages/deliveryRoutes/return"));
const Vehicles = lazy(() => import("pages/vehicles/list"));
const VehicleDetails = lazy(() => import("pages/vehicles/details"));
const DeliveryTasksList = lazy(() => import("pages/deliveryTasks/list"));
const DeliveryTasksDetails = lazy(() => import("pages/deliveryTasks/details"));
const DeliveryTasksScan = lazy(() => import("pages/deliveryTasks/scan"));
const InvoicesList = lazy(() => import("pages/invoices/list"));
const InvoicesDetails = lazy(() => import("pages/invoices/details"));
const WaybillsList = lazy(() => import("pages/waybills/list"));
const WaybillsDetails = lazy(() => import("pages/waybills/details"));
const CompanyIntegrations = lazy(() => import("pages/companyIntegrations"));

/**
 * Своя граница на каждую страницу: ошибка рендера карточки не должна гасить
 * оболочку, из которой пользователь уходит на другой экран. resetKey снимает
 * упавшее состояние при переходе — позиция границы в дереве у всех маршрутов
 * одна, и без ключа она осталась бы сломанной.
 */
const ProtectedPage = ({
  access,
  children,
}: {
  access: RouteAccess;
  children: ReactNode;
}) => {
  const location = useLocation();

  return (
    <PermissionRoute access={access}>
      <ErrorBoundary resetKey={location.pathname}>{children}</ErrorBoundary>
    </PermissionRoute>
  );
};

const protectedPage = (access: RouteAccess, page: ReactNode) => (
  <ProtectedPage access={access}>{page}</ProtectedPage>
);

const Router: React.FC = () => {
  return (
    <Suspense fallback={<GlobalLoader loading={true}/>}>
      <Routes>
        <Route path={routePatterns.login} element={<LoginPage />} />
        <Route path={routePatterns.register} element={<GuestRoute><RegisterPage /></GuestRoute>} />
        <Route path={routePatterns.forgotPassword} element={<GuestRoute><ForgotPasswordPage /></GuestRoute>} />
        <Route path={routePatterns.verifyEmail} element={<VerifyEmailPage />} />
        <Route path={routePatterns.activate} element={<ActivatePage />} />
        <Route path={routePatterns.resetPassword} element={<ResetPasswordPage />} />
        <Route path={routePatterns.me} element={<Navigate to={routes.profile()} replace />} />
        <Route path={routePatterns.welcome} element={<WelcomePage />} />
        <Route path={routePatterns.users} element={protectedPage(routeAccess.usersList, <Users />)} />
        <Route path={routePatterns.systemEmployees} element={protectedPage(routeAccess.systemEmployeesList, <SystemEmployees />)} />
        <Route path={routePatterns.leads} element={protectedPage(routeAccess.leadsList, <Leads />)} />
        <Route path={routePatterns.lead} element={protectedPage(routeAccess.leadsRead, <LeadDetails />)} />
        <Route path={routePatterns.user} element={protectedPage(routeAccess.usersRead, <UsersRetrieve />)} />
        <Route path={routePatterns.userEdit} element={protectedPage(routeAccess.usersUpdate, <UsersEdit />)} />
        <Route path={routePatterns.companies} element={protectedPage(routeAccess.companiesList, <Organizations/>)}/>
        <Route path={routePatterns.company} element={protectedPage(routeAccess.companiesRead, <OrganizationsInner/>)}/>
        <Route path={routePatterns.companyMemberships} element={protectedPage(routeAccess.companyMembershipsList, <CompanyMemberships/>)} />
        <Route path={routePatterns.products} element={protectedPage(routeAccess.productsList, <Products/>)}/>
        <Route path={routePatterns.profile} element={<AuthRoute><ProfilePage/></AuthRoute>}/>
        <Route path={routePatterns.changePassword} element={<AuthRoute><ChangePasswordPage/></AuthRoute>}/>
        <Route path={routePatterns.auditLogs} element={protectedPage(routeAccess.auditList, <AuditLogsPage/>)}/>
        <Route path={routePatterns.product} element={protectedPage(routeAccess.productsRead, <ProductsView/>)}/>
        <Route path={routePatterns.companyEdit} element={protectedPage(routeAccess.companiesUpdate, <OrganizationsEdit/>)}/>
        <Route path={routePatterns.productEdit} element={protectedPage(routeAccess.productsUpdate, <ProductsEdit/>)}/>
        <Route path={routePatterns.markingCodeOrders} element={protectedPage(routeAccess.ordersList, <MarkingCodes/>)}/>
        <Route path={routePatterns.ownedCodes} element={protectedPage(routeAccess.ownedCodesList, <OwnedCodes/>)}/>
        <Route path={routePatterns.markingCodeOrder} element={protectedPage(routeAccess.ordersRead, <Batches/>)}/>
        <Route path={routePatterns.markingCodeBatch} element={protectedPage(routeAccess.codesRead, <MarkingCodeProduct/>)}/>
        <Route path={routePatterns.aggregations} element={protectedPage(routeAccess.reportsList, <Aggregations/>)}/>
        <Route path={routePatterns.aggregationReport} element={protectedPage(routeAccess.reportsRead, <AggregationReportPage/>)}/>
        <Route path={routePatterns.customsCodes} element={protectedPage(routeAccess.customsCodesList, <CustomsCodesPage/>)} />
        <Route path={routePatterns.customsCode} element={protectedPage(routeAccess.customsCodesRead, <CustomsCodeDetails/>)} />
        <Route path={routePatterns.salesOrders} element={protectedPage(routeAccess.salesOrdersList, <SalesOrdersList/>)} />
        <Route path={routePatterns.salesOrderCreate} element={protectedPage(routeAccess.salesOrdersCreate, <SalesOrdersCreate/>)} />
        <Route path={routePatterns.salesOrder} element={protectedPage(routeAccess.salesOrdersRead, <SalesOrdersDetails/>)} />
        <Route path={routePatterns.deliveryRoutes} element={protectedPage(routeAccess.deliveryRoutesList, <DeliveryRoutesList/>)} />
        <Route path={routePatterns.deliveryRouteCreate} element={protectedPage(routeAccess.deliveryRoutesCreate, <DeliveryRoutesCreate/>)} />
        <Route path={routePatterns.deliveryRoute} element={protectedPage(routeAccess.deliveryRoutesRead, <DeliveryRoutesDetails/>)} />
        <Route path={routePatterns.deliveryRouteLoading} element={protectedPage(routeAccess.deliveryRoutesRead, <DeliveryRoutesLoading/>)} />
        <Route path={routePatterns.deliveryRouteReturn} element={protectedPage(routeAccess.deliveryRoutesRead, <DeliveryRoutesReturn/>)} />
        <Route path={routePatterns.vehicles} element={protectedPage(routeAccess.vehiclesList, <Vehicles/>)} />
        <Route path={routePatterns.vehicle} element={protectedPage(routeAccess.vehiclesRead, <VehicleDetails/>)} />
        <Route path={routePatterns.deliveryTasks} element={protectedPage(routeAccess.deliveryTasksList, <DeliveryTasksList/>)} />
        <Route path={routePatterns.deliveryTask} element={protectedPage(routeAccess.deliveryTasksRead, <DeliveryTasksDetails/>)} />
        <Route path={routePatterns.deliveryTaskScan} element={protectedPage(routeAccess.deliveryTasksRead, <DeliveryTasksScan/>)} />
        <Route path={routePatterns.invoices} element={protectedPage(routeAccess.invoicesList, <InvoicesList/>)} />
        <Route path={routePatterns.invoice} element={protectedPage(routeAccess.invoicesRead, <InvoicesDetails/>)} />
        <Route path={routePatterns.waybills} element={protectedPage(routeAccess.waybillsList, <WaybillsList/>)} />
        <Route path={routePatterns.waybill} element={protectedPage(routeAccess.waybillsRead, <WaybillsDetails/>)} />
        <Route path={routePatterns.companyIntegrations} element={protectedPage(routeAccess.integrationsRead, <CompanyIntegrations/>)} />
      </Routes>
    </Suspense>
  );
};

export default Router;



