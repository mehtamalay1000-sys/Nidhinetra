// ProjectWatch: Zod Form and API Validation Schemas
// Smart India Hackathon 2026

import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const registerSchema = z.object({
  full_name: z.string().min(2, 'Full name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  phone: z.string().regex(/^[0-9+ -]{10,15}$/, 'Please enter a valid contact phone number'),
  state: z.string().min(2, 'State is required'),
  district: z.string().min(2, 'District is required'),
  constituency: z.string().min(2, 'Constituency is required'),
});

export const reportIssueSchema = z.object({
  project_id: z.string().min(1, 'Please select a public project'),
  issue_category: z.enum([
    'Work Not Started',
    'Work Delayed',
    'Work Appears Incomplete',
    'Project Status Mismatch',
    'Quality Concern',
    'Other',
  ]),
  description: z
    .string()
    .min(20, 'Please provide detailed ground observation details (at least 20 characters)'),
  observation_date: z.string().min(1, 'Date of observation is required'),
  location_address: z.string().optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
});

export const reviewActionSchema = z.object({
  action_type: z.enum([
    'Verification Initiated',
    'Site Inspection Requested',
    'Additional Information Requested',
    'Implementation Follow-up',
    'Administrative Review',
    'Case Resolved',
    'Flag Dismissed',
    'Other',
  ]),
  responsible_department: z.string().min(2, 'Please specify responsible department or agency'),
  remarks: z.string().min(10, 'Action remarks must be at least 10 characters'),
  target_date: z.string().optional(),
});

export const caseAssignmentSchema = z.object({
  reviewer_id: z.string().min(1, 'Please select a reviewer officer'),
  instructions: z.string().optional(),
});

export const projectFormSchema = z.object({
  project_code: z.string().min(3, 'Project code is required'),
  title: z.string().min(5, 'Project title must be at least 5 characters'),
  description: z.string().min(15, 'Project description must be at least 15 characters'),
  category_id: z.string().min(1, 'Category is required'),
  state: z.string().min(2, 'State is required'),
  district: z.string().min(2, 'District is required'),
  constituency: z.string().min(2, 'Constituency is required'),
  implementing_agency_id: z.string().min(1, 'Implementing agency is required'),
  contractor_id: z.string().optional(),
  status: z.enum(['PROPOSED', 'SANCTIONED', 'IN_PROGRESS', 'DELAYED', 'COMPLETED', 'UNDER_REVIEW']),
  sanction_date: z.string().min(1, 'Sanction date is required'),
  expected_completion_date: z.string().min(1, 'Expected completion date is required'),
  sanctioned_amount: z.number().min(0, 'Sanctioned amount must be non-negative'),
  expenditure_amount: z.number().min(0, 'Expenditure amount must be non-negative'),
  latitude: z.number(),
  longitude: z.number(),
  address: z.string().min(3, 'Project location address is required'),
  pincode: z.string().min(4, 'Valid pincode required'),
});

export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
export type ReportIssueFormData = z.infer<typeof reportIssueSchema>;
export type ReviewActionFormData = z.infer<typeof reviewActionSchema>;
export type CaseAssignmentFormData = z.infer<typeof caseAssignmentSchema>;
export type ProjectFormData = z.infer<typeof projectFormSchema>;
