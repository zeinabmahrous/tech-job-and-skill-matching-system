import React from 'react';
import { CandidateProfile, JobRole } from '../types';
import { SAMPLE_PRESETS, TECH_JOB_ROLES } from '../data/jobRoles';
import { Sparkles, Pin, Scale, Zap } from 'lucide-react';

interface SidebarSummaryProps {
  profile: CandidateProfile;
  currentRole: JobRole;
  onLoadPreset: (presetId: string) => void;
}

export const SidebarSummary: React.FC<SidebarSummaryProps> = ({
  profile,
  currentRole,
  onLoadPreset,
}) => {
  const candTotal = Object.values(profile.skills).reduce<number>((a, b) => a + (Number(b) || 0), 0);
  const reqTotal = currentRole.defaultReqs.reduce((a, b) => a + b, 0);
  const gap = candTotal - reqTotal;
  const pct = reqTotal > 0 ? Math.min(100, Math.round((candTotal / reqTotal) * 100)) : 0;

  return (
    <aside className="space-y-5">
      {/* 1. Quick Presets Loader */}
      <div className="rounded-2xl bg-slate-900/70 border border-slate-800 p-4 shadow-xl backdrop-blur-md">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="w-4 h-4 text-cyan-400" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
            Quick Test Profiles
          </h3>
        </div>
        <div className="space-y-2">
          {SAMPLE_PRESETS.map((preset) => (
            <button
              key={preset.id}
              onClick={() => onLoadPreset(preset.id)}
              className="w-full text-left p-2.5 rounded-xl bg-slate-950/60 hover:bg-slate-800/80 border border-slate-800/80 hover:border-slate-700 transition-all text-xs group cursor-pointer"
            >
              <div className="flex items-center justify-between gap-1 mb-1">
                <span className="font-semibold text-slate-200 group-hover:text-cyan-300 transition-colors">
                  {preset.name}
                </span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${preset.badgeColor}`}>
                  {preset.badge}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 line-clamp-2">
                {preset.description}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* 2. Live Candidate Snapshot */}
      <div className="rounded-2xl bg-slate-900/70 border border-slate-800 p-4 shadow-xl backdrop-blur-md">
        <div className="flex items-center gap-2 mb-3">
          <Pin className="w-4 h-4 text-cyan-400" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
            Live Candidate Snapshot
          </h3>
        </div>

        <div className="space-y-2 text-xs divide-y divide-slate-800/60">
          <div className="flex justify-between py-1.5">
            <span className="text-slate-400">Target Role</span>
            <span className="font-medium text-slate-200 text-right">{profile.jobTitle}</span>
          </div>
          <div className="flex justify-between py-1.5">
            <span className="text-slate-400">Location</span>
            <span className="font-medium text-slate-200">{profile.location}</span>
          </div>
          <div className="flex justify-between py-1.5">
            <span className="text-slate-400">Age & Gender</span>
            <span className="font-medium text-slate-200">{profile.age} yrs · {profile.gender}</span>
          </div>
          <div className="flex justify-between py-1.5">
            <span className="text-slate-400">Internship Exp</span>
            <span className="font-medium text-cyan-400 font-mono">{profile.internshipExperience} months</span>
          </div>
          <div className="flex justify-between py-1.5">
            <span className="text-slate-400">Certifications</span>
            <span className="font-medium text-amber-400 font-mono">{profile.certificationsCount}</span>
          </div>
          <div className="flex justify-between py-1.5">
            <span className="text-slate-400">Academic Standing</span>
            <span className="font-medium text-slate-200 font-mono">{profile.academicPerformance}%</span>
          </div>
        </div>
      </div>

      {/* 3. Real-Time Skill Balance */}
      <div className="rounded-2xl bg-slate-900/70 border border-slate-800 p-4 shadow-xl backdrop-blur-md">
        <div className="flex items-center gap-2 mb-3">
          <Scale className="w-4 h-4 text-cyan-400" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
            Skill Balance Check
          </h3>
        </div>

        <div className="space-y-2.5 text-xs mb-3">
          <div className="flex justify-between">
            <span className="text-slate-400">Candidate Total</span>
            <span className="font-bold text-cyan-300 font-mono">{candTotal} pts</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Required Benchmark</span>
            <span className="font-bold text-violet-300 font-mono">{reqTotal} pts</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Net Delta</span>
            <span
              className={`font-mono font-bold ${
                gap >= 0 ? 'text-emerald-400' : 'text-rose-400'
              }`}
            >
              {gap >= 0 ? `+${gap}` : `${gap}`} pts
            </span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-1">
          <div className="flex justify-between text-[11px] text-slate-400">
            <span>Overall Alignment</span>
            <span className="font-bold text-slate-200">{pct}%</span>
          </div>
          <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-300"
              style={{
                width: `${Math.min(100, pct)}%`,
                background: 'linear-gradient(90deg, #ef4444 0%, #f97316 50%, #3b82f6 100%)',
              }}
            />
          </div>
        </div>
      </div>
    </aside>
  );
};
