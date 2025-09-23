import React, { useState, useCallback } from 'react';
import { FiSearch, FiFilter, FiX } from 'react-icons/fi';

interface SearchFiltersProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  statusFilter: string;
  setStatusFilter: (status: string) => void;
  onSearch: () => void;
  onReset?: () => void;
}

const SearchFilters: React.FC<SearchFiltersProps> = ({
  searchTerm,
  setSearchTerm,
  statusFilter,
  setStatusFilter,
  onSearch,
  onReset
}) => {
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      onSearch();
    }
  };

  const handleReset = useCallback(() => {
    setSearchTerm('');
    setStatusFilter('All Status');
    if (onReset) {
      onReset();
    }
  }, [setSearchTerm, setStatusFilter, onReset]);

  return (
    <div className="bg-white rounded-lg border p-4 mb-6">
      <div className="flex flex-wrap gap-4 items-center">
        {/* Search Input */}
        <div className="flex-1 min-w-[250px] relative">
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by job title or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={handleKeyPress}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <FiX />
              </button>
            )}
          </div>
        </div>

        {/* Status Filter */}
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:outline-none bg-white"
        >
          <option value="All Status">All Status</option>
          <option value="ACTIVE">Active</option>
          <option value="PAUSED">Paused</option>
          <option value="COMPLETED">Completed</option>
        </select>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <button
            onClick={onSearch}
            className="flex items-center gap-2 px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
          >
            <FiSearch />
            Search
          </button>
          
          {(searchTerm || statusFilter !== 'All Status') && (
            <button
              onClick={handleReset}
              className="px-4 py-2 border border-gray-300 text-gray-600 rounded-md hover:bg-gray-50 transition-colors"
            >
              Reset
            </button>
          )}
        </div>
      </div>

      {/* Results Summary */}
      {(searchTerm || statusFilter !== 'All Status') && (
        <div className="mt-3 pt-3 border-t border-gray-200">
          <div className="flex flex-wrap gap-2 text-sm text-gray-600">
            <span>Filters applied:</span>
            {searchTerm && (
              <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded">
                Search: &quot;{searchTerm}&quot;
              </span>
            )}
            {statusFilter !== 'All Status' && (
              <span className="px-2 py-1 bg-green-100 text-green-700 rounded">
                Status: {statusFilter}
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchFilters;
