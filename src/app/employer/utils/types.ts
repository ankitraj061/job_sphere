// types/employer.ts

export interface EmployerProfile {
  id: number;
  name: string;
  email: string;
  phone?: string;
  companyId: number;
  designation?: string;
  createdAt: string;
  updatedAt: string;
}

export interface EmployerCompany {
  id: number;
  name: string;
  industry: string;
  location?: string;
  size?: string;
  website?: string;
  createdAt: string;
  updatedAt: string;
}

export interface EmployerJobPosting {
  id: number;
  title: string;
  description: string;
  requirements: string[];
  location: string;
  employmentType: "full-time" | "part-time" | "internship" | "contract";
  salaryRange?: {
    min: number;
    max: number;
    currency: string;
  };
  postedAt: string;
  deadline?: string;
  status: "active" | "closed" | "draft";
  totalApplicants: number;
}

export interface EmployerApplication {
  id: number;
  applicantId: number;
  jobId: number;
  status:
    | "applied"
    | "shortlisted"
    | "interviewed"
    | "accepted"
    | "rejected"
    | "withdrawn";
  appliedAt: string;
  updatedAt: string;
}

export interface EmployerStats {
  totalJobs: number;
  activeJobs: number;
  totalApplicants: number;
  interviewsScheduled: number;
  hiresMade: number;
}

export interface EmployerData {
  profile: EmployerProfile;
  company: EmployerCompany;
  jobs: EmployerJobPosting[];
  applications: EmployerApplication[];
  stats: EmployerStats;
}

export interface EmployerApiResponse {
  success: boolean;
  message: string;
  data: EmployerData;
}
