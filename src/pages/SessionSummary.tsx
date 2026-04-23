import React from 'react';
import { Terminal, Award, Zap, ChevronRight, Share2 } from 'lucide-react';

const SessionSummary: React.FC = () => {
  const stats = [
    { label: 'Credits Earned', value: '4,250', unit: 'XP', color: 'text-lime' },
    { label: 'Accuracy Rating', value: '98.2', unit: '%', color: 'text-white' },
    { label: 'Neural Sync', value: '0.85', unit: 'MS', color: 'text-amber' },
  ];

  const sets = [
    { name: 'Diamond Pushups', reps: 15, accuracy: 99, status: 'EXCELLENT' },
    { name: 'Explosive Pullups', reps: 8, accuracy: 96, status: 'OPTIMAL' },
    { name: 'Pistol Squats', reps: 12, accuracy: 98, status: 'EXCELLENT' },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-10 animate-in zoom-in-95 duration-500">
      <div className="flex justify-between items-center border-b border-white/10 pb-8">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-3">
            <div className="w-1.5 h-10 bg-lime" />
            <h1 className="text-4xl font-black tracking-tighter uppercase">Mission_Debrief</h1>
          </div>
          <p className="text-[10px] text-muted font-mono ml-4 uppercase tracking-[.3em]">Log_ID: VX_2026_0423_ALPHA // Level: CLASSIFIED</p>
        </div>
        <div className="w-16 h-16 border border-lime/30 bg-lime/5 rounded-sm flex items-center justify-center text-lime shadow-[0_0_15px_rgba(163,230,53,0.1)]">
          <Award size={32} />
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

      {/* Terminal Set List */}
      <div className="bg-bg border border-white/10 rounded-sm overflow-hidden">
        <div className="bg-surface px-6 py-4 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Terminal size={14} className="text-lime" />
            <span className="text-[10px] font-mono font-bold tracking-[.3em] text-lime uppercase">Raw_Mission_Data</span>
          </div>
          <div className="text-[9px] font-mono text-muted uppercase tracking-widest">Protocol_V1.02</div>
        </div>
        <div className="p-8 font-mono text-xs">
          <table className="w-full text-left">
            <thead>
              <tr className="text-muted/40 uppercase tracking-[.2em] border-b border-white/5">
                <th className="pb-4 font-normal">Exercise_Node</th>
                <th className="pb-4 font-normal">Rep_Count</th>
                <th className="pb-4 font-normal">Accuracy</th>
                <th className="pb-4 font-normal">Status_Code</th>
              </tr>
            </thead>
            <tbody className="text-muted">
              {sets.map((set, i) => (
                <tr key={i} className="border-b border-white/5 hover:bg-white/5 transition-all group">
                  <td className="py-5 flex items-center gap-3 text-white/80">
                    <ChevronRight size={12} className="text-lime opacity-0 group-hover:opacity-100 transition-all translate-x-[-10px] group-hover:translate-x-0" />
                    <span className="tracking-widest uppercase">{set.name}</span>
                  </td>
                  <td className="py-5 text-white">{set.reps.toString().padStart(2, '0')}</td>
                  <td className="py-5 text-lime">{set.accuracy}%</td>
                  <td className="py-5">
                    <span className={`px-2 py-1 border text-[9px] tracking-widest rounded-sm ${set.status === 'EXCELLENT' ? 'border-lime/30 text-lime bg-lime/5' : 'border-amber/30 text-amber bg-amber/5'}`}>
                      {set.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Action Bar */}
      <div className="flex flex-col sm:flex-row gap-4 pt-6">
        <button className="flex-[2] bg-lime text-bg font-black tracking-[.3em] uppercase py-5 hover:bg-lime-hi transition-all shadow-[0_0_25px_rgba(163,230,53,0.25)] flex items-center justify-center gap-3 rounded-sm">
          <Zap size={18} fill="currentColor" /> Commit_To_Neural_Link
        </button>
        <button className="flex-1 border border-white/10 text-muted font-bold tracking-[.2em] uppercase py-5 hover:bg-surface hover:text-white transition-all flex items-center justify-center gap-3 rounded-sm">
          <Share2 size={16} /> Encrypt_Share
        </button>
      </div>

      <div className="text-center pt-8">
        <div className="inline-block px-4 py-2 bg-surface2 border border-white/5 text-[9px] font-mono text-muted/50 uppercase tracking-[.4em]">
          End_Of_Log // Protocol_Secure
        </div>
      </div>
    </div>
  );
};

export default SessionSummary;
