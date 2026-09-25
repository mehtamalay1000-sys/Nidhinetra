// ProjectWatch: Interactive Leaflet Map Component (Direct Leaflet Integration)
// Smart India Hackathon 2026
// Uses native Leaflet for flawless React 19 compatibility, crisp SVG pins, and interactive popups.

import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import { Project, RiskPriority } from '@/types';
import { formatCurrencyLakhs, getProjectStatusBadge, getRiskPriorityBadge } from '@/lib/utils/formatters';
import { useNavigate } from 'react-router-dom';

interface ProjectMapProps {
  projects: Project[];
  selectedProjectId?: string;
  height?: string;
  userRole?: 'citizen' | 'reviewer' | 'admin';
}

const createCustomIcon = (status: Project['status'], priority?: RiskPriority) => {
  let bgColor = '#2563EB'; // Blue (In Progress)
  if (status === 'COMPLETED') bgColor = '#16A34A'; // Green
  else if (status === 'DELAYED') bgColor = '#D97706'; // Amber
  else if (status === 'UNDER_REVIEW') bgColor = '#DC2626'; // Red
  else if (status === 'SANCTIONED') bgColor = '#4B5563'; // Gray

  const isHighRisk = priority === 'HIGH' || priority === 'CRITICAL';

  return L.divIcon({
    className: 'custom-map-marker',
    html: `
      <div style="
        background-color: ${bgColor};
        width: 32px;
        height: 32px;
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg);
        display: flex;
        align-items: center;
        justify-content: center;
        border: 2px solid #ffffff;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.3);
        position: relative;
      ">
        <div style="
          transform: rotate(45deg);
          color: white;
          font-size: 11px;
          font-weight: bold;
          display: flex;
          align-items: center;
          justify-content: center;
        ">
          ${isHighRisk ? '!' : '●'}
        </div>
      </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  });
};

export const ProjectMap: React.FC<ProjectMapProps> = ({
  projects,
  selectedProjectId,
  height = '500px',
  userRole = 'citizen',
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const navigate = useNavigate();

  const getDetailPath = (projectId: string) => {
    if (userRole === 'reviewer') return `/reviewer/projects/${projectId}`;
    if (userRole === 'admin') return `/admin/projects/${projectId}`;
    return `/citizen/projects/${projectId}`;
  };

  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Destroy existing instance if any
    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
    }

    const defaultCenter: [number, number] = [19.9975, 73.7898]; // Nashik, Maharashtra

    const map = L.map(mapContainerRef.current, {
      center: defaultCenter,
      zoom: 11,
      scrollWheelZoom: false,
    });

    mapInstanceRef.current = map;

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19,
    }).addTo(map);

    const validCoords: [number, number][] = [];

    // Add markers
    projects.forEach((project) => {
      if (!project.location?.latitude || !project.location?.longitude) return;

      const lat = Number(project.location.latitude);
      const lng = Number(project.location.longitude);
      validCoords.push([lat, lng]);

      const statusBadge = getProjectStatusBadge(project.status);
      const riskBadge = getRiskPriorityBadge(project.risk_flag?.priority_level);

      const marker = L.marker([lat, lng], {
        icon: createCustomIcon(project.status, project.risk_flag?.priority_level),
      }).addTo(map);

      const popupHtml = `
        <div style="font-family: sans-serif; min-width: 230px; max-width: 270px; padding: 4px;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
            <span style="font-size: 10px; font-family: monospace; font-weight: bold; color: #64748B;">
              ${project.project_code}
            </span>
            <span style="font-size: 9px; font-weight: 600; padding: 2px 6px; border-radius: 4px; background: #F1F5F9; color: #1E293B;">
              ${statusBadge.label}
            </span>
          </div>
          <h4 style="font-size: 12px; font-weight: bold; color: #0F172A; margin: 0 0 4px 0; line-height: 1.3;">
            ${project.title}
          </h4>
          <p style="font-size: 10px; color: #64748B; margin: 0 0 8px 0;">
            📍 ${project.location.address}
          </p>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 4px; background: #F8FAFC; padding: 6px; border-radius: 6px; border: 1px solid #E2E8F0; text-align: center; margin-bottom: 8px;">
            <div>
              <span style="font-size: 8px; color: #94A3B8; text-transform: uppercase; font-weight: bold; display: block;">Sanction</span>
              <span style="font-size: 11px; font-weight: bold; color: #1E293B;">${formatCurrencyLakhs(project.financials?.sanctioned_amount)}</span>
            </div>
            <div>
              <span style="font-size: 8px; color: #94A3B8; text-transform: uppercase; font-weight: bold; display: block;">Utilisation</span>
              <span style="font-size: 11px; font-weight: bold; color: #1D4ED8;">${project.financials?.utilisation_percentage || 0}%</span>
            </div>
          </div>
          ${
            project.risk_flag
              ? `
            <div style="display: flex; justify-content: space-between; align-items: center; font-size: 10px; background: #FFFBEB; border: 1px solid #FDE68A; padding: 4px 6px; border-radius: 4px; margin-bottom: 8px;">
              <span style="color: #92400E; font-weight: 600;">Risk Signal:</span>
              <span style="font-weight: bold; color: #B45309;">${project.risk_flag.overall_score}/100</span>
            </div>
          `
              : ''
          }
          <a href="${getDetailPath(project.id)}" style="display: block; text-align: center; background: #1D4ED8; color: #ffffff; text-decoration: none; font-size: 11px; font-weight: bold; padding: 6px 10px; border-radius: 6px;">
            View Project Details &rarr;
          </a>
        </div>
      `;

      marker.bindPopup(popupHtml);

      if (selectedProjectId === project.id) {
        marker.openPopup();
      }
    });

    // View boundaries
    if (selectedProjectId) {
      const selected = projects.find((p) => p.id === selectedProjectId);
      if (selected?.location?.latitude && selected?.location?.longitude) {
        map.setView([Number(selected.location.latitude), Number(selected.location.longitude)], 14);
        return;
      }
    }

    if (validCoords.length > 0) {
      const bounds = L.latLngBounds(validCoords);
      map.fitBounds(bounds, { padding: [35, 35], maxZoom: 13 });
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [projects, selectedProjectId]);

  return (
    <div
      className="w-full relative rounded-xl overflow-hidden border border-slate-200 shadow-xs"
      style={{ height }}
    >
      <div ref={mapContainerRef} className="w-full h-full z-10" />

      {/* Map Legend Overlay */}
      <div className="absolute bottom-4 right-4 z-20 bg-white/95 backdrop-blur-xs p-2.5 rounded-lg border border-slate-200 shadow-md text-[11px] hidden sm:block">
        <span className="font-bold text-slate-700 block mb-1.5 text-[10px] uppercase tracking-wider">
          Status Legend
        </span>
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
            <span className="text-slate-600">Completed</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
            <span className="text-slate-600">In Progress</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
            <span className="text-slate-600">Delayed</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-600" />
            <span className="text-slate-600">Under Review</span>
          </div>
        </div>
      </div>
    </div>
  );
};
