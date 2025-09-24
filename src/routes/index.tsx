import { Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";


const LoginPage = lazy(() => import("../pages/login"));
const MainPage = lazy(() => import("../pages/main"));
const Users = lazy(() => import("../pages/users"));
const Products = lazy(() => import( "../pages/products"));
const Organizations = lazy(() => import ("../pages/organizations"))
const OrganizationsInner = lazy(() => import('../pages/organizationInner'))
const UserSettings = lazy(() => import('../pages/user-settings'))
const UsersRetrieve = lazy(() => import('../pages/users/userRetrieve'))
const UsersEdit = lazy(() => import('../pages/users/userEdit'))

const Router: React.FC = () => {
  return (
    <Suspense fallback={<div>Загрузка...</div>}>
      <Routes>
        <Route path='/' element={<LoginPage />} />
        <Route path='/home' element={<MainPage />} />
        <Route path='/users' element={<Users />} />
        <Route path="/users/:id" element={<UsersRetrieve />} />
        <Route path="/users/:id/edit" element={<UsersEdit />} />
        {/* <Route path='/products' element={<Products/>}/> */}
        <Route path='/organization' element={<Organizations/>}/>
        <Route path='organization/:id' element={<OrganizationsInner/>}/>
        <Route path= 'organization/:id/products' element={<Products/>}/>
        <Route path='/profile' element={<UserSettings/>}/>
      </Routes>
    </Suspense>
  );
};

export default Router;
