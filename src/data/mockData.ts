import { User, Post, Conversation, Court, Badge, MatchInvite, Achievement } from '../types';

export const mockBadges: Badge[] = [
  {
    id: '1',
    name: 'Top Rated',
    icon: '⭐',
    color: 'text-yellow-500',
    description: 'Consistently rated 4.5+ stars',
    rarity: 'rare'
  },
  {
    id: '2',
    name: 'Booking Pro',
    icon: '🏆',
    color: 'text-blue-500',
    description: 'Completed 50+ bookings',
    rarity: 'epic'
  },
  {
    id: '3',
    name: 'Team Player',
    icon: '🤝',
    color: 'text-emerald-500',
    description: 'Excellent teamwork rating',
    rarity: 'rare'
  },
  {
    id: '4',
    name: 'Early Bird',
    icon: '🌅',
    color: 'text-orange-500',
    description: 'Prefers morning sessions',
    rarity: 'common'
  }
];

export const mockAchievements: Achievement[] = [
  {
    id: 'first-game',
    name: 'First Game',
    description: 'Complete your first game',
    icon: '🎯',
    progress: 1,
    target: 1,
    completed: true,
    unlockedAt: new Date('2024-01-15'),
    category: 'games',
    rarity: 'common'
  },
  {
    id: 'team-player',
    name: 'Team Player',
    description: 'Play with 10 different partners',
    icon: '🤝',
    progress: 10,
    target: 10,
    completed: true,
    unlockedAt: new Date('2024-12-01'),
    category: 'social',
    rarity: 'rare'
  },
  {
    id: 'court-explorer',
    name: 'Court Explorer',
    description: 'Play at 5 different courts',
    icon: '🗺️',
    progress: 3,
    target: 5,
    completed: false,
    category: 'exploration',
    rarity: 'epic'
  },
  {
    id: 'consistency-king',
    name: 'Consistency King',
    description: 'Play games for 30 consecutive days',
    icon: '👑',
    progress: 15,
    target: 30,
    completed: false,
    category: 'consistency',
    rarity: 'legendary'
  }
];

