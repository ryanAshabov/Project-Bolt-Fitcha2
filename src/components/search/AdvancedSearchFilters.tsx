import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  MapPin, 
  Calendar, 
  Clock, 
  DollarSign, 
  Star, 
  Wifi, 
  Car, 
  Utensils, 
  Users, 
  Thermometer, 
  Zap,
  Save,
  X,
  Trash,
  CheckCircle,
  Sliders,
  Mic,
  Bookmark
} from 'lucide-react';
import { Button } from '../ui/Button';
import { OptimizedImage } from '../ui/Image';
import { useGeolocation } from '../../hooks/useGeolocation';

// Types for search filters
export interface SearchFilters {
  query: string;
  sport: string;
  location?: string;
  maxDistance: number;
  priceRange: [number, number];
  rating: number;
  date?: string;
  time?: string;
  amenities: string[];
  isIndoor?: boolean;
  isVerified?: boolean;
  availability?: boolean;
  sortBy: 'distance' | 'rating' | 'price-low' | 'price-high' | 'popularity';
}

// Types for saved searches
interface SavedSearch {
  id: string;
  name: string;
  filters: SearchFilters;
  createdAt: Date;
}

interface AdvancedSearchFiltersProps {
  onSearch: (filters: SearchFilters) => void;
  initialFilters?: Partial<SearchFilters>;
  showMap?: boolean;
  onToggleMap?: () => void;
}

// Sport categories with icons
const SPORT_CATEGORIES = [
  { id: 'all', name: 'All Sports', icon: '🏆' },
  { id: 'basketball', name: 'Basketball', icon: '🏀' },
  { id: 'tennis', name: 'Tennis', icon: '🎾' },
  { id: 'football', name: 'Football', icon: '⚽' },
  { id: 'volleyball', name: 'Volleyball', icon: '🏐' },
  { id: 'swimming', name: 'Swimming', icon: '🏊' },
  { id: 'gym', name: 'Gym', icon: '🏋️' },
  { id: 'badminton', name: 'Badminton', icon: '🏸' },
  { id: 'squash', name: 'Squash', icon: '🎯' },
];

// Amenities with icons
const AMENITIES = [
  { id: 'parking', name: 'Parking', icon: Car },
  { id: 'wifi', name: 'WiFi', icon: Wifi },
  { id: 'cafe', name: 'Café', icon: Utensils },
  { id: 'showers', name: 'Showers', icon: Users },
  { id: 'lockers', name: 'Lockers', icon: Bookmark },
  { id: 'ac', name: 'Air Conditioning', icon: Thermometer },
];

// Sort options
const SORT_OPTIONS = [
  { value: 'distance', label: 'Nearest First' },
  { value: 'rating', label: 'Highest Rated' },
  { value: 'price-low', label: 'Price: Low to High' },
  { value: 'price-high', label: 'Price: High to Low' },
  { value: 'popularity', label: 'Most Popular' },
];

// Default filters
const DEFAULT_FILTERS: SearchFilters = {
  query: '',
  sport: 'all',
  maxDistance: 10,
  priceRange: [0, 200],
  rating: 0,
  amenities: [],
  sortBy: 'distance',
};

