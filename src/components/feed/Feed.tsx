import React from 'react';
import { mockPosts } from '../../data/mockData';
import { CreatePost } from './CreatePost';
import { PostCard } from './PostCard';
import { useTheme } from '../../hooks/useTheme';

export const Feed: React.FC = () => {
  const { isDark } = useTheme();

  return (
    <div className="flex-1 max-w-4xl mx-auto space-y-6 dark:text-white">
      <CreatePost />
      <div className="space-y-6">
        {mockPosts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
};