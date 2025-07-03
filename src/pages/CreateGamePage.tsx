import React, { useState } from 'react';
import { Header } from '../components/layout/Header';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { mockCourts, mockUsers } from '../data/mockData';
import { useAuth } from '../hooks/useAuth';
import { 
  Gamepad2, 
  Plus, 
  Users, 
  MapPin, 
  Clock, 
  Calendar, 
  DollarSign, 
  Trophy, 
  Star,
  Search,
  Filter,
  Crown,
  Target,
  MessageCircle,
  CheckCircle,
  XCircle,
  AlertCircle,
  Heart,
  Brain,
  Dumbbell,
  Mountain,
  Coffee,
  Zap
} from 'lucide-react';

interface ActivitySession {
  id: string;
  creator: any;
  type: 'sports' | 'wellness' | 'gaming' | 'outdoor' | 'social' | 'fitness';
  category: string;
  name: string;
  datetime: string;
  duration: number;
  location: string;
  skillLevel: string;
  maxParticipants: number;
  currentParticipants: any[];
  isPaid: boolean;
  pricePerPerson?: number;
  description: string;
  status: 'open' | 'full' | 'in_progress' | 'completed';
  requirements?: string[];
  equipment?: string[];
  ageRange?: { min: number; max: number };
  genderPreference?: 'mixed' | 'male' | 'female';
}

const activityCategories = {
  sports: {
    name: 'Sports',
    icon: Trophy,
    color: 'from-blue-600 to-emerald-600',
    activities: ['Football', 'Basketball', 'Tennis', 'Volleyball', 'Handball', 'Padel', 'Squash']
  },
  wellness: {
    name: 'Wellness & Relaxation',
    icon: Heart,
    color: 'from-emerald-500 to-teal-600',
    activities: ['Yoga', 'Meditation', 'Pilates', 'Tai Chi', 'Massage Therapy', 'Spa', 'Deep Breathing']
  },
  gaming: {
    name: 'Gaming',
    icon: Gamepad2,
    color: 'from-purple-600 to-pink-600',
    activities: ['PlayStation', 'Chess', 'Backgammon', 'Cards', 'Board Games', 'Domino', 'Video Games']
  },
  outdoor: {
    name: 'Outdoor Activities',
    icon: Mountain,
    color: 'from-orange-500 to-red-600',
    activities: ['Cycling', 'Running', 'Walking', 'Climbing', 'Camping', 'Hiking', 'Fishing']
  },
  social: {
    name: 'Social Activities',
    icon: Coffee,
    color: 'from-yellow-500 to-orange-600',
    activities: ['Coffee', 'Dinner', 'Cinema', 'Traditional Cafes', 'Cultural Events', 'Parties', 'Discussions']
  },
  fitness: {
    name: 'Fitness',
    icon: Dumbbell,
    color: 'from-red-600 to-pink-600',
    activities: ['Gym', 'CrossFit', 'Zumba', 'Aerobics', 'Weight Lifting', 'Cardio', 'Functional Training']
  }
};

