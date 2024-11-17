export const CURRENCY = 'USDT';

export const APP_CONFIG = {
  name: 'Tefaiz Panel',
  description: 'Yatırım Yönetim Platformu',
  domain: 'panel.tefaiz.com',
  apiUrl: 'https://panel.tefaiz.com/api'
} as const;

export const INVESTMENT_TYPES = {
  FIXED: 'fixed',
  FLEXIBLE: 'flexible',
  SPECIAL: 'special'
} as const;

export const INVESTMENT_STATUS = {
  PENDING: 'pending',
  ACTIVE: 'active',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled'
} as const;

export const RISK_LEVELS = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high'
} as const;

export const USER_ROLES = {
  ADMIN: 'admin',
  EMPLOYEE: 'employee',
  USER: 'user'
} as const;

export const PERMISSIONS = {
  MANAGE_USERS: 'manage_users',
  APPROVE_INVESTMENTS: 'approve_investments',
  MODIFY_SETTINGS: 'modify_settings',
  VIEW_REPORTS: 'view_reports'
} as const;

export const SIMULATION_CONFIG = {
  MIN_SPEED: 0.5,
  MAX_SPEED: 5,
  DEFAULT_INTERVAL: 5000,
  MIN_USERS: 1,
  MAX_USERS: 1000,
  DEFAULT_USERS: 82
} as const;

export const COUNTRIES = [
  {
    code: 'VE',
    name: 'Venezuela',
    flag: '🇻🇪',
    interestRate: 59.26,
    riskLevel: RISK_LEVELS.HIGH
  },
  {
    code: 'AR',
    name: 'Arjantin',
    flag: '🇦🇷',
    interestRate: 40,
    riskLevel: RISK_LEVELS.HIGH
  },
  {
    code: 'TR',
    name: 'Türkiye',
    flag: '🇹🇷',
    interestRate: 50,
    riskLevel: RISK_LEVELS.MEDIUM
  },
  {
    code: 'ZW',
    name: 'Zimbabve',
    flag: '🇿🇼',
    interestRate: 35,
    riskLevel: RISK_LEVELS.HIGH
  }
] as const;

export const INVESTMENT_DURATIONS = [
  {
    days: 3,
    label: '3 Günlük',
    rate: 8.9,
    description: 'Kısa vadeli yüksek getiri'
  },
  {
    days: 7,
    label: 'Haftalık',
    rate: 20.7,
    description: 'Haftalık sabit getiri'
  },
  {
    days: 15,
    label: '15 Günlük',
    rate: 44.4,
    description: 'Orta vadeli yatırım'
  },
  {
    days: 30,
    label: 'Aylık',
    rate: 59.3,
    description: 'Maksimum getiri potansiyeli'
  }
] as const;

export const PAYMENT_CONFIG = {
  WALLET_ADDRESS: 'TWd2yzw5yFc5W8Tq6CuRRsqJxgEH2h8DBE',
  NETWORK: 'TRC20 (TRON)',
  MIN_AMOUNT: 50,
  MAX_AMOUNT: 100000,
  CONFIRMATIONS: 12,
  PROCESSING_TIME: '5-15 dakika'
} as const;