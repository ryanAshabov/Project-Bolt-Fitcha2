export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  avatar?: string;
  headline?: string;
  location?: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
  connections: number;
  isOnline: boolean;
  verified: boolean;
  isPro: boolean;
  sports: string[];
  skillLevel: 'Beginner' | 'Intermediate' | 'Advanced' | 'Professional';
  rating: number;
  gamesPlayed: number;
  winRate: number;
  badges: Badge[];
  availability: string[];
  trustScore: number;
  achievements: Achievement[];
  preferences: UserPreferences;
  socialLinks?: SocialLinks;
  statistics: UserStatistics;
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  notifications: NotificationSettings;
  privacy: PrivacySettings;
  gameDefaults: GameDefaults;
}

export interface NotificationSettings {
  gameInvites: boolean;
  gameReminders: boolean;
  chatMessages: boolean;
  achievements: boolean;
  weatherAlerts: boolean;
  pushNotifications: boolean;
  emailNotifications: boolean;
}

export interface PrivacySettings {
  showLocation: boolean;
  showOnlineStatus: boolean;
  allowGameInvites: 'everyone' | 'connections' | 'none';
  showStatistics: boolean;
}

export interface GameDefaults {
  preferredSports: string[];
  skillLevel: string;
  maxDistance: number;
  preferredTimes: string[];
  paymentPreference: 'free' | 'paid' | 'both';
}

export interface SocialLinks {
  instagram?: string;
  twitter?: string;
  facebook?: string;
  website?: string;
}

export interface UserStatistics {
  totalGames: number;
  totalWins: number;
  totalLosses: number;
  averageRating: number;
  favoriteTime: string;
  favoriteSport: string;
  mostPlayedWith: string[];
  monthlyGames: { month: string; count: number }[];
  courtVisits: { courtId: string; visits: number }[];
}

