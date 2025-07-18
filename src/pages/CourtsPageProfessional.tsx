/**
 * Professional Courts Page - Phase 1: Court Database & Search
 * 
 * Advanced courts discovery system with:
 * - Professional Court Database
 * - Advanced filtering and search
 * - Real-time availability with pricing
 * - Quick booking system
 * - Interactive features
 * - Professional UI/UX
 * 
 * @author Fitcha Team
 * @version 3.0.0 - Professional Court Booking System
 */

import React, { useState, useEffect } from 'react';
import { 
  Search, 
  MapPin, 
  Star, 
  Clock,
  Wifi,
  Car,
  Utensils,
  Users,
  Globe,
  Bookmark,
  BookmarkCheck,
  Navigation,
  CheckCircle,
  Shield,
  DollarSign,
  Calendar,
  Phone,
  Mail,
  Filter,
  Zap,
  Award,
  Thermometer,
  Activity,
  CreditCard,
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { MobileContainer } from '../components/ui/MobileContainer';
import { useDeviceDetection } from '../components/ui/MobileDetection';
import { CourtCard } from '../components/courts/CourtCard';
import { Link } from 'react-router-dom';

// Court categories with enhanced data
const COURT_TYPES = [
  { id: 'basketball', name: 'Basketball', icon: '🏀', color: 'orange' },
  { id: 'tennis', name: 'Tennis', icon: '🎾', color: 'green' },
  { id: 'football', name: 'Football', icon: '⚽', color: 'blue' },
  { id: 'volleyball', name: 'Volleyball', icon: '🏐', color: 'purple' },
  { id: 'swimming', name: 'Swimming', icon: '🏊', color: 'cyan' },
  { id: 'gym', name: 'Gym', icon: '🏋️', color: 'red' },
  { id: 'badminton', name: 'Badminton', icon: '🏸', color: 'yellow' },
  { id: 'squash', name: 'Squash', icon: '🎯', color: 'indigo' },
];

// Enhanced Mock Courts Database
const mockCourts = [
  {
    id: 'court-1',
    name: 'City Sports Complex',
    type: 'basketball',
    address: 'Downtown Cairo, Egypt',
    coordinates: { lat: 30.0444, lng: 31.2357 },
    distance: 2.1,
    rating: 4.8,
    reviewCount: 156,
    priceRange: '$$',
    hourlyRate: 50,
    peakHourRate: 75,
    weekendRate: 65,
    images: [
      'https://images.pexels.com/photos/1099816/pexels-photo-1099816.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&dpr=2',
      'https://images.pexels.com/photos/1552252/pexels-photo-1552252.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&dpr=2',
      'https://images.pexels.com/photos/2291599/pexels-photo-2291599.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&dpr=2',
    ],
    description: 'Premium basketball courts with professional lighting and sound system.',
    longDescription: 'State-of-the-art basketball facility featuring 4 indoor courts with NBA-standard flooring, professional lighting, and advanced sound system. Perfect for competitive games, training sessions, and tournaments.',
    amenities: ['parking', 'wifi', 'restrooms', 'lockers', 'cafe', 'ac', 'security'],
    openHours: '6:00 AM - 11:00 PM',
    phone: '+20 2 1234567',
    website: 'citysports.com',
    email: 'info@citysports.com',
    isVerified: true,
    isBookmarked: false,
    courtCount: 4,
    maxPlayers: 10,
    minBookingHours: 1,
    cancellationPolicy: '24h',
    equipment: ['Basketball', 'Scoreboard', 'Sound System', 'First Aid'],
    surface: 'Professional Wood',
    indoor: true,
    availability: {
      today: [
        { time: '9:00 AM', price: 50, available: true },
        { time: '11:00 AM', price: 50, available: true },
        { time: '2:00 PM', price: 75, available: true },
        { time: '6:00 PM', price: 75, available: false },
        { time: '8:00 PM', price: 75, available: true },
      ],
      tomorrow: [
        { time: '8:00 AM', price: 50, available: true },
        { time: '10:00 AM', price: 50, available: true },
        { time: '1:00 PM', price: 75, available: true },
        { time: '4:00 PM', price: 75, available: true },
        { time: '7:00 PM', price: 75, available: true },
      ],
    },
    features: [
      'Professional courts',
      'Air conditioning',
      'Equipment rental',
      'Coaching available',
      'Tournament hosting',
      'Live streaming setup',
    ],
    services: ['Personal Training', 'Team Coaching', 'Equipment Rental', 'Event Hosting'],
    popularTimes: {
      morning: 'Low',
      afternoon: 'High',
      evening: 'Very High',
    },
  },
  {
    id: 'court-2',
    name: 'Green Valley Tennis Club',
    type: 'tennis',
    address: 'New Cairo, Egypt',
    coordinates: { lat: 30.0276, lng: 31.4202 },
    distance: 5.7,
    rating: 4.6,
    reviewCount: 89,
    priceRange: '$$$',
    hourlyRate: 80,
    peakHourRate: 120,
    weekendRate: 100,
    images: [
      'https://images.pexels.com/photos/209977/pexels-photo-209977.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&dpr=2',
      'https://images.pexels.com/photos/1263426/pexels-photo-1263426.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&dpr=2',
      'https://images.pexels.com/photos/114296/pexels-photo-114296.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&dpr=2',
    ],
    description: 'Exclusive tennis club with clay courts and professional facilities.',
    longDescription: 'Premier tennis club featuring 6 championship clay courts, professional coaching staff, and luxury amenities. Host to regional tournaments and perfect for serious players.',
    amenities: ['parking', 'cafe', 'pro_shop', 'showers', 'massage', 'wifi', 'lockers'],
    openHours: '5:00 AM - 10:00 PM',
    phone: '+20 2 2345678',
    website: 'greenvalleytennis.com',
    email: 'reservations@greenvalleytennis.com',
    isVerified: true,
    isBookmarked: true,
    courtCount: 6,
    maxPlayers: 4,
    minBookingHours: 1,
    cancellationPolicy: '48h',
    equipment: ['Tennis Rackets', 'Ball Machine', 'Umpire Chair', 'Court Maintenance'],
    surface: 'Clay Courts',
    indoor: false,
    availability: {
      today: [
        { time: '7:00 AM', price: 80, available: true },
        { time: '10:00 AM', price: 80, available: true },
        { time: '3:00 PM', price: 120, available: true },
        { time: '5:00 PM', price: 120, available: false },
      ],
      tomorrow: [
        { time: '6:00 AM', price: 80, available: true },
        { time: '9:00 AM', price: 80, available: true },
        { time: '12:00 PM', price: 120, available: true },
        { time: '4:00 PM', price: 120, available: true },
        { time: '6:00 PM', price: 120, available: true },
      ],
    },
    features: [
      'Clay courts',
      'Professional coaching',
      'Tournament facilities',
      'Member privileges',
      'Ball machine rental',
      'Video analysis',
    ],
    services: ['Professional Coaching', 'Racket Stringing', 'Tournament Training', 'Fitness Programs'],
    popularTimes: {
      morning: 'Medium',
      afternoon: 'High',
      evening: 'Very High',
    },
  },
  {
    id: 'court-3',
    name: 'Elite Football Academy',
    type: 'football',
    address: 'Maadi, Cairo',
    coordinates: { lat: 29.9597, lng: 31.2756 },
    distance: 6.8,
    rating: 4.5,
    reviewCount: 187,
    priceRange: '$$',
    hourlyRate: 60,
    peakHourRate: 90,
    weekendRate: 80,
    images: [
      'https://images.pexels.com/photos/1884574/pexels-photo-1884574.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&dpr=2',
      'https://images.pexels.com/photos/114296/pexels-photo-114296.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&dpr=2',
      'https://images.pexels.com/photos/1263426/pexels-photo-1263426.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&dpr=2',
    ],
    description: 'Professional football academy with FIFA-standard pitches and training facilities.',
    longDescription: 'Premier football training facility featuring multiple FIFA-standard pitches, professional coaching staff, and comprehensive training programs for all skill levels.',
    amenities: ['parking', 'restrooms', 'equipment_rental', 'cafe', 'medical_room', 'wifi'],
    openHours: '6:00 AM - 11:00 PM',
    phone: '+20 2 5678901',
    website: 'elitefootball.com',
    email: 'bookings@elitefootball.com',
    isVerified: true,
    isBookmarked: true,
    courtCount: 4,
    maxPlayers: 22,
    minBookingHours: 1,
    cancellationPolicy: '24h',
    equipment: ['Football Goals', 'Corner Flags', 'Training Cones', 'First Aid Kit'],
    surface: 'Natural Grass',
    indoor: false,
    availability: {
      today: [
        { time: '8:00 AM', price: 60, available: true },
        { time: '4:00 PM', price: 90, available: true },
        { time: '6:00 PM', price: 90, available: false },
        { time: '8:00 PM', price: 90, available: true },
      ],
      tomorrow: [
        { time: '7:00 AM', price: 60, available: true },
        { time: '10:00 AM', price: 60, available: true },
        { time: '5:00 PM', price: 90, available: true },
        { time: '7:00 PM', price: 90, available: true },
        { time: '9:00 PM', price: 90, available: true },
      ],
    },
    features: [
      'FIFA-standard pitch',
      'Floodlights',
      'Equipment included',
      'Team changing rooms',
      'Video analysis',
      'Professional coaching',
    ],
    services: ['Youth Training', 'Adult Leagues', 'Private Coaching', 'Tournament Hosting'],
    popularTimes: {
      morning: 'Low',
      afternoon: 'High',
      evening: 'Very High',
    },
  },
];

const CourtsPageProfessional: React.FC = () => {
  // Basic state
  const [searchQuery, setSearchQuery] = useState('');
  const { isMobile } = useDeviceDetection();
  const [selectedType, setSelectedType] = useState('');
  const [priceRange, setPriceRange] = useState('');
  const [sortBy, setSortBy] = useState('distance');
  const [showMap, setShowMap] = useState(false);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [filteredCourts, setFilteredCourts] = useState(mockCourts);
  const [bookmarkedCourts, setBookmarkedCourts] = useState<string[]>(['court-2', 'court-3']);
  
  // Advanced filters
  const [maxDistance, setMaxDistance] = useState(20);
  const [minRating, setMinRating] = useState(0);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [isVerifiedOnly, setIsVerifiedOnly] = useState(false);
  const [isIndoorOnly, setIsIndoorOnly] = useState(false);
  const [maxPrice, setMaxPrice] = useState(200);

  // Enhanced Filter Function
  useEffect(() => {
    const filtered = mockCourts.filter(court => {
      // Basic filters
      const nameMatch = court.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                       court.address.toLowerCase().includes(searchQuery.toLowerCase());
      const typeMatch = !selectedType || court.type === selectedType;
      const priceRangeFilter = !priceRange || court.priceRange === priceRange;
      
      // Advanced filters
      const distanceMatch = court.distance <= maxDistance;
      const ratingMatch = court.rating >= minRating;
      const priceMatch = court.hourlyRate <= maxPrice;
      const verifiedMatch = !isVerifiedOnly || court.isVerified;
      const indoorMatch = !isIndoorOnly || court.indoor;
      
      // Amenities filter
      const amenitiesMatch = selectedAmenities.length === 0 || 
        selectedAmenities.every(amenity => court.amenities.includes(amenity));
      
      return nameMatch && typeMatch && priceRangeFilter && distanceMatch && 
             ratingMatch && priceMatch && verifiedMatch && 
             indoorMatch && amenitiesMatch;
    });

    // Sort courts
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'distance':
          return a.distance - b.distance;
        case 'rating':
          return b.rating - a.rating;
        case 'price-low':
          return a.hourlyRate - b.hourlyRate;
        case 'price-high':
          return b.hourlyRate - a.hourlyRate;
        case 'popularity':
          return b.reviewCount - a.reviewCount;
        default:
          return a.distance - b.distance;
      }
    });

    setFilteredCourts(filtered);
  }, [searchQuery, selectedType, priceRange, sortBy, maxDistance, minRating, 
      selectedAmenities, isVerifiedOnly, isIndoorOnly, maxPrice]);

  // Helper functions
  const toggleBookmark = (courtId: string) => {
    setBookmarkedCourts(prev => 
      prev.includes(courtId) 
        ? prev.filter(id => id !== courtId)
        : [...prev, courtId],
    );
  };

  const handleQuickBook = (courtId: string, timeSlot: string) => {
    alert(`Quick booking initiated for court ${courtId} at ${timeSlot}`);
  };

  const toggleAmenityFilter = (amenity: string) => {
    setSelectedAmenities(prev => 
      prev.includes(amenity)
        ? prev.filter(a => a !== amenity)
        : [...prev, amenity],
    );
  };

  const getAmenityIcon = (amenity: string) => {
    const icons: Record<string, React.ComponentType<{ className?: string }>> = {
      parking: Car,
      wifi: Wifi,
      cafe: Utensils,
      restrooms: Users,
      lockers: Shield,
      showers: Users,
      sauna: Users,
      pro_shop: Users,
      massage: Users,
      juice_bar: Utensils,
      equipment_rental: Users,
      ac: Thermometer,
      security: Shield,
      medical_room: Activity,
    };
    return icons[amenity] || Users;
  };

  // Mobile version of the courts page
  if (isMobile) {
    return (
      <MobileContainer title="Courts" showSearch>
        <div className="p-4">
          {/* Mobile Filters */}
          <div className="bg-white rounded-xl shadow-sm mb-4 p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-medium text-gray-900">Filters</h3>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
              >
                <Filter className="h-4 w-4 mr-1" />
                {showAdvancedFilters ? 'Hide' : 'Show'}
              </Button>
            </div>
            
            {/* Court Type Horizontal Scroll */}
            <div className="overflow-x-auto pb-2 -mx-4 px-4">
              <div className="flex space-x-2">
                <button
                  onClick={() => setSelectedType('')}
                  className={`px-3 py-2 rounded-lg whitespace-nowrap ${
                    selectedType === '' 
                      ? 'bg-blue-100 text-blue-700 font-medium' 
                      : 'bg-gray-100 text-gray-700'
                  }`}
                >
                  All Types
                </button>
                {COURT_TYPES.map((type) => (
                  <button
                    key={type.id}
                    onClick={() => setSelectedType(type.id)}
                    className={`px-3 py-2 rounded-lg flex items-center whitespace-nowrap ${
                      selectedType === type.id 
                        ? 'bg-blue-100 text-blue-700 font-medium' 
                        : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    <span className="mr-1">{type.icon}</span>
                    <span>{type.name}</span>
                  </button>
                ))}
              </div>
            </div>
            
            {/* Advanced Filters (Collapsible) */}
            {showAdvancedFilters && (
              <div className="mt-4 pt-4 border-t border-gray-200 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Price Range
                  </label>
                  <div className="flex space-x-2">
                    {['', '$', '$$', '$$$'].map((range) => (
                      <button
                        key={range || 'all'}
                        onClick={() => setPriceRange(range)}
                        className={`flex-1 py-2 rounded-lg text-center ${
                          priceRange === range 
                            ? 'bg-blue-100 text-blue-700 font-medium' 
                            : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {range === '' ? 'All' : range}
                      </button>
                    ))}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Sort By
                  </label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  >
                    <option value="distance">Nearest</option>
                    <option value="rating">Highest Rated</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="popularity">Most Popular</option>
                  </select>
                </div>
                
                <div className="flex items-center justify-between">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={isIndoorOnly}
                      onChange={(e) => setIsIndoorOnly(e.target.checked)}
                      className="rounded text-blue-600"
                    />
                    <span className="ml-2 text-sm text-gray-700">Indoor Only</span>
                  </label>
                  
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={isVerifiedOnly}
                      onChange={(e) => setIsVerifiedOnly(e.target.checked)}
                      className="rounded text-blue-600"
                    />
                    <span className="ml-2 text-sm text-gray-700">Verified Only</span>
                  </label>
                </div>
              </div>
            )}
          </div>
          
          {/* Mobile Court Cards */}
          <div className="space-y-4">
            {filteredCourts.map((court) => (
              <CourtCard 
                key={court.id} 
                court={{
                  id: court.id,
                  name: court.name,
                  sport: court.sport,
                  location: court.location,
                  address: court.address,
                  coordinates: court.coordinates,
                  price: court.hourlyRate,
                  rating: court.rating,
                  reviews: court.reviews,
                  image: court.images[0],
                  amenities: court.amenities,
                  isIndoor: court.indoor,
                  availability: [],
                  operatingHours: court.operatingHours,
                  weatherDependent: court.weatherDependent,
                }}
                compact={true}
              />
            ))}
            
            {filteredCourts.length === 0 && (
              <div className="bg-white rounded-xl shadow-sm p-8 text-center">
                <MapPin className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                <h3 className="text-lg font-medium text-gray-800 mb-1">No courts found</h3>
                <p className="text-gray-600">Try adjusting your filters</p>
              </div>
            )}
          </div>
        </div>
      </MobileContainer>
    );
  }

  const getPriceRangeSymbol = (range: string) => {
    switch (range) {
      case '$': return '💰';
      case '$$': return '💰💰';
      case '$$$': return '💰💰💰';
      default: return '💰';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-emerald-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Professional Header */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-emerald-600 bg-clip-text text-transparent mb-4">
            🏟️ Professional Court Database
          </h1>
          <p className="text-slate-600 text-xl max-w-2xl mx-auto">
            Discover and book premium sports facilities with real-time availability and instant booking
          </p>
          <div className="flex justify-center items-center gap-4 mt-4 text-sm text-slate-500">
            <div className="flex items-center gap-1">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span>Verified Venues</span>
            </div>
            <div className="flex items-center gap-1">
              <Zap className="h-4 w-4 text-blue-500" />
              <span>Instant Booking</span>
            </div>
            <div className="flex items-center gap-1">
              <DollarSign className="h-4 w-4 text-emerald-500" />
              <span>Best Prices</span>
            </div>
          </div>
        </div>

        {/* Advanced Search and Filters */}
        <div className="bg-white p-8 rounded-3xl shadow-xl border border-slate-200 mb-8">
          {/* Search Bar */}
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center mb-8">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 h-6 w-6" />
              <input
                type="text"
                placeholder="Search courts, facilities, or locations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg"
              />
            </div>

            <div className="flex gap-3 flex-wrap">
              <Button
                variant={showMap ? 'primary' : 'outline'}
                onClick={() => setShowMap(!showMap)}
                className="flex items-center gap-2 px-6 py-3"
              >
                <MapPin className="h-5 w-5" />
                {showMap ? 'List View' : 'Map View'}
              </Button>
              
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="distance">Nearest First</option>
                <option value="rating">Highest Rated</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="popularity">Most Popular</option>
              </select>

              <Button
                variant={showAdvancedFilters ? 'primary' : 'outline'}
                onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                className="flex items-center gap-2 px-6 py-3"
              >
                <Filter className="h-5 w-5" />
                Advanced Filters
              </Button>
            </div>
          </div>

          {/* Court Type Filter */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">Sport Types</h3>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => setSelectedType('')}
                className={`px-6 py-3 rounded-xl border-2 transition-all duration-200 ${
                  selectedType === '' 
                    ? 'bg-blue-500 text-white border-blue-500 shadow-lg' 
                    : 'border-slate-300 hover:border-slate-400 hover:shadow-md'
                }`}
              >
                All Sports
              </button>
              {COURT_TYPES.map((type) => (
                <button
                  key={type.id}
                  onClick={() => setSelectedType(type.id)}
                  className={`px-6 py-3 rounded-xl border-2 transition-all duration-200 flex items-center gap-3 ${
                    selectedType === type.id 
                      ? 'bg-blue-500 text-white border-blue-500 shadow-lg' 
                      : 'border-slate-300 hover:border-slate-400 hover:shadow-md'
                  }`}
                >
                  <span className="text-xl">{type.icon}</span>
                  <span className="font-medium">{type.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Price Range Filter */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">Price Range</h3>
            <div className="flex gap-3">
              {['', '$', '$$', '$$$'].map((range) => (
                <button
                  key={range || 'all'}
                  onClick={() => setPriceRange(range)}
                  className={`px-6 py-3 rounded-xl border-2 transition-all duration-200 ${
                    priceRange === range 
                      ? 'bg-blue-500 text-white border-blue-500 shadow-lg' 
                      : 'border-slate-300 hover:border-slate-400 hover:shadow-md'
                  }`}
                >
                  {range === '' ? 'All Prices' : getPriceRangeSymbol(range)}
                </button>
              ))}
            </div>
          </div>

          {/* Advanced Filters */}
          {showAdvancedFilters && (
            <div className="border-t border-slate-200 pt-8 mt-8">
              <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                <Zap className="h-6 w-6 text-blue-500" />
                Advanced Filters
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {/* Distance Filter */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-3">
                    Max Distance: {maxDistance}km
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="50"
                    value={maxDistance}
                    onChange={(e) => setMaxDistance(Number(e.target.value))}
                    className="w-full h-3 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                  />
                </div>

                {/* Rating Filter */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-3">
                    Min Rating: {minRating}★
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="5"
                    step="0.5"
                    value={minRating}
                    onChange={(e) => setMinRating(Number(e.target.value))}
                    className="w-full h-3 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                  />
                </div>

                {/* Price Filter */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-3">
                    Max Price: ${maxPrice}/hr
                  </label>
                  <input
                    type="range"
                    min="10"
                    max="300"
                    step="10"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(Number(e.target.value))}
                    className="w-full h-3 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                  />
                </div>

                {/* Quick Toggles */}
                <div className="space-y-4">
                  <label className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={isVerifiedOnly}
                      onChange={(e) => setIsVerifiedOnly(e.target.checked)}
                      className="w-4 h-4 rounded text-blue-500"
                    />
                    <span className="text-sm text-slate-700 flex items-center gap-2">
                      <Award className="h-4 w-4 text-blue-500" />
                      Verified Only
                    </span>
                  </label>
                  
                  <label className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={isIndoorOnly}
                      onChange={(e) => setIsIndoorOnly(e.target.checked)}
                      className="w-4 h-4 rounded text-blue-500"
                    />
                    <span className="text-sm text-slate-700 flex items-center gap-2">
                      <Thermometer className="h-4 w-4 text-blue-500" />
                      Indoor Only
                    </span>
                  </label>
                </div>
              </div>

              {/* Amenities Filter */}
              <div className="mt-8">
                <h4 className="text-lg font-semibold text-slate-800 mb-4">Required Amenities</h4>
                <div className="flex flex-wrap gap-3">
                  {['parking', 'wifi', 'cafe', 'showers', 'lockers', 'sauna', 'equipment_rental', 'ac', 'security'].map((amenity) => (
                    <button
                      key={amenity}
                      onClick={() => toggleAmenityFilter(amenity)}
                      className={`px-4 py-2 rounded-lg border-2 text-sm transition-all duration-200 flex items-center gap-2 ${
                        selectedAmenities.includes(amenity)
                          ? 'bg-blue-500 text-white border-blue-500 shadow-lg'
                          : 'border-slate-300 hover:border-slate-400 hover:shadow-md'
                      }`}
                    >
                      {React.createElement(getAmenityIcon(amenity), { className: 'h-4 w-4' })}
                      {amenity.replace('_', ' ')}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Results Header */}
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-slate-800">
            🎯 {filteredCourts.length} Premium Courts Found
          </h2>
          <div className="text-sm text-slate-600">
            {filteredCourts.length > 0 ? 'Sorted by ' + sortBy : 'Try adjusting your filters'}
          </div>
        </div>

        {/* Professional Courts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
          {filteredCourts.map((court) => (
            <Link to="/booking" key={court.id}>
              <CourtCard 
                court={{
                  id: court.id,
                  name: court.name,
                  sport: court.sport,
                  location: court.location,
                  address: court.address,
                  coordinates: court.coordinates,
                  price: court.hourlyRate,
                  rating: court.rating,
                  reviews: court.reviews,
                  image: court.images[0],
                  amenities: court.amenities,
                  isIndoor: court.indoor,
                  availability: [],
                  operatingHours: court.operatingHours,
                  weatherDependent: court.weatherDependent,
                }}
              />
            </Link>
          ))}
        </div>

        {/* Enhanced No Results */}
        {filteredCourts.length === 0 && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🏟️</div>
            <h3 className="text-2xl font-bold text-slate-800 mb-4">No courts found</h3>
            <p className="text-slate-600 mb-6 max-w-md mx-auto">
              We couldn't find any courts matching your criteria. Try adjusting your filters or exploring different areas.
            </p>
            <Button
              onClick={() => {
                setSearchQuery('');
                setSelectedType('');
                setPriceRange('');
                setSelectedAmenities([]);
                setIsVerifiedOnly(false);
                setIsIndoorOnly(false);
                setMaxDistance(20);
                setMinRating(0);
                setMaxPrice(200);
              }}
              className="flex items-center gap-2 mx-auto"
            >
              <Filter className="h-4 w-4" />
              Clear All Filters
            </Button>
          </div>
        )}

        {/* Professional Footer Stats */}
        <div className="mt-16 text-center">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">{mockCourts.length}+</div>
              <div className="text-slate-600">Premium Venues</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-emerald-600">98%</div>
              <div className="text-slate-600">Customer Satisfaction</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">24/7</div>
              <div className="text-slate-600">Instant Booking</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourtsPageProfessional;