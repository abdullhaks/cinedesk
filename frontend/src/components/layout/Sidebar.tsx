import React from 'react';
import { NavLink } from 'react-router-dom';
import * as Icons from 'lucide-react';
import { NAV_ITEMS } from '../../constants/navItems';
import type { NavItem } from '../../constants/navItems';
import { usePermission } from '../../hooks/usePermission';
import { useUIStore } from '../../zustand/uiStore';

export const Sidebar: React.FC = () => {
  const { hasPermission } = usePermission();
  const { sidebarCollapsed } = useUIStore();

  // Filter NAV_ITEMS by user permissions
  const visibleNavItems = NAV_ITEMS.filter((item) => {
    if (!item.permission) return true;
    return hasPermission(item.permission);
  });

  const renderIcon = (iconName: string) => {
    const IconComponent = (Icons as any)[iconName] || Icons.HelpCircle;
    return <IconComponent size={20} />;
  };

  return (
    <aside
      className={`fixed top-0 left-0 h-screen bg-slate-900 text-slate-300 z-30 transition-all duration-300 flex flex-col ${
        sidebarCollapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Brand Header */}
      <div className={`h-16 flex items-center border-b border-slate-800 ${sidebarCollapsed ? 'justify-center px-2' : 'px-5'}`}>
        <img
          src="/appicon.png"
          alt="App Icon"
          className={`object-contain transition-all ${sidebarCollapsed ? 'h-9 w-9' : 'h-10 max-w-[180px]'}`}
        />
      </div>

      {/* Navigation List */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {visibleNavItems.map((item: NavItem) => (
          <NavLink
            key={item.key}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-blue-600 text-white font-semibold shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              } ${sidebarCollapsed ? 'justify-center px-0' : ''}`
            }
            title={sidebarCollapsed ? item.label : undefined}
          >
            {renderIcon(item.iconName)}
            {!sidebarCollapsed && <span>{item.label}</span>}
          </NavLink>
        ))}
      </nav>

      {/* Footer Info */}
      {!sidebarCollapsed && (
        <div className="p-4 border-t border-slate-800 text-xs text-slate-500">
          Cinidesk Pro v1.0.0
        </div>
      )}
    </aside>
  );
};
