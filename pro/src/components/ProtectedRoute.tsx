
import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'admin' | 'user';
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requiredRole 
}) => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  // Log the authentication state for debugging
  useEffect(() => {
    console.log('Protected Route Auth State:', { 
      isAuthenticated, 
      isLoading, 
      user: user?.email,
      role: user?.user_metadata?.role,
      path: location.pathname
    });
  }, [isAuthenticated, isLoading, user, location.pathname]);

  // Show loading state while authentication is being checked
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-12 h-12 border-4 border-t-primary rounded-full"></div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    // Save the current location to redirect back after login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check if the user has the required role
  if (requiredRole && user?.user_metadata?.role !== requiredRole) {
    return <Navigate to="/unauthorized" replace />;
  }

  // User is authenticated and has the required role
  return <>{children}</>;
};

export default ProtectedRoute;
