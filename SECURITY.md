# 🔒 Security Guidelines - Fitcha Platform

## Authentication & Authorization

### Firebase Security Rules
```javascript
// Firestore Security Rules
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only access their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Posts are readable by all authenticated users
    match /posts/{postId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.uid == resource.data.authorId;
    }
    
    // Courts are readable by all authenticated users
    match /courts/{courtId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && 
        exists(/databases/$(database)/documents/users/$(request.auth.uid)) &&
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    
    // Bookings can only be accessed by the booking owner
    match /bookings/{bookingId} {
      allow read, write: if request.auth != null && 
        request.auth.uid == resource.data.userId;
    }
    
    // Messages in conversations
    match /conversations/{conversationId}/messages/{messageId} {
      allow read, write: if request.auth != null && 
        request.auth.uid in resource.data.participants;
    }
  }
}
```

### Input Validation

#### Client-Side Validation
```typescript
// Form validation schemas
export const userRegistrationSchema = {
  email: {
    required: true,
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    maxLength: 254
  },
  password: {
    required: true,
    minLength: 8,
    pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/
  },
  username: {
    required: true,
    minLength: 3,
    maxLength: 30,
    pattern: /^[a-zA-Z0-9_]+$/
  }
};

// Sanitization functions
export const sanitizeInput = (input: string): string => {
  return input
    .trim()
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/[<>]/g, '');
};
```

#### Server-Side Validation
```typescript
// Firebase Functions validation
import { body, validationResult } from 'express-validator';

export const validateUserInput = [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 8 }).matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/),
  body('username').isLength({ min: 3, max: 30 }).isAlphanumeric(),
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];
```

## Data Protection

### Sensitive Data Handling
```typescript
// Environment variables for sensitive data
const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID
};

// Never expose sensitive data in client code
const API_ENDPOINTS = {
  public: '/api/public',
  protected: '/api/protected' // Requires authentication
};
```

### Data Encryption
```typescript
// Encrypt sensitive data before storage
import CryptoJS from 'crypto-js';

export const encryptData = (data: string, secretKey: string): string => {
  return CryptoJS.AES.encrypt(data, secretKey).toString();
};

export const decryptData = (encryptedData: string, secretKey: string): string => {
  const bytes = CryptoJS.AES.decrypt(encryptedData, secretKey);
  return bytes.toString(CryptoJS.enc.Utf8);
};
```

## XSS Prevention

### Content Security Policy
```html
<!-- Add to index.html -->
<meta http-equiv="Content-Security-Policy" 
      content="default-src 'self'; 
               script-src 'self' 'unsafe-inline' https://apis.google.com; 
               style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
               font-src 'self' https://fonts.gstatic.com;
               img-src 'self' data: https:;
               connect-src 'self' https://api.fitcha.app;">
```

### Safe Rendering
```typescript
// Use React's built-in XSS protection
const SafeUserContent: React.FC<{ content: string }> = ({ content }) => {
  // React automatically escapes content in JSX
  return <div>{content}</div>;
};

// For HTML content, use DOMPurify
import DOMPurify from 'dompurify';

const SafeHTMLContent: React.FC<{ htmlContent: string }> = ({ htmlContent }) => {
  const cleanHTML = DOMPurify.sanitize(htmlContent);
  return <div dangerouslySetInnerHTML={{ __html: cleanHTML }} />;
};
```

## CSRF Protection

### Token-Based Protection
```typescript
// Generate CSRF token
export const generateCSRFToken = (): string => {
  return crypto.randomBytes(32).toString('hex');
};

// Validate CSRF token
export const validateCSRFToken = (token: string, sessionToken: string): boolean => {
  return token === sessionToken;
};

// Include in forms
const FormWithCSRF: React.FC = () => {
  const [csrfToken] = useState(() => generateCSRFToken());
  
  return (
    <form>
      <input type="hidden" name="_csrf" value={csrfToken} />
      {/* Other form fields */}
    </form>
  );
};
```

## File Upload Security

