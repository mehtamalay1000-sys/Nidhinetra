// ProjectWatch: Admin User & Role Management Page
// Smart India Hackathon 2026

import React, { useState, useEffect } from 'react';
import { store } from '@/lib/database/store';
import { UserProfile, UserRole } from '@/types';
import { formatDate } from '@/lib/utils/formatters';
import { Users, Shield, ShieldCheck, Mail, Phone, MapPin, CheckCircle2 } from 'lucide-react';

export const AdminUsersPage: React.FC = () => {
  const [profiles, setProfiles] = useState<UserProfile[]>([]);
  const [feedback, setFeedback] = useState<string | null>(null);

  const loadProfiles = () => {
    setProfiles(store.getProfiles());
  };

  useEffect(() => {
    loadProfiles();
    const unsub = store.subscribe(() => loadProfiles());
    return () => unsub();
  }, []);

  const handleRoleChange = (userId: string, newRole: UserRole) => {
    const list = store.getProfiles();
    const target = list.find((p) => p.id === userId);
    if (!target) return;

    target.role = newRole;
    store.createAuditLog({
      actor_name: 'Priya Kulkarni',
      actor_role: 'admin',
      action: 'User Role Updated',
      entity_type: 'user',
      entity_id: userId,
      description: `Updated role of ${target.full_name} to ${newRole.toUpperCase()}.`,
    });

    setFeedback(`Role for ${target.full_name} updated to ${newRole.toUpperCase()}.`);
    setTimeout(() => setFeedback(null), 3000);
    loadProfiles();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-purple-700 text-xs font-bold uppercase tracking-wider mb-1">
            <Users className="w-4 h-4" />
            <span>Identity & Access Control (RBAC)</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">User Accounts & Roles</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Manage authenticated profiles, duty assignments, and database row-level permissions
          </p>
        </div>

        <span className="text-xs text-slate-600 bg-white px-3 py-1.5 rounded-lg border border-slate-200 font-semibold">
          Total Users: <strong>{profiles.length}</strong>
        </span>
      </div>

      {feedback && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs font-semibold text-emerald-900 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{feedback}</span>
        </div>
      )}

      {/* Users Table */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-slate-600 font-semibold uppercase text-[11px]">
                <th className="py-3 px-4">User</th>
                <th className="py-3 px-4">Contact</th>
                <th className="py-3 px-4">Jurisdiction</th>
                <th className="py-3 px-4">Current Role</th>
                <th className="py-3 px-4">Created Date</th>
                <th className="py-3 px-4 text-right">Assign Authority Role</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {profiles.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={p.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
                        alt={p.full_name}
                        className="w-9 h-9 rounded-full object-cover border border-slate-200"
                      />
                      <div>
                        <span className="font-bold text-slate-900 text-xs block">{p.full_name}</span>
                        <span className="text-[10px] text-slate-400 font-mono">{p.id}</span>
                      </div>
                    </div>
                  </td>

                  <td className="py-3.5 px-4 text-slate-600">
                    <div className="flex items-center gap-1.5 text-xs font-medium text-slate-800">
                      <Mail className="w-3.5 h-3.5 text-slate-400" />
                      <span>{p.email}</span>
                    </div>
                    {p.phone && (
                      <div className="flex items-center gap-1.5 text-[11px] text-slate-400 mt-0.5">
                        <Phone className="w-3 h-3 text-slate-400" />
                        <span>{p.phone}</span>
                      </div>
                    )}
                  </td>

                  <td className="py-3.5 px-4 text-slate-700">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-slate-400" />
                      <span>{p.district}, {p.constituency}</span>
                    </div>
                  </td>

                  <td className="py-3.5 px-4">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                        p.role === 'admin'
                          ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                          : p.role === 'reviewer'
                          ? 'bg-amber-100 text-amber-900 border border-amber-300'
                          : 'bg-blue-100 text-blue-900 border border-blue-200'
                      }`}
                    >
                      {p.role}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 text-slate-400 font-mono text-[11px]">
                    {formatDate(p.created_at)}
                  </td>

                  <td className="py-3.5 px-4 text-right">
                    <select
                      value={p.role}
                      onChange={(e) => handleRoleChange(p.id, e.target.value as UserRole)}
                      className="py-1 px-2.5 bg-slate-50 border border-slate-300 rounded-md text-xs font-semibold text-slate-800 focus:bg-white focus:outline-hidden"
                    >
                      <option value="citizen">Citizen Ground Observer</option>
                      <option value="reviewer">Reviewer Verification Officer</option>
                      <option value="admin">District Administrator</option>
                    </select>
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