// Celebrity Users - Global Sports Stars
export const celebrityUsers: User[] = [
  {
    id: 'messi-10',
    firstName: 'Lionel',
    lastName: 'Messi',
    email: 'messi@fitcha.com',
    avatar: 'https://images.pexels.com/photos/3621104/pexels-photo-3621104.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
    headline: '🐐 8x Ballon d\'Or Winner | Inter Miami CF | Football Legend',
    location: 'Miami, Florida',
    coordinates: { lat: 25.7617, lng: -80.1918 },
    connections: 45000000,
    isOnline: true,
    verified: true,
    isPro: true,
    sports: ['Football', 'Padel', 'Tennis'],
    skillLevel: 'Professional',
    rating: 5.0,
    gamesPlayed: 1200,
    winRate: 95,
    badges: [
      { id: 'goat', name: 'GOAT', icon: '🐐', color: 'text-yellow-500', description: 'Greatest of All Time', rarity: 'legendary' },
      { id: 'world-cup', name: 'World Cup Winner', icon: '🏆', color: 'text-gold-500', description: 'FIFA World Cup Champion', rarity: 'legendary' },
      { id: 'ballon-dor', name: '8x Ballon d\'Or', icon: '⚽', color: 'text-yellow-500', description: 'Eight-time Ballon d\'Or winner', rarity: 'legendary' }
    ],
    availability: ['Evening', 'Weekend'],
    trustScore: 100,
    achievements: mockAchievements.filter(a => a.completed),
    preferences: {
      theme: 'light',
      notifications: {
        gameInvites: true,
        gameReminders: true,
        chatMessages: false,
        achievements: true,
        weatherAlerts: false,
        pushNotifications: true,
        emailNotifications: false
      },
      privacy: {
        showLocation: true,
        showOnlineStatus: true,
        allowGameInvites: 'connections',
        showStatistics: true
      },
      gameDefaults: {
        preferredSports: ['Football', 'Padel'],
        skillLevel: 'Professional',
        maxDistance: 50,
        preferredTimes: ['Evening'],
        paymentPreference: 'both'
      }
    },
    socialLinks: {
      instagram: '@leomessi',
      twitter: '@TeamMessi'
    },
    statistics: {
      totalGames: 1200,
      totalWins: 1140,
      totalLosses: 60,
      averageRating: 5.0,
      favoriteTime: '6-8 PM',
      favoriteSport: 'Football',
      mostPlayedWith: ['neymar-jr', 'suarez-9'],
      monthlyGames: [
        { month: 'Jan', count: 25 },
        { month: 'Feb', count: 28 },
        { month: 'Mar', count: 30 }
      ],
      courtVisits: [
        { courtId: '1', visits: 45 },
        { courtId: '2', visits: 32 }
      ]
    }
  },
  {
    id: 'cristiano-7',
    firstName: 'Cristiano',
    lastName: 'Ronaldo',
    email: 'cr7@fitcha.com',
    avatar: 'https://images.pexels.com/photos/1884574/pexels-photo-1884574.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
    headline: '👑 5x Ballon d\'Or | Al Nassr FC | CR7 Brand | SIUUUU!',
    location: 'Riyadh, Saudi Arabia',
    coordinates: { lat: 24.7136, lng: 46.6753 },
    connections: 50000000,
    isOnline: false,
    verified: true,
    isPro: true,
    sports: ['Football', 'Boxing', 'Swimming'],
    skillLevel: 'Professional',
    rating: 5.0,
    gamesPlayed: 1150,
    winRate: 94,
    badges: [
      { id: 'mr-champions', name: 'Mr. Champions League', icon: '🏆', color: 'text-blue-500', description: '5x Champions League Winner', rarity: 'legendary' },
      { id: 'euro-champion', name: 'Euro Champion', icon: '🇵🇹', color: 'text-green-500', description: 'European Championship Winner', rarity: 'legendary' }
    ],
    availability: ['Morning', 'Evening'],
    trustScore: 100,
    achievements: mockAchievements.filter(a => a.completed),
    preferences: {
      theme: 'dark',
      notifications: {
        gameInvites: true,
        gameReminders: true,
        chatMessages: false,
        achievements: true,
        weatherAlerts: false,
        pushNotifications: true,
        emailNotifications: false
      },
      privacy: {
        showLocation: true,
        showOnlineStatus: true,
        allowGameInvites: 'connections',
        showStatistics: true
      },
      gameDefaults: {
        preferredSports: ['Football'],
        skillLevel: 'Professional',
        maxDistance: 30,
        preferredTimes: ['Morning'],
        paymentPreference: 'both'
      }
    },
    socialLinks: {
      instagram: '@cristiano',
      twitter: '@Cristiano'
    },
    statistics: {
      totalGames: 1150,
      totalWins: 1081,
      totalLosses: 69,
      averageRating: 5.0,
      favoriteTime: '8-10 AM',
      favoriteSport: 'Football',
      mostPlayedWith: ['benzema-9', 'modric-10'],
      monthlyGames: [
        { month: 'Jan', count: 22 },
        { month: 'Feb', count: 26 },
        { month: 'Mar', count: 28 }
      ],
      courtVisits: [
        { courtId: '3', visits: 38 },
        { courtId: '1', visits: 25 }
      ]
    }
  },
  {
    id: 'serena-williams',
    firstName: 'Serena',
    lastName: 'Williams',
    email: 'serena@fitcha.com',
    avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
    headline: '🎾 23x Grand Slam Champion | Tennis Legend | Entrepreneur',
    location: 'Los Angeles, California',
    coordinates: { lat: 34.0522, lng: -118.2437 },
    connections: 15000000,
    isOnline: true,
    verified: true,
    isPro: true,
    sports: ['Tennis', 'Golf', 'Yoga'],
    skillLevel: 'Professional',
    rating: 5.0,
    gamesPlayed: 890,
    winRate: 92,
    badges: [
      { id: 'grand-slam-queen', name: 'Grand Slam Queen', icon: '👑', color: 'text-purple-500', description: '23 Grand Slam Singles Titles', rarity: 'legendary' },
      { id: 'olympic-gold', name: 'Olympic Champion', icon: '🥇', color: 'text-yellow-500', description: '4x Olympic Gold Medalist', rarity: 'legendary' }
    ],
    availability: ['Morning', 'Afternoon'],
    trustScore: 100,
    achievements: mockAchievements.filter(a => a.completed),
    preferences: {
      theme: 'light',
      notifications: {
        gameInvites: true,
        gameReminders: true,
        chatMessages: true,
        achievements: true,
        weatherAlerts: true,
        pushNotifications: true,
        emailNotifications: true
      },
      privacy: {
        showLocation: true,
        showOnlineStatus: true,
        allowGameInvites: 'connections',
        showStatistics: true
      },
      gameDefaults: {
        preferredSports: ['Tennis'],
        skillLevel: 'Professional',
        maxDistance: 25,
        preferredTimes: ['Morning'],
        paymentPreference: 'both'
      }
    },
    socialLinks: {
      instagram: '@serenawilliams',
      twitter: '@SerenaWilliams'
    },
    statistics: {
      totalGames: 890,
      totalWins: 819,
      totalLosses: 71,
      averageRating: 5.0,
      favoriteTime: '9-11 AM',
      favoriteSport: 'Tennis',
      mostPlayedWith: ['venus-williams', 'sharapova'],
      monthlyGames: [
        { month: 'Jan', count: 18 },
        { month: 'Feb', count: 20 },
        { month: 'Mar', count: 22 }
      ],
      courtVisits: [
        { courtId: '2', visits: 55 },
        { courtId: '1', visits: 12 }
      ]
    }
  }
];

