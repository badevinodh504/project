"use client";

import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from '@/components/ui/use-toast';
import UserDashboardLayout from '@/components/UserDashboardLayout';
import { Cuboid, Upload, Download, Image } from 'lucide-react';
import ModelViewer from '@/components/ModelViewer';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';

const UserDashboard: React.FC = () => {
  const [image, setImage] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [is3DReady, setIs3DReady] = useState(false);
  const [uploadId, setUploadId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { user } = useAuth();

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIs3DReady(false);
      const reader = new FileReader();
      reader.onload = () => {
        setImage(reader.result as string);
        toast({
          title: "Image uploaded",
          description: "Your image has been uploaded successfully.",
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenerate3D = async () => {
    if (!image || !user) return;
    
    setIsGenerating(true);
    
    try {
      // Create a new upload record directly in Supabase
      const fileName = fileInputRef.current?.files?.[0]?.name || 'Unknown.jpg';
      
      // Insert the upload record into Supabase
      const { data, error } = await supabase
        .from('uploads')
        .insert({
          name: fileName,
          user_id: user.id,
          original_image: image,
          model_generated: false,
          date: new Date().toISOString()
        })
        .select()
        .single();
      
      if (error) {
        console.error('Error creating upload record:', error);
        throw new Error('Failed to create upload record');
      }
      
      console.log('Upload record created:', data);
      setUploadId(data.id);
      
      // Simulate 3D generation process with a delay
      setTimeout(async () => {
        // Update the upload record to mark the model as generated
        const modelUrl = `https://example.com/models/${data.id}.glb`; // Simulated URL
        
        const { error: updateError } = await supabase
          .from('uploads')
          .update({ 
            model_generated: true,
            model_url: modelUrl
          })
          .eq('id', data.id);
        
        if (updateError) {
          console.error('Failed to update upload record:', updateError);
        }
        
        setIsGenerating(false);
        setIs3DReady(true);
        toast({
          title: "3D Model Ready",
          description: "Your 3D model has been generated successfully.",
        });
      }, 3000);
      
    } catch (error) {
      console.error('Error generating 3D model:', error);
      setIsGenerating(false);
      toast({
        title: "Error",
        description: "Failed to generate 3D model. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDownload = async () => {
    if (!uploadId) return;
    
    try {
      // Get the model URL from Supabase
      const { data, error } = await supabase
        .from('uploads')
        .select('model_url')
        .eq('id', uploadId)
        .single();
      
      if (error) {
        throw new Error('Failed to retrieve model');
      }
      
      if (!data.model_url) {
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
      
      // In a real app, this would download the actual 3D model file
      window.open(data.model_url, '_blank');
    } catch (error) {
      console.error('Error downloading model:', error);
      toast({
        title: "Error",
        description: "Failed to download model. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleTriggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <UserDashboardLayout>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="overflow-hidden">
          <CardContent className="p-0">
            <div className="p-4 border-b">
              <h2 className="text-xl font-medium">Input Image</h2>
              <p className="text-sm text-muted-foreground">Upload a 2D image to convert</p>
            </div>
            
            <div className="p-6">
              {image ? (
                <div className="relative rounded-md overflow-hidden">
                  <img src={image} alt="Uploaded" className="w-full object-cover h-64" />
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="absolute top-2 right-2 bg-white/90"
                    onClick={handleTriggerFileInput}
                  >
                    Change
                  </Button>
                </div>
              ) : (
                <div 
                  className="border-2 border-dashed border-gray-200 rounded-md p-8 text-center cursor-pointer hover:bg-gray-50 transition-colors"
                  onClick={handleTriggerFileInput}
                >
                  <Image size={48} className="mx-auto mb-4 text-gray-400" />
                  <p className="text-gray-500 mb-2">Click to upload an image</p>
                  <p className="text-xs text-gray-400">Supports: JPG, PNG, WEBP (Max 10MB)</p>
                </div>
              )}
              <input 
                type="file" 
                ref={fileInputRef}
                className="hidden" 
                accept="image/*" 
                onChange={handleImageUpload} 
              />
              
              <div className="mt-4 flex justify-center">
                <Button 
                  onClick={handleTriggerFileInput}
                  variant="outline" 
                  className="w-full"
                  disabled={isGenerating}
                >
                  <Upload size={16} className="mr-2" />
                  Upload Image
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-0">
            <div className="p-4 border-b">
              <h2 className="text-xl font-medium">3D Output</h2>
              <p className="text-sm text-muted-foreground">Your generated 3D model</p>
            </div>
            
            <div className="p-6">
              <div className="bg-gray-100 rounded-md h-64 scene-container flex items-center justify-center">
                {isGenerating ? (
                  <div className="text-center">
                    <div className="animate-spin w-12 h-12 border-4 border-t-primary rounded-full mb-4 mx-auto"></div>
                    <p className="text-gray-500">Generating 3D model...</p>
                    <p className="text-xs text-gray-400 mt-2">This may take a moment</p>
                  </div>
                ) : is3DReady ? (
                  <div className="w-full h-full">
                    <ModelViewer imageUrl={image} />
                  </div>
                ) : (
                  <div className="text-center">
                    <Cuboid size={64} className="mx-auto mb-4 text-gray-300" />
                    <p className="text-gray-500">Upload an image and generate a 3D model</p>
                  </div>
                )}
              </div>
              
              <div className="mt-4 flex space-x-3">
                <Button 
                  onClick={handleGenerate3D} 
                  className="flex-1 btn-gradient"
                  disabled={!image || isGenerating}
                >
                  {isGenerating ? (
                    <>
                      <div className="animate-spin w-4 h-4 border-2 border-t-white rounded-full mr-2"></div>
                      Processing...
                    </>
                  ) : (
                    <>Convert to 3D</>
                  )}
                </Button>
                
                <Button 
                  onClick={handleDownload} 
                  variant="outline"
                  disabled={!is3DReady}
                >
                  <Download size={16} className="mr-2" />
                  Download
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="mt-8">
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-medium mb-4">Tips for Better Results</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start">
                <div className="rounded-full bg-primary/10 p-1 mr-2 mt-0.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                </div>
                <span>Use images with clear outlines and good lighting</span>
              </li>
              <li className="flex items-start">
                <div className="rounded-full bg-primary/10 p-1 mr-2 mt-0.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                </div>
                <span>Avoid images with complex backgrounds or multiple overlapping objects</span>
              </li>
              <li className="flex items-start">
                <div className="rounded-full bg-primary/10 p-1 mr-2 mt-0.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                </div>
                <span>For best results, use images with multiple angles of the same object</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </UserDashboardLayout>
  );
};

export default UserDashboard;
