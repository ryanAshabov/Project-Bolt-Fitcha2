import React, { useState } from 'react';
import { Heart, MessageCircle, Share2, MoreHorizontal, Trophy, Target, Crown, CheckCircle, Star } from 'lucide-react';
import { Post } from '../../types';
import { Button } from '../ui/Button';
import { OptimizedImage } from '../ui/Image';
import { useTheme } from '../../hooks/useTheme';

interface PostCardProps {
  post: Post;
}

export const PostCard: React.FC<PostCardProps> = ({ post }) => {
  const { isDark } = useTheme();
  const [isLiked, setIsLiked] = useState(post.isLiked);
  const [likes, setLikes] = useState(post.likes);

  const handleLike = (): void => {
    if (isLiked) {
      setLikes(likes - 1);
    } else {
      setLikes(likes + 1);
    }
    setIsLiked(!isLiked);
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    
    if (hours < 1) {
      const minutes = Math.floor(diff / (1000 * 60));
      return `${minutes}m`;
    } else if (hours < 24) {
      return `${hours}h`;
    } else {
      const days = Math.floor(hours / 24);
      return `${days}d`;
    }
  };

  const formatLikes = (count: number): string => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`;
    }
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`;
    }
    return count.toString();
  };

  const getPostTypeColor = (type: string) => {
    switch (type) {
      case 'match_result': return 'bg-emerald-100 text-emerald-700';
      case 'training': return 'bg-orange-100 text-orange-700';
      case 'achievement': return 'bg-purple-100 text-purple-700';
      default: return 'bg-blue-100 text-blue-700';
    }
  };

  const getPostTypeIcon = (type: string) => {
    switch (type) {
      case 'match_result': return <Trophy className="h-4 w-4" />;
      case 'training': return <Target className="h-4 w-4" />;
      case 'achievement': return <Trophy className="h-4 w-4" />;
      default: return null;
    }
  };

  const isCelebrity = post.author.connections > 1000000;
  const isMediaOrganization = post.author.email?.includes('@espn.com') || post.author.email?.includes('@beinsports.com');

  return (
    <div className={`bg-white dark:bg-slate-800 rounded-xl border shadow-sm hover:shadow-md transition-shadow ${
      isCelebrity ? 'border-blue-200 bg-gradient-to-br from-white to-blue-50' : 
      isMediaOrganization ? 'border-purple-200 bg-gradient-to-br from-white to-purple-50' : 
      'border-slate-200 dark:border-slate-700'
    } p-6`}>
      {/* Post Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start space-x-3">
          <div className="relative">
            <img
              src={post.author.avatar}
              alt={`${post.author.firstName} ${post.author.lastName}`}
              className={`rounded-full ${
                isCelebrity ? 'w-14 h-14 ring-4 ring-blue-200' : 
                isMediaOrganization ? 'w-14 h-14 ring-4 ring-purple-200' : 
                'w-12 h-12'
              }`}
            />
            {post.author.isPro && (
              <Crown className="absolute -top-1 -right-1 w-5 h-5 text-blue-500" />
            )}
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className={`font-semibold ${
                isCelebrity ? 'text-lg text-blue-900 dark:text-blue-300' : 
                isMediaOrganization ? 'text-lg text-purple-900 dark:text-purple-300' : 
                'text-slate-900 dark:text-white'
              }`}>
                {post.author.firstName} {post.author.lastName}
              </h3>
              {post.author.verified && (
                <CheckCircle className={`w-5 h-5 ${
                  isCelebrity ? 'text-blue-500' : 
                  isMediaOrganization ? 'text-purple-500' : 
                  'text-blue-500'
                } fill-current`} />
              )}
              {post.author.isPro && (
                <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                  isCelebrity ? 'bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-300' : 
                  'bg-purple-100 dark:bg-purple-900/50 text-purple-800 dark:text-purple-300'
                }`}>
                  PRO
                </span>
              )}
              {isCelebrity && (
                <span className="text-xs bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-2 py-1 rounded-full font-medium">
                  ⭐ CELEBRITY
                </span>
              )}
              {isMediaOrganization && (
                <span className="text-xs bg-gradient-to-r from-purple-500 to-indigo-600 text-white px-2 py-1 rounded-full font-medium">
                  📺 MEDIA
                </span>
              )}
            </div>
            <p className={`text-sm ${
              isCelebrity ? 'text-blue-700 dark:text-blue-400' : 
              isMediaOrganization ? 'text-purple-700 dark:text-purple-400' : 
              'text-slate-600 dark:text-slate-300'
            }`}>
              {post.author.headline}
            </p>
            <div className="flex items-center space-x-2 mt-1">
              <p className="text-xs text-slate-500">{formatTime(post.timestamp)}</p>
              {post.type !== 'text' && (
                <span className={`text-xs px-2 py-1 rounded-full flex items-center space-x-1 ${getPostTypeColor(post.type)} ${isDark ? 'bg-opacity-50' : ''}`}>
                  {getPostTypeIcon(post.type)}
                  <span className="capitalize">{post.type.replace('_', ' ')}</span>
                </span>
              )}
              {post.location && (
                <span className="text-xs text-slate-500">📍 {post.location}</span>
              )}
            </div>
          </div>
        </div>
        <Button variant="ghost" size="sm">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </div>

      {/* Post Content */}
      <div className="mb-4">
        <p className={`whitespace-pre-wrap ${
          isCelebrity ? 'text-slate-800 dark:text-slate-200 text-lg leading-relaxed' : 
          isMediaOrganization ? 'text-slate-800 dark:text-slate-200 leading-relaxed' : 
          'text-slate-900 dark:text-slate-200'
        }`}>
          {post.content}
        </p>
        
        {/* Match Result Display */}
        {post.type === 'match_result' && post.matchData && (
          <div className="mt-3 p-3 bg-emerald-50 dark:bg-emerald-900/30 rounded-lg border border-emerald-200 dark:border-emerald-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold text-emerald-900 dark:text-emerald-300">{post.matchData.sport} Match</p>
                <p className="text-sm text-emerald-700 dark:text-emerald-400">vs {post.matchData.opponent}</p>
                <p className="text-sm text-emerald-600 dark:text-emerald-500">{post.matchData.court}</p>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-emerald-900 dark:text-emerald-300">{post.matchData.score}</p>
              </div>
            </div>
          </div>
        )}
        
        {post.image && (
          <div className="mt-4 rounded-lg overflow-hidden">
            <OptimizedImage
              src={post.image}
              alt="Post content"
              className="w-full h-64"
              objectFit="cover"
              width={600}
              height={300}
            />
          </div>
        )}

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className={`text-xs px-2 py-1 rounded-full ${
                  isCelebrity ? 'bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-300' : 
                  isMediaOrganization ? 'bg-purple-100 dark:bg-purple-900/50 text-purple-800 dark:text-purple-300' : 
                  'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                }`}
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Engagement Stats for Celebrities */}
      {isCelebrity && (
        <div className="mb-3 p-3 bg-blue-50 dark:bg-blue-900/30 rounded-lg border border-blue-200 dark:border-blue-800">
          <div className="flex items-center justify-between text-sm dark:text-blue-300">
            <div className="flex items-center space-x-4">
              <span className="text-blue-800 dark:text-blue-300">
                <Heart className="h-4 w-4 inline mr-1" />
                {formatLikes(likes)} likes
              </span>
              <span className="text-blue-800 dark:text-blue-300">
                <MessageCircle className="h-4 w-4 inline mr-1" />
                {formatLikes(post.comments)} comments
              </span>
              <span className="text-blue-800 dark:text-blue-300">
                <Share2 className="h-4 w-4 inline mr-1" />
                {formatLikes(post.shares)} shares
              </span>
            </div>
            <span className="text-blue-700 dark:text-blue-400 font-medium">
              🔥 Trending Worldwide
            </span>
          </div>
        </div>
      )}

      {/* Post Actions */}
      <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-700">
        <div className="flex items-center space-x-6">
          <button
            onClick={handleLike}
            className={`flex items-center space-x-2 text-sm transition-colors ${
              isLiked 
                ? 'text-red-600 dark:text-red-500 hover:text-red-700 dark:hover:text-red-400' 
                : 'text-slate-600 dark:text-slate-300 hover:text-red-600 dark:hover:text-red-500'
            }`}
          >
            <Heart 
              className={`h-5 w-5 ${isLiked ? 'fill-current' : ''}`} 
            />
            <span>{formatLikes(likes)}</span>
          </button>
          
          <button className="flex items-center space-x-2 text-sm text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
            <MessageCircle className="h-5 w-5" />
            <span>{formatLikes(post.comments)}</span>
          </button>
          
          <button className="flex items-center space-x-2 text-sm text-slate-600 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
            <Share2 className="h-5 w-5" />
            <span>{formatLikes(post.shares)}</span>
          </button>
        </div>

        {/* Special Actions for Celebrity Posts */}
        {isCelebrity && (
          <div className="flex items-center space-x-2">
            <Button size="sm" variant="outline" className="text-blue-700 dark:text-blue-400 border-blue-300 dark:border-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/30">
              <Star className="h-4 w-4 mr-1" />
              Follow
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};