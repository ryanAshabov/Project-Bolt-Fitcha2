import React from 'react';
import { Header } from '../components/layout/Header';
import { PersonalAnalytics } from '../components/analytics/PersonalAnalytics';

export const AnalyticsPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <PersonalAnalytics />
      </div>
    </div>
  );
};