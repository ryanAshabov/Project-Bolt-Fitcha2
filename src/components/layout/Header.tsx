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

import React, { useState } from 'react';
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
  Moon,
  Sun,
  Sparkles,
  Menu,
  X,
  Play,
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { Button } from '../ui/Button';
import { NotificationCenter } from '../notifications/NotificationCenter';

/**
 * Header component with responsive navigation and user authentication
 */
export const Header: React.FC = () => {
  // Authentication and user data
  const { user, logout } = useAuth();
  const location = useLocation();
  
  // UI state management
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showQuickActions, setShowQuickActions] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  /**
   * Check if current route matches the given path
   * @param path - The path to check against current location
   * @returns boolean indicating if path is active
   */
  const isActive = (path: string) => location.pathname === path;

  /**
   * Toggle theme between light and dark mode
   * In production, this would persist to localStorage and apply to document
   */
  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
    // TODO: Persist theme to localStorage and apply to document root
  };

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
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
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search for players, courts, sports..."
                className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-slate-50 hover:bg-white transition-colors"
              />
            </div>
          </div>

          {/* Main Navigation */}
          <nav className="flex items-center space-x-1">
            <Link
              to="/"
              className={`p-2.5 rounded-lg transition-all duration-200 ${
                isActive('/') 
                  ? 'text-blue-600 bg-blue-50' 
                  : 'text-slate-600 hover:text-blue-600 hover:bg-blue-50'
              }`}
              title="Home"
            >
              <Home className="h-6 w-6" />
            </Link>
            
            <Link
              to="/messages"
              className={`p-2.5 rounded-lg transition-all duration-200 ${
                isActive('/messages') 
                  ? 'text-blue-600 bg-blue-50' 
                  : 'text-slate-600 hover:text-blue-600 hover:bg-blue-50'
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
                className="bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-700 hover:to-emerald-700 text-white font-semibold px-6 py-2.5 ml-4 shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
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
                    ? 'text-slate-600 bg-slate-100' 
                    : 'text-slate-600 hover:text-slate-700 hover:bg-slate-100'
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
                  <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50">
                    <div className="px-4 py-3 border-b border-slate-200">
                      <h3 className="font-semibold text-slate-900">Quick Actions</h3>
                      <p className="text-sm text-slate-500">Access all features quickly</p>
                    </div>
                    
                    <div className="py-2">
                      {/* Find Partners */}
                      <Link
                        to="/find-partners"
                        className="flex items-center space-x-3 px-4 py-3 text-slate-700 hover:bg-blue-50 transition-colors"
                        onClick={() => setShowQuickActions(false)}
                      >
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                          <Users className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <span className="font-medium">Find Partners</span>
                          <p className="text-xs text-slate-500">Connect with athletes</p>
                        </div>
                      </Link>
                      
                      {/* Courts */}
                      <Link
                        to="/courts"
                        className="flex items-center space-x-3 px-4 py-3 text-slate-700 hover:bg-purple-50 transition-colors"
                        onClick={() => setShowQuickActions(false)}
                      >
                        <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                          <MapPin className="h-5 w-5 text-purple-600" />
                        </div>
                        <div>
                          <span className="font-medium">Book Courts</span>
                          <p className="text-xs text-slate-500">Find and reserve venues</p>
                        </div>
                      </Link>

                      {/* Smart Features */}
                      <Link
                        to="/smart-features"
                        className="flex items-center space-x-3 px-4 py-3 text-slate-700 hover:bg-yellow-50 transition-colors"
                        onClick={() => setShowQuickActions(false)}
                      >
                        <div className="w-10 h-10 bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg flex items-center justify-center">
                          <Sparkles className="h-5 w-5 text-purple-600" />
                        </div>
                        <div>
                          <span className="font-medium">Smart Features</span>
                          <p className="text-xs text-slate-500">AI & AR powered tools</p>
                        </div>
                      </Link>

                      <div className="border-t border-slate-200 my-2"></div>

                      {/* Theme Toggle */}
                      <button
                        onClick={() => {
                          toggleTheme();
                          setShowQuickActions(false);
                        }}
                        className="flex items-center space-x-3 px-4 py-3 text-slate-700 hover:bg-slate-50 w-full text-left transition-colors"
                      >
                        <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
                          {theme === 'light' ? 
                            <Moon className="h-5 w-5 text-slate-600" /> : 
                            <Sun className="h-5 w-5 text-slate-600" />
                          }
                        </div>
                        <div>
                          <span className="font-medium">
                            {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
                          </span>
                          <p className="text-xs text-slate-500">Toggle theme</p>
                        </div>
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* User Menu */}
            <div className="relative ml-4">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center space-x-2 p-1 rounded-lg hover:bg-slate-50 transition-colors"
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
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-slate-200 py-2 z-50">
                    <div className="px-4 py-3 border-b border-slate-200">
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
                          <p className="font-semibold text-slate-900">
                            {user?.firstName} {user?.lastName}
                            {user?.isPro && <span className="text-yellow-500 ml-1">Pro</span>}
                          </p>
                          <p className="text-sm text-slate-500">{user?.headline}</p>
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
                        className="flex items-center space-x-3 px-4 py-2 text-slate-700 hover:bg-slate-50"
                        onClick={() => setShowUserMenu(false)}
                      >
                        <User className="h-5 w-5" />
                        <span>View Profile</span>
                      </Link>
                      <Link
                        to="/analytics"
                        className="flex items-center space-x-3 px-4 py-2 text-slate-700 hover:bg-slate-50"
                        onClick={() => setShowUserMenu(false)}
                      >
                        <Activity className="h-5 w-5" />
                        <span>Analytics</span>
                      </Link>
                      <Link
                        to="/settings"
                        className="flex items-center space-x-3 px-4 py-2 text-slate-700 hover:bg-slate-50"
                        onClick={() => setShowUserMenu(false)}
                      >
                        <Settings className="h-5 w-5" />
                        <span>Settings</span>
                      </Link>
                      {!user?.isPro && (
                        <Link
                          to="/upgrade"
                          className="flex items-center space-x-3 px-4 py-2 text-yellow-600 hover:bg-yellow-50"
                          onClick={() => setShowUserMenu(false)}
                        >
                          <Crown className="h-5 w-5" />
                          <span>Upgrade to Pro</span>
                        </Link>
                      )}
                      <div className="border-t border-slate-200 my-2"></div>
                      <button
                        onClick={() => {
                          logout();
                          setShowUserMenu(false);
                        }}
                        className="flex items-center space-x-3 px-4 py-2 text-slate-700 hover:bg-slate-50 w-full text-left"
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
      <div className="bg-gradient-to-r from-blue-50 to-emerald-50 border-t border-slate-200 px-4 py-3 md:hidden">
        <div className="flex items-center justify-between">
          <div className="flex space-x-4">
            <Link
              to="/create-game"
              className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:from-blue-700 hover:to-emerald-700 transition-all shadow-md"
            >
              <Play className="h-4 w-4" />
              <span>Let's Play!</span>
            </Link>
            <Link
              to="/find-partners"
              className="flex items-center space-x-2 bg-blue-100 text-blue-700 px-3 py-2 rounded-lg text-sm font-medium hover:bg-blue-200 transition-colors"
            >
              <Users className="h-4 w-4" />
              <span>Find Partners</span>
            </Link>
          </div>
          <Link
            to="/smart-features"
            className="flex items-center space-x-2 bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 px-3 py-2 rounded-lg text-sm font-medium hover:from-purple-200 hover:to-pink-200 transition-colors"
          >
            <Sparkles className="h-4 w-4" />
            <span>Smart Features</span>
          </Link>
        </div>
      </div>
    </header>
  );
};