// Nidhiनेत्र: Citizen Ground Issue Reporting Page (UX4G 3.0 & GIGW 3.0 Compliance)
// Smart India Hackathon 2026

import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { store } from '@/lib/database/store';
import { useAuth } from '@/app/providers/AuthProvider';
import { useGovSettings } from '@/app/providers/GovSettingsProvider';
import { Project, IssueCategory } from '@/types';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { reportIssueSchema, ReportIssueFormData } from '@/lib/validation/schemas';
import {
  Camera,
  CheckCircle2,
  AlertCircle,
  MapPin,
  ArrowRight,
  ShieldCheck,
  X,
  FileCheck,
  Info,
} from 'lucide-react';

const ISSUE_CATEGORIES: { value: IssueCategory; label: string; desc: string }[] = [
  {
    value: 'Work Appears Incomplete',
    label: 'Work Appears Incomplete',
    desc: 'Partial structure left unfinished, open trenches, missing components',
  },
  {
    value: 'Work Delayed',
    label: 'Work Delayed',
    desc: 'Contractor absent, machinery removed, milestone date passed',
  },
  {
    value: 'Work Not Started',
    label: 'Work Not Started',
    desc: 'Sanction approved but no physical mobilization on site',
  },
  {
    value: 'Project Status Mismatch',
    label: 'Project Status Mismatch',
    desc: 'Official records claim completion but ground site is incomplete',
  },
  {
    value: 'Quality Concern',
    label: 'Quality Concern',
    desc: 'Visible cracks, substandard surfacing, inadequate materials',
  },
  {
    value: 'Other',
    label: 'Other Ground Observation',
    desc: 'Drainage blockage, environmental impact, or public hazard',
  },
];

