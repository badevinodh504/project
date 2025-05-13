
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import NetworkStatusIndicator from './NetworkStatusIndicator';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Cuboid, LogOut, User, Settings } from 'lucide-react';

const Navbar: React.FC = () => {
  const { user, logout, isAuthenticated } = useAuth();

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <div className="relative">
            <Cuboid size={28} className="text-app-blue" />
            <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
              <Cuboid size={20} className="text-app-purple" />
            </div>
          </div>
          <span className="text-xl font-bold text-app-dark">MorphScape</span>
        </Link>
        
        <div className="flex items-center space-x-4">
          <NetworkStatusIndicator showOfflineOnly={true} />
          {isAuthenticated ? (
            <div className="flex items-center space-x-4">
              {user?.role === 'admin' ? (
                <Link to="/admin">
                  <Button variant="ghost">Admin</Button>
                </Link>
              ) : (
                <Link to="/dashboard">
                  <Button variant="ghost">Dashboard</Button>
                </Link>
              )}
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon">
                    <User size={18} />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem className="text-sm">
                    <User size={14} className="mr-2" />
                    <span>{user?.email}</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-sm">
                    <Settings size={14} className="mr-2" />
                    <span>Settings</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    className="text-sm text-red-500 focus:text-red-500" 
                    onClick={logout}
                  >
                    <LogOut size={14} className="mr-2" />
                    <span>Logout</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ) : (
            <div className="space-x-2">
              <Link to="/login">
                <Button variant="outline">Log in</Button>
              </Link>
              <Link to="/register">
                <Button className="btn-gradient">Sign up</Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
