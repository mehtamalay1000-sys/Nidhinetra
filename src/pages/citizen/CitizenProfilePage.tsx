// Nidhiनेत्र: Citizen Profile Page (UX4G 3.0 Standards)
// Smart India Hackathon 2026

import React from 'react';
import { useAuth } from '@/app/providers/AuthProvider';
import { useGovSettings } from '@/app/providers/GovSettingsProvider';
import { store } from '@/lib/database/store';
import { Mail, Phone, MapPin, ShieldCheck, Link } from 'lucide-react';
import { formatDate } from '@/lib/utils/formatters';

export const CitizenProfilePage: React.FC = () => {
  const { user } = useAuth();
  const { t, selectedConstituency } = useGovSettings();
  const reports = user ? store.getCitizenReports(user.id) : [];
  const verifiedCount = reports.filter((r) => r.status === 'VERIFIED' || r.status === 'RESOLVED').length;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      <div className="bg-white border border-[#D9DEE5] rounded-md p-6 shadow-2xs space-y-6">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 pb-5 border-b border-[#D9DEE5]">
          <div className="w-20 h-20 rounded-full bg-[#123B6D] text-white flex items-center justify-center font-bold text-2xl border-2 border-slate-300 shrink-0">
            {user?.full_name ? user.full_name.charAt(0) : 'C'}
          </div>

          <div className="text-center sm:text-left space-y-1">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-xs font-bold bg-blue-50 text-[#0B4F9C] border border-blue-200">
              <ShieldCheck className="w-3.5 h-3.5 text-[#0B4F9C]" />
              Verified Citizen Ground Observer
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-[#123B6D]">{user?.full_name}</h1>
            <p className="text-xs text-[#5F6B7A] flex items-center justify-center sm:justify-start gap-1">
              <MapPin className="w-3.5 h-3.5 text-[#E87B18]" />
              <span>{selectedConstituency}, Nashik District, Maharashtra</span>
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 py-4 border-b border-[#D9DEE5] text-center">
          <div className="p-4 bg-[#F7F8FA] rounded-md border border-[#D9DEE5]">
            <span className="text-xs font-bold text-[#5F6B7A] uppercase tracking-wider block">
              Total Reports Filed
            </span>
            <span className="text-2xl font-bold text-slate-900 mt-1 block">{reports.length}</span>
          </div>

          <div className="p-4 bg-[#F7F8FA] rounded-md border border-[#D9DEE5]">
            <span className="text-xs font-bold text-[#5F6B7A] uppercase tracking-wider block">
              Evidence Verified & Actioned
            </span>
            <span className="text-2xl font-bold text-[#2E7D32] mt-1 block">{verifiedCount}</span>
          </div>
        </div>

        {/* Contact info */}
        <div className="space-y-3">
          <h2 className="text-xs font-bold text-[#123B6D] uppercase tracking-wider">
            Citizen Account Credentials
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-3 bg-[#F7F8FA] rounded-md border border-[#D9DEE5] flex items-center gap-3">
              <Mail className="w-4 h-4 text-[#0B4F9C]" />
              <div>
                <span className="text-[#5F6B7A] block text-[11px]">Email Address</span>
                <span className="font-bold text-slate-900">{user?.email}</span>
              </div>
            </div>

            <div className="p-3 bg-[#F7F8FA] rounded-md border border-[#D9DEE5] flex items-center gap-3">
              <Phone className="w-4 h-4 text-[#0B4F9C]" />
              <div>
                <span className="text-[#5F6B7A] block text-[11px]">Phone Number</span>
                <span className="font-bold text-slate-900">{user?.phone || '+91 98000 00000'}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="p-3 bg-blue-50 border border-blue-200 rounded-md text-xs text-blue-900">
          <span className="font-bold block mb-0.5">Privacy Protection</span>
          Your citizen ground observations are submitted securely. Personal identifiers are never disclosed to third parties or on public project cards.
        </div>
      </div>
    </div>
  );
};
