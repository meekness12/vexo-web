import React from 'react';
import { Dumbbell, Target, ChevronRight, Activity, Lock } from 'lucide-react';
import type { ExerciseType } from '../utils/types';

interface DashboardProps {
  onSelectExercise: (exercise: ExerciseType) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onSelectExercise }) => {
  const modules = [
    { id: 'PUSHUPS' as ExerciseType, title: 'Pushups', status: 'Online', reps: 0, icon: <Activity size={20} />, color: 'text-lime', available: true },
    { id: 'PULLUPS' as ExerciseType, title: 'Pullups', status: 'Coming Soon', reps: 0, icon: <Dumbbell size={20} />, color: 'text-muted', available: false },
    { id: 'SQUATS' as ExerciseType, title: 'Squats', status: 'Coming Soon', reps: 0, icon: <Target size={20} />, color: 'text-muted', available: false },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-3">
          <div className="w-1 h-8 bg-lime" />
          <h1 className="text-4xl font-black tracking-tighter uppercase">System_Overview</h1>
        </div>
        <p className="text-xs text-muted font-mono italic tracking-widest uppercase ml-4">Select an exercise module to begin training...</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {modules.map((module) => (
          <div
            key={module.id}
            onClick={() => module.available && onSelectExercise(module.id)}
            className={`group relative bg-surface border p-6 transition-all duration-300 overflow-hidden rounded-sm ${
              module.available
                ? 'border-white/10 hover:border-lime/30 hover:bg-surface2 cursor-pointer'
                : 'border-white/5 opacity-50 cursor-not-allowed'
            }`}
          >
            <div className="relative z-10 space-y-4">
              <div className="flex justify-between items-start">
                <div className={`p-3 bg-bg border border-white/10 ${module.available ? 'group-hover:border-lime/50' : ''} transition-colors ${module.color}`}>
                  {module.available ? module.icon : <Lock size={20} />}
                </div>
                <span className={`text-[10px] font-mono px-2 py-1 border rounded-[1px] uppercase tracking-widest ${
                  module.available
                    ? 'border-lime/50 text-lime bg-lime/5'
                    : 'border-muted/30 text-muted bg-muted/5'
                }`}>
                  {module.status}
                </span>
              </div>

              <div>
                <h3 className={`text-lg font-bold tracking-[.1em] uppercase transition-colors ${
                  module.available ? 'text-white/90 group-hover:text-white' : 'text-muted'
                }`}>
                  {module.title}
                </h3>
                {module.available ? (
                  <div className="flex items-baseline gap-2 mt-2">
                    <span className="text-sm font-mono text-muted uppercase tracking-[.2em]">AI_Detection_Ready</span>
                  </div>
                ) : (
                  <div className="flex items-baseline gap-2 mt-2">
                    <span className="text-sm font-mono text-muted/50 uppercase tracking-[.2em]">Module_Locked</span>
                  </div>
                )}
              </div>

              <div className="pt-4 border-t border-white/5 flex justify-between items-center">
                <span className="text-[9px] font-mono text-muted tracking-widest uppercase">Protocol: VX_{module.id}</span>
                {module.available && (
                  <div className="flex items-center gap-2 text-lime opacity-0 group-hover:opacity-100 transition-all">
                    <span className="text-[9px] font-mono uppercase tracking-widest">Initialize</span>
                    <ChevronRight size={14} className="group-hover:translate-x-1 transition-all" />
                  </div>
                )}
              </div>
            </div>

            {module.available && (
              <>
                <div className="absolute top-0 right-0 w-8 h-8 border-t border-r border-transparent group-hover:border-lime/40 transition-all duration-500" />
                <div className="absolute bottom-0 left-0 w-8 h-8 border-b border-l border-transparent group-hover:border-lime/40 transition-all duration-500" />
              </>
            )}
          </div>
        ))}
      </div>

      <div className="mt-12 bg-bg2 border border-white/10 p-8 rounded-sm overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-lime/20 to-transparent" />
        <div className="font-mono text-xs space-y-4">
          <div className="flex gap-4 text-lime items-center">
            <span className="animate-pulse text-lg">▶</span>
            <span className="tracking-[.2em] font-bold uppercase">Neural_Load_Balancer: Active</span>
          </div>
          <div className="space-y-1 text-muted uppercase tracking-wider text-[10px]">
            <p className="flex gap-3"><span className="text-white/20">[SYS]</span> MediaPipe Pose Landmarker: <span className="text-lime">Standby</span></p>
            <p className="flex gap-3"><span className="text-white/20">[SYS]</span> Camera subsystem: <span className="text-amber">Awaiting initialization</span></p>
            <p className="flex gap-3"><span className="text-white/20">[SYS]</span> Select a module to deploy the AI Eye.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
