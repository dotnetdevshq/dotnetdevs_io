'use client';

import React, { useState, useMemo } from 'react';
import { Search, Filter, Users, X } from 'lucide-react';
import { Layout } from '@/components/Layout';
import { CreatorCard } from '@/components/CreatorCard';
import { mockCreators } from '@/data/mockData';

export default function CreatorsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpecialties, setSelectedSpecialties] = useState<string[]>([]);

  // Get unique specialties for filters
  const allSpecialties = useMemo(() => {
    const specialties = new Set<string>();
    mockCreators.forEach(creator => creator.specialties.forEach(specialty => specialties.add(specialty)));
    return Array.from(specialties).sort();
  }, []);

  // Filter creators based on search and filters
  const filteredCreators = useMemo(() => {
    return mockCreators.filter(creator => {
      const matchesSearch = !searchTerm || 
        creator.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        creator.bio.toLowerCase().includes(searchTerm.toLowerCase()) ||
        creator.specialties.some(specialty => 
          specialty.toLowerCase().includes(searchTerm.toLowerCase())
        );

      const matchesSpecialties = selectedSpecialties.length === 0 || 
        selectedSpecialties.some(specialty => creator.specialties.includes(specialty));

      return matchesSearch && matchesSpecialties;
    });
  }, [searchTerm, selectedSpecialties]);

  const handleSpecialtyToggle = (specialty: string) => {
    setSelectedSpecialties(prev => 
      prev.includes(specialty) 
        ? prev.filter(s => s !== specialty)
        : [...prev, specialty]
    );
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedSpecialties([]);
  };

  const hasActiveFilters = searchTerm || selectedSpecialties.length > 0;

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            .NET Content Creators
          </h1>
          <p className="text-xl text-gray-600">
            Discover amazing .NET developers, educators, and content creators
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          {/* Search Bar */}
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search creators by name, bio, or specialties..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          {/* Specialties Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Specialties
            </label>
            <div className="flex flex-wrap gap-2">
              {allSpecialties.map(specialty => (
                <button
                  key={specialty}
                  onClick={() => handleSpecialtyToggle(specialty)}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                    selectedSpecialties.includes(specialty)
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {specialty}
                </button>
              ))}
            </div>
          </div>

          {/* Clear Filters */}
          {hasActiveFilters && (
            <div className="flex justify-between items-center pt-4 border-t border-gray-200 mt-4">
              <span className="text-sm text-gray-600">
                {filteredCreators.length} creator{filteredCreators.length !== 1 ? 's' : ''} found
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

        {/* Results */}
        <div className="space-y-6">
          {filteredCreators.length === 0 ? (
            <div className="text-center py-12">
              <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No creators found
              </h3>
              <p className="text-gray-600">
                Try adjusting your search criteria or clearing some filters.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredCreators.map(creator => (
                <CreatorCard key={creator.id} creator={creator} />
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
