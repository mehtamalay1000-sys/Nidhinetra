// ProjectWatch: Core TypeScript Types & Models
// Smart India Hackathon 2026

export type UserRole = 'citizen' | 'reviewer' | 'admin';

export interface UserProfile {
  id: string;
  role: UserRole;
  full_name: string;
  email: string;
  phone?: string;
  state: string;
  district: string;
  constituency: string;
  avatar_url?: string;
  created_at?: string;
  updated_at?: string;
}

export interface ProjectCategory {
  id: string;
  name: string;
  code: string;
  icon: string;
  description?: string;
}

export interface ImplementingAgency {
  id: string;
  name: string;
  code: string;
  department: string;
  contact_person?: string;
  email?: string;
  phone?: string;
}

export interface Contractor {
  id: string;
  company_name: string;
  registration_number: string;
  pan_number?: string;
  contact_person?: string;
  phone?: string;
  email?: string;
  rating?: number;
}

export type ProjectStatus =
  | 'PROPOSED'
  | 'SANCTIONED'
  | 'IN_PROGRESS'
  | 'DELAYED'
  | 'COMPLETED'
  | 'UNDER_REVIEW';

export interface ProjectLocation {
  id: string;
  project_id: string;
  latitude: number;
  longitude: number;
  address: string;
  landmark?: string;
  pincode: string;
}

export interface ProjectFinancials {
  id: string;
  project_id: string;
  sanctioned_amount: number;
  expenditure_amount: number;
  remaining_amount: number;
  utilisation_percentage: number;
  last_financial_update?: string;
}

export type TimelineEventStatus = 'COMPLETED' | 'IN_PROGRESS' | 'DELAYED' | 'PENDING';

export interface ProjectTimelineEvent {
  id: string;
  project_id: string;
  event_name: string;
  event_date: string;
  status: TimelineEventStatus;
  description?: string;
  order_index: number;
}

export type RiskPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export type IndicatorType =
  | 'TIMELINE'
  | 'EXPENDITURE'
  | 'CITIZEN_REPORTS'
  | 'COMPARABLE_DEVIATION'
  | 'AGENCY_PATTERN';

export interface RiskFactor {
  id: string;
  risk_flag_id?: string;
  factor_name: string;
  factor_score: number;
  factor_weight: number;
  explanation: string;
  indicator_type: IndicatorType;
}

export interface RiskFlag {
  id: string;
  project_id: string;
  overall_score: number;
  priority_level: RiskPriority;
  status: 'ACTIVE' | 'INVESTIGATING' | 'DISMISSED' | 'ACTIONED';
  recommendation: string;
  calculated_at: string;
  updated_at?: string;
  factors: RiskFactor[];
}

export type IssueCategory =
  | 'Work Not Started'
  | 'Work Delayed'
  | 'Work Appears Incomplete'
  | 'Project Status Mismatch'
  | 'Quality Concern'
  | 'Other';

export type ReportStatus =
  | 'SUBMITTED'
  | 'UNDER_REVIEW'
  | 'VERIFICATION_REQUIRED'
  | 'VERIFIED'
  | 'ACTION_TAKEN'
  | 'RESOLVED'
  | 'DISMISSED';

export interface ReportEvidence {
  id: string;
  report_id: string;
  file_name: string;
  file_url: string;
  file_type: string;
  file_size: number;
  caption?: string;
  uploaded_at: string;
}

export interface CitizenReport {
  id: string;
  report_code: string;
  project_id: string;
  citizen_id: string;
  issue_category: IssueCategory;
  description: string;
  observation_date: string;
  latitude?: number;
  longitude?: number;
  location_address?: string;
  status: ReportStatus;
  created_at: string;
  updated_at?: string;
  citizen?: UserProfile;
  project?: Project;
  evidence?: ReportEvidence[];
}

export type CaseStatus =
  | 'OPEN'
  | 'ASSIGNED'
  | 'UNDER_INVESTIGATION'
  | 'VERIFICATION_REQUIRED'
  | 'ACTION_RECORDED'
  | 'RESOLVED'
  | 'DISMISSED';

export interface ReviewAssignment {
  id: string;
  case_id: string;
  reviewer_id: string;
  assigned_by?: string;
  assigned_at: string;
  status: 'ACTIVE' | 'COMPLETED' | 'REASSIGNED';
  instructions?: string;
  reviewer?: UserProfile;
}

export type ReviewActionType =
  | 'Verification Initiated'
  | 'Site Inspection Requested'
  | 'Additional Information Requested'
  | 'Implementation Follow-up'
  | 'Administrative Review'
  | 'Case Resolved'
  | 'Flag Dismissed'
  | 'Other';

export interface ReviewAction {
  id: string;
  case_id: string;
  actor_id: string;
  action_type: ReviewActionType;
  responsible_department: string;
  remarks: string;
  target_date?: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';
  created_at: string;
  actor?: UserProfile;
}

export interface ReviewCase {
  id: string;
  case_number: string;
  project_id: string;
  risk_flag_id?: string;
  status: CaseStatus;
  priority: RiskPriority;
  summary: string;
  created_at: string;
  updated_at?: string;
  project?: Project;
  risk_flag?: RiskFlag;
  assignments?: ReviewAssignment[];
  actions?: ReviewAction[];
}

export type NotificationType =
  | 'REPORT_STATUS'
  | 'RISK_ALERT'
  | 'CASE_ASSIGNMENT'
  | 'ACTION_UPDATE'
  | 'SYSTEM';

export interface AppNotification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: NotificationType;
  link?: string;
  is_read: boolean;
  created_at: string;
}

export interface AuditLog {
  id: string;
  actor_id?: string;
  actor_name: string;
  actor_role: string;
  action: string;
  entity_type: string;
  entity_id: string;
  description: string;
  metadata?: Record<string, unknown> | null;
  created_at: string;
}

export interface Project {
  id: string;
  project_code: string;
  title: string;
  description: string;
  category_id: string;
  state: string;
  district: string;
  constituency: string;
  implementing_agency_id: string;
  contractor_id?: string;
  status: ProjectStatus;
  sanction_date: string;
  expected_completion_date: string;
  actual_completion_date?: string;
  created_at?: string;
  updated_at?: string;

  // Joined relations
  category?: ProjectCategory;
  agency?: ImplementingAgency;
  contractor?: Contractor;
  location?: ProjectLocation;
  financials?: ProjectFinancials;
  timelines?: ProjectTimelineEvent[];
  risk_flag?: RiskFlag;
  citizen_reports?: CitizenReport[];
}

export interface RiskCalculationResult {
  overall_score: number;
  priority_level: RiskPriority;
  recommendation: string;
  factors: RiskFactor[];
}

export interface ProjectFilterParams {
  search?: string;
  category_id?: string;
  status?: string;
  district?: string;
  constituency?: string;
  risk_level?: RiskPriority | 'ALL';
  sort_by?: 'date_desc' | 'amount_desc' | 'risk_desc' | 'title_asc';
  page?: number;
  limit?: number;
}
