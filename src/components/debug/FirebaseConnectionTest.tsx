import React, { useState, useEffect } from 'react';
import { auth, db } from '../services/firebase';
import { connectivityState } from 'firebase/firestore';

export const FirebaseConnectionTest: React.FC = () => {
  const [connectionStatus, setConnectionStatus] = useState<{
    auth: string;
    firestore: string;
    config: any;
  }>({
    auth: 'Testing...',
    firestore: 'Testing...',
    config: null,
  });

  useEffect(() => {
    const testConnection = async () => {
      // Test Auth connection
      try {
        await auth.authStateReady();
        setConnectionStatus(prev => ({ ...prev, auth: '✅ Connected' }));
      } catch (error) {
        console.error('Auth connection error:', error);
        setConnectionStatus(prev => ({ ...prev, auth: `❌ Error: ${error}` }));
      }

      // Test Firestore connection
      try {
        const unsubscribe = connectivityState(db).subscribe((state) => {
          setConnectionStatus(prev => ({ 
            ...prev, 
            firestore: state.connected ? '✅ Connected' : '⚠️ Disconnected', 
          }));
        });
        
        // Cleanup subscription after 5 seconds
        setTimeout(() => unsubscribe(), 5000);
      } catch (error) {
        console.error('Firestore connection error:', error);
        setConnectionStatus(prev => ({ ...prev, firestore: `❌ Error: ${error}` }));
      }

      // Show config (without sensitive data)
      setConnectionStatus(prev => ({
        ...prev,
        config: {
          projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
          authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
          hasApiKey: !!import.meta.env.VITE_FIREBASE_API_KEY,
          hasAppId: !!import.meta.env.VITE_FIREBASE_APP_ID,
        },
      }));
    };

    testConnection();
  }, []);

  return (
    <div className="fixed top-4 right-4 bg-white p-4 rounded-lg shadow-lg border z-50 max-w-xs">
      <h3 className="font-bold text-sm mb-2">Firebase Connection Status</h3>
      <div className="space-y-1 text-xs">
        <div>Auth: {connectionStatus.auth}</div>
        <div>Firestore: {connectionStatus.firestore}</div>
        {connectionStatus.config && (
          <details className="mt-2">
            <summary className="cursor-pointer text-blue-600">Config Info</summary>
            <pre className="text-xs mt-1 bg-gray-100 p-2 rounded">
              {JSON.stringify(connectionStatus.config, null, 2)}
            </pre>
          </details>
        )}
      </div>
    </div>
  );
};
