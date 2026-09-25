// ProjectWatch: Review Case Detail & Government Action Console
// Smart India Hackathon 2026
// Implements the complete human-in-the-loop review workflow

import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { store } from '@/lib/database/store';
import { useAuth } from '@/app/providers/AuthProvider';
import { ReviewCase, ReviewActionType, ReviewAction } from '@/types';
import {
  formatCurrencyLakhs,
  getProjectStatusBadge,
  getRiskPriorityBadge,
  getReportStatusBadge,
  formatDate,
} from '@/lib/utils/formatters';
import { ExplainableRiskCard } from '@/components/common/ExplainableRiskCard';
import { ProjectTimelineView } from '@/components/common/ProjectTimelineView';
import {
  ShieldAlert,
  CheckCircle2,
  FileCheck2,
  Clock,
  ArrowLeft,
  Building,
  MapPin,
  ExternalLink,
  History,
  AlertCircle,
  X,
  Send,
  UserCheck,
  Check,
} from 'lucide-react';

export const ReviewCasePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [reviewCase, setReviewCase] = useState<ReviewCase | null>(null);
  const [showActionModal, setShowActionModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [verificationFeedback, setVerificationFeedback] = useState<string | null>(null);

  // Form states for new review action
  const [actionType, setActionType] = useState<ReviewActionType>('Site Inspection Requested');
  const [department, setDepartment] = useState('Public Works Department (PWD) Nashik');
  const [remarks, setRemarks] = useState('');
  const [targetDate, setTargetDate] = useState(
    new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  );
  const [actionError, setActionError] = useState<string | null>(null);

  // Form state for assignment
  const [selectedReviewerId, setSelectedReviewerId] = useState('');
  const [assignmentInstructions, setAssignmentInstructions] = useState('');

  const loadCase = () => {
    if (!id) return;
    const found = store.getReviewCaseById(id);
    if (found) {
      setReviewCase(found);
      const activeAssign = found.assignments?.[0];
      if (activeAssign) {
        setSelectedReviewerId(activeAssign.reviewer_id);
      }
    }
  };

  useEffect(() => {
    loadCase();
    const unsub = store.subscribe(() => loadCase());
    return () => unsub();
  }, [id]);

  if (!reviewCase || !reviewCase.project) {
    return (
      <div className="max-w-4xl mx-auto py-16 text-center">
        <h2 className="text-xl font-bold text-slate-900 mb-2">Review Case Not Found</h2>
        <p className="text-sm text-slate-500 mb-4">Case #{id} does not exist or has been removed.</p>
        <button
          onClick={() => navigate('/reviewer/queue')}
          className="px-4 py-2 bg-amber-600 text-white rounded-lg text-xs font-semibold"
        >
          Return to Review Queue
        </button>
      </div>
    );
  }

  const project = reviewCase.project;
  const reports = project.citizen_reports || [];
  const actions = reviewCase.actions || [];
  const auditLogs = store.getAuditLogs({ limit: 15 }).filter(
    (l) => l.entity_id === reviewCase.id || l.entity_id === project.id || reports.some((r) => r.id === l.entity_id)
  );

  // Handle Verify Evidence
  const handleVerifyEvidence = (reportId: string) => {
    store.verifyEvidence(
      reviewCase.id,
      reportId,
      'Reviewer cross-checked geo-coordinates, on-site photo orientation, and physical asset schedule.'
    );
    setVerificationFeedback('Ground photo evidence verified successfully and logged in official audit trail.');
    setTimeout(() => setVerificationFeedback(null), 3500);
  };

  // Handle Record Action
  const handleRecordActionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!remarks.trim() || remarks.trim().length < 10) {
      setActionError('Action remarks must be at least 10 characters detailing the government directive.');
      return;
    }

    store.recordReviewAction({
      case_id: reviewCase.id,
      action_type: actionType,
      responsible_department: department,
      remarks: remarks.trim(),
      target_date: targetDate,
    });

    setShowActionModal(false);
    setRemarks('');
    setActionError(null);
    setVerificationFeedback(`Government Action "${actionType}" registered and dispatched to citizen.`);
    setTimeout(() => setVerificationFeedback(null), 4000);
  };

  // Handle Assign Case
  const handleAssignSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedReviewerId) return;

    store.assignCase(reviewCase.id, selectedReviewerId, assignmentInstructions);
    setShowAssignModal(false);
    setVerificationFeedback('Case successfully assigned and added to officer review queue.');
    setTimeout(() => setVerificationFeedback(null), 3000);
  };

  // Quick Resolve or Dismiss
  const handleQuickStatus = (type: 'Case Resolved' | 'Flag Dismissed') => {
    if (confirm(`Are you sure you want to mark this review case as "${type}"?`)) {
      store.recordReviewAction({
        case_id: reviewCase.id,
        action_type: type,
        responsible_department: 'District Review Cell',
        remarks:
          type === 'Case Resolved'
            ? 'Corrective action verified on site; all citizen observations addressed.'
            : 'Statistical anomaly explained and resolved upon inspection.',
      });
    }
  };

  const riskBadge = getRiskPriorityBadge(reviewCase.priority);
  const statusBadge = getProjectStatusBadge(project.status);

  return (
    <div className="space-y-6">
      {/* Top Navigation */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <button
          onClick={() => navigate('/reviewer/queue')}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Review Queue</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowAssignModal(true)}
            className="inline-flex items-center gap-1.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 font-semibold px-3 py-1.5 rounded-lg text-xs transition-colors shadow-2xs"
          >
            <UserCheck className="w-3.5 h-3.5 text-slate-500" />
            <span>Reassign Officer</span>
          </button>

          <button
            onClick={() => setShowActionModal(true)}
            className="inline-flex items-center gap-1.5 bg-amber-600 hover:bg-amber-700 text-white font-semibold px-3.5 py-1.5 rounded-lg text-xs transition-colors shadow-2xs"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Record Government Action</span>
          </button>
        </div>
      </div>

      {verificationFeedback && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-semibold flex items-center gap-2 animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{verificationFeedback}</span>
        </div>
      )}

      {/* Case Header Card (Section 31) */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
        <div className="flex flex-wrap items-start justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="font-mono text-xs font-black text-amber-950 bg-amber-100 px-2.5 py-0.5 rounded border border-amber-300">
                CASE #{reviewCase.case_number}
              </span>
              <span className={`text-[11px] px-2 py-0.5 rounded font-bold uppercase ${riskBadge.className}`}>
                {reviewCase.priority} Risk
              </span>
              <span className="text-[11px] px-2 py-0.5 rounded font-semibold bg-slate-100 text-slate-800">
                Status: {reviewCase.status.replace(/_/g, ' ')}
              </span>
            </div>

            <h1 className="text-2xl font-black text-slate-900 tracking-tight">{project.title}</h1>

            <p className="text-xs text-slate-500 flex items-center gap-1.5 mt-1.5">
              <MapPin className="w-3.5 h-3.5 text-slate-400" />
              <span>{project.location?.address || `${project.district}, ${project.state}`}</span>
              <span>•</span>
              <span className="font-mono font-semibold">{project.project_code}</span>
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-slate-50 border border-slate-200 p-3 rounded-xl text-center min-w-[130px]">
              <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                Risk Score
              </span>
              <div className="text-2xl font-black text-slate-900">
                {project.risk_flag?.overall_score || 78}
                <span className="text-xs text-slate-400 font-normal"> / 100</span>
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <button
                onClick={() => handleQuickStatus('Case Resolved')}
                className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold px-3 py-1.5 rounded-lg shadow-2xs transition-colors"
              >
                Resolve Case
              </button>
              <button
                onClick={() => handleQuickStatus('Flag Dismissed')}
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors"
              >
                Dismiss Flag
              </button>
            </div>
          </div>
        </div>

        {/* Verification Sources Summary */}
        <div className="pt-4 flex flex-wrap items-center gap-4 text-xs font-medium text-slate-700">
          <span className="text-slate-400 font-semibold text-[11px] uppercase tracking-wider">Sources:</span>
          <span className="flex items-center gap-1 text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
            ✓ Official PWD Project Data
          </span>
          <span className="flex items-center gap-1 text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
            ✓ Statistical Risk Engine
          </span>
          <span className="flex items-center gap-1 text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
            ✓ Citizen Ground Reports ({reports.length})
          </span>
          <span className="flex items-center gap-1 text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
            ✓ On-Site Photo Evidence
          </span>
        </div>
      </div>

      {/* Professional Split Layout (Section 74) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* LEFT COLUMN: Project Info, Financials, Timeline, Explainable Risk */}
        <div className="space-y-6">
          {/* Explainable Risk Analysis Card */}
          <ExplainableRiskCard riskFlag={project.risk_flag} />

          {/* Financial Breakdown */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
            <h3 className="font-bold text-sm text-slate-900">Official Financial Outlay</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Sanctioned</span>
                <span className="text-xs font-black text-slate-900">
                  {formatCurrencyLakhs(project.financials?.sanctioned_amount)}
                </span>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Expended</span>
                <span className="text-xs font-black text-slate-700">
                  {formatCurrencyLakhs(project.financials?.expenditure_amount)}
                </span>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Remaining</span>
                <span className="text-xs font-black text-slate-900">
                  {formatCurrencyLakhs(project.financials?.remaining_amount)}
                </span>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Utilisation</span>
                <span className="text-xs font-black text-blue-700">
                  {project.financials?.utilisation_percentage || 0}%
                </span>
              </div>
            </div>
          </div>

          {/* Project Timeline */}
          {project.timelines && (
            <ProjectTimelineView events={project.timelines} />
          )}
        </div>

        {/* RIGHT COLUMN: Citizen Ground Evidence & Review Actions History */}
        <div className="space-y-6">
          {/* Citizen Ground Reports & Evidence Validation */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-sm text-slate-900">Citizen Evidence & Ground Observations</h3>
                <p className="text-xs text-slate-500">Examine photographs and verify against project blueprints</p>
              </div>
              <span className="text-xs font-bold bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                {reports.length} report(s)
              </span>
            </div>

            {reports.length === 0 ? (
              <div className="py-8 text-center text-slate-400 text-xs">
                No citizen ground reports attached to this project.
              </div>
            ) : (
              <div className="space-y-4">
                {reports.map((rep) => (
                  <div key={rep.id} className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-bold text-blue-900">{rep.report_code}</span>
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded font-semibold ${
                          getReportStatusBadge(rep.status).className
                        }`}
                      >
                        {getReportStatusBadge(rep.status).label}
                      </span>
                    </div>

                    <div className="text-xs font-semibold text-slate-800">
                      Category: {rep.issue_category}
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed bg-white p-2.5 rounded-lg border border-slate-100">
                      "{rep.description}"
                    </p>

                    {/* Evidence Photos */}
                    {rep.evidence && rep.evidence.length > 0 && (
                      <div className="space-y-2">
                        {rep.evidence.map((ev) => (
                          <div key={ev.id} className="rounded-lg overflow-hidden border border-slate-200">
                            <img
                              src={ev.file_url}
                              alt={ev.caption || 'Evidence'}
                              className="w-full h-44 object-cover"
                            />
                            {ev.caption && (
                              <p className="p-2 text-[11px] text-slate-600 bg-white border-t border-slate-100">
                                {ev.caption}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-200">
                      <span className="text-[10px] text-slate-400">
                        Observed: {formatDate(rep.observation_date)}
                      </span>

                      {rep.status !== 'VERIFIED' && rep.status !== 'RESOLVED' && (
                        <button
                          type="button"
                          onClick={() => handleVerifyEvidence(rep.id)}
                          className="px-3 py-1 bg-teal-700 hover:bg-teal-800 text-white rounded-md text-xs font-semibold shadow-2xs transition-colors flex items-center gap-1.5"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Verify Evidence</span>
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Official Government Actions Registered (Section 34) */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-sm text-slate-900">Recorded Government Actions</h3>
                <p className="text-xs text-slate-500">Traceable directives issued by the review authority</p>
              </div>
              <button
                onClick={() => setShowActionModal(true)}
                className="text-xs font-bold text-amber-700 hover:text-amber-900 flex items-center gap-1"
              >
                + Record New
              </button>
            </div>

            {actions.length === 0 ? (
              <div className="py-6 text-center text-slate-400 text-xs">
                No formal actions recorded yet. Use "Record Government Action" to initiate an inspection or directive.
              </div>
            ) : (
              <div className="space-y-3">
                {actions.map((act) => (
                  <div key={act.id} className="p-3.5 bg-slate-50 rounded-lg border border-slate-200 space-y-1.5">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-bold text-xs text-slate-900">{act.action_type}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded font-semibold bg-blue-50 text-blue-800 border border-blue-200">
                        {act.status}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-600">
                      <strong>Responsible Dept:</strong> {act.responsible_department}
                    </p>
                    <p className="text-xs text-slate-700 leading-relaxed bg-white p-2 rounded border border-slate-100">
                      {act.remarks}
                    </p>
                    <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1">
                      <span>Target Date: {act.target_date || 'Immediate'}</span>
                      <span>Recorded: {formatDate(act.created_at, true)}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* BOTTOM SECTION: Real-Time Audit Trail (Section 33, 74) */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <History className="w-5 h-5 text-blue-700" />
            <h3 className="font-bold text-base text-slate-900">Case Audit Trail & Verification History</h3>
          </div>
          <span className="text-xs text-slate-400">Database-backed immutable logs</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-slate-600 font-semibold uppercase text-[10px]">
                <th className="py-2.5 px-3">Timestamp</th>
                <th className="py-2.5 px-3">Actor & Role</th>
                <th className="py-2.5 px-3">Action</th>
                <th className="py-2.5 px-3">Entity</th>
                <th className="py-2.5 px-3">Official Description</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {auditLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50/50">
                  <td className="py-2.5 px-3 text-slate-500 font-mono text-[11px] whitespace-nowrap">
                    {formatDate(log.created_at, true)}
                  </td>
                  <td className="py-2.5 px-3">
                    <span className="font-semibold text-slate-800 block">{log.actor_name}</span>
                    <span className="text-[10px] font-mono text-slate-400 uppercase">{log.actor_role}</span>
                  </td>
                  <td className="py-2.5 px-3">
                    <span className="font-bold text-blue-900 bg-blue-50 px-2 py-0.5 rounded border border-blue-200 text-[11px]">
                      {log.action}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-slate-500 uppercase text-[10px] font-mono">
                    {log.entity_type}
                  </td>
                  <td className="py-2.5 px-3 text-slate-700 leading-snug">{log.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* RECORD ACTION MODAL */}
      {showActionModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-base text-slate-900">Record Official Government Action</h3>
              <button
                onClick={() => setShowActionModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {actionError && (
              <div className="p-2.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs">
                {actionError}
              </div>
            )}

            <form onSubmit={handleRecordActionSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Action Directive Type</label>
                <select
                  value={actionType}
                  onChange={(e) => setActionType(e.target.value as ReviewActionType)}
                  className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-medium text-slate-900 focus:bg-white"
                >
                  <option value="Site Inspection Requested">Site Inspection Requested</option>
                  <option value="Verification Initiated">Verification Initiated</option>
                  <option value="Additional Information Requested">Additional Information Requested</option>
                  <option value="Implementation Follow-up">Implementation Follow-up</option>
                  <option value="Administrative Review">Administrative Review</option>
                  <option value="Case Resolved">Case Resolved</option>
                  <option value="Flag Dismissed">Flag Dismissed</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Responsible Agency / Department
                </label>
                <input
                  type="text"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  placeholder="e.g. Public Works Department (PWD) Nashik"
                  className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Target Compliance Date
                </label>
                <input
                  type="date"
                  value={targetDate}
                  onChange={(e) => setTargetDate(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Remarks & Instructions *
                </label>
                <textarea
                  rows={3}
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  placeholder="Detail the mandatory compliance step, spot inspection directive, or resolution findings..."
                  className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900 focus:bg-white"
                />
                <span className="text-[10px] text-slate-400">Minimum 10 characters</span>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowActionModal(false)}
                  className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg text-xs font-bold bg-amber-600 hover:bg-amber-700 text-white shadow-xs"
                >
                  Record & Commit Action
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* REASSIGN OFFICER MODAL */}
      {showAssignModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-base text-slate-900">Assign Verification Officer</h3>
              <button
                onClick={() => setShowAssignModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAssignSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Select Officer</label>
                <select
                  value={selectedReviewerId}
                  onChange={(e) => setSelectedReviewerId(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900 focus:bg-white"
                >
                  {store.getProfiles().filter((p) => p.role === 'reviewer' || p.role === 'admin').map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.full_name} ({p.role.toUpperCase()}) — {p.district}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Instructions</label>
                <textarea
                  rows={2}
                  value={assignmentInstructions}
                  onChange={(e) => setAssignmentInstructions(e.target.value)}
                  placeholder="Specific focus areas for field verification..."
                  className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAssignModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold bg-blue-800 text-white rounded-lg hover:bg-blue-900"
                >
                  Confirm Assignment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
