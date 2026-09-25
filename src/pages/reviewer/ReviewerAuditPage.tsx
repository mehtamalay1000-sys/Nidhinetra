// Nidhiनेत्र: Traceable Accountability Audit Trail Page (UX4G 3.0 Standards)
// Smart India Hackathon 2026

import React, { useState, useEffect } from 'react';
import { store } from '@/lib/database/store';
import { AuditLog } from '@/types';
import { formatDate } from '@/lib/utils/formatters';
import { useGovSettings } from '@/app/providers/GovSettingsProvider';
import { Link } from 'react-router-dom';
import { History, Search, Download, ShieldCheck } from 'lucide-react';

export const ReviewerAuditPage: React.FC = () => {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [search, setSearch] = useState('');
  const [entityFilter, setEntityFilter] = useState('ALL');
  const { t } = useGovSettings();

  const loadLogs = () => {
    setLogs(store.getAuditLogs({ limit: 200 }));
  };

  useEffect(() => {
    loadLogs();
    const unsub = store.subscribe(() => loadLogs());
    return () => unsub();
  }, []);

  const filteredLogs = logs.filter((l) => {
    const matchesEntity = entityFilter === 'ALL' || l.entity_type === entityFilter;
    const q = search.toLowerCase();
    const matchesSearch =
      !search ||
      l.action.toLowerCase().includes(q) ||
      l.actor_name.toLowerCase().includes(q) ||
      l.actor_role.toLowerCase().includes(q) ||
      l.description.toLowerCase().includes(q);
    return matchesEntity && matchesSearch;
  });

  const exportAuditCSV = () => {
    const headers = ['Timestamp', 'Actor Name', 'Role', 'Action', 'Entity Type', 'Entity ID', 'Description'];
    const rows = filteredLogs.map((l) => [
      l.created_at,
      `"${l.actor_name}"`,
      l.actor_role,
      `"${l.action}"`,
      l.entity_type,
      l.entity_id,
      `"${l.description.replace(/"/g, '""')}"`,
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `nidhinetra_audit_trail_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
            <span className="text-[#1F2937] font-semibold">{t('auditTrail', 'Audit Trail')}</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#123B6D] tracking-tight">
            Accountability Audit Trail & Action History
          </h1>
          <p className="text-xs sm:text-sm text-[#5F6B7A] mt-0.5">
            Database-backed, timestamped chronological ledger of citizen submissions, officer verifications, and executive directives.
          </p>
        </div>

        <button
          onClick={exportAuditCSV}
          className="inline-flex items-center gap-1.5 bg-white hover:bg-slate-50 text-[#123B6D] border border-[#D9DEE5] font-semibold px-3.5 py-2 rounded-md text-xs transition-colors shrink-0"
        >
          <Download className="w-4 h-4 text-slate-500" />
          <span>{t('downloadCsv', 'Export Audit CSV')}</span>
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
              placeholder="Search by actor name, action, or description..."
              className="w-full pl-9 pr-3 py-2 bg-white border border-[#D9DEE5] rounded-md text-xs text-[#1F2937] focus:border-[#0B4F9C] focus:outline-hidden"
            />
          </div>

          <div className="flex flex-wrap items-center gap-1 bg-[#F7F8FA] p-1 rounded-md border border-[#D9DEE5] w-full sm:w-auto">
            {['ALL', 'REPORT', 'CASE', 'PROJECT'].map((ent) => (
              <button
                key={ent}
                onClick={() => setEntityFilter(ent)}
                className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                  entityFilter === ent
                    ? 'bg-[#0B4F9C] text-white font-bold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
                }`}
              >
                {ent}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="bg-white border border-[#D9DEE5] rounded-md shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-[#D9DEE5] bg-[#F7F8FA] text-[#5F6B7A] font-bold uppercase text-[11px]">
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4">Actor & Role</th>
                <th className="py-3 px-4">Action Recorded</th>
                <th className="py-3 px-4">Target Entity</th>
                <th className="py-3 px-4">Official Verification Description</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#D9DEE5]">
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-[#5F6B7A] text-xs">
                    No audit records match the selected query.
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4 text-[#5F6B7A] font-mono text-[11px] whitespace-nowrap">
                      {formatDate(log.created_at, true)}
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span className="font-bold text-[#123B6D] block">{log.actor_name}</span>
                      <span className="text-[10px] font-mono text-slate-500 uppercase">{log.actor_role}</span>
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span className="font-bold text-[#0B4F9C] bg-blue-50 px-2 py-0.5 rounded border border-blue-200 text-[11px]">
                        {log.action}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-[#5F6B7A] uppercase text-[10px] font-mono whitespace-nowrap">
                      {log.entity_type}
                    </td>
                    <td className="py-3 px-4 text-slate-800 leading-snug">{log.description}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