// Sports Media Organizations
export const sportsMediaUsers: User[] = [
  {
    id: 'espn-official',
    firstName: 'ESPN',
    lastName: 'Sports',
    email: 'social@espn.com',
    avatar: 'https://images.pexels.com/photos/1884574/pexels-photo-1884574.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
    headline: '📺 The Worldwide Leader in Sports | Breaking News & Analysis',
    location: 'Bristol, Connecticut',
    coordinates: { lat: 41.7658, lng: -72.6734 },
    connections: 25000000,
    isOnline: true,
    verified: true,
    isPro: true,
    sports: ['All Sports'],
    skillLevel: 'Professional',
    rating: 4.9,
    gamesPlayed: 0,
    winRate: 0,
    badges: [
      { id: 'media-giant', name: 'Media Giant', icon: '📺', color: 'text-red-500', description: 'Leading Sports Network', rarity: 'legendary' },
      { id: 'breaking-news', name: 'Breaking News', icon: '⚡', color: 'text-yellow-500', description: 'First to Report', rarity: 'epic' }
    ],
    availability: ['24/7'],
    trustScore: 98,
    achievements: [],
    preferences: {
      theme: 'light',
      notifications: {
        gameInvites: false,
        gameReminders: false,
        chatMessages: true,
        achievements: false,
        weatherAlerts: false,
        pushNotifications: true,
        emailNotifications: true
      },
      privacy: {
        showLocation: true,
        showOnlineStatus: true,
        allowGameInvites: 'none',
        showStatistics: false
      },
      gameDefaults: {
        preferredSports: ['All Sports'],
        skillLevel: 'Professional',
        maxDistance: 0,
        preferredTimes: ['24/7'],
        paymentPreference: 'free'
      }
    },
    socialLinks: {
      instagram: '@espn',
      twitter: '@espn'
    },
    statistics: {
      totalGames: 0,
      totalWins: 0,
      totalLosses: 0,
      averageRating: 4.9,
      favoriteTime: '24/7',
      favoriteSport: 'All Sports',
      mostPlayedWith: [],
      monthlyGames: [],
      courtVisits: []
    }
  },
  {
    id: 'bein-sports',
    firstName: 'beIN',
    lastName: 'SPORTS',
    email: 'digital@beinsports.com',
    avatar: 'https://images.pexels.com/photos/3621104/pexels-photo-3621104.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
    headline: '🌍 Global Sports Network | Live Sports & Exclusive Content',
    location: 'Doha, Qatar',
    coordinates: { lat: 25.2854, lng: 51.5310 },
    connections: 12000000,
    isOnline: true,
    verified: true,
    isPro: true,
    sports: ['Football', 'Tennis', 'Basketball'],
    skillLevel: 'Professional',
    rating: 4.8,
    gamesPlayed: 0,
    winRate: 0,
    badges: [
      { id: 'middle-east-leader', name: 'MENA Sports Leader', icon: '🌍', color: 'text-green-500', description: 'Leading Sports Network in MENA', rarity: 'epic' },
      { id: 'exclusive-content', name: 'Exclusive Content', icon: '🎬', color: 'text-purple-500', description: 'Premium Sports Coverage', rarity: 'rare' }
    ],
    availability: ['24/7'],
    trustScore: 96,
    achievements: [],
    preferences: {
      theme: 'dark',
      notifications: {
        gameInvites: false,
        gameReminders: false,
        chatMessages: true,
        achievements: false,
        weatherAlerts: false,
        pushNotifications: true,
        emailNotifications: true
      },
      privacy: {
        showLocation: true,
        showOnlineStatus: true,
        allowGameInvites: 'none',
        showStatistics: false
      },
      gameDefaults: {
        preferredSports: ['Football'],
        skillLevel: 'Professional',
        maxDistance: 0,
        preferredTimes: ['24/7'],
        paymentPreference: 'free'
      }
    },
    socialLinks: {
      instagram: '@beinsports_en',
      twitter: '@beINSPORTS_EN'
    },
    statistics: {
      totalGames: 0,
      totalWins: 0,
      totalLosses: 0,
      averageRating: 4.8,
      favoriteTime: '24/7',
      favoriteSport: 'Football',
      mostPlayedWith: [],
      monthlyGames: [],
      courtVisits: []
    }
  }
];

