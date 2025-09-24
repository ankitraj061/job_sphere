import { useState, useEffect } from 'react';
import axios from 'axios';

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

interface Error{
  message: string
}

export type Company = {
  id: string;
  name: string;
  description?: string;
  website?: string;
  profilePicture?: string;
  size?: string;  //'STARTUP_1_10' | 'SMALL_11_50' | 'MEDIUM_51_200' | 'LARGE_201_1000' | 'ENTERPRISE_1000_PLUS';
  industry: string;
  location?: string;
  foundedYear?: number;
  isActive?: boolean;
  createdAt?: string; // or Date
  updatedAt?: Date; // or Date
  employeeCount: number;
  activeJobsCount: number;
  myRole: string;
  joinedAt: string; // or Date
};

export function useMyCompany() {
  const [company, setCompany] = useState<Company | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);


  useEffect(() => {
    async function fetchMyCompany() {
      try {
        setLoading(true);
        const res = await axios.get(`${backendUrl}/api/employer/companies/my-company`, { withCredentials: true });
        if (res.data.success) {
          setCompany(res.data.data.company);
        } else {
          setCompany(null);
        }
      } catch (err) {
        setError(err as Error);
        console.log(err);
      } finally {
        setLoading(false);
      }
    }
    fetchMyCompany();
  }, []);

  return { company, setCompany, loading, error };
}
