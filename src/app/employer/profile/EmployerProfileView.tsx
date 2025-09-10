// app/employer/profile/EmployerProfileView.tsx
'use client';

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

interface Props {
  profile: EmployerProfile | null;
}

export default function EmployerProfileView({ profile }: Props) {
  if (!profile) return <div>No profile data available.</div>;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <h2 className="text-2xl font-bold">Employer Profile</h2>
      <section className="p-4 border rounded">
        <h3 className="text-xl font-semibold mb-2">Basic Info</h3>
        <p><strong>Name:</strong> {profile.user.name}</p>
        <p><strong>Email:</strong> {profile.user.email}</p>
        <p><strong>Phone:</strong> {profile.user.phone || 'N/A'}</p>
        <p><strong>Location:</strong> {profile.user.location || 'N/A'}</p>
        {profile.user.profilePicture && (
          <img src={profile.user.profilePicture} alt="Profile Picture" className="max-w-xs rounded" />
        )}
      </section>

      <section className="p-4 border rounded">
        <h3 className="text-xl font-semibold mb-2">Employer Profile</h3>
        <p><strong>Job Title:</strong> {profile.jobTitle || 'N/A'}</p>
        <p><strong>Department:</strong> {profile.department || 'N/A'}</p>
      </section>

      <section className="p-4 border rounded">
        <h3 className="text-xl font-semibold mb-2">Company Info</h3>
        {profile.company ? (
          <>
            <p><strong>Name:</strong> {profile.company.name}</p>
            <p><strong>Description:</strong> {profile.company.description || 'N/A'}</p>
            <p><strong>Industry:</strong> {profile.company.industry || 'N/A'}</p>
            <p><strong>Location:</strong> {profile.company.location || 'N/A'}</p>
            <p><strong>Website:</strong> <a href={profile.company.website} target="_blank" rel="noreferrer">{profile.company.website}</a></p>
            {profile.company.profilePicture && (
              <img src={profile.company.profilePicture} alt="Company Logo" className="max-w-xs rounded" />
            )}
          </>
        ) : (
          <p>No company associated</p>
        )}
      </section>
    </div>
  );
}
