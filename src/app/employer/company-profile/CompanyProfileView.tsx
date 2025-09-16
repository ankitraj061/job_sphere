'use client';

import React, { useState } from 'react';
import axios from 'axios';
import { useForm } from 'react-hook-form';

interface Company {
  id: string;
  name: string;
  description?: string;
  website?: string;
  industry: string;
  location?: string;
  profilePicture?: string;
  size?: string;
  foundedYear?: number;
  createdAt?: string;
  employeeCount: number;
  activeJobsCount: number;
  myRole: string;
  joinedAt: string;
}

type CompanyUpdateData = {
  name: string;
  industry: string;
  description?: string;
  website?: string;
  location?: string;
  profilePicture?: string;
  size?: string;
  foundedYear?: number;
};

interface Props {
  company: Company;
  onDelete: () => void;
  onUpdate?: (updatedCompany: Company) => void;
}

export default function CompanyProfileView({ company, onDelete, onUpdate }: Props) {
  const [editing, setEditing] = useState(false);
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete your company profile?')) return;

    try {
      await axios.delete(`${backendUrl}/api/employer/companies`, { withCredentials: true });
      onDelete();
    } catch (error) {
      alert('Failed to delete company.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-900 via-green-800 to-emerald-900 p-2 w-full">
  <div className="w-full max-w-full">
    {!editing ? (
      <div className="bg-green-950 rounded-xl shadow-xl border border-green-800 overflow-hidden w-full">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-green-700 via-green-600 to-emerald-600 px-4 py-6 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-green-500 opacity-20 rounded-full transform translate-x-10 -translate-y-10"></div>
          <div className="absolute bottom-0 left-0 w-20 h-20 bg-emerald-400 opacity-20 rounded-full transform -translate-x-8 translate-y-8"></div>
          <div className="absolute top-1/2 right-1/4 w-16 h-16 bg-green-400 opacity-10 rounded-full"></div>

          <div className="relative z-10 flex items-start gap-4">
            <div className="flex-shrink-0">
              {company.profilePicture ? (
                <img
                  src={company.profilePicture}
                  alt={`${company.name} logo`}
                  className="w-16 h-16 bg-white rounded-lg object-contain p-2 shadow-md border-2 border-green-400"
                />
              ) : (
                <div className="w-16 h-16 bg-green-500 bg-opacity-30 rounded-lg flex items-center justify-center border-2 border-green-400 shadow-md">
                  <span className="text-xl font-bold text-green-100">{company.name.charAt(0)}</span>
                </div>
              )}
            </div>

            <div className="flex-1">
              <h1 className="text-2xl font-bold mb-2 text-white">{company.name}</h1>
              <div className="flex flex-wrap gap-2 text-xs">
                <span className="bg-green-500 bg-opacity-30 px-2 py-1 rounded-full border border-green-400">
                  🏢 {company.industry}
                </span>
                {company.location && (
                  <span className="bg-emerald-500 bg-opacity-30 px-2 py-1 rounded-full border border-emerald-400">
                    📍 {company.location}
                  </span>
                )}
                {company.foundedYear && (
                  <span className="bg-green-600 bg-opacity-40 px-2 py-1 rounded-full border border-green-300">
                    🗓️ Founded {company.foundedYear}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="px-4 py-4 bg-green-900 border-b border-green-700">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="text-center bg-green-800 rounded-lg p-3 border border-green-600 shadow">
              <div className="text-xl font-bold text-green-200 mb-1">{company.employeeCount}</div>
              <div className="text-green-400 text-xs">Employees</div>
            </div>
            <div className="text-center bg-emerald-800 rounded-lg p-3 border border-emerald-600 shadow">
              <div className="text-xl font-bold text-emerald-200 mb-1">{company.activeJobsCount}</div>
              <div className="text-emerald-400 text-xs">Active Jobs</div>
            </div>
            <div className="text-center bg-green-700 rounded-lg p-3 border border-green-500 shadow">
              <div className="text-base font-bold text-green-100 mb-1">{company.myRole}</div>
              <div className="text-green-300 text-xs">Your Role</div>
            </div>
            <div className="text-center bg-emerald-700 rounded-lg p-3 border border-emerald-500 shadow">
              <div className="text-base font-bold text-emerald-100 mb-1">
                {new Date(company.joinedAt).toLocaleDateString("en-US", {
                  month: "short",
                  year: "numeric",
                })}
              </div>
              <div className="text-emerald-300 text-xs">Joined</div>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="px-4 py-6 bg-green-950">
          <div className="grid lg:grid-cols-2 gap-4">
            <div className="bg-green-900 rounded-lg p-4 border border-green-700 shadow">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 bg-green-600 rounded-md flex items-center justify-center">
                  <span className="text-base">📖</span>
                </div>
                <h3 className="text-lg font-semibold text-green-100">About Company</h3>
              </div>
              <p className="text-green-300 leading-relaxed text-sm">
                {company.description || "No description provided."}
              </p>
            </div>

            <div className="bg-emerald-900 rounded-lg p-4 border border-emerald-700 shadow">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 bg-emerald-600 rounded-md flex items-center justify-center">
                  <span className="text-base">🏬</span>
                </div>
                <h3 className="text-lg font-semibold text-emerald-100">Company Details</h3>
              </div>
              <div className="space-y-3">
                {company.website && (
                  <div className="flex items-center gap-3 p-3 bg-emerald-800 rounded-md border border-emerald-600">
                    <div className="w-8 h-8 bg-emerald-600 rounded-md flex items-center justify-center flex-shrink-0">
                      <span className="text-sm">🌐</span>
                    </div>
                    <div className="flex-1">
                      <div className="text-xs text-emerald-400 mb-0.5">Website</div>
                      <a
                        href={company.website}
                        target="_blank"
                        rel="noreferrer"
                        className="text-emerald-200 hover:text-emerald-100 font-medium hover:underline text-sm"
                      >
                        {company.website.replace(/^https?:\/\//, "")}
                      </a>
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-3 p-3 bg-green-800 rounded-md border border-green-600">
                  <div className="w-8 h-8 bg-green-600 rounded-md flex items-center justify-center flex-shrink-0">
                    <span className="text-sm">👥</span>
                  </div>
                  <div className="flex-1">
                    <div className="text-xs text-green-400 mb-0.5">Company Size</div>
                    <div className="font-semibold text-green-100 text-sm">
                      {formatCompanySize(company.size)}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="px-4 py-4 bg-green-900 border-t border-green-700">
          <div className="flex flex-wrap gap-3 justify-end">
            <button
              onClick={() => setEditing(true)}
              className="px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-md hover:from-green-500 hover:to-emerald-500 font-medium transition-all duration-200 flex items-center gap-2 shadow text-sm border border-green-500"
            >
              ✏️ Edit
            </button>
            <button
              onClick={handleDelete}
              className="px-4 py-2 bg-gradient-to-r from-red-700 to-red-600 text-white rounded-md hover:from-red-600 hover:to-red-500 font-medium transition-all duration-200 flex items-center gap-2 shadow text-sm border border-red-500"
            >
              🗑️ Delete
            </button>
          </div>
        </div>
      </div>
    ) : (
      <CompanyEditForm
        company={company}
        onCancel={() => setEditing(false)}
        onSuccess={(updatedCompany) => {
          setEditing(false);
          if (onUpdate) onUpdate(updatedCompany);
        }}
      />
    )}
  </div>
</div>

  );
}

// Helper to format backend size enum to readable format
function formatCompanySize(size?: string) {
  switch (size) {
    case 'STARTUP_1_10':
      return 'Startup (1-10)';
    case 'SMALL_11_50':
      return 'Small (11-50)';
    case 'MEDIUM_51_200':
      return 'Medium (51-200)';
    case 'LARGE_201_1000':
      return 'Large (201-1000)';
    case 'ENTERPRISE_1000_PLUS':
      return 'Enterprise (1000+)';
    default:
      return 'Not specified';
  }
}

// Editable form component for updating company profile
function CompanyEditForm({ 
  company, 
  onCancel, 
  onSuccess 
}: { 
  company: Company; 
  onCancel: () => void; 
  onSuccess: (updatedCompany: Company) => void 
}) {
  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<CompanyUpdateData>({
    defaultValues: {
      name: company.name,
      description: company.description || '',
      website: company.website || '',
      industry: company.industry,
      location: company.location || '',
      profilePicture: company.profilePicture || '',
      size: company.size || '',
      foundedYear: company.foundedYear || undefined
    },
  });

  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

  const onSubmit = async (data: CompanyUpdateData) => {
    try {
      // Clean the data - remove empty strings and convert them to undefined/null
      const cleanData: CompanyUpdateData = {
        name: data.name.trim(),
        industry: data.industry.trim(),
        description: data.description?.trim() || undefined,
        website: data.website?.trim() || undefined,
        location: data.location?.trim() || undefined,
        profilePicture: data.profilePicture?.trim() || undefined,
        size: data.size || undefined,
        foundedYear: data.foundedYear || undefined
      };

      const res = await axios.put(`${backendUrl}/api/employer/companies`, cleanData, { 
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (res.data.success) {
        // Merge the updated data with the original company data to preserve read-only fields
        const updatedCompany: Company = {
          ...company, // Keep original data (employeeCount, activeJobsCount, etc.)
          ...res.data.data, // Override with updated data from backend
          updatedAt: res.data.data.updatedAt || new Date().toISOString()
        };
        
        onSuccess(updatedCompany);
        reset(cleanData);
        
        // Show success message
        alert('Company profile updated successfully!');
      } else {
        alert(res.data.message || 'Update failed');
      }
    } catch (err: any) {
      console.error('Error updating company:', err);
      
      // Handle different error types
      if (err.response?.data?.message) {
        alert(err.response.data.message);
      } else if (err.response?.status === 409) {
        alert('A company with this name already exists');
      } else if (err.response?.status === 403) {
        alert('You do not have permission to update this company profile');
      } else if (err.response?.status === 401) {
        alert('Please log in to update company profile');
      } else {
        alert('Error updating company. Please try again.');
      }
    }
  };

  return (
    <div className="bg-green-950 rounded-xl shadow-xl border border-green-800 overflow-hidden w-full">
  {/* Header */}
  <div className="bg-gradient-to-r from-green-700 via-green-600 to-emerald-600 px-6 py-6 text-white relative overflow-hidden">
    <div className="absolute top-0 right-0 w-24 h-24 bg-green-400 opacity-20 rounded-full transform translate-x-12 -translate-y-12"></div>
    <div className="absolute bottom-0 left-0 w-20 h-20 bg-emerald-400 opacity-20 rounded-full transform -translate-x-8 translate-y-8"></div>
    <div className="relative z-10">
      <h2 className="text-2xl font-bold mb-1">Edit Company Profile</h2>
      <p className="text-green-100 text-sm">Update your company information</p>
    </div>
  </div>

  {/* Form */}
  <form onSubmit={handleSubmit(onSubmit)} className="px-6 py-8 bg-green-950">
    <div className="grid lg:grid-cols-2 gap-6">
      {/* Company Name */}
      <div className="lg:col-span-2">
        <label className="block text-sm font-semibold text-green-200 mb-2">
          Company Name *
        </label>
        <input
          {...register("name", {
            required: "Company name is required",
            minLength: { value: 2, message: "Company name must be at least 2 characters" },
            maxLength: { value: 100, message: "Company name must be less than 100 characters" }
          })}
          className={`w-full border rounded-lg px-4 py-2.5 bg-green-900 text-green-100 text-sm focus:ring-2 focus:ring-green-600 focus:border-green-500 transition-all placeholder-green-400 ${
            errors.name ? "border-red-500 bg-red-950" : "border-green-700"
          }`}
          placeholder="Enter company name"
        />
        {errors.name && (
          <p className="text-red-400 text-xs mt-2 flex items-center gap-1 bg-red-900 bg-opacity-50 p-2 rounded-md border border-red-700">
            <span>❌</span> {errors.name.message}
          </p>
        )}
      </div>

      {/* Description */}
      <div className="lg:col-span-2">
        <label className="block text-sm font-semibold text-green-200 mb-2">
          Description
        </label>
        <textarea
          {...register("description", {
            maxLength: { value: 1000, message: "Description must be less than 1000 characters" }
          })}
          className="w-full border border-green-700 rounded-lg px-4 py-2.5 bg-green-900 text-green-100 text-sm focus:ring-2 focus:ring-green-600 focus:border-green-500 transition-all placeholder-green-400"
          rows={4}
          placeholder="Describe your company..."
        />
        {errors.description && (
          <p className="text-red-400 text-xs mt-2 flex items-center gap-1 bg-red-900 bg-opacity-50 p-2 rounded-md border border-red-700">
            <span>❌</span> {errors.description.message}
          </p>
        )}
      </div>

      {/* Website */}
      <div>
        <label className="block text-sm font-semibold text-green-200 mb-2">
          Website
        </label>
        <input
          {...register("website", {
            pattern: {
              value: /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/,
              message: "Please enter a valid website URL"
            }
          })}
          type="url"
          className="w-full border border-green-700 rounded-lg px-4 py-2.5 bg-green-900 text-green-100 text-sm focus:ring-2 focus:ring-green-600 focus:border-green-500 placeholder-green-400"
          placeholder="https://example.com"
        />
        {errors.website && (
          <p className="text-red-400 text-xs mt-2 flex items-center gap-1 bg-red-900 bg-opacity-50 p-2 rounded-md border border-red-700">
            <span>❌</span> {errors.website.message}
          </p>
        )}
      </div>

      {/* Industry */}
      <div>
        <label className="block text-sm font-semibold text-green-200 mb-2">
          Industry *
        </label>
        <input
          {...register("industry", {
            required: "Industry is required",
            minLength: { value: 2, message: "Industry must be at least 2 characters" },
            maxLength: { value: 50, message: "Industry must be less than 50 characters" }
          })}
          className={`w-full border rounded-lg px-4 py-2.5 bg-green-900 text-green-100 text-sm focus:ring-2 focus:ring-green-600 focus:border-green-500 placeholder-green-400 ${
            errors.industry ? "border-red-500 bg-red-950" : "border-green-700"
          }`}
          placeholder="e.g. Technology, Healthcare"
        />
        {errors.industry && (
          <p className="text-red-400 text-xs mt-2 flex items-center gap-1 bg-red-900 bg-opacity-50 p-2 rounded-md border border-red-700">
            <span>❌</span> {errors.industry.message}
          </p>
        )}
      </div>

      {/* Location */}
      <div>
        <label className="block text-sm font-semibold text-green-200 mb-2">
          Location
        </label>
        <input
          {...register("location", {
            maxLength: { value: 100, message: "Location must be less than 100 characters" }
          })}
          className="w-full border border-green-700 rounded-lg px-4 py-2.5 bg-green-900 text-green-100 text-sm focus:ring-2 focus:ring-green-600 focus:border-green-500 placeholder-green-400"
          placeholder="City, Country"
        />
        {errors.location && (
          <p className="text-red-400 text-xs mt-2 flex items-center gap-1 bg-red-900 bg-opacity-50 p-2 rounded-md border border-red-700">
            <span>❌</span> {errors.location.message}
          </p>
        )}
      </div>

      {/* Size */}
      <div>
        <label className="block text-sm font-semibold text-green-200 mb-2">
          Company Size
        </label>
        <select
          {...register("size")}
          className="w-full border border-green-700 rounded-lg px-4 py-2.5 bg-green-900 text-green-100 text-sm focus:ring-2 focus:ring-green-600 focus:border-green-500"
        >
          <option value="" className="bg-green-900">Select company size</option>
          <option value="STARTUP_1_10" className="bg-green-900">Startup (1-10)</option>
          <option value="SMALL_11_50" className="bg-green-900">Small (11-50)</option>
          <option value="MEDIUM_51_200" className="bg-green-900">Medium (51-200)</option>
          <option value="LARGE_201_1000" className="bg-green-900">Large (201-1000)</option>
          <option value="ENTERPRISE_1000_PLUS" className="bg-green-900">Enterprise (1000+)</option>
        </select>
      </div>

      {/* Founded Year */}
      <div>
        <label className="block text-sm font-semibold text-green-200 mb-2">
          Founded Year
        </label>
        <input
          {...register("foundedYear", {
            valueAsNumber: true,
            min: { value: 1800, message: "Year must be after 1800" },
            max: { value: new Date().getFullYear(), message: "Year cannot be in the future" }
          })}
          type="number"
          className="w-full border border-green-700 rounded-lg px-4 py-2.5 bg-green-900 text-green-100 text-sm focus:ring-2 focus:ring-green-600 focus:border-green-500 placeholder-green-400"
          placeholder="e.g. 2010"
          min="1800"
          max={new Date().getFullYear()}
        />
        {errors.foundedYear && (
          <p className="text-red-400 text-xs mt-2 flex items-center gap-1 bg-red-900 bg-opacity-50 p-2 rounded-md border border-red-700">
            <span>❌</span> {errors.foundedYear.message}
          </p>
        )}
      </div>

      {/* Profile Picture */}
      <div>
        <label className="block text-sm font-semibold text-green-200 mb-2">
          Profile Picture URL
        </label>
        <input
          {...register("profilePicture", {
            pattern: {
              value: /^(https?:\/\/).*\.(jpg|jpeg|png|gif|webp)$/i,
              message: "Please enter a valid image URL (jpg, jpeg, png, gif, webp)"
            }
          })}
          type="url"
          className="w-full border border-green-700 rounded-lg px-4 py-2.5 bg-green-900 text-green-100 text-sm focus:ring-2 focus:ring-green-600 focus:border-green-500 placeholder-green-400"
          placeholder="https://example.com/logo.png"
        />
        {errors.profilePicture && (
          <p className="text-red-400 text-xs mt-2 flex items-center gap-1 bg-red-900 bg-opacity-50 p-2 rounded-md border border-red-700">
            <span>❌</span> {errors.profilePicture.message}
          </p>
        )}
      </div>
    </div>

    {/* Actions */}
    <div className="flex flex-wrap justify-end gap-4 mt-8 pt-6 border-t border-green-700">
      <button
        type="button"
        onClick={onCancel}
        className="px-5 py-2.5 rounded-lg border border-green-600 text-green-200 hover:bg-green-800 font-medium transition-all text-sm"
      >
        Cancel
      </button>
      <button
        type="submit"
        disabled={isSubmitting}
        className="px-6 py-2.5 rounded-lg bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:from-green-500 hover:to-emerald-500 font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow text-sm border border-green-500"
      >
        {isSubmitting ? (
          <span className="flex items-center gap-2">
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            Saving...
          </span>
        ) : (
          "Save Changes"
        )}
      </button>
    </div>
  </form>
</div>

  );
}