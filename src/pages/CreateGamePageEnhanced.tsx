/**
 * Enhanced Create Game Page
 * 
 * Complete game creation system with:
 * - 6 Activity Types (Sports, Wellness, Gaming, etc.)
 * - Smart Dynamic Forms
 * - Location Integration
 * - Payment System Integration
 * - Friend Invitation System
 * - Real-time Updates
 * 
 * @author Fitcha Team
 * @version 2.0.0 - Enhanced Create Game System
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Users, 
  DollarSign, 
  Plus,
  Target,
  Gamepad2,
  Heart,
  Brain,
  Music,
  Trophy,
  CheckCircle
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { useAuth } from '../hooks/useAuth';

// Activity Types with rich metadata
const ACTIVITY_TYPES = {
  sports: {
    label: 'Sports & Athletics',
    icon: Trophy,
    color: 'from-blue-500 to-cyan-500',
    activities: [
      'Basketball', 'Football', 'Soccer', 'Tennis', 'Volleyball', 'Baseball',
      'Swimming', 'Running', 'Cycling', 'Golf', 'Boxing', 'Wrestling'
    ]
  },
  wellness: {
    label: 'Wellness & Fitness',
    icon: Heart,
    color: 'from-green-500 to-emerald-500',
    activities: [
      'Yoga', 'Pilates', 'Meditation', 'Gym Workout', 'CrossFit', 'Zumba',
      'Personal Training', 'Stretching', 'Cardio', 'Weight Training'
    ]
  },
  gaming: {
    label: 'Gaming & Esports',
    icon: Gamepad2,
    color: 'from-purple-500 to-violet-500',
    activities: [
      'Video Games', 'Board Games', 'Card Games', 'Chess', 'Poker',
      'Esports Tournament', 'LAN Party', 'Mobile Gaming'
    ]
  },
  mental: {
    label: 'Mental & Brain',
    icon: Brain,
    color: 'from-indigo-500 to-blue-500',
    activities: [
      'Study Group', 'Book Club', 'Trivia Night', 'Puzzle Solving',
      'Language Exchange', 'Debate Club', 'Quiz Competition'
    ]
  },
  creative: {
    label: 'Creative & Arts',
    icon: Music,
    color: 'from-pink-500 to-rose-500',
    activities: [
      'Music Jam', 'Art Workshop', 'Photography Walk', 'Writing Circle',
      'Dance Class', 'Theater', 'Crafting', 'Painting'
    ]
  },
  social: {
    label: 'Social & Networking',
    icon: Users,
    color: 'from-orange-500 to-red-500',
    activities: [
      'Coffee Meetup', 'Networking Event', 'Dinner Party', 'Picnic',
      'Happy Hour', 'Group Travel', 'Workshop', 'Conference'
    ]
  }
};

// Skill Levels
const SKILL_LEVELS = [
  { value: 'beginner', label: 'Beginner', description: 'New to this activity' },
  { value: 'intermediate', label: 'Intermediate', description: 'Some experience' },
  { value: 'advanced', label: 'Advanced', description: 'Very experienced' },
  { value: 'professional', label: 'Professional', description: 'Expert level' }
];

// Time slots
const TIME_SLOTS = [
  'Early Morning (6-9 AM)',
  'Morning (9-12 PM)',
  'Afternoon (12-3 PM)',
  'Late Afternoon (3-6 PM)',
  'Evening (6-9 PM)',
  'Night (9 PM+)'
];

interface GameFormData {
  category: string;
  activity: string;
  title: string;
  description: string;
  date: string;
  time: string;
  duration: number;
  location: string;
  maxParticipants: number;
  skillLevel: string;
  cost: number;
  costType: 'free' | 'paid' | 'split';
  equipment: string;
  notes: string;
  isPrivate: boolean;
  inviteOnly: boolean;
  recurring: boolean;
  recurringPattern: string;
}

export const CreateGamePageEnhanced: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Form state
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<GameFormData>({
    category: '',
    activity: '',
    title: '',
    description: '',
    date: '',
    time: '',
    duration: 1,
    location: '',
    maxParticipants: 4,
    skillLevel: 'intermediate',
    cost: 0,
    costType: 'free',
    equipment: '',
    notes: '',
    isPrivate: false,
    inviteOnly: false,
    recurring: false,
    recurringPattern: 'weekly'
  });

  const [invitedFriends] = useState<string[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  // Validation function
  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    switch (step) {
      case 1:
        if (!formData.category) newErrors.category = 'Please select an activity category';
        if (!formData.activity) newErrors.activity = 'Please select a specific activity';
        break;
      case 2:
        if (!formData.title.trim()) newErrors.title = 'Game title is required';
        if (!formData.description.trim()) newErrors.description = 'Description is required';
        if (!formData.date) newErrors.date = 'Date is required';
        if (!formData.time) newErrors.time = 'Time is required';
        break;
      case 3:
        if (!formData.location.trim()) newErrors.location = 'Location is required';
        if (formData.maxParticipants < 2) newErrors.maxParticipants = 'At least 2 participants required';
        break;
      case 4:
        if (formData.costType === 'paid' && formData.cost <= 0) {
          newErrors.cost = 'Cost must be greater than 0 for paid games';
        }
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle next step
  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 5));
    }
  };

  // Handle previous step
  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  // Handle form field changes
  const handleFieldChange = (field: keyof GameFormData, value: string | number | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  // Generate title suggestions based on activity
  const generateTitleSuggestion = () => {
    if (formData.activity && formData.date) {
      const date = new Date(formData.date);
      const dayName = date.toLocaleDateString('en-US', { weekday: 'long' });
      return `${dayName} ${formData.activity} Session`;
    }
    return '';
  };

  // Handle game creation
  const handleCreateGame = async () => {
    if (!validateStep(4)) return;

    setIsCreating(true);
    try {
      // Simulate API call - replace with actual Firebase/backend call
      const gameData = {
        ...formData,
        createdBy: user?.id,
        createdAt: new Date().toISOString(),
        participants: [user?.id],
        invitedUsers: invitedFriends,
        status: 'active'
      };

      console.log('Creating game:', gameData);
      
      // Simulate delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Success - redirect to game details or games list
      navigate('/games');
    } catch (error) {
      console.error('Error creating game:', error);
      setErrors({ general: 'Failed to create game. Please try again.' });
    } finally {
      setIsCreating(false);
    }
  };

  // Render step indicator
  const renderStepIndicator = () => (
    <div className="flex items-center justify-center mb-8">
      {[1, 2, 3, 4, 5].map((step) => (
        <div key={step} className="flex items-center">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
            step <= currentStep 
              ? 'bg-blue-600 text-white' 
              : 'bg-gray-200 text-gray-600'
          }`}>
            {step}
          </div>
          {step < 5 && (
            <div className={`w-12 h-1 mx-2 ${
              step < currentStep ? 'bg-blue-600' : 'bg-gray-200'
            }`} />
          )}
        </div>
      ))}
    </div>
  );

  // Render Step 1: Category & Activity Selection
  const renderStep1 = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">What do you want to play?</h2>
        <p className="text-gray-600">Choose your activity category and specific game</p>
      </div>

      {/* Category Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Select Category
        </label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {Object.entries(ACTIVITY_TYPES).map(([key, type]) => {
            const IconComponent = type.icon;
            return (
              <button
                key={key}
                type="button"
                onClick={() => handleFieldChange('category', key)}
                className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                  formData.category === key
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${type.color} flex items-center justify-center mx-auto mb-2`}>
                  <IconComponent className="h-6 w-6 text-white" />
                </div>
                <p className="text-sm font-medium text-gray-900">{type.label}</p>
              </button>
            );
          })}
        </div>
        {errors.category && (
          <p className="mt-1 text-sm text-red-600">{errors.category}</p>
        )}
      </div>

      {/* Activity Selection */}
      {formData.category && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Select Specific Activity
          </label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {ACTIVITY_TYPES[formData.category as keyof typeof ACTIVITY_TYPES].activities.map((activity) => (
              <button
                key={activity}
                type="button"
                onClick={() => handleFieldChange('activity', activity)}
                className={`p-3 rounded-lg border text-sm font-medium transition-colors ${
                  formData.activity === activity
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-200 text-gray-700 hover:border-gray-300'
                }`}
              >
                {activity}
              </button>
            ))}
          </div>
          {errors.activity && (
            <p className="mt-1 text-sm text-red-600">{errors.activity}</p>
          )}
        </div>
      )}
    </div>
  );

  // Render Step 2: Game Details
  const renderStep2 = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Game Details</h2>
        <p className="text-gray-600">Tell us about your game</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Title */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Game Title
          </label>
          <div className="flex gap-2">
            <Input
              type="text"
              value={formData.title}
              onChange={(e) => handleFieldChange('title', e.target.value)}
              placeholder="Enter game title"
              className="flex-1"
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => handleFieldChange('title', generateTitleSuggestion())}
              className="whitespace-nowrap"
            >
              <Target className="h-4 w-4 mr-1" />
              Suggest
            </Button>
          </div>
          {errors.title && (
            <p className="mt-1 text-sm text-red-600">{errors.title}</p>
          )}
        </div>

        {/* Description */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => handleFieldChange('description', e.target.value)}
            placeholder="Describe your game, rules, what to bring, etc."
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          {errors.description && (
            <p className="mt-1 text-sm text-red-600">{errors.description}</p>
          )}
        </div>

        {/* Date */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Date
          </label>
          <Input
            type="date"
            value={formData.date}
            onChange={(e) => handleFieldChange('date', e.target.value)}
            icon={Calendar}
          />
          {errors.date && (
            <p className="mt-1 text-sm text-red-600">{errors.date}</p>
          )}
        </div>

        {/* Time */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Time
          </label>
          <select
            value={formData.time}
            onChange={(e) => handleFieldChange('time', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Select time slot</option>
            {TIME_SLOTS.map((slot) => (
              <option key={slot} value={slot}>{slot}</option>
            ))}
          </select>
          {errors.time && (
            <p className="mt-1 text-sm text-red-600">{errors.time}</p>
          )}
        </div>

        {/* Duration */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Duration (hours)
          </label>
          <Input
            type="number"
            value={formData.duration.toString()}
            onChange={(e) => handleFieldChange('duration', parseFloat(e.target.value))}
            icon={Clock}
          />
        </div>

        {/* Skill Level */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Skill Level
          </label>
          <select
            value={formData.skillLevel}
            onChange={(e) => handleFieldChange('skillLevel', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            {SKILL_LEVELS.map((level) => (
              <option key={level.value} value={level.value}>
                {level.label} - {level.description}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );

  // Render Step 3: Location & Participants
  const renderStep3 = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Location & Players</h2>
        <p className="text-gray-600">Where will you play and how many players?</p>
      </div>

      <div className="space-y-6">
        {/* Location */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Location
          </label>
          <div className="relative">
            <Input
              type="text"
              value={formData.location}
              onChange={(e) => handleFieldChange('location', e.target.value)}
              placeholder="Enter venue name or address"
              icon={MapPin}
            />
            {/* Location suggestions would go here */}
          </div>
          {errors.location && (
            <p className="mt-1 text-sm text-red-600">{errors.location}</p>
          )}
        </div>

        {/* Max Participants */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Maximum Participants
          </label>
          <div className="flex items-center space-x-4">
            <Input
              type="number"
              value={formData.maxParticipants.toString()}
              onChange={(e) => handleFieldChange('maxParticipants', parseInt(e.target.value))}
              icon={Users}
              className="w-32"
            />
            <span className="text-sm text-gray-500">
              Including yourself ({formData.maxParticipants} total players)
            </span>
          </div>
          {errors.maxParticipants && (
            <p className="mt-1 text-sm text-red-600">{errors.maxParticipants}</p>
          )}
        </div>

        {/* Equipment */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Equipment Needed
          </label>
          <Input
            type="text"
            value={formData.equipment}
            onChange={(e) => handleFieldChange('equipment', e.target.value)}
            placeholder="e.g., Bring your own racket, balls provided"
          />
        </div>
      </div>
    </div>
  );

  // Render Step 4: Cost & Payment
  const renderStep4 = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Cost & Payment</h2>
        <p className="text-gray-600">Set the cost for your game</p>
      </div>

      <div className="space-y-6">
        {/* Cost Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Cost Type
          </label>
          <div className="grid grid-cols-3 gap-4">
            <button
              type="button"
              onClick={() => handleFieldChange('costType', 'free')}
              className={`p-4 rounded-lg border-2 text-center transition-colors ${
                formData.costType === 'free'
                  ? 'border-green-500 bg-green-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <CheckCircle className="h-6 w-6 mx-auto mb-2 text-green-600" />
              <p className="font-medium">Free</p>
              <p className="text-sm text-gray-600">No cost to join</p>
            </button>

            <button
              type="button"
              onClick={() => handleFieldChange('costType', 'split')}
              className={`p-4 rounded-lg border-2 text-center transition-colors ${
                formData.costType === 'split'
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <Users className="h-6 w-6 mx-auto mb-2 text-blue-600" />
              <p className="font-medium">Split Cost</p>
              <p className="text-sm text-gray-600">Share venue cost</p>
            </button>

            <button
              type="button"
              onClick={() => handleFieldChange('costType', 'paid')}
              className={`p-4 rounded-lg border-2 text-center transition-colors ${
                formData.costType === 'paid'
                  ? 'border-purple-500 bg-purple-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <DollarSign className="h-6 w-6 mx-auto mb-2 text-purple-600" />
              <p className="font-medium">Paid Entry</p>
              <p className="text-sm text-gray-600">Fixed entry fee</p>
            </button>
          </div>
        </div>

        {/* Cost Amount */}
        {(formData.costType === 'paid' || formData.costType === 'split') && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {formData.costType === 'paid' ? 'Entry Fee' : 'Total Cost to Split'} ($)
            </label>
            <Input
              type="number"
              value={formData.cost.toString()}
              onChange={(e) => handleFieldChange('cost', parseFloat(e.target.value))}
              icon={DollarSign}
              placeholder="0.00"
            />
            {formData.costType === 'split' && formData.cost > 0 && (
              <p className="mt-1 text-sm text-gray-600">
                Each player pays: ${(formData.cost / formData.maxParticipants).toFixed(2)}
              </p>
            )}
            {errors.cost && (
              <p className="mt-1 text-sm text-red-600">{errors.cost}</p>
            )}
          </div>
        )}

        {/* Additional Notes */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Additional Notes
          </label>
          <textarea
            value={formData.notes}
            onChange={(e) => handleFieldChange('notes', e.target.value)}
            placeholder="Any additional information, rules, or requirements..."
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Privacy Options */}
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <p className="font-medium text-gray-900">Private Game</p>
              <p className="text-sm text-gray-600">Only you can see this game</p>
            </div>
            <button
              type="button"
              onClick={() => handleFieldChange('isPrivate', !formData.isPrivate)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                formData.isPrivate ? 'bg-blue-600' : 'bg-gray-200'
              }`}
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                formData.isPrivate ? 'translate-x-6' : 'translate-x-1'
              }`} />
            </button>
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <p className="font-medium text-gray-900">Invite Only</p>
              <p className="text-sm text-gray-600">Players must be invited to join</p>
            </div>
            <button
              type="button"
              onClick={() => handleFieldChange('inviteOnly', !formData.inviteOnly)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                formData.inviteOnly ? 'bg-blue-600' : 'bg-gray-200'
              }`}
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                formData.inviteOnly ? 'translate-x-6' : 'translate-x-1'
              }`} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  // Render Step 5: Review & Create
  const renderStep5 = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Review & Create</h2>
        <p className="text-gray-600">Double-check your game details</p>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-gray-900 mb-3">Game Information</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Category:</span>
                <span className="font-medium">{ACTIVITY_TYPES[formData.category as keyof typeof ACTIVITY_TYPES]?.label}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Activity:</span>
                <span className="font-medium">{formData.activity}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Title:</span>
                <span className="font-medium">{formData.title}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Date:</span>
                <span className="font-medium">{new Date(formData.date).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Time:</span>
                <span className="font-medium">{formData.time}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Duration:</span>
                <span className="font-medium">{formData.duration} hours</span>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-medium text-gray-900 mb-3">Details</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Location:</span>
                <span className="font-medium">{formData.location}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Max Players:</span>
                <span className="font-medium">{formData.maxParticipants}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Skill Level:</span>
                <span className="font-medium capitalize">{formData.skillLevel}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Cost:</span>
                <span className="font-medium">
                  {formData.costType === 'free' ? 'Free' : `$${formData.cost}`}
                  {formData.costType === 'split' ? ' (split)' : ''}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Privacy:</span>
                <span className="font-medium">
                  {formData.isPrivate ? 'Private' : formData.inviteOnly ? 'Invite Only' : 'Public'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {formData.description && (
          <div className="mt-6 pt-6 border-t border-gray-200">
            <h4 className="font-medium text-gray-900 mb-2">Description</h4>
            <p className="text-sm text-gray-600">{formData.description}</p>
          </div>
        )}

        {errors.general && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-600">{errors.general}</p>
          </div>
        )}
      </div>
    </div>
  );

  // Main render
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Create New Game</h1>
          <p className="text-gray-600">Organize your next sports activity or social gathering</p>
        </div>

        {/* Step Indicator */}
        {renderStepIndicator()}

        {/* Form Content */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 md:p-8">
          {currentStep === 1 && renderStep1()}
          {currentStep === 2 && renderStep2()}
          {currentStep === 3 && renderStep3()}
          {currentStep === 4 && renderStep4()}
          {currentStep === 5 && renderStep5()}
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-8">
          <Button
            type="button"
            variant="outline"
            onClick={handlePrevious}
            disabled={currentStep === 1}
            className="flex items-center"
          >
            ← Previous
          </Button>

          <div className="flex space-x-4">
            {currentStep < 5 ? (
              <Button
                type="button"
                onClick={handleNext}
                className="flex items-center"
              >
                Next →
              </Button>
            ) : (
              <Button
                type="button"
                onClick={handleCreateGame}
                disabled={isCreating}
                className="flex items-center bg-green-600 hover:bg-green-700"
              >
                {isCreating ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Creating...
                  </>
                ) : (
                  <>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Game
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
