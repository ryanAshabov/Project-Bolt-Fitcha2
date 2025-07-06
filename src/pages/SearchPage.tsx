import React, { useState, useEffect } from 'react';
import { Header } from '../components/layout/Header';
import { AdvancedSearchFilters, SearchFilters } from '../components/search/AdvancedSearchFilters';
import { SearchResultsView } from '../components/search/SearchResultsView';
import { MapView } from '../components/search/MapView';
import { VoiceSearch } from '../components/search/VoiceSearch';
import { SavedSearches } from '../components/search/SavedSearches';
import { Court } from '../types';
import { useGeolocation } from '../hooks/useGeolocation';
import { MobileContainer } from '../components/ui/MobileContainer';
import { useDeviceDetection } from '../components/ui/MobileDetection';
import { Link } from 'react-router-dom';

// Import mock courts data
import { mockCourts } from '../data/mockData';

const SearchPage: React.FC = () => {
  const { isMobile } = useDeviceDetection();
  const { coordinates } = useGeolocation();
  
  // State
  const [filters, setFilters] = useState<SearchFilters>({
    query: '',
    sport: 'all',
    maxDistance: 10,
    priceRange: [0, 200],
    rating: 0,
    amenities: [],
    sortBy: 'distance',
  });
  
  const [filteredCourts, setFilteredCourts] = useState<Court[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [selectedCourt, setSelectedCourt] = useState<Court | null>(null);
  const [showVoiceSearch, setShowVoiceSearch] = useState(false);
  const [showSavedSearches, setShowSavedSearches] = useState(false);
  
  // Filter courts based on search criteria
  useEffect(() => {
    setIsLoading(true);
    
    // Simulate API call delay
    setTimeout(() => {
      const filtered = mockCourts.filter(court => {
        // Text search
        const matchesQuery = !filters.query || 
          court.name.toLowerCase().includes(filters.query.toLowerCase()) ||
          court.location.toLowerCase().includes(filters.query.toLowerCase()) ||
          court.sport.some(s => s.toLowerCase().includes(filters.query.toLowerCase()));
        
        // Sport filter
        const matchesSport = filters.sport === 'all' || 
          court.sport.some(s => s.toLowerCase() === filters.sport.toLowerCase());
        
        // Rating filter
        const matchesRating = court.rating >= filters.rating;
        
        // Price filter
        const matchesPrice = court.price >= filters.priceRange[0] && 
                            court.price <= filters.priceRange[1];
        
        // Indoor/Outdoor filter
        const matchesIndoor = filters.isIndoor === undefined || 
                             court.isIndoor === filters.isIndoor;
        
        // Amenities filter
        const matchesAmenities = filters.amenities.length === 0 || 
                               filters.amenities.every(a => 
                                 court.amenities.some(ca => 
                                   ca.toLowerCase().includes(a.toLowerCase())
                                 )
                               );
        
        return matchesQuery && matchesSport && matchesRating && 
               matchesPrice && matchesIndoor && matchesAmenities;
      });
      
      // Sort courts
      const sorted = [...filtered].sort((a, b) => {
        if (filters.sortBy === 'distance') {
          // If coordinates are available, sort by distance
          if (coordinates) {
            const distanceA = calculateDistance(
              coordinates.lat, 
              coordinates.lng, 
              a.coordinates.lat, 
              a.coordinates.lng
            );
            
            const distanceB = calculateDistance(
              coordinates.lat, 
              coordinates.lng, 
              b.coordinates.lat, 
              b.coordinates.lng
            );
            
            return distanceA - distanceB;
          }
          return 0;
        } else if (filters.sortBy === 'rating') {
          return b.rating - a.rating;
        } else if (filters.sortBy === 'price-low') {
          return a.price - b.price;
        } else if (filters.sortBy === 'price-high') {
          return b.price - a.price;
        } else if (filters.sortBy === 'popularity') {
          return b.reviews - a.reviews;
        }
        return 0;
      });
      
      setFilteredCourts(sorted);
      setIsLoading(false);
    }, 800);
  }, [filters, coordinates]);
  
  // Calculate distance between two coordinates
  const calculateDistance = (lat1: number, lng1: number, lat2: number, lng2: number): number => {
    const R = 6371; // Earth's radius in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = 
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLng / 2) * Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };
  
  // Handle search
  const handleSearch = (newFilters: SearchFilters) => {
    setFilters(newFilters);
  };
  
  // Handle filter change
  const handleFilterChange = (key: string, value: any) => {
    if (key === 'reset') {
      setFilters({
        query: '',
        sport: 'all',
        maxDistance: 10,
        priceRange: [0, 200],
        rating: 0,
        amenities: [],
        sortBy: 'distance',
      });
      return;
    }
    
    setFilters(prev => {
      if (key === 'amenities') {
        // For amenities, we need to add to the existing array
        const currentAmenities = [...prev.amenities];
        
        // Add new amenities that aren't already in the array
        const newAmenities = value.filter((a: string) => !currentAmenities.includes(a));
        
        return {
          ...prev,
          amenities: [...currentAmenities, ...newAmenities],
        };
      }
      
      return { ...prev, [key]: value };
    });
  };
  
  // Handle voice search
  const handleVoiceSearch = (query: string) => {
    setFilters(prev => ({ ...prev, query }));
    setShowVoiceSearch(false);
  };
  
  // Handle court selection
  const handleCourtSelect = (court: Court) => {
    setSelectedCourt(court);
  };
  
  // Mobile version
  if (isMobile) {
    return (
      <MobileContainer title="Search Courts" showSearch={false}>
        <div className="p-4">
          {/* Search Input */}
          <div className="relative mb-4">
            <input
              type="text"
              placeholder="Search courts, facilities, or locations..."
              value={filters.query}
              onChange={(e) => setFilters(prev => ({ ...prev, query: e.target.value }))}
              className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <button
              onClick={() => setShowVoiceSearch(true)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-blue-500"
            >
              <Mic className="h-5 w-5" />
            </button>
          </div>
          
          {/* Quick Filters */}
          <div className="flex overflow-x-auto pb-2 mb-4 -mx-4 px-4">
            <div className="flex space-x-2">
              {['all', 'basketball', 'tennis', 'football', 'volleyball', 'swimming'].map(sport => (
                <button
                  key={sport}
                  onClick={() => setFilters(prev => ({ ...prev, sport }))}
                  className={`px-3 py-2 rounded-lg whitespace-nowrap ${
                    filters.sport === sport
                      ? 'bg-blue-100 text-blue-700 font-medium'
                      : 'bg-gray-100 text-gray-700'
                  }`}
                >
                  {sport === 'all' ? 'All Sports' : sport.charAt(0).toUpperCase() + sport.slice(1)}
                </button>
              ))}
            </div>
          </div>
          
          {/* Results */}
          <div className="space-y-4">
            {isLoading ? (
              <div className="flex justify-center items-center py-12">
                <Loader className="h-8 w-8 text-blue-600 animate-spin" />
              </div>
            ) : filteredCourts.length === 0 ? (
              <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 text-center">
                <Search className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-600">No courts found</p>
                <p className="text-sm text-gray-500 mt-2">Try adjusting your search</p>
              </div>
            ) : (
              filteredCourts.slice(0, 10).map(court => (
                <Link to="/booking" key={court.id}>
                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                    <div className="relative h-40">
                      <OptimizedImage
                        src={court.image}
                        alt={court.name}
                        className="w-full h-full"
                        objectFit="cover"
                        width={400}
                        height={160}
                      />
                      <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full text-sm font-medium">
                        ${court.price}/hr
                      </div>
                      <div className="absolute bottom-2 left-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full text-sm font-medium flex items-center">
                        <Star className="h-4 w-4 text-yellow-500 fill-current mr-1" />
                        {court.rating}
                      </div>
                    </div>
                    
                    <div className="p-4">
                      <h3 className="font-bold text-gray-900 mb-1">{court.name}</h3>
                      <div className="flex items-center text-gray-600 mb-2">
                        <MapPin className="h-4 w-4 mr-1" />
                        <span className="text-sm">{court.location}</span>
                      </div>
                      
                      <div className="flex flex-wrap gap-1 mb-3">
                        {court.sport.slice(0, 2).map(sport => (
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
                      
                      <Button className="w-full flex items-center justify-center">
                        <Calendar className="h-4 w-4 mr-2" />
                        Book Now
                      </Button>
                    </div>
                  </div>
                </Link>
              ))
            )}
            
            {filteredCourts.length > 10 && (
              <div className="text-center pt-4">
                <Button variant="outline">
                  Load More Results
                </Button>
              </div>
            )}
          </div>
        </div>
        
        {/* Voice Search Modal */}
        {showVoiceSearch && (
          <VoiceSearch
            onSearch={handleVoiceSearch}
            onClose={() => setShowVoiceSearch(false)}
            onFilterChange={handleFilterChange}
          />
        )}
      </MobileContainer>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Search Courts</h1>
          <p className="text-gray-600">Find and book the perfect venue for your next game</p>
        </div>
        
        {/* Advanced Search Filters */}
        <AdvancedSearchFilters
          onSearch={handleSearch}
          initialFilters={filters}
          showMap={showMap}
          onToggleMap={() => setShowMap(!showMap)}
        />
        
        {/* Results View */}
        <div className="mt-8">
          {showMap ? (
            <MapView
              courts={filteredCourts}
              selectedCourt={selectedCourt}
              onCourtSelect={handleCourtSelect}
              onViewDetails={(court) => console.log('View details:', court.id)}
              onBookNow={(court) => console.log('Book now:', court.id)}
            />
          ) : (
            <SearchResultsView
              courts={filteredCourts}
              isLoading={isLoading}
              filters={filters}
              onCourtSelect={handleCourtSelect}
              onFilterChange={handleFilterChange}
            />
          )}
        </div>
        
        {/* Voice Search Modal */}
        {showVoiceSearch && (
          <VoiceSearch
            onSearch={handleVoiceSearch}
            onClose={() => setShowVoiceSearch(false)}
            onFilterChange={handleFilterChange}
          />
        )}
        
        {/* Saved Searches Modal */}
        {showSavedSearches && (
          <SavedSearches
            onLoadSearch={handleSearch}
            onClose={() => setShowSavedSearches(false)}
            currentFilters={filters}
          />
        )}
      </div>
    </div>
  );
};

// Mic icon component
function Mic(props: React.SVGProps<SVGSVGElement>) {
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
      <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
      <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
      <line x1="12" x2="12" y1="19" y2="22" />
    </svg>
  );
}

export default SearchPage;