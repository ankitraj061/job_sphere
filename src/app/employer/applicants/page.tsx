"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

interface Job {
  id: number;
  title: string;
  createdAt: string;
}

interface JobSeekerUser {
  id: number;
  name: string;
  email: string;
  phone?: string;
  location?: string;
  profilePicture?: string;
}

interface ApplicationResponse {
  id: number;
  field: {
    label: string;
  };
  answer: string;
}

interface Application {
  id: number;
  status: string;
  appliedAt: string;
  jobSeeker: {
    user: JobSeekerUser;
  };
  responses: ApplicationResponse[];
}

const STATUS_OPTIONS = [
  "PENDING",
  "REVIEWING",
  "SHORTLISTED",
  "INTERVIEWED",
  "ACCEPTED",
  "REJECTED",
];

export default function JobApplicantsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [selectedJobId, setSelectedJobId] = useState<number | null>(null);
  const [applications, setApplications] = useState<Application[]>([]);
  const [loadingJobs, setLoadingJobs] = useState(false);
  const [loadingApplications, setLoadingApplications] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [viewingApplicant, setViewingApplicant] = useState<Application | null>(null);
  const [updatingStatusId, setUpdatingStatusId] = useState<number | null>(null);

  // Fetch jobs
  useEffect(() => {
    async function fetchJobs() {
      setLoadingJobs(true);
      try {
        const response = await axios.get(`${backendUrl}/api/jobs/employer`, {
          withCredentials: true,
          params: { page: 1, limit: 1000 },
        });
        if (response.data.success) {
          setJobs(response.data.data.jobs);
        } else {
          alert("Failed to load jobs");
        }
      } catch (err) {
        console.error(err);
        alert("Error loading jobs");
      } finally {
        setLoadingJobs(false);
      }
    }
    fetchJobs();
  }, []);

  // Fetch applications
  useEffect(() => {
    if (!selectedJobId) {
      setApplications([]);
      setTotalPages(1);
      return;
    }
    async function fetchApplications() {
      setLoadingApplications(true);
      try {
        const response = await axios.get(
          `${backendUrl}/api/jobs/${selectedJobId}/applications`,
          {
            withCredentials: true,
            params: { page, limit: 10 },
          }
        );
        if (response.data.success) {
          setApplications(response.data.data.applications);
          setTotalPages(response.data.data.pagination.pages);
        } else {
          alert("Failed to load applications");
        }
      } catch (err) {
        console.error(err);
        alert("Error loading applications");
      } finally {
        setLoadingApplications(false);
      }
    }
    fetchApplications();
  }, [selectedJobId, page]);

  // Update application status
  async function updateApplicationStatus(applicationId: number, newStatus: string) {
    if (!selectedJobId) return;
    setUpdatingStatusId(applicationId);
    try {
      const response = await axios.patch(
        `${backendUrl}/api/jobs/${selectedJobId}/applications/${applicationId}/status`,
        { status: newStatus },
        { withCredentials: true }
      );
      if (response.data.success) {
        const refreshedApps = await axios.get(
          `${backendUrl}/api/jobs/${selectedJobId}/applications`,
          { withCredentials: true, params: { page, limit: 10 } }
        );
        setApplications(refreshedApps.data.data.applications);
      } else {
        alert("Failed to update status");
      }
    } catch (err) {
      console.error(err);
      alert("Error updating status");
    } finally {
      setUpdatingStatusId(null);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6">
      {/* Header */}
      <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-6">
        Job Applicants
      </h1>

      {/* Job Selector */}
      <div className="mb-6">
        {loadingJobs ? (
          <div className="flex items-center justify-center bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 shadow-lg">
            <div className="w-6 h-6 border-4 border-blue-400 border-t-transparent rounded-full animate-spin" />
            <p className="ml-4 text-gray-700 font-medium">Loading Jobs...</p>
          </div>
        ) : (
          <select
            className="w-full max-w-md rounded-xl p-3 bg-white/80 border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            value={selectedJobId ?? ""}
            onChange={(e) => {
              const val = e.target.value;
              setPage(1);
              setSelectedJobId(val ? Number(val) : null);
            }}
          >
            <option value="">Select a job</option>
            {jobs.map((job) => (
              <option key={job.id} value={job.id}>
                {job.title}
              </option>
            ))}
          </select>
        )}
      </div>

      {/* Applications Table */}
      {loadingApplications ? (
        <p className="text-gray-600">Loading applicants...</p>
      ) : !selectedJobId ? (
        <p className="text-gray-600">Please select a job to view applicants.</p>
      ) : applications.length === 0 ? (
        <p className="text-gray-600">No applicants found for this job.</p>
      ) : (
        <div className="overflow-x-auto rounded-2xl bg-white/80 backdrop-blur-sm border border-gray-200/50 shadow-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
              <tr>
                <th className="p-4 text-left w-40 rounded-tl-2xl">Applicant</th>
                <th className="p-4 text-left">Email</th>
                <th className="p-4 text-left w-20">Phone</th>
                <th className="p-4 text-left w-28">Location</th>
                <th className="p-4 text-left w-36">Applied On</th>
                <th className="p-4 text-center w-36">Status</th>
                <th className="p-4 text-center w-32 rounded-tr-2xl"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {applications.map((app) => (
                <tr key={app.id} className="hover:bg-blue-50 transition">
                  <td className="p-4 flex items-center space-x-3">
                    {app.jobSeeker.user.profilePicture ? (
                      <img
                        src={app.jobSeeker.user.profilePicture}
                        alt={app.jobSeeker.user.name}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-full flex items-center justify-center font-bold uppercase">
                        {app.jobSeeker.user.name.charAt(0)}
                      </div>
                    )}
                    <span className="font-medium text-gray-900">{app.jobSeeker.user.name}</span>
                  </td>
                  <td className="p-4 truncate text-gray-700">{app.jobSeeker.user.email}</td>
                  <td className="p-4 text-gray-700">{app.jobSeeker.user.phone || "-"}</td>
                  <td className="p-4 text-gray-700">{app.jobSeeker.user.location || "-"}</td>
                  <td className="p-4 text-gray-700">{new Date(app.appliedAt).toLocaleDateString()}</td>
                  <td className="p-4 text-center">
                    <select
                      disabled={updatingStatusId === app.id}
                      value={app.status}
                      onChange={(e) => updateApplicationStatus(app.id, e.target.value)}
                      className="rounded-md px-2 py-1 font-medium bg-white border border-gray-200 focus:ring-2 focus:ring-blue-500 transition disabled:opacity-50"
                    >
                      {STATUS_OPTIONS.map((status) => (
                        <option key={status} value={status}>
                          {status.charAt(0) + status.slice(1).toLowerCase()}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="p-4 text-center">
                    <button
                      onClick={() => setViewingApplicant(app)}
                      className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-3 py-1 rounded-lg font-medium hover:from-blue-700 hover:to-indigo-700 transition"
                      type="button"
                    >
                      View Profile
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center gap-4 p-4">
              <button
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="px-5 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-medium hover:from-blue-700 hover:to-indigo-700 transition disabled:opacity-50"
              >
                Previous
              </button>
              <span className="text-gray-700 font-medium flex items-center">
                Page {page} of {totalPages}
              </span>
              <button
                disabled={page >= totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                className="px-5 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-medium hover:from-blue-700 hover:to-indigo-700 transition disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
        </div>
      )}

      {/* Applicant Modal */}
      {viewingApplicant && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-auto p-8 relative shadow-2xl border border-gray-200/50">
            <button
              className="absolute top-4 right-4 text-gray-600 hover:text-gray-900 text-2xl font-bold"
              onClick={() => setViewingApplicant(null)}
              aria-label="Close profile modal"
            >
              ×
            </button>

            <div className="flex flex-col items-center mb-6">
              {viewingApplicant.jobSeeker.user.profilePicture ? (
                <img
                  src={viewingApplicant.jobSeeker.user.profilePicture}
                  alt={viewingApplicant.jobSeeker.user.name}
                  className="w-24 h-24 rounded-full object-cover mb-4"
                />
              ) : (
                <div className="w-24 h-24 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-full flex items-center justify-center text-4xl font-bold mb-4">
                  {viewingApplicant.jobSeeker.user.name.charAt(0)}
                </div>
              )}
              <h2 className="text-2xl font-bold text-gray-900 mb-1">
                {viewingApplicant.jobSeeker.user.name}
              </h2>
              <p className="text-gray-700">{viewingApplicant.jobSeeker.user.email}</p>
              {viewingApplicant.jobSeeker.user.phone && (
                <p className="text-gray-700">Phone: {viewingApplicant.jobSeeker.user.phone}</p>
              )}
              {viewingApplicant.jobSeeker.user.location && (
                <p className="text-gray-700">Location: {viewingApplicant.jobSeeker.user.location}</p>
              )}
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Application Responses
              </h3>
              {viewingApplicant.responses.length === 0 ? (
                <p className="text-gray-600">No responses provided.</p>
              ) : (
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  {viewingApplicant.responses.map((resp) => (
                    <li key={resp.id}>
                      <span className="font-semibold">{resp.field.label}:</span>{" "}
                      {resp.answer}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
