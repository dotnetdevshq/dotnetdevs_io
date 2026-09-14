'use client';

import React, { ReactNode } from 'react';
import { Menu, X, Code, Users, BookOpen, Map, Wrench, Github, Twitter, Linkedin } from 'lucide-react';

interface LayoutProps {
  children: ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const navigation = [
    { name: 'Jobs', href: '/jobs', icon: Code },
    { name: 'Creators', href: '/creators', icon: Users },
    { name: 'Blog', href: '/blog', icon: BookOpen },
    { name: 'Roadmaps', href: '/roadmaps', icon: Map },
    { name: 'Tools', href: '/tools', icon: Wrench },
  ];

  const socialLinks = [
    { name: 'GitHub', href: 'https://github.com/dotnetdevs', icon: Github },
    { name: 'Twitter', href: 'https://twitter.com/dotnetdevs', icon: Twitter },
    { name: 'LinkedIn', href: 'https://linkedin.com/company/dotnetdevs', icon: Linkedin },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              <a href="/" className="flex items-center space-x-2">
                <div className="w-10 h-10 bg-dotnet-purple rounded-lg flex items-center justify-center">
                  <Code className="w-6 h-6 text-white" />
                </div>
                <span className="text-xl font-bold text-gray-900">dotnetdevs.io</span>
              </a>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              {navigation.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="flex items-center space-x-1 text-gray-700 hover:text-primary-600 font-medium transition-colors"
                >
                  <item.icon className="w-4 h-4" />
                  <span>{item.name}</span>
                </a>
              ))}
            </nav>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-200">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navigation.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="flex items-center space-x-2 px-3 py-2 text-gray-700 hover:text-primary-600 hover:bg-gray-50 rounded-lg"
                >
                  <item.icon className="w-4 h-4" />
                  <span>{item.name}</span>
                </a>
              ))}
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Brand */}
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-10 h-10 bg-dotnet-purple rounded-lg flex items-center justify-center">
                  <Code className="w-6 h-6 text-white" />
                </div>
                <span className="text-xl font-bold text-gray-900">dotnetdevs.io</span>
              </div>
              <p className="text-gray-600 max-w-md">
                The ultimate platform for .NET developers. Find jobs, discover creators, 
                read the latest news, and advance your career with our comprehensive roadmaps.
              </p>
              <div className="flex space-x-4 mt-6">
                {socialLinks.map((social) => (
                  <a
                    key={social.name}
                    href={social.href}
                    className="text-gray-400 hover:text-primary-600 transition-colors"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <social.icon className="w-6 h-6" />
                  </a>
                ))}
              </div>
            </div>

            {/* Navigation */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Navigation</h3>
              <ul className="space-y-2">
                {navigation.map((item) => (
                  <li key={item.name}>
                    <a
                      href={item.href}
                      className="text-gray-600 hover:text-primary-600 transition-colors"
                    >
                      {item.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Resources */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Resources</h3>
              <ul className="space-y-2">
                <li>
                  <a href="/about" className="text-gray-600 hover:text-primary-600 transition-colors">
                    About
                  </a>
                </li>
                <li>
                  <a href="/contact" className="text-gray-600 hover:text-primary-600 transition-colors">
                    Contact
                  </a>
                </li>
                <li>
                  <a href="/privacy" className="text-gray-600 hover:text-primary-600 transition-colors">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="/terms" className="text-gray-600 hover:text-primary-600 transition-colors">
                    Terms of Service
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-200 mt-8 pt-8 text-center text-gray-600">
            <p>&copy; 2024 dotnetdevs.io. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};
