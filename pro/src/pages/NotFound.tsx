import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname,
      { isAuthenticated }
    );
  }, [location.pathname, isAuthenticated]);

  const handleGoBack = () => {
    // Navigate to the appropriate default page based on authentication status
    if (isAuthenticated) {
      navigate('/dashboard');
    } else {
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center bg-white p-8 rounded-lg shadow-md max-w-md">
        <h1 className="text-6xl font-bold mb-4 text-gray-800">404</h1>
        <p className="text-xl text-gray-600 mb-6">Oops! Page not found</p>
        <p className="text-gray-500 mb-6">
          The page you are looking for doesn't exist or has been moved.
        </p>
        <div className="space-y-2">
          <Button onClick={handleGoBack} className="w-full">
            {isAuthenticated ? 'Return to Dashboard' : 'Return to Home'}
          </Button>
          <Button variant="outline" onClick={() => navigate(-1)} className="w-full">
            Go Back
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
