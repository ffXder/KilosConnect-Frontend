import React from 'react';
import { ShieldAlert, ArrowLeft, Home } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const UnauthorizedPage: React.FC = () => {
  const navigate = useNavigate();

  const handleReturnToDashboard = () => {
    const role = localStorage.getItem('role');
    if (role === 'admin') {
      navigate('/dashboard');
    } else if (role === 'custodian') {
      navigate('/custodian/dashboard');
    } else {
      navigate('/login');
    }
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-slate-950 flex items-center justify-center p-4 transition-colors">
      <div className="max-w-md w-full bg-white dark:bg-slate-900 rounded-[32px] shadow-xl dark:shadow-black/40 p-10 text-center border border-gray-100 dark:border-white/10">
        {/* Icon Header */}
        <div className="flex justify-center mb-6">
          <div className="bg-red-50 dark:bg-red-500/10 p-4 rounded-2xl text-red-500 dark:text-red-400">
            <ShieldAlert size={48} strokeWidth={1.5} />
          </div>
        </div>

        {/* Text Content */}
        <h1 className="text-2xl font-bold text-[#0f172a] dark:text-slate-100 mb-2">
          Access Denied
        </h1>
        <p className="text-gray-500 dark:text-slate-400 text-sm leading-relaxed mb-8">
          Sorry, you don't have the required permissions to view this page. 
          Please contact your administrator if you believe this is a mistake.
        </p>

        {/* Action Buttons */}
        <div className="space-y-3">
          <button
            onClick={() => navigate(-1)}
            className="w-full flex items-center justify-center gap-2 py-3.5 bg-[#072821] text-[#fdffe0] dark:bg-emerald-700 dark:text-slate-50 rounded-xl font-bold hover:bg-[#042421] dark:hover:bg-emerald-800 transition-all active:scale-[0.98]"
          >
            <ArrowLeft size={18} />
            Go Back
          </button>
          
          <button
            onClick={() => handleReturnToDashboard()}
            className="w-full flex items-center justify-center gap-2 py-3.5 bg-gray-50 dark:bg-white/5 text-gray-600 dark:text-slate-300 rounded-xl font-bold hover:bg-gray-100 dark:hover:bg-white/10 transition-all border border-gray-200 dark:border-white/10"
          >
            <Home size={18} />
            Return to Dashboard
          </button>
        </div>

        {/* Footer Info */}
        <p className="mt-8 text-[11px] font-bold text-gray-400 dark:text-slate-500 uppercase tracking-widest">
          Error Code: 403 Forbidden
        </p>
      </div>
    </div>
  );
};

export default UnauthorizedPage;