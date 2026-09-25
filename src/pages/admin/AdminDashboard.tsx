// Nidhiनेत्र: District Administration Dashboard (UX4G 3.0 Standards)
// Smart India Hackathon 2026

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/app/providers/AuthProvider';
import { store } from '@/lib/database/store';
import { Project, UserProfile } from '@/types';
import { formatCurrencyLakhs, formatDate } from '@/lib/utils/formatters';
import { Link } from 'react-router-dom';
import {
  ShieldCheck,
  FolderPlus,
  Users,
  FileSpreadsheet,
  SlidersHorizontal,
  ChevronRight,
  Database,
  History,
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [users, setUsers] = useState<UserProfile[]>([]);

  const loadData = () => {
    const { projects: projs } = store.getProjects({ limit: 100 });
    setProjects(projs);
    setUsers(store.getProfiles());
  };

  useEffect(() => {
    loadData();
    const unsub = store.subscribe(() => loadData());
    return () => unsub();
  }, []);

  const totalSanctioned = projects.reduce((acc, p) => acc + (p.financials?.sanctioned_amount || 0), 0);
  const totalExpended = projects.reduce((acc, p) => acc + (p.financials?.expenditure_amount || 0), 0);
  const highRiskCount = projects.filter(
    (p) => p.risk_flag && (p.risk_flag.priority_level === 'HIGH' || p.risk_flag.priority_level === 'CRITICAL')
  ).length;

  return (
    <div className="space-y-6">
      {/* Admin Authority Header */}
      <div className="bg-white border border-[#D9DEE5] rounded-md p-6 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-xs font-bold bg-blue-50 text-[#0B4F9C] border border-blue-200 mb-2">
            <ShieldCheck className="w-3.5 h-3.5 text-[#0B4F9C]" />
            Nidhiनेत्र • District Collectorate Administration
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#123B6D] tracking-tight">
            District Administrative Console
          </h1>
          <p className="text-xs sm:text-sm text-[#5F6B7A] mt-1 max-w-2xl leading-relaxed">
            Welcome, {user?.full_name}. Manage development projects, ingest official CSV datasets, administer role permissions, and calibrate statistical risk thresholds.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <Link
            to="/admin/import"
            className="inline-flex items-center gap-1.5 bg-[#0B4F9C] hover:bg-[#123B6D] text-white font-semibold text-xs px-3.5 py-2 rounded-md shadow-2xs transition-colors"
          >
            <FileSpreadsheet className="w-4 h-4 text-amber-300" />
            <span>Import CSV Dataset</span>
          </Link>
          <Link
            to="/admin/projects"
            className="inline-flex items-center gap-1.5 bg-white hover:bg-slate-50 text-[#123B6D] font-semibold text-xs px-3 py-2 rounded-md border border-[#D9DEE5] transition-colors"
          >
            <FolderPlus className="w-4 h-4 text-slate-500" />
            <span>Manage Projects</span>
          </Link>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white border border-[#D9DEE5] rounded-md p-4 shadow-2xs">
          <span className="text-[11px] font-bold text-[#5F6B7A] uppercase tracking-wider block">
            Total Sanctioned Outlay
          </span>
          <span className="text-2xl font-bold text-slate-900 mt-1 block">
            {formatCurrencyLakhs(totalSanctioned)}
          </span>
          <span className="text-[11px] text-[#5F6B7A]">Across {projects.length} district projects</span>
        </div>

        <div className="bg-white border border-[#D9DEE5] rounded-md p-4 shadow-2xs">
          <span className="text-[11px] font-bold text-[#5F6B7A] uppercase tracking-wider block">
            Total Disbursed Funds
          </span>
          <span className="text-2xl font-bold text-[#0B4F9C] mt-1 block">
            {formatCurrencyLakhs(totalExpended)}
          </span>
          <span className="text-[11px] text-[#5F6B7A]">Disbursed to contractors & agencies</span>
        </div>

        <div className="bg-white border border-[#D9DEE5] rounded-md p-4 shadow-2xs">
          <span className="text-[11px] font-bold text-[#5F6B7A] uppercase tracking-wider block">
            Registered Users
          </span>
          <span className="text-2xl font-bold text-slate-900 mt-1 block">{users.length}</span>
          <span className="text-[11px] text-[#5F6B7A]">Citizens, Reviewers & Admins</span>
        </div>

        <div className="bg-white border border-[#D9DEE5] rounded-md p-4 shadow-2xs">
          <span className="text-[11px] font-bold text-[#5F6B7A] uppercase tracking-wider block">
            High Priority Anomalies
          </span>
          <span className="text-2xl font-bold text-rose-700 mt-1 block">{highRiskCount}</span>
          <span className="text-[11px] text-[#5F6B7A]">Requiring executive inspection</span>
        </div>
      </div>

      {/* Admin Modules Quick Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link
          to="/admin/import"
          className="bg-white border border-[#D9DEE5] rounded-md p-5 shadow-2xs hover:border-[#0B4F9C] transition-colors space-y-2 block"
        >
          <div className="flex items-center gap-2 text-[#0B4F9C]">
            <FileSpreadsheet className="w-5 h-5" />
            <h3 className="font-bold text-sm text-[#123B6D]">Bulk Project CSV Import</h3>
          </div>
          <p className="text-xs text-[#5F6B7A] leading-relaxed">
            Ingest master project records, sanction decrees, and expenditure lines via standard CSV files with validation and error reporting.
          </p>
          <span className="text-xs font-semibold text-[#0B4F9C] flex items-center gap-1 pt-1">
            Open CSV Importer &rarr;
          </span>
        </Link>

        <Link
          to="/admin/risk"
          className="bg-white border border-[#D9DEE5] rounded-md p-5 shadow-2xs hover:border-[#0B4F9C] transition-colors space-y-2 block"
        >
          <div className="flex items-center gap-2 text-amber-700">
            <SlidersHorizontal className="w-5 h-5" />
            <h3 className="font-bold text-sm text-[#123B6D]">Risk Model Calibration</h3>
          </div>
          <p className="text-xs text-[#5F6B7A] leading-relaxed">
            Calibrate statistical weights for timeline delay, expenditure velocity, comparable project deviation, and citizen ground feedback density.
          </p>
          <span className="text-xs font-semibold text-[#0B4F9C] flex items-center gap-1 pt-1">
            Calibrate Model &rarr;
          </span>
        </Link>

        <Link
          to="/admin/users"
          className="bg-white border border-[#D9DEE5] rounded-md p-5 shadow-2xs hover:border-[#0B4F9C] transition-colors space-y-2 block"
        >
          <div className="flex items-center gap-2 text-emerald-700">
            <Users className="w-5 h-5" />
            <h3 className="font-bold text-sm text-[#123B6D]">User & Role Access Control</h3>
          </div>
          <p className="text-xs text-[#5F6B7A] leading-relaxed">
            Manage reviewer credentials, authorize public works verification officers, and enforce role-level security boundaries.
          </p>
          <span className="text-xs font-semibold text-[#0B4F9C] flex items-center gap-1 pt-1">
            Manage Users &rarr;
          </span>
        </Link>
      </div>

      {/* Recent Projects Table */}
      <div className="bg-white border border-[#D9DEE5] rounded-md shadow-2xs overflow-hidden">
        <div className="p-4 border-b border-[#D9DEE5] flex items-center justify-between bg-[#F7F8FA]">
          <h3 className="font-bold text-sm text-[#123B6D]">Recently Sanctioned District Projects</h3>
          <Link to="/admin/projects" className="text-xs font-semibold text-[#0B4F9C] hover:underline flex items-center gap-1">
            <span>View All Projects</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#D9DEE5] bg-white text-[#5F6B7A] font-bold uppercase text-[11px]">
                <th className="py-2.5 px-4">Project ID</th>
                <th className="py-2.5 px-4">Title</th>
                <th className="py-2.5 px-4">Sector</th>
                <th className="py-2.5 px-4">Constituency</th>
                <th className="py-2.5 px-4">Sanctioned</th>
                <th className="py-2.5 px-4">Status</th>
                <th className="py-2.5 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#D9DEE5]">
              {projects.slice(0, 6).map((p) => (
                <tr key={p.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-2.5 px-4 font-mono font-medium text-slate-700">{p.project_code}</td>
                  <td className="py-2.5 px-4 font-bold text-[#123B6D]">{p.title}</td>
                  <td className="py-2.5 px-4 text-[#5F6B7A]">{p.category?.name}</td>
                  <td className="py-2.5 px-4 text-[#5F6B7A]">{p.constituency}</td>
                  <td className="py-2.5 px-4 font-bold text-slate-900">
                    {formatCurrencyLakhs(p.financials?.sanctioned_amount)}
                  </td>
                  <td className="py-2.5 px-4">
                    <span className="text-[10px] px-2 py-0.5 rounded font-semibold bg-slate-100 text-slate-800 border border-slate-200">
                      {p.status.replace(/_/g, ' ')}
                    </span>
                  </td>
                  <td className="py-2.5 px-4 text-right">
                    <Link
                      to={`/admin/projects/${p.id}`}
                      className="text-xs font-semibold text-[#0B4F9C] hover:underline"
                    >
                      Dossier &rarr;
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
