import React from 'react';
import { Loader2, Wifi } from 'lucide-react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  color?: 'primary' | 'secondary' | 'white';
  className?: string;
}

/**
 * Reusable loading spinner component with different sizes and colors
 */
export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  color = 'primary',
  className = '',
}) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8',
  };

  const colorClasses = {
    primary: 'text-blue-600',
    secondary: 'text-gray-500',
    white: 'text-white',
  };

  return (
    <Loader2 
      className={`animate-spin ${sizeClasses[size]} ${colorClasses[color]} ${className}`}
    />
  );
};

interface PageLoadingProps {
  message?: string;
  showLogo?: boolean;
}

/**
 * Full page loading component for route transitions
 */
export const PageLoading: React.FC<PageLoadingProps> = ({
  message = 'Loading...',
  showLogo = true,
}) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        {showLogo && (
          <div className="mb-8">
            <div className={`
              mx-auto h-16 w-16 bg-gradient-to-r from-blue-600 to-emerald-600 
              rounded-xl flex items-center justify-center mb-4
            `}>
              <span className="text-white font-bold text-xl">F</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Fitcha</h1>
          </div>
        )}
        
        <LoadingSpinner size="lg" className="mb-4" />
        <p className="text-gray-600">{message}</p>
      </div>
    </div>
  );
};

interface SkeletonProps {
  width?: string;
  height?: string;
  className?: string;
  rounded?: boolean;
}

/**
 * Skeleton loading component for content placeholders
 */
export const Skeleton: React.FC<SkeletonProps> = ({
  width = 'w-full',
  height = 'h-4',
  className = '',
  rounded = true,
}) => {
  const roundedClass = rounded ? 'rounded' : '';
  
  return (
    <div
      className={`animate-pulse bg-gray-200 ${width} ${height} ${roundedClass} ${className}`}
    />
  );
};

/**
 * Card skeleton for loading post/court cards
 */
export const CardSkeleton: React.FC = () => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
      <div className="flex items-center space-x-4">
        <Skeleton width="w-12" height="h-12" className="rounded-full" />
        <div className="space-y-2 flex-1">
          <Skeleton width="w-24" height="h-4" />
          <Skeleton width="w-16" height="h-3" />
        </div>
      </div>
      
      <div className="space-y-2">
        <Skeleton width="w-full" height="h-4" />
        <Skeleton width="w-3/4" height="h-4" />
        <Skeleton width="w-1/2" height="h-4" />
      </div>
      
      <Skeleton width="w-full" height="h-32" />
      
      <div className="flex space-x-4">
        <Skeleton width="w-16" height="h-8" />
        <Skeleton width="w-16" height="h-8" />
        <Skeleton width="w-16" height="h-8" />
      </div>
    </div>
  );
};

interface NetworkErrorProps {
  onRetry?: () => void;
  message?: string;
}

/**
 * Network error component with retry functionality
 */
export const NetworkError: React.FC<NetworkErrorProps> = ({
  onRetry,
  message = 'Network connection failed',
}) => {
  return (
    <div className="text-center py-12">
      <Wifi className="mx-auto h-12 w-12 text-gray-400 mb-4" />
      <h3 className="text-lg font-medium text-gray-900 mb-2">Connection Error</h3>
      <p className="text-gray-600 mb-6">{message}</p>
      
      {onRetry && (
        <button
          onClick={onRetry}
          className={`
            bg-blue-600 text-white px-4 py-2 rounded-md 
            hover:bg-blue-700 transition-colors
          `}
        >
          Try Again
        </button>
      )}
    </div>
  );
};

/**
 * Inline loading component for buttons
 */
export const ButtonLoading: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <span className="flex items-center">
      <LoadingSpinner size="sm" color="white" className="mr-2" />
      {children}
    </span>
  );
};
