/**
 * Courts Service
 * 
 * This service handles all court-related operations including
 * fetching courts, booking, searching, and real-time updates.
 * 
 * @author Fitcha Team
 * @version 1.0.0
 */

import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  serverTimestamp,
  onSnapshot,
  Unsubscribe,
  QueryDocumentSnapshot,
  DocumentData
} from 'firebase/firestore';
import { db } from './firebase';
import { Court } from '../types';

/**
 * Interface for court search filters
 */
export interface CourtFilters {
  sport?: string;
  location?: string;
  maxDistance?: number;
  priceRange?: { min: number; max: number };
  isIndoor?: boolean;
  amenities?: string[];
  rating?: number;
  date?: string;
  time?: string;
}

/**
 * Interface for court booking data
 */
export interface BookingData {
  courtId: string;
  userId: string;
  date: string;
  startTime: string;
  endTime: string;
  duration: number;
  totalPrice: number;
  participants: string[];
  gameType: string;
  notes?: string;
}

/**
 * Interface for booking record with database fields
 */
export interface BookingRecord extends BookingData {
  id: string;
  status: 'confirmed' | 'cancelled' | 'completed' | 'pending';
  createdAt: Date;
  updatedAt: Date;
  cancelledAt?: Date;
}

/**
 * Fetch all courts with optional filters
 * 
 * @param filters - Search filters
 * @param pageSize - Number of courts per page
 * @param lastDoc - Last document for pagination
 * @returns Promise<Court[]>
 */
export const getCourts = async (
  filters: CourtFilters = {},
  pageSize: number = 20,
  lastDoc?: QueryDocumentSnapshot<DocumentData>
): Promise<{ courts: Court[]; hasMore: boolean; lastDoc: QueryDocumentSnapshot<DocumentData> | null }> => {
  try {
    let q = query(collection(db, 'courts'));

    // Apply filters
    if (filters.sport) {
      q = query(q, where('sport', 'array-contains', filters.sport));
    }

    if (filters.isIndoor !== undefined) {
      q = query(q, where('isIndoor', '==', filters.isIndoor));
    }

    if (filters.rating) {
      q = query(q, where('rating', '>=', filters.rating));
    }

    // Add ordering and pagination
    q = query(q, orderBy('rating', 'desc'), limit(pageSize));

    if (lastDoc) {
      q = query(q, startAfter(lastDoc));
    }

    const querySnapshot = await getDocs(q);
    const courts: Court[] = [];
    let newLastDoc: QueryDocumentSnapshot<DocumentData> | null = null;

    querySnapshot.forEach((doc) => {
      courts.push({
        id: doc.id,
        ...doc.data()
      } as Court);
      newLastDoc = doc;
    });

    // Apply client-side filters that can't be done in Firestore
    let filteredCourts = courts;

    if (filters.priceRange) {
      filteredCourts = filteredCourts.filter(court => 
        court.price >= filters.priceRange!.min && 
        court.price <= filters.priceRange!.max
      );
    }

    if (filters.amenities && filters.amenities.length > 0) {
      filteredCourts = filteredCourts.filter(court =>
        filters.amenities!.every(amenity => court.amenities.includes(amenity))
      );
    }

    return {
      courts: filteredCourts,
      hasMore: querySnapshot.size === pageSize,
      lastDoc: newLastDoc
    };

  } catch (error) {
    console.error('Error fetching courts:', error);
    throw new Error('Failed to fetch courts');
  }
};

/**
 * Get a single court by ID
 * 
 * @param courtId - Court ID
 * @returns Promise<Court | null>
 */
export const getCourtById = async (courtId: string): Promise<Court | null> => {
  try {
    const courtDoc = await getDoc(doc(db, 'courts', courtId));
    
    if (!courtDoc.exists()) {
      return null;
    }

    return {
      id: courtDoc.id,
      ...courtDoc.data()
    } as Court;

  } catch (error) {
    console.error('Error fetching court:', error);
    return null;
  }
};

/**
 * Create a new court
 * 
 * @param courtData - Court data
 * @param ownerId - Owner user ID
 * @returns Promise<string> - New court ID
 */
export const createCourt = async (
  courtData: Omit<Court, 'id'>,
  ownerId: string
): Promise<string> => {
  try {
    const docRef = await addDoc(collection(db, 'courts'), {
      ...courtData,
      ownerId,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });

    return docRef.id;
  } catch (error) {
    console.error('Error creating court:', error);
    throw new Error('Failed to create court');
  }
};

/**
 * Update court information
 * 
 * @param courtId - Court ID
 * @param updates - Court updates
 * @returns Promise<boolean>
 */
export const updateCourt = async (
  courtId: string,
  updates: Partial<Court>
): Promise<boolean> => {
  try {
    await updateDoc(doc(db, 'courts', courtId), {
      ...updates,
      updatedAt: serverTimestamp()
    });
    return true;
  } catch (error) {
    console.error('Error updating court:', error);
    return false;
  }
};

/**
 * Delete a court
 * 
 * @param courtId - Court ID
 * @returns Promise<boolean>
 */
export const deleteCourt = async (courtId: string): Promise<boolean> => {
  try {
    await deleteDoc(doc(db, 'courts', courtId));
    return true;
  } catch (error) {
    console.error('Error deleting court:', error);
    return false;
  }
};

/**
 * Book a court time slot
 * 
 * @param bookingData - Booking information
 * @returns Promise<string> - Booking ID
 */
export const bookCourt = async (bookingData: BookingData): Promise<string> => {
  try {
    // Create booking document
    const bookingRef = await addDoc(collection(db, 'bookings'), {
      ...bookingData,
      status: 'confirmed',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });

    // Update court availability
    await updateCourtAvailability(
      bookingData.courtId,
      bookingData.date,
      bookingData.startTime,
      bookingData.endTime,
      false
    );

    return bookingRef.id;
  } catch (error) {
    console.error('Error booking court:', error);
    throw new Error('Failed to book court');
  }
};

