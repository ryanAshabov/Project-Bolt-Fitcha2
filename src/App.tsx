import React, { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import { OnboardingProvider } from './components/onboarding/OnboardingProvider';
import { ThemeProvider } from './hooks/useTheme.tsx';
import { LoadingSpinner } from './components/ui/Loading';
import { MobileNavbar } from './components/layout/MobileNavbar';
import { useDeviceDetection } from './components/ui/MobileDetection';

// Lazy load components for better performance
const LoginPage = lazy(() => import('./components/auth/LoginPage').then(module => ({ default: module.LoginPage })));
const SignupPage = lazy(() => import('./components/auth/SignupPage').then(module => ({ default: module.SignupPage })));
const ForgotPasswordPage = lazy(() => import('./components/auth/ForgotPasswordPage').then(module => ({ default: module.ForgotPasswordPage })));
const EmailVerificationPage = lazy(() => import('./components/auth/EmailVerificationPage').then(module => ({ default: module.EmailVerificationPage })));
const HomePage = lazy(() => import('./pages/HomePage').then(module => ({ default: module.HomePage })));
const FindPartnersPageEnhanced = lazy(() => import('./pages/FindPartnersPageEnhanced'));
const CourtsPageProfessional = lazy(() => import('./pages/CourtsPageProfessional'));
const MessagesPageEnhanced = lazy(() => import('./pages/MessagesPageEnhanced'));
const ProfilePageEnhanced = lazy(() => import('./pages/ProfilePageEnhanced'));
const AnalyticsPageEnhanced = lazy(() => import('./pages/AnalyticsPageEnhanced'));
const NetworkPageEnhanced = lazy(() => import('./pages/NetworkPageEnhanced'));
const AllPagesDemo = lazy(() => import('./pages/AllPagesDemo'));
const CreateGameWorking = lazy(() => import('./pages/CreateGameWorking'));
const CreateGameTest = lazy(() => import('./pages/CreateGameTest'));
const CreateGamePageV2 = lazy(() => import('./pages/CreateGamePageV2').then(module => ({ default: module.CreateGamePageV2 })));
const CreateGamePageEnhanced = lazy(() => import('./pages/CreateGamePageEnhanced').then(module => ({ default: module.CreateGamePageEnhanced })));
const SmartFeaturesPage = lazy(() => import('./pages/SmartFeaturesPage').then(module => ({ default: module.SmartFeaturesPage })));
const OnboardingPage = lazy(() => import('./pages/OnboardingPage'));
const SearchPage = lazy(() => import('./pages/SearchPage'));
const BookingPage = lazy(() => import('./pages/BookingPage'));

// Loading fallback component
const LoadingFallback = () => {
  const { isMobile } = useDeviceDetection();
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="text-center">
        <LoadingSpinner size="lg" color="primary" />
        <p className="mt-4 text-slate-600">Loading...</p>
      </div>
      {isMobile && <MobileNavbar />}
    </div>
  );
};

function App() {
  const { isAuthenticated } = useAuth();
  const { isMobile } = useDeviceDetection();

  return (
    <Router>
      <ThemeProvider>
      <OnboardingProvider>
      <div className="App">
        <Suspense fallback={<LoadingFallback />}>
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
              element={isAuthenticated ? <FindPartnersPageEnhanced /> : <Navigate to="/login" />} 
            />
            <Route 
              path="/courts" 
              element={isAuthenticated ? <CourtsPageProfessional /> : <Navigate to="/login" />} 
            />
            <Route 
              path="/messages" 
              element={isAuthenticated ? <MessagesPageEnhanced /> : <Navigate to="/login" />} 
            />
            <Route 
              path="/profile" 
              element={isAuthenticated ? <ProfilePageEnhanced /> : <Navigate to="/login" />} 
            />
            <Route 
              path="/create-game" 
              element={isAuthenticated ? <CreateGameWorking /> : <Navigate to="/login" />} 
            />
            <Route 
              path="/create-game-demo" 
              element={<CreateGameWorking />} 
            />
            <Route 
              path="/test" 
              element={<CreateGameTest />} 
            />
            <Route 
              path="/create-game-v2" 
              element={isAuthenticated ? <CreateGamePageV2 /> : <Navigate to="/login" />} 
            />
            <Route 
              path="/create-game-old" 
              element={isAuthenticated ? <CreateGamePageEnhanced /> : <Navigate to="/login" />} 
            />
            <Route 
              path="/analytics" 
              element={isAuthenticated ? <AnalyticsPageEnhanced /> : <Navigate to="/login" />} 
            />
            <Route 
              path="/network" 
              element={isAuthenticated ? <NetworkPageEnhanced /> : <Navigate to="/login" />} 
            />
            <Route 
              path="/smart-features" 
              element={isAuthenticated ? <SmartFeaturesPage /> : <Navigate to="/login" />} 
            />
            <Route 
              path="/booking" 
              element={isAuthenticated ? <BookingPage /> : <Navigate to="/login" />} 
            />
            <Route 
              path="/onboarding" 
              element={isAuthenticated ? <OnboardingPage /> : <Navigate to="/login" />} 
            />
            <Route 
              path="/search" 
              element={isAuthenticated ? <SearchPage /> : <Navigate to="/login" />} 
            />
            <Route 
              path="/demo" 
              element={<AllPagesDemo />} 
            />
            <Route 
              path="/all-pages" 
              element={<AllPagesDemo />} 
            />
          </Routes>
        </Suspense>
        {isMobile && isAuthenticated && <MobileNavbar />}
      </div>
      </OnboardingProvider>
      </ThemeProvider>
    </Router>
  );
}

export default App;