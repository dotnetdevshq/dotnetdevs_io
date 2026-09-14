import React from 'react';
import { MapPin, Clock, DollarSign, ExternalLink, Star } from 'lucide-react';
import { Job } from '@/types';

interface JobCardProps {
  job: Job;
  className?: string;
}

export const JobCard: React.FC<JobCardProps> = ({ job, className = '' }) => {
  const formatDate = (date: Date) => {
    return new Intl.RelativeTimeFormat('en', { numeric: 'auto' }).format(
      Math.ceil((date.getTime() - Date.now()) / (1000 * 60 * 60 * 24)),
      'day'
    );
  };

  return (
    <div className={`card hover:border-primary-200 transition-all duration-200 ${className}`}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="text-xl font-semibold text-gray-900 group-hover:text-primary-600 transition-colors">
              {job.title}
            </h3>
            {job.featured && (
              <Star className="w-5 h-5 text-yellow-500 fill-current" />
            )}
          </div>
          <p className="text-gray-700 font-medium mb-2">{job.company}</p>
        </div>
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
          job.type === 'remote' 
            ? 'bg-green-100 text-green-800' 
            : job.type === 'contract'
            ? 'bg-blue-100 text-blue-800'
            : 'bg-gray-100 text-gray-800'
        }`}>
          {job.type}
        </span>
      </div>

      <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
        <div className="flex items-center gap-1">
          <MapPin className="w-4 h-4" />
          {job.location}
        </div>
        <div className="flex items-center gap-1">
          <Clock className="w-4 h-4" />
          {formatDate(job.postedAt)}
        </div>
        {job.salary && (
          <div className="flex items-center gap-1">
            <DollarSign className="w-4 h-4" />
            {job.salary}
          </div>
        )}
      </div>

      <p className="text-gray-700 mb-4 line-clamp-3">{job.description}</p>

      <div className="flex flex-wrap gap-2 mb-4">
        {job.tags.map((tag) => (
          <span
            key={tag}
            className="px-3 py-1 bg-primary-50 text-primary-700 rounded-full text-sm font-medium"
          >
            {tag}
          </span>
        ))}
      </div>

      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-500">
          Posted {formatDate(job.postedAt)}
        </span>
        <a
          href={job.applyUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-primary inline-flex items-center gap-2"
        >
          Apply Now
          <ExternalLink className="w-4 h-4" />
        </a>
      </div>
    </div>
  );
};
