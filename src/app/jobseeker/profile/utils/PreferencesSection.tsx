// components/profile/PreferencesSection.tsx
'use client';
import { useState } from 'react';
import { Settings, Edit3, CheckCircle2, IndianRupee, MapPin, Briefcase, Clock, Home, Zap } from 'lucide-react';
import { Preferences } from './types';
import { updatePreferences } from './profileApi';
import PreferencesModal from './PreferencesModel';
import { getJobTypeLabel, getJobRoleLabel } from './enumMappings';
import { promiseToast } from './toasts';

interface PreferencesSectionProps {
  data: Preferences;
  onUpdate: () => void;
  isComplete: boolean;
}

const PreferencesSection: React.FC<PreferencesSectionProps> = ({ data, onUpdate, isComplete }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleUpdate = async (formData: Omit<Preferences, "id" | "seekerId">) => {
    const updatePromise: ReturnType<typeof updatePreferences> = updatePreferences(formData);
    
    promiseToast(updatePromise, {
      loading: 'Updating preferences...',
      success: 'Job preferences updated successfully! ⚙️',
      error: 'Failed to update preferences'
    }).unwrap().then(() => {
      onUpdate();
      setIsModalOpen(false);
    }).catch(() => {
      // Error handled by promiseToast
    });
  };

  const formatSalary = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <>
      {/* Modern Section Container */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 overflow-hidden mb-8">
        {/* Section Header */}
        <div className="bg-gradient-to-r from-gray-50 to-white border-b border-gray-100 px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl shadow-lg">
                <Settings className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="flex items-center space-x-3">
                  <h2 className="text-2xl font-bold text-gray-900">Preferences</h2>
                  {isComplete && (
                    <div className="flex items-center space-x-1 bg-green-100 px-3 py-1 rounded-full">
                      <CheckCircle2 className="w-4 h-4 text-green-600" />
                      <span className="text-xs font-medium text-green-700">Complete</span>
                    </div>
                  )}
                </div>
                <p className="text-gray-600 text-sm mt-1">Your job preferences and career aspirations</p>
              </div>
            </div>
            
            <button
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-xl hover:from-orange-700 hover:to-red-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              <Edit3 className="w-4 h-4 mr-2" />
              Edit Preferences
            </button>
          </div>
        </div>

        {/* Section Content */}
        <div className="p-8">
          {data ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Preferred Roles */}
              <div className="bg-gradient-to-br from-purple-50 via-pink-50 to-rose-50 rounded-2xl p-6 border border-purple-200">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="flex items-center justify-center w-10 h-10 bg-purple-500 rounded-lg">
                    <Briefcase className="w-5 h-5 text-white" />
                  </div>
                  <h4 className="text-lg font-semibold text-gray-900">Preferred Roles</h4>
                </div>
                {data.preferredRoles && data.preferredRoles.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {data.preferredRoles.map((role, index) => (
                      <span 
                        key={index}
                        className="inline-flex items-center bg-white/80 backdrop-blur-sm text-purple-800 px-3 py-1 rounded-full text-sm font-medium shadow-sm border border-purple-200 hover:shadow-md transition-all duration-200"
                      >
                        {getJobRoleLabel(role)}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm flex items-center">
                    <Zap className="w-4 h-4 mr-2" />
                    No preferred roles specified
                  </p>
                )}
              </div>

              {/* Job Types */}
              <div className="bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 rounded-2xl p-6 border border-green-200">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="flex items-center justify-center w-10 h-10 bg-green-500 rounded-lg">
                    <Clock className="w-5 h-5 text-white" />
                  </div>
                  <h4 className="text-lg font-semibold text-gray-900">Job Types</h4>
                </div>
                {data.preferredJobTypes && data.preferredJobTypes.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {data.preferredJobTypes.map((type, index) => (
                      <span 
                        key={index}
                        className="inline-flex items-center bg-white/80 backdrop-blur-sm text-green-800 px-3 py-1 rounded-full text-sm font-medium shadow-sm border border-green-200 hover:shadow-md transition-all duration-200"
                      >
                        {getJobTypeLabel(type)}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm flex items-center">
                    <Clock className="w-4 h-4 mr-2" />
                    No job types specified
                  </p>
                )}
              </div>

              {/* Preferred Locations */}
              <div className="bg-gradient-to-br from-blue-50 via-cyan-50 to-sky-50 rounded-2xl p-6 border border-blue-200">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="flex items-center justify-center w-10 h-10 bg-blue-500 rounded-lg">
                    <MapPin className="w-5 h-5 text-white" />
                  </div>
                  <h4 className="text-lg font-semibold text-gray-900">Preferred Locations</h4>
                </div>
                {data.preferredLocations && data.preferredLocations.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {data.preferredLocations.map((location, index) => (
                      <span 
                        key={index}
                        className="inline-flex items-center bg-white/80 backdrop-blur-sm text-blue-800 px-3 py-1 rounded-full text-sm font-medium shadow-sm border border-blue-200 hover:shadow-md transition-all duration-200"
                      >
                        {location}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm flex items-center">
                    <MapPin className="w-4 h-4 mr-2" />
                    No preferred locations specified
                  </p>
                )}
              </div>

              {/* Salary Expectations */}
              <div className="bg-gradient-to-br from-yellow-50 via-amber-50 to-orange-50 rounded-2xl p-6 border border-yellow-200">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="flex items-center justify-center w-10 h-10 bg-yellow-500 rounded-lg">
                    <IndianRupee className="w-5 h-5 text-white" />
                  </div>
                  <h4 className="text-lg font-semibold text-gray-900">Salary Expectations</h4>
                </div>
                {data.salaryExpectationMin && data.salaryExpectationMax ? (
                  <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4">
                    <p className="text-xl font-bold text-gray-900">
                      {formatSalary(data.salaryExpectationMin)} - {formatSalary(data.salaryExpectationMax)}
                    </p>
                    <p className="text-sm text-gray-600 mt-1">Annual salary range</p>
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm flex items-center">
                    <IndianRupee className="w-4 h-4 mr-2" />
                    No salary expectations specified
                  </p>
                )}
              </div>

              {/* Work Preferences */}
              <div className="lg:col-span-2">
                <div className="bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 rounded-2xl p-6 border border-indigo-200">
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="flex items-center justify-center w-10 h-10 bg-indigo-500 rounded-lg">
                      <Home className="w-5 h-5 text-white" />
                    </div>
                    <h4 className="text-lg font-semibold text-gray-900">Work Preferences</h4>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4">
                      <div className="flex items-center space-x-3">
                        <div className={`w-4 h-4 rounded-full ${data.remoteWork ? 'bg-green-500' : 'bg-red-500'} shadow-sm`}></div>
                        <div>
                          <p className="text-sm font-medium text-gray-700">Remote Work</p>
                          <p className="text-lg font-semibold text-gray-900">
                            {data.remoteWork ? 'Yes, I prefer remote work' : 'No, I prefer office work'}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4">
                      <div className="flex items-center space-x-3">
                        <div className={`w-4 h-4 rounded-full ${data.willingToRelocate ? 'bg-green-500' : 'bg-red-500'} shadow-sm`}></div>
                        <div>
                          <p className="text-sm font-medium text-gray-700">Willing to Relocate</p>
                          <p className="text-lg font-semibold text-gray-900">
                            {data.willingToRelocate ? 'Yes, I can relocate' : 'No, I prefer current location'}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="w-20 h-20 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Settings className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Preferences Set</h3>
              <p className="text-gray-600 mb-6">Set your job preferences to help employers find you</p>
              <button
                onClick={() => setIsModalOpen(true)}
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-xl hover:from-orange-700 hover:to-red-700 transition-all duration-200 font-medium shadow-lg"
              >
                <Settings className="w-4 h-4 mr-2" />
                Set Your Preferences
              </button>
            </div>
          )}
        </div>
      </div>

      <PreferencesModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleUpdate}
        data={data}
        loading={false}
      />
    </>
  );
};

export default PreferencesSection;
