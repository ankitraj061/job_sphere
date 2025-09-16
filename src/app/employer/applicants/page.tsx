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

export default function JobApplicantsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [selectedJobId, setSelectedJobId] = useState<number | null>(null);
  const [applications, setApplications] = useState<Application[]>([]);
  const [loadingJobs, setLoadingJobs] = useState(false);
  const [loadingApplications, setLoadingApplications] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Fetch all jobs for dropdown on mount
  useEffect(() => {
    async function fetchJobs() {
      setLoadingJobs(true);
      try {
        const response = await axios.get(`${backendUrl}/api/jobs/employer`, {
          withCredentials: true,
          params: { page: 1, limit: 1000 }, // fetch all or large page size
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

  // Fetch applications when selectedJobId or page changes
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
            params: {
              page,
              limit: 10,
            },
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

  // Check for duplicate job titles to show date
  const jobTitleCounts = jobs.reduce<Record<string, number>>((acc, job) => {
    acc[job.title] = (acc[job.title] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="max-w-6xl mx-auto p-4 min-h-screen bg-gradient-to-br from-green-900 via-green-800 to-emerald-900">
      <h1 className="text-3xl font-bold mb-6 text-white">Job Applicants</h1>

      {/* Job selection dropdown */}
      <div className="mb-6">
        {loadingJobs ? (
            <div className="min-h-screen bg-gradient-to-br from-green-900 via-green-800 to-emerald-900 flex items-center justify-center">
                <div className="bg-green-950 rounded-2xl p-6 border border-green-700 shadow-2xl">
                <div className="flex items-center gap-4">
                    <div className="w-8 h-8 border-4 border-green-400 border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-xl text-green-200 font-semibold text-white">Loading company information...</p>
                </div>
                </div>
            </div>
        ) : (
          <select
            className="w-full md:w-96 border rounded p-2 bg-white"
            value={selectedJobId ?? ""}
            onChange={(e) => {
              const val = e.target.value;
              setPage(1);
              setSelectedJobId(val ? Number(val) : null);
            }}
          >
            <option value="">Select a job</option>
            {jobs.map((job) => {
              const showDate = jobTitleCounts[job.title] > 1;
              return (
                <option key={job.id} value={job.id}>
                  {job.title}
                  {showDate ? ` — ${new Date(job.createdAt).toLocaleDateString()}` : ""}
                </option>
              );
            })}
          </select>
        )}
      </div>

      {/* Applications list */}
      {loadingApplications ? (
        <p className="text-white">Loading applicants...</p>
      ) : applications.length === 0 ? (
        selectedJobId ? (
          <p className="text-white" >No applicants found for this job.</p>
        ) : (
          <p className="text-white">Please select a job to view applicants.</p>
        )
      ) : (
        <div className="space-y-6">
          {applications.map((app) => (
            <div
              key={app.id}
              className="border rounded-lg p-4 bg-white shadow-sm"
            >
              <div className="flex items-center space-x-4">
                {app.jobSeeker.user.profilePicture ? (
                  <img
                    src={app.jobSeeker.user.profilePicture}
                    alt={app.jobSeeker.user.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center text-gray-600">
                    {app.jobSeeker.user.name.charAt(0).toUpperCase()}
                  </div>
                )}
                <div>
                  <div className="text-lg font-semibold">{app.jobSeeker.user.name}</div>
                  <div className="text-sm text-gray-500">{app.jobSeeker.user.email}</div>
                  {app.jobSeeker.user.phone && (
                    <div className="text-sm text-gray-500">Phone: {app.jobSeeker.user.phone}</div>
                  )}
                  {app.jobSeeker.user.location && (
                    <div className="text-sm text-gray-500">Location: {app.jobSeeker.user.location}</div>
                  )}
                  <div className="text-sm text-gray-600">
                    Applied on: {new Date(app.appliedAt).toLocaleDateString()}
                  </div>
                  <div className="text-sm font-medium">Status: {app.status}</div>
                </div>
              </div>

              <div className="mt-4">
                <div className="font-semibold mb-1">Application Responses:</div>
                {app.responses.length === 0 ? (
                  <p className="text-sm text-gray-500">No responses provided.</p>
                ) : (
                  <ul className="list-disc list-inside text-sm text-gray-700">
                    {app.responses.map((response) => (
                      <li key={response.id}>
                        <span className="font-medium">{response.field.label}:</span> {response.answer}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          ))}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-6 gap-3">
              <button
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="px-4 py-2 border rounded disabled:opacity-50"
              >
                Previous
              </button>
              <span className="px-4 py-2">
                Page {page} of {totalPages}
              </span>
              <button
                disabled={page >= totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                className="px-4 py-2 border rounded disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