### Safe File Handling
```typescript
// Validate file types
const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export const validateFile = (file: File): boolean => {
  if (!ALLOWED_FILE_TYPES.includes(file.type)) {
    throw new Error('Invalid file type');
  }
  
  if (file.size > MAX_FILE_SIZE) {
    throw new Error('File too large');
  }
  
  return true;
};

// Secure file upload
export const uploadFile = async (file: File, path: string): Promise<string> => {
  validateFile(file);
  
  // Generate unique filename
  const filename = `${Date.now()}-${crypto.randomUUID()}.${file.name.split('.').pop()}`;
  
  // Upload to Firebase Storage with security rules
  const storageRef = ref(storage, `${path}/${filename}`);
  const snapshot = await uploadBytes(storageRef, file);
  
  return await getDownloadURL(snapshot.ref);
};
```

## API Security

### Rate Limiting
```typescript
// Implement rate limiting for API calls
const rateLimiter = {
  requests: new Map<string, number[]>(),
  
  isAllowed(userId: string, maxRequests: number, windowMs: number): boolean {
    const now = Date.now();
    const userRequests = this.requests.get(userId) || [];
    
    // Remove old requests outside the window
    const validRequests = userRequests.filter(time => now - time < windowMs);
    
    if (validRequests.length >= maxRequests) {
      return false;
    }
    
    validRequests.push(now);
    this.requests.set(userId, validRequests);
    return true;
  }
};
```

### Secure API Calls
```typescript
// Secure HTTP client configuration
export const secureApiClient = axios.create({
  baseURL: process.env.VITE_API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest'
  }
});

// Add auth token to requests
secureApiClient.interceptors.request.use((config) => {
  const token = getAuthToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle auth errors
secureApiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Redirect to login
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
```

## Privacy & Compliance

### GDPR Compliance
```typescript
// Data processing consent
export const requestConsent = (): Promise<boolean> => {
  return new Promise((resolve) => {
    // Show consent modal
    const consent = window.confirm(
      'We need your consent to process your data according to GDPR regulations. Do you agree?'
    );
    resolve(consent);
  });
};

// Data deletion
export const deleteUserData = async (userId: string): Promise<void> => {
  const batch = writeBatch(db);
  
  // Delete user document
  batch.delete(doc(db, 'users', userId));
  
  // Delete user's posts
  const postsQuery = query(collection(db, 'posts'), where('authorId', '==', userId));
  const postsSnapshot = await getDocs(postsQuery);
  postsSnapshot.docs.forEach((doc) => batch.delete(doc.ref));
  
  await batch.commit();
};
```

## Security Monitoring

### Error Logging
```typescript
// Secure error logging (don't expose sensitive data)
export const logSecurityEvent = (event: string, details: any): void => {
  const sanitizedDetails = {
    ...details,
    // Remove sensitive fields
    password: undefined,
    token: undefined,
    apiKey: undefined
  };
  
  console.warn(`Security Event: ${event}`, sanitizedDetails);
  
  // Send to monitoring service
  if (process.env.NODE_ENV === 'production') {
    // Send to external monitoring service
  }
};
```

### Security Headers
```typescript
// Add security headers in server configuration
export const securityHeaders = {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
  'Referrer-Policy': 'strict-origin-when-cross-origin'
};
```

## Security Checklist

### Development
- [ ] Environment variables for secrets
- [ ] Input validation on all forms
- [ ] Output encoding/escaping
- [ ] Secure API endpoints
- [ ] Authentication on protected routes

### Testing
- [ ] Penetration testing
- [ ] Vulnerability scanning
- [ ] Security audit
- [ ] Code review for security issues

### Production
- [ ] HTTPS enforcement
- [ ] Security headers configured
- [ ] Regular security updates
- [ ] Monitoring and alerting
- [ ] Incident response plan

## Incident Response

### Security Breach Protocol
1. **Immediate Response**
   - Isolate affected systems
   - Assess scope of breach
   - Notify security team

2. **Investigation**
   - Collect evidence
   - Identify root cause
   - Document timeline

3. **Recovery**
   - Patch vulnerabilities
   - Restore from backups
   - Update security measures

4. **Communication**
   - Notify affected users
   - Report to authorities if required
   - Provide status updates