export const AdvancedSearchFilters: React.FC<AdvancedSearchFiltersProps> = ({
  onSearch,
  initialFilters,
  showMap = false,
  onToggleMap,
}) => {
  // State for filters
  const [filters, setFilters] = useState<SearchFilters>({
    ...DEFAULT_FILTERS,
    ...initialFilters,
  });
  
  // State for UI
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [showSavedSearches, setShowSavedSearches] = useState(false);
  const [savedSearches, setSavedSearches] = useState<SavedSearch[]>([]);
  const [newSearchName, setNewSearchName] = useState('');
  const [isVoiceSearchActive, setIsVoiceSearchActive] = useState(false);
  const [voiceSearchText, setVoiceSearchText] = useState('');
  const [isListening, setIsListening] = useState(false);
  
  // Get user location
  const { coordinates } = useGeolocation();
  
  // Load saved searches from localStorage
  useEffect(() => {
    const savedSearchesJson = localStorage.getItem('savedSearches');
    if (savedSearchesJson) {
      try {
        const parsed = JSON.parse(savedSearchesJson);
        setSavedSearches(parsed.map((search: any) => ({
          ...search,
          createdAt: new Date(search.createdAt),
        })));
      } catch (error) {
        console.error('Error parsing saved searches:', error);
      }
    }
  }, []);
  
  // Save searches to localStorage
  const saveSearches = (searches: SavedSearch[]) => {
    localStorage.setItem('savedSearches', JSON.stringify(searches));
    setSavedSearches(searches);
  };
  
  // Handle filter changes
  const handleFilterChange = (key: keyof SearchFilters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };
  
  // Handle amenity toggle
  const handleAmenityToggle = (amenityId: string) => {
    setFilters(prev => {
      const amenities = prev.amenities.includes(amenityId)
        ? prev.amenities.filter(id => id !== amenityId)
        : [...prev.amenities, amenityId];
      
      return { ...prev, amenities };
    });
  };
  
  // Handle search submission
  const handleSearch = () => {
    onSearch(filters);
  };
  
  // Reset filters to default
  const handleReset = () => {
    setFilters(DEFAULT_FILTERS);
  };
  
  // Save current search
  const handleSaveSearch = () => {
    if (!newSearchName.trim()) return;
    
    const newSearch: SavedSearch = {
      id: `search-${Date.now()}`,
      name: newSearchName,
      filters: { ...filters },
      createdAt: new Date(),
    };
    
    const updatedSearches = [...savedSearches, newSearch];
    saveSearches(updatedSearches);
    setNewSearchName('');
    setShowSavedSearches(false);
  };
  
  // Load a saved search
  const handleLoadSearch = (search: SavedSearch) => {
    setFilters(search.filters);
    setShowSavedSearches(false);
    onSearch(search.filters);
  };
  
  // Delete a saved search
  const handleDeleteSearch = (searchId: string) => {
    const updatedSearches = savedSearches.filter(search => search.id !== searchId);
    saveSearches(updatedSearches);
  };
  
  // Handle voice search
  const startVoiceSearch = () => {
    if (!('webkitSpeechRecognition' in window)) {
      alert('Voice search is not supported in your browser.');
      return;
    }
    
    setIsVoiceSearchActive(true);
    setIsListening(true);
    
    const recognition = new (window as any).webkitSpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = true;
    
    recognition.onstart = () => {
      setIsListening(true);
      setVoiceSearchText('Listening...');
    };
    
    recognition.onresult = (event: any) => {
      const transcript = Array.from(event.results)
        .map((result: any) => result[0])
        .map((result: any) => result.transcript)
        .join('');
      
      setVoiceSearchText(transcript);
      
      // Process voice commands
      if (transcript.toLowerCase().includes('basketball')) {
        handleFilterChange('sport', 'basketball');
      }
      
      if (transcript.toLowerCase().includes('tennis')) {
        handleFilterChange('sport', 'tennis');
      }
      
      if (transcript.toLowerCase().includes('football')) {
        handleFilterChange('sport', 'football');
      }
      
      if (transcript.toLowerCase().includes('indoor')) {
        handleFilterChange('isIndoor', true);
      }
      
      if (transcript.toLowerCase().includes('outdoor')) {
        handleFilterChange('isIndoor', false);
      }
      
      if (transcript.toLowerCase().includes('near me')) {
        handleFilterChange('maxDistance', 5);
      }
      
      // Set the search query
      handleFilterChange('query', transcript);
    };
    
    recognition.onerror = (event: any) => {
      console.error('Speech recognition error', event.error);
      setIsListening(false);
      setVoiceSearchText('Error: ' + event.error);
    };
    
    recognition.onend = () => {
      setIsListening(false);
      setTimeout(() => {
        setIsVoiceSearchActive(false);
        handleSearch();
      }, 1000);
    };
    
    recognition.start();
  };
  
  return (
    <div className="space-y-6">
      {/* Main Search Bar */}
      <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search Input */}
          <div className="flex-1 relative">
            {isVoiceSearchActive ? (
              <div className="w-full px-4 py-3 border border-blue-300 rounded-lg bg-blue-50 flex items-center">
                <div className={`w-3 h-3 rounded-full ${isListening ? 'bg-red-500 animate-pulse' : 'bg-gray-400'} mr-3`}></div>
                <span className="flex-1">{voiceSearchText}</span>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setIsVoiceSearchActive(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <>
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Search courts, facilities, or locations..."
                  value={filters.query}
                  onChange={(e) => handleFilterChange('query', e.target.value)}
                  className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <button
                  onClick={startVoiceSearch}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-blue-500"
                >
                  <Mic className="h-5 w-5" />
                </button>
              </>
            )}
          </div>
          
          {/* Quick Actions */}
          <div className="flex gap-2 flex-wrap">
            <Button
              variant={showMap ? 'primary' : 'outline'}
              onClick={onToggleMap}
              className="flex items-center gap-2"
            >
              <MapPin className="h-4 w-4" />
              {showMap ? 'List View' : 'Map View'}
            </Button>
            
            <select
              value={filters.sortBy}
              onChange={(e) => handleFilterChange('sortBy', e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {SORT_OPTIONS.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            
            <Button
              variant={showAdvancedFilters ? 'primary' : 'outline'}
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
              className="flex items-center gap-2"
            >
              <Filter className="h-4 w-4" />
              {showAdvancedFilters ? 'Hide Filters' : 'More Filters'}
            </Button>
            
            <Button
              variant="outline"
              onClick={() => setShowSavedSearches(!showSavedSearches)}
              className="flex items-center gap-2"
            >
              <Save className="h-4 w-4" />
              Saved
            </Button>
          </div>
        </div>
        
        {/* Sport Categories */}
        <div className="mt-6">
          <div className="flex flex-wrap gap-3">
            {SPORT_CATEGORIES.map(sport => (
              <button
                key={sport.id}
                onClick={() => handleFilterChange('sport', sport.id)}
                className={`px-4 py-2 rounded-lg border-2 transition-all duration-200 flex items-center gap-2 ${
                  filters.sport === sport.id
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-200 hover:border-gray-300 text-gray-700'
                }`}
              >
                <span className="text-xl">{sport.icon}</span>
                <span>{sport.name}</span>
              </button>
            ))}
          </div>
        </div>
        
        {/* Advanced Filters */}
        {showAdvancedFilters && (
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <Sliders className="h-5 w-5 text-blue-600 mr-2" />
                Advanced Filters
              </h3>
              
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleReset}
                className="flex items-center"
              >
                <Trash className="h-4 w-4 mr-1" />
                Reset Filters
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Location & Distance */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Location & Distance
                </label>
                <div className="space-y-3">
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <input
                      type="text"
                      placeholder="Enter location..."
                      value={filters.location || ''}
                      onChange={(e) => handleFilterChange('location', e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm text-gray-600">Max Distance: {filters.maxDistance}km</span>
                      <span className="text-sm text-blue-600 cursor-pointer" onClick={() => handleFilterChange('maxDistance', 10)}>
                        Reset
                      </span>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max="50"
                      value={filters.maxDistance}
                      onChange={(e) => handleFilterChange('maxDistance', parseInt(e.target.value))}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>1km</span>
                      <span>25km</span>
                      <span>50km</span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Price Range */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price Range ($/hour)
                </label>
                <div className="space-y-3">
                  <div className="flex justify-between mb-1">
                    <span className="text-sm text-gray-600">${filters.priceRange[0]} - ${filters.priceRange[1]}</span>
                    <span className="text-sm text-blue-600 cursor-pointer" onClick={() => handleFilterChange('priceRange', [0, 200])}>
                      Reset
                    </span>
                  </div>
                  <div className="flex gap-4">
                    <input
                      type="range"
                      min="0"
                      max="200"
                      value={filters.priceRange[0]}
                      onChange={(e) => handleFilterChange('priceRange', [parseInt(e.target.value), filters.priceRange[1]])}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    />
                    <input
                      type="range"
                      min="0"
                      max="200"
                      value={filters.priceRange[1]}
                      onChange={(e) => handleFilterChange('priceRange', [filters.priceRange[0], parseInt(e.target.value)])}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>$0</span>
                    <span>$100</span>
                    <span>$200+</span>
                  </div>
                </div>
              </div>
              
              {/* Rating */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Minimum Rating
                </label>
                <div className="space-y-3">
                  <div className="flex justify-between mb-1">
                    <div className="flex items-center">
                      {[1, 2, 3, 4, 5].map(star => (
                        <Star
                          key={star}
                          className={`h-5 w-5 ${star <= filters.rating ? 'text-yellow-500 fill-current' : 'text-gray-300'}`}
                          onClick={() => handleFilterChange('rating', star)}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-blue-600 cursor-pointer" onClick={() => handleFilterChange('rating', 0)}>
                      Reset
                    </span>
                  </div>
                </div>
              </div>
              
              {/* Date & Time */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date & Time
                </label>
                <div className="space-y-3">
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <input
                      type="date"
                      value={filters.date || ''}
                      onChange={(e) => handleFilterChange('date', e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  
                  <div className="relative">
                    <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <select
                      value={filters.time || ''}
                      onChange={(e) => handleFilterChange('time', e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Any Time</option>
                      <option value="morning">Morning (6AM-12PM)</option>
                      <option value="afternoon">Afternoon (12PM-5PM)</option>
                      <option value="evening">Evening (5PM-10PM)</option>
                      <option value="night">Night (10PM-6AM)</option>
                    </select>
                  </div>
                </div>
              </div>
              
              {/* Amenities */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Amenities
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {AMENITIES.map(amenity => {
                    const Icon = amenity.icon;
                    return (
                      <button
                        key={amenity.id}
                        onClick={() => handleAmenityToggle(amenity.id)}
                        className={`flex items-center p-2 rounded-lg border ${
                          filters.amenities.includes(amenity.id)
                            ? 'border-blue-500 bg-blue-50 text-blue-700'
                            : 'border-gray-200 hover:border-gray-300 text-gray-700'
                        }`}
                      >
                        <Icon className="h-4 w-4 mr-2" />
                        <span className="text-sm">{amenity.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
              
              {/* Additional Filters */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Additional Filters
                </label>
                <div className="space-y-3">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={filters.isIndoor === true}
                      onChange={(e) => handleFilterChange('isIndoor', e.target.checked ? true : undefined)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-sm text-gray-700">Indoor Only</span>
                  </label>
                  
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={filters.isVerified === true}
                      onChange={(e) => handleFilterChange('isVerified', e.target.checked ? true : undefined)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-sm text-gray-700">Verified Venues Only</span>
                  </label>
                  
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={filters.availability === true}
                      onChange={(e) => handleFilterChange('availability', e.target.checked ? true : undefined)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-sm text-gray-700">Show Available Only</span>
                  </label>
                </div>
              </div>
            </div>
            
            <div className="mt-6 flex justify-end">
              <Button
                onClick={handleSearch}
                className="flex items-center bg-blue-600 hover:bg-blue-700"
              >
                <Search className="h-4 w-4 mr-2" />
                Apply Filters
              </Button>
            </div>
          </div>
        )}
        
        {/* Saved Searches Panel */}
        {showSavedSearches && (
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Saved Searches</h3>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setShowSavedSearches(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            {/* Save Current Search */}
            <div className="bg-blue-50 rounded-lg p-4 border border-blue-200 mb-4">
              <h4 className="font-medium text-blue-900 mb-2">Save Current Search</h4>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Enter a name for this search..."
                  value={newSearchName}
                  onChange={(e) => setNewSearchName(e.target.value)}
                  className="flex-1 px-3 py-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <Button
                  onClick={handleSaveSearch}
                  disabled={!newSearchName.trim()}
                  className="flex items-center"
                >
                  <Save className="h-4 w-4 mr-2" />
                  Save
                </Button>
              </div>
            </div>
            
            {/* Saved Searches List */}
            {savedSearches.length > 0 ? (
              <div className="space-y-3">
                {savedSearches.map(search => (
                  <div 
                    key={search.id}
                    className="bg-white rounded-lg p-4 border border-gray-200 hover:border-gray-300 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-gray-900">{search.name}</h4>
                        <p className="text-sm text-gray-500">
                          {search.filters.sport !== 'all' ? SPORT_CATEGORIES.find(s => s.id === search.filters.sport)?.name : 'All Sports'}
                          {search.filters.location ? ` • ${search.filters.location}` : ''}
                          {search.filters.maxDistance ? ` • ${search.filters.maxDistance}km` : ''}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleLoadSearch(search)}
                        >
                          <Search className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleDeleteSearch(search.id)}
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 bg-gray-50 rounded-lg">
                <Save className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">No saved searches yet</p>
                <p className="text-sm text-gray-400 mt-1">Save your favorite searches for quick access</p>
              </div>
            )}
          </div>
        )}
      </div>
      
      {/* Active Filters Summary */}
      {(filters.sport !== 'all' || 
        filters.rating > 0 || 
        filters.amenities.length > 0 || 
        filters.isIndoor !== undefined || 
        filters.isVerified !== undefined ||
        filters.date !== undefined ||
        filters.time !== undefined) && (
        <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-medium text-blue-900">Active Filters</h3>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleReset}
              className="text-blue-700 border-blue-300 hover:bg-blue-100"
            >
              Clear All
            </Button>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {filters.sport !== 'all' && (
              <div className="bg-white px-3 py-1.5 rounded-full text-sm flex items-center">
                <span>{SPORT_CATEGORIES.find(s => s.id === filters.sport)?.name}</span>
                <button 
                  onClick={() => handleFilterChange('sport', 'all')}
                  className="ml-2 text-gray-400 hover:text-gray-600"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            )}
            
            {filters.rating > 0 && (
              <div className="bg-white px-3 py-1.5 rounded-full text-sm flex items-center">
                <span>{filters.rating}+ Stars</span>
                <button 
                  onClick={() => handleFilterChange('rating', 0)}
                  className="ml-2 text-gray-400 hover:text-gray-600"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            )}
            
            {filters.isIndoor !== undefined && (
              <div className="bg-white px-3 py-1.5 rounded-full text-sm flex items-center">
                <span>{filters.isIndoor ? 'Indoor Only' : 'Outdoor Only'}</span>
                <button 
                  onClick={() => handleFilterChange('isIndoor', undefined)}
                  className="ml-2 text-gray-400 hover:text-gray-600"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            )}
            
            {filters.isVerified !== undefined && filters.isVerified && (
              <div className="bg-white px-3 py-1.5 rounded-full text-sm flex items-center">
                <span>Verified Only</span>
                <button 
                  onClick={() => handleFilterChange('isVerified', undefined)}
                  className="ml-2 text-gray-400 hover:text-gray-600"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            )}
            
            {filters.date && (
              <div className="bg-white px-3 py-1.5 rounded-full text-sm flex items-center">
                <span>Date: {new Date(filters.date).toLocaleDateString()}</span>
                <button 
                  onClick={() => handleFilterChange('date', undefined)}
                  className="ml-2 text-gray-400 hover:text-gray-600"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            )}
            
            {filters.time && (
              <div className="bg-white px-3 py-1.5 rounded-full text-sm flex items-center">
                <span>Time: {filters.time}</span>
                <button 
                  onClick={() => handleFilterChange('time', undefined)}
                  className="ml-2 text-gray-400 hover:text-gray-600"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            )}
            
            {filters.amenities.map(amenity => (
              <div key={amenity} className="bg-white px-3 py-1.5 rounded-full text-sm flex items-center">
                <span>{AMENITIES.find(a => a.id === amenity)?.name}</span>
                <button 
                  onClick={() => handleAmenityToggle(amenity)}
                  className="ml-2 text-gray-400 hover:text-gray-600"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};