export const ReportIssuePage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { t } = useGovSettings();

  const [projects, setProjects] = useState<Project[]>([]);
  const [evidencePreview, setEvidencePreview] = useState<string | null>(null);
  const [evidenceFileName, setEvidenceFileName] = useState<string | null>(null);
  const [evidenceSize, setEvidenceSize] = useState<number>(0);
  const [evidenceCaption, setEvidenceCaption] = useState<string>('');
  const [fileError, setFileError] = useState<string | null>(null);
  const [submittedReportCode, setSubmittedReportCode] = useState<string | null>(null);

  const initialProjectId = searchParams.get('project_id') || '';

  useEffect(() => {
    const { projects: projs } = store.getProjects({ limit: 100 });
    setProjects(projs);
  }, []);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ReportIssueFormData>({
    resolver: zodResolver(reportIssueSchema),
    defaultValues: {
      project_id: initialProjectId,
      issue_category: 'Work Appears Incomplete',
      description: '',
      observation_date: new Date().toISOString().split('T')[0],
      location_address: '',
    },
  });

  const selectedProjectId = watch('project_id');
  const selectedCategory = watch('issue_category');

  useEffect(() => {
    if (selectedProjectId) {
      const proj = projects.find((p) => p.id === selectedProjectId);
      if (proj && proj.location?.address) {
        setValue('location_address', proj.location.address);
      }
    }
  }, [selectedProjectId, projects, setValue]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFileError(null);
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setFileError('File size exceeds 5MB limit. Please upload a smaller image.');
      return;
    }

    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      setFileError('Invalid file type. Allowed formats: JPG, PNG, WEBP.');
      return;
    }

    setEvidenceFileName(file.name);
    setEvidenceSize(file.size);

    const reader = new FileReader();
    reader.onloadend = () => {
      setEvidencePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const removeEvidence = () => {
    setEvidencePreview(null);
    setEvidenceFileName(null);
    setEvidenceSize(0);
    setEvidenceCaption('');
  };

  const onSubmit = async (data: ReportIssueFormData) => {
    if (!user) {
      alert('Please log in to submit a ground verification report.');
      navigate('/login');
      return;
    }

    const evidenceFiles = evidencePreview
      ? [
          {
            file_name: evidenceFileName || 'ground_evidence.jpg',
            file_url: evidencePreview,
            file_type: 'image/jpeg',
            file_size: evidenceSize || 102400,
            caption: evidenceCaption || 'Citizen on-site observation photo',
          },
        ]
      : [];

    const newReport = store.submitCitizenReport({
      project_id: data.project_id,
      issue_category: data.issue_category,
      description: data.description,
      observation_date: data.observation_date,
      location_address: data.location_address,
      evidenceFiles,
    });

    setSubmittedReportCode(newReport.report_code);
  };

  // SUCCESS RECEIPT VIEW (Section 73)
  if (submittedReportCode) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12">
        <div className="bg-white border border-[#D9DEE5] rounded-md p-8 shadow-2xs text-center space-y-5">
          <div className="w-14 h-14 rounded-full bg-emerald-50 border border-emerald-300 flex items-center justify-center text-[#2E7D32] mx-auto">
            <CheckCircle2 className="w-7 h-7" />
          </div>

          <div className="space-y-1">
            <h2 className="text-xl font-bold text-[#123B6D]">
              Ground Verification Report Submitted
            </h2>
            <p className="text-xs text-[#5F6B7A] max-w-md mx-auto leading-relaxed">
              Your observation and photographic evidence have been officially logged into the Nidhiनेत्र district registry and added to the official review queue.
            </p>
          </div>

          {/* Official Acknowledgement Slip */}
          <div className="p-4 rounded-md bg-[#F7F8FA] border border-[#D9DEE5] text-left max-w-md mx-auto space-y-2.5">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <span className="text-xs text-[#5F6B7A] font-semibold uppercase">Report Tracking ID</span>
              <span className="font-mono text-base font-bold text-[#0B4F9C]">{submittedReportCode}</span>
            </div>
            <div className="flex items-center justify-between text-xs text-slate-700">
              <span>Current Status:</span>
              <span className="font-bold text-amber-900 bg-amber-50 px-2 py-0.5 rounded border border-amber-300">
                SUBMITTED — QUEUED FOR REVIEW
              </span>
            </div>
            <div className="text-[11px] text-[#5F6B7A]">
              An official acknowledgement notification has been dispatched to your profile.
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Link
              to="/citizen/reports"
              className="px-4 py-2 rounded-md bg-[#0B4F9C] hover:bg-[#123B6D] text-white font-semibold text-xs transition-colors flex items-center gap-1.5"
            >
              <span>{t('myReports', 'Track in My Reports')}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/citizen/dashboard"
              className="px-4 py-2 rounded-md bg-white hover:bg-slate-50 text-[#123B6D] border border-[#D9DEE5] font-semibold text-xs transition-colors"
            >
              Back to Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Header */}
      <div className="bg-white border border-[#D9DEE5] rounded-md p-6 shadow-2xs">
        <div className="pb-4 border-b border-[#D9DEE5]">
          <div className="flex items-center gap-2 text-[#0B4F9C] text-xs font-bold uppercase tracking-wider mb-1">
            <ShieldCheck className="w-4 h-4" />
            <span>Nidhiनेत्र • Ground Verification Service</span>
          </div>
          <h1 className="text-xl font-bold text-[#123B6D]">
            Report an Issue or Ground Observation
          </h1>
          <p className="text-xs text-[#5F6B7A] mt-1 leading-relaxed">
            Submit on-site photographic evidence, milestone delay notices, or construction observations. Submissions prompt human government verification.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 pt-5">
          {/* 1. Project Selection */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-[#123B6D]">
              1. Select Development Project <span className="text-rose-600">*</span>
            </label>
            <p className="text-[11px] text-[#5F6B7A]">
              Choose the public work for which you are submitting on-site feedback:
            </p>
            <select
              {...register('project_id')}
              className="w-full py-2.5 px-3 bg-white border border-[#D9DEE5] rounded-md text-xs font-medium text-[#1F2937] focus:border-[#0B4F9C] focus:outline-hidden"
            >
              <option value="">— Select a project from the directory —</option>
              {projects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.title} ({p.project_code}) — {p.constituency}
                </option>
              ))}
            </select>
            {errors.project_id && (
              <p className="text-xs text-rose-600 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                {errors.project_id.message}
              </p>
            )}
          </div>

          {/* 2. Issue Category */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-[#123B6D]">
              2. What did you observe on site? <span className="text-rose-600">*</span>
            </label>
            <p className="text-[11px] text-[#5F6B7A]">Select the primary observation category:</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {ISSUE_CATEGORIES.map((cat) => (
                <label
                  key={cat.value}
                  className={`p-3 rounded-md border text-left cursor-pointer transition-colors block ${
                    selectedCategory === cat.value
                      ? 'border-[#0B4F9C] bg-[#EBF3FA]'
                      : 'border-[#D9DEE5] bg-white hover:bg-slate-50'
                  }`}
                >
                  <input
                    type="radio"
                    value={cat.value}
                    {...register('issue_category')}
                    className="sr-only"
                  />
                  <span className="text-xs font-bold text-[#123B6D] block">{cat.label}</span>
                  <span className="text-[11px] text-[#5F6B7A] mt-0.5 block leading-tight">{cat.desc}</span>
                </label>
              ))}
            </div>
            {errors.issue_category && (
              <p className="text-xs text-rose-600">{errors.issue_category.message}</p>
            )}
          </div>

          {/* 3. Description */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-[#123B6D]">
              3. Observation Details & Factual Description <span className="text-rose-600">*</span>
            </label>
            <p className="text-[11px] text-[#5F6B7A]">
              Describe clearly what is incomplete, missing, or stalled on site:
            </p>
            <textarea
              rows={4}
              {...register('description')}
              placeholder="e.g. Culvert work near km 4 has stalled for past 3 weeks. Gravel washed away; no construction machinery or barricading present on site."
              className="w-full p-3 bg-white border border-[#D9DEE5] rounded-md text-xs text-[#1F2937] focus:border-[#0B4F9C] focus:outline-hidden leading-relaxed"
            />
            {errors.description && (
              <p className="text-xs text-rose-600 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                {errors.description.message}
              </p>
            )}
            <p className="text-[11px] text-[#5F6B7A]">Minimum 20 characters required.</p>
          </div>

          {/* 4. Photographic Evidence (UX4G Government standard file upload) */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-[#123B6D]">
              4. Ground Photographic Evidence (Recommended)
            </label>
            <p className="text-[11px] text-[#5F6B7A]">
              Upload on-site photograph showing actual physical condition:
            </p>

            {fileError && (
              <div className="p-2 rounded bg-rose-50 border border-rose-300 text-rose-700 text-xs flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{fileError}</span>
              </div>
            )}

            {!evidencePreview ? (
              <div className="border border-dashed border-[#D9DEE5] hover:border-[#0B4F9C] rounded-md p-6 text-center bg-[#F7F8FA] transition-colors">
                <input
                  type="file"
                  id="evidence-file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <label
                  htmlFor="evidence-file"
                  className="cursor-pointer flex flex-col items-center justify-center"
                >
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-[#0B4F9C] mb-2">
                    <Camera className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-bold text-[#0B4F9C] hover:underline">
                    Click to select or capture on-site photograph
                  </span>
                  <span className="text-[11px] text-[#5F6B7A] mt-0.5">
                    Supported formats: JPG, PNG, WEBP (Maximum size: 5MB)
                  </span>
                </label>
              </div>
            ) : (
              <div className="p-3 bg-[#F7F8FA] border border-[#D9DEE5] rounded-md space-y-3">
                <div className="relative rounded overflow-hidden border border-slate-200 max-h-56 bg-slate-900 flex items-center justify-center">
                  <img
                    src={evidencePreview}
                    alt="Uploaded ground observation"
                    className="max-h-56 object-contain"
                  />
                  <button
                    type="button"
                    onClick={removeEvidence}
                    className="absolute top-2 right-2 p-1.5 rounded-full bg-slate-900/80 text-white hover:bg-rose-600 transition-colors"
                    title="Remove Photo"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex items-center justify-between text-xs text-[#5F6B7A]">
                  <span className="truncate font-medium text-slate-800">{evidenceFileName}</span>
                  <span className="font-mono text-[11px]">{(evidenceSize / 1024).toFixed(0)} KB</span>
                </div>

                <div>
                  <input
                    type="text"
                    value={evidenceCaption}
                    onChange={(e) => setEvidenceCaption(e.target.value)}
                    placeholder="Photo caption (e.g. Unfinished culvert foundation near road chainage 4.2 km)..."
                    className="w-full px-3 py-1.5 bg-white border border-[#D9DEE5] rounded-md text-xs text-[#1F2937] focus:border-[#0B4F9C] focus:outline-hidden"
                  />
                </div>
              </div>
            )}
          </div>

          {/* 5. Date & Location Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="block text-xs font-bold text-[#123B6D]">
                Date of Observation <span className="text-rose-600">*</span>
              </label>
              <input
                type="date"
                {...register('observation_date')}
                className="w-full px-3 py-2 bg-white border border-[#D9DEE5] rounded-md text-xs text-[#1F2937] focus:border-[#0B4F9C] focus:outline-hidden"
              />
              {errors.observation_date && (
                <p className="text-xs text-rose-600">{errors.observation_date.message}</p>
              )}
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-bold text-[#123B6D]">
                Specific Landmark / Spot Location
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  {...register('location_address')}
                  placeholder="e.g. Near village primary school junction"
                  className="w-full pl-9 pr-3 py-2 bg-white border border-[#D9DEE5] rounded-md text-xs text-[#1F2937] focus:border-[#0B4F9C] focus:outline-hidden"
                />
              </div>
            </div>
          </div>

          {/* GIGW Privacy Notice */}
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-md text-xs text-blue-900 flex items-start gap-2">
            <Info className="w-4 h-4 text-[#0B4F9C] shrink-0 mt-0.5" />
            <div>
              <span className="font-bold block">Privacy & Security Safeguards</span>
              Citizen identities are protected. Your personal phone and email are never displayed on public project records. Ground observations are anonymously aggregated for administrative review.
            </div>
          </div>

          {/* Submit CTA */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-[#0B4F9C] hover:bg-[#123B6D] text-white font-bold py-2.5 px-4 rounded-md shadow-2xs transition-colors flex items-center justify-center gap-2 text-xs sm:text-sm disabled:opacity-70"
          >
            {isSubmitting ? (
              <span>Submitting Ground Report...</span>
            ) : (
              <>
                <FileCheck className="w-4 h-4 text-amber-300" />
                <span>Submit Ground Observation for Human Review</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
