'use client';

import React, { useState, useMemo } from 'react';
import { Search, Filter, MapPin, Clock, DollarSign, X } from 'lucide-react';
import { Layout } from '@/components/Layout';
import { JobCard } from '@/components/JobCard';
import { mockJobs } from '@/data/mockData';

export default function JobsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedLocation, setSelectedLocation] = useState('');
  const [selectedType, setSelectedType] = useState('');

  // Get unique values for filters
  const allTags = useMemo(() => {
    const tags = new Set<string>();
    mockJobs.forEach(job => job.tags.forEach(tag => tags.add(tag)));
    return Array.from(tags).sort();
  }, []);

  const allLocations = useMemo(() => {
    const locations = new Set<string>();
    mockJobs.forEach(job => locations.add(job.location));
    return Array.from(locations).sort();
  }, []);

  const jobTypes = ['full-time', 'part-time', 'contract', 'remote'];

  // Filter jobs based on search and filters
  const filteredJobs = useMemo(() => {
    return mockJobs.filter(job => {
      const matchesSearch = !searchTerm || 
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.description.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesTags = selectedTags.length === 0 || 
        selectedTags.every(tag => job.tags.includes(tag));

      const matchesLocation = !selectedLocation || job.location === selectedLocation;

      const matchesType = !selectedType || job.type === selectedType;

      return matchesSearch && matchesTags && matchesLocation && matchesType;
    });
  }, [searchTerm, selectedTags, selectedLocation, selectedType]);

  const handleTagToggle = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedTags([]);
    setSelectedLocation('');
    setSelectedType('');
  };

  const hasActiveFilters = searchTerm || selectedTags.length > 0 || selectedLocation || selectedType;

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Find Your Next .NET Opportunity
          </h1>
          <p className="text-xl text-gray-600">
            Discover amazing .NET jobs from top companies around the world
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          {/* Search Bar */}
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search jobs, companies, or technologies..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          {/* Filters */}
          <div className="space-y-4">
            {/* Job Type Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Job Type
              </label>
              <div className="flex flex-wrap gap-2">
                {jobTypes.map(type => (
                  <button
                    key={type}
                    onClick={() => setSelectedType(selectedType === type ? '' : type)}
                    className={`px-4 py-2 rounded-lg border transition-colors ${
                      selectedType === type
                        ? 'bg-primary-600 text-white border-primary-600'
                        : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            {/* Location Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Location
              </label>
              <select
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                className="w-full md:w-64 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                aria-label="Select location"
              >
                <option value="">All Locations</option>
                {allLocations.map(location => (
                  <option key={location} value={location}>
                    {location}
                  </option>
                ))}
              </select>
            </div>

            {/* Technology Tags Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Technologies
              </label>
              <div className="flex flex-wrap gap-2">
                {allTags.map(tag => (
                  <button
                    key={tag}
                    onClick={() => handleTagToggle(tag)}
                    className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                      selectedTags.includes(tag)
                        ? 'bg-primary-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            {/* Clear Filters */}
            {hasActiveFilters && (
              <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                <span className="text-sm text-gray-600">
                  {filteredJobs.length} job{filteredJobs.length !== 1 ? 's' : ''} found
                </span>
                <button
                  onClick={clearFilters}
                  className="inline-flex items-center gap-2 text-sm text-primary-600 hover:text-primary-700"
                >
                  <X className="w-4 h-4" />
                  Clear all filters
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Results */}
        <div className="space-y-6">
          {filteredJobs.length === 0 ? (
            <div className="text-center py-12">
              <Filter className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No jobs found
              </h3>
              <p className="text-gray-600">
                Try adjusting your search criteria or clearing some filters.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredJobs.map(job => (
                <JobCard key={job.id} job={job} />
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
