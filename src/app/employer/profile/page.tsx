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
  const [profileStatus, setProfileStatus] = useState(null);
  const [profileData, setProfileData] = useState(null);
  const [name, setName] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState<string | null>(null);

  // Fetch profile status from API
  const fetchProfileStatus = async () => {
    try {
      const res = await axios.get(`${backendUrl}/api/employer/profile-status`, { withCredentials: true });
      setProfileStatus(res.data.data.profileStatus);
      setName(res.data.data.user?.name || '');
      if (res.data.data.profileStatus.nextStep === 'complete') {
        await fetchProfile();
      }
    } catch (error) {
      console.error('Failed to fetch profile status', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch full profile data for completed profiles
  const fetchProfile = async () => {
    try {
      const res = await axios.get(`${backendUrl}/api/employer/profile`, { withCredentials: true });
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
  // Re-fetch profile status to get updated nextStep after form submission
  await fetchProfileStatus();

  if (profileStatus?.nextStep === 'complete') {
    // All steps done → close modal & show profile view
    setModalOpen(false);
    await fetchProfile();
    setCurrentStep(null);
  } else {
    // Else open next form modal by updating currentStep
    setCurrentStep(profileStatus.nextStep);
  }
};


  if (loading) return <div>Loading...</div>;
  if (!profileStatus) return <div>Unable to load profile status.</div>;

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
          onClick={() => openModalAtStep(profileStatus.nextStep)}
          className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          Complete Profile
        </button>
      </div>

      {modalOpen && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
    <div className="bg-white p-6 rounded shadow-lg max-w-md w-full" onClick={e => e.stopPropagation()}>
      {currentStep === 'basic_details' && (
        <BasicDetailsForm defaultName={name} onComplete={onStepComplete} />
      )}
      {currentStep === 'employer_profile' && (
        <EmployerProfileForm onComplete={onStepComplete} />
      )}
      {currentStep === 'company_selection' && (
        <CompanySelection onComplete={onStepComplete} companyId={profileData?.companyId || null}  />
      )}

      <button className="mt-4 px-3 py-1 bg-gray-300 rounded hover:bg-gray-400" onClick={() => setModalOpen(false)}>Close</button>
    </div>
  </div>
)}

    </>
  );
}
