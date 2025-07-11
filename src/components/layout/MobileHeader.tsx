import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Activity, Search, Bell, ArrowLeft } from 'lucide-react';
import { useDeviceDetection } from '../ui/MobileDetection';
import { useNotifications } from '../../hooks/useNotifications';
import { useTheme } from '../../hooks/useTheme';

interface MobileHeaderProps {
  title?: string;
  showBack?: boolean;
  onBack?: () => void;
  showSearch?: boolean;
  showNotifications?: boolean;
}

/**
 * Mobile-optimized header component
 */
export const MobileHeader: React.FC<MobileHeaderProps> = ({
  title = 'Fitcha',
  showBack = false,
  onBack,
  showSearch = true,
  showNotifications = true,
}) => {
  const { isMobile } = useDeviceDetection();
  const { isDark } = useTheme();
  const { unreadCount } = useNotifications();
  const [showSearchInput, setShowSearchInput] = useState(false);

  if (!isMobile) return null;

  return (
    <header className="fixed top-0 left-0 right-0 bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-700 z-40">
      <div className="flex items-center justify-between h-14 px-4">
        {/* Left Section */}
        <div className="flex items-center">
          {showBack ? (
            <button
              onClick={onBack}
              className="p-2 -ml-2 rounded-full hover:bg-gray-100 dark:hover:bg-slate-800"
            >
              <ArrowLeft className="h-5 w-5 text-gray-700 dark:text-gray-300" />
            </button>
          ) : (
            <Link to="/" className="flex items-center space-x-2">
              <div className="bg-gradient-to-r from-blue-600 to-emerald-600 p-1.5 rounded-md shadow-sm">
                <Activity className="h-5 w-5 text-white" />
              </div>
              {!showSearchInput && (
                <span className="font-bold text-lg bg-gradient-to-r from-blue-600 to-emerald-600 dark:from-blue-400 dark:to-emerald-400 bg-clip-text text-transparent">
                  {title}
                </span>
              )}
            </Link>
          )}
        </div>

        {/* Search Input (when expanded) */}
        {showSearchInput && (
          <div className="flex-1 mx-2">
            <input
              type="text"
              placeholder="Search..."
              className="w-full px-3 py-1.5 border border-gray-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white dark:bg-slate-800 text-gray-900 dark:text-white"
              autoFocus
              onBlur={() => setShowSearchInput(false)}
            />
          </div>
        )}

        {/* Right Section */}
        {!showSearchInput && (
          <div className="flex items-center space-x-2">
            {showSearch && (
              <button
                onClick={() => setShowSearchInput(true)}
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-slate-800"
              >
                <Search className="h-5 w-5 text-gray-700 dark:text-gray-300" />
              </button>
            )}
            
            {showNotifications && (
              <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-slate-800 relative">
                <Bell className="h-5 w-5 text-gray-700 dark:text-gray-300" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </button>
            )}
          </div>
        )}
      </div>
    </header>
  );
};