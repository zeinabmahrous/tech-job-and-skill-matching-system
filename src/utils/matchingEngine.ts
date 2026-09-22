import { CandidateProfile, DiagnosticResult } from '../types';
import { TECH_JOB_ROLES } from '../data/jobRoles';

/**
 * modelOverride: when provided (i.e. the Flask /api/match-analysis call succeeded),
 * the isMatch decision comes from the REAL trained model instead of the
 * local JS heuristic below. The heuristic is kept only as:
 *   1) a fallback if the model API is unreachable, and
 *   2) the source of the skill-by-skill breakdown (gaps, strengths,
 *      recommendations) used to render the report UI - the model only
 *      returns a match/no-match + probability, not a per-skill breakdown.
 */
export function calculateDiagnostics(
  profile: CandidateProfile,
  modelOverride?: { isMatch: boolean; matchProbability: number }
): DiagnosticResult {
  const currentRole = TECH_JOB_ROLES.find(r => r.title === profile.jobTitle) || TECH_JOB_ROLES[0];
  
  let candidateTotal = 0;
  let requiredTotal = 0;
  
  const skillGaps = currentRole.skills.map((skillName, idx) => {
    const candVal = profile.skills[`Skill_${idx + 1}`] ?? 5;
    const reqVal = profile.reqSkills[`Required_Skill_${idx + 1}`] ?? currentRole.defaultReqs[idx] ?? 7;
    const gap = candVal - reqVal;
    const pct = reqVal > 0 ? Math.min(100, Math.max(0, Math.round((candVal / reqVal) * 100))) : 100;
    
    candidateTotal += candVal;
    requiredTotal += reqVal;
    
    return {
      name: skillName,
      skillKey: `Skill_${idx + 1}`,
      candVal,
      reqVal,
      gap,
      pct,
    };
  });

  const gapTotal = candidateTotal - requiredTotal;
  const overallScore = requiredTotal > 0 ? Math.min(100, Math.max(0, Math.round((candidateTotal / requiredTotal) * 100))) : 0;
  const expGap = profile.internshipExperience - currentRole.minExpMonths;

  // ML / Heuristic Matching Rule matching the model behavior:
  // Match requires:
  // 1. Overall skill percentage >= 82%
  // 2. No single skill deficit worse than -3
  // 3. Experience gap >= -3 months (or compensated by high academic/certifications)
  const worstDeficit = Math.min(...skillGaps.map(s => s.gap));
  const hasSevereDeficit = worstDeficit <= -3;
  const experienceDeficit = expGap < -4;

  const heuristicMatch = overallScore >= 85 && !hasSevereDeficit && !experienceDeficit;

  // Use the real model's decision whenever we have one; only fall back to
  // the heuristic above if the API call failed (see App.tsx).
  const isMatch = modelOverride ? modelOverride.isMatch : heuristicMatch;
  const matchProbability = modelOverride?.matchProbability;

  // Strengths
  const topStrengths = skillGaps
    .filter(s => s.gap >= 0)
    .sort((a, b) => b.gap - a.gap)
    .slice(0, 3)
    .map(s => ({
      name: s.name,
      surplus: s.gap,
    }));

  // Critical gaps
  const criticalGaps = skillGaps
    .filter(s => s.gap < 0)
    .sort((a, b) => a.gap - b.gap)
    .map(s => {
      const deficit = Math.abs(s.gap);
      let priority: 'High' | 'Medium' | 'Low' = 'Low';
      let estWeeks = 4;
      
      if (deficit >= 3) {
        priority = 'High';
        estWeeks = deficit * 3;
      } else if (deficit >= 2) {
        priority = 'Medium';
        estWeeks = deficit * 2;
      } else {
        priority = 'Low';
        estWeeks = 2;
      }

      let recommendation = `Reinforce core fundamentals in ${s.name}.`;
      if (s.name.includes('Data Structures') || s.name.includes('Algorithms')) {
        recommendation = 'Solve LeetCode/Codeforces medium problems & study Big-O analysis on arrays, trees, and graphs.';
      } else if (s.name.includes('System Design') || s.name.includes('Architecture')) {
        recommendation = 'Study microservices, caching layers (Redis), database indexing, and load balancing patterns.';
      } else if (s.name.includes('Machine Learning') || s.name.includes('Deep Learning')) {
        recommendation = 'Build hands-on Kaggle projects with Scikit-learn, PyTorch/TensorFlow, and model tuning.';
      } else if (s.name.includes('Frontend') || s.name.includes('React')) {
        recommendation = 'Master modern React patterns, state managers (Zustand/Redux), Next.js App Router, and clean UI components.';
      } else if (s.name.includes('Security') || s.name.includes('Vulnerability')) {
        recommendation = 'Practice on TryHackMe/HackTheBox, configure Suricata/Snort, and review OWASP Top 10 vulnerabilities.';
      } else if (s.name.includes('Networking')) {
        recommendation = 'Review CCNA subnetting, TCP/IP handshake, DNS, VLAN configurations, and firewall packet inspection.';
      }

      return {
        name: s.name,
        deficit,
        priority,
        recommendation,
        estWeeks,
      };
    });

  if (expGap < 0) {
    criticalGaps.push({
      name: `Internship Experience (${Math.abs(expGap)} mo deficiency)`,
      deficit: Math.abs(expGap),
      priority: Math.abs(expGap) > 6 ? 'High' : 'Medium',
      recommendation: `Gain ${Math.abs(expGap)} additional month(s) of internship experience via ITI Summer Internships, NTI, or freelancing.`,
      estWeeks: Math.abs(expGap) * 4,
    });
  }

  return {
    isMatch,
    matchProbability,
    overallScore,
    candidateTotal,
    requiredTotal,
    gapTotal,
    expGap,
    skillGaps,
    topStrengths: topStrengths.length > 0 ? topStrengths : skillGaps.slice(0, 2).map(s => ({ name: s.name, surplus: s.gap })),
    criticalGaps,
  };
}
