import React, { createContext, useContext, useEffect, useState } from 'react';
import { toast } from '@/components/ui/use-toast';

interface NetworkContextType {
  isOnline: boolean;
  lastOnlineTime: Date | null;
}

const NetworkContext = createContext<NetworkContextType>({
  isOnline: true,
  lastOnlineTime: null,
});

export const useNetwork = () => useContext(NetworkContext);

export const NetworkProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [lastOnlineTime, setLastOnlineTime] = useState<Date | null>(isOnline ? new Date() : null);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setLastOnlineTime(new Date());
      toast({
        title: "Connection Restored",
        description: "You're back online.",
      });
    };

    const handleOffline = () => {
      setIsOnline(false);
      toast({
        title: "Network Error",
        description: "You appear to be offline. Some features may be unavailable.",
        variant: "destructive",
      });
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <NetworkContext.Provider value={{ isOnline, lastOnlineTime }}>
      {children}
    </NetworkContext.Provider>
  );
};

export default NetworkProvider;