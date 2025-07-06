/**
 * Enhanced Create Game Page - Priority #1 Feature
 * The heart of the Fitcha platform - Main Revenue Driver
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
  Plus,
  CheckCircle,
  Star
} from 'lucide-react';

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
      { name: 'Volleyball', price: 12, popular: true }
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
      { name: 'Pilates', price: 22, popular: false }
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
      { name: 'Poker Night', price: 30, popular: true }
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
      { name: 'Zumba Class', price: 15, popular: true }
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
      { name: 'Hiking Trip', price: 25, popular: false }
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
      { name: 'Cinema Night', price: 15, popular: true }
    ]
  }
};

interface GameFormData {
  category: string;
  activity: string;
  title: string;
  description: string;
  date: string;
  time: string;
  duration: number;
  locationName: string;
  maxParticipants: number;
  skillLevel: string;
  isPaid: boolean;
  pricePerPerson: number;
}

export const CreateGamePageV2: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  const [currentStep, setCurrentStep] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [formData, setFormData] = useState<GameFormData>({
    category: '',
    activity: '',
    title: '',
    description: '',
    date: '',
    time: '',
    duration: 60,
    locationName: '',
    maxParticipants: 4,
    skillLevel: 'All Levels',
    isPaid: false,
    pricePerPerson: 0
  });

  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

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
              className={`relative p-6 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                isSelected 
                  ? 'bg-gradient-to-br from-blue-600 to-emerald-600 text-white border-transparent shadow-lg scale-105'
                  : 'bg-gradient-to-br from-blue-50 to-emerald-50 border-blue-200 hover:border-slate-300 hover:scale-102'
              }`}
            >
              {category.revenue === 'high' && (
                <div className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                  💰 High Revenue
                </div>
              )}
              
              <div className="flex flex-col items-center text-center space-y-3">
                <div className={`p-3 rounded-full ${
                  isSelected ? 'bg-white/20' : 'bg-white shadow-sm'
                }`}>
                  <IconComponent className={`h-8 w-8 ${
                    isSelected ? 'text-white' : 'text-slate-600'
                  }`} />
                </div>
                
                <h3 className={`font-semibold text-lg ${
                  isSelected ? 'text-white' : 'text-slate-900'
                }`}>
                  {category.name}
                </h3>
                
                <p className={`text-sm ${
                  isSelected ? 'text-white/80' : 'text-slate-600'
                }`}>
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
                className={`p-3 rounded-lg border cursor-pointer transition-all ${
                  formData.activity === activity.name
                    ? 'bg-blue-50 border-blue-300 text-blue-900'
                    : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                }`}
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

  const BasicInfoStep = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-slate-900 mb-2">
          Activity Details
        </h2>
        <p className="text-slate-600">
          Tell us more about your {formData.activity} activity
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Activity Title *
          </label>
          <Input
            placeholder="e.g. Evening Basketball Match"
            value={formData.title}
            onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Location *
          </label>
          <Input
            placeholder="e.g. Community Sports Center"
            value={formData.locationName}
            onChange={(e) => setFormData(prev => ({ ...prev, locationName: e.target.value }))}
            icon={MapPin}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Date *
          </label>
          <Input
            type="date"
            value={formData.date}
            onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
            icon={Calendar}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Time *
          </label>
          <Input
            type="time"
            value={formData.time}
            onChange={(e) => setFormData(prev => ({ ...prev, time: e.target.value }))}
            icon={Clock}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Duration (minutes)
          </label>
          <input
            type="number"
            value={formData.duration.toString()}
            onChange={(e) => setFormData(prev => ({ ...prev, duration: parseInt(e.target.value) || 60 }))}
            min="30"
            max="480"
            className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            placeholder="60"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Max Participants
          </label>
          <div className="relative">
            <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5" />
            <input
              type="number"
              value={formData.maxParticipants.toString()}
              onChange={(e) => setFormData(prev => ({ ...prev, maxParticipants: parseInt(e.target.value) || 4 }))}
              min="2"
              max="50"
              className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              placeholder="4"
            />
          </div>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Description
        </label>
        <textarea
          className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          rows={4}
          placeholder="Describe your activity, rules, what to bring, etc..."
          value={formData.description}
          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
        />
      </div>
    </div>
  );

  const PaymentStep = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-slate-900 mb-2">
          Payment & Pricing 💰
        </h2>
        <p className="text-slate-600">
          Set your pricing to start earning from your activity
        </p>
      </div>

      <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-xl border border-green-200">
        <h3 className="font-semibold text-green-900 mb-2">💡 Revenue Opportunity</h3>
        <p className="text-green-700 text-sm">
          Paid activities get 5x more engagement and help you build a sustainable community!
        </p>
      </div>

      <div className="flex items-center space-x-4">
        <label className="flex items-center">
          <input
            type="radio"
            name="paymentType"
            checked={!formData.isPaid}
            onChange={() => setFormData(prev => ({ ...prev, isPaid: false, pricePerPerson: 0 }))}
            className="w-4 h-4 text-blue-600 focus:ring-blue-500"
          />
          <span className="ml-2 text-slate-700">Free Activity</span>
        </label>
        <label className="flex items-center">
          <input
            type="radio"
            name="paymentType"
            checked={formData.isPaid}
            onChange={() => setFormData(prev => ({ ...prev, isPaid: true }))}
            className="w-4 h-4 text-blue-600 focus:ring-blue-500"
          />
          <span className="ml-2 text-slate-700">Paid Activity 💰</span>
        </label>
      </div>

      {formData.isPaid && (
        <div className="bg-white p-6 rounded-xl border border-slate-200">
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Price per Person ($)
          </label>
          <div className="relative">
            <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5" />
            <input
              type="number"
              value={formData.pricePerPerson.toString()}
              onChange={(e) => setFormData(prev => ({ ...prev, pricePerPerson: parseFloat(e.target.value) || 0 }))}
              min="1"
              max="500"
              step="0.5"
              className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              placeholder="e.g. 15"
            />
          </div>
          <div className="mt-3 p-3 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-700">
              <strong>Estimated Earnings:</strong> ${(formData.pricePerPerson * formData.maxParticipants).toFixed(2)}
              {formData.maxParticipants > 0 && (
                <span className="text-blue-600"> (${formData.pricePerPerson} × {formData.maxParticipants} participants)</span>
              )}
            </p>
          </div>
        </div>
      )}
    </div>
  );

  const ReviewStep = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-slate-900 mb-2">
          Review & Create 🚀
        </h2>
        <p className="text-slate-600">
          Review your activity details before publishing
        </p>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold text-slate-900 mb-3">Activity Info</h4>
            <div className="space-y-2 text-sm">
              <p><span className="text-slate-600">Category:</span> {formData.category}</p>
              <p><span className="text-slate-600">Activity:</span> {formData.activity}</p>
              <p><span className="text-slate-600">Title:</span> {formData.title}</p>
              <p><span className="text-slate-600">Location:</span> {formData.locationName}</p>
            </div>
          </div>
          
          <div>
            <h4 className="font-semibold text-slate-900 mb-3">Schedule & Pricing</h4>
            <div className="space-y-2 text-sm">
              <p><span className="text-slate-600">Date:</span> {formData.date}</p>
              <p><span className="text-slate-600">Time:</span> {formData.time}</p>
              <p><span className="text-slate-600">Duration:</span> {formData.duration} minutes</p>
              <p><span className="text-slate-600">Max Participants:</span> {formData.maxParticipants}</p>
              <p><span className="text-slate-600">Price:</span> {formData.isPaid ? `$${formData.pricePerPerson}/person` : 'Free'}</p>
            </div>
          </div>
        </div>

        {formData.description && (
          <div className="mt-4 pt-4 border-t border-slate-200">
            <h4 className="font-semibold text-slate-900 mb-2">Description</h4>
            <p className="text-sm text-slate-600">{formData.description}</p>
          </div>
        )}
      </div>

      {formData.isPaid && (
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-xl border border-green-200">
          <h4 className="font-semibold text-green-900 mb-2">💰 Revenue Summary</h4>
          <div className="text-green-700">
            <p>Potential Earnings: <strong>${(formData.pricePerPerson * formData.maxParticipants).toFixed(2)}</strong></p>
            <p className="text-sm">Fitcha Fee (5%): ${((formData.pricePerPerson * formData.maxParticipants) * 0.05).toFixed(2)}</p>
            <p className="text-sm">Your Earnings: <strong>${((formData.pricePerPerson * formData.maxParticipants) * 0.95).toFixed(2)}</strong></p>
          </div>
        </div>
      )}
    </div>
  );

  const handleSubmit = async () => {
    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      console.log('Creating game:', formData);
      setShowSuccess(true);
      
      setTimeout(() => {
        navigate('/');
      }, 3000);
      
    } catch (error) {
      console.error('Error creating game:', error);
    } finally {
      setIsLoading(false);
    }
  };

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
              🎉 Activity Created Successfully!
            </h1>
            <p className="text-slate-600 mb-6">
              Your "{formData.title}" activity is now live and ready for participants!
            </p>
            <div className="flex justify-center space-x-4">
              <Button onClick={() => navigate('/')} className="px-8">
                View My Activity
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

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1: return <CategorySelection />;
      case 2: return <BasicInfoStep />;
      case 3: return <PaymentStep />;
      case 4: return <ReviewStep />;
      default: return <CategorySelection />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-emerald-50">
      <Header />
      
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
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                  currentStep >= step 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-slate-200 text-slate-400'
                }`}>
                  {step}
                </div>
                {step < 4 && (
                  <div className={`w-16 h-1 mx-2 ${
                    currentStep > step ? 'bg-blue-600' : 'bg-slate-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Form Content */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {renderCurrentStep()}
          
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
