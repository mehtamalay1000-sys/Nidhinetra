-- ProjectWatch: Public Project Monitoring & Accountability Platform
-- Smart India Hackathon 2026 Database Migration
-- 001_initial_schema.sql

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Roles table
CREATE TABLE IF NOT EXISTS roles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Profiles table (linked to auth.users in Supabase)
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY,
    role VARCHAR(50) NOT NULL DEFAULT 'citizen',
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(50),
    state VARCHAR(100) DEFAULT 'Maharashtra',
    district VARCHAR(100) DEFAULT 'Nashik',
    constituency VARCHAR(100) DEFAULT 'Nashik Central',
    avatar_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT valid_role CHECK (role IN ('citizen', 'reviewer', 'admin'))
);

-- 3. Project Categories
CREATE TABLE IF NOT EXISTS project_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL UNIQUE,
    code VARCHAR(50) NOT NULL UNIQUE,
    icon VARCHAR(50) NOT NULL DEFAULT 'Folder',
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Implementing Agencies
CREATE TABLE IF NOT EXISTS implementing_agencies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    code VARCHAR(50) NOT NULL UNIQUE,
    department VARCHAR(255) NOT NULL,
    contact_person VARCHAR(255),
    email VARCHAR(255),
    phone VARCHAR(50),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Contractors
CREATE TABLE IF NOT EXISTS contractors (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_name VARCHAR(255) NOT NULL,
    registration_number VARCHAR(100) NOT NULL UNIQUE,
    pan_number VARCHAR(50),
    contact_person VARCHAR(255),
    phone VARCHAR(50),
    email VARCHAR(255),
    rating NUMERIC(3, 2) DEFAULT 4.00,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Projects Table
CREATE TABLE IF NOT EXISTS projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_code VARCHAR(100) NOT NULL UNIQUE,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    category_id UUID NOT NULL REFERENCES project_categories(id) ON DELETE RESTRICT,
    state VARCHAR(100) NOT NULL DEFAULT 'Maharashtra',
    district VARCHAR(100) NOT NULL DEFAULT 'Nashik',
    constituency VARCHAR(100) NOT NULL DEFAULT 'Nashik Central',
    implementing_agency_id UUID NOT NULL REFERENCES implementing_agencies(id) ON DELETE RESTRICT,
    contractor_id UUID REFERENCES contractors(id) ON DELETE SET NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'SANCTIONED',
    sanction_date DATE NOT NULL,
    expected_completion_date DATE NOT NULL,
    actual_completion_date DATE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT valid_project_status CHECK (status IN ('PROPOSED', 'SANCTIONED', 'IN_PROGRESS', 'DELAYED', 'COMPLETED', 'UNDER_REVIEW'))
);

-- 7. Project Locations
CREATE TABLE IF NOT EXISTS project_locations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE UNIQUE,
    latitude NUMERIC(10, 6) NOT NULL,
    longitude NUMERIC(10, 6) NOT NULL,
    address TEXT NOT NULL,
    landmark VARCHAR(255),
    pincode VARCHAR(20) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. Project Financials
CREATE TABLE IF NOT EXISTS project_financials (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE UNIQUE,
    sanctioned_amount NUMERIC(15, 2) NOT NULL CHECK (sanctioned_amount >= 0),
    expenditure_amount NUMERIC(15, 2) NOT NULL DEFAULT 0 CHECK (expenditure_amount >= 0),
    remaining_amount NUMERIC(15, 2) GENERATED ALWAYS AS (sanctioned_amount - expenditure_amount) STORED,
    utilisation_percentage NUMERIC(5, 2) GENERATED ALWAYS AS (
        CASE WHEN sanctioned_amount > 0 THEN ROUND((expenditure_amount / sanctioned_amount) * 100, 2) ELSE 0 END
    ) STORED,
    last_financial_update TIMESTAMPTZ DEFAULT NOW()
);

-- 9. Project Timelines
CREATE TABLE IF NOT EXISTS project_timelines (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    event_name VARCHAR(100) NOT NULL,
    event_date DATE NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'PENDING',
    description TEXT,
    order_index INT NOT NULL DEFAULT 1,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT valid_timeline_status CHECK (status IN ('COMPLETED', 'IN_PROGRESS', 'DELAYED', 'PENDING'))
);

-- 10. Citizen Reports
CREATE TABLE IF NOT EXISTS citizen_reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    report_code VARCHAR(100) NOT NULL UNIQUE,
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    citizen_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    issue_category VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    observation_date DATE NOT NULL,
    latitude NUMERIC(10, 6),
    longitude NUMERIC(10, 6),
    location_address TEXT,
    status VARCHAR(50) NOT NULL DEFAULT 'SUBMITTED',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT valid_issue_category CHECK (issue_category IN (
        'Work Not Started', 'Work Delayed', 'Work Appears Incomplete', 'Project Status Mismatch', 'Quality Concern', 'Other'
    )),
    CONSTRAINT valid_report_status CHECK (status IN (
        'SUBMITTED', 'UNDER_REVIEW', 'VERIFICATION_REQUIRED', 'VERIFIED', 'ACTION_TAKEN', 'RESOLVED', 'DISMISSED'
    ))
);

