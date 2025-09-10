'use client';

import { useState } from "react";

const JOB_TYPES = [
  { value: "FULL_TIME", label: "Full Time" },
  { value: "PART_TIME", label: "Part Time" },
  { value: "INTERNSHIP", label: "Internship" },
  { value: "CONTRACT", label: "Contract" },
];
const EXPERIENCE_OPTIONS = [
  { value: "0", label: "Fresher" },
  { value: "1-3", label: "1 to 3 years" },
  { value: "3-5", label: "3 to 5 years" },
  { value: "5+", label: "5+ years" },
];

export default function JobModalForm({ open, onClose, onSave }: {
  open: boolean, onClose: () => void, onSave: (form: any) => void
}) {
  const [form, setForm] = useState({
    title: "",
    jobType: "",
    contractPeriod: "",
    experience: "",
    location: "",
    skills: "",
    openings: "",
    shortDescription: "",
    payScale: "",
    jobDescription: "",
    otherBenefits: "",
    jobExpireOn: ""
  });

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSave(form);
    setForm({
      title: "",
      jobType: "",
      contractPeriod: "",
      experience: "",
      location: "",
      skills: "",
      openings: "",
      shortDescription: "",
      payScale: "",
      jobDescription: "",
      otherBenefits: "",
      jobExpireOn: ""
    });
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-20 flex justify-end">
      {/* Modal panel */}
      <div className="w-full max-w-xl h-full bg-white md:rounded-md flex flex-col shadow-lg outline-none">
        {/* Header */}
        <div className="flex items-center justify-between px-7 py-6 border-b">
          <h2 className="text-2xl font-semibold text-[#2a522e]">New Job</h2>
          <button onClick={onClose} className="text-2xl font-bold focus:outline-none">&times;</button>
        </div>
        {/* SCROLLABLE FORM */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-7 py-4 flex flex-col gap-4">
          <label className="text-gray-800 font-medium">
            Job Title:<span className="text-red-500">*</span>
            <input name="title" required value={form.title} onChange={handleChange}
              className="border mt-2 px-3 py-2 rounded w-full focus:ring focus:ring-[#c3eed2] outline-none" />
          </label>
          <label className="text-gray-800 font-medium">
            Job Type:<span className="text-red-500">*</span>
            <select name="jobType" required value={form.jobType} onChange={handleChange}
              className="border mt-2 px-3 py-2 rounded w-full focus:ring focus:ring-[#c3eed2] outline-none">
              <option value="">Choose Option...</option>
              {JOB_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
            </select>
          </label>
          <label className="text-gray-800 font-medium">
            Minimum Contract Period (Months): (if any)
            <input name="contractPeriod" type="number" value={form.contractPeriod} onChange={handleChange}
              className="border mt-2 px-3 py-2 rounded w-full focus:ring focus:ring-[#c3eed2] outline-none" />
          </label>
          <label className="text-gray-800 font-medium">
            Experience:<span className="text-red-500">*</span>
            <select name="experience" required value={form.experience} onChange={handleChange}
              className="border mt-2 px-3 py-2 rounded w-full focus:ring focus:ring-[#c3eed2] outline-none">
              <option value="">Choose Option...</option>
              {EXPERIENCE_OPTIONS.map(e => <option key={e.value} value={e.value}>{e.label}</option>)}
            </select>
          </label>
          <label className="text-gray-800 font-medium">
            Location:
            <input name="location" value={form.location} onChange={handleChange}
              className="border mt-2 px-3 py-2 rounded w-full focus:ring focus:ring-[#c3eed2] outline-none" />
          </label>
          <label className="text-gray-800 font-medium">
            Skills:<span className="text-red-500">*</span>
            <input name="skills" required value={form.skills} onChange={handleChange}
              className="border mt-2 px-3 py-2 rounded w-full focus:ring focus:ring-[#c3eed2] outline-none" />
          </label>
          <label className="text-gray-800 font-medium">
            Openings:<span className="text-red-500">*</span>
            <input name="openings" type="number" required value={form.openings} onChange={handleChange}
              className="border mt-2 px-3 py-2 rounded w-full focus:ring focus:ring-[#c3eed2] outline-none" />
          </label>
          <label className="text-gray-800 font-medium">
            Short Description:<span className="text-red-500">*</span>
            <textarea name="shortDescription" required rows={3} value={form.shortDescription} onChange={handleChange}
              className="border mt-2 px-3 py-2 rounded w-full focus:ring focus:ring-[#c3eed2] outline-none" />
          </label>
          <label className="text-gray-800 font-medium">
            Pay Scale (AED): (per annum)<span className="text-red-500">*</span>
            <input name="payScale" required type="number" value={form.payScale} onChange={handleChange}
              className="border mt-2 px-3 py-2 rounded w-full focus:ring focus:ring-[#c3eed2] outline-none" />
            <div className="text-sm text-gray-500 mt-1">Enter only Pay Scale amount per annum.</div>
          </label>
          <label className="text-gray-800 font-medium">
            Job Description:<span className="text-red-500">*</span>
            <textarea name="jobDescription" required rows={4} value={form.jobDescription} onChange={handleChange}
              className="border mt-2 px-3 py-2 rounded w-full focus:ring focus:ring-[#c3eed2] outline-none" />
          </label>
          <label className="text-gray-800 font-medium">
            Other Benefits:
            <textarea
              name="otherBenefits"
              rows={5}
              value={form.otherBenefits}
              onChange={handleChange}
              className="border mt-2 px-3 py-2 rounded w-full focus:ring focus:ring-[#c3eed2] outline-none"
            />
          </label>
          <label className="text-gray-800 font-medium">
            Job Expire On:<span className="text-red-500">*</span>
            <input
              name="jobExpireOn"
              type="date"
              required
              value={form.jobExpireOn}
              onChange={handleChange}
              className="border mt-2 px-3 py-2 rounded w-full focus:ring focus:ring-[#c3eed2] outline-none"
            />
          </label>

          {/* Button Row fixed at the bottom */}
          <div className="flex justify-end gap-4 pt-1 pb-3 sticky bottom-0 bg-white z-10">
            <button type="button" className="bg-gray-300 text-[#2a522e] px-6 py-2 rounded" onClick={onClose}>
              Close
            </button>
            <button type="submit" className="bg-[#2a522e] text-white px-6 py-2 rounded font-medium hover:bg-[#18541a]">
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
