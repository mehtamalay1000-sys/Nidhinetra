// Nidhiनेत्र: Citizen Dashboard (Redesigned per UX4G 3.0 & GIGW 3.0)
// Smart India Hackathon 2026
// Information Hierarchy: Welcome -> Location -> Project Summary -> Projects Near You -> Projects Requiring Attention -> My Reports -> Map -> Recent Updates

import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '@/app/providers/AuthProvider';
import { useGovSettings } from '@/app/providers/GovSettingsProvider';
import { store } from '@/lib/database/store';
import { Project, CitizenReport } from '@/types';
import { formatCurrencyLakhs, formatDate } from '@/lib/utils/formatters';
import { ProjectMap } from '@/components/maps/ProjectMap';
import { Link } from 'react-router-dom';
import {
  MapPin,
  PlusCircle,
  ArrowRight,
  FileText,
  Clock,
  AlertTriangle,
  CheckCircle2,
  HelpCircle,
  ExternalLink,
  ChevronRight,
  Filter,
} from 'lucide-react';

export const CitizenDashboard: React.FC = () => {
  const { user } = useAuth();
  const { t, selectedConstituency } = useGovSettings();
  const [allProjects, setAllProjects] = useState<Project[]>([]);
  const [myReports, setMyReports] = useState<CitizenReport[]>([]);

  const loadData = () => {
    const { projects } = store.getProjects({ limit: 100 });
    setAllProjects(projects);
    if (user) {
      setMyReports(store.getCitizenReports(user.id));
    }
  };

  useEffect(() => {
    loadData();
    const unsub = store.subscribe(() => loadData());
    return () => unsub();
  }, [user]);

  // Filter projects by location if a specific constituency is selected
  const filteredProjects = useMemo(() => {
    if (!selectedConstituency || selectedConstituency === 'All Nashik District') {
      return allProjects;
    }
    const matching = allProjects.filter(
      (p) => p.constituency?.toLowerCase() === selectedConstituency.toLowerCase()
    );
    // If fewer than 2 match the specific constituency, return all projects so citizen always sees rich data
    return matching.length > 0 ? matching : allProjects;
  }, [allProjects, selectedConstituency]);

  // Summary Metrics based on filtered projects
  const totalCount = filteredProjects.length;
  const ongoingCount = filteredProjects.filter((p) => p.status === 'IN_PROGRESS').length;
  const delayedCount = filteredProjects.filter((p) => p.status === 'DELAYED').length;
  const underReviewCount = filteredProjects.filter((p) => p.status === 'UNDER_REVIEW').length;
  const completedCount = filteredProjects.filter((p) => p.status === 'COMPLETED').length;

  // Projects requiring attention (factual, neutral wording: Delayed or Under Review)
  const projectsToReview = useMemo(() => {
    return filteredProjects
      .filter((p) => p.status === 'UNDER_REVIEW' || p.status === 'DELAYED')
      .slice(0, 3);
  }, [filteredProjects]);

  // Recent simulated government project updates list
  const recentUpdates = [
    {
      date: '18 Sep 2026',
      title: 'Rural Road Improvement (Vani Rural Link)',
      note: 'Field verification initiated following citizen ground report.',
      status: 'UNDER_REVIEW',
    },
    {
      date: '16 Sep 2026',
      title: 'Community Health Centre Upgradation',
      note: 'OPD block electrical fitting milestone completed by executing agency.',
      status: 'IN_PROGRESS',
    },
    {
      date: '12 Sep 2026',
      title: 'Village Water Supply & Overhead Reservoir',
      note: 'Final site audit completed. Water distribution network commissioned.',
      status: 'COMPLETED',
    },
  ];

  // Helper for government status badge (neutral, accessible)
  const renderStatusBadge = (status: Project['status']) => {
    switch (status) {
      case 'COMPLETED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-300">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
            {t('COMPLETED', 'Completed')}
          </span>
        );
      case 'IN_PROGRESS':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-xs font-semibold bg-blue-50 text-blue-800 border border-blue-300">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
            {t('IN_PROGRESS', 'Ongoing')}
          </span>
        );
      case 'DELAYED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-xs font-semibold bg-amber-50 text-amber-900 border border-amber-300">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-600" />
            {t('DELAYED', 'Delayed')}
          </span>
        );
      case 'UNDER_REVIEW':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-xs font-semibold bg-purple-50 text-purple-900 border border-purple-300">
            <span className="w-1.5 h-1.5 rounded-full bg-purple-600" />
            {t('UNDER_REVIEW', 'Under Review')}
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-800 border border-slate-300">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* 1. WELCOME SECTION (Clean, light government style — NO giant dark-blue hero) */}
      <section className="bg-white border border-[#D9DEE5] rounded-md p-5 sm:p-6 shadow-2xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="space-y-2 max-w-2xl">
            {/* Location Tag */}
            <div className="inline-flex items-center gap-1.5 text-xs text-[#0B4F9C] font-semibold bg-blue-50 px-2.5 py-1 rounded border border-blue-200">
              <MapPin className="w-3.5 h-3.5 text-[#E87B18]" />
              <span>{selectedConstituency} Constituency, Nashik, Maharashtra</span>
            </div>

            <h1 className="text-xl sm:text-2xl font-bold text-[#123B6D] tracking-tight">
              {t('namaste', 'Namaste')}, {user?.full_name || 'Citizen'}
            </h1>

            <p className="text-sm text-[#5F6B7A] leading-relaxed">
              {t(
                'welcomeSubtitle',
                'View public development projects in your area and report ground-level observations.'
              )}
            </p>
          </div>

          {/* Quick Action CTAs */}
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <Link
              to="/citizen/report-issue"
              className="inline-flex items-center gap-2 bg-[#0B4F9C] hover:bg-[#123B6D] text-white text-xs sm:text-sm font-semibold px-4 py-2.5 rounded-md shadow-2xs transition-colors"
            >
              <PlusCircle className="w-4 h-4 text-amber-300" />
              <span>{t('reportIssue', 'Report an Issue')}</span>
            </Link>
            <Link
              to="/citizen/projects"
              className="inline-flex items-center gap-1.5 bg-white hover:bg-slate-50 text-[#0B4F9C] border border-[#0B4F9C] text-xs sm:text-sm font-semibold px-4 py-2.5 rounded-md transition-colors"
            >
              <span>{t('exploreProjects', 'Explore Projects')}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* 2. DASHBOARD QUICK SUMMARY STRIP (Government style, restrained border strip) */}
      <section className="bg-white border border-[#D9DEE5] rounded-md p-4 shadow-2xs">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
          <span className="text-xs font-bold text-[#123B6D] uppercase tracking-wider">
            {t('projectsInArea', 'PROJECTS IN YOUR AREA')} — {selectedConstituency}
          </span>
          <span className="text-[11px] text-[#5F6B7A]">Official Collectorate Records</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 divide-y sm:divide-y-0 sm:divide-x divide-slate-200">
          <div className="py-2 sm:py-0 sm:px-4 text-left">
            <span className="text-2xl font-black text-slate-900 block leading-tight">{totalCount}</span>
            <span className="text-xs font-medium text-[#5F6B7A]">{t('totalProjects', 'Total Projects')}</span>
          </div>

          <div className="py-2 sm:py-0 sm:px-4 text-left">
            <span className="text-2xl font-black text-[#0B4F9C] block leading-tight">{ongoingCount}</span>
            <span className="text-xs font-medium text-[#5F6B7A]">{t('ongoingProjects', 'Ongoing')}</span>
          </div>

          <div className="py-2 sm:py-0 sm:px-4 text-left">
            <span className="text-2xl font-black text-amber-700 block leading-tight">{delayedCount}</span>
            <span className="text-xs font-medium text-[#5F6B7A]">{t('delayedProjects', 'Delayed')}</span>
          </div>

          <div className="py-2 sm:py-0 sm:px-4 text-left">
            <span className="text-2xl font-black text-purple-800 block leading-tight">{underReviewCount}</span>
            <span className="text-xs font-medium text-[#5F6B7A]">{t('underReviewProjects', 'Under Review')}</span>
          </div>

          <div className="py-2 sm:py-0 sm:px-4 text-left">
            <span className="text-2xl font-black text-[#2E7D32] block leading-tight">{completedCount}</span>
            <span className="text-xs font-medium text-[#5F6B7A]">{t('completedProjects', 'Completed')}</span>
          </div>
        </div>
      </section>

      {/* 3. PRIMARY CONTENT: "PROJECTS NEAR YOU" (Desktop Data Table / Mobile Cards) */}
      <section className="bg-white border border-[#D9DEE5] rounded-md shadow-2xs overflow-hidden">
        <div className="px-5 py-4 border-b border-[#D9DEE5] flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-base font-bold text-[#123B6D]">
              {t('projectsNearYou', 'Projects Near You')}
            </h2>
            <p className="text-xs text-[#5F6B7A]">
              {t('projectsNearYouSub', 'Public development projects in')} {selectedConstituency}
            </p>
          </div>
          <Link
            to="/citizen/projects"
            className="text-xs font-semibold text-[#0B4F9C] hover:text-[#123B6D] hover:underline flex items-center gap-1"
          >
            <span>{t('viewAll', 'View all projects')} ({filteredProjects.length})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Desktop Table View */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F7F8FA] border-b border-[#D9DEE5] text-[#5F6B7A] uppercase text-[11px] font-semibold">
              <tr>
                <th className="py-3 px-4">Project ID</th>
                <th className="py-3 px-4">Project Name</th>
                <th className="py-3 px-4">Location</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Sanctioned & Utilisation</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#D9DEE5]">
              {filteredProjects.slice(0, 5).map((project) => (
                <tr key={project.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-4 font-mono font-medium text-slate-700 whitespace-nowrap">
                    {project.project_code}
                  </td>
                  <td className="py-3 px-4">
                    <Link
                      to={`/citizen/projects/${project.id}`}
                      className="font-bold text-[#123B6D] hover:text-[#0B4F9C] hover:underline line-clamp-1"
                    >
                      {project.title}
                    </Link>
                    <span className="text-[11px] text-[#5F6B7A] line-clamp-1">
                      {project.agency?.name || 'Executing Agency'}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-700 whitespace-nowrap">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-slate-400" />
                      {project.constituency}
                    </span>
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap">
                    <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-[11px] font-medium border border-slate-200">
                      {project.category?.name || 'Infrastructure'}
                    </span>
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap">
                    {renderStatusBadge(project.status)}
                  </td>
                  <td className="py-3 px-4 text-right whitespace-nowrap">
                    <div className="font-bold text-slate-900">
                      {formatCurrencyLakhs(project.financials?.sanctioned_amount)}
                    </div>
                    <div className="text-[11px] text-[#0B4F9C] font-semibold">
                      {project.financials?.utilisation_percentage || 0}% utilised
                    </div>
                  </td>
                  <td className="py-3 px-4 text-right whitespace-nowrap">
                    <Link
                      to={`/citizen/projects/${project.id}`}
                      className="inline-flex items-center gap-1 bg-white hover:bg-slate-100 text-[#0B4F9C] border border-[#D9DEE5] px-2.5 py-1 rounded text-xs font-semibold transition-colors"
                    >
                      <span>{t('viewDetails', 'View Details')}</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards View */}
        <div className="md:hidden divide-y divide-[#D9DEE5]">
          {filteredProjects.slice(0, 4).map((project) => (
            <div key={project.id} className="p-4 space-y-2">
              <div className="flex items-start justify-between gap-2">
                <span className="font-mono text-xs text-slate-500 font-semibold">
                  {project.project_code}
                </span>
                {renderStatusBadge(project.status)}
              </div>
              <h3 className="font-bold text-[#123B6D] text-sm">
                <Link to={`/citizen/projects/${project.id}`}>{project.title}</Link>
              </h3>
              <p className="text-xs text-[#5F6B7A] flex items-center gap-1">
                <MapPin className="w-3 h-3 text-slate-400" />
                {project.constituency} • {project.category?.name}
              </p>
              <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                <div>
                  <span className="text-[#5F6B7A]">Sanctioned: </span>
                  <span className="font-bold text-slate-900">
                    {formatCurrencyLakhs(project.financials?.sanctioned_amount)}
                  </span>
                </div>
                <Link
                  to={`/citizen/projects/${project.id}`}
                  className="font-semibold text-[#0B4F9C] flex items-center gap-0.5"
                >
                  <span>{t('viewDetails', 'Details')}</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. PROJECTS REQUIRING ATTENTION (Neutral Citizen Wording — NOT an AI surveillance badge) */}
      {projectsToReview.length > 0 && (
        <section className="bg-white border border-[#D9DEE5] rounded-md p-5 shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h2 className="text-base font-bold text-[#123B6D]">
                {t('projectsToReview', 'Projects Requiring Attention')}
              </h2>
              <p className="text-xs text-[#5F6B7A]">
                {projectsToReview.length} {t('projectsToReviewSub', 'projects currently under official review or milestone delay in your area.')}
              </p>
            </div>
            <Link
              to="/citizen/projects?status=UNDER_REVIEW"
              className="text-xs font-semibold text-[#0B4F9C] hover:underline flex items-center gap-1"
            >
              <span>{t('viewAll', 'View all')}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {projectsToReview.map((project) => (
              <div
                key={project.id}
                className="border border-[#D9DEE5] rounded-md p-4 hover:border-slate-400 transition-colors flex flex-col justify-between bg-[#F7F8FA]"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-mono text-[11px] text-slate-500 font-semibold">
                      {project.project_code}
                    </span>
                    {renderStatusBadge(project.status)}
                  </div>

                  <h3 className="font-bold text-[#123B6D] text-sm line-clamp-1">{project.title}</h3>
                  <p className="text-xs text-[#5F6B7A] line-clamp-2">
                    {project.status === 'UNDER_REVIEW'
                      ? 'Official ground verification requested. Citizens can submit on-site photographs.'
                      : 'Milestone progress is delayed relative to sanctioned completion date.'}
                  </p>

                  <div className="pt-2 text-xs text-slate-700 flex justify-between">
                    <span>Sanctioned: <strong>{formatCurrencyLakhs(project.financials?.sanctioned_amount)}</strong></span>
                    <span>Utilised: <strong className="text-[#0B4F9C]">{project.financials?.utilisation_percentage || 0}%</strong></span>
                  </div>
                </div>

                <div className="pt-3 mt-3 border-t border-slate-200 flex items-center justify-between text-xs">
                  <Link
                    to={`/citizen/report-issue?project_id=${project.id}`}
                    className="text-[#E87B18] hover:text-amber-800 font-semibold flex items-center gap-1"
                  >
                    <PlusCircle className="w-3.5 h-3.5" />
                    <span>Report Ground Update</span>
                  </Link>
                  <Link
                    to={`/citizen/projects/${project.id}`}
                    className="text-[#0B4F9C] font-semibold hover:underline"
                  >
                    {t('viewDetails', 'Details')} &rarr;
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 5. CITIZEN'S SUBMITTED REPORTS SECTION ("My Reports") */}
      {myReports.length > 0 && (
        <section className="bg-white border border-[#D9DEE5] rounded-md p-5 shadow-2xs space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h2 className="text-base font-bold text-[#123B6D]">{t('myReports', 'My Reports')}</h2>
              <p className="text-xs text-[#5F6B7A]">Track the review status of observations you submitted</p>
            </div>
            <Link
              to="/citizen/reports"
              className="text-xs font-semibold text-[#0B4F9C] hover:underline flex items-center gap-1"
            >
              <span>{t('viewAll', 'View all')} ({myReports.length})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="divide-y divide-slate-100">
            {myReports.slice(0, 3).map((r) => (
              <div key={r.id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded bg-blue-50 text-[#0B4F9C] mt-0.5 shrink-0">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-slate-800">{r.report_code}</span>
                      <span className="text-[11px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-medium border border-slate-200">
                        {r.issue_category}
                      </span>
                    </div>
                    <p className="text-xs text-slate-700 line-clamp-1">{r.description}</p>
                    <p className="text-[11px] text-[#5F6B7A]">
                      Submitted: {formatDate(r.created_at, true)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 justify-between sm:justify-end shrink-0 pl-11 sm:pl-0">
                  <span className="text-xs font-semibold px-2.5 py-0.5 rounded bg-amber-50 text-amber-900 border border-amber-300">
                    {r.status.replace(/_/g, ' ')}
                  </span>
                  <Link
                    to="/citizen/reports"
                    className="text-xs font-semibold text-[#0B4F9C] hover:underline"
                  >
                    {t('viewReport', 'View Report')}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 6. CITIZEN REPORTING ACTION PANEL (Government service-style prompt) */}
      <section className="bg-[#EBF3FA] border border-[#BFDBFE] rounded-md p-5 shadow-2xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5 max-w-2xl">
            <h3 className="font-bold text-[#123B6D] text-base">
              {t('reportActionTitle', 'Have you noticed an issue with a public project?')}
            </h3>
            <p className="text-xs text-[#5F6B7A] leading-relaxed">
              {t(
                'reportActionPrompt',
                'Submit ground observations, geo-tagged photos, and construction milestone feedback for official verification.'
              )}
            </p>
            <div className="flex flex-wrap gap-2 pt-1 text-[11px] text-slate-700">
              <span className="bg-white px-2 py-0.5 rounded border border-blue-200 font-medium">
                • {t('workNotStarted', 'Work Not Started')}
              </span>
              <span className="bg-white px-2 py-0.5 rounded border border-blue-200 font-medium">
                • {t('workDelayed', 'Work Delayed')}
              </span>
              <span className="bg-white px-2 py-0.5 rounded border border-blue-200 font-medium">
                • {t('workIncomplete', 'Work Appears Incomplete')}
              </span>
              <span className="bg-white px-2 py-0.5 rounded border border-blue-200 font-medium">
                • {t('qualityConcern', 'Quality Concern')}
              </span>
            </div>
          </div>

          <Link
            to="/citizen/report-issue"
            className="inline-flex items-center justify-center gap-2 bg-[#0B4F9C] hover:bg-[#123B6D] text-white text-xs sm:text-sm font-semibold px-4 py-2.5 rounded-md shadow-2xs transition-colors shrink-0"
          >
            <PlusCircle className="w-4 h-4 text-amber-300" />
            <span>{t('reportIssue', 'Report an Issue')}</span>
          </Link>
        </div>
      </section>

      {/* 7. PROJECT MAP PREVIEW & RECENT UPDATES (Side by Side Grid) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Map Preview (2 cols) */}
        <div className="lg:col-span-2 bg-white border border-[#D9DEE5] rounded-md p-5 shadow-2xs space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h2 className="text-base font-bold text-[#123B6D]">
                {t('interactiveMapPreview', 'Projects in Your Area')}
              </h2>
              <p className="text-xs text-[#5F6B7A]">Geographic locations of public development works in Nashik</p>
            </div>
            <Link
              to="/citizen/map"
              className="text-xs font-semibold text-[#0B4F9C] hover:underline flex items-center gap-1"
            >
              <span>{t('openFullMap', 'Open Full Map')}</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="rounded border border-slate-200 overflow-hidden">
            <ProjectMap projects={filteredProjects} height="360px" userRole="citizen" />
          </div>
        </div>

        {/* Recent Updates Timeline (1 col) */}
        <div className="bg-white border border-[#D9DEE5] rounded-md p-5 shadow-2xs space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <h2 className="text-base font-bold text-[#123B6D]">
              {t('recentUpdates', 'Recent Project Updates')}
            </h2>
            <p className="text-xs text-[#5F6B7A]">Chronological public updates</p>
          </div>

          <div className="space-y-4 relative before:absolute before:inset-0 before:left-2 before:w-0.5 before:bg-slate-200">
            {recentUpdates.map((item, idx) => (
              <div key={idx} className="relative flex items-start gap-3 pl-6">
                <span className="absolute left-1 top-1.5 w-2.5 h-2.5 rounded-full bg-[#0B4F9C] ring-4 ring-blue-50" />
                <div className="space-y-1">
                  <span className="text-[11px] font-semibold text-slate-500 block">{item.date}</span>
                  <h4 className="text-xs font-bold text-[#123B6D] leading-tight">{item.title}</h4>
                  <p className="text-xs text-[#5F6B7A] leading-relaxed">{item.note}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
