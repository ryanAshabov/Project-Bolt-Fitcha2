import React, { useState } from 'react';
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
  Target,
  TrendingUp,
  Clock,
  Globe,
  Instagram,
  Twitter,
  ChevronRight,
  Activity,
  BadgeCheck,
  Gamepad2,
  Timer,
  BarChart3,
  UserPlus,
  MessageCircle,
  Share2
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';

// Mock data for enhanced profile
const mockUserProfile = {
  id: '1',
  name: 'أحمد محمد',
  email: 'ahmed.mohammed@fitcha.app',
  phone: '+966501234567',
  avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=400&h=400&fit=crop&crop=face',
  coverImage: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=1200&h=400&fit=crop',
  location: 'الرياض، المملكة العربية السعودية',
  bio: 'لاعب كرة قدم شغوف، أحب اللعب في الملاعب المختلفة وتكوين صداقات جديدة. هدفي تحسين مستواي والوصول للاحترافية.',
  joinDate: '2023-01-15',
  verified: true,
  level: 'متقدم',
  rating: 4.8,
  totalGames: 145,
  wins: 98,
  favoritePosition: 'وسط الملعب',
  preferredGameType: 'كرة القدم',
  
  // Stats
  stats: {
    totalMatches: 145,
    winRate: 67.6,
    averageRating: 4.8,
    totalHours: 289,
    bestStreak: 12,
    monthlyGames: 18,
    goals: 67,
    assists: 34,
    cleanSheets: 23
  },

  // Achievements
  achievements: [
    { id: 1, title: 'أول هدف', description: 'سجل هدفك الأول', icon: Target, earned: true, date: '2023-02-01' },
    { id: 2, title: 'لاعب الشهر', description: 'أفضل لاعب في الشهر', icon: Crown, earned: true, date: '2023-06-15' },
    { id: 3, title: 'صانع الألعاب', description: 'قم بتنظيم 10 ألعاب', icon: Users, earned: true, date: '2023-08-20' },
    { id: 4, title: 'النجم الساطع', description: 'احصل على تقييم 5 نجوم لمدة 5 مرات متتالية', icon: Star, earned: true, date: '2023-09-10' },
    { id: 5, title: 'المحارب', description: 'اربح 100 مباراة', icon: Trophy, earned: false, progress: 67 },
    { id: 6, title: 'الماراثونر', description: 'العب 500 ساعة', icon: Clock, earned: false, progress: 57.8 }
  ],

  // Recent Activity
  recentActivity: [
    { id: 1, type: 'game', title: 'مباراة في ملعب الملك فهد', date: '2024-01-15', result: 'فوز 3-2' },
    { id: 2, type: 'achievement', title: 'حصل على إنجاز "صانع الألعاب"', date: '2024-01-14' },
    { id: 3, type: 'rating', title: 'حصل على تقييم 5 نجوم', date: '2024-01-13' },
    { id: 4, type: 'game', title: 'مباراة في نادي الأهلي', date: '2024-01-12', result: 'تعادل 1-1' },
    { id: 5, type: 'friend', title: 'أضاف صديق جديد - سالم الأحمد', date: '2024-01-11' }
  ],

  // Social Links
  socialLinks: {
    instagram: '@ahmed_fitcha',
    twitter: '@ahmed_football',
    website: 'ahmedfootball.com'
  },

  // Friends
  friends: [
    { id: 1, name: 'سالم الأحمد', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face', status: 'online' },
    { id: 2, name: 'محمد العلي', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face', status: 'offline' },
    { id: 3, name: 'فيصل الخالد', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face', status: 'playing' },
    { id: 4, name: 'عبدالله السعد', avatar: 'https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?w=100&h=100&fit=crop&crop=face', status: 'online' }
  ]
};

const ProfilePageEnhanced: React.FC = () => {
  const [user] = useState(mockUserProfile);
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState(user);
  const [activeTab, setActiveTab] = useState<'overview' | 'stats' | 'achievements' | 'activity' | 'friends'>('overview');

  const handleSave = () => {
    console.log('Saving profile changes:', editedUser);
    setIsEditing(false);
    // Here you would save to backend
  };

  const handleCancel = () => {
    setEditedUser(user);
    setIsEditing(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'bg-green-500';
      case 'playing': return 'bg-blue-500';
      case 'offline': return 'bg-gray-400';
      default: return 'bg-gray-400';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'online': return 'متصل';
      case 'playing': return 'يلعب';
      case 'offline': return 'غير متصل';
      default: return 'غير معروف';
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'game': return Gamepad2;
      case 'achievement': return Trophy;
      case 'rating': return Star;
      case 'friend': return UserPlus;
      default: return Activity;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with Cover Image */}
      <div className="relative">
        <div 
          className="h-64 bg-cover bg-center"
          style={{ backgroundImage: `url(${user.coverImage})` }}
        >
          <div className="absolute inset-0 bg-black bg-opacity-40" />
          <div className="absolute top-4 right-4">
            <Button
              onClick={() => setIsEditing(!isEditing)}
              className="bg-white text-gray-800 hover:bg-gray-100"
            >
              {isEditing ? <X className="w-4 h-4 ml-2" /> : <Edit3 className="w-4 h-4 ml-2" />}
              {isEditing ? 'إلغاء' : 'تعديل الملف الشخصي'}
            </Button>
          </div>
        </div>

        {/* Profile Info */}
        <div className="relative -mt-20 px-6">
          <div className="bg-white rounded-2xl shadow-xl p-6">
            <div className="flex flex-col md:flex-row md:items-end gap-6">
              {/* Avatar */}
              <div className="relative">
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-32 h-32 rounded-full border-4 border-white shadow-lg object-cover"
                />
                {user.verified && (
                  <div className="absolute -bottom-2 -right-2 bg-blue-500 text-white p-2 rounded-full">
                    <BadgeCheck className="w-6 h-6" />
                  </div>
                )}
                {isEditing && (
                  <button className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center text-white hover:bg-opacity-70 transition-all">
                    <Camera className="w-8 h-8" />
                  </button>
                )}
              </div>

              {/* Basic Info */}
              <div className="flex-1">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                  <div>
                    {isEditing ? (
                      <Input
                        value={editedUser.name}
                        onChange={(e) => setEditedUser({...editedUser, name: e.target.value})}
                        className="text-2xl font-bold mb-2"
                      />
                    ) : (
                      <h1 className="text-3xl font-bold text-gray-900 mb-2">{user.name}</h1>
                    )}
                    
                    <div className="flex items-center gap-4 text-gray-600 mb-4">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        <span>{user.location}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>انضم في {new Date(user.joinDate).toLocaleDateString('ar-SA')}</span>
                      </div>
                    </div>

                    {/* Rating and Level */}
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1 bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full">
                        <Star className="w-4 h-4 fill-current" />
                        <span className="font-semibold">{user.rating}</span>
                      </div>
                      <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full font-semibold">
                        {user.level}
                      </span>
                      <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full">
                        {user.totalGames} مباراة
                      </span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2 mt-4 md:mt-0">
                    <Button className="bg-blue-600 hover:bg-blue-700">
                      <MessageCircle className="w-4 h-4 ml-2" />
                      رسالة
                    </Button>
                    <Button variant="outline">
                      <UserPlus className="w-4 h-4 ml-2" />
                      إضافة صديق
                    </Button>
                    <Button variant="outline">
                      <Share2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Bio */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              {isEditing ? (
                <textarea
                  value={editedUser.bio}
                  onChange={(e) => setEditedUser({...editedUser, bio: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-lg resize-none"
                  rows={3}
                  placeholder="اكتب نبذة عنك..."
                />
              ) : (
                <p className="text-gray-700 leading-relaxed">{user.bio}</p>
              )}
            </div>

            {/* Social Links */}
            <div className="mt-4 flex gap-4">
              {user.socialLinks.instagram && (
                <a href="#" className="text-pink-600 hover:text-pink-700">
                  <Instagram className="w-5 h-5" />
                </a>
              )}
              {user.socialLinks.twitter && (
                <a href="#" className="text-blue-600 hover:text-blue-700">
                  <Twitter className="w-5 h-5" />
                </a>
              )}
              {user.socialLinks.website && (
                <a href="#" className="text-gray-600 hover:text-gray-700">
                  <Globe className="w-5 h-5" />
                </a>
              )}
            </div>

            {/* Save/Cancel Buttons */}
            {isEditing && (
              <div className="mt-6 pt-6 border-t border-gray-200 flex gap-3">
                <Button onClick={handleSave} className="bg-green-600 hover:bg-green-700">
                  <Save className="w-4 h-4 ml-2" />
                  حفظ التغييرات
                </Button>
                <Button onClick={handleCancel} variant="outline">
                  إلغاء
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="px-6 mt-6">
        <div className="bg-white rounded-xl shadow-sm">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6" dir="rtl">
              {[
                { id: 'overview', label: 'نظرة عامة', icon: Activity },
                { id: 'stats', label: 'الإحصائيات', icon: BarChart3 },
                { id: 'achievements', label: 'الإنجازات', icon: Trophy },
                { id: 'activity', label: 'النشاطات', icon: Clock },
                { id: 'friends', label: 'الأصدقاء', icon: Users }
              ].map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as 'overview' | 'stats' | 'achievements' | 'activity' | 'friends')}
                    className={`py-4 px-2 border-b-2 font-medium text-sm flex items-center gap-2 ${
                      activeTab === tab.id
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === 'overview' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Quick Stats */}
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-xl">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold">إجمالي المباريات</h3>
                      <p className="text-3xl font-bold">{user.stats.totalMatches}</p>
                    </div>
                    <Gamepad2 className="w-12 h-12 opacity-80" />
                  </div>
                </div>

                <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-6 rounded-xl">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold">معدل الفوز</h3>
                      <p className="text-3xl font-bold">{user.stats.winRate}%</p>
                    </div>
                    <Trophy className="w-12 h-12 opacity-80" />
                  </div>
                </div>

                <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white p-6 rounded-xl">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold">التقييم</h3>
                      <p className="text-3xl font-bold">{user.stats.averageRating}</p>
                    </div>
                    <Star className="w-12 h-12 opacity-80" />
                  </div>
                </div>

                {/* Game Preferences */}
                <div className="md:col-span-2 lg:col-span-3">
                  <div className="bg-gray-50 p-6 rounded-xl">
                    <h3 className="text-lg font-semibold mb-4">تفضيلات اللعب</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center">
                        <div className="bg-white p-4 rounded-lg shadow-sm">
                          <Target className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                          <p className="font-semibold">المركز المفضل</p>
                          <p className="text-sm text-gray-600">{user.favoritePosition}</p>
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="bg-white p-4 rounded-lg shadow-sm">
                          <Gamepad2 className="w-8 h-8 text-green-600 mx-auto mb-2" />
                          <p className="font-semibold">نوع اللعب</p>
                          <p className="text-sm text-gray-600">{user.preferredGameType}</p>
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="bg-white p-4 rounded-lg shadow-sm">
                          <Timer className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                          <p className="font-semibold">ساعات اللعب</p>
                          <p className="text-sm text-gray-600">{user.stats.totalHours}</p>
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="bg-white p-4 rounded-lg shadow-sm">
                          <TrendingUp className="w-8 h-8 text-orange-600 mx-auto mb-2" />
                          <p className="font-semibold">أفضل سلسلة</p>
                          <p className="text-sm text-gray-600">{user.stats.bestStreak} فوز</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'stats' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Performance Stats */}
                  <div className="bg-white border border-gray-200 rounded-xl p-6">
                    <h3 className="text-lg font-semibold mb-4 text-center">إحصائيات الأداء</h3>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span>الأهداف</span>
                        <span className="font-bold text-green-600">{user.stats.goals}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>التمريرات الحاسمة</span>
                        <span className="font-bold text-blue-600">{user.stats.assists}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>الشباك النظيفة</span>
                        <span className="font-bold text-purple-600">{user.stats.cleanSheets}</span>
                      </div>
                    </div>
                  </div>

                  {/* Match Stats */}
                  <div className="bg-white border border-gray-200 rounded-xl p-6">
                    <h3 className="text-lg font-semibold mb-4 text-center">إحصائيات المباريات</h3>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span>إجمالي المباريات</span>
                        <span className="font-bold">{user.stats.totalMatches}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>المباريات الشهرية</span>
                        <span className="font-bold text-blue-600">{user.stats.monthlyGames}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>معدل الفوز</span>
                        <span className="font-bold text-green-600">{user.stats.winRate}%</span>
                      </div>
                    </div>
                  </div>

                  {/* Time Stats */}
                  <div className="bg-white border border-gray-200 rounded-xl p-6">
                    <h3 className="text-lg font-semibold mb-4 text-center">إحصائيات الوقت</h3>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span>إجمالي الساعات</span>
                        <span className="font-bold">{user.stats.totalHours}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>أفضل سلسلة</span>
                        <span className="font-bold text-orange-600">{user.stats.bestStreak}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>التقييم المتوسط</span>
                        <span className="font-bold text-yellow-600">{user.stats.averageRating}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Progress Chart Placeholder */}
                <div className="bg-white border border-gray-200 rounded-xl p-6">
                  <h3 className="text-lg font-semibold mb-4">تطور الأداء</h3>
                  <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                    <p className="text-gray-500">سيتم عرض الرسوم البيانية هنا</p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'achievements' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {user.achievements.map((achievement) => {
                  const Icon = achievement.icon;
                  return (
                    <div 
                      key={achievement.id} 
                      className={`p-6 rounded-xl border-2 transition-all ${
                        achievement.earned 
                          ? 'bg-gradient-to-r from-yellow-50 to-yellow-100 border-yellow-300' 
                          : 'bg-gray-50 border-gray-200'
                      }`}
                    >
                      <div className="flex items-center gap-3 mb-3">
                        <div className={`p-3 rounded-full ${
                          achievement.earned ? 'bg-yellow-500 text-white' : 'bg-gray-400 text-white'
                        }`}>
                          <Icon className="w-6 h-6" />
                        </div>
                        <div>
                          <h3 className="font-semibold">{achievement.title}</h3>
                          {achievement.earned && achievement.date && (
                            <p className="text-sm text-gray-600">
                              {new Date(achievement.date).toLocaleDateString('ar-SA')}
                            </p>
                          )}
                        </div>
                      </div>
                      <p className="text-gray-700 mb-3">{achievement.description}</p>
                      
                      {!achievement.earned && achievement.progress && (
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>التقدم</span>
                            <span>{achievement.progress}%</span>
                          </div>
                          <div className="w-full bg-gray-300 rounded-full h-2">
                            <div 
                              className="bg-blue-500 h-2 rounded-full transition-all"
                              style={{ width: `${achievement.progress}%` }}
                            />
                          </div>
                        </div>
                      )}
                      
                      {achievement.earned && (
                        <div className="flex items-center text-green-600 text-sm">
                          <BadgeCheck className="w-4 h-4 ml-1" />
                          <span>مكتمل</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {activeTab === 'activity' && (
              <div className="space-y-4">
                {user.recentActivity.map((activity) => {
                  const Icon = getActivityIcon(activity.type);
                  return (
                    <div key={activity.id} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-center gap-4">
                        <div className="p-2 bg-blue-100 text-blue-600 rounded-full">
                          <Icon className="w-5 h-5" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium">{activity.title}</p>
                          {'result' in activity && activity.result && (
                            <p className="text-sm text-gray-600">{activity.result}</p>
                          )}
                          <p className="text-sm text-gray-500">
                            {new Date(activity.date).toLocaleDateString('ar-SA')}
                          </p>
                        </div>
                        <ChevronRight className="w-5 h-5 text-gray-400" />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {activeTab === 'friends' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {user.friends.map((friend) => (
                  <div key={friend.id} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <img
                          src={friend.avatar}
                          alt={friend.name}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                        <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${getStatusColor(friend.status)}`} />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold">{friend.name}</h3>
                        <p className="text-sm text-gray-600">{getStatusText(friend.status)}</p>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          <MessageCircle className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="outline">
                          <Users className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePageEnhanced;
