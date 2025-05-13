
import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const Unauthorized: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center px-4">
        <h1 className="text-6xl font-bold text-red-500 mb-4">401</h1>
        <h2 className="text-2xl font-semibold mb-2">Unauthorized</h2>
        <p className="text-gray-600 mb-6">
          You don't have permission to access this page
        </p>
        <div className="space-x-4">
          <Link to="/">
            <Button>Return Home</Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Unauthorized;
