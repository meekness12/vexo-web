import React, { useEffect, useState } from 'react';
import { Brain, Cpu, Zap, Activity } from 'lucide-react';
import type { WorkoutSession } from '../utils/types';
import { analyzeWorkoutSession } from '../utils/aiService';

interface AIAnalysisProps {
  session: WorkoutSession;
}

const AIAnalysis: React.FC<AIAnalysisProps> = ({ session }) => {
  const [analysisText, setAnalysisText] = useState<string>('');
  const [isTyping, setIsTyping] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const fetchAnalysis = async () => {
      setIsTyping(true);
      setError(false);
      
      // Use env variable or placeholder
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
      
      let fullText = "";
      
      if (!apiKey) {
        // Fallback to heuristic logic if no key
        const accuracy = session.repsAttempted > 0 
          ? (session.currentReps / session.repsAttempted) * 100 
          : 100;
        
        if (accuracy >= 90) {
          fullText = "EXCEPTIONAL FORM MAINTAINED. NEURAL PATHWAYS ALIGNED. YOUR BODY MECHANICS ARE OPERATING AT PEAK EFFICIENCY. // ANALYSIS_COMPLETE";
        } else {
          fullText = "TACTICAL ADJUSTMENT REQUIRED. YOUR FORM BROKE DOWN SIGNIFICANTLY UNDER FATIGUE. FOCUS ON CORE RIGIDITY. // ANALYSIS_COMPLETE";
        }
      } else {
        fullText = await analyzeWorkoutSession(session, apiKey);
      }

      if (cancelled) return;

      let currentPos = 0;
      const interval = setInterval(() => {
        setAnalysisText(fullText.substring(0, currentPos));
        currentPos += 2;
        if (currentPos > fullText.length) {
          setIsTyping(false);
          clearInterval(interval);
        }
      }, 15);

      return () => clearInterval(interval);
    };

    fetchAnalysis();

    return () => {
      cancelled = true;
    };
  }, [session]);

  return (
    <div className="bg-bg2 border border-lime/20 p-6 rounded-sm relative overflow-hidden">
      {/* Background patterns */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-lime/5 blur-3xl rounded-full" />
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-amber/5 blur-2xl rounded-full" />

      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-lime/10 border border-lime/30 flex items-center justify-center text-lime shadow-[0_0_15px_rgba(163,230,53,0.1)]">
          <Brain size={20} />
        </div>
        <div>
          <h3 className="text-sm font-black tracking-[.3em] uppercase text-white flex items-center gap-2">
            Vexo_Neural_Analysis {isTyping && <Activity size={12} className="text-lime animate-pulse" />}
          </h3>
          <p className="text-[9px] font-mono text-muted uppercase tracking-widest">Biometric_Data_Assessment_V1.0</p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="font-mono text-[11px] leading-relaxed text-lime/90 tracking-wider">
          <span className="text-lime mr-2 opacity-50">#</span>
          {analysisText}
          {isTyping && <span className="inline-block w-1.5 h-3 bg-lime animate-pulse ml-1 align-middle" />}
        </div>

        {!isTyping && (
          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/5">
            <div className="flex items-center gap-3">
              <Cpu size={14} className="text-amber" />
              <div>
                <p className="text-[8px] font-mono text-muted uppercase">Recommended_Adjustment</p>
                <p className="text-[9px] font-bold text-white uppercase tracking-wider">Increase_Eccentric_Tempo</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Zap size={14} className="text-lime" />
              <div>
                <p className="text-[8px] font-mono text-muted uppercase">Efficiency_Rating</p>
                <p className="text-[9px] font-bold text-white uppercase tracking-wider">
                  {Math.round((session.currentReps / (session.repsAttempted || 1)) * 100)}% // Optimal
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AIAnalysis;
