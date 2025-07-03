/**
 * Posts Service
 * 
 * This service handles all social media post operations including
 * creating posts, liking, commenting, and feed management.
 * 
 * @author Fitcha Team
 * @version 1.0.0
 */

import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  increment,
  arrayUnion,
  arrayRemove,
  serverTimestamp,
  onSnapshot,
  Unsubscribe
} from 'firebase/firestore';
import { db } from './firebase';
import { Post, MatchResult } from '../types';

/**
 * Interface for post creation data
 */
export interface CreatePostData {
  content: string;
  type: 'text' | 'match_result' | 'training' | 'achievement';
  image?: string;
  matchData?: MatchResult;
  location?: string;
  tags?: string[];
}

/**
 * Interface for comment data
 */
export interface CommentData {
  id: string;
  authorId: string;
  content: string;
  createdAt: Date;
  likes: number;
  replies?: CommentData[];
}

/**
 * Create a new post
 * 
 * @param postData - Post data
 * @param authorId - Author user ID
 * @returns Promise<string> - New post ID
 */
export const createPost = async (
  postData: CreatePostData,
  authorId: string
): Promise<string> => {
  try {
    const docRef = await addDoc(collection(db, 'posts'), {
      ...postData,
      authorId,
      likes: 0,
      comments: 0,
      shares: 0,
      likedBy: [],
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });

    return docRef.id;
  } catch (error) {
    console.error('Error creating post:', error);
    throw new Error('Failed to create post');
  }
};

/**
 * Get posts for the user's feed
 * 
 * @param userId - User ID
 * @param pageSize - Number of posts per page
 * @param lastDoc - Last document for pagination
 * @returns Promise<{posts: Post[], hasMore: boolean, lastDoc: any}>
 */
export const getFeedPosts = async (
  userId: string,
  pageSize: number = 20,
  lastDoc?: any
): Promise<{ posts: Post[]; hasMore: boolean; lastDoc: any }> => {
  try {
    // For now, get all posts ordered by creation date
    // In production, you'd implement a more sophisticated feed algorithm
    let q = query(
      collection(db, 'posts'),
      orderBy('createdAt', 'desc'),
      limit(pageSize)
    );

    if (lastDoc) {
      q = query(q, startAfter(lastDoc));
    }

    const querySnapshot = await getDocs(q);
    const posts: Post[] = [];
    let newLastDoc = null;

    // Get all posts with author information
    for (const docSnapshot of querySnapshot.docs) {
      const postData = docSnapshot.data();
      
      // Get author information
      const authorDoc = await getDoc(doc(db, 'users', postData.authorId));
      if (authorDoc.exists()) {
        posts.push({
          id: docSnapshot.id,
          ...postData,
          author: {
            id: authorDoc.id,
            ...authorDoc.data()
          },
          timestamp: postData.createdAt?.toDate() || new Date(),
          isLiked: postData.likedBy?.includes(userId) || false
        } as Post);
      }
      
      newLastDoc = docSnapshot;
    }

    return {
      posts,
      hasMore: querySnapshot.size === pageSize,
      lastDoc: newLastDoc
    };

  } catch (error) {
    console.error('Error fetching feed posts:', error);
    return { posts: [], hasMore: false, lastDoc: null };
  }
};

/**
 * Get posts by a specific user
 * 
 * @param userId - User ID
 * @param pageSize - Number of posts per page
 * @returns Promise<Post[]>
 */
export const getUserPosts = async (
  userId: string,
  pageSize: number = 20
): Promise<Post[]> => {
  try {
    const q = query(
      collection(db, 'posts'),
      where('authorId', '==', userId),
      orderBy('createdAt', 'desc'),
      limit(pageSize)
    );

    const querySnapshot = await getDocs(q);
    const posts: Post[] = [];

    // Get author information
    const authorDoc = await getDoc(doc(db, 'users', userId));
    const authorData = authorDoc.exists() ? { id: authorDoc.id, ...authorDoc.data() } : null;

    querySnapshot.forEach((doc) => {
      if (authorData) {
        posts.push({
          id: doc.id,
          ...doc.data(),
          author: authorData,
          timestamp: doc.data().createdAt?.toDate() || new Date(),
          isLiked: false // Will be updated based on current user
        } as Post);
      }
    });

    return posts;
  } catch (error) {
    console.error('Error fetching user posts:', error);
    return [];
  }
};

