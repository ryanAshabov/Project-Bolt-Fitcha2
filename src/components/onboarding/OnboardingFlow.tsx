import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  User, 
  MapPin, 
  Search, 
  Calendar, 
  CheckCircle, 
  ArrowRight, 
  X, 
  Star, 
  Zap, 
  MessageCircle, 
  Users,
  Activity
} from 'lucide-react';
import { Button } from '../ui/Button';
import { OptimizedImage } from '../ui/Image';
import { useAuth } from '../../hooks/useAuth';

interface OnboardingFlowProps {
  onComplete: () => void;
  onSkip: () => void;
}

export const OnboardingFlow: React.FC<OnboardingFlowProps> = ({ 
  onComplete, 
  onSkip 
}) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [progress, setProgress] = useState(0);
  const totalSteps = 4;

  // Update progress when step changes
  useEffect(() => {
    setProgress((currentStep / totalSteps) * 100);
  }, [currentStep]);

  // Handle next step
  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };

  // Handle navigation to specific pages
  const handleNavigate = (path: string) => {
    navigate(path);
    onComplete();
  };

  // Render step 1: Welcome & Profile
  const renderStep1 = () => (
    <div className="text-center">
      <div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
        <User className="h-10 w-10 text-white" />
      </div>
      
      <h2 className="text-2xl font-bold text-gray-900 mb-4">
        Welcome to Fitcha, {user?.firstName}!
      </h2>
      
      <p className="text-gray-600 mb-6 max-w-md mx-auto">
        Let's get you started with a quick tour of the platform. We'll help you set up your profile, find courts, and connect with other players.
      </p>
      
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 mb-6 text-left">
        <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
          <User className="h-5 w-5 text-blue-600 mr-2" />
          Complete Your Profile
        </h3>
        
        <p className="text-gray-600 mb-4">
          A complete profile helps you connect with the right players and find the perfect games for your skill level.
        </p>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                <Star className="h-4 w-4 text-blue-600" />
              </div>
              <span className="text-gray-700">Add your favorite sports</span>
            </div>
            <CheckCircle className="h-5 w-5 text-green-500" />
          </div>
          
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                <MapPin className="h-4 w-4 text-blue-600" />
              </div>
              <span className="text-gray-700">Set your location</span>
            </div>
            <CheckCircle className="h-5 w-5 text-green-500" />
          </div>
          
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                <Activity className="h-4 w-4 text-blue-600" />
              </div>
              <span className="text-gray-700">Set your skill level</span>
            </div>
            <Button size="sm" onClick={() => handleNavigate('/profile')}>
              Complete
            </Button>
          </div>
        </div>
      </div>
      
      <Button onClick={handleNext} className="w-full">
        Continue Tour
        <ArrowRight className="h-4 w-4 ml-2" />
      </Button>
    </div>
  );

  // Render step 2: Finding Courts
  const renderStep2 = () => (
    <div className="text-center">
      <div className="w-20 h-20 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-6">
        <Search className="h-10 w-10 text-white" />
      </div>
      
      <h2 className="text-2xl font-bold text-gray-900 mb-4">
        Find the Perfect Court
      </h2>
      
      <p className="text-gray-600 mb-6 max-w-md mx-auto">
        Discover courts near you with our advanced search features. Filter by sport, location, amenities, and more.
      </p>
      
      <div className="bg-white rounded-lg overflow-hidden shadow-sm border border-gray-200 mb-6">
        <OptimizedImage
          src="https://images.pexels.com/photos/1752757/pexels-photo-1752757.jpeg?auto=compress&cs=tinysrgb&w=800&h=400&dpr=2"
          alt="Court search"
          width={800}
          height={400}
          className="w-full h-48 object-cover"
        />
        
        <div className="p-6">
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
            <Search className="h-5 w-5 text-purple-600 mr-2" />
            Advanced Search Features
          </h3>
          
          <div className="space-y-3 mb-4">
            <div className="flex items-center">
              <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
              <span className="text-gray-700">Filter by sport, price, and amenities</span>
            </div>
            
            <div className="flex items-center">
              <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
              <span className="text-gray-700">View courts on an interactive map</span>
            </div>
            
            <div className="flex items-center">
              <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
              <span className="text-gray-700">Use voice search for hands-free searching</span>
            </div>
            
            <div className="flex items-center">
              <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
              <span className="text-gray-700">Save your favorite searches for quick access</span>
            </div>
          </div>
          
          <Button 
            onClick={() => handleNavigate('/search')} 
            className="w-full bg-purple-600 hover:bg-purple-700"
          >
            Try Court Search
          </Button>
        </div>
      </div>
      
      <div className="flex space-x-3">
        <Button variant="outline" onClick={() => setCurrentStep(1)} className="flex-1">
          Back
        </Button>
        <Button onClick={handleNext} className="flex-1">
          Continue
          <ArrowRight className="h-4 w-4 ml-2" />
        </Button>
      </div>
    </div>
  );

  // Render step 3: Booking System
  const renderStep3 = () => (
    <div className="text-center">
      <div className="w-20 h-20 bg-gradient-to-r from-green-600 to-teal-600 rounded-full flex items-center justify-center mx-auto mb-6">
        <Calendar className="h-10 w-10 text-white" />
      </div>
      
      <h2 className="text-2xl font-bold text-gray-900 mb-4">
        Book Courts in Seconds
      </h2>
      
      <p className="text-gray-600 mb-6 max-w-md mx-auto">
        Our smart booking system makes it easy to reserve courts, check real-time availability, and manage your bookings.
      </p>
      
      <div className="bg-white rounded-lg overflow-hidden shadow-sm border border-gray-200 mb-6">
        <OptimizedImage
          src="https://images.pexels.com/photos/209977/pexels-photo-209977.jpeg?auto=compress&cs=tinysrgb&w=800&h=400&dpr=2"
          alt="Court booking"
          width={800}
          height={400}
          className="w-full h-48 object-cover"
        />
        
        <div className="p-6">
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
            <Calendar className="h-5 w-5 text-green-600 mr-2" />
            Smart Booking Features
          </h3>
          
          <div className="space-y-3 mb-4">
            <div className="flex items-center">
              <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
              <span className="text-gray-700">See real-time court availability</span>
            </div>
            
            <div className="flex items-center">
              <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
              <span className="text-gray-700">Book in just 3 simple steps</span>
            </div>
            
            <div className="flex items-center">
              <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
              <span className="text-gray-700">Get smart time suggestions for best prices</span>
            </div>
            
            <div className="flex items-center">
              <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
              <span className="text-gray-700">Receive booking confirmations via email/SMS</span>
            </div>
          </div>
          
          <Button 
            onClick={() => handleNavigate('/booking')} 
            className="w-full bg-green-600 hover:bg-green-700"
          >
            Try Booking System
          </Button>
        </div>
      </div>
      
      <div className="flex space-x-3">
        <Button variant="outline" onClick={() => setCurrentStep(2)} className="flex-1">
          Back
        </Button>
        <Button onClick={handleNext} className="flex-1">
          Continue
          <ArrowRight className="h-4 w-4 ml-2" />
        </Button>
      </div>
    </div>
  );

  // Render step 4: Advanced Features
  const renderStep4 = () => (
    <div className="text-center">
      <div className="w-20 h-20 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-6">
        <Zap className="h-10 w-10 text-white" />
      </div>
      
      <h2 className="text-2xl font-bold text-gray-900 mb-4">
        Discover Advanced Features
      </h2>
      
      <p className="text-gray-600 mb-6 max-w-md mx-auto">
        Fitcha offers powerful features to enhance your sports experience, from AI-powered recommendations to voice commands.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
          <div className="flex items-center mb-3">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
              <MessageCircle className="h-5 w-5 text-blue-600" />
            </div>
            <h3 className="font-semibold text-gray-900">Chat & Messaging</h3>
          </div>
          <p className="text-sm text-gray-600 mb-3">
            Connect with other players, coordinate games, and build your sports community.
          </p>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => handleNavigate('/messages')}
            className="w-full"
          >
            Try Messaging
          </Button>
        </div>
        
        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
          <div className="flex items-center mb-3">
            <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center mr-3">
              <Users className="h-5 w-5 text-purple-600" />
            </div>
            <h3 className="font-semibold text-gray-900">Find Partners</h3>
          </div>
          <p className="text-sm text-gray-600 mb-3">
            Discover players who match your skill level, location, and preferred sports.
          </p>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => handleNavigate('/find-partners')}
            className="w-full"
          >
            Find Partners
          </Button>
        </div>
        
        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
          <div className="flex items-center mb-3">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mr-3">
              <Activity className="h-5 w-5 text-green-600" />
            </div>
            <h3 className="font-semibold text-gray-900">Performance Analytics</h3>
          </div>
          <p className="text-sm text-gray-600 mb-3">
            Track your progress, analyze your performance, and set goals for improvement.
          </p>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => handleNavigate('/analytics')}
            className="w-full"
          >
            View Analytics
          </Button>
        </div>
        
        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
          <div className="flex items-center mb-3">
            <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center mr-3">
              <Zap className="h-5 w-5 text-yellow-600" />
            </div>
            <h3 className="font-semibold text-gray-900">Smart Features</h3>
          </div>
          <p className="text-sm text-gray-600 mb-3">
            Experience AI-powered recommendations, voice commands, and AR court previews.
          </p>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => handleNavigate('/smart-features')}
            className="w-full"
          >
            Explore Smart Features
          </Button>
        </div>
      </div>
      
      <div className="flex space-x-3">
        <Button variant="outline" onClick={() => setCurrentStep(3)} className="flex-1">
          Back
        </Button>
        <Button onClick={onComplete} className="flex-1 bg-blue-600 hover:bg-blue-700">
          Get Started!
        </Button>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="relative p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="bg-gradient-to-r from-blue-600 to-emerald-600 p-2 rounded-md shadow-sm mr-2">
                <Activity className="h-5 w-5 text-white" />
              </div>
              <h3 className="font-bold text-lg bg-gradient-to-r from-blue-600 to-emerald-600 bg-clip-text text-transparent">
                Fitcha
              </h3>
            </div>
            <button 
              onClick={onSkip}
              className="p-1 rounded-full hover:bg-gray-100"
            >
              <X className="h-5 w-5 text-gray-500" />
            </button>
          </div>
          
          {/* Progress Bar */}
          <div className="w-full h-1 bg-gray-200 mt-3">
            <div 
              className="h-full bg-blue-600 transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
        
        {/* Content */}
        <div className="p-6">
          {currentStep === 1 && renderStep1()}
          {currentStep === 2 && renderStep2()}
          {currentStep === 3 && renderStep3()}
          {currentStep === 4 && renderStep4()}
        </div>
      </div>
    </div>
  );
};