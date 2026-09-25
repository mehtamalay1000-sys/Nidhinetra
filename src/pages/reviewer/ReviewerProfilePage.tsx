// Nidhiनेत्र: Reviewer Officer Profile Page (UX4G 3.0 Standards)
// Smart India Hackathon 2026

import React from 'react';
import { useAuth } from '@/app/providers/AuthProvider';
import { store } from '@/lib/database/store';
import { ShieldCheck, Mail, Phone, MapPin, Inbox, CheckCircle2 } from 'lucide-react';

export const ReviewerProfilePage: React.FC = () => {
  const { user } = useAuth();
  const cases = store.getReviewCases();
  const assignedCases = cases.filter((c) =>
    c.assignments?.some((a) => a.reviewer_id === user?.id)
  );
  const resolvedCases = assignedCases.filter((c) => c.status === 'RESOLVED');

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="bg-white border border-[#D9DEE5] rounded-md p-6 shadow-2xs space-y-6">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 pb-5 border-b border-[#D9DEE5]">
          <div className="w-20 h-20 rounded-full bg-[#123B6D] text-white flex items-center justify-center font-bold text-2xl border-2 border-slate-300 shrink-0">
            {user?.full_name ? user.full_name.charAt(0) : 'R'}
          </div>

          <div className="text-center sm:text-left space-y-1">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-xs font-bold bg-blue-50 text-[#0B4F9C] border border-blue-200">
              <ShieldCheck className="w-3.5 h-3.5 text-[#0B4F9C]" />
              Designated Project Review Officer
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-[#123B6D]">{user?.full_name}</h1>
            <p className="text-xs text-[#5F6B7A] flex items-center justify-center sm:justify-start gap-1">
              <MapPin className="w-3.5 h-3.5 text-[#E87B18]" />
              <span>District Review Cell, {user?.district} Division</span>
            </p>
          </div>
        </div>

        {/* Work Metrics */}
        <div className="grid grid-cols-2 gap-4 py-4 border-b border-[#D9DEE5] text-center">
          <div className="p-4 bg-[#F7F8FA] rounded-md border border-[#D9DEE5]">
            <span className="text-xs font-bold text-[#5F6B7A] uppercase tracking-wider block">
              Cases Assigned
            </span>
            <span className="text-2xl font-bold text-slate-900 mt-1 block">{assignedCases.length}</span>
          </div>

          <div className="p-4 bg-[#F7F8FA] rounded-md border border-[#D9DEE5]">
            <span className="text-xs font-bold text-[#5F6B7A] uppercase tracking-wider block">
              Cases Resolved & Actioned
            </span>
            <span className="text-2xl font-bold text-[#2E7D32] mt-1 block">{resolvedCases.length}</span>
          </div>
        </div>

        {/* Credentials */}
        <div className="space-y-3">
          <h2 className="text-xs font-bold text-[#123B6D] uppercase tracking-wider">
            Official Government Credentials
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-3 bg-[#F7F8FA] rounded-md border border-[#D9DEE5] space-y-1">
              <span className="text-[#5F6B7A] block text-[11px]">Official Email</span>
              <span className="font-bold text-slate-900">{user?.email}</span>
            </div>
            <div className="p-3 bg-[#F7F8FA] rounded-md border border-[#D9DEE5] space-y-1">
              <span className="text-[#5F6B7A] block text-[11px]">Official Jurisdiction</span>
              <span className="font-bold text-slate-900">{user?.district}, Maharashtra</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
