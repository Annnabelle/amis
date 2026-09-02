import type { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAppSelector } from 'app/store';

type GuestRouteProps = {
  children: ReactNode;
};

// public auth pages — redirect away if already logged in
export const GuestRoute = ({ children }: GuestRouteProps) => {
  const isAuthenticated = useAppSelector((state) => state.users.isAuthenticated);

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};
