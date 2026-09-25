// ProjectWatch: Application Router
// Smart India Hackathon 2026

import React from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import { RoleGuard } from '@/app/guards/RoleGuard';
import { CitizenLayout } from '@/app/layouts/CitizenLayout';
import { ReviewerLayout } from '@/app/layouts/ReviewerLayout';
import { AdminLayout } from '@/app/layouts/AdminLayout';

import { LoginPage } from '@/pages/auth/LoginPage';
import { RegisterPage } from '@/pages/auth/RegisterPage';

// Citizen Pages
import { CitizenDashboard } from '@/pages/citizen/CitizenDashboard';
import { ProjectsListPage } from '@/pages/common/ProjectsListPage';
import { ProjectDetailPage } from '@/pages/common/ProjectDetailPage';
import { CitizenMapPage } from '@/pages/citizen/CitizenMapPage';
import { ReportIssuePage } from '@/pages/citizen/ReportIssuePage';
import { CitizenReportsPage } from '@/pages/citizen/CitizenReportsPage';
import { CitizenProfilePage } from '@/pages/citizen/CitizenProfilePage';

// Reviewer Pages
import { ReviewerDashboard } from '@/pages/reviewer/ReviewerDashboard';
import { ReviewQueuePage } from '@/pages/reviewer/ReviewQueuePage';
import { ReviewCasePage } from '@/pages/reviewer/ReviewCasePage';
import { ReviewerRiskFlagsPage } from '@/pages/reviewer/ReviewerRiskFlagsPage';
import { ReviewerReportsPage } from '@/pages/reviewer/ReviewerReportsPage';
import { ReviewerAnalyticsPage } from '@/pages/reviewer/ReviewerAnalyticsPage';
import { ReviewerAuditPage } from '@/pages/reviewer/ReviewerAuditPage';
import { ReviewerProfilePage } from '@/pages/reviewer/ReviewerProfilePage';

// Admin Pages
import { AdminDashboard } from '@/pages/admin/AdminDashboard';
import { AdminProjectsPage } from '@/pages/admin/AdminProjectsPage';
import { AdminDataImportPage } from '@/pages/admin/AdminDataImportPage';
import { AdminUsersPage } from '@/pages/admin/AdminUsersPage';
import { AdminRiskConfigPage } from '@/pages/admin/AdminRiskConfigPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to="/login" replace />,
  },
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/register',
    element: <RegisterPage />,
  },

  // Citizen Portal
  {
    path: '/citizen',
    element: (
      <RoleGuard allowedRoles={['citizen', 'reviewer', 'admin']}>
        <CitizenLayout />
      </RoleGuard>
    ),
    children: [
      { path: '', element: <Navigate to="/citizen/dashboard" replace /> },
      { path: 'dashboard', element: <CitizenDashboard /> },
      { path: 'projects', element: <ProjectsListPage userRole="citizen" /> },
      { path: 'projects/:id', element: <ProjectDetailPage userRole="citizen" /> },
      { path: 'map', element: <CitizenMapPage /> },
      { path: 'report-issue', element: <ReportIssuePage /> },
      { path: 'reports', element: <CitizenReportsPage /> },
      { path: 'profile', element: <CitizenProfilePage /> },
    ],
  },

  // Reviewer Government Portal
  {
    path: '/reviewer',
    element: (
      <RoleGuard allowedRoles={['reviewer', 'admin']}>
        <ReviewerLayout />
      </RoleGuard>
    ),
    children: [
      { path: '', element: <Navigate to="/reviewer/dashboard" replace /> },
      { path: 'dashboard', element: <ReviewerDashboard /> },
      { path: 'queue', element: <ReviewQueuePage /> },
      { path: 'cases/:id', element: <ReviewCasePage /> },
      { path: 'projects', element: <ProjectsListPage userRole="reviewer" /> },
      { path: 'projects/:id', element: <ProjectDetailPage userRole="reviewer" /> },
      { path: 'risk-flags', element: <ReviewerRiskFlagsPage /> },
      { path: 'reports', element: <ReviewerReportsPage /> },
      { path: 'analytics', element: <ReviewerAnalyticsPage /> },
      { path: 'audit', element: <ReviewerAuditPage /> },
      { path: 'profile', element: <ReviewerProfilePage /> },
    ],
  },

  // Admin District Portal
  {
    path: '/admin',
    element: (
      <RoleGuard allowedRoles={['admin']}>
        <AdminLayout />
      </RoleGuard>
    ),
    children: [
      { path: '', element: <Navigate to="/admin/dashboard" replace /> },
      { path: 'dashboard', element: <AdminDashboard /> },
      { path: 'projects', element: <AdminProjectsPage /> },
      { path: 'projects/:id', element: <ProjectDetailPage userRole="admin" /> },
      { path: 'reports', element: <ReviewerReportsPage /> },
      { path: 'users', element: <AdminUsersPage /> },
      { path: 'import', element: <AdminDataImportPage /> },
      { path: 'risk', element: <AdminRiskConfigPage /> },
      { path: 'analytics', element: <ReviewerAnalyticsPage /> },
      { path: 'audit', element: <ReviewerAuditPage /> },
    ],
  },

  // Fallback
  {
    path: '*',
    element: <Navigate to="/login" replace />,
  },
]);
