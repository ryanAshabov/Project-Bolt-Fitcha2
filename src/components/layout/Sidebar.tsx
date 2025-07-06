import React, { memo } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Calendar, Users, Trophy, Star, Crown } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

export const Sidebar: React.FC = memo(() => {
  const { user } = useAuth();

  if (!user) {
    return null;
  }

  return (
    <div className="space-y-6 dark:text-white">
      {/* User Profile Card */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm">
        <div className="h-16 bg-gradient-to-r from-blue-500 to-emerald-500 dark:from-blue-600 dark:to-emerald-600"></div>
        <div className="px-6 pb-6 -mt-8">
          <div className="flex flex-col items-start">
            <div className="relative">
              <img
                src={user?.avatar}
                alt={`${user?.firstName} ${user?.lastName}`}
                className="w-16 h-16 rounded-full border-4 border-white mb-4"
              />
              {user?.isPro && (
                <Crown className="absolute -top-1 -right-1 w-6 h-6 text-yellow-500" />
              )}
            </div>
            <div className="w-full">
              <div className="flex items-center space-x-2 mb-1">
                <h3 className="font-semibold text-slate-900 dark:text-white">
                  {user?.firstName} {user?.lastName}
                </h3>
                {user?.verified && (
                  <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs">✓</span>
                  </div>
                )}
                {user?.isPro && (
                  <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full font-medium">
                    PRO
                  </span>
                )}
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-300 mb-2">{user?.headline}</p>
              <div className="flex items-center text-sm text-slate-500 dark:text-slate-400 mb-3">
                <MapPin className="h-4 w-4 mr-1" />
                {user?.location}
              </div>
              
              {/* Sports Tags */}
              <div className="flex flex-wrap gap-1 mb-3">
                {user?.sports.slice(0, 3).map((sport) => (
                  <span
                    key={sport}
                    className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full"
                  >
                    {sport}
                  </span>
                ))}
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 text-center text-sm">
                <div>
                  <p className="font-semibold text-slate-900 dark:text-white">{user?.connections}</p>
                  <p className="text-slate-500 dark:text-slate-400">Connections</p>
                </div>
                <div>
                  <p className="font-semibold text-slate-900 dark:text-white">{user?.gamesPlayed}</p>
                  <p className="text-slate-500 dark:text-slate-400">Games</p>
                </div>
                <div>
                  <p className="font-semibold text-slate-900 dark:text-white">{user?.winRate}%</p>
                  <p className="text-slate-500 dark:text-slate-400">Win Rate</p>
                </div>
              </div>

              {/* Rating */}
              <div className="flex items-center justify-center mt-3 pt-3 border-t border-slate-200 dark:border-slate-700">
                <div className="flex items-center space-x-1">
                  <Star className="h-4 w-4 text-yellow-500 fill-current" />
                  <span className="font-semibold text-slate-900 dark:text-white">{user?.rating}</span>
                  <span className="text-slate-500 dark:text-slate-400 text-sm">({user?.gamesPlayed} reviews)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Links */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm">
        <h3 className="font-semibold text-slate-900 dark:text-white mb-4">Quick Access</h3>
        <div className="space-y-3">
          <Link 
            to="/find-partners" 
            className="flex items-center text-sm text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
            <Users className="h-4 w-4 mr-3" />
            Find Partners
          </Link>
          <Link 
            to="/courts" 
            className="flex items-center text-sm text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
            <MapPin className="h-4 w-4 mr-3" />
            Book Courts
          </Link>
          <Link 
            to="/events" 
            className="flex items-center text-sm text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
            <Calendar className="h-4 w-4 mr-3" />
            Events
          </Link>
          <Link 
            to="/tournaments" 
            className="flex items-center text-sm text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
            <Trophy className="h-4 w-4 mr-3" />
            Tournaments
          </Link>
        </div>
      </div>

      {/* Badges */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm">
        <h3 className="font-semibold text-slate-900 dark:text-white mb-4">Achievements</h3>
        <div className="grid grid-cols-2 gap-3">
          {user?.badges.map((badge) => (
            <div
              key={badge.id}
              className="flex flex-col items-center p-3 bg-slate-50 dark:bg-slate-700 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-600 transition-colors"
            >
              <span className="text-2xl mb-1">{badge.icon}</span>
              <span className="text-xs font-medium text-slate-900 dark:text-white text-center">
                {badge.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
});

// Add display name for debugging
Sidebar.displayName = 'Sidebar';