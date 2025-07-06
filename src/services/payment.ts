/**
 * Payment Service
 * 
 * Comprehensive payment and monetization system for Fitcha
 * Features:
 * - Stripe integration for secure payments
 * - Wallet system for internal transactions
 * - Court booking commissions
 * - Pro membership subscriptions
 * - Game entry fees
 * - Revenue sharing with court owners
 * 
 * @author Fitcha Team
 * @version 1.0.0 - Payment & Monetization System
 */

// Payment Types
export interface PaymentMethod {
  id: string;
  type: 'card' | 'wallet' | 'bank_transfer';
  last4?: string;
  brand?: string;
  expiryMonth?: number;
  expiryYear?: number;
  isDefault: boolean;
  name: string;
}

export interface Transaction {
  id: string;
  type: 'court_booking' | 'game_entry' | 'pro_subscription' | 'wallet_topup' | 'payout';
  amount: number;
  currency: string;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  description: string;
  timestamp: Date;
  paymentMethod?: PaymentMethod;
  metadata?: {
    courtId?: string;
    gameId?: string;
    subscriptionId?: string;
    bookingId?: string;
  };
}

export interface Wallet {
  id: string;
  userId: string;
  balance: number;
  currency: string;
  pendingBalance: number;
  transactions: Transaction[];
  lastUpdated: Date;
}

export interface ProSubscription {
  id: string;
  userId: string;
  plan: 'monthly' | 'yearly';
  status: 'active' | 'cancelled' | 'expired';
  startDate: Date;
  endDate: Date;
  autoRenew: boolean;
  features: string[];
  price: number;
  currency: string;
}

export interface CourtCommission {
  id: string;
  courtId: string;
  ownerId: string;
  commissionRate: number; // percentage (5-10%)
  payoutSchedule: 'weekly' | 'monthly';
  totalEarnings: number;
  pendingPayout: number;
  lastPayout?: Date;
}

// Payment Configuration
export const PAYMENT_CONFIG = {
  STRIPE_PUBLIC_KEY: process.env.REACT_APP_STRIPE_PUBLIC_KEY || 'pk_test_...',
  
  COMMISSION_RATES: {
    COURT_BOOKING: 0.08, // 8% commission
    GAME_ENTRY: 0.15, // 15% platform fee
    PRO_SUBSCRIPTION: 1.0 // 100% to platform
  },
  
  PRO_PLANS: {
    monthly: {
      price: 9.99,
      currency: 'USD',
      features: [
        'Priority Booking',
        'AI Court Recommendations',
        'Advanced Analytics',
        'Custom Profile Themes',
        'Smart Notifications',
        'Unlimited Connections',
        'Tournament Access',
        'Early Feature Access'
      ]
    },
    yearly: {
      price: 99.99,
      currency: 'USD',
      discount: 0.17, // 17% off
      features: [
        'All Monthly Features',
        'Annual Analytics Report',
        'VIP Support',
        'Exclusive Events Access'
      ]
    }
  },
  
  GAME_ENTRY_FEES: {
    casual: 2.99,
    competitive: 4.99,
    tournament: 9.99
  },
  
  MINIMUM_WALLET_BALANCE: 5.00,
  MAXIMUM_WALLET_BALANCE: 1000.00
};

// Mock Payment Service
class PaymentService {
  private static instance: PaymentService;
  private wallet: Wallet | null = null;
  private paymentMethods: PaymentMethod[] = [];
  private transactions: Transaction[] = [];
  private subscription: ProSubscription | null = null;

  static getInstance(): PaymentService {
    if (!PaymentService.instance) {
      PaymentService.instance = new PaymentService();
    }
    return PaymentService.instance;
  }

  // Initialize with mock data
  constructor() {
    this.initializeMockData();
  }

  private initializeMockData() {
    // Mock wallet
    this.wallet = {
      id: 'wallet-1',
      userId: 'current-user',
      balance: 45.50,
      currency: 'USD',
      pendingBalance: 12.00,
      transactions: [],
      lastUpdated: new Date()
    };

    // Mock payment methods
    this.paymentMethods = [
      {
        id: 'pm-1',
        type: 'card',
        last4: '4242',
        brand: 'Visa',
        expiryMonth: 12,
        expiryYear: 2026,
        isDefault: true,
        name: 'Main Card'
      },
      {
        id: 'pm-2',
        type: 'wallet',
        isDefault: false,
        name: 'Fitcha Wallet'
      }
    ];

    // Mock transactions
    this.transactions = [
      {
        id: 'txn-1',
        type: 'court_booking',
        amount: 25.00,
        currency: 'USD',
        status: 'completed',
        description: 'City Sports Complex - Basketball Court',
        timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        metadata: { courtId: 'court-1', bookingId: 'booking-1' }
      },
      {
        id: 'txn-2',
        type: 'pro_subscription',
        amount: 9.99,
        currency: 'USD',
        status: 'completed',
        description: 'Pro Membership - Monthly',
        timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        metadata: { subscriptionId: 'sub-1' }
      },
      {
        id: 'txn-3',
        type: 'wallet_topup',
        amount: 50.00,
        currency: 'USD',
        status: 'completed',
        description: 'Wallet Top-up',
        timestamp: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000)
      }
    ];

