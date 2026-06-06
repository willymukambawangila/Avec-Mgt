/**
 * Constants used throughout the application
 */

// HTTP Status Codes
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_ERROR: 500,
  SERVICE_UNAVAILABLE: 503,
} as const;

// Loan Constants
export const LOAN_CONSTANTS = {
  MIN_AMOUNT: 100,
  MAX_AMOUNT: 1000000,
  MIN_RATE: 0.5,
  MAX_RATE: 50,
  MIN_TERM_MONTHS: 1,
  MAX_TERM_MONTHS: 360,
  DEFAULT_RATE: 5,
  DEFAULT_TERM_MONTHS: 12,
} as const;

// Payment Constants
export const PAYMENT_CONSTANTS = {
  MIN_PAYMENT_AMOUNT: 10,
  PAYMENT_DUE_DAYS_ADVANCE: 5,
  LATE_PAYMENT_GRACE_DAYS: 3,
  LATE_PAYMENT_FEE_PERCENTAGE: 5,
} as const;

// Wallet Constants
export const WALLET_CONSTANTS = {
  MIN_BALANCE: 0,
  MAX_BALANCE: 999999999,
  WITHDRAWAL_MIN: 10,
  WITHDRAWAL_MAX: 100000,
} as const;

// Transaction Constants
export const TRANSACTION_CONSTANTS = {
  MIN_AMOUNT: 0.01,
  MAX_AMOUNT: 999999,
  CONFIRMATION_TIME_MS: 30000, // 30 seconds
  RETRY_COUNT: 3,
  RETRY_DELAY_MS: 5000,
} as const;

// KYC Constants
export const KYC_CONSTANTS = {
  EXPIRY_YEARS: 5,
  VERIFICATION_TIMEOUT_HOURS: 24,
  MAX_UPLOAD_SIZE_MB: 10,
  ALLOWED_DOCUMENT_TYPES: ['passport', 'driver_license', 'national_id'],
} as const;

// Pagination Constants
export const PAGINATION_CONSTANTS = {
  DEFAULT_PAGE: 1,
  DEFAULT_PAGE_SIZE: 20,
  MIN_PAGE_SIZE: 1,
  MAX_PAGE_SIZE: 100,
} as const;

// Cache Constants
export const CACHE_CONSTANTS = {
  USER_CACHE_TTL: 3600, // 1 hour
  LOAN_CACHE_TTL: 1800, // 30 minutes
  PAYMENT_CACHE_TTL: 900, // 15 minutes
  WALLET_CACHE_TTL: 600, // 10 minutes
  TRANSACTION_CACHE_TTL: 300, // 5 minutes
} as const;

// Validation Messages
export const VALIDATION_MESSAGES = {
  REQUIRED_FIELD: 'This field is required',
  INVALID_EMAIL: 'Please enter a valid email address',
  INVALID_PHONE: 'Please enter a valid phone number',
  WEAK_PASSWORD: 'Password must contain uppercase, lowercase, number, and special character',
  INVALID_URL: 'Please enter a valid URL',
  INVALID_DATE: 'Please enter a valid date',
  INVALID_AMOUNT: 'Please enter a valid amount',
  MIN_LENGTH: 'Minimum length is {min} characters',
  MAX_LENGTH: 'Maximum length is {max} characters',
  INVALID_ENUM: 'Invalid option selected',
} as const;

// Error Messages
export const ERROR_MESSAGES = {
  UNAUTHORIZED: 'You are not authorized to perform this action',
  NOT_FOUND: 'The requested resource was not found',
  ALREADY_EXISTS: 'This resource already exists',
  INTERNAL_ERROR: 'An internal error occurred. Please try again later',
  NETWORK_ERROR: 'Network error. Please check your connection',
  TIMEOUT_ERROR: 'Request timed out. Please try again',
} as const;

// Success Messages
export const SUCCESS_MESSAGES = {
  CREATED: 'Resource created successfully',
  UPDATED: 'Resource updated successfully',
  DELETED: 'Resource deleted successfully',
  LOGIN_SUCCESS: 'Login successful',
  LOGOUT_SUCCESS: 'Logout successful',
  PAYMENT_PROCESSED: 'Payment processed successfully',
  LOAN_APPROVED: 'Loan approved successfully',
} as const;

// Routes
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  DASHBOARD: '/dashboard',
  LOANS: '/loans',
  LOAN_DETAIL: '/loans/:id',
  PAYMENTS: '/payments',
  WALLETS: '/wallets',
  SETTINGS: '/settings',
  PROFILE: '/profile',
  KYC: '/kyc',
  ADMIN: '/admin',
} as const;

// API Endpoints
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/api/auth/login',
    LOGOUT: '/api/auth/logout',
    REGISTER: '/api/auth/register',
    REFRESH: '/api/auth/refresh',
  },
  USERS: {
    LIST: '/api/users',
    GET: '/api/users/:id',
    CREATE: '/api/users',
    UPDATE: '/api/users/:id',
    DELETE: '/api/users/:id',
  },
  LOANS: {
    LIST: '/api/loans',
    GET: '/api/loans/:id',
    CREATE: '/api/loans',
    UPDATE: '/api/loans/:id',
    APPROVE: '/api/loans/:id/approve',
    REJECT: '/api/loans/:id/reject',
  },
  PAYMENTS: {
    LIST: '/api/payments',
    GET: '/api/payments/:id',
    CREATE: '/api/payments',
    PROCESS: '/api/payments/:id/process',
  },
  WALLETS: {
    LIST: '/api/wallets',
    GET: '/api/wallets/:id',
    CREATE: '/api/wallets',
    UPDATE: '/api/wallets/:id',
  },
  TRANSACTIONS: {
    LIST: '/api/transactions',
    GET: '/api/transactions/:id',
    CREATE: '/api/transactions',
  },
  KYC: {
    GET: '/api/kyc',
    SUBMIT: '/api/kyc/submit',
    VERIFY: '/api/kyc/verify',
  },
} as const;

// Regular Expressions
export const REGEX = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE: /^[\d\s\-\+\(\)]{10,}$/,
  URL: /^https?:\/\/.+/,
  ETHEREUM_ADDRESS: /^0x[a-fA-F0-9]{40}$/,
  BITCOIN_ADDRESS: /^(bc1|[13])[a-zA-HJ-NP-Z0-9]{25,62}$/,
  TRANSACTION_HASH: /^0x[a-fA-F0-9]{64}$/,
  PASSWORD: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
} as const;