// Combine all users
export const mockUsers: User[] = [
  {
    id: '1',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
    headline: 'Basketball Enthusiast & Fitness Coach',
    location: 'San Francisco, CA',
    coordinates: { lat: 37.7749, lng: -122.4194 },
    connections: 547,
    isOnline: true,
    verified: true,
    isPro: true,
    sports: ['Basketball', 'Tennis', 'Swimming'],
    skillLevel: 'Advanced',
    rating: 4.8,
    gamesPlayed: 127,
    winRate: 73,
    badges: [mockBadges[0], mockBadges[1], mockBadges[2]],
    availability: ['Morning', 'Evening'],
    trustScore: 95,
    achievements: mockAchievements.filter(a => a.completed),
    preferences: {
      theme: 'light',
      notifications: {
        gameInvites: true,
        gameReminders: true,
        chatMessages: true,
        achievements: true,
        weatherAlerts: true,
        pushNotifications: true,
        emailNotifications: false
      },
      privacy: {
        showLocation: true,
        showOnlineStatus: true,
        allowGameInvites: 'everyone',
        showStatistics: true
      },
      gameDefaults: {
        preferredSports: ['Basketball', 'Tennis'],
        skillLevel: 'Advanced',
        maxDistance: 10,
        preferredTimes: ['Evening'],
        paymentPreference: 'both'
      }
    },
    socialLinks: {
      instagram: '@john_sports',
      twitter: '@john_doe_sports'
    },
    statistics: {
      totalGames: 127,
      totalWins: 93,
      totalLosses: 34,
      averageRating: 4.8,
      favoriteTime: '6-8 PM',
      favoriteSport: 'Basketball',
      mostPlayedWith: ['sarah-id', 'michael-id'],
      monthlyGames: [
        { month: 'Jan', count: 12 },
        { month: 'Feb', count: 15 },
        { month: 'Mar', count: 18 }
      ],
      courtVisits: [
        { courtId: '1', visits: 25 },
        { courtId: '2', visits: 18 }
      ]
    }
  },
  ...celebrityUsers,
  ...sportsMediaUsers,
  {
    id: '2',
    firstName: 'Sarah',
    lastName: 'Johnson',
    email: 'sarah.j@example.com',
    avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
    headline: 'Tennis Pro & Personal Trainer',
    location: 'New York, NY',
    coordinates: { lat: 40.7128, lng: -74.0060 },
    connections: 432,
    isOnline: true,
    verified: true,
    isPro: true,
    sports: ['Tennis', 'Badminton', 'Yoga'],
    skillLevel: 'Professional',
    rating: 4.9,
    gamesPlayed: 203,
    winRate: 85,
    badges: [mockBadges[0], mockBadges[1]],
    availability: ['Afternoon', 'Evening'],
    trustScore: 98,
    achievements: mockAchievements.filter(a => a.completed),
    preferences: {
      theme: 'light',
      notifications: {
        gameInvites: true,
        gameReminders: true,
        chatMessages: true,
        achievements: true,
        weatherAlerts: true,
        pushNotifications: true,
        emailNotifications: true
      },
      privacy: {
        showLocation: true,
        showOnlineStatus: true,
        allowGameInvites: 'connections',
        showStatistics: true
      },
      gameDefaults: {
        preferredSports: ['Tennis'],
        skillLevel: 'Professional',
        maxDistance: 15,
        preferredTimes: ['Afternoon'],
        paymentPreference: 'paid'
      }
    },
    statistics: {
      totalGames: 203,
      totalWins: 173,
      totalLosses: 30,
      averageRating: 4.9,
      favoriteTime: '2-4 PM',
      favoriteSport: 'Tennis',
      mostPlayedWith: ['john-id', 'emma-id'],
      monthlyGames: [
        { month: 'Jan', count: 18 },
        { month: 'Feb', count: 22 },
        { month: 'Mar', count: 25 }
      ],
      courtVisits: [
        { courtId: '2', visits: 45 },
        { courtId: '1', visits: 12 }
      ]
    }
  },
  {
    id: '3',
    firstName: 'Michael',
    lastName: 'Chen',
    email: 'michael.chen@example.com',
    avatar: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
    headline: 'Soccer Player & Weekend Warrior',
    location: 'Seattle, WA',
    coordinates: { lat: 47.6062, lng: -122.3321 },
    connections: 298,
    isOnline: false,
    verified: false,
    isPro: false,
    sports: ['Soccer', 'Basketball', 'Running'],
    skillLevel: 'Intermediate',
    rating: 4.3,
    gamesPlayed: 89,
    winRate: 62,
    badges: [mockBadges[2], mockBadges[3]],
    availability: ['Weekend', 'Evening'],
    trustScore: 82,
    achievements: mockAchievements.slice(0, 2),
    preferences: {
      theme: 'dark',
      notifications: {
        gameInvites: true,
        gameReminders: true,
        chatMessages: false,
        achievements: true,
        weatherAlerts: false,
        pushNotifications: true,
        emailNotifications: false
      },
      privacy: {
        showLocation: false,
        showOnlineStatus: false,
        allowGameInvites: 'everyone',
        showStatistics: false
      },
      gameDefaults: {
        preferredSports: ['Soccer', 'Basketball'],
        skillLevel: 'Intermediate',
        maxDistance: 5,
        preferredTimes: ['Weekend'],
        paymentPreference: 'free'
      }
    },
    statistics: {
      totalGames: 89,
      totalWins: 55,
      totalLosses: 34,
      averageRating: 4.3,
      favoriteTime: 'Weekend',
      favoriteSport: 'Soccer',
      mostPlayedWith: ['john-id'],
      monthlyGames: [
        { month: 'Jan', count: 8 },
        { month: 'Feb', count: 12 },
        { month: 'Mar', count: 15 }
      ],
      courtVisits: [
        { courtId: '3', visits: 35 },
        { courtId: '1', visits: 8 }
      ]
    }
  },
  {
    id: '4',
    firstName: 'Emma',
    lastName: 'Davis',
    email: 'emma.davis@example.com',
    avatar: 'https://images.pexels.com/photos/1036623/pexels-photo-1036623.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
    headline: 'Volleyball Captain & Fitness Enthusiast',
    location: 'Austin, TX',
    coordinates: { lat: 30.2672, lng: -97.7431 },
    connections: 651,
    isOnline: true,
    verified: true,
    isPro: false,
    sports: ['Volleyball', 'Swimming', 'CrossFit'],
    skillLevel: 'Advanced',
    rating: 4.7,
    gamesPlayed: 156,
    winRate: 78,
    badges: [mockBadges[0], mockBadges[2]],
    availability: ['Morning', 'Afternoon'],
    trustScore: 91,
    achievements: mockAchievements.filter(a => a.completed),
    preferences: {
      theme: 'light',
      notifications: {
        gameInvites: true,
        gameReminders: true,
        chatMessages: true,
        achievements: true,
        weatherAlerts: true,
        pushNotifications: true,
        emailNotifications: true
      },
      privacy: {
        showLocation: true,
        showOnlineStatus: true,
        allowGameInvites: 'everyone',
        showStatistics: true
      },
      gameDefaults: {
        preferredSports: ['Volleyball'],
        skillLevel: 'Advanced',
        maxDistance: 8,
        preferredTimes: ['Morning'],
        paymentPreference: 'both'
      }
    },
    statistics: {
      totalGames: 156,
      totalWins: 122,
      totalLosses: 34,
      averageRating: 4.7,
      favoriteTime: '8-10 AM',
      favoriteSport: 'Volleyball',
      mostPlayedWith: ['sarah-id'],
      monthlyGames: [
        { month: 'Jan', count: 14 },
        { month: 'Feb', count: 16 },
        { month: 'Mar', count: 20 }
      ],
      courtVisits: [
        { courtId: '1', visits: 28 },
        { courtId: '3', visits: 15 }
      ]
    }
  }
];

