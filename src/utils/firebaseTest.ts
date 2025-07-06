/**
 * Firebase Connection Test
 * 
 * A simple test to verify Firebase configuration and connectivity
 */

import { auth, db } from '../services/firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { createUserWithEmailAndPassword, deleteUser } from 'firebase/auth';

/**
 * Test Firebase Authentication and Firestore connectivity
 */
export const testFirebaseConnection = async (): Promise<void> => {
  console.log('🔥 Starting Firebase connection test...');
  
  try {
    // Test 1: Check Firebase Auth is initialized
    console.log('📝 Test 1: Firebase Auth initialization');
    console.log('Auth instance:', auth);
    console.log('Auth current user:', auth.currentUser);
    console.log('✅ Firebase Auth is initialized');
    
    // Test 2: Check Firestore is initialized
    console.log('📝 Test 2: Firestore initialization');
    console.log('Firestore instance:', db);
    console.log('✅ Firestore is initialized');
    
    // Test 3: Test Firestore write/read (without authentication)
    console.log('📝 Test 3: Firestore connectivity test');
    const testDocRef = doc(db, 'test', 'connection-test');
    
    try {
      await setDoc(testDocRef, {
        timestamp: new Date(),
        test: 'Firebase connection test',
        success: true,
      });
      console.log('✅ Firestore write test successful');
      
      const testDoc = await getDoc(testDocRef);
      if (testDoc.exists()) {
        console.log('✅ Firestore read test successful');
        console.log('Test document data:', testDoc.data());
      } else {
        console.log('❌ Firestore read test failed - document not found');
      }
    } catch (firestoreError) {
      console.log('❌ Firestore connectivity test failed:', firestoreError);
    }
    
    // Test 4: Test user creation (temporary user)
    console.log('📝 Test 4: Firebase Auth user creation test');
    const testEmail = `test-${Date.now()}@example.com`;
    const testPassword = 'TestPassword123';
    
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, testEmail, testPassword);
      console.log('✅ Test user created successfully');
      console.log('Test user UID:', userCredential.user.uid);
      
      // Test 5: Test user profile creation in Firestore
      console.log('📝 Test 5: User profile creation test');
      const userDocRef = doc(db, 'users', userCredential.user.uid);
      
      try {
        await setDoc(userDocRef, {
          firstName: 'Test',
          lastName: 'User',
          email: testEmail,
          createdAt: new Date(),
          testProfile: true,
        });
        console.log('✅ User profile creation test successful');
        
        // Clean up: Delete test user and document
        await deleteUser(userCredential.user);
        console.log('✅ Test user cleaned up');
        
      } catch (profileError) {
        console.log('❌ User profile creation test failed:', profileError);
        // Still clean up the auth user
        try {
          await deleteUser(userCredential.user);
        } catch (cleanupError) {
          console.log('❌ Failed to clean up test user:', cleanupError);
        }
      }
      
    } catch (authError) {
      console.log('❌ Firebase Auth user creation test failed:', authError);
    }
    
    console.log('🎉 Firebase connection test completed');
    
  } catch (error) {
    console.error('❌ Firebase connection test failed:', error);
    throw error;
  }
};

/**
 * Test specific user profile creation
 */
export const testUserProfileCreation = async (userId: string, userData: Record<string, unknown>): Promise<void> => {
  console.log('🔥 Testing user profile creation for user:', userId);
  
  try {
    const userDocRef = doc(db, 'users', userId);
    
    // Test write
    await setDoc(userDocRef, {
      ...userData,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    
    console.log('✅ User profile write successful');
    
    // Test read
    const userDoc = await getDoc(userDocRef);
    if (userDoc.exists()) {
      console.log('✅ User profile read successful');
      console.log('User data:', userDoc.data());
    } else {
      console.log('❌ User profile read failed - document not found');
    }
    
  } catch (error) {
    console.error('❌ User profile creation test failed:', error);
    throw error;
  }
};
