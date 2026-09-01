import React from 'react';
import { useTheme } from '../context/ThemeContext';

interface ThemeToggleProps {
  isExpanded?: boolean;
  isMobileOpen?: boolean;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ isExpanded = false, isMobileOpen = false }) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      title={!isExpanded && !isMobileOpen ? (theme === 'dark' ? "Light Mode" : "Dark Mode") : undefined}
      className={`flex items-center rounded-[10px] text-[#FDFFE0] hover:bg-white/5 transition-colors cursor-pointer border-l-4 border-transparent py-3 ${
        !isExpanded && !isMobileOpen ? "justify-center px-0 w-full" : "gap-3 px-4 w-full"
      }`}
    >
      {/* Icon (Sun or Moon) */}
      <span className="text-[#FDFFE0]">
        {theme === 'dark' ? (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="5" />
            <line x1="12" y1="1" x2="12" y2="3" />
            <line x1="12" y1="21" x2="12" y2="23" />
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
            <line x1="1" y1="12" x2="3" y2="12" />
            <line x1="21" y1="12" x2="23" y2="12" />
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
          </svg>
        ) : (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
          </svg>
        )}
      </span>

      {/* Text Label */}
      <span className={`[font-family:'Poppins',Helvetica] font-medium text-[#FDFFE0] text-sm leading-5 whitespace-nowrap transition-all duration-300 ${
        isExpanded || isMobileOpen ? "opacity-100 scale-100 w-auto" : "opacity-0 scale-90 w-0 pointer-events-none"
      }`}>
        {theme === 'dark' ? "Light Mode" : "Dark Mode"}
      </span>
    </button>
  );
};