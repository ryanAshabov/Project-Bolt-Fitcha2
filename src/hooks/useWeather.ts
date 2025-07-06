import { useState, useEffect } from 'react';
import { WeatherData } from '../types';

export const useWeather = (location?: string) => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!location) {
return;
}

    const fetchWeather = async () => {
      setLoading(true);
      setError(null);

      try {
        // Mock weather data for development
        // In production, you would call a real weather API
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const mockWeather: WeatherData = {
          temperature: 22,
          condition: 'Partly Cloudy',
          humidity: 65,
          windSpeed: 12,
          precipitation: 10,
          icon: '⛅',
          forecast: [
            {
              date: new Date().toISOString().split('T')[0],
              temperature: { min: 18, max: 25 },
              condition: 'Partly Cloudy',
              precipitation: 10,
              icon: '⛅',
            },
            {
              date: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0],
              temperature: { min: 20, max: 27 },
              condition: 'Sunny',
              precipitation: 0,
              icon: '☀️',
            },
            {
              date: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString().split('T')[0],
              temperature: { min: 16, max: 23 },
              condition: 'Light Rain',
              precipitation: 70,
              icon: '🌧️',
            },
          ],
        };

        setWeather(mockWeather);
      } catch (err) {
        setError('Failed to fetch weather data');
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
  }, [location]);

  const isGoodForOutdoorSports = (weather: WeatherData) => {
    return weather.precipitation < 30 && 
           weather.windSpeed < 25 && 
           weather.temperature > 5 && 
           weather.temperature < 40;
  };

  return {
    weather,
    loading,
    error,
    isGoodForOutdoorSports: weather ? isGoodForOutdoorSports(weather) : null,
  };
};