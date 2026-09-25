// ProjectWatch: Admin CSV Bulk Data Import Page
// Smart India Hackathon 2026

import React, { useState } from 'react';
import { store } from '@/lib/database/store';
import { Project, ProjectStatus } from '@/types';
import { formatCurrencyLakhs } from '@/lib/utils/formatters';
import {
  FileSpreadsheet,
  Upload,
  CheckCircle2,
  AlertTriangle,
  Download,
  Check,
  X,
  FileCheck,
  RefreshCw,
} from 'lucide-react';

interface ParsedRow {
  index: number;
  project_code: string;
  title: string;
  category_code: string;
  district: string;
  sanctioned_amount: number;
  expenditure_amount: number;
  status: ProjectStatus;
  sanction_date: string;
  expected_completion_date: string;
  isValid: boolean;
  errors: string[];
}

export const AdminDataImportPage: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [parsedRows, setParsedRows] = useState<ParsedRow[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [importSummary, setImportSummary] = useState<{
    imported: number;
    updated: number;
    skipped: number;
    errors: number;
  } | null>(null);

  const categories = store.getCategories();
  const agencies = store.getAgencies();

  const handleDownloadSample = () => {
    const sampleHeaders = [
      'project_code',
      'title',
      'category_code',
      'district',
      'constituency',
      'sanctioned_amount',
      'expenditure_amount',
      'status',
      'sanction_date',
      'expected_completion_date',
      'address',
    ];

    const sampleData = [
      [
        'MPLAD-2025-MH-0901',
        'Panchavati Community Drinking Water Dispenser',
        'WATER',
        'Nashik',
        'Nashik Central',
        '1800000',
        '650000',
        'IN_PROGRESS',
        '2025-01-05',
        '2025-07-31',
        'Panchavati Market Square',
      ],
      [
        'MPLAD-2025-MH-0902',
        'Ozar Primary Health Centre Oxygen Plant',
        'HEALTH',
        'Nashik',
        'Dindori',
        '3200000',
        '3100000',
        'COMPLETED',
        '2024-06-15',
        '2024-12-15',
        'Ozar PHC Campus',
      ],
      [
        'MPLAD-2025-MH-0903',
        'Deolali Girls High School Computer Lab',
        'EDU',
        'Nashik',
        'Deolali',
        '1500000',
        '200000',
        'IN_PROGRESS',
        '2025-02-01',
        '2025-09-30',
        'Deolali Cantt School',
      ],
    ];

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [sampleHeaders.join(','), ...sampleData.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'nidhinetra_sample_import.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setImportSummary(null);
    const uploadedFile = e.target.files?.[0];
    if (!uploadedFile) return;
    setFile(uploadedFile);

    const reader = new FileReader();
    reader.onload = (evt) => {
      const text = evt.target?.result as string;
      parseCSV(text);
    };
    reader.readAsText(uploadedFile);
  };

  const parseCSV = (csvText: string) => {
    const lines = csvText.split('\n').filter((l) => l.trim().length > 0);
    if (lines.length <= 1) return;

    const rows: ParsedRow[] = [];
    // Skip header line
    for (let i = 1; i < lines.length; i++) {
      const parts = lines[i].split(',').map((p) => p.trim().replace(/^"|"$/g, ''));
      if (parts.length < 5) continue;

      const code = parts[0] || '';
      const title = parts[1] || '';
      const catCode = parts[2] || 'COMM';
      const district = parts[3] || 'Nashik';
      const sanctioned = parseFloat(parts[5] || '0');
      const expenditure = parseFloat(parts[6] || '0');
      const status = (parts[7] || 'SANCTIONED').toUpperCase() as ProjectStatus;
      const sanctionDate = parts[8] || new Date().toISOString().split('T')[0];
      const completionDate = parts[9] || new Date().toISOString().split('T')[0];

      const errors: string[] = [];
      if (!code) errors.push('Project code is required');
      if (!title || title.length < 5) errors.push('Title must be at least 5 chars');
      if (isNaN(sanctioned) || sanctioned < 0) errors.push('Invalid sanctioned amount');
      if (isNaN(expenditure) || expenditure < 0) errors.push('Invalid expenditure amount');

      rows.push({
        index: i,
        project_code: code,
        title,
        category_code: catCode,
        district,
        sanctioned_amount: isNaN(sanctioned) ? 0 : sanctioned,
        expenditure_amount: isNaN(expenditure) ? 0 : expenditure,
        status,
        sanction_date: sanctionDate,
        expected_completion_date: completionDate,
        isValid: errors.length === 0,
        errors,
      });
    }

    setParsedRows(rows);
  };

  const handleExecuteImport = () => {
    setIsProcessing(true);
    let imported = 0;
    let updated = 0;
    let skipped = 0;
    let errCount = 0;

    const existingProjects = store.getProjects({ limit: 500 }).projects;

    parsedRows.forEach((row) => {
      if (!row.isValid) {
        errCount++;
        return;
      }

      const matchCategory =
        categories.find((c) => c.code === row.category_code) || categories[0];
      const matchAgency = agencies[0];

      const existing = existingProjects.find((p) => p.project_code === row.project_code);

      if (existing) {
        // Update existing
        store.updateProject(existing.id, {
          title: row.title,
          status: row.status,
          financials: {
            ...existing.financials!,
            sanctioned_amount: row.sanctioned_amount,
            expenditure_amount: row.expenditure_amount,
            remaining_amount: row.sanctioned_amount - row.expenditure_amount,
            utilisation_percentage:
              row.sanctioned_amount > 0
                ? Math.round((row.expenditure_amount / row.sanctioned_amount) * 1000) / 10
                : 0,
          },
        });
        updated++;
      } else {
        // Insert new
        store.createProject({
          project_code: row.project_code,
          title: row.title,
          description: `Bulk imported development work for ${row.district} district.`,
          category_id: matchCategory.id,
          state: 'Maharashtra',
          district: row.district,
          constituency: 'Nashik Central',
          implementing_agency_id: matchAgency.id,
          status: row.status,
          sanction_date: row.sanction_date,
          expected_completion_date: row.expected_completion_date,
          financials: {
            id: `fin-imp-${Date.now()}-${row.index}`,
            project_id: '',
            sanctioned_amount: row.sanctioned_amount,
            expenditure_amount: row.expenditure_amount,
            remaining_amount: row.sanctioned_amount - row.expenditure_amount,
            utilisation_percentage:
              row.sanctioned_amount > 0
                ? Math.round((row.expenditure_amount / row.sanctioned_amount) * 1000) / 10
                : 0,
          },
          location: {
            id: `loc-imp-${Date.now()}-${row.index}`,
            project_id: '',
            latitude: 19.9975 + (Math.random() - 0.5) * 0.1,
            longitude: 73.7898 + (Math.random() - 0.5) * 0.1,
            address: `${row.title} Site, ${row.district}`,
            pincode: '422001',
          },
        });
        imported++;
      }
    });

    setIsProcessing(false);
    setImportSummary({
      imported,
      updated,
      skipped,
      errors: errCount,
    });
    setParsedRows([]);
    setFile(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-emerald-700 text-xs font-bold uppercase tracking-wider mb-1">
            <FileSpreadsheet className="w-4 h-4" />
            <span>Dataset Ingestion Pipeline</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">CSV Project Data Import</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Bulk ingest official district records, sanction decrees, and expenditure lines into Nidhiनेत्र
          </p>
        </div>

        <button
          onClick={handleDownloadSample}
          className="inline-flex items-center gap-1.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 font-semibold px-3.5 py-2 rounded-lg text-xs transition-colors shadow-2xs"
        >
          <Download className="w-4 h-4 text-slate-500" />
          <span>Download Sample CSV Template</span>
        </button>
      </div>

      {/* Summary Box if completed */}
      {importSummary && (
        <div className="p-6 bg-white border border-emerald-200 rounded-2xl shadow-xs space-y-4">
          <div className="flex items-center gap-3 text-emerald-800">
            <CheckCircle2 className="w-6 h-6 text-emerald-600" />
            <h3 className="font-bold text-base">Bulk Ingestion Run Completed</h3>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
            <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-100">
              <span className="text-xs text-slate-500 font-semibold block">New Projects Created</span>
              <span className="text-2xl font-black text-emerald-700">{importSummary.imported}</span>
            </div>
            <div className="p-3 bg-blue-50 rounded-xl border border-blue-100">
              <span className="text-xs text-slate-500 font-semibold block">Existing Records Updated</span>
              <span className="text-2xl font-black text-blue-700">{importSummary.updated}</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-xs text-slate-500 font-semibold block">Rows Skipped</span>
              <span className="text-2xl font-black text-slate-700">{importSummary.skipped}</span>
            </div>
            <div className="p-3 bg-rose-50 rounded-xl border border-rose-100">
              <span className="text-xs text-slate-500 font-semibold block">Validation Errors</span>
              <span className="text-2xl font-black text-rose-700">{importSummary.errors}</span>
            </div>
          </div>
        </div>
      )}

      {/* Upload Dropzone */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
        <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
          Step 1: Upload CSV Project Dataset
        </h2>

        <div className="border-2 border-dashed border-slate-300 hover:border-emerald-600 rounded-xl p-8 text-center bg-slate-50/60 transition-colors">
          <input
            type="file"
            id="csv-file-input"
            accept=".csv,text/csv"
            onChange={handleFileChange}
            className="hidden"
          />
          <label htmlFor="csv-file-input" className="cursor-pointer flex flex-col items-center">
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mb-3">
              <Upload className="w-6 h-6" />
            </div>
            <span className="text-sm font-bold text-slate-900 hover:underline">
              {file ? file.name : 'Click to select CSV spreadsheet or drag here'}
            </span>
            <span className="text-xs text-slate-500 mt-1">
              Supports standard UTF-8 CSV exports with headers matching sample format
            </span>
          </label>
        </div>
      </div>

      {/* Step 2: Validate & Preview (Section 39) */}
      {parsedRows.length > 0 && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
                Step 2: Parse Validation & Data Preview
              </h2>
              <p className="text-xs text-slate-500">
                {parsedRows.filter((r) => r.isValid).length} valid records ready to commit,{' '}
                {parsedRows.filter((r) => !r.isValid).length} invalid rows flagged
              </p>
            </div>

            <button
              onClick={handleExecuteImport}
              disabled={isProcessing || parsedRows.filter((r) => r.isValid).length === 0}
              className="inline-flex items-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-5 py-2.5 rounded-lg text-xs transition-colors shadow-sm disabled:opacity-60"
            >
              <FileCheck className="w-4 h-4" />
              <span>
                {isProcessing
                  ? 'Committing to Database...'
                  : `Confirm & Import ${parsedRows.filter((r) => r.isValid).length} Projects`}
              </span>
            </button>
          </div>

          <div className="overflow-x-auto border border-slate-200 rounded-xl">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-slate-600 font-semibold uppercase text-[10px]">
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3">Project Code</th>
                  <th className="py-2.5 px-3">Title</th>
                  <th className="py-2.5 px-3">Sector</th>
                  <th className="py-2.5 px-3">Sanctioned</th>
                  <th className="py-2.5 px-3">Expended</th>
                  <th className="py-2.5 px-3">Validation Findings</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {parsedRows.map((row) => (
                  <tr
                    key={row.index}
                    className={row.isValid ? 'hover:bg-slate-50/50' : 'bg-rose-50/60'}
                  >
                    <td className="py-2 px-3">
                      {row.isValid ? (
                        <span className="inline-flex items-center gap-1 text-emerald-700 font-semibold text-[11px]">
                          <Check className="w-3.5 h-3.5" /> Valid
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-rose-700 font-semibold text-[11px]">
                          <X className="w-3.5 h-3.5" /> Error
                        </span>
                      )}
                    </td>
                    <td className="py-2 px-3 font-mono font-semibold text-slate-800">
                      {row.project_code}
                    </td>
                    <td className="py-2 px-3 font-medium text-slate-900 max-w-xs truncate">
                      {row.title}
                    </td>
                    <td className="py-2 px-3 text-slate-600">{row.category_code}</td>
                    <td className="py-2 px-3 font-semibold text-slate-900">
                      {formatCurrencyLakhs(row.sanctioned_amount)}
                    </td>
                    <td className="py-2 px-3 text-slate-600">
                      {formatCurrencyLakhs(row.expenditure_amount)}
                    </td>
                    <td className="py-2 px-3 text-[11px]">
                      {row.isValid ? (
                        <span className="text-slate-400">Schema verified</span>
                      ) : (
                        <span className="text-rose-700 font-semibold">
                          {row.errors.join(', ')}
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
