
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Cuboid, ArrowRight } from 'lucide-react';
import Navbar from '@/components/Navbar';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 to-purple-50">
      <Navbar />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4 flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 md:pr-12 mb-8 md:mb-0">
              <h1 className="text-4xl md:text-5xl font-bold mb-6 text-app-dark">
                Transform 2D Images into <span className="text-transparent bg-clip-text bg-gradient-to-r from-app-blue to-app-purple">3D Models</span>
              </h1>
              <p className="text-lg mb-8 text-gray-600 max-w-lg">
                Upload your 2D images and instantly convert them into stunning 3D models with our 
                AI-powered platform. Download, share, and use your creations anywhere.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link to="/register">
                  <Button className="btn-gradient px-8 py-6 text-lg">
                    Get Started
                    <ArrowRight size={18} className="ml-2" />
                  </Button>
                </Link>
                <Link to="/login">
                  <Button variant="outline" className="px-8 py-6 text-lg">
                    Login
                  </Button>
                </Link>
              </div>
            </div>
            <div className="md:w-1/2 flex justify-center">
              <div className="relative w-64 h-64 md:w-80 md:h-80">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl blur-xl opacity-20 animate-pulse"></div>
                <div className="relative flex items-center justify-center h-full">
                  <Cuboid size={120} className="text-app-blue animate-spin-slow" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Cuboid size={80} className="text-app-purple" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Features */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { 
                  title: "Upload", 
                  desc: "Upload any 2D image from your device",
                },
                { 
                  title: "Convert", 
                  desc: "Our AI processes and converts your image to 3D",
                },
                { 
                  title: "Download", 
                  desc: "Download your new 3D model in various formats",
                }
              ].map((feature, index) => (
                <Card key={index} className="border-none shadow-md">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-center w-12 h-12 mb-4 rounded-full bg-gradient-to-r from-app-blue to-app-purple text-white font-bold">
                      {index + 1}
                    </div>
                    <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                    <p className="text-gray-600">{feature.desc}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
        
        {/* CTA */}
        <section className="py-16 bg-gradient-to-r from-app-blue to-app-purple text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to create amazing 3D models?</h2>
            <p className="mb-8 max-w-xl mx-auto">
              Join thousands of users who are already transforming their 2D images into stunning 3D models.
            </p>
            <Link to="/register">
              <Button variant="secondary" size="lg">
                Create Free Account
              </Button>
            </Link>
          </div>
        </section>
      </main>
      
      <footer className="bg-app-dark text-white py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <Cuboid size={24} className="mr-2 text-app-blue" />
              <span className="font-bold text-lg">MorphScape</span>
            </div>
            <p className="text-sm text-gray-400">
              © {new Date().getFullYear()} MorphScape. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
