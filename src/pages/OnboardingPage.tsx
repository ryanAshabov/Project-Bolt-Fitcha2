import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  User, 
  MapPin, 
  Search, 
  Calendar, 
  CheckCircle, 
  ArrowRight, 
  X, 
  Star, 
  Zap, 
  MessageCircle, 
  Users,
  Activity
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { OptimizedImage } from '../components/ui/Image';
import { useAuth } from '../hooks/useAuth';
import { ProfileSetupGuide } from '../components/onboarding/ProfileSetupGuide';
import { OnboardingFlow } from '../components/onboarding/OnboardingFlow';
import { WelcomeTutorial } from '../components/onboarding/WelcomeTutorial';
import { useOnboarding } from '../hooks/useOnboarding';

const OnboardingPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { 
    hasCompletedOnboarding,
    hasSeenWelcomeTour,
    hasCompletedProfileSetup,
    completeOnboarding,
    completeWelcomeTour,
    completeProfileSetup,
    resetOnboarding
  } = useOnboarding();
  
  const [currentView, setCurrentView] = useState<'welcome' | 'profile' | 'tour' | 'complete'>(
    !hasSeenWelcomeTour ? 'welcome' : 
    !hasCompletedProfileSetup ? 'profile' : 
    !hasCompletedOnboarding ? 'tour' : 
    'complete'
  );

  // Handle welcome tour completion
  const handleWelcomeTourComplete = () => {
    completeWelcomeTour();
    setCurrentView('profile');
  };

  // Handle profile setup completion
  const handleProfileSetupComplete = () => {
    completeProfileSetup();
    setCurrentView('tour');
  };

  // Handle onboarding tour completion
  const handleOnboardingComplete = () => {
    completeOnboarding();
    setCurrentView('complete');
    navigate('/');
  };

  // Handle skip
  const handleSkip = () => {
    completeWelcomeTour();
    completeProfileSetup();
    completeOnboarding();
    navigate('/');
  };

  // Render welcome tutorial
  if (currentView === 'welcome') {
    return (
      <WelcomeTutorial
        onComplete={handleWelcomeTourComplete}
        onSkip={handleSkip}
      />
    );
  }

  // Render profile setup
  if (currentView === 'profile') {
    return (
      <ProfileSetupGuide
        onComplete={handleProfileSetupComplete}
        onSkip={handleSkip}
      />
    );
  }

  // Render onboarding tour
  if (currentView === 'tour') {
    return (
      <OnboardingFlow
        onComplete={handleOnboardingComplete}
        onSkip={handleSkip}
      />
    );
  }

  // Render completion page
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-emerald-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-xl p-8 text-center">
        <div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="h-10 w-10 text-white" />
        </div>
        
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          You're All Set!
        </h1>
        
        <p className="text-gray-600 mb-6">
          Your profile is complete and you're ready to start using Fitcha. Enjoy finding courts, connecting with players, and organizing games!
        </p>
        
        <Button 
          onClick={() => navigate('/')}
          className="w-full bg-blue-600 hover:bg-blue-700"
        >
          Start Exploring
        </Button>
        
        {/* For testing purposes */}
        {process.env.NODE_ENV === 'development' && (
          <button 
            onClick={resetOnboarding}
            className="mt-4 text-sm text-gray-400 hover:text-gray-600"
          >
            Reset Onboarding (Dev Only)
          </button>
        )}
      </div>
    </div>
  );
};

export default OnboardingPage;