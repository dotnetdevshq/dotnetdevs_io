# dotnetdevs.io

The ultimate platform for .NET developers - Find jobs, discover creators, stay updated with the latest news, and advance your career with comprehensive roadmaps.

## Features

- **Job Board**: Browse .NET jobs with advanced filtering by technology, location, and job type
- **Creator Showcase**: Discover amazing .NET developers and content creators
- **Blog/News Aggregator**: Stay updated with the latest .NET news and articles
- **Learning Roadmaps**: Structured learning paths for .NET developers
- **Tools & Resources**: Essential tools and resources for .NET development

## Tech Stack

- **Frontend**: React 18 with TypeScript
- **Framework**: Next.js 15 with App Router
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Development**: Modern development environment with hot reload

## Project Structure

```
src/
├── app/                 # Next.js app router pages
│   ├── globals.css     # Global styles
│   ├── layout.tsx      # Root layout component
│   ├── page.tsx        # Homepage
│   ├── jobs/           # Jobs page
│   ├── creators/       # Creators page
│   ├── blog/           # Blog page
│   ├── roadmaps/       # Roadmaps page
│   └── tools/          # Tools page
├── components/         # Reusable React components
│   ├── Layout.tsx      # Main layout component
│   ├── JobCard.tsx     # Job card component
│   ├── CreatorCard.tsx # Creator card component
│   ├── BlogCard.tsx    # Blog post card component
│   └── RoadmapStep.tsx # Roadmap step component
├── data/               # Mock data
│   └── mockData.ts     # Sample data for all features
└── types/              # TypeScript type definitions
    └── index.ts        # All interface definitions
```

## Getting Started

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Run the development server**:
   ```bash
   npm run dev
   ```

3. **Open your browser**:
   Navigate to [http://localhost:3000](http://localhost:3000) (or the port shown in terminal)

## Key Components

### JobCard
- Displays job information with company, location, salary, and tags
- Featured job highlighting
- Direct application links

### CreatorCard
- Shows creator profile with follower count and specialties
- Social media links integration
- Featured creator highlighting

### BlogCard
- Blog post preview with read time and publication date
- Source attribution
- Tag-based categorization

### RoadmapStep
- Interactive roadmap steps with expandable resources
- Progress tracking
- Resource type categorization

## Features in Detail

### Job Board
- Advanced filtering by technology, location, and job type
- Real-time search functionality
- Responsive grid layout
- Featured job promotions

### Creator Showcase
- Filter by specialties and expertise
- Social media integration
- Follower metrics
- Featured creator highlighting

### Blog/News Feed
- Content aggregation from multiple sources
- Tag-based filtering
- Sort by date or read time
- Featured article highlighting

### Learning Roadmaps
- Structured learning paths
- Interactive step-by-step guidance
- Resource recommendations
- Progress tracking

### Tools & Resources
- Curated tool collections
- Category-based organization
- Popularity indicators
- Direct tool access links

## Customization

### Adding New Content
1. **Jobs**: Add new job objects to `mockJobs` array in `src/data/mockData.ts`
2. **Creators**: Add new creator objects to `mockCreators` array
3. **Blog Posts**: Add new blog post objects to `mockBlogPosts` array
4. **Roadmaps**: Add new roadmap objects to `mockRoadmaps` array
5. **Tools**: Add new tool objects to `mockTools` array

### Styling
- Modify `tailwind.config.js` for custom colors and themes
- Update `src/app/globals.css` for global styles
- Component-specific styles use Tailwind utility classes

### Configuration
- Update `next.config.js` for Next.js configuration
- Modify `tsconfig.json` for TypeScript settings

## Build and Deploy

1. **Build the project**:
   ```bash
   npm run build
   ```

2. **Start production server**:
   ```bash
   npm start
   ```

3. **Deploy**: The project is ready for deployment on platforms like Vercel, Netlify, or any hosting service that supports Next.js.

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, please open an issue in the GitHub repository or contact the maintainers.

---

Built with ❤️ for the .NET developer community