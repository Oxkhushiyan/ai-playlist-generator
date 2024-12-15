// src/components/Navigation.tsx
import Link from 'next/link';
import { FaMusic } from 'react-icons/fa';

export default function Navigation() {
  return (
    <nav className="fixed w-full top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex-shrink-0">
            <Link 
              href="/" 
              className="flex items-center gap-2 hover:opacity-80 transition-opacity"
            >
              <FaMusic className="text-2xl text-indigo-600" />
              <span className="text-2xl font-bold logo-gradient">
                MusicAI
              </span>
            </Link>
          </div>
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              <Link 
                href="/" 
                className="text-gray-900 hover:text-indigo-600 px-3 py-2 rounded-md transition-all duration-300 font-medium"
              >
                Home
              </Link>
              <Link 
                href="/features" 
                className="text-gray-900 hover:text-indigo-600 px-3 py-2 rounded-md transition-all duration-300 font-medium"
              >
                Features
              </Link>
              <Link 
                href="/about" 
                className="text-gray-900 hover:text-indigo-600 px-3 py-2 rounded-md transition-all duration-300 font-medium"
              >
                About
              </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
