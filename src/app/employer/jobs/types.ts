// Enhanced Field Types with better validation
export enum FieldType {
  TEXT = "TEXT",
  NUMBER = "NUMBER",
  EMAIL = "EMAIL",
  PHONE = "PHONE",
  LOCATION = "LOCATION",
  RESUME_URL = "RESUME_URL",
  FILE = "FILE",
  TEXTAREA = "TEXTAREA",
  SELECT = "SELECT",
  MULTISELECT = "MULTISELECT",
  CHECKBOX = "CHECKBOX",
  DATE = "DATE",
  YEARS_OF_EXPERIENCE = "YEARS_OF_EXPERIENCE",
}

export type FieldTypeValue = `${FieldType}`;

// Job Status enum for better type safety
export enum JobStatus {
  ACTIVE = "ACTIVE",
  PAUSED = "PAUSED",
  COMPLETED = "COMPLETED",
  DRAFT = "DRAFT"
}

export type JobStatusValue = `${JobStatus}`;

// Job Type enum
export enum JobType {
  FULL_TIME = "FULL_TIME",
  PART_TIME = "PART_TIME",
  INTERNSHIP = "INTERNSHIP",
  CONTRACT = "CONTRACT"
}

export type JobTypeValue = `${JobType}`;

// Enhanced JobFormField interface with validation
export interface JobFormField {
  id?: number;
  jobId?: number;
  fieldType: FieldTypeValue;
  label: string;
  isRequired: boolean;
  isDefault?: boolean;
  options?: string[];
  order: number;
  placeholder?: string;
  description?: string;
  minLength?: number;
  maxLength?: number;
  pattern?: string; // For regex validation
  createdAt?: string;
  updatedAt?: string;
}

// Validation rules for form fields
// export interface FieldValidationRule {
//   required?: boolean;
//   minLength?: number;
//   maxLength?: number;
//   pattern?: RegExp;
//   customValidator?: (value: any) => boolean | string;
// }

// export interface FieldValidationRules {
//   [FieldType.TEXT]: FieldValidationRule;
//   [FieldType.EMAIL]: FieldValidationRule;
//   [FieldType.PHONE]: FieldValidationRule;
//   [FieldType.TEXTAREA]: FieldValidationRule;
//   [FieldType.NUMBER]: FieldValidationRule;
//   [FieldType.YEARS_OF_EXPERIENCE]: FieldValidationRule;
//   [FieldType.LOCATION]: FieldValidationRule;
//   [FieldType.RESUME_URL]: FieldValidationRule;
//   [FieldType.FILE]: FieldValidationRule;
//   [FieldType.SELECT]: FieldValidationRule;
//   [FieldType.MULTISELECT]: FieldValidationRule;
//   [FieldType.CHECKBOX]: FieldValidationRule;
//   [FieldType.DATE]: FieldValidationRule;
// }

// // Enhanced Company interface
export interface Company {
  id: number;
  name: string;
  profilePicture?: string;
  industry?: string;
  description?: string;
  website?: string;
  location?: string;
  size?: string;
  founded?: string;
  createdAt: string;
  updatedAt?: string;
}

// Enhanced Job interface with better typing
export interface Job {
  id: number;
  title: string;
  role?: string;
  description: string;
  requirements?: string;
  location?: string;
  jobType: JobTypeValue;
  salaryMin?: number;
  salaryMax?: number;
  noOfOpenings?: number;
  status: JobStatusValue;
  totalApplications: number;
  pendingApplications?: number;
  rejectedApplications?: number;
  acceptedApplications?: number;
  createdAt: string;
  updatedAt?: string;
  expiresAt?: string;
  companyId?: number;
  employerId?: number;
  company?: Company;
  _count?: {
    applications: number;
    formFields?: number;
  };
  tags?: string[];
  isRemote?: boolean;
  benefits?: string[];
  skills?: string[];
}

// Enhanced JobForm interface with validation
export interface JobForm {
  title: string;
  role: string;
  description: string;
  requirements: string;
  location: string;
  jobType: JobTypeValue;
  salaryMin: number | "";
  salaryMax: number | "";
  noOfOpenings: number | "";
  isRemote?: boolean;
  expiresAt?: string;
  tags?: string[];
  benefits?: string[];
  skills?: string[];
}

// Form validation errors
export interface JobFormErrors {
  title?: string;
  role?: string;
  description?: string;
  requirements?: string;
  location?: string;
  jobType?: string;
  salaryMin?: string;
  salaryMax?: string;
  noOfOpenings?: string;
  expiresAt?: string;
  general?: string;
}

// API Response interfaces with better error handling
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  errors?: Record<string, string[]>;
  meta?: {
    timestamp: string;
    requestId?: string;
  };
}

// Enhanced pagination interface
export interface Pagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
  hasNext: boolean;
  hasPrev: boolean;
  offset: number;
}

// Jobs response with enhanced pagination
export interface JobsResponse {
  jobs: Job[];
  pagination: Pagination;
  filters?: {
    status?: JobStatusValue;
    jobType?: JobTypeValue;
    search?: string;
    location?: string;
  };
  stats?: {
    totalJobs: number;
    activeJobs: number;
    pausedJobs: number;
    completedJobs: number;
  };
}

// Job form response
export interface JobFormResponse {
  fields: JobFormField[];
  metadata?: {
    totalFields: number;
    requiredFields: number;
    defaultFields: number;
  };
}

// Search and filter interfaces
export interface JobSearchParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: JobStatusValue;
  jobType?: JobTypeValue;
  location?: string;
  salaryMin?: number;
  salaryMax?: number;
  sortBy?: 'createdAt' | 'updatedAt' | 'title' | 'applications';
  sortOrder?: 'asc' | 'desc';
}

