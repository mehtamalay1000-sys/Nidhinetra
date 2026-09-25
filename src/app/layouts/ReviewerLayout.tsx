// Nidhiनेत्र: Government Reviewer Portal Layout (UX4G 3.0 & GIGW Compliance)
// Smart India Hackathon 2026

import React, { useState } from 'react';
import { Outlet, NavLink, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/app/providers/AuthProvider';
import { useGovSettings } from '@/app/providers/GovSettingsProvider';
import { GovUtilityBar } from '@/components/common/GovUtilityBar';
import { GovFooter } from '@/components/common/GovFooter';
import { NidhiNetraLogo } from '@/components/common/NidhiNetraLogo';
import { NotificationsPopover } from '@/components/common/NotificationsPopover';
import { store } from '@/lib/database/store';
import {
  LayoutDashboard,
  Inbox,
  FolderKanban,
  ShieldAlert,
  FileCheck2,
  BarChart3,
  History,
  User,
  LogOut,
  Menu,
  X,
  Search,
} from 'lucide-react';

export const ReviewerLayout: React.FC = () => {
  const { user, logout } = useAuth();
  const { t } = useGovSettings();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [globalQuery, setGlobalQuery] = useState('');

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleGlobalSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (globalQuery.trim()) {
      navigate(`/reviewer/projects?search=${encodeURIComponent(globalQuery.trim())}`);
    }
  };

  const pendingCasesCount = store.getReviewCases('OPEN').length + store.getReviewCases('ASSIGNED').length;

  const navItems = [
    { to: '/reviewer/dashboard', label: t('overview', 'Overview'), icon: LayoutDashboard },
    { to: '/reviewer/queue', label: t('reviewQueue', 'Review Queue'), icon: Inbox, badge: pendingCasesCount },
    { to: '/reviewer/projects', label: t('projects', 'Projects Directory'), icon: FolderKanban },
    { to: '/reviewer/risk-flags', label: t('riskFlags', 'Risk Indicators'), icon: ShieldAlert },
    { to: '/reviewer/reports', label: t('citizenReportsQueue', 'Citizen Reports'), icon: FileCheck2 },
    { to: '/reviewer/analytics', label: t('analytics', 'Utilisation & Trends'), icon: BarChart3 },
    { to: '/reviewer/audit', label: t('auditTrail', 'Audit Trail'), icon: History },
    { to: '/reviewer/profile', label: t('profile', 'Officer Profile'), icon: User },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#F7F8FA] text-[#1F2937]">
      {/* Top Government Utility Bar with Accessibility & Language controls */}
      <GovUtilityBar />

      <div className="flex-1 flex overflow-hidden">
        {/* Reviewer Desktop Sidebar (Government Deep Blue) */}
        <aside
          className={`fixed inset-y-0 left-0 z-40 w-64 bg-[#123B6D] text-slate-200 transform transition-transform duration-200 ease-in-out md:translate-x-0 md:static md:inset-auto md:flex md:flex-col ${
            mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          {/* Sidebar Header */}
          <div className="h-16 flex items-center justify-between px-4 bg-[#0A2540] border-b border-blue-900">
            <Link to="/reviewer/dashboard" className="flex items-center gap-2">
              <NidhiNetraLogo variant="dark" size="sm" showSubtitle={false} />
            </Link>
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="md:hidden text-slate-300 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Officer Identity Card */}
          <div className="p-3.5 mx-3 my-3 bg-[#0B4F9C]/60 border border-blue-600/40 rounded-md">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-white text-[#123B6D] flex items-center justify-center font-bold text-xs shrink-0">
                {user?.full_name ? user.full_name.charAt(0) : 'R'}
              </div>
              <div className="overflow-hidden">
                <p className="text-xs font-bold text-white truncate">{user?.full_name}</p>
                <p className="text-[11px] text-amber-300 font-medium">Review & Verification Officer</p>
                <p className="text-[10px] text-slate-300 truncate">Nashik District PWD</p>
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 px-3 py-2 space-y-1 overflow-y-auto">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={() => setMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center justify-between px-3 py-2 rounded-md text-xs font-medium transition-colors ${
                      isActive
                        ? 'bg-[#E87B18] text-white font-bold shadow-2xs'
                        : 'text-slate-200 hover:bg-[#0B4F9C] hover:text-white'
                    }`
                  }
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="w-4 h-4 shrink-0" />
                    <span>{item.label}</span>
                  </div>
                  {item.badge !== undefined && item.badge > 0 && (
                    <span className="bg-amber-400 text-slate-950 text-[10px] font-bold px-1.5 py-0.2 rounded-full">
                      {item.badge}
                    </span>
                  )}
                </NavLink>
              );
            })}
          </nav>

          {/* Sidebar Footer */}
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

        {/* Content Wrapper */}
        <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
          {/* Top Reviewer Action Bar */}
          <header className="h-16 bg-white border-b border-[#D9DEE5] px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30 shadow-2xs">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setMobileMenuOpen(true)}
                className="md:hidden p-2 text-slate-600 hover:text-slate-900 rounded-md hover:bg-slate-100"
              >
                <Menu className="w-5 h-5" />
              </button>

              <form onSubmit={handleGlobalSearch} className="relative hidden sm:block w-72">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={globalQuery}
                  onChange={(e) => setGlobalQuery(e.target.value)}
                  placeholder="Search project ID, contractor, title..."
                  className="w-full pl-9 pr-3 py-1.5 bg-white border border-[#D9DEE5] rounded-md text-xs text-[#1F2937] placeholder:text-slate-400 focus:outline-hidden focus:border-[#0B4F9C]"
                />
              </form>
            </div>

            <div className="flex items-center gap-3">
              <div className="hidden lg:flex items-center gap-2 text-xs text-[#5F6B7A] border-r border-slate-200 pr-3">
                <span className="w-2 h-2 rounded-full bg-emerald-600" />
                <span>Explainable Risk Engine v2.4 Active</span>
              </div>

              <NotificationsPopover />

              <div className="h-5 w-px bg-slate-200 hidden sm:block" />

              <Link
                to="/reviewer/queue"
                className="flex items-center gap-1.5 bg-amber-50 text-amber-900 border border-amber-300 text-xs font-semibold px-2.5 py-1.5 rounded-md hover:bg-amber-100 transition-colors"
              >
                <Inbox className="w-3.5 h-3.5 text-amber-700" />
                <span>Priority Queue:</span>
                <span className="font-bold">{pendingCasesCount}</span>
              </Link>
            </div>
          </header>

          {/* Page Outlet */}
          <main id="main-content" className="flex-1 p-4 sm:p-6 lg:p-8 focus:outline-none">
            <Outlet />
          </main>

          {/* Government Service Footer */}
          <GovFooter />
        </div>
      </div>
    </div>
  );
};
