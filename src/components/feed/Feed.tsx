import React from 'react';
import { mockPosts } from '../../data/mockData';
import { CreatePost } from './CreatePost';
import { PostCard } from './PostCard';

export const Feed: React.FC = () => {
  return (
    <div className="flex-1 max-w-4xl mx-auto space-y-6">
      <CreatePost />
      <div className="space-y-6">
        {mockPosts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
};