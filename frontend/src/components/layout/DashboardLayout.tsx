import React from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
import { useUIStore } from '../../zustand/uiStore';

export const DashboardLayout: React.FC = () => {
  const { sidebarCollapsed } = useUIStore();

  return (
    <div className="min-h-screen bg-[#F4F4F6]">
      <Sidebar />
      <div
        className={`transition-all duration-300 flex flex-col min-h-screen ${
          sidebarCollapsed ? 'ml-20' : 'ml-64'
        }`}
      >
        <Topbar />
        <main className="flex-1 p-6 md:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
