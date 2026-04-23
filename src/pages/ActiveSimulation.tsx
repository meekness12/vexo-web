import React, { useState } from 'react';
import { Camera, RefreshCw, AlertTriangle, Crosshair } from 'lucide-react';

const ActiveSimulation: React.FC = () => {
  const [reps, setReps] = useState(0);
  const [isPulsing, setIsPulsing] = useState(false);

  const handleSimulateRep = () => {
    setIsPulsing(true);
    setReps(prev => prev + 1);
    setTimeout(() => setIsPulsing(false), 500);
  };

  return (
    <div className="h-full flex flex-col gap-6 animate-in slide-in-from-bottom-8 duration-700">
      <div className="flex justify-between items-end">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-3">
            <div className="w-1 h-6 bg-amber" />
            <h1 className="text-3xl font-black tracking-tighter uppercase">Live_Simulation</h1>
          </div>
          <p className="text-[10px] text-muted font-mono ml-4 uppercase tracking-[.2em]">Feed_Source: OPTIC_NODE_01 // Status: SYNCHRONIZED</p>
        </div>
        <button className="px-4 py-2 bg-surface border border-white/10 text-[10px] font-mono tracking-widest uppercase hover:border-lime/50 hover:text-lime transition-all flex items-center gap-2 rounded-sm">
          <RefreshCw size={12} /> Recalibrate_Eye
        </button>
      </div>

      <div className="flex-1 grid grid-cols-12 gap-6 min-h-[500px]">
        {/* Main Visualizer */}
        <div className="col-span-12 lg:col-span-9 relative bg-bg border border-white/10 overflow-hidden rounded-sm group">
          {/* Mock Camera Feed */}
          <div className="absolute inset-0 bg-[#050705]">
            <div className="absolute inset-0 opacity-10 [background-image:linear-gradient(rgba(163,230,53,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(163,230,53,0.1)_1px,transparent_1px)] [background-size:40px_40px]" />
            
            {/* Subject Wireframe Placeholder */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-64 h-96 border border-lime/10 rounded-full animate-pulse flex items-center justify-center">
                <div className="w-32 h-32 border border-lime/20 rounded-full flex items-center justify-center">
                  <Crosshair className="text-lime/20 w-8 h-8" />
                </div>
              </div>
            </div>
          </div>

          {/* HUD Overlay */}
          <div className="absolute inset-0 p-8 flex flex-col justify-between pointer-events-none">
            <div className="flex justify-between items-start">
              <div className="bg-bg/80 border border-lime/30 p-4 backdrop-blur-sm rounded-sm">
                <div className="flex items-center gap-3 text-lime">
                  <Camera size={16} className="animate-pulse" />
                  <span className="text-[10px] font-mono font-bold tracking-widest uppercase">Feed_Active // Target_Locked</span>
                </div>
              </div>
              
              <div className="text-right space-y-2">
                <div className="text-[9px] text-muted uppercase font-mono tracking-widest">Precision_Index</div>
                <div className="w-40 h-1 bg-surface border border-white/5 overflow-hidden">
                  <div className="w-3/4 h-full bg-lime shadow-[0_0_10px_#A3E635]" />
                </div>
              </div>
            </div>

            <div className="flex justify-center items-center">
              <div className={`
                transition-all duration-300 transform flex flex-col items-center
                ${isPulsing ? 'scale-110' : 'scale-100'}
              `}>
                <span className={`text-[12rem] font-black leading-none tracking-tighter transition-colors ${isPulsing ? 'text-lime' : 'text-white'}`}>
                  {reps.toString().padStart(2, '0')}
                </span>
                <span className="text-xs font-mono font-bold tracking-[.8em] text-muted uppercase -mt-4 ml-[.8em]">Validated_Reps</span>
              </div>
            </div>

            <div className="flex justify-between items-end text-[9px] font-mono text-muted tracking-widest uppercase">
              <div className="flex gap-6">
                <div className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-lime" /> Accuracy: 98.4%</div>
                <div className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-amber" /> Load: 45KG</div>
              </div>
              <div className="bg-surface px-2 py-1 border border-white/5">Frame_Rate: 60_FPS</div>
            </div>
          </div>

          {/* Scanning Line */}
          <div className="absolute top-0 left-0 w-full h-[1px] bg-lime/40 shadow-[0_0_15px_#A3E635] animate-[scan_4s_linear_infinite] pointer-events-none" />
        </div>

        {/* Side Panel */}
        <div className="col-span-12 lg:col-span-3 space-y-6">
          <div className="bg-surface border border-white/10 p-6 space-y-6 rounded-sm">
            <h3 className="text-[10px] font-bold tracking-[.2em] text-muted uppercase flex items-center gap-2">
              <RefreshCw size={10} /> Simulation_Control
            </h3>
            
            <button 
              onClick={handleSimulateRep}
              className={`
                w-full py-8 font-black tracking-[.2em] text-sm transition-all border rounded-sm uppercase
                ${isPulsing 
                  ? 'bg-lime border-lime text-bg shadow-[0_0_20px_rgba(163,230,53,0.4)]' 
                  : 'bg-bg border-lime/30 text-lime hover:bg-lime/5 hover:border-lime/50'}
              `}
            >
              Simulate_Pulse
            </button>

            <div className="space-y-4 pt-4 border-t border-white/5">
              <div className="flex justify-between text-[10px] font-mono uppercase tracking-widest">
                <span className="text-muted">Form_Consistency</span>
                <span className="text-lime">92%</span>
              </div>
              <div className="w-full h-1 bg-bg overflow-hidden border border-white/5">
                <div className="h-full bg-amber w-[92%] shadow-[0_0_5px_#F59E0B]" />
              </div>
            </div>
          </div>

          <div className="bg-red/5 border border-red/20 p-4 flex gap-4 rounded-sm">
            <AlertTriangle className="text-red shrink-0" size={16} />
            <div>
              <p className="text-[10px] font-bold text-red uppercase tracking-widest">System_Alert</p>
              <p className="text-[11px] text-red/70 mt-1 leading-tight font-mono">Hyper-trophy threshold detected. Core stabilization protocol active.</p>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes scan {
          0% { top: 0; }
          100% { top: 100%; }
        }
      `}</style>
    </div>
  );
};

export default ActiveSimulation;
