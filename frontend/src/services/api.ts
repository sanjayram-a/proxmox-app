import axios, { AxiosInstance, AxiosError } from 'axios';
import {
  TokenResponse,
  ApiResponse,
  LoginCredentials,
  VMCreateData,
  VMUpdateData,
  VMActionData,
  ProfileUpdateData,
  VMMetricsResponse,
  User,
  VM,
} from '../types';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

class ApiService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: API_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Add token to requests if available
    this.api.interceptors.request.use((config) => {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });
  }

  // Generic HTTP methods
  async get<T = any>(url: string): Promise<T> {
    try {
      const response = await this.api.get<T>(url);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async post<T = any>(url: string, data: unknown): Promise<T> {
    try {
      const response = await this.api.post<T>(url, data);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async put<T = any>(url: string, data: unknown): Promise<T> {
    try {
      const response = await this.api.put<T>(url, data);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async delete<T>(url: string): Promise<T> {
    try {
      const response = await this.api.delete<T>(url);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Auth endpoints
  async login(credentials: LoginCredentials): Promise<TokenResponse> {
    return this.post<TokenResponse>('/auth/login', credentials);
  }

  async register(data: {
    username: string;
    email: string;
    password: string;
    full_name?: string;
  }): Promise<User> {
    return this.post('/auth/register', data);
  }

  async getCurrentUser() {
    return this.get<User>('/auth/me');
  }

  async updateProfile(data: ProfileUpdateData) {
    return this.put<User>('/auth/me', data);
  }

  // VM endpoints
  async getVMs() {
    return this.get<VM[]>('/vm/');
  }

  async createVM(data: VMCreateData) {
    return this.post<VM>('/vm/', data);
  }

  async updateVM(vmId: number, data: VMUpdateData) {
    return this.put<VM>(`/vm/${vmId}`, data);
  }

  async performVMAction(vmId: number, data: VMActionData) {
    return this.post<VM>(`/vm/${vmId}/action`, data);
  }

  async deleteVM(vmId: number) {
    return this.delete<void>(`/vm/${vmId}`);
  }

  // VM Metrics
  async getVMMetrics(vmId: number): Promise<VMMetricsResponse> {
    return this.get<VMMetricsResponse>(`/vm/${vmId}/metrics`);
  }

  // Error handling
  private handleError(error: unknown) {
    if (error instanceof AxiosError) {
      if (error.response?.status === 401) {
        // Clear token on authentication error
        localStorage.removeItem('token');
      }

      const message = error.response?.data?.detail || error.message;
      throw new Error(message);
    }
    throw error;
  }
}

const api = new ApiService();
export default api;
