import type { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAppSelector } from 'app/store';

type AuthRouteProps = {
  children: ReactNode;
};

// pages that need only a logged-in user, no permission check (profile, change password)
export const AuthRoute = ({ children }: AuthRouteProps) => {
  const isAuthenticated = useAppSelector((state) => state.users.isAuthenticated);

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};
