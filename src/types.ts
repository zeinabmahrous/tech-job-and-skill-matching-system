export interface JobRole {
  id: string;
  title: string;
  category: string;
  vocationalPrograms: string[];
  skills: string[];
  defaultReqs: number[];
  minExpMonths: number;
  description: string;
}

export interface CandidateProfile {
  age: number;
  gender: 'Male' | 'Female';
  academicPerformance: number; // 0-100
  certificationsCount: number;
  internshipExperience: number; // months
  location: string;
  jobTitle: string;
  vocationalProgram: string;
  skills: Record<string, number>; // Skill_1 to Skill_5
  reqSkills: Record<string, number>; // Required_Skill_1 to Required_Skill_5
}

export interface DiagnosticResult {
  isMatch: boolean;
  matchProbability?: number; // from the real model, when available
  overallScore: number;
  candidateTotal: number;
  requiredTotal: number;
  gapTotal: number;
  expGap: number;
  skillGaps: Array<{
    name: string;
    skillKey: string;
    candVal: number;
    reqVal: number;
    gap: number;
    pct: number;
  }>;
  topStrengths: Array<{
    name: string;
    surplus: number;
  }>;
  criticalGaps: Array<{
    name: string;
    deficit: number;
    priority: 'High' | 'Medium' | 'Low';
    recommendation: string;
    estWeeks: number;
  }>;
}

export interface ColorTheme {
  id: string;
  name: string;
  description: string;
  candidateGradStart: string;
  candidateGradMid: string;
  candidateGradEnd: string;
  requiredGradStart: string;
  requiredGradMid: string;
  requiredGradEnd: string;
  surplusBar: string;
  deficitBar: string;
  accentGlow: string;
  ringGradients: {
    good: [string, string];
    warning: [string, string];
    deficit: [string, string];
  };
}