/**
 * Like or unlike a post
 * 
 * @param postId - Post ID
 * @param userId - User ID
 * @param isLiking - True to like, false to unlike
 * @returns Promise<boolean>
 */
export const togglePostLike = async (
  postId: string,
  userId: string,
  isLiking: boolean
): Promise<boolean> => {
  try {
    const postRef = doc(db, 'posts', postId);
    
    if (isLiking) {
      await updateDoc(postRef, {
        likes: increment(1),
        likedBy: arrayUnion(userId),
        updatedAt: serverTimestamp()
      });
    } else {
      await updateDoc(postRef, {
        likes: increment(-1),
        likedBy: arrayRemove(userId),
        updatedAt: serverTimestamp()
      });
    }

    return true;
  } catch (error) {
    console.error('Error toggling post like:', error);
    return false;
  }
};

/**
 * Add a comment to a post
 * 
 * @param postId - Post ID
 * @param userId - User ID
 * @param content - Comment content
 * @returns Promise<string> - Comment ID
 */
export const addComment = async (
  postId: string,
  userId: string,
  content: string
): Promise<string> => {
  try {
    // Create comment document
    const commentRef = await addDoc(collection(db, 'comments'), {
      postId,
      authorId: userId,
      content,
      likes: 0,
      likedBy: [],
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });

    // Increment post comment count
    await updateDoc(doc(db, 'posts', postId), {
      comments: increment(1),
      updatedAt: serverTimestamp()
    });

    return commentRef.id;
  } catch (error) {
    console.error('Error adding comment:', error);
    throw new Error('Failed to add comment');
  }
};

/**
 * Get comments for a post
 * 
 * @param postId - Post ID
 * @param pageSize - Number of comments per page
 * @returns Promise<CommentData[]>
 */
export const getPostComments = async (
  postId: string,
  pageSize: number = 20
): Promise<CommentData[]> => {
  try {
    const q = query(
      collection(db, 'comments'),
      where('postId', '==', postId),
      orderBy('createdAt', 'desc'),
      limit(pageSize)
    );

    const querySnapshot = await getDocs(q);
    const comments: CommentData[] = [];

    for (const docSnapshot of querySnapshot.docs) {
      const commentData = docSnapshot.data();
      
      // Get author information
      const authorDoc = await getDoc(doc(db, 'users', commentData.authorId));
      if (authorDoc.exists()) {
        comments.push({
          id: docSnapshot.id,
          ...commentData,
          author: {
            id: authorDoc.id,
            ...authorDoc.data()
          },
          createdAt: commentData.createdAt?.toDate() || new Date()
        } as CommentData);
      }
    }

    return comments;
  } catch (error) {
    console.error('Error fetching post comments:', error);
    return [];
  }
};

/**
 * Share a post
 * 
 * @param postId - Post ID
 * @param userId - User ID
 * @param shareContent - Optional share content
 * @returns Promise<boolean>
 */
export const sharePost = async (
  postId: string,
  userId: string,
  shareContent?: string
): Promise<boolean> => {
  try {
    // Increment share count
    await updateDoc(doc(db, 'posts', postId), {
      shares: increment(1),
      updatedAt: serverTimestamp()
    });

    // Create share record
    await addDoc(collection(db, 'shares'), {
      postId,
      userId,
      content: shareContent || '',
      createdAt: serverTimestamp()
    });

    return true;
  } catch (error) {
    console.error('Error sharing post:', error);
    return false;
  }
};

/**
 * Delete a post
 * 
 * @param postId - Post ID
 * @param userId - User ID (must be author)
 * @returns Promise<boolean>
 */
export const deletePost = async (postId: string, userId: string): Promise<boolean> => {
  try {
    // Check if user is the author
    const postDoc = await getDoc(doc(db, 'posts', postId));
    if (!postDoc.exists()) {
      throw new Error('Post not found');
    }

    const postData = postDoc.data();
    if (postData.authorId !== userId) {
      throw new Error('Only the author can delete this post');
    }

    // Delete the post
    await deleteDoc(doc(db, 'posts', postId));

    // TODO: Also delete associated comments and shares

    return true;
  } catch (error) {
    console.error('Error deleting post:', error);
    return false;
  }
};

