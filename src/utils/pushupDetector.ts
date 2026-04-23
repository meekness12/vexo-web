/**
 * Pushup Detector — Form Analysis Engine
 * 
 * Uses MediaPipe Pose Landmarker keypoints to:
 * 1. Calculate elbow angle (shoulder → elbow → wrist)
 * 2. Calculate hip alignment (shoulder → hip → ankle)
 * 3. Track rep phases (UP → DOWN → UP = 1 valid rep)
 * 4. Validate form on each completed rep
 * 
 * MediaPipe Pose Landmark indices:
 *  11 = left shoulder,  12 = right shoulder
 *  13 = left elbow,     14 = right elbow
 *  15 = left wrist,     16 = right wrist
 *  23 = left hip,       24 = right hip
 *  25 = left knee,      26 = right knee
 *  27 = left ankle,     28 = right ankle
 */

import type { FeedbackType } from './types';

interface Landmark {
  x: number;
  y: number;
  z: number;
  visibility?: number;
}

interface DetectionResult {
  repCompleted: boolean;
  formFeedback: { type: FeedbackType; message: string } | null;
  elbowAngle: number;
  hipAngle: number;
  phase: 'UP' | 'DOWN' | 'TRANSITIONING';
}

// Thresholds
const ELBOW_UP_THRESHOLD = 155;    // Arms extended
const ELBOW_DOWN_THRESHOLD = 100;  // Arms bent at bottom
const HIP_SAG_THRESHOLD = 155;     // Hip should be roughly straight
const MIN_ASCENT_TIME_MS = 600;    // Minimum time for ascent (tempo check)
const MIN_VISIBILITY = 0.5;        // Minimum landmark visibility confidence

function calculateAngle(a: Landmark, b: Landmark, c: Landmark): number {
  const radians = Math.atan2(c.y - b.y, c.x - b.x) - Math.atan2(a.y - b.y, a.x - b.x);
  let angle = Math.abs((radians * 180) / Math.PI);
  if (angle > 180) angle = 360 - angle;
  return angle;
}

export class PushupDetector {
  private phase: 'UP' | 'DOWN' | 'TRANSITIONING' = 'UP';
  private lastDownTime: number = 0;
  private lastUpTime: number = 0;
  private repCount: number = 0;
  private consecutiveGoodReps: number = 0;
  private formViolationThisRep: string | null = null;

  reset(): void {
    this.phase = 'UP';
    this.lastDownTime = 0;
    this.lastUpTime = 0;
    this.repCount = 0;
    this.consecutiveGoodReps = 0;
    this.formViolationThisRep = null;
  }

  detect(landmarks: Landmark[]): DetectionResult {
    if (!landmarks || landmarks.length < 33) {
      return {
        repCompleted: false,
        formFeedback: null,
        elbowAngle: 0,
        hipAngle: 0,
        phase: this.phase,
      };
    }

    // Use whichever side is more visible
    const leftVis = (landmarks[13].visibility ?? 0);
    const rightVis = (landmarks[14].visibility ?? 0);

    let shoulder: Landmark, elbow: Landmark, wrist: Landmark;
    let hip: Landmark, ankle: Landmark;

    if (leftVis >= rightVis) {
      shoulder = landmarks[11];
      elbow = landmarks[13];
      wrist = landmarks[15];
      hip = landmarks[23];
      ankle = landmarks[27];
    } else {
      shoulder = landmarks[12];
      elbow = landmarks[14];
      wrist = landmarks[16];
      hip = landmarks[24];
      ankle = landmarks[28];
    }

    // Check visibility
    const minVis = Math.min(
      shoulder.visibility ?? 0,
      elbow.visibility ?? 0,
      wrist.visibility ?? 0,
      hip.visibility ?? 0,
      ankle.visibility ?? 0
    );

    if (minVis < MIN_VISIBILITY) {
      return {
        repCompleted: false,
        formFeedback: null,
        elbowAngle: 0,
        hipAngle: 0,
        phase: this.phase,
      };
    }

    const elbowAngle = calculateAngle(shoulder, elbow, wrist);
    const hipAngle = calculateAngle(shoulder, hip, ankle);
    const now = Date.now();

    let repCompleted = false;
    let formFeedback: { type: FeedbackType; message: string } | null = null;

    // --- State Machine ---
    if (this.phase === 'UP' && elbowAngle < ELBOW_DOWN_THRESHOLD) {
      // Transitioned to DOWN
      this.phase = 'DOWN';
      this.lastDownTime = now;
      this.formViolationThisRep = null;

      // Check hip sag at the bottom
      if (hipAngle < HIP_SAG_THRESHOLD) {
        this.formViolationThisRep = 'HIP_SAG';
      }
    } else if (this.phase === 'DOWN' && elbowAngle > ELBOW_UP_THRESHOLD) {
      // Transitioned back to UP — rep completed
      this.phase = 'UP';
      this.lastUpTime = now;
      repCompleted = true;
      this.repCount++;

      const ascentTime = now - this.lastDownTime;

      // Validate form
      if (this.formViolationThisRep === 'HIP_SAG') {
        formFeedback = {
          type: 'bad',
          message: `Rep void — Hip sag detected. Maintain alignment. (Hip: ${Math.round(hipAngle)}°)`,
        };
        this.consecutiveGoodReps = 0;
      } else if (ascentTime < MIN_ASCENT_TIME_MS) {
        formFeedback = {
          type: 'warn',
          message: `Tempo warning — Ascent too fast (${(ascentTime / 1000).toFixed(1)}s). Slow down.`,
        };
        this.consecutiveGoodReps = 0;
      } else {
        // Good rep
        this.consecutiveGoodReps++;
        const bonus = this.consecutiveGoodReps >= 5 ? ' +10 XP streak bonus!' : '';
        formFeedback = {
          type: 'ok',
          message: `Rep ${this.repCount} — Form validated. Depth: ${Math.round(elbowAngle)}°.${bonus}`,
        };
      }
    } else if (this.phase === 'UP' && elbowAngle < ELBOW_UP_THRESHOLD && elbowAngle >= ELBOW_DOWN_THRESHOLD) {
      // Partial depth — warn in real time
      if (elbowAngle > ELBOW_DOWN_THRESHOLD + 15) {
        // They're going down but not deep enough yet — just transitioning
      }
    }

    return {
      repCompleted,
      formFeedback,
      elbowAngle: Math.round(elbowAngle),
      hipAngle: Math.round(hipAngle),
      phase: this.phase,
    };
  }

  getRepCount(): number {
    return this.repCount;
  }

  getPhase(): 'UP' | 'DOWN' | 'TRANSITIONING' {
    return this.phase;
  }
}
