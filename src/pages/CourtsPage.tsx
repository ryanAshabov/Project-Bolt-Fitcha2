import React, { useState } from 'react';
import { Header } from '../components/layout/Header';
import { SmartCourtFinder } from '../components/courts/SmartCourtFinder';
import { mockCourts } from '../data/mockData';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { MapPin, Star, Search, Filter, Clock, DollarSign, Zap, List } from 'lucide-react';
import { Court } from '../types';

export const CourtsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSport, setSelectedSport] = useState('All');
  const [selectedType, setSelectedType] = useState('All');
  const [viewMode, setViewMode] = useState<'smart' | 'browse'>('smart');
  const [selectedCourt, setSelectedCourt] = useState<Court | null>(null);

  const sports = ['All', 'Basketball', 'Tennis', 'Soccer', 'Volleyball'];
  const types = ['All', 'Indoor', 'Outdoor'];

  const filteredCourts = mockCourts.filter(court => {
    const matchesSearch = court.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         court.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSport = selectedSport === 'All' || court.sport.includes(selectedSport);
    const matchesType = selectedType === 'All' || 
                       (selectedType === 'Indoor' && court.isIndoor) ||
                       (selectedType === 'Outdoor' && !court.isIndoor);
    
    return matchesSearch && matchesSport && matchesType;
  });

  const handleCourtSelect = (court: Court) => {
    setSelectedCourt(court);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 mb-2">Court Booking</h1>
              <p className="text-slate-600">Find and reserve the perfect venue for your next game</p>
            </div>
            
            <div className="flex space-x-2">
              <button
                onClick={() => setViewMode('smart')}
                className={`px-4 py-2 text-sm rounded-lg transition-colors flex items-center space-x-2 ${
                  viewMode === 'smart' 
                    ? 'bg-blue-100 text-blue-700' 
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <Zap className="h-4 w-4" />
                <span>Smart Finder</span>
              </button>
              <button
                onClick={() => setViewMode('browse')}
                className={`px-4 py-2 text-sm rounded-lg transition-colors flex items-center space-x-2 ${
                  viewMode === 'browse' 
                    ? 'bg-blue-100 text-blue-700' 
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <List className="h-4 w-4" />
                <span>Browse All</span>
              </button>
            </div>
          </div>
        </div>

        {/* Smart Court Finder */}
        {viewMode === 'smart' ? (
          <SmartCourtFinder onCourtSelect={handleCourtSelect} />
        ) : (
          <>
            {/* Search and Filters */}
            <div className="bg-white rounded-xl border border-slate-200 p-6 mb-8 shadow-sm">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="md:col-span-2">
                  <Input
                    placeholder="Search courts by name or location..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    icon={Search}
                  />
                </div>
                <div>
                  <select
                    value={selectedSport}
                    onChange={(e) => setSelectedSport(e.target.value)}
                    className="w-full px-3 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                  >
                    {sports.map(sport => (
                      <option key={sport} value={sport}>{sport}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <select
                    value={selectedType}
                    onChange={(e) => setSelectedType(e.target.value)}
                    className="w-full px-3 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                  >
                    {types.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Court Listings */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredCourts.map((court) => (
                <div key={court.id} className="bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-md transition-shadow">
                  <img
                    src={court.image}
                    alt={court.name}
                    className="w-full h-48 object-cover"
                  />
                  
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-semibold text-slate-900 text-lg">{court.name}</h3>
                        <div className="flex items-center text-slate-600 mt-1">
                          <MapPin className="h-4 w-4 mr-1" />
                          <span className="text-sm">{court.location}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center space-x-1">
                          <Star className="h-4 w-4 text-yellow-500 fill-current" />
                          <span className="font-medium text-slate-900">{court.rating}</span>
                          <span className="text-slate-500 text-sm">({court.reviews})</span>
                        </div>
                        <div className="flex items-center mt-1">
                          <DollarSign className="h-4 w-4 text-emerald-600" />
                          <span className="font-semibold text-emerald-600">${court.price}/hr</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-4 mb-4">
                      {court.sport.map((sport) => (
                        <span
                          key={sport}
                          className={`text-xs px-2 py-1 rounded-full ${
                            sport === 'Basketball' ? 'bg-orange-100 text-orange-800' :
                            sport === 'Tennis' ? 'bg-green-100 text-green-800' :
                            sport === 'Soccer' ? 'bg-blue-100 text-blue-800' :
                            'bg-purple-100 text-purple-800'
                          }`}
                        >
                          {sport}
                        </span>
                      ))}
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        court.isIndoor ? 'bg-slate-100 text-slate-800' : 'bg-emerald-100 text-emerald-800'
                      }`}>
                        {court.isIndoor ? 'Indoor' : 'Outdoor'}
                      </span>
                    </div>

                    <div className="mb-4">
                      <h4 className="text-sm font-medium text-slate-900 mb-2">Amenities</h4>
                      <div className="flex flex-wrap gap-1">
                        {court.amenities.map((amenity) => (
                          <span
                            key={amenity}
                            className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded"
                          >
                            {amenity}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="mb-4">
                      <h4 className="text-sm font-medium text-slate-900 mb-2">Available Times Today</h4>
                      <div className="flex flex-wrap gap-2">
                        {court.availability.slice(0, 3).map((slot) => (
                          <span
                            key={slot.id}
                            className={`text-xs px-2 py-1 rounded ${
                              slot.isAvailable 
                                ? 'bg-emerald-100 text-emerald-800' 
                                : 'bg-red-100 text-red-800'
                            }`}
                          >
                            {slot.startTime} - {slot.endTime}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex space-x-3">
                      <Button 
                        className="flex-1"
                        onClick={() => handleCourtSelect(court)}
                      >
                        Book Now
                      </Button>
                      <Button variant="outline">
                        View Details
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filteredCourts.length === 0 && (
              <div className="text-center py-12">
                <p className="text-slate-500 text-lg">No courts found matching your criteria</p>
                <p className="text-slate-400 mt-2">Try adjusting your search filters</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};