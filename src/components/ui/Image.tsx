/**
 * Optimized Image Component
 * 
 * This component provides image optimization features:
 * - Lazy loading
 * - Responsive sizes
 * - Placeholder/blur-up loading
 * - Error handling
 * 
 * @author Fitcha Team
 * @version 1.0.0
 */

import React, { useState, useEffect } from 'react';
import { optimizeImageSrc } from '../../utils/performance';

interface ImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  objectFit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down';
  priority?: boolean;
  onLoad?: () => void;
  onError?: () => void;
  sizes?: string;
  fallbackSrc?: string;
}

export const OptimizedImage: React.FC<ImageProps> = ({
  src,
  alt,
  width,
  height,
  className = '',
  objectFit = 'cover',
  priority = false,
  onLoad,
  onError,
  sizes = '100vw',
  fallbackSrc = 'https://via.placeholder.com/400x300?text=Image+Not+Available',
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(false);
  const [imageSrc, setImageSrc] = useState(priority ? src : '');

  useEffect(() => {
    // If not priority, load the image after component mounts
    if (!priority && !imageSrc) {
      const img = new Image();
      img.src = src;
      setImageSrc(src);
    }
  }, [priority, imageSrc, src]);

  const handleLoad = () => {
    setIsLoaded(true);
    if (onLoad) {
      onLoad();
    }
  };

  const handleError = () => {
    setError(true);
    if (onError) {
      onError();
    }
  };

  // Generate optimized image URL if width/height provided
  const optimizedSrc = (width || height) 
    ? optimizeImageSrc(error ? fallbackSrc : src, width, height) 
    : (error ? fallbackSrc : src);

  return (
    <div 
      className={`relative overflow-hidden ${className}`}
      style={{ width: width ? `${width}px` : '100%', height: height ? `${height}px` : 'auto' }}
    >
      {/* Low-quality placeholder or loading state */}
      {!isLoaded && (
        <div 
          className="absolute inset-0 bg-slate-200 animate-pulse"
          style={{ aspectRatio: width && height ? width / height : 'auto' }}
        />
      )}
      
      {/* Actual image */}
      <img
        src={optimizedSrc}
        alt={alt}
        width={width}
        height={height}
        loading={priority ? 'eager' : 'lazy'}
        onLoad={handleLoad}
        onError={handleError}
        className={`transition-opacity duration-300 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
        style={{ 
          objectFit,
          width: '100%',
          height: '100%',
        }}
        sizes={sizes}
      />
    </div>
  );
};