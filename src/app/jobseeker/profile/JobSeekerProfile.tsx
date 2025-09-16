// components/profile/JobSeekerProfile.tsx
'use client';
import { useState, useEffect } from 'react';
import { fetchProfileData, fetchProfileStatus } from './utils/profileApi';
import { ProfileStatus, JobSeekerProfileData } from './utils/types';
import BasicDetailsSection from './utils/BasicDetailsSection';
import JobSeekerProfileSection from './utils/JobSeekerProfileSection';
import EducationSection from './utils/EducationSection';
import ExperienceSection from './utils/ExperienceSection';
import ProjectsSection from './utils/ProjectSection';
import PreferencesSection from './utils/PreferencesSection';
import { toast } from 'sonner';

export function JobSeekerProfile() {
  const [profileData, setProfileData] = useState<JobSeekerProfileData | null>(null);
  const [profileStatus, setProfileStatus] = useState<ProfileStatus | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadProfileData();
  }, []);

  const loadProfileData = async (): Promise<void> => {
    setLoading(true);
    setError(null);

    const fetchPromise = Promise.all([
      fetchProfileData(),
      fetchProfileStatus()
    ]);

    toast.promise(fetchPromise, {
      loading: 'Loading your profile...',
      success: ([profileResponse, statusResponse]) => {
        if (profileResponse.success) {
          setProfileData(profileResponse.data);
        }
        
        if (statusResponse.success) {
          setProfileStatus(statusResponse.data.profileStatus);

          const completionPercentage = statusResponse.data.profileStatus.completionPercentage;
          
          // Show completion status as separate toast
          setTimeout(() => {
            if (completionPercentage === 100) {
              toast.success('Profile Complete! 🎉', {
                description: 'Your profile is now ready for job applications.'
              });
            } else if (completionPercentage >= 75) {
              toast.info('Almost There! 📝', {
                description: `Profile is ${completionPercentage}% complete. Just a few more sections to go.`
              });
            } else if (completionPercentage >= 50) {
              toast.info('Good Progress! 👍', {
                description: `Profile is ${completionPercentage}% complete. Keep going!`
              });
            }
          }, 500); // Small delay to avoid overlapping toasts
        }

        setLoading(false);
        return 'Profile loaded successfully! ✨';
      },
      error: (error) => {
        console.error('Error loading profile:', error);
        const errorMessage = 'Failed to load profile data. Please try again.';
        setError(errorMessage);
        setLoading(false);
        return errorMessage;
      }
    });
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center p-6">
        <div className="bg-white shadow-2xl rounded-3xl p-8 max-w-md w-full">
          <div className="text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-3">Something went wrong</h3>
            <p className="text-gray-600 mb-6">{error}</p>
            <button 
              onClick={loadProfileData}
              className="w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold rounded-xl hover:from-purple-700 hover:to-indigo-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
              disabled={loading}
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Modern Header Section */}
        <div className="bg-white shadow-2xl rounded-3xl p-8 mb-8 relative overflow-hidden">
          {/* Decorative Background Elements */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-200 to-indigo-200 rounded-full -translate-y-16 translate-x-16 opacity-60"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-blue-200 to-purple-200 rounded-full translate-y-12 -translate-x-12 opacity-40"></div>
          
          <div className="relative">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between space-y-6 lg:space-y-0">
              
              {/* Title Section */}
              <div>
                <h1 className="text-4xl font-extrabold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent mb-2">
                  Job Seeker Profile
                </h1>
                <p className="text-gray-600 text-lg">Build your professional story and get noticed by employers</p>
              </div>
              
              {/* Progress Section */}
              <div className="bg-gradient-to-r from-gray-50 to-white rounded-2xl p-6 border border-gray-100 min-w-[300px]">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-semibold text-gray-700">Profile Completion</span>
                  <span className="text-lg font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                    {profileStatus?.completionPercentage || 0}%
                  </span>
                </div>
                
                <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden mb-2">
                  <div 
                    className={`h-full bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full transition-all duration-700 ease-out shadow-sm ${loading ? 'animate-pulse' : ''}`}
                    style={{ width: `${profileStatus?.completionPercentage || 0}%` }}
                  ></div>
                </div>
                
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-500">
                    {profileStatus?.sectionsCompleted || 0} of {profileStatus?.totalSections || 6} sections
                  </span>
                  <span className="text-purple-600 font-medium">
                    {profileStatus?.completionPercentage === 100 ? '🎉 Complete!' : '📝 In Progress'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Sections Container */}
        <div className="space-y-8">
          {profileData?.user && (
            <BasicDetailsSection 
              data={profileData.user}
              onUpdate={loadProfileData}
              isComplete={profileStatus?.basicDetails || false}
            />
          )}

          <JobSeekerProfileSection 
            data={profileData || null} 
            onUpdate={loadProfileData}
            isComplete={profileStatus?.jobSeekerProfile || false}
          />

          <EducationSection 
            data={profileData?.education || []} 
            onUpdate={loadProfileData}
            isComplete={profileStatus?.education || false}
          />

          <ExperienceSection 
            data={profileData?.experience || []} 
            onUpdate={loadProfileData}
            isComplete={profileStatus?.experience || false}
          />

          <ProjectsSection 
            data={profileData?.projects || []} 
            onUpdate={loadProfileData}
            isComplete={profileStatus?.projects || false}
          />

          {profileData?.preferences && (
            <PreferencesSection 
              data={profileData.preferences} 
              onUpdate={loadProfileData}
              isComplete={profileStatus?.preferences || false}
            />
          )}
        </div>
      </div>
    </div>
  );
}
