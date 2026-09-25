// Nidhiनेत्र: District Citizen Ground Reports Management Page (UX4G 3.0 Standards)
// Smart India Hackathon 2026

import React, { useState, useEffect } from 'react';
import { store } from '@/lib/database/store';
import { CitizenReport } from '@/types';
import { getReportStatusBadge, formatDate } from '@/lib/utils/formatters';
import { useGovSettings } from '@/app/providers/GovSettingsProvider';
import { Link } from 'react-router-dom';
import {
  FileCheck2,
  Search,
  Check,
  MapPin,
  ExternalLink,
  ImageIcon,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';

export const ReviewerReportsPage: React.FC = () => {
  const [reports, setReports] = useState<CitizenReport[]>([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [feedback, setFeedback] = useState<string | null>(null);
  const { t } = useGovSettings();

  const loadReports = () => {
    setReports(store.getCitizenReports());
  };

  useEffect(() => {
    loadReports();
    const unsub = store.subscribe(() => loadReports());
    return () => unsub();
  }, []);

  const filteredReports = reports.filter((r) => {
    const matchesStatus = statusFilter === 'ALL' || r.status === statusFilter;
    const q = search.toLowerCase();
    const matchesSearch =
      !search ||
      r.report_code.toLowerCase().includes(q) ||
      r.issue_category.toLowerCase().includes(q) ||
      r.description.toLowerCase().includes(q) ||
      r.project?.title.toLowerCase().includes(q);
    return matchesStatus && matchesSearch;
  });

  const handleVerifyEvidence = (reportId: string, projectId: string) => {
    const targetCase = store.getReviewCases().find((c) => c.project_id === projectId);
    const caseId = targetCase?.id || 'case-0';

    store.verifyEvidence(caseId, reportId, 'Officer verified photo evidence against field drawings.');
    setFeedback(`Report evidence verified and updated in audit trail.`);
    setTimeout(() => setFeedback(null), 3500);
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
            <span className="text-[#1F2937] font-semibold">{t('citizenReportsQueue', 'Citizen Reports')}</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#123B6D] tracking-tight">
            Citizen Ground Verification Submissions
          </h1>
          <p className="text-xs sm:text-sm text-[#5F6B7A] mt-0.5">
            Review geo-tagged citizen observations, cross-examine photo evidence, and authorize official field inspection.
          </p>
        </div>
      </div>

      {feedback && (
        <div className="p-3.5 rounded-md bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-[#2E7D32] shrink-0" />
          <span>{feedback}</span>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="bg-white border border-[#D9DEE5] rounded-md p-4 shadow-2xs space-y-3">
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by report ID, category, or project name..."
              className="w-full pl-9 pr-3 py-2 bg-white border border-[#D9DEE5] rounded-md text-xs text-[#1F2937] focus:border-[#0B4F9C] focus:outline-hidden"
            />
          </div>

          <div className="flex flex-wrap items-center gap-1 bg-[#F7F8FA] p-1 rounded-md border border-[#D9DEE5] w-full sm:w-auto">
            {['ALL', 'SUBMITTED', 'UNDER_REVIEW', 'VERIFIED', 'RESOLVED'].map((st) => (
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

      {/* Reports Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredReports.length === 0 ? (
          <div className="col-span-2 bg-white border border-[#D9DEE5] rounded-md p-12 text-center text-[#5F6B7A] text-xs">
            No citizen reports match the specified filters.
          </div>
        ) : (
          filteredReports.map((r) => {
            const statusBadge = getReportStatusBadge(r.status);

            return (
              <div
                key={r.id}
                className="bg-white border border-[#D9DEE5] rounded-md p-4 shadow-2xs space-y-3 flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <span className="font-mono text-xs font-bold text-[#0B4F9C] bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                      {r.report_code}
                    </span>
                    <span className={`text-[10px] px-2 py-0.5 rounded font-semibold ${statusBadge.className}`}>
                      {statusBadge.label}
                    </span>
                  </div>

                  <h3 className="font-bold text-[#123B6D] text-sm">
                    {r.project?.title || 'Public Project'}
                  </h3>

                  <div className="text-xs text-[#5F6B7A] flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-[#E87B18]" />
                    <span>{r.location_address || 'Project Location'}</span>
                  </div>

                  <div className="p-2.5 rounded-md bg-[#F7F8FA] border border-[#D9DEE5] text-xs text-slate-700 leading-relaxed">
                    <span className="font-bold text-slate-900 block mb-0.5">
                      Issue: {r.issue_category}
                    </span>
                    "{r.description}"
                  </div>

                  {r.evidence && r.evidence.length > 0 && (
                    <div className="pt-1">
                      <span className="text-[10px] font-bold text-[#5F6B7A] uppercase tracking-wide block mb-1 flex items-center gap-1">
                        <ImageIcon className="w-3.5 h-3.5 text-[#0B4F9C]" />
                        Attached Evidence ({r.evidence.length})
                      </span>
                      <div className="grid grid-cols-2 gap-2">
                        {r.evidence.map((ev) => (
                          <div key={ev.id} className="rounded overflow-hidden border border-slate-200 bg-slate-100">
                            <img
                              src={ev.file_url}
                              alt={ev.caption || 'Evidence'}
                              className="w-full h-28 object-cover cursor-pointer hover:opacity-90"
                              onClick={() => window.open(ev.file_url, '_blank')}
                            />
                            {ev.caption && (
                              <p className="p-1 text-[10px] text-slate-600 truncate bg-white">
                                {ev.caption}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs">
                  <span className="text-[11px] text-[#5F6B7A]">
                    {formatDate(r.created_at, true)}
                  </span>

                  <div className="flex items-center gap-2">
                    {r.status !== 'VERIFIED' && r.status !== 'RESOLVED' && r.project_id && (
                      <button
                        onClick={() => handleVerifyEvidence(r.id, r.project_id)}
                        className="px-2.5 py-1 bg-[#2E7D32] hover:bg-emerald-800 text-white rounded-md text-xs font-semibold flex items-center gap-1 shadow-2xs"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Verify</span>
                      </button>
                    )}

                    {r.project && (
                      <Link
                        to={`/reviewer/projects/${r.project.id}`}
                        className="text-xs font-semibold text-[#0B4F9C] hover:underline flex items-center gap-0.5"
                      >
                        <span>Project</span>
                        <ExternalLink className="w-3 h-3" />
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
