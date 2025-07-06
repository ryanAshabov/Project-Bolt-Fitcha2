import React from 'react';
import { MobileHeader } from '../layout/MobileHeader';
import { MobileNavbar } from '../layout/MobileNavbar';
import { useDeviceDetection } from './MobileDetection';

interface MobileContainerProps {
  children: React.ReactNode;
  title?: string;
  showBack?: boolean;
  onBack?: () => void;
  showHeader?: boolean;
  showNavbar?: boolean;
  showSearch?: boolean;
  showNotifications?: boolean;
  fullHeight?: boolean;
}

/**
 * Container component for mobile views that includes header and navbar
 */
export const MobileContainer: React.FC<MobileContainerProps> = ({
  children,
  title,
  showBack = false,
  onBack,
  showHeader = true,
  showNavbar = true,
  showSearch = true,
  showNotifications = true,
  fullHeight = false,
}) => {
  const { isMobile } = useDeviceDetection();

  if (!isMobile) {
    return <>{children}</>;
  }

  return (
    <div className={`bg-gray-50 ${fullHeight ? 'min-h-screen' : ''}`}>
      {showHeader && (
        <MobileHeader
          title={title}
          showBack={showBack}
          onBack={onBack}
          showSearch={showSearch}
          showNotifications={showNotifications}
        />
      )}
      
      <div className={`${showHeader ? 'pt-14' : ''} ${showNavbar ? 'pb-16' : ''}`}>
        {children}
      </div>
      
      {showNavbar && <MobileNavbar />}
    </div>
  );
};