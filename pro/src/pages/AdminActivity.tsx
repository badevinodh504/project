
import React, { useState, useEffect } from 'react';
import AdminDashboardLayout from '@/components/AdminDashboardLayout';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { useQuery } from '@tanstack/react-query';

interface ActivityItem {
  id: string;
  user: string;
  action: string;
  date: string;
  status: string;
}

interface StatsData {
  totalUsers: number;
  activeUsers: number;
  totalUploads: number;
  conversionsCount: number;
}

// Function to fetch stats data
const fetchStatsData = async (): Promise<StatsData> => {
  // Get total users count
  const { count: totalUsers, error: usersError } = await supabase
    .from('profiles')
    .select('*', { count: 'exact', head: true });
  
  if (usersError) throw new Error(usersError.message);
  
  // Get active users count
  const { count: activeUsers, error: activeUsersError } = await supabase
    .from('profiles')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'active');
  
  if (activeUsersError) throw new Error(activeUsersError.message);
  
  // Get total uploads count
  const { count: totalUploads, error: uploadsError } = await supabase
    .from('uploads')
    .select('*', { count: 'exact', head: true });
  
  if (uploadsError) throw new Error(uploadsError.message);
  
  // Get conversions count (uploads with model_generated = true)
  const { count: conversionsCount, error: conversionsError } = await supabase
    .from('uploads')
    .select('*', { count: 'exact', head: true })
    .eq('model_generated', true);
  
  if (conversionsError) throw new Error(conversionsError.message);
  
  return {
    totalUsers: totalUsers || 0,
    activeUsers: activeUsers || 0,
    totalUploads: totalUploads || 0,
    conversionsCount: conversionsCount || 0
  };
};

// Function to fetch recent activity
const fetchRecentActivity = async (): Promise<ActivityItem[]> => {
  // Get recent uploads with user info
  const { data, error } = await supabase
    .from('uploads')
    .select(`
      id,
      name,
      date,
      model_generated,
      profiles!uploads_user_id_fkey (email)
    `)
    .order('date', { ascending: false })
    .limit(5);
  
  if (error) throw new Error(error.message);
  
  // Transform the data to match the ActivityItem interface
  return (data || []).map(item => ({
    id: item.id,
    user: item.profiles?.email || 'unknown user',
    action: 'Uploaded ' + item.name,
    date: new Date(item.date).toLocaleString(),
    status: item.model_generated ? 'success' : 'processing'
  }));
};

// Function to fetch chart data
const fetchChartData = async () => {
  // We'll need to create a query that gets monthly counts
  // This is a simplified version - in a real app you'd use SQL date functions
  const { data: uploads, error: uploadsError } = await supabase
    .from('uploads')
    .select('date, model_generated');
  
  if (uploadsError) throw new Error(uploadsError.message);
  
  const { data: users, error: usersError } = await supabase
    .from('profiles')
    .select('join_date');
  
  if (usersError) throw new Error(usersError.message);
  
  // Group by month
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const chartData = months.map(month => {
    const monthIndex = months.indexOf(month);
    
    // Count users registered in this month
    const usersCount = users?.filter(user => {
      const date = new Date(user.join_date);
      return date.getMonth() === monthIndex;
    }).length || 0;
    
    // Count uploads in this month
    const uploadsCount = uploads?.filter(upload => {
      const date = new Date(upload.date);
      return date.getMonth() === monthIndex;
    }).length || 0;
    
    // Count conversions in this month
    const conversionsCount = uploads?.filter(upload => {
      const date = new Date(upload.date);
      return date.getMonth() === monthIndex && upload.model_generated === true;
    }).length || 0;
    
    return {
      name: month,
      users: usersCount,
      uploads: uploadsCount,
      conversions: conversionsCount
    };
  });
  
  return chartData;
};

const Stats: React.FC = () => {
  // Fetch stats data
  const { data: statsData, isLoading: isStatsLoading, error: statsError } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: fetchStatsData,
  });
  
  // Fetch chart data
  const { data: chartData = [], isLoading: isChartLoading, error: chartError } = useQuery({
    queryKey: ['dashboard-chart'],
    queryFn: fetchChartData,
  });
  
  // Fetch recent activity
  const { data: recentActivity = [], isLoading: isActivityLoading, error: activityError } = useQuery({
    queryKey: ['recent-activity'],
    queryFn: fetchRecentActivity,
  });
  
  // Show toast for errors
  useEffect(() => {
    if (statsError || chartError || activityError) {
      toast({
        title: "Error",
        description: "Failed to load dashboard data",
        variant: "destructive",
      });
    }
  }, [statsError, chartError, activityError]);
  
  // Loading state for entire page
  const isLoading = isStatsLoading || isChartLoading || isActivityLoading;

  return (
    <AdminDashboardLayout>
      <div className="space-y-6">
        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { 
              title: 'Total Users', 
              value: statsData?.totalUsers || 0, 
              growth: '+12%', // Note: In a real app, calculate this dynamically
              desc: 'vs. last month' 
            },
            { 
              title: 'Active Users', 
              value: statsData?.activeUsers || 0, 
              growth: '+8%', 
              desc: 'vs. last month' 
            },
            { 
              title: 'Total Uploads', 
              value: statsData?.totalUploads || 0, 
              growth: '+23%', 
              desc: 'vs. last month' 
            },
            { 
              title: '3D Conversions', 
              value: statsData?.conversionsCount || 0, 
              growth: '+18%', 
              desc: 'vs. last month' 
            },
          ].map((stat, index) => (
            <Card key={index}>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground flex items-center mt-1">
                  <span className={stat.growth.startsWith('+') ? 'text-green-500' : 'text-red-500'}>
                    {stat.growth}
                  </span>
                  <span className="ml-1">{stat.desc}</span>
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Activity Chart */}
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Platform Activity</CardTitle>
            <CardDescription>
              User registrations, uploads, and 3D conversions over time
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-2">
            <div className="h-80">
              {isLoading ? (
                <div className="h-full flex items-center justify-center">
                  <div className="animate-spin w-10 h-10 border-4 border-t-primary rounded-full"></div>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={chartData}
                    margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#0EA5E9" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#0EA5E9" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorUploads" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorConversions" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10B981" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Area type="monotone" dataKey="users" stroke="#0EA5E9" fillOpacity={1} fill="url(#colorUsers)" />
                    <Area type="monotone" dataKey="uploads" stroke="#8B5CF6" fillOpacity={1} fill="url(#colorUploads)" />
                    <Area type="monotone" dataKey="conversions" stroke="#10B981" fillOpacity={1} fill="url(#colorConversions)" />
                  </AreaChart>
                </ResponsiveContainer>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>
              Latest platform activities across all users
            </CardDescription>
          </CardHeader>
          <CardContent>
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
                      <TableHead>Action</TableHead>
                      <TableHead>Date & Time</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentActivity.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={4} className="h-32 text-center">
                          No recent activity
                        </TableCell>
                      </TableRow>
                    ) : (
                      recentActivity.map((activity) => (
                        <TableRow key={activity.id}>
                          <TableCell className="font-medium">{activity.user}</TableCell>
                          <TableCell>{activity.action}</TableCell>
                          <TableCell>{activity.date}</TableCell>
                          <TableCell>
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${
                              activity.status === 'success' 
                                ? "bg-green-100 text-green-800" 
                                : activity.status === 'processing'
                                  ? "bg-amber-100 text-amber-800"
                                  : "bg-red-100 text-red-800"
                            }`}>
                              {activity.status}
                            </span>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminDashboardLayout>
  );
};

export default Stats;