export const mockCourts: Court[] = [
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
    images: [
      'https://images.pexels.com/photos/1752757/pexels-photo-1752757.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&dpr=2',
      'https://images.pexels.com/photos/1544966/pexels-photo-1544966.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&dpr=2'
    ],
    amenities: ['Parking', 'Restrooms', 'Water Fountain', 'Lighting', 'Scoreboard'],
    isIndoor: false,
    description: 'Premium outdoor basketball courts with professional lighting and excellent maintenance.',
    rules: ['No glass containers', 'Proper athletic wear required', 'Maximum 2 hours per booking'],
    contactInfo: {
      phone: '+1 (555) 123-4567',
      email: 'info@goldengatebasketball.com'
    },
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
      { id: '1', startTime: '09:00', endTime: '10:00', date: '2025-01-15', isAvailable: true, price: 25 },
      { id: '2', startTime: '10:00', endTime: '11:00', date: '2025-01-15', isAvailable: false, price: 25 },
      { id: '3', startTime: '11:00', endTime: '12:00', date: '2025-01-15', isAvailable: true, price: 25 }
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
    amenities: ['Pro Shop', 'Locker Rooms', 'Coaching', 'Equipment Rental', 'Café', 'Air Conditioning'],
    isIndoor: true,
    description: 'State-of-the-art indoor tennis facility with professional courts and coaching services.',
    rules: ['Tennis attire required', 'Non-marking shoes only', 'Advanced booking required'],
    contactInfo: {
      phone: '+1 (555) 987-6543',
      email: 'bookings@elitetenniscenter.com',
      website: 'www.elitetenniscenter.com'
    },
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
      { id: '4', startTime: '14:00', endTime: '15:00', date: '2025-01-15', isAvailable: true, price: 40 },
      { id: '5', startTime: '15:00', endTime: '16:00', date: '2025-01-15', isAvailable: true, price: 40 }
    ]
  },
  {
    id: '3',
    name: 'Community Soccer Fields',
    sport: ['Soccer', 'Football'],
    location: 'Mission District',
    address: '890 Soccer Way, San Francisco, CA',
    coordinates: { lat: 37.7599, lng: -122.4148 },
    price: 35,
    rating: 4.5,
    reviews: 203,
    image: 'https://images.pexels.com/photos/274506/pexels-photo-274506.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&dpr=2',
    amenities: ['Parking', 'Restrooms', 'Seating', 'Scoreboard', 'Changing Rooms'],
    isIndoor: false,
    description: 'Well-maintained community soccer fields perfect for recreational and competitive play.',
    rules: ['Cleats required', 'No pets allowed', 'Respect field conditions'],
    contactInfo: {
      phone: '+1 (555) 456-7890'
    },
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
      { id: '6', startTime: '18:00', endTime: '19:00', date: '2025-01-15', isAvailable: true, price: 35 }
    ]
  }
];