const mockActivitySessions: ActivitySession[] = [
  {
    id: '1',
    creator: mockUsers[0],
    type: 'sports',
    category: 'Basketball',
    name: 'Evening Basketball Match',
    datetime: '2025-01-16T18:00',
    duration: 90,
    location: 'Community Sports Center',
    skillLevel: 'Intermediate',
    maxParticipants: 10,
    currentParticipants: [mockUsers[0], mockUsers[1], mockUsers[2]],
    isPaid: true,
    pricePerPerson: 15,
    description: 'Friendly match for basketball lovers, great atmosphere and fair competition!',
    status: 'open',
    requirements: ['Sports shoes', 'Athletic wear'],
    equipment: ['Basketball provided'],
    ageRange: { min: 16, max: 35 },
    genderPreference: 'mixed'
  },
  {
    id: '2',
    creator: mockUsers[1],
    type: 'wellness',
    category: 'Yoga',
    name: 'Morning Yoga Session',
    datetime: '2025-01-17T07:00',
    duration: 60,
    location: 'Al-Azhar Park',
    skillLevel: 'Beginner',
    maxParticipants: 15,
    currentParticipants: [mockUsers[1], mockUsers[3]],
    isPaid: false,
    description: 'Start your day with positive energy with a yoga session in nature',
    status: 'open',
    requirements: ['Yoga mat', 'Comfortable clothes'],
    ageRange: { min: 18, max: 60 },
    genderPreference: 'mixed'
  },
  {
    id: '3',
    creator: mockUsers[2],
    type: 'gaming',
    category: 'PlayStation',
    name: 'FIFA 24 Tournament',
    datetime: '2025-01-18T20:00',
    duration: 180,
    location: 'Gaming Cafe',
    skillLevel: 'Advanced',
    maxParticipants: 8,
    currentParticipants: [mockUsers[2]],
    isPaid: true,
    pricePerPerson: 25,
    description: 'FIFA 24 tournament with valuable prizes for winners!',
    status: 'open',
    requirements: ['FIFA experience'],
    ageRange: { min: 16, max: 30 }
  },
  {
    id: '4',
    creator: mockUsers[3],
    type: 'outdoor',
    category: 'Cycling',
    name: 'Cycling Tour on the Corniche',
    datetime: '2025-01-19T16:00',
    duration: 120,
    location: 'Nile Corniche',
    skillLevel: 'Beginner',
    maxParticipants: 12,
    currentParticipants: [mockUsers[3]],
    isPaid: false,
    description: 'Fun cycling tour with a great view of the Nile',
    status: 'open',
    requirements: ['Bicycle', 'Safety helmet'],
    ageRange: { min: 14, max: 50 },
    genderPreference: 'mixed'
  },
  {
    id: '5',
    creator: mockUsers[0],
    type: 'social',
    category: 'Coffee',
    name: 'Coffee and Discussion Meet',
    datetime: '2025-01-20T15:00',
    duration: 90,
    location: 'Book Cafe',
    skillLevel: 'Everyone',
    maxParticipants: 6,
    currentParticipants: [mockUsers[0], mockUsers[1]],
    isPaid: false,
    description: 'Friendly meet to drink coffee and discuss interesting topics',
    status: 'open',
    ageRange: { min: 20, max: 45 },
    genderPreference: 'mixed'
  },
  {
    id: '6',
    creator: mockUsers[2],
    type: 'fitness',
    category: 'CrossFit',
    name: 'Group CrossFit Training',
    datetime: '2025-01-21T18:30',
    duration: 75,
    location: 'Fitness Plus Gym',
    skillLevel: 'Intermediate',
    maxParticipants: 8,
    currentParticipants: [mockUsers[2], mockUsers[3]],
    isPaid: true,
    pricePerPerson: 30,
    description: 'High-intensity CrossFit training with professional trainer',
    status: 'open',
    requirements: ['Basic fitness', 'Athletic wear'],
    ageRange: { min: 18, max: 40 },
    genderPreference: 'mixed'
  }
];

