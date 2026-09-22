/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { CandidateProfile, JobRole, ColorTheme, DiagnosticResult } from './types';
import { TECH_JOB_ROLES, SAMPLE_PRESETS } from './data/jobRoles';
import { COLOR_THEMES } from './data/colorThemes';
import { calculateDiagnostics } from './utils/matchingEngine';
import { predictMatch } from './utils/api';
import { NetworkBackground } from './components/NetworkBackground';
import { Header } from './components/Header';
import { CandidateForm } from './components/CandidateForm';
import { SidebarSummary } from './components/SidebarSummary';
import { NoMatchReport } from './components/NoMatchReport';
import { MatchSuccessModal } from './components/MatchSuccessModal';
import { LandingIntro } from './components/LandingIntro';

export default function App() {
  const [currentRole, setCurrentRole] = useState<JobRole>(TECH_JOB_ROLES[0]);
  const [currentTheme, setCurrentTheme] = useState<ColorTheme>(COLOR_THEMES[0]);
  const [view, setView] = useState<'intro' | 'form' | 'results'>('intro');

  // Initial candidate profile
  const [profile, setProfile] = useState<CandidateProfile>(() => {
    const role = TECH_JOB_ROLES[0];
    const initialSkills: Record<string, number> = {
      Skill_1: 4,
      Skill_2: 5,
      Skill_3: 3,
      Skill_4: 5,
      Skill_5: 4,
    };
    const initialReqs: Record<string, number> = {};
    role.skills.forEach((_, idx) => {
      initialReqs[`Required_Skill_${idx + 1}`] = role.defaultReqs[idx];
    });

    return {
      age: 23,
      gender: 'Male',
      academicPerformance: 76.5,
      certificationsCount: 1,
      internshipExperience: 4,
      location: 'Cairo',
      jobTitle: role.title,
      vocationalProgram: role.vocationalPrograms[0],
      skills: initialSkills,
      reqSkills: initialReqs,
    };
  });

  const [diagnostics, setDiagnostics] = useState<DiagnosticResult | null>(null);
  const [isPredicting, setIsPredicting] = useState(false);
  const [modelError, setModelError] = useState<string | null>(null);

  // Handle changing job role
  const handleSelectRole = (newRole: JobRole) => {
    setCurrentRole(newRole);
    setProfile(prev => {
      const newReqs: Record<string, number> = {};
      const newSkills: Record<string, number> = { ...prev.skills };
      
      newRole.skills.forEach((_, idx) => {
        const reqKey = `Required_Skill_${idx + 1}`;
        newReqs[reqKey] = newRole.defaultReqs[idx];
        if (newSkills[`Skill_${idx + 1}`] === undefined) {
          newSkills[`Skill_${idx + 1}`] = 5;
        }
      });

      return {
        ...prev,
        jobTitle: newRole.title,
        vocationalProgram: newRole.vocationalPrograms[0],
        reqSkills: newReqs,
        skills: newSkills,
      };
    });
  };

  // Handle loading presets
  const handleLoadPreset = (presetId: string) => {
    const found = SAMPLE_PRESETS.find(p => p.id === presetId);
    if (!found) return;

    const matchedRole = TECH_JOB_ROLES.find(r => r.title === found.profile.jobTitle) || TECH_JOB_ROLES[0];
    setCurrentRole(matchedRole);

    const newSkills: Record<string, number> = {};
    const newReqs: Record<string, number> = {};

    matchedRole.skills.forEach((_, idx) => {
      newSkills[`Skill_${idx + 1}`] = found.profile.skills[idx] ?? 5;
      newReqs[`Required_Skill_${idx + 1}`] = matchedRole.defaultReqs[idx];
    });

    setProfile({
      age: found.profile.age,
      gender: found.profile.gender,
      academicPerformance: found.profile.academicPerformance,
      certificationsCount: found.profile.certificationsCount,
      internshipExperience: found.profile.internshipExperience,
      location: found.profile.location,
      jobTitle: matchedRole.title,
      vocationalProgram: matchedRole.vocationalPrograms[0],
      skills: newSkills,
      reqSkills: newReqs,
    });
  };

  // Execute matching prediction - calls the real trained model via the
  // Flask API (see /server/app.py). Falls back to the local heuristic only
  // if the model API is unreachable, so the app still works offline.
  const handlePredict = async () => {
    setIsPredicting(true);
    setModelError(null);

    let result: DiagnosticResult;
    try {
      const prediction = await predictMatch(profile, currentRole);
      result = calculateDiagnostics(profile, prediction);
    } catch (err) {
      console.error('Model API unreachable, falling back to local heuristic:', err);
      setModelError(
        'Could not reach the prediction model server (is it running on :5001?). Showing a local estimate instead.'
      );
      result = calculateDiagnostics(profile);
    }

    setDiagnostics(result);
    setIsPredicting(false);
    setView('results');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="relative min-h-screen bg-[#070a12] text-slate-100 overflow-x-hidden">
      {/* Background Neural Network Drifting SVG */}
      <NetworkBackground />

      {/* Main Content Container */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-10">
        {view === 'intro' ? (
          <LandingIntro
            onStart={() => {
              setView('form');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        ) : (
          <>
            <Header
              onBackToIntro={() => {
                setView('intro');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />

            {view === 'form' ? (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                {/* Main Form (8 Cols) */}
                <main className="lg:col-span-8">
                  <CandidateForm
                    profile={profile}
                    onChangeProfile={setProfile}
                    onPredict={handlePredict}
                    isPredicting={isPredicting}
                    modelError={modelError}
                    currentRole={currentRole}
                    onSelectRole={handleSelectRole}
                  />
                </main>

                {/* Sidebar (4 Cols) */}
                <aside className="lg:col-span-4">
                  <SidebarSummary
                    profile={profile}
                    currentRole={currentRole}
                    onLoadPreset={handleLoadPreset}
                  />
                </aside>
              </div>
            ) : (
              <div className="max-w-5xl mx-auto">
                {diagnostics && (
                  diagnostics.isMatch ? (
                    <MatchSuccessModal
                      diagnostics={diagnostics}
                      profile={profile}
                      currentRole={currentRole}
                      onReset={() => setView('form')}
                    />
                  ) : (
                    <NoMatchReport
                      diagnostics={diagnostics}
                      profile={profile}
                      currentRole={currentRole}
                      onReset={() => setView('form')}
                    />
                  )
                )}
              </div>
            )}
          </>
        )}

        {/* Footer */}
        <footer className="mt-14 pt-6 border-t border-slate-800/80 text-center text-xs text-slate-500">
          <p>Tech Job & Skill Matching Prediction System · Egypt ICT Talent Hub</p>
        </footer>
      </div>
    </div>
  );
}
