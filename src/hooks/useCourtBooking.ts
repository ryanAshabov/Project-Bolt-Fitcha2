import { useState, useEffect } from 'react';
import { Court, GameSession, User } from '../types';
import { useGeolocation } from './useGeolocation';
import { useAuth } from './useAuth';

interface BookingFilters {
  sport: string;
  date: string;
  time: string;
  maxDistance: number;
  maxPrice: number;
  skillLevel: string;
  isIndoor?: boolean;
}

interface CourtSuggestion {
  court: Court;
  distance: number;
  availableSlots: string[];
  matchScore: number;
  reasons: string[];
}

export const useCourtBooking = () => {
  const { user } = useAuth();
  const { coordinates, calculateDistance } = useGeolocation();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const findOptimalCourt = async (
    players: User[],
    filters: BookingFilters
  ): Promise<CourtSuggestion[]> => {
    setLoading(true);
    setError(null);

    try {
      // Calculate center point between all players
      const centerPoint = calculateCenterPoint(players);
      
      // Get all courts and filter by criteria
      const availableCourts = await getAvailableCourts(filters);
      
      // Score and rank courts
      const suggestions = availableCourts.map(court => {
        const distance = calculateDistance(
          centerPoint.lat,
          centerPoint.lng,
          court.coordinates.lat,
          court.coordinates.lng
        );

        const matchScore = calculateMatchScore(court, filters, distance, players);
        const reasons = generateReasons(court, filters, distance, players);

        return {
          court,
          distance,
          availableSlots: getAvailableSlots(court, filters.date, filters.time),
          matchScore,
          reasons
        };
      });

      // Sort by match score (highest first)
      suggestions.sort((a, b) => b.matchScore - a.matchScore);

      setLoading(false);
      return suggestions.slice(0, 10); // Return top 10 suggestions
    } catch (err) {
      setError('Failed to find optimal courts');
      setLoading(false);
      return [];
    }
  };

  const calculateCenterPoint = (players: User[]) => {
    const validCoordinates = players
      .filter(player => player.coordinates)
      .map(player => player.coordinates!);

    if (validCoordinates.length === 0) {
      return coordinates || { lat: 37.7749, lng: -122.4194 }; // Default to SF
    }

    const avgLat = validCoordinates.reduce((sum, coord) => sum + coord.lat, 0) / validCoordinates.length;
    const avgLng = validCoordinates.reduce((sum, coord) => sum + coord.lng, 0) / validCoordinates.length;

    return { lat: avgLat, lng: avgLng };
  };

  const getAvailableCourts = async (filters: BookingFilters): Promise<Court[]> => {
    // Mock implementation - in real app, this would call your backend
    const mockCourts: Court[] = [
      {
        id: '1',
        name: 'Golden Gate Basketball Courts',
        sport: ['Basketball', 'Volleyball'],
        location: 'Golden Gate Park',
        address: '1234 Park Ave, San Francisco, CA',
        coordinates: { lat: 37.7694, lng: -122.4862 },
        price: 25,
        rating: 4.8,
        reviews: 127,
        image: 'https://images.pexels.com/photos/1752757/pexels-photo-1752757.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&dpr=2',
        amenities: ['Parking', 'Restrooms', 'Water Fountain', 'Lighting'],
        isIndoor: false,
        description: 'Premium outdoor basketball courts',
        operatingHours: {
          monday: { open: '06:00', close: '22:00' },
          tuesday: { open: '06:00', close: '22:00' },
          wednesday: { open: '06:00', close: '22:00' },
          thursday: { open: '06:00', close: '22:00' },
          friday: { open: '06:00', close: '23:00' },
          saturday: { open: '07:00', close: '23:00' },
          sunday: { open: '07:00', close: '21:00' }
        },
        weatherDependent: true,
        availability: [
          { id: '1', startTime: '09:00', endTime: '10:00', date: filters.date, isAvailable: true, price: 25 },
          { id: '2', startTime: '10:00', endTime: '11:00', date: filters.date, isAvailable: true, price: 25 },
          { id: '3', startTime: '18:00', endTime: '19:00', date: filters.date, isAvailable: true, price: 30 },
          { id: '4', startTime: '19:00', endTime: '20:00', date: filters.date, isAvailable: true, price: 30 }
        ]
      },
      {
        id: '2',
        name: 'Elite Tennis Center',
        sport: ['Tennis', 'Badminton'],
        location: 'Downtown',
        address: '567 Tennis Blvd, San Francisco, CA',
        coordinates: { lat: 37.7849, lng: -122.4094 },
        price: 40,
        rating: 4.9,
        reviews: 89,
        image: 'https://images.pexels.com/photos/209977/pexels-photo-209977.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&dpr=2',
        amenities: ['Pro Shop', 'Locker Rooms', 'Coaching', 'Equipment Rental'],
        isIndoor: true,
        description: 'Premium indoor tennis facility',
        operatingHours: {
          monday: { open: '05:00', close: '23:00' },
          tuesday: { open: '05:00', close: '23:00' },
          wednesday: { open: '05:00', close: '23:00' },
          thursday: { open: '05:00', close: '23:00' },
          friday: { open: '05:00', close: '24:00' },
          saturday: { open: '06:00', close: '24:00' },
          sunday: { open: '06:00', close: '22:00' }
        },
        weatherDependent: false,
        availability: [
          { id: '5', startTime: '14:00', endTime: '15:00', date: filters.date, isAvailable: true, price: 40 },
          { id: '6', startTime: '15:00', endTime: '16:00', date: filters.date, isAvailable: true, price: 40 },
          { id: '7', startTime: '18:00', endTime: '19:00', date: filters.date, isAvailable: true, price: 45 }
        ]
      },
      {
        id: '3',
        name: 'Mission Soccer Fields',
        sport: ['Soccer', 'Football'],
        location: 'Mission District',
        address: '890 Soccer Way, San Francisco, CA',
        coordinates: { lat: 37.7599, lng: -122.4148 },
        price: 35,
        rating: 4.5,
        reviews: 203,
        image: 'https://images.pexels.com/photos/274506/pexels-photo-274506.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&dpr=2',
        amenities: ['Parking', 'Restrooms', 'Seating', 'Scoreboard'],
        isIndoor: false,
        description: 'Community soccer fields',
        operatingHours: {
          monday: { open: '08:00', close: '20:00' },
          tuesday: { open: '08:00', close: '20:00' },
          wednesday: { open: '08:00', close: '20:00' },
          thursday: { open: '08:00', close: '20:00' },
          friday: { open: '08:00', close: '21:00' },
          saturday: { open: '07:00', close: '21:00' },
          sunday: { open: '07:00', close: '19:00' }
        },
        weatherDependent: true,
        availability: [
          { id: '8', startTime: '16:00', endTime: '17:00', date: filters.date, isAvailable: true, price: 35 },
          { id: '9', startTime: '17:00', endTime: '18:00', date: filters.date, isAvailable: true, price: 35 }
        ]
      }
    ];

    // Filter courts based on criteria
    return mockCourts.filter(court => {
      // Sport filter
      if (filters.sport !== 'All' && !court.sport.includes(filters.sport)) {
        return false;
      }

      // Price filter
      if (court.price > filters.maxPrice) {
        return false;
      }

      // Indoor/Outdoor filter
      if (filters.isIndoor !== undefined && court.isIndoor !== filters.isIndoor) {
        return false;
      }

      // Check if court has availability for the requested time
      const hasAvailability = court.availability.some(slot => 
        slot.date === filters.date && 
        slot.isAvailable &&
        slot.startTime <= filters.time &&
        slot.endTime > filters.time
      );

      return hasAvailability;
    });
  };

  const calculateMatchScore = (
    court: Court,
    filters: BookingFilters,
    distance: number,
    players: User[]
  ): number => {
    let score = 0;

    // Distance score (closer is better, max 30 points)
    const maxDistance = 20; // km
    const distanceScore = Math.max(0, (maxDistance - distance) / maxDistance * 30);
    score += distanceScore;

    // Price score (cheaper is better, max 20 points)
    const priceScore = Math.max(0, (filters.maxPrice - court.price) / filters.maxPrice * 20);
    score += priceScore;

    // Rating score (higher rating is better, max 20 points)
    const ratingScore = (court.rating / 5) * 20;
    score += ratingScore;

    // Sport preference score (max 15 points)
    if (court.sport.includes(filters.sport)) {
      score += 15;
    }

    // User history score (max 10 points)
    const userHistoryScore = calculateUserHistoryScore(court, players);
    score += userHistoryScore;

    // Amenities score (max 5 points)
    const amenitiesScore = Math.min(5, court.amenities.length);
    score += amenitiesScore;

    return Math.round(score);
  };

  const calculateUserHistoryScore = (court: Court, players: User[]): number => {
    // Mock implementation - in real app, check user's booking history
    let score = 0;
    
    players.forEach(player => {
      // Check if user has played at this court before
      const hasPlayedHere = player.statistics?.courtVisits?.some(visit => visit.courtId === court.id);
      if (hasPlayedHere) {
        score += 2; // Bonus for familiar courts
      }

      // Check if court matches user's preferred sports
      const matchesPreferences = player.preferences?.gameDefaults?.preferredSports?.some(sport => 
        court.sport.includes(sport)
      );
      if (matchesPreferences) {
        score += 3;
      }
    });

    return Math.min(10, score);
  };

  const generateReasons = (
    court: Court,
    filters: BookingFilters,
    distance: number,
    players: User[]
  ): string[] => {
    const reasons: string[] = [];

    if (distance < 2) {
      reasons.push('Very close to all players');
    } else if (distance < 5) {
      reasons.push('Convenient location');
    }

    if (court.rating >= 4.5) {
      reasons.push('Highly rated by users');
    }

    if (court.price <= filters.maxPrice * 0.8) {
      reasons.push('Great value for money');
    }

    if (court.amenities.includes('Parking')) {
      reasons.push('Parking available');
    }

    if (court.amenities.includes('Equipment Rental')) {
      reasons.push('Equipment rental available');
    }

    if (!court.weatherDependent) {
      reasons.push('Indoor facility - weather independent');
    }

    // Check user history
    const hasPlayedHere = players.some(player => 
      player.statistics?.courtVisits?.some(visit => visit.courtId === court.id)
    );
    if (hasPlayedHere) {
      reasons.push('You\'ve played here before');
    }

    return reasons.slice(0, 3); // Return top 3 reasons
  };

  const getAvailableSlots = (court: Court, date: string, preferredTime: string): string[] => {
    return court.availability
      .filter(slot => slot.date === date && slot.isAvailable)
      .map(slot => `${slot.startTime}-${slot.endTime}`)
      .slice(0, 5); // Return up to 5 available slots
  };

  const bookCourt = async (
    courtId: string,
    timeSlotId: string,
    gameId?: string
  ): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      // Mock booking implementation
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In real app, this would call your backend API
      console.log('Booking court:', { courtId, timeSlotId, gameId, userId: user?.id });
      
      setLoading(false);
      return true;
    } catch (err) {
      setError('Failed to book court');
      setLoading(false);
      return false;
    }
  };

  const suggestMeetingPoint = (players: User[]): { lat: number; lng: number; name: string } => {
    const centerPoint = calculateCenterPoint(players);
    
    // In a real app, you'd use a places API to find actual meeting points
    return {
      ...centerPoint,
      name: 'Optimal meeting point'
    };
  };

  return {
    loading,
    error,
    findOptimalCourt,
    bookCourt,
    suggestMeetingPoint,
    calculateCenterPoint
  };
};