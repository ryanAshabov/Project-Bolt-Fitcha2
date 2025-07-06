import React, { useState } from 'react';
import { TrendingUp, Trophy, Users, Clock, Target, Calendar, BarChart3, PieChart } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

export const PersonalAnalytics: React.FC = () => {
  const { user } = useAuth();
  const [timeframe, setTimeframe] = useState<'week' | 'month' | 'year'>('month');

  if (!user) {
return null;
}

  const mockAnalytics = {
    week: {
      gamesPlayed: 3,
      hoursPlayed: 4.5,
      improvement: '+15%',
      favoriteTime: '6-8 PM',
      topSport: 'Basketball',
      socialScore: 85,
    },
    month: {
      gamesPlayed: 12,
      hoursPlayed: 18,
      improvement: '+23%',
      favoriteTime: '6-8 PM',
      topSport: 'Basketball',
      socialScore: 88,
    },
    year: {
      gamesPlayed: 127,
      hoursPlayed: 190,
      improvement: '+45%',
      favoriteTime: '6-8 PM',
      topSport: 'Basketball',
      socialScore: 92,
    },
  };

  const analytics = mockAnalytics[timeframe];

  const statCards = [
    {
      title: 'Games Played',
      value: analytics.gamesPlayed,
      icon: Trophy,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      change: analytics.improvement,
    },
    {
      title: 'Hours Played',
      value: analytics.hoursPlayed,
      icon: Clock,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-100',
      change: '+12%',
    },
    {
      title: 'Social Score',
      value: analytics.socialScore,
      icon: Users,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
      change: '+8%',
    },
    {
      title: 'Win Rate',
      value: `${user.winRate}%`,
      icon: Target,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100',
      change: '+5%',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-900">Your Analytics</h2>
        <div className="flex space-x-2">
          {(['week', 'month', 'year'] as const).map((period) => (
            <button
              key={period}
              onClick={() => setTimeframe(period)}
              className={`px-4 py-2 text-sm rounded-lg transition-colors ${
                timeframe === period
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {period.charAt(0).toUpperCase() + period.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.title} className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                  <Icon className={`h-6 w-6 ${stat.color}`} />
                </div>
                <span className="text-sm font-medium text-emerald-600">{stat.change}</span>
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900 mb-1">{stat.value}</p>
                <p className="text-sm text-slate-600">{stat.title}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Performance Trend */}
        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-semibold text-slate-900">Performance Trend</h3>
            <BarChart3 className="h-5 w-5 text-slate-400" />
          </div>
          
          <div className="h-48 bg-slate-50 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <TrendingUp className="h-12 w-12 text-slate-400 mx-auto mb-3" />
              <p className="text-slate-500">Performance chart</p>
              <p className="text-sm text-slate-400">Shows your improvement over time</p>
            </div>
          </div>
        </div>

        {/* Sports Breakdown */}
        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-semibold text-slate-900">Sports Breakdown</h3>
            <PieChart className="h-5 w-5 text-slate-400" />
          </div>
          
          <div className="space-y-4">
            {user.sports.map((sport, index) => {
              const percentages = [45, 30, 25];
              const colors = ['bg-blue-500', 'bg-emerald-500', 'bg-purple-500'];
              return (
                <div key={sport} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${colors[index]}`}></div>
                    <span className="text-sm text-slate-700">{sport}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-20 bg-slate-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${colors[index]}`}
                        style={{ width: `${percentages[index]}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium text-slate-900">{percentages[index]}%</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Insights */}
      <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
        <h3 className="font-semibold text-slate-900 mb-4">Insights & Recommendations</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-blue-50 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">Peak Performance</h4>
            <p className="text-sm text-blue-700">
              You play best during {analytics.favoriteTime}. Consider scheduling important games during this time.
            </p>
          </div>
          
          <div className="p-4 bg-emerald-50 rounded-lg">
            <h4 className="font-medium text-emerald-900 mb-2">Favorite Sport</h4>
            <p className="text-sm text-emerald-700">
              {analytics.topSport} is your most played sport. You've shown great improvement in this area.
            </p>
          </div>
          
          <div className="p-4 bg-purple-50 rounded-lg">
            <h4 className="font-medium text-purple-900 mb-2">Social Growth</h4>
            <p className="text-sm text-purple-700">
              Your social score is {analytics.socialScore}/100. Try playing with new partners to increase it.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};