// ProjectWatch: Explainable AI Risk Engine
// Smart India Hackathon 2026
// Principles: Deterministic, statistical, fully explainable risk signals for human governance.
// Rule: Never claims fraud or corruption; produces prioritized indicators for human review.

import { Project, RiskCalculationResult, RiskFactor, RiskPriority } from '@/types';

export interface RiskEngineConfig {
  timelineWeight: number;
  expenditureWeight: number;
  citizenReportWeight: number;
  comparableWeight: number;
  contractorPatternWeight: number;
  lowThreshold: number;
  mediumThreshold: number;
  highThreshold: number;
}

export const DEFAULT_RISK_CONFIG: RiskEngineConfig = {
  timelineWeight: 0.35,
  expenditureWeight: 0.25,
  citizenReportWeight: 0.25,
  comparableWeight: 0.15,
  contractorPatternWeight: 0.00,
  lowThreshold: 30,
  mediumThreshold: 60,
  highThreshold: 80,
};

/**
 * Calculates explainable risk score and contributing factors for a public project.
 * @param project The project with joined financials, timelines, contractor, and citizen reports
 * @param allProjects Optional list of peer projects to compute comparable baseline
 * @param config Optional configurable weights and thresholds
 */
export function calculateProjectRisk(
  project: Project,
  allProjects: Project[] = [],
  config: RiskEngineConfig = DEFAULT_RISK_CONFIG
): RiskCalculationResult {
  const factors: RiskFactor[] = [];

  // 1. TIMELINE FACTOR
  let timelineScore = 15;
  let timelineExplanation = 'Project is progressing within normal timeline schedules.';

  const now = new Date();
  const expectedDate = new Date(project.expected_completion_date);
  const isPastDue = now > expectedDate && project.status !== 'COMPLETED';

  if (project.status === 'COMPLETED') {
    timelineScore = 5;
    timelineExplanation = 'Project successfully completed; minimal timeline risk.';
  } else if (project.status === 'DELAYED' || isPastDue) {
    const diffMonths = Math.max(
      1,
      Math.round((now.getTime() - expectedDate.getTime()) / (1000 * 60 * 60 * 24 * 30))
    );
    if (diffMonths >= 5) {
      timelineScore = 85;
      timelineExplanation = `Project is ${diffMonths} months behind expected completion date with stalled physical progress.`;
    } else if (diffMonths >= 2) {
      timelineScore = 65;
      timelineExplanation = `Project has exceeded target completion milestone by ${diffMonths} months.`;
    } else {
      timelineScore = 45;
      timelineExplanation = 'Project is slightly behind schedule or approaching milestone with pending works.';
    }
  } else if (project.status === 'UNDER_REVIEW') {
    timelineScore = 75;
    timelineExplanation = 'Execution timeline is currently frozen under administrative review.';
  }

  factors.push({
    id: `rf-timeline-${project.id}`,
    factor_name: 'Timeline Delay',
    factor_score: timelineScore,
    factor_weight: config.timelineWeight,
    explanation: timelineExplanation,
    indicator_type: 'TIMELINE',
  });

  // 2. EXPENDITURE DEVIATION FACTOR
  let expenditureScore = 20;
  let expenditureExplanation = 'Fund utilisation aligns with expected progress milestones.';

  const sanctioned = project.financials?.sanctioned_amount || 0;
  const expenditure = project.financials?.expenditure_amount || 0;
  const utilisation = sanctioned > 0 ? (expenditure / sanctioned) * 100 : 0;

  if (project.status === 'PROPOSED') {
    expenditureScore = 0;
    expenditureExplanation = 'Pre-disbursement stage; zero expenditure.';
  } else if (project.status === 'UNDER_REVIEW' || project.status === 'DELAYED') {
    if (utilisation > 75) {
      expenditureScore = 75;
      expenditureExplanation = `High fund disbursement (${utilisation.toFixed(1)}%) relative to unresolved project delays.`;
    } else if (utilisation > 50) {
      expenditureScore = 55;
      expenditureExplanation = `Disbursement at ${utilisation.toFixed(1)}% requires progress alignment audit.`;
    } else {
      expenditureScore = 35;
      expenditureExplanation = `Moderate disbursement (${utilisation.toFixed(1)}%) with ongoing physical review.`;
    }
  } else if (utilisation > 95 && project.status !== 'COMPLETED') {
    expenditureScore = 65;
    expenditureExplanation = 'Budget exhausted (>95%) while site works remain active.';
  }

  factors.push({
    id: `rf-expenditure-${project.id}`,
    factor_name: 'Expenditure Deviation',
    factor_score: expenditureScore,
    factor_weight: config.expenditureWeight,
    explanation: expenditureExplanation,
    indicator_type: 'EXPENDITURE',
  });

  // 3. CITIZEN FEEDBACK & GROUND REPORTS CONCENTRATION
  let citizenScore = 10;
  let citizenExplanation = 'No adverse ground verification reports filed by citizens.';

  const reportCount = project.citizen_reports?.length || 0;
  if (reportCount >= 2) {
    citizenScore = 80;
    citizenExplanation = `${reportCount} project-linked ground verification reports received highlighting on-site issues.`;
  } else if (reportCount === 1) {
    citizenScore = 50;
    citizenExplanation = '1 citizen report received regarding project progress or quality.';
  }

  factors.push({
    id: `rf-citizen-${project.id}`,
    factor_name: 'Citizen Feedback',
    factor_score: citizenScore,
    factor_weight: config.citizenReportWeight,
    explanation: citizenExplanation,
    indicator_type: 'CITIZEN_REPORTS',
  });

  // 4. COMPARABLE PROJECT PEER DEVIATION
  let comparisonScore = 20;
  let comparisonExplanation = 'Expenditure and duration match peer project medians.';

  const peers = allProjects.filter(
    (p) => p.category_id === project.category_id && p.id !== project.id
  );

  if (peers.length > 0) {
    const avgUtilisation =
      peers.reduce((acc, p) => acc + (p.financials?.utilisation_percentage || 0), 0) /
      peers.length;

    const diff = utilisation - avgUtilisation;
    if (diff > 25 && project.status !== 'COMPLETED') {
      comparisonScore = 70;
      comparisonExplanation = `Expenditure rate is ${(diff).toFixed(0)}% higher than ${peers.length} comparable peer projects in the sector.`;
    } else if (diff < -30 && project.status === 'DELAYED') {
      comparisonScore = 60;
      comparisonExplanation = 'Drawdown significantly lag peer benchmarks, indicating execution bottlenecks.';
    }
  } else if (project.status === 'UNDER_REVIEW') {
    comparisonScore = 65;
    comparisonExplanation = 'Sector peer deviation observed in duration to completion ratio.';
  }

  factors.push({
    id: `rf-comparison-${project.id}`,
    factor_name: 'Comparable Project Deviation',
    factor_score: comparisonScore,
    factor_weight: config.comparableWeight,
    explanation: comparisonExplanation,
    indicator_type: 'COMPARABLE_DEVIATION',
  });

  // Calculate Weighted Overall Score (0 - 100)
  const totalWeight =
    config.timelineWeight +
    config.expenditureWeight +
    config.citizenReportWeight +
    config.comparableWeight;

  const rawScore =
    (timelineScore * config.timelineWeight +
      expenditureScore * config.expenditureWeight +
      citizenScore * config.citizenReportWeight +
      comparisonScore * config.comparableWeight) /
    (totalWeight || 1);

  const overallScore = Math.min(100, Math.max(0, Math.round(rawScore)));

  // Determine Priority Level
  let priorityLevel: RiskPriority = 'LOW';
  if (overallScore >= config.highThreshold) {
    priorityLevel = 'CRITICAL';
  } else if (overallScore >= config.mediumThreshold) {
    priorityLevel = 'HIGH';
  } else if (overallScore >= config.lowThreshold) {
    priorityLevel = 'MEDIUM';
  }

  // System Recommendation
  let recommendation = 'Standard periodic monitoring.';
  if (priorityLevel === 'CRITICAL' || priorityLevel === 'HIGH') {
    recommendation = 'Prioritise for human review.';
  } else if (priorityLevel === 'MEDIUM') {
    recommendation = 'Routine review recommended at next milestone.';
  }

  return {
    overall_score: overallScore,
    priority_level: priorityLevel,
    recommendation,
    factors,
  };
}
