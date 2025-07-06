import React, { useState, useEffect } from 'react';
import { Clock, Users, AlertCircle, CheckCircle, Loader, RefreshCw } from 'lucide-react';
import { Button } from '../ui/Button';
import { Court } from '../../types';

interface TimeSlot {
  time: string;
  available: boolean;
  bookedBy?: string[];
  updatedAt?: Date;
}

interface RealTimeAvailabilityProps {
  court: Court;
  date: Date;
  onSlotSelect?: (time: string) => void;
  selectedSlot?: string;
}

export const RealTimeAvailability: React.FC<RealTimeAvailabilityProps> = ({
  court,
  date,
  onSlotSelect,
  selectedSlot,
}) => {
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [recentChanges, setRecentChanges] = useState<{time: string, status: 'booked' | 'available'}[]>([]);

  // Generate time slots based on operating hours
  useEffect(() => {
    const fetchAvailability = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Get day of week
        const dayOfWeek = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'][date.getDay()];
        
        // Get operating hours for the day
        const hours = court.operatingHours[dayOfWeek];
        
        if (!hours || hours.closed) {
          setError('This court is closed on this day.');
          setIsLoading(false);
          return;
        }
        
        // Parse operating hours
        const openHour = parseInt(hours.open.split(':')[0]);
        const closeHour = parseInt(hours.close.split(':')[0]);
        
        // Generate time slots
        const slots: TimeSlot[] = [];
        for (let hour = openHour; hour < closeHour; hour++) {
          // Simulate some slots being unavailable
          const isAvailable = Math.random() > 0.3;
          
          slots.push({
            time: `${hour.toString().padStart(2, '0')}:00`,
            available: isAvailable,
            bookedBy: isAvailable ? [] : ['user-1', 'user-2'],
            updatedAt: new Date(),
          });
        }
        
        setTimeSlots(slots);
        setLastUpdated(new Date());
      } catch (error) {
        setError('Failed to load availability. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchAvailability();
    
    // Set up real-time updates simulation
    const interval = setInterval(() => {
      // Simulate real-time updates by randomly changing availability
      setTimeSlots(prev => {
        const newSlots = [...prev];
        const randomIndex = Math.floor(Math.random() * newSlots.length);
        const oldStatus = newSlots[randomIndex].available;
        newSlots[randomIndex].available = !oldStatus;
        newSlots[randomIndex].updatedAt = new Date();
        
        // Add to recent changes
        setRecentChanges(prev => [
          { 
            time: newSlots[randomIndex].time, 
            status: newSlots[randomIndex].available ? 'available' : 'booked' 
          },
          ...prev.slice(0, 4)
        ]);
        
        return newSlots;
      });
      
      setLastUpdated(new Date());
    }, 15000); // Update every 15 seconds
    
    return () => clearInterval(interval);
  }, [court, date]);

  // Manual refresh function
  const handleRefresh = async () => {
    setIsRefreshing(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Simulate changes
      setTimeSlots(prev => {
        const newSlots = [...prev];
        const changes = [];
        
        // Make 1-3 random changes
        const numChanges = Math.floor(Math.random() * 3) + 1;
        
        for (let i = 0; i < numChanges; i++) {
          const randomIndex = Math.floor(Math.random() * newSlots.length);
          const oldStatus = newSlots[randomIndex].available;
          newSlots[randomIndex].available = !oldStatus;
          newSlots[randomIndex].updatedAt = new Date();
          
          changes.push({
            time: newSlots[randomIndex].time,
            status: newSlots[randomIndex].available ? 'available' : 'booked',
          });
        }
        
        // Add to recent changes
        setRecentChanges(prev => [...changes, ...prev.slice(0, 5 - changes.length)]);
        
        return newSlots;
      });
      
      setLastUpdated(new Date());
    } finally {
      setIsRefreshing(false);
    }
  };

  // Format time for display
  const formatTime = (date: Date | null): string => {
    if (!date) return '';
    
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg p-6 border border-gray-200 text-center">
        <Loader className="h-8 w-8 text-blue-600 animate-spin mx-auto mb-4" />
        <p className="text-gray-600">Loading real-time availability...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 rounded-lg p-6 border border-red-200">
        <div className="flex items-center mb-4">
          <AlertCircle className="h-6 w-6 text-red-600 mr-2" />
          <h3 className="font-semibold text-red-900">Availability Error</h3>
        </div>
        <p className="text-red-700 mb-4">{error}</p>
        <Button onClick={() => window.location.reload()}>
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-gray-900 flex items-center">
            <Clock className="h-5 w-5 text-blue-600 mr-2" />
            Real-Time Availability
          </h3>
          
          <div className="flex items-center">
            <div className="flex items-center mr-4">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse mr-1"></div>
              <span className="text-xs text-gray-600">Live</span>
            </div>
            
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="flex items-center"
            >
              <RefreshCw className={`h-4 w-4 mr-1 ${isRefreshing ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </div>
        
        {lastUpdated && (
          <p className="text-xs text-gray-500 mt-1">
            Last updated: {formatTime(lastUpdated)}
          </p>
        )}
      </div>
      
      {/* Recent Changes */}
      {recentChanges.length > 0 && (
        <div className="px-4 py-2 bg-yellow-50 border-b border-yellow-200">
          <h4 className="text-xs font-medium text-yellow-800 mb-1">Recent Updates</h4>
          <div className="space-y-1">
            {recentChanges.map((change, index) => (
              <div key={index} className="flex items-center text-xs">
                <span className={`w-2 h-2 rounded-full mr-1 ${
                  change.status === 'available' ? 'bg-green-500' : 'bg-red-500'
                }`}></span>
                <span className="text-gray-700">
                  {change.time} - {change.status === 'available' ? 'Now Available' : 'Just Booked'}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Time Slots */}
      <div className="p-4">
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
          {timeSlots.map((slot, index) => (
            <button
              key={index}
              disabled={!slot.available}
              onClick={() => onSlotSelect && onSlotSelect(slot.time)}
              className={`relative p-3 rounded-lg text-center transition-colors ${
                !slot.available
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : selectedSlot === slot.time
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
              }`}
            >
              <div className="font-medium">{slot.time}</div>
              
              {/* Status indicator */}
              <div className="flex items-center justify-center mt-1">
                {slot.available ? (
                  <span className="text-xs flex items-center">
                    <CheckCircle className={`h-3 w-3 mr-1 ${selectedSlot === slot.time ? 'text-white' : 'text-green-600'}`} />
                    Available
                  </span>
                ) : (
                  <span className="text-xs flex items-center">
                    <Users className="h-3 w-3 mr-1 text-gray-500" />
                    Booked
                  </span>
                )}
              </div>
              
              {/* Recently updated indicator */}
              {slot.updatedAt && (new Date().getTime() - slot.updatedAt.getTime() < 10000) && (
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-500 rounded-full animate-ping"></div>
              )}
            </button>
          ))}
        </div>
        
        {timeSlots.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500">No time slots available for this date.</p>
          </div>
        )}
      </div>
      
      {/* Legend */}
      <div className="px-4 py-3 bg-gray-50 border-t border-gray-200">
        <div className="flex items-center justify-center space-x-6 text-xs text-gray-600">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-green-500 rounded-full mr-1"></div>
            <span>Available</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-gray-400 rounded-full mr-1"></div>
            <span>Booked</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-yellow-500 rounded-full mr-1"></div>
            <span>Recent Change</span>
          </div>
        </div>
      </div>
    </div>
  );
};