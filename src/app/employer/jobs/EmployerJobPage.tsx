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

    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

    interface Job {
    id: number;
    title: string;
    role?: string;
    description: string;
    requirements?: string;
    location?: string;
    jobType: string;
    salaryMin?: number;
    salaryMax?: number;
    noOfOpenings?: number;
    status: string;
    totalApplications: number;
    createdAt: string;
    }

    interface JobFormField {
    id: number;
    type: string;
    label: string;
    required: boolean;
    options?: string[];
    order: number;
    isDefault?: boolean;
    fieldType: "TEXT" | "NUMBER" | "EMAIL" | "PHONE" | "LOCATION" |
             "RESUME_URL" | "TEXTAREA" | "SELECT" | "MULTISELECT" |
             "CHECKBOX" | "DATE" | "YEARS_OF_EXPERIENCE";
    }

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
                Type: {field.type}
              </div>
              {field.options && field.options.length > 0 && (
                <div className="mt-1 text-sm">
                  Options: {field.options.join(", ")}
                </div>
              )}
              {field.required && (
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

    //preview job
    const [previewFormOpen, setPreviewFormOpen] = useState(false);
    const [previewFormFields, setPreviewFormFields] = useState<JobFormField[] | null>(null);


    const fetchJobs = async () => {
        setLoading(true);
        try {
        const params: any = { page };
        if (searchTerm.trim()) params.search = searchTerm.trim();
        if (statusFilter !== "All Status")
            params.status = statusFilter.toUpperCase();

        const response = await axios.get(`${backendUrl}/api/jobs/employer`, {
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
    const handleSaveJob = async (form: any) => {
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
            noOfOpenings: form.openings ? Number(form.openings) : 1,
        };

        let response;
        if (editingJob) {
            response = await axios.put(
            `${backendUrl}/api/jobs/${editingJob.id}`,
            payload,
            { withCredentials: true }
            );
        } else {
            response = await axios.post(`${backendUrl}/api/jobs/create`, payload, {
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
        const response = await axios.patch(
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
        const response = await axios.delete(`${backendUrl}/api/jobs/${jobId}`, {
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
    const fetchJobForm = async (jobId: number) => {
        try {
        const response = await axios.get(`${backendUrl}/api/jobs/${jobId}/form`, {
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
    const handleSaveJobForm = async (fields: any[]) => {
        if (!currentJobId) return;
        
        try {
        let response;
        if (editingJobForm) {
            // Update existing form
            response = await axios.put(
            `${backendUrl}/api/jobs/${currentJobId}/form`,
            { fields },
            { withCredentials: true }
            );
        } else {
            // Create new form
            response = await axios.post(
            `${backendUrl}/api/jobs/${currentJobId}/form`,
            { fields },
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
        const response = await axios.delete(
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
        // Filter out default fields for editing (optional - you can keep them if you want users to edit default fields too)
        const customFields = existingFields.filter((field: JobFormField) => !field.isDefault);
        setEditingJobForm(existingFields); // or customFields if you only want to show custom fields
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
        <div className="max-w-6xl mx-auto pt-4">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between flex-wrap gap-4">
            <h1 className="text-3xl font-bold text-gray-800 flex-grow">
            Job Postings
            </h1>
            <div className="flex gap-3 flex-wrap w-full md:w-auto md:flex-nowrap items-center">
            {/* Search */}
            <input
                type="text"
                placeholder="Search jobs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="px-3 py-2 border rounded-md shadow-sm focus:ring-2 focus:ring-green-500 focus:outline-none flex-grow"
            />
            <button
                onClick={() => {
                setPage(1);
                fetchJobs();
                }}
                className="px-4 py-2 bg-green-700 text-white rounded-md hover:bg-green-600"
            >
                Search
            </button>

            {/* Status Filter */}
            <select
                value={statusFilter}
                onChange={(e) => {
                setStatusFilter(e.target.value);
                setPage(1);
                }}
                className="px-3 py-2 border rounded-md shadow-sm"
            >
                <option value="All Status">All Status</option>
                <option value="ACTIVE">Active</option>
                <option value="PAUSED">Paused</option>
                <option value="COMPLETED">Completed</option>
            </select>

            {/* Create Job Button */}
            <button
                className="flex items-center gap-2 px-4 py-2 bg-green-700 text-white rounded-md hover:bg-green-600"
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
            <div className="min-h-screen bg-gradient-to-br from-green-900 via-green-800 to-emerald-900 flex items-center justify-center">
                <div className="bg-green-950 rounded-2xl p-6 border border-green-700 shadow-2xl">
                <div className="flex items-center gap-4">
                    <div className="w-8 h-8 border-4 border-green-400 border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-xl text-green-200 font-semibold">Loading company information...</p>
                </div>
                </div>
            </div>
        ) : jobs.length === 0 ? (
            <p className="text-gray-500">No jobs found.</p>
        ) : (
            <div className="space-y-6">
            {jobs.map((job) => (
                <div
                key={job.id}
                className="border rounded-lg p-6 bg-white shadow-sm grid grid-cols-1 md:grid-cols-3 gap-4 relative"
                >
                {/* Job Info */}
                <div className="md:col-span-2">
                    <h2 className="text-xl font-semibold text-gray-900">
                    {job.title}
                    </h2>
                    <div className="flex flex-wrap items-center text-gray-500 text-sm gap-x-4 gap-y-1 mt-1">
                    <span>{job.role || "-"}</span>
                    {job.location && (
                        <span className="flex items-center gap-1">
                        <FiMapPin className="text-gray-400" /> {job.location}
                        </span>
                    )}
                    </div>
                    <p className="text-gray-700 mt-2 line-clamp-2">
                    {job.description}
                    </p>

                    {/* Job Meta */}
                    <div className="flex flex-wrap items-center gap-6 mt-4 text-gray-600 text-sm">
                    <span className="flex items-center gap-1">
                        <FiDollarSign className="text-gray-400" />
                        {job.salaryMin ? job.salaryMin / 1000 + "k" : "N/A"} -{" "}
                        {job.salaryMax ? job.salaryMax / 1000 + "k" : "N/A"}
                    </span>
                    <span className="flex items-center gap-1">
                        <FiUsers className="text-gray-400" />
                        {job.totalApplications} applicants
                    </span>
                    <span className="px-3 py-1 text-xs font-semibold rounded-full bg-gray-200">
                        {job.jobType.replace("_", "-")}
                    </span>

                    {/* Status Badge */}
                    <span
                        className={`px-3 py-1 text-xs font-semibold rounded-full ${
                        job.status === "ACTIVE"
                            ? "bg-green-500 text-white"
                            : job.status === "PAUSED"
                            ? "bg-yellow-400 text-black"
                            : "bg-gray-500 text-white"
                        }`}
                    >
                        {job.status.charAt(0).toUpperCase() +
                        job.status.slice(1).toLowerCase()}
                    </span>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex justify-end items-start relative">
                    <button
                    onClick={() => toggleDropdown(job.id)}
                    className="p-2 rounded hover:bg-gray-200"
                    >
                    <FiMoreVertical />
                    </button>

                    {dropdownOpen === job.id && (
                    <div className="absolute right-0 top-10 w-48 bg-white border rounded-md shadow-lg z-50">
                        <ul className="text-sm text-gray-700">
                        <li
                            className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center gap-2"
                            onClick={() => {
                            setEditingJob(job);
                            setDrawerOpen(true);
                            setDropdownOpen(null);
                            }}
                        >
                            <FiEdit className="text-blue-500" />
                            Update Job
                        </li>
                        <li
                            className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center gap-2"
                            onClick={() => {
                            setStatusUpdateJob(job);
                            setStatusModalOpen(true);
                            setDropdownOpen(null);
                            }}
                        >
                            <FiPlayCircle className="text-green-500" />
                            Update Job Status
                        </li>
                        <li
                            className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-red-600 flex items-center gap-2"
                            onClick={() => {
                            setJobToDelete(job);
                            setDeleteModalOpen(true);
                            setDropdownOpen(null);
                            }}
                        >
                            <FiTrash2 />
                            Delete Job
                        </li>
                        <li
                            className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center gap-2"
                            onClick={() => handleOpenJobFormModal(job.id, false)}
                        >
                            <MdOutlineCreateNewFolder className="text-purple-500" /> 
                            Create Job Form
                        </li>
                        <li
                            className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center gap-2"
                            onClick={() => handleOpenJobFormModal(job.id, true)}
                        >
                            <FiEdit className="text-blue-500" />
                            Update Job Form
                        </li>
                        <li
                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center gap-2"
                        onClick={() => handlePreviewJobForm(job.id)}
                        >
                        <FiUsers className="text-gray-600" />
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
            <div className="flex justify-center mt-8 gap-2">
            <button
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page === 1}
                className="px-3 py-1 border rounded disabled:opacity-50"
            >
                Previous
            </button>
            <span className="px-3 py-1">
                Page {page} of {totalPages}
            </span>
            <button
                onClick={() => setPage(Math.min(totalPages, page + 1))}
                disabled={page === totalPages}
                className="px-3 py-1 border rounded disabled:opacity-50"
            >
                Next
            </button>
            </div>
        )}

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
                Update status for "{statusUpdateJob.title}"
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
                Are you sure you want to delete "{jobToDelete.title}"? This action cannot be undone.
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
    