import { useState } from "react";
import axios, { AxiosError } from "axios";
import { toast } from "sonner";
import { EmployerProfile, Company } from "./types";



interface EmployerProfileUpdateFormProps {
  profile: EmployerProfile;
  onCancel: () => void;
  onSuccess: (updated: EmployerProfile) => void;
}

function EmployerProfileUpdateForm({
  profile,
  onCancel,
  onSuccess,
}: EmployerProfileUpdateFormProps) {
  const [formData, setFormData] = useState({
    name: profile.user.name,
    phone: profile.user.phone || "",
    location: profile.user.location || "",
    profilePicture: profile.user.profilePicture || "",
    jobTitle: profile.jobTitle || "",
    department: profile.department || "",
  });

  const [loading, setLoading] = useState(false);

  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        user: {
          name: formData.name,
          phone: formData.phone,
          location: formData.location,
          profilePicture: formData.profilePicture,
        },
        jobTitle: formData.jobTitle,
        department: formData.department,
      };

      const res = await axios.put(`${backendUrl}/api/employer/profile`, payload, {
        withCredentials: true,
      });

      if (res.data.success) {
        onSuccess(res.data.data);
        toast.success("Profile updated successfully ✅");
      } else {
        toast.error(res.data.message || "Failed to update profile");
      }
    } catch (err) {
  const error = err as AxiosError<{ message: string }>; // type casting
  toast.error(error.response?.data?.message || error.message || 'An error occurred');
} finally {
  setLoading(false);
}
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="p-6 rounded-3xl border border-indigo-300 bg-white shadow-md space-y-6"
    >
      <h3 className="text-2xl font-bold text-indigo-700 mb-4 flex items-center gap-2">
        ✏️ Update Profile
      </h3>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Name */}
        <div className="flex flex-col">
          <label className="text-sm text-indigo-600 mb-1">Name</label>
          <input
            type="text"
            name="name"
            required
            value={formData.name}
            onChange={handleChange}
            placeholder="Name"
            className="p-2 rounded-lg bg-white border border-indigo-300 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
        </div>

        {/* Phone */}
        <div className="flex flex-col">
          <label className="text-sm text-indigo-600 mb-1">Phone</label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="Phone"
            className="p-2 rounded-lg bg-white border border-indigo-300 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
        </div>

        {/* Location */}
        <div className="flex flex-col">
          <label className="text-sm text-indigo-600 mb-1">Location</label>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            placeholder="Location"
            className="p-2 rounded-lg bg-white border border-indigo-300 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
        </div>

        {/* Profile Picture */}
        <div className="flex flex-col">
          <label className="text-sm text-indigo-600 mb-1">
            Profile Picture URL
          </label>
          <input
            type="url"
            name="profilePicture"
            value={formData.profilePicture}
            onChange={handleChange}
            placeholder="Profile Picture URL"
            className="p-2 rounded-lg bg-white border border-indigo-300 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
          {formData.profilePicture && (
            <img
              src={formData.profilePicture}
              alt="Preview"
              className="mt-2 w-20 h-20 object-cover rounded-xl border border-indigo-200 shadow"
            />
          )}
        </div>

        {/* Job Title */}
        <div className="flex flex-col">
          <label className="text-sm text-indigo-600 mb-1">Job Title</label>
          <input
            type="text"
            name="jobTitle"
            required
            value={formData.jobTitle}
            onChange={handleChange}
            placeholder="Job Title"
            className="p-2 rounded-lg bg-white border border-indigo-300 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
        </div>

        {/* Department */}
        <div className="flex flex-col">
          <label className="text-sm text-indigo-600 mb-1">Department</label>
          <input
            type="text"
            name="department"
            value={formData.department}
            onChange={handleChange}
            placeholder="Department"
            className="p-2 rounded-lg bg-white border border-indigo-300 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
        </div>
      </div>

      {/* Buttons */}
      <div className="flex gap-4 justify-end mt-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 rounded-full border border-gray-300 text-gray-700 hover:bg-gray-100 transition"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2 rounded-full bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-semibold shadow-md hover:from-indigo-500 hover:to-blue-500 transition disabled:opacity-50"
        >
          {loading ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </form>
  );
}

export default EmployerProfileUpdateForm;
