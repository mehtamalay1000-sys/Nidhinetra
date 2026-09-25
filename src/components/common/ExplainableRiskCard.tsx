// Nidhiनेत्र: Explainable AI Risk Indicator & Factor Breakdown
// Smart India Hackathon 2026 — UX4G 3.0 & GIGW 3.0 Standards
// Principles: Strictly explainable risk signals; never accuses or concludes fraud.

import React from 'react';
import { RiskFlag } from '@/types';
import { getRiskPriorityBadge } from '@/lib/utils/formatters';
import {
  ShieldAlert,
  Clock,
  CircleDollarSign,
  Users,
  GitCompare,
  Info,
  CheckCircle2,
} from 'lucide-react';

interface ExplainableRiskCardProps {
  riskFlag?: RiskFlag;
  compact?: boolean;
}

export const ExplainableRiskCard: React.FC<ExplainableRiskCardProps> = ({
  riskFlag,
  compact = false,
}) => {
  if (!riskFlag) {
    return (
      <div className="bg-white border border-[#D9DEE5] rounded-md p-5 text-center text-[#5F6B7A]">
        <CheckCircle2 className="w-8 h-8 mx-auto text-[#2E7D32] mb-2" />
        <p className="text-sm font-bold text-slate-800">No Active Risk Flags</p>
        <p className="text-xs text-[#5F6B7A] mt-1">
          This project is operating within baseline timeline and expenditure parameters.
        </p>
      </div>
    );
  }

  const score = riskFlag.overall_score;
  const priority = riskFlag.priority_level;
  const priorityBadge = getRiskPriorityBadge(priority);
  const percentage = Math.min(100, Math.max(0, score));

  const getFactorIcon = (type: string) => {
    switch (type) {
      case 'TIMELINE':
        return <Clock className="w-4 h-4 text-amber-700" />;
      case 'EXPENDITURE':
        return <CircleDollarSign className="w-4 h-4 text-rose-700" />;
      case 'CITIZEN_REPORTS':
        return <Users className="w-4 h-4 text-[#0B4F9C]" />;
      case 'COMPARABLE_DEVIATION':
        return <GitCompare className="w-4 h-4 text-purple-700" />;
      default:
        return <Info className="w-4 h-4 text-slate-600" />;
    }
  };

  return (
    <div className="bg-white border border-[#D9DEE5] rounded-md p-5 shadow-2xs space-y-4">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-[#B7791F]" />
            <h3 className="font-bold text-sm text-[#123B6D] uppercase tracking-wide">
              Explainable Risk Indicators (Officer View)
            </h3>
          </div>
          <p className="text-xs text-[#5F6B7A] mt-0.5">
            Statistical anomaly indicators for prioritising human government verification
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-2xl font-bold text-slate-900 tracking-tight">
            {score}
            <span className="text-xs font-normal text-slate-400"> / 100</span>
          </span>
          <span className={`text-xs px-2.5 py-0.5 rounded font-bold uppercase tracking-wider ${priorityBadge.className}`}>
            {priorityBadge.label}
          </span>
        </div>
      </div>

      {/* Risk Spectrum Gauge */}
      <div>
        <div className="flex justify-between text-[11px] font-semibold text-[#5F6B7A] mb-1.5 uppercase tracking-wider">
          <span>Low (0-29)</span>
          <span>Medium (30-59)</span>
          <span>High (60-79)</span>
          <span>Critical (80-100)</span>
        </div>

        <div className="relative h-2 w-full rounded-full bg-linear-to-r from-emerald-500 via-amber-400 to-rose-600">
          <div
            className="absolute top-1/2 -translate-y-1/2 w-3.5 h-3.5 bg-slate-900 border-2 border-white rounded-full shadow-xs transition-all duration-500"
            style={{ left: `calc(${percentage}% - 7px)` }}
          />
        </div>
      </div>

      {/* System Recommendation */}
      <div className="p-3 bg-[#F7F8FA] border border-[#D9DEE5] rounded-md flex items-start gap-2.5">
        <Info className="w-4 h-4 text-[#0B4F9C] mt-0.5 shrink-0" />
        <div>
          <span className="text-[11px] font-bold text-[#123B6D] uppercase tracking-wide block">
            System Recommendation
          </span>
          <p className="text-xs font-bold text-slate-900">"{riskFlag.recommendation}"</p>
          <p className="text-[11px] text-[#5F6B7A] mt-0.5 leading-relaxed">
            Signals generated from official timeline deviations, expenditure drawdown velocity, and citizen observations. Final determination rests with human verification officers.
          </p>
        </div>
      </div>

      {/* Contributing Factors */}
      {!compact && riskFlag.factors && riskFlag.factors.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-xs font-bold text-[#123B6D] uppercase tracking-wider">
            Contributing Risk Drivers (Why This Project Was Flagged)
          </h4>
          <div className="space-y-2">
            {riskFlag.factors.map((f, i) => (
              <div
                key={f.id || i}
                className="p-3 rounded-md border border-[#D9DEE5] bg-[#F7F8FA] flex items-start gap-3"
              >
                <div className="p-1 rounded bg-white border border-slate-200 shrink-0">
                  {getFactorIcon(f.indicator_type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-bold text-slate-800">{f.factor_name}</span>
                    <span className="text-[11px] font-mono text-[#5F6B7A] font-semibold">
                      Weight: {(f.factor_weight * 100).toFixed(0)}%
                    </span>
                  </div>
                  <p className="text-xs text-[#5F6B7A] mt-0.5 leading-relaxed">{f.explanation}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
