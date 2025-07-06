/**
 * Working Create Game Page - Enhanced Version
 */
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Trophy, Heart, Gamepad2, Brain, Music, Users, 
  ChevronRight, CheckCircle, ArrowLeft,
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { MobileContainer } from '../components/ui/MobileContainer';
import { useDeviceDetection } from '../components/ui/MobileDetection';

// Activity Categories
const CATEGORIES = {
  sports: {
    label: 'Sports & Athletics',
    icon: Trophy,
    color: 'from-blue-500 to-cyan-500',
    activities: ['Basketball', 'Football', 'Tennis', 'Swimming', 'Volleyball', 'Golf'],
  },
  wellness: {
    label: 'Wellness & Fitness',
    icon: Heart,
    color: 'from-green-500 to-emerald-500',
    activities: ['Yoga', 'Pilates', 'Gym Workout', 'CrossFit', 'Meditation', 'Running'],
  },
  gaming: {
    label: 'Gaming & Esports',
    icon: Gamepad2,
    color: 'from-purple-500 to-violet-500',
    activities: ['Video Games', 'Board Games', 'Chess', 'Poker', 'Esports', 'LAN Party'],
  },
  mental: {
    label: 'Mental & Brain',
    icon: Brain,
    color: 'from-indigo-500 to-blue-500',
    activities: ['Study Group', 'Book Club', 'Trivia Night', 'Debate Club', 'Language Exchange'],
  },
  creative: {
    label: 'Creative & Arts',
    icon: Music,
    color: 'from-pink-500 to-rose-500',
    activities: ['Music Jam', 'Art Workshop', 'Photography', 'Writing Circle', 'Dance Class'],
  },
  social: {
    label: 'Social & Networking',
    icon: Users,
    color: 'from-orange-500 to-red-500',
    activities: ['Coffee Meetup', 'Networking Event', 'Dinner Party', 'Workshop', 'Happy Hour'],
  },
};

