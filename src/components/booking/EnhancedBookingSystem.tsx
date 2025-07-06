import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  Clock, 
  DollarSign, 
  Users, 
  MapPin, 
  CheckCircle, 
  AlertCircle, 
  ArrowRight, 
  ArrowLeft,
  Zap,
  Star,
  CreditCard,
  Mail,
  Phone,
  MessageSquare,
  Loader,
  Info,
  ThumbsUp,
  ThumbsDown,
  TrendingDown,
  TrendingUp,
} from 'lucide-react';
import { Button } from '../ui/Button';
import { OptimizedImage } from '../ui/Image';
import { Court } from '../../types';
import { useAuth } from '../../hooks/useAuth';

// Constants for booking system
const BOOKING_STEPS = {
  SELECT_COURT: 1,
  SELECT_TIME: 2,
  CONFIRM_DETAILS: 3,
};

const TIME_SLOTS = [
  '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', 
  '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00'
];

const DAYS_OF_WEEK = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

// Types for booking system
interface BookingSlot {
  time: string;
  available: boolean;
  price: number;
  discount?: number;
  isPopular?: boolean;
  bookedBy?: string[];
}

interface DayAvailability {
  date: Date;
  dayOfWeek: string;
  slots: BookingSlot[];
  isToday: boolean;
}

interface BookingData {
  courtId: string;
  date: Date;
  timeSlot: string;
  duration: number;
  players: number;
  totalPrice: number;
  notes: string;
  paymentMethod: 'card' | 'wallet' | 'cash';
  sendNotifications: boolean;
}

// Mock data for availability
const generateMockAvailability = (days: number): DayAvailability[] => {
  const availability: DayAvailability[] = [];
  const today = new Date();
  
  for (let i = 0; i < days; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    
    const isWeekend = date.getDay() === 0 || date.getDay() === 6;
    const isPeakHour = (hour: number) => hour >= 17 && hour <= 20;
    
    const slots: BookingSlot[] = TIME_SLOTS.map(time => {
      const hour = parseInt(time.split(':')[0]);
      const isPopularTime = isPeakHour(hour);
      const basePrice = isWeekend ? 45 : 35;
      const peakHourSurcharge = isPeakHour(hour) ? 15 : 0;
      const price = basePrice + peakHourSurcharge;
      
      // Simulate some slots being unavailable
      const randomAvailability = Math.random() > 0.2;
      const isAvailable = i === 0 ? (hour > today.getHours() && randomAvailability) : randomAvailability;
      
      // Simulate discounts for non-peak hours
      const discount = !isPeakHour(hour) && !isWeekend ? 10 : undefined;
      
      return {
        time,
        available: isAvailable,
        price,
        discount,
        isPopular: isPopularTime,
        bookedBy: isAvailable ? [] : ['user-1', 'user-2'],
      };
    });
    
    availability.push({
      date,
      dayOfWeek: DAYS_OF_WEEK[date.getDay()],
      slots,
      isToday: i === 0,
    });
  }
  
  return availability;
};

