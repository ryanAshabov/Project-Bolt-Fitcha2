import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Users, Zap, Brain, Repeat, Shield, CreditCard } from 'lucide-react';
import { Button } from '../ui/Button';
import { useAuth } from '../../hooks/useAuth';

interface SmartBookingOptions {
  autoRebook: boolean;
  flexibleTime: boolean;
  groupScheduling: boolean;
  backupCourt: boolean;
  dynamicPricing: boolean;
  loyaltyPoints: boolean;
}

interface BookingPreference {
  sport: string;
  preferredTimes: string[];
  maxDistance: number;
  priceRange: { min: number; max: number };
  skillLevel: string;
  recurringPattern?: {
    frequency: 'weekly' | 'monthly';
    dayOfWeek: number;
    time: string;
  };
}

export const SmartBookingSystem: React.FC = () => {
  const { user } = useAuth();
  const [smartOptions, setSmartOptions] = useState<SmartBookingOptions>({
    autoRebook: false,
    flexibleTime: false,
    groupScheduling: false,
    backupCourt: false,
    dynamicPricing: true,
    loyaltyPoints: true,
  });

  const [preferences, setPreferences] = useState<BookingPreference>({
    sport: 'Basketball',
    preferredTimes: ['18:00', '19:00', '20:00'],
    maxDistance: 10,
    priceRange: { min: 0, max: 100 },
    skillLevel: 'Intermediate',
    recurringPattern: {
      frequency: 'weekly',
      dayOfWeek: 5, // Friday
      time: '18:00',
    },
  });

  const [aiSuggestions, setAiSuggestions] = useState<any[]>([]);
  const [loyaltyPoints, setLoyaltyPoints] = useState(1250);

  useEffect(() => {
    generateAISuggestions();
  }, [preferences]);

  const generateAISuggestions = () => {
    // Mock AI suggestions based on user preferences and behavior
    const suggestions = [
      {
        id: '1',
        type: 'optimal_time',
        title: 'الوقت الأمثل للحجز',
        description: 'بناءً على تحليل بياناتك، أفضل وقت لك هو الجمعة 6 مساءً',
        confidence: 92,
        action: 'احجز الآن',
        savings: 15,
      },
      {
        id: '2',
        type: 'price_alert',
        title: 'تنبيه السعر',
        description: 'ملعب Elite Tennis Center سينخفض سعره 20% غداً',
        confidence: 87,
        action: 'احجز غداً',
        savings: 20,
      },
      {
        id: '3',
        type: 'group_opportunity',
        title: 'فرصة مجموعة',
        description: 'يمكنك توفير 30% بالانضمام لمجموعة أحمد محمد',
        confidence: 78,
        action: 'انضم للمجموعة',
        savings: 30,
      },
    ];

    setAiSuggestions(suggestions);
  };

  const handleSmartBooking = async () => {
    console.log('Smart booking with options:', smartOptions);
    console.log('User preferences:', preferences);
    
    // Here you would implement the smart booking logic
    // This could include:
    // - Finding optimal courts based on AI analysis
    // - Setting up recurring bookings
    // - Coordinating with group members
    // - Booking backup courts
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 90) {
return 'text-emerald-600 bg-emerald-100';
}
    if (confidence >= 80) {
return 'text-blue-600 bg-blue-100';
}
    if (confidence >= 70) {
return 'text-yellow-600 bg-yellow-100';
}
    return 'text-red-600 bg-red-100';
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl p-6 text-white">
        <div className="flex items-center space-x-3 mb-4">
          <Brain className="h-8 w-8" />
          <h2 className="text-2xl font-bold">نظام الحجز الذكي</h2>
        </div>
        <p className="text-purple-100">
          يستخدم الذكاء الاصطناعي لتحليل تفضيلاتك وإيجاد أفضل الخيارات تلقائياً
        </p>
      </div>

      {/* AI Suggestions */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
        <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center space-x-2">
          <Zap className="h-5 w-5 text-yellow-500" />
          <span>اقتراحات ذكية</span>
        </h3>
        
        <div className="space-y-4">
          {aiSuggestions.map((suggestion) => (
            <div key={suggestion.id} className="border border-slate-200 rounded-lg p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <h4 className="font-medium text-slate-900">{suggestion.title}</h4>
                    <span className={`text-xs px-2 py-1 rounded-full ${getConfidenceColor(suggestion.confidence)}`}>
                      {suggestion.confidence}% دقة
                    </span>
                  </div>
                  <p className="text-sm text-slate-600 mb-3">{suggestion.description}</p>
                  <div className="flex items-center space-x-4 text-sm">
                    <span className="text-emerald-600 font-medium">
                      💰 توفير {suggestion.savings}%
                    </span>
                  </div>
                </div>
                <Button size="sm" className="bg-gradient-to-r from-purple-600 to-blue-600">
                  {suggestion.action}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Smart Options */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">خيارات الحجز الذكي</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <Repeat className="h-5 w-5 text-blue-600" />
                <div>
                  <h4 className="font-medium text-slate-900">الحجز التلقائي</h4>
                  <p className="text-sm text-slate-600">يحجز نفس الوقت كل أسبوع</p>
                </div>
              </div>
              <input
                type="checkbox"
                checked={smartOptions.autoRebook}
                onChange={(e) => setSmartOptions(prev => ({...prev, autoRebook: e.target.checked}))}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-slate-300 rounded"
              />
            </div>

            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <Clock className="h-5 w-5 text-emerald-600" />
                <div>
                  <h4 className="font-medium text-slate-900">الوقت المرن</h4>
                  <p className="text-sm text-slate-600">يبحث في نطاق زمني واسع</p>
                </div>
              </div>
              <input
                type="checkbox"
                checked={smartOptions.flexibleTime}
                onChange={(e) => setSmartOptions(prev => ({...prev, flexibleTime: e.target.checked}))}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-slate-300 rounded"
              />
            </div>

            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <Users className="h-5 w-5 text-purple-600" />
                <div>
                  <h4 className="font-medium text-slate-900">تنسيق المجموعة</h4>
                  <p className="text-sm text-slate-600">ينسق مع جداول الأصدقاء</p>
                </div>
              </div>
              <input
                type="checkbox"
                checked={smartOptions.groupScheduling}
                onChange={(e) => setSmartOptions(prev => ({...prev, groupScheduling: e.target.checked}))}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-slate-300 rounded"
              />
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <Shield className="h-5 w-5 text-orange-600" />
                <div>
                  <h4 className="font-medium text-slate-900">ملعب احتياطي</h4>
                  <p className="text-sm text-slate-600">يحجز ملعب إضافي للأمان</p>
                </div>
              </div>
              <input
                type="checkbox"
                checked={smartOptions.backupCourt}
                onChange={(e) => setSmartOptions(prev => ({...prev, backupCourt: e.target.checked}))}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-slate-300 rounded"
              />
            </div>

            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <CreditCard className="h-5 w-5 text-red-600" />
                <div>
                  <h4 className="font-medium text-slate-900">التسعير الديناميكي</h4>
                  <p className="text-sm text-slate-600">يستفيد من تقلبات الأسعار</p>
                </div>
              </div>
              <input
                type="checkbox"
                checked={smartOptions.dynamicPricing}
                onChange={(e) => setSmartOptions(prev => ({...prev, dynamicPricing: e.target.checked}))}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-slate-300 rounded"
              />
            </div>

            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <Zap className="h-5 w-5 text-yellow-600" />
                <div>
                  <h4 className="font-medium text-slate-900">نقاط الولاء</h4>
                  <p className="text-sm text-slate-600">يستخدم النقاط للخصومات</p>
                </div>
              </div>
              <input
                type="checkbox"
                checked={smartOptions.loyaltyPoints}
                onChange={(e) => setSmartOptions(prev => ({...prev, loyaltyPoints: e.target.checked}))}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-slate-300 rounded"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Loyalty Points */}
      <div className="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold mb-2">نقاط الولاء</h3>
            <p className="text-yellow-100">استخدم نقاطك للحصول على خصومات حصرية</p>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold">{loyaltyPoints.toLocaleString()}</div>
            <div className="text-yellow-100 text-sm">نقطة متاحة</div>
          </div>
        </div>
        
        <div className="mt-4 grid grid-cols-3 gap-4">
          <div className="bg-white bg-opacity-20 rounded-lg p-3 text-center">
            <div className="font-bold">500 نقطة</div>
            <div className="text-xs text-yellow-100">خصم 10%</div>
          </div>
          <div className="bg-white bg-opacity-20 rounded-lg p-3 text-center">
            <div className="font-bold">1000 نقطة</div>
            <div className="text-xs text-yellow-100">خصم 20%</div>
          </div>
          <div className="bg-white bg-opacity-20 rounded-lg p-3 text-center">
            <div className="font-bold">2000 نقطة</div>
            <div className="text-xs text-yellow-100">حجز مجاني</div>
          </div>
        </div>
      </div>

      {/* Smart Booking Action */}
      <div className="text-center">
        <Button 
          onClick={handleSmartBooking}
          size="lg"
          className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 px-8"
        >
          <Brain className="h-5 w-5 mr-2" />
          تفعيل الحجز الذكي
        </Button>
        <p className="text-sm text-slate-600 mt-2">
          سيتم تحليل تفضيلاتك وإيجاد أفضل الخيارات المتاحة تلقائياً
        </p>
      </div>
    </div>
  );
};