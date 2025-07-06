import React, { useState } from 'react';
import { Calendar, Clock, MapPin, Users, DollarSign, CheckCircle, Loader, ArrowRight } from 'lucide-react';
import { Button } from '../ui/Button';
import { OptimizedImage } from '../ui/Image';
import { Court } from '../../types';

interface QuickBookingFlowProps {
  court: Court;
  onBookingComplete?: (bookingData: any) => void;
}

export const QuickBookingFlow: React.FC<QuickBookingFlowProps> = ({
  court,
  onBookingComplete,
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [duration, setDuration] = useState(1);
  const [players, setPlayers] = useState(2);
  const [isLoading, setIsLoading] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  // Generate next 7 days
  const getDates = () => {
    const dates = [];
    const today = new Date();
    
    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      dates.push(date);
    }
    
    return dates;
  };

  // Generate time slots based on operating hours
  const getTimeSlots = () => {
    const dayOfWeek = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'][selectedDate.getDay()];
    const hours = court.operatingHours[dayOfWeek];
    
    if (!hours || hours.closed) {
      return [];
    }
    
    const openHour = parseInt(hours.open.split(':')[0]);
    const closeHour = parseInt(hours.close.split(':')[0]);
    
    const slots = [];
    for (let hour = openHour; hour < closeHour; hour++) {
      // Simulate some slots being unavailable
      const isAvailable = Math.random() > 0.3;
      
      slots.push({
        time: `${hour.toString().padStart(2, '0')}:00`,
        available: isAvailable,
      });
    }
    
    return slots;
  };

  // Format date for display
  const formatDate = (date: Date): string => {
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
  };

  // Handle booking completion
  const handleComplete = async () => {
    if (!selectedTime) return;
    
    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const bookingData = {
        courtId: court.id,
        date: selectedDate,
        time: selectedTime,
        duration,
        players,
        totalPrice: court.price * duration,
        bookingId: `BK-${Math.floor(Math.random() * 10000)}`,
      };
      
      setIsComplete(true);
      
      if (onBookingComplete) {
        onBookingComplete(bookingData);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Render step 1: Date selection
  const renderDateStep = () => (
    <div>
      <h3 className="font-semibold text-gray-900 mb-3">Select Date</h3>
      
      <div className="flex space-x-2 overflow-x-auto pb-2">
        {getDates().map((date, index) => (
          <button
            key={index}
            onClick={() => setSelectedDate(date)}
            className={`flex-shrink-0 px-3 py-2 rounded-lg text-center transition-colors ${
              selectedDate.toDateString() === date.toDateString()
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
            }`}
          >
            <div className="text-xs">{date.toLocaleDateString('en-US', { weekday: 'short' })}</div>
            <div className="text-lg font-bold my-1">{date.getDate()}</div>
            <div className="text-xs">{index === 0 ? 'Today' : date.toLocaleDateString('en-US', { month: 'short' })}</div>
          </button>
        ))}
      </div>
      
      <div className="mt-4">
        <Button 
          onClick={() => setCurrentStep(2)}
          className="w-full"
        >
          Continue
          <ArrowRight className="h-4 w-4 ml-2" />
        </Button>
      </div>
    </div>
  );

  // Render step 2: Time selection
  const renderTimeStep = () => (
    <div>
      <h3 className="font-semibold text-gray-900 mb-3">Select Time</h3>
      
      <div className="grid grid-cols-3 gap-2">
        {getTimeSlots().map((slot, index) => (
          <button
            key={index}
            disabled={!slot.available}
            onClick={() => setSelectedTime(slot.time)}
            className={`p-2 rounded-lg text-center transition-colors ${
              !slot.available
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : selectedTime === slot.time
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
            }`}
          >
            {slot.time}
          </button>
        ))}
      </div>
      
      {selectedTime && (
        <div className="mt-4 space-y-4">
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-2">Duration</h4>
            <div className="flex space-x-2">
              {[1, 2, 3].map(hours => (
                <button
                  key={hours}
                  onClick={() => setDuration(hours)}
                  className={`px-3 py-1.5 rounded-lg transition-colors ${
                    duration === hours
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
                  }`}
                >
                  {hours} {hours === 1 ? 'hour' : 'hours'}
                </button>
              ))}
            </div>
          </div>
          
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-2">Players</h4>
            <div className="flex space-x-2">
              {[2, 4, 6, 8].map(count => (
                <button
                  key={count}
                  onClick={() => setPlayers(count)}
                  className={`px-3 py-1.5 rounded-lg transition-colors ${
                    players === count
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
                  }`}
                >
                  {count}
                </button>
              ))}
            </div>
          </div>
          
          <Button 
            onClick={handleComplete}
            disabled={isLoading}
            className="w-full bg-green-600 hover:bg-green-700"
          >
            {isLoading ? (
              <>
                <Loader className="h-4 w-4 mr-2 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <CheckCircle className="h-4 w-4 mr-2" />
                Book Now
              </>
            )}
          </Button>
        </div>
      )}
    </div>
  );

  // Render booking confirmation
  const renderConfirmation = () => (
    <div className="text-center">
      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <CheckCircle className="h-8 w-8 text-green-600" />
      </div>
      <h3 className="text-xl font-bold text-gray-900 mb-2">Booking Confirmed!</h3>
      <p className="text-gray-600 mb-4">
        Your court has been successfully booked.
      </p>
      
      <div className="bg-gray-50 rounded-lg p-4 mb-4 text-left">
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-gray-600">Date:</span>
            <span className="font-medium">{formatDate(selectedDate)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Time:</span>
            <span className="font-medium">{selectedTime}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Duration:</span>
            <span className="font-medium">{duration} hour(s)</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Total:</span>
            <span className="font-medium">${(court.price * duration).toFixed(2)}</span>
          </div>
        </div>
      </div>
      
      <Button 
        onClick={() => {
          setIsComplete(false);
          setCurrentStep(1);
          setSelectedTime(null);
        }}
        className="w-full"
      >
        Book Another Time
      </Button>
    </div>
  );

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
        <div className="flex items-center space-x-3">
          <OptimizedImage
            src={court.image}
            alt={court.name}
            width={48}
            height={48}
            className="rounded-lg"
            objectFit="cover"
          />
          <div>
            <h3 className="font-semibold text-gray-900">{court.name}</h3>
            <div className="flex items-center text-sm text-gray-600">
              <MapPin className="h-3 w-3 mr-1" />
              <span>{court.location}</span>
              <span className="mx-1">•</span>
              <span>${court.price}/hr</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Content */}
      <div className="p-4">
        {isComplete ? (
          renderConfirmation()
        ) : (
          currentStep === 1 ? renderDateStep() : renderTimeStep()
        )}
      </div>
    </div>
  );
};