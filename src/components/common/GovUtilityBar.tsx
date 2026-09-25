// Nidhiनेत्र: Official Government Utility Bar (GIGW 3.0 & UX4G Compliance)
// Features: Accessible Font Sizing, High Contrast Toggle, Marathi/English Toggle, Skip-to-Content, Demo Evaluator Bar

import React from 'react';
import { useGovSettings } from '@/app/providers/GovSettingsProvider';
import { useAuth } from '@/app/providers/AuthProvider';
import { useNavigate } from 'react-router-dom';
import { store } from '@/lib/database/store';
import { Eye, RotateCcw, UserCheck, Shield, Award } from 'lucide-react';

export const GovUtilityBar: React.FC = () => {
  const {
    language,
    setLanguage,
    t,
    fontSize,
    setFontSize,
    highContrast,
    toggleHighContrast,
  } = useGovSettings();

  const { user, switchDemoRole } = useAuth();
  const navigate = useNavigate();

  const handleRoleSwitch = (role: 'citizen' | 'reviewer' | 'admin') => {
    switchDemoRole(role);
    if (role === 'reviewer') {
      navigate('/reviewer/dashboard');
    } else if (role === 'admin') {
      navigate('/admin/dashboard');
    } else {
      navigate('/citizen/dashboard');
    }
  };

  const handleResetData = () => {
    if (window.confirm('Reset all demo data back to official initial state?')) {
      store.resetDatabase();
      window.location.reload();
    }
  };

  return (
    <div className="bg-[#123B6D] text-slate-200 text-xs border-b border-[#0B4F9C] z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-1.5 flex flex-wrap items-center justify-between gap-2">
        {/* Left: Tricolor strip & Service Notice */}
        <div className="flex items-center gap-2">
          {/* Subtle Indian Tricolor flag badge */}
          <div className="flex flex-col w-3 h-3 overflow-hidden rounded-xs border border-white/20">
            <div className="bg-[#E87B18] h-1 w-full" />
            <div className="bg-[#FFFFFF] h-1 w-full" />
            <div className="bg-[#2E7D32] h-1 w-full" />
          </div>
          <span className="font-medium text-slate-100 text-[11px] tracking-wide">
            {t('govPortalNotice', 'Government Services Style Interface | Demo e-Governance Portal')}
          </span>
          <span className="hidden md:inline-block text-slate-400">|</span>
          <span className="hidden md:inline-block text-[11px] text-amber-300 font-semibold">
            {t('sihNotice', 'Smart India Hackathon 2026')}
          </span>
        </div>

        {/* Right: Accessibility, Contrast, Language, and Evaluator Switcher */}
        <div className="flex items-center gap-3 ml-auto">
          {/* Skip link */}
          <a
            href="#main-content"
            className="hidden sm:inline-block text-slate-300 hover:text-white underline text-[11px] mr-1"
          >
            {t('skipToContent', 'Skip to content')}
          </a>

          <div className="h-3 w-px bg-blue-800 hidden sm:block" />

          {/* Font Sizing Controls */}
          <div className="flex items-center gap-1 bg-[#0B4F9C]/50 px-1.5 py-0.5 rounded border border-blue-700/50">
            <span className="text-[10px] text-slate-300 mr-1 hidden sm:inline">{t('textSize', 'Font')}:</span>
            <button
              onClick={() => setFontSize('sm')}
              className={`px-1 py-0.2 rounded text-[11px] font-bold ${
                fontSize === 'sm' ? 'bg-white text-blue-950' : 'text-slate-200 hover:text-white'
              }`}
              title="Small font size"
            >
              A-
            </button>
            <button
              onClick={() => setFontSize('md')}
              className={`px-1 py-0.2 rounded text-[11px] font-bold ${
                fontSize === 'md' ? 'bg-white text-blue-950' : 'text-slate-200 hover:text-white'
              }`}
              title="Default font size"
            >
              A
            </button>
            <button
              onClick={() => setFontSize('lg')}
              className={`px-1 py-0.2 rounded text-[11px] font-bold ${
                fontSize === 'lg' ? 'bg-white text-blue-950' : 'text-slate-200 hover:text-white'
              }`}
              title="Large font size"
            >
              A+
            </button>
          </div>

          {/* High Contrast Toggle */}
          <button
            onClick={toggleHighContrast}
            className={`flex items-center gap-1 px-2 py-0.5 rounded border text-[11px] font-medium transition-colors ${
              highContrast
                ? 'bg-amber-400 text-slate-950 border-amber-300 font-bold'
                : 'bg-[#0B4F9C]/50 text-slate-200 hover:text-white border-blue-700/50'
            }`}
            title="Toggle High Contrast Display"
          >
            <Eye className="w-3 h-3" />
            <span className="hidden sm:inline">
              {highContrast ? t('normalContrast', 'Normal') : t('highContrast', 'High Contrast')}
            </span>
          </button>

          {/* Language Switcher: English | मराठी */}
          <div className="flex items-center gap-1 bg-[#0B4F9C]/50 px-1.5 py-0.5 rounded border border-blue-700/50">
            <button
              onClick={() => setLanguage('en')}
              className={`px-1.5 py-0.2 rounded text-[11px] font-medium ${
                language === 'en' ? 'bg-white text-blue-950 font-bold' : 'text-slate-200 hover:text-white'
              }`}
            >
              English
            </button>
            <span className="text-slate-400 text-[10px]">|</span>
            <button
              onClick={() => setLanguage('mr')}
              className={`px-1.5 py-0.2 rounded text-[11px] font-medium ${
                language === 'mr' ? 'bg-white text-blue-950 font-bold' : 'text-slate-200 hover:text-white'
              }`}
            >
              मराठी
            </button>
          </div>

          <div className="h-3 w-px bg-blue-800 hidden lg:block" />

          {/* Evaluator Quick Role Switcher (Compact, clean government style) */}
          <div className="hidden lg:flex items-center gap-1 text-[11px]">
            <span className="text-amber-300 font-semibold mr-1 flex items-center gap-0.5">
              <Award className="w-3 h-3" />
              Demo:
            </span>
            <button
              onClick={() => handleRoleSwitch('citizen')}
              className={`px-1.5 py-0.5 rounded transition-colors ${
                user?.role === 'citizen'
                  ? 'bg-amber-500 text-slate-950 font-bold'
                  : 'bg-blue-900/80 hover:bg-blue-800 text-slate-200'
              }`}
            >
              Citizen
            </button>
            <button
              onClick={() => handleRoleSwitch('reviewer')}
              className={`px-1.5 py-0.5 rounded transition-colors ${
                user?.role === 'reviewer'
                  ? 'bg-amber-500 text-slate-950 font-bold'
                  : 'bg-blue-900/80 hover:bg-blue-800 text-slate-200'
              }`}
            >
              Reviewer
            </button>
            <button
              onClick={() => handleRoleSwitch('admin')}
              className={`px-1.5 py-0.5 rounded transition-colors ${
                user?.role === 'admin'
                  ? 'bg-amber-500 text-slate-950 font-bold'
                  : 'bg-blue-900/80 hover:bg-blue-800 text-slate-200'
              }`}
            >
              Admin
            </button>
            <button
              onClick={handleResetData}
              className="p-1 hover:text-amber-300 text-slate-300 transition-colors ml-1"
              title="Reset Demo Data"
            >
              <RotateCcw className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
