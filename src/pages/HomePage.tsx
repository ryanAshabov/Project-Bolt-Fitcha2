import React from 'react';
import { Header } from '../components/layout/Header';
import { Sidebar } from '../components/layout/Sidebar';
import { Feed } from '../components/feed/Feed';
import { RightSidebar } from '../components/layout/RightSidebar';
import { useOnboarding } from '../hooks/useOnboarding';
import { MobileContainer } from '../components/ui/MobileContainer';
import { useDeviceDetection } from '../components/ui/MobileDetection';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../hooks/useTheme';

export const HomePage: React.FC = () => {
  const { isMobile } = useDeviceDetection();
  const { isDark } = useTheme();
  const { hasCompletedOnboarding } = useOnboarding();
  const navigate = useNavigate();

  // Check if user has completed onboarding
  useEffect(() => {
    if (!hasCompletedOnboarding) {
      navigate('/onboarding');
    }
  }, [hasCompletedOnboarding, navigate]);

  if (isMobile) {
    return (
      <MobileContainer title="Home">
        <div className="p-4">
          <Feed />
        </div>
      </MobileContainer>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-6">
          <div className="hidden lg:block">
            <Sidebar />
          </div>
          <Feed />
          <div className="hidden xl:block">
            <RightSidebar />
          </div>
        </div>
      </div>
    </div>
  );
};