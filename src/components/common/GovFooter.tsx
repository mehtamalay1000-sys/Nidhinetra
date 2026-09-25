// Nidhiनेत्र: Standard Government Service Footer (GIGW 3.0 & UX4G Guidelines)
// Smart India Hackathon 2026

import React from 'react';
import { Link } from 'react-router-dom';
import { NidhiNetraLogo } from './NidhiNetraLogo';
import { useGovSettings } from '@/app/providers/GovSettingsProvider';
import { ShieldCheck, ExternalLink, HelpCircle, FileText, MapPin, Eye } from 'lucide-react';

export const GovFooter: React.FC = () => {
  const { t, toggleHighContrast } = useGovSettings();

  return (
    <footer className="bg-white border-t border-[#D9DEE5] text-[#1F2937] text-sm mt-auto">
      {/* Top Footer Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Column 1: Brand & Purpose */}
          <div className="md:col-span-2 space-y-3">
            <NidhiNetraLogo size="md" />
            <p className="text-xs text-[#5F6B7A] leading-relaxed max-w-md">
              {t(
                'welcomeSubtitle',
                'An AI-powered public project monitoring and accountability platform connecting official project intelligence, explainable risk indicators, citizen ground verification, and human government review in one traceable workflow.'
              )}
            </p>
            <div className="flex items-center gap-2 pt-2">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[11px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
                UX4G 3.0 & GIGW Compliant Design
              </span>
              <span className="text-[11px] text-[#5F6B7A]">Nashik Pilot District</span>
            </div>
          </div>

          {/* Column 2: Quick Navigation */}
          <div>
            <h4 className="text-xs font-bold text-[#123B6D] uppercase tracking-wider mb-3">
              {t('projects', 'Projects & Monitoring')}
            </h4>
            <ul className="space-y-2 text-xs text-[#5F6B7A]">
              <li>
                <Link to="/citizen/projects" className="hover:text-[#0B4F9C] hover:underline transition-colors">
                  {t('projects', 'Browse Development Projects')}
                </Link>
              </li>
              <li>
                <Link to="/citizen/map" className="hover:text-[#0B4F9C] hover:underline transition-colors">
                  {t('projectMap', 'Geospatial Project Map')}
                </Link>
              </li>
              <li>
                <Link to="/citizen/reports" className="hover:text-[#0B4F9C] hover:underline transition-colors">
                  {t('myReports', 'Citizen Ground Reports')}
                </Link>
              </li>
              <li>
                <Link to="/citizen/report-issue" className="hover:text-[#0B4F9C] hover:underline transition-colors">
                  {t('reportIssue', 'Report an Issue')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Accessibility & Governance */}
          <div>
            <h4 className="text-xs font-bold text-[#123B6D] uppercase tracking-wider mb-3">
              {t('accessibility', 'Accessibility & Help')}
            </h4>
            <ul className="space-y-2 text-xs text-[#5F6B7A]">
              <li>
                <button
                  onClick={toggleHighContrast}
                  className="hover:text-[#0B4F9C] hover:underline transition-colors flex items-center gap-1 text-left"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>{t('highContrast', 'High Contrast Display')}</span>
                </button>
              </li>
              <li>
                <a href="#main-content" className="hover:text-[#0B4F9C] hover:underline transition-colors">
                  {t('skipToContent', 'Skip to Main Content')}
                </a>
              </li>
              <li>
                <span className="text-slate-500">Citizen Helpline: 1800-XXX-XXXX</span>
              </li>
              <li>
                <span className="text-[11px] text-slate-400">Standard: GIGW 3.0 / WCAG 2.1 AA</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Sub-footer / Disclaimer Bar */}
      <div className="bg-[#F7F8FA] border-t border-[#D9DEE5] py-4 text-xs text-[#5F6B7A]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <div>
            <p className="font-semibold text-slate-800">
              Nidhiनेत्र — Smart India Hackathon 2026 Prototype
            </p>
            <p className="text-[11px] text-slate-500 mt-0.5">
              {t(
                'officialDisclaimer',
                'Demo platform developed for Smart India Hackathon 2026. Not an official Government of India website.'
              )}
            </p>
          </div>

          <div className="flex items-center gap-4 text-[11px] text-slate-600">
            <span>Security & Privacy Safeguards</span>
            <span>•</span>
            <span>Nashik Collectorate Pilot</span>
            <span>•</span>
            <span className="font-semibold text-[#0B4F9C]">v1.0 (Hackathon MVP)</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
