import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import { LoginPage } from './components/auth/LoginPage';
import { SignupPage } from './components/auth/SignupPage';
import { ForgotPasswordPage } from './components/auth/ForgotPasswordPage';
import { EmailVerificationPage } from './components/auth/EmailVerificationPage';
import { HomePage } from './pages/HomePage';
import FindPartnersPageEnhanced from './pages/FindPartnersPageEnhanced';
import CourtsPageProfessional from './pages/CourtsPageProfessional';
import MessagesPageEnhanced from './pages/MessagesPageEnhanced';
import ProfilePageEnhanced from './pages/ProfilePageEnhanced';
import AnalyticsPageEnhanced from './pages/AnalyticsPageEnhanced';
import NetworkPageEnhanced from './pages/NetworkPageEnhanced';
import AllPagesDemo from './pages/AllPagesDemo';
import CreateGameWorking from './pages/CreateGameWorking';
import CreateGameTest from './pages/CreateGameTest';
import { CreateGamePageV2 } from './pages/CreateGamePageV2';
import { CreateGamePageEnhanced } from './pages/CreateGamePageEnhanced';
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
            path="/demo" 
            element={<AllPagesDemo />} 
          />
          <Route 
            path="/all-pages" 
            element={<AllPagesDemo />} 
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
