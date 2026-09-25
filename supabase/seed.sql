-- ProjectWatch: Seed Data for Smart India Hackathon 2026
-- supabase/seed.sql

-- 1. Insert Roles
INSERT INTO roles (id, name, description) VALUES
('11111111-1111-1111-1111-111111111101', 'citizen', 'Citizen ground observer with reporting and tracking privileges'),
('11111111-1111-1111-1111-111111111102', 'reviewer', 'Government verification officer with review and case workflow privileges'),
('11111111-1111-1111-1111-111111111103', 'admin', 'District administration with project, agency, and policy oversight')
ON CONFLICT (id) DO NOTHING;

-- 2. Insert Demo Profiles
INSERT INTO profiles (id, role, full_name, email, phone, state, district, constituency, avatar_url) VALUES
('22222222-2222-2222-2222-222222222201', 'citizen', 'Aarav Deshmukh', 'citizen@projectwatch.gov.in', '+91 98230 12345', 'Maharashtra', 'Nashik', 'Nashik Central', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'),
('22222222-2222-2222-2222-222222222202', 'reviewer', 'Rahul Sharma', 'reviewer@projectwatch.gov.in', '+91 98231 67890', 'Maharashtra', 'Nashik', 'Nashik Central', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150'),
('22222222-2222-2222-2222-222222222203', 'admin', 'Priya Kulkarni', 'admin@projectwatch.gov.in', '+91 98232 54321', 'Maharashtra', 'Nashik', 'Nashik District', 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150'),
('22222222-2222-2222-2222-222222222204', 'citizen', 'Sunita Patil', 'sunita.patil@example.com', '+91 98233 44556', 'Maharashtra', 'Nashik', 'Deolali', 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150')
ON CONFLICT (id) DO NOTHING;

-- 3. Insert Project Categories
INSERT INTO project_categories (id, name, code, icon, description) VALUES
('33333333-3333-3333-3333-333333333301', 'Road & Highways', 'ROAD', 'Compass', 'Rural roads, arterial links, bypasses, bridges, and culvert construction'),
('33333333-3333-3333-3333-333333333302', 'Healthcare', 'HEALTH', 'HeartPulse', 'Primary healthcare centres, sub-district hospital wings, and diagnostic facilities'),
('33333333-3333-3333-3333-333333333303', 'Education', 'EDU', 'GraduationCap', 'Zilla Parishad schools, secondary school laboratories, and digital classrooms'),
('33333333-3333-3333-3333-333333333304', 'Water & Sanitation', 'WATER', 'Droplet', 'Jal Jeevan Mission piped supply, community percolation tanks, and sanitation blocks'),
('33333333-3333-3333-3333-333333333305', 'Community Infrastructure', 'COMM', 'Building2', 'Community centres, farmer trading yards, multi-purpose sports pavilions, and public lighting')
ON CONFLICT (id) DO NOTHING;

-- 4. Insert Implementing Agencies
INSERT INTO implementing_agencies (id, name, code, department, contact_person, email, phone) VALUES
('44444444-4444-4444-4444-444444444401', 'Public Works Department (PWD) Nashik', 'PWD-NSK', 'Public Works', 'Er. Sanjay Shinde', 'pwd.nashik@maharashtra.gov.in', '0253-2578901'),
('44444444-4444-4444-4444-444444444402', 'Zilla Parishad Rural Development Agency', 'ZPRDA-NSK', 'Rural Development', 'Anjali Rao', 'rdd.nsk@mahazp.gov.in', '0253-2574432'),
('44444444-4444-4444-4444-444444444403', 'Maharashtra Jeevan Pradhikaran (MJP)', 'MJP-DIV3', 'Water Supply & Sanitation', 'Er. Vikas More', 'mjp.nashik@maharashtra.gov.in', '0253-2571122'),
('44444444-4444-4444-4444-444444444404', 'District Health Society Nashik', 'DHS-NSK', 'Public Health & Family Welfare', 'Dr. Nilesh Gaikwad', 'dhs.nsk@health.gov.in', '0253-2573355'),
('44444444-4444-4444-4444-444444444405', 'Nashik Municipal Smart City Development Corp', 'NMSCDCL', 'Urban Development', 'Sumit Mehta', 'info@smartcitynashik.in', '0253-2580000')
ON CONFLICT (id) DO NOTHING;

-- 5. Insert Contractors
INSERT INTO contractors (id, company_name, registration_number, pan_number, contact_person, phone, email, rating) VALUES
('55555555-5555-5555-5555-555555555501', 'Sahyadri Infratech Pvt Ltd', 'MH-NSK-2018-0492', 'AAACS4412B', 'Mahesh Jadhav', '+91 98220 88776', 'mahesh@sahyadriinfra.in', 3.80),
('55555555-5555-5555-5555-555555555502', 'Kiran Construction & Engineering', 'MH-NSK-2015-1108', 'AAACK9842C', 'Kiran Pawar', '+91 98221 44332', 'kiran@kiranconstructions.com', 4.50),
('55555555-5555-5555-5555-555555555503', 'Godavari Jal Infrastructure Ltd', 'MH-BOM-2019-3321', 'AAACG5519D', 'Suresh Tambe', '+91 98222 99001', 'contact@godavarijal.in', 4.10),
('55555555-5555-5555-5555-555555555504', 'Apex civic Works Consortium', 'MH-NSK-2021-0089', 'AAACA7723E', 'Nitin Salunkhe', '+91 98223 11223', 'apex.nashik@gmail.com', 3.20),
('55555555-5555-5555-5555-555555555505', 'Vardhman Structural Solutions', 'MH-PUN-2017-4876', 'AAACV3388F', 'Ramesh Oswal', '+91 98224 55667', 'vardhman.infra@rediffmail.com', 4.70)
ON CONFLICT (id) DO NOTHING;

-- 6. Insert Primary Demo Project and 24 other realistic projects
-- Project 1 (Primary Demo Project)
INSERT INTO projects (
    id, project_code, title, description, category_id, state, district, constituency,
    implementing_agency_id, contractor_id, status, sanction_date, expected_completion_date, actual_completion_date
) VALUES (
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaa0001',
    'MPLAD-2024-MH-0421',
    'Rural Road Improvement',
    'Upgradation of 4.8 km connecting link between Girnare and Gangapur rural clusters including double-lane black-topping, cross-drainage culverts, and road safety berms.',
    '33333333-3333-3333-3333-333333333301',
    'Maharashtra', 'Nashik', 'Nashik Central',
    '44444444-4444-4444-4444-444444444401',
    '55555555-5555-5555-5555-555555555501',
    'UNDER_REVIEW',
    '2024-03-15', '2024-11-30', NULL
);

-- Location 1
INSERT INTO project_locations (project_id, latitude, longitude, address, landmark, pincode) VALUES
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaa0001', 19.9975, 73.7898, 'Girnare to Gangapur Road Sector 2', 'Near Gangapur Dam Water Reservoir Approach', '422222');

-- Financials 1 (₹42.0 Lakh sanctioned, ₹32.8 Lakh expenditure = 78.1%)
INSERT INTO project_financials (project_id, sanctioned_amount, expenditure_amount, last_financial_update) VALUES
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaa0001', 4200000.00, 3280000.00, NOW() - INTERVAL '3 days');

-- Timelines 1
INSERT INTO project_timelines (project_id, event_name, event_date, status, description, order_index) VALUES
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaa0001', 'Sanctioned', '2024-03-15', 'COMPLETED', 'Administrative sanction granted under District Rural Infrastructure Fund', 1),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaa0001', 'Work Started', '2024-04-10', 'COMPLETED', 'Contract awarded and earth excavation works commenced', 2),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaa0001', 'Progress Update', '2024-07-20', 'COMPLETED', 'Sub-grade base layer laid; drainage culvert excavation initiated', 3),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaa0001', 'Expected Completion', '2024-11-30', 'DELAYED', 'Target delivery date exceeded; culvert work stalled', 4),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaa0001', 'Under Review', '2025-01-15', 'IN_PROGRESS', 'Referred to District Review Cell following citizen alerts and timeline overrun', 5);

-- Risk Flag 1 (Score 78)
INSERT INTO risk_flags (id, project_id, overall_score, priority_level, status, recommendation) VALUES
('66666666-6666-6666-6666-666666666601', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaa0001', 78.00, 'HIGH', 'ACTIVE', 'Prioritise for human review.');

-- Risk Factors 1
INSERT INTO risk_factors (risk_flag_id, factor_name, factor_score, factor_weight, explanation, indicator_type) VALUES
('66666666-6666-6666-6666-666666666601', 'Timeline Delay', 85.00, 0.35, 'Project is 5 months behind expected completion date with stalled physical progress.', 'TIMELINE'),
('66666666-6666-6666-6666-666666666601', 'Expenditure Deviation', 75.00, 0.25, 'High fund disbursement (78.1%) relative to verified on-ground physical completion (45%).', 'EXPENDITURE'),
('66666666-6666-6666-6666-666666666601', 'Citizen Feedback', 80.00, 0.25, '2 project-linked ground verification reports received highlighting halted works.', 'CITIZEN_REPORTS'),
('66666666-6666-6666-6666-666666666601', 'Comparable Project Deviation', 70.00, 0.15, 'Expenditure rate is 32% faster than 4 comparable rural link roads in Nashik district.', 'COMPARABLE_DEVIATION');

-- Citizen Reports for Project 1
INSERT INTO citizen_reports (id, report_code, project_id, citizen_id, issue_category, description, observation_date, latitude, longitude, location_address, status, created_at) VALUES
(
    '77777777-7777-7777-7777-777777777701',
    'PWR-2026-00421',
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaa0001',
    '22222222-2222-2222-2222-222222222201',
    'Work Appears Incomplete',
    'The culvert construction near Gangapur reservoir link has been left open and unbarricaded for over 8 weeks. Water is pooling and vehicles cannot pass.',
    '2025-01-10',
    19.9980, 73.7905,
    'Girnare-Gangapur Road Km 2.4, Nashik',
    'VERIFICATION_REQUIRED',
    NOW() - INTERVAL '12 days'
),
(
    '77777777-7777-7777-7777-777777777702',
    'PWR-2026-00422',
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaa0001',
    '22222222-2222-2222-2222-222222222204',
    'Work Delayed',
    'Contractor vehicles and earthmovers were demobilised and removed from site in November 2024. No workers present for over a month.',
    '2025-01-14',
    19.9972, 73.7891,
    'Gangapur Road junction, Nashik',
    'UNDER_REVIEW',
    NOW() - INTERVAL '8 days'
);

-- Report Evidence for Report 1
INSERT INTO report_evidence (id, report_id, file_name, file_url, file_type, file_size, caption, uploaded_at) VALUES
(
    '88888888-8888-8888-8888-888888888801',
    '77777777-7777-7777-7777-777777777701',
    'culvert_abandoned_evidence.jpg',
    'https://images.unsplash.com/photo-1541888946425-d0fbb18615f8?w=800',
    'image/jpeg',
    1845210,
    'Site observation photo showing incomplete concrete culvert wingwall and standing water on roadway',
    NOW() - INTERVAL '12 days'
);

-- Review Case for Project 1
INSERT INTO review_cases (id, case_number, project_id, risk_flag_id, status, priority, summary, created_at) VALUES
(
    '99999999-9999-9999-9999-999999999901',
    'CASE-2026-00421',
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaa0001',
    '66666666-6666-6666-6666-666666666601',
    'ASSIGNED',
    'HIGH',
    'Priority review required: Rural Road Improvement shows 78.1% financial drawdown against stalled culvert construction and multiple citizen reports.',
    NOW() - INTERVAL '10 days'
);

-- Assignment
INSERT INTO review_assignments (case_id, reviewer_id, assigned_by, assigned_at, status, instructions) VALUES
(
    '99999999-9999-9999-9999-999999999901',
    '22222222-2222-2222-2222-222222222202',
    '22222222-2222-2222-2222-222222222203',
    NOW() - INTERVAL '9 days',
    'ACTIVE',
    'Conduct comparative expenditure verification against PWD measurements and verify citizen evidence photo.'
);

-- Review Actions
INSERT INTO review_actions (case_id, actor_id, action_type, responsible_department, remarks, target_date, status, created_at) VALUES
(
    '99999999-9999-9999-9999-999999999901',
    '22222222-2222-2222-2222-222222222202',
    'Verification Initiated',
    'District Review Cell',
    'Preliminary cross-check of MB (Measurement Book) records initiated with PWD Executive Engineer office.',
    CURRENT_DATE + INTERVAL '7 days',
    'COMPLETED',
    NOW() - INTERVAL '8 days'
),
(
    '99999999-9999-9999-9999-999999999901',
    '22222222-2222-2222-2222-222222222202',
    'Site Inspection Requested',
    'Public Works Department (PWD) Nashik',
    'Joint spot verification scheduled with Junior Engineer and citizen representatives at culvert section Km 2.4.',
    CURRENT_DATE + INTERVAL '4 days',
    'IN_PROGRESS',
    NOW() - INTERVAL '5 days'
);

-- Audit Logs for Demo Flow
INSERT INTO audit_logs (id, actor_id, actor_name, actor_role, action, entity_type, entity_id, description, metadata, created_at) VALUES
('baaaaaaa-baaa-baaa-baaa-baaaaaaa0001', '22222222-2222-2222-2222-222222222203', 'Priya Kulkarni', 'admin', 'Project Created', 'project', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaa0001', 'Official sanction registered for Rural Road Improvement (₹42.0 Lakh).', '{"sanctioned_amount": 4200000}', NOW() - INTERVAL '280 days'),
('baaaaaaa-baaa-baaa-baaa-baaaaaaa0002', NULL, 'Risk Engine', 'system', 'Risk Generated', 'risk_flag', '66666666-6666-6666-6666-666666666601', 'Automated anomaly detection computed score 78/100 due to timeline overshoot and expenditure anomaly.', '{"score": 78, "priority": "HIGH"}', NOW() - INTERVAL '15 days'),
('baaaaaaa-baaa-baaa-baaa-baaaaaaa0003', '22222222-2222-2222-2222-222222222201', 'Aarav Deshmukh', 'citizen', 'Report Submitted', 'citizen_report', '77777777-7777-7777-7777-777777777701', 'Citizen report submitted with photo evidence: "Work Appears Incomplete" (PWR-2026-00421).', '{"report_code": "PWR-2026-00421"}', NOW() - INTERVAL '12 days'),
('baaaaaaa-baaa-baaa-baaa-baaaaaaa0004', '22222222-2222-2222-2222-222222222203', 'Priya Kulkarni', 'admin', 'Case Assigned', 'review_case', '99999999-9999-9999-9999-999999999901', 'Review case CASE-2026-00421 assigned to Review Officer Rahul Sharma.', '{"reviewer": "Rahul Sharma"}', NOW() - INTERVAL '9 days'),
('baaaaaaa-baaa-baaa-baaa-baaaaaaa0005', '22222222-2222-2222-2222-222222222202', 'Rahul Sharma', 'reviewer', 'Evidence Verified', 'review_case', '99999999-9999-9999-9999-999999999901', 'Reviewer verified photographic evidence against GIS coordinates and PWD drawings.', '{"verification_status": "VALIDATED"}', NOW() - INTERVAL '7 days'),
('baaaaaaa-baaa-baaa-baaa-baaaaaaa0006', '22222222-2222-2222-2222-222222222202', 'Rahul Sharma', 'reviewer', 'Action Recorded', 'review_action', '99999999-9999-9999-9999-999999999901', 'Site inspection notice issued to PWD Executive Engineer with 4-day compliance target.', '{"action_type": "Site Inspection Requested"}', NOW() - INTERVAL '5 days');

-- Notifications
INSERT INTO notifications (user_id, title, message, type, link, is_read, created_at) VALUES
('22222222-2222-2222-2222-222222222201', 'Report Received', 'Your ground observation PWR-2026-00421 for Rural Road Improvement has been accepted for verification.', 'REPORT_STATUS', '/citizen/reports', true, NOW() - INTERVAL '12 days'),
('22222222-2222-2222-2222-222222222201', 'Action Initiated on Your Report', 'Review Officer Rahul Sharma requested an on-site physical inspection by PWD engineers for report PWR-2026-00421.', 'ACTION_UPDATE', '/citizen/reports', false, NOW() - INTERVAL '5 days'),
('22222222-2222-2222-2222-222222222202', 'Priority Case Assigned', 'Case #CASE-2026-00421 (Rural Road Improvement - Risk 78) has been assigned to your review queue.', 'CASE_ASSIGNMENT', '/reviewer/cases/99999999-9999-9999-9999-999999999901', false, NOW() - INTERVAL '9 days');

-- 7. Add More Realistic Projects Across Categories (Total 20+ projects)
INSERT INTO projects (id, project_code, title, description, category_id, state, district, constituency, implementing_agency_id, contractor_id, status, sanction_date, expected_completion_date, actual_completion_date) VALUES
-- Healthcare
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaa0002', 'MPLAD-2024-MH-0102', 'Sub-District Maternity Care Wing', 'Construction of modern 30-bed maternal and child healthcare annex with neonatal care unit at Trimbakeshwar Sub-District Hospital.', '33333333-3333-3333-3333-333333333302', 'Maharashtra', 'Nashik', 'Nashik West', '44444444-4444-4444-4444-444444444404', '55555555-5555-5555-5555-555555555505', 'IN_PROGRESS', '2024-01-10', '2025-06-30', NULL),
-- Education
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaa0003', 'MPLAD-2023-MH-0088', 'Model Science Laboratory & Digital Classrooms', 'Establishment of 4 modern STEM laboratories and solar-powered interactive smart classrooms in 12 Zilla Parishad secondary schools.', '33333333-3333-3333-3333-333333333303', 'Maharashtra', 'Nashik', 'Deolali', '44444444-4444-4444-4444-444444444402', '55555555-5555-5555-5555-555555555502', 'COMPLETED', '2023-08-01', '2024-09-30', '2024-09-15'),
-- Water & Sanitation
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaa0004', 'MPLAD-2024-MH-0219', 'Piped Drinking Water Scheme', 'Installation of high-capacity filtration plant, overhead ESR reservoir (2.5 Lakh litres), and household distribution pipeline in Sinnar taluka.', '33333333-3333-3333-3333-333333333304', 'Maharashtra', 'Nashik', 'Sinnar', '44444444-4444-4444-4444-444444444403', '55555555-5555-5555-5555-555555555503', 'DELAYED', '2024-02-20', '2024-12-15', NULL),
-- Community Infrastructure
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaa0005', 'MPLAD-2024-MH-0311', 'Multi-Purpose Farmer Community Trading Centre', 'Construction of covered farmer assembly hall, electronic weighbridge, cold storage transit node, and sanitation complex at Dindori market yard.', '33333333-3333-3333-3333-333333333305', 'Maharashtra', 'Nashik', 'Dindori', '44444444-4444-4444-4444-444444444402', '55555555-5555-5555-5555-555555555504', 'IN_PROGRESS', '2024-04-18', '2025-05-30', NULL),
-- Road & Highway 2 (Comparable Project for Project 1)
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaa0006', 'MPLAD-2024-MH-0428', 'Dindori Rural Link Road', 'Widening and resurfacing of 5.2 km link road connecting Ozar highway junction to Dindori rural agricultural cluster.', '33333333-3333-3333-3333-333333333301', 'Maharashtra', 'Nashik', 'Dindori', '44444444-4444-4444-4444-444444444401', '55555555-5555-5555-5555-555555555502', 'COMPLETED', '2024-02-10', '2024-10-31', '2024-10-25'),
-- Road & Highway 3
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaa0007', 'MPLAD-2024-MH-0435', 'Sinnar Industrial Bypass Corridor', 'Construction of 6.4 km heavy transport diversion road to alleviate traffic congestion in Sinnar urban core.', '33333333-3333-3333-3333-333333333301', 'Maharashtra', 'Nashik', 'Sinnar', '44444444-4444-4444-4444-444444444401', '55555555-5555-5555-5555-555555555501', 'UNDER_REVIEW', '2024-05-01', '2025-02-28', NULL),
-- Healthcare 2
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaa0008', 'MPLAD-2024-MH-0115', 'Primary Health Centre Solar Micro-Grid Installation', 'Installation of 25 kW rooftop solar PV systems with battery energy storage across 8 remote tribal PHCs in Peth and Surgana talukas.', '33333333-3333-3333-3333-333333333302', 'Maharashtra', 'Nashik', 'Kalwan', '44444444-4444-4444-4444-444444444404', '55555555-5555-5555-5555-555555555505', 'COMPLETED', '2024-03-01', '2024-11-15', '2024-11-10'),
-- Education 2
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaa0009', 'MPLAD-2024-MH-0094', 'Girl Student Hostel & Skill Training Wing', 'Construction of 100-capacity residential hostel for rural female students pursuing vocational polytechnic diplomas.', '33333333-3333-3333-3333-333333333303', 'Maharashtra', 'Nashik', 'Nashik East', '44444444-4444-4444-4444-444444444402', '55555555-5555-5555-5555-555555555505', 'IN_PROGRESS', '2024-06-15', '2025-08-30', NULL),
-- Water 2
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaa0010', 'MPLAD-2024-MH-0230', 'Groundwater Recharge & Check Dam Construction', 'Construction of 5 cement nala bunds and recharge shafts for seasonal runoff conservation in drought-sensitive Yeola taluka.', '33333333-3333-3333-3333-333333333304', 'Maharashtra', 'Nashik', 'Yeola', '44444444-4444-4444-4444-444444444403', '55555555-5555-5555-5555-555555555503', 'COMPLETED', '2024-01-25', '2024-08-31', '2024-08-20'),
-- Community 2
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaa0011', 'MPLAD-2024-MH-0325', 'Public Recreation Park & Open Gymnasium', 'Development of 3-acre public garden, children sensory play zone, walking track, and high-mast LED illumination in Panchavati.', '33333333-3333-3333-3333-333333333305', 'Maharashtra', 'Nashik', 'Nashik Central', '44444444-4444-4444-4444-444444444405', '55555555-5555-5555-5555-555555555502', 'COMPLETED', '2024-04-01', '2024-12-15', '2024-12-05'),
-- Road 4
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaa0012', 'MPLAD-2024-MH-0442', 'Trimbak Pilgrimage Pedestrian Walkway & Drainage', 'Dedicated covered pedestrian pathway and stormwater drainage channel along the Parikrama route in Trimbakeshwar.', '33333333-3333-3333-3333-333333333301', 'Maharashtra', 'Nashik', 'Nashik West', '44444444-4444-4444-4444-444444444401', '55555555-5555-5555-5555-555555555504', 'DELAYED', '2024-02-15', '2024-11-15', NULL),
-- Healthcare 3
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaa0013', 'MPLAD-2024-MH-0122', 'Mobile Diagnostic Telemedicine Van Fleet', 'Deployment of 3 all-weather mobile diagnostic vans equipped with ECG, digital ultrasound, and satellite telemedicine uplink.', '33333333-3333-3333-3333-333333333302', 'Maharashtra', 'Nashik', 'Nashik District', '44444444-4444-4444-4444-444444444404', '55555555-5555-5555-5555-555555555505', 'COMPLETED', '2024-05-10', '2024-10-31', '2024-10-18'),
-- Education 3
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaa0014', 'MPLAD-2024-MH-0105', 'Tribal Ashram School Kitchen & Dining Modernisation', 'Installation of automated hygienic steam cooking setups, stainless steel dining tables, and UV water purifiers in 6 remote ashram schools.', '33333333-3333-3333-3333-333333333303', 'Maharashtra', 'Nashik', 'Kalwan', '44444444-4444-4444-4444-444444444402', '55555555-5555-5555-5555-555555555502', 'IN_PROGRESS', '2024-07-01', '2025-04-30', NULL),
-- Water 3
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaa0015', 'MPLAD-2024-MH-0245', 'Desilting & Deepening of 8 Percolation Tanks', 'Comprehensive mechanical desilting and bund reinforcement of traditional percolation reservoirs in Niphad agricultural belt.', '33333333-3333-3333-3333-333333333304', 'Maharashtra', 'Nashik', 'Niphad', '44444444-4444-4444-4444-444444444403', '55555555-5555-5555-5555-555555555503', 'COMPLETED', '2024-03-01', '2024-06-15', '2024-06-10'),
-- Proposed
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaa0016', 'MPLAD-2025-MH-0501', 'Smart Solid Waste Segregation & Bio-CNG Facility', 'Establishment of decentralised 15-tonne daily organic waste biomethanation plant supplying cooking fuel to local mid-day meal centres.', '33333333-3333-3333-3333-333333333305', 'Maharashtra', 'Nashik', 'Nashik East', '44444444-4444-4444-4444-444444444405', NULL, 'PROPOSED', '2025-01-05', '2025-12-31', NULL);

-- Financial records for remaining projects
INSERT INTO project_financials (project_id, sanctioned_amount, expenditure_amount) VALUES
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaa0002', 6500000.00, 3900000.00), -- 60%
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaa0003', 2800000.00, 2750000.00), -- 98.2%
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaa0004', 5400000.00, 4600000.00), -- 85.2% (Delayed, high expenditure)
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaa0005', 4800000.00, 2400000.00), -- 50%
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaa0006', 4500000.00, 4380000.00), -- 97.3% (Comparable to Proj 1, completed smoothly)
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaa0007', 7200000.00, 5800000.00), -- 80.5% (Under review)
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaa0008', 1950000.00, 1920000.00), -- 98.5%
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaa0009', 8500000.00, 4250000.00), -- 50%
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaa0010', 2200000.00, 2150000.00), -- 97.7%
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaa0011', 3500000.00, 3450000.00), -- 98.6%
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaa0012', 3800000.00, 3100000.00), -- 81.6% (Delayed)
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaa0013', 4200000.00, 4180000.00), -- 99.5%
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaa0014', 3100000.00, 1200000.00), -- 38.7%
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaa0015', 1800000.00, 1780000.00), -- 98.9%
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaa0016', 9500000.00, 0.00);      -- 0% (Proposed)

-- Locations for remaining projects
INSERT INTO project_locations (project_id, latitude, longitude, address, landmark, pincode) VALUES
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaa0002', 19.9325, 73.5305, 'Trimbak Hospital Campus, Civil Lines', 'Opposite Govt Rest House', '422212'),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaa0003', 19.9540, 73.8120, 'ZP Central High School Campus, Deolali Camp', 'Near Military Cantonment Gate 4', '422401'),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaa0004', 19.8450, 73.9980, 'Sinnar Industrial & Rural Water Node', 'Near MIDC Reservoir Stage 2', '422103'),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaa0005', 20.1800, 73.8320, 'APMC Yard Expansion Phase 1, Dindori', 'Adjacent to Main Highway Toll Plaza', '422202'),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaa0006', 20.0850, 73.8920, 'Ozar to Dindori Connecting Link', 'Near HAL Township Junction', '422207'),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaa0007', 19.8620, 74.0210, 'Sinnar South Bypass km 3.8', 'Near Shirdi Highway Bypass Link', '422103'),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaa0008', 20.4850, 73.7420, 'Kalwan Primary Healthcare Cluster', 'Block Development Office Campus', '423501'),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaa0009', 19.9820, 73.8150, 'Nashik East Skill Campus, Ambad Link', 'Behind ITI College', '422010'),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaa0010', 20.0420, 74.4850, 'Yeola Agricultural Watershed Sector 4', 'Near Muktidham Lake Bund', '423401'),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaa0011', 20.0150, 73.7920, 'Panchavati Godavari Riverside Park', 'Near Ramkund Ghat Approach', '422003'),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaa0012', 19.9280, 73.5280, 'Trimbakeshwar Inner Ring Road', 'Near Kushavarta Kund', '422212'),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaa0013', 20.0020, 73.7840, 'Civil Hospital Depot, Nashik', 'District Health Complex', '422001'),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaa0014', 20.5210, 73.8120, 'Surgana Ashram School Complex', 'Block Educational Zone', '423502'),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaa0015', 20.0920, 74.1120, 'Niphad Grape Farmers Reservoir Zone', 'Niphad Railway Station Road', '422303'),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaa0016', 19.9750, 73.8290, 'Pathardi Phata Solid Waste Processing Park', 'Smart City Zone 3', '422009');

