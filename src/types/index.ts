export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  type: 'full-time' | 'part-time' | 'contract' | 'remote';
  salary?: string;
  description: string;
  tags: string[];
  applyUrl: string;
  postedAt: Date;
  featured?: boolean;
}

export interface Creator {
  id: string;
  name: string;
  image: string;
  bio: string;
  followers: number;
  specialties: string[];
  socials: {
    twitter?: string;
    github?: string;
    linkedin?: string;
    youtube?: string;
    blog?: string;
  };
  featured?: boolean;
}

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content?: string;
  author: string;
  source: string;
  sourceUrl: string;
  readUrl: string;
  image?: string;
  tags: string[];
  publishedAt: Date;
  readTime: number;
  featured?: boolean;
}

export interface RoadmapStep {
  id: string;
  title: string;
  description: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  estimatedTime: string;
  resources: Resource[];
  completed?: boolean;
}

export interface Resource {
  id: string;
  title: string;
  type: 'article' | 'video' | 'course' | 'documentation' | 'book' | 'tool';
  url: string;
  description?: string;
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  free?: boolean;
}

export interface Roadmap {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedTime: string;
  steps: RoadmapStep[];
  tags: string[];
  popularity: number;
}

export interface Tool {
  id: string;
  name: string;
  description: string;
  category: string;
  url: string;
  icon?: string;
  tags: string[];
  popular?: boolean;
}
