import React from 'react';
import { DiagnosticResult, CandidateProfile, JobRole } from '../types';
import {
  AlertTriangle,
  RotateCcw,
  BarChart3,
  TrendingUp,
  Lightbulb,
  Sparkles
} from 'lucide-react';

interface NoMatchReportProps {
  diagnostics: DiagnosticResult;
  profile: CandidateProfile;
  currentRole: JobRole;
  onReset: () => void;
}

export const NoMatchReport: React.FC<NoMatchReportProps> = ({
  diagnostics,
  profile,
  currentRole,
  onReset,
}) => {
  // SVG Dimensions for Candidate vs Required Chart
  const chart1W = 460;
  const chart1H = 250;
  const padLeft = 16;
  const padBottom = 40;
  const padTop = 20;
  const plotW = chart1W - padLeft - 16;
  const plotH = chart1H - padBottom - padTop;
  const groupW = plotW / Math.max(1, diagnostics.skillGaps.length);
  const barW = groupW * 0.30;
  const maxVal = 10;

  // SVG Dimensions for Gap Chart (Where the Gap Is)
  const chart2W = 420;
  const rowH = 38;
  const chart2H = rowH * diagnostics.skillGaps.length + 16;
  const midX = chart2W / 2;
  const maxGap = Math.max(3, ...diagnostics.skillGaps.map((s) => Math.abs(s.gap)));
  const scale = (chart2W / 2 - 34) / maxGap;

  // Radial Gauge with graduated harmonious colors
  const radius = 40;
  const circumference = 251.3;
  const overallPct = diagnostics.overallScore;
  const offset = circumference - (overallPct / 100) * circumference;
  const ringColor =
    overallPct >= 85
      ? '#10b981'
      : overallPct >= 70
      ? '#facc15'
      : overallPct >= 50
      ? '#f97316'
      : '#f43f5e';

  const expGap = diagnostics.expGap;
  const expColor =
    expGap >= 0
      ? '#10b981'
      : expGap >= -2
      ? '#facc15'
      : expGap >= -4
      ? '#f97316'
      : '#f43f5e';

  // Helper for skill progress color tiers (Emerald, Sky Cyan, Warm Golden Yellow, Rose)
  const getSkillTierColor = (pct: number, gap: number) => {
    if (gap >= 0 || pct >= 100) return { hex: '#10b981', label: 'Met / Surplus' };
    if (pct >= 75) return { hex: '#38bdf8', label: 'Strong Fit' };
    if (pct >= 50) return { hex: '#fbbf24', label: 'Moderate Fit' }; // Rich, warm pleasant yellow
    return { hex: '#f43f5e', label: 'Needs Improvement' };
  };

  // Helper for gap chart colors with high visual contrast
  const getGapColor = (gap: number) => {
    if (gap >= 0) return '#10b981'; // Emerald Green
    if (gap === -1) return '#facc15'; // Golden Yellow (Minor gap)
    if (gap === -2) return '#f97316'; // Vibrant Orange (Moderate gap)
    return '#f43f5e'; // Crimson Rose (Major deficit <= -3)
  };

  return (
    <div className="space-y-5 animate-in fade-in duration-300">
      {/* 1. Header Card (Balanced Diagnostic Overview) */}
      <div className="rounded-2xl bg-slate-900/80 border border-slate-800 p-6 md:p-7 shadow-xl backdrop-blur-md">
        <div className="flex items-center gap-3.5 mb-5">
          <div className="w-11 h-11 rounded-xl bg-orange-500/15 border border-orange-500/30 flex items-center justify-center text-orange-300 shadow-sm shrink-0">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-100">
              Gap Detected — Diagnostic Breakdown
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Comprehensive analysis of candidate skill alignment vs required role thresholds.
            </p>
          </div>
        </div>

        {/* Ring & Exp Gap */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Radial score gauge */}
          <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-950/50 border border-slate-800/80">
            <div className="relative w-24 h-24 shrink-0 flex items-center justify-center">
              <svg className="w-24 h-24 -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r={radius}
                  fill="none"
                  stroke="rgba(255,255,255,0.07)"
                  strokeWidth="9"
                />
                <circle
                  cx="50"
                  cy="50"
                  r={radius}
                  fill="none"
                  stroke={ringColor}
                  strokeWidth="9"
                  strokeLinecap="round"
                  strokeDasharray={circumference}
                  strokeDashoffset={offset}
                  className="transition-all duration-700 ease-out"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-xl font-bold font-mono text-slate-100">
                  {overallPct}%
                </span>
              </div>
            </div>

            <div>
              <div className="text-xs font-semibold text-slate-400">
                Overall Skill Match
              </div>
              <div className="text-xs text-slate-400 mt-1">
                Candidate Total:{' '}
                <b className="text-slate-100 font-mono text-sm">
                  {diagnostics.candidateTotal}
                </b>{' '}
                &nbsp;/&nbsp; Required Total:{' '}
                <b className="text-slate-100 font-mono text-sm">
                  {diagnostics.requiredTotal}
                </b>
              </div>
            </div>
          </div>

          {/* Internship experience gap */}
          <div className="flex items-center justify-between p-4 rounded-xl bg-slate-950/50 border border-slate-800/80">
            <div>
              <div className="text-xs font-semibold text-slate-400">
                Internship Experience
              </div>
              <div className="text-xs text-slate-400 mt-1">
                {profile.internshipExperience} months vs {currentRole.minExpMonths} months required
              </div>
            </div>
            <div
              className="text-lg font-bold font-mono px-3 py-1 rounded-lg border"
              style={{
                color: expColor,
                borderColor: `${expColor}40`,
                backgroundColor: `${expColor}15`,
              }}
            >
              {expGap >= 0 ? `+${expGap}` : expGap} mo
            </div>
          </div>
        </div>
      </div>

      {/* 2. The Two Synchronized Plots (Candidate vs Required & Where the Gap Is) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Plot 1: Candidate vs Required */}
        <div className="rounded-2xl bg-slate-900/80 border border-slate-800 p-4 md:p-5 flex flex-col justify-between shadow-xl">
          <div className="flex items-center gap-2 mb-3">
            <BarChart3 className="w-4 h-4 text-cyan-400" />
            <h3 className="text-sm font-bold text-slate-100">Candidate vs Required</h3>
          </div>

          {/* SVG Plot 1 */}
          <div className="w-full overflow-x-auto">
            <svg
              viewBox={`0 0 ${chart1W} ${chart1H}`}
              className="w-full h-auto min-w-[300px] select-none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                {/* Vivid and comfortable Sky-Cyan Gradient for Candidate */}
                <linearGradient id="plotGradCand" x1="0" y1="1" x2="0" y2="0">
                  <stop offset="0%" stopColor="#0284c7" />
                  <stop offset="50%" stopColor="#06b6d4" />
                  <stop offset="100%" stopColor="#38bdf8" />
                </linearGradient>
                {/* Harmonious Royal Violet Gradient for Required */}
                <linearGradient id="plotGradReq" x1="0" y1="1" x2="0" y2="0">
                  <stop offset="0%" stopColor="#4f46e5" />
                  <stop offset="50%" stopColor="#7c3aed" />
                  <stop offset="100%" stopColor="#c084fc" />
                </linearGradient>
              </defs>

              {/* Grid Lines */}
              {[0, 2.5, 5, 7.5, 10].map((gv) => {
                const y = padTop + plotH * (1 - gv / maxVal);
                return (
                  <line
                    key={`grid-line-${gv}`}
                    x1={padLeft}
                    y1={y}
                    x2={chart1W - 10}
                    y2={y}
                    stroke="rgba(255,255,255,0.06)"
                    strokeDasharray={gv === 0 ? 'none' : '3 3'}
                    strokeWidth="1"
                  />
                );
              })}

              {/* Bars & Values */}
              {diagnostics.skillGaps.map((skill, idx) => {
                const gx = padLeft + idx * groupW + groupW * 0.5;
                const candH = plotH * (Math.min(skill.candVal, maxVal) / maxVal);
                const reqH = plotH * (Math.min(skill.reqVal, maxVal) / maxVal);
                const candX = gx - barW - 3;
                const reqX = gx + 3;
                const baseY = padTop + plotH;
                const shortLabel =
                  skill.name.length <= 11 ? skill.name : skill.name.slice(0, 10) + '…';

                return (
                  <g key={`plot1-bar-${idx}`}>
                    {/* Candidate Bar */}
                    <rect
                      x={candX}
                      y={baseY - candH}
                      width={barW}
                      height={Math.max(2, candH)}
                      rx="4"
                      fill="url(#plotGradCand)"
                    />
                    <text
                      x={candX + barW / 2}
                      y={baseY - candH - 5}
                      fill="#f8fafc"
                      fontSize="10"
                      fontWeight="700"
                      textAnchor="middle"
                      fontFamily="sans-serif"
                    >
                      {skill.candVal}
                    </text>

                    {/* Required Bar */}
                    <rect
                      x={reqX}
                      y={baseY - reqH}
                      width={barW}
                      height={Math.max(2, reqH)}
                      rx="4"
                      fill="url(#plotGradReq)"
                    />
                    <text
                      x={reqX + barW / 2}
                      y={baseY - reqH - 5}
                      fill="#c084fc"
                      fontSize="10"
                      fontWeight="700"
                      textAnchor="middle"
                      fontFamily="sans-serif"
                    >
                      {skill.reqVal}
                    </text>

                    {/* X-Axis Label */}
                    <text
                      x={gx}
                      y={baseY + 18}
                      fill="#94a3b8"
                      fontSize="9.5"
                      fontWeight="500"
                      textAnchor="middle"
                      fontFamily="sans-serif"
                    >
                      {shortLabel}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Plot 1 Legend with matching dot indicators */}
          <div className="flex items-center justify-center gap-6 mt-3 pt-2 border-t border-slate-800 text-xs">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
              <span className="text-slate-300 font-medium">Candidate</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-purple-500" />
              <span className="text-slate-300 font-medium">Required</span>
            </div>
          </div>
        </div>

        {/* Plot 2: Where the Gap Is (Graduated Color Palette) */}
        <div className="rounded-2xl bg-slate-900/80 border border-slate-800 p-4 md:p-5 flex flex-col justify-between shadow-xl">
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp className="w-4 h-4 text-cyan-400" />
            <h3 className="text-sm font-bold text-slate-100">Where the Gap Is</h3>
          </div>

          {/* Diverging Gap SVG */}
          <div className="w-full overflow-x-auto">
            <svg
              viewBox={`0 0 ${chart2W} ${chart2H}`}
              className="w-full h-auto min-w-[280px] select-none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Zero Center Line */}
              <line
                x1={midX}
                y1={4}
                x2={midX}
                y2={chart2H - 4}
                stroke="rgba(255,255,255,0.18)"
                strokeDasharray="2 2"
                strokeWidth="1.5"
              />

              {diagnostics.skillGaps.map((skill, idx) => {
                const cy = 12 + idx * rowH + rowH / 2;
                const isPos = skill.gap >= 0;
                const barLen = Math.max(2, Math.abs(skill.gap) * scale);
                const barX = isPos ? midX : midX - barLen;
                const textX = isPos ? midX + barLen + 8 : midX - barLen - 8;
                const anchor = isPos ? 'start' : 'end';
                
                // Tiered Gap Colors: Emerald for (+), Amber for minor (-1/-2), Soft Rose for (-3+)
                const barColor = getGapColor(skill.gap);
                const labelText =
                  skill.name.length > 15 ? skill.name.slice(0, 14) + '…' : skill.name;

                return (
                  <g key={`gap-bar-${idx}`}>
                    {/* Background row highlight */}
                    <rect
                      x={10}
                      y={cy - 12}
                      width={chart2W - 20}
                      height={24}
                      rx="6"
                      fill="rgba(255,255,255,0.015)"
                    />

                    {/* Gap Bar */}
                    <rect
                      x={barX}
                      y={cy - 7}
                      width={barLen}
                      height="14"
                      rx="7"
                      fill={barColor}
                    />

                    {/* Gap Value Tag */}
                    <text
                      x={textX}
                      y={cy + 4}
                      textAnchor={anchor}
                      fill={barColor}
                      fontSize="11"
                      fontWeight="800"
                      fontFamily="sans-serif"
                    >
                      {isPos ? `+${skill.gap}` : skill.gap}
                    </text>

                    {/* Skill Name */}
                    <text
                      x={isPos ? 16 : chart2W - 16}
                      y={cy + 4}
                      textAnchor={isPos ? 'start' : 'end'}
                      fill="#94a3b8"
                      fontSize="10"
                      fontWeight="600"
                    >
                      {labelText}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Plot 2 Legend with Distinct Tiers */}
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-5 mt-3 pt-2 border-t border-slate-800 text-xs">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <span className="text-slate-300 font-medium">Met / Surplus (≥ 0)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
              <span className="text-slate-300 font-medium">Minor (-1)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-orange-500" />
              <span className="text-slate-300 font-medium">Moderate (-2)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
              <span className="text-slate-300 font-medium">Major (≤ -3)</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Skill Diagnostics Progress & Suggested Focus Areas (Tiered Colors) */}
      <div className="rounded-2xl bg-slate-900/80 border border-slate-800 p-5 md:p-6 shadow-xl space-y-4">
        {/* Progress bars with rich graduated colors */}
        <div className="space-y-3.5">
          {diagnostics.skillGaps.map((skill, idx) => {
            const tier = getSkillTierColor(skill.pct, skill.gap);
            const reqMarkerPos = (skill.reqVal / 10) * 100;

            return (
              <div key={`diag-prog-${idx}`}>
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="font-semibold text-slate-200">{skill.name}</span>
                  <div className="flex items-center gap-2">
                    <span
                      style={{ color: tier.hex }}
                      className="text-[11px] font-semibold opacity-95 hidden sm:inline"
                    >
                      {tier.label}
                    </span>
                    <span style={{ color: tier.hex }} className="font-mono font-bold">
                      {skill.pct}% &nbsp;·&nbsp; {skill.candVal}/{skill.reqVal}
                    </span>
                  </div>
                </div>
                <div className="relative w-full h-2.5 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${Math.min(100, skill.pct)}%`,
                      backgroundColor: tier.hex,
                    }}
                  />
                  <div
                    className="absolute top-0 bottom-0 w-0.5 bg-white/70 shadow-sm"
                    style={{ left: `${reqMarkerPos}%` }}
                    title={`Required Level: ${skill.reqVal}/10`}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Suggested Focus Areas */}
        <div className="mt-4 p-4 rounded-xl bg-slate-950/70 border border-slate-800/80">
          <div className="text-xs font-bold uppercase tracking-wider text-cyan-300 flex items-center gap-2 mb-3.5">
            <Lightbulb className="w-4 h-4 text-cyan-400" />
            <span>Suggested Focus Areas</span>
          </div>
          <div className="space-y-2.5">
            {diagnostics.criticalGaps.length > 0 ? (
              diagnostics.criticalGaps.map((gap, idx) => {
                const deficitClass =
                  gap.deficit >= 3
                    ? 'text-rose-300 bg-rose-500/10 border-rose-500/25'
                    : gap.deficit === 2
                    ? 'text-orange-300 bg-orange-500/10 border-orange-500/25'
                    : 'text-yellow-300 bg-yellow-500/10 border-yellow-500/25';

                const bulletBg =
                  gap.deficit >= 3
                    ? 'bg-rose-400'
                    : gap.deficit === 2
                    ? 'bg-orange-400'
                    : 'bg-yellow-400';

                return (
                  <div
                    key={`reco-${idx}`}
                    className="text-xs text-slate-300 flex items-start gap-2.5 py-1 px-2 rounded-lg hover:bg-slate-900/50 transition-colors"
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${bulletBg} mt-1.5 shrink-0`} />
                    <div className="leading-relaxed">
                      Focus on <b className="text-slate-100 font-semibold">{gap.name}</b> — currently{' '}
                      <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[11px] font-bold border ${deficitClass}`}>
                        {gap.deficit} point(s) deficit
                      </span>{' '}
                      below required level.
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-xs text-slate-400">
                Skill levels are close to requirements; review overall profile fit.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 4. New Prediction Button */}
      <div className="flex justify-center pt-2">
        <button
          onClick={onReset}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold text-slate-200 bg-slate-800 hover:bg-slate-700 border border-slate-700 shadow-md transition-all hover:scale-[1.02] cursor-pointer"
        >
          <RotateCcw className="w-4 h-4 text-cyan-400" />
          <span>New Prediction</span>
        </button>
      </div>
    </div>
  );
};

