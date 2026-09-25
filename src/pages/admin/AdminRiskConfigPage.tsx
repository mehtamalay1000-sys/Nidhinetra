// ProjectWatch: Admin AI Risk Model Calibration Page
// Smart India Hackathon 2026

import React, { useState } from 'react';
import { store } from '@/lib/database/store';
import {
  DEFAULT_RISK_CONFIG,
  RiskEngineConfig,
  calculateProjectRisk,
} from '@/features/intelligence/riskEngine';
import { SlidersHorizontal, CheckCircle2, RotateCcw, Info, ShieldAlert } from 'lucide-react';

export const AdminRiskConfigPage: React.FC = () => {
  const [config, setConfig] = useState<RiskEngineConfig>(DEFAULT_RISK_CONFIG);
  const [feedback, setFeedback] = useState<string | null>(null);

  const handleWeightChange = (key: keyof RiskEngineConfig, val: number) => {
    setConfig((prev) => ({
      ...prev,
      [key]: val,
    }));
  };

  const handleSaveAndRecalculate = () => {
    // Recalculate all projects with updated config
    const all = store.getProjects({ limit: 500 }).projects;
    all.forEach((proj) => {
      const result = calculateProjectRisk(proj, all, config);
      store.updateProject(proj.id, {
        risk_flag: {
          id: proj.risk_flag?.id || `rf-${Date.now()}`,
          project_id: proj.id,
          overall_score: result.overall_score,
          priority_level: result.priority_level,
          status: proj.risk_flag?.status || 'ACTIVE',
          recommendation: result.recommendation,
          calculated_at: new Date().toISOString(),
          factors: result.factors,
        },
      });
    });

    store.createAuditLog({
      actor_name: 'Priya Kulkarni',
      actor_role: 'admin',
      action: 'Risk Model Re-calibrated',
      entity_type: 'risk_flag',
      entity_id: 'risk_model_v2',
      description: `Re-calibrated weights: Timeline ${(config.timelineWeight * 100).toFixed(0)}%, Expenditure ${(config.expenditureWeight * 100).toFixed(0)}%, Citizen ${(config.citizenReportWeight * 100).toFixed(0)}%. Recalculated ${all.length} projects.`,
    });

    setFeedback(`Risk model weights saved. Successfully re-evaluated all ${all.length} projects.`);
    setTimeout(() => setFeedback(null), 4000);
  };

  const handleResetDefaults = () => {
    setConfig(DEFAULT_RISK_CONFIG);
    setFeedback('Reset to default calibrated values.');
    setTimeout(() => setFeedback(null), 2000);
  };

  const totalWeights = (
    config.timelineWeight +
    config.expenditureWeight +
    config.citizenReportWeight +
    config.comparableWeight
  ).toFixed(2);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-amber-700 text-xs font-bold uppercase tracking-wider mb-1">
            <SlidersHorizontal className="w-4 h-4" />
            <span>AI Risk Engine Hyperparameters</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Risk Model Configuration</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Configure factor weightings and priority threshold boundaries for automated anomaly detection
          </p>
        </div>

        <button
          onClick={handleResetDefaults}
          className="inline-flex items-center gap-1.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 font-semibold px-3 py-1.5 rounded-lg text-xs transition-colors shadow-2xs"
        >
          <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
          <span>Reset Defaults</span>
        </button>
      </div>

      {feedback && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs font-semibold text-emerald-900 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{feedback}</span>
        </div>
      )}

      {/* Weighting Sliders */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
            1. Anomaly Factor Relative Weights
          </h2>
          <span className="text-xs font-mono font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
            Total Weight: {totalWeights} (1.00 Target)
          </span>
        </div>

        {/* Timeline Weight */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <label className="font-bold text-slate-800">Timeline Delay Weight</label>
            <span className="font-mono font-bold text-blue-700">
              {(config.timelineWeight * 100).toFixed(0)}%
            </span>
          </div>
          <input
            type="range"
            min="0.05"
            max="0.60"
            step="0.05"
            value={config.timelineWeight}
            onChange={(e) => handleWeightChange('timelineWeight', parseFloat(e.target.value))}
            className="w-full accent-blue-600"
          />
          <p className="text-[11px] text-slate-500">
            Penalises projects past target milestone dates without registered completion certificate.
          </p>
        </div>

        {/* Expenditure Weight */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <label className="font-bold text-slate-800">Expenditure Drawdown Velocity Weight</label>
            <span className="font-mono font-bold text-rose-700">
              {(config.expenditureWeight * 100).toFixed(0)}%
            </span>
          </div>
          <input
            type="range"
            min="0.05"
            max="0.50"
            step="0.05"
            value={config.expenditureWeight}
            onChange={(e) => handleWeightChange('expenditureWeight', parseFloat(e.target.value))}
            className="w-full accent-rose-600"
          />
          <p className="text-[11px] text-slate-500">
            Flags high fund withdrawal percentages on stalled or delayed public works.
          </p>
        </div>

        {/* Citizen Report Weight */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <label className="font-bold text-slate-800">Citizen Ground Report Density Weight</label>
            <span className="font-mono font-bold text-amber-700">
              {(config.citizenReportWeight * 100).toFixed(0)}%
            </span>
          </div>
          <input
            type="range"
            min="0.05"
            max="0.50"
            step="0.05"
            value={config.citizenReportWeight}
            onChange={(e) => handleWeightChange('citizenReportWeight', parseFloat(e.target.value))}
            className="w-full accent-amber-600"
          />
          <p className="text-[11px] text-slate-500">
            Elevates score when multiple verified citizen reports are filed against the same project.
          </p>
        </div>

        {/* Comparable Peer Weight */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <label className="font-bold text-slate-800">Sector Peer Benchmark Deviation Weight</label>
            <span className="font-mono font-bold text-purple-700">
              {(config.comparableWeight * 100).toFixed(0)}%
            </span>
          </div>
          <input
            type="range"
            min="0.05"
            max="0.40"
            step="0.05"
            value={config.comparableWeight}
            onChange={(e) => handleWeightChange('comparableWeight', parseFloat(e.target.value))}
            className="w-full accent-purple-600"
          />
          <p className="text-[11px] text-slate-500">
            Compares disbursement pace against other active projects in the same district sector.
          </p>
        </div>
      </div>

      {/* Priority Thresholds */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
        <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider border-b border-slate-100 pb-3">
          2. Priority Severity Threshold Cutoffs
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-100">
            <label className="block text-xs font-bold text-emerald-900 mb-1">Low / Medium Cutoff</label>
            <input
              type="number"
              value={config.lowThreshold}
              onChange={(e) => handleWeightChange('lowThreshold', parseInt(e.target.value) || 30)}
              className="w-full p-2 bg-white border border-emerald-300 rounded text-xs font-bold text-slate-900"
            />
            <span className="text-[10px] text-emerald-700 mt-1 block">Default: 30</span>
          </div>

          <div className="p-3 bg-amber-50 rounded-xl border border-amber-100">
            <label className="block text-xs font-bold text-amber-900 mb-1">Medium / High Cutoff</label>
            <input
              type="number"
              value={config.mediumThreshold}
              onChange={(e) => handleWeightChange('mediumThreshold', parseInt(e.target.value) || 60)}
              className="w-full p-2 bg-white border border-amber-300 rounded text-xs font-bold text-slate-900"
            />
            <span className="text-[10px] text-amber-700 mt-1 block">Default: 60</span>
          </div>

          <div className="p-3 bg-rose-50 rounded-xl border border-rose-100">
            <label className="block text-xs font-bold text-rose-900 mb-1">High / Critical Cutoff</label>
            <input
              type="number"
              value={config.highThreshold}
              onChange={(e) => handleWeightChange('highThreshold', parseInt(e.target.value) || 80)}
              className="w-full p-2 bg-white border border-rose-300 rounded text-xs font-bold text-slate-900"
            />
            <span className="text-[10px] text-rose-700 mt-1 block">Default: 80</span>
          </div>
        </div>
      </div>

      {/* Legal & Governance Notice (Section 4, 18) */}
      <div className="p-4 bg-slate-900 rounded-xl text-white text-xs space-y-1.5">
        <div className="flex items-center gap-2 text-amber-400 font-bold">
          <ShieldAlert className="w-4 h-4" />
          <span>Core AI Governance Constraint</span>
        </div>
        <p className="text-slate-300 text-[11px] leading-relaxed">
          The risk engine identifies statistical signals and priorities for human verification. System recommendations are never conclusive findings of wrongdoing and always require physical on-site human inspection by gazetted officers.
        </p>
      </div>

      {/* Save Action */}
      <div className="flex justify-end">
        <button
          onClick={handleSaveAndRecalculate}
          className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-6 py-3 rounded-xl text-xs transition-colors shadow-sm flex items-center gap-2"
        >
          <SlidersHorizontal className="w-4 h-4" />
          <span>Save & Recalculate All District Projects</span>
        </button>
      </div>
    </div>
  );
};
