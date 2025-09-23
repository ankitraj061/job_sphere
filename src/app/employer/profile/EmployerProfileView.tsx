'use client';

import { useState, useEffect } from 'react';
import EmployerProfileUpdateForm from './EmployerProfileUpdateForm';
import { EmployerProfile } from './types';

interface Props {
  profile: EmployerProfile | null;
}

export default function EmployerProfileView({ profile }: Props) {
  const [currentProfile, setCurrentProfile] = useState<EmployerProfile | null>(profile);
  const [editing, setEditing] = useState(false);

  // keep local state in sync with parent-provided prop
  useEffect(() => {
    setCurrentProfile(profile);
  }, [profile]);

  if (!currentProfile) {
    return (
      <div className="text-center py-10 text-red-500 font-semibold">
        No profile data available.
      </div>
    );
  }

  return (
    <div className="min-w-full min-h-screen space-y-6 px-4 py-4">
      {/* Header */}
      <h2 className="text-2xl font-extrabold text-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 rounded-3xl py-6 shadow-lg select-none">
        Employer Profile
      </h2>

      {editing ? (
        <EmployerProfileUpdateForm
          profile={currentProfile}
          onCancel={() => setEditing(false)}
          onSuccess={(updated) => {
            setCurrentProfile(updated);
            setEditing(false);
          }}
        />
      ) : (
        <>
          {/* Grid: Basic Info + Employer Info */}
          <div className="grid md:grid-cols-2 gap-8">
            {/* Basic Info */}
            <section className="p-4 rounded-3xl border border-blue-300 bg-white shadow-md text-gray-700">
              <h3 className="text-2xl font-bold mb-1 flex items-center gap-3 select-none text-indigo-700">
                <span className="text-3xl">👤</span> Basic Info
              </h3>
              <div className="space-y-3 text-sm leading-relaxed">
                <p>
                  <strong className="text-gray-900">Name:</strong> {currentProfile.user.name}
                </p>
                <p>
                  <strong className="text-gray-900">Email:</strong> {currentProfile.user.email}
                </p>
                <p>
                  <strong className="text-gray-900">Phone:</strong>{' '}
                  {currentProfile.user.phone ?? 'N/A'}
                </p>
                <p>
                  <strong className="text-gray-900">Location:</strong>{' '}
                  {currentProfile.user.location ?? 'N/A'}
                </p>
                {currentProfile.user.profilePicture && (
                  <img
                    src={currentProfile.user.profilePicture}
                    alt={`${currentProfile.user.name}'s profile picture`}
                    className="mt-2 max-w-[100px] rounded-xl border border-blue-200 shadow-sm"
                    loading="lazy"
                  />
                )}
              </div>
            </section>

            {/* Employer Profile */}
            <section className="p-6 rounded-3xl border border-indigo-300 bg-white shadow-md text-gray-700">
              <h3 className="text-2xl font-bold mb-1 flex items-center gap-3 select-none text-indigo-700">
                <span className="text-3xl">💼</span> Employer Profile
              </h3>
              <div className="space-y-3 text-sm leading-relaxed">
                <p>
                  <strong className="text-gray-900">Job Title:</strong>{' '}
                  {currentProfile.jobTitle ?? 'N/A'}
                </p>
                <p>
                  <strong className="text-gray-900">Department:</strong>{' '}
                  {currentProfile.department ?? 'N/A'}
                </p>
                <p>
                  <strong className="text-gray-900">Role:</strong>{' '}
                  {currentProfile.role ?? 'N/A'}
                </p>
                <p>
                  <strong className="text-gray-900">Total Jobs Posted:</strong>{' '}
                  {currentProfile.totalJobsPosted ?? 0}
                </p>
              </div>
            </section>
          </div>

          {/* Company Info */}
          {currentProfile.company && (
            <section className="p-4 rounded-3xl border border-slate-300 bg-white shadow-md text-gray-700">
              <h3 className="text-2xl font-bold mb-1 flex items-center gap-3 select-none text-indigo-700">
                <span className="text-3xl">🏢</span> Company Info
              </h3>
              <div className="space-y-3 text-sm leading-relaxed">
                <p>
                  <strong className="text-gray-900">Name:</strong>{' '}
                  {currentProfile.company.name}
                </p>
                <p>
                  <strong className="text-gray-900">Description:</strong>{' '}
                  {currentProfile.company.description ?? 'N/A'}
                </p>
                <p>
                  <strong className="text-gray-900">Industry:</strong>{' '}
                  {currentProfile.company.industry ?? 'N/A'}
                </p>
                <p>
                  <strong className="text-gray-900">Location:</strong>{' '}
                  {currentProfile.company.location ?? 'N/A'}
                </p>
                <p>
                  <strong className="text-gray-900">Website:</strong>{' '}
                  {currentProfile.company.website ? (
                    <a
                      href={currentProfile.company.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline text-indigo-600 hover:text-indigo-500"
                    >
                      {currentProfile.company.website}
                    </a>
                  ) : (
                    'N/A'
                  )}
                </p>
                <p>
                  <strong className="text-gray-900">Company Size:</strong>{' '}
                  {currentProfile.company.size ?? 'N/A'}
                </p>
                <p>
                  <strong className="text-gray-900">Total Employees:</strong>{' '}
                  {currentProfile.company.totalEmployees ?? 'N/A'}
                </p>
                <p>
                  <strong className="text-gray-900">Active Jobs:</strong>{' '}
                  {currentProfile.company.activeJobs ?? 0}
                </p>
                {currentProfile.company.profilePicture && (
                  <img
                    src={currentProfile.company.profilePicture}
                    alt={`${currentProfile.company.name} logo`}
                    className="mt-4 max-w-[120px] rounded-xl border border-indigo-200 shadow-sm"
                    loading="lazy"
                  />
                )}
              </div>
            </section>
          )}

          {/* Update Button */}
          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => setEditing(true)}
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-indigo-600 to-blue-600 px-6 py-2 text-white font-semibold text-lg shadow-md hover:from-indigo-500 hover:to-blue-500 focus:outline-none focus:ring-4 focus:ring-indigo-300 select-none transition-transform active:scale-95"
              aria-label="Update Profile"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5M18.5 2.5a2.121 2.121 0 113 3L12 15l-4 1 1-4 9.5-9.5z"
                />
              </svg>
              Update Profile
            </button>
          </div>
        </>
      )}
    </div>
  );
}
