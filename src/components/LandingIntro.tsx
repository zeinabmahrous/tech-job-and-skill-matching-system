import React from 'react';
import { ArrowRight, ShieldCheck, Cpu, BarChart3, Zap } from 'lucide-react';

interface LandingIntroProps {
  onStart: () => void;
}

export const LandingIntro: React.FC<LandingIntroProps> = ({ onStart }) => {
  return (
    <div className="relative z-10 w-full min-h-[80vh] flex flex-col items-center justify-center text-center px-4 py-4 md:py-6 max-w-5xl mx-auto">
      
      {/* Top Badge */}
      <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900/90 border border-cyan-500/40 text-cyan-300 text-xs font-semibold tracking-wide shadow-lg shadow-cyan-950/60 mb-5 backdrop-blur-md">
        <span className="flex h-2 w-2 relative">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
        </span>
        <span>AI Talent Match & Skill Gap Diagnostics</span>
      </div>

      {/* Main Title - Clear, concise, guaranteed visibility */}
      <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-white mb-4 leading-tight max-w-3xl">
        <span className="block text-white">Match Candidates to</span>
        <span className="block text-cyan-400 drop-shadow-sm">
          Target Job Roles
        </span>
      </h1>

      {/* Description */}
      <p className="text-slate-300 text-sm sm:text-base md:text-lg max-w-2xl mx-auto mb-8 leading-relaxed font-normal">
        Evaluate candidate competency levels against job requirements, calculate fit scores, and diagnose qualification gaps with actionable growth roadmaps.
      </p>

      {/* Interactive CTA Button */}
      <div className="flex items-center justify-center w-full max-w-[240px] mx-auto mb-10">
        <div className="relative group w-full">
          {/* Animated Vibrant Aura Glow */}
          <div className="absolute -inset-1 bg-gradient-to-r from-cyan-400 via-sky-400 to-blue-500 rounded-2xl blur-md opacity-70 group-hover:opacity-100 transition-all duration-300 group-hover:blur-lg"></div>
          
          <button
            id="btn-start-platform"
            onClick={onStart}
            className="relative w-full inline-flex items-center justify-center gap-2.5 px-5 py-3 rounded-xl font-bold text-base text-slate-950 bg-gradient-to-r from-cyan-300 via-sky-200 to-cyan-300 hover:from-white hover:to-cyan-200 transition-all duration-300 shadow-xl shadow-cyan-500/20 active:scale-[0.98] cursor-pointer whitespace-nowrap"
          >
            <div className="flex items-center justify-center w-6 h-6 rounded-lg bg-slate-950/10 text-slate-950 shrink-0 shadow-inner">
              <Zap className="w-3.5 h-3.5 fill-slate-950" />
            </div>
            
            <span className="tracking-wide text-slate-950 font-extrabold">Get Started</span>
            
            <div className="w-6 h-6 rounded-full bg-slate-950/10 flex items-center justify-center group-hover:translate-x-1 transition-transform duration-300 shrink-0">
              <ArrowRight className="w-3.5 h-3.5 text-slate-950 stroke-[2.5]" />
            </div>
          </button>
        </div>
      </div>

      {/* 3 Core Highlights with Floating Hover Effect */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full text-left">
        
        {/* Card 1 */}
        <div className="group relative p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md transition-all duration-500 ease-out hover:-translate-y-2 hover:bg-slate-900/90 hover:border-cyan-400/50 hover:shadow-2xl hover:shadow-cyan-500/15 overflow-hidden cursor-pointer">
          <div className="absolute -top-10 -right-10 w-24 h-24 bg-cyan-500/0 group-hover:bg-cyan-500/15 rounded-full blur-xl transition-all duration-500 pointer-events-none" />
          
          <div className="w-10 h-10 rounded-xl bg-cyan-950/80 border border-cyan-500/30 flex items-center justify-center mb-3 text-cyan-400 group-hover:scale-110 group-hover:bg-cyan-900/60 group-hover:border-cyan-400/60 transition-all duration-300 shadow-sm">
            <Cpu className="w-5 h-5 transition-transform duration-300 group-hover:rotate-6" />
          </div>
          <h3 className="text-white font-bold text-sm mb-1.5 group-hover:text-cyan-300 transition-colors duration-300 flex items-center gap-1.5">
            <span>Dynamic Gap Analysis</span>
          </h3>
          <p className="text-slate-400 text-xs leading-relaxed group-hover:text-slate-300 transition-colors duration-300">
            Multi-dimensional delta mapping calculating exact deficits across 5 role competencies.
          </p>
        </div>

        {/* Card 2 */}
        <div className="group relative p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md transition-all duration-500 ease-out hover:-translate-y-2 hover:bg-slate-900/90 hover:border-indigo-400/50 hover:shadow-2xl hover:shadow-indigo-500/15 overflow-hidden cursor-pointer">
          <div className="absolute -top-10 -right-10 w-24 h-24 bg-indigo-500/0 group-hover:bg-indigo-500/15 rounded-full blur-xl transition-all duration-500 pointer-events-none" />
          
          <div className="w-10 h-10 rounded-xl bg-indigo-950/80 border border-indigo-500/30 flex items-center justify-center mb-3 text-indigo-400 group-hover:scale-110 group-hover:bg-indigo-900/60 group-hover:border-indigo-400/60 transition-all duration-300 shadow-sm">
            <BarChart3 className="w-5 h-5 transition-transform duration-300 group-hover:rotate-6" />
          </div>
          <h3 className="text-white font-bold text-sm mb-1.5 group-hover:text-indigo-300 transition-colors duration-300 flex items-center gap-1.5">
            <span>SVG Diagnostic Visuals</span>
          </h3>
          <p className="text-slate-400 text-xs leading-relaxed group-hover:text-slate-300 transition-colors duration-300">
            Dual-chart diagnostic dashboards with breakdown categories (Met, Minor, Moderate, Major).
          </p>
        </div>

        {/* Card 3 */}
        <div className="group relative p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md transition-all duration-500 ease-out hover:-translate-y-2 hover:bg-slate-900/90 hover:border-sky-400/50 hover:shadow-2xl hover:shadow-sky-500/15 overflow-hidden cursor-pointer">
          <div className="absolute -top-10 -right-10 w-24 h-24 bg-sky-500/0 group-hover:bg-sky-500/15 rounded-full blur-xl transition-all duration-500 pointer-events-none" />
          
          <div className="w-10 h-10 rounded-xl bg-sky-950/80 border border-sky-500/30 flex items-center justify-center mb-3 text-sky-400 group-hover:scale-110 group-hover:bg-sky-900/60 group-hover:border-sky-400/60 transition-all duration-300 shadow-sm">
            <ShieldCheck className="w-5 h-5 transition-transform duration-300 group-hover:rotate-6" />
          </div>
          <h3 className="text-white font-bold text-sm mb-1.5 group-hover:text-sky-300 transition-colors duration-300 flex items-center gap-1.5">
            <span>Tailored Action Plans</span>
          </h3>
          <p className="text-slate-400 text-xs leading-relaxed group-hover:text-slate-300 transition-colors duration-300">
            Personalized training courses, timeline milestones, and tailored certifications roadmap.
          </p>
        </div>

      </div>
    </div>
  );
};

