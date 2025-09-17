import { Navigate, useLocation } from 'react-router-dom';
import { useAuth, UserRole } from '@/context/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: UserRole;
}

const ProtectedRoute = ({ children, requiredRole }: ProtectedRouteProps) => {
  // --- Start of Fix ---
  // Destructure userType instead of role
  const { user, userType, loading } = useAuth();
  // --- End of Fix ---
  const location = useLocation();

  if (loading) {
    return <div>Loading...</div>; // Or a spinner component
  }

  if (!user) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  // --- Start of Fix ---
  // Check against userType
  if (requiredRole && userType !== requiredRole) {
    return <Navigate to="/" replace />; // Or to an 'unauthorized' page
  }
  // --- End of Fix ---

  // Handle pending sellers trying to access the seller dashboard
  if (userType === 'seller' && user.applicationStatus === 'pending') {
    return <div>Your seller application is pending approval.</div>; // Or a dedicated pending page
  }

  return <>{children}</>;
};

export default ProtectedRoute;