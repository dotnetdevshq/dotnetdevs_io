'use client';

import React, { useState, useMemo } from 'react';
import { Search, Filter, Map, X, TrendingUp, Clock, Star } from 'lucide-react';
import { Layout } from '@/components/Layout';
import { RoadmapStep } from '@/components/RoadmapStep';
import { mockRoadmaps } from '@/data/mockData';

export default function RoadmapsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('');
  const [selectedRoadmap, setSelectedRoadmap] = useState<string | null>(null);

  // Get unique values for filters
  const allCategories = useMemo(() => {
    const categories = new Set<string>();
    mockRoadmaps.forEach(roadmap => categories.add(roadmap.category));
    return Array.from(categories).sort();
  }, []);

  const difficulties = ['beginner', 'intermediate', 'advanced'];

  // Filter roadmaps based on search and filters
  const filteredRoadmaps = useMemo(() => {
    return mockRoadmaps.filter(roadmap => {
      const matchesSearch = !searchTerm || 
        roadmap.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        roadmap.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        roadmap.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesCategory = !selectedCategory || roadmap.category === selectedCategory;
      const matchesDifficulty = !selectedDifficulty || roadmap.difficulty === selectedDifficulty;

      return matchesSearch && matchesCategory && matchesDifficulty;
    });
  }, [searchTerm, selectedCategory, selectedDifficulty]);

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('');
    setSelectedDifficulty('');
  };

  const hasActiveFilters = searchTerm || selectedCategory || selectedDifficulty;

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner':
        return 'bg-green-100 text-green-800';
      case 'intermediate':
        return 'bg-yellow-100 text-yellow-800';
      case 'advanced':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const selectedRoadmapData = selectedRoadmap ? 
    mockRoadmaps.find(r => r.id === selectedRoadmap) : null;

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            .NET Learning Roadmaps
          </h1>
          <p className="text-xl text-gray-600">
            Structured learning paths to advance your .NET development skills
          </p>
        </div>

        {selectedRoadmapData ? (
          /* Roadmap Detail View */
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <button
                onClick={() => setSelectedRoadmap(null)}
                className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 mb-4"
              >
                ← Back to Roadmaps
              </button>
              
              <div className="flex items-start justify-between mb-6">
                <div className="flex-1">
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">
                    {selectedRoadmapData.title}
                  </h2>
                  <p className="text-gray-600 mb-4">{selectedRoadmapData.description}</p>
                  
                  <div className="flex flex-wrap items-center gap-4 mb-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColor(selectedRoadmapData.difficulty)}`}>
                      {selectedRoadmapData.difficulty}
                    </span>
                    <div className="flex items-center gap-1 text-sm text-gray-600">
                      <Clock className="w-4 h-4" />
                      {selectedRoadmapData.estimatedTime}
                    </div>
                    <div className="flex items-center gap-1 text-sm text-gray-600">
                      <TrendingUp className="w-4 h-4" />
                      {selectedRoadmapData.popularity}% popularity
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    {selectedRoadmapData.tags.map(tag => (
                      <span
                        key={tag}
                        className="px-3 py-1 bg-primary-50 text-primary-700 rounded-full text-sm font-medium"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              {selectedRoadmapData.steps.map((step, index) => (
                <RoadmapStep
                  key={step.id}
                  step={step}
                  stepNumber={index + 1}
                />
              ))}
            </div>
          </div>
        ) : (
          /* Roadmaps List View */
          <>
            {/* Search and Filters */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
              {/* Search Bar */}
              <div className="relative mb-6">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search roadmaps by title, description, or tags..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>

              {/* Filters */}
              <div className="space-y-4">
                {/* Category Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category
                  </label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full md:w-64 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    aria-label="Select category"
                  >
                    <option value="">All Categories</option>
                    {allCategories.map(category => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Difficulty Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Difficulty
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {difficulties.map(difficulty => (
                      <button
                        key={difficulty}
                        onClick={() => setSelectedDifficulty(selectedDifficulty === difficulty ? '' : difficulty)}
                        className={`px-4 py-2 rounded-lg border transition-colors ${
                          selectedDifficulty === difficulty
                            ? 'bg-primary-600 text-white border-primary-600'
                            : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        {difficulty}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Clear Filters */}
                {hasActiveFilters && (
                  <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                    <span className="text-sm text-gray-600">
                      {filteredRoadmaps.length} roadmap{filteredRoadmaps.length !== 1 ? 's' : ''} found
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
              {filteredRoadmaps.length === 0 ? (
                <div className="text-center py-12">
                  <Map className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    No roadmaps found
                  </h3>
                  <p className="text-gray-600">
                    Try adjusting your search criteria or clearing some filters.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {filteredRoadmaps.map(roadmap => (
                    <div key={roadmap.id} className="card hover:border-primary-200 transition-all duration-200">
                      <div className="flex items-start justify-between mb-4">
                        <h3 className="text-xl font-semibold text-gray-900">
                          {roadmap.title}
                        </h3>
                        <div className="flex items-center gap-1 text-sm text-gray-600">
                          <TrendingUp className="w-4 h-4" />
                          {roadmap.popularity}%
                        </div>
                      </div>
                      
                      <p className="text-gray-600 mb-4 line-clamp-3">
                        {roadmap.description}
                      </p>
                      
                      <div className="flex flex-wrap items-center gap-4 mb-4">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColor(roadmap.difficulty)}`}>
                          {roadmap.difficulty}
                        </span>
                        <div className="flex items-center gap-1 text-sm text-gray-600">
                          <Clock className="w-4 h-4" />
                          {roadmap.estimatedTime}
                        </div>
                        <div className="flex items-center gap-1 text-sm text-gray-600">
                          <Map className="w-4 h-4" />
                          {roadmap.steps.length} steps
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap gap-2 mb-4">
                        {roadmap.tags.map(tag => (
                          <span
                            key={tag}
                            className="px-3 py-1 bg-primary-50 text-primary-700 rounded-full text-sm font-medium"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-500">
                          {roadmap.category}
                        </span>
                        <button
                          onClick={() => setSelectedRoadmap(roadmap.id)}
                          className="btn-primary"
                        >
                          View Roadmap
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </Layout>
  );
}
