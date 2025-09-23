// types.ts
export enum FieldType {
  TEXT = "TEXT",
  NUMBER = "NUMBER",
  EMAIL = "EMAIL",
  PHONE = "PHONE",
  LOCATION = "LOCATION",
  RESUME_URL = "RESUME_URL",
  FILE = "FILE", // Added missing FILE type
  TEXTAREA = "TEXTAREA",
  SELECT = "SELECT",
  MULTISELECT = "MULTISELECT",
  CHECKBOX = "CHECKBOX",
  DATE = "DATE",
  YEARS_OF_EXPERIENCE = "YEARS_OF_EXPERIENCE",
}

export type FieldTypeValue = `${FieldType}`;

export interface JobFormField {
  id?: number;
  jobId?: number;
  fieldType: FieldTypeValue;
  label: string;
  isRequired: boolean; // Changed from 'required' to match API
  isDefault?: boolean;
  options?: string[];
  order: number;
}

export interface Job {
  id: number;
  title: string;
  role?: string;
  description: string;
  requirements?: string;
  location?: string;
  jobType: string;
  salaryMin?: number;
  salaryMax?: number;
  noOfOpenings?: number;
  status: string;
  totalApplications: number;
  createdAt: string;
  updatedAt?: string;
  companyId?: number;
  employerId?: number;
  company?: {
    id: number;
    name: string;
    profilePicture?: string;
    industry?: string;
  };
  _count?: {
    applications: number;
  };
  pendingApplications?: number;
}

export interface JobForm {
  title: string;
  role: string;
  description: string;
  requirements: string;
  location: string;
  jobType: string;
  salaryMin: number | "";
  salaryMax: number | "";
  noOfOpenings: number | ""; // Changed from 'openings' to match API
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
}

export interface JobsResponse {
  jobs: Job[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface JobFormResponse {
  fields: JobFormField[];
}
