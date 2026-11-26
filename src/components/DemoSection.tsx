import { useEffect, useRef, useState, useCallback } from 'react';
import type * as CocoSsdModule from '@tensorflow-models/coco-ssd';
import {
  Camera,
  CameraOff,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Square,
  Vibrate,
  AlertTriangle,
  Sparkles,
  CheckCircle2,
  ShieldCheck,
  Loader2,
  SlidersHorizontal,
} from 'lucide-react';
import { DirectionZone, GUIDED_SCENARIOS, GuidedScenario } from '../data/projectData';
import {
  isSpeechSynthesisSupported,
  isVibrationSupported,
  isWebAudioSupported,
  playDirectionalAudioCue,
  speakText,
  stopSpeech,
  triggerVibration,
} from '../utils/feedback';

type DemoMode = 'webcam' | 'simulation';
type CameraState = 'idle' | 'requesting' | 'active' | 'denied' | 'unsupported' | 'error';
type ModelState = 'idle' | 'loading' | 'ready' | 'error';

interface LiveDetectionItem {
  id: string;
  label: string;
  rawClass: string;
  score: number;
  direction: DirectionZone;
  directionPhrase: string;
  framingNote: string;
  bbox: [number, number, number, number];
}

function formatObjectLabel(raw: string): string {
  return raw.charAt(0).toUpperCase() + raw.slice(1);
}

function getHorizontalDirection(
  bbox: [number, number, number, number],
  frameWidth: number
): { zone: DirectionZone; phrase: string } {
  const centerX = bbox[0] + bbox[2] / 2;
  const ratio = frameWidth > 0 ? centerX / frameWidth : 0.5;
  if (ratio < 0.35) {
    return { zone: 'Left', phrase: 'left side of camera view' };
  }
  if (ratio > 0.65) {
    return { zone: 'Right', phrase: 'right side of camera view' };
  }
  return { zone: 'Centre', phrase: 'centre of camera view' };
}

function getFramingNote(
  bbox: [number, number, number, number],
  frameWidth: number,
  frameHeight: number
): string {
  const frameArea = Math.max(1, frameWidth * frameHeight);
  const boxArea = Math.max(0, bbox[2] * bbox[3]);
  const ratio = boxArea / frameArea;
  if (ratio >= 0.22) return 'Prominent in camera frame (2D box area)';
  if (ratio >= 0.07) return 'Moderate in camera frame (2D box area)';
  return 'Smaller in camera frame (2D box area)';
}

function buildLiveSpeechPhrase(item: LiveDetectionItem): string {
  if (item.direction === 'Centre') {
    return `${item.label} detected in centre of camera view.`;
  }
  return `${item.label} detected on ${item.directionPhrase}.`;
}

