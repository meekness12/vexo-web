import React from 'react';
import { Terminal, Award, Zap, ChevronRight, Share2, AlertTriangle } from 'lucide-react';
import type { WorkoutSession } from '../utils/types';

interface SessionSummaryProps {
  session: WorkoutSession;
  onRestart: () => void;
}

const SessionSummary: React.FC<SessionSummaryProps> = ({ session, onRestart }) => {
  const durationInSeconds = session.endTime
    ? Math.floor((session.endTime - session.startTime) / 1000)
    : 0;

  const minutes = Math.floor(durationInSeconds / 60);
  const seconds = durationInSeconds % 60;

  const repsValidated = session.currentReps;
  const repsRejected = session.feedback.filter(f => f.type === 'bad').length;
  const warnings = session.feedback.filter(f => f.type === 'warn').length;
  const accuracy = session.repsAttempted > 0
    ? Math.round((repsValidated / session.repsAttempted) * 100)
    : 100;

  const creditsEarned = repsValidated * 10;

  const stats = [
    { label: 'Credits Earned', value: creditsEarned.toLocaleString(), unit: 'XP', color: 'text-lime' },
    { label: 'Form Accuracy', value: `${accuracy}`, unit: '%', color: accuracy >= 80 ? 'text-lime' : 'text-amber' },
    { label: 'Session Duration', value: `${minutes}:${seconds.toString().padStart(2, '0')}`, unit: 'MIN', color: 'text-amber' },
  ];

  const missionComplete = session.mode === 'TARGET'
    ? repsValidated >= session.targetReps
    : true;

  return (
    <div className="max-w-4xl mx-auto space-y-10">
      <div className="flex justify-between items-center border-b border-white/10 pb-8">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-3">
            <div className="w-1.5 h-10 bg-lime" />
            <h1 className="text-4xl font-black tracking-tighter uppercase">Mission_Debrief</h1>
          </div>
          <p className="text-[10px] text-muted font-mono ml-4 uppercase tracking-[.3em]">
            Log_ID: {session.id} // Mode: {session.mode}
          </p>
        </div>
        <div className={`w-16 h-16 border rounded-sm flex items-center justify-center shadow-[0_0_15px] ${
          missionComplete
            ? 'border-lime/30 bg-lime/5 text-lime shadow-lime/10'
            : 'border-amber/30 bg-amber/5 text-amber shadow-amber/10'
        }`}>
          <Award size={32} />
        </div>
      </div>

      {/* Mission Status */}
      <div className={`p-6 border flex items-center gap-4 ${
        missionComplete
          ? 'bg-lime/5 border-lime/20'
          : 'bg-amber/5 border-amber/20'
      }`}>
        <div className={`text-4xl font-black ${missionComplete ? 'grad-text' : 'text-amber'}`}>
          {missionComplete ? 'MISSION_COMPLETE' : 'MISSION_ABORTED'}
        </div>
      </div>

      {/* Primary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-surface border border-white/10 p-8 text-center space-y-3 relative overflow-hidden group rounded-sm">
            <div className="absolute top-0 left-0 w-1 h-full bg-white/5 group-hover:bg-lime transition-all duration-300" />
            <span className="text-[10px] uppercase font-bold tracking-[.3em] text-muted">{stat.label}</span>
            <div className="flex justify-center items-baseline gap-2">
              <span className={`text-4xl font-black tracking-tighter ${stat.color}`}>{stat.value}</span>
              <span className="text-[10px] font-mono text-muted/50 uppercase tracking-widest">{stat.unit}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Error Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-bg border border-white/10 p-5 text-center rounded-sm">
          <div className="text-2xl font-black text-lime">{repsValidated}</div>
          <div className="text-[9px] font-mono text-muted uppercase tracking-widest mt-1">Reps_Validated</div>
        </div>
        <div className="bg-bg border border-white/10 p-5 text-center rounded-sm">
          <div className="text-2xl font-black text-red">{repsRejected}</div>
          <div className="text-[9px] font-mono text-muted uppercase tracking-widest mt-1">Reps_Rejected</div>
        </div>
        <div className="bg-bg border border-white/10 p-5 text-center rounded-sm">
          <div className="text-2xl font-black text-amber">{warnings}</div>
          <div className="text-[9px] font-mono text-muted uppercase tracking-widest mt-1">Tempo_Warnings</div>
        </div>
      </div>

      {/* Terminal Log */}
      <div className="bg-bg border border-white/10 rounded-sm overflow-hidden">
        <div className="bg-surface px-6 py-4 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Terminal size={14} className="text-lime" />
            <span className="text-[10px] font-mono font-bold tracking-[.3em] text-lime uppercase">Raw_Session_Log</span>
          </div>
          <div className="text-[9px] font-mono text-muted uppercase tracking-widest">
            {session.feedback.length} entries
          </div>
        </div>
        <div className="p-6 font-mono text-[10px] max-h-[320px] overflow-y-auto space-y-0" style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(163,230,53,0.2) transparent' }}>
          {session.feedback.slice().reverse().map((item, i) => (
            <div key={i} className="flex gap-4 py-2 border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors">
              <span className="text-white/20 min-w-[60px]">{item.timestamp}</span>
              <span className={`min-w-[40px] font-bold ${
                item.type === 'ok' ? 'text-lime' : item.type === 'warn' ? 'text-amber' : 'text-red'
              }`}>
                {item.type === 'ok' ? '[OK]' : item.type === 'warn' ? '[WRN]' : '[ERR]'}
              </span>
              <span className="text-white/60 tracking-wider">{item.text}</span>
            </div>
          ))}
          {session.feedback.length === 0 && (
            <div className="py-8 text-center text-muted uppercase tracking-widest">No feedback logs.</div>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-4 pt-6">
        <button
          onClick={onRestart}
          className="flex-[2] bg-lime text-bg font-black tracking-[.3em] uppercase py-5 hover:bg-lime-hi transition-all shadow-[0_0_25px_rgba(163,230,53,0.25)] flex items-center justify-center gap-3 rounded-sm"
        >
          <Zap size={18} fill="currentColor" /> Return_To_Dashboard
        </button>
        <button className="flex-1 border border-white/10 text-muted font-bold tracking-[.2em] uppercase py-5 hover:bg-surface hover:text-white transition-all flex items-center justify-center gap-3 rounded-sm">
          <Share2 size={16} /> Share_Results
        </button>
      </div>
    </div>
  );
};

export default SessionSummary;
