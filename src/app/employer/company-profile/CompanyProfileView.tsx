'use client';

import React, { useState } from 'react';
import axios,{AxiosError, AxiosResponse} from 'axios';
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-4 w-full">
      <div className="w-full mx-auto">
        {!editing ? (
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/50 overflow-hidden">
            {/* Header Section */}
            <div className="bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-600 px-6 py-8 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-28 h-28 bg-white opacity-10 rounded-full transform translate-x-12 -translate-y-12"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-white opacity-10 rounded-full transform -translate-x-10 translate-y-10"></div>

              <div className="relative z-10 flex items-start gap-4">
                <div className="flex-shrink-0">
                  {company.profilePicture ? (
                    <img
                      src={company.profilePicture}
                      alt={`${company.name} logo`}
                      className="w-16 h-16 bg-white rounded-lg object-contain p-2 shadow-md border-2 border-indigo-300"
                    />
                  ) : (
                    <div className="w-16 h-16 bg-indigo-200 rounded-lg flex items-center justify-center border-2 border-indigo-400 shadow-md">
                      <span className="text-xl font-bold text-indigo-700">{company.name.charAt(0)}</span>
                    </div>
                  )}
                </div>

                <div className="flex-1">
                  <h1 className="text-2xl font-bold mb-2">{company.name}</h1>
                  <div className="flex flex-wrap gap-2 text-xs">
                    <span className="bg-white/20 px-2 py-1 rounded-full border border-white/30">
                      🏢 {company.industry}
                    </span>
                    {company.location && (
                      <span className="bg-white/20 px-2 py-1 rounded-full border border-white/30">
                        📍 {company.location}
                      </span>
                    )}
                    {company.foundedYear && (
                      <span className="bg-white/20 px-2 py-1 rounded-full border border-white/30">
                        🗓️ Founded {company.foundedYear}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Stats Section */}
            <div className="px-6 py-6 bg-white/70 backdrop-blur-sm border-b border-gray-200">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="text-center bg-white/60 rounded-xl p-4 border border-gray-200 shadow-sm">
                  <div className="text-xl font-bold text-indigo-700 mb-1">{company.employeeCount}</div>
                  <div className="text-gray-500 text-xs">Employees</div>
                </div>
                <div className="text-center bg-white/60 rounded-xl p-4 border border-gray-200 shadow-sm">
                  <div className="text-xl font-bold text-indigo-700 mb-1">{company.activeJobsCount}</div>
                  <div className="text-gray-500 text-xs">Active Jobs</div>
                </div>
                <div className="text-center bg-white/60 rounded-xl p-4 border border-gray-200 shadow-sm">
                  <div className="text-base font-bold text-indigo-600 mb-1">{company.myRole}</div>
                  <div className="text-gray-500 text-xs">Your Role</div>
                </div>
                <div className="text-center bg-white/60 rounded-xl p-4 border border-gray-200 shadow-sm">
                  <div className="text-base font-bold text-indigo-600 mb-1">
                    {new Date(company.joinedAt).toLocaleDateString("en-US", {
                      month: "short",
                      year: "numeric",
                    })}
                  </div>
                  <div className="text-gray-500 text-xs">Joined</div>
                </div>
              </div>
            </div>

            {/* Content Section */}
            <div className="px-6 py-8 bg-white/70 backdrop-blur-sm">
              <div className="grid lg:grid-cols-2 gap-6">
                <div className="bg-white/60 rounded-xl p-5 border border-gray-200 shadow-sm">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-md flex items-center justify-center">
                      <span className="text-base">📖</span>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-700">About Company</h3>
                  </div>
                  <p className="text-gray-600 leading-relaxed text-sm">
                    {company.description || "No description provided."}
                  </p>
                </div>

                <div className="bg-white/60 rounded-xl p-5 border border-gray-200 shadow-sm">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-8 h-8 bg-indigo-100 rounded-md flex items-center justify-center">
                      <span className="text-base">🏬</span>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-700">Company Details</h3>
                  </div>
                  <div className="space-y-3">
                    {company.website && (
                      <div className="flex items-center gap-3 p-3 bg-white/50 rounded-md border border-gray-200">
                        <div className="w-8 h-8 bg-indigo-200 rounded-md flex items-center justify-center flex-shrink-0">
                          <span className="text-sm">🌐</span>
                        </div>
                        <div className="flex-1">
                          <div className="text-xs text-gray-500 mb-0.5">Website</div>
                          <a
                            href={company.website}
                            target="_blank"
                            rel="noreferrer"
                            className="text-indigo-600 hover:text-indigo-800 font-medium hover:underline text-sm"
                          >
                            {company.website.replace(/^https?:\/\//, "")}
                          </a>
                        </div>
                      </div>
                    )}

                    <div className="flex items-center gap-3 p-3 bg-white/50 rounded-md border border-gray-200">
                      <div className="w-8 h-8 bg-blue-200 rounded-md flex items-center justify-center flex-shrink-0">
                        <span className="text-sm">👥</span>
                      </div>
                      <div className="flex-1">
                        <div className="text-xs text-gray-500 mb-0.5">Company Size</div>
                        <div className="font-semibold text-gray-700 text-sm">
                          {formatCompanySize(company.size)}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="px-6 py-4 bg-white/80 backdrop-blur-sm border-t border-gray-200">
              <div className="flex flex-wrap gap-3 justify-end">
                <button
                  onClick={() => setEditing(true)}
                  className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 font-medium transition-all duration-200 flex items-center gap-2 shadow text-sm"
                >
                  ✏️ Edit
                </button>
                <button
                  onClick={handleDelete}
                  className="px-4 py-2 bg-gradient-to-r from-red-600 to-rose-600 text-white rounded-lg hover:from-red-700 hover:to-rose-700 font-medium transition-all duration-200 flex items-center gap-2 shadow text-sm"
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

// Format company size enum
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
        headers: { 'Content-Type': 'application/json' }
      });

      if (res.data.success) {
        const updatedCompany: Company = {
          ...company,
          ...res.data.data,
          updatedAt: res.data.data.updatedAt || new Date().toISOString()
        };
        
        onSuccess(updatedCompany);
        reset(cleanData);
        alert('Company profile updated successfully!');
      } else {
        alert(res.data.message || 'Update failed');
      }
    } catch (err: unknown ) {
      console.error('Error updating company:', err);
      
    }
  };

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-600 px-6 py-8 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-24 h-24 bg-white opacity-10 rounded-full transform translate-x-12 -translate-y-12"></div>
        <div className="absolute bottom-0 left-0 w-20 h-20 bg-white opacity-10 rounded-full transform -translate-x-8 translate-y-8"></div>
        <div className="relative z-10">
          <h2 className="text-2xl font-bold mb-1">Edit Company Profile</h2>
          <p className="text-blue-100 text-sm">Update your company information</p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="px-6 py-8 bg-white/70 backdrop-blur-sm">
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Company Name */}
          <div className="lg:col-span-2">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Company Name *</label>
            <input
              {...register("name", {
                required: "Company name is required",
                minLength: { value: 2, message: "Company name must be at least 2 characters" },
                maxLength: { value: 100, message: "Company name must be less than 100 characters" }
              })}
              className={`w-full border rounded-lg px-4 py-2.5 bg-white/60 text-gray-700 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-400 transition-all placeholder-gray-400 ${
                errors.name ? "border-red-500 bg-red-50" : "border-gray-300"
              }`}
              placeholder="Enter company name"
            />
            {errors.name && (
              <p className="text-red-500 text-xs mt-2">{errors.name.message}</p>
            )}
          </div>

          {/* Description */}
          <div className="lg:col-span-2">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
            <textarea
              {...register("description", {
                maxLength: { value: 1000, message: "Description must be less than 1000 characters" }
              })}
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 bg-white/60 text-gray-700 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-400 transition-all placeholder-gray-400"
              rows={4}
              placeholder="Describe your company..."
            />
            {errors.description && (
              <p className="text-red-500 text-xs mt-2">{errors.description.message}</p>
            )}
          </div>

          {/* Website */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Website</label>
            <input
              {...register("website", {
                pattern: {
                  value: /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/,
                  message: "Please enter a valid website URL"
                }
              })}
              type="url"
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 bg-white/60 text-gray-700 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-400 placeholder-gray-400"
              placeholder="https://example.com"
            />
            {errors.website && (
              <p className="text-red-500 text-xs mt-2">{errors.website.message}</p>
            )}
          </div>

          {/* Industry */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Industry *</label>
            <input
              {...register("industry", {
                required: "Industry is required",
                minLength: { value: 2, message: "Industry must be at least 2 characters" },
                maxLength: { value: 50, message: "Industry must be less than 50 characters" }
              })}
              className={`w-full border rounded-lg px-4 py-2.5 bg-white/60 text-gray-700 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-400 placeholder-gray-400 ${
                errors.industry ? "border-red-500 bg-red-50" : "border-gray-300"
              }`}
              placeholder="e.g. Technology, Healthcare"
            />
            {errors.industry && (
              <p className="text-red-500 text-xs mt-2">{errors.industry.message}</p>
            )}
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Location</label>
            <input
              {...register("location", {
                maxLength: { value: 100, message: "Location must be less than 100 characters" }
              })}
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 bg-white/60 text-gray-700 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-400 placeholder-gray-400"
              placeholder="e.g. San Francisco, CA"
            />
            {errors.location && (
              <p className="text-red-500 text-xs mt-2">{errors.location.message}</p>
            )}
          </div>

          {/* Profile Picture */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Profile Picture URL</label>
            <input
              {...register("profilePicture", {
                pattern: {
                  value: /^(https?:\/\/.*\.(?:png|jpg|jpeg|gif|svg|webp))$/i,
                  message: "Please enter a valid image URL"
                }
              })}
              type="url"
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 bg-white/60 text-gray-700 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-400 placeholder-gray-400"
              placeholder="https://example.com/logo.png"
            />
            {errors.profilePicture && (
              <p className="text-red-500 text-xs mt-2">{errors.profilePicture.message}</p>
            )}
          </div>

          {/* Company Size */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Company Size</label>
            <select
              {...register("size")}
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 bg-white/60 text-gray-700 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-400"
            >
              <option value="">Select company size</option>
              <option value="STARTUP_1_10">Startup (1-10)</option>
              <option value="SMALL_11_50">Small (11-50)</option>
              <option value="MEDIUM_51_200">Medium (51-200)</option>
              <option value="LARGE_201_1000">Large (201-1000)</option>
              <option value="ENTERPRISE_1000_PLUS">Enterprise (1000+)</option>
            </select>
          </div>

          {/* Founded Year */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Founded Year</label>
            <input
              {...register("foundedYear", {
                min: { value: 1000, message: "Year must be valid" },
                max: { value: new Date().getFullYear(), message: "Year cannot be in the future" }
              })}
              type="number"
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 bg-white/60 text-gray-700 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-400 placeholder-gray-400"
              placeholder="e.g. 2010"
            />
            {errors.foundedYear && (
              <p className="text-red-500 text-xs mt-2">{errors.foundedYear.message}</p>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap justify-end gap-3 mt-8">
          <button
            type="button"
            onClick={onCancel}
            className="px-5 py-2.5 bg-gray-200/80 text-gray-700 rounded-lg hover:bg-gray-300 font-medium transition-all duration-200 text-sm shadow-sm"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 font-medium transition-all duration-200 flex items-center gap-2 shadow text-sm disabled:opacity-60"
          >
            {isSubmitting ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
}

