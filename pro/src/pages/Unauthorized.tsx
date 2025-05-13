
import React from 'react';
import { Button } from '@/components/ui/button';
import { Link, useNavigate } from 'react-router-dom';
import { WifiOff, RefreshCw } from 'lucide-react';
import { useNetwork } from '@/components/NetworkStatus';

const Unauthorized: React.FC = () => {
  const navigate = useNavigate();
  const { isOnline } = useNetwork();
  const isOffline = !isOnline;
  
  const handleRetry = () => {
    // Try to go back to the previous page
    navigate(-1);
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center px-4 max-w-md">
        {isOffline ? (
          // Network connectivity issue UI
          <>
            <div className="mb-6 flex justify-center">
              <WifiOff size={64} className="text-yellow-500" />
            </div>
            <h1 className="text-3xl font-bold text-yellow-500 mb-4">Network Issue Detected</h1>
            <p className="text-gray-600 mb-6">
              It looks like you're offline or experiencing connectivity problems. This might be why you're seeing this page.
            </p>
            <div className="space-y-3">
              <Button 
                onClick={handleRetry} 
                className="w-full flex items-center justify-center"
                variant="outline"
              >
                <RefreshCw size={16} className="mr-2" />
                Retry Connection
              </Button>
              <Link to="/" className="block">
                <Button className="w-full">Return Home</Button>
              </Link>
            </div>
          </>
        ) : (
          // Standard unauthorized UI
          <>
            <h1 className="text-6xl font-bold text-red-500 mb-4">401</h1>
            <h2 className="text-2xl font-semibold mb-2">Unauthorized</h2>
            <p className="text-gray-600 mb-6">
              You don't have permission to access this page
            </p>
            <div className="space-y-3">
              <Button 
                onClick={handleRetry} 
                className="w-full"
                variant="outline"
              >
                Go Back
              </Button>
              <Link to="/" className="block">
                <Button className="w-full">Return Home</Button>
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Unauthorized;
