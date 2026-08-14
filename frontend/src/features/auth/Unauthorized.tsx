import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../constants/routes';
import { ShieldAlert, ArrowLeft } from 'lucide-react';

export const Unauthorized: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#F4F4F6] flex items-center justify-center p-4">
      <div className="card-minimal max-w-md w-full text-center py-12 px-6 shadow-lg">
        <div className="w-16 h-16 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto mb-4">
          <ShieldAlert size={32} />
        </div>

        <h1 className="text-2xl font-bold text-slate-900 mb-2">403 Access Forbidden</h1>
        <p className="text-sm text-slate-500 mb-8 max-w-xs mx-auto">
          You do not have permission to access this page. Please contact your system administrator if you believe this is an error.
        </p>

        <button
          onClick={() => navigate(ROUTES.DASHBOARD)}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-sm font-semibold transition-colors"
        >
          <ArrowLeft size={16} />
          <span>Return to Dashboard</span>
        </button>
      </div>
    </div>
  );
};
