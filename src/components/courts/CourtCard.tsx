import React from 'react';
import { MapPin, Star, DollarSign, Clock, Calendar, Navigation } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../ui/Button';
import { OptimizedImage } from '../ui/Image';
import { Court } from '../../types';

interface CourtCardProps {
  court: Court;
  onBookNow?: () => void;
  onViewDetails?: () => void;
  compact?: boolean;
}

export const CourtCard: React.FC<CourtCardProps> = ({
  court,
  onBookNow,
  onViewDetails,
  compact = false,
}) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-all duration-200">
      {/* Image */}
      <div className="relative">
        <OptimizedImage
          src={court.image}
          alt={court.name}
          className="w-full h-48"
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
      
      {/* Content */}
      <div className="p-4">
        <h3 className="font-bold text-gray-900 text-lg mb-1">{court.name}</h3>
        <div className="flex items-center text-gray-600 mb-3">
          <MapPin className="h-4 w-4 mr-1" />
          <span className="text-sm">{court.location}</span>
        </div>
        
        {!compact && (
          <>
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
            
            <div className="flex flex-wrap gap-1 mb-4">
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
          </>
        )}
        
        {/* Quick Availability */}
        <div className="mb-4">
          <div className="flex items-center text-sm text-gray-700 mb-2">
            <Clock className="h-4 w-4 mr-1 text-gray-500" />
            <span>Available Today:</span>
          </div>
          <div className="flex flex-wrap gap-1">
            {['10:00', '14:00', '18:00'].map((time, index) => (
              <span key={index} className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                {time}
              </span>
            ))}
            <Link to="/booking" className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs hover:bg-gray-200">
              +more
            </Link>
          </div>
        </div>
        
        {/* Actions */}
        <div className="flex space-x-2">
          <Link to="/booking" className="flex-1">
            <Button 
              className="w-full flex items-center justify-center"
              onClick={onBookNow}
            >
              <Calendar className="h-4 w-4 mr-2" />
              Book Now
            </Button>
          </Link>
          
          {!compact && (
            <>
              <Button 
                variant="outline"
                onClick={onViewDetails}
              >
                View Details
              </Button>
              <Button 
                variant="outline"
                onClick={() => window.open(`https://maps.google.com/?q=${court.address}`, '_blank')}
              >
                <Navigation className="h-4 w-4" />
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};