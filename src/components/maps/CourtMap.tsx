import React, { useState } from 'react';
import { MapPin, Navigation, Star, DollarSign, Clock, Phone } from 'lucide-react';
import { Court } from '../../types';
import { Button } from '../ui/Button';
import { useGeolocation } from '../../hooks/useGeolocation';

interface CourtMapProps {
  courts: Court[];
  selectedCourt?: Court;
  onCourtSelect: (court: Court) => void;
}

export const CourtMap: React.FC<CourtMapProps> = ({ courts, selectedCourt, onCourtSelect }) => {
  const { coordinates, calculateDistance } = useGeolocation();
  const [mapView, setMapView] = useState<'map' | 'list'>('list');

  const getCourtsWithDistance = () => {
    if (!coordinates) return courts;
    
    return courts.map(court => ({
      ...court,
      distance: calculateDistance(
        coordinates.lat,
        coordinates.lng,
        court.coordinates.lat,
        court.coordinates.lng
      )
    })).sort((a, b) => (a.distance || 0) - (b.distance || 0));
  };

  const courtsWithDistance = getCourtsWithDistance();

  const getDirections = (court: Court) => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${court.coordinates.lat},${court.coordinates.lng}`;
    window.open(url, '_blank');
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
      {/* Header */}
      <div className="p-4 border-b border-slate-200">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-slate-900">Nearby Courts</h3>
          <div className="flex space-x-2">
            <button
              onClick={() => setMapView('list')}
              className={`px-3 py-1 text-sm rounded-lg transition-colors ${
                mapView === 'list' 
                  ? 'bg-blue-100 text-blue-700' 
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              List
            </button>
            <button
              onClick={() => setMapView('map')}
              className={`px-3 py-1 text-sm rounded-lg transition-colors ${
                mapView === 'map' 
                  ? 'bg-blue-100 text-blue-700' 
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              Map
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {mapView === 'map' ? (
          // Map View Placeholder
          <div className="h-64 bg-slate-100 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <MapPin className="h-12 w-12 text-slate-400 mx-auto mb-3" />
              <p className="text-slate-500">Interactive map coming soon</p>
              <p className="text-sm text-slate-400 mt-1">
                Will show courts on Google Maps with real-time availability
              </p>
            </div>
          </div>
        ) : (
          // List View
          <div className="space-y-4 max-h-64 overflow-y-auto">
            {courtsWithDistance.map((court) => (
              <div
                key={court.id}
                className={`p-4 border border-slate-200 rounded-lg cursor-pointer transition-all hover:shadow-md ${
                  selectedCourt?.id === court.id ? 'ring-2 ring-blue-500 bg-blue-50' : ''
                }`}
                onClick={() => onCourtSelect(court)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h4 className="font-medium text-slate-900">{court.name}</h4>
                      <div className="flex items-center space-x-1">
                        <Star className="h-4 w-4 text-yellow-500 fill-current" />
                        <span className="text-sm text-slate-600">{court.rating}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center text-sm text-slate-600 mb-2">
                      <MapPin className="h-4 w-4 mr-1" />
                      <span>{court.location}</span>
                      {court.distance && (
                        <span className="ml-2 text-emerald-600 font-medium">
                          {court.distance.toFixed(1)} km away
                        </span>
                      )}
                    </div>

                    <div className="flex items-center space-x-4 text-sm text-slate-600">
                      <div className="flex items-center space-x-1">
                        <DollarSign className="h-4 w-4" />
                        <span>${court.price}/hr</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="h-4 w-4" />
                        <span>{court.isIndoor ? 'Indoor' : 'Outdoor'}</span>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-1 mt-2">
                      {court.sport.slice(0, 3).map((sport) => (
                        <span
                          key={sport}
                          className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full"
                        >
                          {sport}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-col space-y-2 ml-4">
                    <Button
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        getDirections(court);
                      }}
                    >
                      <Navigation className="h-4 w-4" />
                    </Button>
                    
                    {court.contactInfo?.phone && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={(e) => {
                          e.stopPropagation();
                          window.open(`tel:${court.contactInfo?.phone}`);
                        }}
                      >
                        <Phone className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};