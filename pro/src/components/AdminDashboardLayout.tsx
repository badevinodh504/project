
import React from 'react';
import Navbar from './Navbar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useNavigate, useLocation } from 'react-router-dom';

interface AdminDashboardLayoutProps {
  children: React.ReactNode;
}

const AdminDashboardLayout: React.FC<AdminDashboardLayoutProps> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const currentTab = location.pathname.includes('/admin/activity') 
    ? 'activity' 
    : 'users';

  const handleTabChange = (value: string) => {
    if (value === 'activity') {
      navigate('/admin/activity');
    } else {
      navigate('/admin');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <div className="flex-1 container mx-auto px-4 py-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-app-dark">Admin Dashboard</h1>
          <p className="text-muted-foreground">Manage users and monitor platform activity</p>
        </div>
        
        <Tabs defaultValue={currentTab} value={currentTab} onValueChange={handleTabChange} className="w-full">
          <TabsList className="grid grid-cols-2 w-full max-w-md mb-6">
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
          </TabsList>
          <TabsContent value={currentTab} className="mt-0">
            {children}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboardLayout;
