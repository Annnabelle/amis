import { Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";

const LoginPage = lazy(() => import("../pages/login"));
const MainPage = lazy(() => import("../pages/main"));
const Users = lazy(() => import("../pages/users"));

const Router: React.FC = () => {
  return (
    <Suspense fallback={<div>Загрузка...</div>}>
      <Routes>
        <Route path='/' element={<LoginPage />} />
        <Route path='/home' element={<MainPage />} />
        <Route path='/users' element={<Users />} />
      </Routes>
    </Suspense>
  );
};

export default Router;
