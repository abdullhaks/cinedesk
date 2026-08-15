import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../zustand/authStore';
import { ROUTES } from '../../constants/routes';
import { LogOut, User as UserIcon, Shield } from 'lucide-react';

export const OnboardingHeader: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  const handleLogout = async () => {
    await logout();
    navigate(ROUTES.LOGIN);
  };

  return (
    <header className="w-full bg-white border-b border-slate-200/80 px-4 sm:px-8 py-3 flex items-center justify-between sticky top-0 z-30 shadow-xs">
      <div className="flex items-center gap-3">
        <img
          src="/appicon2.PNG"
          alt="App Icon"
          className="h-9 max-w-[170px] object-contain"
        />
        <span className="hidden sm:inline-block text-[11px] font-semibold text-slate-400 uppercase tracking-wider border-l border-slate-200 pl-2">
          Contractor Portal
        </span>
      </div>

      <div className="flex items-center gap-3 sm:gap-4">
        {user && (
          <div className="flex items-center gap-2.5 bg-slate-50 border border-slate-200/60 rounded-full px-3 py-1">
            <div className="w-7 h-7 rounded-full bg-black text-white flex items-center justify-center font-bold text-xs shadow-xs">
              {user.fullName ? user.fullName.charAt(0).toUpperCase() : <UserIcon size={14} />}
            </div>
            <div className="text-left hidden sm:block">
              <div className="text-xs font-semibold text-slate-800 leading-tight">{user.fullName}</div>
              <div className="text-[10px] text-slate-500 flex items-center gap-1">
                <Shield size={10} className="text-zinc-700" />
                <span>{user.contractorType || 'Applicant'}</span>
              </div>
            </div>
          </div>
        )}

        <button
          onClick={handleLogout}
          className="flex items-center gap-1.5 text-xs font-medium text-slate-600 hover:text-rose-600 px-3 py-2 rounded-xl hover:bg-rose-50 transition-colors border border-slate-200/60 sm:border-transparent"
          title="Sign Out"
        >
          <LogOut size={16} />
          <span>Logout</span>
        </button>
      </div>
    </header>
  );
};
