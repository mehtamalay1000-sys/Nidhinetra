// ProjectWatch: Relational Local Store & Persistence Engine
// Smart India Hackathon 2026
// Mirroring PostgreSQL schema & RLS rules for seamless 100% functional demo

import {
  UserProfile,
  ProjectCategory,
  ImplementingAgency,
  Contractor,
  Project,
  CitizenReport,
  ReportEvidence,
  ReviewCase,
  ReviewAction,
  ReviewAssignment,
  AppNotification,
  AuditLog,
  ProjectFilterParams,
  RiskFlag,
} from '@/types';
import {
  INITIAL_PROFILES,
  INITIAL_CATEGORIES,
  INITIAL_AGENCIES,
  INITIAL_CONTRACTORS,
  INITIAL_PROJECTS,
  INITIAL_CITIZEN_REPORTS,
  INITIAL_REVIEW_CASES,
  INITIAL_AUDIT_LOGS,
  INITIAL_NOTIFICATIONS,
} from './initialData';
import { calculateProjectRisk } from '@/features/intelligence/riskEngine';

const STORAGE_KEY = 'projectwatch_db_v1';
const SESSION_KEY = 'projectwatch_active_user';

const memoryStore: Record<string, string> = {};

function safeGetItem(key: string): string | null {
  try {
    if (typeof localStorage !== 'undefined') {
      return localStorage.getItem(key);
    }
  } catch {}
  return memoryStore[key] || null;
}

function safeSetItem(key: string, val: string) {
  try {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(key, val);
      return;
    }
  } catch {}
  memoryStore[key] = val;
}

function safeRemoveItem(key: string) {
  try {
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem(key);
      return;
    }
  } catch {}
  delete memoryStore[key];
}

interface DatabaseSchema {
  profiles: UserProfile[];
  categories: ProjectCategory[];
  agencies: ImplementingAgency[];
  contractors: Contractor[];
  projects: Project[];
  citizen_reports: CitizenReport[];
  review_cases: ReviewCase[];
  audit_logs: AuditLog[];
  notifications: AppNotification[];
}

class ProjectWatchStore {
  private data: DatabaseSchema;
  private currentUser: UserProfile | null = null;
  private listeners: Set<() => void> = new Set();

  constructor() {
    this.data = this.loadFromStorage();
    this.currentUser = this.loadSession();
  }

