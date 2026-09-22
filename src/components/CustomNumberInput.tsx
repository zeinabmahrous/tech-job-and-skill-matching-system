import React from 'react';
import { Plus, Minus } from 'lucide-react';

interface CustomNumberInputProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
  className?: string;
}

export const CustomNumberInput: React.FC<CustomNumberInputProps> = ({
  value,
  onChange,
  min = 0,
  max = 100,
  step = 1,
  unit,
  className = '',
}) => {
  const handleDecrement = () => {
    const nextVal = Math.max(min, Math.round((value - step) * 10) / 10);
    onChange(nextVal);
  };

  const handleIncrement = () => {
    const nextVal = Math.min(max, Math.round((value + step) * 10) / 10);
    onChange(nextVal);
  };

  return (
    <div className={`relative flex items-center bg-slate-950/80 border border-slate-700/80 rounded-xl overflow-hidden focus-within:border-cyan-500 focus-within:ring-2 focus-within:ring-cyan-500/20 transition-all ${className}`}>
      {/* Minus Button */}
      <button
        type="button"
        onClick={handleDecrement}
        disabled={value <= min}
        className="px-2.5 py-2 text-slate-400 hover:text-cyan-300 hover:bg-slate-800/80 disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-slate-500 transition-colors cursor-pointer border-r border-slate-800"
        title="Decrease"
      >
        <Minus className="w-3.5 h-3.5" />
      </button>

      {/* Input Field */}
      <input
        type="number"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => {
          const raw = parseFloat(e.target.value);
          if (!isNaN(raw)) {
            onChange(Math.min(max, Math.max(min, raw)));
          } else if (e.target.value === '') {
            onChange(min);
          }
        }}
        className="w-full bg-transparent px-2.5 py-2 text-center text-sm font-semibold text-slate-100 focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
      />

      {unit && (
        <span className="text-xs text-slate-500 font-mono pr-2 select-none shrink-0">
          {unit}
        </span>
      )}

      {/* Plus Button */}
      <button
        type="button"
        onClick={handleIncrement}
        disabled={value >= max}
        className="px-2.5 py-2 text-slate-400 hover:text-cyan-300 hover:bg-slate-800/80 disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-slate-500 transition-colors cursor-pointer border-l border-slate-800"
        title="Increase"
      >
        <Plus className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};
