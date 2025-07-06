import React, { useState } from 'react';
import { AlertCircle, Clock, Calendar, ArrowRight, CheckCircle } from 'lucide-react';
import { Button } from '../ui/Button';

interface BookingConflict {
  date: Date;
  startTime: string;
  endTime: string;
  courtName: string;
  conflictType: 'double-booking' | 'maintenance' | 'closed';
}

interface AlternativeSlot {
  date: Date;
  startTime: string;
  courtName: string;
  price: number;
  distance?: number;
}

interface BookingConflictResolverProps {
  conflict: BookingConflict;
  alternatives: AlternativeSlot[];
  onResolve: (alternative: AlternativeSlot | null) => void;
  onCancel: () => void;
}

export const BookingConflictResolver: React.FC<BookingConflictResolverProps> = ({
  conflict,
  alternatives,
  onResolve,
  onCancel,
}) => {
  const [selectedAlternative, setSelectedAlternative] = useState<AlternativeSlot | null>(null);
  
  // Format date for display
  const formatDate = (date: Date): string => {
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
  };
  
  // Get conflict message based on type
  const getConflictMessage = () => {
    switch (conflict.conflictType) {
      case 'double-booking':
        return 'This time slot was just booked by someone else.';
      case 'maintenance':
        return 'This court is scheduled for maintenance during this time.';
      case 'closed':
        return 'The venue will be closed during this time.';
      default:
        return 'This time slot is no longer available.';
    }
  };
  
  return (
    <div className="bg-white rounded-lg shadow-lg border border-red-200 overflow-hidden">
      {/* Header */}
      <div className="p-4 bg-red-50 border-b border-red-200">
        <div className="flex items-start">
          <div className="bg-red-100 p-2 rounded-lg mr-3 flex-shrink-0">
            <AlertCircle className="h-5 w-5 text-red-600" />
          </div>
          <div>
            <h3 className="font-semibold text-red-900">Booking Conflict Detected</h3>
            <p className="text-red-700 text-sm">{getConflictMessage()}</p>
          </div>
        </div>
      </div>
      
      {/* Conflict Details */}
      <div className="p-4 border-b border-gray-200">
        <h4 className="font-medium text-gray-900 mb-3">Unavailable Booking</h4>
        
        <div className="bg-gray-50 rounded-lg p-3">
          <div className="flex items-center mb-2">
            <Calendar className="h-4 w-4 text-gray-500 mr-2" />
            <span className="text-gray-700">{formatDate(conflict.date)}</span>
          </div>
          <div className="flex items-center mb-2">
            <Clock className="h-4 w-4 text-gray-500 mr-2" />
            <span className="text-gray-700">{conflict.startTime} - {conflict.endTime}</span>
          </div>
          <div className="flex items-center">
            <MapPin className="h-4 w-4 text-gray-500 mr-2" />
            <span className="text-gray-700">{conflict.courtName}</span>
          </div>
        </div>
      </div>
      
      {/* Alternative Options */}
      <div className="p-4">
        <h4 className="font-medium text-gray-900 mb-3">Suggested Alternatives</h4>
        
        {alternatives.length === 0 ? (
          <p className="text-gray-600 text-center py-4">
            No alternative slots available. Please try a different date or court.
          </p>
        ) : (
          <div className="space-y-3">
            {alternatives.map((alt, index) => (
              <button
                key={index}
                onClick={() => setSelectedAlternative(alt)}
                className={`w-full flex items-center justify-between p-3 rounded-lg border transition-colors ${
                  selectedAlternative === alt
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div>
                  <div className="font-medium text-gray-900">{formatDate(alt.date)} at {alt.startTime}</div>
                  <div className="text-sm text-gray-600">{alt.courtName}</div>
                  {alt.distance && (
                    <div className="text-xs text-gray-500">{alt.distance} km away</div>
                  )}
                </div>
                <div className="text-right">
                  <div className="font-medium text-gray-900">${alt.price}</div>
                  {selectedAlternative === alt && (
                    <CheckCircle className="h-5 w-5 text-blue-600 mt-1 ml-auto" />
                  )}
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
      
      {/* Actions */}
      <div className="p-4 bg-gray-50 border-t border-gray-200 flex justify-between">
        <Button 
          variant="outline" 
          onClick={onCancel}
        >
          Cancel
        </Button>
        
        <Button
          disabled={!selectedAlternative}
          onClick={() => onResolve(selectedAlternative)}
          className="flex items-center"
        >
          Book Alternative
          <ArrowRight className="h-4 w-4 ml-2" />
        </Button>
      </div>
    </div>
  );
};

function MapPin(props: React.SVGProps<SVGSVGElement>) {
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
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}