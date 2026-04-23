import React, { useState, useCallback } from 'react';
import { Camera, AlertTriangle, ChevronRight, Loader2, Infinity, Target, VideoOff, Check, ArrowRight, Move } from 'lucide-react';
import { usePoseDetection } from '../hooks/usePoseDetection';
import type { WorkoutSession, FeedbackType } from '../utils/types';

interface ActiveSimulationProps {
  session: WorkoutSession;
  onAddFeedback: (type: FeedbackType, text: string) => void;
  onEndSession: () => void;
}

const ActiveSimulation: React.FC<ActiveSimulationProps> = ({ session, onAddFeedback, onEndSession }) => {
  const [elbowAngle, setElbowAngle] = useState(0);
  const [hipAngle, setHipAngle] = useState(0);
  const [phase, setPhase] = useState('UP');
  const [guideAcknowledged, setGuideAcknowledged] = useState(false);

  const handleRepDetected = useCallback((type: FeedbackType, message: string) => {
    onAddFeedback(type, message);
  }, [onAddFeedback]);

  const handleFormUpdate = useCallback((elbow: number, hip: number, p: string) => {
    setElbowAngle(elbow);
    setHipAngle(hip);
    setPhase(p);
  }, []);

  const { videoRef, canvasRef, isLoading, isCalibrated, cameraError } = usePoseDetection({
    onRepDetected: handleRepDetected,
    onFormUpdate: handleFormUpdate,
    enabled: session.status === 'ACTIVE',
  });

  // Show the guide when the camera is ready but user hasn't acknowledged
  const showGuide = !isLoading && !guideAcknowledged;

  // Calculate accuracy
  const accuracy = session.repsAttempted > 0
    ? Math.round((session.currentReps / session.repsAttempted) * 100)
    : 100;

  // Elapsed time
  const elapsed = Math.floor((Date.now() - session.startTime) / 1000);
  const minutes = Math.floor(elapsed / 60);
  const seconds = elapsed % 60;

  if (cameraError) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center gap-8 p-8">
        <div className="w-20 h-20 bg-red/10 border border-red/30 flex items-center justify-center text-red">
          <VideoOff size={36} />
        </div>
        <div className="text-center max-w-md space-y-3">
          <h2 className="text-2xl font-black tracking-tighter uppercase text-red">Camera_Error</h2>
          <p className="text-sm font-mono text-muted leading-relaxed">{cameraError}</p>
        </div>
        <button
          onClick={onEndSession}
          className="px-8 py-3 border border-white/10 text-muted font-mono text-xs tracking-widest uppercase hover:text-white hover:border-white/20 transition-all"
        >
          Return_To_Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col gap-4">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-1 h-6 bg-lime" />
          <h1 className="text-2xl font-black tracking-tighter uppercase">Live_Session</h1>
          {session.mode === 'FREE' ? (
            <span className="ml-2 px-2 py-0.5 bg-amber/10 border border-amber/30 text-amber text-[9px] font-mono uppercase tracking-widest flex items-center gap-1">
              <Infinity size={10} /> Free_Mode
            </span>
          ) : (
            <span className="ml-2 px-2 py-0.5 bg-lime/10 border border-lime/30 text-lime text-[9px] font-mono uppercase tracking-widest flex items-center gap-1">
              <Target size={10} /> Target: {session.targetReps}
            </span>
          )}
        </div>
        <button
          onClick={onEndSession}
          className="px-4 py-2 bg-red/10 border border-red/30 text-red text-[10px] font-mono tracking-widest uppercase hover:bg-red/20 transition-all rounded-sm"
        >
          End_Session
        </button>
      </div>

      <div className="flex-1 grid grid-cols-12 gap-4 min-h-[450px]">
        {/* Camera Feed */}
        <div className="col-span-12 lg:col-span-9 relative bg-black border border-white/10 overflow-hidden rounded-sm">
          {/* Video + Canvas */}
          <video
            ref={videoRef}
            className="absolute inset-0 w-full h-full object-cover"
            playsInline
            muted
            style={{ transform: 'scaleX(-1)' }}
          />
          <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full object-cover pointer-events-none"
            style={{ transform: 'scaleX(-1)' }}
          />

          {/* Loading State */}
          {isLoading && (
            <div className="absolute inset-0 bg-bg/95 flex flex-col items-center justify-center gap-6 z-20">
              <Loader2 size={48} className="text-lime animate-spin" />
              <div className="text-center space-y-2">
                <p className="text-sm font-bold tracking-[.2em] uppercase text-white">Initializing_AI_Eye</p>
                <p className="text-[10px] font-mono text-muted uppercase tracking-widest">Loading MediaPipe Pose Landmarker...</p>
              </div>
            </div>
          )}

      {/* ═══════════════════════════════════════════════════════════════ */}
      {/* CAMERA POSITIONING GUIDE — Fixed Modal */}
      {/* ═══════════════════════════════════════════════════════════════ */}
      {showGuide && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/90 backdrop-blur-sm" />

          <div className="relative bg-bg2 border border-white/10 w-full max-w-2xl overflow-hidden rounded-sm flex flex-col max-h-[90vh]">
            {/* Top accent line */}
            <div className="h-[2px] w-full bg-gradient-to-r from-lime to-amber flex-shrink-0" />

            <div className="p-8 overflow-y-auto flex flex-col items-center">
              {/* Body Silhouette Guide */}
              <div className="relative w-48 h-48 mb-6 flex-shrink-0">
                {/* Outer scanning ring */}
                <div className="absolute inset-0 border-2 border-lime/20 rounded-lg animate-pulse" />
                {/* Corner brackets */}
                <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-lime" />
                <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-lime" />
                <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-lime" />
                <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-lime" />

                {/* Human body silhouette (SVG) */}
                <svg className="absolute inset-0 w-full h-full p-4" viewBox="0 0 100 140" fill="none" stroke="rgba(163,230,53,0.5)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="50" cy="15" r="8" />
                  <line x1="50" y1="23" x2="50" y2="30" />
                  <line x1="30" y1="35" x2="70" y2="35" />
                  <line x1="50" y1="30" x2="50" y2="75" />
                  <line x1="30" y1="35" x2="20" y2="55" />
                  <line x1="20" y1="55" x2="15" y2="75" />
                  <line x1="70" y1="35" x2="80" y2="55" />
                  <line x1="80" y1="55" x2="85" y2="75" />
                  <line x1="38" y1="75" x2="62" y2="75" />
                  <line x1="38" y1="75" x2="32" y2="105" />
                  <line x1="32" y1="105" x2="28" y2="130" />
                  <line x1="62" y1="75" x2="68" y2="105" />
                  <line x1="68" y1="105" x2="72" y2="130" />
                  <circle cx="20" cy="55" r="3" fill="rgba(245,158,11,0.4)" stroke="rgba(245,158,11,0.6)" />
                  <circle cx="80" cy="55" r="3" fill="rgba(245,158,11,0.4)" stroke="rgba(245,158,11,0.6)" />
                  <circle cx="50" cy="75" r="3" fill="rgba(245,158,11,0.4)" stroke="rgba(245,158,11,0.6)" />
                </svg>

                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-bg/90 px-3 py-1 border border-lime/30">
                  <span className="text-[8px] font-mono text-lime uppercase tracking-[.3em]">Detection_Zone</span>
                </div>
              </div>

              {/* Title */}
              <div className="text-center space-y-2 mb-8">
                <h2 className="text-2xl font-black tracking-[.2em] uppercase text-white">Camera_Calibration</h2>
                <p className="text-[10px] font-mono text-muted uppercase tracking-[.3em]">Position your device for optimal AI tracking</p>
              </div>

              {/* Instructions Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full mb-8">
                <div className="bg-surface border border-white/5 p-4 space-y-3">
                  <div className="w-8 h-8 bg-lime/10 border border-lime/30 flex items-center justify-center">
                    <span className="text-xs font-black text-lime">01</span>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-white uppercase tracking-widest">Side Angle</p>
                    <p className="text-[9px] font-mono text-muted mt-1 leading-relaxed uppercase">Profile view required for elbow/hip analysis.</p>
                  </div>
                </div>

                <div className="bg-surface border border-white/5 p-4 space-y-3">
                  <div className="w-8 h-8 bg-lime/10 border border-lime/30 flex items-center justify-center">
                    <span className="text-xs font-black text-lime">02</span>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-white uppercase tracking-widest">Full Body</p>
                    <p className="text-[9px] font-mono text-muted mt-1 leading-relaxed uppercase">Entire body head-to-toe must be in frame.</p>
                  </div>
                </div>

                <div className="bg-surface border border-white/5 p-4 space-y-3">
                  <div className="w-8 h-8 bg-amber/10 border border-amber/30 flex items-center justify-center">
                    <span className="text-xs font-black text-amber">03</span>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-white uppercase tracking-widest">Lighting</p>
                    <p className="text-[9px] font-mono text-muted mt-1 leading-relaxed uppercase">High contrast environment. Avoid backlight.</p>
                  </div>
                </div>
              </div>

              {/* Ready Button */}
              <button
                onClick={() => setGuideAcknowledged(true)}
                className="w-full bg-lime text-bg font-black tracking-[.3em] uppercase py-5 hover:bg-lime-hi transition-all shadow-[0_0_30px_rgba(163,230,53,0.3)] flex items-center justify-center gap-3 text-sm"
              >
                <Check size={18} strokeWidth={3} /> I_Am_Positioned — Initiate_Scan
              </button>
            </div>
          </div>
        </div>
      )}

          {/* HUD Overlay — only visible after guide is dismissed */}
          {!isLoading && guideAcknowledged && (
            <div className="absolute inset-0 p-6 flex flex-col justify-between pointer-events-none z-10">
              {/* Top */}
              <div className="flex justify-between items-start">
                <div className="bg-bg/80 border border-lime/30 px-4 py-2 backdrop-blur-sm">
                  <div className="flex items-center gap-2 text-lime">
                    <Camera size={12} className="animate-pulse" />
                    <span className="text-[9px] font-mono font-bold tracking-widest uppercase">{session.exercise}_AI_EYE // LIVE</span>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="bg-bg/80 border border-white/10 px-3 py-2 backdrop-blur-sm text-center">
                    <div className={`text-lg font-black ${elbowAngle > 0 && elbowAngle < 100 ? 'text-lime' : elbowAngle > 0 ? 'text-amber' : 'text-muted'}`}>
                      {elbowAngle > 0 ? `${elbowAngle}°` : '---'}
                    </div>
                    <div className="text-[7px] font-mono text-muted uppercase tracking-widest">Elbow</div>
                  </div>
                  <div className="bg-bg/80 border border-white/10 px-3 py-2 backdrop-blur-sm text-center">
                    <div className={`text-lg font-black ${hipAngle >= 155 ? 'text-lime' : hipAngle > 0 ? 'text-red' : 'text-muted'}`}>
                      {hipAngle > 0 ? `${hipAngle}°` : '---'}
                    </div>
                    <div className="text-[7px] font-mono text-muted uppercase tracking-widest">Hip</div>
                  </div>
                </div>
              </div>

              {/* Center — Big Rep Counter */}
              <div className="flex justify-center items-center">
                <div className="flex flex-col items-center bg-bg/60 backdrop-blur-sm px-8 py-4 border border-white/5">
                  <span className="text-[8rem] font-black leading-none tracking-tighter text-white drop-shadow-[0_0_20px_rgba(163,230,53,0.2)]">
                    {session.currentReps.toString().padStart(2, '0')}
                  </span>
                  <span className="text-[10px] font-mono font-bold tracking-[.6em] text-muted uppercase -mt-2 ml-[.6em]">
                    Validated_Reps
                  </span>
                  {session.mode === 'TARGET' && (
                    <div className="mt-2 w-32 h-1 bg-surface overflow-hidden">
                      <div
                        className="h-full bg-lime shadow-[0_0_8px_#A3E635] transition-all duration-300"
                        style={{ width: `${Math.min(100, (session.currentReps / session.targetReps) * 100)}%` }}
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Bottom */}
              <div className="flex justify-between items-end text-[8px] font-mono text-muted tracking-widest uppercase">
                <div className="flex gap-4">
                  <span className="flex items-center gap-1.5">
                    <span className={`w-1.5 h-1.5 rounded-full ${phase === 'DOWN' ? 'bg-amber animate-pulse' : 'bg-lime'}`} />
                    Phase: {phase}
                  </span>
                  <span>Accuracy: <span className={accuracy >= 80 ? 'text-lime' : 'text-amber'}>{accuracy}%</span></span>
                </div>
                <span className="bg-bg/80 px-2 py-1 border border-white/5">{minutes}:{seconds.toString().padStart(2, '0')}</span>
              </div>
            </div>
          )}
        </div>

        {/* Side Panel */}
        <div className="col-span-12 lg:col-span-3 flex flex-col gap-4 max-h-[calc(100vh-220px)]">
          {/* Feedback Log */}
          <div className="bg-surface border border-white/10 p-4 flex-1 overflow-hidden flex flex-col rounded-sm">
            <h3 className="text-[9px] font-bold tracking-[.2em] text-muted uppercase flex items-center gap-2 mb-3 flex-shrink-0">
              <ChevronRight size={10} className="text-lime" /> Live_Feedback
            </h3>
            <div className="flex-1 overflow-y-auto space-y-2 pr-1" style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(163,230,53,0.2) transparent' }}>
              {session.feedback.map((item) => (
                <div key={item.id} className={`p-2 border-l-2 text-[9px] font-mono ${
                  item.type === 'ok' ? 'bg-lime/5 border-lime text-lime' :
                  item.type === 'warn' ? 'bg-amber/5 border-amber text-amber' :
                  'bg-red/5 border-red text-red'
                }`}>
                  <div className="flex justify-between opacity-50 mb-0.5">
                    <span>{item.type.toUpperCase()}</span>
                    <span>{item.timestamp}</span>
                  </div>
                  <p className="leading-snug tracking-wider">{item.text}</p>
                </div>
              ))}
              {session.feedback.length === 0 && (
                <p className="text-[9px] text-muted font-mono uppercase tracking-widest text-center py-8">
                  {isLoading ? 'Loading AI...' : !guideAcknowledged ? 'Follow the setup guide...' : 'Begin exercise — AI is watching'}
                </p>
              )}
            </div>
          </div>

          {/* Alert */}
          {session.feedback.filter(f => f.type === 'bad').length > 3 && (
            <div className="bg-red/5 border border-red/20 p-3 flex gap-3 rounded-sm flex-shrink-0">
              <AlertTriangle className="text-red shrink-0" size={14} />
              <div>
                <p className="text-[9px] font-bold text-red uppercase tracking-widest">Form_Alert</p>
                <p className="text-[9px] text-red/70 mt-0.5 leading-tight font-mono">Multiple rejected reps. Check your form.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ActiveSimulation;
