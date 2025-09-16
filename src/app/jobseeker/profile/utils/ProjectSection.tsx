// components/profile/ProjectsSection.tsx
'use client';
import { useState } from 'react';
import { Rocket, Plus, Edit3, Trash2, CheckCircle2, Calendar, Github, ExternalLink, Code, Zap } from 'lucide-react';
import { Project } from './types';
import { addProject, updateProject, deleteProject } from './profileApi';
import ProjectModal from './ProjectModel';
import { promiseToast, showActionToast } from './toasts';

interface ProjectsSectionProps {
  data: Project[];
  onUpdate: () => void;
  isComplete: boolean;
}

const ProjectsSection: React.FC<ProjectsSectionProps> = ({ data, onUpdate, isComplete }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  const handleAdd = async (formData: any) => {
    const addPromise = addProject(formData);
    
    promiseToast(addPromise, {
      loading: 'Adding project...',
      success: 'Project added successfully! 🚀',
      error: 'Failed to add project'
    }).then(() => {
      onUpdate();
      setIsModalOpen(false);
    }).catch(() => {
      // Error is handled by promiseToast
    });
  };

  const handleUpdate = async (formData: any) => {
    if (!editingProject) return;
    
    const updatePromise = updateProject(editingProject.id, formData);
    
    promiseToast(updatePromise, {
      loading: 'Updating project...',
      success: 'Project updated successfully! ✅',
      error: 'Failed to update project'
    }).then(() => {
      onUpdate();
      setIsModalOpen(false);
      setEditingProject(null);
    }).catch(() => {
      // Error handled by promiseToast
    });
  };

  const handleDelete = async (id: number) => {
    showActionToast(
      'Delete Project',
      'Confirm',
      async () => {
        const deletePromise = deleteProject(id);
        promiseToast(deletePromise, {
          loading: 'Deleting project...',
          success: 'Project deleted successfully! 🗑️',
          error: 'Failed to delete project'
        }).then(() => {
          onUpdate();
        }).catch(() => {
          // Error handled by promiseToast
        });
      },
      'Are you sure you want to delete this project?'
    );
  };

  const openAddModal = () => {
    setEditingProject(null);
    setIsModalOpen(true);
  };

  const openEditModal = (project: Project) => {
    setEditingProject(project);
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
              <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl shadow-lg">
                <Rocket className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="flex items-center space-x-3">
                  <h2 className="text-2xl font-bold text-gray-900">Projects</h2>
                  {isComplete && (
                    <div className="flex items-center space-x-1 bg-green-100 px-3 py-1 rounded-full">
                      <CheckCircle2 className="w-4 h-4 text-green-600" />
                      <span className="text-xs font-medium text-green-700">Complete</span>
                    </div>
                  )}
                </div>
                <p className="text-gray-600 text-sm mt-1">Your portfolio projects and technical achievements</p>
              </div>
            </div>
            
            <button
              onClick={openAddModal}
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Project
            </button>
          </div>
        </div>

        {/* Section Content */}
        <div className="p-8">
          {data && data.length > 0 ? (
            <div className="space-y-6">
              {data.map((project, index) => (
                <div 
                  key={project.id} 
                  className="bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 rounded-2xl border border-indigo-200 p-6 hover:shadow-lg transition-all duration-200 hover:border-indigo-300"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      {/* Header with title and status */}
                      <div className="flex items-start space-x-4 mb-4">
                        <div className="flex items-center justify-center w-12 h-12 bg-indigo-500 rounded-xl shadow-md flex-shrink-0">
                          <Code className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-1">
                            <h3 className="text-xl font-bold text-gray-900">
                              {project.title}
                            </h3>
                            {project.isActive && (
                              <span className="inline-flex items-center bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-medium">
                                <Zap className="w-3 h-3 mr-1" />
                                Active
                              </span>
                            )}
                          </div>
                          <p className="text-gray-700 leading-relaxed">
                            {project.description}
                          </p>
                        </div>
                      </div>

                      {/* Technologies */}
                      {project.technologies && project.technologies.length > 0 && (
                        <div className="mb-4">
                          <p className="text-sm font-medium text-gray-600 mb-2">Technologies Used:</p>
                          <div className="flex flex-wrap gap-2">
                            {project.technologies.map((tech, index) => (
                              <span 
                                key={index}
                                className="inline-flex items-center bg-white/80 backdrop-blur-sm text-indigo-800 px-3 py-1 rounded-full text-xs font-medium shadow-sm border border-indigo-200 hover:shadow-md transition-all duration-200"
                              >
                                {tech}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Date range */}
                      <div className="flex items-center space-x-3 mb-4">
                        <Calendar className="w-4 h-4 text-indigo-600 flex-shrink-0" />
                        <span className="text-gray-700 font-medium">
                          {formatDate(project.startDate)} - {formatDate(project.endDate)}
                        </span>
                      </div>

                      {/* Project links */}
                      <div className="flex space-x-6">
                        {project.githubUrl && (
                          <a 
                            href={project.githubUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="inline-flex items-center text-gray-700 hover:text-indigo-600 transition-colors font-medium text-sm"
                          >
                            <Github className="w-4 h-4 mr-2" />
                            View Code
                          </a>
                        )}
                        {project.liveUrl && (
                          <a 
                            href={project.liveUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="inline-flex items-center text-gray-700 hover:text-indigo-600 transition-colors font-medium text-sm"
                          >
                            <ExternalLink className="w-4 h-4 mr-2" />
                            Live Demo
                          </a>
                        )}
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="flex flex-col space-y-2 ml-4">
                      <button
                        onClick={() => openEditModal(project)}
                        className="inline-flex items-center px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm font-medium shadow-sm"
                      >
                        <Edit3 className="w-3 h-3 mr-1" />
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(project.id)}
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
                <Rocket className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Projects Added</h3>
              <p className="text-gray-600 mb-6">Showcase your technical projects and achievements</p>
              <button
                onClick={openAddModal}
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 font-medium shadow-lg"
              >
                <Rocket className="w-4 h-4 mr-2" />
                Add Your First Project
              </button>
            </div>
          )}
        </div>
      </div>

      <ProjectModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingProject(null);
        }}
        onSubmit={editingProject ? handleUpdate : handleAdd}
        data={editingProject}
        loading={false}
      />
    </>
  );
};

export default ProjectsSection;
