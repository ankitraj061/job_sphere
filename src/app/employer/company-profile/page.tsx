'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useForm } from 'react-hook-form';

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

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

export default function CompanyProfilePage() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<CompanyProfileForm>();

  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    async function fetchCompany() {
      try {
        const res = await axios.get(`${backendUrl}/api/employer/companies/my-company`, {
          withCredentials: true,
        });
        if (res.data.success && res.data.data.company) {
          reset(res.data.data.company);
        }
      } catch (err) {
        setApiError('Failed to load company profile');
      } finally {
        setLoading(false);
      }
    }
    fetchCompany();
  }, [reset]);

  const onSubmit = async (data: CompanyProfileForm) => {
    setApiError(null);
    setSuccessMessage(null);
    try {
      const res = await axios.put(`${backendUrl}/api/employer/companies`, data, {
        withCredentials: true,
      });
      if (res.data.success) {
        setSuccessMessage('Company profile updated successfully.');
        reset(data);
      } else {
        setApiError('Update failed');
      }
    } catch (error: any) {
      setApiError(error?.response?.data?.message || 'Error updating company');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96 text-gray-600">
        Loading company profile...
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto bg-white p-8 rounded-md shadow-md">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Company Profile</h1>

      {apiError && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">{apiError}</div>
      )}
      {successMessage && (
        <div className="mb-4 p-3 bg-green-100 text-green-700 rounded">{successMessage}</div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <label className="block font-medium text-gray-700 mb-1" htmlFor="name">
            Company Name <span className="text-red-500">*</span>
          </label>
          <input
            id="name"
            {...register('name', { required: 'Company name is required', minLength: 2 })}
            className={`w-full rounded border p-2 ${
              errors.name ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.name && (
            <p className="text-red-600 mt-1 text-sm">{errors.name.message}</p>
          )}
        </div>

        <div>
          <label className="block font-medium text-gray-700 mb-1" htmlFor="description">
            Description
          </label>
          <textarea
            id="description"
            rows={3}
            {...register('description', { maxLength: 1000 })}
            className={`w-full rounded border p-2 ${
              errors.description ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.description && (
            <p className="text-red-600 mt-1 text-sm">Max length is 1000 characters</p>
          )}
        </div>

        <div>
          <label className="block font-medium text-gray-700 mb-1" htmlFor="website">
            Website
          </label>
          <input
            id="website"
            type="url"
            placeholder="https://example.com"
            {...register('website', {
              pattern: {
                value: /^(https?:\/\/)?([\w-]+\.)+[\w-]{2,}(\/[\w-]*)*\/?$/,
                message: 'Invalid URL',
              },
            })}
            className={`w-full rounded border p-2 ${
              errors.website ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.website && (
            <p className="text-red-600 mt-1 text-sm">{errors.website.message}</p>
          )}
        </div>

        <div>
          <label className="block font-medium text-gray-700 mb-1" htmlFor="industry">
            Industry <span className="text-red-500">*</span>
          </label>
          <input
            id="industry"
            {...register('industry', { required: 'Industry is required', minLength: 2 })}
            className={`w-full rounded border p-2 ${
              errors.industry ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.industry && (
            <p className="text-red-600 mt-1 text-sm">{errors.industry.message}</p>
          )}
        </div>

        <div>
          <label className="block font-medium text-gray-700 mb-1" htmlFor="location">
            Location
          </label>
          <input
            id="location"
            {...register('location')}
            className="w-full rounded border border-gray-300 p-2"
          />
        </div>

        <div>
          <label className="block font-medium text-gray-700 mb-1" htmlFor="size">
            Company Size
          </label>
          <select
            id="size"
            {...register('size')}
            className="w-full rounded border border-gray-300 p-2"
            defaultValue=""
          >
            <option value="" disabled>
              Select size
            </option>
            <option value="STARTUP_1_10">Startup (1-10)</option>
            <option value="SMALL_11_50">Small (11-50)</option>
            <option value="MEDIUM_51_200">Medium (51-200)</option>
            <option value="LARGE_201_1000">Large (201-1000)</option>
            <option value="ENTERPRISE_1000_PLUS">Enterprise (1000+)</option>
          </select>
        </div>

        <div>
          <label className="block font-medium text-gray-700 mb-1" htmlFor="foundedYear">
            Founded Year
          </label>
          <input
            id="foundedYear"
            type="number"
            min={1800}
            max={new Date().getFullYear()}
            {...register('foundedYear', {
              valueAsNumber: true,
              min: 1800,
              max: new Date().getFullYear(),
            })}
            className="w-full rounded border border-gray-300 p-2"
          />
        </div>

        <div>
          <label className="block font-medium text-gray-700 mb-1" htmlFor="profilePicture">
            Profile Picture URL
          </label>
          <input
            id="profilePicture"
            type="url"
            placeholder="https://example.com/logo.png"
            {...register('profilePicture')}
            className="w-full rounded border border-gray-300 p-2"
          />
        </div>

        <div className="flex justify-end gap-4 mt-6">
          <button
            type="button"
            onClick={() => reset()}
            disabled={!isDirty || isSubmitting}
            className="px-4 py-2 rounded border border-gray-400 bg-white text-gray-700 hover:bg-gray-100 disabled:opacity-50"
          >
            Reset
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2 rounded bg-[#416b46] text-white font-semibold hover:bg-[#375737] disabled:opacity-50"
          >
            {isSubmitting ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
}
