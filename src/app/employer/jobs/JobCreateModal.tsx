import React, { useEffect, useState } from "react";
import { Job, JobForm } from "./types";

const JOB_TYPES = [
  { value: "FULL_TIME", label: "Full Time" },
  { value: "PART_TIME", label: "Part Time" },
  { value: "INTERNSHIP", label: "Internship" },
  { value: "CONTRACT", label: "Contract" },
];

const JOB_ROLES = [
  { value: "SOFTWARE_ENGINEER", label: "Software Engineer" },
  { value: "BACKEND_DEVELOPER", label: "Backend Developer" },
  { value: "FRONTEND_DEVELOPER", label: "Frontend Developer" },
  { value: "FULLSTACK_DEVELOPER", label: "Fullstack Developer" },
  { value: "DATA_SCIENTIST", label: "Data Scientist" },
  { value: "DATA_ANALYST", label: "Data Analyst" },
  { value: "DEVOPS_ENGINEER", label: "DevOps Engineer" },
  { value: "CLOUD_ENGINEER", label: "Cloud Engineer" },
  { value: "ML_ENGINEER", label: "ML Engineer" },
  { value: "AI_ENGINEER", label: "AI Engineer" },
  { value: "MOBILE_DEVELOPER", label: "Mobile Developer" },
  { value: "ANDROID_DEVELOPER", label: "Android Developer" },
  { value: "IOS_DEVELOPER", label: "iOS Developer" },
  { value: "UI_UX_DESIGNER", label: "UI/UX Designer" },
  { value: "PRODUCT_MANAGER", label: "Product Manager" },
  { value: "PROJECT_MANAGER", label: "Project Manager" },
  { value: "BUSINESS_ANALYST", label: "Business Analyst" },
  { value: "QA_ENGINEER", label: "QA Engineer" },
  { value: "TEST_AUTOMATION_ENGINEER", label: "Test Automation Engineer" },
  { value: "CYBERSECURITY_ANALYST", label: "Cybersecurity Analyst" },
  { value: "NETWORK_ENGINEER", label: "Network Engineer" },
  { value: "SYSTEM_ADMIN", label: "System Admin" },
  { value: "DATABASE_ADMIN", label: "Database Admin" },
  { value: "BLOCKCHAIN_DEVELOPER", label: "Blockchain Developer" },
  { value: "GAME_DEVELOPER", label: "Game Developer" },
  { value: "TECH_SUPPORT", label: "Tech Support" },
  { value: "CONTENT_WRITER", label: "Content Writer" },
  { value: "DIGITAL_MARKETER", label: "Digital Marketer" },
  { value: "SALES_ASSOCIATE", label: "Sales Associate" },
  { value: "HR_MANAGER", label: "HR Manager" },
];

interface JobCreateModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (form: JobForm) => void;
  editingJob?: Job | null;
}

export default function JobCreateModal({
  open,
  onClose,
  onSave,
  editingJob,
}: JobCreateModalProps) {
  const [form, setForm] = useState<JobForm>({
    title: "",
    role: "",
    description: "",
    requirements: "",
    location: "",
    jobType: "FULL_TIME",
    salaryMin: "",
    salaryMax: "",
    noOfOpenings: "", // Fixed: changed from 'openings' to 'noOfOpenings'
  });

  useEffect(() => {
    if (editingJob) {
      setForm({
        title: editingJob.title || "",
        role: editingJob.role || "",
        description: editingJob.description || "",
        requirements: editingJob.requirements || "",
        location: editingJob.location || "",
        jobType: editingJob.jobType || "FULL_TIME",
        salaryMin: editingJob.salaryMin || "",
        salaryMax: editingJob.salaryMax || "",
        noOfOpenings: editingJob.noOfOpenings || "", // Fixed: changed from 'openings' to 'noOfOpenings'
      });
    } else {
      setForm({
        title: "",
        role: "",
        description: "",
        requirements: "",
        location: "",
        jobType: "FULL_TIME",
        salaryMin: "",
        salaryMax: "",
        noOfOpenings: "", // Fixed: changed from 'openings' to 'noOfOpenings'
      });
    }
  }, [editingJob, open]);

  if (!open) return null;

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(form);
  };

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg w-full max-w-lg">
        <h2 className="text-xl font-bold mb-4 text-gray-900">
          {editingJob ? "Edit Job Posting" : "Create Job Posting"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4 text-black">
          <input
            type="text"
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="Job Title"
            className="w-full px-3 py-2 border rounded-md"
            required
          />

          {/* ✅ Role dropdown */}
          <select
            name="role"
            value={form.role}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-md"
            required
          >
            <option value="">Select Role</option>
            {JOB_ROLES.map((role) => (
              <option key={role.value} value={role.value}>
                {role.label}
              </option>
            ))}
          </select>

          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Job Description"
            className="w-full px-3 py-2 border rounded-md"
            required
          />
          <textarea
            name="requirements"
            value={form.requirements}
            onChange={handleChange}
            placeholder="Job Requirements"
            className="w-full px-3 py-2 border rounded-md"
          />
          <input
            type="text"
            name="location"
            value={form.location}
            onChange={handleChange}
            placeholder="Location"
            className="w-full px-3 py-2 border rounded-md"
          />

          {/* ✅ Job type dropdown */}
          <select
            name="jobType"
            value={form.jobType}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-md"
          >
            {JOB_TYPES.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>

          <div className="grid grid-cols-2 gap-3">
            <input
              type="number"
              name="salaryMin"
              value={form.salaryMin}
              onChange={handleChange}
              placeholder="Min Salary"
              className="w-full px-3 py-2 border rounded-md"
            />
            <input
              type="number"
              name="salaryMax"
              value={form.salaryMax}
              onChange={handleChange}
              placeholder="Max Salary"
              className="w-full px-3 py-2 border rounded-md"
            />
          </div>
          <input
            type="number"
            name="noOfOpenings" // Fixed: changed from 'openings' to 'noOfOpenings'
            value={form.noOfOpenings}
            onChange={handleChange}
            placeholder="No of Openings"
            className="w-full px-3 py-2 border rounded-md"
          />

          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
            >
              {editingJob ? "Update Job" : "Save Job"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
