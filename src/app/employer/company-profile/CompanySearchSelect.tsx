import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Company } from '../hooks/useCompany';
import { Search } from 'lucide-react';

interface CompanySearchSelectProps {
  onCancel: () => void;
  onSelect: (company: Company) => void;
}

export default function CompanySearchSelect({ onCancel, onSelect }: CompanySearchSelectProps) {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);

  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

 const fetchCompanies = async (query = '') => {
  setLoading(true);
  try {
    if(query.length < 3){
      setCompanies([]); 
      return
      
    }
    const res = await axios.get(
      `${backendUrl}/api/employer/companies/search?q=${encodeURIComponent(query)}`
    );

    // FIX: use res.data.companies instead of res.data.data
    setCompanies(res.data.data.companies || []);
    console.log('Companies : ',res.data.data.companies);
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
    <div className="bg-white/80 backdrop-blur-sm border border-gray-200/50 shadow-xl rounded-2xl w-full max-w-lg mx-auto overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4">
        <h3 className="text-xl font-bold text-white">Search Companies</h3>
        <p className="text-sm text-blue-100 mt-1">
          Find and select an existing company to join
        </p>
      </div>

      {/* Body */}
      <div className="p-6">
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Type to search companies..."
            className="w-full pl-10 pr-4 py-2.5 bg-white/70 border border-gray-200 rounded-lg text-sm text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder-gray-400"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              fetchCompanies(e.target.value);
            }}
          />
        </div>

        {loading && (
          <p className="text-gray-500 text-sm text-center py-4">Loading...</p>
        )}

        <ul className="max-h-60 overflow-auto rounded-lg border border-gray-200 divide-y divide-gray-100">
          {companies.length > 0 ? (
            companies.map((c) => (
              <li
                key={c.id}
                className="cursor-pointer px-4 py-3 text-gray-700 hover:bg-blue-50 transition-colors"
                onClick={() => onSelect(c)}
              >
                {c.name}
              </li>
            ))
          ) : (
            !loading && (
              <li className="px-4 py-6 text-center text-gray-500 text-sm">
                No companies found
              </li>
            )
          )}
        </ul>

        {/* Footer */}
        <div className="flex justify-end mt-5">
          <button
            onClick={onCancel}
            className="px-5 py-2.5 bg-gray-100 text-gray-700 rounded-lg border border-gray-300 hover:bg-gray-200 transition-all font-medium text-sm"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
