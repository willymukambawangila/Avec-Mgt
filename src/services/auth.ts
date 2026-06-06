/**
 * Authentication service
 */

import { apiService } from './api';
import { User } from '@/types';
import { API_ENDPOINTS } from '@/constants';
import config from '@/config';

interface LoginRequest {
  email: string;
  password: string;
}

interface LoginResponse {
  user: User;
  token: string;
  refreshToken: string;
}

interface RegisterRequest {
  email: string;
  name: string;
  password: string;
  phone?: string;
}

class AuthService {
  /**
   * Login user
   */
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    const response = await apiService.post<LoginResponse>(
      API_ENDPOINTS.AUTH.LOGIN,
      credentials
    );

    if (response.data) {
      this.storeTokens(response.data.token, response.data.refreshToken);
    }

    return response.data!;
  }

  /**
   * Register new user
   */
  async register(data: RegisterRequest): Promise<User> {
    const response = await apiService.post<User>(
      API_ENDPOINTS.AUTH.REGISTER,
      data
    );
    return response.data!;
  }

  /**
   * Logout user
   */
  async logout(): Promise<void> {
    try {
      await apiService.post(API_ENDPOINTS.AUTH.LOGOUT);
    } finally {
      this.clearTokens();
    }
  }

  /**
   * Refresh token
   */
  async refreshToken(): Promise<string> {
    const refreshToken = this.getRefreshToken();
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    const response = await apiService.post<{ token: string }>(
      API_ENDPOINTS.AUTH.REFRESH,
      { refreshToken }
    );

    if (response.data) {
      this.storeToken(response.data.token);
    }

    return response.data!.token;
  }

  /**
   * Get current user
   */
  async getCurrentUser(): Promise<User> {
    const response = await apiService.get<User>('/api/auth/me');
    return response.data!;
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  /**
   * Get stored token
   */
  getToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(config.auth.tokenKey);
  }

  /**
   * Get refresh token
   */
  getRefreshToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(config.auth.refreshTokenKey);
  }

  /**
   * Store tokens
   */
  private storeTokens(token: string, refreshToken: string): void {
    this.storeToken(token);
    if (typeof window !== 'undefined') {
      localStorage.setItem(config.auth.refreshTokenKey, refreshToken);
    }
  }

  /**
   * Store token
   */
  private storeToken(token: string): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem(config.auth.tokenKey, token);
    }
  }

  /**
   * Clear tokens
   */
  private clearTokens(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(config.auth.tokenKey);
      localStorage.removeItem(config.auth.refreshTokenKey);
    }
  }
}

export const authService = new AuthService();
export default AuthService;
