/**
 * Wallet service
 */

import { apiService } from './api';
import { Wallet, WalletType, Transaction, TransactionType } from '@/types';
import { API_ENDPOINTS } from '@/constants';

interface CreateWalletRequest {
  address: string;
  type: WalletType;
  currency: string;
}

interface UpdateWalletRequest {
  balance?: number;
  isVerified?: boolean;
}

interface TransactionRequest {
  toWalletId: string;
  amount: number;
  type: TransactionType;
  description?: string;
}

interface WalletStats {
  totalBalance: number;
  totalTransactions: number;
  averageTransactionAmount: number;
}

class WalletService {
  /**
   * Get all wallets for user
   */
  async getWallets(): Promise<Wallet[]> {
    const response = await apiService.get<{ data: Wallet[] }>(API_ENDPOINTS.WALLETS.LIST);
    return response.data?.data || [];
  }

  /**
   * Get single wallet by ID
   */
  async getWallet(id: string): Promise<Wallet> {
    const endpoint = API_ENDPOINTS.WALLETS.GET.replace(':id', id);
    const response = await apiService.get<Wallet>(endpoint);
    return response.data!;
  }

  /**
   * Create new wallet
   */
  async createWallet(data: CreateWalletRequest): Promise<Wallet> {
    const response = await apiService.post<Wallet>(API_ENDPOINTS.WALLETS.CREATE, data);
    return response.data!;
  }

  /**
   * Update wallet
   */
  async updateWallet(id: string, data: UpdateWalletRequest): Promise<Wallet> {
    const endpoint = API_ENDPOINTS.WALLETS.UPDATE.replace(':id', id);
    const response = await apiService.put<Wallet>(endpoint, data);
    return response.data!;
  }

  /**
   * Get wallet by address
   */
  async getWalletByAddress(address: string): Promise<Wallet | null> {
    const wallets = await this.getWallets();
    return wallets.find((w) => w.address === address) || null;
  }

  /**
   * Get wallet balance
   */
  async getWalletBalance(id: string): Promise<number> {
    const wallet = await this.getWallet(id);
    return wallet.balance;
  }

  /**
   * Verify wallet
   */
  async verifyWallet(id: string): Promise<Wallet> {
    return this.updateWallet(id, { isVerified: true });
  }

  /**
   * Get wallet transactions
   */
  async getWalletTransactions(id: string): Promise<Transaction[]> {
    const endpoint = `${API_ENDPOINTS.WALLETS.GET.replace(':id', id)}/transactions`;
    const response = await apiService.get<{ data: Transaction[] }>(endpoint);
    return response.data?.data || [];
  }

  /**
   * Get crypto wallets
   */
  async getCryptoWallets(): Promise<Wallet[]> {
    const wallets = await this.getWallets();
    return wallets.filter(
      (w) =>
        w.type === WalletType.ETHEREUM ||
        w.type === WalletType.BITCOIN ||
        w.type === WalletType.STABLECOIN
    );
  }

  /**
   * Get bank wallets
   */
  async getBankWallets(): Promise<Wallet[]> {
    const wallets = await this.getWallets();
    return wallets.filter((w) => w.type === WalletType.BANK);
  }

  /**
   * Calculate total balance
   */
  async getTotalBalance(): Promise<number> {
    const wallets = await this.getWallets();
    return wallets.reduce((sum, wallet) => sum + wallet.balance, 0);
  }

  /**
   * Get wallet statistics
   */
  async getWalletStats(): Promise<WalletStats> {
    const wallets = await this.getWallets();
    const totalBalance = wallets.reduce((sum, w) => sum + w.balance, 0);
    const allTransactions = await Promise.all(
      wallets.map((w) => this.getWalletTransactions(w.id))
    );
    const flatTransactions = allTransactions.flat();
    const totalTransactions = flatTransactions.length;
    const averageTransactionAmount =
      totalTransactions > 0
        ? flatTransactions.reduce((sum, t) => sum + t.amount, 0) / totalTransactions
        : 0;

    return {
      totalBalance,
      totalTransactions,
      averageTransactionAmount,
    };
  }

  /**
   * Check if wallet is verified
   */
  async isWalletVerified(id: string): Promise<boolean> {
    const wallet = await this.getWallet(id);
    return wallet.isVerified;
  }

  /**
   * Get verified wallets
   */
  async getVerifiedWallets(): Promise<Wallet[]> {
    const wallets = await this.getWallets();
    return wallets.filter((w) => w.isVerified);
  }

  /**
   * Validate wallet address format
   */
  async validateWalletAddress(address: string, type: WalletType): Promise<boolean> {
    const endpoint = `${API_ENDPOINTS.WALLETS.LIST}/validate`;
    try {
      const response = await apiService.post<{ isValid: boolean }>(endpoint, {
        address,
        type,
      });
      return response.data?.isValid || false;
    } catch {
      return false;
    }
  }

  /**
   * Get wallet by currency
   */
  async getWalletByCurrency(currency: string): Promise<Wallet | null> {
    const wallets = await this.getWallets();
    return wallets.find((w) => w.currency === currency) || null;
  }

  /**
   * Check if wallet has sufficient balance
   */
  async hasSufficientBalance(id: string, amount: number): Promise<boolean> {
    const balance = await this.getWalletBalance(id);
    return balance >= amount;
  }
}

export const walletService = new WalletService();
export default WalletService;
