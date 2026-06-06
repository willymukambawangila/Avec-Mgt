/**
 * Payment service
 */

import { apiService } from './api';
import { Payment, PaymentStatus, PaymentMethod, PaginatedResponse } from '@/types';
import { API_ENDPOINTS } from '@/constants';

interface CreatePaymentRequest {
  loanId: string;
  amount: number;
  paymentMethod: PaymentMethod;
  currency: string;
}

interface ProcessPaymentRequest {
  transactionHash?: string;
  walletAddress?: string;
}

interface PaymentFilterOptions {
  loanId?: string;
  status?: PaymentStatus;
  page?: number;
  pageSize?: number;
}

class PaymentService {
  /**
   * Get all payments
   */
  async getPayments(filters?: PaymentFilterOptions): Promise<PaginatedResponse<Payment>> {
    const params = new URLSearchParams();

    if (filters) {
      if (filters.loanId) params.append('loanId', filters.loanId);
      if (filters.status) params.append('status', filters.status);
      if (filters.page) params.append('page', filters.page.toString());
      if (filters.pageSize) params.append('pageSize', filters.pageSize.toString());
    }

    const endpoint = `${API_ENDPOINTS.PAYMENTS.LIST}?${params.toString()}`;
    const response = await apiService.get<PaginatedResponse<Payment>>(endpoint);
    return response.data!;
  }

  /**
   * Get single payment by ID
   */
  async getPayment(id: string): Promise<Payment> {
    const endpoint = API_ENDPOINTS.PAYMENTS.GET.replace(':id', id);
    const response = await apiService.get<Payment>(endpoint);
    return response.data!;
  }

  /**
   * Create new payment
   */
  async createPayment(data: CreatePaymentRequest): Promise<Payment> {
    const response = await apiService.post<Payment>(API_ENDPOINTS.PAYMENTS.CREATE, data);
    return response.data!;
  }

  /**
   * Process payment
   */
  async processPayment(id: string, data: ProcessPaymentRequest): Promise<Payment> {
    const endpoint = API_ENDPOINTS.PAYMENTS.PROCESS.replace(':id', id);
    const response = await apiService.post<Payment>(endpoint, data);
    return response.data!;
  }

  /**
   * Get payments for loan
   */
  async getLoanPayments(loanId: string): Promise<Payment[]> {
    const response = await this.getPayments({ loanId });
    return response.data;
  }

  /**
   * Get pending payments
   */
  async getPendingPayments(): Promise<Payment[]> {
    const response = await this.getPayments({ status: PaymentStatus.PENDING });
    return response.data;
  }

  /**
   * Get overdue payments
   */
  async getOverduePayments(): Promise<Payment[]> {
    const endpoint = `${API_ENDPOINTS.PAYMENTS.LIST}/overdue`;
    const response = await apiService.get<PaginatedResponse<Payment>>(endpoint);
    return response.data?.data || [];
  }

  /**
   * Calculate payment schedule
   */
  async calculatePaymentSchedule(
    loanId: string
  ): Promise<{ totalPayments: number; nextPaymentDate: Date }> {
    const endpoint = `${API_ENDPOINTS.PAYMENTS.LIST}/${loanId}/schedule`;
    const response = await apiService.get<{ totalPayments: number; nextPaymentDate: Date }>(
      endpoint
    );
    return response.data!;
  }

  /**
   * Get payment statistics
   */
  async getPaymentStats(loanId: string): Promise<{
    totalPaid: number;
    totalPending: number;
    totalDue: number;
  }> {
    const endpoint = `${API_ENDPOINTS.PAYMENTS.LIST}/${loanId}/stats`;
    const response = await apiService.get<{
      totalPaid: number;
      totalPending: number;
      totalDue: number;
    }>(endpoint);
    return response.data!;
  }

  /**
   * Retry failed payment
   */
  async retryPayment(id: string): Promise<Payment> {
    const endpoint = `${API_ENDPOINTS.PAYMENTS.LIST}/${id}/retry`;
    const response = await apiService.post<Payment>(endpoint);
    return response.data!;
  }

  /**
   * Check if payment is due
   */
  async isPaymentDue(paymentId: string): Promise<boolean> {
    const payment = await this.getPayment(paymentId);
    const now = new Date();
    return now >= payment.dueDate && payment.status === PaymentStatus.PENDING;
  }

  /**
   * Get days until payment due
   */
  async getDaysTillDue(paymentId: string): Promise<number> {
    const payment = await this.getPayment(paymentId);
    const now = new Date();
    const diff = payment.dueDate.getTime() - now.getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  }
}

export const paymentService = new PaymentService();
export default PaymentService;
