// Nidhiनेत्र: Civic Brand Logo & Emblem
// Motif: Public Record / Document + Watchful Eye ("Seeing where public funds go")

import React from 'react';
import { useGovSettings } from '@/app/providers/GovSettingsProvider';

interface NidhiNetraLogoProps {
  className?: string;
  variant?: 'light' | 'dark';
  showSubtitle?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const NidhiNetraLogo: React.FC<NidhiNetraLogoProps> = ({
  className = '',
  variant = 'light',
  showSubtitle = true,
  size = 'md',
}) => {
  const { t } = useGovSettings();

  const iconSizes = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-11 h-11',
  };

  const titleSizes = {
    sm: 'text-base',
    md: 'text-lg',
    lg: 'text-2xl',
  };

  const isDark = variant === 'dark';

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      {/* Civic Emblem: Clean Document + Vigilant Eye Motif */}
      <div
        className={`${iconSizes[size]} rounded-md flex items-center justify-center shrink-0 shadow-xs border ${
          isDark
            ? 'bg-blue-950 border-blue-800 text-white'
            : 'bg-[#0B4F9C] border-[#0B4F9C] text-white'
        }`}
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-5 h-5 text-amber-400"
        >
          {/* Document / Foundation Outline */}
          <path d="M4 4v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6H6a2 2 0 0 0-2 2z" stroke="#FFFFFF" strokeWidth="1.5" />
          <path d="M14 2v6h6" stroke="#FFFFFF" strokeWidth="1.5" />
          {/* Watchful Eye in Center */}
          <path d="M7 14s2-3.5 5-3.5 5 3.5 5 3.5-2 3.5-5 3.5-5-3.5-5-3.5z" stroke="#F59E0B" strokeWidth="1.75" />
          <circle cx="12" cy="14" r="1.5" fill="#F59E0B" stroke="#F59E0B" />
        </svg>
      </div>

      <div className="flex flex-col">
        <div className="flex items-center gap-2">
          <span
            className={`font-extrabold tracking-tight ${titleSizes[size]} ${
              isDark ? 'text-white' : 'text-[#123B6D]'
            }`}
          >
            Nidhiनेत्र
          </span>
        </div>
        {showSubtitle && (
          <span
            className={`text-[11px] font-medium leading-tight ${
              isDark ? 'text-slate-300' : 'text-[#5F6B7A]'
            }`}
          >
            {t('appSubtitle', 'Public Project Monitoring & Ground Verification')}
          </span>
        )}
      </div>
    </div>
  );
};
