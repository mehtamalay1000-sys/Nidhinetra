// Nidhiनेत्र: Government Review Queue Page (UX4G 3.0 & GIGW 3.0 Compliance)
// Smart India Hackathon 2026

import React, { useState, useEffect } from 'react';
import { store } from '@/lib/database/store';
import { ReviewCase } from '@/types';
import { useGovSettings } from '@/app/providers/GovSettingsProvider';
import { getRiskPriorityBadge } from '@/lib/utils/formatters';
import { Link } from 'react-router-dom';
import {
  Inbox,
  Search,
  Download,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';

export const ReviewQueuePage: React.FC = () => {
  const [cases, setCases] = useState<ReviewCase[]>([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const { t } = useGovSettings();

  const loadCases = () => {
    setCases(store.getReviewCases());
  };

  useEffect(() => {
    loadCases();
    const unsub = store.subscribe(() => loadCases());
    return () => unsub();
  }, []);

  const filteredCases = cases.filter((c) => {
    const matchesStatus = statusFilter === 'ALL' || c.status === statusFilter;
    const q = search.toLowerCase();
    const matchesSearch =
      !search ||
      c.case_number.toLowerCase().includes(q) ||
      c.project?.title.toLowerCase().includes(q) ||
      c.project?.project_code.toLowerCase().includes(q) ||
      c.summary.toLowerCase().includes(q);
    return matchesStatus && matchesSearch;
  });

  const exportCSV = () => {
    const headers = ['Case Number', 'Project Code', 'Project Title', 'Priority', 'Status', 'Summary', 'Created At'];
    const rows = filteredCases.map((c) => [
      c.case_number,
      c.project?.project_code || '',
      `"${c.project?.title || ''}"`,
      c.priority,
      c.status,
      `"${c.summary.replace(/"/g, '""')}"`,
      c.created_at,
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `nidhinetra_review_queue_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="bg-white border border-[#D9DEE5] rounded-md p-5 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-[#5F6B7A] mb-1">
            <Link to="/reviewer/dashboard" className="hover:text-[#0B4F9C] hover:underline">
              {t('home', 'Home')}
            </Link>
            <span>/</span>
            <span className="text-[#1F2937] font-semibold">{t('reviewQueue', 'Review Queue')}</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#123B6D] tracking-tight">
            Priority Government Review Queue
          </h1>
          <p className="text-xs sm:text-sm text-[#5F6B7A] mt-0.5">
            Active project cases requiring human governance, on-site evidence validation, and official compliance follow-up.
          </p>
        </div>

        <button
          onClick={exportCSV}
          className="inline-flex items-center gap-1.5 bg-white hover:bg-slate-50 text-[#123B6D] border border-[#D9DEE5] font-semibold px-3.5 py-2 rounded-md text-xs transition-colors shrink-0"
        >
          <Download className="w-4 h-4 text-slate-500" />
          <span>{t('downloadCsv', 'Export Queue CSV')}</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-[#D9DEE5] rounded-md p-4 shadow-2xs space-y-3">
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by case #, project title, or project code..."
              className="w-full pl-9 pr-3 py-2 bg-white border border-[#D9DEE5] rounded-md text-xs text-[#1F2937] focus:border-[#0B4F9C] focus:outline-hidden"
            />
          </div>

          <div className="flex flex-wrap items-center gap-1 bg-[#F7F8FA] p-1 rounded-md border border-[#D9DEE5] w-full sm:w-auto">
            {['ALL', 'OPEN', 'ASSIGNED', 'ACTION_RECORDED', 'RESOLVED'].map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                  statusFilter === st
                    ? 'bg-[#0B4F9C] text-white font-bold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
                }`}
              >
                {st.replace(/_/g, ' ')}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Queue Table */}
      <div className="bg-white border border-[#D9DEE5] rounded-md shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-[#D9DEE5] bg-[#F7F8FA] text-[#5F6B7A] font-bold uppercase text-[11px]">
                <th className="py-3 px-4">Case #</th>
                <th className="py-3 px-4">Project</th>
                <th className="py-3 px-4">Priority</th>
                <th className="py-3 px-4">Summary</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Assigned To</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#D9DEE5]">
              {filteredCases.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-[#5F6B7A] text-xs">
                    No cases match the selected filter criteria.
                  </td>
                </tr>
              ) : (
                filteredCases.map((c) => {
                  const riskBadge = getRiskPriorityBadge(c.priority);
                  const reviewer = c.assignments?.[0]?.reviewer?.full_name || 'Unassigned';

                  return (
                    <tr key={c.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 px-4 font-mono font-bold text-[#0B4F9C] whitespace-nowrap">
                        {c.case_number}
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-[#123B6D]">{c.project?.title}</div>
                        <span className="text-[10px] text-[#5F6B7A] font-mono">
                          {c.project?.project_code} • {c.project?.district}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase ${riskBadge.className}`}>
                          {c.priority}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 max-w-xs text-[#5F6B7A] truncate">
                        {c.summary}
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-amber-50 text-amber-900 border border-amber-300">
                          {c.status.replace(/_/g, ' ')}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-slate-700 font-medium whitespace-nowrap">
                        {reviewer}
                      </td>
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
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
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
