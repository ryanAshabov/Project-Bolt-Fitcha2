import React from 'react';
import { CheckCircle, Calendar, Clock, MapPin, Users, DollarSign, X, Mail, Phone, MessageSquare } from 'lucide-react';
import { Button } from '../ui/Button';
import { OptimizedImage } from '../ui/Image';
import { Court } from '../../types';

interface BookingConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookingData: {
    court: Court;
    date: Date;
    timeSlot: string;
    duration: number;
    players: number;
    totalPrice: number;
    bookingId: string;
  };
  onViewBookings: () => void;
}

export const BookingConfirmationModal: React.FC<BookingConfirmationModalProps> = ({
  isOpen,
  onClose,
  bookingData,
  onViewBookings,
}) => {
  if (!isOpen) return null;
  
  const { court, date, timeSlot, duration, players, totalPrice, bookingId } = bookingData;
  
  // Format date for display
  const formatDate = (date: Date): string => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  };
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="relative">
          <OptimizedImage
            src={court.image}
            alt={court.name}
            className="w-full h-40 rounded-t-xl"
            objectFit="cover"
            width={400}
            height={160}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/60 rounded-t-xl"></div>
          <button 
            onClick={onClose}
            className="absolute top-2 right-2 bg-white/80 backdrop-blur-sm p-1.5 rounded-full text-gray-800 hover:bg-white"
          >
            <X className="h-5 w-5" />
          </button>
          <div className="absolute bottom-4 left-4 text-white">
            <h2 className="font-bold text-xl">{court.name}</h2>
            <p className="text-white/90 flex items-center">
              <MapPin className="h-4 w-4 mr-1" />
              {court.location}
            </p>
          </div>
        </div>
        
        {/* Success Message */}
        <div className="p-6 text-center border-b border-gray-200">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Booking Confirmed!</h3>
          <p className="text-gray-600">
            Your court has been successfully booked. A confirmation has been sent to your email and phone.
          </p>
        </div>
        
        {/* Booking Details */}
        <div className="p-6 space-y-4">
          <div className="flex items-center">
            <div className="bg-blue-100 p-2 rounded-lg mr-3">
              <Calendar className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Date</p>
              <p className="font-medium">{formatDate(date)}</p>
            </div>
          </div>
          
          <div className="flex items-center">
            <div className="bg-green-100 p-2 rounded-lg mr-3">
              <Clock className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Time</p>
              <p className="font-medium">{timeSlot} ({duration} hour{duration > 1 ? 's' : ''})</p>
            </div>
          </div>
          
          <div className="flex items-center">
            <div className="bg-purple-100 p-2 rounded-lg mr-3">
              <Users className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Players</p>
              <p className="font-medium">{players} players</p>
            </div>
          </div>
          
          <div className="flex items-center">
            <div className="bg-yellow-100 p-2 rounded-lg mr-3">
              <DollarSign className="h-5 w-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Price</p>
              <p className="font-medium">${totalPrice.toFixed(2)}</p>
            </div>
          </div>
          
          <div className="flex items-center">
            <div className="bg-gray-100 p-2 rounded-lg mr-3">
              <CheckCircle className="h-5 w-5 text-gray-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Booking ID</p>
              <p className="font-medium">{bookingId}</p>
            </div>
          </div>
        </div>
        
        {/* Notification Options */}
        <div className="p-6 bg-gray-50 rounded-b-xl space-y-4">
          <h4 className="font-medium text-gray-900 mb-3">Share Booking Details</h4>
          
          <div className="flex space-x-3">
            <Button 
              variant="outline" 
              className="flex-1 flex items-center justify-center"
            >
              <Mail className="h-4 w-4 mr-2" />
              Email
            </Button>
            <Button 
              variant="outline" 
              className="flex-1 flex items-center justify-center"
            >
              <Phone className="h-4 w-4 mr-2" />
              SMS
            </Button>
            <Button 
              variant="outline" 
              className="flex-1 flex items-center justify-center"
            >
              <MessageSquare className="h-4 w-4 mr-2" />
              Share
            </Button>
          </div>
          
          <div className="pt-4 border-t border-gray-200">
            <Button 
              onClick={onViewBookings}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              View My Bookings
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};