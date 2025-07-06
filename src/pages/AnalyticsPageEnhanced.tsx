import React, { useState } from 'react';
import { 
  Trophy, 
  Clock,
  Star,
  Gamepad2,
  ChevronRight,
  ChevronDown,
  Filter,
  Download,
  ArrowUp,
  ArrowDown,
  Minus,
  MapPin
} from 'lucide-react';
import { Button } from '../components/ui/Button';

// Mock analytics data
const mockAnalyticsData = {
  overview: {
    totalGames: 145,
    winRate: 67.6,
    averageRating: 4.8,
    totalHours: 289,
    monthlyGames: 18,
    weeklyGames: 4.5,
    bestStreak: 12,
    currentStreak: 3,
    goals: 67,
    assists: 34,
    cleanSheets: 23,
    improvement: 15.2 // percentage improvement
  },

  monthly: [
    { month: 'يناير', games: 18, wins: 12, rating: 4.8, hours: 36 },
    { month: 'ديسمبر', games: 16, wins: 10, rating: 4.7, hours: 32 },
    { month: 'نوفمبر', games: 20, wins: 14, rating: 4.9, hours: 40 },
    { month: 'أكتوبر', games: 15, wins: 8, rating: 4.6, hours: 30 },
    { month: 'سبتمبر', games: 22, wins: 16, rating: 4.8, hours: 44 },
    { month: 'أغسطس', games: 19, wins: 13, rating: 4.7, hours: 38 }
  ],

  weeklyPerformance: [
    { week: 'هذا الأسبوع', games: 3, wins: 2, rating: 4.7, change: 0.1 },
    { week: 'الأسبوع الماضي', games: 4, wins: 3, rating: 4.6, change: -0.2 },
    { week: 'قبل أسبوعين', games: 5, wins: 4, rating: 4.8, change: 0.3 },
    { week: 'قبل 3 أسابيع', games: 2, wins: 1, rating: 4.5, change: -0.1 }
  ],

  gameTypes: [
    { type: 'كرة القدم', games: 89, winRate: 70.8, avgRating: 4.9 },
    { type: 'كرة السلة', games: 32, winRate: 62.5, avgRating: 4.6 },
    { type: 'كرة الطائرة', games: 24, winRate: 66.7, avgRating: 4.8 }
  ],

  positions: [
    { position: 'وسط الملعب', games: 65, performance: 4.9 },
    { position: 'مهاجم', games: 45, performance: 4.7 },
    { position: 'مدافع', games: 35, performance: 4.8 }
  ],

  achievements: {
    recent: [
      { title: 'صانع الألعاب', date: '2024-01-14', type: 'games' },
      { title: 'النجم الساطع', date: '2024-01-10', type: 'rating' },
      { title: 'المحارب الجديد', date: '2024-01-05', type: 'wins' }
    ],
    progress: [
      { title: 'المحارب', current: 98, target: 100, percentage: 98 },
      { title: 'الماراثونر', current: 289, target: 500, percentage: 57.8 },
      { title: 'القناص', current: 67, target: 100, percentage: 67 }
    ]
  },

  venues: [
    { name: 'ملعب الملك فهد', games: 35, winRate: 74.3, avgRating: 4.9 },
    { name: 'نادي الأهلي', games: 28, winRate: 67.9, avgRating: 4.8 },
    { name: 'ملعب الأمير فيصل', games: 22, winRate: 63.6, avgRating: 4.7 },
    { name: 'مجمع الرياض الرياضي', games: 18, winRate: 72.2, avgRating: 4.8 }
  ],

  timeDistribution: [
    { time: 'الصباح (6-12)', games: 45, winRate: 71.1 },
    { time: 'بعد الظهر (12-18)', games: 62, winRate: 66.1 },
    { time: 'المساء (18-24)', games: 38, winRate: 68.4 }
  ]
};

type TimeFilter = 'week' | 'month' | 'year' | 'all';

