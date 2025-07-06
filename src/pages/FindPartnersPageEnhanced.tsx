/**
 * Enhanced Find Partners Page
 * 
 * Advanced partner finding system with:
 * - Smart matching algorithm
 * - Filter by location, skill level, sports
 * - Real-time availability
 * - Connection system
 * - Invite to games functionality
 * 
 * @author Fitcha Team
 * @version 2.0.0 - Enhanced Partner Finding
 */

import React, { useState, useEffect } from 'react';
import { 
  Search, 
  MapPin, 
  Star, 
  Filter,
  Users,
  Clock,
  MessageCircle,
  UserPlus,
  CheckCircle,
} from 'lucide-react';
import { Button } from '../components/ui/Button';

// Mock partners data
const mockPartners = [
  {
    id: 'partner-1',
    firstName: 'Ahmed',
    lastName: 'Hassan',
    avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
    age: 28,
    location: 'Downtown Cairo',
    distance: 2.5,
    sports: ['Basketball', 'Tennis', 'Swimming'],
    skillLevel: 'Advanced',
    rating: 4.8,
    gamesPlayed: 127,
    isOnline: true,
    lastSeen: 'Online now',
    bio: 'Passionate basketball player looking for competitive games. Available weekends.',
    availability: ['Evening', 'Weekend'],
    preferredTime: 'Evening',
    trustScore: 92,
    verified: true,
    matchScore: 95,
  },
  {
    id: 'partner-2',
    firstName: 'Sarah',
    lastName: 'Mohamed',
    avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
    age: 25,
    location: 'New Cairo',
    distance: 5.2,
    sports: ['Yoga', 'Pilates', 'Running'],
    skillLevel: 'Intermediate',
    rating: 4.6,
    gamesPlayed: 89,
    isOnline: false,
    lastSeen: '2 hours ago',
    bio: 'Fitness enthusiast. Love morning yoga sessions and weekend runs.',
    availability: ['Morning', 'Weekend'],
    preferredTime: 'Morning',
    trustScore: 88,
    verified: true,
    matchScore: 87,
  },
  {
    id: 'partner-3',
    firstName: 'Omar',
    lastName: 'Ali',
    avatar: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
    age: 32,
    location: 'Maadi',
    distance: 7.1,
    sports: ['Football', 'CrossFit', 'Boxing'],
    skillLevel: 'Professional',
    rating: 4.9,
    gamesPlayed: 203,
    isOnline: true,
    lastSeen: 'Online now',
    bio: 'Former semi-pro football player. Looking for serious training partners.',
    availability: ['Evening', 'Night'],
    preferredTime: 'Evening',
    trustScore: 96,
    verified: true,
    matchScore: 82,
  },
  {
    id: 'partner-4',
    firstName: 'Nadia',
    lastName: 'Farouk',
    avatar: 'https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
    age: 24,
    location: 'Zamalek',
    distance: 3.8,
    sports: ['Tennis', 'Badminton', 'Squash'],
    skillLevel: 'Intermediate',
    rating: 4.7,
    gamesPlayed: 156,
    isOnline: true,
    lastSeen: 'Online now',
    bio: 'Tennis lover since childhood. Available for doubles matches.',
    availability: ['Afternoon', 'Evening'],
    preferredTime: 'Afternoon',
    trustScore: 90,
    verified: true,
    matchScore: 78,
  },
  {
    id: 'partner-5',
    firstName: 'Khaled',
    lastName: 'Mahmoud',
    avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
    age: 29,
    location: 'Heliopolis',
    distance: 8.5,
    sports: ['Video Games', 'Chess', 'Board Games'],
    skillLevel: 'Advanced',
    rating: 4.5,
    gamesPlayed: 67,
    isOnline: false,
    lastSeen: '1 hour ago',
    bio: 'Esports enthusiast and strategy game lover. Weekly game nights.',
    availability: ['Night', 'Weekend'],
    preferredTime: 'Night',
    trustScore: 85,
    verified: false,
    matchScore: 73,
  },
  {
    id: 'partner-6',
    firstName: 'Mona',
    lastName: 'Adel',
    avatar: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
    age: 27,
    location: 'Dokki',
    distance: 4.2,
    sports: ['Swimming', 'Volleyball', 'Dancing'],
    skillLevel: 'Beginner',
    rating: 4.3,
    gamesPlayed: 34,
    isOnline: true,
    lastSeen: 'Online now',
    bio: 'New to sports but very enthusiastic! Looking for friendly partners.',
    availability: ['Morning', 'Afternoon'],
    preferredTime: 'Morning',
    trustScore: 82,
    verified: true,
    matchScore: 68,
  },
];