// Mock courts data
const mockCourts: Court[] = [
  {
    id: 'court-1',
    name: 'Downtown Sports Center',
    sport: ['Basketball', 'Volleyball'],
    location: 'Central District',
    address: '123 Main Street, Downtown',
    coordinates: { lat: 24.7136, lng: 46.6753 },
    price: 40,
    rating: 4.8,
    reviews: 156,
    image: 'https://images.pexels.com/photos/1752757/pexels-photo-1752757.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&dpr=2',
    amenities: ['Parking', 'Showers', 'Lockers', 'Water Fountain', 'Wifi'],
    isIndoor: true,
    availability: [],
    operatingHours: {
      monday: { open: '08:00', close: '22:00' },
      tuesday: { open: '08:00', close: '22:00' },
      wednesday: { open: '08:00', close: '22:00' },
      thursday: { open: '08:00', close: '22:00' },
      friday: { open: '08:00', close: '23:00' },
      saturday: { open: '09:00', close: '23:00' },
      sunday: { open: '09:00', close: '21:00' },
    },
    weatherDependent: false,
  },
  {
    id: 'court-2',
    name: 'Elite Tennis Academy',
    sport: ['Tennis'],
    location: 'Northern District',
    address: '456 Tennis Avenue, Northern District',
    coordinates: { lat: 24.8136, lng: 46.7253 },
    price: 60,
    rating: 4.9,
    reviews: 203,
    image: 'https://images.pexels.com/photos/209977/pexels-photo-209977.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&dpr=2',
    amenities: ['Parking', 'Showers', 'Lockers', 'Pro Shop', 'Coaching'],
    isIndoor: false,
    availability: [],
    operatingHours: {
      monday: { open: '06:00', close: '22:00' },
      tuesday: { open: '06:00', close: '22:00' },
      wednesday: { open: '06:00', close: '22:00' },
      thursday: { open: '06:00', close: '22:00' },
      friday: { open: '06:00', close: '22:00' },
      saturday: { open: '07:00', close: '22:00' },
      sunday: { open: '07:00', close: '20:00' },
    },
    weatherDependent: true,
  },
  {
    id: 'court-3',
    name: 'Community Football Fields',
    sport: ['Football', 'Soccer'],
    location: 'Western District',
    address: '789 Football Road, Western District',
    coordinates: { lat: 24.7036, lng: 46.5953 },
    price: 50,
    rating: 4.5,
    reviews: 178,
    image: 'https://images.pexels.com/photos/274506/pexels-photo-274506.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&dpr=2',
    amenities: ['Parking', 'Changing Rooms', 'Floodlights', 'Seating'],
    isIndoor: false,
    availability: [],
    operatingHours: {
      monday: { open: '08:00', close: '21:00' },
      tuesday: { open: '08:00', close: '21:00' },
      wednesday: { open: '08:00', close: '21:00' },
      thursday: { open: '08:00', close: '21:00' },
      friday: { open: '08:00', close: '22:00' },
      saturday: { open: '08:00', close: '22:00' },
      sunday: { open: '09:00', close: '20:00' },
    },
    weatherDependent: true,
  },
];

interface EnhancedBookingSystemProps {
  initialCourtId?: string;
  onBookingComplete?: (bookingData: BookingData) => void;
}

