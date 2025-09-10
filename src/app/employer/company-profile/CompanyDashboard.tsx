'use client';

import React, { useState } from 'react';
import { useMyCompany } from '@/hooks/useCompany';
import CompanyProfileView from './CompanyProfileView';
import CompanySearchSelect from './CompanySearchSelect';
import CompanyCreateForm from './CompanyCreateForm';

export default function CompanyDashboard() {
  const { company, loading, error, setCompany } = useMyCompany();
  const [isCreating, setIsCreating] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  if (loading) return <p>Loading company information...</p>;
  if (error) return <p>Error loading company. Please try again.</p>;

  const hasCompany = !!company;

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      {hasCompany ? (
        <>
          <CompanyProfileView company={company} onDelete={() => setCompany(null)} />
          {/* Optionally show update form here or a button to toggle update */}
        </>
      ) : (
        <>
          <p className="text-lg">
            You have not created a company profile yet.
          </p>
          <button
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 mr-4"
            onClick={() => setIsCreating(true)}
          >
            Create Company Profile
          </button>
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            onClick={() => setIsSearching(true)}
          >
            Search Existing Companies
          </button>
        </>
      )}

      {/* Modal or inline rendering for create and search */}
      {isCreating && (
        <div className="modal">
          <CompanyCreateForm
            onCancel={() => setIsCreating(false)}
            onSuccess={(newCompany) => {
              setCompany(newCompany);
              setIsCreating(false);
            }}
          />
        </div>
      )}

      {isSearching && (
        <div className="modal">
          <CompanySearchSelect
            onCancel={() => setIsSearching(false)}
            onSelect={(selectedCompany) => {
              setCompany(selectedCompany);
              setIsSearching(false);
            }}
          />
        </div>
      )}
    </div>
  );
}
