import React, { useState, useEffect } from 'react';
import { 
  ChevronRight, 
  ChevronLeft, 
  X, 
  Search, 
  Calendar, 
  Users, 
  MessageCircle, 
  Zap,
  MapPin,
  Star,
  Activity
} from 'lucide-react';
import { Button } from '../ui/Button';
import { OptimizedImage } from '../ui/Image';

interface WelcomeTutorialProps {
  onComplete: () => void;
  onSkip: () => void;
}

export const WelcomeTutorial: React.FC<WelcomeTutorialProps> = ({
  onComplete,
  onSkip,
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 4;

  // Tutorial steps data
  const tutorialSteps = [
    {
      title: "Welcome to Fitcha!",
      description: "Connect with athletes, find courts, and organize games all in one place.",
      image: "https://images.pexels.com/photos/1752757/pexels-photo-1752757.jpeg?auto=compress&cs=tinysrgb&w=800&h=400&dpr=2",
      icon: Activity,
      color: "from-blue-600 to-emerald-600",
    },
    {
      title: "Find Perfect Courts",
      description: "Search for courts by sport, location, amenities, and more. View real-time availability and book instantly.",
      image: "https://images.pexels.com/photos/209977/pexels-photo-209977.jpeg?auto=compress&cs=tinysrgb&w=800&h=400&dpr=2",
      icon: Search,
      color: "from-purple-600 to-indigo-600",
    },
    {
      title: "Connect with Players",
      description: "Find partners who match your skill level and interests. Build your sports network and join games.",
      image: "https://images.pexels.com/photos/3621104/pexels-photo-3621104.jpeg?auto=compress&cs=tinysrgb&w=800&h=400&dpr=2",
      icon: Users,
      color: "from-green-600 to-teal-600",
    },
    {
      title: "Smart Features",
      description: "Experience AI-powered recommendations, voice search, and real-time updates for the ultimate sports experience.",
      image: "https://images.pexels.com/photos/1884574/pexels-photo-1884574.jpeg?auto=compress&cs=tinysrgb&w=800&h=400&dpr=2",
      icon: Zap,
      color: "from-yellow-500 to-orange-500",
    },
  ];

  // Handle next step
  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };

  // Handle previous step
  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Current step data
  const currentStepData = tutorialSteps[currentStep - 1];
  const IconComponent = currentStepData.icon;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full overflow-hidden">
        {/* Close button */}
        <button 
          onClick={onSkip}
          className="absolute top-4 right-4 p-1 rounded-full bg-white/80 backdrop-blur-sm z-10"
        >
          <X className="h-5 w-5 text-gray-700" />
        </button>
        
        {/* Image */}
        <div className="relative h-48">
          <OptimizedImage
            src={currentStepData.image}
            alt={currentStepData.title}
            className="w-full h-full"
            objectFit="cover"
            width={800}
            height={400}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
          
          {/* Step indicator */}
          <div className="absolute bottom-4 left-0 right-0 flex justify-center">
            <div className="flex space-x-2">
              {Array.from({ length: totalSteps }).map((_, index) => (
                <div 
                  key={index}
                  className={`w-2 h-2 rounded-full ${
                    index + 1 === currentStep ? 'bg-white' : 'bg-white/50'
                  }`}
                ></div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Content */}
        <div className="p-6">
          <div className="flex items-center mb-4">
            <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${currentStepData.color} flex items-center justify-center mr-3`}>
              <IconComponent className="h-6 w-6 text-white" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">{currentStepData.title}</h2>
          </div>
          
          <p className="text-gray-600 mb-6">
            {currentStepData.description}
          </p>
          
          {/* Key features for each step */}
          <div className="mb-6">
            {currentStep === 1 && (
              <div className="space-y-2">
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                  <span className="text-gray-700">Find and book courts in seconds</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                  <span className="text-gray-700">Connect with players who match your skill level</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                  <span className="text-gray-700">Organize games and invite friends</span>
                </div>
              </div>
            )}
            
            {currentStep === 2 && (
              <div className="space-y-2">
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                  <span className="text-gray-700">Advanced search with filters</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                  <span className="text-gray-700">Interactive map view</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                  <span className="text-gray-700">Voice search for hands-free experience</span>
                </div>
              </div>
            )}
            
            {currentStep === 3 && (
              <div className="space-y-2">
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                  <span className="text-gray-700">Find players based on skill level</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                  <span className="text-gray-700">Join games or create your own</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                  <span className="text-gray-700">Real-time messaging with players</span>
                </div>
              </div>
            )}
            
            {currentStep === 4 && (
              <div className="space-y-2">
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                  <span className="text-gray-700">AI-powered court recommendations</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                  <span className="text-gray-700">Voice commands for hands-free control</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                  <span className="text-gray-700">Real-time court availability updates</span>
                </div>
              </div>
            )}
          </div>
          
          {/* Navigation */}
          <div className="flex justify-between">
            {currentStep > 1 ? (
              <Button 
                variant="outline" 
                onClick={handlePrevious}
                className="flex items-center"
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Back
              </Button>
            ) : (
              <Button 
                variant="outline" 
                onClick={onSkip}
              >
                Skip Tour
              </Button>
            )}
            
            <Button 
              onClick={handleNext}
              className="flex items-center"
            >
              {currentStep === totalSteps ? 'Get Started' : 'Next'}
              {currentStep !== totalSteps && <ChevronRight className="h-4 w-4 ml-1" />}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

// CheckCircle component
function CheckCircle(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  );
}