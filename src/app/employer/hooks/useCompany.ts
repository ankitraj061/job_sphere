import { useState, useEffect } from 'react';
import axios from 'axios';

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

export function useMyCompany() {
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchMyCompany() {
      try {
        setLoading(true);
        const res = await axios.get(`${backendUrl}/api/company/my-company`, { withCredentials: true });
        if (res.data.success) {
          setCompany(res.data.data.company);
        } else {
          setCompany(null);
        }
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    }
    fetchMyCompany();
  }, []);

  return { company, loading, error, setCompany };
}
