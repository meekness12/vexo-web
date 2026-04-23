import { useState, useCallback } from 'react';
import type { WorkoutSession, ExerciseType, FeedbackItem, FeedbackType, SessionMode } from '../utils/types';

const createDefaultSession = (): WorkoutSession => ({
  id: '',
  exercise: 'PUSHUPS',
  mode: 'TARGET',
  targetReps: 0,
  currentReps: 0,
  repsAttempted: 0,
  startTime: 0,
  feedback: [],
  status: 'IDLE',
});

export const useSession = () => {
  const [session, setSession] = useState<WorkoutSession>(createDefaultSession());

  const startSession = useCallback((exercise: ExerciseType, target: number, mode: SessionMode) => {
    setSession({
      id: `VX_${Date.now()}`,
      exercise,
      mode,
      targetReps: target,
      currentReps: 0,
      repsAttempted: 0,
      startTime: Date.now(),
      feedback: [],
      status: 'ACTIVE',
    });
  }, []);

  const addFeedback = useCallback((type: FeedbackType, text: string) => {
    const newItem: FeedbackItem = {
      id: Math.random().toString(36).substr(2, 9),
      type,
      text,
      timestamp: new Date().toLocaleTimeString([], { hour12: false }),
    };

    setSession(prev => {
      const updated = {
        ...prev,
        feedback: [newItem, ...prev.feedback].slice(0, 50),
        repsAttempted: prev.repsAttempted + 1,
      };

      if (type === 'ok') {
        updated.currentReps = prev.currentReps + 1;
      }

      // Auto-end in TARGET mode
      if (updated.mode === 'TARGET' && updated.currentReps >= updated.targetReps && updated.targetReps > 0) {
        updated.status = 'COMPLETED';
        updated.endTime = Date.now();
      }

      return updated;
    });
  }, []);

  const endSession = useCallback(() => {
    setSession(prev => ({
      ...prev,
      status: 'COMPLETED',
      endTime: Date.now(),
    }));
  }, []);

  const resetSession = useCallback(() => {
    setSession(createDefaultSession());
  }, []);

  return {
    session,
    startSession,
    addFeedback,
    endSession,
    resetSession,
  };
};
