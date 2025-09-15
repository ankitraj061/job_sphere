// components/profile/modals/JobSeekerProfileModal.tsx
'use client';
import { useState, useEffect } from 'react';

interface JobSeekerProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  data: any;
  loading: boolean;
}

const JobSeekerProfileModal: React.FC<JobSeekerProfileModalProps> = ({ 
  isOpen, 
  onClose, 
  onSubmit, 
  data, 
  loading 
}) => {
  const [formData, setFormData] = useState({
    resume: '',
    linkedin: '',
    github: '',
    skills: [] as string[]
  });
  const [skillInput, setSkillInput] = useState('');

  useEffect(() => {
    if (data) {
      setFormData({
        resume: data.resume || '',
        linkedin: data.linkedin || '',
        github: data.github || '',
        skills: data.skills || []
      });
    }
  }, [data]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.skills.length === 0) {
      alert('Please add at least one skill');
      return;
    }
    onSubmit(formData);
  };

  const addSkill = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && skillInput.trim()) {
      e.preventDefault();
      if (!formData.skills.includes(skillInput.trim())) {
        setFormData({ 
          ...formData, 
          skills: [...formData.skills, skillInput.trim()] 
        });
      }
      setSkillInput('');
    }
  };

  // New function to add skill via button
  const addSkillButton = () => {
    const trimmedSkill = skillInput.trim();
    if (trimmedSkill && !formData.skills.includes(trimmedSkill)) {
      setFormData({ 
        ...formData, 
        skills: [...formData.skills, trimmedSkill] 
      });
      setSkillInput('');
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setFormData({
      ...formData,
      skills: formData.skills.filter(skill => skill !== skillToRemove)
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-6 w-full max-w-lg max-h-screen overflow-y-auto">
        <h3 className="text-lg font-semibold mb-4">Update Job Seeker Profile</h3>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Resume URL</label>
            <input
              type="url"
              value={formData.resume}
              onChange={(e) => setFormData({ ...formData, resume: e.target.value })}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="https://drive.google.com/..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">LinkedIn URL</label>
            <input
              type="url"
              value={formData.linkedin}
              onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="https://linkedin.com/in/..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">GitHub URL</label>
            <input
              type="url"
              value={formData.github}
              onChange={(e) => setFormData({ ...formData, github: e.target.value })}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="https://github.com/..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Skills (Required)</label>
            <div className="flex space-x-2">
              <input
                type="text"
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyDown={addSkill}
                className="flex-1 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Type a skill and press Enter"
              />
              <button
                type="button"
                onClick={addSkillButton}
                className="px-3 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors"
              >
                Add
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-1">Press Enter or click Add button to add skills</p>
            
            {formData.skills.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.skills.map((skill, index) => (
                  <span 
                    key={index}
                    className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center space-x-1"
                  >
                    <span>{skill}</span>
                    <button
                      type="button"
                      onClick={() => removeSkill(skill)}
                      className="text-blue-600 hover:text-blue-800 ml-1"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              {loading ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default JobSeekerProfileModal;
