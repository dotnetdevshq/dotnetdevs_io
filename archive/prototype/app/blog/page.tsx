'use client';

import React, { useState, useMemo } from 'react';
import { Search, Filter, BookOpen, X, Calendar, Clock } from 'lucide-react';
import { Layout } from '@/components/Layout';
import { BlogCard } from '@/components/BlogCard';
import { mockBlogPosts } from '@/data/mockData';

export default function BlogPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedSource, setSelectedSource] = useState('');
  const [sortBy, setSortBy] = useState<'date' | 'readTime'>('date');

  // Get unique values for filters
  const allTags = useMemo(() => {
    const tags = new Set<string>();
    mockBlogPosts.forEach(post => post.tags.forEach(tag => tags.add(tag)));
    return Array.from(tags).sort();
  }, []);

  const allSources = useMemo(() => {
    const sources = new Set<string>();
    mockBlogPosts.forEach(post => sources.add(post.source));
    return Array.from(sources).sort();
  }, []);

  // Filter and sort blog posts
  const filteredAndSortedPosts = useMemo(() => {
    let filtered = mockBlogPosts.filter(post => {
      const matchesSearch = !searchTerm || 
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.author.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesTags = selectedTags.length === 0 || 
        selectedTags.some(tag => post.tags.includes(tag));

      const matchesSource = !selectedSource || post.source === selectedSource;

      return matchesSearch && matchesTags && matchesSource;
    });

    // Sort posts
    return filtered.sort((a, b) => {
      if (sortBy === 'date') {
        return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
      } else {
        return a.readTime - b.readTime;
      }
    });
  }, [searchTerm, selectedTags, selectedSource, sortBy]);

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
    setSelectedSource('');
  };

  const hasActiveFilters = searchTerm || selectedTags.length > 0 || selectedSource;

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            .NET Blog & News
          </h1>
          <p className="text-xl text-gray-600">
            Stay updated with the latest .NET news, tutorials, and insights
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          {/* Search Bar */}
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search articles by title, content, or author..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          {/* Filters */}
          <div className="space-y-4">
            {/* Sort Options */}
            <div className="flex flex-wrap items-center gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sort By
                </label>
                <div className="flex gap-2">
                  <button
                    onClick={() => setSortBy('date')}
                    className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors ${
                      sortBy === 'date'
                        ? 'bg-primary-600 text-white border-primary-600'
                        : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <Calendar className="w-4 h-4" />
                    Latest
                  </button>
                  <button
                    onClick={() => setSortBy('readTime')}
                    className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors ${
                      sortBy === 'readTime'
                        ? 'bg-primary-600 text-white border-primary-600'
                        : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <Clock className="w-4 h-4" />
                    Quick Read
                  </button>
                </div>
              </div>

              {/* Source Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Source
                </label>
                <select
                  value={selectedSource}
                  onChange={(e) => setSelectedSource(e.target.value)}
                  className="w-full md:w-64 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  aria-label="Select source"
                >
                  <option value="">All Sources</option>
                  {allSources.map(source => (
                    <option key={source} value={source}>
                      {source}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Tags Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Topics
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
                  {filteredAndSortedPosts.length} article{filteredAndSortedPosts.length !== 1 ? 's' : ''} found
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
          {filteredAndSortedPosts.length === 0 ? (
            <div className="text-center py-12">
              <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No articles found
              </h3>
              <p className="text-gray-600">
                Try adjusting your search criteria or clearing some filters.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredAndSortedPosts.map(post => (
                <BlogCard key={post.id} post={post} />
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