// Celebrity and Media Posts
export const celebrityPosts: Post[] = [
  {
    id: 'messi-post-1',
    author: mockUsers.find(u => u.id === 'messi-10')!,
    content: "Just finished an amazing training session! 🔥 The passion for football never fades. Who wants to join me for a friendly match this weekend? #NeverStopDreaming #Football #Miami",
    image: 'https://images.pexels.com/photos/1752757/pexels-photo-1752757.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&dpr=2',
    timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000),
    likes: 2500000,
    comments: 45000,
    shares: 180000,
    isLiked: false,
    type: 'training',
    location: 'Inter Miami Training Facility',
    tags: ['football', 'training', 'miami', 'intermami']
  },
  {
    id: 'espn-share-messi',
    author: mockUsers.find(u => u.id === 'espn-official')!,
    content: "🚨 BREAKING: Lionel Messi just posted on Fitcha about his training session! The GOAT is using the same platform as everyday athletes. This is the future of sports social networking! 🐐⚽\n\n#Messi #Fitcha #SportsNews #Football",
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    likes: 125000,
    comments: 8500,
    shares: 25000,
    isLiked: false,
    type: 'text',
    tags: ['messi', 'breaking-news', 'fitcha', 'sports-tech']
  },
  {
    id: 'cristiano-post-1',
    author: mockUsers.find(u => u.id === 'cristiano-7')!,
    content: "SIUUUU! 💪 Another incredible workout completed. The dedication never stops, whether you're a professional or just starting your journey. Keep pushing your limits! #WorkHard #CR7 #AlNassr",
    image: 'https://images.pexels.com/photos/1884574/pexels-photo-1884574.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&dpr=2',
    timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
    likes: 2200000,
    comments: 38000,
    shares: 150000,
    isLiked: false,
    type: 'training',
    location: 'Al Nassr Training Center, Riyadh',
    tags: ['cr7', 'training', 'alnassr', 'riyadh']
  },
  {
    id: 'bein-sports-share',
    author: mockUsers.find(u => u.id === 'bein-sports')!,
    content: "🌟 The biggest stars in sports are joining Fitcha! From Messi to Cristiano, athletes worldwide are connecting on this revolutionary platform. \n\nThe future of sports social networking is here! 🚀\n\n#Fitcha #SportsRevolution #GlobalSports #beINSPORTS",
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
    likes: 85000,
    comments: 5200,
    shares: 18000,
    isLiked: false,
    type: 'text',
    tags: ['fitcha', 'sports-revolution', 'global-sports']
  },
  {
    id: 'serena-post-1',
    author: mockUsers.find(u => u.id === 'serena-williams')!,
    content: "Tennis practice never gets old! 🎾 Love connecting with fellow athletes on Fitcha. The community here is incredible - from beginners to pros, we're all united by our love for sports! #Tennis #Community #WomenInSports",
    image: 'https://images.pexels.com/photos/209977/pexels-photo-209977.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&dpr=2',
    timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000),
    likes: 890000,
    comments: 15000,
    shares: 45000,
    isLiked: false,
    type: 'training',
    location: 'Los Angeles Tennis Club',
    tags: ['tennis', 'community', 'women-in-sports']
  }
];

