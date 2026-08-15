import React from 'react';
import { Menu, LogOut, User as UserIcon, Shield } from 'lucide-react';
import { useAuthStore } from '../../zustand/authStore';
import { useUIStore } from '../../zustand/uiStore';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../constants/routes';
import { NotificationDropdown } from '../common/NotificationDropdown';

export const Topbar: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const { toggleSidebar } = useUIStore();

  const handleLogout = async () => {
    await logout();
    navigate(ROUTES.LOGIN);
  };

  return (
    <header className="h-16 bg-white border-b border-slate-200/80 px-6 flex items-center justify-between sticky top-0 z-20 shadow-xs">
      <div className="flex items-center gap-4">
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-xl text-slate-500 hover:bg-slate-100 transition-colors"
          title="Toggle Navigation Sidebar"
        >
          <Menu size={20} />
        </button>

        <div className="hidden md:flex items-center gap-2 text-xs text-slate-500">
          <span className="font-semibold text-slate-700">Platform:</span> Film Production Management
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* Notification Bell Dropdown */}
        <NotificationDropdown />

        {/* User Info Badge */}
        {user && (
          <div className="flex items-center gap-3 bg-slate-50 border border-slate-200/60 rounded-full px-3 py-1.5">
            <div className="w-7 h-7 rounded-full bg-black text-white flex items-center justify-center font-bold text-xs shadow-xs">
              {user.fullName ? user.fullName.charAt(0).toUpperCase() : <UserIcon size={14} />}
            </div>
            <div className="text-left hidden sm:block">
              <div className="text-xs font-semibold text-slate-800">{user.fullName}</div>
              <div className="text-[10px] text-slate-500 flex items-center gap-1">
                <Shield size={10} className="text-zinc-700" />
                <span>{user.role?.name || 'User'}</span>
              </div>
            </div>
          </div>
        )}

        {/* Logout Action */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-1.5 text-xs font-medium text-slate-600 hover:text-rose-600 px-3 py-2 rounded-xl hover:bg-rose-50 transition-colors"
          title="Log Out"
        >
          <LogOut size={16} />
          <span className="hidden sm:inline">Logout</span>
        </button>
      </div>
    </header>
  );
};
