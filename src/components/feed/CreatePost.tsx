import React, { useState } from 'react';
import { Image, Smile, Calendar, MoreHorizontal, Trophy, Target } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { Button } from '../ui/Button';
import { useTheme } from '../../hooks/useTheme';

export const CreatePost: React.FC = () => {
  const { user } = useAuth();
  const { isDark } = useTheme();
  const [content, setContent] = useState('');
  const [postType, setPostType] = useState<'text' | 'match_result' | 'training' | 'achievement'>('text');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (content.trim()) {
      console.log('Creating post:', { content, type: postType });
      setContent('');
      setPostType('text');
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm">
      <div className="flex items-start space-x-4">
        <img
          src={user?.avatar}
          alt={`${user?.firstName} ${user?.lastName}`}
          className="w-12 h-12 rounded-full"
        />
        <div className="flex-1">
          <form onSubmit={handleSubmit}>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Share your sports journey..."
              className="w-full p-3 border border-slate-300 dark:border-slate-600 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
              rows={3}
            />
            
            {/* Post Type Selector */}
            <div className="flex items-center space-x-2 mt-3 mb-4">
              <button
                type="button"
                onClick={() => setPostType('text')}
                className={`px-3 py-1 text-sm rounded-full transition-colors ${
                  postType === 'text' 
                    ? 'bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300' 
                    : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
                }`}
              >
                Update
              </button>
              <button
                type="button"
                onClick={() => setPostType('match_result')}
                className={`px-3 py-1 text-sm rounded-full transition-colors ${
                  postType === 'match_result' 
                    ? 'bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300' 
                    : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
                }`}
              >
                Match Result
              </button>
              <button
                type="button"
                onClick={() => setPostType('training')}
                className={`px-3 py-1 text-sm rounded-full transition-colors ${
                  postType === 'training' 
                    ? 'bg-orange-100 dark:bg-orange-900/50 text-orange-700 dark:text-orange-300' 
                    : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
                }`}
              >
                Training
              </button>
              <button
                type="button"
                onClick={() => setPostType('achievement')}
                className={`px-3 py-1 text-sm rounded-full transition-colors ${
                  postType === 'achievement' 
                    ? 'bg-yellow-100 dark:bg-yellow-900/50 text-yellow-700 dark:text-yellow-300' 
                    : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
                }`}
              >
                Achievement
              </button>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <button
                  type="button"
                  className="flex items-center space-x-2 text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  <Image className="h-5 w-5" />
                  <span className="text-sm">Photo</span>
                </button>
                <button
                  type="button"
                  className="flex items-center space-x-2 text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  <Trophy className="h-5 w-5" />
                  <span className="text-sm">Score</span>
                </button>
                <button
                  type="button"
                  className="flex items-center space-x-2 text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  <Target className="h-5 w-5" />
                  <span className="text-sm">Location</span>
                </button>
                <button
                  type="button"
                  className="text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  <MoreHorizontal className="h-5 w-5" />
                </button>
              </div>
              
              <Button 
                type="submit" 
                disabled={!content.trim()}
                className="px-6"
              >
                Share
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};