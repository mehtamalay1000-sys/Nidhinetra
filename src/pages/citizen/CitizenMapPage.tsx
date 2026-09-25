// Nidhiनेत्र: Geospatial Public Projects Map (UX4G 3.0 Standards)
// Smart India Hackathon 2026

import React, { useState, useEffect } from 'react';
import { store } from '@/lib/database/store';
import { Project } from '@/types';
import { ProjectMap } from '@/components/maps/ProjectMap';
import { useGovSettings } from '@/app/providers/GovSettingsProvider';
import { Link } from 'react-router-dom';
import { MapPin } from 'lucide-react';

export const CitizenMapPage: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const { t } = useGovSettings();

  const loadProjects = () => {
    const { projects: projs } = store.getProjects({ limit: 100 });
    setProjects(projs);
  };

  useEffect(() => {
    loadProjects();
    const unsub = store.subscribe(() => loadProjects());
    return () => unsub();
  }, []);

  const filtered = statusFilter === 'ALL'
    ? projects
    : projects.filter((p) => p.status === statusFilter);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Header */}
      <div className="bg-white border border-[#D9DEE5] rounded-md p-5 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-[#5F6B7A] mb-1">
            <Link to="/citizen/dashboard" className="hover:text-[#0B4F9C] hover:underline">
              {t('home', 'Home')}
            </Link>
            <span>/</span>
            <span className="text-[#1F2937] font-semibold">{t('projectMap', 'Project Map')}</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#123B6D] tracking-tight">
            Geospatial Project Locations Map
          </h1>
          <p className="text-xs sm:text-sm text-[#5F6B7A] mt-0.5">
            Geographic distribution of public infrastructure and works across Nashik District.
          </p>
        </div>

        {/* Filter buttons */}
        <div className="flex flex-wrap items-center gap-1 bg-[#F7F8FA] p-1 rounded-md border border-[#D9DEE5]">
          {[
            { id: 'ALL', label: 'All Projects' },
            { id: 'IN_PROGRESS', label: 'Ongoing' },
            { id: 'DELAYED', label: 'Delayed' },
            { id: 'UNDER_REVIEW', label: 'Under Review' },
            { id: 'COMPLETED', label: 'Completed' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                statusFilter === tab.id
                  ? 'bg-[#0B4F9C] text-white font-bold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Map Container */}
      <div className="bg-white border border-[#D9DEE5] rounded-md p-4 shadow-2xs">
        <div className="rounded border border-slate-200 overflow-hidden">
          <ProjectMap projects={filtered} height="560px" userRole="citizen" />
        </div>
      </div>
    </div>
  );
};
