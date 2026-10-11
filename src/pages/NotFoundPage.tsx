import React from 'react';
import { FileQuestion, ArrowLeft, Home, Moon, Sun } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getRole } from '../services/authService';
import { useTheme } from '../context/ThemeContext';

const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  const handleReturnToDashboard = () => {
    const role = getRole();
    if (role === 'admin') {
      navigate('/dashboard');
    } else if (role === 'custodian') {
      navigate('/custodian/dashboard');
    } else {
      navigate('/login');
    }
  };

  return (
    <div className="relative min-h-screen bg-[#f8fafc] dark:bg-slate-950 flex items-center justify-center p-4 font-['Poppins',sans-serif] transition-colors duration-300">
      <button
        type="button"
        onClick={toggleTheme}
        aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
        title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
        className="absolute right-4 top-4 inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 shadow-sm transition-colors hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800 sm:right-6 sm:top-6"
      >
        {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
        <span>{theme === 'dark' ? 'Light mode' : 'Dark mode'}</span>
      </button>

      <div className="max-w-md w-full bg-white dark:bg-slate-900 rounded-[32px] shadow-xl p-10 text-center border border-gray-100 dark:border-slate-800 transition-colors duration-300">
        {/* Icon Header */}
        <div className="flex justify-center mb-6">
          <div className="bg-amber-50 dark:bg-amber-400/10 p-4 rounded-2xl text-amber-500 dark:text-amber-400">
            <FileQuestion size={48} strokeWidth={1.5} />
          </div>
        </div>

        {/* Text Content */}
        <h1 className="text-2xl font-bold text-[#0f172a] dark:text-slate-100 mb-2">
          Page Not Found
        </h1>
        <p className="text-gray-500 dark:text-slate-400 text-sm leading-relaxed mb-8">
          The page you are looking for doesn't exist, has been removed, or the link you followed might be broken.
        </p>

        {/* Action Buttons */}
        <div className="space-y-3">
          <button
            onClick={() => navigate(-1)}
            className="w-full flex items-center justify-center gap-2 py-3.5 bg-[#072821] text-[#fdffe0] rounded-xl font-bold hover:bg-[#042421] transition-all active:scale-[0.98]"
          >
            <ArrowLeft size={18} />
            Go Back
          </button>
          
          <button
            onClick={handleReturnToDashboard}
            className="w-full flex items-center justify-center gap-2 py-3.5 bg-gray-50 dark:bg-slate-800 text-gray-600 dark:text-slate-200 rounded-xl font-bold hover:bg-gray-100 dark:hover:bg-slate-700 transition-all border border-gray-200 dark:border-slate-700"
          >
            <Home size={18} />
            Return to Dashboard
          </button>
        </div>

        {/* Footer Info */}
        <p className="mt-8 text-[11px] font-bold text-gray-400 dark:text-slate-500 uppercase tracking-widest">
          Error Code: 404 Not Found
        </p>
      </div>
    </div>
  );
};

export default NotFoundPage;