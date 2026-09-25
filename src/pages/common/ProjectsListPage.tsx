// Nidhiनेत्र: Public Projects Directory & Discovery Page
// Smart India Hackathon 2026 — UX4G 3.0 & GIGW 3.0 Compliance

import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { store } from '@/lib/database/store';
import { Project, ProjectCategory, RiskPriority } from '@/types';
import { useGovSettings } from '@/app/providers/GovSettingsProvider';
import {
  formatCurrencyLakhs,
  getProjectStatusBadge,
  getRiskPriorityBadge,
  formatDate,
} from '@/lib/utils/formatters';
import {
  Search,
  Filter,
  MapPin,
  Building,
  ArrowRight,
  PlusCircle,
  X,
  ChevronRight,
  Download,
} from 'lucide-react';

interface ProjectsListPageProps {
  userRole?: 'citizen' | 'reviewer' | 'admin';
}

export const ProjectsListPage: React.FC<ProjectsListPageProps> = ({ userRole = 'citizen' }) => {
  const [searchParams] = useSearchParams();
  const { t, selectedConstituency } = useGovSettings();

  const [categories, setCategories] = useState<ProjectCategory[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [total, setTotal] = useState(0);

  // Filter States
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'ALL');
  const [selectedStatus, setSelectedStatus] = useState(searchParams.get('status') || 'ALL');
  const [selectedRisk, setSelectedRisk] = useState<RiskPriority | 'ALL'>(
    (searchParams.get('risk') as RiskPriority) || 'ALL'
  );
  const [sortBy, setSortBy] = useState<'date_desc' | 'amount_desc' | 'risk_desc' | 'title_asc'>('date_desc');

  useEffect(() => {
    setCategories(store.getCategories());
  }, []);

  const fetchFilteredProjects = () => {
    const res = store.getProjects({
      search: searchQuery,
      category_id: selectedCategory,
      status: selectedStatus,
      risk_level: selectedRisk,
      sort_by: sortBy,
      limit: 100,
    });
    setProjects(res.projects);
    setTotal(res.total);
  };

  useEffect(() => {
    fetchFilteredProjects();
    const unsub = store.subscribe(() => fetchFilteredProjects());
    return () => unsub();
  }, [searchQuery, selectedCategory, selectedStatus, selectedRisk, sortBy]);

  const handleClearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('ALL');
    setSelectedStatus('ALL');
    setSelectedRisk('ALL');
    setSortBy('date_desc');
  };

  const getDetailPath = (id: string) => {
    if (userRole === 'reviewer') return `/reviewer/projects/${id}`;
    if (userRole === 'admin') return `/admin/projects/${id}`;
    return `/citizen/projects/${id}`;
  };

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
      {/* Page Header (UX4G Standard) */}
      <div className="bg-white border border-[#D9DEE5] rounded-md p-5 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-[#5F6B7A] mb-1">
            <Link to="/citizen/dashboard" className="hover:text-[#0B4F9C] hover:underline">
              {t('home', 'Home')}
            </Link>
            <span>/</span>
            <span className="text-[#1F2937] font-semibold">{t('projects', 'Projects')}</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#123B6D] tracking-tight">
            Public Development Projects
          </h1>
          <p className="text-xs sm:text-sm text-[#5F6B7A] mt-0.5">
            Browse development projects, sanctioned funds, and ground verification records in Nashik District.
          </p>
        </div>

        {userRole === 'citizen' && (
          <Link
            to="/citizen/report-issue"
            className="inline-flex items-center gap-2 bg-[#0B4F9C] hover:bg-[#123B6D] text-white text-xs sm:text-sm font-semibold px-4 py-2 rounded-md shadow-2xs transition-colors shrink-0"
          >
            <PlusCircle className="w-4 h-4 text-amber-300" />
            <span>{t('reportIssue', 'Report an Issue')}</span>
          </Link>
        )}
      </div>

      {/* Filter and Search Controls (Clean Government Form Style) */}
      <div className="bg-white border border-[#D9DEE5] rounded-md p-4 shadow-2xs space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          {/* Search Input */}
          <div className="md:col-span-4 relative">
            <label className="block text-[11px] font-bold text-[#123B6D] uppercase mb-1">
              Search Projects
            </label>
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by project name, ID, or location..."
                className="w-full pl-9 pr-8 py-2 bg-white border border-[#D9DEE5] rounded-md text-xs text-[#1F2937] focus:ring-1 focus:ring-[#0B4F9C] focus:border-[#0B4F9C] focus:outline-hidden"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Sector Category */}
          <div className="md:col-span-3">
            <label className="block text-[11px] font-bold text-[#123B6D] uppercase mb-1">
              Sector / Category
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full py-2 px-3 bg-white border border-[#D9DEE5] rounded-md text-xs text-[#1F2937] focus:border-[#0B4F9C] focus:outline-hidden"
            >
              <option value="ALL">All Sectors</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div className="md:col-span-3">
            <label className="block text-[11px] font-bold text-[#123B6D] uppercase mb-1">
              Project Status
            </label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full py-2 px-3 bg-white border border-[#D9DEE5] rounded-md text-xs text-[#1F2937] focus:border-[#0B4F9C] focus:outline-hidden"
            >
              <option value="ALL">All Statuses</option>
              <option value="SANCTIONED">Sanctioned</option>
              <option value="IN_PROGRESS">Ongoing</option>
              <option value="DELAYED">Delayed</option>
              <option value="UNDER_REVIEW">Under Review</option>
              <option value="COMPLETED">Completed</option>
            </select>
          </div>

          {/* Sort By */}
          <div className="md:col-span-2">
            <label className="block text-[11px] font-bold text-[#123B6D] uppercase mb-1">
              Sort By
            </label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full py-2 px-3 bg-white border border-[#D9DEE5] rounded-md text-xs text-[#1F2937] focus:border-[#0B4F9C] focus:outline-hidden"
            >
              <option value="date_desc">Latest Sanction</option>
              <option value="amount_desc">Highest Budget</option>
              <option value="title_asc">Name A-Z</option>
            </select>
          </div>
        </div>

        {/* Filter Summary & Reset */}
        <div className="flex items-center justify-between text-xs text-[#5F6B7A] pt-2 border-t border-slate-100">
          <span>
            Showing <strong className="text-[#123B6D]">{projects.length}</strong> of {total} development records
          </span>
          {(searchQuery || selectedCategory !== 'ALL' || selectedStatus !== 'ALL') && (
            <button
              onClick={handleClearFilters}
              className="text-[#0B4F9C] hover:underline font-semibold flex items-center gap-1"
            >
              <X className="w-3.5 h-3.5" />
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Projects Table View (Desktop) / Cards (Mobile) */}
      <div className="bg-white border border-[#D9DEE5] rounded-md shadow-2xs overflow-hidden">
        {projects.length === 0 ? (
          <div className="p-12 text-center text-[#5F6B7A]">
            <Filter className="w-10 h-10 mx-auto text-slate-300 mb-2" />
            <h3 className="text-base font-bold text-slate-800">No Projects Found</h3>
            <p className="text-xs text-[#5F6B7A] max-w-sm mx-auto mt-1 mb-4">
              No development records match your specified search and filter criteria.
            </p>
            <button
              onClick={handleClearFilters}
              className="px-4 py-2 bg-[#0B4F9C] text-white rounded-md text-xs font-semibold hover:bg-[#123B6D]"
            >
              Clear All Filters
            </button>
          </div>
        ) : (
          <>
            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#F7F8FA] border-b border-[#D9DEE5] text-[#5F6B7A] uppercase text-[11px] font-semibold">
                  <tr>
                    <th className="py-3 px-4">Project ID</th>
                    <th className="py-3 px-4">Project Name & Agency</th>
                    <th className="py-3 px-4">Location</th>
                    <th className="py-3 px-4">Sector</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Sanctioned & Utilisation</th>
                    <th className="py-3 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#D9DEE5]">
                  {projects.map((project) => (
                    <tr key={project.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-4 font-mono font-medium text-slate-700 whitespace-nowrap">
                        {project.project_code}
                      </td>
                      <td className="py-3 px-4">
                        <Link
                          to={getDetailPath(project.id)}
                          className="font-bold text-[#123B6D] hover:text-[#0B4F9C] hover:underline line-clamp-1"
                        >
                          {project.title}
                        </Link>
                        <span className="text-[11px] text-[#5F6B7A] line-clamp-1">
                          {project.agency?.name || 'Department of Public Works'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-700 whitespace-nowrap">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-slate-400" />
                          {project.district}, {project.constituency}
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
                          to={getDetailPath(project.id)}
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

            {/* Mobile Card View */}
            <div className="md:hidden divide-y divide-[#D9DEE5]">
              {projects.map((project) => (
                <div key={project.id} className="p-4 space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <span className="font-mono text-xs text-slate-500 font-semibold">
                      {project.project_code}
                    </span>
                    {renderStatusBadge(project.status)}
                  </div>
                  <h3 className="font-bold text-[#123B6D] text-sm">
                    <Link to={getDetailPath(project.id)}>{project.title}</Link>
                  </h3>
                  <p className="text-xs text-[#5F6B7A] flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-slate-400" />
                    {project.district}, {project.constituency} • {project.category?.name}
                  </p>
                  <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                    <div>
                      <span className="text-[#5F6B7A]">Sanctioned: </span>
                      <span className="font-bold text-slate-900">
                        {formatCurrencyLakhs(project.financials?.sanctioned_amount)}
                      </span>
                    </div>
                    <Link
                      to={getDetailPath(project.id)}
                      className="font-semibold text-[#0B4F9C] flex items-center gap-0.5"
                    >
                      <span>{t('viewDetails', 'Details')}</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};
