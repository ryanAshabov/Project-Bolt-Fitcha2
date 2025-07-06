import React, { useState, useRef, useEffect } from 'react';
import { Camera, Scan, MapPin, Star, DollarSign, Navigation, X } from 'lucide-react';
import { Button } from '../ui/Button';

interface AROverlay {
  id: string;
  name: string;
  distance: number;
  rating: number;
  price: number;
  position: { x: number; y: number };
  sport: string;
  available: boolean;
}

export const ARCourtPreview: React.FC = () => {
  const [isARActive, setIsARActive] = useState(false);
  const [overlays, setOverlays] = useState<AROverlay[]>([]);
  const [selectedCourt, setSelectedCourt] = useState<AROverlay | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (isARActive) {
      startCamera();
      generateMockOverlays();
    } else {
      stopCamera();
    }

    return () => stopCamera();
  }, [isARActive]);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' }, 
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
    }
  };

  const stopCamera = () => {
    if (videoRef.current?.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
      tracks.forEach(track => track.stop());
    }
  };

  const generateMockOverlays = () => {
    // Mock AR overlays for demonstration
    const mockOverlays: AROverlay[] = [
      {
        id: '1',
        name: 'Golden Gate Courts',
        distance: 0.3,
        rating: 4.8,
        price: 25,
        position: { x: 30, y: 40 },
        sport: 'Basketball',
        available: true,
      },
      {
        id: '2',
        name: 'Elite Tennis Center',
        distance: 0.8,
        rating: 4.9,
        price: 40,
        position: { x: 70, y: 30 },
        sport: 'Tennis',
        available: false,
      },
      {
        id: '3',
        name: 'Community Soccer Field',
        distance: 1.2,
        rating: 4.5,
        price: 35,
        position: { x: 50, y: 60 },
        sport: 'Soccer',
        available: true,
      },
    ];
    setOverlays(mockOverlays);
  };

  const getSportIcon = (sport: string) => {
    switch (sport) {
      case 'Basketball': return '🏀';
      case 'Tennis': return '🎾';
      case 'Soccer': return '⚽';
      default: return '🏃';
    }
  };

  if (!isARActive) {
    return (
      <div className="bg-white rounded-xl p-8 shadow-sm text-center">
        <div className="bg-gradient-to-br from-purple-100 to-blue-100 p-6 rounded-full w-24 h-24 mx-auto mb-6 flex items-center justify-center">
          <Camera className="h-12 w-12 text-purple-600" />
        </div>
        <h3 className="text-2xl font-bold text-slate-900 mb-4">AR Court Preview</h3>
        <p className="text-slate-600 mb-8">
          استخدم الواقع المعزز لاستكشاف الملاعب من حولك والحصول على معلومات فورية
        </p>
        <Button 
          onClick={() => setIsARActive(true)}
          className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
        >
          <Scan className="h-5 w-5 mr-2" />
          تفعيل الواقع المعزز
        </Button>
      </div>
    );
  }

  return (
    <div className="relative w-full h-96 bg-black rounded-xl overflow-hidden">
      {/* Camera Feed */}
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className="w-full h-full object-cover"
      />
      
      {/* AR Overlays */}
      {overlays.map((overlay) => (
        <div
          key={overlay.id}
          className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer"
          style={{ 
            left: `${overlay.position.x}%`, 
            top: `${overlay.position.y}%`, 
          }}
          onClick={() => setSelectedCourt(overlay)}
        >
          {/* AR Marker */}
          <div className={`relative ${overlay.available ? 'animate-pulse' : ''}`}>
            <div className={`w-12 h-12 rounded-full border-4 ${
              overlay.available 
                ? 'border-emerald-400 bg-emerald-500' 
                : 'border-red-400 bg-red-500'
            } bg-opacity-80 flex items-center justify-center text-white text-xl shadow-lg`}>
              {getSportIcon(overlay.sport)}
            </div>
            
            {/* Distance Label */}
            <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
              {overlay.distance} km
            </div>
          </div>
        </div>
      ))}

      {/* AR Controls */}
      <div className="absolute top-4 left-4 right-4 flex justify-between items-center">
        <div className="bg-black bg-opacity-50 text-white px-3 py-2 rounded-lg text-sm">
          <Scan className="h-4 w-4 inline mr-2" />
          AR Mode Active
        </div>
        <Button
          variant="ghost"
          onClick={() => setIsARActive(false)}
          className="bg-black bg-opacity-50 text-white hover:bg-opacity-70"
        >
          <X className="h-5 w-5" />
        </Button>
      </div>

      {/* Court Details Popup */}
      {selectedCourt && (
        <div className="absolute bottom-4 left-4 right-4 bg-white rounded-xl p-4 shadow-xl">
          <div className="flex items-start justify-between mb-3">
            <div>
              <h4 className="font-bold text-slate-900 flex items-center space-x-2">
                <span>{getSportIcon(selectedCourt.sport)}</span>
                <span>{selectedCourt.name}</span>
              </h4>
              <div className="flex items-center space-x-4 mt-2 text-sm text-slate-600">
                <div className="flex items-center space-x-1">
                  <MapPin className="h-4 w-4" />
                  <span>{selectedCourt.distance} km</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Star className="h-4 w-4 text-yellow-500 fill-current" />
                  <span>{selectedCourt.rating}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <DollarSign className="h-4 w-4" />
                  <span>${selectedCourt.price}/hr</span>
                </div>
              </div>
            </div>
            <button
              onClick={() => setSelectedCourt(null)}
              className="p-1 hover:bg-slate-100 rounded"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          
          <div className="flex space-x-2">
            <Button 
              className="flex-1"
              disabled={!selectedCourt.available}
            >
              {selectedCourt.available ? 'احجز الآن' : 'غير متاح'}
            </Button>
            <Button variant="outline">
              <Navigation className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* AR Instructions */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center text-white pointer-events-none">
        <div className="bg-black bg-opacity-50 px-4 py-2 rounded-lg">
          <p className="text-sm">وجه الكاميرا نحو الملاعب لرؤية المعلومات</p>
        </div>
      </div>
    </div>
  );
};