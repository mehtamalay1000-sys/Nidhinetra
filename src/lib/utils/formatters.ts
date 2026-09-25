// ProjectWatch: Display and Formatting Utilities
// Smart India Hackathon 2026

import { ProjectStatus, RiskPriority, ReportStatus } from '@/types';

/**
 * Formats a number in Indian Lakhs/Crores or full INR
 * E.g., 4200000 -> "₹42.00 Lakh", 12500000 -> "₹1.25 Cr"
 */
export function formatCurrencyLakhs(amount: number | null | undefined): string {
  if (amount === null || amount === undefined || isNaN(amount)) return '₹0.00';
  if (amount >= 10000000) {
    return `₹${(amount / 10000000).toFixed(2)} Cr`;
  }
  if (amount >= 100000) {
    return `₹${(amount / 100000).toFixed(2)} Lakh`;
  }
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Formats date into readable format: "15 Jan 2025" or "15 Jan 2025, 02:30 PM"
 */
export function formatDate(dateString: string | null | undefined, includeTime = false): string {
  if (!dateString) return '—';
  try {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return dateString;
    return d.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      ...(includeTime
        ? {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true,
          }
        : {}),
    });
  } catch {
    return dateString;
  }
}

/**
 * Formats percentage
 */
export function formatPercentage(val: number | null | undefined): string {
  if (val === null || val === undefined || isNaN(val)) return '0%';
  return `${Number(val).toFixed(1)}%`;
}

/**
 * Style classes for Project Status badges (Indian Government subtle styling)
 */
export function getProjectStatusBadge(status: ProjectStatus): { label: string; className: string } {
  switch (status) {
    case 'COMPLETED':
      return {
        label: 'Completed',
        className: 'bg-emerald-50 text-emerald-800 border-emerald-200 border',
      };
    case 'IN_PROGRESS':
      return {
        label: 'In Progress',
        className: 'bg-blue-50 text-blue-800 border-blue-200 border',
      };
    case 'DELAYED':
      return {
        label: 'Delayed — Requires Review',
        className: 'bg-amber-50 text-amber-900 border-amber-300 border font-medium',
      };
    case 'UNDER_REVIEW':
      return {
        label: 'Under Review',
        className: 'bg-rose-50 text-rose-800 border-rose-300 border font-medium',
      };
    case 'SANCTIONED':
      return {
        label: 'Sanctioned',
        className: 'bg-slate-100 text-slate-800 border-slate-300 border',
      };
    case 'PROPOSED':
      return {
        label: 'Proposed',
        className: 'bg-slate-50 text-slate-600 border-slate-200 border',
      };
    default:
      return {
        label: status,
        className: 'bg-slate-100 text-slate-700 border-slate-200 border',
      };
  }
}

/**
 * Style classes for Risk Priority badge
 */
export function getRiskPriorityBadge(priority: RiskPriority | undefined): {
  label: string;
  className: string;
} {
  switch (priority) {
    case 'CRITICAL':
      return {
        label: 'Critical Risk',
        className: 'bg-red-100 text-red-900 border-red-300 border font-semibold',
      };
    case 'HIGH':
      return {
        label: 'High Priority',
        className: 'bg-orange-100 text-orange-950 border-orange-300 border font-semibold',
      };
    case 'MEDIUM':
      return {
        label: 'Medium Watch',
        className: 'bg-amber-100 text-amber-900 border-amber-300 border',
      };
    case 'LOW':
    default:
      return {
        label: 'Low Risk',
        className: 'bg-emerald-100 text-emerald-900 border-emerald-300 border',
      };
  }
}

/**
 * Style classes for Report Status badge
 */
export function getReportStatusBadge(status: ReportStatus): { label: string; className: string } {
  switch (status) {
    case 'SUBMITTED':
      return { label: 'Submitted', className: 'bg-blue-50 text-blue-800 border-blue-200 border' };
    case 'UNDER_REVIEW':
      return { label: 'Under Review', className: 'bg-purple-50 text-purple-800 border-purple-200 border' };
    case 'VERIFICATION_REQUIRED':
      return { label: 'Verification Required', className: 'bg-amber-50 text-amber-900 border-amber-300 border' };
    case 'VERIFIED':
      return { label: 'Evidence Verified', className: 'bg-teal-50 text-teal-800 border-teal-300 border' };
    case 'ACTION_TAKEN':
      return { label: 'Action Taken', className: 'bg-indigo-50 text-indigo-800 border-indigo-200 border' };
    case 'RESOLVED':
      return { label: 'Resolved', className: 'bg-emerald-50 text-emerald-800 border-emerald-300 border' };
    case 'DISMISSED':
      return { label: 'Dismissed', className: 'bg-slate-100 text-slate-700 border-slate-300 border' };
    default:
      return { label: status, className: 'bg-slate-100 text-slate-700 border-slate-200 border' };
  }
}