export interface SearchFilters {
  searchTerm: string;
  statusFilter: JobStatusValue | 'All Status';
  jobTypeFilter: JobTypeValue | 'All Types';
  locationFilter: string;
  salaryRange: {
    min: number | '';
    max: number | '';
  };
}

// // Application related interfaces
// export interface JobApplication {
//   id: number;
//   jobId: number;
//   applicantId: number;
//   status: 'PENDING' | 'REVIEWED' | 'SHORTLISTED' | 'REJECTED' | 'ACCEPTED';
//   appliedAt: string;
//   reviewedAt?: string;
//   notes?: string;
//   applicant?: {
//     id: number;
//     name: string;
//     email: string;
//     phone?: string;
//     resumeUrl?: string;
//   };
//   formData?: Record<string, any>;
// }

// Statistics interfaces
export interface JobStats {
  totalViews: number;
  totalApplications: number;
  applicationsByStatus: {
    pending: number;
    reviewed: number;
    shortlisted: number;
    rejected: number;
    accepted: number;
  };
  applicationsByDay: {
    date: string;
    count: number;
  }[];
  averageResponseTime?: number;
  conversionRate?: number;
}

export interface DashboardStats {
  totalJobs: number;
  activeJobs: number;
  totalApplications: number;
  pendingApplications: number;
  jobsByStatus: {
    [key in JobStatusValue]: number;
  };
  recentActivity: {
    type: 'job_created' | 'application_received' | 'job_updated' | 'application_reviewed';
    message: string;
    timestamp: string;
  }[];
}

// Utility types
export type CreateJobRequest = Omit<Job, 'id' | 'createdAt' | 'updatedAt' | 'totalApplications' | 'company' | '_count'>;
export type UpdateJobRequest = Partial<CreateJobRequest>;
export type JobFormFieldCreate = Omit<JobFormField, 'id' | 'createdAt' | 'updatedAt'>;
export type JobFormFieldUpdate = Partial<JobFormFieldCreate>;

// Loading and error state types
export interface LoadingState {
  isLoading: boolean;
  loadingMessage?: string;
}

export interface ErrorState {
  hasError: boolean;
  error: Error | null;
  errorCode?: string;
}

export interface AsyncState<T> extends LoadingState, ErrorState {
  data: T | null;
  lastFetched?: string;
}

// Modal and UI state types
// export interface ModalState {
//   isOpen: boolean;
//   data?: any;
//   mode?: 'create' | 'edit' | 'view' | 'delete';
// }

// export interface UIState {
//   sidebarOpen: boolean;
//   theme: 'light' | 'dark' | 'system';
//   notifications: Notification[];
//   modals: {
//     jobCreate: ModalState;
//     jobForm: ModalState;
//     jobPreview: ModalState;
//     statusUpdate: ModalState;
//     deleteConfirm: ModalState;
//   };
// }

export interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  action?: {
    label: string;
    onClick: () => void;
  };
}

// Form step types for multi-step forms
// export interface FormStep {
//   id: string;
//   title: string;
//   description?: string;
//   isComplete: boolean;
//   isActive: boolean;
//   component: React.ComponentType<any>;
// }

// export interface MultiStepFormState {
//   currentStep: number;
//   steps: FormStep[];
//   formData: Record<string, any>;
//   canGoBack: boolean;
//   canGoNext: boolean;
//   isSubmitting: boolean;
// }

// // Export all types for easy importing
// export type {
//   FieldTypeValue,
//   JobStatusValue,
//   JobTypeValue,
//   JobFormField,
//   Job,
//   JobForm,
//   JobFormErrors,
//   Company,
//   ApiResponse,
//   JobsResponse,
//   JobFormResponse,
//   Pagination,
//   JobSearchParams,
//   SearchFilters,
//   JobApplication,
//   JobStats,
//   DashboardStats,
//   CreateJobRequest,
//   UpdateJobRequest,
//   JobFormFieldCreate,
//   JobFormFieldUpdate,
//   LoadingState,
//   ErrorState,
//   AsyncState,
//   ModalState,
//   UIState,
//   Notification,
//   FormStep,
//   MultiStepFormState,
// };

// Default values and constants
export const DEFAULT_PAGINATION: Pagination = {
  page: 1,
  limit: 10,
  total: 0,
  pages: 0,
  hasNext: false,
  hasPrev: false,
  offset: 0,
};

export const DEFAULT_SEARCH_PARAMS: JobSearchParams = {
  page: 1,
  limit: 10,
  sortBy: 'createdAt',
  sortOrder: 'desc',
};

export const FIELD_TYPE_LABELS: Record<FieldType, string> = {
  [FieldType.TEXT]: "Text Input",
  [FieldType.NUMBER]: "Number",
  [FieldType.EMAIL]: "Email",
  [FieldType.PHONE]: "Phone",
  [FieldType.LOCATION]: "Location",
  [FieldType.RESUME_URL]: "Resume URL",
  [FieldType.FILE]: "File Upload",
  [FieldType.TEXTAREA]: "Text Area",
  [FieldType.SELECT]: "Dropdown",
  [FieldType.MULTISELECT]: "Multi Select",
  [FieldType.CHECKBOX]: "Checkbox",
  [FieldType.DATE]: "Date",
  [FieldType.YEARS_OF_EXPERIENCE]: "Years of Experience",
};

export const JOB_STATUS_COLORS: Record<JobStatus, string> = {
  [JobStatus.ACTIVE]: "bg-green-100 text-green-800 border-green-200",
  [JobStatus.PAUSED]: "bg-yellow-100 text-yellow-800 border-yellow-200",
  [JobStatus.COMPLETED]: "bg-gray-100 text-gray-800 border-gray-200",
  [JobStatus.DRAFT]: "bg-blue-100 text-blue-800 border-blue-200",
};
