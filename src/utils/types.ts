export type ExerciseType = 'PUSHUPS' | 'PULLUPS' | 'SQUATS';

export type SessionMode = 'TARGET' | 'FREE';

export type FeedbackType = 'ok' | 'warn' | 'bad';

export interface FeedbackItem {
  id: string;
  type: FeedbackType;
  text: string;
  timestamp: string;
}

export interface WorkoutSession {
  id: string;
  exercise: ExerciseType;
  mode: SessionMode;
  targetReps: number;
  currentReps: number;
  repsAttempted: number;
  startTime: number;
  endTime?: number;
  feedback: FeedbackItem[];
  status: 'IDLE' | 'ACTIVE' | 'COMPLETED';
}

export interface PushupFormData {
  elbowAngle: number;
  hipAngle: number;
  repPhase: 'UP' | 'DOWN' | 'TRANSITIONING';
}
