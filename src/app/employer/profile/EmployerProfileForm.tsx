'use client';

import React, { useState } from 'react';
import axios from 'axios';

interface Props {
  onComplete: () => void;
}

const roleOptions = [
  { label: 'Admin', value: 'ADMIN' },
  { label: 'HR Manager', value: 'HR_MANAGER' },
  { label: 'Hiring Manager', value: 'HIRING_MANAGER' },
  { label: 'Recruiter', value: 'RECRUITER' },
];

export default function EmployerProfileForm({ onComplete }: Props) {
  const [formData, setFormData] = useState({
    jobTitle: '',
    department: '',
    role: '',  // new field for role
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await axios.post(`${backendUrl}/api/employer/profile`, formData, { withCredentials: true });
      if (res.data.success) {
        onComplete();
      } else {
        setError(res.data.message || 'Failed to update employer profile');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto space-y-4">
      <h2 className="text-xl font-semibold mb-4">Step 2: Employer Profile Details</h2>

      <div>
        <label className="block mb-1 font-medium">Job Title</label>
        <input
          type="text"
          name="jobTitle"
          value={formData.jobTitle}
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded"
          required
          minLength={2}
          maxLength={100}
        />
      </div>

      <div>
        <label className="block mb-1 font-medium">Department</label>
        <input
          type="text"
          name="department"
          value={formData.department}
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded"
          required
          minLength={2}
          maxLength={50}
        />
      </div>

      <div>
        <label className="block mb-1 font-medium">Role</label>
        <select
          name="role"
          value={formData.role}
          onChange={handleChange}
          required
          className="w-full px-3 py-2 border rounded"
        >
          <option value="" disabled>
            Select role
          </option>
          {roleOptions.map(({ label, value }) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </div>

      {error && <p className="text-red-600">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
      >
        {loading ? 'Saving...' : 'Next'}
      </button>
    </form>
  );
}
