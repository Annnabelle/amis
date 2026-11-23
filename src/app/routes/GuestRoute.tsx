import type { ReactNode } from 'react';
import { routes } from "shared/config/routes";
import { Navigate } from 'react-router-dom';
import { useAppSelector } from 'app/store';
import GlobalLoader from 'shared/ui/loader';

type GuestRouteProps = {
  children: ReactNode;
};

// public auth pages — redirect away if already logged in
export const GuestRoute = ({ children }: GuestRouteProps) => {
  const isAuthenticated = useAppSelector((state) => state.users.isAuthenticated);
  const isRestoring = useAppSelector((state) => state.users.isRestoring);

  // Иначе вошедший пользователь успеет увидеть форму входа.
  if (isRestoring) {
    return <GlobalLoader loading />;
  }

  if (isAuthenticated) {
    return <Navigate to={routes.login()} replace />;
  }

  return <>{children}</>;
};
