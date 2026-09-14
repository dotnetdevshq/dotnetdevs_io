'use client';

import React from 'react';
import { ArrowRight, Code, Users, BookOpen, Map, Wrench, Star, TrendingUp, Search } from 'lucide-react';
import { Layout } from '@/components/Layout';
import { JobCard } from '@/components/JobCard';
import { CreatorCard } from '@/components/CreatorCard';
import { BlogCard } from '@/components/BlogCard';
import { mockJobs, mockCreators, mockBlogPosts } from '@/data/mockData';

export default function HomePage() {
  const featuredJobs = mockJobs.filter(job => job.featured).slice(0, 3);
  const featuredCreators = mockCreators.filter(creator => creator.featured).slice(0, 4);
  const featuredBlogPosts = mockBlogPosts.filter(post => post.featured).slice(0, 3);

  const stats = [
    { name: 'Active Jobs', value: '1,200+', icon: Code },
    { name: 'Creators', value: '500+', icon: Users },
    { name: 'Blog Posts', value: '2,500+', icon: BookOpen },
    { name: 'Roadmaps', value: '25+', icon: Map },
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-50 to-secondary-50 py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
              The Ultimate Platform for{' '}
              <span className="text-primary-600">.NET Developers</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Find your next opportunity, discover amazing creators, stay updated with the latest news, 
              and advance your career with our comprehensive roadmaps.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/jobs"
                className="btn-primary inline-flex items-center gap-2 px-8 py-4 text-lg"
              >
                Find Jobs
                <ArrowRight className="w-5 h-5" />
              </a>
              <a
                href="/roadmaps"
                className="btn-secondary inline-flex items-center gap-2 px-8 py-4 text-lg"
              >
                Explore Roadmaps
                <Map className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat) => (
              <div key={stat.name} className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mb-4">
                  <stat.icon className="w-8 h-8 text-primary-600" />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</div>
                <div className="text-gray-600">{stat.name}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Jobs */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Featured Jobs</h2>
            <p className="text-xl text-gray-600">
              Discover the best .NET opportunities from top companies
            </p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
            {featuredJobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
          <div className="text-center">
            <a
              href="/jobs"
              className="btn-primary inline-flex items-center gap-2"
            >
              View All Jobs
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </section>

      {/* Featured Creators */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Featured Creators</h2>
            <p className="text-xl text-gray-600">
              Learn from the best .NET developers and content creators
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            {featuredCreators.map((creator) => (
              <CreatorCard key={creator.id} creator={creator} />
            ))}
          </div>
          <div className="text-center">
            <a
              href="/creators"
              className="btn-primary inline-flex items-center gap-2"
            >
              View All Creators
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </section>

      {/* Latest Blog Posts */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Latest News & Articles</h2>
            <p className="text-xl text-gray-600">
              Stay updated with the latest .NET news and insights
            </p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
            {featuredBlogPosts.map((post) => (
              <BlogCard key={post.id} post={post} />
            ))}
          </div>
          <div className="text-center">
            <a
              href="/blog"
              className="btn-primary inline-flex items-center gap-2"
            >
              Read More Articles
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Advance Your .NET Career?
          </h2>
          <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
            Join thousands of .NET developers who are already using our platform to find 
            opportunities, learn new skills, and connect with the community.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/jobs"
              className="inline-flex items-center gap-2 bg-white text-primary-600 hover:bg-gray-50 font-medium py-3 px-6 rounded-lg transition-colors"
            >
              Browse Jobs
              <Search className="w-5 h-5" />
            </a>
            <a
              href="/roadmaps"
              className="inline-flex items-center gap-2 bg-primary-700 hover:bg-primary-800 text-white font-medium py-3 px-6 rounded-lg transition-colors"
            >
              Start Learning
              <TrendingUp className="w-5 h-5" />
            </a>
          </div>
        </div>
      </section>
    </Layout>
  );
}
