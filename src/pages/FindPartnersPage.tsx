import React, { useState } from 'react';
import { Header } from '../components/layout/Header';
import { mockUsers } from '../data/mockData';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Plus, MapPin, Star, Crown, Search, Filter } from 'lucide-react';

export const FindPartnersPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSport, setSelectedSport] = useState('All');
  const [selectedLevel, setSelectedLevel] = useState('All');

  const sports = ['All', 'Basketball', 'Tennis', 'Soccer', 'Volleyball', 'Swimming'];
  const levels = ['All', 'Beginner', 'Intermediate', 'Advanced', 'Professional'];

  const filteredUsers = mockUsers.filter(user => {
    const matchesSearch = user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.sports.some(sport => sport.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesSport = selectedSport === 'All' || user.sports.includes(selectedSport);
    const matchesLevel = selectedLevel === 'All' || user.skillLevel === selectedLevel;
    
    return matchesSearch && matchesSport && matchesLevel;
  });

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Find Partners</h1>
          <p className="text-slate-600">Connect with athletes who match your skill level and interests</p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 mb-8 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2">
              <Input
                placeholder="Search by name or sport..."
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
                value={selectedLevel}
                onChange={(e) => setSelectedLevel(e.target.value)}
                className="w-full px-3 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
              >
                {levels.map(level => (
                  <option key={level} value={level}>{level}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredUsers.map((user) => (
            <div key={user.id} className="bg-white rounded-xl border border-slate-200 p-6 hover:shadow-md transition-shadow">
              <div className="text-center">
                <div className="relative inline-block">
                  <img
                    src={user.avatar}
                    alt={`${user.firstName} ${user.lastName}`}
                    className="w-20 h-20 rounded-full mx-auto mb-4"
                  />
                  {user.isPro && (
                    <Crown className="absolute -top-1 -right-1 w-6 h-6 text-yellow-500" />
                  )}
                  {user.isOnline && (
                    <div className="absolute bottom-2 right-0 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white"></div>
                  )}
                </div>
                
                <div className="flex items-center justify-center space-x-2 mb-2">
                  <h3 className="font-semibold text-slate-900">
                    {user.firstName} {user.lastName}
                  </h3>
                  {user.verified && (
                    <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs">✓</span>
                    </div>
                  )}
                  {user.isPro && (
                    <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full font-medium">
                      PRO
                    </span>
                  )}
                </div>
                
                <p className="text-sm text-slate-600 mb-2">{user.headline}</p>
                
                <div className="flex items-center justify-center text-sm text-slate-500 mb-3">
                  <MapPin className="h-4 w-4 mr-1" />
                  {user.location}
                </div>

                {/* Sports and Level */}
                <div className="flex flex-wrap justify-center gap-1 mb-3">
                  {user.sports.slice(0, 3).map((sport) => (
                    <span
                      key={sport}
                      className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full"
                    >
                      {sport}
                    </span>
                  ))}
                </div>

                <div className="flex items-center justify-center space-x-4 text-sm mb-4">
                  <div className="flex items-center space-x-1">
                    <Star className="h-4 w-4 text-yellow-500 fill-current" />
                    <span className="font-medium">{user.rating}</span>
                  </div>
                  <span className="text-slate-500">•</span>
                  <span className="text-slate-600">{user.skillLevel}</span>
                  <span className="text-slate-500">•</span>
                  <span className="text-slate-600">{user.gamesPlayed} games</span>
                </div>

                <div className="flex space-x-2">
                  <Button className="flex-1" size="sm">
                    <Plus className="h-4 w-4" />
                    Connect
                  </Button>
                  <Button variant="outline" size="sm">
                    Message
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredUsers.length === 0 && (
          <div className="text-center py-12">
            <p className="text-slate-500 text-lg">No partners found matching your criteria</p>
            <p className="text-slate-400 mt-2">Try adjusting your search filters</p>
          </div>
        )}
      </div>
    </div>
  );
};