-- 11. Report Evidence
CREATE TABLE IF NOT EXISTS report_evidence (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    report_id UUID NOT NULL REFERENCES citizen_reports(id) ON DELETE CASCADE,
    file_name VARCHAR(255) NOT NULL,
    file_url TEXT NOT NULL,
    file_type VARCHAR(100) NOT NULL,
    file_size BIGINT NOT NULL,
    caption TEXT,
    uploaded_at TIMESTAMPTZ DEFAULT NOW()
);

-- 12. Risk Flags
CREATE TABLE IF NOT EXISTS risk_flags (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE UNIQUE,
    overall_score NUMERIC(5, 2) NOT NULL CHECK (overall_score >= 0 AND overall_score <= 100),
    priority_level VARCHAR(50) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'ACTIVE',
    recommendation TEXT NOT NULL,
    calculated_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT valid_priority CHECK (priority_level IN ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL')),
    CONSTRAINT valid_flag_status CHECK (status IN ('ACTIVE', 'INVESTIGATING', 'DISMISSED', 'ACTIONED'))
);

-- 13. Risk Factors
CREATE TABLE IF NOT EXISTS risk_factors (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    risk_flag_id UUID NOT NULL REFERENCES risk_flags(id) ON DELETE CASCADE,
    factor_name VARCHAR(100) NOT NULL,
    factor_score NUMERIC(5, 2) NOT NULL,
    factor_weight NUMERIC(3, 2) NOT NULL,
    explanation TEXT NOT NULL,
    indicator_type VARCHAR(50) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 14. Review Cases
CREATE TABLE IF NOT EXISTS review_cases (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    case_number VARCHAR(100) NOT NULL UNIQUE,
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    risk_flag_id UUID REFERENCES risk_flags(id) ON DELETE SET NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'OPEN',
    priority VARCHAR(50) NOT NULL DEFAULT 'HIGH',
    summary TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT valid_case_status CHECK (status IN (
        'OPEN', 'ASSIGNED', 'UNDER_INVESTIGATION', 'VERIFICATION_REQUIRED', 'ACTION_RECORDED', 'RESOLVED', 'DISMISSED'
    )),
    CONSTRAINT valid_case_priority CHECK (priority IN ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL'))
);

-- 15. Review Assignments
CREATE TABLE IF NOT EXISTS review_assignments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    case_id UUID NOT NULL REFERENCES review_cases(id) ON DELETE CASCADE,
    reviewer_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    assigned_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
    assigned_at TIMESTAMPTZ DEFAULT NOW(),
    status VARCHAR(50) NOT NULL DEFAULT 'ACTIVE',
    instructions TEXT,
    CONSTRAINT valid_assignment_status CHECK (status IN ('ACTIVE', 'COMPLETED', 'REASSIGNED'))
);

-- 16. Review Actions
CREATE TABLE IF NOT EXISTS review_actions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    case_id UUID NOT NULL REFERENCES review_cases(id) ON DELETE CASCADE,
    actor_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    action_type VARCHAR(100) NOT NULL,
    responsible_department VARCHAR(255) NOT NULL,
    remarks TEXT NOT NULL,
    target_date DATE,
    status VARCHAR(50) NOT NULL DEFAULT 'IN_PROGRESS',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT valid_action_type CHECK (action_type IN (
        'Verification Initiated', 'Site Inspection Requested', 'Additional Information Requested',
        'Implementation Follow-up', 'Administrative Review', 'Case Resolved', 'Flag Dismissed', 'Other'
    )),
    CONSTRAINT valid_action_status CHECK (status IN ('PENDING', 'IN_PROGRESS', 'COMPLETED'))
);

-- 17. Notifications
CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(50) NOT NULL DEFAULT 'SYSTEM',
    link TEXT,
    is_read BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 18. Audit Logs
CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    actor_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    actor_name VARCHAR(255) NOT NULL,
    actor_role VARCHAR(50) NOT NULL,
    action VARCHAR(255) NOT NULL,
    entity_type VARCHAR(100) NOT NULL,
    entity_id VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    metadata JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 19. Project Updates
CREATE TABLE IF NOT EXISTS project_updates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    physical_progress_percentage NUMERIC(5, 2) NOT NULL CHECK (physical_progress_percentage >= 0 AND physical_progress_percentage <= 100),
    updated_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 20. Project Documents
CREATE TABLE IF NOT EXISTS project_documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    document_type VARCHAR(100) NOT NULL,
    file_url TEXT NOT NULL,
    uploaded_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for high performance
CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);
CREATE INDEX IF NOT EXISTS idx_projects_category ON projects(category_id);
CREATE INDEX IF NOT EXISTS idx_projects_district ON projects(district);
CREATE INDEX IF NOT EXISTS idx_citizen_reports_project ON citizen_reports(project_id);
CREATE INDEX IF NOT EXISTS idx_citizen_reports_citizen ON citizen_reports(citizen_id);
CREATE INDEX IF NOT EXISTS idx_citizen_reports_status ON citizen_reports(status);
CREATE INDEX IF NOT EXISTS idx_risk_flags_project ON risk_flags(project_id);
CREATE INDEX IF NOT EXISTS idx_risk_flags_priority ON risk_flags(priority_level);
CREATE INDEX IF NOT EXISTS idx_review_cases_status ON review_cases(status);
CREATE INDEX IF NOT EXISTS idx_review_cases_priority ON review_cases(priority);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON audit_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id, is_read);