/**
 * Update a post
 * 
 * @param postId - Post ID
 * @param userId - User ID (must be author)
 * @param updates - Post updates
 * @returns Promise<boolean>
 */
export const updatePost = async (
  postId: string,
  userId: string,
  updates: Partial<CreatePostData>
): Promise<boolean> => {
  try {
    // Check if user is the author
    const postDoc = await getDoc(doc(db, 'posts', postId));
    if (!postDoc.exists()) {
      throw new Error('Post not found');
    }

    const postData = postDoc.data();
    if (postData.authorId !== userId) {
      throw new Error('Only the author can update this post');
    }

    // Update the post
    await updateDoc(doc(db, 'posts', postId), {
      ...updates,
      updatedAt: serverTimestamp()
    });

    return true;
  } catch (error) {
    console.error('Error updating post:', error);
    return false;
  }
};

/**
 * Get trending posts
 * 
 * @param timeframe - 'day' | 'week' | 'month'
 * @param pageSize - Number of posts
 * @returns Promise<Post[]>
 */
export const getTrendingPosts = async (
  timeframe: 'day' | 'week' | 'month' = 'week',
  pageSize: number = 20
): Promise<Post[]> => {
  try {
    // Calculate date threshold
    const now = new Date();
    const threshold = new Date();
    
    switch (timeframe) {
      case 'day':
        threshold.setDate(now.getDate() - 1);
        break;
      case 'week':
        threshold.setDate(now.getDate() - 7);
        break;
      case 'month':
        threshold.setMonth(now.getMonth() - 1);
        break;
    }

    // Get posts from the timeframe
    const q = query(
      collection(db, 'posts'),
      where('createdAt', '>=', threshold),
      orderBy('createdAt', 'desc'),
      limit(pageSize * 2) // Get more to sort by engagement
    );

    const querySnapshot = await getDocs(q);
    const posts: Post[] = [];

    // Get posts with author information
    for (const docSnapshot of querySnapshot.docs) {
      const postData = docSnapshot.data();
      
      // Get author information
      const authorDoc = await getDoc(doc(db, 'users', postData.authorId));
      if (authorDoc.exists()) {
        posts.push({
          id: docSnapshot.id,
          ...postData,
          author: {
            id: authorDoc.id,
            ...authorDoc.data()
          },
          timestamp: postData.createdAt?.toDate() || new Date(),
          isLiked: false
        } as Post);
      }
    }

    // Sort by engagement score (likes + comments + shares)
    posts.sort((a, b) => {
      const scoreA = a.likes + a.comments + a.shares;
      const scoreB = b.likes + b.comments + b.shares;
      return scoreB - scoreA;
    });

    return posts.slice(0, pageSize);
  } catch (error) {
    console.error('Error fetching trending posts:', error);
    return [];
  }
};

/**
 * Subscribe to real-time post updates
 * 
 * @param postId - Post ID
 * @param callback - Callback function
 * @returns Unsubscribe function
 */
export const subscribeToPostUpdates = (
  postId: string,
  callback: (post: Post | null) => void
): Unsubscribe => {
  return onSnapshot(
    doc(db, 'posts', postId),
    async (doc) => {
      if (doc.exists()) {
        const postData = doc.data();
        
        // Get author information
        const authorDoc = await getDoc(doc(db, 'users', postData.authorId));
        if (authorDoc.exists()) {
          callback({
            id: doc.id,
            ...postData,
            author: {
              id: authorDoc.id,
              ...authorDoc.data()
            },
            timestamp: postData.createdAt?.toDate() || new Date(),
            isLiked: false
          } as Post);
        }
      } else {
        callback(null);
      }
    },
    (error) => {
      console.error('Error in post subscription:', error);
      callback(null);
    }
  );
};

/**
 * Search posts by content
 * 
 * @param searchQuery - Search query
 * @param pageSize - Number of posts
 * @returns Promise<Post[]>
 */
export const searchPosts = async (
  searchQuery: string,
  pageSize: number = 20
): Promise<Post[]> => {
  try {
    // For now, we'll do a simple client-side search
    // In production, you'd use Algolia or similar for full-text search
    const { posts } = await getFeedPosts('', pageSize * 2);

    const filteredPosts = posts.filter(post =>
      post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (post.tags && post.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())))
    );

    return filteredPosts.slice(0, pageSize);
  } catch (error) {
    console.error('Error searching posts:', error);
    return [];
  }
};