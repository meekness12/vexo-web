import React, { useState } from 'react';
import { X, Target, Infinity, Activity, Minus, Plus } from 'lucide-react';
import type { ExerciseType, SessionMode } from '../utils/types';

interface GoalModalProps {
  exercise: ExerciseType;
  onConfirm: (target: number, mode: SessionMode) => void;
  onClose: () => void;
}

const PRESETS = [10, 25, 50, 100];

const GoalModal: React.FC<GoalModalProps> = ({ exercise, onConfirm, onClose }) => {
  const [mode, setMode] = useState<SessionMode>('TARGET');
  const [target, setTarget] = useState(25);

  const handleConfirm = () => {
    if (mode === 'FREE') {
      onConfirm(0, 'FREE');
    } else {
      onConfirm(target, 'TARGET');
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative bg-bg2 border border-white/10 w-full max-w-md overflow-hidden">
        {/* Top accent line */}
        <div className="h-[2px] w-full bg-gradient-to-r from-lime to-amber" />

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-lime/10 border border-lime/30 flex items-center justify-center text-lime">
              <Activity size={16} />
            </div>
            <div>
              <h2 className="text-sm font-black tracking-[.2em] uppercase text-white">{exercise}</h2>
              <p className="text-[9px] font-mono text-muted uppercase tracking-widest">Contract_Configuration</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center text-muted hover:text-red transition-colors border border-white/5 hover:border-red/30"
          >
            <X size={14} />
          </button>
        </div>

        {/* Mode Selector */}
        <div className="px-6 pt-6 pb-4">
          <p className="text-[9px] font-mono text-muted uppercase tracking-[.3em] mb-3">Mission_Type</p>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => setMode('TARGET')}
              className={`p-4 border text-left transition-all ${
                mode === 'TARGET'
                  ? 'bg-lime/10 border-lime/40 shadow-[0_0_12px_rgba(163,230,53,0.1)]'
                  : 'border-white/10 hover:border-white/20'
              }`}
            >
              <Target size={18} className={mode === 'TARGET' ? 'text-lime' : 'text-muted'} />
              <div className="mt-2 text-xs font-bold tracking-[.15em] uppercase text-white">Target</div>
              <div className="text-[9px] font-mono text-muted mt-1">Set a rep goal</div>
            </button>
            <button
              onClick={() => setMode('FREE')}
              className={`p-4 border text-left transition-all ${
                mode === 'FREE'
                  ? 'bg-amber/10 border-amber/40 shadow-[0_0_12px_rgba(245,158,11,0.1)]'
                  : 'border-white/10 hover:border-white/20'
              }`}
            >
              <Infinity size={18} className={mode === 'FREE' ? 'text-amber' : 'text-muted'} />
              <div className="mt-2 text-xs font-bold tracking-[.15em] uppercase text-white">Free Mode</div>
              <div className="text-[9px] font-mono text-muted mt-1">No limit — train freely</div>
            </button>
          </div>
        </div>

        {/* Target Selector (only in TARGET mode) */}
        {mode === 'TARGET' && (
          <div className="px-6 pb-4">
            <p className="text-[9px] font-mono text-muted uppercase tracking-[.3em] mb-3">Rep_Contract</p>
            <div className="grid grid-cols-4 gap-2 mb-4">
              {PRESETS.map((p) => (
                <button
                  key={p}
                  onClick={() => setTarget(p)}
                  className={`py-3 text-center font-bold text-sm tracking-widest transition-all border ${
                    target === p
                      ? 'bg-lime/15 border-lime/40 text-lime'
                      : 'border-white/10 text-muted hover:border-lime/20 hover:text-white'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>

            {/* Custom input */}
            <div className="flex items-center gap-3 p-3 bg-bg border border-white/10">
              <button
                onClick={() => setTarget(Math.max(1, target - 5))}
                className="w-10 h-10 flex items-center justify-center border border-white/10 text-muted hover:text-white hover:border-lime/30 transition-all"
              >
                <Minus size={14} />
              </button>
              <div className="flex-1 text-center">
                <div className="text-3xl font-black tracking-tighter grad-text">{target}</div>
                <div className="text-[8px] font-mono text-muted uppercase tracking-[.3em]">Reps</div>
              </div>
              <button
                onClick={() => setTarget(Math.min(500, target + 5))}
                className="w-10 h-10 flex items-center justify-center border border-white/10 text-muted hover:text-white hover:border-lime/30 transition-all"
              >
                <Plus size={14} />
              </button>
            </div>
          </div>
        )}

        {/* Camera Positioning Guide */}
        <div className="px-6 pb-4">
          <div className="bg-surface border border-white/5 p-4 flex gap-4">
            <div className="w-12 h-12 flex-shrink-0 bg-bg border border-lime/20 flex items-center justify-center text-lime">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z" />
                <circle cx="12" cy="13" r="4" />
              </svg>
            </div>
            <div>
              <p className="text-[10px] font-bold text-lime uppercase tracking-widest">Camera_Position</p>
              <p className="text-[10px] text-muted font-mono mt-1 leading-relaxed">
                Place device at side angle for best detection.
                Full body should be visible in frame.
              </p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="px-6 pb-6 flex gap-3">
          <button
            onClick={handleConfirm}
            className="flex-1 bg-lime text-bg font-black tracking-[.3em] uppercase py-4 hover:bg-lime-hi transition-all shadow-[0_0_20px_rgba(163,230,53,0.2)] text-sm"
          >
            Lock_Contract
          </button>
          <button
            onClick={onClose}
            className="px-6 border border-white/10 text-muted font-bold tracking-widest uppercase py-4 hover:bg-surface hover:text-white transition-all text-xs"
          >
            Abort
          </button>
        </div>
      </div>
    </div>
  );
};

export default GoalModal;
