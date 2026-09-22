import { ColorTheme } from '../types';

export const COLOR_THEMES: ColorTheme[] = [
  {
    id: 'aurora-violet-rose',
    name: 'Aurora & Rose Glow (Recommended)',
    description: 'Vibrant cyan-teal candidate tone with warm amethyst & soft coral deficits — calming, modern, and high contrast without harsh reds.',
    candidateGradStart: '#0284c7', // Sky blue
    candidateGradMid: '#06b6d4',   // Cyan
    candidateGradEnd: '#38bdf8',   // Light Sky
    requiredGradStart: '#4f46e5',  // Indigo
    requiredGradMid: '#7c3aed',    // Violet
    requiredGradEnd: '#a855f7',    // Purple
    surplusBar: '#10b981',         // Fresh emerald
    deficitBar: '#f43f5e',         // Soft rose coral
    accentGlow: 'rgba(56, 189, 248, 0.4)',
    ringGradients: {
      good: ['#10b981', '#34d399'],
      warning: ['#f59e0b', '#fbbf24'],
      deficit: ['#f43f5e', '#fb7185'],
    },
  },
  {
    id: 'cyber-emerald-sunset',
    name: 'Emerald Mint & Sunset Peach',
    description: 'Electric mint candidate bars paired with warm sunset orange and deep violet benchmarks.',
    candidateGradStart: '#059669',
    candidateGradMid: '#10b981',
    candidateGradEnd: '#34d399',
    requiredGradStart: '#4338ca',
    requiredGradMid: '#6366f1',
    requiredGradEnd: '#818cf8',
    surplusBar: '#10b981',
    deficitBar: '#fb923c',         // Warm peach/orange
    accentGlow: 'rgba(16, 185, 129, 0.4)',
    ringGradients: {
      good: ['#10b981', '#6ee7b7'],
      warning: ['#f59e0b', '#fcd34d'],
      deficit: ['#fb923c', '#fdba74'],
    },
  },
  {
    id: 'neon-azure-fuchsia',
    name: 'Electric Azure & Orchid',
    description: 'Bright ocean blue candidate levels against vibrant royal orchid for deep visual expressiveness.',
    candidateGradStart: '#2563eb',
    candidateGradMid: '#38bdf8',
    candidateGradEnd: '#67e8f9',
    requiredGradStart: '#9333ea',
    requiredGradMid: '#c084fc',
    requiredGradEnd: '#e879f9',
    surplusBar: '#06b6d4',
    deficitBar: '#ec4899',         // Vibrant orchid pink
    accentGlow: 'rgba(56, 189, 248, 0.4)',
    ringGradients: {
      good: ['#06b6d4', '#22d3ee'],
      warning: ['#eab308', '#fde047'],
      deficit: ['#ec4899', '#f472b6'],
    },
  },
  {
    id: 'nordic-teal-amber',
    name: 'Nordic Teal & Golden Amber',
    description: 'Soothing oceanic teal candidate bars contrasted with deep slate indigo and warm amber deficit highlights.',
    candidateGradStart: '#0d9488',
    candidateGradMid: '#14b8a6',
    candidateGradEnd: '#2dd4bf',
    requiredGradStart: '#3b82f6',
    requiredGradMid: '#60a5fa',
    requiredGradEnd: '#93c5fd',
    surplusBar: '#2dd4bf',
    deficitBar: '#f59e0b',         // Golden amber
    accentGlow: 'rgba(20, 184, 166, 0.4)',
    ringGradients: {
      good: ['#14b8a6', '#5eead4'],
      warning: ['#d97706', '#fbbf24'],
      deficit: ['#f59e0b', '#fcd34d'],
    },
  }
];
