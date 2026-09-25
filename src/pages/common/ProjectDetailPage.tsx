// Nidhiनेत्र: Official Project Service Record / Dossier Page
// Smart India Hackathon 2026 — UX4G 3.0 & GIGW 3.0 Compliance

import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { store } from '@/lib/database/store';
import { Project } from '@/types';
import { useGovSettings } from '@/app/providers/GovSettingsProvider';
import {
  formatCurrencyLakhs,
  getProjectStatusBadge,
  getRiskPriorityBadge,
  formatDate,
} from '@/lib/utils/formatters';
import { ExplainableRiskCard } from '@/components/common/ExplainableRiskCard';
import { ProjectHealthCard } from '@/components/common/ProjectHealthCard';
import { ProjectTimelineView } from '@/components/common/ProjectTimelineView';
import { ComparableProjectsTable } from '@/components/common/ComparableProjectsTable';
import { ProjectMap } from '@/components/maps/ProjectMap';
import {
  MapPin,
  Calendar,
  Building,
  ShieldAlert,
  PlusCircle,
  ArrowLeft,
  FileText,
  ExternalLink,
  ChevronRight,
  Image as ImageIcon,
  AlertCircle,
  CheckCircle,
} from 'lucide-react';

interface ProjectDetailPageProps {
  userRole?: 'citizen' | 'reviewer' | 'admin';
}

