/**
 * Type definitions for the application
 */

// User types
export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  role: UserRole;
  avatar?: string;
  createdAt: Date;
  updatedAt: Date;
}

export enum UserRole {
  ADMIN = 'admin',
  LENDER = 'lender',
  BORROWER = 'borrower',
  INVESTOR = 'investor',
}

// Loan types
export interface Loan {
  id: string;
  borrowerId: string;
  lenderId: string;
  amount: number;
  currency: string;
  interestRate: number;
  term: number;
  status: LoanStatus;
  startDate: Date;
  endDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

export enum LoanStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  ACTIVE = 'active',
  COMPLETED = 'completed',
  DEFAULTED = 'defaulted',
  CANCELLED = 'cancelled',
}

// Payment types
export interface Payment {
  id: string;
  loanId: string;
  amount: number;
  currency: string;
  paymentMethod: PaymentMethod;
  status: PaymentStatus;
  dueDate: Date;
  paidDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export enum PaymentMethod {
  BANK_TRANSFER = 'bank_transfer',
  CRYPTO = 'crypto',
  CARD = 'card',
  WALLET = 'wallet',
}

export enum PaymentStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  COMPLETED = 'completed',
  FAILED = 'failed',
  CANCELLED = 'cancelled',
}

// Wallet types
export interface Wallet {
  id: string;
  userId: string;
  address: string;
  balance: number;
  currency: string;
  type: WalletType;
  isVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export enum WalletType {
  ETHEREUM = 'ethereum',
  BITCOIN = 'bitcoin',
  STABLECOIN = 'stablecoin',
  BANK = 'bank',
}

// Transaction types
export interface Transaction {
  id: string;
  fromWalletId: string;
  toWalletId: string;
  amount: number;
  currency: string;
  transactionHash?: string;
  status: TransactionStatus;
  type: TransactionType;
  createdAt: Date;
  updatedAt: Date;
}

export enum TransactionStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  FAILED = 'failed',
  CANCELLED = 'cancelled',
}

export enum TransactionType {
  DEPOSIT = 'deposit',
  WITHDRAWAL = 'withdrawal',
  TRANSFER = 'transfer',
  LOAN_PAYMENT = 'loan_payment',
  INTEREST = 'interest',
}

// KYC/AML types
export interface KycData {
  userId: string;
  fullName: string;
  dateOfBirth: Date;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  documentType: DocumentType;
  documentNumber: string;
  documentExpiry: Date;
  status: KycStatus;
  verifiedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export enum DocumentType {
  PASSPORT = 'passport',
  DRIVER_LICENSE = 'driver_license',
  NATIONAL_ID = 'national_id',
}

export enum KycStatus {
  PENDING = 'pending',
  VERIFIED = 'verified',
  REJECTED = 'rejected',
  EXPIRED = 'expired',
}

// Investment types
export interface Investment {
  id: string;
  investorId: string;
  loanId: string;
  amount: number;
  percentage: number;
  expectedReturn: number;
  status: InvestmentStatus;
  createdAt: Date;
  updatedAt: Date;
}

export enum InvestmentStatus {
  ACTIVE = 'active',
  COMPLETED = 'completed',
  DEFAULTED = 'defaulted',
  CANCELLED = 'cancelled',
}

// Notification types
export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  read: boolean;
  data?: Record<string, unknown>;
  createdAt: Date;
}

export enum NotificationType {
  LOAN_APPROVED = 'loan_approved',
  PAYMENT_DUE = 'payment_due',
  PAYMENT_RECEIVED = 'payment_received',
  LOAN_COMPLETED = 'loan_completed',
  INVESTMENT_RETURN = 'investment_return',
  SYSTEM_ALERT = 'system_alert',
}

// API Request/Response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: ApiErrorResponse;
  timestamp: Date;
}

export interface ApiErrorResponse {
  code: string;
  message: string;
  details?: unknown;
}

export interface PaginatedResponse<T> {
  data: T[];
  page: number;
  pageSize: number;
  total: number;
  hasMore: boolean;
}

// Filter types
export interface FilterOptions {
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  search?: string;
}

export interface LoanFilterOptions extends FilterOptions {
  status?: LoanStatus;
  minAmount?: number;
  maxAmount?: number;
  minRate?: number;
  maxRate?: number;
}
