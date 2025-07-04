/**
 * Enhanced Create Game Page - Priority #1 Feature
 * 
 * The heart of the Fitcha platform - where users create activities
 * This is the main revenue driver and engagement hub
 * 
 * Features:
 * - 6 Activity Types (Sports, Wellness, Gaming, Outdoor, Social, Fitness)
 * - Smart Dynamic Forms
 * - Location Integration with Maps
 * - Payment System Integration
 * - Invite Friends Feature
 * - Real-time Updates
 * - Social Network Foundation
 * 
 * @author Fitcha Team
 * @version 2.0.0 - Enhanced Revenue-Focused Design
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '../components/layout/Header';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { useAuth } from '../hooks/useAuth';
import { 
  Gamepad2, 
  Users, 
  MapPin, 
  Clock, 
  Calendar, 
  DollarSign, 
  Trophy, 
  Heart,
  Dumbbell,
  Mountain,
  Coffee,
  Send,
  UserPlus,
  Globe,
  Lock,
  CreditCard,
  Gift,
  Camera,
  Save,
  Share2,
  CheckCircle,
  AlertCircle,
  Plus,
  Star
} from 'lucide-react';

// Enhanced Activity Categories with Revenue Focus
const activityCategories = {
  sports: {
    name: 'Sports & Competition',
    icon: Trophy,
    color: 'from-blue-600 to-emerald-600',
    bgColor: 'bg-gradient-to-br from-blue-50 to-emerald-50',
    borderColor: 'border-blue-200',
    revenue: 'high',
    activities: [
      { name: 'Football', price: 20, popular: true },
      { name: 'Basketball', price: 15, popular: true },
      { name: 'Tennis', price: 25, popular: false },
      { name: 'Volleyball', price: 12, popular: true },
      { name: 'Handball', price: 15, popular: false },
      { name: 'Padel', price: 30, popular: true },
      { name: 'Squash', price: 20, popular: false }
    ]
  },
  wellness: {
    name: 'Wellness & Mindfulness',
    icon: Heart,
    color: 'from-emerald-500 to-teal-600',
    bgColor: 'bg-gradient-to-br from-emerald-50 to-teal-50',
    borderColor: 'border-emerald-200',
    revenue: 'medium',
    activities: [
      { name: 'Yoga', price: 18, popular: true },
      { name: 'Meditation', price: 10, popular: true },
      { name: 'Pilates', price: 22, popular: false },
      { name: 'Tai Chi', price: 15, popular: false },
      { name: 'Massage Therapy', price: 50, popular: true },
      { name: 'Spa Day', price: 80, popular: false },
      { name: 'Breathwork', price: 12, popular: false }
    ]
  },
  gaming: {
    name: 'Gaming & Esports',
    icon: Gamepad2,
    color: 'from-purple-600 to-pink-600',
    bgColor: 'bg-gradient-to-br from-purple-50 to-pink-50',
    borderColor: 'border-purple-200',
    revenue: 'high',
    activities: [
      { name: 'FIFA Tournament', price: 25, popular: true },
      { name: 'Chess Match', price: 8, popular: false },
      { name: 'Backgammon', price: 10, popular: true },
      { name: 'Poker Night', price: 30, popular: true },
      { name: 'Board Games', price: 12, popular: false },
      { name: 'Video Games', price: 20, popular: true },
      { name: 'Escape Room', price: 35, popular: false }
    ]
  },
  outdoor: {
    name: 'Outdoor Adventures',
    icon: Mountain,
    color: 'from-orange-500 to-red-600',
    bgColor: 'bg-gradient-to-br from-orange-50 to-red-50',
    borderColor: 'border-orange-200',
    revenue: 'medium',
    activities: [
      { name: 'Cycling Tour', price: 15, popular: true },
      { name: 'Running Group', price: 5, popular: true },
      { name: 'Hiking Trip', price: 25, popular: false },
      { name: 'Rock Climbing', price: 40, popular: false },
      { name: 'Camping Weekend', price: 60, popular: true },
      { name: 'Fishing Trip', price: 30, popular: false },
      { name: 'Beach Volleyball', price: 12, popular: true }
    ]
  },
  social: {
    name: 'Social & Cultural',
    icon: Coffee,
    color: 'from-yellow-500 to-orange-600',
    bgColor: 'bg-gradient-to-br from-yellow-50 to-orange-50',
    borderColor: 'border-yellow-200',
    revenue: 'low',
    activities: [
      { name: 'Coffee Meetup', price: 8, popular: true },
      { name: 'Dinner Party', price: 35, popular: true },
      { name: 'Cinema Night', price: 15, popular: true },
      { name: 'Traditional Cafe', price: 12, popular: false },
      { name: 'Cultural Event', price: 20, popular: false },
      { name: 'Book Club', price: 5, popular: false },
      { name: 'Art Gallery', price: 18, popular: false }
    ]
  },
  fitness: {
    name: 'Fitness & Training',
    icon: Dumbbell,
    color: 'from-red-600 to-pink-600',
    bgColor: 'bg-gradient-to-br from-red-50 to-pink-50',
    borderColor: 'border-red-200',
    revenue: 'high',
    activities: [
      { name: 'Gym Session', price: 20, popular: true },
      { name: 'CrossFit', price: 25, popular: true },
      { name: 'Zumba Class', price: 15, popular: true },
      { name: 'Weight Training', price: 18, popular: false },
      { name: 'HIIT Workout', price: 22, popular: false },
      { name: 'Personal Training', price: 50, popular: true },
      { name: 'Group Fitness', price: 12, popular: false }
    ]
  }
};

// Form Data Interface
interface GameFormData {
  // Basic Info
  category: string;
  activity: string;
  title: string;
  description: string;
  
  // Date & Time
  date: string;
  time: string;
  duration: number;
  
  // Location
  locationName: string;
  address: string;
  coordinates?: { lat: number; lng: number };
  
  // Participants
  maxParticipants: number;
  skillLevel: 'Beginner' | 'Intermediate' | 'Advanced' | 'All Levels';
  ageRange: { min: number; max: number };
  genderPreference: 'Mixed' | 'Men Only' | 'Women Only';
  
  // Payment
  isPaid: boolean;
  pricePerPerson: number;
  paymentMethod: 'cash' | 'card' | 'both';
  
  // Advanced Options
  requirements: string[];
  equipment: string[];
  isPrivate: boolean;
  allowInvites: boolean;
  autoApproval: boolean;
  
  // Invites
  invitedFriends: string[];
}

export const CreateGamePage: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  // Form State
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [formData, setFormData] = useState<GameFormData>({
    category: '',
    activity: '',
    title: '',
    description: '',
    date: '',
    time: '',
    duration: 60,
    locationName: '',
    address: '',
    maxParticipants: 4,
    skillLevel: 'All Levels',
    ageRange: { min: 16, max: 50 },
    genderPreference: 'Mixed',
    isPaid: false,
    pricePerPerson: 0,
    paymentMethod: 'both',
    requirements: [],
    equipment: [],
    isPrivate: false,
    allowInvites: true,
    autoApproval: true,
    invitedFriends: []
  });

  // UI State
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showSuccess, setShowSuccess] = useState(false);

  // Step 1: Category Selection
  const CategorySelection = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-slate-900 mb-2">
          Choose Your Activity Category
        </h2>
        <p className="text-slate-600">
          Select the type of activity you want to create
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Object.entries(activityCategories).map(([key, category]) => {
          const IconComponent = category.icon;
          const isSelected = selectedCategory === key;
          
          return (
            <div
              key={key}
              onClick={() => {
                setSelectedCategory(key);
                setFormData(prev => ({ ...prev, category: key }));
              }}
              className={`
                relative p-6 rounded-xl border-2 cursor-pointer transition-all duration-200
                ${isSelected 
                  ? `bg-gradient-to-br ${category.color} text-white border-transparent shadow-lg scale-105`
                  : `${category.bgColor} ${category.borderColor} hover:border-slate-300 hover:scale-102`
                }
              `}
            >
              {/* Revenue Badge */}
              {category.revenue === 'high' && (
                <div className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                  💰 High Revenue
                </div>
              )}
              
              <div className="flex flex-col items-center text-center space-y-3">
                <div className={`
                  p-3 rounded-full 
                  ${isSelected ? 'bg-white/20' : 'bg-white shadow-sm'}
                `}>
                  <IconComponent className={`
                    h-8 w-8 
                    ${isSelected ? 'text-white' : 'text-slate-600'}
                  `} />
                </div>
                
                <h3 className={`
                  font-semibold text-lg
                  ${isSelected ? 'text-white' : 'text-slate-900'}
                `}>
                  {category.name}
                </h3>
                
                <p className={`
                  text-sm
                  ${isSelected ? 'text-white/80' : 'text-slate-600'}
                `}>
                  {category.activities.length} activities available
                </p>
              </div>
              
              {isSelected && (
                <div className="absolute top-3 right-3">
                  <CheckCircle className="h-6 w-6 text-white" />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {selectedCategory && (
        <div className="mt-8 p-6 bg-white rounded-xl border border-slate-200 shadow-sm">
          <h4 className="font-semibold text-slate-900 mb-4">
            Available {activityCategories[selectedCategory as keyof typeof activityCategories].name} Activities:
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {activityCategories[selectedCategory as keyof typeof activityCategories].activities.map((activity) => (
              <div
                key={activity.name}
                onClick={() => setFormData(prev => ({ ...prev, activity: activity.name }))}
                className={`
                  p-3 rounded-lg border cursor-pointer transition-all
                  ${formData.activity === activity.name
                    ? 'bg-blue-50 border-blue-300 text-blue-900'
                    : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                  }
                \`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium text-sm">{activity.name}</span>
                  {activity.popular && (
                    <Star className="h-4 w-4 text-yellow-500 fill-current" />
                  )}
                </div>
                <div className="text-xs text-slate-600 mt-1">
                  ${activity.price}/person
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  // Handle form submission
  const handleSubmit = async () => {
    setIsLoading(true);
    
    try {
      // Validate form
      const validationErrors: Record<string, string> = {};
      
      if (!formData.category) validationErrors.category = 'Please select a category';
      if (!formData.activity) validationErrors.activity = 'Please select an activity';
      if (!formData.title.trim()) validationErrors.title = 'Please enter a title';
      if (!formData.date) validationErrors.date = 'Please select a date';
      if (!formData.time) validationErrors.time = 'Please select a time';
      if (!formData.locationName.trim()) validationErrors.location = 'Please enter a location';
      
      if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors);
        setIsLoading(false);
        return;
      }

      // TODO: Submit to Firebase/Backend
      console.log('Creating game:', formData);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setShowSuccess(true);
      
      // Redirect after success
      setTimeout(() => {
        navigate('/');
      }, 3000);
      
    } catch (error) {
      console.error('Error creating game:', error);
      setErrors({ general: 'Failed to create game. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  // Success Message
  if (showSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-emerald-50">
        <Header />
        <div className="max-w-2xl mx-auto pt-20 px-4">
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="h-10 w-10 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold text-slate-900 mb-4">
              🎉 Game Created Successfully!
            </h1>
            <p className="text-slate-600 mb-6">
              Your \"{formData.title}\" activity has been created and is now live. 
              Others can join and you'll be notified when someone signs up!
            </p>
            <div className="flex justify-center space-x-4">
              <Button onClick={() => navigate('/')} className="px-8">
                View My Game
              </Button>
              <Button 
                variant="outline" 
                onClick={() => window.location.reload()}
                className="px-8"
              >
                Create Another
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-emerald-50">
      <Header />
      
      {/* Main Content */}
      <div className="max-w-4xl mx-auto pt-20 px-4 pb-12">
        {/* Page Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-gradient-to-r from-blue-600 to-emerald-600 p-3 rounded-xl shadow-lg">
              <Plus className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-emerald-600 bg-clip-text text-transparent mb-2">
            Create New Activity
          </h1>
          <p className="text-xl text-slate-600">
            The heart of Fitcha - Start building your community! 🚀
          </p>
        </div>

        {/* Progress Steps */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center space-x-4">
            {[1, 2, 3, 4].map((step) => (
              <div key={step} className="flex items-center">
                <div className={`
                  w-10 h-10 rounded-full flex items-center justify-center font-semibold
                  ${currentStep >= step 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-slate-200 text-slate-400'
                  }
                \`}>
                  {step}
                </div>
                {step < 4 && (
                  <div className={`
                    w-16 h-1 mx-2
                    ${currentStep > step ? 'bg-blue-600' : 'bg-slate-200'}
                  \`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Form Content */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {currentStep === 1 && <CategorySelection />}
          
          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8 pt-6 border-t border-slate-200">
            <Button
              variant="outline"
              onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
              disabled={currentStep === 1}
            >
              Previous
            </Button>
            
            {currentStep < 4 ? (
              <Button
                onClick={() => setCurrentStep(currentStep + 1)}
                disabled={currentStep === 1 && !selectedCategory}
                className="px-8"
              >
                Next Step
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                disabled={isLoading}
                className="px-8"
              >
                {isLoading ? 'Creating...' : 'Create Activity 🚀'}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
