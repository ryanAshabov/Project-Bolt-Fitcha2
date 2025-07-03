import React, { useState, useRef, useEffect } from 'react';
import { Send, Mic, MicOff, Bot, Sparkles, MapPin, Clock, DollarSign } from 'lucide-react';
import { Button } from '../ui/Button';
import { useAuth } from '../../hooks/useAuth';

interface Message {
  id: string;
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
  suggestions?: string[];
  courtSuggestions?: any[];
}

export const CourtConcierge: React.FC = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'bot',
      content: `مرحباً ${user?.firstName}! 🎾 أنا مساعدك الذكي للملاعب. كيف يمكنني مساعدتك اليوم؟`,
      timestamp: new Date(),
      suggestions: [
        'أريد ملعب تنس قريب',
        'ما هي الملاعب المتاحة مساءً؟',
        'أريد ملعب كرة قدم رخيص',
        'اقترح لي ملعب مناسب'
      ]
    }
  ]);
  const [input, setInput] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (message: string) => {
    if (!message.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: message,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    // Simulate AI processing
    setTimeout(() => {
      const botResponse = generateBotResponse(message);
      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const generateBotResponse = (userMessage: string): Message => {
    const lowerMessage = userMessage.toLowerCase();
    
    if (lowerMessage.includes('تنس') || lowerMessage.includes('tennis')) {
      return {
        id: Date.now().toString(),
        type: 'bot',
        content: 'وجدت لك أفضل ملاعب التنس! 🎾',
        timestamp: new Date(),
        courtSuggestions: [
          {
            name: 'Elite Tennis Center',
            distance: '2.3 km',
            price: 40,
            rating: 4.9,
            available: ['14:00', '16:00', '18:00']
          },
          {
            name: 'Royal Tennis Club',
            distance: '3.1 km',
            price: 35,
            rating: 4.7,
            available: ['15:00', '17:00', '19:00']
          }
        ],
        suggestions: ['احجز الآن', 'اعرض المزيد', 'غير الوقت']
      };
    }

    if (lowerMessage.includes('كرة قدم') || lowerMessage.includes('football') || lowerMessage.includes('soccer')) {
      return {
        id: Date.now().toString(),
        type: 'bot',
        content: 'إليك أفضل ملاعب كرة القدم المتاحة! ⚽',
        timestamp: new Date(),
        courtSuggestions: [
          {
            name: 'Community Soccer Fields',
            distance: '1.8 km',
            price: 35,
            rating: 4.5,
            available: ['16:00', '18:00', '20:00']
          }
        ],
        suggestions: ['احجز الآن', 'ابحث عن ملاعب أخرى']
      };
    }

    if (lowerMessage.includes('رخيص') || lowerMessage.includes('cheap')) {
      return {
        id: Date.now().toString(),
        type: 'bot',
        content: 'إليك أرخص الملاعب المتاحة! 💰',
        timestamp: new Date(),
        courtSuggestions: [
          {
            name: 'Public Sports Center',
            distance: '4.2 km',
            price: 15,
            rating: 4.2,
            available: ['09:00', '11:00', '13:00']
          }
        ],
        suggestions: ['احجز الآن', 'ابحث في نطاق أوسع']
      };
    }

    return {
      id: Date.now().toString(),
      type: 'bot',
      content: 'يمكنني مساعدتك في العثور على الملعب المثالي! أخبرني عن نوع الرياضة والوقت المفضل.',
      timestamp: new Date(),
      suggestions: [
        'أريد ملعب تنس',
        'أريد ملعب كرة قدم',
        'ما هي الملاعب القريبة؟',
        'اعرض الملاعب الرخيصة'
      ]
    };
  };

  const startVoiceRecognition = () => {
    if ('webkitSpeechRecognition' in window) {
      const recognition = new (window as any).webkitSpeechRecognition();
      recognition.lang = 'ar-SA';
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onstart = () => setIsListening(true);
      recognition.onend = () => setIsListening(false);
      
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
      };

      recognition.start();
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-lg h-96 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-slate-200 bg-gradient-to-r from-blue-50 to-purple-50">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
            <Bot className="h-6 w-6 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-slate-900 flex items-center space-x-2">
              <span>مساعد الملاعب الذكي</span>
              <Sparkles className="h-4 w-4 text-yellow-500" />
            </h3>
            <p className="text-sm text-slate-600">متاح 24/7 لمساعدتك</p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
              message.type === 'user'
                ? 'bg-blue-600 text-white'
                : 'bg-slate-100 text-slate-900'
            }`}>
              <p className="text-sm">{message.content}</p>
              
              {/* Court Suggestions */}
              {message.courtSuggestions && (
                <div className="mt-3 space-y-2">
                  {message.courtSuggestions.map((court, index) => (
                    <div key={index} className="bg-white rounded-lg p-3 text-slate-900">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-sm">{court.name}</h4>
                        <span className="text-xs bg-emerald-100 text-emerald-800 px-2 py-1 rounded-full">
                          ⭐ {court.rating}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-xs text-slate-600">
                        <span className="flex items-center space-x-1">
                          <MapPin className="h-3 w-3" />
                          <span>{court.distance}</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <DollarSign className="h-3 w-3" />
                          <span>${court.price}/hr</span>
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {court.available.map((time: string) => (
                          <span key={time} className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                            {time}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Quick Suggestions */}
              {message.suggestions && (
                <div className="mt-3 space-y-1">
                  {message.suggestions.map((suggestion, index) => (
                    <button
                      key={index}
                      onClick={() => handleSendMessage(suggestion)}
                      className="block w-full text-left text-xs bg-white bg-opacity-20 hover:bg-opacity-30 px-2 py-1 rounded transition-colors"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
        
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-slate-100 px-4 py-2 rounded-lg">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-slate-200">
        <div className="flex items-center space-x-2">
          <button
            onClick={startVoiceRecognition}
            className={`p-2 rounded-lg transition-colors ${
              isListening 
                ? 'bg-red-100 text-red-600' 
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {isListening ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
          </button>
          
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage(input)}
            placeholder="اكتب رسالتك أو استخدم الصوت..."
            className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            dir="rtl"
          />
          
          <Button onClick={() => handleSendMessage(input)} disabled={!input.trim()}>
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};