import React, { useState, useEffect, useRef } from 'react';
import { MapPin, Navigation, Star, DollarSign, Zap, Loader } from 'lucide-react';
import { Button } from '../ui/Button';
import { OptimizedImage } from '../ui/Image';
import { Court } from '../../types';
import { useGeolocation } from '../../hooks/useGeolocation';

interface MapViewProps {
  courts: Court[];
  selectedCourt?: Court | null;
  onCourtSelect: (court: Court) => void;
  onViewDetails?: (court: Court) => void;
  onBookNow?: (court: Court) => void;
}

export const MapView: React.FC<MapViewProps> = ({
  courts,
  selectedCourt,
  onCourtSelect,
  onViewDetails,
  onBookNow,
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [mapInstance, setMapInstance] = useState<any>(null);
  const [markers, setMarkers] = useState<any[]>([]);
  const { coordinates, loading: locationLoading } = useGeolocation();
  
  // Initialize map when component mounts
  useEffect(() => {
    // Check if Google Maps API is loaded
    if (!window.google || !window.google.maps) {
      // Load Google Maps API
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyBNLrJhOMz6idD05pzfn5lhA-TAw-mAZCU&callback=initMap`;
      script.async = true;
      script.defer = true;
      
      // Define callback function
      window.initMap = () => {
        setIsMapLoaded(true);
      };
      
      document.head.appendChild(script);
      
      return () => {
        // Clean up
        delete window.initMap;
        document.head.removeChild(script);
      };
    } else {
      setIsMapLoaded(true);
    }
  }, []);
  
  // Initialize map when API is loaded and coordinates are available
  useEffect(() => {
    if (!isMapLoaded || !mapRef.current || !coordinates) return;
    
    // Create map instance
    const map = new window.google.maps.Map(mapRef.current, {
      center: { lat: coordinates.lat, lng: coordinates.lng },
      zoom: 12,
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: false,
    });
    
    // Add user marker
    new window.google.maps.Marker({
      position: { lat: coordinates.lat, lng: coordinates.lng },
      map,
      icon: {
        path: window.google.maps.SymbolPath.CIRCLE,
        scale: 10,
        fillColor: '#4285F4',
        fillOpacity: 1,
        strokeColor: '#FFFFFF',
        strokeWeight: 2,
      },
      title: 'Your Location',
    });
    
    setMapInstance(map);
    
    // Add court markers
    const courtMarkers = courts.map(court => {
      const marker = new window.google.maps.Marker({
        position: { lat: court.coordinates.lat, lng: court.coordinates.lng },
        map,
        title: court.name,
        icon: {
          url: 'https://maps.google.com/mapfiles/ms/icons/red-dot.png',
        },
      });
      
      // Add click event
      marker.addListener('click', () => {
        onCourtSelect(court);
      });
      
      return marker;
    });
    
    setMarkers(courtMarkers);
    
    return () => {
      // Clean up markers
      courtMarkers.forEach(marker => marker.setMap(null));
    };
  }, [isMapLoaded, coordinates, courts, onCourtSelect]);
  
  // Update selected court marker
  useEffect(() => {
    if (!mapInstance || !markers.length) return;
    
    // Reset all markers
    markers.forEach((marker, index) => {
      marker.setIcon({
        url: 'https://maps.google.com/mapfiles/ms/icons/red-dot.png',
      });
    });
    
    // Highlight selected marker
    if (selectedCourt) {
      const selectedIndex = courts.findIndex(court => court.id === selectedCourt.id);
      if (selectedIndex !== -1 && markers[selectedIndex]) {
        markers[selectedIndex].setIcon({
          url: 'https://maps.google.com/mapfiles/ms/icons/blue-dot.png',
        });
        
        // Center map on selected court
        mapInstance.panTo({ 
          lat: selectedCourt.coordinates.lat, 
          lng: selectedCourt.coordinates.lng 
        });
      }
    }
  }, [selectedCourt, courts, markers, mapInstance]);
  
  // Calculate distance between two coordinates
  const calculateDistance = (lat1: number, lng1: number, lat2: number, lng2: number): number => {
    const R = 6371; // Earth's radius in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = 
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLng / 2) * Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };
  
  // Get directions to a court
  const getDirections = (court: Court) => {
    if (!coordinates) return;
    
    const url = `https://www.google.com/maps/dir/?api=1&origin=${coordinates.lat},${coordinates.lng}&destination=${court.coordinates.lat},${court.coordinates.lng}`;
    window.open(url, '_blank');
  };
  
  if (locationLoading || !isMapLoaded) {
    return (
      <div className="bg-white rounded-lg p-8 shadow-sm border border-gray-200 text-center h-[600px] flex items-center justify-center">
        <div>
          <Loader className="h-8 w-8 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading map...</p>
        </div>
      </div>
    );
  }
  
  if (!coordinates) {
    return (
      <div className="bg-white rounded-lg p-8 shadow-sm border border-gray-200 text-center h-[600px] flex items-center justify-center">
        <div>
          <MapPin className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-600 mb-4">Location access is required to show the map</p>
          <Button onClick={() => window.location.reload()}>
            Allow Location Access
          </Button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Map */}
      <div className="lg:col-span-2">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden h-[600px]">
          <div ref={mapRef} className="w-full h-full"></div>
        </div>
      </div>
      
      {/* Court List */}
      <div className="lg:col-span-1 space-y-4 max-h-[600px] overflow-y-auto pr-2">
        {courts.length > 0 ? (
          courts.map(court => {
            // Calculate distance if coordinates are available
            const distance = coordinates 
              ? calculateDistance(
                  coordinates.lat, 
                  coordinates.lng, 
                  court.coordinates.lat, 
                  court.coordinates.lng
                ).toFixed(1) 
              : null;
              
            return (
              <div
                key={court.id}
                className={`bg-white rounded-lg shadow-sm border-2 overflow-hidden transition-all duration-200 cursor-pointer ${
                  selectedCourt?.id === court.id 
                    ? 'border-blue-500 shadow-md' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => onCourtSelect(court)}
              >
                <div className="flex">
                  <div className="w-1/3">
                    <OptimizedImage
                      src={court.image}
                      alt={court.name}
                      className="w-full h-full"
                      objectFit="cover"
                      width={120}
                      height={120}
                    />
                  </div>
                  <div className="w-2/3 p-3">
                    <h3 className="font-semibold text-gray-900 mb-1">{court.name}</h3>
                    <div className="flex items-center text-sm text-gray-600 mb-1">
                      <MapPin className="h-3 w-3 mr-1" />
                      <span className="truncate">{court.location}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm mb-2">
                      <div className="flex items-center">
                        <Star className="h-3 w-3 text-yellow-500 fill-current mr-1" />
                        <span>{court.rating}</span>
                      </div>
                      <span className="text-gray-400">•</span>
                      <div className="flex items-center">
                        <DollarSign className="h-3 w-3 text-green-600 mr-1" />
                        <span>${court.price}/hr</span>
                      </div>
                      {distance && (
                        <>
                          <span className="text-gray-400">•</span>
                          <span>{distance}km</span>
                        </>
                      )}
                    </div>
                    <div className="flex space-x-2">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={(e) => {
                          e.stopPropagation();
                          getDirections(court);
                        }}
                        className="flex-1 flex items-center justify-center"
                      >
                        <Navigation className="h-3 w-3 mr-1" />
                        Directions
                      </Button>
                      <Button 
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          onBookNow && onBookNow(court);
                        }}
                        className="flex-1 flex items-center justify-center"
                      >
                        <Zap className="h-3 w-3 mr-1" />
                        Book
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="bg-white rounded-lg p-8 shadow-sm border border-gray-200 text-center">
            <MapPin className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600">No courts found in this area</p>
            <p className="text-sm text-gray-500 mt-2">Try adjusting your filters or expanding your search radius</p>
          </div>
        )}
      </div>
    </div>
  );
};