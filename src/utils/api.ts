import { CandidateProfile, JobRole } from '../types';

// URL of the Flask backend that serves best_job_match_model.pkl (see /server).
// Override with VITE_API_URL in a .env file if you deploy the backend elsewhere.
const API_URL = import.meta.env.VITE_API_URL || 'https://shahdnossier.pythonanywhere.com/';

export interface ModelPrediction {
  isMatch: boolean;
  matchProbability: number;
  modelUsed: string;
}

/**
 * Calls the real trained model (GradientBoostingClassifier) through the
 * Flask API instead of relying on the local JS heuristic. This is the
 * "link" between the frontend and the actual ML training pipeline.
 */
export async function predictMatch(
  profile: CandidateProfile,
  currentRole: JobRole
): Promise<ModelPrediction> {
  const response = await fetch(`${API_URL}/api/match-analysis`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      age: profile.age,
      gender: profile.gender,
      academicPerformance: profile.academicPerformance,
      certificationsCount: profile.certificationsCount,
      internshipExperience: profile.internshipExperience,
      location: profile.location,
      jobTitle: profile.jobTitle,
      vocationalProgram: profile.vocationalProgram,
      skills: profile.skills,
      reqSkills: profile.reqSkills,
      minExpMonths: currentRole.minExpMonths,
    }),
  });

  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(body.error || `Model API error (${response.status})`);
  }

  return response.json();
}
