/**
 * Header Component - Main Navigation Bar
 * 
 * This component renders the main header/navigation bar for the Fitcha platform.
 * It includes:
 * - Logo and branding
 * - Main navigation menu
 * - "Let's Play!" CTA button (primary action)
 * - User menu and notifications
 * - Responsive mobile menu
 * 
 * @author Fitcha Team
 * @version 1.0.0
 */

import React, { useState, memo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Activity, 
  Search, 
  Home, 
  Users, 
  MessageCircle, 
  User,
  Settings,
  LogOut,
  MapPin,
  Crown,
  Gamepad2,
  Moon as MoonIcon,
  Sun as SunIcon,
  Sparkles,
  Menu,
  X,
  Play,
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useTheme } from '../../hooks/useTheme';
import { Button } from '../ui/Button';
import { NotificationCenter } from '../notifications/NotificationCenter';
import { ThemeToggle } from '../ui/ThemeToggle';

/**
 * Header component with responsive navigation and user authentication
 */
export const Header: React.FC = memo(() => {
  // Authentication and user data
  const { user, logout } = useAuth();
  const location = useLocation();
  
  // Theme management
  const { theme, setTheme, isDark } = useTheme();
  
  // UI state management
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showQuickActions, setShowQuickActions] = useState(false);

  /**
   * Check if current route matches the given path
   * @param path - The path to check against current location
   * @returns boolean indicating if path is active
   */
  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="bg-gradient-to-r from-blue-600 to-emerald-600 p-2 rounded-lg shadow-md">
              <Activity className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-emerald-600 bg-clip-text text-transparent">
              Fitcha
            </span>
          </Link>

          {/* Search */}
          <div className="flex-1 max-w-lg mx-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400 dark:text-slate-500" />
              <input
                type="text"
                placeholder="Search for players, courts, sports..."
                className="w-full pl-10 pr-4 py-2.5 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-slate-50 dark:bg-slate-800 hover:bg-white dark:hover:bg-slate-700 transition-colors text-slate-900 dark:text-white"
              />
            </div>
          </div>

          {/* Main Navigation */}
          <nav className="flex items-center space-x-1">
            <Link
              to="/"
              className={`p-2.5 rounded-lg transition-all duration-200 ${
                isActive('/') 
                  ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30' 
                  : 'text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30'
              }`}
              title="Home"
            >
              <Home className="h-6 w-6" />
            </Link>
            
            <Link
              to="/search"
              className={`p-2.5 rounded-lg transition-all duration-200 ${
                isActive('/search') 
                  ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30' 
                  : 'text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30'
              }`}
              title="Search"
            >
              <Search className="h-6 w-6" />
            </Link>
            
            <Link
              to="/messages"
              className={`p-2.5 rounded-lg transition-all duration-200 ${
                isActive('/messages') 
                  ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30' 
                  : 'text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30'
              }`}
              title="Messages"
            >
              <MessageCircle className="h-6 w-6" />
            </Link>

            {/* Notifications */}
            <NotificationCenter />

            {/* Main CTA Button - Let's Play */}
            <Link to="/create-game">
              <Button 
                className="bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-700 hover:to-emerald-700 text-white font-semibold px-6 py-2.5 ml-4 shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 dark:shadow-slate-900/50"
                size="md"
              >
                <Play className="h-5 w-5 mr-2" />
                Let's Play!
              </Button>
            </Link>

            {/* Quick Actions Menu */}
            <div className="relative">
              <button
                onClick={() => setShowQuickActions(!showQuickActions)}
                className={`p-2.5 rounded-lg transition-all duration-200 relative ${
                  showQuickActions
                    ? 'text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800' 
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
                title="More Options"
              >
                {showQuickActions ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>

              {showQuickActions && (
                <>
                  <div 
                    className="fixed inset-0 z-40" 
                    onClick={() => setShowQuickActions(false)}
                  />
                  <div className="absolute right-0 mt-2 w-72 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 py-2 z-50">
                    <div className="px-4 py-3 border-b border-slate-200 dark:border-slate-700">
                      <h3 className="font-semibold text-slate-900 dark:text-white">Quick Actions</h3>
                      <p className="text-sm text-slate-500 dark:text-slate-400">Access all features quickly</p>
                    </div>
                    
                    <div className="py-2">
                      {/* Find Partners */}
                      <Link
                        to="/find-partners"
                        className="flex items-center space-x-3 px-4 py-3 text-slate-700 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-slate-700 transition-colors"
                        onClick={() => setShowQuickActions(false)}
                      >
                        <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                          <Users className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                          <span className="font-medium">Find Partners</span>
                          <p className="text-xs text-slate-500 dark:text-slate-400">Connect with athletes</p>
                        </div>
                      </Link>
                      
                      {/* Courts */}
                      <Link
                        to="/courts"
                        className="flex items-center space-x-3 px-4 py-3 text-slate-700 dark:text-slate-300 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors"
                        onClick={() => setShowQuickActions(false)}
                      >
                        <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center">
                          <MapPin className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                        </div>
                        <div>
                          <span className="font-medium">Book Courts</span>
                          <p className="text-xs text-slate-500 dark:text-slate-400">Find and reserve venues</p>
                        </div>
                      </Link>

                      {/* Smart Features */}
                      <Link
                        to="/smart-features"
                        className="flex items-center space-x-3 px-4 py-3 text-slate-700 dark:text-slate-300 hover:bg-yellow-50 dark:hover:bg-yellow-900/20 transition-colors"
                        onClick={() => setShowQuickActions(false)}
                      >
                        <div className="w-10 h-10 bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900 dark:to-pink-900 rounded-lg flex items-center justify-center">
                          <Sparkles className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                        </div>
                        <div>
                          <span className="font-medium">Smart Features</span>
                          <p className="text-xs text-slate-500 dark:text-slate-400">AI & AR powered tools</p>
                        </div>
                      </Link>

                      <div className="border-t border-slate-200 dark:border-slate-700 my-2"></div>

                      {/* Theme Toggle */}
                      <div className="px-4 py-3">
                        <ThemeToggle />
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* User Menu */}
            <div className="relative ml-4">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center space-x-2 p-1 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
              >
                <div className="relative">
                  <img
                    src={user?.avatar}
                    alt={`${user?.firstName} ${user?.lastName}`}
                    className="w-8 h-8 rounded-full"
                  />
                  {user?.isPro && (
                    <Crown className="absolute -top-1 -right-1 w-4 h-4 text-yellow-500" />
                  )}
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white"></div>
                </div>
              </button>

              {showUserMenu && (
                <>
                  <div 
                    className="fixed inset-0 z-40" 
                    onClick={() => setShowUserMenu(false)}
                  />
                  <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 py-2 z-50">
                    <div className="px-4 py-3 border-b border-slate-200 dark:border-slate-700">
                      <div className="flex items-center space-x-3">
                        <div className="relative">
                          <img
                            src={user?.avatar}
                            alt={`${user?.firstName} ${user?.lastName}`}
                            className="w-12 h-12 rounded-full"
                          />
                          {user?.isPro && (
                            <Crown className="absolute -top-1 -right-1 w-4 h-4 text-yellow-500" />
                          )}
                        </div>
                        <div>
                          <p className="font-semibold text-slate-900 dark:text-white">
                            {user?.firstName} {user?.lastName}
                            {user?.isPro && <span className="text-yellow-500 ml-1">Pro</span>}
                          </p>
                          <p className="text-sm text-slate-500 dark:text-slate-400">{user?.headline}</p>
                          <div className="flex items-center space-x-2 mt-1">
                            <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                            <span className="text-xs text-emerald-600">Online</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="py-2">
                      <Link
                        to="/profile"
                        className="flex items-center space-x-3 px-4 py-2 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700"
                        onClick={() => setShowUserMenu(false)}
                      >
                        <User className="h-5 w-5" />
                        <span>View Profile</span>
                      </Link>
                      <Link
                        to="/analytics"
                        className="flex items-center space-x-3 px-4 py-2 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700"
                        onClick={() => setShowUserMenu(false)}
                      >
                        <Activity className="h-5 w-5" />
                        <span>Analytics</span>
                      </Link>
                      <Link
                        to="/settings"
                        className="flex items-center space-x-3 px-4 py-2 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700"
                        onClick={() => setShowUserMenu(false)}
                      >
                        <Settings className="h-5 w-5" />
                        <span>Settings</span>
                      </Link>
                      {!user?.isPro && (
                        <Link
                          to="/upgrade"
                          className="flex items-center space-x-3 px-4 py-2 text-yellow-600 dark:text-yellow-500 hover:bg-yellow-50 dark:hover:bg-yellow-900/20"
                          onClick={() => setShowUserMenu(false)}
                        >
                          <Crown className="h-5 w-5" />
                          <span>Upgrade to Pro</span>
                        </Link>
                      )}
                      <div className="border-t border-slate-200 dark:border-slate-700 my-2"></div>
                      <button
                        onClick={() => {
                          logout();
                          setShowUserMenu(false);
                        }}
                        className="flex items-center space-x-3 px-4 py-2 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 w-full text-left"
                      >
                        <LogOut className="h-5 w-5" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </nav>
        </div>
      </div>

      {/* Mobile Quick Actions Bar - Below Header */}
      <div className="bg-gradient-to-r from-blue-50 to-emerald-50 dark:from-blue-950 dark:to-emerald-950 border-t border-slate-200 dark:border-slate-700 px-4 py-3 md:hidden">
        <div className="flex items-center justify-between">
          <div className="flex space-x-4">
            <Link
              to="/create-game"
              className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:from-blue-700 hover:to-emerald-700 transition-all shadow-md dark:shadow-slate-900/50"
            >
              <Play className="h-4 w-4" />
              <span>Let's Play!</span>
            </Link>
            <Link
              to="/find-partners"
              className="flex items-center space-x-2 bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 px-3 py-2 rounded-lg text-sm font-medium hover:bg-blue-200 dark:hover:bg-blue-900 transition-colors"
            >
              <Users className="h-4 w-4" />
              <span>Find Partners</span>
            </Link>
          </div>
          <Link
            to="/smart-features"
            className="flex items-center space-x-2 bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/50 dark:to-pink-900/50 text-purple-700 dark:text-purple-300 px-3 py-2 rounded-lg text-sm font-medium hover:from-purple-200 hover:to-pink-200 dark:hover:from-purple-900 dark:hover:to-pink-900 transition-colors"
          >
            <Sparkles className="h-4 w-4" />
            <span>Smart Features</span>
          </Link>
        </div>
      </div>
    </header>
  );
});

// Add display name for debugging
Header.displayName = 'Header';