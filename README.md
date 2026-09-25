# ProjectWatch (Nidhiनेत्र) — Public Project Monitoring & Accountability

**Smart India Hackathon 2026 Prototype**  
*Tagline: "From public funds to verified action." | "Monitor. Verify. Act."*

> **Notice**: This platform is a hackathon prototype designed for demonstration purposes. It does not represent an official Government of India system. All seed data and cases are simulated to illustrate digital public infrastructure capabilities.

---

## 1. Executive Summary & Core Idea

Public development projects often suffer from fragmented reporting, disconnected expenditure tracking, delayed ground-truth feedback, and high manual oversight burden. **ProjectWatch** connects official project intelligence, statistical AI risk indicators, citizen ground verification, and human administrative governance into a single, closed-loop, traceable workflow:

```
Official Project Data
        ↓
Project Intelligence (Timelines, Sanctions, Drawdowns)
        ↓
Explainable AI Risk Engine (Delay, Velocity, Peer Deviation, Report Density)
        ↓
Citizen Ground Verification (Geo-tagged Observations & Evidence)
        ↓
Human Review Queue (Prioritized Review, Evidence Verification)
        ↓
Government Action (Site Inspections, Inter-departmental Escalations)
        ↓
Resolution & Traceable Audit Trail
```

---

## 2. Core Pillars & Features

### A. Tripartite Role Architecture
1. **Citizen Experience**:
   - Location-aware project discovery (Nashik, Maharashtra focal district).
   - Interactive GIS Project Map (Leaflet & OpenStreetMap) with status pins and popup summaries.
   - Public financial cards displaying Sanctioned, Expended, Remaining, and Utilisation percentages (e.g. ₹42.0 Lakhs sanctioned, 78% utilisation).
   - Milestone progress timeline tracking (`Sanctioned` → `Work Started` → `In Progress` → `Expected Completion`).
   - Ground issue reporting with photo evidence upload, geolocation tagging, and auto-generated tracking IDs (e.g. `PWR-2026-XXXXX`).
   - Personal report lifecycle tracker (`Submitted` → `Under Review` → `Verified` → `Action Taken` → `Resolved`).
   - Private citizen notifications.

