// ProjectWatch: Admin Project Management Page
// Smart India Hackathon 2026

import React, { useState, useEffect } from 'react';
import { store } from '@/lib/database/store';
import { Project, ProjectStatus } from '@/types';
import {
  formatCurrencyLakhs,
  getProjectStatusBadge,
  formatDate,
} from '@/lib/utils/formatters';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { projectFormSchema, ProjectFormData } from '@/lib/validation/schemas';
import {
  FolderPlus,
  Search,
  Plus,
  Edit,
  X,
  CheckCircle2,
  AlertCircle,
  MapPin,
  ExternalLink,
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const AdminProjectsPage: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);

  const categories = store.getCategories();
  const agencies = store.getAgencies();
  const contractors = store.getContractors();

  const loadProjects = () => {
    const { projects: projs } = store.getProjects({ limit: 100 });
    setProjects(projs);
  };

  useEffect(() => {
    loadProjects();
    const unsub = store.subscribe(() => loadProjects());
    return () => unsub();
  }, []);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ProjectFormData>({
    resolver: zodResolver(projectFormSchema),
    defaultValues: {
      project_code: `MPLAD-2025-MH-0${Math.floor(100 + Math.random() * 900)}`,
      title: '',
      description: '',
      category_id: categories[0]?.id || '',
      state: 'Maharashtra',
      district: 'Nashik',
      constituency: 'Nashik Central',
      implementing_agency_id: agencies[0]?.id || '',
      contractor_id: contractors[0]?.id || '',
      status: 'SANCTIONED',
      sanction_date: new Date().toISOString().split('T')[0],
      expected_completion_date: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      sanctioned_amount: 3500000,
      expenditure_amount: 0,
      latitude: 19.9975,
      longitude: 73.7898,
      address: 'Gangapur Road Sector 4',
      pincode: '422005',
    },
  });

  const openCreateModal = () => {
    setEditingProjectId(null);
    reset({
      project_code: `MPLAD-2025-MH-0${Math.floor(100 + Math.random() * 900)}`,
      title: '',
      description: '',
      category_id: categories[0]?.id || '',
      state: 'Maharashtra',
      district: 'Nashik',
      constituency: 'Nashik Central',
      implementing_agency_id: agencies[0]?.id || '',
      contractor_id: contractors[0]?.id || '',
      status: 'SANCTIONED',
      sanction_date: new Date().toISOString().split('T')[0],
      expected_completion_date: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      sanctioned_amount: 3500000,
      expenditure_amount: 0,
      latitude: 19.9975,
      longitude: 73.7898,
      address: 'Gangapur Road Sector 4',
      pincode: '422005',
    });
    setShowModal(true);
  };

  const openEditModal = (p: Project) => {
    setEditingProjectId(p.id);
    setValue('project_code', p.project_code);
    setValue('title', p.title);
    setValue('description', p.description);
    setValue('category_id', p.category_id);
    setValue('state', p.state);
    setValue('district', p.district);
    setValue('constituency', p.constituency);
    setValue('implementing_agency_id', p.implementing_agency_id);
    setValue('contractor_id', p.contractor_id || '');
    setValue('status', p.status);
    setValue('sanction_date', p.sanction_date);
    setValue('expected_completion_date', p.expected_completion_date);
    setValue('sanctioned_amount', p.financials?.sanctioned_amount || 0);
    setValue('expenditure_amount', p.financials?.expenditure_amount || 0);
    setValue('latitude', p.location?.latitude || 19.9975);
    setValue('longitude', p.location?.longitude || 73.7898);
    setValue('address', p.location?.address || '');
    setValue('pincode', p.location?.pincode || '422005');
    setShowModal(true);
  };

  const onSubmit = async (data: ProjectFormData) => {
    const sanctioned = Number(data.sanctioned_amount);
    const expenditure = Number(data.expenditure_amount);
    const remaining = sanctioned - expenditure;
    const utilisation = sanctioned > 0 ? (expenditure / sanctioned) * 100 : 0;

    if (editingProjectId) {
      // Update
      store.updateProject(editingProjectId, {
        title: data.title,
        description: data.description,
        status: data.status as ProjectStatus,
        expected_completion_date: data.expected_completion_date,
        financials: {
          id: `fin-${editingProjectId}`,
          project_id: editingProjectId,
          sanctioned_amount: sanctioned,
          expenditure_amount: expenditure,
          remaining_amount: remaining,
          utilisation_percentage: Math.round(utilisation * 10) / 10,
          last_financial_update: new Date().toISOString(),
        },
      });
      setFeedback(`Project "${data.title}" updated successfully.`);
    } else {
      // Create
      store.createProject({
        project_code: data.project_code,
        title: data.title,
        description: data.description,
        category_id: data.category_id,
        state: data.state,
        district: data.district,
        constituency: data.constituency,
        implementing_agency_id: data.implementing_agency_id,
        contractor_id: data.contractor_id,
        status: data.status as ProjectStatus,
        sanction_date: data.sanction_date,
        expected_completion_date: data.expected_completion_date,
        location: {
          id: `loc-${Date.now()}`,
          project_id: '',
          latitude: data.latitude,
          longitude: data.longitude,
          address: data.address,
          pincode: data.pincode,
        },
        financials: {
          id: `fin-${Date.now()}`,
          project_id: '',
          sanctioned_amount: sanctioned,
          expenditure_amount: expenditure,
          remaining_amount: remaining,
          utilisation_percentage: Math.round(utilisation * 10) / 10,
          last_financial_update: new Date().toISOString(),
        },
        timelines: [
          {
            id: `t-${Date.now()}`,
            project_id: '',
            event_name: 'Sanction Registered',
            event_date: data.sanction_date,
            status: 'COMPLETED',
            description: 'Administrative approval recorded by District Planning Committee',
            order_index: 1,
          },
        ],
      });
      setFeedback(`New project "${data.title}" successfully sanctioned & registered.`);
    }

    setShowModal(false);
    setTimeout(() => setFeedback(null), 3500);
  };

  const filtered = projects.filter((p) => {
    const q = search.toLowerCase();
    return (
      !search ||
      p.title.toLowerCase().includes(q) ||
      p.project_code.toLowerCase().includes(q) ||
      p.district.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Project Master Records</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Register new development projects, update implementation statuses, and adjust financial outlays
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs sm:text-sm px-4 py-2.5 rounded-lg shadow-xs transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Sanction New Project</span>
        </button>
      </div>

      {feedback && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs font-semibold text-emerald-900 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{feedback}</span>
        </div>
      )}

      {/* Search */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search projects by title, code, or district..."
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:bg-white focus:outline-hidden"
          />
        </div>
      </div>

      {/* Projects Table */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-slate-600 font-semibold uppercase text-[11px]">
                <th className="py-3 px-4">Code & Title</th>
                <th className="py-3 px-4">Sector</th>
                <th className="py-3 px-4">Sanctioned</th>
                <th className="py-3 px-4">Expended</th>
                <th className="py-3 px-4">Utilisation</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((p) => {
                const statusBadge = getProjectStatusBadge(p.status);

                return (
                  <tr key={p.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-mono text-[11px] font-bold text-slate-600">{p.project_code}</div>
                      <div className="font-bold text-slate-900 text-xs mt-0.5">{p.title}</div>
                      <span className="text-[10px] text-slate-400">{p.district} • {p.constituency}</span>
                    </td>

                    <td className="py-3 px-4 text-slate-700 font-medium">
                      {p.category?.name || 'General'}
                    </td>

                    <td className="py-3 px-4 font-semibold text-slate-900">
                      {formatCurrencyLakhs(p.financials?.sanctioned_amount)}
                    </td>

                    <td className="py-3 px-4 text-slate-600">
                      {formatCurrencyLakhs(p.financials?.expenditure_amount)}
                    </td>

                    <td className="py-3 px-4 font-bold text-blue-700">
                      {p.financials?.utilisation_percentage || 0}%
                    </td>

                    <td className="py-3 px-4">
                      <span className={`text-[10px] px-2 py-0.5 rounded font-semibold ${statusBadge.className}`}>
                        {statusBadge.label}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEditModal(p)}
                          className="p-1.5 rounded text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                          title="Edit Project"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <Link
                          to={`/admin/projects/${p.id}`}
                          className="p-1.5 rounded text-blue-600 hover:text-blue-800 hover:bg-blue-50 transition-colors"
                          title="View Details"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* CREATE / EDIT MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl space-y-4 my-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-base text-slate-900">
                {editingProjectId ? 'Edit Project Master Record' : 'Sanction New Public Project'}
              </h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Project Code *</label>
                  <input
                    type="text"
                    {...register('project_code')}
                    disabled={Boolean(editingProjectId)}
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900 disabled:opacity-60"
                  />
                  {errors.project_code && (
                    <p className="text-[11px] text-rose-600 mt-0.5">{errors.project_code.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Sector Category *</label>
                  <select
                    {...register('category_id')}
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Project Title *</label>
                <input
                  type="text"
                  {...register('title')}
                  placeholder="e.g. Rural Road Improvement"
                  className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900"
                />
                {errors.title && <p className="text-[11px] text-rose-600 mt-0.5">{errors.title.message}</p>}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Description & Scope *</label>
                <textarea
                  rows={3}
                  {...register('description')}
                  placeholder="Official project scope, deliverables, and technical specifications..."
                  className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900"
                />
                {errors.description && (
                  <p className="text-[11px] text-rose-600 mt-0.5">{errors.description.message}</p>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Implementing Agency *</label>
                  <select
                    {...register('implementing_agency_id')}
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900"
                  >
                    {agencies.map((a) => (
                      <option key={a.id} value={a.id}>
                        {a.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Contractor / Agency</label>
                  <select
                    {...register('contractor_id')}
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900"
                  >
                    <option value="">— Direct Agency Execution —</option>
                    {contractors.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.company_name} (Rating: {c.rating})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Status *</label>
                  <select
                    {...register('status')}
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900"
                  >
                    <option value="SANCTIONED">SANCTIONED</option>
                    <option value="IN_PROGRESS">IN_PROGRESS</option>
                    <option value="DELAYED">DELAYED</option>
                    <option value="UNDER_REVIEW">UNDER_REVIEW</option>
                    <option value="COMPLETED">COMPLETED</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Sanction Date *</label>
                  <input
                    type="date"
                    {...register('sanction_date')}
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Target Completion *</label>
                  <input
                    type="date"
                    {...register('expected_completion_date')}
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Sanctioned Amount (INR) *
                  </label>
                  <input
                    type="number"
                    step="10000"
                    {...register('sanctioned_amount', { valueAsNumber: true })}
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Expenditure Disbursed (INR) *
                  </label>
                  <input
                    type="number"
                    step="10000"
                    {...register('expenditure_amount', { valueAsNumber: true })}
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1">Site Address *</label>
                  <input
                    type="text"
                    {...register('address')}
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Pincode *</label>
                  <input
                    type="text"
                    {...register('pincode')}
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 text-xs font-bold bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg shadow-xs"
                >
                  {editingProjectId ? 'Update Project' : 'Sanction & Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
