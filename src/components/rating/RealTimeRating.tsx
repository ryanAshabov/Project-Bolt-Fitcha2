import React, { useState, useEffect } from 'react';
import { Star, Users, Thermometer, Droplets, Wind, Wifi, Car, Zap } from 'lucide-react';
import { Court } from '../../types';

interface RealTimeMetrics {
  courtCondition: number;
  crowdDensity: number;
  equipmentQuality: number;
  cleanliness: number;
  temperature: number;
  humidity: number;
  windSpeed: number;
  wifiStrength: number;
  parkingAvailability: number;
  lastUpdated: Date;
}

interface RealTimeRatingProps {
  court: Court;
}

export const RealTimeRating: React.FC<RealTimeRatingProps> = ({ court }) => {
  const [metrics, setMetrics] = useState<RealTimeMetrics>({
    courtCondition: 4.2,
    crowdDensity: 3.8,
    equipmentQuality: 4.5,
    cleanliness: 4.1,
    temperature: 22,
    humidity: 65,
    windSpeed: 12,
    wifiStrength: 4.0,
    parkingAvailability: 3.5,
    lastUpdated: new Date(),
  });

  const [isLive] = useState(true);

  useEffect(() => {
    // Simulate real-time updates
    const interval = setInterval(() => {
      setMetrics(prev => ({
        ...prev,
        crowdDensity: Math.max(1, Math.min(5, prev.crowdDensity + (Math.random() - 0.5) * 0.5)),
        temperature: Math.max(15, Math.min(35, prev.temperature + (Math.random() - 0.5) * 2)),
        humidity: Math.max(30, Math.min(90, prev.humidity + (Math.random() - 0.5) * 5)),
        windSpeed: Math.max(0, Math.min(30, prev.windSpeed + (Math.random() - 0.5) * 3)),
        lastUpdated: new Date(),
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // Constants for rating thresholds
  const RATING_THRESHOLDS = {
    EXCELLENT: 4,
    GOOD: 3,
  };

  // Constants for rating styles
  const RATING_STYLES = {
    EXCELLENT: 'text-emerald-600 bg-emerald-100',
    GOOD: 'text-yellow-600 bg-yellow-100',
    POOR: 'text-red-600 bg-red-100',
  };

  const getConditionColor = (value: number) => {
    if (value >= RATING_THRESHOLDS.EXCELLENT) {
      return RATING_STYLES.EXCELLENT;
    }
    if (value >= RATING_THRESHOLDS.GOOD) {
      return RATING_STYLES.GOOD;
    }
    return RATING_STYLES.POOR;
  };

  // Constants for crowd density thresholds
  const CROWD_THRESHOLDS = {
    VERY_CROWDED: 4,
    CROWDED: 3,
    MODERATE: 2,
  };

  // Constants for crowd level data
  const CROWD_LEVELS = {
    VERY_CROWDED: { label: 'مزدحم جداً', color: 'text-red-600 bg-red-100' },
    CROWDED: { label: 'مزدحم', color: 'text-yellow-600 bg-yellow-100' },
    MODERATE: { label: 'متوسط', color: 'text-blue-600 bg-blue-100' },
    QUIET: { label: 'هادئ', color: 'text-emerald-600 bg-emerald-100' },
  };

  const getCrowdLevel = (density: number) => {
    if (density >= CROWD_THRESHOLDS.VERY_CROWDED) {
      return CROWD_LEVELS.VERY_CROWDED;
    }
    if (density >= CROWD_THRESHOLDS.CROWDED) {
      return CROWD_LEVELS.CROWDED;
    }
    if (density >= CROWD_THRESHOLDS.MODERATE) {
      return CROWD_LEVELS.MODERATE;
    }
    return CROWD_LEVELS.QUIET;
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('ar-SA', { 
      hour: '2-digit', 
      minute: '2-digit',
      second: '2-digit',
    });
  };

  const crowdLevel = getCrowdLevel(metrics.crowdDensity);

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-slate-900 flex items-center space-x-2">
          <Zap className="h-5 w-5 text-blue-600" />
          <span>التقييم المباشر</span>
        </h3>
        <div className="flex items-center space-x-2">
          <div className={`w-2 h-2 rounded-full ${isLive ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`}></div>
          <span className="text-xs text-slate-500">
            آخر تحديث: {formatTime(metrics.lastUpdated)}
          </span>
        </div>
      </div>

      {/* Main Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {/* Court Condition */}
        <div className="text-center p-4 bg-slate-50 rounded-lg">
          <div className="flex items-center justify-center mb-2">
            <Star className="h-6 w-6 text-yellow-500 fill-current" />
          </div>
          <p className="text-2xl font-bold text-slate-900">{metrics.courtCondition}</p>
          <p className="text-xs text-slate-600">حالة الملعب</p>
        </div>

        {/* Crowd Density */}
        <div className="text-center p-4 bg-slate-50 rounded-lg">
          <div className="flex items-center justify-center mb-2">
            <Users className="h-6 w-6 text-blue-500" />
          </div>
          <p className={`text-sm font-medium px-2 py-1 rounded-full ${crowdLevel.color}`}>
            {crowdLevel.label}
          </p>
          <p className="text-xs text-slate-600 mt-1">الازدحام</p>
        </div>

        {/* Equipment Quality */}
        <div className="text-center p-4 bg-slate-50 rounded-lg">
          <div className="flex items-center justify-center mb-2">
            <Zap className="h-6 w-6 text-purple-500" />
          </div>
          <p className="text-2xl font-bold text-slate-900">{metrics.equipmentQuality}</p>
          <p className="text-xs text-slate-600">جودة المعدات</p>
        </div>

        {/* Cleanliness */}
        <div className="text-center p-4 bg-slate-50 rounded-lg">
          <div className="flex items-center justify-center mb-2">
            <Droplets className="h-6 w-6 text-cyan-500" />
          </div>
          <p className="text-2xl font-bold text-slate-900">{metrics.cleanliness}</p>
          <p className="text-xs text-slate-600">النظافة</p>
        </div>
      </div>

      {/* Environmental Conditions */}
      <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg p-4 mb-6">
        <h4 className="font-medium text-slate-900 mb-3 flex items-center space-x-2">
          <Thermometer className="h-4 w-4 text-blue-600" />
          <span>الظروف البيئية</span>
        </h4>
        
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="flex items-center justify-center mb-1">
              <Thermometer className="h-4 w-4 text-red-500" />
            </div>
            <p className="text-lg font-bold text-slate-900">{metrics.temperature}°C</p>
            <p className="text-xs text-slate-600">الحرارة</p>
          </div>
          
          <div>
            <div className="flex items-center justify-center mb-1">
              <Droplets className="h-4 w-4 text-blue-500" />
            </div>
            <p className="text-lg font-bold text-slate-900">{metrics.humidity}%</p>
            <p className="text-xs text-slate-600">الرطوبة</p>
          </div>
          
          <div>
            <div className="flex items-center justify-center mb-1">
              <Wind className="h-4 w-4 text-slate-500" />
            </div>
            <p className="text-lg font-bold text-slate-900">{metrics.windSpeed} km/h</p>
            <p className="text-xs text-slate-600">الرياح</p>
          </div>
        </div>
      </div>

      {/* Facilities Status */}
      <div className="space-y-3">
        <h4 className="font-medium text-slate-900">حالة المرافق</h4>
        
        <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
          <div className="flex items-center space-x-3">
            <Wifi className="h-5 w-5 text-blue-500" />
            <span className="text-sm text-slate-700">قوة الواي فاي</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="flex space-x-1">
              {[1, 2, 3, 4, 5].map((bar) => (
                <div
                  key={bar}
                  className={`w-1 h-4 rounded ${
                    bar <= metrics.wifiStrength ? 'bg-blue-500' : 'bg-slate-300'
                  }`}
                />
              ))}
            </div>
            <span className="text-sm font-medium text-slate-900">
              {metrics.wifiStrength}/5
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
          <div className="flex items-center space-x-3">
            <Car className="h-5 w-5 text-emerald-500" />
            <span className="text-sm text-slate-700">توفر المواقف</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-16 bg-slate-200 rounded-full h-2">
              <div 
                className="bg-emerald-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(metrics.parkingAvailability / 5) * 100}%` }}
              />
            </div>
            <span className="text-sm font-medium text-slate-900">
              {Math.round((metrics.parkingAvailability / 5) * 100)}%
            </span>
          </div>
        </div>
      </div>

      {/* Live Updates Indicator */}
      <div className="mt-4 p-3 bg-emerald-50 border border-emerald-200 rounded-lg">
        <div className="flex items-center space-x-2 text-emerald-800">
          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
          <span className="text-sm font-medium">التحديثات المباشرة مفعلة</span>
        </div>
        <p className="text-xs text-emerald-700 mt-1">
          يتم تحديث البيانات كل 5 ثوانٍ من أجهزة الاستشعار في الملعب
        </p>
      </div>
    </div>
  );
};