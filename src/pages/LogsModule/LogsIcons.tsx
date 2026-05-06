import React from 'react';

export const InventoryIcon: React.FC = () => (
  <svg viewBox="0 0 24 24" fill="none" className="w-13 h-13" aria-hidden="true">
    <path d="M12 8l4 2.5V14l-4 2.5L8 14v-3.5L12 8z" stroke="#2563EB" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M12 16.5V13M8 10.5l4 2.5 4-2.5" stroke="#2563EB" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const TaskIcon: React.FC = () => (
  <svg viewBox="0 0 24 24" fill="none" className="13" aria-hidden="true">
    <rect x="8" y="7" width="8" height="10" rx="1.5" stroke="#10B981" strokeWidth="1.5" />
    <path d="M10.5 7V6.5a.5.5 0 01.5-.5h2a.5.5 0 01.5.5V7" stroke="#10B981" strokeWidth="1.5" />
    <path d="M10 12.5l1.5 1.5 2.5-3" stroke="#10B981" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const IncidentIcon: React.FC = () => (
  <svg viewBox="0 0 24 24" fill="none" className="w-13 h-13" aria-hidden="true">
    <path d="M12 7l-5 8.5h10L12 7z" stroke="#DC2626" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M12 10.5v2M12 14.5h.01" stroke="#DC2626" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

export const LostFoundIcon: React.FC = () => (
  <svg viewBox="0 0 24 24" fill="none" className="w-13 h-13" aria-hidden="true">
    <path d="M7 9h10v2H7V9z" stroke="#9333EA" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M8 11v5a1 1 0 001 1h6a1 1 0 001-1v-5" stroke="#9333EA" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M11 13.5h2" stroke="#9333EA" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);