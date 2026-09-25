// ProjectWatch: Analytics & Fund Utilisation Charts
// Smart India Hackathon 2026

import React from 'react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from 'recharts';
import { Project } from '@/types';
import { formatCurrencyLakhs } from '@/lib/utils/formatters';

interface AnalyticsChartsProps {
  projects: Project[];
}

export const AnalyticsCharts: React.FC<AnalyticsChartsProps> = ({ projects }) => {
  // 1. Status Distribution Data
  const statusCounts: Record<string, number> = {
    COMPLETED: 0,
    IN_PROGRESS: 0,
    DELAYED: 0,
    UNDER_REVIEW: 0,
    SANCTIONED: 0,
  };

  projects.forEach((p) => {
    if (statusCounts[p.status] !== undefined) {
      statusCounts[p.status]++;
    }
  });

  const statusData = [
    { name: 'Completed', value: statusCounts.COMPLETED, color: '#16A34A' },
    { name: 'In Progress', value: statusCounts.IN_PROGRESS, color: '#2563EB' },
    { name: 'Delayed', value: statusCounts.DELAYED, color: '#D97706' },
    { name: 'Under Review', value: statusCounts.UNDER_REVIEW, color: '#DC2626' },
    { name: 'Sanctioned', value: statusCounts.SANCTIONED, color: '#64748B' },
  ].filter((item) => item.value > 0);

  // 2. Fund Utilisation by Sector
  const categoryFinancials: Record<string, { name: string; sanctioned: number; expended: number }> = {};

  projects.forEach((p) => {
    const catName = p.category?.name || 'General';
    if (!categoryFinancials[catName]) {
      categoryFinancials[catName] = { name: catName, sanctioned: 0, expended: 0 };
    }
    categoryFinancials[catName].sanctioned += p.financials?.sanctioned_amount || 0;
    categoryFinancials[catName].expended += p.financials?.expenditure_amount || 0;
  });

  const financialData = Object.values(categoryFinancials).map((c) => ({
    name: c.name.length > 15 ? `${c.name.substring(0, 14)}...` : c.name,
    Sanctioned: Math.round(c.sanctioned / 100000), // in Lakhs
    Expended: Math.round(c.expended / 100000), // in Lakhs
  }));

  // 3. Risk Level Distribution
  const riskCounts = { LOW: 0, MEDIUM: 0, HIGH: 0, CRITICAL: 0 };
  projects.forEach((p) => {
    const lvl = p.risk_flag?.priority_level || 'LOW';
    if (riskCounts[lvl] !== undefined) riskCounts[lvl]++;
  });

  const riskData = [
    { name: 'Low Risk', count: riskCounts.LOW, fill: '#16A34A' },
    { name: 'Medium Watch', count: riskCounts.MEDIUM, fill: '#D97706' },
    { name: 'High Priority', count: riskCounts.HIGH, fill: '#EA580C' },
    { name: 'Critical Risk', count: riskCounts.CRITICAL, fill: '#DC2626' },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Chart 1: Project Status Breakdown */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
        <h3 className="font-bold text-sm text-slate-900 mb-1">Project Status Distribution</h3>
        <p className="text-xs text-slate-500 mb-4">Current operational lifecycle stages across all projects</p>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={statusData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={85}
                paddingAngle={4}
                dataKey="value"
              >
                {statusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                formatter={(val) => [`${val} projects`, 'Count']}
                contentStyle={{ backgroundColor: '#FFFFFF', borderColor: '#E2E8F0', borderRadius: '8px', fontSize: '12px' }}
              />
              <Legend verticalAlign="bottom" height={36} wrapperStyle={{ fontSize: '12px' }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Chart 2: Fund Allocation vs Expenditure by Category */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
        <h3 className="font-bold text-sm text-slate-900 mb-1">Sector Fund Utilisation (₹ Lakh)</h3>
        <p className="text-xs text-slate-500 mb-4">Sanctioned capital versus disbursed expenditure</p>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={financialData} margin={{ top: 10, right: 10, left: -10, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#64748B' }} angle={-15} textAnchor="end" />
              <YAxis tick={{ fontSize: 11, fill: '#64748B' }} />
              <Tooltip
                formatter={(val: any) => [`₹${val} Lakh`, '']}
                contentStyle={{ backgroundColor: '#FFFFFF', borderColor: '#E2E8F0', borderRadius: '8px', fontSize: '12px' }}
              />
              <Legend verticalAlign="top" align="right" wrapperStyle={{ fontSize: '12px', paddingBottom: '8px' }} />
              <Bar dataKey="Sanctioned" fill="#1E3A8A" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Expended" fill="#F97316" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Chart 3: AI Risk Level Distribution */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs lg:col-span-2">
        <h3 className="font-bold text-sm text-slate-900 mb-1">AI Risk Distribution Across Active Projects</h3>
        <p className="text-xs text-slate-500 mb-4">Volume of projects segmented by explainable anomaly severity</p>
        <div className="h-56 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={riskData} margin={{ top: 10, right: 20, left: 0, bottom: 5 }} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#F1F5F9" />
              <XAxis type="number" tick={{ fontSize: 11, fill: '#64748B' }} />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 12, fill: '#334155' }} width={120} />
              <Tooltip
                formatter={(val) => [`${val} projects`, 'Total']}
                contentStyle={{ backgroundColor: '#FFFFFF', borderColor: '#E2E8F0', borderRadius: '8px', fontSize: '12px' }}
              />
              <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                {riskData.map((entry, index) => (
                  <Cell key={`risk-cell-${index}`} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
