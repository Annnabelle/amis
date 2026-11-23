import type { ReactNode } from 'react';
import { routes } from "shared/config/routes";
import { Navigate } from 'react-router-dom';
import { useAppSelector } from 'app/store';
import GlobalLoader from 'shared/ui/loader';

type AuthRouteProps = {
  children: ReactNode;
};

// pages that need only a logged-in user, no permission check (profile, change password)
export const AuthRoute = ({ children }: AuthRouteProps) => {
  const isAuthenticated = useAppSelector((state) => state.users.isAuthenticated);
  const isRestoring = useAppSelector((state) => state.users.isRestoring);

  // Сессия ещё поднимается по cookie: уводить со страницы рано.
  if (isRestoring) {
    return <GlobalLoader loading />;
  }

  if (!isAuthenticated) {
    return <Navigate to={routes.login()} replace />;
  }

  return <>{children}</>;
};
