/**
 * Loan service
 */

import { apiService } from './api';
import { Loan, LoanStatus, LoanFilterOptions, PaginatedResponse } from '@/types';
import { API_ENDPOINTS } from '@/constants';

interface CreateLoanRequest {
  borrowerId: string;
  amount: number;
  currency: string;
  interestRate: number;
  term: number;
}

interface UpdateLoanRequest {
  status?: LoanStatus;
  interestRate?: number;
}

class LoanService {
  /**
   * Get all loans with filters
   */
  async getLoans(filters?: LoanFilterOptions): Promise<PaginatedResponse<Loan>> {
    const params = new URLSearchParams();
    
    if (filters) {
      if (filters.page) params.append('page', filters.page.toString());
      if (filters.pageSize) params.append('pageSize', filters.pageSize.toString());
      if (filters.status) params.append('status', filters.status);
      if (filters.minAmount) params.append('minAmount', filters.minAmount.toString());
      if (filters.maxAmount) params.append('maxAmount', filters.maxAmount.toString());
      if (filters.search) params.append('search', filters.search);
    }

    const endpoint = `${API_ENDPOINTS.LOANS.LIST}?${params.toString()}`;
    const response = await apiService.get<PaginatedResponse<Loan>>(endpoint);
    return response.data!;
  }

  /**
   * Get single loan by ID
   */
  async getLoan(id: string): Promise<Loan> {
    const endpoint = API_ENDPOINTS.LOANS.GET.replace(':id', id);
    const response = await apiService.get<Loan>(endpoint);
    return response.data!;
  }

  /**
   * Create new loan
   */
  async createLoan(data: CreateLoanRequest): Promise<Loan> {
    const response = await apiService.post<Loan>(API_ENDPOINTS.LOANS.CREATE, data);
    return response.data!;
  }

  /**
   * Update loan
   */
  async updateLoan(id: string, data: UpdateLoanRequest): Promise<Loan> {
    const endpoint = API_ENDPOINTS.LOANS.UPDATE.replace(':id', id);
    const response = await apiService.put<Loan>(endpoint, data);
    return response.data!;
  }

  /**
   * Approve loan
   */
  async approveLoan(id: string): Promise<Loan> {
    const endpoint = API_ENDPOINTS.LOANS.APPROVE.replace(':id', id);
    const response = await apiService.post<Loan>(endpoint);
    return response.data!;
  }

  /**
   * Reject loan
   */
  async rejectLoan(id: string, reason?: string): Promise<Loan> {
    const endpoint = API_ENDPOINTS.LOANS.REJECT.replace(':id', id);
    const response = await apiService.post<Loan>(endpoint, { reason });
    return response.data!;
  }

  /**
   * Get user's loans
   */
  async getUserLoans(userId: string, role: 'borrower' | 'lender'): Promise<Loan[]> {
    const endpoint = `${API_ENDPOINTS.LOANS.LIST}?userId=${userId}&role=${role}`;
    const response = await apiService.get<PaginatedResponse<Loan>>(endpoint);
    return response.data?.data || [];
  }

  /**
   * Calculate loan details
   */
  async calculateLoanDetails(
    amount: number,
    rate: number,
    termMonths: number
  ): Promise<{ monthlyPayment: number; totalInterest: number }> {
    const endpoint = `${API_ENDPOINTS.LOANS.LIST}/calculate`;
    const response = await apiService.post<{ monthlyPayment: number; totalInterest: number }>(
      endpoint,
      { amount, rate, termMonths }
    );
    return response.data!;
  }

  /**
   * Get loan status
   */
  async getLoanStatus(id: string): Promise<LoanStatus> {
    const loan = await this.getLoan(id);
    return loan.status;
  }

  /**
   * Check if loan is active
   */
  async isLoanActive(id: string): Promise<boolean> {
    const status = await this.getLoanStatus(id);
    return status === LoanStatus.ACTIVE;
  }

  /**
   * Get pending loans for admin
   */
  async getPendingLoans(): Promise<Loan[]> {
    const response = await this.getLoans({ status: LoanStatus.PENDING });
    return response.data;
  }

  /**
   * Search loans
   */
  async searchLoans(query: string): Promise<Loan[]> {
    const response = await this.getLoans({ search: query });
    return response.data;
  }
}

export const loanService = new LoanService();
export default LoanService;