    // Mock pro subscription
    this.subscription = {
      id: 'sub-1',
      userId: 'current-user',
      plan: 'monthly',
      status: 'active',
      startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      endDate: new Date(Date.now() + 23 * 24 * 60 * 60 * 1000),
      autoRenew: true,
      features: PAYMENT_CONFIG.PRO_PLANS.monthly.features,
      price: PAYMENT_CONFIG.PRO_PLANS.monthly.price,
      currency: 'USD'
    };
  }

  // Wallet Operations
  async getWallet(): Promise<Wallet | null> {
    return this.wallet;
  }

  async topUpWallet(amount: number, paymentMethodId: string): Promise<Transaction> {
    const paymentMethod = this.paymentMethods.find(pm => pm.id === paymentMethodId);
    
    const transaction: Transaction = {
      id: `txn-${Date.now()}`,
      type: 'wallet_topup',
      amount,
      currency: 'USD',
      status: 'pending',
      description: `Wallet Top-up - $${amount}`,
      timestamp: new Date(),
      paymentMethod
    };

    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    transaction.status = 'completed';
    if (this.wallet) {
      this.wallet.balance += amount;
      this.wallet.lastUpdated = new Date();
    }
    
    this.transactions.unshift(transaction);
    return transaction;
  }

  // Court Booking Payments
  async processCourtBooking(
    courtId: string, 
    amount: number, 
    paymentMethodId: string
  ): Promise<Transaction> {
    const commission = amount * PAYMENT_CONFIG.COMMISSION_RATES.COURT_BOOKING;
    const courtOwnerAmount = amount - commission;
    const paymentMethod = this.paymentMethods.find(pm => pm.id === paymentMethodId);

    const transaction: Transaction = {
      id: `txn-${Date.now()}`,
      type: 'court_booking',
      amount,
      currency: 'USD',
      status: 'pending',
      description: `Court Booking - ${courtId}`,
      timestamp: new Date(),
      paymentMethod,
      metadata: { courtId, bookingId: `booking-${Date.now()}` }
    };

    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    transaction.status = 'completed';
    this.transactions.unshift(transaction);

    console.log(`💰 Commission: $${commission.toFixed(2)} | Court Owner: $${courtOwnerAmount.toFixed(2)}`);
    return transaction;
  }

  // Pro Subscription
  async subscribeToPro(plan: 'monthly' | 'yearly', paymentMethodId: string): Promise<ProSubscription> {
    const planConfig = PAYMENT_CONFIG.PRO_PLANS[plan];
    const paymentMethod = this.paymentMethods.find(pm => pm.id === paymentMethodId);
    
    const transaction: Transaction = {
      id: `txn-${Date.now()}`,
      type: 'pro_subscription',
      amount: planConfig.price,
      currency: planConfig.currency,
      status: 'pending',
      description: `Pro Membership - ${plan}`,
      timestamp: new Date(),
      paymentMethod
    };

    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    transaction.status = 'completed';
    this.transactions.unshift(transaction);

    const subscription: ProSubscription = {
      id: `sub-${Date.now()}`,
      userId: 'current-user',
      plan,
      status: 'active',
      startDate: new Date(),
      endDate: new Date(Date.now() + (plan === 'monthly' ? 30 : 365) * 24 * 60 * 60 * 1000),
      autoRenew: true,
      features: planConfig.features,
      price: planConfig.price,
      currency: planConfig.currency
    };

    this.subscription = subscription;
    return subscription;
  }

  // Game Entry Fees
  async processGameEntry(
    gameId: string, 
    gameType: 'casual' | 'competitive' | 'tournament',
    paymentMethodId: string
  ): Promise<Transaction> {
    const amount = PAYMENT_CONFIG.GAME_ENTRY_FEES[gameType];
    const platformFee = amount * PAYMENT_CONFIG.COMMISSION_RATES.GAME_ENTRY;
    const prizePool = amount - platformFee;
    const paymentMethod = this.paymentMethods.find(pm => pm.id === paymentMethodId);

    const transaction: Transaction = {
      id: `txn-${Date.now()}`,
      type: 'game_entry',
      amount,
      currency: 'USD',
      status: 'pending',
      description: `${gameType} Game Entry`,
      timestamp: new Date(),
      paymentMethod,
      metadata: { gameId }
    };

    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    transaction.status = 'completed';
    this.transactions.unshift(transaction);

    console.log(`🎮 Game Entry: $${amount} | Platform Fee: $${platformFee.toFixed(2)} | Prize Pool: $${prizePool.toFixed(2)}`);
    return transaction;
  }

  // Payment Methods
  async getPaymentMethods(): Promise<PaymentMethod[]> {
    return this.paymentMethods;
  }

  async addPaymentMethod(method: Omit<PaymentMethod, 'id'>): Promise<PaymentMethod> {
    const newMethod: PaymentMethod = {
      ...method,
      id: `pm-${Date.now()}`
    };
    
    this.paymentMethods.push(newMethod);
    return newMethod;
  }

  // Transactions
  async getTransactions(limit = 20): Promise<Transaction[]> {
    return this.transactions.slice(0, limit);
  }

  async getTransaction(id: string): Promise<Transaction | null> {
    return this.transactions.find(t => t.id === id) || null;
  }

  // Subscription
  async getSubscription(): Promise<ProSubscription | null> {
    return this.subscription;
  }

  async cancelSubscription(): Promise<void> {
    if (this.subscription) {
      this.subscription.status = 'cancelled';
      this.subscription.autoRenew = false;
    }
  }

  // Revenue Analytics (for admin)
  async getRevenueAnalytics() {
    const totalRevenue = this.transactions
      .filter(t => t.status === 'completed')
      .reduce((sum, t) => sum + t.amount, 0);

    const monthlyRevenue = this.transactions
      .filter(t => {
        const transactionMonth = t.timestamp.getMonth();
        const currentMonth = new Date().getMonth();
        return t.status === 'completed' && transactionMonth === currentMonth;
      })
      .reduce((sum, t) => sum + t.amount, 0);

    return {
      totalRevenue,
      monthlyRevenue,
      transactionCount: this.transactions.length,
      activeSubscriptions: this.subscription?.status === 'active' ? 1 : 0,
      projectedMonthly: 11500 // Based on your projections
    };
  }
}

export default PaymentService;
