// Nidhiनेत्र: District Analytics & Fund Utilisation Page (UX4G 3.0 Standards)
// Smart India Hackathon 2026

import React, { useState, useEffect } from 'react';
import { store } from '@/lib/database/store';
import { Project } from '@/types';
import { formatCurrencyLakhs } from '@/lib/utils/formatters';
import { AnalyticsCharts } from '@/components/charts/AnalyticsCharts';
import { useGovSettings } from '@/app/providers/GovSettingsProvider';
import { Link } from 'react-router-dom';
import { BarChart3, Download } from 'lucide-react';

export const ReviewerAnalyticsPage: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const { t } = useGovSettings();

  useEffect(() => {
    const { projects: projs } = store.getProjects({ limit: 100 });
    setProjects(projs);
  }, []);

  const totalSanctioned = projects.reduce((acc, p) => acc + (p.financials?.sanctioned_amount || 0), 0);
  const totalExpended = projects.reduce((acc, p) => acc + (p.financials?.expenditure_amount || 0), 0);
  const totalRemaining = totalSanctioned - totalExpended;
  const avgUtilisation = totalSanctioned > 0 ? (totalExpended / totalSanctioned) * 100 : 0;

  const exportAnalyticsCSV = () => {
    const headers = ['Project Code', 'Title', 'Sector', 'Sanctioned', 'Expended', 'Remaining', 'Utilisation %', 'Status', 'Risk Score'];
    const rows = projects.map((p) => [
      p.project_code,
      `"${p.title.replace(/"/g, '""')}"`,
      p.category?.name || 'General',
      p.financials?.sanctioned_amount || 0,
      p.financials?.expenditure_amount || 0,
      p.financials?.remaining_amount || 0,
      p.financials?.utilisation_percentage || 0,
      p.status,
      p.risk_flag?.overall_score || 0,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `nidhinetra_district_analytics_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white border border-[#D9DEE5] rounded-md p-5 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-[#5F6B7A] mb-1">
            <Link to="/reviewer/dashboard" className="hover:text-[#0B4F9C] hover:underline">
              {t('home', 'Home')}
            </Link>
            <span>/</span>
            <span className="text-[#1F2937] font-semibold">{t('analytics', 'Analytics & Utilisation')}</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#123B6D] tracking-tight">
            Fund Utilisation & Implementation Trends
          </h1>
          <p className="text-xs sm:text-sm text-[#5F6B7A] mt-0.5">
            District capital outlays, disbursement velocity, and risk distribution across sectors.
          </p>
        </div>

        <button
          onClick={exportAnalyticsCSV}
          className="inline-flex items-center gap-1.5 bg-white hover:bg-slate-50 text-[#123B6D] border border-[#D9DEE5] font-semibold px-3.5 py-2 rounded-md text-xs transition-colors shrink-0"
        >
          <Download className="w-4 h-4 text-slate-500" />
          <span>{t('downloadCsv', 'Export Summary CSV')}</span>
        </button>
      </div>

      {/* Aggregate Financial Metrics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-[#D9DEE5] rounded-md p-4 shadow-2xs">
          <span className="text-[11px] uppercase font-bold text-[#5F6B7A] tracking-wider block">
            {t('sanctionedAmountFull', 'Total Sanctioned')}
          </span>
          <div className="text-2xl font-bold text-slate-900 mt-1">
            {formatCurrencyLakhs(totalSanctioned)}
          </div>
          <p className="text-[11px] text-[#5F6B7A] mt-0.5">Approved fiscal allocation</p>
        </div>

        <div className="bg-white border border-[#D9DEE5] rounded-md p-4 shadow-2xs">
          <span className="text-[11px] uppercase font-bold text-[#5F6B7A] tracking-wider block">
            {t('expenditureAmountFull', 'Total Disbursed')}
          </span>
          <div className="text-2xl font-bold text-slate-900 mt-1">
            {formatCurrencyLakhs(totalExpended)}
          </div>
          <p className="text-[11px] text-[#5F6B7A] mt-0.5">Disbursed to agencies & vendors</p>
        </div>

        <div className="bg-white border border-[#D9DEE5] rounded-md p-4 shadow-2xs">
          <span className="text-[11px] uppercase font-bold text-[#5F6B7A] tracking-wider block">
            {t('remainingAmountFull', 'Total Remaining')}
          </span>
          <div className="text-2xl font-bold text-slate-900 mt-1">
            {formatCurrencyLakhs(totalRemaining)}
          </div>
          <p className="text-[11px] text-[#5F6B7A] mt-0.5">Unutilized district allocation</p>
        </div>

        <div className="bg-white border border-[#D9DEE5] rounded-md p-4 shadow-2xs">
          <span className="text-[11px] uppercase font-bold text-[#5F6B7A] tracking-wider block">
            {t('utilisationPercentage', 'Average Utilisation')}
          </span>
          <div className="text-2xl font-bold text-[#0B4F9C] mt-1">
            {avgUtilisation.toFixed(1)}%
          </div>
          <div className="w-full bg-slate-200 h-1.5 rounded-full mt-2 overflow-hidden">
            <div
              className="bg-[#0B4F9C] h-full rounded-full"
              style={{ width: `${Math.min(100, avgUtilisation)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Analytics Charts Component */}
      <AnalyticsCharts projects={projects} />
    </div>
  );
};
