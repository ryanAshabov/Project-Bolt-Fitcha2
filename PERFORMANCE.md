# ⚡ Performance Optimization Guide

## Bundle Optimization

### Code Splitting
```typescript
// Lazy load pages for better performance
import { lazy, Suspense } from 'react';

const HomePage = lazy(() => import('../pages/HomePage'));
const CourtsPage = lazy(() => import('../pages/CourtsPage'));
const MessagesPage = lazy(() => import('../pages/MessagesPage'));

// Usage with Suspense
<Suspense fallback={<div>Loading...</div>}>
  <HomePage />
</Suspense>
```

### Tree Shaking
```typescript
// Good: Import only what you need
import { Button } from '@/components/ui/Button';
import { format } from 'date-fns';

// Bad: Import entire library
import * as DateFns from 'date-fns';
import * as Components from '@/components';
```

### Bundle Analysis
```bash
# Analyze bundle size
npm run analyze

# Check for duplicate dependencies
npx webpack-bundle-analyzer dist/stats.html
```

## React Performance

### Component Optimization
```typescript
// Use React.memo for expensive components
export const ExpensiveComponent = React.memo<Props>(({ data }) => {
  // Expensive calculations
  const processedData = useMemo(() => {
    return data.map(item => expensiveProcessing(item));
  }, [data]);

  return <div>{/* Render processed data */}</div>;
});

// Use useCallback for event handlers
export const OptimizedComponent: React.FC<Props> = ({ onUpdate }) => {
  const handleClick = useCallback((id: string) => {
    onUpdate(id);
  }, [onUpdate]);

  return <Button onClick={() => handleClick('id')} />;
};
```

### Virtual Scrolling
```typescript
// For large lists, implement virtual scrolling
import { FixedSizeList as List } from 'react-window';

const VirtualizedList: React.FC<{ items: any[] }> = ({ items }) => {
  const Row = ({ index, style }: any) => (
    <div style={style}>
      {/* Render item at index */}
      {items[index]}
    </div>
  );

  return (
    <List
      height={600}
      itemCount={items.length}
      itemSize={50}
      width="100%"
    >
      {Row}
    </List>
  );
};
```

### State Management Optimization
```typescript
// Split state to avoid unnecessary re-renders
const useOptimizedState = () => {
  // Instead of one large state object
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // Use separate states for independent data
  return { user, setUser, posts, setPosts, loading, setLoading };
};
```

## Image Optimization

### Responsive Images
```typescript
// Use responsive images with different sizes
const OptimizedImage: React.FC<ImageProps> = ({ src, alt, className }) => {
  return (
    <picture>
      <source media="(max-width: 768px)" srcSet={`${src}?w=400`} />
      <source media="(max-width: 1200px)" srcSet={`${src}?w=800`} />
      <img 
        src={`${src}?w=1200`} 
        alt={alt} 
        className={className}
        loading="lazy"
        decoding="async"
      />
    </picture>
  );
};
```

### Image Lazy Loading
```typescript
// Implement intersection observer for lazy loading
const useLazyImage = (src: string) => {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [imageRef, setImageRef] = useState<HTMLImageElement | null>(null);

  useEffect(() => {
    let observer: IntersectionObserver;
    
    if (imageRef && imageSrc !== src) {
      observer = new IntersectionObserver(
        entries => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              setImageSrc(src);
              observer.unobserve(imageRef);
            }
          });
        },
        { threshold: 0.1 }
      );
      
      observer.observe(imageRef);
    }
    
    return () => observer?.disconnect();
  }, [imageRef, imageSrc, src]);

  return [imageSrc, setImageRef] as const;
};
```

## API Optimization

### Request Caching
```typescript
// Implement request caching with React Query
import { useQuery } from '@tanstack/react-query';

export const useCourtData = (courtId: string) => {
  return useQuery({
    queryKey: ['court', courtId],
    queryFn: () => fetchCourt(courtId),
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
  });
};
```

### Request Batching
```typescript
// Batch multiple requests
const useBatchedRequests = () => {
  const batchRequests = useCallback(async (ids: string[]) => {
    // Batch API call instead of individual requests
    const response = await fetch('/api/batch', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ids }),
    });
    return response.json();
  }, []);

  return { batchRequests };
};
```

### Debounced Search
```typescript
// Debounce search requests
import { useDeferredValue } from 'react';

export const useDebounce = <T>(value: T, delay: number): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
};

// Usage in search component
const SearchComponent: React.FC = () => {
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, 300);

  const { data, loading } = useQuery({
    queryKey: ['search', debouncedQuery],
    queryFn: () => searchAPI(debouncedQuery),
    enabled: debouncedQuery.length > 2,
  });

  return (
    <input
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      placeholder="Search..."
    />
  );
};
```

## Firebase Optimization

### Efficient Queries
```typescript
// Optimize Firestore queries
export const getOptimizedPosts = async (userId: string, limit = 10) => {
  const postsRef = collection(db, 'posts');
  
  // Use indexed queries
  const q = query(
    postsRef,
    where('authorId', '==', userId),
    orderBy('createdAt', 'desc'),
    limit(limit)
  );
  
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

// Use pagination for large datasets
export const usePaginatedPosts = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [lastDoc, setLastDoc] = useState<QueryDocumentSnapshot | null>(null);
  const [loading, setLoading] = useState(false);

  const loadMorePosts = useCallback(async () => {
    setLoading(true);
    
    let q = query(
      collection(db, 'posts'),
      orderBy('createdAt', 'desc'),
      limit(10)
    );
    
    if (lastDoc) {
      q = query(q, startAfter(lastDoc));
    }
    
    const snapshot = await getDocs(q);
    const newPosts = snapshot.docs.map(doc => ({ 
      id: doc.id, 
      ...doc.data() 
    })) as Post[];
    
    setPosts(prev => [...prev, ...newPosts]);
    setLastDoc(snapshot.docs[snapshot.docs.length - 1] || null);
    setLoading(false);
  }, [lastDoc]);

  return { posts, loadMorePosts, loading, hasMore: !!lastDoc };
};
```

