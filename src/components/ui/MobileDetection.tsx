import { useState, useEffect } from 'react';
import { UI_CONSTANTS } from '../../utils/constants';
import { useTheme } from '../../hooks/useTheme';

/**
 * Hook to detect mobile devices and screen sizes
 * @returns Object with device information
 */
export const useDeviceDetection = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const [isDesktop, setIsDesktop] = useState(true);
  const [orientation, setOrientation] = useState<'portrait' | 'landscape'>('portrait');

  useEffect(() => {
    const checkDevice = () => {
      const width = window.innerWidth;
      setIsMobile(width < UI_CONSTANTS.MOBILE_BREAKPOINT);
      setIsTablet(width >= UI_CONSTANTS.MOBILE_BREAKPOINT && width < UI_CONSTANTS.TABLET_BREAKPOINT);
      setIsDesktop(width >= UI_CONSTANTS.TABLET_BREAKPOINT);
      setOrientation(window.innerHeight > window.innerWidth ? 'portrait' : 'landscape');
    };

    // Initial check
    checkDevice();

    // Add event listener for window resize
    window.addEventListener('resize', checkDevice);
    window.addEventListener('orientationchange', checkDevice);

    // Cleanup
    return () => {
      window.removeEventListener('resize', checkDevice);
      window.removeEventListener('orientationchange', checkDevice);
    };
  }, []);

  return {
    isMobile,
    isTablet,
    isDesktop,
    orientation,
  };
};

/**
 * Component that renders different content based on device type
 */
interface ResponsiveWrapperProps {
  children: React.ReactNode;
  mobileOnly?: boolean;
  tabletOnly?: boolean;
  desktopOnly?: boolean;
  mobileAndTablet?: boolean;
  tabletAndDesktop?: boolean;
}

export const ResponsiveWrapper: React.FC<ResponsiveWrapperProps> = ({
  children,
  mobileOnly = false,
  tabletOnly = false,
  desktopOnly = false,
  mobileAndTablet = false,
  tabletAndDesktop = false,
}) => {
  const { isMobile, isTablet, isDesktop } = useDeviceDetection();

  if (mobileOnly && !isMobile) return null;
  if (tabletOnly && !isTablet) return null;
  if (desktopOnly && !isDesktop) return null;
  if (mobileAndTablet && !isMobile && !isTablet) return null;
  if (tabletAndDesktop && !isTablet && !isDesktop) return null;

  return <>{children}</>;
};

/**
 * Component that provides mobile-specific UI adaptations
 */
interface MobileAdaptiveProps {
  children: React.ReactNode;
  className?: string;
  mobileClassName?: string;
  tabletClassName?: string;
  desktopClassName?: string;
}

export const MobileAdaptive: React.FC<MobileAdaptiveProps> = ({
  children,
  className = '',
  mobileClassName = '',
  tabletClassName = '',
  desktopClassName = '',
}) => {
  const { isDark } = useTheme();
  const { isMobile, isTablet, isDesktop } = useDeviceDetection();

  let adaptiveClassName = className;
  if (isMobile) adaptiveClassName += ` ${mobileClassName}`;
  if (isTablet) adaptiveClassName += ` ${tabletClassName}`;
  if (isDesktop) adaptiveClassName += ` ${desktopClassName}`;
  if (isDark) adaptiveClassName += ' dark';

  return <div className={adaptiveClassName}>{children}</div>;
};