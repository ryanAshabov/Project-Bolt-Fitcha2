import React, { useState } from 'react';
import { 
  Users, 
  UserPlus, 
  Search, 
  MessageCircle,
  Star,
  MapPin,
  Crown,
  Badge,
  Heart,
  Share2,
  MoreHorizontal,
  CheckCircle,
  X,
  Gamepad2,
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';

// Mock data for network/community
const mockNetworkData = {
  friends: [
    {
      id: 1,
      name: 'أحمد محمد',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
      location: 'الرياض',
      rating: 4.8,
      level: 'متقدم',
      lastSeen: '2024-01-15',
      status: 'online',
      mutualFriends: 5,
      gamesPlayed: 23,
      isOnline: true,
      isFavorite: true,
    },
    {
      id: 2,
      name: 'سالم الأحمد',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
      location: 'جدة',
      rating: 4.6,
      level: 'متوسط',
      lastSeen: '2024-01-14',
      status: 'playing',
      mutualFriends: 3,
      gamesPlayed: 45,
      isOnline: false,
      isFavorite: false,
    },
    {
      id: 3,
      name: 'فيصل الخالد',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
      location: 'الدمام',
      rating: 4.9,
      level: 'محترف',
      lastSeen: '2024-01-13',
      status: 'offline',
      mutualFriends: 8,
      gamesPlayed: 67,
      isOnline: false,
      isFavorite: true,
    },
    {
      id: 4,
      name: 'عبدالله السعد',
      avatar: 'https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?w=150&h=150&fit=crop&crop=face',
      location: 'الرياض',
      rating: 4.7,
      level: 'متقدم',
      lastSeen: '2024-01-15',
      status: 'online',
      mutualFriends: 2,
      gamesPlayed: 34,
      isOnline: true,
      isFavorite: false,
    },
  ],

  suggestions: [
    {
      id: 5,
      name: 'محمد العلي',
      avatar: 'https://images.unsplash.com/photo-1566492031773-4f4e44671d66?w=150&h=150&fit=crop&crop=face',
      location: 'الرياض',
      rating: 4.5,
      level: 'متوسط',
      mutualFriends: 4,
      commonInterests: ['كرة القدم', 'كرة السلة'],
      reason: 'أصدقاء مشتركون',
    },
    {
      id: 6,
      name: 'خالد الفيصل',
      avatar: 'https://images.unsplash.com/photo-1507101105822-7472b28e22ac?w=150&h=150&fit=crop&crop=face',
      location: 'جدة',
      rating: 4.8,
      level: 'متقدم',
      mutualFriends: 2,
      commonInterests: ['كرة القدم'],
      reason: 'نفس المنطقة',
    },
    {
      id: 7,
      name: 'عمر البطل',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop&crop=face',
      location: 'الرياض',
      rating: 4.7,
      level: 'متقدم',
      mutualFriends: 6,
      commonInterests: ['كرة القدم', 'كرة الطائرة'],
      reason: 'اهتمامات مشتركة',
    },
  ],

  requests: [
    {
      id: 8,
      name: 'يوسف الحارثي',
      avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&h=150&fit=crop&crop=face',
      location: 'الطائف',
      rating: 4.6,
      level: 'متوسط',
      mutualFriends: 1,
      sentAt: '2024-01-14',
    },
    {
      id: 9,
      name: 'ناصر القحطاني',
      avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&crop=face',
      location: 'أبها',
      rating: 4.4,
      level: 'مبتدئ',
      mutualFriends: 0,
      sentAt: '2024-01-13',
    },
  ],

  groups: [
    {
      id: 1,
      name: 'نادي الرياض للكرة',
      members: 245,
      avatar: 'https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=150&h=150&fit=crop',
      description: 'مجموعة لمحبي كرة القدم في الرياض',
      isJoined: true,
      activity: 'نشط',
    },
    {
      id: 2,
      name: 'أبطال الملاعب',
      members: 189,
      avatar: 'https://images.unsplash.com/photo-1579952363873-27d3bfad9c0d?w=150&h=150&fit=crop',
      description: 'تجمع اللاعبين المحترفين',
      isJoined: false,
      activity: 'نشط جداً',
    },
    {
      id: 3,
      name: 'مجموعة الشباب',
      members: 67,
      avatar: 'https://images.unsplash.com/photo-1552318965-6e6be7484ada?w=150&h=150&fit=crop',
      description: 'للشباب من عمر 18-25',
      isJoined: true,
      activity: 'متوسط',
    },
  ],
};

type TabType = 'friends' | 'suggestions' | 'requests' | 'groups';

const NetworkPageEnhanced: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('friends');
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<'all' | 'online' | 'offline' | 'favorites'>('all');

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
      case 'playing': return 'يلعب الآن';
      case 'offline': return 'غير متصل';
      default: return 'غير معروف';
    }
  };

  const handleAcceptRequest = (id: number) => {
    console.log('Accept friend request:', id);
    // Add to friends logic here
  };

  const handleRejectRequest = (id: number) => {
    console.log('Reject friend request:', id);
    // Remove from requests logic here
  };

  const handleAddFriend = (id: number) => {
    console.log('Send friend request:', id);
    // Send friend request logic here
  };

  const handleJoinGroup = (id: number) => {
    console.log('Join group:', id);
    // Join group logic here
  };

  const filteredFriends = mockNetworkData.friends.filter(friend => {
    const matchesSearch = friend.name.toLowerCase().includes(searchQuery.toLowerCase());
    
    switch (filter) {
      case 'online': return matchesSearch && friend.isOnline;
      case 'offline': return matchesSearch && !friend.isOnline;
      case 'favorites': return matchesSearch && friend.isFavorite;
      default: return matchesSearch;
    }
  });

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">الشبكة الاجتماعية</h1>
        <p className="text-gray-600">تواصل مع اللاعبين وانضم للمجتمعات</p>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm mb-6">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6" dir="rtl">
            {[
              { id: 'friends', label: 'الأصدقاء', icon: Users, count: mockNetworkData.friends.length },
              { id: 'suggestions', label: 'مقترحات', icon: UserPlus, count: mockNetworkData.suggestions.length },
              { id: 'requests', label: 'الطلبات', icon: Heart, count: mockNetworkData.requests.length },
              { id: 'groups', label: 'المجموعات', icon: Badge, count: mockNetworkData.groups.length },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as TabType)}
                  className={`py-4 px-2 border-b-2 font-medium text-sm flex items-center gap-2 ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                  {tab.count > 0 && (
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      activeTab === tab.id ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'
                    }`}>
                      {tab.count}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Search and Filters */}
        {activeTab === 'friends' && (
          <div className="p-6 border-b border-gray-200">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  placeholder="البحث عن الأصدقاء..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pr-10"
                />
              </div>
              <div className="flex gap-2">
                {[
                  { id: 'all', label: 'الكل' },
                  { id: 'online', label: 'متصل' },
                  { id: 'offline', label: 'غير متصل' },
                  { id: 'favorites', label: 'المفضلة' },
                ].map((filterOption) => (
                  <button
                    key={filterOption.id}
                    onClick={() => setFilter(filterOption.id as 'all' | 'online' | 'offline' | 'favorites')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium ${
                      filter === filterOption.id
                        ? 'bg-blue-100 text-blue-600'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {filterOption.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Content */}
        <div className="p-6">
          {/* Friends Tab */}
          {activeTab === 'friends' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredFriends.map((friend) => (
                <div key={friend.id} className="bg-gray-50 rounded-xl p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="relative">
                      <img
                        src={friend.avatar}
                        alt={friend.name}
                        className="w-16 h-16 rounded-full object-cover"
                      />
                      <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-white ${getStatusColor(friend.status)}`} />
                      {friend.isFavorite && (
                        <div className="absolute -top-1 -left-1 bg-yellow-400 text-white p-1 rounded-full">
                          <Crown className="w-3 h-3" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">{friend.name}</h3>
                      <div className="flex items-center gap-1 text-gray-600 text-sm">
                        <MapPin className="w-4 h-4" />
                        <span>{friend.location}</span>
                      </div>
                      <p className="text-sm text-gray-500">{getStatusText(friend.status)}</p>
                    </div>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center justify-between text-sm">
                      <span>التقييم</span>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-500 fill-current" />
                        <span className="font-semibold">{friend.rating}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span>المستوى</span>
                      <span className="font-semibold text-blue-600">{friend.level}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span>المباريات المشتركة</span>
                      <span className="font-semibold">{friend.gamesPlayed}</span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button className="flex-1 bg-blue-600 hover:bg-blue-700">
                      <MessageCircle className="w-4 h-4 ml-2" />
                      رسالة
                    </Button>
                    <Button variant="outline" className="flex-1">
                      <Gamepad2 className="w-4 h-4 ml-2" />
                      دعوة للعب
                    </Button>
                    <Button variant="outline">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Suggestions Tab */}
          {activeTab === 'suggestions' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mockNetworkData.suggestions.map((suggestion) => (
                <div key={suggestion.id} className="bg-gray-50 rounded-xl p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <img
                      src={suggestion.avatar}
                      alt={suggestion.name}
                      className="w-16 h-16 rounded-full object-cover"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">{suggestion.name}</h3>
                      <div className="flex items-center gap-1 text-gray-600 text-sm">
                        <MapPin className="w-4 h-4" />
                        <span>{suggestion.location}</span>
                      </div>
                      <p className="text-sm text-blue-600">{suggestion.reason}</p>
                    </div>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center justify-between text-sm">
                      <span>التقييم</span>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-500 fill-current" />
                        <span className="font-semibold">{suggestion.rating}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span>أصدقاء مشتركون</span>
                      <span className="font-semibold">{suggestion.mutualFriends}</span>
                    </div>
                    <div className="text-sm">
                      <span className="text-gray-600">الاهتمامات: </span>
                      <span className="font-semibold">{suggestion.commonInterests.join(', ')}</span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button 
                      onClick={() => handleAddFriend(suggestion.id)}
                      className="flex-1 bg-green-600 hover:bg-green-700"
                    >
                      <UserPlus className="w-4 h-4 ml-2" />
                      إضافة صديق
                    </Button>
                    <Button variant="outline">
                      <MessageCircle className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Requests Tab */}
          {activeTab === 'requests' && (
            <div className="space-y-4">
              {mockNetworkData.requests.map((request) => (
                <div key={request.id} className="bg-gray-50 rounded-xl p-6 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <img
                      src={request.avatar}
                      alt={request.name}
                      className="w-16 h-16 rounded-full object-cover"
                    />
                    <div>
                      <h3 className="font-semibold text-lg">{request.name}</h3>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          <span>{request.location}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-yellow-500 fill-current" />
                          <span>{request.rating}</span>
                        </div>
                        <span>{request.mutualFriends} أصدقاء مشتركون</span>
                      </div>
                      <p className="text-sm text-gray-500">
                        أرسل الطلب في {new Date(request.sentAt).toLocaleDateString('ar-SA')}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button 
                      onClick={() => handleAcceptRequest(request.id)}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <CheckCircle className="w-4 h-4 ml-2" />
                      قبول
                    </Button>
                    <Button 
                      onClick={() => handleRejectRequest(request.id)}
                      variant="outline"
                      className="text-red-600 border-red-300 hover:bg-red-50"
                    >
                      <X className="w-4 h-4 ml-2" />
                      رفض
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Groups Tab */}
          {activeTab === 'groups' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mockNetworkData.groups.map((group) => (
                <div key={group.id} className="bg-gray-50 rounded-xl p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <img
                      src={group.avatar}
                      alt={group.name}
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">{group.name}</h3>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          <span>{group.members} عضو</span>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          group.activity === 'نشط جداً' ? 'bg-green-100 text-green-600' :
                          group.activity === 'نشط' ? 'bg-blue-100 text-blue-600' :
                          'bg-gray-100 text-gray-600'
                        }`}>
                          {group.activity}
                        </span>
                      </div>
                    </div>
                  </div>

                  <p className="text-gray-600 text-sm mb-4">{group.description}</p>

                  <div className="flex gap-2">
                    {group.isJoined ? (
                      <Button variant="outline" className="flex-1">
                        <CheckCircle className="w-4 h-4 ml-2 text-green-600" />
                        عضو
                      </Button>
                    ) : (
                      <Button 
                        onClick={() => handleJoinGroup(group.id)}
                        className="flex-1 bg-blue-600 hover:bg-blue-700"
                      >
                        <UserPlus className="w-4 h-4 ml-2" />
                        انضمام
                      </Button>
                    )}
                    <Button variant="outline">
                      <Share2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NetworkPageEnhanced;
