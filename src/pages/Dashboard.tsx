import React from 'react';
import { Dumbbell, Target, Zap, ChevronRight, Activity } from 'lucide-react';

const Dashboard: React.FC = () => {
  const modules = [
    { id: 'PUSH', title: 'Pushups', status: 'Optimal', reps: 250, icon: <Activity size={20} />, color: 'text-lime' },
    { id: 'PULL', title: 'Pullups', status: 'Warning', reps: 120, icon: <Dumbbell size={20} />, color: 'text-amber' },
    { id: 'SQAT', title: 'Squats', status: 'Operational', reps: 500, icon: <Target size={20} />, color: 'text-white' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-3">
          <div className="w-1 h-8 bg-lime" />
          <h1 className="text-4xl font-black tracking-tighter uppercase">System_Overview</h1>
        </div>
        <p className="text-xs text-muted font-mono italic tracking-widest uppercase ml-4">Initializing neuro-muscular analysis protocol...</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {modules.map((module) => (
          <div 
            key={module.id}
            className="group relative bg-surface border border-white/10 p-6 transition-all duration-300 hover:border-lime/30 hover:bg-surface2 cursor-pointer overflow-hidden rounded-sm"
          >
            <div className="relative z-10 space-y-4">
              <div className="flex justify-between items-start">
                <div className={`p-3 bg-bg border border-white/10 group-hover:border-lime/50 transition-colors ${module.color}`}>
                  {module.icon}
                </div>
                <span className={`text-[10px] font-mono px-2 py-1 border rounded-[1px] uppercase tracking-widest ${
                  module.status === 'Warning' ? 'border-amber/50 text-amber bg-amber/5' : 'border-lime/50 text-lime bg-lime/5'
                }`}>
                  {module.status}
                </span>
              </div>

              <div>
                <h3 className="text-lg font-bold tracking-[.1em] text-white/90 uppercase group-hover:text-white transition-colors">
                  {module.title}
                </h3>
                <div className="flex items-baseline gap-2 mt-2">
                  <span className="text-4xl font-black tracking-tighter grad-text">{module.reps}</span>
                  <span className="text-[10px] font-mono text-muted uppercase tracking-[.2em]">Reps Validated</span>
                </div>
              </div>

              <div className="pt-4 border-t border-white/5 flex justify-between items-center">
                <span className="text-[9px] font-mono text-muted tracking-widest uppercase">Protocol: VX_{module.id}</span>
                <ChevronRight size={14} className="text-muted group-hover:text-lime group-hover:translate-x-1 transition-all" />
              </div>
            </div>

            {/* Glowing Corner Accents */}
            <div className="absolute top-0 right-0 w-8 h-8 border-t border-r border-transparent group-hover:border-lime/40 transition-all duration-500" />
            <div className="absolute bottom-0 left-0 w-8 h-8 border-b border-l border-transparent group-hover:border-lime/40 transition-all duration-500" />
          </div>
        ))}
      </div>

      {/* Analytics Terminal */}
      <div className="mt-12 bg-bg2 border border-white/10 p-8 rounded-sm overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-lime/20 to-transparent" />
        <div className="font-mono text-xs space-y-4">
          <div className="flex gap-4 text-lime items-center">
            <span className="animate-pulse text-lg">▶</span>
            <span className="tracking-[.2em] font-bold uppercase">Neural_Load_Balancer: Active</span>
          </div>
          <div className="space-y-1 text-muted uppercase tracking-wider text-[10px]">
            <p className="flex gap-3"><span className="text-white/20">[00:00:01]</span> Calibrating kinetic sensors...</p>
            <p className="flex gap-3"><span className="text-white/20">[00:00:02]</span> Tracking user pulse: <span className="text-amber">72 BPM</span></p>
            <p className="flex gap-3"><span className="text-white/20">[00:00:03]</span> Environment analysis: <span className="text-lime">Optimized</span></p>
            <p className="flex gap-3"><span className="text-white/20">[00:00:04]</span> Visual_Core: <span className="text-lime">Locked</span></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
