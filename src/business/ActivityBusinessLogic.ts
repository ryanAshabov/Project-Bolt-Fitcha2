/**
 * Business Logic Layer - Activity Management
 * 
 * This module contains all business logic related to activity management,
 * separated from UI components to ensure clean architecture.
 * 
 * @author Fitcha Team
 * @version 1.0.0
 */

import { ActivitySession, User } from '../types';
import { activityService } from '../services/activities';

/**
 * Activity Business Logic Handler
 * Contains all business rules and validation for activities
 */
export class ActivityBusinessLogic {
  
  /**
   * Validate activity creation data
   * @param activityData - Raw activity data from form
   * @returns Validation result with errors if any
   */
  static validateActivityCreation(activityData: Partial<ActivitySession>) {
    const errors: string[] = [];
    
    if (!activityData.name || activityData.name.trim().length < 3) {
      errors.push('Activity name must be at least 3 characters long');
    }
    
    if (!activityData.type) {
      errors.push('Activity type is required');
    }
    
    if (!activityData.datetime) {
      errors.push('Date and time are required');
    } else {
      const activityDate = new Date(activityData.datetime);
      const now = new Date();
      
      if (activityDate <= now) {
        errors.push('Activity date must be in the future');
      }
      
      if (activityDate.getTime() - now.getTime() > 30 * 24 * 60 * 60 * 1000) {
        errors.push('Activity date cannot be more than 30 days in the future');
      }
    }
    
    if (!activityData.maxParticipants || activityData.maxParticipants < 2) {
      errors.push('Activity must allow at least 2 participants');
    }
    
    if (activityData.maxParticipants && activityData.maxParticipants > 100) {
      errors.push('Activity cannot have more than 100 participants');
    }
    
    if (!activityData.location || activityData.location.trim().length < 5) {
      errors.push('Location must be at least 5 characters long');
    }
    
    return {
      isValid: errors.length === 0,
      errors,
    };
  }
  
  /**
   * Calculate activity pricing based on various factors
   * @param activityData - Activity information
   * @param creatorLevel - Creator's level (beginner, intermediate, pro)
   * @returns Calculated pricing information
   */
  static calculateActivityPricing(
    activityData: Partial<ActivitySession>,
    creatorLevel: string
  ) {
    let basePrice = 0;
    
    // Base pricing by activity type
    const typePricing = {
      sports: 15,
      wellness: 20,
      gaming: 10,
      outdoor: 25,
      social: 5,
      fitness: 18,
    };
    
    basePrice = typePricing[activityData.type as keyof typeof typePricing] || 10;
    
    // Creator level multiplier
    const levelMultipliers = {
      beginner: 1.0,
      intermediate: 1.2,
      advanced: 1.5,
      pro: 2.0,
    };
    
    const multiplier = levelMultipliers[creatorLevel as keyof typeof levelMultipliers] || 1.0;
    
    // Duration factor
    const duration = activityData.duration || 60;
    const durationFactor = Math.max(0.5, duration / 60);
    
    const finalPrice = Math.round(basePrice * multiplier * durationFactor);
    
    return {
      basePrice,
      creatorLevelMultiplier: multiplier,
      durationFactor,
      finalPrice,
      currency: 'USD',
    };
  }
  
  /**
   * Check if user can join an activity
   * @param activity - Activity to join
   * @param user - User attempting to join
   * @returns Eligibility result
   */
  static canUserJoinActivity(activity: ActivitySession, user: User) {
    const issues: string[] = [];
    
    // Check if activity is full
    if (activity.currentParticipants.length >= activity.maxParticipants) {
      issues.push('Activity is full');
    }
    
    // Check if user is already participating
    if (activity.currentParticipants.some(p => p.id === user.id)) {
      issues.push('You are already participating in this activity');
    }
    
    // Check if user is the creator
    if (activity.creatorId === user.id) {
      issues.push('You cannot join your own activity');
    }
    
    // Check skill level compatibility (for sports activities)
    if (activity.type === 'sports' && activity.category && user.skillLevel) {
      const skillLevels = ['beginner', 'intermediate', 'advanced', 'pro'];
      const userSkillIndex = skillLevels.indexOf(user.skillLevel);
      const activitySkillIndex = skillLevels.indexOf(activity.skillLevel || 'beginner');
      
      // Allow joining if skill levels are within 1 level of each other
      if (Math.abs(userSkillIndex - activitySkillIndex) > 1) {
        issues.push('Skill level mismatch - this activity may not be suitable for your level');
      }
    }
    
    // Check if activity is in the past
    const activityDate = new Date(activity.datetime);
    if (activityDate <= new Date()) {
      issues.push('Cannot join past activities');
    }
    
    // Check payment requirement
    if (activity.isPaid && activity.pricePerPerson) {
      // In real app, check if user has valid payment method
      // For now, just add info message
      issues.push(`This activity requires payment of $${activity.pricePerPerson}`);
    }
    
    return {
      canJoin: issues.length === 0,
      issues,
      requiresPayment: activity.isPaid,
      paymentAmount: activity.pricePerPerson,
    };
  }
  
