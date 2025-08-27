import React from 'react';
import { Shield, Menu } from 'lucide-react';

interface HeaderProps {
  currentSection: string;
  onNavigate: (section: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ currentSection, onNavigate }) => {
  return (
    <header className="bg-gray-900 border-b-2 border-yellow-500 shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* UNSC Logo and Brand */}
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Shield className="h-8 w-8 text-yellow-500" />
              <div className="absolute inset-0 bg-yellow-500 opacity-20 blur-sm rounded-full"></div>
            </div>
            <div className="flex flex-col">
              <span className="text-yellow-500 font-bold text-lg tracking-wider">UNSC</span>
              <span className="text-gray-400 text-xs tracking-widest">RECRUITMENT DIVISION</span>
            </div>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex space-x-8">
            {[
              { id: 'home', label: 'HOME' },
              { id: 'register', label: 'ENLIST' },
              { id: 'test', label: 'APTITUDE TEST' },
              { id: 'admin', label: 'COMMAND CENTER' }
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`relative px-4 py-2 text-sm font-medium tracking-wider transition-all duration-300 ${
                  currentSection === item.id
                    ? 'text-yellow-500'
                    : 'text-gray-300 hover:text-yellow-400'
                }`}
              >
                {item.label}
                {currentSection === item.id && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-yellow-500 shadow-sm shadow-yellow-500"></div>
                )}
              </button>
            ))}
          </nav>

          {/* Mobile menu button */}
          <button className="md:hidden text-gray-400 hover:text-yellow-500 transition-colors">
            <Menu className="h-6 w-6" />
          </button>
        </div>
      </div>

      {/* Status Bar */}
      <div className="bg-gray-800 px-4 py-1">
        <div className="container mx-auto">
          <div className="flex items-center justify-between text-xs text-gray-400">
            <span>STATUS: OPERATIONAL</span>
            <span>SECURITY LEVEL: CLASSIFIED</span>
            <span>UPLINK: ACTIVE</span>
          </div>
        </div>
      </div>
    </header>
  );
};