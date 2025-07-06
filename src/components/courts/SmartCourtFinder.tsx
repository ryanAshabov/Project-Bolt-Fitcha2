import React, { useState, useEffect } from 'react';
import { 
  MapPin, 
  Filter, 
  Star, 
  DollarSign, 
  Clock, 
  Navigation, 
  Users, 
  Zap,
  Target,
  Calendar,
  Search,
  Sliders,
  CheckCircle,
  AlertCircle,
  TrendingUp,
} from 'lucide-react';
import { Court, User } from '../../types';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { useCourtBooking } from '../../hooks/useCourtBooking';
import { useGeolocation } from '../../hooks/useGeolocation';
import { useAuth } from '../../hooks/useAuth';
import { CourtMap } from '../maps/CourtMap';

interface SmartCourtFinderProps {
  gameSession?: {
    sport: string;
    players: User[];
    datetime: string;
    duration: number;
  };
  onCourtSelect?: (court: Court) => void;
}

export const SmartCourtFinder: React.FC<SmartCourtFinderProps> = ({ 
  gameSession, 
  onCourtSelect, 
}) => {
  const { user } = useAuth();
  const { coordinates, loading: locationLoading } = useGeolocation();
  const { findOptimalCourt, loading, error } = useCourtBooking();

  const [filters, setFilters] = useState({
    sport: gameSession?.sport || 'All',
    date: gameSession?.datetime ? new Date(gameSession.datetime).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
    time: gameSession?.datetime ? new Date(gameSession.datetime).toTimeString().slice(0, 5) : '18:00',
    maxDistance: 10,
    maxPrice: 100,
    skillLevel: user?.skillLevel || 'Intermediate',
    isIndoor: undefined as boolean | undefined,
  });

  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [selectedCourt, setSelectedCourt] = useState<Court | null>(null);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [searchMode, setSearchMode] = useState<'smart' | 'manual'>('smart');

  useEffect(() => {
    if (searchMode === 'smart' && coordinates) {
      findSuggestions();
    }
  }, [filters, coordinates, searchMode]);

  const findSuggestions = async () => {
    if (!coordinates) {
return;
}

    const players = gameSession?.players || [user!];
    const courtSuggestions = await findOptimalCourt(players, filters);
    setSuggestions(courtSuggestions);
  };

  const handleCourtSelect = (court: Court) => {
    setSelectedCourt(court);
    onCourtSelect?.(court);
  };

  const getMatchScoreColor = (score: number) => {
    if (score >= 80) {
return 'text-emerald-600 bg-emerald-100';
}
    if (score >= 60) {
return 'text-blue-600 bg-blue-100';
}
    if (score >= 40) {
return 'text-yellow-600 bg-yellow-100';
}
    return 'text-red-600 bg-red-100';
  };

  const getSportIcon = (sport: string) => {
    const icons: { [key: string]: string } = {
      'Basketball': '🏀',
      'Tennis': '🎾',
      'Soccer': '⚽',
      'Volleyball': '🏐',
      'Football': '🏈',
      'Badminton': '🏸',
    };
    return icons[sport] || '🏃';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 flex items-center space-x-2">
              <Zap className="h-7 w-7 text-blue-600" />
              <span>Smart Court Finder</span>
            </h2>
            <p className="text-slate-600 mt-1">
              AI-powered court recommendations based on location, preferences, and availability
            </p>
          </div>
          
          <div className="flex space-x-2">
            <button
              onClick={() => setSearchMode('smart')}
              className={`px-4 py-2 text-sm rounded-lg transition-colors ${
                searchMode === 'smart' 
                  ? 'bg-blue-100 text-blue-700' 
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Target className="h-4 w-4 inline mr-2" />
              Smart Search
            </button>
            <button
              onClick={() => setSearchMode('manual')}
              className={`px-4 py-2 text-sm rounded-lg transition-colors ${
                searchMode === 'manual' 
                  ? 'bg-blue-100 text-blue-700' 
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Search className="h-4 w-4 inline mr-2" />
              Manual Search
            </button>
          </div>
        </div>

        {/* Game Session Info */}
        {gameSession && (
          <div className="bg-blue-50 rounded-lg p-4 mb-4">
            <div className="flex items-center space-x-4">
              <div className="text-2xl">{getSportIcon(gameSession.sport)}</div>
              <div>
                <h3 className="font-medium text-blue-900">Finding courts for your {gameSession.sport} game</h3>
                <p className="text-sm text-blue-700">
                  {gameSession.players.length} players • {new Date(gameSession.datetime).toLocaleDateString()} at {new Date(gameSession.datetime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Sport</label>
              <select
                value={filters.sport}
                onChange={(e) => setFilters(prev => ({ ...prev, sport: e.target.value }))}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="All">All Sports</option>
                <option value="Basketball">🏀 Basketball</option>
                <option value="Tennis">🎾 Tennis</option>
                <option value="Soccer">⚽ Soccer</option>
                <option value="Volleyball">🏐 Volleyball</option>
                <option value="Badminton">🏸 Badminton</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Date</label>
              <Input
                type="date"
                value={filters.date}
                onChange={(e) => setFilters(prev => ({ ...prev, date: e.target.value }))}
                icon={Calendar}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Time</label>
              <Input
                type="time"
                value={filters.time}
                onChange={(e) => setFilters(prev => ({ ...prev, time: e.target.value }))}
                icon={Clock}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Max Distance</label>
              <select
                value={filters.maxDistance}
                onChange={(e) => setFilters(prev => ({ ...prev, maxDistance: parseInt(e.target.value) }))}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value={5}>Within 5 km</option>
                <option value={10}>Within 10 km</option>
                <option value={20}>Within 20 km</option>
                <option value={50}>Within 50 km</option>
              </select>
            </div>
          </div>

          {/* Advanced Filters Toggle */}
          <div className="flex items-center justify-between">
            <button
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
              className="flex items-center space-x-2 text-sm text-blue-600 hover:text-blue-700"
            >
              <Sliders className="h-4 w-4" />
              <span>Advanced Filters</span>
            </button>

            {locationLoading && (
              <div className="flex items-center space-x-2 text-sm text-slate-500">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                <span>Getting your location...</span>
              </div>
            )}
          </div>

          {/* Advanced Filters */}
          {showAdvancedFilters && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-slate-50 rounded-lg">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Max Price ($/hour)</label>
                <Input
                  type="number"
                  value={filters.maxPrice}
                  onChange={(e) => setFilters(prev => ({ ...prev, maxPrice: parseInt(e.target.value) }))}
                  icon={DollarSign}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Skill Level</label>
                <select
                  value={filters.skillLevel}
                  onChange={(e) => setFilters(prev => ({ ...prev, skillLevel: e.target.value }))}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                  <option value="Professional">Professional</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Court Type</label>
                <select
                  value={filters.isIndoor === undefined ? 'any' : filters.isIndoor ? 'indoor' : 'outdoor'}
                  onChange={(e) => setFilters(prev => ({ 
                    ...prev, 
                    isIndoor: e.target.value === 'any' ? undefined : e.target.value === 'indoor', 
                  }))}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="any">Any</option>
                  <option value="indoor">Indoor Only</option>
                  <option value="outdoor">Outdoor Only</option>
                </select>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Results */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Court Suggestions */}
        <div className="lg:col-span-2 space-y-4">
          {loading && (
            <div className="bg-white rounded-xl p-8 border border-slate-200 shadow-sm text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-slate-600">Finding the best courts for you...</p>
            </div>
          )}

          {error && (
            <div className="bg-white rounded-xl p-6 border border-red-200 shadow-sm">
              <div className="flex items-center space-x-3 text-red-600">
                <AlertCircle className="h-5 w-5" />
                <p>{error}</p>
              </div>
            </div>
          )}

          {!loading && !error && suggestions.length === 0 && (
            <div className="bg-white rounded-xl p-8 border border-slate-200 shadow-sm text-center">
              <Search className="h-12 w-12 text-slate-400 mx-auto mb-4" />
              <p className="text-slate-500 mb-2">No courts found matching your criteria</p>
              <p className="text-sm text-slate-400">Try adjusting your filters or expanding your search radius</p>
            </div>
          )}

          {suggestions.map((suggestion, index) => (
            <div
              key={suggestion.court.id}
              className={`bg-white rounded-xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-all cursor-pointer ${
                selectedCourt?.id === suggestion.court.id ? 'ring-2 ring-blue-500 bg-blue-50' : ''
              }`}
              onClick={() => handleCourtSelect(suggestion.court)}
            >
              {/* Court Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="font-semibold text-slate-900 text-lg">{suggestion.court.name}</h3>
                    {index === 0 && (
                      <span className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                        🏆 Best Match
                      </span>
                    )}
                  </div>
                  
                  <div className="flex items-center text-slate-600 mb-2">
                    <MapPin className="h-4 w-4 mr-1" />
                    <span className="text-sm">{suggestion.court.location}</span>
                    <span className="mx-2">•</span>
                    <span className="text-sm font-medium text-emerald-600">
                      {suggestion.distance.toFixed(1)} km away
                    </span>
                  </div>

                  <div className="flex items-center space-x-4 text-sm text-slate-600">
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 text-yellow-500 fill-current" />
                      <span>{suggestion.court.rating}</span>
                      <span className="text-slate-400">({suggestion.court.reviews})</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <DollarSign className="h-4 w-4" />
                      <span>${suggestion.court.price}/hr</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="h-4 w-4" />
                      <span>{suggestion.court.isIndoor ? 'Indoor' : 'Outdoor'}</span>
                    </div>
                  </div>
                </div>

                {/* Match Score */}
                <div className="text-center">
                  <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getMatchScoreColor(suggestion.matchScore)}`}>
                    <TrendingUp className="h-4 w-4 mr-1" />
                    {suggestion.matchScore}% Match
                  </div>
                </div>
              </div>

              {/* Sports Tags */}
              <div className="flex flex-wrap gap-2 mb-3">
                {suggestion.court.sport.map((sport: string) => (
                  <span
                    key={sport}
                    className={`text-xs px-2 py-1 rounded-full ${
                      sport === filters.sport 
                        ? 'bg-blue-100 text-blue-800 ring-2 ring-blue-200' 
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {getSportIcon(sport)} {sport}
                  </span>
                ))}
              </div>

              {/* Reasons */}
              <div className="mb-4">
                <h4 className="text-sm font-medium text-slate-700 mb-2">Why this court?</h4>
                <div className="space-y-1">
                  {suggestion.reasons.map((reason: string, idx: number) => (
                    <div key={idx} className="flex items-center space-x-2 text-sm text-slate-600">
                      <CheckCircle className="h-4 w-4 text-emerald-500" />
                      <span>{reason}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Available Slots */}
              <div className="mb-4">
                <h4 className="text-sm font-medium text-slate-700 mb-2">Available Times</h4>
                <div className="flex flex-wrap gap-2">
                  {suggestion.availableSlots.slice(0, 4).map((slot: string) => (
                    <span
                      key={slot}
                      className="text-xs bg-emerald-100 text-emerald-800 px-2 py-1 rounded-full"
                    >
                      {slot}
                    </span>
                  ))}
                  {suggestion.availableSlots.length > 4 && (
                    <span className="text-xs text-slate-500">
                      +{suggestion.availableSlots.length - 4} more
                    </span>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex space-x-3">
                <Button className="flex-1">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Select Court
                </Button>
                <Button variant="outline">
                  <Navigation className="h-4 w-4 mr-2" />
                  Directions
                </Button>
                <Button variant="outline">
                  View Details
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Map and Additional Info */}
        <div className="space-y-6">
          {/* Map */}
          <CourtMap
            courts={suggestions.map(s => s.court)}
            selectedCourt={selectedCourt}
            onCourtSelect={handleCourtSelect}
          />

          {/* Smart Insights */}
          {searchMode === 'smart' && suggestions.length > 0 && (
            <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
              <h3 className="font-semibold text-slate-900 mb-4 flex items-center space-x-2">
                <Zap className="h-5 w-5 text-blue-600" />
                <span>Smart Insights</span>
              </h3>
              
              <div className="space-y-3">
                <div className="p-3 bg-blue-50 rounded-lg">
                  <h4 className="font-medium text-blue-900 text-sm">Optimal Time</h4>
                  <p className="text-sm text-blue-700">
                    Most courts are available around {filters.time}. Consider booking 30 minutes earlier for better rates.
                  </p>
                </div>
                
                <div className="p-3 bg-emerald-50 rounded-lg">
                  <h4 className="font-medium text-emerald-900 text-sm">Distance Optimization</h4>
                  <p className="text-sm text-emerald-700">
                    Average travel time for all players: {Math.round(suggestions[0]?.distance * 2)} minutes
                  </p>
                </div>
                
                <div className="p-3 bg-purple-50 rounded-lg">
                  <h4 className="font-medium text-purple-900 text-sm">Cost Savings</h4>
                  <p className="text-sm text-purple-700">
                    You could save ${Math.round((suggestions[0]?.court.price || 0) * 0.2)} by choosing off-peak hours
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Player Meeting Point */}
          {gameSession && gameSession.players.length > 1 && (
            <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
              <h3 className="font-semibold text-slate-900 mb-4 flex items-center space-x-2">
                <Users className="h-5 w-5 text-emerald-600" />
                <span>Meeting Point</span>
              </h3>
              
              <div className="space-y-3">
                <p className="text-sm text-slate-600">
                  Optimal meeting point calculated for all {gameSession.players.length} players
                </p>
                
                <div className="p-3 bg-slate-50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-slate-900">Central Location</span>
                    <Button size="sm" variant="outline">
                      <Navigation className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    Minimizes total travel time for all players
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};