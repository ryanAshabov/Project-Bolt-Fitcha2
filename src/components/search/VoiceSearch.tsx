import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, X, Loader, Volume2 } from 'lucide-react';
import { Button } from '../ui/Button';

interface VoiceSearchProps {
  onSearch: (query: string) => void;
  onClose: () => void;
  onFilterChange?: (filter: string, value: any) => void;
}

export const VoiceSearch: React.FC<VoiceSearchProps> = ({
  onSearch,
  onClose,
  onFilterChange,
}) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [recognizedCommands, setRecognizedCommands] = useState<string[]>([]);
  const recognitionRef = useRef<any>(null);
  
  // Initialize speech recognition
  useEffect(() => {
    if (!('webkitSpeechRecognition' in window)) {
      setError('Voice search is not supported in your browser.');
      return;
    }
    
    const recognition = new (window as any).webkitSpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';
    
    recognition.onstart = () => {
      setIsListening(true);
      setTranscript('Listening...');
    };
    
    recognition.onresult = (event: any) => {
      const current = event.resultIndex;
      const result = event.results[current];
      const transcriptText = result[0].transcript;
      
      setTranscript(transcriptText);
      
      // Process commands if result is final
      if (result.isFinal) {
        processVoiceCommand(transcriptText);
      }
    };
    
    recognition.onerror = (event: any) => {
      console.error('Speech recognition error', event.error);
      setError(`Error: ${event.error}`);
      setIsListening(false);
    };
    
    recognition.onend = () => {
      setIsListening(false);
    };
    
    recognitionRef.current = recognition;
    
    // Start listening immediately
    startListening();
    
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);
  
  // Start listening
  const startListening = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.start();
      } catch (error) {
        console.error('Error starting speech recognition:', error);
      }
    }
  };
  
  // Stop listening
  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
  };
  
  // Process voice commands
  const processVoiceCommand = (text: string) => {
    const lowerText = text.toLowerCase();
    const commands: string[] = [];
    
    // Sport filters
    const sportTypes = [
      { keyword: 'basketball', filter: 'sport', value: 'basketball' },
      { keyword: 'tennis', filter: 'sport', value: 'tennis' },
      { keyword: 'football', filter: 'sport', value: 'football' },
      { keyword: 'soccer', filter: 'sport', value: 'football' },
      { keyword: 'volleyball', filter: 'sport', value: 'volleyball' },
      { keyword: 'swimming', filter: 'sport', value: 'swimming' },
      { keyword: 'badminton', filter: 'sport', value: 'badminton' },
    ];
    
    // Check for sport types
    for (const sport of sportTypes) {
      if (lowerText.includes(sport.keyword)) {
        if (onFilterChange) {
          onFilterChange(sport.filter, sport.value);
          commands.push(`Set sport to ${sport.keyword}`);
        }
      }
    }
    
    // Location filters
    if (lowerText.includes('near me')) {
      if (onFilterChange) {
        onFilterChange('maxDistance', 5);
        commands.push('Set distance to 5km');
      }
    }
    
    // Distance filters
    const distanceMatch = lowerText.match(/within (\d+) (kilometers|km|miles)/i);
    if (distanceMatch) {
      const distance = parseInt(distanceMatch[1]);
      if (onFilterChange && !isNaN(distance)) {
        onFilterChange('maxDistance', distance);
        commands.push(`Set distance to ${distance}km`);
      }
    }
    
    // Indoor/Outdoor filters
    if (lowerText.includes('indoor')) {
      if (onFilterChange) {
        onFilterChange('isIndoor', true);
        commands.push('Set to indoor only');
      }
    }
    
    if (lowerText.includes('outdoor')) {
      if (onFilterChange) {
        onFilterChange('isIndoor', false);
        commands.push('Set to outdoor only');
      }
    }
    
    // Price filters
    const priceMatch = lowerText.match(/under (\d+) dollars/i);
    if (priceMatch) {
      const price = parseInt(priceMatch[1]);
      if (onFilterChange && !isNaN(price)) {
        onFilterChange('priceRange', [0, price]);
        commands.push(`Set max price to $${price}`);
      }
    }
    
    // Rating filters
    const ratingMatch = lowerText.match(/(\d+) stars? or (better|higher|more)/i);
    if (ratingMatch) {
      const rating = parseInt(ratingMatch[1]);
      if (onFilterChange && !isNaN(rating) && rating >= 1 && rating <= 5) {
        onFilterChange('rating', rating);
        commands.push(`Set minimum rating to ${rating} stars`);
      }
    }
    
    // Time filters
    if (lowerText.includes('morning')) {
      if (onFilterChange) {
        onFilterChange('time', 'morning');
        commands.push('Set time to morning');
      }
    } else if (lowerText.includes('afternoon')) {
      if (onFilterChange) {
        onFilterChange('time', 'afternoon');
        commands.push('Set time to afternoon');
      }
    } else if (lowerText.includes('evening')) {
      if (onFilterChange) {
        onFilterChange('time', 'evening');
        commands.push('Set time to evening');
      }
    }
    
    // Amenities
    const amenities = [
      { keyword: 'parking', filter: 'amenities', value: 'parking' },
      { keyword: 'wifi', filter: 'amenities', value: 'wifi' },
      { keyword: 'shower', filter: 'amenities', value: 'showers' },
      { keyword: 'locker', filter: 'amenities', value: 'lockers' },
      { keyword: 'cafe', filter: 'amenities', value: 'cafe' },
      { keyword: 'air conditioning', filter: 'amenities', value: 'ac' },
    ];
    
    for (const amenity of amenities) {
      if (lowerText.includes(amenity.keyword)) {
        if (onFilterChange) {
          // Add to existing amenities
          onFilterChange(amenity.filter, [amenity.value]);
          commands.push(`Added ${amenity.keyword} to amenities`);
        }
      }
    }
    
    // Update recognized commands
    if (commands.length > 0) {
      setRecognizedCommands(commands);
    }
    
    // Submit search
    onSearch(text);
  };
  
  // Handle submit
  const handleSubmit = () => {
    if (transcript && transcript !== 'Listening...') {
      onSearch(transcript);
      onClose();
    }
  };
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4 text-white">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-lg">Voice Search</h3>
            <button 
              onClick={onClose}
              className="p-1 rounded-full hover:bg-white/20"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
        
        {/* Voice Input Area */}
        <div className="p-6">
          {error ? (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
              <p className="text-red-700">{error}</p>
            </div>
          ) : (
            <div className="text-center mb-6">
              <div className={`w-24 h-24 rounded-full mx-auto mb-4 flex items-center justify-center ${
                isListening 
                  ? 'bg-red-100 animate-pulse' 
                  : 'bg-gray-100'
              }`}>
                {isListening ? (
                  <Mic className="h-12 w-12 text-red-600" />
                ) : (
                  <MicOff className="h-12 w-12 text-gray-400" />
                )}
              </div>
              
              <div className="bg-gray-50 rounded-lg p-4 min-h-[80px] flex items-center justify-center">
                {isListening ? (
                  <p className="text-gray-700">{transcript}</p>
                ) : (
                  <p className="text-gray-500">Click the microphone to start speaking</p>
                )}
              </div>
            </div>
          )}
          
          {/* Recognized Commands */}
          {recognizedCommands.length > 0 && (
            <div className="mb-6">
              <h4 className="font-medium text-gray-900 mb-2">Recognized Commands:</h4>
              <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
                <ul className="space-y-1">
                  {recognizedCommands.map((command, index) => (
                    <li key={index} className="flex items-center text-blue-700 text-sm">
                      <CheckCircle className="h-4 w-4 mr-2 text-blue-600" />
                      {command}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
          
          {/* Example Commands */}
          <div className="mb-6">
            <h4 className="font-medium text-gray-900 mb-2">Try saying:</h4>
            <div className="bg-gray-50 rounded-lg p-3">
              <ul className="space-y-1 text-sm text-gray-600">
                <li>"Find basketball courts near me"</li>
                <li>"Show tennis courts within 10 kilometers"</li>
                <li>"Indoor courts with parking and wifi"</li>
                <li>"Courts with 4 stars or better"</li>
                <li>"Football fields available in the evening"</li>
              </ul>
            </div>
          </div>
          
          {/* Controls */}
          <div className="flex justify-between">
            {isListening ? (
              <Button 
                variant="outline" 
                onClick={stopListening}
                className="flex items-center"
              >
                <MicOff className="h-4 w-4 mr-2" />
                Stop Listening
              </Button>
            ) : (
              <Button 
                onClick={startListening}
                className="flex items-center"
              >
                <Mic className="h-4 w-4 mr-2" />
                Start Listening
              </Button>
            )}
            
            <Button
              onClick={handleSubmit}
              disabled={!transcript || transcript === 'Listening...'}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Search
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};