/**
 * Cancel a court booking
 * 
 * @param bookingId - Booking ID
 * @returns Promise<boolean>
 */
export const cancelBooking = async (bookingId: string): Promise<boolean> => {
  try {
    // Get booking details
    const bookingDoc = await getDoc(doc(db, 'bookings', bookingId));
    if (!bookingDoc.exists()) {
      throw new Error('Booking not found');
    }

    const booking = bookingDoc.data() as BookingData;

    // Update booking status
    await updateDoc(doc(db, 'bookings', bookingId), {
      status: 'cancelled',
      cancelledAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });

    // Free up the court time slot
    await updateCourtAvailability(
      booking.courtId,
      booking.date,
      booking.startTime,
      booking.endTime,
      true
    );

    return true;
  } catch (error) {
    console.error('Error cancelling booking:', error);
    return false;
  }
};

/**
 * Update court availability for a specific time slot
 * 
 * @param courtId - Court ID
 * @param date - Date
 * @param startTime - Start time
 * @param endTime - End time
 * @param isAvailable - Availability status
 * @returns Promise<boolean>
 */
const updateCourtAvailability = async (
  courtId: string,
  date: string,
  startTime: string,
  endTime: string,
  isAvailable: boolean
): Promise<boolean> => {
  try {
    // This would typically update a separate availability collection
    // For now, we'll update the court document directly
    const court = await getCourtById(courtId);
    if (!court) return false;

    // Update availability array
    const updatedAvailability = court.availability.map(slot => {
      if (slot.date === date && slot.startTime === startTime && slot.endTime === endTime) {
        return { ...slot, isAvailable };
      }
      return slot;
    });

    await updateDoc(doc(db, 'courts', courtId), {
      availability: updatedAvailability,
      updatedAt: serverTimestamp()
    });

    return true;
  } catch (error) {
    console.error('Error updating court availability:', error);
    return false;
  }
};

/**
 * Get user's bookings
 * 
 * @param userId - User ID
 * @param status - Booking status filter
 * @returns Promise<BookingRecord[]>
 */
export const getUserBookings = async (
  userId: string,
  status?: string
): Promise<BookingRecord[]> => {
  try {
    let q = query(
      collection(db, 'bookings'),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );

    if (status) {
      q = query(q, where('status', '==', status));
    }

    const querySnapshot = await getDocs(q);
    const bookings: BookingRecord[] = [];

    querySnapshot.forEach((doc) => {
      bookings.push({
        id: doc.id,
        ...doc.data()
      } as BookingRecord);
    });

    return bookings;
  } catch (error) {
    console.error('Error fetching user bookings:', error);
    return [];
  }
};

/**
 * Search courts by location and other criteria
 * 
 * @param searchQuery - Search query
 * @param filters - Additional filters
 * @returns Promise<Court[]>
 */
export const searchCourts = async (
  searchQuery: string,
  filters: CourtFilters = {}
): Promise<Court[]> => {
  try {
    // For now, we'll do a simple text search
    // In production, you might want to use Algolia or similar
    const { courts } = await getCourts(filters);

    const filteredCourts = courts.filter(court =>
      court.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      court.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      court.sport.some(sport => sport.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    return filteredCourts;
  } catch (error) {
    console.error('Error searching courts:', error);
    return [];
  }
};

/**
 * Subscribe to real-time court updates
 * 
 * @param courtId - Court ID
 * @param callback - Callback function
 * @returns Unsubscribe function
 */
export const subscribeToCourtUpdates = (
  courtId: string,
  callback: (court: Court | null) => void
): Unsubscribe => {
  return onSnapshot(
    doc(db, 'courts', courtId),
    (doc) => {
      if (doc.exists()) {
        callback({
          id: doc.id,
          ...doc.data()
        } as Court);
      } else {
        callback(null);
      }
    },
    (error) => {
      console.error('Error in court subscription:', error);
      callback(null);
    }
  );
};

/**
 * Get courts near a specific location
 * 
 * @param latitude - Latitude
 * @param longitude - Longitude
 * @param radiusKm - Search radius in kilometers
 * @returns Promise<Court[]>
 */
export const getCourtsNearLocation = async (
  latitude: number,
  longitude: number,
  radiusKm: number = 10
): Promise<Court[]> => {
  try {
    // For now, we'll fetch all courts and filter by distance
    // In production, you'd use geohash or similar for efficient geo queries
    const { courts } = await getCourts();

    const nearByCourts = courts.filter(court => {
      if (!court.coordinates) return false;
      
      const distance = calculateDistance(
        latitude,
        longitude,
        court.coordinates.lat,
        court.coordinates.lng
      );
      
      return distance <= radiusKm;
    });

    // Sort by distance
    nearByCourts.sort((a, b) => {
      const distanceA = calculateDistance(latitude, longitude, a.coordinates!.lat, a.coordinates!.lng);
      const distanceB = calculateDistance(latitude, longitude, b.coordinates!.lat, b.coordinates!.lng);
      return distanceA - distanceB;
    });

    return nearByCourts;
  } catch (error) {
    console.error('Error fetching nearby courts:', error);
    return [];
  }
};

/**
 * Calculate distance between two coordinates using Haversine formula
 * 
 * @param lat1 - Latitude 1
 * @param lon1 - Longitude 1
 * @param lat2 - Latitude 2
 * @param lon2 - Longitude 2
 * @returns Distance in kilometers
 */
const calculateDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number => {
  const R = 6371; // Earth's radius in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};