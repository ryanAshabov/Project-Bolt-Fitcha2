import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import { LoginPage } from './components/auth/LoginPage';
import { SignupPage } from './components/auth/SignupPage';
import { ForgotPasswordPage } from './components/auth/ForgotPasswordPage';
import { EmailVerificationPage } from './components/auth/EmailVerificationPage';
import { HomePage } from './pages/HomePage';
import { FindPartnersPage } from './pages/FindPartnersPage';
import { CourtsPage } from './pages/CourtsPage';
import { MessagesPage } from './pages/MessagesPage';
import { ProfilePage } from './pages/ProfilePage';
import { CreateGamePage } from './pages/CreateGamePage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { SmartFeaturesPage } from './pages/SmartFeaturesPage';

function App() {
  const { isAuthenticated } = useAuth();

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route 
            path="/login" 
            element={!isAuthenticated ? <LoginPage /> : <Navigate to="/" />} 
          />
          <Route 
            path="/signup" 
            element={!isAuthenticated ? <SignupPage /> : <Navigate to="/" />} 
          />
          <Route 
            path="/forgot-password" 
            element={!isAuthenticated ? <ForgotPasswordPage /> : <Navigate to="/" />} 
          />
          <Route 
            path="/verify-email" 
            element={!isAuthenticated ? <EmailVerificationPage /> : <Navigate to="/" />} 
          />
          <Route 
            path="/" 
            element={isAuthenticated ? <HomePage /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/find-partners" 
            element={isAuthenticated ? <FindPartnersPage /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/courts" 
            element={isAuthenticated ? <CourtsPage /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/messages" 
            element={isAuthenticated ? <MessagesPage /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/profile" 
            element={isAuthenticated ? <ProfilePage /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/create-game" 
            element={isAuthenticated ? <CreateGamePage /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/analytics" 
            element={isAuthenticated ? <AnalyticsPage /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/smart-features" 
            element={isAuthenticated ? <SmartFeaturesPage /> : <Navigate to="/login" />} 
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
