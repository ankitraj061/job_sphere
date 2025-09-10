"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button, Input, Select, Badge, Spin, message } from "antd";
import { PlusOutlined, EyeOutlined, EditOutlined } from "@ant-design/icons";
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

export default function EmployerJobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const params: any = {
        page,
      };
      if (searchTerm.trim()) {
        params.search = searchTerm.trim();
      }
      if (statusFilter !== "All Status") {
        params.status = statusFilter.toUpperCase();
      }

      const response = await axios.get(`${backendUrl}/api/employer/jobs`, { params });
      const data = response.data;

      if (data.success) {
        setJobs(data.data.jobs);
        setTotalPages(data.data.pagination.pages);
      } else {
        message.error("Failed to load jobs.");
      }
    } catch (error) {
      console.error("Fetch jobs error:", error);
      message.error("Error fetching jobs.");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchJobs();
  }, [page, statusFilter]);

  // Filter locally on search input with debounce (optional)

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-6 flex items-center justify-between flex-wrap gap-4">
        <h1 className="text-3xl font-bold text-gray-800 flex-grow">Job Postings</h1>
        <div className="flex gap-3 flex-wrap w-full md:w-auto md:flex-nowrap items-center">
          <Input.Search
            placeholder="Search jobs..."
            allowClear
            enterButton
            onSearch={value => {
              setSearchTerm(value);
              setPage(1);
              fetchJobs();
            }}
            className="max-w-sm flex-grow"
          />
          <Select
            value={statusFilter}
            onChange={(value) => {
              setStatusFilter(value);
              setPage(1);
            }}
            options={[
              { value: "All Status", label: "All Status" },
              { value: "ACTIVE", label: "Active" },
              { value: "PAUSED", label: "Paused" },
              { value: "COMPLETED", label: "Completed" }
            ]}
            className="w-40"
          />
          <Button
            type="primary"
            icon={<PlusOutlined />}
            className="bg-[#416b46] border-[#416b46]"
            onClick={() => setDrawerOpen(true)}
          >
            Create Job Posting
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-24">
          <Spin size="large" />
        </div>
      ) : (
        <>
          {jobs.length === 0 ? (
            <p className="text-gray-500">No jobs found.</p>
          ) : (
            <div className="space-y-6">
              {jobs.map((job) => (
                <div
                  key={job.id}
                  className="border rounded-lg p-6 bg-white shadow-sm grid grid-cols-1 md:grid-cols-3 gap-4"
                >
                  <div className="md:col-span-2">
                    <h2 className="text-xl font-semibold text-gray-900">{job.title}</h2>
                    <div className="flex flex-wrap items-center text-gray-500 text-sm gap-x-4 gap-y-1 mt-1">
                      <span>{job.role || "-"}</span>
                      {job.location && (
                        <>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <svg className="h-4 w-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20"><path d="M10 2a6 6 0 0 0-6 6c0 4 6 10 6 10s6-6 6-10a6 6 0 0 0-6-6z"/></svg>
                            {job.location}
                          </span>
                        </>
                      )}
                    </div>
                    <p className="text-gray-700 mt-2 line-clamp-2">{job.description}</p>

                    <div className="flex flex-wrap items-center gap-6 mt-4 text-gray-600 text-sm">
                      <span>
                        <svg className="inline h-5 w-5 mr-1 text-gray-400" fill="currentColor" viewBox="0 0 20 20"><path d="M2 10a8 8 0 0 1 16 0H2z"/></svg>
                        ${job.salaryMin ? job.salaryMin / 1000 + "k" : "N/A"} - ${job.salaryMax ? job.salaryMax / 1000 + "k" : "N/A"}
                      </span>
                      <span className="flex items-center gap-1">
                        <svg className="inline h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5 10a4 4 0 0 1 8 0v5h-2v-5a2 2 0 1 0-4 0v5H5v-5z" clipRule="evenodd"/></svg>
                        {job.totalApplications} applicants
                      </span>
                      <Badge color="gray" text={job.jobType.replace("_", "-")} />
                    </div>
                  </div>

                  <div className="flex items-center gap-3 justify-end space-x-3">
                    <span
                      className={`px-3 py-1 text-xs font-semibold rounded-full ${
                        job.status === "ACTIVE"
                          ? "bg-green-500 text-white"
                          : job.status === "PAUSED"
                          ? "bg-yellow-400 text-black"
                          : "bg-gray-400 text-white"
                      }`}
                    >
                      {job.status.charAt(0).toUpperCase() + job.status.slice(1).toLowerCase()}
                    </span>
                    <button
                      aria-label="View Job"
                      title="View Job"
                      className="p-2 rounded hover:bg-gray-200"
                    >
                      <EyeOutlined />
                    </button>
                    <button
                      aria-label="Edit Job"
                      title="Edit Job"
                      className="p-2 rounded hover:bg-gray-200"
                      onClick={() => alert(`Edit job ${job.id}`)}
                    >
                      <EditOutlined />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* TODO: Add right drawer modal for creating/editing jobs */}
    </div>
  );
}
