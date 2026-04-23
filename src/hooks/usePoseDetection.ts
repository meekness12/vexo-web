import { useEffect, useRef, useState, useCallback } from 'react';
import { PoseLandmarker, FilesetResolver, DrawingUtils } from '@mediapipe/tasks-vision';
import { PushupDetector } from '../utils/pushupDetector';
import type { FeedbackType } from '../utils/types';

interface PoseDetectionOptions {
  onRepDetected: (type: FeedbackType, message: string) => void;
  onFormUpdate: (elbowAngle: number, hipAngle: number, phase: string) => void;
  enabled: boolean;
}

export const usePoseDetection = ({ onRepDetected, onFormUpdate, enabled }: PoseDetectionOptions) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isCalibrated, setIsCalibrated] = useState(false);

  const poseLandmarkerRef = useRef<PoseLandmarker | null>(null);
  const detectorRef = useRef(new PushupDetector());
  const animFrameRef = useRef<number>(0);
  const streamRef = useRef<MediaStream | null>(null);
  const lastTimestampRef = useRef<number>(-1);

  const cleanup = useCallback(() => {
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = 0;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop());
      streamRef.current = null;
    }
    if (poseLandmarkerRef.current) {
      poseLandmarkerRef.current.close();
      poseLandmarkerRef.current = null;
    }
    detectorRef.current.reset();
    lastTimestampRef.current = -1;
  }, []);

  useEffect(() => {
    if (!enabled) {
      cleanup();
      return;
    }

    let cancelled = false;

    const init = async () => {
      try {
        setIsLoading(true);
        setCameraError(null);

        // 1. Initialize MediaPipe
        const vision = await FilesetResolver.forVisionTasks(
          'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm'
        );

        if (cancelled) return;

        const landmarker = await PoseLandmarker.createFromOptions(vision, {
          baseOptions: {
            modelAssetPath: 'https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/1/pose_landmarker_lite.task',
            delegate: 'GPU',
          },
          runningMode: 'VIDEO',
          numPoses: 1,
          minPoseDetectionConfidence: 0.5,
          minPosePresenceConfidence: 0.5,
          minTrackingConfidence: 0.5,
        });

        if (cancelled) {
          landmarker.close();
          return;
        }

        poseLandmarkerRef.current = landmarker;

        // 2. Initialize Camera
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            width: { ideal: 1280 },
            height: { ideal: 720 },
            facingMode: 'user',
          },
          audio: false,
        });

        if (cancelled) {
          stream.getTracks().forEach(t => t.stop());
          return;
        }

        streamRef.current = stream;

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
        }

        setIsLoading(false);

        // Short calibration delay
        setTimeout(() => {
          if (!cancelled) setIsCalibrated(true);
        }, 2000);

        // 3. Start detection loop
        const detectFrame = () => {
          if (cancelled || !poseLandmarkerRef.current || !videoRef.current) return;

          const video = videoRef.current;
          if (video.readyState < 2) {
            animFrameRef.current = requestAnimationFrame(detectFrame);
            return;
          }

          const timestamp = video.currentTime * 1000;
          // Avoid duplicate timestamps
          if (timestamp <= lastTimestampRef.current) {
            animFrameRef.current = requestAnimationFrame(detectFrame);
            return;
          }
          lastTimestampRef.current = timestamp;

          try {
            const result = poseLandmarkerRef.current.detectForVideo(video, timestamp);

            // Draw on canvas
            if (canvasRef.current && result.landmarks && result.landmarks.length > 0) {
              const ctx = canvasRef.current.getContext('2d');
              if (ctx) {
                canvasRef.current.width = video.videoWidth;
                canvasRef.current.height = video.videoHeight;
                ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);

                const drawingUtils = new DrawingUtils(ctx);
                for (const landmark of result.landmarks) {
                  // Draw connections
                  drawingUtils.drawConnectors(
                    landmark,
                    PoseLandmarker.POSE_CONNECTIONS,
                    { color: 'rgba(163, 230, 53, 0.4)', lineWidth: 2 }
                  );
                  // Draw landmarks
                  drawingUtils.drawLandmarks(landmark, {
                    color: '#A3E635',
                    fillColor: 'rgba(163, 230, 53, 0.3)',
                    lineWidth: 1,
                    radius: 3,
                  });
                }

                // Run pushup detection
                const detection = detectorRef.current.detect(landmark as any);
                onFormUpdate(detection.elbowAngle, detection.hipAngle, detection.phase);

                if (detection.repCompleted && detection.formFeedback) {
                  onRepDetected(detection.formFeedback.type, detection.formFeedback.message);
                }
              }
            }
          } catch {
            // Silently skip frame errors
          }

          animFrameRef.current = requestAnimationFrame(detectFrame);
        };

        animFrameRef.current = requestAnimationFrame(detectFrame);
      } catch (err: any) {
        if (!cancelled) {
          setIsLoading(false);
          if (err.name === 'NotAllowedError') {
            setCameraError('Camera access denied. Please grant camera permissions to use Vexo.');
          } else if (err.name === 'NotFoundError') {
            setCameraError('No camera detected. Please connect a webcam.');
          } else {
            setCameraError(`Camera initialization failed: ${err.message}`);
          }
        }
      }
    };

    init();

    return () => {
      cancelled = true;
      cleanup();
    };
  }, [enabled, cleanup, onRepDetected, onFormUpdate]);

  return {
    videoRef,
    canvasRef,
    isLoading,
    isCalibrated,
    cameraError,
  };
};
