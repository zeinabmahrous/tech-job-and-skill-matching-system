import React from 'react';
import { Briefcase, Sparkles } from 'lucide-react';

interface HeaderProps {
  onBackToIntro?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onBackToIntro,
}) => {
  return (
    <header className="relative z-10 w-full mb-6">
      {/* Top Banner Card */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-950/40 via-slate-900/60 to-slate-950/90 border border-slate-700/40 p-5 md:p-7 shadow-2xl backdrop-blur-xl">
        {/* Glow effect */}
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -mb-8 -ml-8 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            {/* Tag Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold tracking-wide bg-cyan-500/10 border border-cyan-500/25 text-cyan-300 mb-3">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>AI-POWERED CAREER MATCHING · EGYPT TECH HUB</span>
            </div>

            {/* Title & Icon */}
            <div className="flex items-center gap-3.5 mb-1.5">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500/20 to-blue-600/30 border border-cyan-500/30 flex items-center justify-center text-cyan-300 shadow-md">
                <Briefcase className="w-5 h-5" />
              </div>
              <h1 className="text-xl md:text-2xl lg:text-3xl font-extrabold tracking-tight text-white">
                Tech Job & Skill Matching Prediction System
              </h1>
            </div>

            <p className="text-slate-400 text-xs md:text-sm max-w-2xl mt-1">
              Evaluate candidate technical competencies against Egyptian IT industry benchmarks with high-harmony, expressive diagnostic data visualizers.
            </p>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2.5 self-start md:self-center">
            {onBackToIntro && (
              <button
                onClick={onBackToIntro}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-slate-900/90 hover:bg-slate-800 text-slate-300 border border-slate-700 hover:border-slate-500 transition-all shadow-sm cursor-pointer"
                title="Return to Welcome Screen"
              >
                <span>← Home</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

