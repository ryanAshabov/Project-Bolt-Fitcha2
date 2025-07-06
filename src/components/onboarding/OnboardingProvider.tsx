import React, { createContext, useState, useContext, useEffect } from 'react';
import { OnboardingFlow } from './OnboardingFlow';
import { WelcomeTutorial } from './WelcomeTutorial';
import { FeatureHighlight } from './FeatureHighlight';
import { useAuth } from '../../hooks/useAuth';

interface OnboardingContextType {
  hasCompletedOnboarding: boolean;
  startOnboarding: () => void;
  completeOnboarding: () => void;
  skipOnboarding: () => void;
  showFeatureHighlight: (props: FeatureHighlightProps) => void;
  hideFeatureHighlight: () => void;
}

interface FeatureHighlightProps {
  targetSelector: string;
  title: string;
  description: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
  onNext?: () => void;
  showNext?: boolean;
}

const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined);

export const useOnboarding = () => {
  const context = useContext(OnboardingContext);
  if (!context) {
    throw new Error('useOnboarding must be used within an OnboardingProvider');
  }
  return context;
};

export const OnboardingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showWelcomeTutorial, setShowWelcomeTutorial] = useState(false);
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(true);
  const [highlightProps, setHighlightProps] = useState<FeatureHighlightProps | null>(null);

  // Check if user has completed onboarding
  useEffect(() => {
    if (isAuthenticated && user) {
      const onboardingCompleted = localStorage.getItem(`onboarding_completed_${user.id}`);
      if (!onboardingCompleted) {
        setHasCompletedOnboarding(false);
        setShowWelcomeTutorial(true);
      }
    }
  }, [isAuthenticated, user]);

  // Start onboarding
  const startOnboarding = () => {
    setShowWelcomeTutorial(false);
    setShowOnboarding(true);
  };

  // Complete onboarding
  const completeOnboarding = () => {
    if (user) {
      localStorage.setItem(`onboarding_completed_${user.id}`, 'true');
    }
    setHasCompletedOnboarding(true);
    setShowOnboarding(false);
    setShowWelcomeTutorial(false);
  };

  // Skip onboarding
  const skipOnboarding = () => {
    if (user) {
      localStorage.setItem(`onboarding_completed_${user.id}`, 'true');
    }
    setHasCompletedOnboarding(true);
    setShowOnboarding(false);
    setShowWelcomeTutorial(false);
  };

  // Show feature highlight
  const showFeatureHighlight = (props: FeatureHighlightProps) => {
    setHighlightProps(props);
  };

  // Hide feature highlight
  const hideFeatureHighlight = () => {
    setHighlightProps(null);
  };

  return (
    <OnboardingContext.Provider
      value={{
        hasCompletedOnboarding,
        startOnboarding,
        completeOnboarding,
        skipOnboarding,
        showFeatureHighlight,
        hideFeatureHighlight,
      }}
    >
      {children}
      
      {showWelcomeTutorial && (
        <WelcomeTutorial
          onComplete={startOnboarding}
          onSkip={skipOnboarding}
        />
      )}
      
      {showOnboarding && (
        <OnboardingFlow
          onComplete={completeOnboarding}
          onSkip={skipOnboarding}
        />
      )}
      
      {highlightProps && (
        <FeatureHighlight
          {...highlightProps}
          onClose={hideFeatureHighlight}
        />
      )}
    </OnboardingContext.Provider>
  );
};