'use client';

import React, { useState } from 'react';
import { useMyCompany } from '../hooks/useCompany';
import { Company } from '../hooks/useCompany';
import CompanyProfileView from './CompanyProfileView';
import CompanySearchSelect from './CompanySearchSelect';
import CompanyCreateForm from './CompanyCreateForm';

export default function CompanyDashboard() {
  const { company, loading, error, setCompany } = useMyCompany();
  const [isCreating, setIsCreating] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-900 via-green-800 to-emerald-900 flex items-center justify-center">
        <div className="bg-green-950 rounded-2xl p-6 border border-green-700 shadow-2xl">
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 border-4 border-green-400 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-xl text-green-200 font-semibold">Loading company information...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-900 via-green-800 to-emerald-900 flex items-center justify-center">
        <div className="bg-red-950 rounded-2xl p-12 border border-red-700 shadow-2xl max-w-lg mx-auto">
          <div className="text-center">
            <div className="text-6xl mb-4">❌</div>
            <h2 className="text-2xl font-bold text-red-200 mb-4">Error Loading Company</h2>
            <p className="text-red-300 mb-6">We encountered an issue while loading your company information. Please try again.</p>
            <button 
              onClick={() => window.location.reload()} 
              className="px-6 py-3 bg-red-600 text-white rounded-xl hover:bg-red-500 font-semibold transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  const hasCompany = !!company;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-900 via-green-800 to-emerald-900 w-full">
      {hasCompany ? (
        <CompanyProfileView 
          company={company} 
          onDelete={() => setCompany(null)}
          onUpdate={(updatedCompany) => setCompany(updatedCompany)} 
        />
      ) : (
        <div className="p-8 w-full">
          <div className="w-full max-w-6xl mx-auto">
            {/* Welcome Header */}
            <div className="bg-green-950 rounded-2xl shadow-2xl border border-green-800 overflow-hidden mb-8">
              <div className="bg-gradient-to-r from-green-700 via-green-600 to-emerald-600 px-12 py-16 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-40 h-40 bg-green-500 opacity-20 rounded-full transform translate-x-20 -translate-y-20"></div>
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-emerald-400 opacity-20 rounded-full transform -translate-x-16 translate-y-16"></div>
                
                <div className="relative z-10 text-center">
                  <div className="text-7xl mb-6">🏢</div>
                  <h1 className="text-5xl font-bold mb-4">Company Dashboard</h1>
                  <p className="text-2xl text-green-100">Get started by creating your company profile</p>
                </div>
              </div>

              <div className="px-12 py-12 bg-green-950">
                <div className="text-center mb-12">
                  <p className="text-2xl text-green-200 mb-8 leading-relaxed">
                    You haven't created a company profile yet. Choose one of the options below to get started.
                  </p>
                </div>

                {/* Action Cards */}
                <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                  {/* Create Company Card */}
                  <div className="bg-green-900 rounded-2xl p-8 border border-green-700 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
                    <div className="text-center">
                      <div className="w-20 h-20 bg-green-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                        <span className="text-4xl">✨</span>
                      </div>
                      <h3 className="text-2xl font-bold text-green-100 mb-4">Create New Company</h3>
                      <p className="text-green-300 mb-8 text-lg leading-relaxed">
                        Start from scratch and create a brand new company profile with all your business details.
                      </p>
                      <button
                        className="w-full px-8 py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:from-green-500 hover:to-emerald-500 font-bold text-lg transition-all duration-200 shadow-lg border border-green-500"
                        onClick={() => setIsCreating(true)}
                      >
                        <span className="flex items-center justify-center gap-3">
                          <span className="text-xl">🚀</span>
                          Create Company Profile
                        </span>
                      </button>
                    </div>
                  </div>

                  {/* Search Company Card */}
                  <div className="bg-emerald-900 rounded-2xl p-8 border border-emerald-700 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
                    <div className="text-center">
                      <div className="w-20 h-20 bg-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                        <span className="text-4xl">🔍</span>
                      </div>
                      <h3 className="text-2xl font-bold text-emerald-100 mb-4">Join Existing Company</h3>
                      <p className="text-emerald-300 mb-8 text-lg leading-relaxed">
                        Search for and join an existing company that's already registered on our platform.
                      </p>
                      <button
                        className="w-full px-8 py-4 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl hover:from-emerald-500 hover:to-teal-500 font-bold text-lg transition-all duration-200 shadow-lg border border-emerald-500"
                        onClick={() => setIsSearching(true)}
                      >
                        <span className="flex items-center justify-center gap-3">
                          <span className="text-xl">🔎</span>
                          Search Companies
                        </span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Additional Info */}
                <div className="mt-12 text-center">
                  <div className="bg-green-800 rounded-xl p-6 border border-green-600 max-w-3xl mx-auto">
                    <h4 className="text-xl font-bold text-green-100 mb-3">💡 Need Help?</h4>
                    <p className="text-green-200">
                      Creating a company profile allows you to post jobs, manage applications, and build your employer brand. 
                      If you're joining an existing company, make sure you have the correct company name or details.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modals */}
      {isCreating && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="bg-green-950 rounded-2xl shadow-2xl border border-green-800 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="bg-gradient-to-r from-green-700 via-green-600 to-emerald-600 px-8 py-6 text-white relative">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-3xl font-bold">Create New Company</h2>
                  <p className="text-green-100 mt-2">Fill out the details to create your company profile</p>
                </div>
                <button
                  onClick={() => setIsCreating(false)}
                  className="text-white hover:text-green-200 text-2xl w-10 h-10 flex items-center justify-center rounded-full hover:bg-green-600 transition-colors"
                >
                  ✕
                </button>
              </div>
            </div>
            <div className="p-8">
              <CompanyCreateForm
                onCancel={() => setIsCreating(false)}
                onSuccess={(newCompany: Company) => {
                  setCompany(newCompany);
                  setIsCreating(false);
                }}
              />
            </div>
          </div>
        </div>
      )}

      {isSearching && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="bg-green-950 rounded-2xl shadow-2xl border border-green-800 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="bg-gradient-to-r from-emerald-700 via-emerald-600 to-teal-600 px-8 py-6 text-white relative">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-3xl font-bold">Search Companies</h2>
                  <p className="text-emerald-100 mt-2">Find and join an existing company</p>
                </div>
                <button
                  onClick={() => setIsSearching(false)}
                  className="text-white hover:text-emerald-200 text-2xl w-10 h-10 flex items-center justify-center rounded-full hover:bg-emerald-600 transition-colors"
                >
                  ✕
                </button>
              </div>
            </div>
            <div className="p-8">
              <CompanySearchSelect
                onCancel={() => setIsSearching(false)}
                onSelect={(selectedCompany : Company) => {
                  setCompany(selectedCompany);
                  setIsSearching(false);
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}