// utils/profileApi.ts
import axios, { AxiosResponse } from 'axios';
import { JobSeekerProfileData, ProfileStatus } from './types';
import { showErrorToast } from './toasts';

const backendURL = process.env.NEXT_PUBLIC_BACKEND_URL;

if (!backendURL) {
  throw new Error('NEXT_PUBLIC_BACKEND_URL is not defined in environment variables');
}

const apiClient = axios.create({
  baseURL: backendURL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Response type definitions
interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Only show error toast if it's not handled by promiseToast
    if (!error.config?.skipGlobalErrorToast) {
      if (error.response?.data?.message) {
        showErrorToast('Error', error.response.data.message);
      } else if (error.message) {
        showErrorToast('Network Error', error.message);
      } else {
        showErrorToast('Error', 'Something went wrong. Please try again.');
      }
    }
    return Promise.reject(error);
  }
);

export const fetchProfileData = async (): Promise<ApiResponse<JobSeekerProfileData>> => {
  const response: AxiosResponse<ApiResponse<JobSeekerProfileData>> = await apiClient.get('/api/jobseeker/profile');
  return response.data;
};

export const fetchProfileStatus = async (): Promise<ApiResponse<{ user: unknown; profileStatus: ProfileStatus }>> => {
  const response = await apiClient.get('/api/jobseeker/profile-status');
  return response.data;
};

export const updateBasicDetails = async (data: Partial<{
  name: string;
  phone: string;
  location: string;
  profilePicture: string;
}>): Promise<ApiResponse<unknown>> => {
  const response = await apiClient.put('/api/jobseeker/basic-details', data);
  return response.data;
};

export const updateJobSeekerProfile = async (data: {
  resume?: string;
  linkedin?: string;
  github?: string;
  skills: string[];
}): Promise<ApiResponse<unknown>> => {
  const response = await apiClient.put('/api/jobseeker/profile', data);
  return response.data;
};

export const addEducation = async (data: Omit<Education, 'id' | 'seekerId'>): Promise<ApiResponse<unknown>> => {
  const response = await apiClient.post('/api/jobseeker/education', data);
  return response.data;
};

export const updateEducation = async (id: number, data: Omit<Education, 'id' | 'seekerId'>): Promise<ApiResponse<unknown>> => {
  const response = await apiClient.put(`/api/jobseeker/education/${id}`, data);
  return response.data;
};

export const deleteEducation = async (id: number): Promise<ApiResponse<unknown>> => {
  const response = await apiClient.delete(`/api/jobseeker/education/${id}`);
  return response.data;
};

export const addExperience = async (data: Omit<Experience, 'id' | 'seekerId'>): Promise<ApiResponse<unknown>> => {
  const response = await apiClient.post('/api/jobseeker/experience', data);
  return response.data;
};

export const updateExperience = async (id: number, data: Omit<Experience, 'id' | 'seekerId'>): Promise<ApiResponse<unknown>> => {
  const response = await apiClient.put(`/api/jobseeker/experience/${id}`, data);
  return response.data;
};

export const deleteExperience = async (id: number): Promise<ApiResponse<unknown>> => {
  const response = await apiClient.delete(`/api/jobseeker/experience/${id}`);
  return response.data;
};

export const addProject = async (data: Omit<Project, 'id' | 'seekerId'>): Promise<ApiResponse<unknown>> => {
  const response = await apiClient.post('/api/jobseeker/project', data);
  return response.data;
};

export const updateProject = async (id: number, data: Omit<Project, 'id' | 'seekerId'>): Promise<ApiResponse<unknown>> => {
  const response = await apiClient.put(`/api/jobseeker/project/${id}`, data);
  return response.data;
};

export const deleteProject = async (id: number): Promise<ApiResponse<unknown>> => {
  const response = await apiClient.delete(`/api/jobseeker/project/${id}`);
  return response.data;
};

export const updatePreferences = async (data: Omit<Preferences, 'id' | 'seekerId'>): Promise<ApiResponse<unknown>> => {
  const response = await apiClient.put('/api/jobseeker/preferences', data);
  return response.data;
};

// Import types properly
import { Education, Experience, Project, Preferences } from './types';
