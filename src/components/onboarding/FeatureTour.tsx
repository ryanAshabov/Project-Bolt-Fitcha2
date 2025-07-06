import React, { useState, useEffect } from 'react';
import { X, ArrowRight, ArrowLeft } from 'lucide-react';
import { Button } from '../ui/Button';

interface TourStep {
  targetSelector: string;
  title: string;
  description: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
}

interface FeatureTourProps {
  steps: TourStep[];
  onComplete: () => void;
  onSkip: () => void;
}

export const FeatureTour: React.FC<FeatureTourProps> = ({
  steps,
  onComplete,
  onSkip,
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 });
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (currentStep >= steps.length) {
      onComplete();
      return;
    }

    const step = steps[currentStep];
    const targetElement = document.querySelector(step.targetSelector);
    
    if (!targetElement) {
      console.error(`Target element not found: ${step.targetSelector}`);
      handleNext();
      return;
    }
    
    // Remove highlight from all elements
    document.querySelectorAll('.feature-highlight').forEach(el => {
      el.classList.remove('feature-highlight');
    });
    
    // Add highlight to current target
    targetElement.classList.add('feature-highlight');
    
    // Add CSS for highlight if not already added
    if (!document.getElementById('feature-highlight-style')) {
      const style = document.createElement('style');
      style.id = 'feature-highlight-style';
      style.innerHTML = `
        .feature-highlight {
          position: relative;
          z-index: 60;
          box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.5);
          border-radius: 4px;
        }
      `;
      document.head.appendChild(style);
    }
    
    // Update tooltip position
    updateTooltipPosition(targetElement, step.position || 'bottom');
    
    // Show tooltip
    setVisible(true);
    
    // Update position on resize
    window.addEventListener('resize', () => {
      updateTooltipPosition(targetElement, step.position || 'bottom');
    });
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', () => {
        updateTooltipPosition(targetElement, step.position || 'bottom');
      });
    };
  }, [currentStep, steps]);

  // Update tooltip position
  const updateTooltipPosition = (targetElement: Element, position: 'top' | 'bottom' | 'left' | 'right') => {
    const rect = targetElement.getBoundingClientRect();
    const tooltipWidth = 280; // Approximate width of the tooltip
    const tooltipHeight = 150; // Approximate height of the tooltip
    
    let top = 0;
    let left = 0;
    
    switch (position) {
      case 'top':
        top = rect.top - tooltipHeight - 10;
        left = rect.left + (rect.width / 2) - (tooltipWidth / 2);
        break;
      case 'bottom':
        top = rect.bottom + 10;
        left = rect.left + (rect.width / 2) - (tooltipWidth / 2);
        break;
      case 'left':
        top = rect.top + (rect.height / 2) - (tooltipHeight / 2);
        left = rect.left - tooltipWidth - 10;
        break;
      case 'right':
        top = rect.top + (rect.height / 2) - (tooltipHeight / 2);
        left = rect.right + 10;
        break;
    }
    
    // Ensure tooltip stays within viewport
    if (left < 10) left = 10;
    if (left + tooltipWidth > window.innerWidth - 10) {
      left = window.innerWidth - tooltipWidth - 10;
    }
    
    if (top < 10) top = 10;
    if (top + tooltipHeight > window.innerHeight - 10) {
      top = window.innerHeight - tooltipHeight - 10;
    }
    
    setTooltipPosition({ top, left });
  };

  // Handle next step
  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };

  // Handle previous step
  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Handle skip
  const handleSkip = () => {
    // Remove all highlights
    document.querySelectorAll('.feature-highlight').forEach(el => {
      el.classList.remove('feature-highlight');
    });
    
    // Remove style
    const style = document.getElementById('feature-highlight-style');
    if (style) {
      document.head.removeChild(style);
    }
    
    onSkip();
  };

  if (!visible || currentStep >= steps.length) return null;

  const step = steps[currentStep];
  const position = step.position || 'bottom';

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-black bg-opacity-30 z-40" onClick={handleSkip}></div>
      
      {/* Tooltip */}
      <div 
        className="fixed z-50 bg-white rounded-lg shadow-xl border border-gray-200 p-4 w-[280px]"
        style={{
          top: `${tooltipPosition.top}px`,
          left: `${tooltipPosition.left}px`,
        }}
      >
        <button 
          onClick={handleSkip}
          className="absolute top-2 right-2 p-1 rounded-full hover:bg-gray-100"
        >
          <X className="h-4 w-4 text-gray-500" />
        </button>
        
        <h3 className="font-semibold text-gray-900 mb-2">{step.title}</h3>
        <p className="text-sm text-gray-600 mb-4">{step.description}</p>
        
        <div className="flex justify-between items-center">
          <div className="text-xs text-gray-500">
            Step {currentStep + 1} of {steps.length}
          </div>
          
          <div className="flex space-x-2">
            {currentStep > 0 && (
              <Button 
                size="sm" 
                variant="outline"
                onClick={handlePrevious}
                className="flex items-center"
              >
                <ArrowLeft className="h-3 w-3 mr-1" />
                Back
              </Button>
            )}
            
            <Button 
              size="sm" 
              onClick={handleNext}
              className="flex items-center"
            >
              {currentStep === steps.length - 1 ? 'Finish' : 'Next'}
              {currentStep !== steps.length - 1 && <ArrowRight className="h-3 w-3 ml-1" />}
            </Button>
          </div>
        </div>
        
        {/* Arrow pointing to the target element */}
        <div 
          className={`absolute w-3 h-3 bg-white border-t border-l border-gray-200 transform rotate-45 ${
            position === 'bottom' ? '-top-1.5' : 
            position === 'top' ? '-bottom-1.5 rotate-[225deg]' : 
            position === 'left' ? '-right-1.5 rotate-[135deg]' : 
            '-left-1.5 rotate-[315deg]'
          }`}
        ></div>
      </div>
    </>
  );
};