'use client';

import React, { useState, useMemo } from 'react';
import { Search, Filter, Wrench, X, ExternalLink, Star } from 'lucide-react';
import { Layout } from '@/components/Layout';
import { mockTools } from '@/data/mockData';

export default function ToolsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [showPopularOnly, setShowPopularOnly] = useState(false);

  // Get unique values for filters
  const allCategories = useMemo(() => {
    const categories = new Set<string>();
    mockTools.forEach(tool => categories.add(tool.category));
    return Array.from(categories).sort();
  }, []);

  const allTags = useMemo(() => {
    const tags = new Set<string>();
    mockTools.forEach(tool => tool.tags.forEach(tag => tags.add(tag)));
    return Array.from(tags).sort();
  }, []);

  // Filter tools based on search and filters
  const filteredTools = useMemo(() => {
    return mockTools.filter(tool => {
      const matchesSearch = !searchTerm || 
        tool.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tool.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tool.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesCategory = !selectedCategory || tool.category === selectedCategory;
      
      const matchesTags = selectedTags.length === 0 || 
        selectedTags.some(tag => tool.tags.includes(tag));

      const matchesPopular = !showPopularOnly || tool.popular;

      return matchesSearch && matchesCategory && matchesTags && matchesPopular;
    });
  }, [searchTerm, selectedCategory, selectedTags, showPopularOnly]);

  const handleTagToggle = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('');
    setSelectedTags([]);
    setShowPopularOnly(false);
  };

  const hasActiveFilters = searchTerm || selectedCategory || selectedTags.length > 0 || showPopularOnly;

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            .NET Tools & Resources
          </h1>
          <p className="text-xl text-gray-600">
            Discover essential tools and resources for .NET development
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          {/* Search Bar */}
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search tools by name, description, or tags..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          {/* Filters */}
          <div className="space-y-4">
            {/* Category and Popular Filter */}
            <div className="flex flex-wrap items-center gap-4">
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

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  &nbsp;
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={showPopularOnly}
                    onChange={(e) => setShowPopularOnly(e.target.checked)}
                    className="w-4 h-4 text-primary-600 bg-gray-100 border-gray-300 rounded focus:ring-primary-500"
                  />
                  <span className="text-sm text-gray-700">Show popular tools only</span>
                </label>
              </div>
            </div>

            {/* Tags Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tags
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
                  {filteredTools.length} tool{filteredTools.length !== 1 ? 's' : ''} found
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
          {filteredTools.length === 0 ? (
            <div className="text-center py-12">
              <Wrench className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No tools found
              </h3>
              <p className="text-gray-600">
                Try adjusting your search criteria or clearing some filters.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTools.map(tool => (
                <div key={tool.id} className="card hover:border-primary-200 transition-all duration-200">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <h3 className="text-xl font-semibold text-gray-900">
                        {tool.name}
                      </h3>
                      {tool.popular && (
                        <Star className="w-5 h-5 text-yellow-500 fill-current" />
                      )}
                    </div>
                    <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium">
                      {tool.category}
                    </span>
                  </div>
                  
                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {tool.description}
                  </p>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    {tool.tags.map(tag => (
                      <span
                        key={tag}
                        className="px-3 py-1 bg-primary-50 text-primary-700 rounded-full text-sm font-medium"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  
                  <div className="flex justify-end">
                    <a
                      href={tool.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-primary inline-flex items-center gap-2"
                    >
                      Visit Tool
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
