
import React, { useEffect } from 'react';
import Navbar from './Navbar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { toast } from '@/components/ui/use-toast';
import { useNetwork } from './NetworkStatus';

interface UserDashboardLayoutProps {
  children: React.ReactNode;
}

const UserDashboardLayout: React.FC<UserDashboardLayoutProps> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useAuth();
  
  const currentTab = location.pathname.includes('/recent') 
    ? 'recent' 
    : 'converter';
  
  useEffect(() => {
    // Log the current navigation state
    console.log('Dashboard Layout:', { 
      currentTab, 
      path: location.pathname, 
      isAuthenticated 
    });
  }, [currentTab, location.pathname, isAuthenticated]);

  const { isOnline } = useNetwork();

  const handleTabChange = (value: string) => {
    // Check for network connectivity before navigation
    if (!isOnline) {
      toast({
        title: "Network Error",
        description: "You appear to be offline. Please check your internet connection.",
        variant: "destructive"
      });
      return;
    }
    
    // Prevent unnecessary navigation if we're already on the correct route
    const targetPath = value === 'recent' ? '/recent' : '/dashboard';
    if (location.pathname !== targetPath) {
      navigate(targetPath);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <div className="flex-1 container mx-auto px-4 py-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-app-dark">User Dashboard</h1>
          <p className="text-muted-foreground">Transform your 2D images into 3D models</p>
        </div>
        
        <Tabs 
          defaultValue={currentTab} 
          value={currentTab} 
          onValueChange={handleTabChange} 
          className="w-full"
        >
          <TabsList className="grid grid-cols-2 w-full max-w-md mb-6">
            <TabsTrigger value="converter">Converter</TabsTrigger>
            <TabsTrigger value="recent">Recent Uploads</TabsTrigger>
          </TabsList>
          <TabsContent value={currentTab} className="mt-0 relative z-0">
            {children}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default UserDashboardLayout;
