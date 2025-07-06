import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';

export const useOnboarding = () => {
  const { user, isAuthenticated } = useAuth();
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(true);
  const [hasSeenWelcomeTour, setHasSeenWelcomeTour] = useState(true);
  const [hasCompletedProfileSetup, setHasCompletedProfileSetup] = useState(true);
  const [hasSeenFeatureTour, setHasSeenFeatureTour] = useState(true);

  // Check onboarding status when user is authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      // Check if user has completed onboarding
      const onboardingCompleted = localStorage.getItem(`onboarding_completed_${user.id}`);
      if (!onboardingCompleted) {
        setHasCompletedOnboarding(false);
      }

      // Check if user has seen welcome tour
      const welcomeTourSeen = localStorage.getItem(`welcome_tour_seen_${user.id}`);
      if (!welcomeTourSeen) {
        setHasSeenWelcomeTour(false);
      }

      // Check if user has completed profile setup
      const profileSetupCompleted = localStorage.getItem(`profile_setup_completed_${user.id}`);
      if (!profileSetupCompleted) {
        setHasCompletedProfileSetup(false);
      }

      // Check if user has seen feature tour
      const featureTourSeen = localStorage.getItem(`feature_tour_seen_${user.id}`);
      if (!featureTourSeen) {
        setHasSeenFeatureTour(false);
      }
    }
  }, [isAuthenticated, user]);

  // Mark onboarding as completed
  const completeOnboarding = () => {
    if (user) {
      localStorage.setItem(`onboarding_completed_${user.id}`, 'true');
      setHasCompletedOnboarding(true);
    }
  };

  // Mark welcome tour as seen
  const completeWelcomeTour = () => {
    if (user) {
      localStorage.setItem(`welcome_tour_seen_${user.id}`, 'true');
      setHasSeenWelcomeTour(true);
    }
  };

  // Mark profile setup as completed
  const completeProfileSetup = () => {
    if (user) {
      localStorage.setItem(`profile_setup_completed_${user.id}`, 'true');
      setHasCompletedProfileSetup(true);
    }
  };

  // Mark feature tour as seen
  const completeFeatureTour = () => {
    if (user) {
      localStorage.setItem(`feature_tour_seen_${user.id}`, 'true');
      setHasSeenFeatureTour(true);
    }
  };

  // Reset onboarding status (for testing)
  const resetOnboarding = () => {
    if (user) {
      localStorage.removeItem(`onboarding_completed_${user.id}`);
      localStorage.removeItem(`welcome_tour_seen_${user.id}`);
      localStorage.removeItem(`profile_setup_completed_${user.id}`);
      localStorage.removeItem(`feature_tour_seen_${user.id}`);
      setHasCompletedOnboarding(false);
      setHasSeenWelcomeTour(false);
      setHasCompletedProfileSetup(false);
      setHasSeenFeatureTour(false);
    }
  };

  return {
    hasCompletedOnboarding,
    hasSeenWelcomeTour,
    hasCompletedProfileSetup,
    hasSeenFeatureTour,
    completeOnboarding,
    completeWelcomeTour,
    completeProfileSetup,
    completeFeatureTour,
    resetOnboarding,
  };
};