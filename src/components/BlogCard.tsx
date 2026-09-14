import React from 'react';
import { Clock, ExternalLink, User, Calendar, Star } from 'lucide-react';
import { BlogPost } from '@/types';

interface BlogCardProps {
  post: BlogPost;
  className?: string;
}

export const BlogCard: React.FC<BlogCardProps> = ({ post, className = '' }) => {
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(date);
  };

  const formatReadTime = (minutes: number) => {
    return `${minutes} min read`;
  };

  return (
    <div className={`card hover:border-primary-200 transition-all duration-200 ${className}`}>
      {post.image && (
        <div className="mb-4 -mx-6 -mt-6">
          <img
            src={post.image}
            alt={post.title}
            className="w-full h-48 object-cover rounded-t-lg"
          />
        </div>
      )}

      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="text-xl font-semibold text-gray-900 line-clamp-2 group-hover:text-primary-600 transition-colors">
              {post.title}
            </h3>
            {post.featured && (
              <Star className="w-5 h-5 text-yellow-500 fill-current flex-shrink-0" />
            )}
          </div>
        </div>
      </div>

      <p className="text-gray-700 mb-4 line-clamp-3">{post.excerpt}</p>

      <div className="flex flex-wrap gap-2 mb-4">
        {post.tags.map((tag) => (
          <span
            key={tag}
            className="px-3 py-1 bg-primary-50 text-primary-700 rounded-full text-sm font-medium"
          >
            {tag}
          </span>
        ))}
      </div>

      <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
        <div className="flex items-center gap-1">
          <User className="w-4 h-4" />
          {post.author}
        </div>
        <div className="flex items-center gap-1">
          <Calendar className="w-4 h-4" />
          {formatDate(post.publishedAt)}
        </div>
        <div className="flex items-center gap-1">
          <Clock className="w-4 h-4" />
          {formatReadTime(post.readTime)}
        </div>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-gray-200">
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">Source:</span>
          <a
            href={post.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-primary-600 hover:text-primary-700 font-medium"
          >
            {post.source}
          </a>
        </div>
        <a
          href={post.readUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-primary inline-flex items-center gap-2"
        >
          Read More
          <ExternalLink className="w-4 h-4" />
        </a>
      </div>
    </div>
  );
};