export const ProjectDetailPage: React.FC<ProjectDetailPageProps> = ({ userRole = 'citizen' }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useGovSettings();

  const [project, setProject] = useState<Project | null>(null);
  const [allProjects, setAllProjects] = useState<Project[]>([]);

  const loadProject = () => {
    if (!id) return;
    const found = store.getProjectById(id);
    if (found) {
      setProject(found);
    }
    const { projects: all } = store.getProjects({ limit: 100 });
    setAllProjects(all);
  };

  useEffect(() => {
    loadProject();
    const unsub = store.subscribe(() => loadProject());
    return () => unsub();
  }, [id]);

  if (!project) {
    return (
      <div className="max-w-4xl mx-auto py-16 px-4 text-center">
        <h2 className="text-xl font-bold text-[#123B6D] mb-2">Project Record Not Found</h2>
        <p className="text-xs text-[#5F6B7A] mb-4">The requested public project dossier could not be retrieved.</p>
        <button
          onClick={() => navigate(-1)}
          className="px-4 py-2 bg-[#0B4F9C] text-white rounded-md text-xs font-semibold hover:bg-[#123B6D]"
        >
          Return to Projects Directory
        </button>
      </div>
    );
  }

  const statusBadge = getProjectStatusBadge(project.status);
  const riskBadge = getRiskPriorityBadge(project.risk_flag?.priority_level);

  // Linked review case for reviewer/admin
  const reviewCase = store.getReviewCases().find((c) => c.project_id === project.id);

  const renderStatusBadge = (status: Project['status']) => {
    switch (status) {
      case 'COMPLETED':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-300">
            <span className="w-2 h-2 rounded-full bg-emerald-600" />
            {t('COMPLETED', 'Completed')}
          </span>
        );
      case 'IN_PROGRESS':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded text-xs font-bold bg-blue-50 text-blue-800 border border-blue-300">
            <span className="w-2 h-2 rounded-full bg-blue-600" />
            {t('IN_PROGRESS', 'Ongoing')}
          </span>
        );
      case 'DELAYED':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded text-xs font-bold bg-amber-50 text-amber-900 border border-amber-300">
            <span className="w-2 h-2 rounded-full bg-amber-600" />
            {t('DELAYED', 'Delayed')}
          </span>
        );
      case 'UNDER_REVIEW':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded text-xs font-bold bg-purple-50 text-purple-900 border border-purple-300">
            <span className="w-2 h-2 rounded-full bg-purple-600" />
            {t('UNDER_REVIEW', 'Under Review')}
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded text-xs font-bold bg-slate-100 text-slate-800 border border-slate-300">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Breadcrumb Navigation & Top Action Strip */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-xs text-[#5F6B7A]">
          <Link
            to={userRole === 'reviewer' ? '/reviewer/dashboard' : '/citizen/dashboard'}
            className="hover:text-[#0B4F9C] hover:underline"
          >
            {t('home', 'Home')}
          </Link>
          <span>/</span>
          <Link
            to={userRole === 'reviewer' ? '/reviewer/projects' : '/citizen/projects'}
            className="hover:text-[#0B4F9C] hover:underline"
          >
            {t('projects', 'Projects')}
          </Link>
          <span>/</span>
          <span className="text-slate-800 font-semibold truncate max-w-xs">{project.project_code}</span>
        </div>

        <div className="flex items-center gap-2">
          {userRole !== 'citizen' && reviewCase && (
            <Link
              to={`/reviewer/cases/${reviewCase.id}`}
              className="inline-flex items-center gap-1.5 bg-[#B7791F] hover:bg-amber-800 text-white text-xs font-semibold px-3.5 py-1.5 rounded-md shadow-2xs transition-colors"
            >
              <ShieldAlert className="w-4 h-4 text-amber-200" />
              <span>Open Review Case #{reviewCase.case_number}</span>
            </Link>
          )}

          <Link
            to={`/citizen/report-issue?project_id=${project.id}`}
            className="inline-flex items-center gap-1.5 bg-[#0B4F9C] hover:bg-[#123B6D] text-white text-xs font-semibold px-3.5 py-1.5 rounded-md shadow-2xs transition-colors"
          >
            <PlusCircle className="w-4 h-4 text-amber-300" />
            <span>{t('reportIssue', 'Report an Issue')}</span>
          </Link>
        </div>
      </div>

      {/* Official Project Dossier Header Card */}
      <div className="bg-white border border-[#D9DEE5] rounded-md p-6 shadow-2xs space-y-5">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 pb-5 border-b border-[#D9DEE5]">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-mono text-xs font-bold text-slate-700 bg-[#F7F8FA] border border-[#D9DEE5] px-2.5 py-1 rounded">
                Project ID: {project.project_code}
              </span>
              {renderStatusBadge(project.status)}
              <span className="text-xs text-slate-700 bg-slate-100 px-2.5 py-1 rounded font-medium border border-slate-200">
                {project.category?.name || 'Public Infrastructure'}
              </span>
            </div>

            <h1 className="text-xl sm:text-2xl font-bold text-[#123B6D] tracking-tight">
              {project.title}
            </h1>

            <p className="text-xs text-[#5F6B7A] flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-[#E87B18] shrink-0" />
              <span>{project.location?.address || `${project.district}, ${project.state}`}</span>
              <span>•</span>
              <span>Constituency: <strong className="text-slate-800">{project.constituency}</strong></span>
            </p>
          </div>

          {/* Role-Based Intelligence / Review Presentation (Section 22) */}
          {userRole !== 'citizen' ? (
            /* Reviewer/Admin View: Full AI Risk Analysis Metric */
            project.risk_flag && (
              <div className="bg-[#F7F8FA] border border-[#D9DEE5] p-3.5 rounded-md text-center shrink-0 min-w-[170px]">
                <span className="text-[10px] uppercase font-bold text-[#5F6B7A] block tracking-wider mb-1">
                  AI Risk Indicator
                </span>
                <div className="text-2xl font-black text-slate-900 tracking-tight">
                  {project.risk_flag.overall_score}
                  <span className="text-xs text-slate-400 font-normal"> / 100</span>
                </div>
                <span className={`inline-block mt-1 text-[11px] px-2 py-0.5 rounded font-bold uppercase ${riskBadge.className}`}>
                  {riskBadge.label} Priority
                </span>
              </div>
            )
          ) : (
            /* Citizen View: Factual Status & Review Notification (Neutral & reassuring) */
            project.status === 'UNDER_REVIEW' ? (
              <div className="bg-purple-50 border border-purple-200 p-3 rounded-md text-left max-w-xs shrink-0">
                <div className="flex items-center gap-1.5 text-purple-900 font-bold text-xs">
                  <AlertCircle className="w-4 h-4 text-purple-700" />
                  <span>Requires Review</span>
                </div>
                <p className="text-[11px] text-purple-800 mt-1 leading-snug">
                  Official verification is active. Citizens may submit on-site photographs and feedback.
                </p>
              </div>
            ) : project.status === 'DELAYED' ? (
              <div className="bg-amber-50 border border-amber-200 p-3 rounded-md text-left max-w-xs shrink-0">
                <div className="flex items-center gap-1.5 text-amber-900 font-bold text-xs">
                  <AlertCircle className="w-4 h-4 text-amber-700" />
                  <span>Milestone Delayed</span>
                </div>
                <p className="text-[11px] text-amber-800 mt-1 leading-snug">
                  Work progress is past original timeline. Expected completion schedule revised.
                </p>
              </div>
            ) : (
              <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-md text-left max-w-xs shrink-0">
                <div className="flex items-center gap-1.5 text-emerald-900 font-bold text-xs">
                  <CheckCircle className="w-4 h-4 text-emerald-700" />
                  <span>Implementation Normal</span>
                </div>
                <p className="text-[11px] text-emerald-800 mt-1 leading-snug">
                  Milestones and financial drawdowns are progressing in accordance with sanction decrees.
                </p>
              </div>
            )
          )}
        </div>

        {/* Financial Information Strip (Government format: Sanctioned, Expended, Remaining, Utilisation) */}
        <div>
          <h3 className="text-xs font-bold text-[#123B6D] uppercase tracking-wider mb-3">
            Financial Allocation & Utilisation
          </h3>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-[#F7F8FA] p-3.5 rounded-md border border-[#D9DEE5]">
              <span className="text-[11px] uppercase font-bold text-[#5F6B7A] tracking-wider block">
                {t('sanctionedAmountFull', 'Sanctioned Amount')}
              </span>
              <div className="text-xl font-bold text-slate-900 mt-1">
                {formatCurrencyLakhs(project.financials?.sanctioned_amount)}
              </div>
              <p className="text-[11px] text-[#5F6B7A] mt-0.5">Approved fiscal outlay</p>
            </div>

            <div className="bg-[#F7F8FA] p-3.5 rounded-md border border-[#D9DEE5]">
              <span className="text-[11px] uppercase font-bold text-[#5F6B7A] tracking-wider block">
                {t('expenditureAmountFull', 'Expenditure Recorded')}
              </span>
              <div className="text-xl font-bold text-slate-900 mt-1">
                {formatCurrencyLakhs(project.financials?.expenditure_amount)}
              </div>
              <p className="text-[11px] text-[#5F6B7A] mt-0.5">Disbursed to contractor/agency</p>
            </div>

            <div className="bg-[#F7F8FA] p-3.5 rounded-md border border-[#D9DEE5]">
              <span className="text-[11px] uppercase font-bold text-[#5F6B7A] tracking-wider block">
                {t('remainingAmountFull', 'Remaining Balance')}
              </span>
              <div className="text-xl font-bold text-slate-900 mt-1">
                {formatCurrencyLakhs(project.financials?.remaining_amount)}
              </div>
              <p className="text-[11px] text-[#5F6B7A] mt-0.5">Undisbursed allocation</p>
            </div>

            <div className="bg-[#F7F8FA] p-3.5 rounded-md border border-[#D9DEE5]">
              <span className="text-[11px] uppercase font-bold text-[#5F6B7A] tracking-wider block">
                {t('utilisationPercentage', 'Fund Utilisation')}
              </span>
              <div className="text-xl font-bold text-[#0B4F9C] mt-1">
                {project.financials?.utilisation_percentage || 0}%
              </div>
              <div className="w-full bg-slate-200 h-1.5 rounded-full mt-2 overflow-hidden">
                <div
                  className="bg-[#0B4F9C] h-full rounded-full"
                  style={{ width: `${Math.min(100, project.financials?.utilisation_percentage || 0)}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Details, Timeline, Map, Ground Verification */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Scope, Timelines, Location, Sector Benchmarks */}
        <div className="lg:col-span-2 space-y-6">
          {/* Project Scope & Administrative Implementing Agency */}
          <div className="bg-white border border-[#D9DEE5] rounded-md p-5 shadow-2xs space-y-4">
            <h3 className="font-bold text-sm text-[#123B6D] uppercase tracking-wide">
              Project Overview & Administrative Responsibility
            </h3>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">{project.description}</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-slate-100">
              <div className="p-3 bg-[#F7F8FA] rounded-md border border-[#D9DEE5]">
                <span className="text-[10px] uppercase font-bold text-[#5F6B7A] block mb-1">
                  Implementing Government Agency
                </span>
                <p className="text-xs font-bold text-[#123B6D]">{project.agency?.name || 'Department of Public Works'}</p>
                <p className="text-[11px] text-[#5F6B7A] mt-0.5">Dept: {project.agency?.department || 'Public Works'}</p>
                <p className="text-[11px] text-[#5F6B7A]">Nodal Officer: {project.agency?.contact_person || 'Executive Engineer'}</p>
              </div>

              <div className="p-3 bg-[#F7F8FA] rounded-md border border-[#D9DEE5]">
                <span className="text-[10px] uppercase font-bold text-[#5F6B7A] block mb-1">
                  Executing Contractor / Vendor
                </span>
                <p className="text-xs font-bold text-[#123B6D]">{project.contractor?.company_name || 'Direct Department Execution'}</p>
                <p className="text-[11px] text-[#5F6B7A] mt-0.5">Reg Number: {project.contractor?.registration_number || 'N/A'}</p>
                <p className="text-[11px] text-[#5F6B7A]">Technical Rating: ★ {project.contractor?.rating || '4.0'} / 5.0</p>
              </div>
            </div>
          </div>

          {/* Explainable AI Risk Card (Rendered for reviewer/admin, or neutral format for citizen) */}
          {userRole !== 'citizen' ? (
            <ExplainableRiskCard riskFlag={project.risk_flag} />
          ) : (
            /* Neutral Citizen Contributing Factors Card */
            project.risk_flag && (
              <div className="bg-white border border-[#D9DEE5] rounded-md p-5 shadow-2xs space-y-3">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <h3 className="font-bold text-sm text-[#123B6D]">
                    Project Review Status & Observation Factors
                  </h3>
                  <span className="text-xs font-semibold text-[#0B4F9C]">Official Public Log</span>
                </div>
                <p className="text-xs text-[#5F6B7A]">
                  This project is prioritized for human review based on verifiable on-site and administrative indicators:
                </p>
                <div className="space-y-2 pt-1">
                  {project.risk_flag.factors?.map((f, i) => (
                    <div key={i} className="flex items-start gap-2.5 p-2.5 rounded bg-[#F7F8FA] border border-slate-200">
                      <div className="w-2 h-2 rounded-full bg-[#0B4F9C] mt-1.5 shrink-0" />
                      <div>
                        <span className="text-xs font-bold text-slate-800">{f.factor_name}: </span>
                        <span className="text-xs text-[#5F6B7A]">{f.explanation}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )
          )}

          {/* Project Timeline View */}
          {project.timelines && project.timelines.length > 0 && (
            <ProjectTimelineView events={project.timelines} />
          )}

          {/* Geospatial Map */}
          <div className="bg-white border border-[#D9DEE5] rounded-md p-5 shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-[#123B6D]">Project Geospatial Location</h3>
              <span className="text-xs text-[#5F6B7A] font-mono">
                {project.location?.latitude?.toFixed(4)}, {project.location?.longitude?.toFixed(4)}
              </span>
            </div>
            <div className="rounded border border-slate-200 overflow-hidden">
              <ProjectMap
                projects={[project]}
                selectedProjectId={project.id}
                height="300px"
                userRole={userRole}
              />
            </div>
          </div>

          {/* Sector Comparable Projects Benchmark */}
          <ComparableProjectsTable
            currentProject={project}
            peerProjects={allProjects}
            baseRoute={userRole === 'reviewer' ? '/reviewer/projects' : '/citizen/projects'}
          />
        </div>

        {/* Right 1 Col: Project Health & Ground Verification Reports */}
        <div className="space-y-6">
          <ProjectHealthCard project={project} />

          {/* Ground Verification & Citizen Reports */}
          <div className="bg-white border border-[#D9DEE5] rounded-md p-5 shadow-2xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-bold text-sm text-[#123B6D]">Ground Verification</h3>
                <p className="text-xs text-[#5F6B7A]">Citizen observations & photographic evidence</p>
              </div>
              <span className="text-xs font-bold bg-blue-100 text-[#0B4F9C] px-2 py-0.5 rounded">
                {project.citizen_reports?.length || 0} reports
              </span>
            </div>

            {(!project.citizen_reports || project.citizen_reports.length === 0) ? (
              <div className="py-6 text-center text-slate-400 text-xs">
                No citizen observations recorded for this project yet.
                <div className="mt-3">
                  <Link
                    to={`/citizen/report-issue?project_id=${project.id}`}
                    className="text-[#0B4F9C] font-semibold text-xs hover:underline"
                  >
                    Submit the first ground observation
                  </Link>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                {project.citizen_reports.map((rep) => (
                  <div key={rep.id} className="p-3.5 bg-[#F7F8FA] rounded-md border border-[#D9DEE5] space-y-2">
                    <div className="flex items-center justify-between gap-1">
                      <span className="text-xs font-mono font-bold text-slate-800">{rep.report_code}</span>
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-blue-50 text-blue-800 border border-blue-200">
                        {rep.status.replace(/_/g, ' ')}
                      </span>
                    </div>

                    <div className="text-[11px] font-medium text-slate-600 bg-white px-2 py-1 rounded border border-slate-200">
                      Observation: {rep.issue_category}
                    </div>

                    <p className="text-xs text-slate-700 leading-relaxed">{rep.description}</p>

                    {/* Evidence Attachment preview */}
                    {rep.evidence && rep.evidence.length > 0 && (
                      <div className="pt-1">
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wide block mb-1 flex items-center gap-1">
                          <ImageIcon className="w-3 h-3 text-slate-400" />
                          Photo Evidence Attached ({rep.evidence.length})
                        </span>
                        <div className="space-y-1.5">
                          {rep.evidence.map((ev) => (
                            <div key={ev.id} className="group relative rounded overflow-hidden border border-slate-200">
                              <img
                                src={ev.file_url}
                                alt={ev.caption || 'Evidence'}
                                className="w-full h-36 object-cover"
                              />
                              {ev.caption && (
                                <p className="text-[10px] text-slate-600 p-1.5 bg-white border-t border-slate-100">
                                  {ev.caption}
                                </p>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="text-[10px] text-[#5F6B7A] pt-1 flex items-center justify-between border-t border-slate-100">
                      <span>Observed: {formatDate(rep.observation_date)}</span>
                      <span>Verified Citizen</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