export const CreateGamePage: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'create' | 'join'>('create');
  const [selectedType, setSelectedType] = useState<string>('sports');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedLevel, setSelectedLevel] = useState('All');
  const [showCreateForm, setShowCreateForm] = useState(false);

  // Create Activity Form State
  const [activityForm, setActivityForm] = useState({
    type: 'sports',
    category: 'Basketball',
    name: '',
    date: '',
    time: '',
    duration: 90,
    location: '',
    skillLevel: 'Intermediate',
    maxParticipants: 10,
    isPaid: false,
    pricePerPerson: 0,
    description: '',
    requirements: '',
    equipment: '',
    ageMin: 16,
    ageMax: 50,
    genderPreference: 'mixed'
  });

  const levels = ['All', 'Beginner', 'Intermediate', 'Advanced', 'Professional'];

  const getAllCategories = () => {
    const allCategories = ['All'];
    Object.values(activityCategories).forEach(type => {
      allCategories.push(...type.activities);
    });
    return allCategories;
  };

  const filteredActivities = mockActivitySessions.filter(activity => {
    const matchesSearch = activity.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         activity.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         activity.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || activity.category === selectedCategory;
    const matchesLevel = selectedLevel === 'All' || activity.skillLevel === selectedLevel;
    
    return matchesSearch && matchesCategory && matchesLevel;
  });

  const handleCreateActivity = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Creating activity:', activityForm);
    // Here you would typically send to backend
    setShowCreateForm(false);
    // Reset form
    setActivityForm({
      type: 'sports',
      category: 'Basketball',
      name: '',
      date: '',
      time: '',
      duration: 90,
      location: '',
      skillLevel: 'Intermediate',
      maxParticipants: 10,
      isPaid: false,
      pricePerPerson: 0,
      description: '',
      requirements: '',
      equipment: '',
      ageMin: 16,
      ageMax: 50,
      genderPreference: 'mixed'
    });
  };

  const handleJoinActivity = (activityId: string) => {
    console.log('Joining activity:', activityId);
    // Here you would typically send to backend
  };

  const formatDateTime = (datetime: string) => {
    const date = new Date(datetime);
    return {
      date: date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
      time: date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
    };
  };

  const getActivityIcon = (type: string, category: string) => {
    if (type === 'sports') return '⚽';
    if (type === 'wellness') return '🧘';
    if (type === 'gaming') return '🎮';
    if (type === 'outdoor') return '🚴';
    if (type === 'social') return '☕';
    if (type === 'fitness') return '💪';
    return '🏃';
  };

  const getTypeColor = (type: string) => {
    const colors = {
      sports: 'bg-blue-100 text-blue-800',
      wellness: 'bg-emerald-100 text-emerald-800',
      gaming: 'bg-purple-100 text-purple-800',
      outdoor: 'bg-orange-100 text-orange-800',
      social: 'bg-yellow-100 text-yellow-800',
      fitness: 'bg-red-100 text-red-800'
    };
    return colors[type as keyof typeof colors] || 'bg-slate-100 text-slate-800';
  };

  const getSkillLevelColor = (level: string) => {
    switch (level) {
      case 'Beginner': return 'bg-green-100 text-green-800';
      case 'Intermediate': return 'bg-blue-100 text-blue-800';
      case 'Advanced': return 'bg-purple-100 text-purple-800';
      case 'Professional': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-slate-100 text-slate-800';
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-gradient-to-r from-emerald-600 to-blue-600 p-4 rounded-2xl shadow-lg">
              <Zap className="h-10 w-10 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent mb-2">
            Activities & Games
          </h1>
          <p className="text-slate-600 text-lg">Join or create diverse activities - from sports to games and relaxation</p>
        </div>

        {/* Activity Types */}
        <div className="bg-white rounded-xl shadow-sm mb-8 overflow-hidden">
          <div className="p-6 border-b border-slate-200">
            <h2 className="text-xl font-bold text-slate-900 mb-4">Activity Types</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {Object.entries(activityCategories).map(([key, category]) => {
                const Icon = category.icon;
                return (
                  <button
                    key={key}
                    onClick={() => setSelectedType(key)}
                    className={`p-4 rounded-xl text-center transition-all duration-200 ${
                      selectedType === key
                        ? `bg-gradient-to-r ${category.color} text-white shadow-lg transform scale-105`
                        : 'bg-slate-50 hover:bg-slate-100 text-slate-700'
                    }`}
                  >
                    <Icon className="h-8 w-8 mx-auto mb-2" />
                    <h3 className="font-medium text-sm">{category.name}</h3>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-xl shadow-sm mb-8">
          <div className="border-b border-slate-200">
            <nav className="flex">
              <button
                onClick={() => setActiveTab('create')}
                className={`flex-1 py-4 px-6 text-center font-medium transition-colors ${
                  activeTab === 'create'
                    ? 'text-emerald-600 border-b-2 border-emerald-600 bg-emerald-50'
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                <Plus className="h-5 w-5 inline mr-2" />
                Create Activity
              </button>
              <button
                onClick={() => setActiveTab('join')}
                className={`flex-1 py-4 px-6 text-center font-medium transition-colors ${
                  activeTab === 'join'
                    ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                <Users className="h-5 w-5 inline mr-2" />
                Join Activity
              </button>
            </nav>
          </div>
        </div>

        {/* Create Activity Tab */}
        {activeTab === 'create' && (
          <div className="space-y-8">
            {!showCreateForm ? (
              <div className="bg-white rounded-xl p-8 shadow-sm text-center">
                <div className="max-w-md mx-auto">
                  <div className={`bg-gradient-to-r ${activityCategories[selectedType as keyof typeof activityCategories].color} p-6 rounded-full w-24 h-24 mx-auto mb-6 flex items-center justify-center`}>
                    <Plus className="h-12 w-12 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-4">
                    Create {activityCategories[selectedType as keyof typeof activityCategories].name}
                  </h3>
                  <p className="text-slate-600 mb-8">
                    Create a new activity and invite others to join you in a fun experience
                  </p>
                  <Button 
                    onClick={() => setShowCreateForm(true)}
                    size="lg"
                    className={`bg-gradient-to-r ${activityCategories[selectedType as keyof typeof activityCategories].color} hover:opacity-90`}
                  >
                    <Plus className="h-5 w-5 mr-2" />
                    Start Creating
                  </Button>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-xl p-8 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold text-slate-900">Create New Activity</h3>
                  <Button 
                    variant="outline" 
                    onClick={() => setShowCreateForm(false)}
                  >
                    <XCircle className="h-4 w-4 mr-2" />
                    Cancel
                  </Button>
                </div>

                <form onSubmit={handleCreateActivity} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Activity Type */}
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Activity Type *
                      </label>
                      <select
                        value={activityForm.type}
                        onChange={(e) => {
                          const newType = e.target.value;
                          setActivityForm({
                            ...activityForm, 
                            type: newType,
                            category: activityCategories[newType as keyof typeof activityCategories].activities[0]
                          });
                        }}
                        className="w-full px-3 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white"
                        required
                      >
                        {Object.entries(activityCategories).map(([key, category]) => (
                          <option key={key} value={key}>
                            {category.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Category */}
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Category *
                      </label>
                      <select
                        value={activityForm.category}
                        onChange={(e) => setActivityForm({...activityForm, category: e.target.value})}
                        className="w-full px-3 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white"
                        required
                      >
                        {activityCategories[activityForm.type as keyof typeof activityCategories].activities.map(activity => (
                          <option key={activity} value={activity}>
                            {activity}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Activity Name */}
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Activity Name
                      </label>
                      <Input
                        value={activityForm.name}
                        onChange={(e) => setActivityForm({...activityForm, name: e.target.value})}
                        placeholder="e.g., Morning Yoga Session"
                      />
                    </div>

                    {/* Location */}
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Location *
                      </label>
                      <Input
                        value={activityForm.location}
                        onChange={(e) => setActivityForm({...activityForm, location: e.target.value})}
                        placeholder="e.g., Al-Azhar Park"
                        required
                      />
                    </div>

                    {/* Date */}
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Date *
                      </label>
                      <Input
                        type="date"
                        value={activityForm.date}
                        onChange={(e) => setActivityForm({...activityForm, date: e.target.value})}
                        required
                      />
                    </div>

                    {/* Time */}
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Time *
                      </label>
                      <Input
                        type="time"
                        value={activityForm.time}
                        onChange={(e) => setActivityForm({...activityForm, time: e.target.value})}
                        required
                      />
                    </div>

                    {/* Duration */}
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Duration (minutes)
                      </label>
                      <select
                        value={activityForm.duration}
                        onChange={(e) => setActivityForm({...activityForm, duration: parseInt(e.target.value)})}
                        className="w-full px-3 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white"
                      >
                        <option value={30}>30 minutes</option>
                        <option value={60}>60 minutes</option>
                        <option value={90}>90 minutes</option>
                        <option value={120}>120 minutes</option>
                        <option value={180}>180 minutes</option>
                      </select>
                    </div>

                    {/* Max Participants */}
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Max Participants
                      </label>
                      <Input
                        type="number"
                        value={activityForm.maxParticipants}
                        onChange={(e) => setActivityForm({...activityForm, maxParticipants: parseInt(e.target.value)})}
                        min="2"
                        max="50"
                      />
                    </div>

                    {/* Skill Level */}
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Required Level
                      </label>
                      <select
                        value={activityForm.skillLevel}
                        onChange={(e) => setActivityForm({...activityForm, skillLevel: e.target.value})}
                        className="w-full px-3 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white"
                      >
                        {levels.slice(1).map(level => (
                          <option key={level} value={level}>{level}</option>
                        ))}
                      </select>
                    </div>

                    {/* Gender Preference */}
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Gender Preference
                      </label>
                      <select
                        value={activityForm.genderPreference}
                        onChange={(e) => setActivityForm({...activityForm, genderPreference: e.target.value})}
                        className="w-full px-3 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white"
                      >
                        <option value="mixed">Mixed</option>
                        <option value="male">Male Only</option>
                        <option value="female">Female Only</option>
                      </select>
                    </div>

                    {/* Age Range */}
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Age Range
                      </label>
                      <div className="grid grid-cols-2 gap-4">
                        <Input
                          type="number"
                          placeholder="Min Age"
                          value={activityForm.ageMin}
                          onChange={(e) => setActivityForm({...activityForm, ageMin: parseInt(e.target.value)})}
                          min="10"
                          max="80"
                        />
                        <Input
                          type="number"
                          placeholder="Max Age"
                          value={activityForm.ageMax}
                          onChange={(e) => setActivityForm({...activityForm, ageMax: parseInt(e.target.value)})}
                          min="10"
                          max="80"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Payment Settings */}
                  <div className="border-t border-slate-200 pt-6">
                    <div className="flex items-center space-x-3 mb-4">
                      <input
                        type="checkbox"
                        id="isPaid"
                        checked={activityForm.isPaid}
                        onChange={(e) => setActivityForm({...activityForm, isPaid: e.target.checked})}
                        className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-slate-300 rounded"
                      />
                      <label htmlFor="isPaid" className="text-sm font-medium text-slate-700">
                        Paid Activity
                      </label>
                    </div>
                    
                    {activityForm.isPaid && (
                      <div className="ml-7">
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          Price per Person ($)
                        </label>
                        <Input
                          type="number"
                          value={activityForm.pricePerPerson}
                          onChange={(e) => setActivityForm({...activityForm, pricePerPerson: parseFloat(e.target.value)})}
                          min="0"
                          step="0.01"
                          className="max-w-xs"
                        />
                      </div>
                    )}
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Activity Description
                    </label>
                    <textarea
                      value={activityForm.description}
                      onChange={(e) => setActivityForm({...activityForm, description: e.target.value})}
                      placeholder="Write a detailed description of the activity..."
                      className="w-full p-3 border border-slate-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                      rows={4}
                    />
                  </div>

                  {/* Requirements & Equipment */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Requirements
                      </label>
                      <textarea
                        value={activityForm.requirements}
                        onChange={(e) => setActivityForm({...activityForm, requirements: e.target.value})}
                        placeholder="e.g., Athletic wear, appropriate shoes"
                        className="w-full p-3 border border-slate-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                        rows={3}
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Equipment Provided
                      </label>
                      <textarea
                        value={activityForm.equipment}
                        onChange={(e) => setActivityForm({...activityForm, equipment: e.target.value})}
                        placeholder="e.g., Ball provided, yoga mats"
                        className="w-full p-3 border border-slate-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                        rows={3}
                      />
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="flex justify-end space-x-4">
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => setShowCreateForm(false)}
                    >
                      Cancel
                    </Button>
                    <Button 
                      type="submit"
                      className="bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-700 hover:to-blue-700"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Create Activity
                    </Button>
                  </div>
                </form>
              </div>
            )}
          </div>
        )}

        {/* Join Activity Tab */}
        {activeTab === 'join' && (
          <div className="space-y-8">
            {/* Search and Filters */}
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="md:col-span-2">
                  <Input
                    placeholder="Search activities..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    icon={Search}
                  />
                </div>
                <div>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full px-3 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                  >
                    {getAllCategories().map(category => (
                      <option key={category} value={category}>{category}</option>
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

            {/* Activities List */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredActivities.map((activity) => {
                const { date, time } = formatDateTime(activity.datetime);
                const spotsLeft = activity.maxParticipants - activity.currentParticipants.length;
                
                return (
                  <div key={activity.id} className="bg-white rounded-xl border border-slate-200 p-6 hover:shadow-md transition-shadow">
                    {/* Activity Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="text-3xl">{getActivityIcon(activity.type, activity.category)}</div>
                        <div>
                          <h3 className="font-bold text-slate-900 text-lg">
                            {activity.name || activity.category}
                          </h3>
                          <p className="text-sm text-slate-500">
                            Organized by {activity.creator.firstName} {activity.creator.lastName}
                            {activity.creator.isPro && <Crown className="inline h-3 w-3 text-yellow-500 ml-1" />}
                          </p>
                        </div>
                      </div>
                      <div className="flex flex-col space-y-1">
                        <span className={`text-xs px-2 py-1 rounded-full ${getTypeColor(activity.type)}`}>
                          {activityCategories[activity.type as keyof typeof activityCategories].name}
                        </span>
                        <span className={`text-xs px-2 py-1 rounded-full ${getSkillLevelColor(activity.skillLevel)}`}>
                          {activity.skillLevel}
                        </span>
                      </div>
                    </div>

                    {/* Activity Details */}
                    <div className="space-y-3 mb-4">
                      <div className="flex items-center text-sm text-slate-600">
                        <Calendar className="h-4 w-4 mr-2 text-slate-400" />
                        <span>{date} at {time}</span>
                        <Clock className="h-4 w-4 ml-4 mr-2 text-slate-400" />
                        <span>{activity.duration} minutes</span>
                      </div>
                      
                      <div className="flex items-center text-sm text-slate-600">
                        <MapPin className="h-4 w-4 mr-2 text-slate-400" />
                        <span>{activity.location}</span>
                      </div>
                      
                      <div className="flex items-center text-sm text-slate-600">
                        <Users className="h-4 w-4 mr-2 text-slate-400" />
                        <span>{activity.currentParticipants.length}/{activity.maxParticipants} participants</span>
                        <span className={`ml-2 px-2 py-1 rounded-full text-xs ${
                          spotsLeft > 5 ? 'bg-green-100 text-green-800' :
                          spotsLeft > 0 ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {spotsLeft > 0 ? `${spotsLeft} spots left` : 'Full'}
                        </span>
                      </div>

                      {activity.isPaid && (
                        <div className="flex items-center text-sm text-slate-600">
                          <DollarSign className="h-4 w-4 mr-2 text-slate-400" />
                          <span>${activity.pricePerPerson} per person</span>
                        </div>
                      )}

                      {/* Age Range & Gender */}
                      <div className="flex items-center space-x-4 text-xs text-slate-500">
                        {activity.ageRange && (
                          <span>Age: {activity.ageRange.min}-{activity.ageRange.max}</span>
                        )}
                        {activity.genderPreference && activity.genderPreference !== 'mixed' && (
                          <span>
                            {activity.genderPreference === 'male' ? 'Male Only' : 'Female Only'}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Description */}
                    {activity.description && (
                      <p className="text-sm text-slate-600 mb-4 line-clamp-2">
                        {activity.description}
                      </p>
                    )}

                    {/* Requirements */}
                    {activity.requirements && activity.requirements.length > 0 && (
                      <div className="mb-4">
                        <h4 className="text-sm font-medium text-slate-700 mb-2">Requirements:</h4>
                        <div className="flex flex-wrap gap-1">
                          {activity.requirements.map((req, index) => (
                            <span
                              key={index}
                              className="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded-full"
                            >
                              {req}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Participants Preview */}
                    <div className="flex items-center space-x-2 mb-4">
                      <span className="text-sm text-slate-500">Participants:</span>
                      <div className="flex -space-x-2">
                        {activity.currentParticipants.slice(0, 4).map((participant, index) => (
                          <img
                            key={index}
                            src={participant.avatar}
                            alt={`${participant.firstName} ${participant.lastName}`}
                            className="w-8 h-8 rounded-full border-2 border-white"
                          />
                        ))}
                        {activity.currentParticipants.length > 4 && (
                          <div className="w-8 h-8 rounded-full border-2 border-white bg-slate-200 flex items-center justify-center">
                            <span className="text-xs text-slate-600">+{activity.currentParticipants.length - 4}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex space-x-3">
                      <Button 
                        className="flex-1"
                        disabled={spotsLeft === 0}
                        onClick={() => handleJoinActivity(activity.id)}
                      >
                        {spotsLeft === 0 ? (
                          <>
                            <XCircle className="h-4 w-4 mr-2" />
                            Full
                          </>
                        ) : (
                          <>
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Join
                          </>
                        )}
                      </Button>
                      <Button variant="outline">
                        <MessageCircle className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>

            {filteredActivities.length === 0 && (
              <div className="text-center py-12">
                <div className="bg-slate-100 p-6 rounded-full w-24 h-24 mx-auto mb-6 flex items-center justify-center">
                  <Search className="h-12 w-12 text-slate-400" />
                </div>
                <p className="text-slate-500 text-lg mb-2">No activities found</p>
                <p className="text-slate-400">Try adjusting your search criteria or create a new activity</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};