const CreateGameWorking: React.FC = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const { isMobile } = useDeviceDetection();
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedActivity, setSelectedActivity] = useState('');
  const [gameData, setGameData] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    location: '',
    maxParticipants: 4,
    costType: 'free' as 'free' | 'paid' | 'split',
    cost: 0,
    privacy: 'public' as 'public' | 'private' | 'invite-only',
  });

  const totalSteps = 4;

  const handleCategorySelect = (categoryKey: string) => {
    setSelectedCategory(categoryKey);
    setSelectedActivity('');
    if (currentStep === 1) {
      setCurrentStep(2);
    }
  };

  const handleActivitySelect = (activity: string) => {
    setSelectedActivity(activity);
    if (currentStep === 2) {
      // Auto-generate title suggestion
      setGameData(prev => ({
        ...prev,
        title: prev.title || `${activity} Session`,
      }));
      setCurrentStep(3);
    }
  };

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = () => {
    // Here you would normally save to Firebase
    console.log('Creating game:', {
      category: selectedCategory,
      activity: selectedActivity,
      ...gameData,
    });
    
    // Show success message and redirect
    alert('Game created successfully! 🎉');
    navigate('/');
  };

  // Mobile version of the create game page
  if (isMobile) {
    return (
      <MobileContainer 
        title={`Create Game (${currentStep}/${totalSteps})`} 
        showBack 
        onBack={handleBack}
        showSearch={false}
      >
        <div className="p-4">
          {/* Step Indicator */}
          <div className="flex items-center justify-between mb-6 px-2">
            {Array.from({ length: totalSteps }, (_, i) => (
              <div key={i} className="flex items-center flex-1">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                  i + 1 <= currentStep 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-200 text-gray-600'
                }`}>
                  {i + 1}
                </div>
                {i < totalSteps - 1 && (
                  <div className={`h-1 flex-1 mx-1 ${
                    i + 1 < currentStep ? 'bg-blue-600' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
          
          {/* Content */}
          <div className="bg-white rounded-xl shadow-md p-4">
            {currentStep === 1 && renderStep1()}
            {currentStep === 2 && renderStep2()}
            {currentStep === 3 && renderStep3()}
            {currentStep === 4 && renderStep4()}
          </div>
          
          {/* Navigation Buttons */}
          <div className="flex justify-between mt-6">
            {currentStep > 1 && (
              <Button
                variant="outline"
                onClick={handleBack}
                className="flex items-center"
              >
                <ArrowLeft className="h-4 w-4 mr-1" />
                Back
              </Button>
            )}
            
            {currentStep < totalSteps ? (
              <Button
                onClick={handleNext}
                disabled={
                  (currentStep === 1 && !selectedCategory) ||
                  (currentStep === 2 && !selectedActivity) ||
                  (currentStep === 3 && (!gameData.title || !gameData.date || !gameData.time || !gameData.location))
                }
                className={`flex items-center ${currentStep === 1 && !selectedCategory ? 'ml-auto' : ''}`}
              >
                Continue
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                className="flex items-center bg-green-600 hover:bg-green-700"
              >
                Create Game
                <CheckCircle className="h-4 w-4 ml-1" />
              </Button>
            )}
          </div>
        </div>
      </MobileContainer>
    );
  }

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center mb-8">
      {Array.from({ length: totalSteps }, (_, i) => (
        <React.Fragment key={i}>
          <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${
            i + 1 <= currentStep 
              ? 'bg-blue-600 border-blue-600 text-white' 
              : 'border-slate-300 text-slate-300'
          }`}>
            {i + 1 <= currentStep ? <CheckCircle className="h-5 w-5" /> : i + 1}
          </div>
          {i < totalSteps - 1 && (
            <div className={`w-12 h-0.5 ${
              i + 1 < currentStep ? 'bg-blue-600' : 'bg-slate-300'
            }`} />
          )}
        </React.Fragment>
      ))}
    </div>
  );

  const renderStep1 = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Choose Activity Category</h2>
        <p className="text-slate-600">What kind of activity do you want to organize?</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Object.entries(CATEGORIES).map(([key, category]) => {
          const Icon = category.icon;
          return (
            <div
              key={key}
              onClick={() => handleCategorySelect(key)}
              className={`p-6 rounded-xl border-2 cursor-pointer transition-all duration-300 hover:shadow-lg ${
                selectedCategory === key 
                  ? 'border-blue-500 bg-blue-50' 
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center space-x-3 mb-3">
                <div className={`p-2 rounded-lg bg-gradient-to-r ${category.color} text-white`}>
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="font-semibold text-slate-800">{category.label}</h3>
              </div>
              <div className="flex flex-wrap gap-1">
                {category.activities.slice(0, 3).map((activity) => (
                  <span key={activity} className="px-2 py-1 bg-slate-100 text-slate-600 rounded text-xs">
                    {activity}
                  </span>
                ))}
                {category.activities.length > 3 && (
                  <span className="px-2 py-1 bg-slate-100 text-slate-600 rounded text-xs">
                    +{category.activities.length - 3} more
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  const renderStep2 = () => {
    const category = CATEGORIES[selectedCategory as keyof typeof CATEGORIES];
    if (!category) {
return null;
}

    return (
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Select Specific Activity</h2>
          <p className="text-slate-600">Choose from {category.label} activities</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {category.activities.map((activity) => (
            <div
              key={activity}
              onClick={() => handleActivitySelect(activity)}
              className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-300 hover:shadow-md ${
                selectedActivity === activity 
                  ? 'border-blue-500 bg-blue-50' 
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <span className="font-medium text-slate-800">{activity}</span>
              <ChevronRight className="h-4 w-4 float-right text-slate-400" />
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderStep3 = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Game Details</h2>
        <p className="text-slate-600">Add the details for your {selectedActivity} session</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Game Title</label>
            <input
              type="text"
              value={gameData.title}
              onChange={(e) => setGameData(prev => ({ ...prev, title: e.target.value }))}
              placeholder={`${selectedActivity} Session`}
              className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Description</label>
            <textarea
              value={gameData.description}
              onChange={(e) => setGameData(prev => ({ ...prev, description: e.target.value }))}
              placeholder={`Come join us for an exciting ${selectedActivity} session!`}
              className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              rows={4}
            />
          </div>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Date</label>
            <input
              type="date"
              value={gameData.date}
              onChange={(e) => setGameData(prev => ({ ...prev, date: e.target.value }))}
              className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Time</label>
            <input
              type="time"
              value={gameData.time}
              onChange={(e) => setGameData(prev => ({ ...prev, time: e.target.value }))}
              className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Location</label>
            <input
              type="text"
              value={gameData.location}
              onChange={(e) => setGameData(prev => ({ ...prev, location: e.target.value }))}
              placeholder="Enter venue or address"
              className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderStep4 = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Final Settings</h2>
        <p className="text-slate-600">Set participants limit, cost, and privacy</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Max Participants</label>
            <input
              type="number"
              value={gameData.maxParticipants.toString()}
              onChange={(e) => setGameData(prev => ({ ...prev, maxParticipants: parseInt(e.target.value) || 4 }))}
              min="2"
              max="50"
              className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Cost Type</label>
            <div className="space-y-2">
              {[
                { value: 'free', label: 'Free', desc: 'No cost to join' },
                { value: 'paid', label: 'Paid Entry', desc: 'Fixed cost per person' },
                { value: 'split', label: 'Split Cost', desc: 'Divide total cost among participants' },
              ].map((option) => (
                <label key={option.value} className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="radio"
                    value={option.value}
                    checked={gameData.costType === option.value}
                    onChange={(e) => setGameData(prev => ({ ...prev, costType: e.target.value as 'free' | 'paid' | 'split' }))}
                    className="w-4 h-4 text-blue-600"
                  />
                  <div>
                    <span className="font-medium text-slate-800">{option.label}</span>
                    <p className="text-sm text-slate-600">{option.desc}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>
        </div>
        
        <div className="space-y-4">
          {gameData.costType !== 'free' && (
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                {gameData.costType === 'paid' ? 'Cost Per Person ($)' : 'Total Cost to Split ($)'}
              </label>
              <input
                type="number"
                value={gameData.cost.toString()}
                onChange={(e) => setGameData(prev => ({ ...prev, cost: parseFloat(e.target.value) || 0 }))}
                min="0"
                step="0.01"
                className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          )}
          
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Privacy</label>
            <select
              value={gameData.privacy}
              onChange={(e) => setGameData(prev => ({ ...prev, privacy: e.target.value as 'public' | 'private' | 'invite-only' }))}
              className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="public">Public - Anyone can join</option>
              <option value="private">Private - Friends only</option>
              <option value="invite-only">Invite Only - By invitation</option>
            </select>
          </div>
        </div>
      </div>
      
      {/* Game Summary */}
      <div className="bg-slate-50 p-6 rounded-lg">
        <h3 className="font-semibold text-slate-800 mb-3">Game Summary</h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div><span className="text-slate-600">Activity:</span> <span className="font-medium">{selectedActivity}</span></div>
          <div><span className="text-slate-600">Date:</span> <span className="font-medium">{gameData.date || 'Not set'}</span></div>
          <div><span className="text-slate-600">Time:</span> <span className="font-medium">{gameData.time || 'Not set'}</span></div>
          <div><span className="text-slate-600">Location:</span> <span className="font-medium">{gameData.location || 'Not set'}</span></div>
          <div><span className="text-slate-600">Max Players:</span> <span className="font-medium">{gameData.maxParticipants}</span></div>
          <div>
            <span className="text-slate-600">Cost:</span> 
            <span className="font-medium">
              {gameData.costType === 'free' ? 'Free' : `$${gameData.cost}`}
            </span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-emerald-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-emerald-600 bg-clip-text text-transparent mb-4">
            Create Your Game
          </h1>
          <p className="text-slate-600 text-lg">
            Step {currentStep} of {totalSteps}
          </p>
        </div>

        {renderStepIndicator()}

        <div className="bg-white p-8 rounded-2xl shadow-xl border border-slate-200 min-h-[500px]">
          {currentStep === 1 && renderStep1()}
          {currentStep === 2 && renderStep2()}
          {currentStep === 3 && renderStep3()}
          {currentStep === 4 && renderStep4()}

          {/* Navigation Buttons */}
          <div className="flex justify-between items-center mt-8 pt-6 border-t border-slate-200">
            <Button
              variant="outline"
              onClick={handleBack}
              disabled={currentStep === 1}
              className="flex items-center space-x-2"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back</span>
            </Button>

            {currentStep < totalSteps ? (
              <Button
                onClick={handleNext}
                disabled={
                  (currentStep === 1 && !selectedCategory) ||
                  (currentStep === 2 && !selectedActivity) ||
                  (currentStep === 3 && (!gameData.title || !gameData.date || !gameData.time || !gameData.location))
                }
                className="flex items-center space-x-2"
              >
                <span>Continue</span>
                <ChevronRight className="h-4 w-4" />
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                className="flex items-center space-x-2 bg-green-600 hover:bg-green-700"
              >
                <span>Create Game</span>
                <CheckCircle className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateGameWorking;
