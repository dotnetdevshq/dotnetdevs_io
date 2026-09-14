import React from 'react';
import { Users, ExternalLink, Github, Twitter, Linkedin, Youtube, Globe, Star } from 'lucide-react';
import { Creator } from '@/types';

interface CreatorCardProps {
  creator: Creator;
  className?: string;
}

export const CreatorCard: React.FC<CreatorCardProps> = ({ creator, className = '' }) => {
  const formatFollowers = (count: number) => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`;
    } else if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`;
    }
    return count.toString();
  };

  const getSocialIcon = (platform: string) => {
    switch (platform) {
      case 'github':
        return <Github className="w-4 h-4" />;
      case 'twitter':
        return <Twitter className="w-4 h-4" />;
      case 'linkedin':
        return <Linkedin className="w-4 h-4" />;
      case 'youtube':
        return <Youtube className="w-4 h-4" />;
      case 'blog':
        return <Globe className="w-4 h-4" />;
      default:
        return <ExternalLink className="w-4 h-4" />;
    }
  };

  return (
    <div className={`card hover:border-primary-200 transition-all duration-200 ${className}`}>
      <div className="flex items-start gap-4 mb-4">
        <img
          src={creator.image}
          alt={creator.name}
          className="w-16 h-16 rounded-full object-cover"
        />
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="text-xl font-semibold text-gray-900">{creator.name}</h3>
            {creator.featured && (
              <Star className="w-5 h-5 text-yellow-500 fill-current" />
            )}
          </div>
          <div className="flex items-center gap-1 text-sm text-gray-600">
            <Users className="w-4 h-4" />
            {formatFollowers(creator.followers)} followers
          </div>
        </div>
      </div>

      <p className="text-gray-700 mb-4 line-clamp-3">{creator.bio}</p>

      <div className="flex flex-wrap gap-2 mb-4">
        {creator.specialties.map((specialty) => (
          <span
            key={specialty}
            className="px-3 py-1 bg-primary-50 text-primary-700 rounded-full text-sm font-medium"
          >
            {specialty}
          </span>
        ))}
      </div>

      <div className="flex items-center gap-3 pt-4 border-t border-gray-200">
        {Object.entries(creator.socials).map(([platform, url]) => (
          url && (
            <a
              key={platform}
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
              title={`Visit ${creator.name}'s ${platform}`}
            >
              {getSocialIcon(platform)}
            </a>
          )
        ))}
      </div>
    </div>
  );
};
