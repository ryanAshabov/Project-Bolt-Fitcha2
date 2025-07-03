import React from 'react';
import { Trophy, Lock, Star, Target, Users, MapPin, Calendar } from 'lucide-react';
import { Achievement } from '../../types';

interface AchievementCardProps {
  achievement: Achievement;
  size?: 'sm' | 'md' | 'lg';
}

export const AchievementCard: React.FC<AchievementCardProps> = ({ achievement, size = 'md' }) => {
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'games': return <Trophy className="h-4 w-4" />;
      case 'social': return <Users className="h-4 w-4" />;
      case 'skills': return <Target className="h-4 w-4" />;
      case 'exploration': return <MapPin className="h-4 w-4" />;
      case 'consistency': return <Calendar className="h-4 w-4" />;
      default: return <Star className="h-4 w-4" />;
    }
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'from-slate-400 to-slate-600';
      case 'rare': return 'from-blue-400 to-blue-600';
      case 'epic': return 'from-purple-400 to-purple-600';
      case 'legendary': return 'from-yellow-400 to-yellow-600';
      default: return 'from-slate-400 to-slate-600';
    }
  };

  const sizeClasses = {
    sm: 'p-3',
    md: 'p-4',
    lg: 'p-6'
  };

  const iconSizes = {
    sm: 'text-2xl',
    md: 'text-3xl',
    lg: 'text-4xl'
  };

  return (
    <div className={`bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all duration-200 ${sizeClasses[size]} ${
      achievement.completed ? 'ring-2 ring-emerald-200' : 'opacity-75'
    }`}>
      <div className="text-center">
        {/* Achievement Icon */}
        <div className={`${iconSizes[size]} mb-3 ${achievement.completed ? '' : 'grayscale'}`}>
          {achievement.completed ? achievement.icon : '🔒'}
        </div>

        {/* Achievement Name */}
        <h3 className={`font-semibold text-slate-900 mb-2 ${
          size === 'sm' ? 'text-sm' : size === 'md' ? 'text-base' : 'text-lg'
        }`}>
          {achievement.name}
        </h3>

        {/* Description */}
        <p className={`text-slate-600 mb-3 ${
          size === 'sm' ? 'text-xs' : 'text-sm'
        }`}>
          {achievement.description}
        </p>

        {/* Progress Bar */}
        {!achievement.completed && (
          <div className="mb-3">
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs text-slate-500">Progress</span>
              <span className="text-xs font-medium text-slate-700">
                {achievement.progress}/{achievement.target}
              </span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-blue-500 to-emerald-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${Math.min((achievement.progress / achievement.target) * 100, 100)}%` }}
              />
            </div>
          </div>
        )}

        {/* Category and Rarity */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-1 text-slate-500">
            {getCategoryIcon(achievement.category)}
            <span className="text-xs capitalize">{achievement.category}</span>
          </div>
          
          <div className={`px-2 py-1 rounded-full text-xs font-medium bg-gradient-to-r ${getRarityColor(achievement.rarity)} text-white`}>
            {achievement.rarity}
          </div>
        </div>

        {/* Completion Date */}
        {achievement.completed && achievement.unlockedAt && (
          <div className="mt-3 pt-3 border-t border-slate-200">
            <p className="text-xs text-slate-500">
              Unlocked {new Date(achievement.unlockedAt).toLocaleDateString()}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};