const AnalyticsPageEnhanced: React.FC = () => {
  const [timeFilter, setTimeFilter] = useState<TimeFilter>('month');
  const [selectedMetric, setSelectedMetric] = useState<'games' | 'performance' | 'time'>('games');
  const [showDetails, setShowDetails] = useState(false);

  const getChangeIcon = (change: number) => {
    if (change > 0) return <ArrowUp className="w-4 h-4 text-green-600" />;
    if (change < 0) return <ArrowDown className="w-4 h-4 text-red-600" />;
    return <Minus className="w-4 h-4 text-gray-600" />;
  };

  const getChangeColor = (change: number) => {
    if (change > 0) return 'text-green-600';
    if (change < 0) return 'text-red-600';
    return 'text-gray-600';
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">لوحة التحليلات</h1>
            <p className="text-gray-600">تتبع أدائك وتطور مهاراتك</p>
          </div>
          
          <div className="flex items-center gap-3 mt-4 md:mt-0">
            <div className="flex items-center gap-2 bg-white rounded-lg p-1 shadow-sm">
              {(['week', 'month', 'year', 'all'] as TimeFilter[]).map((filter) => (
                <button
                  key={filter}
                  onClick={() => setTimeFilter(filter)}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                    timeFilter === filter
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {filter === 'week' && 'أسبوع'}
                  {filter === 'month' && 'شهر'}
                  {filter === 'year' && 'سنة'}
                  {filter === 'all' && 'الكل'}
                </button>
              ))}
            </div>
            
            <Button variant="outline">
              <Filter className="w-4 h-4 ml-2" />
              فلتر
            </Button>
            
            <Button variant="outline">
              <Download className="w-4 h-4 ml-2" />
              تحميل التقرير
            </Button>
          </div>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">إجمالي المباريات</p>
              <p className="text-3xl font-bold text-gray-900">{mockAnalyticsData.overview.totalGames}</p>
              <div className="flex items-center mt-2">
                <ArrowUp className="w-4 h-4 text-green-600" />
                <span className="text-green-600 text-sm font-medium">+{mockAnalyticsData.overview.improvement}%</span>
                <span className="text-gray-500 text-sm mr-2">من الشهر الماضي</span>
              </div>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <Gamepad2 className="w-8 h-8 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">معدل الفوز</p>
              <p className="text-3xl font-bold text-gray-900">{mockAnalyticsData.overview.winRate}%</p>
              <div className="flex items-center mt-2">
                <ArrowUp className="w-4 h-4 text-green-600" />
                <span className="text-green-600 text-sm font-medium">+5.2%</span>
                <span className="text-gray-500 text-sm mr-2">من الشهر الماضي</span>
              </div>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <Trophy className="w-8 h-8 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">التقييم المتوسط</p>
              <p className="text-3xl font-bold text-gray-900">{mockAnalyticsData.overview.averageRating}</p>
              <div className="flex items-center mt-2">
                <ArrowUp className="w-4 h-4 text-green-600" />
                <span className="text-green-600 text-sm font-medium">+0.3</span>
                <span className="text-gray-500 text-sm mr-2">من الشهر الماضي</span>
              </div>
            </div>
            <div className="p-3 bg-yellow-100 rounded-full">
              <Star className="w-8 h-8 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">ساعات اللعب</p>
              <p className="text-3xl font-bold text-gray-900">{mockAnalyticsData.overview.totalHours}</p>
              <div className="flex items-center mt-2">
                <ArrowUp className="w-4 h-4 text-green-600" />
                <span className="text-green-600 text-sm font-medium">+12.5%</span>
                <span className="text-gray-500 text-sm mr-2">من الشهر الماضي</span>
              </div>
            </div>
            <div className="p-3 bg-purple-100 rounded-full">
              <Clock className="w-8 h-8 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Performance Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">الأداء الشهري</h3>
              <div className="flex gap-2">
                <button 
                  onClick={() => setSelectedMetric('games')}
                  className={`px-3 py-1 rounded-md text-sm ${
                    selectedMetric === 'games' ? 'bg-blue-100 text-blue-600' : 'text-gray-600'
                  }`}
                >
                  المباريات
                </button>
                <button 
                  onClick={() => setSelectedMetric('performance')}
                  className={`px-3 py-1 rounded-md text-sm ${
                    selectedMetric === 'performance' ? 'bg-blue-100 text-blue-600' : 'text-gray-600'
                  }`}
                >
                  الأداء
                </button>
              </div>
            </div>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {mockAnalyticsData.monthly.map((month, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">{month.month}</span>
                      <span className="text-sm text-gray-600">
                        {selectedMetric === 'games' ? `${month.games} مباراة` : `${month.rating} ⭐`}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ 
                          width: selectedMetric === 'games' 
                            ? `${(month.games / 25) * 100}%` 
                            : `${(month.rating / 5) * 100}%` 
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold">الأداء الأسبوعي</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {mockAnalyticsData.weeklyPerformance.map((week, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium">{week.week}</p>
                    <p className="text-sm text-gray-600">{week.games} مباريات · {week.wins} انتصار</p>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-bold">{week.rating}</span>
                      {getChangeIcon(week.change)}
                    </div>
                    <span className={`text-sm ${getChangeColor(week.change)}`}>
                      {week.change > 0 ? '+' : ''}{week.change}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Game Types Performance */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold">الأداء حسب نوع اللعبة</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {mockAnalyticsData.gameTypes.map((game, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{game.type}</p>
                    <p className="text-sm text-gray-600">{game.games} مباراة</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-green-600">{game.winRate}%</p>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-500 fill-current" />
                      <span className="text-sm">{game.avgRating}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Position Analysis */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold">تحليل المراكز</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {mockAnalyticsData.positions.map((position, index) => (
                <div key={index}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">{position.position}</span>
                    <span className="text-sm font-bold">{position.performance}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full"
                      style={{ width: `${(position.performance / 5) * 100}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-600 mt-1">{position.games} مباراة</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Achievements */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold">الإنجازات الأخيرة</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {mockAnalyticsData.achievements.recent.map((achievement, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="p-2 bg-yellow-100 rounded-full">
                    <Trophy className="w-5 h-5 text-yellow-600" />
                  </div>
                  <div>
                    <p className="font-medium">{achievement.title}</p>
                    <p className="text-sm text-gray-600">{achievement.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Venue Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold">الأداء حسب الملعب</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {mockAnalyticsData.venues.map((venue, index) => (
                <div key={index} className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-full">
                      <MapPin className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium">{venue.name}</p>
                      <p className="text-sm text-gray-600">{venue.games} مباراة</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-green-600">{venue.winRate}%</p>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-500 fill-current" />
                      <span className="text-sm">{venue.avgRating}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold">توزيع الأوقات</h3>
          </div>
          <div className="p-6">
            <div className="space-y-6">
              {mockAnalyticsData.timeDistribution.map((time, index) => (
                <div key={index}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">{time.time}</span>
                    <span className="text-sm font-bold">{time.winRate}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div 
                      className="bg-gradient-to-r from-green-500 to-green-600 h-3 rounded-full"
                      style={{ width: `${time.winRate}%` }}
                    />
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{time.games} مباراة</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Progress Tracking */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">تتبع التقدم نحو الإنجازات</h3>
            <Button 
              variant="outline" 
              onClick={() => setShowDetails(!showDetails)}
            >
              {showDetails ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
              {showDetails ? 'إخفاء التفاصيل' : 'عرض التفاصيل'}
            </Button>
          </div>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {mockAnalyticsData.achievements.progress.map((achievement, index) => (
              <div key={index} className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold">{achievement.title}</h4>
                  <span className="text-sm text-gray-600">{achievement.percentage}%</span>
                </div>
                <div className="w-full bg-gray-300 rounded-full h-2 mb-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all"
                    style={{ width: `${achievement.percentage}%` }}
                  />
                </div>
                <p className="text-sm text-gray-600">
                  {achievement.current} / {achievement.target}
                </p>
                {showDetails && (
                  <div className="mt-3 pt-3 border-t border-gray-200">
                    <p className="text-xs text-gray-500">
                      تحتاج إلى {achievement.target - achievement.current} إضافية للحصول على هذا الإنجاز
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPageEnhanced;
