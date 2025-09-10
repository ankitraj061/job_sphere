'use client';

import React, { useState } from 'react';
import axios from 'axios';

export default function CompanyProfileView({ company, onDelete }) {
  const [editing, setEditing] = useState(false);

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete your company profile?')) return;

    try {
      await axios.delete('/api/company', { withCredentials: true });
      onDelete();
    } catch (error) {
      alert('Failed to delete company.');
    }
  };

  return (
    <div className="bg-white p-6 rounded shadow space-y-4">
      <h2 className="text-2xl font-bold">{company.name}</h2>
      <p>{company.description}</p>
      <p>Industry: {company.industry}</p>
      <p>Website: <a href={company.website} className="text-blue-600" target="_blank" rel="noreferrer">{company.website}</a></p>
      <p>Location: {company.location}</p>
      {/* Display other company fields here */}

      <button onClick={() => setEditing(!editing)} className="px-3 py-1 bg-green-600 text-white rounded">
        {editing ? 'Cancel Edit' : 'Edit Profile'}
      </button>
      <button onClick={handleDelete} className="px-3 py-1 bg-red-600 text-white rounded ml-2">
        Delete Profile
      </button>

      {editing && (
        <CompanyEditForm company={company} onSuccess={(updatedCompany) => {
          /* update state with updatedCompany */
          setEditing(false);
        }} />
      )}
    </div>
  );
}

function CompanyEditForm({ company, onSuccess }) {
  // You can reuse your CompanyProfilePage form logic for update
  // On submit, call backend PUT /api/employer/companies and on success call onSuccess(updatedCompany)
  // Minimal example not shown here for brevity
  return null;
}
