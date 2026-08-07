import React from 'react';
import { FileQuestion, ArrowLeft, Home } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getRole } from '../services/authService';

const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();

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
    <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center p-4 font-['Poppins',sans-serif]">
      <div className="max-w-md w-full bg-white rounded-[32px] shadow-xl p-10 text-center border border-gray-100">
        {/* Icon Header */}
        <div className="flex justify-center mb-6">
          <div className="bg-amber-50 p-4 rounded-2xl text-amber-500">
            <FileQuestion size={48} strokeWidth={1.5} />
          </div>
        </div>

        {/* Text Content */}
        <h1 className="text-2xl font-bold text-[#0f172a] mb-2">
          Page Not Found
        </h1>
        <p className="text-gray-500 text-sm leading-relaxed mb-8">
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
            className="w-full flex items-center justify-center gap-2 py-3.5 bg-gray-50 text-gray-600 rounded-xl font-bold hover:bg-gray-100 transition-all border border-gray-200"
          >
            <Home size={18} />
            Return to Dashboard
          </button>
        </div>

        {/* Footer Info */}
        <p className="mt-8 text-[11px] font-bold text-gray-400 uppercase tracking-widest">
          Error Code: 404 Not Found
        </p>
      </div>
    </div>
  );
};

export default NotFoundPage;