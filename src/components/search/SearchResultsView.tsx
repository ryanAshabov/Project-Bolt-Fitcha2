import React, { useState, useEffect } from 'react';
import { Search, Filter, MapPin, Star, DollarSign, Clock, Calendar, Zap, Loader } from 'lucide-react';
import { Button } from '../ui/Button';
import { OptimizedImage } from '../ui/Image';
import { Court } from '../../types';
import { Link } from 'react-router-dom';
import { SearchFilters } from './AdvancedSearchFilters';

interface SearchResultsViewProps {
  courts: Court[];
  isLoading: boolean;
  filters: SearchFilters;
  onCourtSelect: (court: Court) => void;
  onFilterChange?: (key: string, value: any) => void;
}

export const SearchResultsView: React.FC<SearchResultsViewProps> = ({
  courts,
  isLoading,
  filters,
  onCourtSelect,
  onFilterChange,
}) => {
  const [visibleCourts, setVisibleCourts] = useState<Court[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const courtsPerPage = 9;
  
  // Update visible courts when courts or page changes
  useEffect(() => {
    if (isLoading) return;
    
    const start = 0;
    const end = page * courtsPerPage;
    const visible = courts.slice(start, end);
    
    setVisibleCourts(visible);
    setHasMore(end < courts.length);
  }, [courts, page, isLoading]);
  
  // Reset pagination when filters change
  useEffect(() => {
    setPage(1);
  }, [filters]);
  
  // Load more courts
  const loadMore = () => {
    setPage(prev => prev + 1);
  };
  
  // Get availability status
  const getAvailabilityStatus = (court: Court) => {
    // In a real app, this would check actual availability
    const isAvailable = Math.random() > 0.3;
    const availableSlots = isAvailable ? Math.floor(Math.random() * 5) + 1 : 0;
    
    return {
      isAvailable,
      availableSlots,
      nextAvailable: isAvailable ? '10:00 AM' : '2:00 PM',
    };
  };
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="text-center">
          <Loader className="h-12 w-12 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Searching for courts...</p>
        </div>
      </div>
    );
  }
  
  if (courts.length === 0) {
    return (
      <div className="bg-white rounded-lg p-8 shadow-sm border border-gray-200 text-center">
        <Search className="h-16 w-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-800 mb-2">No courts found</h3>
        <p className="text-gray-600 mb-6 max-w-md mx-auto">
          We couldn't find any courts matching your search criteria. Try adjusting your filters or expanding your search radius.
        </p>
        <Button
          onClick={() => onFilterChange && onFilterChange('reset', true)}
          className="mx-auto"
        >
          Clear Filters
        </Button>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      {/* Results Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-gray-900">
          {courts.length} Courts Found
        </h2>
        <div className="text-sm text-gray-600">
          Sorted by: {filters.sortBy === 'distance' ? 'Nearest' : 
                     filters.sortBy === 'rating' ? 'Highest Rated' :
                     filters.sortBy === 'price-low' ? 'Price: Low to High' :
                     filters.sortBy === 'price-high' ? 'Price: High to Low' :
                     'Most Popular'}
        </div>
      </div>
      
      {/* Results Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {visibleCourts.map(court => {
          const availability = getAvailabilityStatus(court);
          
          return (
            <div
              key={court.id}
              className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-all duration-200 cursor-pointer"
              onClick={() => onCourtSelect(court)}
            >
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
                
                {/* Availability Badge */}
                {availability.isAvailable ? (
                  <div className="absolute bottom-2 right-2 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                    Available Today
                  </div>
                ) : (
                  <div className="absolute bottom-2 right-2 bg-gray-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                    Next: {availability.nextAvailable}
                  </div>
                )}
              </div>
              
              {/* Content */}
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
                
                {/* Availability */}
                {availability.isAvailable && (
                  <div className="mb-4">
                    <div className="flex items-center text-sm text-gray-700 mb-2">
                      <Clock className="h-4 w-4 mr-1 text-gray-500" />
                      <span>Available Today:</span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {Array.from({ length: availability.availableSlots }).map((_, index) => {
                        const hour = 8 + index * 2;
                        const time = `${hour}:00${hour < 12 ? 'AM' : 'PM'}`;
                        return (
                          <span key={index} className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                            {time}
                          </span>
                        );
                      })}
                      <Link to="/booking" className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs hover:bg-gray-200">
                        +more
                      </Link>
                    </div>
                  </div>
                )}
                
                {/* Actions */}
                <div className="flex space-x-2">
                  <Link to="/booking" className="flex-1">
                    <Button 
                      className="w-full flex items-center justify-center"
                    >
                      <Calendar className="h-4 w-4 mr-2" />
                      Book Now
                    </Button>
                  </Link>
                  <Button 
                    variant="outline"
                  >
                    View Details
                  </Button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      
      {/* Load More */}
      {hasMore && (
        <div className="text-center pt-4">
          <Button 
            variant="outline" 
            onClick={loadMore}
            className="px-8"
          >
            Load More Results
          </Button>
        </div>
      )}
    </div>
  );
};