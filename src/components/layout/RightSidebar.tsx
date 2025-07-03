import React from 'react';
import { Link } from 'react-router-dom';
import { Plus, TrendingUp, Users, MapPin, Star, Crown, Calendar, Trophy, CheckCircle, Sparkles } from 'lucide-react';
import { mockUsers, mockCourts, celebrityUsers, sportsMediaUsers } from '../../data/mockData';
import { Button } from '../ui/Button';
import { WeatherWidget } from '../weather/WeatherWidget';
import { AchievementCard } from '../achievements/AchievementCard';
import { Achievement } from '../../types';

export const RightSidebar: React.FC = () => {
  const suggestedUsers = mockUsers.slice(1, 4);
  const featuredCourts = mockCourts.slice(0, 2);
  const celebrities = celebrityUsers.slice(0, 2);
  const mediaOrgs = sportsMediaUsers.slice(0, 1);

  // Mock recent achievement
  const recentAchievement: Achievement = {
    id: 'team-player',
    name: 'Team Player',
    description: 'Played 10 games with different partners',
    icon: '🤝',
    progress: 10,
    target: 10,
    completed: true,
    unlockedAt: new Date(),
    category: 'social',
    rarity: 'rare'
  };

  const upcomingGames = [
    {
      id: '1',
      sport: 'Basketball',
      time: 'Today, 6:00 PM',
      location: 'Golden Gate Courts',
      players: 3
    },
    {
      id: '2',
      sport: 'Tennis',
      time: 'Tomorrow, 3:00 PM',
      location: 'Elite Tennis Center',
      players: 1
    }
  ];

  return (
    <div className="w-80 space-y-6">
      {/* Weather Widget */}
      <WeatherWidget />

      {/* Celebrity Spotlight */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-200 p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-blue-900 flex items-center space-x-2">
            <Crown className="h-5 w-5 text-blue-600" />
            <span>Celebrity Athletes</span>
          </h3>
          <Sparkles className="h-5 w-5 text-blue-500" />
        </div>
        
        <div className="space-y-3">
          {celebrities.map((celebrity) => (
            <div key={celebrity.id} className="flex items-center space-x-3 p-3 bg-white rounded-lg border border-blue-200">
              <div className="relative">
                <img
                  src={celebrity.avatar}
                  alt={`${celebrity.firstName} ${celebrity.lastName}`}
                  className="w-12 h-12 rounded-full ring-2 ring-blue-300"
                />
                <CheckCircle className="absolute -top-1 -right-1 w-4 h-4 text-blue-500 fill-current" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-1">
                  <p className="font-semibold text-blue-900 text-sm truncate">
                    {celebrity.firstName} {celebrity.lastName}
                  </p>
                  <Crown className="h-3 w-3 text-blue-500" />
                </div>
                <p className="text-xs text-blue-700 truncate">{celebrity.headline}</p>
                <div className="flex items-center space-x-2 mt-1">
                  <span className="text-xs text-blue-600">
                    {(celebrity.connections / 1000000).toFixed(1)}M followers
                  </span>
                  {celebrity.isOnline && (
                    <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <Link 
          to="/find-partners" 
          className="block mt-4 text-sm text-blue-700 hover:text-blue-800 font-medium text-center"
        >
          Discover more celebrities →
        </Link>
      </div>

      {/* Sports Media */}
      <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl border border-purple-200 p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-purple-900 flex items-center space-x-2">
            <span>📺</span>
            <span>Sports Media</span>
          </h3>
        </div>
        
        <div className="space-y-3">
          {mediaOrgs.map((org) => (
            <div key={org.id} className="flex items-center space-x-3 p-3 bg-white rounded-lg border border-purple-200">
              <div className="relative">
                <img
                  src={org.avatar}
                  alt={`${org.firstName} ${org.lastName}`}
                  className="w-12 h-12 rounded-full ring-2 ring-purple-300"
                />
                <CheckCircle className="absolute -top-1 -right-1 w-4 h-4 text-purple-500 fill-current" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-1">
                  <p className="font-semibold text-purple-900 text-sm truncate">
                    {org.firstName} {org.lastName}
                  </p>
                  <span className="text-xs bg-purple-100 text-purple-800 px-1 py-0.5 rounded">MEDIA</span>
                </div>
                <p className="text-xs text-purple-700 truncate">{org.headline}</p>
                <span className="text-xs text-purple-600">
                  {(org.connections / 1000000).toFixed(1)}M followers
                </span>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-4 p-3 bg-purple-100 rounded-lg">
          <p className="text-xs text-purple-800 font-medium">🚨 Breaking News</p>
          <p className="text-xs text-purple-700 mt-1">
            Major sports networks are joining Fitcha to connect directly with athletes and fans!
          </p>
        </div>
      </div>

      {/* Recent Achievement */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-slate-900">Latest Achievement</h3>
          <Trophy className="h-5 w-5 text-purple-500" />
        </div>
        <AchievementCard achievement={recentAchievement} size="sm" />
        <Link 
          to="/profile?tab=achievements" 
          className="block mt-3 text-sm text-blue-600 hover:text-blue-700 font-medium text-center"
        >
          View all achievements →
        </Link>
      </div>

      {/* Upcoming Games */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-slate-900">Upcoming Games</h3>
          <Calendar className="h-5 w-5 text-slate-400" />
        </div>
        <div className="space-y-3">
          {upcomingGames.map((game) => (
            <div key={game.id} className="p-3 bg-slate-50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-slate-900">{game.sport}</span>
                <span className="text-xs bg-emerald-100 text-emerald-800 px-2 py-1 rounded-full">
                  {game.players} joined
                </span>
              </div>
              <p className="text-sm text-slate-600">{game.time}</p>
              <p className="text-xs text-slate-500">{game.location}</p>
            </div>
          ))}
        </div>
        <Link 
          to="/create-game" 
          className="block mt-4 text-sm text-blue-600 hover:text-blue-700 font-medium"
        >
          View all games →
        </Link>
      </div>

      {/* Suggested Connections */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-slate-900">Suggested Partners</h3>
          <Users className="h-5 w-5 text-slate-400" />
        </div>
        <div className="space-y-4">
          {suggestedUsers.map((user) => (
            <div key={user.id} className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <img
                    src={user.avatar}
                    alt={`${user.firstName} ${user.lastName}`}
                    className="w-10 h-10 rounded-full"
                  />
                  {user.isPro && (
                    <Crown className="absolute -top-1 -right-1 w-3 h-3 text-blue-500" />
                  )}
                  {user.isOnline && (
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white"></div>
                  )}
                </div>
                <div>
                  <div className="flex items-center space-x-1">
                    <p className="font-medium text-slate-900 text-sm">
                      {user.firstName} {user.lastName}
                    </p>
                    {user.verified && (
                      <div className="w-3 h-3 bg-blue-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs">✓</span>
                      </div>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 truncate max-w-28">
                    {user.sports[0]} • {user.skillLevel}
                  </p>
                  <div className="flex items-center space-x-1">
                    <Star className="h-3 w-3 text-purple-500 fill-current" />
                    <span className="text-xs text-slate-500">{user.rating}</span>
                  </div>
                </div>
              </div>
              <Button variant="outline" size="sm">
                <Plus className="h-3 w-3" />
              </Button>
            </div>
          ))}
        </div>
        <Link 
          to="/find-partners" 
          className="block mt-4 text-sm text-blue-600 hover:text-blue-700 font-medium"
        >
          View all recommendations →
        </Link>
      </div>

      {/* Featured Courts */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-slate-900">Featured Courts</h3>
          <MapPin className="h-5 w-5 text-slate-400" />
        </div>
        <div className="space-y-4">
          {featuredCourts.map((court) => (
            <div key={court.id} className="border border-slate-200 rounded-lg p-3 hover:shadow-md transition-shadow">
              <img
                src={court.image}
                alt={court.name}
                className="w-full h-20 object-cover rounded-lg mb-2"
              />
              <h4 className="font-medium text-slate-900 text-sm">{court.name}</h4>
              <p className="text-xs text-slate-500 mb-2">{court.location}</p>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-1">
                  <Star className="h-3 w-3 text-purple-500 fill-current" />
                  <span className="text-xs text-slate-600">{court.rating}</span>
                  <span className="text-xs text-slate-500">({court.reviews})</span>
                </div>
                <span className="text-sm font-semibold text-emerald-600">${court.price}/hr</span>
              </div>
            </div>
          ))}
        </div>
        <Link 
          to="/courts" 
          className="block mt-4 text-sm text-blue-600 hover:text-blue-700 font-medium"
        >
          Browse all courts →
        </Link>
      </div>

      {/* Global Platform Stats */}
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl p-6 text-white shadow-lg">
        <h3 className="font-semibold mb-4 flex items-center space-x-2">
          <span>🌍</span>
          <span>Global Sports Network</span>
        </h3>
        
        <div className="grid grid-cols-2 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-blue-400">50M+</div>
            <div className="text-xs text-slate-300">Active Athletes</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-purple-400">500+</div>
            <div className="text-xs text-slate-300">Celebrities</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-emerald-400">25+</div>
            <div className="text-xs text-slate-300">Media Partners</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-indigo-400">180+</div>
            <div className="text-xs text-slate-300">Countries</div>
          </div>
        </div>
        
        <div className="mt-4 p-3 bg-white bg-opacity-10 rounded-lg">
          <p className="text-xs text-slate-200">
            🚀 Join the world's largest sports social network where athletes, celebrities, and fans connect!
          </p>
        </div>
      </div>

      {/* Trending Sports */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-slate-900">Trending Sports</h3>
          <TrendingUp className="h-5 w-5 text-slate-400" />
        </div>
        <div className="space-y-3">
          {[
            { sport: 'Basketball', players: 247, trend: '+12%', icon: '🏀' },
            { sport: 'Tennis', players: 189, trend: '+8%', icon: '🎾' },
            { sport: 'Soccer', players: 156, trend: '+15%', icon: '⚽' },
            { sport: 'Volleyball', players: 98, trend: '+5%', icon: '🏐' }
          ].map((item) => (
            <div key={item.sport} className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-lg">{item.icon}</span>
                <div>
                  <p className="font-medium text-slate-900 text-sm">{item.sport}</p>
                  <p className="text-xs text-slate-500">{item.players} players active</p>
                </div>
              </div>
              <span className="text-xs font-medium text-emerald-600">{item.trend}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};