// ProjectWatch: Project Health Card
// Smart India Hackathon 2026

import React from 'react';
import { Project } from '@/types';
import { Activity } from 'lucide-react';

interface ProjectHealthCardProps {
  project: Project;
}

export const ProjectHealthCard: React.FC<ProjectHealthCardProps> = ({ project }) => {
  const risk = project.risk_flag;
  const utilisation = project.financials?.utilisation_percentage || 0;
  const isDelayed = project.status === 'DELAYED' || project.status === 'UNDER_REVIEW';
  const reportCount = project.citizen_reports?.length || 0;

  // Determine sub-indicator health states
  const fundHealth =
    utilisation > 90 && project.status !== 'COMPLETED'
      ? { label: 'Watch', color: 'text-amber-600 bg-amber-100' }
      : { label: 'Normal', color: 'text-emerald-700 bg-emerald-100' };

  const timelineHealth =
    project.status === 'COMPLETED'
      ? { label: 'Normal', color: 'text-emerald-700 bg-emerald-100' }
      : isDelayed
      ? { label: 'Watch', color: 'text-rose-700 bg-rose-100' }
      : { label: 'Normal', color: 'text-emerald-700 bg-emerald-100' };

  const implementationHealth =
    project.status === 'UNDER_REVIEW'
      ? { label: 'Review', color: 'text-rose-700 bg-rose-100' }
      : { label: 'Normal', color: 'text-emerald-700 bg-emerald-100' };

  const citizenHealth =
    reportCount >= 2
      ? { label: 'Review', color: 'text-rose-700 bg-rose-100' }
      : reportCount === 1
      ? { label: 'Watch', color: 'text-amber-700 bg-amber-100' }
      : { label: 'Normal', color: 'text-emerald-700 bg-emerald-100' };

  // Internal Health Score (100 - risk score)
  const healthScore = risk ? Math.max(0, 100 - risk.overall_score) : 85;

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-blue-700" />
          <h3 className="font-bold text-xs uppercase tracking-wider text-slate-700">Project Health Indicator</h3>
        </div>
        <span className="text-xs font-mono font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded">
          Health: {healthScore} / 100
        </span>
      </div>

      <div className="space-y-2.5">
        <div className="flex items-center justify-between text-xs py-1 border-b border-slate-100">
          <span className="text-slate-600">Fund Utilisation</span>
          <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full flex items-center gap-1 ${fundHealth.color}`}>
            <span className="w-1.5 h-1.5 rounded-full bg-current" />
            {fundHealth.label}
          </span>
        </div>

        <div className="flex items-center justify-between text-xs py-1 border-b border-slate-100">
          <span className="text-slate-600">Timeline</span>
          <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full flex items-center gap-1 ${timelineHealth.color}`}>
            <span className="w-1.5 h-1.5 rounded-full bg-current" />
            {timelineHealth.label}
          </span>
        </div>

        <div className="flex items-center justify-between text-xs py-1 border-b border-slate-100">
          <span className="text-slate-600">Implementation</span>
          <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full flex items-center gap-1 ${implementationHealth.color}`}>
            <span className="w-1.5 h-1.5 rounded-full bg-current" />
            {implementationHealth.label}
          </span>
        </div>

        <div className="flex items-center justify-between text-xs py-1">
          <span className="text-slate-600">Citizen Feedback</span>
          <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full flex items-center gap-1 ${citizenHealth.color}`}>
            <span className="w-1.5 h-1.5 rounded-full bg-current" />
            {citizenHealth.label}
          </span>
        </div>
      </div>

      <p className="text-[10px] text-slate-400 mt-3 pt-2 border-t border-slate-100 italic">
        Internal monitoring metric based on project parameters. Not an official GoI rating.
      </p>
    </div>
  );
};
