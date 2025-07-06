import React from 'react';
import { Cloud, Sun, CloudRain, Wind, Droplets, Thermometer } from 'lucide-react';
import { useWeather } from '../../hooks/useWeather';
import { useAuth } from '../../hooks/useAuth';
import { useTheme } from '../../hooks/useTheme';

export const WeatherWidget: React.FC = () => {
  const { user } = useAuth();
  const { isDark } = useTheme();
  const { weather, loading, error, isGoodForOutdoorSports } = useWeather(user?.location);

  if (loading) {
    return (
      <div className="bg-white dark:bg-slate-800 rounded-xl p-4 shadow-sm border border-slate-200 dark:border-slate-700">
        <div className="animate-pulse">
          <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-20 mb-2"></div>
          <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded w-16"></div>
        </div>
      </div>
    );
  }

  if (error || !weather) {
    return (
      <div className="bg-white dark:bg-slate-800 rounded-xl p-4 shadow-sm border border-slate-200 dark:border-slate-700">
        <p className="text-sm text-slate-500 dark:text-slate-400">Weather unavailable</p>
      </div>
    );
  }

  const getWeatherIcon = (condition: string) => {
    if (condition.toLowerCase().includes('rain')) {
return <CloudRain className="h-6 w-6" />;
}
    if (condition.toLowerCase().includes('cloud')) {
return <Cloud className="h-6 w-6" />;
}
    return <Sun className="h-6 w-6" />;
  };

  const getConditionColor = (condition: string) => {
    if (condition.toLowerCase().includes('rain')) {
return 'text-blue-600';
}
    if (condition.toLowerCase().includes('cloud')) {
return 'text-slate-600';
}
    return 'text-yellow-600';
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl p-4 shadow-sm border border-slate-200 dark:border-slate-700">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-medium text-slate-900 dark:text-white">Weather</h3>
        <div className={`${getConditionColor(weather.condition)}`}>
          {getWeatherIcon(weather.condition)}
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Thermometer className="h-4 w-4 text-slate-400" />
            <span className="text-2xl font-bold text-slate-900 dark:text-white">{weather.temperature}°C</span>
          </div>
          <span className="text-sm text-slate-600 dark:text-slate-300">{weather.condition}</span>
        </div>

        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="flex items-center space-x-2">
            <Droplets className="h-4 w-4 text-blue-500" />
            <span className="text-slate-600 dark:text-slate-300">{weather.humidity}%</span>
          </div>
          <div className="flex items-center space-x-2">
            <Wind className="h-4 w-4 text-slate-500" />
            <span className="text-slate-600 dark:text-slate-300">{weather.windSpeed} km/h</span>
          </div>
        </div>

        {/* Sports Recommendation */}
        <div className={`p-2 rounded-lg text-xs font-medium ${
          isGoodForOutdoorSports 
            ? 'bg-emerald-100 text-emerald-800' 
            : 'bg-orange-100 text-orange-800'
        }`}>
          {isGoodForOutdoorSports 
            ? '🌟 Perfect for outdoor sports!' 
            : '🏠 Consider indoor activities'
          }
        </div>

        {/* 3-Day Forecast */}
        <div className="border-t border-slate-200 dark:border-slate-700 pt-3">
          <h4 className="text-xs font-medium text-slate-700 dark:text-slate-300 mb-2">3-Day Forecast</h4>
          <div className="space-y-1">
            {weather.forecast.slice(0, 3).map((day, index) => (
              <div key={index} className="flex items-center justify-between text-xs dark:text-slate-300">
                <span className="text-slate-600 dark:text-slate-400">
                  {index === 0 ? 'Today' : 
                   index === 1 ? 'Tomorrow' : 
                   new Date(day.date).toLocaleDateString('en', { weekday: 'short' })
                  }
                </span>
                <div className="flex items-center space-x-2">
                  <span>{day.icon}</span>
                  <span className="text-slate-700 dark:text-slate-300">
                    {day.temperature.max}°/{day.temperature.min}°
                  </span>
                  {day.precipitation > 30 && (
                    <span className="text-blue-600 dark:text-blue-400">{day.precipitation}%</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};