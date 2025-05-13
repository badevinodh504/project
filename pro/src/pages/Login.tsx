
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Cuboid } from 'lucide-react';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, isLoading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    await login(email, password);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-2">
            <div className="relative">
              <Cuboid size={50} className="text-app-blue animate-spin-slow" />
              <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
                <Cuboid size={40} className="text-app-purple" />
              </div>
            </div>
          </div>
          <h1 className="text-3xl font-bold text-app-dark">MorphScape</h1>
          <p className="text-app-gray">2D to 3D Conversion Platform</p>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Login</CardTitle>
            <CardDescription>Enter your credentials to access your account</CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="example@email.com" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  required 
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <Link to="/forgot-password" className="text-xs text-primary hover:underline">
                    Forgot password?
                  </Link>
                </div>
                <Input 
                  id="password" 
                  type="password" 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  required 
                />
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <Button 
                type="submit" 
                className="w-full btn-gradient" 
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <div className="animate-spin mr-2 w-4 h-4 border-2 border-t-white rounded-full"></div>
                    <span>Logging in...</span>
                  </div>
                ) : (
                  'Login'
                )}
              </Button>
              <div className="text-center text-sm">
                Don't have an account?{' '}
                <Link to="/register" className="text-primary hover:underline">
                  Create one
                </Link>
              </div>
            </CardFooter>
          </form>
        </Card>
        
       
      </div>
    </div>
  );
};

export default Login;