export interface Badge {
  id: string;
  name: string;
  icon: string;
  color: string;
  description: string;
  unlockedAt?: Date;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  progress: number;
  target: number;
  completed: boolean;
  unlockedAt?: Date;
  category: 'games' | 'social' | 'skills' | 'exploration' | 'consistency';
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

export interface Post {
  id: string;
  author: User;
  content: string;
  image?: string;
  timestamp: Date;
  likes: number;
  comments: number;
  shares: number;
  isLiked: boolean;
  type: 'text' | 'match_result' | 'training' | 'achievement' | 'court_review' | 'tournament';
  matchData?: MatchResult;
  location?: string;
  tags?: string[];
}

export interface MatchResult {
  sport: string;
  score: string;
  opponent: string;
  court: string;
  duration: number;
  weather?: string;
  mvp?: string;
  highlights?: string[];
}

export interface Court {
  id: string;
  name: string;
  sport: string[];
  location: string;
  address: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  price: number;
  rating: number;
  reviews: number;
  image: string;
  images?: string[];
  amenities: string[];
  isIndoor: boolean;
  availability: TimeSlot[];
  description?: string;
  rules?: string[];
  contactInfo?: {
    phone?: string;
    email?: string;
    website?: string;
  };
  operatingHours: {
    [key: string]: { open: string; close: string; closed?: boolean };
  };
  weatherDependent: boolean;
}

export interface TimeSlot {
  id: string;
  startTime: string;
  endTime: string;
  date: string;
  isAvailable: boolean;
  price: number;
  bookedBy?: string;
}

export interface ActivitySession {
  id: string;
  creator: User;
  type: 'sports' | 'wellness' | 'gaming' | 'outdoor' | 'social' | 'fitness';
  category: string; // Basketball, Yoga, PlayStation, Cycling, etc.
  name: string;
  description?: string;
  datetime: string;
  duration: number;
  location: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
  skillLevel: string;
  maxParticipants: number;
  currentParticipants: User[];
  waitingList: User[];
  isPaid: boolean;
  pricePerPerson?: number;
  paymentStatus: { [userId: string]: 'pending' | 'paid' | 'refunded' };
  status: 'open' | 'full' | 'in_progress' | 'completed' | 'cancelled';
  isRecurring: boolean;
  recurringPattern?: RecurringPattern;
  weatherDependent: boolean;
  chatId: string;
  rules?: string[];
  equipment?: string[];
  tags?: string[];
  visibility: 'public' | 'friends' | 'private';
  inviteCode?: string;
  createdAt: Date;
  updatedAt: Date;
  requirements?: string[];
  ageRange?: { min: number; max: number };
  genderPreference?: 'mixed' | 'male' | 'female';
}

export interface GameSession {
  id: string;
  creator: User;
  sport: string;
  name?: string;
  description?: string;
  datetime: string;
  duration: number;
  location: string;
  court?: Court;
  coordinates?: {
    lat: number;
    lng: number;
  };
  skillLevel: string;
  maxPlayers: number;
  currentPlayers: User[];
  waitingList: User[];
  isPaid: boolean;
  pricePerPlayer?: number;
  paymentStatus: { [userId: string]: 'pending' | 'paid' | 'refunded' };
  status: 'open' | 'full' | 'in_progress' | 'completed' | 'cancelled';
  isRecurring: boolean;
  recurringPattern?: RecurringPattern;
  weatherDependent: boolean;
  chatId: string;
  rules?: string[];
  equipment?: string[];
  tags?: string[];
  visibility: 'public' | 'friends' | 'private';
  inviteCode?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface RecurringPattern {
  frequency: 'daily' | 'weekly' | 'monthly';
  interval: number;
  daysOfWeek?: number[];
  endDate?: string;
  maxOccurrences?: number;
}

export interface Message {
  id: string;
  sender: User;
  content: string;
  timestamp: Date;
  isRead: boolean;
  type: 'text' | 'image' | 'court_suggestion' | 'match_invite' | 'system' | 'quick_message';
  gameId?: string;
  attachments?: MessageAttachment[];
  replyTo?: string;
  reactions?: MessageReaction[];
}

export interface MessageAttachment {
  id: string;
  type: 'image' | 'file' | 'location' | 'court';
  url: string;
  name: string;
  size?: number;
}

export interface MessageReaction {
  emoji: string;
  users: string[];
  count: number;
}

export interface Conversation {
  id: string;
  type: 'direct' | 'group' | 'game';
  participants: User[];
  lastMessage: Message;
  unreadCount: number;
  gameId?: string;
  name?: string;
  avatar?: string;
  isActive: boolean;
  createdAt: Date;
}

export interface Notification {
  id: string;
  userId: string;
  type: 'game_invite' | 'game_reminder' | 'player_joined' | 'game_cancelled' | 'achievement' | 'message' | 'weather_alert' | 'payment' | 'rating_request';
  title: string;
  message: string;
  data?: any;
  isRead: boolean;
  createdAt: Date;
  actionUrl?: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
}

export interface MatchInvite {
  id: string;
  from: User;
  to: User;
  gameId: string;
  sport: string;
  date: string;
  time: string;
  court?: Court;
  message: string;
  status: 'pending' | 'accepted' | 'declined' | 'expired';
  timestamp: Date;
  expiresAt: Date;
}

export interface WeatherData {
  temperature: number;
  condition: string;
  humidity: number;
  windSpeed: number;
  precipitation: number;
  icon: string;
  forecast: WeatherForecast[];
}

export interface WeatherForecast {
  date: string;
  temperature: { min: number; max: number };
  condition: string;
  precipitation: number;
  icon: string;
}

export interface Tournament {
  id: string;
  name: string;
  sport: string;
  description: string;
  organizer: User;
  startDate: string;
  endDate: string;
  registrationDeadline: string;
  maxParticipants: number;
  currentParticipants: User[];
  entryFee: number;
  prizePool: number;
  format: 'single_elimination' | 'double_elimination' | 'round_robin' | 'swiss';
  status: 'upcoming' | 'registration_open' | 'in_progress' | 'completed' | 'cancelled';
  location: string;
  court?: Court;
  rules: string[];
  brackets?: TournamentBracket[];
  matches?: TournamentMatch[];
  winners?: {
    first: User;
    second: User;
    third: User[];
  };
}

export interface TournamentBracket {
  id: string;
  round: number;
  matches: TournamentMatch[];
}

export interface TournamentMatch {
  id: string;
  tournamentId: string;
  round: number;
  player1: User;
  player2: User;
  winner?: User;
  score?: string;
  scheduledTime?: string;
  completedAt?: Date;
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
}

export interface Team {
  id: string;
  name: string;
  sport: string;
  captain: User;
  members: User[];
  description?: string;
  avatar?: string;
  isPrivate: boolean;
  skillLevel: string;
  location: string;
  achievements: TeamAchievement[];
  statistics: TeamStatistics;
  createdAt: Date;
}

export interface TeamAchievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt: Date;
}

export interface TeamStatistics {
  gamesPlayed: number;
  wins: number;
  losses: number;
  winRate: number;
  averageRating: number;
  totalMembers: number;
}

export interface Review {
  id: string;
  reviewerId: string;
  revieweeId?: string;
  courtId?: string;
  gameId?: string;
  rating: number;
  comment?: string;
  categories?: {
    [key: string]: number;
  };
  isAnonymous: boolean;
  createdAt: Date;
  helpful: number;
  reported: boolean;
}

export interface PaymentTransaction {
  id: string;
  userId: string;
  gameId?: string;
  amount: number;
  currency: string;
  type: 'game_fee' | 'court_booking' | 'tournament_entry' | 'refund';
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  paymentMethod: string;
  transactionId?: string;
  createdAt: Date;
  completedAt?: Date;
}

export interface Analytics {
  userId: string;
  period: 'daily' | 'weekly' | 'monthly' | 'yearly';
  data: {
    gamesPlayed: number;
    hoursPlayed: number;
    sportsBreakdown: { [sport: string]: number };
    peakHours: { [hour: string]: number };
    favoritePartners: string[];
    improvementAreas: string[];
    achievements: number;
    socialScore: number;
  };
  generatedAt: Date;
}