export const mockPosts: Post[] = [
  ...celebrityPosts,
  {
    id: '1',
    author: mockUsers[0],
    content: "Just finished an amazing basketball session! 🏀 The new shooting technique is really paying off. Looking forward to the tournament next week!",
    image: 'https://images.pexels.com/photos/1752757/pexels-photo-1752757.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&dpr=2',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    likes: 47,
    comments: 12,
    shares: 8,
    isLiked: true,
    type: 'training',
    location: 'Golden Gate Basketball Courts',
    tags: ['basketball', 'training', 'improvement']
  },
  {
    id: '2',
    author: mockUsers[1],
    content: "Great match today! 🎾 The weather was perfect and my opponent was really challenging. Love these competitive games!",
    timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000),
    likes: 23,
    comments: 6,
    shares: 3,
    isLiked: false,
    type: 'match_result',
    matchData: {
      sport: 'Tennis',
      score: '6-4, 6-2',
      opponent: 'Alex Rodriguez',
      court: 'Elite Tennis Center',
      duration: 90,
      weather: 'Sunny, 22°C',
      mvp: 'Sarah Johnson',
      highlights: ['Great backhand winners', 'Consistent serving']
    },
    location: 'Elite Tennis Center',
    tags: ['tennis', 'match', 'victory']
  },
  {
    id: '3',
    author: mockUsers[2],
    content: "Achieved my personal best in the 5K run today! 🏃‍♂️ Training consistency is key. Who wants to join me for a run this weekend?",
    image: 'https://images.pexels.com/photos/2402777/pexels-photo-2402777.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&dpr=2',
    timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000),
    likes: 89,
    comments: 21,
    shares: 15,
    isLiked: false,
    type: 'achievement',
    tags: ['running', 'personal-best', 'training']
  }
];

