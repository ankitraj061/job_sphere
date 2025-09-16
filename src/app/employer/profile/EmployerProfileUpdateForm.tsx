import { useState } from "react";
import axios from "axios";
import { toast } from "sonner";

interface EmployerProfile {
  id: string;
  user: {
    name: string;
    email: string;
    phone?: string;
    location?: string;
    profilePicture?: string;
  };
  jobTitle?: string;
  department?: string;
  company?: {
    name: string;
    description?: string;
    industry?: string;
    location?: string;
    website?: string;
    profilePicture?: string;
  } | null;
}

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
      const res = await axios.put(
        `${backendUrl}/api/employer/profile`,
        formData,
        {
          withCredentials: true,
        }
      );

      if (res.data.success) {
        onSuccess(res.data.data);
        toast.success("Profile updated successfully ✅");
      } else {
        toast.error(res.data.message || "Failed to update profile");
      }
    } catch (error: any) {
      console.error(error);
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="p-6 rounded-2xl border border-green-700 bg-green-950 shadow-xl space-y-4"
    >
      <h3 className="text-xl font-semibold text-emerald-200 mb-4">
        ✏️ Update Profile
      </h3>

      <div className="grid md:grid-cols-2 gap-4">
        {/* Name */}
        <div className="flex flex-col">
          <label className="text-sm text-emerald-300 mb-1">Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Name"
            className="p-2 rounded bg-green-900 border border-green-600 text-green-100"
          />
        </div>

        {/* Phone */}
        <div className="flex flex-col">
          <label className="text-sm text-emerald-300 mb-1">Phone</label>
          <input
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="Phone"
            className="p-2 rounded bg-green-900 border border-green-600 text-green-100"
          />
        </div>

        {/* Location */}
        <div className="flex flex-col">
          <label className="text-sm text-emerald-300 mb-1">Location</label>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            placeholder="Location"
            className="p-2 rounded bg-green-900 border border-green-600 text-green-100"
          />
        </div>

        {/* Profile Picture */}
        <div className="flex flex-col">
          <label className="text-sm text-emerald-300 mb-1">Profile Picture URL</label>
          <input
            type="text"
            name="profilePicture"
            value={formData.profilePicture}
            onChange={handleChange}
            placeholder="Profile Picture URL"
            className="p-2 rounded bg-green-900 border border-green-600 text-green-100"
          />
        </div>

        {/* Job Title */}
        <div className="flex flex-col">
          <label className="text-sm text-emerald-300 mb-1">Job Title</label>
          <input
            type="text"
            name="jobTitle"
            value={formData.jobTitle}
            onChange={handleChange}
            placeholder="Job Title"
            className="p-2 rounded bg-green-900 border border-green-600 text-green-100"
          />
        </div>

        {/* Department */}
        <div className="flex flex-col">
          <label className="text-sm text-emerald-300 mb-1">Department</label>
          <input
            type="text"
            name="department"
            value={formData.department}
            onChange={handleChange}
            placeholder="Department"
            className="p-2 rounded bg-green-900 border border-green-600 text-green-100"
          />
        </div>
      </div>

      <div className="flex gap-4 justify-end mt-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-500"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-500 disabled:opacity-50"
        >
          {loading ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </form>
  );
}

export default EmployerProfileUpdateForm;
