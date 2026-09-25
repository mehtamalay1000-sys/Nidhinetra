// ProjectWatch: Project Timeline Component
// Smart India Hackathon 2026

import React from 'react';
import { ProjectTimelineEvent } from '@/types';
import { formatDate } from '@/lib/utils/formatters';
import { CheckCircle2, Clock, AlertTriangle, Circle } from 'lucide-react';

interface ProjectTimelineViewProps {
  events: ProjectTimelineEvent[];
}

export const ProjectTimelineView: React.FC<ProjectTimelineViewProps> = ({ events }) => {
  const sorted = [...events].sort((a, b) => a.order_index - b.order_index);

  const getStatusIcon = (status: ProjectTimelineEvent['status']) => {
    switch (status) {
      case 'COMPLETED':
        return <CheckCircle2 className="w-5 h-5 text-emerald-600 bg-white" />;
      case 'IN_PROGRESS':
        return <Clock className="w-5 h-5 text-blue-600 bg-white animate-spin" />;
      case 'DELAYED':
        return <AlertTriangle className="w-5 h-5 text-amber-600 bg-white" />;
      default:
        return <Circle className="w-4 h-4 text-slate-300 bg-white" />;
    }
  };

  const getStatusBadge = (status: ProjectTimelineEvent['status']) => {
    switch (status) {
      case 'COMPLETED':
        return <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">Completed</span>;
      case 'IN_PROGRESS':
        return <span className="text-[10px] font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">In Progress</span>;
      case 'DELAYED':
        return <span className="text-[10px] font-semibold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-300">Delayed</span>;
      default:
        return <span className="text-[10px] font-medium text-slate-500 bg-slate-50 px-2 py-0.5 rounded border border-slate-200">Pending</span>;
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
      <h3 className="font-bold text-sm text-slate-900 mb-4">Milestone Timeline & Implementation History</h3>

      <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
        {sorted.map((ev) => (
          <div key={ev.id} className="relative group">
            {/* Step marker icon positioned over line */}
            <div className="absolute -left-6 top-0 flex items-center justify-center">
              {getStatusIcon(ev.status)}
            </div>

            <div className="bg-slate-50/70 group-hover:bg-slate-50 transition-colors p-3.5 rounded-lg border border-slate-100">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
                <h4 className="text-xs font-bold text-slate-900">{ev.event_name}</h4>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono text-slate-500">{formatDate(ev.event_date)}</span>
                  {getStatusBadge(ev.status)}
                </div>
              </div>
              {ev.description && (
                <p className="text-xs text-slate-600 leading-relaxed mt-1">{ev.description}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
