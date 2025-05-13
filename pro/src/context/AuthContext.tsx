import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from '@/components/ui/use-toast';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { UserModel } from '@/models/types';
import { Session, User } from '@supabase/supabase-js';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, role: 'admin' | 'user') => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session);
        setSession(session);
        setUser(session?.user ?? null);
        
        // Handle successful authentication events
        if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
          // Get the intended destination or default based on role
          const from = (location.state as any)?.from?.pathname || '/dashboard';
          const userRole = session?.user?.user_metadata?.role;
          
          // Determine where to redirect based on role
          let redirectPath = from;
          if (from === '/' || from === '/login' || from === '/register') {
            redirectPath = userRole === 'admin' ? '/admin' : '/dashboard';
          }

          // Only navigate if we're not already on the target page
          if (location.pathname !== redirectPath) {
            navigate(redirectPath, { replace: true });
            toast({
              title: "Sign in successful",
              description: "You have been signed in successfully!",
            });
          }
        } else if (event === 'USER_UPDATED') {
          toast({
            title: "Account updated",
            description: "Your account has been updated successfully!",
          });
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [navigate, location]);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw error;
      }
      
      toast({
        title: "Login successful",
        description: `Welcome back, ${email}!`,
      });
      
      // Check user metadata directly for role instead of fetching from profiles
      const userRole = data.user?.user_metadata?.role || 'user';
      
      // Debug - check what roles we're seeing
      console.log('User data:', data.user);
      console.log('User metadata:', data.user?.user_metadata);
      console.log('Role from metadata:', userRole);
      
      // Redirect based on role
      if (userRole === 'admin') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    } catch (error: any) {
      console.error("Login error:", error);
      toast({
        title: "Login failed",
        description: error.message || "Invalid email or password",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (email: string, password: string, role: 'admin' | 'user') => {
    setIsLoading(true);
    try {
      // Get current origin for redirect
      const currentOrigin = window.location.origin;
      console.log('Current origin for redirect:', currentOrigin);
      
      // Register user with Supabase
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            role: role,
          },
          emailRedirectTo: `${currentOrigin}/dashboard`,
        }
      });

      if (error) {
        throw error;
      }
      
      toast({
        title: "Registration successful",
        description: "Please check your email to confirm your account.",
      });
      
      // Stay on the same page and show a confirmation message
      // Do not navigate away as the user needs to confirm their email
    } catch (error: any) {
      console.error("Registration error:", error);
      toast({
        title: "Registration failed",
        description: error.message || "An error occurred during registration",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
      navigate('/');
      toast({
        title: "Logged out",
        description: "You have been successfully logged out",
      });
    } catch (error: any) {
      console.error("Logout error:", error);
      toast({
        title: "Error",
        description: error.message || "An error occurred during logout",
        variant: "destructive",
      });
    }
  };

  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    register,
    logout
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
