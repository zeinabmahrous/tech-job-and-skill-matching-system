import React from 'react';
import { DiagnosticResult, CandidateProfile, JobRole } from '../types';
import { CheckCircle2, Star, Sparkles, RotateCcw, Award, ArrowRight } from 'lucide-react';

interface MatchSuccessModalProps {
  diagnostics: DiagnosticResult;
  profile: CandidateProfile;
  currentRole: JobRole;
  onReset: () => void;
}

export const MatchSuccessModal: React.FC<MatchSuccessModalProps> = ({
  diagnostics,
  profile,
  currentRole,
  onReset,
}) => {
  return (
    <div className="space-y-6">
      {/* 1. Main Celebration Card */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-emerald-950/40 via-slate-900/80 to-slate-950/90 border border-emerald-500/30 p-6 md:p-10 shadow-2xl backdrop-blur-xl text-center">
        {/* Subtle, localized glow that doesn't spill over text */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 w-32 h-32 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none" />

        {/* Check Icon */}
        <div className="relative mx-auto w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 p-1 shadow-md shadow-emerald-950/40 mb-5 flex items-center justify-center">
          <div className="w-full h-full rounded-xl bg-slate-950/80 flex items-center justify-center">
            <CheckCircle2 className="w-8 h-8 text-emerald-400" />
          </div>
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-300 border border-emerald-500/25 mb-3">
          <Sparkles className="w-3.5 h-3.5" />
          Verified Technical Match
        </div>

        <h2 className="text-2xl md:text-3xl font-black text-white mb-2">
          Match Confirmed! High Career Alignment
        </h2>

        <p className="text-sm md:text-base text-slate-200 max-w-2xl mx-auto mb-7 leading-relaxed">
          The candidate demonstrates high proficiency across all required core technical competencies for <span className="text-emerald-300 font-semibold">{profile.jobTitle}</span> in {profile.location}, Egypt.
        </p>

        {/* Top Strengths Chips */}
        <div className="max-w-xl mx-auto mb-8">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
            Key Pillars of Strength & Surplus
          </div>
          <div className="flex flex-wrap items-center justify-center gap-2.5">
            {diagnostics.topStrengths.map((s, idx) => (
              <span
                key={`strength-${idx}`}
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-emerald-500/10 border border-emerald-500/30 text-emerald-200 shadow-sm"
              >
                <Star className="w-3.5 h-3.5 text-emerald-400 fill-emerald-400" />
                <span>{s.name}</span>
                <span className="font-mono text-emerald-300 font-bold">
                  ({s.surplus >= 0 ? `+${s.surplus}` : s.surplus})
                </span>
              </span>
            ))}
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-w-2xl mx-auto pt-4 border-t border-slate-800/80">
          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
            <span className="text-[11px] text-slate-400 block">Overall Alignment</span>
            <span className="text-xl font-bold text-emerald-300 font-mono">
              {diagnostics.overallScore}%
            </span>
          </div>
          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
            <span className="text-[11px] text-slate-400 block">Total Skill Points</span>
            <span className="text-xl font-bold text-cyan-300 font-mono">
              {diagnostics.candidateTotal} / {diagnostics.requiredTotal}
            </span>
          </div>
          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 col-span-2 sm:col-span-1">
            <span className="text-[11px] text-slate-400 block">Internship Experience</span>
            <span className="text-xl font-bold text-indigo-300 font-mono">
              {profile.internshipExperience} mo
            </span>
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex justify-center pt-2">
        <button
          onClick={onReset}
          className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-2xl text-sm font-bold text-slate-200 bg-slate-800/90 hover:bg-slate-700 border border-slate-700 shadow-xl transition-all hover:scale-[1.02] cursor-pointer"
        >
          <RotateCcw className="w-4 h-4 text-emerald-400" />
          <span>Test Another Candidate Profile</span>
        </button>
      </div>
    </div>
  );
};
