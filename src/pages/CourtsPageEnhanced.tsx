/**
 * Enhanced Courts Page
 * 
 * Advanced courts discovery system with:
 * - Interactive map integration
 * - Advanced filtering and search
 * - Real-time availability
 * - Court booking system
 * - Reviews and ratings
 * - Facilities information
 * 
 * @author Fitcha Team
 * @version 2.0.0 - Enhanced Courts System
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
  Calendar,
  Phone,
  Filter,
  Zap,
  Award,
  Thermometer,
} from 'lucide-react';
import { Button } from '../components/ui/Button';

// Court categories
const COURT_TYPES = [
  { id: 'basketball', name: 'Basketball', icon: '🏀' },
  { id: 'tennis', name: 'Tennis', icon: '🎾' },
  { id: 'football', name: 'Football', icon: '⚽' },
  { id: 'volleyball', name: 'Volleyball', icon: '🏐' },
  { id: 'swimming', name: 'Swimming', icon: '🏊' },
  { id: 'gym', name: 'Gym', icon: '🏋️' },
  { id: 'badminton', name: 'Badminton', icon: '🏸' },
  { id: 'squash', name: 'Squash', icon: '🎯' },
];

// Enhanced Mock Courts Data - Professional Database
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
    reviews: [
      {
        id: 1,
        user: 'Ahmed M.',
        rating: 5,
        comment: 'Amazing facilities and professional staff!',
        date: '2 days ago',
      },
      {
        id: 2,
        user: 'Sarah K.',
        rating: 4,
        comment: 'Great courts but can get crowded during peak hours.',
        date: '1 week ago',
      },
    ],
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
    reviews: [
      {
        id: 1,
        user: 'Mohamed S.',
        rating: 5,
        comment: 'Best clay courts in Cairo! Excellent coaching staff.',
        date: '3 days ago',
      },
      {
        id: 2,
        user: 'Nour A.',
        rating: 4,
        comment: 'Beautiful facilities but quite expensive.',
        date: '1 week ago',
      },
    ],
  },
  {
    id: 'court-3',
    name: 'Aqua Fitness Center',
    type: 'swimming',
    address: 'Zamalek, Cairo',
    coordinates: { lat: 30.0626, lng: 31.2197 },
    distance: 3.2,
    rating: 4.7,
    reviewCount: 203,
    priceRange: '$',
    hourlyRate: 30,
    peakHourRate: 45,
    weekendRate: 40,
    images: [
      'https://images.pexels.com/photos/863988/pexels-photo-863988.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&dpr=2',
      'https://images.pexels.com/photos/1263349/pexels-photo-1263349.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&dpr=2',
      'https://images.pexels.com/photos/1884574/pexels-photo-1884574.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&dpr=2',
    ],
    description: 'Modern swimming facility with Olympic-size pool and aqua fitness classes.',
    longDescription: 'State-of-the-art aquatic center featuring Olympic-size swimming pool, therapy pools, and comprehensive aqua fitness programs. Perfect for training, recreation, and rehabilitation.',
    amenities: ['parking', 'showers', 'lockers', 'sauna', 'cafe', 'wifi', 'towel_service'],
    openHours: '5:00 AM - 12:00 AM',
    phone: '+20 2 3456789',
    website: 'aquafitness.com',
    email: 'info@aquafitness.com',
    isVerified: true,
    isBookmarked: false,
    courtCount: 3,
    maxPlayers: 50,
    minBookingHours: 1,
    cancellationPolicy: '12h',
    equipment: ['Lane Ropes', 'Kickboards', 'Pool Noodles', 'Timing System'],
    surface: 'Olympic Pool',
    indoor: true,
    availability: {
      today: [
        { time: '6:00 AM', price: 30, available: true },
        { time: '8:00 AM', price: 30, available: true },
        { time: '1:00 PM', price: 45, available: true },
        { time: '4:00 PM', price: 45, available: true },
        { time: '7:00 PM', price: 45, available: false },
      ],
      tomorrow: [
        { time: '5:00 AM', price: 30, available: true },
        { time: '7:00 AM', price: 30, available: true },
        { time: '11:00 AM', price: 45, available: true },
        { time: '3:00 PM', price: 45, available: true },
        { time: '6:00 PM', price: 45, available: true },
      ],
    },
    features: [
      'Olympic pool',
      'Heated water',
      'Aqua classes',
      'Kids area',
      'Therapy pool',
      'Swim coaching',
    ],
    services: ['Swimming Lessons', 'Aqua Fitness', 'Physical Therapy', 'Lifeguard Services'],
    popularTimes: {
      morning: 'High',
      afternoon: 'Medium',
      evening: 'High',
    },
    reviews: [
      {
        id: 1,
        user: 'Yasmin H.',
        rating: 5,
        comment: 'Clean facilities and great instructors!',
        date: '1 day ago',
      },
      {
        id: 2,
        user: 'Omar T.',
        rating: 4,
        comment: 'Perfect for lap swimming, well maintained.',
        date: '4 days ago',
      },
    ],
  },
  {
    id: 'court-4',
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
    reviews: [
      {
        id: 1,
        user: 'Karim M.',
        rating: 5,
        comment: 'Amazing pitches and excellent coaching programs!',
        date: '2 days ago',
      },
      {
        id: 2,
        user: 'Ahmed F.',
        rating: 4,
        comment: 'Great facilities, but booking can be challenging during peak times.',
        date: '1 week ago',
      },
    ],
  },
  {
    id: 'court-5',
    name: 'Power Gym & Fitness Hub',
    type: 'gym',
    address: 'Heliopolis, Cairo',
    coordinates: { lat: 30.0808, lng: 31.2739 },
    distance: 8.1,
    rating: 4.4,
    reviewCount: 324,
    priceRange: '$$',
    hourlyRate: 25,
    peakHourRate: 35,
    weekendRate: 30,
    images: [
      'https://images.pexels.com/photos/1552252/pexels-photo-1552252.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&dpr=2',
      'https://images.pexels.com/photos/1431282/pexels-photo-1431282.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&dpr=2',
      'https://images.pexels.com/photos/2291599/pexels-photo-2291599.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&dpr=2',
    ],
    description: 'Fully equipped gym with modern equipment and personal training services.',
    longDescription: 'Complete fitness center with state-of-the-art equipment, group fitness classes, personal training, and wellness programs. Open 24/7 for maximum convenience.',
    amenities: ['parking', 'showers', 'lockers', 'sauna', 'juice_bar', 'wifi', 'towel_service'],
    openHours: '24/7',
    phone: '+20 2 4567890',
    website: 'powergym.com',
    email: 'membership@powergym.com',
    isVerified: true,
    isBookmarked: false,
    courtCount: 1,
    maxPlayers: 100,
    minBookingHours: 1,
    cancellationPolicy: '2h',
    equipment: ['Free Weights', 'Cardio Machines', 'Functional Training', 'Group Fitness'],
    surface: 'Rubber Flooring',
    indoor: true,
    availability: {
      today: [
        { time: 'Open 24/7', price: 25, available: true },
      ],
      tomorrow: [
        { time: 'Open 24/7', price: 25, available: true },
      ],
    },
    features: [
      'Modern equipment',
      'Personal training',
      'Group classes',
      '24/7 access',
      'Nutrition consultation',
      'Body composition analysis',
    ],
    services: ['Personal Training', 'Group Classes', 'Nutrition Coaching', 'Wellness Programs'],
    popularTimes: {
      morning: 'High',
      afternoon: 'Medium',
      evening: 'Very High',
    },
    reviews: [
      {
        id: 1,
        user: 'Fatma A.',
        rating: 5,
        comment: 'Great equipment and friendly staff. Love the 24/7 access!',
        date: '3 days ago',
      },
      {
        id: 2,
        user: 'Hassan K.',
        rating: 4,
        comment: 'Good gym but can get crowded during peak hours.',
        date: '1 week ago',
      },
    ],
  },
  {
    id: 'court-6',
    name: 'Elite Volleyball Arena',
    type: 'volleyball',
    address: 'Dokki, Giza',
    coordinates: { lat: 30.0386, lng: 31.2099 },
    distance: 4.5,
    rating: 4.9,
    reviewCount: 312,
    priceRange: '$$',
    hourlyRate: 60,
    peakHourRate: 85,
    weekendRate: 75,
    images: [
      'https://images.pexels.com/photos/1263426/pexels-photo-1263426.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&dpr=2',
      'https://images.pexels.com/photos/863988/pexels-photo-863988.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&dpr=2',
      'https://images.pexels.com/photos/1099816/pexels-photo-1099816.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&dpr=2',
    ],
    description: 'Professional volleyball arena with tournament-grade courts and facilities.',
    longDescription: 'Premier volleyball facility featuring 8 professional courts, tournament hosting capabilities, and comprehensive training programs. Home to regional championships.',
    amenities: ['parking', 'wifi', 'restrooms', 'lockers', 'cafe', 'pro_shop', 'medical_room'],
    openHours: '7:00 AM - 11:00 PM',
    phone: '+20 2 6789012',
    website: 'elitevolleyball.com',
    email: 'tournaments@elitevolleyball.com',
    isVerified: true,
    isBookmarked: false,
    courtCount: 8,
    maxPlayers: 12,
    minBookingHours: 1,
    cancellationPolicy: '24h',
    equipment: ['Volleyball Nets', 'Official Balls', 'Scoreboards', 'Training Equipment'],
    surface: 'Professional Court',
    indoor: true,
    availability: {
      today: [
        { time: '10:00 AM', price: 60, available: true },
        { time: '1:00 PM', price: 85, available: true },
        { time: '4:00 PM', price: 85, available: true },
        { time: '7:00 PM', price: 85, available: false },
      ],
      tomorrow: [
        { time: '9:00 AM', price: 60, available: true },
        { time: '12:00 PM', price: 85, available: true },
        { time: '3:00 PM', price: 85, available: true },
        { time: '6:00 PM', price: 85, available: true },
        { time: '8:00 PM', price: 85, available: true },
      ],
    },
    features: [
      'Professional courts',
      'Tournament hosting',
      'Live streaming',
      'Coaching programs',
      'International standards',
      'Spectator seating',
    ],
    services: ['Tournament Hosting', 'Professional Coaching', 'Team Training', 'Equipment Rental'],
    popularTimes: {
      morning: 'Medium',
      afternoon: 'High',
      evening: 'Very High',
    },
    reviews: [
      {
        id: 1,
        user: 'Mona S.',
        rating: 5,
        comment: 'Best volleyball facility in Cairo! Professional setup.',
        date: '1 day ago',
      },
      {
        id: 2,
        user: 'Ali R.',
        rating: 5,
        comment: 'Amazing courts and excellent tournament organization.',
        date: '3 days ago',
      },
    ],
  },
];

const CourtsPageEnhanced: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [priceRange, setPriceRange] = useState('');
  const [sortBy, setSortBy] = useState('distance');
  const [showMap, setShowMap] = useState(false);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [filteredCourts, setFilteredCourts] = useState(mockCourts);
  const [bookmarkedCourts, setBookmarkedCourts] = useState<string[]>(['court-2', 'court-5']);
  
  // Advanced filters
  const [maxDistance, setMaxDistance] = useState(20);
  const [minRating, setMinRating] = useState(0);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [isVerifiedOnly, setIsVerifiedOnly] = useState(false);
  const [isIndoorOnly, setIsIndoorOnly] = useState(false);
  const [maxPrice, setMaxPrice] = useState(200);

  // Quick booking
  const [selectedCourt, setSelectedCourt] = useState<string | null>(null);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string | null>(null);

  // Enhanced Filter Function
  useEffect(() => {
    const filtered = mockCourts.filter(court => {
      // Basic filters
      const nameMatch = court.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                       court.address.toLowerCase().includes(searchQuery.toLowerCase());
      const typeMatch = !selectedType || court.type === selectedType;
      const priceMatch = !priceRange || court.priceRange === priceRange;
      
      // Advanced filters
      const distanceMatch = court.distance <= maxDistance;
      const ratingMatch = court.rating >= minRating;
      const priceRangeMatch = court.hourlyRate <= maxPrice;
      const verifiedMatch = !isVerifiedOnly || court.isVerified;
      const indoorMatch = !isIndoorOnly || court.indoor;
      
      // Amenities filter
      const amenitiesMatch = selectedAmenities.length === 0 || 
        selectedAmenities.every(amenity => court.amenities.includes(amenity));
      
      return nameMatch && typeMatch && priceMatch && distanceMatch && 
             ratingMatch && priceRangeMatch && verifiedMatch && 
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

  const toggleBookmark = (courtId: string) => {
    setBookmarkedCourts(prev => 
      prev.includes(courtId) 
        ? prev.filter(id => id !== courtId)
        : [...prev, courtId],
    );
  };

  // Quick booking function
  const handleQuickBook = (courtId: string, timeSlot: string) => {
    setSelectedCourt(courtId);
    setSelectedTimeSlot(timeSlot);
    
    const court = mockCourts.find(c => c.id === courtId);
    const courtName = court?.name || 'Court';
    
    // Enhanced booking confirmation
    const confirmed = window.confirm(
      '🏟️ Quick Booking Confirmation\n\n' +
      `Court: ${courtName}\n` +
      `Time: ${timeSlot}\n` +
      `Price: $${court?.hourlyRate}/hr\n\n` +
      'Would you like to proceed with the booking?',
    );
    
    if (confirmed) {
      alert(`✅ Booking Confirmed!\n\nCourt: ${courtName}\nTime: ${timeSlot}\n\n📧 Confirmation email will be sent shortly.`);
      // Reset selection after booking
      setSelectedCourt(null);
      setSelectedTimeSlot(null);
      // Here you would typically make API call to booking service
    }
  };

  // Toggle amenity filter
  const toggleAmenityFilter = (amenity: string) => {
    setSelectedAmenities(prev => 
      prev.includes(amenity)
        ? prev.filter(a => a !== amenity)
        : [...prev, amenity],
    );
  };

  const getAmenityIcon = (amenity: string) => {
    const icons = {
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
    };
    return icons[amenity as keyof typeof icons] || Users;
  };

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
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-emerald-600 bg-clip-text text-transparent mb-4">
            Discover Courts & Facilities
          </h1>
          <p className="text-slate-600 text-lg">
            Find the perfect venue for your sports activities
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-200 mb-8">
          {/* Search Bar */}
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search courts, facilities, or locations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div className="flex gap-2 flex-wrap">
              <Button
                variant={showMap ? 'primary' : 'outline'}
                onClick={() => setShowMap(!showMap)}
                className="flex items-center gap-2"
              >
                <MapPin className="h-4 w-4" />
                {showMap ? 'List View' : 'Map View'}
              </Button>
              
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="distance">Nearest</option>
                <option value="rating">Highest Rated</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="popularity">Most Popular</option>
              </select>

              <Button
                variant="outline"
                onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                className="flex items-center gap-2"
              >
                <Filter className="h-4 w-4" />
                Advanced
              </Button>
            </div>
          </div>

          {/* Advanced Filters */}
          {showAdvancedFilters && (
            <div className="border-t border-slate-200 pt-6 mt-6">
              <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
                <Zap className="h-5 w-5 text-blue-500" />
                Advanced Filters
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Distance Filter */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Max Distance: {maxDistance}km
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="50"
                    value={maxDistance}
                    onChange={(e) => setMaxDistance(Number(e.target.value))}
                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer slider"
                  />
                </div>

                {/* Rating Filter */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Min Rating: {minRating}★
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="5"
                    step="0.5"
                    value={minRating}
                    onChange={(e) => setMinRating(Number(e.target.value))}
                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer slider"
                  />
                </div>

                {/* Price Filter */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Max Price: ${maxPrice}/hr
                  </label>
                  <input
                    type="range"
                    min="10"
                    max="300"
                    step="10"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(Number(e.target.value))}
                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer slider"
                  />
                </div>

                {/* Quick Toggles */}
                <div className="space-y-3">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={isVerifiedOnly}
                      onChange={(e) => setIsVerifiedOnly(e.target.checked)}
                      className="rounded text-blue-500"
                    />
                    <span className="text-sm text-slate-700 flex items-center gap-1">
                      <Award className="h-4 w-4 text-blue-500" />
                      Verified Only
                    </span>
                  </label>
                  
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={isIndoorOnly}
                      onChange={(e) => setIsIndoorOnly(e.target.checked)}
                      className="rounded text-blue-500"
                    />
                    <span className="text-sm text-slate-700 flex items-center gap-1">
                      <Thermometer className="h-4 w-4 text-blue-500" />
                      Indoor Only
                    </span>
                  </label>
                </div>
              </div>

              {/* Amenities Filter */}
              <div className="mt-6">
                <h4 className="text-sm font-medium text-slate-700 mb-3">Amenities</h4>
                <div className="flex flex-wrap gap-2">
                  {['parking', 'wifi', 'cafe', 'showers', 'lockers', 'sauna', 'equipment_rental'].map((amenity) => (
                    <button
                      key={amenity}
                      onClick={() => toggleAmenityFilter(amenity)}
                      className={`px-3 py-1.5 rounded-lg border text-sm transition-colors ${
                        selectedAmenities.includes(amenity)
                          ? 'bg-blue-500 text-white border-blue-500'
                          : 'border-slate-300 hover:border-slate-400'
                      }`}
                    >
                      {amenity.replace('_', ' ')}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Court Type Filter */}
          <div className="mb-6">
            <h3 className="text-sm font-medium text-slate-700 mb-3">Court Types</h3>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedType('')}
                className={`px-4 py-2 rounded-lg border transition-colors ${
                  selectedType === '' 
                    ? 'bg-blue-500 text-white border-blue-500' 
                    : 'border-slate-300 hover:border-slate-400'
                }`}
              >
                All Types
              </button>
              {COURT_TYPES.map((type) => (
                <button
                  key={type.id}
                  onClick={() => setSelectedType(type.id)}
                  className={`px-4 py-2 rounded-lg border transition-colors flex items-center gap-2 ${
                    selectedType === type.id 
                      ? 'bg-blue-500 text-white border-blue-500' 
                      : 'border-slate-300 hover:border-slate-400'
                  }`}
                >
                  <span>{type.icon}</span>
                  <span>{type.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Price Range Filter */}
          <div>
            <h3 className="text-sm font-medium text-slate-700 mb-3">Price Range</h3>
            <div className="flex gap-2">
              {['', '$', '$$', '$$$'].map((range) => (
                <button
                  key={range || 'all'}
                  onClick={() => setPriceRange(range)}
                  className={`px-4 py-2 rounded-lg border transition-colors ${
                    priceRange === range 
                      ? 'bg-blue-500 text-white border-blue-500' 
                      : 'border-slate-300 hover:border-slate-400'
                  }`}
                >
                  {range === '' ? 'All Prices' : getPriceRangeSymbol(range)}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Current Booking Status */}
        {selectedCourt && selectedTimeSlot && (
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="bg-blue-500 text-white p-2 rounded-full">
                  <Calendar className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-blue-900">Quick Booking Selected</h3>
                  <p className="text-blue-700 text-sm">
                    Court: {mockCourts.find(c => c.id === selectedCourt)?.name} • Time: {selectedTimeSlot}
                  </p>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSelectedCourt(null);
                  setSelectedTimeSlot(null);
                }}
                className="text-blue-600 border-blue-300 hover:bg-blue-100"
              >
                Clear
              </Button>
            </div>
          </div>
        )}

        {/* Results Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-slate-800">
            {filteredCourts.length} Courts Found
          </h2>
        </div>

        {/* Courts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredCourts.map((court) => (
            <div key={court.id} className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden hover:shadow-xl transition-all duration-300">
              {/* Image */}
              <div className="relative h-48">
                <img
                  src={court.images[0]}
                  alt={court.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 left-4">
                  <span className="bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full text-sm font-medium text-slate-800">
                    {COURT_TYPES.find(t => t.id === court.type)?.icon} {COURT_TYPES.find(t => t.id === court.type)?.name}
                  </span>
                </div>
                <div className="absolute top-4 right-4 flex gap-2">
                  {court.isVerified && (
                    <div className="bg-blue-500 text-white p-1.5 rounded-full">
                      <CheckCircle className="h-3 w-3" />
                    </div>
                  )}
                  <button
                    onClick={() => toggleBookmark(court.id)}
                    className="bg-white/90 backdrop-blur-sm text-slate-700 hover:text-blue-500 p-1.5 rounded-full transition-colors"
                  >
                    {bookmarkedCourts.includes(court.id) ? (
                      <BookmarkCheck className="h-4 w-4 text-blue-500" />
                    ) : (
                      <Bookmark className="h-4 w-4" />
                    )}
                  </button>
                </div>
                <div className="absolute bottom-4 left-4">
                  <span className="bg-green-500 text-white px-2 py-1 rounded-full text-sm font-medium">
                    {court.priceRange} • ${court.hourlyRate}/hr
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                {/* Header */}
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-xl font-bold text-slate-800 mb-1">{court.name}</h3>
                    <div className="flex items-center space-x-2 text-sm text-slate-600">
                      <MapPin className="h-4 w-4" />
                      <span>{court.address}</span>
                      <span>• {court.distance}km away</span>
                    </div>
                  </div>
                </div>

                {/* Rating */}
                <div className="flex items-center space-x-2 mb-3">
                  <div className="flex items-center space-x-1">
                    <Star className="h-4 w-4 text-yellow-500 fill-current" />
                    <span className="font-semibold text-slate-800">{court.rating}</span>
                  </div>
                  <span className="text-sm text-slate-600">({court.reviewCount} reviews)</span>
                </div>

                {/* Description */}
                <p className="text-sm text-slate-600 mb-4 line-clamp-2">{court.description}</p>

                {/* Amenities */}
                <div className="mb-4">
                  <div className="flex flex-wrap gap-1">
                    {court.amenities.slice(0, 4).map((amenity) => {
                      const Icon = getAmenityIcon(amenity);
                      return (
                        <span key={amenity} className="flex items-center space-x-1 px-2 py-1 bg-slate-100 text-slate-600 rounded text-xs">
                          <Icon className="h-3 w-3" />
                          <span>{amenity.replace('_', ' ')}</span>
                        </span>
                      );
                    })}
                    {court.amenities.length > 4 && (
                      <span className="px-2 py-1 bg-slate-100 text-slate-600 rounded text-xs">
                        +{court.amenities.length - 4} more
                      </span>
                    )}
                  </div>
                </div>

                {/* Hours & Contact */}
                <div className="flex items-center justify-between text-sm text-slate-600 mb-4">
                  <div className="flex items-center space-x-1">
                    <Clock className="h-4 w-4" />
                    <span>{court.openHours}</span>
                  </div>
                  {court.website && (
                    <div className="flex items-center space-x-1">
                      <Globe className="h-4 w-4" />
                      <span>{court.website}</span>
                    </div>
                  )}
                </div>

                {/* Availability */}
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-slate-700 mb-2">Available Today</h4>
                  <div className="flex flex-wrap gap-1">
                    {court.availability.today.slice(0, 3).map((slot, index) => {
                      const timeDisplay = typeof slot === 'string' ? slot : slot.time;
                      const isAvailable = typeof slot === 'string' ? true : slot.available;
                      const slotPrice = typeof slot === 'string' ? court.hourlyRate : slot.price;
                      
                      return (
                        <span 
                          key={index} 
                          className={`px-2 py-1 rounded text-xs flex items-center gap-1 ${
                            isAvailable 
                              ? 'bg-green-100 text-green-700' 
                              : 'bg-red-100 text-red-700'
                          }`}
                        >
                          <span>{timeDisplay}</span>
                          <span className="text-xs opacity-75">${slotPrice}</span>
                        </span>
                      );
                    })}
                    {court.availability.today.length > 3 && (
                      <span className="px-2 py-1 bg-slate-100 text-slate-600 rounded text-xs">
                        +{court.availability.today.length - 3} more
                      </span>
                    )}
                  </div>
                </div>

                {/* Enhanced Actions with Quick Booking */}
                <div className="flex space-x-2">
                  <Button 
                    size="sm" 
                    className="flex-1 flex items-center justify-center gap-2"
                    onClick={() => handleQuickBook(court.id, 'next available')}
                  >
                    <Calendar className="h-4 w-4" />
                    Quick Book
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex items-center space-x-1"
                    onClick={() => window.open(`tel:${court.phone}`, '_self')}
                  >
                    <Phone className="h-4 w-4" />
                    <span>Call</span>
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex items-center space-x-1"
                    onClick={() => window.open(`https://maps.google.com/maps?q=${encodeURIComponent(court.address)}`, '_blank')}
                  >
                    <Navigation className="h-4 w-4" />
                    <span>Directions</span>
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* No Results */}
        {filteredCourts.length === 0 && (
          <div className="text-center py-12">
            <MapPin className="h-16 w-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-slate-800 mb-2">No courts found</h3>
            <p className="text-slate-600 mb-4">
              Try adjusting your search criteria or exploring different areas
            </p>
            <Button
              onClick={() => {
                setSearchQuery('');
                setSelectedType('');
                setPriceRange('');
              }}
            >
              Clear Filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CourtsPageEnhanced;
