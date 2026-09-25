// Nidhiनेत्र: Comparable Peer Projects Analysis Component
// Smart India Hackathon 2026 — UX4G 3.0 & GIGW Compliance

import React from 'react';
import { Project } from '@/types';
import { formatCurrencyLakhs, getProjectStatusBadge } from '@/lib/utils/formatters';
import { Link } from 'react-router-dom';
import { GitCompare, ChevronRight } from 'lucide-react';

interface ComparableProjectsTableProps {
  currentProject: Project;
  peerProjects: Project[];
  baseRoute?: string;
}

export const ComparableProjectsTable: React.FC<ComparableProjectsTableProps> = ({
  currentProject,
  peerProjects,
  baseRoute = '/citizen/projects',
}) => {
  const categoryPeers = peerProjects.filter(
    (p) => p.category_id === currentProject.category_id && p.id !== currentProject.id
  );

  if (categoryPeers.length === 0) {
    return (
      <div className="bg-white border border-[#D9DEE5] rounded-md p-5 text-center text-[#5F6B7A] text-xs">
        <GitCompare className="w-6 h-6 mx-auto text-slate-300 mb-2" />
        No other peer projects currently registered in this sector.
      </div>
    );
  }

  const avgSanctioned =
    categoryPeers.reduce((acc, p) => acc + (p.financials?.sanctioned_amount || 0), 0) /
    categoryPeers.length;

  const avgUtilisation =
    categoryPeers.reduce((acc, p) => acc + (p.financials?.utilisation_percentage || 0), 0) /
    categoryPeers.length;

  return (
    <div className="bg-white border border-[#D9DEE5] rounded-md p-5 shadow-2xs space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <GitCompare className="w-4 h-4 text-purple-700" />
            <h3 className="font-bold text-sm text-[#123B6D]">Comparable Sector Projects</h3>
          </div>
          <p className="text-xs text-[#5F6B7A] mt-0.5">
            Benchmarking against {categoryPeers.length} peer {currentProject.category?.name || 'sector'} projects in {currentProject.district}
          </p>
        </div>

        <div className="flex items-center gap-3 text-xs bg-[#F7F8FA] px-3 py-1.5 rounded-md border border-[#D9DEE5]">
          <div>
            <span className="text-[#5F6B7A]">Sector Avg Outlay: </span>
            <span className="font-bold text-slate-800">{formatCurrencyLakhs(avgSanctioned)}</span>
          </div>
          <span className="text-slate-300">|</span>
          <div>
            <span className="text-[#5F6B7A]">Avg Utilisation: </span>
            <span className="font-bold text-[#0B4F9C]">{avgUtilisation.toFixed(1)}%</span>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-[#D9DEE5] bg-[#F7F8FA] text-[#5F6B7A] font-bold uppercase text-[11px]">
              <th className="py-2.5 px-3">Project Title</th>
              <th className="py-2.5 px-3">Constituency</th>
              <th className="py-2.5 px-3">Sanctioned</th>
              <th className="py-2.5 px-3">Expended</th>
              <th className="py-2.5 px-3">Utilisation</th>
              <th className="py-2.5 px-3">Status</th>
              <th className="py-2.5 px-3 text-right">View</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#D9DEE5]">
            {/* Current Project Row */}
            <tr className="bg-blue-50/60 font-semibold border-l-4 border-[#0B4F9C]">
              <td className="py-2.5 px-3">
                <span className="font-bold text-[#123B6D]">{currentProject.title}</span>
                <span className="ml-2 text-[10px] bg-blue-100 text-[#0B4F9C] px-1.5 py-0.2 rounded font-bold">
                  Current
                </span>
              </td>
              <td className="py-2.5 px-3 text-slate-700">{currentProject.constituency}</td>
              <td className="py-2.5 px-3 font-bold text-slate-900">
                {formatCurrencyLakhs(currentProject.financials?.sanctioned_amount)}
              </td>
              <td className="py-2.5 px-3 text-slate-700">
                {formatCurrencyLakhs(currentProject.financials?.expenditure_amount)}
              </td>
              <td className="py-2.5 px-3 text-[#0B4F9C] font-bold">
                {currentProject.financials?.utilisation_percentage || 0}%
              </td>
              <td className="py-2.5 px-3">
                <span className="text-[10px] px-2 py-0.5 rounded font-semibold bg-white border border-slate-200">
                  {currentProject.status.replace(/_/g, ' ')}
                </span>
              </td>
              <td className="py-2.5 px-3 text-right">
                <span className="text-[11px] text-slate-400">—</span>
              </td>
            </tr>

            {/* Peer Projects Rows */}
            {categoryPeers.slice(0, 4).map((peer) => {
              const statusBadge = getProjectStatusBadge(peer.status);

              return (
                <tr key={peer.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-2.5 px-3">
                    <span className="font-medium text-slate-800 line-clamp-1">{peer.title}</span>
                    <span className="text-[10px] text-slate-400 font-mono">{peer.project_code}</span>
                  </td>
                  <td className="py-2.5 px-3 text-slate-600">{peer.constituency}</td>
                  <td className="py-2.5 px-3 font-medium text-slate-800">
                    {formatCurrencyLakhs(peer.financials?.sanctioned_amount)}
                  </td>
                  <td className="py-2.5 px-3 text-slate-600">
                    {formatCurrencyLakhs(peer.financials?.expenditure_amount)}
                  </td>
                  <td className="py-2.5 px-3 font-bold text-blue-700">
                    {peer.financials?.utilisation_percentage || 0}%
                  </td>
                  <td className="py-2.5 px-3">
                    <span className={`text-[10px] px-2 py-0.5 rounded font-medium ${statusBadge.className}`}>
                      {statusBadge.label}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-right">
                    <Link
                      to={`${baseRoute}/${peer.id}`}
                      className="inline-flex items-center text-xs font-semibold text-[#0B4F9C] hover:underline"
                    >
                      <span>Compare</span>
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
  );
};