function DirectionVisualBar({ direction }: { direction: DirectionZone }) {
  const zones: DirectionZone[] = ['Left', 'Centre', 'Right'];
  return (
    <div className="mt-2">
      <div
        className="grid grid-cols-3 gap-2"
        role="img"
        aria-label={`Horizontal camera view indicator: ${direction}`}
      >
        {zones.map((zone) => {
          const active = direction === zone;
          return (
            <div
              key={zone}
              className={`rounded-xl border px-3 py-2 text-center font-mono text-xs transition ${
                active
                  ? 'border-cyan-400/60 bg-cyan-500/20 font-semibold text-cyan-100 shadow-[0_0_16px_-4px_rgba(34,211,238,0.45)]'
                  : 'border-white/10 bg-white/[0.02] text-slate-500'
              }`}
            >
              {zone}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function SimulatedViewport({ scenario }: { scenario: GuidedScenario }) {
  const boxPlacement =
    scenario.direction === 'Left'
      ? { x: 46, w: 120 }
      : scenario.direction === 'Right'
        ? { x: 314, w: 120 }
        : { x: 175, w: 130 };

  const strokeColor = scenario.isHazard ? '#f59e0b' : '#22d3ee';
  const fillColor = scenario.isHazard ? 'rgba(245, 158, 11, 0.12)' : 'rgba(34, 211, 238, 0.1)';
  const labelBg = scenario.isHazard ? '#d97706' : '#0891b2';

  return (
    <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#05080e]">
      <div className="flex items-center justify-between border-b border-white/[0.08] bg-white/[0.02] px-4 py-2.5">
        <span className="font-mono text-[11px] uppercase tracking-wider text-teal-300">
          GUIDED SIMULATION — PREDEFINED EXAMPLE
        </span>
        <span className="rounded-full border border-white/10 bg-white/[0.05] px-2 py-0.5 font-mono text-[10px] text-slate-300">
          No Live AI
        </span>
      </div>

      <div className="relative aspect-video w-full p-3">
        <svg
          viewBox="0 0 480 270"
          role="img"
          aria-label={`Simulated camera view showing ${scenario.objectName} at ${scenario.direction}`}
          className="h-full w-full rounded-xl bg-[#070c14]"
        >
          {/* Zone divider guides */}
          <line x1="168" y1="0" x2="168" y2="270" stroke="rgba(148,163,184,0.14)" strokeDasharray="4 4" />
          <line x1="312" y1="0" x2="312" y2="270" stroke="rgba(148,163,184,0.14)" strokeDasharray="4 4" />
          <text x="20" y="22" fill="#64748b" fontSize="10" fontFamily="JetBrains Mono, monospace">
            LEFT ZONE
          </text>
          <text x="205" y="22" fill="#64748b" fontSize="10" fontFamily="JetBrains Mono, monospace">
            CENTRE
          </text>
          <text x="382" y="22" fill="#64748b" fontSize="10" fontFamily="JetBrains Mono, monospace">
            RIGHT ZONE
          </text>

          {/* Subtle room perspective */}
          <line x1="20" y1="226" x2="460" y2="226" stroke="rgba(148,163,184,0.16)" strokeWidth="1" />

          {/* Scenario shape */}
          {scenario.sceneType === 'person' && (
            <g transform="translate(212, 62)">
              <circle cx="28" cy="24" r="16" fill="#1e293b" stroke="#64748b" strokeWidth="1.5" />
              <path
                d="M6,58 C6,45 50,45 50,58 L54,122 L2,122 Z"
                fill="#1e293b"
                stroke="#64748b"
                strokeWidth="1.5"
              />
              <line x1="18" y1="122" x2="16" y2="168" stroke="#64748b" strokeWidth="6" strokeLinecap="round" />
              <line x1="38" y1="122" x2="40" y2="168" stroke="#64748b" strokeWidth="6" strokeLinecap="round" />
            </g>
          )}

          {scenario.sceneType === 'chair' && (
            <g transform="translate(68, 108)">
              <rect x="14" y="16" width="46" height="54" rx="4" fill="#1e293b" stroke="#64748b" strokeWidth="1.5" />
              <rect x="10" y="66" width="54" height="12" rx="3" fill="#334155" />
              <line x1="18" y1="78" x2="18" y2="112" stroke="#64748b" strokeWidth="4" />
              <line x1="56" y1="78" x2="56" y2="112" stroke="#64748b" strokeWidth="4" />
            </g>
          )}

          {scenario.sceneType === 'obstacle' && (
            <g transform="translate(332, 92)">
              <rect x="14" y="20" width="56" height="106" rx="8" fill="#1e293b" stroke="#64748b" strokeWidth="1.8" />
              <line x1="26" y1="44" x2="58" y2="44" stroke="#475569" strokeWidth="3" />
              <line x1="26" y1="68" x2="58" y2="68" stroke="#475569" strokeWidth="3" />
            </g>
          )}

          {scenario.sceneType === 'door' && (
            <g transform="translate(196, 56)">
              <rect x="8" y="8" width="72" height="156" rx="3" fill="#111b2a" stroke="#64748b" strokeWidth="2" />
              <circle cx="68" cy="92" r="4" fill="#94a3b8" />
            </g>
          )}

          {scenario.sceneType === 'stairs' && (
            <g transform="translate(178, 86)">
              <rect x="12" y="16" width="102" height="16" rx="2" fill="#334155" stroke="#94a3b8" strokeWidth="1" />
              <rect x="20" y="40" width="86" height="16" rx="2" fill="#273447" stroke="#94a3b8" strokeWidth="1" />
              <rect x="28" y="64" width="70" height="16" rx="2" fill="#1e293b" stroke="#94a3b8" strokeWidth="1" />
              <rect x="36" y="88" width="54" height="16" rx="2" fill="#162030" stroke="#94a3b8" strokeWidth="1" />
              <rect x="44" y="112" width="38" height="14" rx="2" fill="#0f172a" stroke="#94a3b8" strokeWidth="1" />
            </g>
          )}

          {/* Simulated Bounding Box */}
          <rect
            x={boxPlacement.x}
            y={52}
            width={boxPlacement.w}
            height={176}
            rx="8"
            fill={fillColor}
            stroke={strokeColor}
            strokeWidth="2.2"
          />
          <rect x={boxPlacement.x} y={30} width={Math.max(boxPlacement.w, 148)} height="22" rx="4" fill={labelBg} />
          <text
            x={boxPlacement.x + 8}
            y={45}
            fill="#ffffff"
            fontSize="10.5"
            fontWeight="600"
            fontFamily="JetBrains Mono, monospace"
          >
            {scenario.objectName} · {scenario.direction}
          </text>
        </svg>
      </div>
    </div>
  );
}

export function DemoSection() {
  const [mode, setMode] = useState<DemoMode>('webcam');

  // Shared browser capability feedback status
  const [actionStatus, setActionStatus] = useState<string>(
    'Ready. Start the camera for real-time COCO-SSD detection or switch to Guided Simulation.'
  );
  const [vibrationNotice, setVibrationNotice] = useState<string | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Mode 1: Webcam + TensorFlow.js COCO-SSD state
  const [cameraState, setCameraState] = useState<CameraState>('idle');
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [modelState, setModelState] = useState<ModelState>('idle');
  const [modelError, setModelError] = useState<string | null>(null);
  const [detectionActive, setDetectionActive] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const [audioCueAuto, setAudioCueAuto] = useState(false);
  const [confidenceThreshold, setConfidenceThreshold] = useState(0.55);
  const [detections, setDetections] = useState<LiveDetectionItem[]>([]);

  // Mode 2: Guided Simulation state
  const [selectedScenarioId, setSelectedScenarioId] = useState<string>(GUIDED_SCENARIOS[0].id);

  // Refs for video, canvas, stream, model, inference loop, speech cooldown
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const modelRef = useRef<CocoSsdModule.ObjectDetection | null>(null);
  const inferringRef = useRef(false);
  const lastSpokenRef = useRef<{ key: string; timestamp: number }>({ key: '', timestamp: 0 });
  const voiceEnabledRef = useRef(voiceEnabled);
  const audioCueAutoRef = useRef(audioCueAuto);
  const thresholdRef = useRef(confidenceThreshold);

  useEffect(() => {
    voiceEnabledRef.current = voiceEnabled;
  }, [voiceEnabled]);

  useEffect(() => {
    audioCueAutoRef.current = audioCueAuto;
  }, [audioCueAuto]);

  useEffect(() => {
    thresholdRef.current = confidenceThreshold;
  }, [confidenceThreshold]);

  const selectedScenario =
    GUIDED_SCENARIOS.find((s) => s.id === selectedScenarioId) ?? GUIDED_SCENARIOS[0];

  const clearOverlayCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  }, []);

  const stopCameraTracks = useCallback(() => {
    setDetectionActive(false);
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    clearOverlayCanvas();
    setDetections([]);
    setCameraState('idle');
    stopSpeech();
    setIsSpeaking(false);
  }, [clearOverlayCanvas]);

  // Ensure camera & speech cleanly stop on unmount
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
      stopSpeech();
    };
  }, []);

  // Switch modes cleanly
  const handleModeChange = (nextMode: DemoMode) => {
    if (nextMode === mode) return;
    stopSpeech();
    setIsSpeaking(false);
    setVibrationNotice(null);
    if (nextMode === 'simulation' && cameraState === 'active') {
      stopCameraTracks();
      setActionStatus('Switched to Guided Simulation. Webcam tracks were stopped.');
    } else if (nextMode === 'webcam') {
      setActionStatus('Live Webcam Detection mode selected. Click Start Camera to begin.');
    }
    setMode(nextMode);
  };

  const handleStartCamera = async () => {
    setCameraError(null);
    if (
      typeof navigator === 'undefined' ||
      !navigator.mediaDevices ||
      typeof navigator.mediaDevices.getUserMedia !== 'function'
    ) {
      setCameraState('unsupported');
      setCameraError(
        'Camera access (navigator.mediaDevices.getUserMedia) is not supported in this browser or requires a secure context (HTTPS / localhost).'
      );
      return;
    }

    setCameraState('requesting');
    setActionStatus('Requesting webcam permission...');

    try {
      let stream: MediaStream;
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: { ideal: 'environment' }, width: { ideal: 1280 }, height: { ideal: 720 } },
          audio: false,
        });
      } catch {
        // Fallback if specific constraints fail on some laptop webcams
        stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
      }

      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play().catch(() => undefined);
      }

      setCameraState('active');
      setActionStatus(
        'Camera preview active. Click "Enable Object Detection" to load COCO-SSD and detect objects locally.'
      );
    } catch (err) {
      const domErr = err as DOMException | undefined;
      if (domErr?.name === 'NotAllowedError' || domErr?.name === 'PermissionDeniedError') {
        setCameraState('denied');
        setCameraError(
          'Camera permission was denied. Please allow camera access in your browser settings or use Guided Simulation.'
        );
      } else if (domErr?.name === 'NotFoundError' || domErr?.name === 'DevicesNotFoundError') {
        setCameraState('error');
        setCameraError('No webcam device was found on this system. Try Guided Simulation instead.');
      } else {
        setCameraState('error');
        setCameraError(
          'Unable to access webcam. Ensure no other app is locking the camera, or switch to Guided Simulation.'
        );
      }
      setActionStatus('Camera could not be started. Guided Simulation remains available.');
    }
  };

  const loadCocoSsdModel = useCallback(async (): Promise<CocoSsdModule.ObjectDetection | null> => {
    if (modelRef.current) {
      setModelState('ready');
      return modelRef.current;
    }

    setModelState('loading');
    setModelError(null);
    setActionStatus('Loading TensorFlow.js and COCO-SSD model in the browser...');

    try {
      const tf = await import('@tensorflow/tfjs');
      try {
        await tf.setBackend('webgl');
      } catch {
        await tf.setBackend('cpu');
      }
      await tf.ready();

      const cocoSsd = await import('@tensorflow-models/coco-ssd');
      const loadedModel = await cocoSsd.load({ base: 'lite_mobilenet_v2' });
      modelRef.current = loadedModel;
      setModelState('ready');
      setActionStatus('COCO-SSD model loaded locally. Running real-time detection.');
      return loadedModel;
    } catch {
      setModelState('error');
      setModelError(
        'Failed to load the TensorFlow.js COCO-SSD model. Check your internet connection for initial model weights download, or use Guided Simulation.'
      );
      setActionStatus('Model failed to load. You can retry or switch to Guided Simulation.');
      return null;
    }
  }, []);

  const handleEnableDetection = async () => {
    if (cameraState !== 'active') return;
    const model = await loadCocoSsdModel();
    if (model) {
      setDetectionActive(true);
    }
  };

  const handlePauseDetection = () => {
    setDetectionActive(false);
    clearOverlayCanvas();
    setDetections([]);
    stopSpeech();
    setIsSpeaking(false);
    setActionStatus('Object detection paused. Showing live camera preview only.');
  };

  const handleResumeDetection = async () => {
    if (cameraState !== 'active') return;
    if (!modelRef.current) {
      await handleEnableDetection();
      return;
    }
    setDetectionActive(true);
    setActionStatus('Object detection resumed.');
  };

  // Throttled inference loop (~3.3 FPS) when camera & detection are active
  useEffect(() => {
    if (mode !== 'webcam' || cameraState !== 'active' || !detectionActive) {
      return;
    }

    const drawBoxes = (
      items: LiveDetectionItem[],
      videoWidth: number,
      videoHeight: number
    ) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      if (canvas.width !== videoWidth || canvas.height !== videoHeight) {
        canvas.width = videoWidth;
        canvas.height = videoHeight;
      }
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Subtle vertical zone guides (Left / Centre / Right)
      ctx.save();
      ctx.strokeStyle = 'rgba(148, 163, 184, 0.22)';
      ctx.setLineDash([6, 6]);
      ctx.lineWidth = 1;
      const leftBound = videoWidth * 0.35;
      const rightBound = videoWidth * 0.65;
      ctx.beginPath();
      ctx.moveTo(leftBound, 0);
      ctx.lineTo(leftBound, videoHeight);
      ctx.moveTo(rightBound, 0);
      ctx.lineTo(rightBound, videoHeight);
      ctx.stroke();
      ctx.restore();

      items.forEach((item, index) => {
        const [x, y, w, h] = item.bbox;
        const isPrimary = index === 0;
        const stroke = isPrimary ? '#22d3ee' : '#2dd4bf';

        ctx.strokeStyle = stroke;
        ctx.lineWidth = isPrimary ? 3 : 2;
        ctx.strokeRect(x, y, w, h);

        ctx.fillStyle = isPrimary ? 'rgba(34, 211, 238, 0.08)' : 'rgba(45, 212, 191, 0.05)';
        ctx.fillRect(x, y, w, h);

        const labelText = `${item.label} ${Math.round(item.score * 100)}% · ${item.direction}`;
        ctx.font = '600 13px Inter, system-ui, sans-serif';
        const textWidth = ctx.measureText(labelText).width;
        const badgeHeight = 22;
        const badgeY = y > badgeHeight + 4 ? y - badgeHeight : y + 2;

        ctx.fillStyle = isPrimary ? '#0891b2' : '#0f766e';
        ctx.fillRect(x, badgeY, textWidth + 14, badgeHeight);

        ctx.fillStyle = '#ffffff';
        ctx.fillText(labelText, x + 7, badgeY + 15);
      });
    };

    const runStep = async () => {
      if (inferringRef.current) return;
      const video = videoRef.current;
      const model = modelRef.current;
      if (!video || !model || video.readyState < 2 || video.videoWidth === 0) return;

      inferringRef.current = true;
      try {
        const predictions = await model.detect(video, 8, thresholdRef.current);
        const frameWidth = video.videoWidth;
        const frameHeight = video.videoHeight;

        const mapped: LiveDetectionItem[] = predictions
          .filter((p) => p.score >= thresholdRef.current)
          .map((pred, idx) => {
            const bbox = pred.bbox as [number, number, number, number];
            const dir = getHorizontalDirection(bbox, frameWidth);
            return {
              id: `${pred.class}-${idx}-${Math.round(bbox[0])}`,
              label: formatObjectLabel(pred.class),
              rawClass: pred.class,
              score: pred.score,
              direction: dir.zone,
              directionPhrase: dir.phrase,
              framingNote: getFramingNote(bbox, frameWidth, frameHeight),
              bbox,
            };
          })
          // Prioritise centre/larger objects weighted with confidence
          .sort((a, b) => {
            const areaA = a.bbox[2] * a.bbox[3];
            const areaB = b.bbox[2] * b.bbox[3];
            const centreBonusA = a.direction === 'Centre' ? 1.15 : 1;
            const centreBonusB = b.direction === 'Centre' ? 1.15 : 1;
            return areaB * b.score * centreBonusB - areaA * a.score * centreBonusA;
          });

        setDetections(mapped);
        drawBoxes(mapped, frameWidth, frameHeight);

        if (mapped.length > 0) {
          const primary = mapped[0];
          const key = `${primary.rawClass}:${primary.direction}`;
          const now = Date.now();
          const elapsed = now - lastSpokenRef.current.timestamp;
          const isChanged = lastSpokenRef.current.key !== key;

          if ((isChanged && elapsed >= 2200) || (!isChanged && elapsed >= 5500)) {
            if (voiceEnabledRef.current) {
              const phrase = buildLiveSpeechPhrase(primary);
              speakText(phrase, {
                onStart: () => setIsSpeaking(true),
                onEnd: () => setIsSpeaking(false),
                onError: () => setIsSpeaking(false),
              });
              lastSpokenRef.current = { key, timestamp: now };
            }
            if (audioCueAutoRef.current) {
              playDirectionalAudioCue({
                direction: primary.direction,
                pulseCount: 1,
                pitchHz: primary.direction === 'Centre' ? 540 : 460,
              });
              if (!voiceEnabledRef.current) {
                lastSpokenRef.current = { key, timestamp: now };
              }
            }
          }
        }
      } catch {
        // Ignore transient frame inference errors
      } finally {
        inferringRef.current = false;
      }
    };

    const intervalId = window.setInterval(() => {
      void runStep();
    }, 300);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [mode, cameraState, detectionActive]);

  const primaryDetection = detections[0] ?? null;

  const handlePlayVoiceFeedback = () => {
    if (!isSpeechSynthesisSupported()) {
      setActionStatus('Web Speech API (speechSynthesis) is not supported in this browser.');
      return;
    }

    if (mode === 'simulation') {
      speakText(selectedScenario.voiceFeedback, {
        onStart: () => setIsSpeaking(true),
        onEnd: () => setIsSpeaking(false),
        onError: () => setIsSpeaking(false),
      });
      setActionStatus(`Speaking simulated feedback: "${selectedScenario.voiceFeedback}"`);
    } else if (primaryDetection) {
      const phrase = buildLiveSpeechPhrase(primaryDetection);
      speakText(phrase, {
        onStart: () => setIsSpeaking(true),
        onEnd: () => setIsSpeaking(false),
        onError: () => setIsSpeaking(false),
      });
      setActionStatus(`Speaking detection: "${phrase}"`);
    } else {
      setActionStatus('No detected object to speak yet. Point the webcam at an object.');
    }
  };

  const handleStopSpeech = () => {
    stopSpeech();
    setIsSpeaking(false);
    setActionStatus('Speech stopped.');
  };

  const handlePlayAudioCue = () => {
    if (!isWebAudioSupported()) {
      setActionStatus('Web Audio API is not supported in this browser.');
      return;
    }

    if (mode === 'simulation') {
      const res = playDirectionalAudioCue({
        direction: selectedScenario.direction,
        pulseCount: selectedScenario.pulseCount,
        pulseIntervalMs: selectedScenario.pulseIntervalMs,
        pitchHz: selectedScenario.pitchHz,
      });
      setActionStatus(
        res.stereoSupported
          ? `Played ${selectedScenario.direction.toLowerCase()} directional stereo cue (${selectedScenario.pulseCount} pulse${selectedScenario.pulseCount > 1 ? 's' : ''}).`
          : 'Played audio pulse cue (stereo panning unavailable in this browser).'
      );
    } else {
      const targetDir: DirectionZone = primaryDetection?.direction ?? 'Centre';
      const res = playDirectionalAudioCue({
        direction: targetDir,
        pulseCount: targetDir === 'Centre' ? 2 : 1,
        pulseIntervalMs: 145,
        pitchHz: targetDir === 'Centre' ? 540 : 460,
      });
      setActionStatus(
        res.stereoSupported
          ? `Played ${targetDir.toLowerCase()} stereo audio cue${primaryDetection ? ` for ${primaryDetection.label}` : ''}.`
          : 'Played audio cue (stereo panning unavailable).'
      );
    }
  };

  const handleTestVibration = () => {
    const pattern = mode === 'simulation' ? selectedScenario.vibratePattern : [120, 70, 120];
    if (!isVibrationSupported()) {
      setVibrationNotice(
        'Vibration API (navigator.vibrate) is not supported on this browser or desktop device. On compatible mobile browsers, this triggers tactile pulse patterns.'
      );
      setActionStatus('Vibration unsupported on this device; fallback message shown.');
      return;
    }

    const res = triggerVibration(pattern);
    if (res.triggered) {
      setVibrationNotice(
        `Triggered haptic pulse pattern (${pattern.join(' ms, ')} ms). Note: desktop hardware may ignore vibration requests even when the API exists.`
      );
      setActionStatus('Haptic vibration test triggered.');
    } else {
      setVibrationNotice(
        'Vibration request was blocked or unsupported by this device hardware.'
      );
    }
  };

  return (
    <section
      id="demo"
      aria-labelledby="demo-heading"
      className="border-b border-white/[0.06] py-20 sm:py-24"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header + Mode Tabs */}
        <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <div className="max-w-3xl">
            <p className="font-mono text-xs uppercase tracking-widest text-cyan-300">
              04 · Interactive SecondSense Demonstration
            </p>
            <h2
              id="demo-heading"
              className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-4xl"
            >
              Experience real-time webcam AI detection &amp; guided simulation.
            </h2>
            <p className="mt-3 text-base leading-relaxed text-slate-300">
              Switch between live browser-based COCO-SSD webcam detection and predefined assistive
              mobility scenarios with speech, directional stereo audio, and haptic testing.
            </p>
          </div>

          <div
            role="tablist"
            aria-label="Demonstration mode selector"
            className="inline-flex rounded-2xl border border-white/10 bg-white/[0.03] p-1.5"
          >
            <button
              type="button"
              role="tab"
              id="tab-webcam"
              aria-selected={mode === 'webcam'}
              aria-controls="panel-demo-dashboard"
              onClick={() => handleModeChange('webcam')}
              className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 sm:text-sm ${
                mode === 'webcam'
                  ? 'bg-cyan-400 text-slate-950 shadow-sm'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <Camera className="h-4 w-4" aria-hidden="true" />
              Live Webcam AI
            </button>
            <button
              type="button"
              role="tab"
              id="tab-simulation"
              aria-selected={mode === 'simulation'}
              aria-controls="panel-demo-dashboard"
              onClick={() => handleModeChange('simulation')}
              className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 sm:text-sm ${
                mode === 'simulation'
                  ? 'bg-cyan-400 text-slate-950 shadow-sm'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <Sparkles className="h-4 w-4" aria-hidden="true" />
              Guided Simulation
            </button>
          </div>
        </div>

        {/* Mode Notice Banner */}
        {mode === 'webcam' ? (
          <div className="mt-8 flex flex-col justify-between gap-3 rounded-2xl border border-cyan-400/30 bg-cyan-500/[0.07] p-4 sm:flex-row sm:items-center">
            <div className="flex items-start gap-3">
              <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-cyan-300" aria-hidden="true" />
              <div>
                <p className="font-mono text-xs font-semibold uppercase tracking-wider text-cyan-200">
                  REAL-TIME WEBCAM OBJECT DETECTION — EARLY BROWSER PROTOTYPE
                </p>
                <p className="mt-1 text-xs leading-relaxed text-slate-300">
                  Runs TensorFlow.js COCO-SSD locally in your browser. Frames never leave your
                  device. Reports camera-view regions (left/centre/right) only—does not perform
                  reliable depth estimation, staircase detection, collision avoidance, or safe
                  navigation.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => handleModeChange('simulation')}
              className="shrink-0 self-start rounded-xl border border-white/15 bg-white/[0.05] px-3.5 py-2 text-xs font-medium text-slate-200 transition hover:bg-white/[0.1] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 sm:self-center"
            >
              Switch to Guided Simulation
            </button>
          </div>
        ) : (
          <div
            role="note"
            className="mt-8 flex flex-col justify-between gap-3 rounded-2xl border border-teal-400/30 bg-teal-500/[0.07] p-4 sm:flex-row sm:items-center"
          >
            <div className="flex items-start gap-3">
              <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-teal-300" aria-hidden="true" />
              <div>
                <p className="font-mono text-xs font-semibold uppercase tracking-wider text-teal-200">
                  GUIDED SIMULATION NOTICE
                </p>
                <p className="mt-1 text-xs leading-relaxed text-slate-200 sm:text-sm">
                  Guided simulation: the object detections and proximity categories in this mode are
                  predefined examples. They are not generated by a live AI model.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Main Dashboard Split: Left Panel (Camera / Scene) & Right Panel (Awareness Output) */}
        <div
          id="panel-demo-dashboard"
          role="tabpanel"
          aria-labelledby={mode === 'webcam' ? 'tab-webcam' : 'tab-simulation'}
          className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-12"
        >
          {/* LEFT PANEL */}
          <div className="glass-panel flex flex-col rounded-3xl p-5 sm:p-6 lg:col-span-7">
            {mode === 'webcam' ? (
              <>
                <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span
                      className={`h-2.5 w-2.5 rounded-full ${
                        cameraState === 'active'
                          ? detectionActive
                            ? 'bg-emerald-400 animate-pulse'
                            : 'bg-cyan-400'
                          : 'bg-slate-600'
                      }`}
                      aria-hidden="true"
                    />
                    <span className="font-mono text-xs uppercase tracking-wider text-slate-200">
                      {cameraState === 'active'
                        ? detectionActive
                          ? 'COCO-SSD Inference Active (~3 FPS)'
                          : 'LIVE CAMERA INPUT — CAMERA PREVIEW ONLY'
                        : 'Webcam Inactive'}
                    </span>
                  </div>

                  <span className="rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-0.5 font-mono text-[11px] text-slate-300">
                    Permission:{' '}
                    {cameraState === 'active'
                      ? 'Granted'
                      : cameraState === 'denied'
                        ? 'Denied'
                        : cameraState === 'requesting'
                          ? 'Requesting...'
                          : cameraState === 'unsupported'
                            ? 'Unsupported'
                            : 'Not Started'}
                  </span>
                </div>

                {/* Live Video + Canvas Overlay Area */}
                <div className="relative aspect-video w-full overflow-hidden rounded-2xl border border-white/10 bg-[#05080e]">
                  <video
                    ref={videoRef}
                    playsInline
                    muted
                    aria-label="Live webcam video preview"
                    className={`h-full w-full object-contain ${
                      cameraState === 'active' ? 'block' : 'hidden'
                    }`}
                  />
                  <canvas
                    ref={canvasRef}
                    aria-hidden="true"
                    className={`pointer-events-none absolute inset-0 h-full w-full object-contain ${
                      cameraState === 'active' && detectionActive ? 'block' : 'hidden'
                    }`}
                  />

                  {cameraState === 'active' && !detectionActive && (
                    <div className="pointer-events-none absolute left-3 top-3 rounded-lg border border-cyan-400/40 bg-black/75 px-3 py-1.5 font-mono text-[11px] text-cyan-200 backdrop-blur-md">
                      LIVE CAMERA INPUT — CAMERA PREVIEW ONLY
                    </div>
                  )}

                  {modelState === 'loading' && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/70 p-6 text-center backdrop-blur-sm">
                      <Loader2
                        className="h-8 w-8 animate-spin text-cyan-300"
                        aria-hidden="true"
                      />
                      <p className="mt-3 text-sm font-medium text-white">
                        Loading COCO-SSD object detection model...
                      </p>
                      <p className="mt-1 text-xs text-slate-300">
                        Running TensorFlow.js locally in your browser.
                      </p>
                    </div>
                  )}

                  {cameraState !== 'active' && (
                    <div className="flex h-full flex-col items-center justify-center p-6 text-center">
                      <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] text-cyan-300">
                        {cameraState === 'denied' || cameraState === 'error' || cameraState === 'unsupported' ? (
                          <CameraOff className="h-7 w-7 text-amber-300" aria-hidden="true" />
                        ) : (
                          <Camera className="h-7 w-7" aria-hidden="true" />
                        )}
                      </div>
                      <h3 className="mt-4 text-base font-semibold text-white">
                        {cameraState === 'requesting'
                          ? 'Waiting for camera permission...'
                          : cameraError
                            ? 'Webcam Unavailable'
                            : 'Start Laptop Webcam Preview'}
                      </h3>
                      <p className="mt-2 max-w-md text-xs leading-relaxed text-slate-400 sm:text-sm">
                        {cameraError ??
                          'Grant webcam access to test live preview and local TensorFlow.js COCO-SSD object detection right inside this browser.'}
                      </p>
                      <div className="mt-5 flex flex-wrap justify-center gap-3">
                        <button
                          type="button"
                          onClick={() => void handleStartCamera()}
                          disabled={cameraState === 'requesting'}
                          className="inline-flex items-center gap-2 rounded-full bg-cyan-400 px-5 py-2.5 text-xs font-semibold text-slate-950 transition hover:bg-cyan-300 disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300"
                        >
                          <Camera className="h-4 w-4" aria-hidden="true" />
                          {cameraState === 'requesting' ? 'Requesting...' : 'Start Camera'}
                        </button>
                        {(cameraState === 'denied' ||
                          cameraState === 'error' ||
                          cameraState === 'unsupported') && (
                          <button
                            type="button"
                            onClick={() => handleModeChange('simulation')}
                            className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.05] px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-white/[0.1]"
                          >
                            Use Guided Simulation
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {modelError && (
                  <div
                    role="alert"
                    className="mt-4 rounded-xl border border-amber-400/30 bg-amber-500/10 p-3 text-xs text-amber-200"
                  >
                    {modelError}
                  </div>
                )}

                {/* Camera & Detection Controls */}
                <div className="mt-5 flex flex-wrap items-center gap-2.5">
                  {cameraState !== 'active' ? (
                    <button
                      type="button"
                      onClick={() => void handleStartCamera()}
                      disabled={cameraState === 'requesting'}
                      className="inline-flex items-center gap-2 rounded-xl bg-cyan-400 px-4 py-2.5 text-xs font-semibold text-slate-950 transition hover:bg-cyan-300 disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300"
                    >
                      <Camera className="h-4 w-4" aria-hidden="true" />
                      Start Camera
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={stopCameraTracks}
                      className="inline-flex items-center gap-2 rounded-xl border border-rose-400/35 bg-rose-500/15 px-4 py-2.5 text-xs font-semibold text-rose-200 transition hover:bg-rose-500/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-400"
                    >
                      <CameraOff className="h-4 w-4" aria-hidden="true" />
                      Stop Camera
                    </button>
                  )}

                  {cameraState === 'active' && modelState !== 'ready' && (
                    <button
                      type="button"
                      onClick={() => void handleEnableDetection()}
                      disabled={modelState === 'loading'}
                      className="inline-flex items-center gap-2 rounded-xl border border-cyan-400/45 bg-cyan-500/15 px-4 py-2.5 text-xs font-semibold text-cyan-100 transition hover:bg-cyan-500/25 disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
                    >
                      {modelState === 'loading' ? (
                        <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                      ) : (
                        <Play className="h-4 w-4" aria-hidden="true" />
                      )}
                      {modelState === 'loading' ? 'Loading Model...' : 'Enable Object Detection'}
                    </button>
                  )}

                  {cameraState === 'active' && modelState === 'ready' && detectionActive && (
                    <button
                      type="button"
                      onClick={handlePauseDetection}
                      className="inline-flex items-center gap-2 rounded-xl border border-amber-400/35 bg-amber-500/15 px-4 py-2.5 text-xs font-semibold text-amber-200 transition hover:bg-amber-500/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
                    >
                      <Pause className="h-4 w-4" aria-hidden="true" />
                      Pause Detection
                    </button>
                  )}

                  {cameraState === 'active' && modelState === 'ready' && !detectionActive && (
                    <button
                      type="button"
                      onClick={() => void handleResumeDetection()}
                      className="inline-flex items-center gap-2 rounded-xl border border-emerald-400/35 bg-emerald-500/15 px-4 py-2.5 text-xs font-semibold text-emerald-200 transition hover:bg-emerald-500/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
                    >
                      <Play className="h-4 w-4" aria-hidden="true" />
                      Resume Detection
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => setVoiceEnabled((prev) => !prev)}
                    aria-pressed={voiceEnabled}
                    className={`inline-flex items-center gap-2 rounded-xl border px-4 py-2.5 text-xs font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 ${
                      voiceEnabled
                        ? 'border-teal-400/50 bg-teal-500/20 text-teal-100'
                        : 'border-white/12 bg-white/[0.04] text-slate-200 hover:bg-white/[0.08]'
                    }`}
                  >
                    {voiceEnabled ? (
                      <Volume2 className="h-4 w-4" aria-hidden="true" />
                    ) : (
                      <VolumeX className="h-4 w-4" aria-hidden="true" />
                    )}
                    {voiceEnabled ? 'Disable Voice Feedback' : 'Enable Voice Feedback'}
                  </button>

                  <button
                    type="button"
                    onClick={handleStopSpeech}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-white/12 bg-white/[0.04] px-3.5 py-2.5 text-xs font-medium text-slate-200 transition hover:bg-white/[0.08] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
                  >
                    <Square className="h-3.5 w-3.5" aria-hidden="true" />
                    Stop Speech
                  </button>
                </div>

                {/* Confidence Threshold + Audio Cue Toggle */}
                <div className="mt-4 grid grid-cols-1 gap-4 rounded-2xl border border-white/[0.07] bg-white/[0.02] p-4 sm:grid-cols-2 sm:items-center">
                  <div>
                    <label
                      htmlFor="confidence-slider"
                      className="flex items-center justify-between text-xs font-medium text-slate-300"
                    >
                      <span className="inline-flex items-center gap-1.5">
                        <SlidersHorizontal className="h-3.5 w-3.5 text-cyan-300" aria-hidden="true" />
                        Confidence Threshold
                      </span>
                      <span className="font-mono text-cyan-300">
                        {Math.round(confidenceThreshold * 100)}%
                      </span>
                    </label>
                    <input
                      id="confidence-slider"
                      type="range"
                      min={35}
                      max={85}
                      step={5}
                      value={Math.round(confidenceThreshold * 100)}
                      onChange={(e) => setConfidenceThreshold(Number(e.target.value) / 100)}
                      className="mt-2 h-2 w-full cursor-pointer accent-cyan-400"
                    />
                  </div>

                  <div className="flex items-center justify-between gap-3 sm:justify-end">
                    <label className="inline-flex cursor-pointer items-center gap-2 text-xs text-slate-300">
                      <input
                        type="checkbox"
                        checked={audioCueAuto}
                        onChange={(e) => setAudioCueAuto(e.target.checked)}
                        className="h-4 w-4 rounded border-white/20 bg-slate-900 accent-cyan-400"
                      />
                      <span>Auto stereo ping on change</span>
                    </label>
                  </div>
                </div>
              </>
            ) : (
              /* MODE 2 LEFT PANEL: Guided Simulation Selector + Viewport */
              <>
                <div className="mb-4 flex items-center justify-between">
                  <span className="font-mono text-xs uppercase tracking-wider text-teal-300">
                    Select a Guided Scenario
                  </span>
                  <span className="font-mono text-[11px] text-slate-400">
                    5 Predefined Examples
                  </span>
                </div>

                <div
                  role="group"
                  aria-label="Guided simulation scenarios"
                  className="mb-5 grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3"
                >
                  {GUIDED_SCENARIOS.map((scenario) => {
                    const active = scenario.id === selectedScenario.id;
                    return (
                      <button
                        key={scenario.id}
                        type="button"
                        onClick={() => {
                          setSelectedScenarioId(scenario.id);
                          stopSpeech();
                          setIsSpeaking(false);
                          setActionStatus(`Selected ${scenario.title}.`);
                        }}
                        aria-pressed={active}
                        className={`rounded-xl border px-3 py-2.5 text-left text-xs transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 ${
                          active
                            ? scenario.isHazard
                              ? 'border-amber-400/60 bg-amber-500/15 text-amber-100'
                              : 'border-cyan-400/60 bg-cyan-500/15 text-cyan-100'
                            : 'border-white/10 bg-white/[0.02] text-slate-300 hover:border-white/25 hover:text-white'
                        }`}
                      >
                        <p className="font-semibold">{scenario.shortLabel}</p>
                        <p className="mt-0.5 font-mono text-[10px] text-slate-400">
                          {scenario.direction} · {scenario.proximityOrStatusValue}
                        </p>
                      </button>
                    );
                  })}
                </div>

                <SimulatedViewport scenario={selectedScenario} />
              </>
            )}
          </div>

          {/* RIGHT PANEL: Awareness Output & Feedback Controls */}
          <div className="glass-panel flex flex-col justify-between rounded-3xl p-5 sm:p-6 lg:col-span-5">
            <div>
              <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
                <div>
                  <p className="font-mono text-[11px] uppercase tracking-widest text-cyan-300">
                    Assistive Awareness Output
                  </p>
                  <h3 className="mt-1 text-lg font-semibold text-white">
                    {mode === 'webcam'
                      ? detectionActive
                        ? 'Live Detection Readout'
                        : 'Awaiting Live Detection'
                      : selectedScenario.title}
                  </h3>
                </div>
                {isSpeaking && (
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-teal-400/40 bg-teal-500/15 px-2.5 py-1 font-mono text-[10px] text-teal-200">
                    <Volume2 className="h-3 w-3 animate-pulse" aria-hidden="true" />
                    Speaking
                  </span>
                )}
              </div>

              {mode === 'webcam' ? (
                <div className="mt-5 space-y-4">
                  {cameraState !== 'active' || !detectionActive ? (
                    <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-5 text-sm text-slate-300">
                      {cameraState !== 'active' ? (
                        <p>
                          Start the webcam and enable COCO-SSD object detection to view real-time
                          object labels, confidence scores, and horizontal camera-view zones here.
                        </p>
                      ) : (
                        <p>
                          Camera preview is active without AI detection. No fabricated detection
                          data is displayed. Click{' '}
                          <strong className="text-cyan-200">Enable Object Detection</strong> to run
                          TensorFlow.js COCO-SSD locally.
                        </p>
                      )}
                    </div>
                  ) : primaryDetection ? (
                    <>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-3.5">
                          <p className="font-mono text-[10px] uppercase tracking-wider text-slate-400">
                            Primary Detected Object
                          </p>
                          <p className="mt-1 text-lg font-semibold text-white">
                            {primaryDetection.label}
                          </p>
                        </div>
                        <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-3.5">
                          <p className="font-mono text-[10px] uppercase tracking-wider text-slate-400">
                            Model Confidence
                          </p>
                          <p className="mt-1 font-mono text-lg font-semibold text-cyan-300">
                            {Math.round(primaryDetection.score * 100)}%
                          </p>
                        </div>
                      </div>

                      <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-3.5">
                        <div className="flex items-center justify-between">
                          <p className="font-mono text-[10px] uppercase tracking-wider text-slate-400">
                            Camera-View Position
                          </p>
                          <span className="text-xs font-medium text-cyan-200">
                            {primaryDetection.directionPhrase}
                          </span>
                        </div>
                        <DirectionVisualBar direction={primaryDetection.direction} />
                      </div>

                      <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-3.5">
                        <p className="font-mono text-[10px] uppercase tracking-wider text-slate-400">
                          Relative Framing (No Depth Sensor)
                        </p>
                        <p className="mt-1 text-sm font-medium text-slate-200">
                          {primaryDetection.framingNote}
                        </p>
                        <p className="mt-1 text-[11px] text-slate-400">
                          Browser prototype reports 2D bounding-box size only—not physical distance.
                        </p>
                      </div>

                      {/* All Detections List */}
                      <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-3.5">
                        <p className="font-mono text-[10px] uppercase tracking-wider text-slate-400">
                          All Detected Objects ({detections.length})
                        </p>
                        <ul className="mt-2.5 max-h-36 space-y-2 overflow-y-auto pr-1">
                          {detections.map((item) => (
                            <li
                              key={item.id}
                              className="flex items-center justify-between rounded-xl border border-white/[0.06] bg-black/25 px-3 py-2 text-xs"
                            >
                              <span className="font-medium text-slate-100">{item.label}</span>
                              <span className="font-mono text-slate-300">
                                {item.direction} · {Math.round(item.score * 100)}%
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </>
                  ) : (
                    <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-5 text-sm text-slate-300">
                      Scanning webcam frames with COCO-SSD... No objects currently exceed the{' '}
                      {Math.round(confidenceThreshold * 100)}% confidence threshold.
                    </div>
                  )}
                </div>
              ) : (
                /* MODE 2 RIGHT PANEL DETAILS */
                <div className="mt-5 space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-3.5">
                      <p className="font-mono text-[10px] uppercase tracking-wider text-slate-400">
                        Detected Object
                      </p>
                      <p className="mt-1 text-base font-semibold text-white">
                        {selectedScenario.objectName}
                      </p>
                    </div>
                    <div
                      className={`rounded-2xl border p-3.5 ${
                        selectedScenario.isHazard
                          ? 'border-amber-400/40 bg-amber-500/10'
                          : 'border-white/[0.08] bg-white/[0.02]'
                      }`}
                    >
                      <p className="font-mono text-[10px] uppercase tracking-wider text-slate-400">
                        {selectedScenario.proximityOrStatusLabel}
                      </p>
                      <p
                        className={`mt-1 text-base font-semibold ${
                          selectedScenario.isHazard ? 'text-amber-200' : 'text-cyan-300'
                        }`}
                      >
                        {selectedScenario.proximityOrStatusValue}
                      </p>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-3.5">
                    <div className="flex items-center justify-between">
                      <p className="font-mono text-[10px] uppercase tracking-wider text-slate-400">
                        Direction Indicator
                      </p>
                      <span className="font-mono text-xs text-cyan-200">
                        {selectedScenario.direction}
                      </span>
                    </div>
                    <DirectionVisualBar direction={selectedScenario.direction} />
                  </div>

                  <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-3.5">
                    <p className="font-mono text-[10px] uppercase tracking-wider text-slate-400">
                      Confidence Indicator
                    </p>
                    <p className="mt-1 text-xs font-medium text-slate-300">
                      {selectedScenario.simulatedConfidence}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-3.5 space-y-2">
                    <div>
                      <p className="font-mono text-[10px] uppercase tracking-wider text-slate-400">
                        Suggested Voice Description
                      </p>
                      <p className="mt-0.5 text-sm text-white">
                        &ldquo;{selectedScenario.voiceFeedback}&rdquo;
                      </p>
                    </div>
                    <div className="border-t border-white/[0.06] pt-2">
                      <p className="font-mono text-[10px] uppercase tracking-wider text-slate-400">
                        Suggested Audio &amp; Haptic Cue
                      </p>
                      <p className="mt-0.5 text-xs text-slate-300">
                        {selectedScenario.audioCueSummary}
                      </p>
                      <p className="mt-0.5 text-xs text-slate-400">
                        Haptic: {selectedScenario.hapticSummary}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Interactive Feedback Action Buttons */}
            <div className="mt-6 border-t border-white/[0.08] pt-5">
              <div className="flex flex-wrap gap-2.5">
                <button
                  type="button"
                  onClick={handlePlayVoiceFeedback}
                  className="inline-flex items-center gap-2 rounded-xl bg-cyan-400 px-4 py-2.5 text-xs font-semibold text-slate-950 transition hover:bg-cyan-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300"
                >
                  <Volume2 className="h-4 w-4" aria-hidden="true" />
                  Play Voice Feedback
                </button>

                <button
                  type="button"
                  onClick={handleStopSpeech}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-white/15 bg-white/[0.04] px-3.5 py-2.5 text-xs font-medium text-slate-200 transition hover:bg-white/[0.08] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
                >
                  <Square className="h-3.5 w-3.5" aria-hidden="true" />
                  Stop Speech
                </button>

                <button
                  type="button"
                  onClick={handlePlayAudioCue}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-teal-400/35 bg-teal-500/15 px-3.5 py-2.5 text-xs font-semibold text-teal-100 transition hover:bg-teal-500/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-400"
                >
                  <Volume2 className="h-4 w-4" aria-hidden="true" />
                  Play Audio Cue
                </button>

                <button
                  type="button"
                  onClick={handleTestVibration}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-white/15 bg-white/[0.04] px-3.5 py-2.5 text-xs font-medium text-slate-200 transition hover:bg-white/[0.08] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
                >
                  <Vibrate className="h-4 w-4 text-cyan-300" aria-hidden="true" />
                  Test Vibration
                </button>
              </div>

              {vibrationNotice && (
                <p
                  role="status"
                  className="mt-3 rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2 text-xs text-slate-300"
                >
                  {vibrationNotice}
                </p>
              )}

              <div
                aria-live="polite"
                className="mt-3 flex items-center gap-2 text-xs text-slate-400"
              >
                <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-cyan-400" aria-hidden="true" />
                <span>{actionStatus}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
