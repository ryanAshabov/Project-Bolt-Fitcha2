import React, { useState, useEffect } from 'react';
import { X, ArrowRight } from 'lucide-react';
import { Button } from '../ui/Button';

interface FeatureHighlightProps {
  targetSelector: string;
  title: string;
  description: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
  onClose: () => void;
  onNext?: () => void;
  showNext?: boolean;
}

export const FeatureHighlight: React.FC<FeatureHighlightProps> = ({
  targetSelector,
  title,
  description,
  position = 'bottom',
  onClose,
  onNext,
  showNext = false,
}) => {
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 });
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const targetElement = document.querySelector(targetSelector);
    
    if (!targetElement) {
      console.error(`Target element not found: ${targetSelector}`);
      return;
    }
    
    const updatePosition = () => {
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
    
    // Add highlight to target element
    targetElement.classList.add('ring-4', 'ring-blue-500', 'ring-opacity-50', 'z-50');
    
    // Update position and show tooltip
    updatePosition();
    setVisible(true);
    
    // Update position on resize
    window.addEventListener('resize', updatePosition);
    
    // Cleanup
    return () => {
      targetElement.classList.remove('ring-4', 'ring-blue-500', 'ring-opacity-50', 'z-50');
      window.removeEventListener('resize', updatePosition);
    };
  }, [targetSelector, position]);

  if (!visible) return null;

  return (
    <div 
      className="fixed z-50 bg-white rounded-lg shadow-xl border border-gray-200 p-4 w-[280px]"
      style={{
        top: `${tooltipPosition.top}px`,
        left: `${tooltipPosition.left}px`,
      }}
    >
      <button 
        onClick={onClose}
        className="absolute top-2 right-2 p-1 rounded-full hover:bg-gray-100"
      >
        <X className="h-4 w-4 text-gray-500" />
      </button>
      
      <h3 className="font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-sm text-gray-600 mb-4">{description}</p>
      
      <div className="flex justify-end">
        {showNext && onNext ? (
          <Button 
            size="sm" 
            onClick={onNext}
            className="flex items-center"
          >
            Next
            <ArrowRight className="h-3 w-3 ml-1" />
          </Button>
        ) : (
          <Button 
            size="sm" 
            onClick={onClose}
          >
            Got it
          </Button>
        )}
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
  );
};