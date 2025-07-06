import React from 'react';
import { Header } from '../components/layout/Header';
import { EnhancedBookingSystem } from '../components/booking/EnhancedBookingSystem';
import { MobileContainer } from '../components/ui/MobileContainer';
import { useDeviceDetection } from '../components/ui/MobileDetection';

export const BookingPage: React.FC = () => {
  const { isMobile } = useDeviceDetection();
  
  if (isMobile) {
    return (
      <MobileContainer title="Book a Court" showBack>
        <div className="p-4">
          <EnhancedBookingSystem />
        </div>
      </MobileContainer>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Book a Court</h1>
          <p className="text-gray-600">Find and reserve the perfect venue for your next game</p>
        </div>
        
        <EnhancedBookingSystem />
      </div>
    </div>
  );
};

export default BookingPage;