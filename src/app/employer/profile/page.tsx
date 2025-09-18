'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import BasicDetailsForm from './BasicDetailsForm';
import EmployerProfileForm from './EmployerProfileForm';
import CompanySelection from './CompanySelection';
import EmployerProfileView from './EmployerProfileView';

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

export default function EmployerProfilePage() {
  const [loading, setLoading] = useState(true);
  const [profileStatus, setProfileStatus] = useState<{
    nextStep: string | null;
  } | null>(null);
  const [profileData, setProfileData] = useState<any>(null);
  const [name, setName] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState<string | null>(null);

  // Fetch profile status from API
  const fetchProfileStatus = async () => {
    try {
      const res = await axios.get(
        `${backendUrl}/api/employer/profile-status`,
        { withCredentials: true }
      );
      const status = res.data.data.profileStatus;
      setProfileStatus(status);
      setName(res.data.data.user?.name || '');
      if (status.nextStep === 'complete') {
        await fetchProfile();
      }
      return status; // ✅ return status
    } catch (error) {
      console.error('Failed to fetch profile status', error);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Fetch full profile data for completed profiles
  const fetchProfile = async () => {
    try {
      const res = await axios.get(`${backendUrl}/api/employer/profile`, {
        withCredentials: true,
      });
      setProfileData(res.data.data);
    } catch (error) {
      console.error('Failed to fetch employer profile', error);
    }
  };

  useEffect(() => {
    fetchProfileStatus();
  }, []);

  // Open modal at the given step
  const openModalAtStep = (step: string) => {
    setCurrentStep(step);
    setModalOpen(true);
  };

  // Close modal completely
  const closeModal = () => {
    setModalOpen(false);
  };

  // Called when a step form successfully completes
  const onStepComplete = async () => {
    const newStatus = await fetchProfileStatus(); // ✅ use return value

    if (newStatus?.nextStep === 'complete') {
      setModalOpen(false);
      await fetchProfile();
      setCurrentStep(null);
    } else if (newStatus?.nextStep) {
      setCurrentStep(newStatus.nextStep);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 shadow-2xl">
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 border-4 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-xl text-blue-500 font-semibold">
              Loading Employer Profile information...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!profileStatus) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Unable to load profile status.</p>
      </div>
    );
  }

  // If profile completed, show profile view immediately
  if (profileStatus.nextStep === 'complete' && profileData) {
    return <EmployerProfileView profile={profileData} />;
  }

  // Profile not complete: show message + button to start modal wizard
  return (
    <>
      <div className="max-w-md mx-auto p-6 space-y-4 text-center">
        <p className="text-lg font-semibold text-gray-700">
          Your profile is incomplete. Please complete your profile to continue.
        </p>
        <button
          onClick={() => {
            if (profileStatus.nextStep) {
              openModalAtStep(profileStatus.nextStep);
            }
          }}
          className="px-6 py-2 bg-gray-100 text-blue-600 rounded-lg shadow hover:from-blue-700 hover:to-indigo-700 transition"
        >
          Complete Profile
        </button>
      </div>

      {modalOpen && (
        <div
          className="fixed inset-0 bg-black/50 flex justify-center items-center z-50"
          onClick={closeModal}
        >
          <div
            className="bg-white/90 backdrop-blur-sm p-6 rounded-2xl shadow-xl border border-gray-200/50 max-w-md w-full"
            onClick={(e) => e.stopPropagation()}
          >
            {currentStep === 'basic_details' && (
              <BasicDetailsForm defaultName={name} onComplete={onStepComplete} />
            )}
            {currentStep === 'employer_profile' && (
              <EmployerProfileForm onComplete={onStepComplete} />
            )}
            {currentStep === 'company_selection' && (
              <CompanySelection
                onComplete={onStepComplete}
                companyId={profileData?.companyId || null}
              />
            )}

            <button
              className="mt-4 px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 transition"
              onClick={() => setModalOpen(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}
