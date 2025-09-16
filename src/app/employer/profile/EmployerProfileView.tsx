'use client';

import { useState } from 'react';
import EmployerProfileUpdateForm from './EmployerProfileUpdateForm';

interface EmployerProfile {
  id: string;
  user: {
    name: string;
    email: string;
    phone?: string;
    location?: string;
    profilePicture?: string;
  };
  jobTitle?: string;
  department?: string;
  company?: {
    name: string;
    description?: string;
    industry?: string;
    location?: string;
    website?: string;
    profilePicture?: string;
  } | null;
}

interface Props {
  profile: EmployerProfile | null;
}

export default function EmployerProfileView({ profile }: Props) {
  if (!profile) return <div className="text-center py-10 text-red-400 font-semibold">No profile data available.</div>;

  const [currentProfile, setCurrentProfile] = useState<EmployerProfile>(profile);
  const [editing, setEditing] = useState(false);

  return (
    <div className="min-w-full min-h-screen space-y-10 px-4 py-8 bg-green-950">
      {/* Header */}
      <h2 className="text-2xl font-extrabold text-center bg-gradient-to-r from-green-600 via-green-500 to-emerald-600 rounded-3xl py-6 text-white shadow-lg select-none">
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
          {/* Basic Info + Employer Profile Grid */}
          <div className="grid md:grid-cols-2 gap-8">
            {/* Basic Info */}
            <section className="p-6 rounded-3xl border border-green-600 bg-green-900 shadow-lg text-green-200">
              <h3 className="text-2xl font-bold mb-5 flex items-center gap-3 select-none">
                <span className="text-3xl">👤</span> Basic Info
              </h3>
              <div className="space-y-3 text-green-100 text-sm leading-relaxed">
                <p>
                  <strong className="text-white">Name:</strong> {currentProfile.user.name}
                </p>
                <p>
                  <strong className="text-white">Email:</strong> {currentProfile.user.email}
                </p>
                <p>
                  <strong className="text-white">Phone:</strong> {currentProfile.user.phone ?? 'N/A'}
                </p>
                <p>
                  <strong className="text-white">Location:</strong> {currentProfile.user.location ?? 'N/A'}
                </p>
                {currentProfile.user.profilePicture && (
                  <img
                    src={currentProfile.user.profilePicture}
                    alt="Profile Picture"
                    className="mt-4 max-w-[100px] rounded-2xl border border-green-500 shadow-md"
                    loading="lazy"
                  />
                )}
              </div>
            </section>

            {/* Employer Profile */}
            <section className="p-6 rounded-3xl border border-emerald-600 bg-emerald-900 shadow-lg text-emerald-200">
              <h3 className="text-2xl font-bold mb-5 flex items-center gap-3 select-none">
                <span className="text-3xl">💼</span> Employer Profile
              </h3>
              <div className="space-y-3 text-emerald-100 text-sm leading-relaxed">
                <p>
                  <strong className="text-white">Job Title:</strong> {currentProfile.jobTitle ?? 'N/A'}
                </p>
                <p>
                  <strong className="text-white">Department:</strong> {currentProfile.department ?? 'N/A'}
                </p>
              </div>
            </section>
          </div>

          {/* Update Button */}
          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => setEditing(true)}
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-green-600 to-emerald-600 px-6 py-3 text-white font-semibold text-lg shadow-lg hover:from-green-500 hover:to-emerald-500 focus:outline-none focus:ring-4 focus:ring-green-400 select-none transition-transform active:scale-95"
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
                <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5M18.5 2.5a2.121 2.121 0 113 3L12 15l-4 1 1-4 9.5-9.5z" />
              </svg>
              Update Profile
            </button>
          </div>
        </>
      )}
    </div>
  );
}
