// Nidhiनेत्र: Government Reviewer Dashboard (UX4G 3.0 & GIGW 3.0 Standards)
// Smart India Hackathon 2026

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/app/providers/AuthProvider';
import { useGovSettings } from '@/app/providers/GovSettingsProvider';
import { store } from '@/lib/database/store';
import { Project, ReviewCase, CitizenReport } from '@/types';
import {
  getRiskPriorityBadge,
  formatDate,
} from '@/lib/utils/formatters';
import { Link } from 'react-router-dom';
import {
  Inbox,
  ShieldAlert,
  FileCheck2,
  ArrowRight,
  History,
  ShieldCheck,
  ChevronRight,
} from 'lucide-react';

export const ReviewerDashboard: React.FC = () => {
  const { user } = useAuth();
  const { t } = useGovSettings();
  const [projects, setProjects] = useState<Project[]>([]);
  const [cases, setCases] = useState<ReviewCase[]>([]);
  const [reports, setReports] = useState<CitizenReport[]>([]);

  const loadData = () => {
    const { projects: projs } = store.getProjects({ limit: 100 });
    setProjects(projs);
    setCases(store.getReviewCases());
    setReports(store.getCitizenReports());
  };

  useEffect(() => {
    loadData();
    const unsub = store.subscribe(() => loadData());
    return () => unsub();
  }, []);

  const totalProjects = projects.length;
  const inProgress = projects.filter((p) => p.status === 'IN_PROGRESS').length;
  const delayed = projects.filter((p) => p.status === 'DELAYED').length;
  const underReview = projects.filter((p) => p.status === 'UNDER_REVIEW').length;
  const activeRiskFlags = projects.filter(
    (p) => p.risk_flag && p.risk_flag.status === 'ACTIVE' && p.risk_flag.overall_score >= 60
  ).length;
  const pendingReports = reports.filter((r) => r.status === 'SUBMITTED' || r.status === 'VERIFICATION_REQUIRED').length;
  const openCases = cases.filter((c) => c.status !== 'RESOLVED' && c.status !== 'DISMISSED').length;

  return (
    <div className="space-y-6">
      {/* Officer Welcome & Authority Console Header */}
      <div className="bg-white border border-[#D9DEE5] rounded-md p-6 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-xs font-bold bg-blue-50 text-[#0B4F9C] border border-blue-200 mb-2">
            <ShieldCheck className="w-3.5 h-3.5 text-[#0B4F9C]" />
            Nidhiनेत्र • District Verification & Human Review Cell
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#123B6D] tracking-tight">
            Review Officer Console — {user?.full_name}
          </h1>
          <p className="text-xs sm:text-sm text-[#5F6B7A] mt-1 max-w-2xl">
            Examine explainable statistical risk indicators, verify citizen photo evidence, assign field inspections, and record accountable government actions.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <Link
            to="/reviewer/queue"
            className="inline-flex items-center gap-1.5 bg-[#0B4F9C] hover:bg-[#123B6D] text-white font-semibold text-xs px-3.5 py-2 rounded-md shadow-2xs transition-colors"
          >
            <Inbox className="w-4 h-4 text-amber-300" />
            <span>Process Review Queue ({openCases})</span>
          </Link>
          <Link
            to="/reviewer/audit"
            className="inline-flex items-center gap-1.5 bg-white hover:bg-slate-50 text-[#123B6D] font-semibold text-xs px-3 py-2 rounded-md border border-[#D9DEE5] transition-colors"
          >
            <History className="w-4 h-4 text-slate-500" />
            <span>Audit Trail</span>
          </Link>
        </div>
      </div>

      {/* 6 Top Stat Metric Blocks (Government Strip) */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="bg-white border border-[#D9DEE5] rounded-md p-3.5 shadow-2xs">
          <span className="text-[10px] font-bold text-[#5F6B7A] uppercase tracking-wider block">Total Projects</span>
          <span className="text-2xl font-bold text-slate-900 mt-1 block">{totalProjects}</span>
          <span className="text-[10px] text-[#5F6B7A]">Sanctioned in district</span>
        </div>

        <div className="bg-white border border-[#D9DEE5] rounded-md p-3.5 shadow-2xs">
          <span className="text-[10px] font-bold text-[#5F6B7A] uppercase tracking-wider block">In Progress</span>
          <span className="text-2xl font-bold text-[#0B4F9C] mt-1 block">{inProgress}</span>
          <span className="text-[10px] text-[#5F6B7A]">Active site works</span>
        </div>

        <div className="bg-white border border-[#D9DEE5] rounded-md p-3.5 shadow-2xs">
          <span className="text-[10px] font-bold text-[#5F6B7A] uppercase tracking-wider block">Delayed</span>
          <span className="text-2xl font-bold text-amber-700 mt-1 block">{delayed}</span>
          <span className="text-[10px] text-[#5F6B7A]">Behind milestone</span>
        </div>

        <div className="bg-white border border-[#D9DEE5] rounded-md p-3.5 shadow-2xs">
          <span className="text-[10px] font-bold text-[#5F6B7A] uppercase tracking-wider block">Under Review</span>
          <span className="text-2xl font-bold text-purple-800 mt-1 block">{underReview}</span>
          <span className="text-[10px] text-[#5F6B7A]">Action pending</span>
        </div>

        <div className="bg-white border border-[#D9DEE5] rounded-md p-3.5 shadow-2xs">
          <span className="text-[10px] font-bold text-[#5F6B7A] uppercase tracking-wider block">Risk Indicators</span>
          <span className="text-2xl font-bold text-[#B42318] mt-1 block">{activeRiskFlags}</span>
          <span className="text-[10px] text-[#5F6B7A]">Score &ge; 60/100</span>
        </div>

        <div className="bg-white border border-[#D9DEE5] rounded-md p-3.5 shadow-2xs">
          <span className="text-[10px] font-bold text-[#5F6B7A] uppercase tracking-wider block">Pending Reports</span>
          <span className="text-2xl font-bold text-indigo-700 mt-1 block">{pendingReports}</span>
          <span className="text-[10px] text-[#5F6B7A]">Citizen submissions</span>
        </div>
      </div>

      {/* Main Section: PRIORITY REVIEW QUEUE (Section 30) */}
      <div className="bg-white border border-[#D9DEE5] rounded-md shadow-2xs overflow-hidden">
        <div className="p-4 border-b border-[#D9DEE5] flex flex-wrap items-center justify-between gap-3 bg-[#F7F8FA]">
          <div>
            <h2 className="font-bold text-sm text-[#123B6D] flex items-center gap-2">
              <Inbox className="w-4 h-4 text-[#0B4F9C]" />
              <span>Priority Government Review Queue</span>
            </h2>
            <p className="text-xs text-[#5F6B7A] mt-0.5">
              Escalated cases prioritized by statistical risk signals and citizen ground feedback
            </p>
          </div>

          <Link
            to="/reviewer/queue"
            className="text-xs font-semibold text-[#0B4F9C] hover:underline flex items-center gap-1"
          >
            <span>Full Queue Table</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-[#D9DEE5] bg-white text-[#5F6B7A] font-bold uppercase text-[11px]">
                <th className="py-3 px-4">Case & Project</th>
                <th className="py-3 px-4">Risk Severity</th>
                <th className="py-3 px-4">Primary Factor</th>
                <th className="py-3 px-4">Citizen Reports</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Assigned Officer</th>
                <th className="py-3 px-4 text-right">Review Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#D9DEE5]">
              {cases.map((c) => {
                const proj = c.project;
                const risk = proj?.risk_flag;
                const riskBadge = getRiskPriorityBadge(c.priority);
                const primaryFactor = risk?.factors?.[0]?.factor_name || 'Timeline Deviation';
                const reportCount = proj?.citizen_reports?.length || 0;
                const assignedReviewer = c.assignments?.[0]?.reviewer?.full_name || 'Unassigned';

                return (
                  <tr key={c.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-mono text-[11px] font-bold text-[#0B4F9C]">{c.case_number}</div>
                      <div className="font-bold text-[#123B6D] text-xs mt-0.5">{proj?.title || 'Unknown Project'}</div>
                      <span className="text-[10px] text-slate-500 font-mono">{proj?.project_code}</span>
                    </td>

                    <td className="py-3 px-4 whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <span className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase ${riskBadge.className}`}>
                          {c.priority}
                        </span>
                        {risk && (
                          <span className="font-mono font-bold text-xs text-slate-800">
                            {risk.overall_score}/100
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      <span className="font-semibold text-slate-800 block">{primaryFactor}</span>
                      <span className="text-[10px] text-[#5F6B7A] line-clamp-1">
                        {risk?.factors?.[0]?.explanation || 'Milestone delay observed'}
                      </span>
                    </td>

                    <td className="py-3 px-4 whitespace-nowrap">
                      <span className="inline-flex items-center gap-1 font-semibold text-xs px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                        <FileCheck2 className="w-3 h-3 text-[#0B4F9C]" />
                        {reportCount} report(s)
                      </span>
                    </td>

                    <td className="py-3 px-4 whitespace-nowrap">
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-amber-50 text-amber-900 border border-amber-300">
                        {c.status.replace(/_/g, ' ')}
                      </span>
                    </td>

                    <td className="py-3 px-4 whitespace-nowrap">
                      <span className="font-medium text-slate-800 block">{assignedReviewer}</span>
                      <span className="text-[10px] text-[#5F6B7A]">Review Cell</span>
                    </td>

                    <td className="py-3 px-4 text-right whitespace-nowrap">
                      <Link
                        to={`/reviewer/cases/${c.id}`}
                        className="inline-flex items-center gap-1 bg-[#0B4F9C] hover:bg-[#123B6D] text-white font-semibold px-3 py-1.5 rounded-md text-xs transition-colors shadow-2xs"
                      >
                        <span>Examine Case</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
