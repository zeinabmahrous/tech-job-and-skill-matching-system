import React from 'react';
import { CandidateProfile, JobRole } from '../types';
import { TECH_JOB_ROLES, EGYPTIAN_LOCATIONS } from '../data/jobRoles';
import { User, Target, Sliders, MapPin, Award, BookOpen, Clock, Briefcase, GraduationCap } from 'lucide-react';
import { CustomSelect } from './CustomSelect';
import { CustomNumberInput } from './CustomNumberInput';

interface CandidateFormProps {
  profile: CandidateProfile;
  onChangeProfile: (updater: (prev: CandidateProfile) => CandidateProfile) => void;
  onPredict: () => void;
  isPredicting?: boolean;
  modelError?: string | null;
  currentRole: JobRole;
  onSelectRole: (role: JobRole) => void;
}

export const CandidateForm: React.FC<CandidateFormProps> = ({
  profile,
  onChangeProfile,
  onPredict,
  isPredicting,
  modelError,
  currentRole,
  onSelectRole,
}) => {
  return (
    <div className="space-y-6">
      {/* 1. Candidate Demographic Info */}
      <div className="relative z-30 rounded-2xl bg-slate-900/60 border border-slate-800/80 p-5 md:p-6 shadow-xl backdrop-blur-md">
        <div className="flex items-center gap-2.5 mb-2">
          <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
            <User className="w-4 h-4" />
          </div>
          <h2 className="text-lg font-bold text-slate-100">Candidate & Academic Details</h2>
        </div>
        <p className="text-xs text-slate-400 mb-5">
          Basic demographic, academic standing, and practical training metrics.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Age */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center justify-between">
              <span>Age</span>
              <span className="text-cyan-400 font-mono">{profile.age} yrs</span>
            </label>
            <CustomNumberInput
              min={19}
              max={50}
              step={1}
              unit="yrs"
              value={profile.age}
              onChange={(val) => {
                onChangeProfile(prev => ({ ...prev, age: val }));
              }}
            />
          </div>

          {/* Gender */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Gender
            </label>
            <CustomSelect
              value={profile.gender}
              onChange={(val) => {
                onChangeProfile(prev => ({ ...prev, gender: val as 'Male' | 'Female' }));
              }}
              options={['Male', 'Female']}
            />
          </div>

          {/* Academic Performance */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
                <span>Academic Score</span>
              </span>
              <span className="text-cyan-400 font-mono font-bold">{profile.academicPerformance}%</span>
            </label>
            <CustomNumberInput
              min={0}
              max={100}
              step={1}
              unit="%"
              value={profile.academicPerformance}
              onChange={(val) => {
                onChangeProfile(prev => ({ ...prev, academicPerformance: val }));
              }}
            />
          </div>

          {/* Certifications Count */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5 text-amber-400" />
                <span>Certifications</span>
              </span>
              <span className="text-amber-400 font-mono font-bold">{profile.certificationsCount}</span>
            </label>
            <CustomNumberInput
              min={0}
              max={20}
              step={1}
              unit="certs"
              value={profile.certificationsCount}
              onChange={(val) => {
                onChangeProfile(prev => ({ ...prev, certificationsCount: val }));
              }}
            />
          </div>

          {/* Internship Experience */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-indigo-400" />
                <span>Internship Experience</span>
              </span>
              <span className="text-cyan-400 font-mono font-bold">{profile.internshipExperience} mo</span>
            </label>
            <CustomNumberInput
              min={0}
              max={60}
              step={1}
              unit="mo"
              value={profile.internshipExperience}
              onChange={(val) => {
                onChangeProfile(prev => ({ ...prev, internshipExperience: val }));
              }}
            />
          </div>

          {/* Location in Egypt */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-rose-400" />
              <span>Location in Egypt</span>
            </label>
            <CustomSelect
              value={profile.location}
              onChange={(val) => {
                onChangeProfile(prev => ({ ...prev, location: val }));
              }}
              options={EGYPTIAN_LOCATIONS}
            />
          </div>
        </div>
      </div>

      {/* 2. Target Role & Vocational Program Selection */}
      <div className="relative z-20 rounded-2xl bg-slate-900/60 border border-slate-800/80 p-5 md:p-6 shadow-xl backdrop-blur-md">
        <div className="flex items-center gap-2.5 mb-2">
          <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
            <Target className="w-4 h-4" />
          </div>
          <h2 className="text-lg font-bold text-slate-100">Target Role Selection</h2>
        </div>
        <p className="text-xs text-slate-400 mb-5">
          Select the specific tech title and affiliated training track to configure benchmark requirements.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Target Technical Job Title
            </label>
            <CustomSelect
              value={profile.jobTitle}
              onChange={(val) => {
                const selectedRole = TECH_JOB_ROLES.find(r => r.title === val);
                if (selectedRole) {
                  onSelectRole(selectedRole);
                }
              }}
              options={TECH_JOB_ROLES.map(r => ({
                value: r.title,
                label: r.title,
                sublabel: `${r.skills.length} core competencies required`,
              }))}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Vocational Program / Track
            </label>
            <CustomSelect
              value={profile.vocationalProgram}
              onChange={(val) => {
                onChangeProfile(prev => ({ ...prev, vocationalProgram: val }));
              }}
              options={currentRole.vocationalPrograms}
            />
          </div>
        </div>

        <div className="mt-3 flex items-center justify-between text-xs text-slate-400 bg-slate-950/40 rounded-xl p-3 border border-slate-800/60">
          <span className="italic">{currentRole.description}</span>
          <span className="font-mono text-cyan-400 font-semibold shrink-0 ml-3">
            Min Exp: {currentRole.minExpMonths} months
          </span>
        </div>
      </div>

      {/* 3. Candidate Technical Skills vs Benchmark Sliders */}
      <div className="relative z-10 rounded-2xl bg-slate-900/60 border border-slate-800/80 p-3.5 sm:p-5 md:p-6 shadow-xl backdrop-blur-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-2">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 shrink-0">
              <Sliders className="w-4 h-4" />
            </div>
            <h2 className="text-base sm:text-lg font-bold text-slate-100">Candidate Technical Skills vs Benchmark</h2>
          </div>
          <span className="text-[11px] sm:text-xs text-slate-400">Scale: 0 (Beginner) to 10 (Master)</span>
        </div>
        <p className="text-xs text-slate-400 mb-5">
          Adjust candidate proficiency levels. The benchmark line indicates the required standard for this job title.
        </p>

        <div className="space-y-4 sm:space-y-5">
          {currentRole.skills.map((skillName, idx) => {
            const skillKey = `Skill_${idx + 1}`;
            const reqKey = `Required_Skill_${idx + 1}`;
            const candVal = profile.skills[skillKey] ?? 5;
            const reqVal = profile.reqSkills[reqKey] ?? currentRole.defaultReqs[idx];
            const gap = candVal - reqVal;
            const isSurplus = gap >= 0;

            return (
              <div
                key={skillKey}
                className="p-3 sm:p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 hover:border-slate-700 transition-all"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2.5">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-cyan-400 shrink-0" />
                    <span className="font-semibold text-xs sm:text-sm text-slate-100">{skillName}</span>
                  </div>

                  <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 self-start sm:self-auto">
                    {/* Required Benchmark */}
                    <div className="flex items-center gap-1 text-[11px] sm:text-xs bg-slate-900/90 px-2 sm:px-2.5 py-1 rounded-lg border border-slate-700/70 shadow-sm">
                      <span className="text-slate-400">Required:</span>
                      <span className="font-mono font-bold text-violet-300">{reqVal}/10</span>
                    </div>

                    {/* Candidate Value */}
                    <div className="flex items-center gap-1 text-[11px] sm:text-xs bg-slate-900/90 px-2 sm:px-2.5 py-1 rounded-lg border border-slate-700/70 shadow-sm">
                      <span className="text-slate-400">Candidate:</span>
                      <span className="font-mono font-bold text-cyan-300">{candVal}/10</span>
                    </div>

                    {/* Gap delta badge */}
                    <span
                      className={`text-[11px] sm:text-xs font-mono font-bold px-2 py-0.5 rounded-md border shadow-sm ${
                        isSurplus
                          ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                          : 'bg-rose-500/15 text-rose-300 border-rose-500/30'
                      }`}
                    >
                      {gap >= 0 ? `+${gap}` : `${gap}`}
                    </span>
                  </div>
                </div>

                {/* Slider and Track */}
                <div className="space-y-2 pt-0.5">
                  <input
                    type="range"
                    min={0}
                    max={10}
                    step={1}
                    value={candVal}
                    onChange={(e) => {
                      const val = parseInt(e.target.value);
                      onChangeProfile(prev => ({
                        ...prev,
                        skills: {
                          ...prev.skills,
                          [skillKey]: val,
                        },
                      }));
                    }}
                    className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400 focus:outline-none"
                  />

                  {/* Dual Bar Indicator with Cross-Browser Red -> Orange -> Blue Gradient */}
                  <div className="relative h-2.5 sm:h-3 w-full bg-slate-900/90 rounded-full overflow-hidden p-0.5 border border-slate-700/80 shadow-inner">
                    {/* Candidate Fill with Red -> Orange -> Blue Gradient */}
                    <div
                      className="h-full rounded-full transition-all duration-300"
                      style={{
                        width: `${Math.max(4, (candVal / 10) * 100)}%`,
                        background: 'linear-gradient(90deg, #ef4444 0%, #f97316 48%, #3b82f6 100%)',
                        boxShadow: '0 0 8px rgba(249, 115, 22, 0.4)',
                      }}
                    />
                    {/* Required Benchmark Notch */}
                    <div
                      className="absolute top-0 bottom-0 w-1 sm:w-1.5 bg-white shadow-[0_0_8px_rgba(255,255,255,0.95)] z-10 rounded-full"
                      style={{ left: `calc(${(reqVal / 10) * 100}% - 2px)` }}
                      title={`Benchmark: ${reqVal}/10`}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. Large Predict Button */}
      <div className="flex flex-col items-center gap-3 pt-2">
        <button
          onClick={onPredict}
          disabled={isPredicting}
          className="group relative inline-flex items-center justify-center px-8 py-4 text-base font-bold text-white rounded-2xl overflow-hidden shadow-2xl transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100"
        >
          {/* Gradient background */}
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 group-hover:from-cyan-400 group-hover:via-blue-500 group-hover:to-indigo-500 transition-all duration-500" />
          <div className="absolute inset-0 opacity-0 group-hover:opacity-30 bg-white blur-sm transition-opacity" />

          <span className="relative flex items-center gap-3">
            <Target className={`w-5 h-5 ${isPredicting ? 'animate-spin' : 'animate-pulse'}`} />
            <span>{isPredicting ? 'Running Model Prediction...' : 'Run Matching & Diagnostic Analysis'}</span>
          </span>
        </button>
        {modelError && (
          <p className="text-xs text-amber-400 text-center max-w-md">{modelError}</p>
        )}
      </div>
    </div>
  );
};