### Real-time Optimization
```typescript
// Optimize real-time listeners
export const useOptimizedPosts = (userId: string) => {
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    // Use specific queries to reduce data transfer
    const q = query(
      collection(db, 'posts'),
      where('authorId', '==', userId),
      orderBy('createdAt', 'desc'),
      limit(20) // Limit initial load
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const changes = snapshot.docChanges();
      
      // Process only changes, not entire dataset
      changes.forEach((change) => {
        const postData = { id: change.doc.id, ...change.doc.data() } as Post;
        
        if (change.type === 'added') {
          setPosts(prev => [postData, ...prev]);
        } else if (change.type === 'modified') {
          setPosts(prev => prev.map(post => 
            post.id === postData.id ? postData : post
          ));
        } else if (change.type === 'removed') {
          setPosts(prev => prev.filter(post => post.id !== postData.id));
        }
      });
    });

    return unsubscribe;
  }, [userId]);

  return posts;
};
```

## CSS Performance

### CSS-in-JS Optimization
```typescript
// Use styled-components efficiently
import styled, { css } from 'styled-components';

// Create reusable style mixins
const buttonBase = css`
  padding: 0.5rem 1rem;
  border-radius: 0.25rem;
  border: none;
  cursor: pointer;
  transition: all 0.2s;
`;

const Button = styled.button<{ variant: 'primary' | 'secondary' }>`
  ${buttonBase}
  
  ${props => props.variant === 'primary' && css`
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    
    &:hover {
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }
  `}
  
  ${props => props.variant === 'secondary' && css`
    background: #f8f9fa;
    color: #495057;
    border: 1px solid #dee2e6;
    
    &:hover {
      background: #e9ecef;
    }
  `}
`;
```

### Critical CSS
```html
<!-- Inline critical CSS for above-the-fold content -->
<style>
  /* Critical styles for header and hero section */
  .header { /* styles */ }
  .hero { /* styles */ }
</style>

<!-- Load non-critical CSS asynchronously -->
<link rel="preload" href="/css/non-critical.css" as="style" onload="this.onload=null;this.rel='stylesheet'">
```

## Monitoring & Measurement

### Performance Metrics
```typescript
// Implement performance monitoring
export const trackPerformance = () => {
  // Web Vitals
  import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
    getCLS(console.log);
    getFID(console.log);
    getFCP(console.log);
    getLCP(console.log);
    getTTFB(console.log);
  });
};

// Custom performance tracking
export const measureComponentRender = (componentName: string) => {
  return (WrappedComponent: React.ComponentType<any>) => {
    return (props: any) => {
      const renderStart = performance.now();
      
      useEffect(() => {
        const renderEnd = performance.now();
        console.log(`${componentName} render time: ${renderEnd - renderStart}ms`);
      });
      
      return <WrappedComponent {...props} />;
    };
  };
};
```

### Bundle Size Monitoring
```javascript
// webpack.config.js - Bundle size limits
module.exports = {
  performance: {
    maxAssetSize: 250000,
    maxEntrypointSize: 250000,
    hints: 'warning'
  }
};
```

## Performance Checklist

### Initial Load
- [ ] **Bundle Size** < 250KB gzipped
- [ ] **First Contentful Paint** < 1.5s
- [ ] **Largest Contentful Paint** < 2.5s
- [ ] **Time to Interactive** < 3.5s
- [ ] **Critical CSS** inlined for above-the-fold content

### Runtime Performance
- [ ] **Component Re-renders** minimized with React.memo
- [ ] **Expensive Calculations** memoized with useMemo
- [ ] **Event Handlers** optimized with useCallback
- [ ] **List Rendering** virtualized for large datasets
- [ ] **Image Loading** lazy loaded and optimized

### Network Optimization
- [ ] **API Requests** cached and batched
- [ ] **Search Queries** debounced
- [ ] **Real-time Updates** optimized with specific queries
- [ ] **Static Assets** cached with appropriate headers
- [ ] **CDN** used for static resources

### Memory Management
- [ ] **Event Listeners** cleaned up on unmount
- [ ] **Subscriptions** properly unsubscribed
- [ ] **Large Objects** released when not needed
- [ ] **Memory Leaks** monitored and fixed
- [ ] **Garbage Collection** optimized

## Tools & Resources

### Performance Testing
- **Lighthouse** - Overall performance audit
- **WebPageTest** - Detailed performance analysis
- **Chrome DevTools** - Real-time performance monitoring
- **React DevTools** - Component render profiling

### Bundle Analysis
- **webpack-bundle-analyzer** - Bundle composition analysis
- **source-map-explorer** - Source map analysis
- **bundlephobia** - Package size analysis

### Monitoring
- **Web Vitals** - Core web vitals tracking
- **Sentry** - Error and performance monitoring
- **New Relic** - Application performance monitoring
- **Google Analytics** - User experience metrics
