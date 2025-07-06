import React, { useState, useEffect } from 'react';
import { Mic, MicOff, Volume2, VolumeX, Settings, Zap } from 'lucide-react';
import { Button } from '../ui/Button';

interface VoiceCommand {
  command: string;
  action: string;
  example: string;
}

export const VoiceCommands: React.FC = () => {
  const [isListening, setIsListening] = useState(false);
  const [isEnabled, setIsEnabled] = useState(false);
  const [lastCommand, setLastCommand] = useState<string>('');
  const [confidence, setConfidence] = useState<number>(0);
  const [voiceEnabled, setVoiceEnabled] = useState(true);

  const voiceCommands: VoiceCommand[] = [
    {
      command: 'احجز ملعب',
      action: 'book_court',
      example: 'احجز ملعب تنس الساعة 6 مساءً',
    },
    {
      command: 'ابحث عن ملعب',
      action: 'search_court',
      example: 'ابحث عن ملعب كرة قدم قريب',
    },
    {
      command: 'اعرض حجوزاتي',
      action: 'show_bookings',
      example: 'اعرض حجوزاتي لهذا الأسبوع',
    },
    {
      command: 'ألغي الحجز',
      action: 'cancel_booking',
      example: 'ألغي حجز الغد',
    },
    {
      command: 'ابحث عن لاعبين',
      action: 'find_players',
      example: 'ابحث عن لاعبين للتنس',
    },
    {
      command: 'اعرض الطقس',
      action: 'show_weather',
      example: 'كيف الطقس اليوم؟',
    },
  ];

  useEffect(() => {
    if ('webkitSpeechRecognition' in window) {
      setIsEnabled(true);
    }
  }, []);

  const startListening = () => {
    if (!isEnabled) {
return;
}

    const recognition = new (window as any).webkitSpeechRecognition();
    recognition.lang = 'ar-SA';
    recognition.continuous = true;
    recognition.interimResults = true;

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.onresult = (event: any) => {
      const current = event.resultIndex;
      const transcript = event.results[current][0].transcript;
      const confidence = event.results[current][0].confidence;
      
      setLastCommand(transcript);
      setConfidence(confidence * 100);

      if (event.results[current].isFinal) {
        processVoiceCommand(transcript);
      }
    };

    recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
      setIsListening(false);
    };

    recognition.start();
  };

  const stopListening = () => {
    setIsListening(false);
  };

  const processVoiceCommand = (command: string) => {
    const lowerCommand = command.toLowerCase();
    
    // Find matching command
    const matchedCommand = voiceCommands.find(cmd => 
      lowerCommand.includes(cmd.command.toLowerCase()),
    );

    if (matchedCommand) {
      executeCommand(matchedCommand.action, command);
      if (voiceEnabled) {
        speakResponse(`تم تنفيذ الأمر: ${matchedCommand.command}`);
      }
    } else {
      if (voiceEnabled) {
        speakResponse('عذراً، لم أفهم الأمر. يرجى المحاولة مرة أخرى.');
      }
    }
  };

  const executeCommand = (action: string, fullCommand: string) => {
    switch (action) {
      case 'book_court':
        console.log('Booking court with command:', fullCommand);
        // Navigate to booking page or open booking modal
        break;
      case 'search_court':
        console.log('Searching courts with command:', fullCommand);
        // Navigate to courts page with search
        break;
      case 'show_bookings':
        console.log('Showing bookings');
        // Navigate to bookings page
        break;
      case 'cancel_booking':
        console.log('Canceling booking with command:', fullCommand);
        // Open cancel booking dialog
        break;
      case 'find_players':
        console.log('Finding players with command:', fullCommand);
        // Navigate to find partners page
        break;
      case 'show_weather':
        console.log('Showing weather');
        // Show weather widget
        break;
      default:
        console.log('Unknown command action:', action);
    }
  };

  const speakResponse = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'ar-SA';
      utterance.rate = 0.9;
      utterance.pitch = 1;
      speechSynthesis.speak(utterance);
    }
  };

  if (!isEnabled) {
    return (
      <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 text-center">
        <MicOff className="h-12 w-12 text-slate-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-slate-900 mb-2">الأوامر الصوتية غير مدعومة</h3>
        <p className="text-slate-600">متصفحك لا يدعم التعرف على الصوت</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Voice Control Panel */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <Zap className="h-6 w-6" />
            <h2 className="text-xl font-bold">التحكم الصوتي</h2>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setVoiceEnabled(!voiceEnabled)}
              className="p-2 bg-white bg-opacity-20 rounded-lg hover:bg-opacity-30 transition-colors"
            >
              {voiceEnabled ? <Volume2 className="h-5 w-5" /> : <VolumeX className="h-5 w-5" />}
            </button>
            <button className="p-2 bg-white bg-opacity-20 rounded-lg hover:bg-opacity-30 transition-colors">
              <Settings className="h-5 w-5" />
            </button>
          </div>
        </div>
        
        <p className="text-blue-100 mb-6">
          استخدم صوتك للتحكم في التطبيق وحجز الملاعب بسهولة
        </p>

        {/* Voice Button */}
        <div className="text-center">
          <button
            onClick={isListening ? stopListening : startListening}
            className={`w-20 h-20 rounded-full border-4 border-white flex items-center justify-center transition-all duration-200 ${
              isListening 
                ? 'bg-red-500 hover:bg-red-600 animate-pulse' 
                : 'bg-white bg-opacity-20 hover:bg-opacity-30'
            }`}
          >
            {isListening ? (
              <MicOff className="h-8 w-8 text-white" />
            ) : (
              <Mic className="h-8 w-8 text-white" />
            )}
          </button>
          
          <p className="mt-4 text-sm text-blue-100">
            {isListening ? 'أتحدث... اضغط للتوقف' : 'اضغط للتحدث'}
          </p>
        </div>

        {/* Live Feedback */}
        {isListening && (
          <div className="mt-6 p-4 bg-white bg-opacity-20 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-blue-100">الأمر المسموع:</span>
              <span className="text-sm text-blue-100">دقة: {Math.round(confidence)}%</span>
            </div>
            <p className="text-white font-medium" dir="rtl">
              {lastCommand || 'في انتظار الأمر...'}
            </p>
          </div>
        )}
      </div>

      {/* Available Commands */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">الأوامر المتاحة</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {voiceCommands.map((cmd, index) => (
            <div key={index} className="border border-slate-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Mic className="h-4 w-4 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-slate-900 mb-1">{cmd.command}</h4>
                  <p className="text-sm text-slate-600" dir="rtl">{cmd.example}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tips */}
      <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-emerald-900 mb-4">نصائح للاستخدام الأمثل</h3>
        
        <div className="space-y-3 text-sm text-emerald-800">
          <div className="flex items-start space-x-2">
            <span className="text-emerald-600">•</span>
            <span>تحدث بوضوح وبصوت مسموع</span>
          </div>
          <div className="flex items-start space-x-2">
            <span className="text-emerald-600">•</span>
            <span>استخدم الأوامر باللغة العربية الفصحى</span>
          </div>
          <div className="flex items-start space-x-2">
            <span className="text-emerald-600">•</span>
            <span>تأكد من وجودك في مكان هادئ</span>
          </div>
          <div className="flex items-start space-x-2">
            <span className="text-emerald-600">•</span>
            <span>انتظر حتى ينتهي التطبيق من معالجة الأمر السابق</span>
          </div>
        </div>
      </div>
    </div>
  );
};