// types/profile.ts
export interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  location: string;
  profilePicture?: string;
  role?: string;
}

export interface Education {
  id: number;
  seekerId: number;
  institution: string;
  degree: string;
  fieldOfStudy: string;
  startDate: string;
  endDate: string;
  grade?: string;
  description?: string;
}

export interface Experience {
  id: number;
  seekerId: number;
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  isCurrent: boolean;
  description?: string;
  location: string;
}

export interface Project {
  id: number;
  seekerId: number;
  title: string;
  description: string;
  technologies: string[];
  startDate: string;
  endDate: string;
  githubUrl?: string;
  liveUrl?: string;
  isActive: boolean;
}

export interface Preferences {
  id: number;
  seekerId: number;
  preferredRoles: string[];
  preferredJobTypes: string[];
  preferredLocations: string[];
  salaryExpectationMin: number;
  salaryExpectationMax: number;
  remoteWork: boolean;
  willingToRelocate: boolean;
}

export interface ProfileStatus {
  basicDetails: boolean;
  jobSeekerProfile: boolean;
  education: boolean;
  experience: boolean;
  projects: boolean;
  preferences: boolean;
  nextStep: string;
  completionPercentage: number;
  isComplete: boolean;
  sectionsCompleted: number;
  totalSections: number;
}

export interface JobSeekerProfileData {
  id: number;
  resume?: string;
  linkedin?: string;
  github?: string;
  skills: string[];
  createdAt: string;
  updatedAt: string;
  user: User;
  education: Education[];
  experience: Experience[];
  projects: Project[];
  preferences: Preferences;
}