-- Timelines for remaining projects
INSERT INTO project_timelines (project_id, event_name, event_date, status, description, order_index) VALUES
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaa0004', 'Sanctioned', '2024-02-20', 'COMPLETED', 'Administrative sanction accorded under Rural Water Scheme', 1),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaa0004', 'Work Started', '2024-03-15', 'COMPLETED', 'Pipeline laying started from water intake reservoir', 2),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaa0004', 'Expected Completion', '2024-12-15', 'DELAYED', 'Pump delivery delayed from manufacturer; pipeline incomplete', 3),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaa0006', 'Sanctioned', '2024-02-10', 'COMPLETED', 'Sanction granted', 1),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaa0006', 'Completed', '2024-10-25', 'COMPLETED', 'Road completed ahead of schedule with quality certification', 2);

-- Risk flags for delayed/under review projects
INSERT INTO risk_flags (id, project_id, overall_score, priority_level, status, recommendation) VALUES
('66666666-6666-6666-6666-666666666604', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaa0004', 68.00, 'HIGH', 'ACTIVE', 'Schedule technical field audit for pipeline alignment.'),
('66666666-6666-6666-6666-666666666607', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaa0007', 62.00, 'HIGH', 'ACTIVE', 'Review contractor equipment mobilisation and timeline.'),
('66666666-6666-6666-6666-666666666612', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaa0012', 54.00, 'MEDIUM', 'ACTIVE', 'Verify temple trust coordination and drainage clearance.');

INSERT INTO risk_factors (risk_flag_id, factor_name, factor_score, factor_weight, explanation, indicator_type) VALUES
('66666666-6666-6666-6666-666666666604', 'Timeline Delay', 78.00, 0.40, 'Exceeded completion target by 3 months.', 'TIMELINE'),
('66666666-6666-6666-6666-666666666604', 'Expenditure Deviation', 60.00, 0.35, 'Expenditure at 85.2% with pumps yet to be commissioned.', 'EXPENDITURE'),
('66666666-6666-6666-6666-666666666604', 'Citizen Feedback', 65.00, 0.25, '1 citizen report regarding unpaved trenches.', 'CITIZEN_REPORTS');
