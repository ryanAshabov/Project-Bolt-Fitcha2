import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  User, 
  MapPin, 
  Star, 
  Trophy, 
  Calendar, 
  CheckCircle, 
  X, 
  ArrowRight,
  Camera,
  Activity
} from 'lucide-react';
import { Button } from '../ui/Button';
import { OptimizedImage } from '../ui/Image';
import { useAuth } from '../../hooks/useAuth';

interface ProfileSetupGuideProps {
  onComplete: () => void;
  onSkip: () => void;
}

export const ProfileSetupGuide: React.FC<ProfileSetupGuideProps> = ({
  onComplete,
  onSkip,
}) => {
  const { user, updateUserProfile } = useAuth();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    sports: user?.sports || [],
    skillLevel: user?.skillLevel || 'Beginner',
    availability: user?.availability || [],
    bio: user?.headline || '',
  });
  
  // Available sports
  const availableSports = [
    'Basketball', 'Tennis', 'Football', 'Soccer', 'Volleyball', 
    'Swimming', 'Running', 'Cycling', 'Golf', 'Badminton'
  ];
  
  // Skill levels
  const skillLevels = [
    { value: 'Beginner', label: 'Beginner', description: 'New to this sport' },
    { value: 'Intermediate', label: 'Intermediate', description: 'Some experience' },
    { value: 'Advanced', label: 'Advanced', description: 'Experienced player' },
    { value: 'Professional', label: 'Professional', description: 'Expert level' },
  ];
  
  // Availability options
  const availabilityOptions = [
    'Weekday Mornings', 'Weekday Afternoons', 'Weekday Evenings',
    'Weekend Mornings', 'Weekend Afternoons', 'Weekend Evenings'
  ];
  
  // Toggle sport selection
  const toggleSport = (sport: string) => {
    setFormData(prev => {
      const sports = prev.sports.includes(sport)
        ? prev.sports.filter(s => s !== sport)
        : [...prev.sports, sport];
      
      return { ...prev, sports };
    });
  };
  
  // Toggle availability
  const toggleAvailability = (time: string) => {
    setFormData(prev => {
      const availability = prev.availability.includes(time)
        ? prev.availability.filter(a => a !== time)
        : [...prev.availability, time];
      
      return { ...prev, availability };
    });
  };
  
  // Handle next step
  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };
  
  // Handle previous step
  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };
  
  // Handle completion
  const handleComplete = async () => {
    setIsLoading(true);
    
    try {
      // Update user profile
      if (updateUserProfile) {
        await updateUserProfile({
          sports: formData.sports,
          skillLevel: formData.skillLevel,
          availability: formData.availability,
          headline: formData.bio,
        });
      }
      
      onComplete();
    } catch (error) {
      console.error('Error updating profile:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Render step 1: Sports selection
  const renderStep1 = () => (
    <div>
      <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
        <Trophy className="h-5 w-5 text-blue-600 mr-2" />
        Select Your Sports
      </h3>
      
      <p className="text-gray-600 mb-4">
        Choose the sports you play or are interested in. This helps us connect you with the right players and courts.
      </p>
      
      <div className="grid grid-cols-2 gap-2 mb-6">
        {availableSports.map(sport => (
          <button
            key={sport}
            onClick={() => toggleSport(sport)}
            className={`p-3 rounded-lg border text-left transition-colors ${
              formData.sports.includes(sport)
                ? 'border-blue-500 bg-blue-50 text-blue-700'
                : 'border-gray-200 hover:border-gray-300 text-gray-700'
            }`}
          >
            <div className="flex items-center">
              {formData.sports.includes(sport) && (
                <CheckCircle className="h-4 w-4 text-blue-600 mr-2" />
              )}
              <span>{sport}</span>
            </div>
          </button>
        ))}
      </div>
      
      <div className="text-right">
        <Button 
          onClick={handleNext}
          disabled={formData.sports.length === 0}
          className="flex items-center"
        >
          Continue
          <ArrowRight className="h-4 w-4 ml-2" />
        </Button>
      </div>
    </div>
  );
  
  // Render step 2: Skill level and availability
  const renderStep2 = () => (
    <div>
      <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
        <Star className="h-5 w-5 text-blue-600 mr-2" />
        Your Skill Level & Availability
      </h3>
      
      <p className="text-gray-600 mb-4">
        Let us know your skill level and when you're usually available to play. This helps match you with compatible players.
      </p>
      
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Skill Level
        </label>
        <div className="space-y-2">
          {skillLevels.map(level => (
            <button
              key={level.value}
              onClick={() => setFormData(prev => ({ ...prev, skillLevel: level.value }))}
              className={`w-full p-3 rounded-lg border text-left transition-colors ${
                formData.skillLevel === level.value
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-medium text-gray-900">{level.label}</span>
                  <p className="text-sm text-gray-500">{level.description}</p>
                </div>
                {formData.skillLevel === level.value && (
                  <CheckCircle className="h-5 w-5 text-blue-600" />
                )}
              </div>
            </button>
          ))}
        </div>
      </div>
      
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Availability
        </label>
        <div className="grid grid-cols-2 gap-2">
          {availabilityOptions.map(time => (
            <button
              key={time}
              onClick={() => toggleAvailability(time)}
              className={`p-3 rounded-lg border text-left transition-colors ${
                formData.availability.includes(time)
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-200 hover:border-gray-300 text-gray-700'
              }`}
            >
              <div className="flex items-center">
                {formData.availability.includes(time) && (
                  <CheckCircle className="h-4 w-4 text-blue-600 mr-2" />
                )}
                <span>{time}</span>
              </div>
            </button>
          ))}
        </div>
      </div>
      
      <div className="flex justify-between">
        <Button 
          variant="outline" 
          onClick={handlePrevious}
        >
          Back
        </Button>
        <Button 
          onClick={handleNext}
          disabled={!formData.skillLevel || formData.availability.length === 0}
          className="flex items-center"
        >
          Continue
          <ArrowRight className="h-4 w-4 ml-2" />
        </Button>
      </div>
    </div>
  );
  
  // Render step 3: Bio and profile picture
  const renderStep3 = () => (
    <div>
      <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
        <User className="h-5 w-5 text-blue-600 mr-2" />
        Complete Your Profile
      </h3>
      
      <p className="text-gray-600 mb-4">
        Add a short bio and profile picture to help others get to know you better.
      </p>
      
      <div className="mb-6">
        <div className="flex justify-center mb-4">
          <div className="relative">
            <OptimizedImage
              src={user?.avatar || 'https://via.placeholder.com/150'}
              alt="Profile"
              width={100}
              height={100}
              className="w-24 h-24 rounded-full object-cover"
            />
            <button className="absolute bottom-0 right-0 bg-blue-600 text-white p-1.5 rounded-full">
              <Camera className="h-4 w-4" />
            </button>
          </div>
        </div>
        
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Bio
        </label>
        <textarea
          value={formData.bio}
          onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
          placeholder="Tell others about yourself, your sports experience, and what you're looking for..."
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
          rows={4}
        />
      </div>
      
      <div className="flex justify-between">
        <Button 
          variant="outline" 
          onClick={handlePrevious}
        >
          Back
        </Button>
        <Button 
          onClick={handleComplete}
          disabled={isLoading}
          className="flex items-center"
        >
          {isLoading ? 'Saving...' : 'Complete Setup'}
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
                Complete Your Profile
              </h3>
            </div>
            <button 
              onClick={onSkip}
              className="p-1 rounded-full hover:bg-gray-100"
            >
              <X className="h-5 w-5 text-gray-500" />
            </button>
          </div>
          
          {/* Progress Steps */}
          <div className="flex items-center justify-center mt-4">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  step <= currentStep 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-200 text-gray-600'
                }`}>
                  {step}
                </div>
                {step < 3 && (
                  <div className={`w-12 h-1 mx-2 ${
                    step < currentStep ? 'bg-blue-600' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>
        
        {/* Content */}
        <div className="p-6">
          {currentStep === 1 && renderStep1()}
          {currentStep === 2 && renderStep2()}
          {currentStep === 3 && renderStep3()}
        </div>
      </div>
    </div>
  );
};