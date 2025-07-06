import React, { useState } from 'react';
import { Users, MessageCircle, Trophy, Calendar, Star, Crown, Plus, Filter } from 'lucide-react';
import { Button } from '../ui/Button';
import { useAuth } from '../../hooks/useAuth';

interface CommunityMember {
  id: string;
  name: string;
  avatar: string;
  level: string;
  gamesPlayed: number;
  rating: number;
  isPro: boolean;
  isOnline: boolean;
  role: 'member' | 'moderator' | 'admin';
  joinedDate: Date;
}

interface CommunityEvent {
  id: string;
  title: string;
  type: 'tournament' | 'training' | 'social' | 'maintenance';
  date: Date;
  participants: number;
  maxParticipants: number;
  organizer: CommunityMember;
}

interface CommunityPost {
  id: string;
  author: CommunityMember;
  content: string;
  timestamp: Date;
  likes: number;
  comments: number;
  type: 'tip' | 'question' | 'announcement' | 'review';
}

export const CourtCommunity: React.FC<{ courtId: string }> = ({ courtId }) => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'feed' | 'members' | 'events' | 'leaderboard'>('feed');
  const [newPost, setNewPost] = useState('');

  // Mock data
  const communityMembers: CommunityMember[] = [
    {
      id: '1',
      name: 'أحمد محمد',
      avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
      level: 'محترف',
      gamesPlayed: 156,
      rating: 4.9,
      isPro: true,
      isOnline: true,
      role: 'admin',
      joinedDate: new Date('2024-01-15'),
    },
    {
      id: '2',
      name: 'سارة أحمد',
      avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
      level: 'متقدم',
      gamesPlayed: 89,
      rating: 4.7,
      isPro: false,
      isOnline: false,
      role: 'moderator',
      joinedDate: new Date('2024-02-20'),
    },
  ];

  const communityEvents: CommunityEvent[] = [
    {
      id: '1',
      title: 'بطولة التنس الشهرية',
      type: 'tournament',
      date: new Date('2025-01-20'),
      participants: 12,
      maxParticipants: 16,
      organizer: communityMembers[0],
    },
    {
      id: '2',
      title: 'جلسة تدريب للمبتدئين',
      type: 'training',
      date: new Date('2025-01-18'),
      participants: 6,
      maxParticipants: 8,
      organizer: communityMembers[1],
    },
  ];

  const communityPosts: CommunityPost[] = [
    {
      id: '1',
      author: communityMembers[0],
      content: 'نصيحة: تأكدوا من الإحماء جيداً قبل اللعب، خاصة في الطقس البارد. هذا يقلل من خطر الإصابة بشكل كبير.',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      likes: 23,
      comments: 8,
      type: 'tip',
    },
    {
      id: '2',
      author: communityMembers[1],
      content: 'هل يعرف أحد إذا كان الملعب سيكون متاحاً غداً الساعة 6 مساءً؟ أريد تنظيم مباراة ودية.',
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
      likes: 5,
      comments: 12,
      type: 'question',
    },
  ];

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin': return <Crown className="h-4 w-4 text-yellow-500" />;
      case 'moderator': return <Star className="h-4 w-4 text-blue-500" />;
      default: return null;
    }
  };

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case 'tournament': return 'bg-yellow-100 text-yellow-800';
      case 'training': return 'bg-blue-100 text-blue-800';
      case 'social': return 'bg-purple-100 text-purple-800';
      case 'maintenance': return 'bg-red-100 text-red-800';
      default: return 'bg-slate-100 text-slate-800';
    }
  };

  const handleCreatePost = () => {
    if (!newPost.trim()) {
return;
}
    // Here you would typically send to backend
    console.log('Creating post:', newPost);
    setNewPost('');
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200">
      {/* Header */}
      <div className="p-6 border-b border-slate-200">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold text-slate-900 flex items-center space-x-2">
              <Users className="h-6 w-6 text-blue-600" />
              <span>مجتمع الملعب</span>
            </h3>
            <p className="text-slate-600 mt-1">{communityMembers.length} عضو نشط</p>
          </div>
          <Button className="bg-gradient-to-r from-blue-600 to-purple-600">
            <Plus className="h-4 w-4 mr-2" />
            انضم للمجتمع
          </Button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-slate-200">
        <nav className="flex space-x-8 px-6">
          {[
            { id: 'feed', label: 'التحديثات', icon: MessageCircle },
            { id: 'members', label: 'الأعضاء', icon: Users },
            { id: 'events', label: 'الفعاليات', icon: Calendar },
            { id: 'leaderboard', label: 'المتصدرين', icon: Trophy },
          ].map((tab) => {
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
                <Icon className="h-4 w-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Feed Tab */}
        {activeTab === 'feed' && (
          <div className="space-y-6">
            {/* Create Post */}
            <div className="bg-slate-50 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <img
                  src={user?.avatar}
                  alt={user?.firstName}
                  className="w-10 h-10 rounded-full"
                />
                <div className="flex-1">
                  <textarea
                    value={newPost}
                    onChange={(e) => setNewPost(e.target.value)}
                    placeholder="شارك نصيحة أو اطرح سؤالاً..."
                    className="w-full p-3 border border-slate-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={3}
                    dir="rtl"
                  />
                  <div className="flex justify-between items-center mt-3">
                    <div className="flex space-x-2">
                      <select className="text-sm border border-slate-300 rounded px-2 py-1">
                        <option value="tip">نصيحة</option>
                        <option value="question">سؤال</option>
                        <option value="review">تقييم</option>
                      </select>
                    </div>
                    <Button onClick={handleCreatePost} disabled={!newPost.trim()}>
                      نشر
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Posts */}
            <div className="space-y-4">
              {communityPosts.map((post) => (
                <div key={post.id} className="border border-slate-200 rounded-lg p-4">
                  <div className="flex items-start space-x-3">
                    <div className="relative">
                      <img
                        src={post.author.avatar}
                        alt={post.author.name}
                        className="w-10 h-10 rounded-full"
                      />
                      {post.author.isOnline && (
                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white"></div>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h4 className="font-medium text-slate-900">{post.author.name}</h4>
                        {getRoleIcon(post.author.role)}
                        {post.author.isPro && (
                          <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
                            PRO
                          </span>
                        )}
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          post.type === 'tip' ? 'bg-emerald-100 text-emerald-800' :
                          post.type === 'question' ? 'bg-blue-100 text-blue-800' :
                          'bg-purple-100 text-purple-800'
                        }`}>
                          {post.type === 'tip' ? 'نصيحة' : 
                           post.type === 'question' ? 'سؤال' : 'تقييم'}
                        </span>
                      </div>
                      <p className="text-slate-700 mb-3" dir="rtl">{post.content}</p>
                      <div className="flex items-center space-x-4 text-sm text-slate-500">
                        <button className="flex items-center space-x-1 hover:text-blue-600">
                          <span>👍</span>
                          <span>{post.likes}</span>
                        </button>
                        <button className="flex items-center space-x-1 hover:text-blue-600">
                          <MessageCircle className="h-4 w-4" />
                          <span>{post.comments}</span>
                        </button>
                        <span>{new Date(post.timestamp).toLocaleDateString('ar-SA')}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Members Tab */}
        {activeTab === 'members' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-medium text-slate-900">أعضاء المجتمع</h4>
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                فلترة
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {communityMembers.map((member) => (
                <div key={member.id} className="border border-slate-200 rounded-lg p-4">
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <img
                        src={member.avatar}
                        alt={member.name}
                        className="w-12 h-12 rounded-full"
                      />
                      {member.isOnline && (
                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white"></div>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h4 className="font-medium text-slate-900">{member.name}</h4>
                        {getRoleIcon(member.role)}
                        {member.isPro && (
                          <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
                            PRO
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-slate-600">{member.level}</p>
                      <div className="flex items-center space-x-4 mt-2 text-xs text-slate-500">
                        <span>{member.gamesPlayed} مباراة</span>
                        <div className="flex items-center space-x-1">
                          <Star className="h-3 w-3 text-yellow-500 fill-current" />
                          <span>{member.rating}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Events Tab */}
        {activeTab === 'events' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-medium text-slate-900">الفعاليات القادمة</h4>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                إنشاء فعالية
              </Button>
            </div>
            
            <div className="space-y-4">
              {communityEvents.map((event) => (
                <div key={event.id} className="border border-slate-200 rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h4 className="font-medium text-slate-900">{event.title}</h4>
                        <span className={`text-xs px-2 py-1 rounded-full ${getEventTypeColor(event.type)}`}>
                          {event.type === 'tournament' ? 'بطولة' :
                           event.type === 'training' ? 'تدريب' :
                           event.type === 'social' ? 'اجتماعي' : 'صيانة'}
                        </span>
                      </div>
                      <p className="text-sm text-slate-600 mb-2">
                        منظم بواسطة {event.organizer.name}
                      </p>
                      <div className="flex items-center space-x-4 text-sm text-slate-500">
                        <span>{event.date.toLocaleDateString('ar-SA')}</span>
                        <span>{event.participants}/{event.maxParticipants} مشارك</span>
                      </div>
                    </div>
                    <Button size="sm">
                      انضم
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Leaderboard Tab */}
        {activeTab === 'leaderboard' && (
          <div className="space-y-4">
            <h4 className="font-medium text-slate-900">متصدرو الملعب</h4>
            
            <div className="space-y-3">
              {communityMembers
                .sort((a, b) => b.rating - a.rating)
                .map((member, index) => (
                <div key={member.id} className="flex items-center space-x-4 p-4 bg-slate-50 rounded-lg">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                    index === 0 ? 'bg-yellow-500 text-white' :
                    index === 1 ? 'bg-slate-400 text-white' :
                    index === 2 ? 'bg-amber-600 text-white' :
                    'bg-slate-200 text-slate-700'
                  }`}>
                    {index + 1}
                  </div>
                  <img
                    src={member.avatar}
                    alt={member.name}
                    className="w-10 h-10 rounded-full"
                  />
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <h4 className="font-medium text-slate-900">{member.name}</h4>
                      {member.isPro && (
                        <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
                          PRO
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-slate-600">{member.gamesPlayed} مباراة</p>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 text-yellow-500 fill-current" />
                      <span className="font-bold text-slate-900">{member.rating}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};