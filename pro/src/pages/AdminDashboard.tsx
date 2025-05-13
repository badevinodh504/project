
import React, { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import AdminDashboardLayout from '@/components/AdminDashboardLayout';
import { Search, UserCircle } from 'lucide-react';
import { UserModel } from '@/models/types';
import { toast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';

interface Profile {
  id: string;
  email: string;
  name: string | null;
  role: string;
  status: string;
  uploads: number;
  join_date: string;
}

const fetchUsers = async (): Promise<Profile[]> => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*');
    
  if (error) {
    console.error('Error fetching users:', error);
    throw new Error(error.message);
  }
  
  return data || [];
};

const AdminDashboard: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  
  const { data: users = [], isLoading, error } = useQuery({
    queryKey: ['users'],
    queryFn: fetchUsers,
  });

  // Show toast if error
  useEffect(() => {
    if (error) {
      toast({
        title: "Error",
        description: "Failed to load user data",
        variant: "destructive",
      });
    }
  }, [error]);
  
  const filteredUsers = users.filter(user => 
    (user.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleViewUser = (userId: string) => {
    console.log(`View user: ${userId}`);
    // This would navigate to a user details page in a real application
  };

  return (
    <AdminDashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row gap-4 sm:items-center justify-between">
          <h2 className="text-2xl font-medium">User Management</h2>
          
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search users..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        
        <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
          {isLoading ? (
            <div className="h-64 flex items-center justify-center">
              <div className="animate-spin w-10 h-10 border-4 border-t-primary rounded-full"></div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Uploads</TableHead>
                    <TableHead>Join Date</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="h-32 text-center">
                        No users found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredUsers.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell className="py-4">
                          <div className="flex items-center">
                            <div className="mr-3 rounded-full bg-gray-100 p-2">
                              <UserCircle className="h-6 w-6 text-gray-500" />
                            </div>
                            <div>
                              <div className="font-medium">{user.name || user.email.split('@')[0]}</div>
                              <div className="text-sm text-muted-foreground">
                                {user.email}
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={user.role === 'admin' ? 'default' : 'outline'}>
                            {user.role}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={user.status === 'active' ? 'secondary' : 'destructive'}>
                            {user.status || 'active'}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">{user.uploads || 0}</TableCell>
                        <TableCell>{user.join_date || 'N/A'}</TableCell>
                        <TableCell>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleViewUser(user.id)}>
                            View
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      </div>
    </AdminDashboardLayout>
  );
};

export default AdminDashboard;