export const EnhancedBookingSystem: React.FC<EnhancedBookingSystemProps> = ({
  initialCourtId,
  onBookingComplete,
}) => {
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(BOOKING_STEPS.SELECT_COURT);
  const [selectedCourt, setSelectedCourt] = useState<Court | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string | null>(null);
  const [availability, setAvailability] = useState<DayAvailability[]>([]);
  const [bookingData, setBookingData] = useState<BookingData>({
    courtId: '',
    date: new Date(),
    timeSlot: '',
    duration: 1,
    players: 2,
    totalPrice: 0,
    notes: '',
    paymentMethod: 'card',
    sendNotifications: true,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isBookingComplete, setIsBookingComplete] = useState(false);
  const [bookingError, setBookingError] = useState<string | null>(null);
  const [showRealTimeUpdates, setShowRealTimeUpdates] = useState(false);
  const [showSmartSuggestions, setShowSmartSuggestions] = useState(false);

  // Initialize with selected court if provided
  useEffect(() => {
    if (initialCourtId) {
      const court = mockCourts.find(c => c.id === initialCourtId);
      if (court) {
        setSelectedCourt(court);
        setCurrentStep(BOOKING_STEPS.SELECT_TIME);
        setBookingData(prev => ({
          ...prev,
          courtId: court.id,
        }));
      }
    }
  }, [initialCourtId]);

  // Generate availability data when court or date changes
  useEffect(() => {
    if (selectedCourt) {
      setIsLoading(true);
      
      // Simulate API call delay
      setTimeout(() => {
        const availabilityData = generateMockAvailability(7);
        setAvailability(availabilityData);
        setIsLoading(false);
      }, 800);
    }
  }, [selectedCourt, selectedDate]);

  // Update booking data when selections change
  useEffect(() => {
    if (selectedCourt && selectedTimeSlot) {
      const selectedDay = availability.find(day => 
        day.date.toDateString() === selectedDate.toDateString()
      );
      
      if (selectedDay) {
        const slot = selectedDay.slots.find(s => s.time === selectedTimeSlot);
        
        if (slot) {
          const price = slot.discount 
            ? slot.price - (slot.price * slot.discount / 100) 
            : slot.price;
            
          setBookingData(prev => ({
            ...prev,
            courtId: selectedCourt.id,
            date: selectedDate,
            timeSlot: selectedTimeSlot,
            totalPrice: price * prev.duration,
          }));
        }
      }
    }
  }, [selectedCourt, selectedDate, selectedTimeSlot, availability, bookingData.duration]);

  // Handle court selection
  const handleCourtSelect = (court: Court) => {
    setSelectedCourt(court);
    setBookingData(prev => ({
      ...prev,
      courtId: court.id,
    }));
    setCurrentStep(BOOKING_STEPS.SELECT_TIME);
  };

  // Handle date selection
  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    setSelectedTimeSlot(null); // Reset time slot when date changes
  };

  // Handle time slot selection
  const handleTimeSlotSelect = (time: string) => {
    setSelectedTimeSlot(time);
  };

  // Handle duration change
  const handleDurationChange = (duration: number) => {
    setBookingData(prev => ({
      ...prev,
      duration,
      totalPrice: prev.totalPrice / prev.duration * duration,
    }));
  };

  // Handle player count change
  const handlePlayerCountChange = (players: number) => {
    setBookingData(prev => ({
      ...prev,
      players,
    }));
  };

  // Handle payment method selection
  const handlePaymentMethodSelect = (method: 'card' | 'wallet' | 'cash') => {
    setBookingData(prev => ({
      ...prev,
      paymentMethod: method,
    }));
  };

  // Handle notes change
  const handleNotesChange = (notes: string) => {
    setBookingData(prev => ({
      ...prev,
      notes,
    }));
  };

  // Handle notification preference
  const handleNotificationToggle = () => {
    setBookingData(prev => ({
      ...prev,
      sendNotifications: !prev.sendNotifications,
    }));
  };

  // Process booking
  const handleBookNow = async () => {
    setIsLoading(true);
    setBookingError(null);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Check for conflicts (simulated)
      const hasConflict = Math.random() < 0.1; // 10% chance of conflict for demo
      
      if (hasConflict) {
        setBookingError('This time slot was just booked by someone else. Please select another time.');
        setIsLoading(false);
        return;
      }
      
      // Booking successful
      setIsBookingComplete(true);
      
      if (onBookingComplete) {
        onBookingComplete(bookingData);
      }
    } catch (error) {
      setBookingError('An error occurred while processing your booking. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Reset booking
  const handleReset = () => {
    setCurrentStep(BOOKING_STEPS.SELECT_COURT);
    setSelectedCourt(null);
    setSelectedTimeSlot(null);
    setIsBookingComplete(false);
    setBookingError(null);
  };

  // Format date for display
  const formatDate = (date: Date): string => {
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
  };

  // Get smart time suggestions
  const getSmartSuggestions = () => {
    if (!availability.length) return [];
    
    const suggestions = [];
    
    // Find off-peak discounted slots
    const discountedSlots = availability.flatMap(day => 
      day.slots
        .filter(slot => slot.available && slot.discount)
        .map(slot => ({ day, slot }))
    ).slice(0, 3);
    
    if (discountedSlots.length) {
      suggestions.push({
        type: 'discount',
        title: 'Save money with off-peak times',
        slots: discountedSlots,
      });
    }
    
    // Find slots with good weather (for outdoor courts)
    if (selectedCourt?.weatherDependent) {
      const goodWeatherSlots = availability.slice(0, 3).flatMap(day => 
        day.slots
          .filter(slot => slot.available && !slot.isPopular)
          .map(slot => ({ day, slot }))
      ).slice(0, 3);
      
      if (goodWeatherSlots.length) {
        suggestions.push({
          type: 'weather',
          title: 'Great weather forecast',
          slots: goodWeatherSlots,
        });
      }
    }
    
    // Find slots with low occupancy
    const lowOccupancySlots = availability.flatMap(day => 
      day.slots
        .filter(slot => slot.available && !slot.isPopular)
        .map(slot => ({ day, slot }))
    ).slice(0, 3);
    
    if (lowOccupancySlots.length) {
      suggestions.push({
        type: 'occupancy',
        title: 'Less crowded times',
        slots: lowOccupancySlots,
      });
    }
    
    return suggestions;
  };

  // Render booking confirmation
  const renderBookingConfirmation = () => (
    <div className="bg-white rounded-xl shadow-lg p-8 text-center">
      <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <CheckCircle className="h-10 w-10 text-green-600" />
      </div>
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Booking Confirmed! 🎉</h2>
      <p className="text-gray-600 mb-6">
        Your court has been successfully booked. A confirmation has been sent to your email and phone.
      </p>
      
      <div className="bg-gray-50 rounded-lg p-6 mb-6 text-left">
        <h3 className="font-semibold text-gray-900 mb-4">Booking Details</h3>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-gray-600">Court:</span>
            <span className="font-medium">{selectedCourt?.name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Date:</span>
            <span className="font-medium">{formatDate(bookingData.date)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Time:</span>
            <span className="font-medium">{bookingData.timeSlot}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Duration:</span>
            <span className="font-medium">{bookingData.duration} hour(s)</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Players:</span>
            <span className="font-medium">{bookingData.players}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Total:</span>
            <span className="font-medium">${bookingData.totalPrice.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Booking ID:</span>
            <span className="font-medium">BK-{Math.floor(Math.random() * 10000)}</span>
          </div>
        </div>
      </div>
      
      <div className="flex flex-col space-y-3">
        <Button onClick={handleReset} className="bg-blue-600 hover:bg-blue-700">
          Book Another Court
        </Button>
        <Button variant="outline">
          View My Bookings
        </Button>
      </div>
    </div>
  );

  // Render court selection step
  const renderCourtSelection = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Select a Court</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockCourts.map(court => (
          <div 
            key={court.id}
            className={`bg-white rounded-xl shadow-sm overflow-hidden border-2 transition-all duration-200 cursor-pointer hover:shadow-md ${
              selectedCourt?.id === court.id ? 'border-blue-500 ring-2 ring-blue-200' : 'border-transparent'
            }`}
            onClick={() => handleCourtSelect(court)}
          >
            <div className="relative h-48">
              <OptimizedImage
                src={court.image}
                alt={court.name}
                className="w-full h-full"
                objectFit="cover"
                width={400}
                height={200}
              />
              <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full text-sm font-medium">
                ${court.price}/hr
              </div>
              <div className="absolute bottom-2 left-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full text-sm font-medium flex items-center">
                <Star className="h-4 w-4 text-yellow-500 fill-current mr-1" />
                {court.rating} ({court.reviews})
              </div>
            </div>
            
            <div className="p-4">
              <h3 className="font-bold text-gray-900 text-lg mb-1">{court.name}</h3>
              <div className="flex items-center text-gray-600 mb-3">
                <MapPin className="h-4 w-4 mr-1" />
                <span className="text-sm">{court.location}</span>
              </div>
              
              <div className="flex flex-wrap gap-1 mb-3">
                {court.sport.map(sport => (
                  <span key={sport} className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                    {sport}
                  </span>
                ))}
                <span className={`px-2 py-1 rounded-full text-xs ${
                  court.isIndoor ? 'bg-purple-100 text-purple-800' : 'bg-green-100 text-green-800'
                }`}>
                  {court.isIndoor ? 'Indoor' : 'Outdoor'}
                </span>
              </div>
              
              <div className="flex flex-wrap gap-1">
                {court.amenities.slice(0, 3).map(amenity => (
                  <span key={amenity} className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">
                    {amenity}
                  </span>
                ))}
                {court.amenities.length > 3 && (
                  <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">
                    +{court.amenities.length - 3} more
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // Render time selection step
  const renderTimeSelection = () => {
    if (!selectedCourt) return null;
    
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">Select Date & Time</h2>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setShowSmartSuggestions(!showSmartSuggestions)}
              className={`flex items-center space-x-1 px-3 py-1.5 rounded-lg text-sm ${
                showSmartSuggestions ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'
              }`}
            >
              <Zap className="h-4 w-4" />
              <span>Smart Suggestions</span>
            </button>
            <button
              onClick={() => setShowRealTimeUpdates(!showRealTimeUpdates)}
              className={`flex items-center space-x-1 px-3 py-1.5 rounded-lg text-sm ${
                showRealTimeUpdates ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
              }`}
            >
              <Clock className="h-4 w-4" />
              <span>Real-time Updates</span>
            </button>
          </div>
        </div>
        
        {/* Court Summary */}
        <div className="bg-white rounded-lg p-4 border border-gray-200 flex items-center space-x-4">
          <OptimizedImage
            src={selectedCourt.image}
            alt={selectedCourt.name}
            width={80}
            height={80}
            className="rounded-lg"
            objectFit="cover"
          />
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900">{selectedCourt.name}</h3>
            <div className="flex items-center text-gray-600">
              <MapPin className="h-4 w-4 mr-1" />
              <span className="text-sm">{selectedCourt.location}</span>
            </div>
            <div className="flex items-center space-x-3 text-sm mt-1">
              <div className="flex items-center">
                <Star className="h-4 w-4 text-yellow-500 fill-current mr-1" />
                <span>{selectedCourt.rating}</span>
              </div>
              <span className="text-gray-500">•</span>
              <span className={`px-2 py-0.5 rounded-full text-xs ${
                selectedCourt.isIndoor ? 'bg-purple-100 text-purple-800' : 'bg-green-100 text-green-800'
              }`}>
                {selectedCourt.isIndoor ? 'Indoor' : 'Outdoor'}
              </span>
            </div>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setCurrentStep(BOOKING_STEPS.SELECT_COURT)}
          >
            Change
          </Button>
        </div>
        
        {/* Smart Suggestions */}
        {showSmartSuggestions && (
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-200">
            <h3 className="font-semibold text-blue-900 mb-3 flex items-center">
              <Zap className="h-5 w-5 text-blue-600 mr-2" />
              Smart Time Suggestions
            </h3>
            
            <div className="space-y-3">
              {getSmartSuggestions().map((suggestion, index) => (
                <div key={index} className="bg-white rounded-lg p-3 shadow-sm">
                  <h4 className="font-medium text-gray-900 mb-2 flex items-center">
                    {suggestion.type === 'discount' && <TrendingDown className="h-4 w-4 text-green-600 mr-1" />}
                    {suggestion.type === 'weather' && <Sun className="h-4 w-4 text-orange-600 mr-1" />}
                    {suggestion.type === 'occupancy' && <Users className="h-4 w-4 text-blue-600 mr-1" />}
                    {suggestion.title}
                  </h4>
                  
                  <div className="flex space-x-2 overflow-x-auto pb-2">
                    {suggestion.slots.map((item, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          handleDateSelect(item.day.date);
                          handleTimeSlotSelect(item.slot.time);
                        }}
                        className="flex-shrink-0 px-3 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg text-sm"
                      >
                        {formatDate(item.day.date)} at {item.slot.time}
                        {item.slot.discount && (
                          <span className="block text-green-600 text-xs font-medium">
                            {item.slot.discount}% off
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
              
              {getSmartSuggestions().length === 0 && (
                <p className="text-blue-700 text-sm">
                  No smart suggestions available for this court at the moment.
                </p>
              )}
            </div>
          </div>
        )}
        
        {/* Real-time Updates Banner */}
        {showRealTimeUpdates && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-3 flex items-center">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse mr-2"></div>
            <p className="text-green-800 text-sm">
              <span className="font-medium">Real-time updates active:</span> You'll see live availability changes as they happen.
            </p>
          </div>
        )}
        
        {/* Date Selection */}
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <h3 className="font-semibold text-gray-900 mb-3">Select Date</h3>
          
          <div className="flex space-x-3 overflow-x-auto pb-2">
            {availability.map((day, index) => (
              <button
                key={index}
                onClick={() => handleDateSelect(day.date)}
                className={`flex-shrink-0 px-4 py-3 rounded-lg text-center transition-colors ${
                  selectedDate.toDateString() === day.date.toDateString()
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
                }`}
              >
                <div className="font-medium">{day.dayOfWeek.substring(0, 3)}</div>
                <div className="text-lg font-bold my-1">{day.date.getDate()}</div>
                <div className="text-xs">{day.isToday ? 'Today' : day.date.toLocaleDateString('en-US', { month: 'short' })}</div>
              </button>
            ))}
          </div>
        </div>
        
        {/* Time Slot Selection */}
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <h3 className="font-semibold text-gray-900 mb-3">Select Time</h3>
          
          {isLoading ? (
            <div className="flex justify-center py-8">
              <Loader className="h-8 w-8 text-blue-600 animate-spin" />
            </div>
          ) : (
            <>
              {availability.find(day => day.date.toDateString() === selectedDate.toDateString())?.slots.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">No available time slots for this date.</p>
                </div>
              ) : (
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
                  {availability
                    .find(day => day.date.toDateString() === selectedDate.toDateString())
                    ?.slots.map((slot, index) => (
                      <button
                        key={index}
                        disabled={!slot.available}
                        onClick={() => handleTimeSlotSelect(slot.time)}
                        className={`relative p-3 rounded-lg text-center transition-colors ${
                          !slot.available
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            : selectedTimeSlot === slot.time
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
                        }`}
                      >
                        <div className="font-medium">{slot.time}</div>
                        <div className="text-xs mt-1">
                          ${slot.discount ? (
                            <>
                              <span className="line-through">{slot.price}</span>
                              <span className="ml-1">{slot.price - (slot.price * slot.discount / 100)}</span>
                            </>
                          ) : slot.price}
                        </div>
                        
                        {/* Popular indicator */}
                        {slot.isPopular && slot.available && (
                          <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                            Popular
                          </div>
                        )}
                        
                        {/* Discount badge */}
                        {slot.discount && slot.available && (
                          <div className="absolute -top-2 -left-2 bg-green-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                            -{slot.discount}%
                          </div>
                        )}
                        
                        {/* Real-time indicator */}
                        {showRealTimeUpdates && !slot.available && (
                          <div className="absolute inset-0 flex items-center justify-center bg-gray-800/70 rounded-lg">
                            <span className="text-white text-xs font-medium">Booked</span>
                          </div>
                        )}
                      </button>
                    ))
                  }
                </div>
              )}
            </>
          )}
        </div>
        
        {/* Duration and Players */}
        {selectedTimeSlot && (
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Duration</h3>
                <div className="flex space-x-3">
                  {[1, 2, 3].map(hours => (
                    <button
                      key={hours}
                      onClick={() => handleDurationChange(hours)}
                      className={`px-4 py-2 rounded-lg transition-colors ${
                        bookingData.duration === hours
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
                <h3 className="font-semibold text-gray-900 mb-3">Number of Players</h3>
                <div className="flex space-x-3">
                  {[2, 4, 6, 8].map(count => (
                    <button
                      key={count}
                      onClick={() => handlePlayerCountChange(count)}
                      className={`px-4 py-2 rounded-lg transition-colors ${
                        bookingData.players === count
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
                      }`}
                    >
                      {count}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Navigation Buttons */}
        <div className="flex justify-between">
          <Button 
            variant="outline" 
            onClick={() => setCurrentStep(BOOKING_STEPS.SELECT_COURT)}
            className="flex items-center"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          
          <Button
            disabled={!selectedTimeSlot}
            onClick={() => setCurrentStep(BOOKING_STEPS.CONFIRM_DETAILS)}
            className="flex items-center"
          >
            Continue
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </div>
    );
  };

  // Render booking confirmation step
  const renderBookingConfirmation = () => {
    if (!selectedCourt) return null;
    
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-900">Confirm Booking</h2>
        
        {/* Booking Summary */}
        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <h3 className="font-semibold text-gray-900 mb-4">Booking Summary</h3>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-gray-100">
              <div className="flex items-center">
                <div className="bg-blue-100 p-2 rounded-lg mr-3">
                  <MapPin className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">{selectedCourt.name}</h4>
                  <p className="text-sm text-gray-600">{selectedCourt.location}</p>
                </div>
              </div>
            </div>
            
            <div className="flex justify-between items-center pb-3 border-b border-gray-100">
              <div className="flex items-center">
                <div className="bg-green-100 p-2 rounded-lg mr-3">
                  <Calendar className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">{formatDate(bookingData.date)}</h4>
                  <p className="text-sm text-gray-600">{bookingData.timeSlot} • {bookingData.duration} hour(s)</p>
                </div>
              </div>
            </div>
            
            <div className="flex justify-between items-center pb-3 border-b border-gray-100">
              <div className="flex items-center">
                <div className="bg-purple-100 p-2 rounded-lg mr-3">
                  <Users className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">{bookingData.players} Players</h4>
                  <p className="text-sm text-gray-600">
                    {selectedCourt.sport.join(', ')}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <div className="bg-yellow-100 p-2 rounded-lg mr-3">
                  <DollarSign className="h-5 w-5 text-yellow-600" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Total Price</h4>
                  <p className="text-sm text-gray-600">${bookingData.totalPrice.toFixed(2)}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Payment Method */}
        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <h3 className="font-semibold text-gray-900 mb-4">Payment Method</h3>
          
          <div className="space-y-3">
            <button
              onClick={() => handlePaymentMethodSelect('card')}
              className={`w-full flex items-center justify-between p-3 rounded-lg border ${
                bookingData.paymentMethod === 'card'
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center">
                <CreditCard className="h-5 w-5 text-blue-600 mr-3" />
                <span className="font-medium">Credit/Debit Card</span>
              </div>
              {bookingData.paymentMethod === 'card' && (
                <CheckCircle className="h-5 w-5 text-blue-600" />
              )}
            </button>
            
            <button
              onClick={() => handlePaymentMethodSelect('wallet')}
              className={`w-full flex items-center justify-between p-3 rounded-lg border ${
                bookingData.paymentMethod === 'wallet'
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center">
                <DollarSign className="h-5 w-5 text-green-600 mr-3" />
                <div>
                  <span className="font-medium">Fitcha Wallet</span>
                  <span className="block text-sm text-gray-500">Balance: $120.50</span>
                </div>
              </div>
              {bookingData.paymentMethod === 'wallet' && (
                <CheckCircle className="h-5 w-5 text-blue-600" />
              )}
            </button>
            
            <button
              onClick={() => handlePaymentMethodSelect('cash')}
              className={`w-full flex items-center justify-between p-3 rounded-lg border ${
                bookingData.paymentMethod === 'cash'
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center">
                <DollarSign className="h-5 w-5 text-gray-600 mr-3" />
                <span className="font-medium">Pay at Venue</span>
              </div>
              {bookingData.paymentMethod === 'cash' && (
                <CheckCircle className="h-5 w-5 text-blue-600" />
              )}
            </button>
          </div>
        </div>
        
        {/* Additional Notes */}
        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <h3 className="font-semibold text-gray-900 mb-4">Additional Notes</h3>
          
          <textarea
            value={bookingData.notes}
            onChange={(e) => handleNotesChange(e.target.value)}
            placeholder="Any special requests or information for the venue..."
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            rows={3}
          />
          
          <div className="mt-4 flex items-center">
            <input
              type="checkbox"
              id="notifications"
              checked={bookingData.sendNotifications}
              onChange={handleNotificationToggle}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="notifications" className="ml-2 text-sm text-gray-700">
              Send booking confirmation and reminders via email and SMS
            </label>
          </div>
        </div>
        
        {/* Booking Error */}
        {bookingError && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start">
            <AlertCircle className="h-5 w-5 text-red-600 mr-3 flex-shrink-0 mt-0.5" />
            <p className="text-red-700">{bookingError}</p>
          </div>
        )}
        
        {/* Navigation Buttons */}
        <div className="flex justify-between">
          <Button 
            variant="outline" 
            onClick={() => setCurrentStep(BOOKING_STEPS.SELECT_TIME)}
            className="flex items-center"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          
          <Button
            onClick={handleBookNow}
            disabled={isLoading}
            className="flex items-center bg-green-600 hover:bg-green-700"
          >
            {isLoading ? (
              <>
                <Loader className="h-4 w-4 mr-2 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <CheckCircle className="h-4 w-4 mr-2" />
                Confirm Booking
              </>
            )}
          </Button>
        </div>
      </div>
    );
  };

  // Main render
  return (
    <div className="max-w-5xl mx-auto">
      {/* Progress Steps */}
      {!isBookingComplete && (
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {Object.values(BOOKING_STEPS).map((step) => (
              <div key={step} className="flex items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-medium ${
                  currentStep >= step 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-200 text-gray-600'
                }`}>
                  {step}
                </div>
                {step < Object.values(BOOKING_STEPS).length && (
                  <div className={`w-24 h-1 ${
                    currentStep > step ? 'bg-blue-600' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-2">
            <span className="text-sm font-medium">Select Court</span>
            <span className="text-sm font-medium">Select Time</span>
            <span className="text-sm font-medium">Confirm Details</span>
          </div>
        </div>
      )}
      
      {/* Content based on current step */}
      {isBookingComplete ? (
        renderBookingConfirmation()
      ) : (
        <>
          {currentStep === BOOKING_STEPS.SELECT_COURT && renderCourtSelection()}
          {currentStep === BOOKING_STEPS.SELECT_TIME && renderTimeSelection()}
          {currentStep === BOOKING_STEPS.CONFIRM_DETAILS && renderBookingConfirmation()}
        </>
      )}
    </div>
  );
};

// Sun icon component for weather suggestions
function Sun(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2" />
      <path d="M12 20v2" />
      <path d="m4.93 4.93 1.41 1.41" />
      <path d="m17.66 17.66 1.41 1.41" />
      <path d="M2 12h2" />
      <path d="M20 12h2" />
      <path d="m6.34 17.66-1.41 1.41" />
      <path d="m19.07 4.93-1.41 1.41" />
    </svg>
  );
}