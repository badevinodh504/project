
import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useNetwork } from './NetworkStatus';

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

  // Get network status from context
  const { isOnline } = useNetwork();

  // Show loading state while authentication is being checked
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-12 h-12 border-4 border-t-primary rounded-full"></div>
      </div>
    );
  }
  
  // Handle offline state - allow access to cached content instead of redirecting
  if (!isOnline) {
    // If we're offline but have cached authentication state, continue showing the page
    if (isAuthenticated) {
      return <>{children}</>;
    }
    // If we're offline and not authenticated, show a helpful message instead of redirecting
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center px-4">
          <h1 className="text-6xl font-bold text-yellow-500 mb-4">Offline</h1>
          <h2 className="text-2xl font-semibold mb-2">Network Connection Lost</h2>
          <p className="text-gray-600 mb-6">
            Please check your internet connection and try again
          </p>
        </div>
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