  /**
   * Generate activity recommendations for a user
   * @param user - User to generate recommendations for
   * @param allActivities - All available activities
   * @returns Recommended activities with scores
   */
  static generateActivityRecommendations(
    user: User,
    allActivities: ActivitySession[]
  ) {
    const recommendations = allActivities
      .filter(activity => {
        // Filter out past activities and user's own activities
        const activityDate = new Date(activity.datetime);
        return activityDate > new Date() && activity.creatorId !== user.id;
      })
      .map(activity => {
        let score = 0;
        
        // Score based on user's sports interests
        if (user.sports.includes(activity.category)) {
          score += 30;
        }
        
        // Score based on skill level compatibility
        const skillLevels = ['beginner', 'intermediate', 'advanced', 'pro'];
        const userSkillIndex = skillLevels.indexOf(user.skillLevel);
        const activitySkillIndex = skillLevels.indexOf(activity.skillLevel || 'beginner');
        
        if (Math.abs(userSkillIndex - activitySkillIndex) <= 1) {
          score += 20;
        }
        
        // Score based on location proximity (simplified)
        if (activity.location.toLowerCase().includes(user.location.toLowerCase())) {
          score += 25;
        }
        
        // Score based on activity type preference
        const typePreferences = {
          sports: user.sports.length > 0 ? 15 : 5,
          fitness: user.sports.includes('gym') || user.sports.includes('fitness') ? 15 : 5,
          wellness: 10,
          social: 12,
          gaming: 8,
          outdoor: 10,
        };
        
        score += typePreferences[activity.type as keyof typeof typePreferences] || 5;
        
        // Bonus for activities with available spots
        const spotsLeft = activity.maxParticipants - activity.currentParticipants.length;
        if (spotsLeft > 1) {
          score += 5;
        }
        
        return {
          activity,
          score,
          reasons: this.getRecommendationReasons(activity, user, score),
        };
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, 10); // Top 10 recommendations
    
    return recommendations;
  }
  
  /**
   * Get explanation for why activity was recommended
   * @private
   */
  private static getRecommendationReasons(
    activity: ActivitySession,
    user: User,
    score: number
  ): string[] {
    const reasons: string[] = [];
    
    if (user.sports.includes(activity.category)) {
      reasons.push(`Matches your interest in ${activity.category}`);
    }
    
    if (activity.location.toLowerCase().includes(user.location.toLowerCase())) {
      reasons.push('Near your location');
    }
    
    const skillLevels = ['beginner', 'intermediate', 'advanced', 'pro'];
    const userSkillIndex = skillLevels.indexOf(user.skillLevel);
    const activitySkillIndex = skillLevels.indexOf(activity.skillLevel || 'beginner');
    
    if (Math.abs(userSkillIndex - activitySkillIndex) <= 1) {
      reasons.push('Suitable for your skill level');
    }
    
    if (score > 50) {
      reasons.push('Highly recommended for you');
    }
    
    return reasons;
  }
  
  /**
   * Process activity completion and update user statistics
   * @param activity - Completed activity
   * @param participants - List of participants with their performance
   */
  static async processActivityCompletion(
    activity: ActivitySession,
    participants: Array<{ user: User; attended: boolean; rating?: number }>
  ) {
    try {
      // Update activity status
      await activityService.updateActivity(activity.id, {
        status: 'completed',
        completedAt: new Date().toISOString(),
      });
      
      // Process each participant
      for (const participant of participants) {
        if (participant.attended) {
          // Update user statistics
          const updatedStats = {
            gamesPlayed: (participant.user.statistics.gamesPlayed || 0) + 1,
            totalHours: (participant.user.statistics.totalHours || 0) + (activity.duration / 60),
            // Add other statistics updates
          };
          
          // In real app, update user document in Firestore
          console.log(`Updated stats for user ${participant.user.id}:`, updatedStats);
        }
      }
      
      return { success: true };
    } catch (error) {
      console.error('Error processing activity completion:', error);
      return { success: false, error: 'Failed to process activity completion' };
    }
  }
}
