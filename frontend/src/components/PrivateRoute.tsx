import { Navigate } from 'react-router-dom';

type PrivateRouteProps = {
  children: React.ReactNode;
};

function PrivateRoute({ children }: PrivateRouteProps) {
  const token = localStorage.getItem('token');

  if (!token) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}

export default PrivateRoute;