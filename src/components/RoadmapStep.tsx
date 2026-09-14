'use client';

import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Clock, ExternalLink, CheckCircle, Circle } from 'lucide-react';
import { RoadmapStep as RoadmapStepType } from '@/types';

interface RoadmapStepProps {
  step: RoadmapStepType;
  stepNumber: number;
  className?: string;
}

export const RoadmapStep: React.FC<RoadmapStepProps> = ({ step, stepNumber, className = '' }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const getLevelColor = (level: string) => {
    switch (level) {
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

  const getResourceTypeIcon = (type: string) => {
    switch (type) {
      case 'video':
        return '🎥';
      case 'course':
        return '📚';
      case 'article':
        return '📄';
      case 'documentation':
        return '📖';
      case 'book':
        return '📚';
      case 'tool':
        return '🔧';
      default:
        return '📄';
    }
  };

  return (
    <div className={`card ${className}`}>
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0">
          <div className="flex items-center justify-center w-10 h-10 bg-primary-100 text-primary-700 rounded-full font-bold">
            {stepNumber}
          </div>
        </div>
        
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="text-xl font-semibold text-gray-900">{step.title}</h3>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getLevelColor(step.level)}`}>
              {step.level}
            </span>
            <div className="flex items-center gap-1 text-sm text-gray-600">
              <Clock className="w-4 h-4" />
              {step.estimatedTime}
            </div>
          </div>
          
          <p className="text-gray-700 mb-4">{step.description}</p>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">
                {step.resources.length} resource{step.resources.length !== 1 ? 's' : ''}
              </span>
              {step.completed && (
                <CheckCircle className="w-5 h-5 text-green-600" />
              )}
            </div>
            
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="flex items-center gap-1 text-primary-600 hover:text-primary-700 font-medium text-sm"
            >
              {isExpanded ? 'Hide Resources' : 'Show Resources'}
              {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>
      
      {isExpanded && (
        <div className="mt-6 pl-14 border-t border-gray-200 pt-6">
          <h4 className="font-semibold text-gray-900 mb-4">Resources</h4>
          <div className="space-y-3">
            {step.resources.map((resource) => (
              <div key={resource.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                <span className="text-lg">{getResourceTypeIcon(resource.type)}</span>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h5 className="font-medium text-gray-900">{resource.title}</h5>
                    <span className="text-xs text-gray-500 capitalize">{resource.type}</span>
                    {resource.free && (
                      <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                        Free
                      </span>
                    )}
                    {resource.difficulty && (
                      <span className={`px-2 py-1 text-xs rounded-full ${getLevelColor(resource.difficulty)}`}>
                        {resource.difficulty}
                      </span>
                    )}
                  </div>
                  {resource.description && (
                    <p className="text-sm text-gray-600 mb-2">{resource.description}</p>
                  )}
                  <a
                    href={resource.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-primary-600 hover:text-primary-700 text-sm font-medium"
                  >
                    Visit Resource
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
