'use client';
import React, { useState, useEffect } from 'react';
import { Search, MapPin, Globe, Building2, AlertCircle, RefreshCw } from 'lucide-react';
import axios from 'axios';
import Image from 'next/image';
import { toast } from 'sonner';

// Type definitions
interface Company {
  id: number;
  name: string;
  industry: string;
  location: string;
  website?: string;
  profilePicture?: string;
  description?: string;
}

interface ApiResponse {
  success: boolean;
  message?: string;
  data: Company[];
}

const CompaniesExplorer: React.FC = () => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [filteredCompanies, setFilteredCompanies] = useState<Company[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

  useEffect(() => {
    const fetchCompanies = async (): Promise<void> => {
      setLoading(true);
      setError(null);
      
      try {
        await toast.promise(
          axios.get<ApiResponse>(`${backendUrl}/api/jobseeker/companies`, {
            withCredentials: true,
          }),
          {
            loading: 'Loading companies...',
            success: (response) => {
              const result = response.data;
              if (result.success && result.data) {
                setCompanies(result.data);
                setFilteredCompanies(result.data);
                return `Successfully loaded ${result.data.length} companies! 🏢`;
              } else {
                throw new Error(result.message || 'Failed to load companies');
              }
            },
            error: (err) => {
              let errorMessage = 'Failed to fetch companies';
              if (axios.isAxiosError(err)) {
                if (err.code === 'ECONNABORTED') {
                  errorMessage = 'Request timed out. Please try again.';
                } else if (err.response) {
                  errorMessage = `Server error: ${err.response.status}`;
                } else if (err.request) {
                  errorMessage = 'Network error. Please check your connection.';
                }
              } else if (err instanceof Error) {
                errorMessage = err.message;
              }
              
              setError(errorMessage);
              return errorMessage;
            }
          }
        );
      } finally {
        setLoading(false);
      }
    };

    fetchCompanies();
  }, [backendUrl]);

  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredCompanies(companies);
    } else {
      const filtered = companies.filter((company: Company) => {
        const searchLower = searchTerm.toLowerCase();
        return (
          company.name?.toLowerCase().includes(searchLower) ||
          company.industry?.toLowerCase().includes(searchLower) ||
          company.location?.toLowerCase().includes(searchLower) ||
          company.description?.toLowerCase().includes(searchLower)
        );
      });
      setFilteredCompanies(filtered);
    }
  }, [searchTerm, companies]);

  const getInitials = (name: string): string => {
    if (!name) return 'CO';
    return name.split(' ')
      .filter(word => word.length > 0)
      .map(word => word[0])
      .join('')
      .substring(0, 2)
      .toUpperCase();
  };

  const getGradientClass = (name: string): string => {
    const gradients = [
      'from-blue-500 to-blue-600',
      'from-green-500 to-green-600',
      'from-purple-500 to-purple-600',
      'from-red-500 to-red-600',
      'from-indigo-500 to-indigo-600',
      'from-pink-500 to-pink-600',
      'from-yellow-500 to-orange-500',
      'from-teal-500 to-teal-600'
    ];
    
    if (!name) return gradients[0];
    const index = name.charCodeAt(0) % gradients.length;
    return gradients[index];
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center p-6">
        <div className="bg-white rounded-2xl shadow-xl border border-red-100 p-8 max-w-md w-full">
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center w-12 h-12 rounded-full bg-red-100 mb-4">
              <AlertCircle className="w-6 h-6 text-red-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Unable to Load Companies</h3>
            <p className="text-gray-600 text-sm mb-6">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-all duration-200 font-medium text-sm shadow-lg hover:shadow-xl"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Modern Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200/50 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center space-x-4 mb-6">
            <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl shadow-lg">
              <Building2 className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                Company Explorer
              </h1>
              <p className="text-gray-600 mt-1">Discover amazing companies and career opportunities</p>
            </div>
          </div>
          
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search companies, industries, locations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white/80 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder-gray-500"
              disabled={loading}
            />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {filteredCompanies.length === 0 ? (
          <div className="text-center py-16">
            <div className="bg-white/60 rounded-2xl p-8 max-w-md mx-auto">
              <Search className="mx-auto mb-4 text-gray-400" size={48} />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No companies found</h3>
              <p className="text-gray-500 text-sm">
                {searchTerm ? 'Try adjusting your search terms' : 'No companies available at the moment'}
              </p>
            </div>
          </div>
        ) : (
          <>
            <div className="mb-6">
              <p className="text-gray-600">
                Showing <span className="font-semibold text-blue-600">{filteredCompanies.length}</span> {filteredCompanies.length === 1 ? 'company' : 'companies'}
              </p>
            </div>
            
            {/* Fixed Height Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCompanies.map((company) => (
                <div
                  key={company.id}
                  className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 p-6 hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300 hover:-translate-y-1 flex flex-col h-full"
                >
                  {/* Company Header - Fixed Height */}
                  <div className="flex items-start space-x-4 mb-4 flex-shrink-0">
                    <div className="flex-shrink-0">
                      {company.profilePicture ? (
                        <Image
                          src={company.profilePicture}
                          alt={company.name}
                          className="w-14 h-14 rounded-xl object-cover ring-2 ring-blue-100"
                          width={56}
                          height={56}
                        />
                      ) : (
                        <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${getGradientClass(company.name)} flex items-center justify-center ring-2 ring-white shadow-lg`}>
                          <span className="text-white font-bold text-lg">
                            {getInitials(company.name)}
                          </span>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-xl text-gray-900 truncate mb-1">
                        {company.name}
                      </h3>
                      <p className="text-blue-600 font-medium text-sm bg-blue-50 px-2 py-1 rounded-lg inline-block">
                        {company.industry}
                      </p>
                    </div>
                  </div>

                  {/* Company Details - Flexible Height */}
                  <div className="flex-grow space-y-3 mb-4">
                    <div className="flex items-center space-x-2 text-gray-600">
                      <MapPin size={16} className="flex-shrink-0" />
                      <span className="text-sm truncate">{company.location}</span>
                    </div>
                    
                    {company.website && (
                      <div className="flex items-center space-x-2 text-gray-600">
                        <Globe size={16} className="flex-shrink-0" />
                        <a
                          href={company.website.startsWith('http') ? company.website : `https://${company.website}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-blue-600 hover:text-blue-800 transition-colors truncate"
                        >
                          Visit Website
                        </a>
                      </div>
                    )}

                    {/* Description */}
                    {company.description && (
                      <div className="mt-3">
                        <p className="text-gray-700 text-sm leading-relaxed line-clamp-3">
                          {company.description}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Action Button - Always at Bottom */}
                  <div className="mt-auto pt-4 border-t border-gray-100 flex-shrink-0">
                    <button 
                      className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-4 rounded-xl font-medium hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={loading}
                    >
                      View Jobs
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default CompaniesExplorer;
