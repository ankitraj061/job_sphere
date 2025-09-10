// app/employer/profile/BasicDetailsForm.tsx
'use client';

import React, { useState } from 'react';
import axios from 'axios';

interface Props {
  onComplete: () => void;
  defaultName?: string; 
}

export default function BasicDetailsForm({ onComplete, defaultName}: Props) {

  const [formData, setFormData] = useState({
    name: defaultName,
    phone: '',
    location: '',
    profilePicture: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await axios.put(`${backendUrl}/api/employer/basic-details`, formData, { withCredentials: true });
      if (res.data.success) {
        onComplete();
      } else {
        setError(res.data.message || 'Failed to update basic details');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto space-y-4">
      <h2 className="text-xl font-semibold mb-4">Step 1: Basic Details</h2>

      <div>
        <label className="block mb-1 font-medium">Name</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded"
          required
          minLength={2}
          maxLength={50}
        />
      </div>

      <div>
        <label className="block mb-1 font-medium">Phone</label>
        <input
          type="text"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded"
          required
          minLength={10}
          maxLength={15}
        />
      </div>

      <div>
        <label className="block mb-1 font-medium">Location</label>
        <input
          type="text"
          name="location"
          value={formData.location}
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded"
          required
          minLength={2}
          maxLength={100}
        />
      </div>

      <div>
        <label className="block mb-1 font-medium">Profile Picture URL (optional)</label>
        <input
          type="url"
          name="profilePicture"
          value={formData.profilePicture}
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded"
          placeholder="https://example.com/image.jpg"
        />
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
