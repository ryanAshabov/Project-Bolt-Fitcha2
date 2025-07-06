import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  Search, 
  Plus, 
  MessageCircle, 
  User,
  Menu,
  X,
  MapPin,
  Users,
  Activity,
  Settings,
  LogOut,
  Gamepad2,
  Zap,
  Moon,
  Sun
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { Button } from '../ui/Button';
import { useDeviceDetection } from '../ui/MobileDetection';
import { useTheme } from '../../hooks/useTheme';

/**
 * Mobile navigation bar component that appears at the bottom of the screen on mobile devices
 */
export const MobileNavbar: React.FC = () => {
  const { isMobile } = useDeviceDetection();
  const { user, logout } = useAuth();
  const { theme, setTheme, isDark } = useTheme();
  const location = useLocation();
  const [showMenu, setShowMenu] = useState(false);

  if (!isMobile) return null;

  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      {/* Fixed Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-900 border-t border-gray-200 dark:border-slate-700 z-40">
        <div className="flex items-center justify-around h-16">
          <Link 
            to="/" 
            className={`flex flex-col items-center justify-center w-full h-full ${
              isActive('/') ? 'text-blue-600 dark:text-blue-400' : 'text-gray-500 dark:text-gray-400'
            }`}
          >
            <Home className="h-5 w-5" />
            <span className="text-xs mt-1">Home</span>
          </Link>
          
          <Link 
            to="/courts" 
            className={`flex flex-col items-center justify-center w-full h-full ${
              isActive('/courts') ? 'text-blue-600 dark:text-blue-400' : 'text-gray-500 dark:text-gray-400'
            }`}
          >
            <MapPin className="h-5 w-5" />
            <span className="text-xs mt-1">Courts</span>
          </Link>
          
          <Link 
            to="/search" 
            className={`flex flex-col items-center justify-center w-full h-full ${
              isActive('/search') ? 'text-blue-600 dark:text-blue-400' : 'text-gray-500 dark:text-gray-400'
            }`}
          >
            <Search className="h-5 w-5" />
            <span className="text-xs mt-1">Search</span>
          </Link>
          
          <Link 
            to="/create-game" 
            className="flex flex-col items-center justify-center w-full h-full text-blue-600 dark:text-blue-400"
          >
            <div className="bg-gradient-to-r from-blue-600 to-emerald-600 rounded-full p-3 -mt-8 shadow-lg dark:shadow-slate-900/50">
              <Plus className="h-6 w-6 text-white" />
            </div>
            <span className="text-xs mt-1 text-blue-600 dark:text-blue-400">Play</span>
          </Link>
          
          <Link 
            to="/messages" 
            className={`flex flex-col items-center justify-center w-full h-full ${
              isActive('/messages') ? 'text-blue-600 dark:text-blue-400' : 'text-gray-500 dark:text-gray-400'
            }`}
          >
            <MessageCircle className="h-5 w-5" />
            <span className="text-xs mt-1">Chat</span>
          </Link>
          
          <button
            onClick={() => setShowMenu(true)}
            className={`flex flex-col items-center justify-center w-full h-full ${
              showMenu ? 'text-blue-600 dark:text-blue-400' : 'text-gray-500 dark:text-gray-400'
            }`}
          >
            <Menu className="h-5 w-5" />
            <span className="text-xs mt-1">Menu</span>
          </button>
        </div>
      </nav>

      {/* Full Screen Menu Overlay */}
      {showMenu && (
        <div className="fixed inset-0 bg-white dark:bg-slate-900 z-50 flex flex-col">
          {/* Menu Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-slate-700">
            <div className="flex items-center space-x-3">
              <img
                src={user?.avatar}
                alt={user?.firstName}
                className="w-10 h-10 rounded-full"
              />
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">{user?.firstName} {user?.lastName}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">View Profile</p>
              </div>
            </div>
            <button
              onClick={() => setShowMenu(false)}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-slate-800"
            >
              <X className="h-6 w-6 text-gray-500 dark:text-gray-400" />
            </button>
          </div>

          {/* Menu Items */}
          <div className="flex-1 overflow-y-auto p-4">
            <div className="space-y-1">
              <Link 
                to="/profile" 
                className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-700 dark:text-gray-200"
                onClick={() => setShowMenu(false)}
              >
                <User className="h-5 w-5 text-gray-500" />
                <span className="font-medium">Profile</span>
              </Link>
              
              <Link 
                to="/find-partners" 
                className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-700 dark:text-gray-200"
                onClick={() => setShowMenu(false)}
              >
                <Users className="h-5 w-5 text-gray-500" />
                <span className="font-medium">Find Partners</span>
              </Link>
              
              <Link 
                to="/analytics" 
                className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-700 dark:text-gray-200"
                onClick={() => setShowMenu(false)}
              >
                <Activity className="h-5 w-5 text-gray-500" />
                <span className="font-medium">Analytics</span>
              </Link>
              
              <Link 
                to="/network" 
                className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-700 dark:text-gray-200"
                onClick={() => setShowMenu(false)}
              >
                <Users className="h-5 w-5 text-gray-500" />
                <span className="font-medium">Network</span>
              </Link>
              
              <Link 
                to="/smart-features" 
                className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-700 dark:text-gray-200"
                onClick={() => setShowMenu(false)}
              >
                <Zap className="h-5 w-5 text-gray-500" />
                <span className="font-medium">Smart Features</span>
              </Link>
              
              <button 
                className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-700 dark:text-gray-200 w-full"
                onClick={() => setTheme(isDark ? 'light' : 'dark')}
              >
                {isDark ? (
                  <>
                    <Sun className="h-5 w-5 text-gray-500" />
                    <span className="font-medium">Light Mode</span>
                  </>
                ) : (
                  <>
                    <Moon className="h-5 w-5 text-gray-500" />
                    <span className="font-medium">Dark Mode</span>
                  </>
                )}
              </button>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200 dark:border-slate-700">
              <Link 
                to="/settings" 
                className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-700 dark:text-gray-200"
                onClick={() => setShowMenu(false)}
              >
                <Settings className="h-5 w-5 text-gray-500" />
                <span className="font-medium">Settings</span>
              </Link>
              
              <button
                onClick={() => {
                  logout();
                  setShowMenu(false);
                }}
                className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 w-full text-left text-gray-700 dark:text-gray-200"
              >
                <LogOut className="h-5 w-5 text-gray-500" />
                <span className="font-medium">Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Spacer to prevent content from being hidden behind the navbar */}
      <div className="h-16"></div>
    </>
  );
};