// Nidhiनेत्र: Citizen Ground Reports Tracking Page (UX4G 3.0 & GIGW 3.0 Compliance)
// Smart India Hackathon 2026

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/app/providers/AuthProvider';
import { useGovSettings } from '@/app/providers/GovSettingsProvider';
import { store } from '@/lib/database/store';
import { CitizenReport } from '@/types';
import { getReportStatusBadge, formatDate } from '@/lib/utils/formatters';
import { Link } from 'react-router-dom';
import {
  FileText,
  CheckCircle2,
  AlertCircle,
  PlusCircle,
  MapPin,
  ExternalLink,
  ShieldCheck,
  ImageIcon,
} from 'lucide-react';

export const CitizenReportsPage: React.FC = () => {
  const { user } = useAuth();
  const { t } = useGovSettings();
  const [reports, setReports] = useState<CitizenReport[]>([]);
  const [selectedReport, setSelectedReport] = useState<CitizenReport | null>(null);

  const loadReports = () => {
    if (user) {
      const userReports = store.getCitizenReports(user.id);
      setReports(userReports);
      if (userReports.length > 0 && !selectedReport) {
        setSelectedReport(userReports[0]);
      } else if (selectedReport) {
        const updated = userReports.find((r) => r.id === selectedReport.id);
        if (updated) setSelectedReport(updated);
      }
    }
  };

  useEffect(() => {
    loadReports();
    const unsub = store.subscribe(() => loadReports());
    return () => unsub();
  }, [user]);

  // Stepper milestones for report lifecycle (Section 25)
  const steps = [
    { key: 'SUBMITTED', label: 'Submitted' },
    { key: 'UNDER_REVIEW', label: 'Under Review' },
    { key: 'VERIFICATION_REQUIRED', label: 'Field Verification' },
    { key: 'VERIFIED', label: 'Evidence Verified' },
    { key: 'ACTION_TAKEN', label: 'Action Recorded' },
    { key: 'RESOLVED', label: 'Resolved' },
  ];

  const getStepIndex = (status: CitizenReport['status']) => {
    if (status === 'DISMISSED') return -1;
    const idx = steps.findIndex((s) => s.key === status);
    return idx === -1 ? 0 : idx;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Page Header */}
      <div className="bg-white border border-[#D9DEE5] rounded-md p-5 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-[#5F6B7A] mb-1">
            <Link to="/citizen/dashboard" className="hover:text-[#0B4F9C] hover:underline">
              {t('home', 'Home')}
            </Link>
            <span>/</span>
            <span className="text-[#1F2937] font-semibold">{t('myReports', 'My Reports')}</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#123B6D] tracking-tight">
            My Ground Observations & Reports
          </h1>
          <p className="text-xs sm:text-sm text-[#5F6B7A] mt-0.5">
            Track verification progress and administrative actions taken on your submitted project observations.
          </p>
        </div>

        <Link
          to="/citizen/report-issue"
          className="inline-flex items-center gap-2 bg-[#0B4F9C] hover:bg-[#123B6D] text-white text-xs sm:text-sm font-semibold px-4 py-2 rounded-md shadow-2xs transition-colors shrink-0"
        >
          <PlusCircle className="w-4 h-4 text-amber-300" />
          <span>{t('reportIssue', 'Report an Issue')}</span>
        </Link>
      </div>

      {reports.length === 0 ? (
        <div className="bg-white border border-[#D9DEE5] rounded-md p-12 text-center text-[#5F6B7A]">
          <FileText className="w-12 h-12 mx-auto text-slate-300 mb-3" />
          <h3 className="text-base font-bold text-slate-800">No Reports Filed Yet</h3>
          <p className="text-xs text-[#5F6B7A] max-w-sm mx-auto mt-1 mb-4 leading-relaxed">
            You have not submitted any on-ground verification reports yet. Notice an issue on a public development project in your area?
          </p>
          <Link
            to="/citizen/report-issue"
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#0B4F9C] text-white rounded-md text-xs font-semibold hover:bg-[#123B6D]"
          >
            <PlusCircle className="w-4 h-4 text-amber-300" />
            <span>{t('reportIssue', 'Report an Issue')}</span>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          {/* Left Column: List of citizen reports */}
          <div className="bg-white border border-[#D9DEE5] rounded-md shadow-2xs overflow-hidden divide-y divide-[#D9DEE5]">
            <div className="p-3.5 bg-[#F7F8FA] border-b border-[#D9DEE5] flex items-center justify-between">
              <span className="text-xs font-bold text-[#123B6D] uppercase tracking-wider">
                Submitted Reports ({reports.length})
              </span>
            </div>

            <div className="max-h-[600px] overflow-y-auto divide-y divide-[#D9DEE5]">
              {reports.map((rep) => {
                const isSelected = selectedReport?.id === rep.id;
                const statusBadge = getReportStatusBadge(rep.status);

                return (
                  <button
                    key={rep.id}
                    onClick={() => setSelectedReport(rep)}
                    className={`w-full p-4 text-left transition-colors hover:bg-slate-50 block ${
                      isSelected ? 'bg-[#EBF3FA] border-l-4 border-[#0B4F9C]' : ''
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <span className="font-mono text-xs font-bold text-slate-800">{rep.report_code}</span>
                      <span className={`text-[10px] px-2 py-0.5 rounded font-semibold ${statusBadge.className}`}>
                        {statusBadge.label}
                      </span>
                    </div>

                    <p className="text-xs font-bold text-[#123B6D] line-clamp-1 mb-1">
                      {rep.project?.title || 'Public Project'}
                    </p>

                    <p className="text-xs text-[#5F6B7A] line-clamp-1 mb-2">
                      Observation: {rep.issue_category}
                    </p>

                    <div className="flex items-center justify-between text-[11px] text-[#5F6B7A]">
                      <span>{formatDate(rep.created_at, true)}</span>
                      {rep.evidence && rep.evidence.length > 0 && (
                        <span className="text-[#0B4F9C] font-semibold flex items-center gap-1">
                          <ImageIcon className="w-3 h-3" />
                          Photo attached
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right 2 Columns: Detailed Status View & Verification Stepper */}
          {selectedReport && (
            <div className="lg:col-span-2 bg-white border border-[#D9DEE5] rounded-md p-6 shadow-2xs space-y-6">
              {/* Header */}
              <div className="flex flex-wrap items-start justify-between gap-4 pb-4 border-b border-[#D9DEE5]">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm font-bold text-[#0B4F9C] bg-blue-50 px-2.5 py-0.5 rounded border border-blue-200">
                      {selectedReport.report_code}
                    </span>
                    <span
                      className={`text-xs px-2.5 py-0.5 rounded font-semibold ${
                        getReportStatusBadge(selectedReport.status).className
                      }`}
                    >
                      {getReportStatusBadge(selectedReport.status).label}
                    </span>
                  </div>

                  <h2 className="text-base font-bold text-[#123B6D] pt-1">
                    {selectedReport.project?.title || 'Public Development Project'}
                  </h2>

                  <p className="text-xs text-[#5F6B7A] flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-[#E87B18]" />
                    <span>{selectedReport.location_address || 'Project Site, Nashik'}</span>
                  </p>
                </div>

                {selectedReport.project && (
                  <Link
                    to={`/citizen/projects/${selectedReport.project.id}`}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-[#0B4F9C] hover:underline bg-[#F7F8FA] px-3 py-1.5 rounded-md border border-[#D9DEE5]"
                  >
                    <span>{t('viewDetails', 'View Project Dossier')}</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </Link>
                )}
              </div>

              {/* Lifecycle Progress Stepper (Government Stage Visualization) */}
              <div className="space-y-2">
                <h3 className="text-xs font-bold text-[#123B6D] uppercase tracking-wider">
                  Verification Lifecycle Status
                </h3>

                <div className="bg-[#F7F8FA] p-4 rounded-md border border-[#D9DEE5]">
                  <div className="grid grid-cols-2 sm:grid-cols-6 gap-2">
                    {steps.map((st, i) => {
                      const currentIdx = getStepIndex(selectedReport.status);
                      const isComplete = i <= currentIdx;
                      const isCurrent = i === currentIdx;

                      return (
                        <div key={st.key} className="text-center space-y-1.5">
                          <div
                            className={`w-7 h-7 mx-auto rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                              isComplete
                                ? 'bg-[#2E7D32] text-white shadow-2xs'
                                : 'bg-slate-200 text-slate-500'
                            } ${isCurrent ? 'ring-2 ring-[#0B4F9C] ring-offset-2' : ''}`}
                          >
                            {isComplete ? '✓' : i + 1}
                          </div>
                          <span
                            className={`block text-[11px] font-medium leading-tight ${
                              isComplete ? 'text-slate-900 font-bold' : 'text-slate-400'
                            }`}
                          >
                            {st.label}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Observation Content */}
              <div className="space-y-2">
                <h3 className="text-xs font-bold text-[#123B6D] uppercase tracking-wider">
                  Submitted Ground Observation
                </h3>
                <div className="p-4 rounded-md bg-[#F7F8FA] border border-[#D9DEE5] space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-800">
                      Category: {selectedReport.issue_category}
                    </span>
                    <span className="text-[#5F6B7A]">
                      Observed on: {formatDate(selectedReport.observation_date)}
                    </span>
                  </div>
                  <p className="text-xs text-slate-700 leading-relaxed">{selectedReport.description}</p>
                </div>
              </div>

              {/* Uploaded Evidence Photo */}
              {selectedReport.evidence && selectedReport.evidence.length > 0 && (
                <div className="space-y-2">
                  <h3 className="text-xs font-bold text-[#123B6D] uppercase tracking-wider flex items-center gap-1.5">
                    <ImageIcon className="w-4 h-4 text-[#0B4F9C]" />
                    <span>Uploaded Photographic Evidence</span>
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {selectedReport.evidence.map((ev) => (
                      <div key={ev.id} className="rounded-md overflow-hidden border border-slate-200 bg-[#F7F8FA]">
                        <img
                          src={ev.file_url}
                          alt={ev.caption || 'Evidence'}
                          className="w-full h-44 object-cover cursor-pointer hover:opacity-95 transition-opacity"
                          onClick={() => window.open(ev.file_url, '_blank')}
                        />
                        {ev.caption && (
                          <p className="p-2 text-[11px] text-slate-600 bg-white border-t border-slate-100">
                            {ev.caption}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Accountability Notice */}
              <div className="p-3.5 bg-blue-50 border border-blue-200 rounded-md text-xs text-blue-950 flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-[#0B4F9C] shrink-0 mt-0.5" />
                <div className="leading-relaxed">
                  <span className="font-bold block mb-0.5">Accountability Assurance</span>
                  Every status update generates a permanent audit trail entry. Once verified by the designated Public Works or Zilla Parishad reviewer, official field inspection orders are published here.
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
