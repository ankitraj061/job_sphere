// components/profile/JobSeekerProfileSection.tsx
'use client';
import { useState } from 'react';
import { FileText, Github, Linkedin, Zap, Edit3, CheckCircle2, ExternalLink, User, AlertCircle } from 'lucide-react';
import { updateJobSeekerProfile } from './profileApi';
import JobSeekerProfileModal from './JobSeekerProfileModel';
import { promiseToast } from './toasts';

interface JobSeekerProfileSectionProps {
  data: any;
  onUpdate: () => void;
  isComplete: boolean;
}

const JobSeekerProfileSection: React.FC<JobSeekerProfileSectionProps> = ({ data, onUpdate, isComplete }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleUpdate = async (formData: any) => {
    const updatePromise = updateJobSeekerProfile(formData);
    
    promiseToast(updatePromise, {
      loading: 'Updating profile...',
      success: 'Profile updated successfully! 👤',
      error: 'Failed to update profile'
    }).unwrap().then(() => {
      onUpdate();
      setIsModalOpen(false);
    }).catch(() => {
      // Error handled by promiseToast
    });
  };

  return (
    <>
      {/* Modern Section Container */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 overflow-hidden mb-8">
        {/* Section Header */}
        <div className="bg-gradient-to-r from-gray-50 to-white border-b border-gray-100 px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-xl shadow-lg">
                <User className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="flex items-center space-x-3">
                  <h2 className="text-2xl font-bold text-gray-900">Job Profile</h2>
                  {isComplete && (
                    <div className="flex items-center space-x-1 bg-green-100 px-3 py-1 rounded-full">
                      <CheckCircle2 className="w-4 h-4 text-green-600" />
                      <span className="text-xs font-medium text-green-700">Complete</span>
                    </div>
                  )}
                </div>
                <p className="text-gray-600 text-sm mt-1">Your professional links and skills showcase</p>
              </div>
            </div>
            
            <button
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl hover:from-purple-700 hover:to-indigo-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              <Edit3 className="w-4 h-4 mr-2" />
              Edit Profile
            </button>
          </div>
        </div>

        {/* Section Content */}
        <div className="p-8">
          {data ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Professional Links Column */}
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <ExternalLink className="w-5 h-5 mr-2 text-gray-600" />
                  Professional Links
                </h3>

                {/* Resume Card */}
                <div className="bg-gradient-to-br from-red-50 to-pink-50 rounded-xl p-6 border border-red-100 hover:shadow-lg transition-all duration-200">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center justify-center w-12 h-12 bg-red-500 rounded-xl shadow-md">
                      <FileText className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-red-600 uppercase tracking-wide">Resume</p>
                      {data.resume ? (
                        <a 
                          href={data.resume} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="inline-flex items-center text-lg font-semibold text-gray-900 hover:text-red-600 transition-colors mt-1"
                        >
                          View Resume
                          <ExternalLink className="w-4 h-4 ml-2" />
                        </a>
                      ) : (
                        <div className="flex items-center mt-1">
                          <AlertCircle className="w-4 h-4 text-gray-400 mr-2" />
                          <span className="text-gray-500">No resume uploaded</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* LinkedIn Card */}
                <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-6 border border-blue-100 hover:shadow-lg transition-all duration-200">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center justify-center w-12 h-12 bg-blue-600 rounded-xl shadow-md">
                      <Linkedin className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-blue-600 uppercase tracking-wide">LinkedIn</p>
                      {data.linkedin ? (
                        <a 
                          href={data.linkedin} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="inline-flex items-center text-lg font-semibold text-gray-900 hover:text-blue-600 transition-colors mt-1 truncate"
                        >
                          LinkedIn Profile
                          <ExternalLink className="w-4 h-4 ml-2 flex-shrink-0" />
                        </a>
                      ) : (
                        <div className="flex items-center mt-1">
                          <AlertCircle className="w-4 h-4 text-gray-400 mr-2" />
                          <span className="text-gray-500">No LinkedIn profile</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* GitHub Card */}
                <div className="bg-gradient-to-br from-gray-50 to-slate-50 rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-all duration-200">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center justify-center w-12 h-12 bg-gray-800 rounded-xl shadow-md">
                      <Github className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">GitHub</p>
                      {data.github ? (
                        <a 
                          href={data.github} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="inline-flex items-center text-lg font-semibold text-gray-900 hover:text-gray-700 transition-colors mt-1 truncate"
                        >
                          GitHub Profile
                          <ExternalLink className="w-4 h-4 ml-2 flex-shrink-0" />
                        </a>
                      ) : (
                        <div className="flex items-center mt-1">
                          <AlertCircle className="w-4 h-4 text-gray-400 mr-2" />
                          <span className="text-gray-500">No GitHub profile</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Skills Column */}
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Zap className="w-5 h-5 mr-2 text-gray-600" />
                  Skills & Expertise
                </h3>

                <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl p-6 border border-emerald-100 min-h-[300px]">
                  {data.skills && data.skills.length > 0 ? (
                    <>
                      <div className="flex items-center justify-between mb-4">
                        <p className="text-sm font-medium text-emerald-600 uppercase tracking-wide">
                          Technical Skills ({data.skills.length})
                        </p>
                      </div>
                      <div className="flex flex-wrap gap-3">
                        {data.skills.map((skill: string, index: number) => (
                          <span 
                            key={index}
                            className="inline-flex items-center bg-white/80 backdrop-blur-sm text-gray-800 px-4 py-2 rounded-full text-sm font-medium shadow-sm border border-emerald-200 hover:shadow-md hover:scale-105 transition-all duration-200"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full text-center">
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                        <Zap className="w-8 h-8 text-gray-400" />
                      </div>
                      <h4 className="text-lg font-medium text-gray-700 mb-2">No Skills Added</h4>
                      <p className="text-gray-500 text-sm">Add your technical skills to showcase your expertise</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="w-20 h-20 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <User className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Profile Information</h3>
              <p className="text-gray-600 mb-6">Please add your professional links and skills to complete your profile</p>
              <button
                onClick={() => setIsModalOpen(true)}
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl hover:from-purple-700 hover:to-indigo-700 transition-all duration-200 font-medium shadow-lg"
              >
                <User className="w-4 h-4 mr-2" />
                Add Profile Details
              </button>
            </div>
          )}
        </div>
      </div>

      <JobSeekerProfileModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleUpdate}
        data={data}
        loading={false}
      />
    </>
  );
};

export default JobSeekerProfileSection;