  private loadFromStorage(): DatabaseSchema {
    try {
      const stored = safeGetItem(STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.error('Failed to parse local database store, initializing default', e);
    }
    const initial: DatabaseSchema = {
      profiles: INITIAL_PROFILES,
      categories: INITIAL_CATEGORIES,
      agencies: INITIAL_AGENCIES,
      contractors: INITIAL_CONTRACTORS,
      projects: INITIAL_PROJECTS,
      citizen_reports: INITIAL_CITIZEN_REPORTS,
      review_cases: INITIAL_REVIEW_CASES,
      audit_logs: INITIAL_AUDIT_LOGS,
      notifications: INITIAL_NOTIFICATIONS,
    };
    this.saveToStorage(initial);
    return initial;
  }

  private saveToStorage(data: DatabaseSchema) {
    try {
      safeSetItem(STORAGE_KEY, JSON.stringify(data));
      this.notifyListeners();
    } catch (e) {
      console.error('Storage write error', e);
    }
  }

  private loadSession(): UserProfile | null {
    try {
      const stored = safeGetItem(SESSION_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.error('Session load error', e);
    }
    // Default to Aarav Deshmukh (citizen) for instant demo
    return INITIAL_PROFILES[0];
  }

  public subscribe(listener: () => void) {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notifyListeners() {
    this.listeners.forEach((l) => l());
  }

  public resetDatabase() {
    safeRemoveItem(STORAGE_KEY);
    this.data = {
      profiles: INITIAL_PROFILES,
      categories: INITIAL_CATEGORIES,
      agencies: INITIAL_AGENCIES,
      contractors: INITIAL_CONTRACTORS,
      projects: INITIAL_PROJECTS,
      citizen_reports: INITIAL_CITIZEN_REPORTS,
      review_cases: INITIAL_REVIEW_CASES,
      audit_logs: INITIAL_AUDIT_LOGS,
      notifications: INITIAL_NOTIFICATIONS,
    };
    this.saveToStorage(this.data);
    this.currentUser = INITIAL_PROFILES[0];
    safeSetItem(SESSION_KEY, JSON.stringify(this.currentUser));
  }

  // --- AUTH METHODS ---
  public getCurrentUser(): UserProfile | null {
    return this.currentUser;
  }

  public setCurrentUser(user: UserProfile | null) {
    this.currentUser = user;
    if (user) {
      localStorage.setItem(SESSION_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(SESSION_KEY);
    }
    this.notifyListeners();
  }

  public getProfiles(): UserProfile[] {
    return this.data.profiles;
  }

  public registerUser(profile: Omit<UserProfile, 'id' | 'created_at'>): UserProfile {
    const existing = this.data.profiles.find((p) => p.email.toLowerCase() === profile.email.toLowerCase());
    if (existing) {
      throw new Error('An account with this email address already exists.');
    }
    const newUser: UserProfile = {
      ...profile,
      id: `usr-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      created_at: new Date().toISOString(),
    };
    this.data.profiles.push(newUser);
    this.saveToStorage(this.data);
    this.setCurrentUser(newUser);

    this.createAuditLog({
      actor_id: newUser.id,
      actor_name: newUser.full_name,
      actor_role: newUser.role,
      action: 'User Registered',
      entity_type: 'user',
      entity_id: newUser.id,
      description: `New user registration for ${newUser.full_name} (${newUser.role}).`,
    });

    return newUser;
  }

  // --- PROJECT METHODS ---
  public getCategories(): ProjectCategory[] {
    return this.data.categories;
  }

  public getAgencies(): ImplementingAgency[] {
    return this.data.agencies;
  }

  public getContractors(): Contractor[] {
    return this.data.contractors;
  }

  public getProjects(params?: ProjectFilterParams): { projects: Project[]; total: number } {
    let list = [...this.data.projects];

    // Join Category, Agency, Contractor, Reports
    list = list.map((p) => {
      const category = this.data.categories.find((c) => c.id === p.category_id);
      const agency = this.data.agencies.find((a) => a.id === p.implementing_agency_id);
      const contractor = this.data.contractors.find((c) => c.id === p.contractor_id);
      const reports = this.data.citizen_reports.filter((r) => r.project_id === p.id);
      return {
        ...p,
        category,
        agency,
        contractor,
        citizen_reports: reports,
      };
    });

    if (params?.search) {
      const q = params.search.toLowerCase();
      list = list.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.project_code.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.district.toLowerCase().includes(q) ||
          p.constituency.toLowerCase().includes(q) ||
          p.location?.address.toLowerCase().includes(q) ||
          p.agency?.name.toLowerCase().includes(q) ||
          p.contractor?.company_name.toLowerCase().includes(q)
      );
    }

    if (params?.category_id && params.category_id !== 'ALL') {
      list = list.filter((p) => p.category_id === params.category_id);
    }

    if (params?.status && params.status !== 'ALL') {
      list = list.filter((p) => p.status === params.status);
    }

    if (params?.district && params.district !== 'ALL') {
      list = list.filter((p) => p.district.toLowerCase() === params.district?.toLowerCase());
    }

    if (params?.constituency && params.constituency !== 'ALL') {
      list = list.filter((p) => p.constituency.toLowerCase() === params.constituency?.toLowerCase());
    }

    if (params?.risk_level && params.risk_level !== 'ALL') {
      list = list.filter((p) => p.risk_flag?.priority_level === params.risk_level);
    }

    // Sorting
    if (params?.sort_by === 'amount_desc') {
      list.sort(
        (a, b) =>
          (b.financials?.sanctioned_amount || 0) - (a.financials?.sanctioned_amount || 0)
      );
    } else if (params?.sort_by === 'risk_desc') {
      list.sort((a, b) => (b.risk_flag?.overall_score || 0) - (a.risk_flag?.overall_score || 0));
    } else if (params?.sort_by === 'title_asc') {
      list.sort((a, b) => a.title.localeCompare(b.title));
    } else {
      // Default: date_desc
      list.sort(
        (a, b) => new Date(b.sanction_date).getTime() - new Date(a.sanction_date).getTime()
      );
    }

    const total = list.length;
    const page = params?.page || 1;
    const limit = params?.limit || 50;
    const startIndex = (page - 1) * limit;
    const paginated = list.slice(startIndex, startIndex + limit);

    return { projects: paginated, total };
  }

  public getProjectById(id: string): Project | undefined {
    const p = this.data.projects.find((proj) => proj.id === id);
    if (!p) return undefined;

    const category = this.data.categories.find((c) => c.id === p.category_id);
    const agency = this.data.agencies.find((a) => a.id === p.implementing_agency_id);
    const contractor = this.data.contractors.find((c) => c.id === p.contractor_id);
    const reports = this.data.citizen_reports
      .filter((r) => r.project_id === p.id)
      .map((r) => ({
        ...r,
        citizen: this.data.profiles.find((pr) => pr.id === r.citizen_id),
      }));

    return {
      ...p,
      category,
      agency,
      contractor,
      citizen_reports: reports,
    };
  }

  public createProject(projectData: Omit<Project, 'id' | 'created_at' | 'updated_at'>): Project {
    const id = `proj-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const newProj: Project = {
      ...projectData,
      id,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    // Calculate baseline risk flag
    const riskResult = calculateProjectRisk(newProj, this.data.projects);
    const riskFlag: RiskFlag = {
      id: `rf-${Date.now()}`,
      project_id: id,
      overall_score: riskResult.overall_score,
      priority_level: riskResult.priority_level,
      status: 'ACTIVE',
      recommendation: riskResult.recommendation,
      calculated_at: new Date().toISOString(),
      factors: riskResult.factors,
    };
    newProj.risk_flag = riskFlag;

    this.data.projects.unshift(newProj);
    this.saveToStorage(this.data);

    this.createAuditLog({
      actor_id: this.currentUser?.id,
      actor_name: this.currentUser?.full_name || 'System Admin',
      actor_role: this.currentUser?.role || 'admin',
      action: 'Project Created',
      entity_type: 'project',
      entity_id: id,
      description: `Created new project "${newProj.title}" (${newProj.project_code}) with budget ₹${(
        (newProj.financials?.sanctioned_amount || 0) / 100000
      ).toFixed(2)} Lakh.`,
      metadata: { project_code: newProj.project_code },
    });

    return newProj;
  }

  public updateProject(id: string, updates: Partial<Project>): Project {
    const index = this.data.projects.findIndex((p) => p.id === id);
    if (index === -1) throw new Error('Project not found');

    const updated = {
      ...this.data.projects[index],
      ...updates,
      updated_at: new Date().toISOString(),
    };

    // Re-evaluate risk
    const riskResult = calculateProjectRisk(updated, this.data.projects);
    updated.risk_flag = {
      id: updated.risk_flag?.id || `rf-${Date.now()}`,
      project_id: id,
      overall_score: riskResult.overall_score,
      priority_level: riskResult.priority_level,
      status: updated.risk_flag?.status || 'ACTIVE',
      recommendation: riskResult.recommendation,
      calculated_at: new Date().toISOString(),
      factors: riskResult.factors,
    };

    this.data.projects[index] = updated;
    this.saveToStorage(this.data);

    this.createAuditLog({
      actor_id: this.currentUser?.id,
      actor_name: this.currentUser?.full_name || 'Admin',
      actor_role: this.currentUser?.role || 'admin',
      action: 'Project Updated',
      entity_type: 'project',
      entity_id: id,
      description: `Updated project parameters for "${updated.title}". Status: ${updated.status}.`,
    });

    return updated;
  }

  // --- CITIZEN REPORTING ---
  public submitCitizenReport(payload: {
    project_id: string;
    issue_category: CitizenReport['issue_category'];
    description: string;
    observation_date: string;
    latitude?: number;
    longitude?: number;
    location_address?: string;
    evidenceFiles?: { file_name: string; file_url: string; file_type: string; file_size: number; caption?: string }[];
  }): CitizenReport {
    const user = this.currentUser;
    if (!user) throw new Error('Authentication required to submit ground report');

    const project = this.getProjectById(payload.project_id);
    if (!project) throw new Error('Project not found');

    // Generate human readable report code: PWR-2026-XXXXX
    const reportCode = `PWR-2026-${Math.floor(10000 + Math.random() * 90000)}`;
    const reportId = `rep-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;

    const evidenceList: ReportEvidence[] = (payload.evidenceFiles || []).map((f, i) => ({
      id: `ev-${Date.now()}-${i}`,
      report_id: reportId,
      file_name: f.file_name,
      file_url: f.file_url,
      file_type: f.file_type,
      file_size: f.file_size,
      caption: f.caption,
      uploaded_at: new Date().toISOString(),
    }));

    const newReport: CitizenReport = {
      id: reportId,
      report_code: reportCode,
      project_id: payload.project_id,
      citizen_id: user.id,
      issue_category: payload.issue_category,
      description: payload.description,
      observation_date: payload.observation_date,
      latitude: payload.latitude || project.location?.latitude,
      longitude: payload.longitude || project.location?.longitude,
      location_address: payload.location_address || project.location?.address,
      status: 'SUBMITTED',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      evidence: evidenceList,
    };

    this.data.citizen_reports.unshift(newReport);

    // Re-evaluate risk for this project because a new citizen report was submitted!
    const updatedProj = this.getProjectById(payload.project_id);
    if (updatedProj) {
      const newRisk = calculateProjectRisk(updatedProj, this.data.projects);
      const projIdx = this.data.projects.findIndex((p) => p.id === payload.project_id);
      if (projIdx !== -1) {
        this.data.projects[projIdx].risk_flag = {
          id: this.data.projects[projIdx].risk_flag?.id || `rf-${Date.now()}`,
          project_id: payload.project_id,
          overall_score: newRisk.overall_score,
          priority_level: newRisk.priority_level,
          status: 'ACTIVE',
          recommendation: newRisk.recommendation,
          calculated_at: new Date().toISOString(),
          factors: newRisk.factors,
        };
      }
    }

    // Auto-create or link Review Case if not existing
    let reviewCase = this.data.review_cases.find((c) => c.project_id === payload.project_id && c.status !== 'RESOLVED');
    if (!reviewCase) {
      reviewCase = {
        id: `case-${Date.now()}`,
        case_number: `CASE-2026-${Math.floor(1000 + Math.random() * 9000)}`,
        project_id: payload.project_id,
        risk_flag_id: updatedProj?.risk_flag?.id,
        status: 'OPEN',
        priority: updatedProj?.risk_flag?.priority_level || 'HIGH',
        summary: `Citizen report submitted for ${project.title}: "${payload.issue_category}". Requires verification.`,
        created_at: new Date().toISOString(),
        assignments: [],
        actions: [],
      };
      this.data.review_cases.unshift(reviewCase);
    }

    // Notification to citizen
    this.createNotification({
      user_id: user.id,
      title: 'Report Received',
      message: `Your report ${reportCode} regarding "${project.title}" has been registered and submitted for human review.`,
      type: 'REPORT_STATUS',
      link: '/citizen/reports',
    });

    // Notification to reviewers
    const reviewerProfiles = this.data.profiles.filter((p) => p.role === 'reviewer');
    reviewerProfiles.forEach((rev) => {
      this.createNotification({
        user_id: rev.id,
        title: 'New Citizen Ground Report',
        message: `New report ${reportCode} filed on "${project.title}" (${payload.issue_category}).`,
        type: 'RISK_ALERT',
        link: `/reviewer/cases/${reviewCase?.id}`,
      });
    });

    // Audit log
    this.createAuditLog({
      actor_id: user.id,
      actor_name: user.full_name,
      actor_role: 'citizen',
      action: 'Report Submitted',
      entity_type: 'citizen_report',
      entity_id: reportId,
      description: `Citizen submitted observation: "${payload.issue_category}" for project "${project.title}" with ${evidenceList.length} evidence attachment(s).`,
      metadata: { report_code: reportCode, project_id: payload.project_id },
    });

    this.saveToStorage(this.data);
    return newReport;
  }

  public getCitizenReports(citizenId?: string): CitizenReport[] {
    let list = this.data.citizen_reports;
    if (citizenId) {
      list = list.filter((r) => r.citizen_id === citizenId);
    }
    return list.map((r) => ({
      ...r,
      project: this.data.projects.find((p) => p.id === r.project_id),
      citizen: this.data.profiles.find((p) => p.id === r.citizen_id),
    }));
  }

  public getReportById(id: string): CitizenReport | undefined {
    const report = this.data.citizen_reports.find((r) => r.id === id || r.report_code === id);
    if (!report) return undefined;
    return {
      ...report,
      project: this.getProjectById(report.project_id),
      citizen: this.data.profiles.find((p) => p.id === report.citizen_id),
    };
  }

  // --- REVIEWER CASE MANAGEMENT ---
  public getReviewCases(statusFilter?: string): ReviewCase[] {
    let cases = [...this.data.review_cases];
    if (statusFilter && statusFilter !== 'ALL') {
      cases = cases.filter((c) => c.status === statusFilter);
    }

    return cases.map((c) => {
      const proj = this.getProjectById(c.project_id);
      const assignments = (c.assignments || []).map((a) => ({
        ...a,
        reviewer: this.data.profiles.find((pr) => pr.id === a.reviewer_id),
      }));
      const actions = (c.actions || []).map((act) => ({
        ...act,
        actor: this.data.profiles.find((pr) => pr.id === act.actor_id),
      }));
      return {
        ...c,
        project: proj,
        assignments,
        actions,
      };
    });
  }

  public getReviewCaseById(id: string): ReviewCase | undefined {
    const c = this.data.review_cases.find((item) => item.id === id || item.case_number === id);
    if (!c) return undefined;

    const proj = this.getProjectById(c.project_id);
    const assignments = (c.assignments || []).map((a) => ({
      ...a,
      reviewer: this.data.profiles.find((pr) => pr.id === a.reviewer_id),
    }));
    const actions = (c.actions || []).map((act) => ({
      ...act,
      actor: this.data.profiles.find((pr) => pr.id === act.actor_id),
    }));

    return {
      ...c,
      project: proj,
      assignments,
      actions,
    };
  }

  public assignCase(caseId: string, reviewerId: string, instructions?: string): ReviewCase {
    const cIdx = this.data.review_cases.findIndex((c) => c.id === caseId);
    if (cIdx === -1) throw new Error('Case not found');

    const reviewer = this.data.profiles.find((p) => p.id === reviewerId);
    if (!reviewer) throw new Error('Reviewer not found');

    const assignment: ReviewAssignment = {
      id: `asg-${Date.now()}`,
      case_id: caseId,
      reviewer_id: reviewerId,
      assigned_by: this.currentUser?.id,
      assigned_at: new Date().toISOString(),
      status: 'ACTIVE',
      instructions,
      reviewer,
    };

    const targetCase = this.data.review_cases[cIdx];
    targetCase.assignments = targetCase.assignments || [];
    targetCase.assignments.unshift(assignment);
    targetCase.status = 'ASSIGNED';
    targetCase.updated_at = new Date().toISOString();

    // Create Notification to reviewer
    this.createNotification({
      user_id: reviewerId,
      title: 'Review Case Assigned',
      message: `Case #${targetCase.case_number} has been assigned to your review queue.`,
      type: 'CASE_ASSIGNMENT',
      link: `/reviewer/cases/${caseId}`,
    });

    // Create Audit Log
    this.createAuditLog({
      actor_id: this.currentUser?.id,
      actor_name: this.currentUser?.full_name || 'Admin',
      actor_role: this.currentUser?.role || 'admin',
      action: 'Case Assigned',
      entity_type: 'review_case',
      entity_id: caseId,
      description: `Assigned case #${targetCase.case_number} to ${reviewer.full_name}.`,
      metadata: { case_number: targetCase.case_number, reviewer: reviewer.full_name },
    });

    this.saveToStorage(this.data);
    return targetCase;
  }

  public recordReviewAction(payload: {
    case_id: string;
    action_type: ReviewAction['action_type'];
    responsible_department: string;
    remarks: string;
    target_date?: string;
  }): ReviewAction {
    const user = this.currentUser;
    if (!user) throw new Error('Authentication required');

    const cIdx = this.data.review_cases.findIndex((c) => c.id === payload.case_id);
    if (cIdx === -1) throw new Error('Case not found');

    const action: ReviewAction = {
      id: `act-${Date.now()}`,
      case_id: payload.case_id,
      actor_id: user.id,
      action_type: payload.action_type,
      responsible_department: payload.responsible_department,
      remarks: payload.remarks,
      target_date: payload.target_date,
      status: payload.action_type === 'Case Resolved' ? 'COMPLETED' : 'IN_PROGRESS',
      created_at: new Date().toISOString(),
      actor: user,
    };

    const targetCase = this.data.review_cases[cIdx];
    targetCase.actions = targetCase.actions || [];
    targetCase.actions.unshift(action);

    if (payload.action_type === 'Case Resolved') {
      targetCase.status = 'RESOLVED';
    } else if (payload.action_type === 'Flag Dismissed') {
      targetCase.status = 'DISMISSED';
    } else {
      targetCase.status = 'ACTION_RECORDED';
    }
    targetCase.updated_at = new Date().toISOString();

    // Update related reports to ACTION_TAKEN or VERIFIED
    const projectReports = this.data.citizen_reports.filter((r) => r.project_id === targetCase.project_id);
    projectReports.forEach((rep) => {
      if (payload.action_type === 'Case Resolved') {
        rep.status = 'RESOLVED';
      } else if (payload.action_type === 'Flag Dismissed') {
        rep.status = 'DISMISSED';
      } else {
        rep.status = 'ACTION_TAKEN';
      }
      rep.updated_at = new Date().toISOString();

      // Notify citizen who filed the report
      this.createNotification({
        user_id: rep.citizen_id,
        title: `Update on Report ${rep.report_code}`,
        message: `Government action recorded: "${payload.action_type}" by ${payload.responsible_department}. Remarks: ${payload.remarks}`,
        type: 'ACTION_UPDATE',
        link: '/citizen/reports',
      });
    });

    // Audit Log
    this.createAuditLog({
      actor_id: user.id,
      actor_name: user.full_name,
      actor_role: user.role,
      action: 'Action Recorded',
      entity_type: 'review_action',
      entity_id: action.id,
      description: `Recorded "${payload.action_type}" for Case #${targetCase.case_number}. Department: ${payload.responsible_department}.`,
      metadata: {
        case_number: targetCase.case_number,
        action_type: payload.action_type,
        remarks: payload.remarks,
      },
    });

    this.saveToStorage(this.data);
    return action;
  }

  public verifyEvidence(caseId: string, reportId: string, remarks: string) {
    const user = this.currentUser;
    const c = this.data.review_cases.find((item) => item.id === caseId);
    const report = this.data.citizen_reports.find((r) => r.id === reportId);
    if (!report) throw new Error('Report not found');

    report.status = 'VERIFIED';
    report.updated_at = new Date().toISOString();

    if (c) {
      c.status = 'UNDER_INVESTIGATION';
      c.updated_at = new Date().toISOString();
    }

    this.createNotification({
      user_id: report.citizen_id,
      title: 'Evidence Verified',
      message: `Your photographic evidence for report ${report.report_code} has been officially verified by the review authority.`,
      type: 'REPORT_STATUS',
      link: '/citizen/reports',
    });

    this.createAuditLog({
      actor_id: user?.id,
      actor_name: user?.full_name || 'Reviewer',
      actor_role: user?.role || 'reviewer',
      action: 'Evidence Verified',
      entity_type: 'citizen_report',
      entity_id: reportId,
      description: `Ground photographic evidence verified for report ${report.report_code}. Remarks: ${remarks}`,
      metadata: { report_code: report.report_code },
    });

    this.saveToStorage(this.data);
  }

  // --- NOTIFICATIONS & AUDIT ---
  public getNotifications(userId?: string): AppNotification[] {
    const uid = userId || this.currentUser?.id;
    if (!uid) return [];
    return this.data.notifications.filter((n) => n.user_id === uid);
  }

  public markNotificationRead(id: string) {
    const notif = this.data.notifications.find((n) => n.id === id);
    if (notif) {
      notif.is_read = true;
      this.saveToStorage(this.data);
    }
  }

  public markAllNotificationsRead(userId?: string) {
    const uid = userId || this.currentUser?.id;
    if (!uid) return;
    this.data.notifications.forEach((n) => {
      if (n.user_id === uid) n.is_read = true;
    });
    this.saveToStorage(this.data);
  }

  public createNotification(payload: Omit<AppNotification, 'id' | 'created_at' | 'is_read'>): AppNotification {
    const notif: AppNotification = {
      ...payload,
      id: `notif-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      is_read: false,
      created_at: new Date().toISOString(),
    };
    this.data.notifications.unshift(notif);
    this.saveToStorage(this.data);
    return notif;
  }

  public getAuditLogs(params?: { entity_type?: string; limit?: number }): AuditLog[] {
    let logs = [...this.data.audit_logs];
    if (params?.entity_type) {
      logs = logs.filter((l) => l.entity_type === params.entity_type);
    }
    logs.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    if (params?.limit) {
      logs = logs.slice(0, params.limit);
    }
    return logs;
  }

  public createAuditLog(payload: Omit<AuditLog, 'id' | 'created_at'>): AuditLog {
    const log: AuditLog = {
      ...payload,
      id: `audit-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      created_at: new Date().toISOString(),
    };
    this.data.audit_logs.unshift(log);
    this.saveToStorage(this.data);
    return log;
  }
}

export const store = new ProjectWatchStore();