export const mockConversations: Conversation[] = [
  {
    id: '1',
    type: 'direct',
    participants: [mockUsers[0], mockUsers[1]],
    lastMessage: {
      id: '1',
      sender: mockUsers[1],
      content: "Hey! Are you free for a tennis match tomorrow at 3 PM?",
      timestamp: new Date(Date.now() - 30 * 60 * 1000),
      isRead: false,
      type: 'text'
    },
    unreadCount: 2,
    isActive: true,
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000)
  },
  {
    id: '2',
    type: 'direct',
    participants: [mockUsers[0], mockUsers[2]],
    lastMessage: {
      id: '2',
      sender: mockUsers[2],
      content: "Thanks for the great basketball game! Same time next week?",
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      isRead: true,
      type: 'text'
    },
    unreadCount: 0,
    isActive: true,
    createdAt: new Date(Date.now() - 48 * 60 * 60 * 1000)
  },
  {
    id: '3',
    type: 'game',
    participants: [mockUsers[0], mockUsers[1], mockUsers[2], mockUsers[3]],
    lastMessage: {
      id: '3',
      sender: mockUsers[3],
      content: "Court is confirmed for 6 PM! See everyone there 🏀",
      timestamp: new Date(Date.now() - 45 * 60 * 1000),
      isRead: false,
      type: 'text'
    },
    unreadCount: 1,
    gameId: 'game-1',
    name: 'Basketball Game - Tonight',
    avatar: 'https://images.pexels.com/photos/1752757/pexels-photo-1752757.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2',
    isActive: true,
    createdAt: new Date(Date.now() - 72 * 60 * 60 * 1000)
  }
];

export const mockMatchInvites: MatchInvite[] = [
  {
    id: '1',
    from: mockUsers[1],
    to: mockUsers[0],
    gameId: 'game-1',
    sport: 'Tennis',
    date: '2025-01-16',
    time: '15:00',
    court: mockCourts[1],
    message: "Hey! Want to play some tennis tomorrow? I found a great court!",
    status: 'pending',
    timestamp: new Date(Date.now() - 30 * 60 * 1000),
    expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000)
  },
  {
    id: '2',
    from: mockUsers[2],
    to: mockUsers[0],
    gameId: 'game-2',
    sport: 'Basketball',
    date: '2025-01-17',
    time: '18:00',
    message: "Basketball game this Friday evening? Let me know!",
    status: 'pending',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    expiresAt: new Date(Date.now() + 48 * 60 * 60 * 1000)
  }
];