-- Enable Row Level Security (RLS) on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_financials ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_timelines ENABLE ROW LEVEL SECURITY;
ALTER TABLE citizen_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE report_evidence ENABLE ROW LEVEL SECURITY;
ALTER TABLE risk_flags ENABLE ROW LEVEL SECURITY;
ALTER TABLE risk_factors ENABLE ROW LEVEL SECURITY;
ALTER TABLE review_cases ENABLE ROW LEVEL SECURITY;
ALTER TABLE review_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE review_actions ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_updates ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE implementing_agencies ENABLE ROW LEVEL SECURITY;
ALTER TABLE contractors ENABLE ROW LEVEL SECURITY;

-- Base RLS Policies
-- Public projects are readable by all authenticated and anonymous viewers
CREATE POLICY "Public projects are viewable by everyone" ON projects FOR SELECT USING (true);
CREATE POLICY "Project locations are viewable by everyone" ON project_locations FOR SELECT USING (true);
CREATE POLICY "Project financials are viewable by everyone" ON project_financials FOR SELECT USING (true);
CREATE POLICY "Project timelines are viewable by everyone" ON project_timelines FOR SELECT USING (true);
CREATE POLICY "Project categories are viewable by everyone" ON project_categories FOR SELECT USING (true);
CREATE POLICY "Implementing agencies are viewable by everyone" ON implementing_agencies FOR SELECT USING (true);
CREATE POLICY "Contractors are viewable by everyone" ON contractors FOR SELECT USING (true);
CREATE POLICY "Project updates are viewable by everyone" ON project_updates FOR SELECT USING (true);
CREATE POLICY "Project documents are viewable by everyone" ON project_documents FOR SELECT USING (true);

-- Citizen reports: Public safe projection, citizens view their own, reviewers/admins view all
CREATE POLICY "Citizens can insert their own reports" ON citizen_reports FOR INSERT WITH CHECK (auth.uid() = citizen_id);
CREATE POLICY "Users can view their own reports or reviewers/admins can view all" ON citizen_reports FOR SELECT USING (
    auth.uid() = citizen_id OR 
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role IN ('reviewer', 'admin'))
);

-- Report evidence
CREATE POLICY "Evidence viewable by report owner, reviewers, or admins" ON report_evidence FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM citizen_reports 
        WHERE citizen_reports.id = report_evidence.report_id 
        AND (citizen_reports.citizen_id = auth.uid() OR EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role IN ('reviewer', 'admin')))
    )
);
CREATE POLICY "Citizens can upload evidence for their reports" ON report_evidence FOR INSERT WITH CHECK (
    EXISTS (
        SELECT 1 FROM citizen_reports 
        WHERE citizen_reports.id = report_evidence.report_id 
        AND citizen_reports.citizen_id = auth.uid()
    )
);

-- Risk flags and factors: viewable by all (for transparency) or reviewer/admin
CREATE POLICY "Risk flags viewable by everyone" ON risk_flags FOR SELECT USING (true);
CREATE POLICY "Risk factors viewable by everyone" ON risk_factors FOR SELECT USING (true);

-- Review cases, assignments, actions: viewable and manageable by reviewers and admins
CREATE POLICY "Review cases viewable by reviewers and admins" ON review_cases FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role IN ('reviewer', 'admin'))
);
CREATE POLICY "Review actions viewable by reviewers and admins" ON review_actions FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role IN ('reviewer', 'admin'))
);

-- Notifications: user can view their own notifications
CREATE POLICY "Users view own notifications" ON notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users update own notifications" ON notifications FOR UPDATE USING (auth.uid() = user_id);

-- Audit logs: viewable by reviewers and admins
CREATE POLICY "Audit logs viewable by reviewers and admins" ON audit_logs FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role IN ('reviewer', 'admin'))
);
