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

// Thresholds — Tightened for precision
const ELBOW_UP_THRESHOLD = 165;    // Must nearly lock out to complete
const ELBOW_DOWN_THRESHOLD = 90;   // Must reach significant depth
const PARTIAL_REP_THRESHOLD = 130; // Threshold to even consider it a "rep attempt"
const HIP_SAG_THRESHOLD = 150;     // Hip should be roughly straight
const MIN_ASCENT_TIME_MS = 500;    // Minimum time for ascent
const MIN_VISIBILITY = 0.5;        // Increased for better reliability
const SHOULDER_MOVEMENT_THRESHOLD = 0.05; // Minimum vertical movement of shoulders

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
  private maxDepthThisRep: number = 180;
  private startShoulderY: number = 0;
  private maxShoulderY: number = 0;
  
  // Smoothing buffers
  private elbowBuffer: number[] = [];
  private hipBuffer: number[] = [];
  private readonly BUFFER_SIZE = 5; // Increased for more stability

  private smoothAngle(angle: number, buffer: number[]): number {
    buffer.push(angle);
    if (buffer.length > this.BUFFER_SIZE) buffer.shift();
    return buffer.reduce((a, b) => a + b, 0) / buffer.length;
  }

  reset(): void {
    this.phase = 'UP';
    this.lastDownTime = 0;
    this.lastUpTime = 0;
    this.repCount = 0;
    this.consecutiveGoodReps = 0;
    this.formViolationThisRep = null;
    this.maxDepthThisRep = 180;
    this.elbowBuffer = [];
    this.hipBuffer = [];
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

    // Check visibility with some leeway
    const importantJoints = [shoulder, elbow, wrist, hip];
    const avgVis = importantJoints.reduce((acc, j) => acc + (j.visibility ?? 0), 0) / importantJoints.length;

    if (avgVis < MIN_VISIBILITY) {
      return {
        repCompleted: false,
        formFeedback: null,
        elbowAngle: 0,
        hipAngle: 0,
        phase: this.phase,
      };
    }

    const rawElbowAngle = calculateAngle(shoulder, elbow, wrist);
    const rawHipAngle = calculateAngle(shoulder, hip, ankle);
    
    const elbowAngle = this.smoothAngle(rawElbowAngle, this.elbowBuffer);
    const hipAngle = this.smoothAngle(rawHipAngle, this.hipBuffer);

    const now = Date.now();

    let repCompleted = false;
    let formFeedback: { type: FeedbackType; message: string } | null = null;

    // Track maximum depth reached in this rep
    if (this.phase === 'DOWN') {
      this.maxDepthThisRep = Math.min(this.maxDepthThisRep, elbowAngle);
    }

    // --- State Machine ---
    if (this.phase === 'UP' && elbowAngle < ELBOW_UP_THRESHOLD - 10) {
      // Starting descent
      this.phase = 'TRANSITIONING';
      this.formViolationThisRep = null;
      this.maxDepthThisRep = 180;
      this.startShoulderY = shoulder.y;
      this.maxShoulderY = shoulder.y;
    } else if (this.phase === 'TRANSITIONING' || this.phase === 'DOWN') {
      // Track vertical range
      this.maxShoulderY = Math.max(this.maxShoulderY, shoulder.y);
      
      if (this.phase === 'TRANSITIONING' && elbowAngle < ELBOW_DOWN_THRESHOLD) {
        this.phase = 'DOWN';
        this.lastDownTime = now;
        
        // Check hip sag early
        if (hipAngle < HIP_SAG_THRESHOLD) {
          this.formViolationThisRep = 'HIP_SAG';
        }
      }
    }
    
    if ((this.phase === 'DOWN' || this.phase === 'TRANSITIONING') && elbowAngle > ELBOW_UP_THRESHOLD) {
      // Returned to UP position
      const shoulderDisplacement = Math.abs(this.maxShoulderY - this.startShoulderY);
      const wasDescending = (this.phase === 'DOWN' || this.maxDepthThisRep < PARTIAL_REP_THRESHOLD) && 
                           shoulderDisplacement > SHOULDER_MOVEMENT_THRESHOLD;
      
      if (wasDescending) {
        repCompleted = true;
        this.repCount++;
        const ascentTime = now - this.lastDownTime;

        // Validate form
        if (this.maxDepthThisRep > ELBOW_DOWN_THRESHOLD) {
          formFeedback = {
            type: 'bad',
            message: `Void — Insufficient depth. You only reached ${Math.round(this.maxDepthThisRep)}°.`,
          };
          this.consecutiveGoodReps = 0;
        } else if (this.formViolationThisRep === 'HIP_SAG') {
          formFeedback = {
            type: 'bad',
            message: `Void — Hip sag detected. Keep your core tight.`,
          };
          this.consecutiveGoodReps = 0;
        } else {
          // Good rep
          this.consecutiveGoodReps++;
          const streak = this.consecutiveGoodReps >= 3 ? ` [STREAK: ${this.consecutiveGoodReps}]` : '';
          formFeedback = {
            type: 'ok',
            message: `Rep ${this.repCount} validated.${streak}`,
          };
        }
      }
      
      this.phase = 'UP';
      this.maxDepthThisRep = 180;
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
