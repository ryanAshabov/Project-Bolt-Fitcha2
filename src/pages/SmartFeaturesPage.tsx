import React, { useState } from 'react';
import { Header } from '../components/layout/Header';
import { CourtConcierge } from '../components/ai/CourtConcierge';
import { ARCourtPreview } from '../components/ar/ARCourtPreview';
import { RealTimeRating } from '../components/rating/RealTimeRating';
import { CourtCommunity } from '../components/social/CourtCommunity';
import { SmartBookingSystem } from '../components/booking/SmartBookingSystem';
import { VoiceCommands } from '../components/voice/VoiceCommands';
import { IoTIntegration } from '../components/iot/IoTIntegration';
import { 
  Brain, 
  Camera, 
  Star, 
  Users, 
  Calendar, 
  Mic, 
  Wifi,
  Zap,
  Sparkles,
} from 'lucide-react';

export const SmartFeaturesPage: React.FC = () => {
  const [activeFeature, setActiveFeature] = useState<string>('ai-concierge');

  const features = [
    {
      id: 'ai-concierge',
      name: 'AI Assistant',
      icon: Brain,
      description: 'Smart bot to help you find the perfect courts',
      component: CourtConcierge,
      gradient: 'from-blue-600 to-purple-600',
    },
    {
      id: 'ar-preview',
      name: 'AR Preview',
      icon: Camera,
      description: 'Explore courts using augmented reality',
      component: ARCourtPreview,
      gradient: 'from-purple-600 to-pink-600',
    },
    {
      id: 'real-time-rating',
      name: 'Live Rating',
      icon: Star,
      description: 'Real-time court conditions and crowd levels',
      component: RealTimeRating,
      gradient: 'from-yellow-500 to-orange-600',
    },
    {
      id: 'community',
      name: 'Court Community',
      icon: Users,
      description: 'Connect with other players and join events',
      component: CourtCommunity,
      gradient: 'from-emerald-500 to-teal-600',
    },
    {
      id: 'smart-booking',
      name: 'Smart Booking',
      icon: Calendar,
      description: 'Advanced booking system with AI optimization',
      component: SmartBookingSystem,
      gradient: 'from-indigo-600 to-blue-600',
    },
    {
      id: 'voice-commands',
      name: 'Voice Control',
      icon: Mic,
      description: 'Control the app using your voice',
      component: VoiceCommands,
      gradient: 'from-red-500 to-pink-600',
    },
    {
      id: 'iot-integration',
      name: 'IoT Integration',
      icon: Wifi,
      description: 'Connect with smart sensors and devices',
      component: IoTIntegration,
      gradient: 'from-cyan-500 to-blue-600',
    },
  ];

  const activeFeatureData = features.find(f => f.id === activeFeature);
  const ActiveComponent = activeFeatureData?.component;

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-6">
            <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-4 rounded-2xl shadow-lg">
              <Sparkles className="h-10 w-10 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-4">
            Advanced Smart Features
          </h1>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Discover the future of sports with AI, AR, and IoT technologies
          </p>
        </div>

        {/* Features Navigation */}
        <div className="bg-white rounded-2xl shadow-lg mb-8 overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-7">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <button
                  key={feature.id}
                  onClick={() => setActiveFeature(feature.id)}
                  className={`p-6 text-center transition-all duration-300 hover:bg-slate-50 ${
                    activeFeature === feature.id 
                      ? 'bg-gradient-to-br from-blue-50 to-purple-50 border-b-4 border-blue-500' 
                      : 'border-b-4 border-transparent'
                  }`}
                >
                  <div className={`w-12 h-12 mx-auto mb-3 rounded-xl bg-gradient-to-r ${feature.gradient} flex items-center justify-center shadow-lg`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className={`font-semibold text-sm mb-1 ${
                    activeFeature === feature.id ? 'text-blue-900' : 'text-slate-900'
                  }`}>
                    {feature.name}
                  </h3>
                  <p className="text-xs text-slate-600 leading-tight">
                    {feature.description}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Active Feature Content */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* Feature Header */}
          <div className={`bg-gradient-to-r ${activeFeatureData?.gradient} p-6 text-white`}>
            <div className="flex items-center space-x-4">
              {activeFeatureData && (
                <activeFeatureData.icon className="h-8 w-8" />
              )}
              <div>
                <h2 className="text-2xl font-bold">{activeFeatureData?.name}</h2>
                <p className="text-white text-opacity-90 mt-1">
                  {activeFeatureData?.description}
                </p>
              </div>
            </div>
          </div>

          {/* Feature Component */}
          <div className="p-6">
            {ActiveComponent && (
              <ActiveComponent courtId="1" />
            )}
          </div>
        </div>

        {/* Coming Soon Features */}
        <div className="mt-12 bg-gradient-to-r from-slate-900 to-slate-800 rounded-2xl p-8 text-white">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold mb-4">Coming Soon: More Innovative Features</h2>
            <p className="text-slate-300">We're working on cutting-edge technologies to enhance your sports experience</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white bg-opacity-10 rounded-xl p-6 text-center">
              <div className="text-4xl mb-4">🤖</div>
              <h3 className="font-bold mb-2">AI Coach</h3>
              <p className="text-sm text-slate-300">Personal AI trainer that analyzes your performance and provides customized tips</p>
            </div>

            <div className="bg-white bg-opacity-10 rounded-xl p-6 text-center">
              <div className="text-4xl mb-4">🥽</div>
              <h3 className="font-bold mb-2">Virtual Reality</h3>
              <p className="text-sm text-slate-300">Train in realistic virtual environments from your home</p>
            </div>

            <div className="bg-white bg-opacity-10 rounded-xl p-6 text-center">
              <div className="text-4xl mb-4">🧬</div>
              <h3 className="font-bold mb-2">Biometric Analysis</h3>
              <p className="text-sm text-slate-300">Advanced analysis of your movements and physical performance using AI</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};