import { DirectionZone } from '../data/projectData';

let sharedAudioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  const AudioCtx =
    window.AudioContext ||
    (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!AudioCtx) return null;
  if (!sharedAudioCtx) {
    sharedAudioCtx = new AudioCtx();
  }
  if (sharedAudioCtx.state === 'suspended') {
    void sharedAudioCtx.resume();
  }
  return sharedAudioCtx;
}

export function isSpeechSynthesisSupported(): boolean {
  return typeof window !== 'undefined' && 'speechSynthesis' in window;
}

export function isWebAudioSupported(): boolean {
  if (typeof window === 'undefined') return false;
  return Boolean(
    window.AudioContext ||
      (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
  );
}

export function isVibrationSupported(): boolean {
  return typeof navigator !== 'undefined' && typeof navigator.vibrate === 'function';
}

export function speakText(
  text: string,
  options?: {
    rate?: number;
    pitch?: number;
    onStart?: () => void;
    onEnd?: () => void;
    onError?: () => void;
  }
): boolean {
  if (!isSpeechSynthesisSupported()) {
    options?.onError?.();
    return false;
  }

  try {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = options?.rate ?? 1.02;
    utterance.pitch = options?.pitch ?? 1.0;
    utterance.lang = 'en-US';
    utterance.onstart = () => options?.onStart?.();
    utterance.onend = () => options?.onEnd?.();
    utterance.onerror = () => options?.onError?.();
    window.speechSynthesis.speak(utterance);
    return true;
  } catch {
    options?.onError?.();
    return false;
  }
}

export function stopSpeech(): void {
  if (!isSpeechSynthesisSupported()) return;
  try {
    window.speechSynthesis.cancel();
  } catch {
    // Ignore errors when speech synthesis is unavailable
  }
}

export function directionToPanValue(direction: DirectionZone): number {
  if (direction === 'Left') return -0.78;
  if (direction === 'Right') return 0.78;
  return 0;
}

export function playDirectionalAudioCue(params: {
  direction: DirectionZone;
  pulseCount?: number;
  pulseIntervalMs?: number;
  pitchHz?: number;
}): { ok: boolean; stereoSupported: boolean } {
  const ctx = getAudioContext();
  if (!ctx) {
    return { ok: false, stereoSupported: false };
  }

  const panValue = directionToPanValue(params.direction);
  const pulseCount = params.pulseCount ?? 2;
  const intervalSec = (params.pulseIntervalMs ?? 150) / 1000;
  const baseFreq = params.pitchHz ?? 520;
  const stereoSupported = typeof ctx.createStereoPanner === 'function';

  const now = ctx.currentTime;

  for (let i = 0; i < pulseCount; i++) {
    const startTime = now + i * intervalSec;
    const duration = 0.095;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(baseFreq + i * 25, startTime);

    gain.gain.setValueAtTime(0.0001, startTime);
    gain.gain.exponentialRampToValueAtTime(0.22, startTime + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

    if (stereoSupported) {
      const panner = ctx.createStereoPanner();
      panner.pan.setValueAtTime(panValue, startTime);
      osc.connect(gain);
      gain.connect(panner);
      panner.connect(ctx.destination);
    } else {
      osc.connect(gain);
      gain.connect(ctx.destination);
    }

    osc.start(startTime);
    osc.stop(startTime + duration + 0.02);
  }

  return { ok: true, stereoSupported };
}

export function triggerVibration(pattern: number[]): { supported: boolean; triggered: boolean } {
  if (!isVibrationSupported()) {
    return { supported: false, triggered: false };
  }
  try {
    const triggered = navigator.vibrate(pattern);
    return { supported: true, triggered };
  } catch {
    return { supported: false, triggered: false };
  }
}
