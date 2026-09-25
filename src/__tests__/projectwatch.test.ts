// ProjectWatch: Automated Integration & Unit Tests
// Smart India Hackathon 2026

import { describe, it, expect, beforeEach } from 'vitest';
import { store } from '@/lib/database/store';
import { calculateProjectRisk, DEFAULT_RISK_CONFIG } from '@/features/intelligence/riskEngine';
import { Project } from '@/types';

describe('ProjectWatch Core Domain & Workflow Tests', () => {
  beforeEach(() => {
    store.resetDatabase();
  });

  // 1. AUTHENTICATION & SESSIONS
  it('authenticates pre-seeded demo accounts and retrieves profiles', () => {
    const profiles = store.getProfiles();
    expect(profiles.length).toBeGreaterThanOrEqual(3);

    const citizen = profiles.find((p) => p.email === 'citizen@nidhinetra.gov.in');
    expect(citizen).toBeDefined();
    expect(citizen?.role).toBe('citizen');

    const reviewer = profiles.find((p) => p.email === 'reviewer@nidhinetra.gov.in');
    expect(reviewer).toBeDefined();
    expect(reviewer?.role).toBe('reviewer');

    const admin = profiles.find((p) => p.email === 'admin@nidhinetra.gov.in');
    expect(admin).toBeDefined();
    expect(admin?.role).toBe('admin');
  });

  // 2. PROJECT RETRIEVAL & FILTERING
  it('retrieves projects with relational joins and applies filters correctly', () => {
    const { projects, total } = store.getProjects({ limit: 100 });
    expect(total).toBeGreaterThanOrEqual(15);
    expect(projects.length).toBe(total);

    // Primary demo project verification
    const demoProject = projects.find((p) => p.project_code === 'MPLAD-2024-MH-0421');
    expect(demoProject).toBeDefined();
    expect(demoProject?.title).toBe('Rural Road Improvement');
    expect(demoProject?.status).toBe('UNDER_REVIEW');
    expect(demoProject?.financials?.sanctioned_amount).toBe(4200000);
    expect(demoProject?.financials?.expenditure_amount).toBe(3280000);
    expect(demoProject?.financials?.utilisation_percentage).toBeCloseTo(78.1, 1);

    // Filter by category
    const roadProjects = store.getProjects({ category_id: '33333333-3333-3333-3333-333333333301' });
    expect(roadProjects.projects.every((p) => p.category_id === '33333333-3333-3333-3333-333333333301')).toBe(true);

    // Search query filter
    const searchRes = store.getProjects({ search: 'Gangapur' });
    expect(searchRes.projects.length).toBeGreaterThanOrEqual(1);
    expect(searchRes.projects[0].title).toBe('Rural Road Improvement');
  });

  // 3. EXPLAINABLE AI RISK ENGINE
  it('calculates deterministic explainable risk scores and contributing factors', () => {
    const { projects } = store.getProjects({ limit: 100 });
    const ruralRoad = projects.find((p) => p.project_code === 'MPLAD-2024-MH-0421');
    expect(ruralRoad).toBeDefined();

    const risk = calculateProjectRisk(ruralRoad!, projects, DEFAULT_RISK_CONFIG);
    expect(risk.overall_score).toBeGreaterThanOrEqual(70);
    expect(risk.overall_score).toBeLessThanOrEqual(85);
    expect(risk.priority_level).toBe('HIGH');
    expect(risk.recommendation).toBe('Prioritise for human review.');

    // Contributing factors validation
    expect(risk.factors.length).toBe(4);
    const timelineFactor = risk.factors.find((f) => f.indicator_type === 'TIMELINE');
    expect(timelineFactor).toBeDefined();
    expect(timelineFactor?.factor_score).toBe(85);

    const expenditureFactor = risk.factors.find((f) => f.indicator_type === 'EXPENDITURE');
    expect(expenditureFactor).toBeDefined();
    expect(expenditureFactor?.factor_score).toBe(75);
  });

  // 4. CITIZEN REPORTING WORKFLOW
  it('allows citizen ground report submission with ID generation, notifications, and audit logging', () => {
    const { projects } = store.getProjects();
    const targetProject = projects[0];

    const initialAuditCount = store.getAuditLogs().length;
    const initialReportCount = store.getCitizenReports().length;

    const report = store.submitCitizenReport({
      project_id: targetProject.id,
      issue_category: 'Work Appears Incomplete',
      description: 'On-site culvert excavation abandoned with standing water blocking access.',
      observation_date: '2025-01-20',
      evidenceFiles: [
        {
          file_name: 'test_photo.jpg',
          file_url: 'https://example.com/test.jpg',
          file_type: 'image/jpeg',
          file_size: 204800,
          caption: 'Standing water at culvert wingwall',
        },
      ],
    });

    expect(report.id).toBeDefined();
    expect(report.report_code).toMatch(/^PWR-2026-\d{5}$/);
    expect(report.status).toBe('SUBMITTED');
    expect(report.evidence?.length).toBe(1);

    // Verify report persisted in store
    const allReports = store.getCitizenReports();
    expect(allReports.length).toBe(initialReportCount + 1);

    // Verify audit log generated
    const auditLogs = store.getAuditLogs();
    expect(auditLogs.length).toBeGreaterThan(initialAuditCount);
    const latestAudit = auditLogs[0];
    expect(latestAudit.action).toBe('Report Submitted');
    expect(latestAudit.entity_id).toBe(report.id);
  });

  // 5. REVIEWER EVIDENCE VERIFICATION & GOVERNMENT ACTION RECORDING
  it('allows reviewers to verify evidence, record actions, and transition case to RESOLVED', () => {
    const cases = store.getReviewCases();
    const demoCase = cases.find((c) => c.case_number === 'CASE-2026-00421');
    expect(demoCase).toBeDefined();

    const reports = store.getCitizenReports();
    const targetReport = reports.find((r) => r.report_code === 'PWR-2026-00421');
    expect(targetReport).toBeDefined();

    // Verify Evidence
    store.verifyEvidence(demoCase!.id, targetReport!.id, 'Field coordinates and blueprint validated.');
    const updatedReport = store.getReportById(targetReport!.id);
    expect(updatedReport?.status).toBe('VERIFIED');

    // Record Action
    const action = store.recordReviewAction({
      case_id: demoCase!.id,
      action_type: 'Site Inspection Requested',
      responsible_department: 'Public Works Department (PWD) Nashik',
      remarks: 'Joint site visit ordered for junior engineers within 48 hours.',
      target_date: '2025-02-10',
    });

    expect(action.id).toBeDefined();
    expect(action.action_type).toBe('Site Inspection Requested');

    const updatedCase = store.getReviewCaseById(demoCase!.id);
    expect(updatedCase?.status).toBe('ACTION_RECORDED');
    expect(updatedCase?.actions?.length).toBeGreaterThanOrEqual(1);

    // Resolve Case
    store.recordReviewAction({
      case_id: demoCase!.id,
      action_type: 'Case Resolved',
      responsible_department: 'District Review Cell',
      remarks: 'Culvert drainage completed and road link reopened.',
    });

    const resolvedCase = store.getReviewCaseById(demoCase!.id);
    expect(resolvedCase?.status).toBe('RESOLVED');
  });

  // 6. NOTIFICATION SYSTEM
  it('creates notifications and tracks read status', () => {
    const citizenUser = store.getProfiles().find((p) => p.role === 'citizen')!;
    const notifsBefore = store.getNotifications(citizenUser.id);

    const newNotif = store.createNotification({
      user_id: citizenUser.id,
      title: 'Field Verification Completed',
      message: 'PWD engineers completed physical inspection on your reported site.',
      type: 'ACTION_UPDATE',
      link: '/citizen/reports',
    });

    const notifsAfter = store.getNotifications(citizenUser.id);
    expect(notifsAfter.length).toBe(notifsBefore.length + 1);
    expect(notifsAfter[0].is_read).toBe(false);

    store.markNotificationRead(newNotif.id);
    const updatedNotif = store.getNotifications(citizenUser.id).find((n) => n.id === newNotif.id);
    expect(updatedNotif?.is_read).toBe(true);
  });
});
