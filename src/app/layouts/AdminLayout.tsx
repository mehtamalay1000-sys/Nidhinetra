// Nidhiनेत्र: District Administration Portal Layout (UX4G 3.0 & GIGW Compliance)
// Smart India Hackathon 2026

import React, { useState } from 'react';
import { Outlet, NavLink, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/app/providers/AuthProvider';
import { useGovSettings } from '@/app/providers/GovSettingsProvider';
import { GovUtilityBar } from '@/components/common/GovUtilityBar';
import { GovFooter } from '@/components/common/GovFooter';
import { NidhiNetraLogo } from '@/components/common/NidhiNetraLogo';
import { NotificationsPopover } from '@/components/common/NotificationsPopover';
import {
  LayoutDashboard,
  FolderPlus,
  Users,
  FileSpreadsheet,
  BarChart4,
  SlidersHorizontal,
  History,
  LogOut,
  Menu,
  X,
  FileCheck,
} from 'lucide-react';

export const AdminLayout: React.FC = () => {
  const { user, logout } = useAuth();
  const { t } = useGovSettings();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { to: '/admin/dashboard', label: 'Admin Overview', icon: LayoutDashboard },
    { to: '/admin/projects', label: 'Project Management', icon: FolderPlus },
    { to: '/admin/reports', label: 'All Citizen Reports', icon: FileCheck },
    { to: '/admin/users', label: 'User & Role Access', icon: Users },
    { to: '/admin/import', label: 'Data Import & Export', icon: FileSpreadsheet },
    { to: '/admin/risk', label: 'Risk Model Calibration', icon: SlidersHorizontal },
    { to: '/admin/analytics', label: 'District Analytics', icon: BarChart4 },
    { to: '/admin/audit', label: 'System Audit Logs', icon: History },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#F7F8FA] text-[#1F2937]">
      {/* Top Government Utility Bar with Accessibility & Language controls */}
      <GovUtilityBar />

      <div className="flex-1 flex overflow-hidden">
        {/* Admin Sidebar (Government Deep Blue) */}
        <aside
          className={`fixed inset-y-0 left-0 z-40 w-64 bg-[#123B6D] text-slate-200 transform transition-transform duration-200 ease-in-out md:translate-x-0 md:static md:inset-auto md:flex md:flex-col ${
            mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          {/* Header */}
          <div className="h-16 flex items-center justify-between px-4 bg-[#0A2540] border-b border-blue-900">
            <Link to="/admin/dashboard" className="flex items-center gap-2">
              <NidhiNetraLogo variant="dark" size="sm" showSubtitle={false} />
            </Link>
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="md:hidden text-slate-300 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Admin Profile Summary */}
          <div className="p-3.5 mx-3 my-3 bg-[#0B4F9C]/60 border border-blue-600/40 rounded-md">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-white text-[#123B6D] flex items-center justify-center font-bold text-xs shrink-0">
                {user?.full_name ? user.full_name.charAt(0) : 'A'}
              </div>
              <div className="overflow-hidden">
                <p className="text-xs font-bold text-white truncate">{user?.full_name}</p>
                <p className="text-[11px] text-amber-300 font-medium">District Collectorate Admin</p>
                <p className="text-[10px] text-slate-300 truncate">Nashik Collectorate</p>
              </div>
            </div>
          </div>

          {/* Nav Items */}
          <nav className="flex-1 px-3 py-2 space-y-1 overflow-y-auto">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={() => setMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-2.5 px-3 py-2.5 rounded-md text-xs font-medium transition-colors ${
                      isActive
                        ? 'bg-[#E87B18] text-white font-bold shadow-2xs'
                        : 'text-slate-200 hover:bg-[#0B4F9C] hover:text-white'
                    }`
                  }
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="p-3 border-t border-blue-900">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-2 px-3 py-2 rounded-md text-xs font-medium text-slate-300 hover:text-white hover:bg-rose-900/40 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>{t('logout', 'Logout Session')}</span>
            </button>
          </div>
        </aside>

        {/* Content Area */}
        <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
          <header className="h-16 bg-white border-b border-[#D9DEE5] px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30 shadow-2xs">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setMobileMenuOpen(true)}
                className="md:hidden p-2 text-slate-600 hover:text-slate-900 rounded-md hover:bg-slate-100"
              >
                <Menu className="w-5 h-5" />
              </button>
              <span className="text-xs font-bold text-[#123B6D] bg-blue-50 px-2.5 py-1 rounded-md border border-blue-200">
                District Administration Console
              </span>
            </div>

            <div className="flex items-center gap-3">
              <NotificationsPopover />
              <div className="h-5 w-px bg-slate-200" />
              <div className="text-right">
                <span className="text-xs font-bold text-slate-900 block">{user?.full_name}</span>
                <span className="text-[10px] text-[#2E7D32] font-semibold uppercase tracking-wider">
                  Super Administrator
                </span>
              </div>
            </div>
          </header>

          <main id="main-content" className="flex-1 p-4 sm:p-6 lg:p-8 focus:outline-none">
            <Outlet />
          </main>

          <GovFooter />
        </div>
      </div>
    </div>
  );
};
