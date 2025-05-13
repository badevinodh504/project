import React from 'react';
import { useNetwork } from './NetworkStatus';
import { Wifi, WifiOff } from 'lucide-react';
import { cn } from '@/lib/utils';

interface NetworkStatusIndicatorProps {
  className?: string;
  showOfflineOnly?: boolean;
}

const NetworkStatusIndicator: React.FC<NetworkStatusIndicatorProps> = ({
  className,
  showOfflineOnly = false
}) => {
  const { isOnline } = useNetwork();
  
  if (showOfflineOnly && isOnline) {
    return null;
  }
  
  return (
    <div 
      className={cn(
        'flex items-center gap-1.5 text-sm font-medium transition-opacity duration-300',
        isOnline ? 'text-green-600' : 'text-red-500 animate-pulse',
        className
      )}
    >
      {isOnline ? (
        <>
          <Wifi size={16} />
          <span className="hidden sm:inline">Online</span>
        </>
      ) : (
        <>
          <WifiOff size={16} />
          <span>Offline</span>
        </>
      )}
    </div>
  );
};

export default NetworkStatusIndicator;