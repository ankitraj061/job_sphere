import { toast } from 'sonner';
import axios, { AxiosError } from 'axios';
import { EmployerApiResponse } from './types';

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

class EmployerDashboardApiService {
  private cache: Map<string, { data: EmployerApiResponse; timestamp: number }> = new Map();
  private cacheTimeout = 5 * 60 * 1000; // 5 minutes

  private getCacheKey(endpoint: string): string {
    return `employer_dashboard_${endpoint}`;
  }

  private isValidCache(cacheKey: string): boolean {
    const cached = this.cache.get(cacheKey);
    if (!cached) return false;
    return Date.now() - cached.timestamp < this.cacheTimeout;
  }

  private setCache(cacheKey: string, data: EmployerApiResponse): void {
    this.cache.set(cacheKey, { data, timestamp: Date.now() });
  }

  private handleAxiosError(error: AxiosError, loadingToastId?: string | number): never {
    let errorMessage = 'Unexpected Error';
    let description = 'Please try again later';

    if (error.response) {
      const { status, data } = error.response;
      switch (status) {
        case 401:
          errorMessage = 'Authentication Failed';
          description = 'Please login again';
          break;
        case 403:
          errorMessage = 'Access Denied';
          description = 'You do not have access';
          break;
        case 404:
          errorMessage = 'Not Found';
          description = 'Resource not found';
          break;
        case 500:
          errorMessage = 'Server Error';
          description = 'Something went wrong';
          break;
        default:
          errorMessage = `Error ${status}`;
          description = (data as { message?: string })?.message || 'Unknown server error';
      }
    } else if (error.request) {
      errorMessage = 'Network Error';
      description = 'Check your internet connection';
    } else {
      errorMessage = 'Request Error';
      description = error.message || 'Failed to send request';
    }

    if (loadingToastId) {
      toast.error(errorMessage, { id: loadingToastId, description });
    } else {
      toast.error(errorMessage, { description });
    }

    throw new Error(`${errorMessage}: ${description}`);
  }

  async getDashboardData(forceRefresh = false): Promise<EmployerApiResponse> {
    const cacheKey = this.getCacheKey('complete');

    if (!forceRefresh && this.isValidCache(cacheKey)) {
      return this.cache.get(cacheKey)!.data;
    }

    const loadingToastId = toast.loading('Loading employer dashboard...', {
      description: 'Fetching hiring analytics',
      duration: 10000,
    });

    try {
      const response = await axios.get(`${backendUrl}/api/employer/dashboard`, {
        withCredentials: true,
        timeout: 30000,
      });

      const data: EmployerApiResponse = response.data;

      if (!data.success) throw new Error(data.message || 'Unsuccessful response');

      this.setCache(cacheKey, data);

      toast.success('Employer dashboard loaded', {
        id: loadingToastId,
        description: 'Analytics updated',
      });

      return data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        this.handleAxiosError(error, loadingToastId);
      }
      throw error;
    }
  }

  async refreshDashboard(): Promise<EmployerApiResponse> {
    const toastId = toast.loading('Refreshing employer dashboard...');
    try {
      const data = await this.getDashboardData(true);
      toast.success('Refreshed successfully', { id: toastId });
      return data;
    } catch (err) {
      toast.error('Failed to refresh', { id: toastId });
      throw err;
    }
  }

  getCachedData(): EmployerApiResponse | null {
    const key = this.getCacheKey('complete');
    if (this.isValidCache(key)) return this.cache.get(key)!.data;
    return null;
  }

  isDataStale(): boolean {
    const key = this.getCacheKey('complete');
    return !this.isValidCache(key);
  }

  clearCache(): void {
    this.cache.clear();
    toast.info('Employer dashboard cache cleared');
  }
}

export const employerDashboardApi = new EmployerDashboardApiService();