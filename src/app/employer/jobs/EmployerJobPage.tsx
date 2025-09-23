"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  FiPlus,
  FiMoreVertical,
  FiMapPin,
  FiDollarSign,
  FiUsers,
  FiTrash2,
  FiEdit,
  FiPlayCircle,
  FiPauseCircle,
  FiCheckCircle,
} from "react-icons/fi";
import { MdOutlineCreateNewFolder } from "react-icons/md";
import JobCreateModal from "./JobCreateModal";
import JobFormModal from "./JobFormModal";
import { Job, JobFormField, JobForm, ApiResponse, JobsResponse, JobFormResponse } from "./types";

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

function JobFormPreviewModal({
  open,
  onClose,
  fields,
}: {
  open: boolean;
  onClose: () => void;
  fields: JobFormField[] | null;
}) {
  if (!open || !fields) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-60 p-4">
      <div className="bg-white rounded-lg w-full max-w-3xl max-h-[90vh] overflow-auto p-6">
        <h2 className="text-2xl font-semibold mb-4">Job Form Preview</h2>
        <div className="space-y-4">
          {fields.map((field) => (
            <div key={field.id} className="border rounded p-4 bg-gray-50">
              <div className="font-medium">{field.label}</div>
              <div className="text-sm text-gray-600">
                Type: {field.fieldType}
              </div>
              {field.options && field.options.length > 0 && (
                <div className="mt-1 text-sm">
                  Options: {field.options.join(", ")}
                </div>
              )}
              {field.isRequired && ( // Fixed: changed from 'required' to 'isRequired'
                <div className="mt-1 text-sm text-red-600">* Required</div>
              )}
            </div>
          ))}
        </div>

        <div className="flex justify-end mt-6">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default function EmployerJobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Dropdown state
  const [dropdownOpen, setDropdownOpen] = useState<number | null>(null);

  // Job Create/Edit Modal
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingJob, setEditingJob] = useState<Job | null>(null);

  // Job Form Modal
  const [formModalOpen, setFormModalOpen] = useState(false);
  const [currentJobId, setCurrentJobId] = useState<number | null>(null);
  const [editingJobForm, setEditingJobForm] = useState<JobFormField[] | null>(null);

  // Status Update Modal
  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [statusUpdateJob, setStatusUpdateJob] = useState<Job | null>(null);

  // Delete Confirmation Modal
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [jobToDelete, setJobToDelete] = useState<Job | null>(null);

  // Preview job
  const [previewFormOpen, setPreviewFormOpen] = useState(false);
  const [previewFormFields, setPreviewFormFields] = useState<JobFormField[] | null>(null);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const params: { page?: number; search?: string; status?: string } = { page };
      if (searchTerm.trim()) params.search = searchTerm.trim();
      if (statusFilter !== "All Status")
        params.status = statusFilter.toUpperCase();

      const response = await axios.get<ApiResponse<JobsResponse>>(`${backendUrl}/api/jobs/employer`, {
        params,
        withCredentials: true,
      });

      const data = response.data;
      if (data.success) {
        setJobs(data.data.jobs);
        setTotalPages(data.data.pagination.pages);
      } else {
        alert("Failed to load jobs.");
      }
    } catch (error) {
      console.error("Fetch jobs error:", error);
      alert("Error fetching jobs.");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchJobs();
  }, [page, statusFilter]);

  // ✅ Create OR Update Job
  const handleSaveJob = async (form: JobForm) => {
    try {
      const payload = {
        title: form.title,
        role: form.role || "",
        description: form.description,
        requirements: form.requirements,
        location: form.location,
        jobType: form.jobType,
        salaryMin: form.salaryMin ? Number(form.salaryMin) : null,
        salaryMax: form.salaryMax ? Number(form.salaryMax) : null,
        noOfOpenings: form.noOfOpenings ? Number(form.noOfOpenings) : 1, // Fixed: changed from 'openings'
      };

      let response;
      if (editingJob) {
        response = await axios.put<ApiResponse<Job>>(
          `${backendUrl}/api/jobs/${editingJob.id}`,
          payload,
          { withCredentials: true }
        );
      } else {
        response = await axios.post<ApiResponse<Job>>(`${backendUrl}/api/jobs/create`, payload, {
          withCredentials: true,
        });
      }

      if (response.data.success) {
        setDrawerOpen(false);
        setEditingJob(null);
        fetchJobs();
        alert(editingJob ? "Job updated successfully!" : "Job created successfully!");
      } else {
        alert("Failed to save job");
      }
    } catch (err) {
      console.error("Error saving job:", err);
      alert("Error saving job");
    }
  };

  // ✅ Update Job Status
  const handleUpdateJobStatus = async (jobId: number, newStatus: string) => {
    try {
      const response = await axios.patch<ApiResponse<Job>>(
        `${backendUrl}/api/jobs/${jobId}/status`,
        { status: newStatus },
        { withCredentials: true }
      );

      if (response.data.success) {
        alert("Job status updated successfully!");
        fetchJobs();
        setStatusModalOpen(false);
        setStatusUpdateJob(null);
      } else {
        alert("Failed to update job status");
      }
    } catch (err) {
      console.error("Error updating job status:", err);
      alert("Error updating job status");
    }
  };

  // ✅ Delete Job
  const handleDeleteJob = async (jobId: number) => {
    try {
      const response = await axios.delete<ApiResponse<{ message: string }>>(`${backendUrl}/api/jobs/${jobId}`, {
        withCredentials: true,
      });

      if (response.data.success) {
        alert("Job deleted successfully!");
        fetchJobs();
        setDeleteModalOpen(false);
        setJobToDelete(null);
      } else {
        alert("Failed to delete job");
      }
    } catch (err) {
      console.error("Error deleting job:", err);
      alert("Error deleting job");
    }
  };

  // ✅ Fetch Job Form
  const fetchJobForm = async (jobId: number): Promise<JobFormField[]> => {
    try {
      const response = await axios.get<ApiResponse<JobFormResponse>>(`${backendUrl}/api/jobs/${jobId}/form`, {
        withCredentials: true,
      });

      if (response.data.success) {
        return response.data.data.fields || [];
      }
      return [];
    } catch (err) {
      console.error("Error fetching job form:", err);
      return [];
    }
  };

  // ✅ Job Form Save/Update
  const handleSaveJobForm = async (fields: JobFormField[]) => {
    if (!currentJobId) return;
    
    try {
      // Convert fields to match API request format
      const apiFields = fields.map(field => ({
        label: field.label,
        fieldType: field.fieldType,
        isRequired: field.isRequired, // Use isRequired instead of required
        order: field.order,
        options: field.options || []
      }));

      let response;
      if (editingJobForm) {
        // Update existing form
        response = await axios.put<ApiResponse<JobFormResponse>>(
          `${backendUrl}/api/jobs/${currentJobId}/form`,
          { fields: apiFields },
          { withCredentials: true }
        );
      } else {
        // Create new form
        response = await axios.post<ApiResponse<JobFormResponse>>(
          `${backendUrl}/api/jobs/${currentJobId}/form`,
          { fields: apiFields },
          { withCredentials: true }
        );
      }

      if (response.data.success) {
        alert(editingJobForm ? "Job form updated successfully!" : "Job form created successfully!");
        setFormModalOpen(false);
        setEditingJobForm(null);
      } else {
        alert("Failed to save job form");
      }
    } catch (err) {
      console.error("Error saving job form:", err);
      alert("Error saving job form");
    }
  };

  // ✅ Delete Job Form Field
  const handleDeleteJobFormField = async (jobId: number, fieldId: number) => {
    try {
      const response = await axios.delete<ApiResponse<{ message: string }>>(
        `${backendUrl}/api/jobs/${jobId}/form/field/${fieldId}`,
        { withCredentials: true }
      );

      if (response.data.success) {
        alert("Job form field deleted successfully!");
        // Refresh the form if it's currently open
        if (formModalOpen && currentJobId === jobId) {
          const updatedFields = await fetchJobForm(jobId);
          setEditingJobForm(updatedFields);
        }
      } else {
        alert("Failed to delete job form field");
      }
    } catch (err) {
      console.error("Error deleting job form field:", err);
      alert("Error deleting job form field");
    }
  };

  const toggleDropdown = (jobId: number) => {
    setDropdownOpen(dropdownOpen === jobId ? null : jobId);
  };

  // Handle opening job form modal for editing
  const handleOpenJobFormModal = async (jobId: number, isEdit: boolean = false) => {
    setCurrentJobId(jobId);
    
    if (isEdit) {
      const existingFields = await fetchJobForm(jobId);
      setEditingJobForm(existingFields);
    } else {
      setEditingJobForm(null);
    }
    
    setFormModalOpen(true);
    setDropdownOpen(null);
  };

  const handlePreviewJobForm = async (jobId: number) => {
    const fields = await fetchJobForm(jobId);
    if (fields.length === 0) {
      alert("No form exists for this job yet.");
      return;
    }
    setPreviewFormFields(fields);
    setPreviewFormOpen(true);
    setDropdownOpen(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-10">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6 mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <h1 className="text-3xl font-bold text-gray-900">Job Postings</h1>
          <div className="flex gap-4 flex-wrap w-full md:w-auto md:flex-nowrap items-center">
            <input
              type="text"
              placeholder="Search jobs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="rounded-xl px-4 py-3 bg-gray-50 border-none focus:ring-2 focus:ring-blue-500 shadow transition-all text-lg"
            />
            <button
              onClick={() => {
                setPage(1);
                fetchJobs();
              }}
              className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 shadow-lg font-semibold transition"
            >
              Search
            </button>
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPage(1);
              }}
              className="rounded-xl px-4 py-3 bg-gray-50 border-none focus:ring-2 focus:ring-blue-500 text-lg shadow transition"
            >
              <option value="All Status">All Status</option>
              <option value="ACTIVE">Active</option>
              <option value="PAUSED">Paused</option>
              <option value="COMPLETED">Completed</option>
            </select>
            <button
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 shadow-lg font-semibold transition"
              onClick={() => {
                setEditingJob(null);
                setDrawerOpen(true);
              }}
            >
              <FiPlus /> Create Job Posting
            </button>
          </div>
        </div>

        {/* Job List */}
        {loading ? (
          <div className="flex items-center justify-center min-h-[50vh]">
            <div className="flex items-center gap-4 bg-white/80 p-8 rounded-2xl shadow-lg border border-white/20">
              <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-gray-700 text-lg font-semibold">Loading jobs...</p>
            </div>
          </div>
        ) : jobs.length === 0 ? (
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-12 mt-8 text-center">
            <div className="mx-auto mb-6 w-24 h-24 flex items-center justify-center rounded-xl bg-blue-100">
              <FiUsers className="w-12 h-12 text-blue-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">No jobs found</h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              There are no jobs to show. Adjust your search or create a new posting.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {jobs.map((job) => (
              <div
                key={job.id}
                className={`bg-white/90 backdrop-blur-sm border border-white/30 rounded-2xl shadow-xl p-6 grid grid-cols-1 md:grid-cols-3 gap-8 hover:shadow-2xl transition-all ${
                  dropdownOpen === job.id ? 'relative z-50' : 'relative'
                }`}
              >
                <div className="md:col-span-2">
                  <h2 className="text-xl font-bold text-gray-900 mb-1">{job.title}</h2>
                  <div className="flex flex-wrap gap-4 text-gray-500 text-sm mb-2">
                    <span>{job.role || "-"}</span>
                    {job.location && (
                      <span className="flex items-center gap-1">
                        <FiMapPin className="text-blue-400" /> {job.location}
                      </span>
                    )}
                  </div>
                  <p className="text-gray-700 mt-2 line-clamp-2">{job.description}</p>
                  <div className="flex flex-wrap gap-3 mt-4">
                    <span className="flex items-center gap-1 bg-blue-50 px-3 py-1 rounded-lg font-medium text-blue-700">
                      <FiDollarSign className="text-blue-400" />
                      {job.salaryMin ? job.salaryMin / 1000 + "k" : "N/A"} -{" "}
                      {job.salaryMax ? job.salaryMax / 1000 + "k" : "N/A"}
                    </span>
                    <span className="flex items-center gap-1 bg-purple-50 px-3 py-1 rounded-lg font-medium text-purple-700">
                      <FiUsers className="text-purple-400" />
                      {job.totalApplications} applicants
                    </span>
                    <span className="px-3 py-1 text-xs font-semibold rounded-full bg-gradient-to-r from-blue-200 to-indigo-200 text-blue-700">
                      {job.jobType.replace("_", "-")}
                    </span>
                    <span
                      className={`px-3 py-1 text-xs font-semibold rounded-full ${
                        job.status === "ACTIVE"
                          ? "bg-blue-600 text-white"
                          : job.status === "PAUSED"
                          ? "bg-yellow-400 text-black"
                          : "bg-gray-300 text-gray-700"
                      }`}
                    >
                      {job.status.charAt(0).toUpperCase() +
                        job.status.slice(1).toLowerCase()}
                    </span>
                  </div>
                </div>

                {/* Actions Dropdown */}
                <div className="flex flex-col gap-2 items-end justify-start">
                  <button
                    onClick={() => toggleDropdown(job.id)}
                    className="p-2 rounded-full hover:bg-blue-50 transition relative z-10"
                  >
                    <FiMoreVertical className="w-6 h-6 text-gray-700" />
                  </button>
                  {dropdownOpen === job.id && (
                    <div className="absolute right-0 top-12 w-56 bg-white/95 border border-blue-100 rounded-xl shadow-2xl z-[60] overflow-hidden">
                      <ul className="text-sm text-gray-700 divide-y">
                        <li
                          className="px-4 py-3 flex items-center gap-3 font-medium cursor-pointer hover:bg-blue-50 transition"
                          onClick={() => {
                            setEditingJob(job);
                            setDrawerOpen(true);
                            setDropdownOpen(null);
                          }}
                        >
                          <span className="inline-flex w-8 h-8 items-center justify-center bg-blue-500 rounded-xl shadow">
                            <FiEdit className="text-white" />
                          </span>
                          Update Job
                        </li>
                        <li
                          className="px-4 py-3 flex items-center gap-3 font-medium cursor-pointer hover:bg-green-50 transition"
                          onClick={() => {
                            setStatusUpdateJob(job);
                            setStatusModalOpen(true);
                            setDropdownOpen(null);
                          }}
                        >
                          <span className="inline-flex w-8 h-8 items-center justify-center bg-green-500 rounded-xl shadow">
                            <FiPlayCircle className="text-white" />
                          </span>
                          Update Job Status
                        </li>
                        <li
                          className="px-4 py-3 flex items-center gap-3 font-medium cursor-pointer text-red-600 hover:bg-red-50 transition"
                          onClick={() => {
                            setJobToDelete(job);
                            setDeleteModalOpen(true);
                            setDropdownOpen(null);
                          }}
                        >
                          <span className="inline-flex w-8 h-8 items-center justify-center bg-red-500 rounded-xl shadow">
                            <FiTrash2 className="text-white" />
                          </span>
                          Delete Job
                        </li>
                        <li
                          className="px-4 py-3 flex items-center gap-3 font-medium cursor-pointer hover:bg-purple-50 transition"
                          onClick={() => handleOpenJobFormModal(job.id, false)}
                        >
                          <span className="inline-flex w-8 h-8 items-center justify-center bg-purple-500 rounded-xl shadow">
                            <MdOutlineCreateNewFolder className="text-white" />
                          </span>
                          Create Job Form
                        </li>
                        <li
                          className="px-4 py-3 flex items-center gap-3 font-medium cursor-pointer hover:bg-blue-50 transition"
                          onClick={() => handleOpenJobFormModal(job.id, true)}
                        >
                          <span className="inline-flex w-8 h-8 items-center justify-center bg-blue-500 rounded-xl shadow">
                            <FiEdit className="text-white" />
                          </span>
                          Update Job Form
                        </li>
                        <li
                          className="px-4 py-3 flex items-center gap-3 font-medium cursor-pointer hover:bg-gray-50 transition"
                          onClick={() => handlePreviewJobForm(job.id)}
                        >
                          <span className="inline-flex w-8 h-8 items-center justify-center bg-indigo-500 rounded-xl shadow">
                            <FiUsers className="text-white" />
                          </span>
                          Preview Job Form
                        </li>
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-3 mt-10 bg-white/80 rounded-xl shadow-lg p-4 border border-white/20">
            <button
              onClick={() => setPage(Math.max(1, page - 1))}
              disabled={page === 1}
              className="px-6 py-2 bg-blue-100 text-blue-700 font-semibold rounded-lg hover:bg-blue-200 transition disabled:opacity-40"
            >
              Previous
            </button>
            <span className="px-4 py-2 font-bold text-blue-700 rounded-lg">
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => setPage(Math.min(totalPages, page + 1))}
              disabled={page === totalPages}
              className="px-6 py-2 bg-blue-100 text-blue-700 font-semibold rounded-lg hover:bg-blue-200 transition disabled:opacity-40"
            >
              Next
            </button>
          </div>
        )}
      </div>

      {/* Job Create/Edit Modal */}
      <JobCreateModal
        open={drawerOpen}
        onClose={() => {
          setDrawerOpen(false);
          setEditingJob(null);
        }}
        onSave={handleSaveJob}
        editingJob={editingJob}
      />

      {/* Job Form Modal */}
      <JobFormModal
        open={formModalOpen}
        onClose={() => {
          setFormModalOpen(false);
          setEditingJobForm(null);
        }}
        onSave={handleSaveJobForm}
        existingFields={editingJobForm}
        jobId={currentJobId}
        onDeleteField={handleDeleteJobFormField}
      />

      <JobFormPreviewModal
        open={previewFormOpen}
        onClose={() => {
          setPreviewFormOpen(false);
          setPreviewFormFields(null);
        }}
        fields={previewFormFields}
      />

      {/* Status Update Modal */}
      {statusModalOpen && statusUpdateJob && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Update Job Status</h3>
            <p className="text-gray-600 mb-4">
              Update status for &quot;{statusUpdateJob.title}&quot;
            </p>
            <div className="flex flex-col gap-3">
              <button
                onClick={() => handleUpdateJobStatus(statusUpdateJob.id, "ACTIVE")}
                className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                disabled={statusUpdateJob.status === "ACTIVE"}
              >
                <FiPlayCircle />
                Set as Active
              </button>
              <button
                onClick={() => handleUpdateJobStatus(statusUpdateJob.id, "PAUSED")}
                className="flex items-center gap-2 px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                disabled={statusUpdateJob.status === "PAUSED"}
              >
                <FiPauseCircle />
                Set as Paused
              </button>
              <button
                onClick={() => handleUpdateJobStatus(statusUpdateJob.id, "COMPLETED")}
                className="flex items-center gap-2 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                disabled={statusUpdateJob.status === "COMPLETED"}
              >
                <FiCheckCircle />
                Set as Completed
              </button>
              <button
                onClick={() => {
                  setStatusModalOpen(false);
                  setStatusUpdateJob(null);
                }}
                className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteModalOpen && jobToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4 text-red-600">Delete Job</h3>
            <p className="text-gray-600 mb-4">
              Are you sure you want to delete &quot;{jobToDelete.title}&quot;? This action cannot be undone.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => {
                  setDeleteModalOpen(false);
                  setJobToDelete(null);
                }}
                className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteJob(jobToDelete.id)}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
