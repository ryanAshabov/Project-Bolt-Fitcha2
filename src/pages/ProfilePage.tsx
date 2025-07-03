import React, { useState } from 'react';
import { Header } from '../components/layout/Header';
import { useAuth } from '../hooks/useAuth';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { 
  Edit3, 
  MapPin, 
  Star, 
  Trophy, 
  Calendar, 
  Users, 
  Crown,
  Camera,
  Save,
  X,
  Plus,
  Target,
  Award,
  TrendingUp,
  Clock,
  Mail,
  Phone,
  Globe,
  Instagram,
  Twitter,
  Facebook
} from 'lucide-react';

export const ProfilePage: React.FC = () => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState(user);
  const [activeTab, setActiveTab] = useState<'overview' | 'stats' | 'achievements' | 'activity'>('overview');

  if (!user) {
    return null;
  }

  const handleSave = () => {
    // Here you would typically save to backend
    console.log('Saving profile changes:', editedUser);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedUser(user);
    setIsEditing(false);
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Users },
    { id: 'stats', label: 'Statistics', icon: TrendingUp },
    { id: 'achievements', label: 'Achievements', icon: Award },
    { id: 'activity', label: 'Recent Activity', icon: Clock }
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Header */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-8">
          {/* Cover Photo */}
          <div className="h-48 bg-gradient-to-r from-blue-600 via-purple-600 to-emerald-600 relative">
            <div className="absolute inset-0 bg-black bg-opacity-20"></div>
            <button className="absolute top-4 right-4 bg-white bg-opacity-20 backdrop-blur-sm text-white p-2 rounded-lg hover:bg-opacity-30 transition-all">
              <Camera className="h-5 w-5" />
            </button>
          </div>

          {/* Profile Info */}
          <div className="px-8 pb-8 -mt-16 relative">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between">
              <div className="flex flex-col md:flex-row md:items-end space-y-4 md:space-y-0 md:space-x-6">
                {/* Avatar */}
                <div className="relative">
                  <img
                    src={user.avatar}
                    alt={`${user.firstName} ${user.lastName}`}
                    className="w-32 h-32 rounded-2xl border-4 border-white shadow-lg"
                  />
                  {user.isPro && (
                    <Crown className="absolute -top-2 -right-2 w-8 h-8 text-yellow-500" />
                  )}
                  <button className="absolute bottom-2 right-2 bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition-colors">
                    <Camera className="h-4 w-4" />
                  </button>
                </div>

                {/* Basic Info */}
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h1 className="text-3xl font-bold text-slate-900">
                      {user.firstName} {user.lastName}
                    </h1>
                    {user.verified && (
                      <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm">✓</span>
                      </div>
                    )}
                    {user.isPro && (
                      <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium">
                        PRO
                      </span>
                    )}
                  </div>
                  
                  <p className="text-lg text-slate-600 mb-3">{user.headline}</p>
                  
                  <div className="flex items-center text-slate-500 mb-4">
                    <MapPin className="h-5 w-5 mr-2" />
                    <span>{user.location}</span>
                  </div>

                  {/* Quick Stats */}
                  <div className="flex space-x-6 text-sm">
                    <div className="text-center">
                      <p className="font-bold text-slate-900 text-lg">{user.connections}</p>
                      <p className="text-slate-500">Connections</p>
                    </div>
                    <div className="text-center">
                      <p className="font-bold text-slate-900 text-lg">{user.gamesPlayed}</p>
                      <p className="text-slate-500">Games</p>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center space-x-1">
                        <Star className="h-4 w-4 text-yellow-500 fill-current" />
                        <p className="font-bold text-slate-900 text-lg">{user.rating}</p>
                      </div>
                      <p className="text-slate-500">Rating</p>
                    </div>
                    <div className="text-center">
                      <p className="font-bold text-slate-900 text-lg">{user.winRate}%</p>
                      <p className="text-slate-500">Win Rate</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-3 mt-6 md:mt-0">
                {isEditing ? (
                  <>
                    <Button onClick={handleSave} className="flex items-center space-x-2">
                      <Save className="h-4 w-4" />
                      <span>Save</span>
                    </Button>
                    <Button variant="outline" onClick={handleCancel} className="flex items-center space-x-2">
                      <X className="h-4 w-4" />
                      <span>Cancel</span>
                    </Button>
                  </>
                ) : (
                  <Button onClick={() => setIsEditing(true)} className="flex items-center space-x-2">
                    <Edit3 className="h-4 w-4" />
                    <span>Edit Profile</span>
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-xl shadow-sm mb-8">
          <div className="border-b border-slate-200">
            <nav className="flex space-x-8 px-6">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex items-center space-x-2 py-4 border-b-2 font-medium text-sm transition-colors ${
                      activeTab === tab.id
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-slate-500 hover:text-slate-700'
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {activeTab === 'overview' && (
              <>
                {/* About Section */}
                <div className="bg-white rounded-xl p-6 shadow-sm">
                  <h3 className="text-lg font-semibold text-slate-900 mb-4">About</h3>
                  {isEditing ? (
                    <textarea
                      value={editedUser?.headline || ''}
                      onChange={(e) => setEditedUser(prev => prev ? {...prev, headline: e.target.value} : null)}
                      className="w-full p-3 border border-slate-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                      rows={4}
                      placeholder="Tell us about yourself..."
                    />
                  ) : (
                    <p className="text-slate-600 leading-relaxed">
                      {user.headline || 'No description available.'}
                    </p>
                  )}
                </div>

                {/* Sports & Skills */}
                <div className="bg-white rounded-xl p-6 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-slate-900">Sports & Skills</h3>
                    {isEditing && (
                      <Button size="sm" variant="outline">
                        <Plus className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                  
                  <div className="space-y-4">
                    {user.sports.map((sport, index) => (
                      <div key={index} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                            <Trophy className="h-5 w-5 text-blue-600" />
                          </div>
                          <div>
                            <p className="font-medium text-slate-900">{sport}</p>
                            <p className="text-sm text-slate-500">{user.skillLevel}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Star className="h-4 w-4 text-yellow-500 fill-current" />
                          <span className="text-sm font-medium text-slate-900">{user.rating}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Contact Information */}
                <div className="bg-white rounded-xl p-6 shadow-sm">
                  <h3 className="text-lg font-semibold text-slate-900 mb-4">Contact Information</h3>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <Mail className="h-5 w-5 text-slate-400" />
                      {isEditing ? (
                        <Input
                          type="email"
                          value={editedUser?.email || ''}
                          onChange={(e) => setEditedUser(prev => prev ? {...prev, email: e.target.value} : null)}
                          className="flex-1"
                        />
                      ) : (
                        <span className="text-slate-600">{user.email}</span>
                      )}
                    </div>
                    <div className="flex items-center space-x-3">
                      <MapPin className="h-5 w-5 text-slate-400" />
                      {isEditing ? (
                        <Input
                          value={editedUser?.location || ''}
                          onChange={(e) => setEditedUser(prev => prev ? {...prev, location: e.target.value} : null)}
                          className="flex-1"
                          placeholder="Your location"
                        />
                      ) : (
                        <span className="text-slate-600">{user.location}</span>
                      )}
                    </div>
                  </div>
                </div>
              </>
            )}

            {activeTab === 'stats' && (
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-slate-900 mb-6">Performance Statistics</h3>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <Trophy className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-blue-600">{user.gamesPlayed}</p>
                    <p className="text-sm text-slate-600">Total Games</p>
                  </div>
                  <div className="text-center p-4 bg-emerald-50 rounded-lg">
                    <Target className="h-8 w-8 text-emerald-600 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-emerald-600">{Math.round(user.gamesPlayed * user.winRate / 100)}</p>
                    <p className="text-sm text-slate-600">Wins</p>
                  </div>
                  <div className="text-center p-4 bg-yellow-50 rounded-lg">
                    <Star className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-yellow-600">{user.rating}</p>
                    <p className="text-sm text-slate-600">Rating</p>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <TrendingUp className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-purple-600">{user.winRate}%</p>
                    <p className="text-sm text-slate-600">Win Rate</p>
                  </div>
                </div>

                {/* Performance Chart Placeholder */}
                <div className="h-64 bg-slate-50 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <TrendingUp className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                    <p className="text-slate-500">Performance chart coming soon</p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'achievements' && (
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-slate-900 mb-6">Achievements & Badges</h3>
                
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {user.badges.map((badge) => (
                    <div
                      key={badge.id}
                      className="p-4 bg-gradient-to-br from-slate-50 to-slate-100 rounded-lg text-center hover:shadow-md transition-shadow"
                    >
                      <div className="text-3xl mb-2">{badge.icon}</div>
                      <h4 className="font-medium text-slate-900 mb-1">{badge.name}</h4>
                      <p className="text-xs text-slate-500">{badge.description}</p>
                    </div>
                  ))}
                  
                  {/* Add more achievement placeholders */}
                  <div className="p-4 bg-slate-50 rounded-lg text-center border-2 border-dashed border-slate-300">
                    <div className="text-3xl mb-2 text-slate-400">🏆</div>
                    <h4 className="font-medium text-slate-500 mb-1">More to come</h4>
                    <p className="text-xs text-slate-400">Keep playing to unlock</p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'activity' && (
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-slate-900 mb-6">Recent Activity</h3>
                
                <div className="space-y-4">
                  {[1, 2, 3, 4, 5].map((item) => (
                    <div key={item} className="flex items-start space-x-4 p-4 bg-slate-50 rounded-lg">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <Trophy className="h-5 w-5 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-slate-900 font-medium">Won a basketball match</p>
                        <p className="text-sm text-slate-500">Against Michael Chen • 2 hours ago</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Availability */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Availability</h3>
              <div className="space-y-2">
                {user.availability.map((time, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <Clock className="h-4 w-4 text-slate-400" />
                    <span className="text-sm text-slate-600">{time}</span>
                  </div>
                ))}
              </div>
              {isEditing && (
                <Button size="sm" variant="outline" className="mt-4 w-full">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Time Slot
                </Button>
              )}
            </div>

            {/* Social Links */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Social Links</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Instagram className="h-5 w-5 text-pink-500" />
                  <span className="text-sm text-slate-600">@{user.firstName.toLowerCase()}_sports</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Twitter className="h-5 w-5 text-blue-500" />
                  <span className="text-sm text-slate-600">@{user.firstName.toLowerCase()}_{user.lastName.toLowerCase()}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Facebook className="h-5 w-5 text-blue-600" />
                  <span className="text-sm text-slate-600">{user.firstName} {user.lastName}</span>
                </div>
              </div>
              {isEditing && (
                <Button size="sm" variant="outline" className="mt-4 w-full">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Social Link
                </Button>
              )}
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  <Calendar className="h-4 w-4 mr-2" />
                  Schedule Game
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Users className="h-4 w-4 mr-2" />
                  Find Partners
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <MapPin className="h-4 w-4 mr-2" />
                  Book Court
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};