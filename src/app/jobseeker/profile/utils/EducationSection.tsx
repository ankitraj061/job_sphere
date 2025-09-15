// components/profile/EducationSection.tsx
'use client';
import { useState } from 'react';
import { GraduationCap, Plus, Edit3, Trash2, CheckCircle2, Calendar, MapPin, Award, BookOpen } from 'lucide-react';
import { Education } from './types';
import { addEducation, updateEducation, deleteEducation } from './profileApi';
import EducationModal from './EducationModel';
import { promiseToast, showActionToast } from './toasts';

interface EducationSectionProps {
  data: Education[];
  onUpdate: () => void;
  isComplete: boolean;
}

const EducationSection: React.FC<EducationSectionProps> = ({ data, onUpdate, isComplete }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEducation, setEditingEducation] = useState<Education | null>(null);

  const handleAdd = async (formData: any) => {
    const addPromise = addEducation(formData);
    
    promiseToast(addPromise, {
      loading: 'Adding education...',
      success: 'Education added successfully! 🎓',
      error: 'Failed to add education'
    }).unwrap().then(() => {
      onUpdate();
      setIsModalOpen(false);
    }).catch(() => {
      // Error is handled by promiseToast
    });
  };

  const handleUpdate = async (formData: any) => {
    if (!editingEducation) return;
    
    const updatePromise = updateEducation(editingEducation.id, formData);
    
    promiseToast(updatePromise, {
      loading: 'Updating education...',
      success: 'Education updated successfully! ✅',
      error: 'Failed to update education'
    }).unwrap().then(() => {
      onUpdate();
      setIsModalOpen(false);
      setEditingEducation(null);
    }).catch(() => {
      // Error handled by promiseToast
    });
  };

  const handleDelete = async (id: number) => {
    showActionToast(
      'Delete Education',
      'Confirm',
      async () => {
        const deletePromise = deleteEducation(id);
        promiseToast(deletePromise, {
          loading: 'Deleting education...',
          success: 'Education deleted successfully! 🗑️',
          error: 'Failed to delete education'
        }).unwrap().then(() => {
          onUpdate();
        }).catch(() => {
          // Error handled by promiseToast
        });
      },
      'Are you sure you want to delete this education entry?'
    );
  };

  const openAddModal = () => {
    setEditingEducation(null);
    setIsModalOpen(true);
  };

  const openEditModal = (education: Education) => {
    setEditingEducation(education);
    setIsModalOpen(true);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short' 
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
              <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl shadow-lg">
                <GraduationCap className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="flex items-center space-x-3">
                  <h2 className="text-2xl font-bold text-gray-900">Education</h2>
                  {isComplete && (
                    <div className="flex items-center space-x-1 bg-green-100 px-3 py-1 rounded-full">
                      <CheckCircle2 className="w-4 h-4 text-green-600" />
                      <span className="text-xs font-medium text-green-700">Complete</span>
                    </div>
                  )}
                </div>
                <p className="text-gray-600 text-sm mt-1">Your academic qualifications and achievements</p>
              </div>
            </div>
            
            <button
              onClick={openAddModal}
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl hover:from-emerald-700 hover:to-teal-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Education
            </button>
          </div>
        </div>

        {/* Section Content */}
        <div className="p-8">
          {data && data.length > 0 ? (
            <div className="space-y-6">
              {data.map((education, index) => (
                <div 
                  key={education.id} 
                  className="bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 rounded-2xl border border-emerald-200 p-6 hover:shadow-lg transition-all duration-200 hover:border-emerald-300"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      {/* Header with degree and field */}
                      <div className="flex items-start space-x-4 mb-4">
                        <div className="flex items-center justify-center w-12 h-12 bg-emerald-500 rounded-xl shadow-md flex-shrink-0">
                          <BookOpen className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-gray-900 mb-1">
                            {education.degree}
                          </h3>
                          <p className="text-emerald-700 font-medium text-lg">
                            {education.fieldOfStudy}
                          </p>
                        </div>
                      </div>

                      {/* Institution and details */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div className="flex items-center space-x-3">
                          <MapPin className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                          <span className="text-gray-700 font-medium">{education.institution}</span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <Calendar className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                          <span className="text-gray-700 font-medium">
                            {formatDate(education.startDate)} - {formatDate(education.endDate)}
                          </span>
                        </div>
                      </div>

                      {/* Grade */}
                      {education.grade && (
                        <div className="flex items-center space-x-3 mb-3">
                          <Award className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                          <span className="text-emerald-700 font-semibold bg-emerald-100 px-3 py-1 rounded-full text-sm">
                            Grade: {education.grade}
                          </span>
                        </div>
                      )}

                      {/* Description */}
                      {education.description && (
                        <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 mt-4">
                          <p className="text-gray-700 leading-relaxed">{education.description}</p>
                        </div>
                      )}
                    </div>

                    {/* Action buttons */}
                    <div className="flex flex-col space-y-2 ml-4">
                      <button
                        onClick={() => openEditModal(education)}
                        className="inline-flex items-center px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm font-medium shadow-sm"
                      >
                        <Edit3 className="w-3 h-3 mr-1" />
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(education.id)}
                        className="inline-flex items-center px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm font-medium shadow-sm"
                      >
                        <Trash2 className="w-3 h-3 mr-1" />
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="w-20 h-20 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <GraduationCap className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Education Added</h3>
              <p className="text-gray-600 mb-6">Add your academic qualifications to showcase your educational background</p>
              <button
                onClick={openAddModal}
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl hover:from-emerald-700 hover:to-teal-700 transition-all duration-200 font-medium shadow-lg"
              >
                <GraduationCap className="w-4 h-4 mr-2" />
                Add Your First Education
              </button>
            </div>
          )}
        </div>
      </div>

      <EducationModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingEducation(null);
        }}
        onSubmit={editingEducation ? handleUpdate : handleAdd}
        data={editingEducation}
        loading={false}
      />
    </>
  );
};

export default EducationSection;
