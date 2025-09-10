'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function CompanySearchSelect({ onCancel, onSelect }) {
  const [companies, setCompanies] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);

  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

  const fetchCompanies = async (query = '') => {
    setLoading(true);
    try {
      const res = await axios.get(`${backendUrl}/api/company/search?query=${encodeURIComponent(query)}`);
      setCompanies(res.data.data || []);
    } catch (err) {
      console.error(err);
      setCompanies([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  return (
    <div className="p-4 bg-white rounded shadow max-w-md mx-auto">
      <h3 className="text-xl font-semibold mb-2">Search Companies</h3>
      <input
        type="text"
        placeholder="Type to search companies..."
        className="w-full p-2 border rounded mb-3"
        value={searchTerm}
        onChange={(e) => {
          setSearchTerm(e.target.value);
          fetchCompanies(e.target.value);
        }}
      />
      {loading && <p>Loading...</p>}
      <ul className="max-h-60 overflow-auto border rounded">
        {companies.map((c) => (
          <li
            key={c.id}
            className="cursor-pointer p-2 hover:bg-green-100"
            onClick={() => onSelect(c)}
          >
            {c.name}
          </li>
        ))}
      </ul>

      <div className="flex justify-end mt-3">
        <button
          onClick={onCancel}
          className="px-4 py-2 rounded border border-gray-400 hover:bg-gray-100"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
