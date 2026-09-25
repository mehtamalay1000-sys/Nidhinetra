// ProjectWatch: Top Demo Banner & Role Switcher
// Smart India Hackathon 2026

import React, { useState } from 'react';
import { useAuth } from '@/app/providers/AuthProvider';
import { store } from '@/lib/database/store';
import { UserRole } from '@/types';
import { RotateCcw, UserCheck, ShieldCheck, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const DemoHeaderBar: React.FC = () => {
  const { user, switchDemoRole } = useAuth();
  const navigate = useNavigate();
  const [resetSuccess, setResetSuccess] = useState(false);

  const handleRoleChange = (role: UserRole) => {
    switchDemoRole(role);
    if (role === 'citizen') navigate('/citizen/dashboard');
    else if (role === 'reviewer') navigate('/reviewer/dashboard');
    else if (role === 'admin') navigate('/admin/dashboard');
  };

  const handleReset = () => {
    if (confirm('Reset database to original hackathon seed scenario (including Rural Road Improvement)?')) {
      store.resetDatabase();
      setResetSuccess(true);
      setTimeout(() => setResetSuccess(false), 2000);
      navigate(
        user?.role === 'reviewer'
          ? '/reviewer/dashboard'
          : user?.role === 'admin'
          ? '/admin/dashboard'
          : '/citizen/dashboard'
      );
    }
  };

  return (
    <div className="bg-slate-900 text-slate-200 border-b border-slate-800 text-xs py-1.5 px-4 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-blue-950 text-blue-300 font-semibold border border-blue-800 text-[11px]">
            <ShieldCheck className="w-3 h-3 text-blue-400" />
            SIH 2026 PROTOTYPE
          </span>
          <span className="hidden sm:inline text-slate-400">
            Civic Transparency & Explainable Risk Architecture • Not an official GoI portal
          </span>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 bg-slate-800/80 p-0.5 rounded border border-slate-700">
            <span className="text-slate-400 text-[11px] px-1.5 font-medium hidden md:inline">Demo Role:</span>
            <button
              onClick={() => handleRoleChange('citizen')}
              className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
                user?.role === 'citizen'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700'
              }`}
            >
              Citizen
            </button>
            <button
              onClick={() => handleRoleChange('reviewer')}
              className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
                user?.role === 'reviewer'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700'
              }`}
            >
              Reviewer
            </button>
            <button
              onClick={() => handleRoleChange('admin')}
              className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
                user?.role === 'admin'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700'
              }`}
            >
              Admin
            </button>
          </div>

          <button
            onClick={handleReset}
            title="Reset database to seed state"
            className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-white transition-colors bg-slate-800/50 hover:bg-slate-800 px-2 py-0.5 rounded border border-slate-700"
          >
            {resetSuccess ? (
              <>
                <Check className="w-3 h-3 text-emerald-400" />
                <span className="text-emerald-400">Reset Done</span>
              </>
            ) : (
              <>
                <RotateCcw className="w-3 h-3 text-slate-400" />
                <span className="hidden sm:inline">Reset Seed</span>
              </>
            )}
          </button>

          {user && (
            <div className="flex items-center gap-1.5 pl-2 border-l border-slate-700 text-slate-300">
              <UserCheck className="w-3 h-3 text-blue-400" />
              <span className="font-medium truncate max-w-[120px]">{user.full_name.split(' ')[0]}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
