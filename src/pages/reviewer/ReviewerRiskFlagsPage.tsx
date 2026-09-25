// Nidhiनेत्र: Explainable Risk Intelligence & Anomaly Dashboard (UX4G 3.0 Standards)
// Smart India Hackathon 2026

import React, { useState, useEffect } from 'react';
import { store } from '@/lib/database/store';
import { Project } from '@/types';
import { useGovSettings } from '@/app/providers/GovSettingsProvider';
import { getRiskPriorityBadge, formatCurrencyLakhs } from '@/lib/utils/formatters';
import { Link } from 'react-router-dom';
import {
  ShieldAlert,
  Search,
  Info,
  ChevronRight,
  Clock,
  CircleDollarSign,
  Users,
} from 'lucide-react';

export const ReviewerRiskFlagsPage: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [priorityFilter, setPriorityFilter] = useState<string>('ALL');
  const [search, setSearch] = useState('');
  const { t } = useGovSettings();

  const loadProjects = () => {
    const { projects: projs } = store.getProjects({ limit: 100, sort_by: 'risk_desc' });
    setProjects(projs);
  };

  useEffect(() => {
    loadProjects();
    const unsub = store.subscribe(() => loadProjects());
    return () => unsub();
  }, []);

  const flaggedProjects = projects.filter((p) => {
    const flag = p.risk_flag;
    if (!flag) return false;
    const matchesPriority = priorityFilter === 'ALL' || flag.priority_level === priorityFilter;
    const q = search.toLowerCase();
    const matchesSearch =
      !search ||
      p.title.toLowerCase().includes(q) ||
      p.project_code.toLowerCase().includes(q) ||
      p.district.toLowerCase().includes(q);
    return matchesPriority && matchesSearch;
  });

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
            <span className="text-[#1F2937] font-semibold">{t('riskFlags', 'Risk Indicators')}</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#123B6D] tracking-tight">
            Explainable Risk Indicators & Anomalies
          </h1>
          <p className="text-xs sm:text-sm text-[#5F6B7A] mt-0.5">
            Statistical signals computed from timeline deviations, expenditure drawdown velocity, and citizen observations.
          </p>
        </div>
      </div>

      {/* Info Notice */}
      <div className="p-3.5 bg-blue-50 border border-blue-200 rounded-md text-xs text-blue-900 flex items-start gap-2.5">
        <Info className="w-4 h-4 text-[#0B4F9C] shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong>Explainability Principle:</strong> The AI engine computes quantitative deviation indicators to help review officers triage attention. It does not conclude wrongdoing; human verification officers verify facts through ground site inspection.
        </p>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="bg-white border border-[#D9DEE5] rounded-md p-4 shadow-2xs space-y-3">
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by project name, ID, or district..."
              className="w-full pl-9 pr-3 py-2 bg-white border border-[#D9DEE5] rounded-md text-xs text-[#1F2937] focus:border-[#0B4F9C] focus:outline-hidden"
            />
          </div>

          <div className="flex flex-wrap items-center gap-1 bg-[#F7F8FA] p-1 rounded-md border border-[#D9DEE5] w-full sm:w-auto">
            {['ALL', 'CRITICAL', 'HIGH', 'MEDIUM', 'LOW'].map((lvl) => (
              <button
                key={lvl}
                onClick={() => setPriorityFilter(lvl)}
                className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                  priorityFilter === lvl
                    ? 'bg-[#0B4F9C] text-white font-bold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
                }`}
              >
                {lvl}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Flagged Projects List */}
      <div className="space-y-4">
        {flaggedProjects.length === 0 ? (
          <div className="bg-white border border-[#D9DEE5] rounded-md p-12 text-center text-[#5F6B7A] text-xs">
            No projects match the selected risk priority level.
          </div>
        ) : (
          flaggedProjects.map((p) => {
            const flag = p.risk_flag!;
            const badge = getRiskPriorityBadge(flag.priority_level);

            return (
              <div
                key={p.id}
                className="bg-white border border-[#D9DEE5] rounded-md p-5 shadow-2xs space-y-3 hover:border-slate-400 transition-colors"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-mono text-xs font-bold text-slate-700 bg-[#F7F8FA] border border-[#D9DEE5] px-2 py-0.5 rounded">
                        {p.project_code}
                      </span>
                      <span className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase ${badge.className}`}>
                        {flag.priority_level}
                      </span>
                      <span className="text-xs text-[#5F6B7A]">{p.category?.name}</span>
                    </div>

                    <h3 className="font-bold text-[#123B6D] text-sm">
                      <Link to={`/reviewer/projects/${p.id}`} className="hover:underline">
                        {p.title}
                      </Link>
                    </h3>
                  </div>

                  <div className="flex items-center gap-4 shrink-0">
                    <div className="text-right">
                      <span className="text-[10px] font-bold text-[#5F6B7A] uppercase block">Risk Score</span>
                      <span className="text-xl font-bold text-slate-900">
                        {flag.overall_score} <span className="text-xs font-normal text-slate-400">/ 100</span>
                      </span>
                    </div>

                    <Link
                      to={`/reviewer/projects/${p.id}`}
                      className="inline-flex items-center gap-1 bg-[#0B4F9C] hover:bg-[#123B6D] text-white font-semibold px-3 py-1.5 rounded-md text-xs transition-colors shadow-2xs"
                    >
                      <span>Investigate</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                  {flag.factors?.map((f, i) => (
                    <div key={i} className="p-2.5 rounded-md bg-[#F7F8FA] border border-[#D9DEE5]">
                      <span className="font-bold text-slate-800 block text-xs">{f.factor_name}</span>
                      <span className="text-[#5F6B7A] text-[11px] block mt-0.5">{f.explanation}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
