'use client';

import React, { useState } from 'react';
import axios from 'axios';
import { Company } from '../hooks/useCompany';

type CompanyProfileForm = {
  name: string;
  description?: string;
  website?: string;
  industry: string;
  location?: string;
  size?: string;
  foundedYear?: number;
  profilePicture?: string;
};

interface Props {
  onCancel: () => void;
  onSuccess: (company: Company) => void;
}

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

export default function CompanyCreateForm({ onCancel, onSuccess }: Props) {
  const [formData, setFormData] = useState<CompanyProfileForm>({
    name: '',
    description: '',
    website: '',
    industry: '',
    location: '',
    size: '',
    foundedYear: undefined,
    profilePicture: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "foundedYear" ? (value ? Number(value) : undefined) : value,
    }));
  };

  const handleCreate = async () => {
    if (!formData.name.trim()) {
      setError('Company name is required');
      return;
    }
    if (!formData.industry.trim()) {
      setError('Industry is required');
      return;
    }
    if (!formData.size) {
      setError('Please select a company size');
      return;
    }
    setError(null);
    setLoading(true);
    try {
      const res = await axios.post(`${backendUrl}/api/employer/companies`, formData, { withCredentials: true });
      if (res.data.success) {
        onSuccess(res.data.data);
      } else {
        setError('Failed to create company');
      }
    } catch (err) {
      setError('Failed to create company');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 bg-white rounded shadow max-w-md mx-auto">
      <h3 className="text-xl font-semibold mb-4">Create New Company</h3>

      <div className="mb-3">
        <label className="block font-medium mb-1" htmlFor="name">
          Company Name <span className="text-red-500">*</span>
        </label>
        <input
          id="name"
          name="name"
          type="text"
          value={formData.name}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
          minLength={2}
        />
      </div>

      <div className="mb-3">
        <label className="block font-medium mb-1" htmlFor="description">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={3}
          className="w-full border p-2 rounded"
          maxLength={1000}
        />
      </div>

      <div className="mb-3">
        <label className="block font-medium mb-1" htmlFor="website">
          Website
        </label>
        <input
          id="website"
          name="website"
          type="url"
          placeholder="https://example.com"
          value={formData.website}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />
      </div>

      <div className="mb-3">
        <label className="block font-medium mb-1" htmlFor="industry">
          Industry <span className="text-red-500">*</span>
        </label>
        <input
          id="industry"
          name="industry"
          type="text"
          value={formData.industry}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
          minLength={2}
        />
      </div>

      <div className="mb-3">
        <label className="block font-medium mb-1" htmlFor="location">
          Location
        </label>
        <input
          id="location"
          name="location"
          type="text"
          value={formData.location}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />
      </div>

      <div className="mb-3">
        <label className="block font-medium mb-1" htmlFor="size">
          Company Size <span className="text-red-500">*</span>
        </label>
        <select
          id="size"
          name="size"
          value={formData.size}
          onChange={handleChange}
          required
          className="w-full border p-2 rounded"
        >
          <option value="">Select size</option>
          <option value="STARTUP_1_10">Startup (1-10)</option>
          <option value="SMALL_11_50">Small (11-50)</option>
          <option value="MEDIUM_51_200">Medium (51-200)</option>
          <option value="LARGE_201_1000">Large (201-1000)</option>
          <option value="ENTERPRISE_1000_PLUS">Enterprise (1000+)</option>
        </select>
      </div>

      <div className="mb-3">
        <label className="block font-medium mb-1" htmlFor="foundedYear">
          Founded Year
        </label>
        <input
          id="foundedYear"
          name="foundedYear"
          type="number"
          min={1800}
          max={new Date().getFullYear()}
          value={formData.foundedYear || ''}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />
      </div>

      <div className="mb-3">
        <label className="block font-medium mb-1" htmlFor="profilePicture">
          Profile Picture URL
        </label>
        <input
          id="profilePicture"
          name="profilePicture"
          type="url"
          placeholder="https://example.com/logo.png"
          value={formData.profilePicture}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />
      </div>

      {error && <p className="text-red-600 mb-3">{error}</p>}

      <div className="flex justify-end gap-2">
        <button
          onClick={onCancel}
          disabled={loading}
          className="px-4 py-2 rounded border border-gray-400 hover:bg-gray-100"
        >
          Cancel
        </button>
        <button
          onClick={handleCreate}
          disabled={loading}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          {loading ? 'Creating...' : 'Create'}
        </button>
      </div>
    </div>
  );
}
