'use client';

import React, { useState } from 'react';
import axios from 'axios';

export default function CompanyCreateForm({ onCancel, onSuccess }) {
  const [name, setName] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleCreate = async () => {
    if (!name.trim()) {
      setError('Company name is required');
      return;
    }
    setError(null);
    setLoading(true);
    try {
      const res = await axios.post('/api/company', { name }, { withCredentials: true });
      if (res.data.success) {
        onSuccess(res.data.data);
      } else {
        setError('Failed to create company');
      }
    } catch (err) {
      setError('Failed to create company');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 bg-white rounded shadow max-w-md mx-auto">
      <h3 className="text-xl font-semibold mb-2">Create New Company</h3>
      <input
        type="text"
        placeholder="Company name"
        className="w-full border p-2 rounded mb-3"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      {error && <p className="text-red-600 mb-2">{error}</p>}
      <div className="flex justify-end gap-2">
        <button
          onClick={onCancel}
          className="px-4 py-2 rounded border border-gray-400 hover:bg-gray-100"
          disabled={loading}
        >
          Cancel
        </button>
        <button
          onClick={handleCreate}
          className="px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700"
          disabled={loading}
        >
          {loading ? 'Creating...' : 'Create'}
        </button>
      </div>
    </div>
  );
}