2. **Government Reviewer Experience**:
   - Priority Review Queue ordered by Explainable Risk Score and citizen report concentration.
   - Deep-dive Case Management (#CASE-2026-00421) with split-screen layout:
     - Left: Project financials, timeline deviations, peer comparison table, and AI risk breakdown.
     - Right: Citizen reports, high-resolution evidence inspection, reviewer action modal, and case notes.
   - Evidence verification (`Verify`, `Request More Information`, `Dismiss Flag`).
   - Formal Government Action recording (`Site Inspection Requested`, `Verification Initiated`, `Administrative Review`).
   - Immutable Audit Trail view with actor, role, timestamp, and action description.

3. **Collectorate / Admin Experience**:
   - System overview across sectors (Road, Healthcare, Education, Water, Community Infrastructure).
   - Project lifecycle management (Add, edit, sanction updates).
   - Drag-and-drop CSV Project Data Import with parse preview, schema validation, record counter, and error reporting.
   - Role & User Management with security enforcement.
   - Risk Engine threshold configuration (Delay weights, Velocity weights, Report density weights).
   - System audit trail and CSV exports.

---

## 3. Explainable AI Risk Methodology

### Strict AI Ethical Principles
The engine strictly avoids declarative or accusatory language such as "Fraud", "Corruption", or "Fund Misuse". Instead, it generates transparent, explainable indicators:
- `"Risk Flag"`
- `"Potential Anomaly"`
- `"Requires Review"`
- `"Unusual Pattern"`
- `"Prioritise for human review"`

### Mathematical Scoring Model
Projects receive a normalized score from **0 to 100** based on four deterministic signals:
$$\text{Risk Score} = \min\left(100, \sum w_i \cdot s_i\right)$$

1. **Timeline Delay Factor ($W_1 = 30\%$)**:
   - Compares expected completion date with current timestamp and progress milestone.
   - Exponential penalty once project is past deadline with incomplete status.
2. **Expenditure Drawdown Velocity Factor ($W_2 = 25\%$)**:
   - Checks if financial expenditure rate ($Expenditure / Sanctioned$) significantly leads physical progress.
   - High utilisation with early milestone flags a review indicator.
3. **Sector Peer Benchmark Deviation ($W_3 = 20\%$)**:
   - Compares project unit cost and utilisation against comparable projects in the same category (e.g. Rural Roads in Maharashtra).
4. **Citizen Ground Feedback Density ($W_4 = 25\%$)**:
   - Frequency and severity of ground verification reports submitted by verified citizens in that geographic catchment.

### Risk Tiers
- **0–29 (Low)**: Normal implementation velocity.
- **30–59 (Medium)**: Advisory watch status.
- **60–79 (High)**: Prioritized for district reviewer triage.
- **80–100 (Critical)**: Immediate site inspection recommended.

---

## 4. Primary Demo Case: Rural Road Improvement

To allow judges to test the complete workflow immediately, the dataset is seeded with a primary scenario:
- **Project Code**: `PRJ-MH-2024-001`
- **Title**: *Rural Road Improvement (Upgradation of NH-84 to Vani Rural Link)*
- **District / State**: Nashik, Maharashtra
- **Financials**:
  - Sanctioned: **₹42.00 Lakh**
  - Expended: **₹32.80 Lakh**
  - Remaining: **₹9.20 Lakh**
  - Utilisation: **78.1%**
- **Status**: `UNDER_REVIEW` (Original milestone delayed by 5 months)
- **AI Risk Score**: **78 / 100 (High Priority)**
  - *Factor 1*: Timeline delay (5 months behind expected completion)
  - *Factor 2*: Expenditure velocity exceeds physical milestone
  - *Factor 3*: Citizen ground feedback density (2 project-linked reports)
- **Review Case**: `#CASE-2026-00421`

---

## 5. Technology Stack

- **Frontend Framework**: React 19 + TypeScript + Vite
- **Styling & UI**: Tailwind CSS v4, Lucide React, Custom Civic Government Design System
- **State & Data Layer**: TanStack Query v5 + Reactive Observable In-Memory & LocalStorage DB Engine with Supabase Client parity
- **Forms & Validation**: React Hook Form + Zod
- **Mapping & GIS**: Leaflet 1.9 + OpenStreetMap with custom SVG status pins
- **Analytics & Data Viz**: Recharts (Pie charts, Bar charts, Area trends)
- **Backend / Database Support**: 
  - PostgreSQL Relational Schema with 20 tables & Row-Level Security (RLS) in `supabase/migrations/001_initial_schema.sql`
  - Seed SQL script in `supabase/seed.sql`
- **Testing**: Vitest unit & integration test suite (`src/__tests__/projectwatch.test.ts`)

---

## 6. Relational Database Schema

The database model is strictly normalized across 20 tables with UUID primary keys and foreign key constraints:

| Table Name | Description |
|---|---|
| `roles` | System roles: `CITIZEN`, `REVIEWER`, `ADMIN` |
| `profiles` | Extended user profiles linked to Supabase Auth UUID |
| `project_categories` | Sectors: Road, Healthcare, Education, Water, etc. |
| `implementing_agencies`| Government bodies (e.g. Maharashtra PWD, Zilla Parishad) |
| `contractors` | Registered construction & engineering vendors |
| `projects` | Master project catalog with dates, locations, and statuses |
| `project_locations` | Lat/Long geographic coordinates and constituency data |
| `project_financials` | Sanctioned, Expended, Remaining, and Utilisation metrics |
| `project_timelines` | Milestones: Sanctioned, Started, In Progress, Expected Completion |
| `project_documents` | DPRs, Sanction orders, Tender notifications |
| `project_updates` | Official progress updates and engineering reports |
| `citizen_reports` | Ground reports with tracking code (`PWR-2026-XXXXX`) |
| `report_evidence` | Image/document attachments with storage keys & MIME types |
| `risk_flags` | Project risk headers, scores (0-100), and priority levels |
| `risk_factors` | Granular explainable drivers (name, weight, explanation) |
| `review_cases` | Review cases (`#CASE-2026-XXXXX`) |
| `review_assignments` | Case assignees, assignment dates, and notes |
| `review_actions` | Official government actions (inspections, escalations) |
| `notifications` | Role-filtered user notifications with read states |
| `audit_logs` | Immutable audit trail (actor, role, action, target, timestamp) |

---

## 7. Demo Accounts & Credentials

For judge convenience, **1-click login buttons** are available directly on the login page and on the top demo header bar. You can also sign in manually with these accounts:

| Role | Email | Password | Access Path |
|---|---|---|---|
| **Citizen** | `citizen@projectwatch.gov.in` | `Citizen@123` | `/citizen/dashboard` |
| **Reviewer** | `reviewer@pwd.maharashtra.gov.in` | `Reviewer@123` | `/reviewer/dashboard` |
| **Admin** | `collector@nashik.gov.in` | `Admin@123` | `/admin/dashboard` |

---

## 8. Step-by-Step Judge Walkthrough

To verify the complete closed-loop lifecycle from public data to human resolution:

1. **Step 1 — Citizen Project Discovery**:
   - Go to `http://localhost:5173/login` and click **"Citizen Demo"** (or use the top bar).
   - From the Citizen Dashboard, click **"Projects"** or the **Interactive Map**.
   - Search for **"Rural Road Improvement"** in Nashik.
   - Inspect the **Sanctioned Amount (₹42.0L)**, **Expenditure (₹32.8L)**, **78% Utilisation**, and **Timeline**.
2. **Step 2 — Citizen Ground Verification**:
   - On the project detail page, click **"Report an Issue"**.
   - Select observation: *"Work Appears Incomplete"*.
   - Enter description: *"Culvert work is unfinished and road surface gravel is washed away near km 4."*
   - Upload a photo and confirm geolocation.
   - Click **Submit Report**.
   - Note the generated tracking ID (e.g. `PWR-2026-00421`) and see it live in **"My Reports"**.
3. **Step 3 — Reviewer Triage & Case Examination**:
   - Use the top bar switcher or log out and click **"Reviewer Demo"**.
   - Open **"Priority Review Queue"**.
   - Select the high-priority case for **Rural Road Improvement** (`#CASE-2026-00421`).
   - Examine the **AI Risk Analysis**: 78/100 risk score with transparent factor breakdowns (Timeline Delay, Expenditure Velocity, Citizen Feedback Density).
   - Compare unit costs in the **Comparable Projects Benchmark Table**.
4. **Step 4 — Evidence Verification & Government Action**:
   - In the right-hand panel, inspect the citizen ground report and high-resolution photo evidence.
   - Click **"Verify Evidence"**.
   - Click **"Record Action"** and select *"Site Inspection Requested"*.
   - Target Department: *"Nashik District Public Works Sub-Division"*.
   - Remarks: *"Assistant Engineer deputed for physical cross-measurement within 7 working days."*
   - Submit the action.
   - Click **"Resolve Case"** to set case status to `RESOLVED`.
5. **Step 5 — Accountability & Audit Trail Verification**:
   - Open **"Audit Trail"** from the reviewer navigation.
   - Verify that every single action (Citizen Report Submission, Evidence Verification, Site Inspection Order, and Case Resolution) is immutably recorded with actor name, role, and exact timestamp.
6. **Step 6 — Citizen Notification & Tracking**:
   - Switch back to the **Citizen Demo**.
   - Open **"My Reports"** and the **Notifications drawer**.
   - Verify the citizen's report status reflects the update, completing the closed-loop governance cycle.

---

## 9. Setup, Execution & Testing Commands

### Prerequisites
- Node.js 18+ (tested on Node v20/v22)
- npm or pnpm

### Installation
```bash
# Clone or navigate to the workspace
cd d:/Nidhiनेत्र

# Install dependencies
npm install
```

### Development Server
```bash
# Launch Vite development server
npm run dev
# The application will be live at http://localhost:5173/
```

### Production Build
```bash
# Validate TypeScript and generate optimized production bundle
npm run build
```

### Automated Unit & Integration Tests
```bash
# Run Vitest test suite
npm run test
```
The test suite validates:
- [x] Citizen, Reviewer, and Admin authentication & credential rejection
- [x] Relational project querying, search indexing, and category filtering
- [x] Deterministic Explainable Risk Engine scoring and contributing factors
- [x] Citizen ground report creation, tracking ID generation, and validation
- [x] Reviewer evidence verification, action recording, and audit logging
- [x] Notification creation and unread status toggle

---

## 10. Security & Privacy Safeguards

- **Row Level Security (RLS)**: Citizens can only query their own filed reports and personal notifications. Reviewers and Administrators have role-gated access to triage queues and audit records.
- **Citizen PII Masking**: Public-facing project details hide personal citizen identifiers (email, phone, address). Ground reports appear anonymously on public project views.
- **Zero Raw Secret Exposure**: No database service-role keys are exposed in client-side code.
- **Input Sanitization**: All form inputs are validated using Zod schemas to prevent malformed data or injection payloads.

---

## 11. Known Limitations & Production Roadmap

- **Storage**: In the default standalone local configuration, uploaded images are safely converted and stored as persistent base64/Blob URLs in the browser database layer. In full production with Supabase connected, Supabase Storage buckets (`report-evidence`) handle asset hosting with signed URLs.
- **GIS Geocoding**: Coordinates are currently linked to project master records and browser HTML5 Geolocation API; full GIS integration with Bhuvan (ISRO) or BharatMaps can be directly bound to the Leaflet tile layer.
