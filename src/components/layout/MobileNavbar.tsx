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
  Zap
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { Button } from '../ui/Button';
import { useDeviceDetection } from '../ui/MobileDetection';

/**
 * Mobile navigation bar component that appears at the bottom of the screen on mobile devices
 */
export const MobileNavbar: React.FC = () => {
  const { isMobile } = useDeviceDetection();
  const { user, logout } = useAuth();
  const location = useLocation();
  const [showMenu, setShowMenu] = useState(false);

  if (!isMobile) return null;

  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      {/* Fixed Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40">
        <div className="flex items-center justify-around h-16">
          <Link 
            to="/" 
            className={`flex flex-col items-center justify-center w-full h-full ${
              isActive('/') ? 'text-blue-600' : 'text-gray-500'
            }`}
          >
            <Home className="h-5 w-5" />
            <span className="text-xs mt-1">Home</span>
          </Link>
          
          <Link 
            to="/courts" 
            className={`flex flex-col items-center justify-center w-full h-full ${
              isActive('/courts') ? 'text-blue-600' : 'text-gray-500'
            }`}
          >
            <MapPin className="h-5 w-5" />
            <span className="text-xs mt-1">Courts</span>
          </Link>
          
          <Link 
            to="/create-game" 
            className="flex flex-col items-center justify-center w-full h-full"
          >
            <div className="bg-gradient-to-r from-blue-600 to-emerald-600 rounded-full p-3 -mt-8 shadow-lg">
              <Plus className="h-6 w-6 text-white" />
            </div>
            <span className="text-xs mt-1 text-blue-600">Play</span>
          </Link>
          
          <Link 
            to="/messages" 
            className={`flex flex-col items-center justify-center w-full h-full ${
              isActive('/messages') ? 'text-blue-600' : 'text-gray-500'
            }`}
          >
            <MessageCircle className="h-5 w-5" />
            <span className="text-xs mt-1">Chat</span>
          </Link>
          
          <button
            onClick={() => setShowMenu(true)}
            className={`flex flex-col items-center justify-center w-full h-full ${
              showMenu ? 'text-blue-600' : 'text-gray-500'
            }`}
          >
            <Menu className="h-5 w-5" />
            <span className="text-xs mt-1">Menu</span>
          </button>
        </div>
      </nav>

      {/* Full Screen Menu Overlay */}
      {showMenu && (
        <div className="fixed inset-0 bg-white z-50 flex flex-col">
          {/* Menu Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <img
                src={user?.avatar}
                alt={user?.firstName}
                className="w-10 h-10 rounded-full"
              />
              <div>
                <h3 className="font-semibold text-gray-900">{user?.firstName} {user?.lastName}</h3>
                <p className="text-sm text-gray-600">View Profile</p>
              </div>
            </div>
            <button
              onClick={() => setShowMenu(false)}
              className="p-2 rounded-full hover:bg-gray-100"
            >
              <X className="h-6 w-6 text-gray-500" />
            </button>
          </div>

          {/* Menu Items */}
          <div className="flex-1 overflow-y-auto p-4">
            <div className="space-y-1">
              <Link 
                to="/profile" 
                className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100"
                onClick={() => setShowMenu(false)}
              >
                <User className="h-5 w-5 text-gray-500" />
                <span className="font-medium">Profile</span>
              </Link>
              
              <Link 
                to="/find-partners" 
                className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100"
                onClick={() => setShowMenu(false)}
              >
                <Users className="h-5 w-5 text-gray-500" />
                <span className="font-medium">Find Partners</span>
              </Link>
              
              <Link 
                to="/analytics" 
                className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100"
                onClick={() => setShowMenu(false)}
              >
                <Activity className="h-5 w-5 text-gray-500" />
                <span className="font-medium">Analytics</span>
              </Link>
              
              <Link 
                to="/network" 
                className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100"
                onClick={() => setShowMenu(false)}
              >
                <Users className="h-5 w-5 text-gray-500" />
                <span className="font-medium">Network</span>
              </Link>
              
              <Link 
                to="/smart-features" 
                className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100"
                onClick={() => setShowMenu(false)}
              >
                <Zap className="h-5 w-5 text-gray-500" />
                <span className="font-medium">Smart Features</span>
              </Link>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200">
              <Link 
                to="/settings" 
                className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100"
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
                className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100 w-full text-left"
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