const FindPartnersPageEnhanced: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSports, setSelectedSports] = useState<string[]>([]);
  const [selectedSkillLevel, setSelectedSkillLevel] = useState('');
  const [maxDistance, setMaxDistance] = useState(10);
  const [sortBy, setSortBy] = useState('match-score');
  const [showFilters, setShowFilters] = useState(false);
  const [filteredPartners, setFilteredPartners] = useState(mockPartners);
  const [invitedPartners, setInvitedPartners] = useState<string[]>([]);

  // Filter partners based on search criteria
  useEffect(() => {
    const filtered = mockPartners.filter(partner => {
      // Search by name
      const nameMatch = partner.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                       partner.lastName.toLowerCase().includes(searchQuery.toLowerCase());
      
      // Filter by sports
      const sportsMatch = selectedSports.length === 0 || 
                         selectedSports.some(sport => partner.sports.includes(sport));
      
      // Filter by skill level
      const skillMatch = !selectedSkillLevel || partner.skillLevel === selectedSkillLevel;
      
      // Filter by distance
      const distanceMatch = partner.distance <= maxDistance;
      
      return nameMatch && sportsMatch && skillMatch && distanceMatch;
    });

    // Sort partners
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'match-score':
          return b.matchScore - a.matchScore;
        case 'distance':
          return a.distance - b.distance;
        case 'rating':
          return b.rating - a.rating;
        case 'games-played':
          return b.gamesPlayed - a.gamesPlayed;
        default:
          return b.matchScore - a.matchScore;
      }
    });

    setFilteredPartners(filtered);
  }, [searchQuery, selectedSports, selectedSkillLevel, maxDistance, sortBy]);

  const handleSportToggle = (sport: string) => {
    setSelectedSports(prev => 
      prev.includes(sport) 
        ? prev.filter(s => s !== sport)
        : [...prev, sport],
    );
  };

  const handleInvitePartner = (partnerId: string) => {
    setInvitedPartners(prev => [...prev, partnerId]);
    // Here you would send actual invitation
    console.log('Inviting partner:', partnerId);
  };

  const getSkillLevelColor = (level: string) => {
    switch (level) {
      case 'Beginner': return 'text-green-600 bg-green-100';
      case 'Intermediate': return 'text-blue-600 bg-blue-100';
      case 'Advanced': return 'text-purple-600 bg-purple-100';
      case 'Professional': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getTrustScoreColor = (score: number) => {
    if (score >= 90) {
return 'text-green-600';
}
    if (score >= 80) {
return 'text-blue-600';
}
    if (score >= 70) {
return 'text-yellow-600';
}
    return 'text-red-600';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-emerald-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-emerald-600 bg-clip-text text-transparent mb-4">
            Find Your Perfect Partner
          </h1>
          <p className="text-slate-600 text-lg">
            Connect with like-minded people who share your passion for sports and activities
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-200 mb-8">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center">
            {/* Search Input */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search by name, sport, or location..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Quick Filters */}
            <div className="flex gap-2 flex-wrap">
              <Button
                variant={showFilters ? 'primary' : 'outline'}
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2"
              >
                <Filter className="h-4 w-4" />
                Filters
              </Button>
              
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="match-score">Best Match</option>
                <option value="distance">Nearest</option>
                <option value="rating">Highest Rated</option>
                <option value="games-played">Most Active</option>
              </select>
            </div>
          </div>

          {/* Expanded Filters */}
          {showFilters && (
            <div className="mt-6 pt-6 border-t border-slate-200">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Sports Filter */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Sports</label>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {['Basketball', 'Tennis', 'Swimming', 'Football', 'Yoga', 'Running', 'Boxing', 'Volleyball'].map((sport) => (
                      <label key={sport} className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selectedSports.includes(sport)}
                          onChange={() => handleSportToggle(sport)}
                          className="w-4 h-4 text-blue-600 rounded"
                        />
                        <span className="text-sm text-slate-700">{sport}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Skill Level Filter */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Skill Level</label>
                  <select
                    value={selectedSkillLevel}
                    onChange={(e) => setSelectedSkillLevel(e.target.value)}
                    className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Any Level</option>
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                    <option value="Professional">Professional</option>
                  </select>
                </div>

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
                    onChange={(e) => setMaxDistance(parseInt(e.target.value))}
                    className="w-full"
                  />
                </div>

                {/* Clear Filters */}
                <div className="flex items-end">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSelectedSports([]);
                      setSelectedSkillLevel('');
                      setMaxDistance(10);
                      setSearchQuery('');
                    }}
                    className="w-full"
                  >
                    Clear All
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Results Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-slate-800">
            {filteredPartners.length} Partners Found
          </h2>
          <div className="text-sm text-slate-600">
            Showing results within {maxDistance}km of your location
          </div>
        </div>

        {/* Partners Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPartners.map((partner) => (
            <div key={partner.id} className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6 hover:shadow-xl transition-all duration-300">
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <img
                      src={partner.avatar}
                      alt={`${partner.firstName} ${partner.lastName}`}
                      className="w-14 h-14 rounded-full object-cover"
                    />
                    {partner.isOnline && (
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
                    )}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800">
                      {partner.firstName} {partner.lastName}
                    </h3>
                    <p className="text-sm text-slate-600">{partner.age} years old</p>
                  </div>
                </div>
                
                {/* Match Score */}
                <div className="text-center">
                  <div className="text-lg font-bold text-blue-600">{partner.matchScore}%</div>
                  <div className="text-xs text-slate-500">Match</div>
                </div>
              </div>

              {/* Bio */}
              <p className="text-sm text-slate-600 mb-4 line-clamp-2">{partner.bio}</p>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="text-center">
                  <div className="flex items-center justify-center space-x-1">
                    <Star className="h-4 w-4 text-yellow-500 fill-current" />
                    <span className="font-semibold text-slate-800">{partner.rating}</span>
                  </div>
                  <div className="text-xs text-slate-500">Rating</div>
                </div>
                <div className="text-center">
                  <div className="font-semibold text-slate-800">{partner.gamesPlayed}</div>
                  <div className="text-xs text-slate-500">Games</div>
                </div>
              </div>

              {/* Location & Distance */}
              <div className="flex items-center space-x-2 mb-4">
                <MapPin className="h-4 w-4 text-slate-400" />
                <span className="text-sm text-slate-600">{partner.location}</span>
                <span className="text-sm text-slate-500">• {partner.distance}km away</span>
              </div>

              {/* Skills & Trust */}
              <div className="flex items-center justify-between mb-4">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSkillLevelColor(partner.skillLevel)}`}>
                  {partner.skillLevel}
                </span>
                <div className="flex items-center space-x-1">
                  <div className={`text-sm font-medium ${getTrustScoreColor(partner.trustScore)}`}>
                    {partner.trustScore}% Trust
                  </div>
                  {partner.verified && (
                    <CheckCircle className="h-4 w-4 text-blue-500" />
                  )}
                </div>
              </div>

              {/* Sports */}
              <div className="mb-4">
                <div className="flex flex-wrap gap-1">
                  {partner.sports.slice(0, 3).map((sport) => (
                    <span key={sport} className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">
                      {sport}
                    </span>
                  ))}
                  {partner.sports.length > 3 && (
                    <span className="px-2 py-1 bg-slate-100 text-slate-600 rounded text-xs">
                      +{partner.sports.length - 3}
                    </span>
                  )}
                </div>
              </div>

              {/* Availability */}
              <div className="flex items-center space-x-2 mb-4">
                <Clock className="h-4 w-4 text-slate-400" />
                <span className="text-sm text-slate-600">
                  Available: {partner.availability.join(', ')}
                </span>
              </div>

              {/* Last Seen */}
              <div className="text-xs text-slate-500 mb-4">
                {partner.isOnline ? 'Online now' : `Last seen ${partner.lastSeen}`}
              </div>

              {/* Actions */}
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 flex items-center justify-center space-x-1"
                >
                  <MessageCircle className="h-4 w-4" />
                  <span>Message</span>
                </Button>
                
                {invitedPartners.includes(partner.id) ? (
                  <Button
                    size="sm"
                    disabled
                    className="flex-1 flex items-center justify-center space-x-1 bg-green-600"
                  >
                    <CheckCircle className="h-4 w-4" />
                    <span>Invited</span>
                  </Button>
                ) : (
                  <Button
                    size="sm"
                    onClick={() => handleInvitePartner(partner.id)}
                    className="flex-1 flex items-center justify-center space-x-1"
                  >
                    <UserPlus className="h-4 w-4" />
                    <span>Invite</span>
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* No Results */}
        {filteredPartners.length === 0 && (
          <div className="text-center py-12">
            <Users className="h-16 w-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-slate-800 mb-2">No partners found</h3>
            <p className="text-slate-600 mb-4">
              Try adjusting your search criteria or expanding your search radius
            </p>
            <Button
              onClick={() => {
                setSelectedSports([]);
                setSelectedSkillLevel('');
                setMaxDistance(50);
                setSearchQuery('');
              }}
            >
              Expand Search
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default FindPartnersPageEnhanced;
