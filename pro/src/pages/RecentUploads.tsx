
import React from 'react';
import { Button } from '@/components/ui/button';
import UserDashboardLayout from '@/components/UserDashboardLayout';
import { Download, ArrowRight, Image } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { toast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';

interface Upload {
  id: string;
  name: string;
  date: string;
  original_image: string;
  model_generated: boolean;
  model_url: string | null;
}

const RecentUploads: React.FC = () => {
  const { user } = useAuth();

  // Fetch user uploads from Supabase
  const { data: uploads = [], isLoading, error } = useQuery({
    queryKey: ['user-uploads', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('uploads')
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: false });
      
      if (error) {
        console.error('Error fetching uploads:', error);
        throw new Error(error.message);
      }
      
      return data as Upload[];
    },
    enabled: !!user, // Only run the query if user is available
  });

  // Display error toast if fetch fails
  React.useEffect(() => {
    if (error) {
      toast({
        title: "Error",
        description: "Failed to load your recent uploads",
        variant: "destructive",
      });
    }
  }, [error]);

  const handleDownload = (uploadId: string, modelUrl: string | null) => {
    if (!modelUrl) {
      toast({
        title: "Model not available",
        description: "The 3D model is still being processed.",
        variant: "destructive",
      });
      return;
    }
    
    toast({
      title: "Download started",
      description: "Your 3D model is being downloaded.",
    });
    
    // In a real app, this would initiate the actual download
    window.open(modelUrl, '_blank');
  };

  const goToConverter = () => {
    // Navigate to converter page
    window.location.href = '/dashboard';
  };

  return (
    <UserDashboardLayout>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-medium">Recent Uploads</h2>
      </div>
      
      {isLoading ? (
        <div className="h-64 flex items-center justify-center">
          <div className="animate-spin w-10 h-10 border-4 border-t-primary rounded-full"></div>
        </div>
      ) : uploads.length === 0 ? (
        <div className="text-center py-16 border-2 border-dashed border-gray-200 rounded-lg">
          <Image size={48} className="mx-auto mb-4 text-gray-300" />
          <h3 className="text-lg font-medium text-gray-900 mb-1">No uploads yet</h3>
          <p className="text-gray-500 mb-4">Start by uploading an image to convert</p>
          <Button variant="outline" className="mx-auto" onClick={goToConverter}>
            <Image size={16} className="mr-2" />
            Go to Converter
            <ArrowRight size={16} className="ml-2" />
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {uploads.map((item) => (
            <div key={item.id} className="model-card">
              <div className="aspect-square mb-3 bg-gray-100 rounded-md overflow-hidden relative">
                <img 
                  src={item.original_image} 
                  alt={item.name}
                  className="w-full h-full object-cover"
                />
              </div>
              
              <div>
                <h3 className="font-medium mb-1 truncate" title={item.name}>
                  {item.name}
                </h3>
                <p className="text-sm text-muted-foreground mb-3">
                  {new Date(item.date).toLocaleString()}
                </p>
              </div>
              
              <div className="model-card-footer">
                <div className="flex justify-between items-center">
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${
                    item.model_generated 
                      ? "bg-green-100 text-green-800" 
                      : "bg-amber-100 text-amber-800"
                  }`}>
                    {item.model_generated ? "3D Model Ready" : "Processing"}
                  </span>
                  
                  <Button 
                    size="sm" 
                    variant="outline" 
                    disabled={!item.model_generated}
                    onClick={() => handleDownload(item.id, item.model_url)}
                  >
                    <Download size={14} className="mr-1" />
                    Download
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </UserDashboardLayout>
  );
};

export default RecentUploads;
