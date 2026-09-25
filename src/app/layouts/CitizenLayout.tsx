// Nidhiनेत्र: Citizen Portal Layout (UX4G 3.0 & GIGW 3.0 Compliance)
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
  Home,
  FolderKanban,
  Map as MapIcon,
  FileText,
  User,
  PlusCircle,
  LogOut,
  MapPin,
  Menu,
  X,
  Bell,
  HelpCircle,
} from 'lucide-react';

export const CitizenLayout: React.FC = () => {
  const { user, logout } = useAuth();
  const { t, selectedConstituency, setSelectedConstituency } = useGovSettings();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [locationModalOpen, setLocationModalOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { to: '/citizen/dashboard', label: t('home', 'Home'), icon: Home },
    { to: '/citizen/projects', label: t('projects', 'Projects'), icon: FolderKanban },
    { to: '/citizen/map', label: t('projectMap', 'Project Map'), icon: MapIcon },
    { to: '/citizen/reports', label: t('myReports', 'My Reports'), icon: FileText },
  ];

  const constituencyOptions = [
    'Nashik Central',
    'Nashik West',
    'Nashik East',
    'Dindori',
    'Niphad',
    'Sinnar',
    'Malegaon',
    'Trimbakeshwar',
    'All Nashik District',
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#F7F8FA] text-[#1F2937]">
      {/* Top Government Utility Bar with Accessibility & Language controls */}
      <GovUtilityBar />

      {/* Brand Header (UX4G 3.0 Standard) */}
      <header className="bg-white border-b border-[#D9DEE5] sticky top-0 z-40 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-18 sm:h-20">
            {/* Left: Emblem & Title */}
            <div className="flex items-center gap-4">
              <Link to="/citizen/dashboard" className="flex items-center group">
                <NidhiNetraLogo size="md" />
              </Link>

              <div className="h-8 w-px bg-slate-200 hidden sm:block" />

              {/* Role Indicator Badge (Subtle Government Service Label) */}
              <div className="hidden sm:flex flex-col">
                <span className="text-[11px] font-bold text-[#0B4F9C] uppercase tracking-wider bg-blue-50 px-2 py-0.5 rounded border border-blue-200 w-fit">
                  {t('citizenPortal', 'Citizen Portal')}
                </span>
                {/* Location Quick Switcher */}
                <button
                  onClick={() => setLocationModalOpen(true)}
                  className="flex items-center gap-1 text-[11px] text-slate-600 hover:text-[#0B4F9C] mt-0.5 text-left group"
                  title="Click to change location filter"
                >
                  <MapPin className="w-3 h-3 text-[#E87B18]" />
                  <span className="font-semibold underline decoration-dotted">
                    {selectedConstituency}, Nashik
                  </span>
                </button>
              </div>
            </div>

            {/* Desktop Navigation & Actions */}
            <div className="hidden md:flex items-center gap-6">
              {/* Primary Navigation Links */}
              <nav className="flex items-center gap-1">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <NavLink
                      key={item.to}
                      to={item.to}
                      className={({ isActive }) =>
                        `flex items-center gap-1.5 px-3.5 py-2 rounded-md text-sm font-medium transition-colors ${
                          isActive
                            ? 'bg-[#EBF3FA] text-[#0B4F9C] font-bold border-b-2 border-[#0B4F9C]'
                            : 'text-slate-700 hover:text-[#0B4F9C] hover:bg-slate-100'
                        }`
                      }
                    >
                      <Icon className="w-4 h-4 text-slate-500" />
                      <span>{item.label}</span>
                    </NavLink>
                  );
                })}
              </nav>

              <div className="h-6 w-px bg-slate-200" />

              {/* Primary CTA: Report an Issue */}
              <Link
                to="/citizen/report-issue"
                className="inline-flex items-center gap-1.5 bg-[#0B4F9C] hover:bg-[#123B6D] text-white text-xs sm:text-sm font-semibold px-4 py-2 rounded-md shadow-2xs transition-colors"
              >
                <PlusCircle className="w-4 h-4 text-amber-300" />
                <span>{t('reportIssue', 'Report an Issue')}</span>
              </Link>

              {/* Notifications */}
              <NotificationsPopover />

              {/* Citizen User Profile Dropdown */}
              <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
                <Link
                  to="/citizen/profile"
                  className="flex items-center gap-2 p-1 rounded-md hover:bg-slate-100 transition-colors"
                  title={user?.full_name}
                >
                  <div className="w-8 h-8 rounded-full bg-[#123B6D] text-white flex items-center justify-center font-bold text-xs border border-slate-300">
                    {user?.full_name ? user.full_name.charAt(0) : 'C'}
                  </div>
                  <div className="text-left hidden lg:block">
                    <p className="text-xs font-bold text-slate-800 leading-tight">
                      {user?.full_name || 'Citizen'}
                    </p>
                    <p className="text-[10px] text-slate-500">{selectedConstituency}</p>
                  </div>
                </Link>

                <button
                  onClick={handleLogout}
                  className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors"
                  title={t('logout', 'Logout')}
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Mobile Hamburger Button */}
            <div className="flex items-center gap-2 md:hidden">
              <Link
                to="/citizen/report-issue"
                className="inline-flex items-center gap-1 bg-[#0B4F9C] text-white text-xs font-semibold px-2.5 py-1.5 rounded-md"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>Report</span>
              </Link>
              <NotificationsPopover />
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-md text-slate-700 hover:bg-slate-100"
                aria-label="Toggle Navigation Menu"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-4 space-y-2">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <span className="text-xs font-bold text-slate-600 uppercase">
                {t('citizenPortal', 'Citizen Portal')}
              </span>
              <button
                onClick={() => setLocationModalOpen(true)}
                className="text-xs font-semibold text-[#0B4F9C] flex items-center gap-1"
              >
                <MapPin className="w-3 h-3 text-[#E87B18]" />
                <span>{selectedConstituency}</span>
              </button>
            </div>
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={() => setMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-2.5 px-3 py-2 rounded-md text-sm font-medium ${
                      isActive ? 'bg-[#EBF3FA] text-[#0B4F9C] font-bold' : 'text-slate-700'
                    }`
                  }
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
              <Link
                to="/citizen/profile"
                onClick={() => setMobileMenuOpen(false)}
                className="text-xs font-semibold text-slate-700 flex items-center gap-2"
              >
                <User className="w-4 h-4" />
                <span>{user?.full_name || 'My Profile'}</span>
              </Link>
              <button
                onClick={handleLogout}
                className="text-xs font-semibold text-rose-600 flex items-center gap-1"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>{t('logout', 'Logout')}</span>
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Location Selector Modal */}
      {locationModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full border border-slate-300 p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-[#E87B18]" />
                <h3 className="font-bold text-[#123B6D] text-base">Select District Constituency</h3>
              </div>
              <button
                onClick={() => setLocationModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-xs text-[#5F6B7A]">
              Filter public development projects, citizen ground observations, and expenditure summaries for your area:
            </p>
            <div className="grid grid-cols-2 gap-2">
              {constituencyOptions.map((c) => (
                <button
                  key={c}
                  onClick={() => {
                    setSelectedConstituency(c);
                    setLocationModalOpen(false);
                  }}
                  className={`text-left px-3 py-2 rounded-md text-xs font-medium border transition-colors ${
                    selectedConstituency === c
                      ? 'bg-blue-50 border-[#0B4F9C] text-[#0B4F9C] font-bold'
                      : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
            <div className="flex justify-end pt-2 border-t border-slate-100">
              <button
                onClick={() => setLocationModalOpen(false)}
                className="px-4 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-md"
              >
                {t('close', 'Close')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Page Content */}
      <main id="main-content" className="flex-1 pb-20 md:pb-12 focus:outline-none">
        <Outlet />
      </main>

      {/* Standard Government Footer */}
      <GovFooter />

      {/* Mobile Bottom Navigation Bar (UX4G Responsive Citizen Pattern) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 z-40 py-2 px-2 flex justify-around items-center shadow-lg">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex flex-col items-center gap-0.5 px-2 py-0.5 rounded-md text-[10px] font-medium transition-colors ${
                  isActive ? 'text-[#0B4F9C] font-bold' : 'text-slate-500 hover:text-slate-800'
                }`
              }
            >
              <Icon className="w-5 h-5" />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
        <NavLink
          to="/citizen/profile"
          className={({ isActive }) =>
            `flex flex-col items-center gap-0.5 px-2 py-0.5 rounded-md text-[10px] font-medium transition-colors ${
              isActive ? 'text-[#0B4F9C] font-bold' : 'text-slate-500 hover:text-slate-800'
            }`
          }
        >
          <User className="w-5 h-5" />
          <span>{t('profile', 'Profile')}</span>
        </NavLink>
      </nav>
    </div>
  );
};
