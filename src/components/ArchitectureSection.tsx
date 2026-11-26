import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Camera,
  Box,
  Layers,
  Smartphone,
  ListOrdered,
  Volume2,
  ArrowRight,
  ArrowDown,
} from 'lucide-react';

const PIPELINE_STEPS = [
  {
    step: 'STEP 1',
    title: 'CAMERA INPUT',
    icon: Camera,
    summary: 'A smartphone camera captures the user’s surroundings.',
    detail:
      'Frames are streamed continuously from the forward-facing rear camera without uploading video to external servers.',
    status: 'Demonstrated in Browser Prototype (Webcam)',
  },
  {
    step: 'STEP 2',
    title: 'COMPUTER VISION',
    icon: Box,
    summary: 'An object detection model such as YOLO identifies objects and their positions.',
    detail:
      'Produces bounding boxes, class labels, and confidence scores. (Browser prototype uses TF.js COCO-SSD; Android target plans YOLO via TFLite.)',
    status: 'Demonstrated via COCO-SSD · YOLO Planned',
  },
  {
    step: 'STEP 3',
    title: 'DEPTH ESTIMATION',
    icon: Layers,
    summary: 'A depth estimation model such as Depth Anything V2 estimates relative depth information.',
    detail:
      'Helps distinguish relatively nearer objects from background elements without claiming exact metric measurements.',
    status: 'Planned Architecture Stage',
  },
  {
    step: 'STEP 4',
    title: 'SENSOR AND CONTEXT PROCESSING',
    icon: Smartphone,
    summary:
      'Smartphone motion sensors and contextual information may help interpret movement and environmental conditions.',
    detail:
      'Accelerometer, gyroscope, and orientation cues help suppress noisy alerts while turning or walking.',
    status: 'Planned Architecture Stage',
  },
  {
    step: 'STEP 5',
    title: 'TARGET PRIORITISATION',
    icon: ListOrdered,
    summary: 'The system determines which detected information should be communicated first.',
    detail:
      'Filters out low-confidence clutter and ranks centre/near detections above distant background items to avoid audio overload.',
    status: 'Basic Rule Logic in Prototype',
  },
  {
    step: 'STEP 6',
    title: 'USER FEEDBACK',
    icon: Volume2,
    summary: 'Information is converted into non-visual cues:',
    bullets: ['Directional audio', 'Audio pulse patterns', 'Spoken descriptions', 'Haptic feedback'],
    detail:
      'Communicated cleanly through stereo panning, cadence cues, concise speech synthesis, and tactile vibration.',
    status: 'Demonstrated via Web APIs',
  },
];

export function ArchitectureSection() {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <section
      id="architecture"
      aria-labelledby="architecture-heading"
      className="border-b border-white/[0.06] py-20 sm:py-24"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div className="max-w-3xl">
            <p className="font-mono text-xs uppercase tracking-widest text-cyan-300">
              03 · How It Works
            </p>
            <h2
              id="architecture-heading"
              className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-4xl"
            >
              From camera frame to non-visual awareness.
            </h2>
            <p className="mt-3 text-base text-slate-300">
              Inspect each stage of the proposed on-device processing pipeline. Select any stage to
              view how data flows into user feedback.
            </p>
          </div>

          <div className="inline-flex items-center gap-2 self-start rounded-full border border-amber-400/30 bg-amber-500/10 px-3.5 py-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-300" aria-hidden="true" />
            <span className="font-mono text-[11px] uppercase tracking-wider text-amber-200">
              PROPOSED SYSTEM ARCHITECTURE — FEATURES ARE UNDER DEVELOPMENT.
            </span>
          </div>
        </div>

        {/* Connected Pipeline Grid */}
        <div className="mt-12 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {PIPELINE_STEPS.map((item, idx) => {
            const Icon = item.icon;
            const isActive = activeIndex === idx;
            return (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{ duration: 0.35, delay: idx * 0.05 }}
                className="relative flex flex-col"
              >
                <button
                  type="button"
                  onClick={() => setActiveIndex(idx)}
                  aria-pressed={isActive}
                  className={`group flex h-full w-full flex-col rounded-2xl border p-5 text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 ${
                    isActive
                      ? 'border-cyan-400/50 bg-cyan-500/[0.08] shadow-[0_0_28px_-8px_rgba(34,211,238,0.35)]'
                      : 'border-white/[0.08] bg-white/[0.02] hover:border-white/20 hover:bg-white/[0.04]'
                  }`}
                >
                  <div className="flex w-full items-center justify-between">
                    <span className="font-mono text-xs font-semibold tracking-wider text-cyan-300">
                      {item.step}
                    </span>
                    <span
                      className={`flex h-9 w-9 items-center justify-center rounded-xl border transition ${
                        isActive
                          ? 'border-cyan-400/40 bg-cyan-400/15 text-cyan-200'
                          : 'border-white/10 bg-white/[0.04] text-slate-300'
                      }`}
                    >
                      <Icon className="h-4 w-4" aria-hidden="true" />
                    </span>
                  </div>

                  <h3 className="mt-4 font-mono text-sm font-semibold tracking-wide text-white">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-300">{item.summary}</p>

                  {item.bullets && (
                    <ul className="mt-3 grid grid-cols-2 gap-1.5 text-xs text-slate-300">
                      {item.bullets.map((bullet) => (
                        <li key={bullet} className="flex items-center gap-1.5">
                          <span className="h-1 w-1 rounded-full bg-teal-300" aria-hidden="true" />
                          <span>{bullet}</span>
                        </li>
                      ))}
                    </ul>
                  )}

                  <div className="mt-auto pt-4">
                    <span className="inline-block rounded-md border border-white/10 bg-black/30 px-2.5 py-1 font-mono text-[10px] text-slate-300">
                      {item.status}
                    </span>
                  </div>
                </button>

                {/* Directional flow connector indicators on mobile & desktop */}
                {idx < PIPELINE_STEPS.length - 1 && (
                  <>
                    <div
                      aria-hidden="true"
                      className="my-1 flex justify-center text-cyan-400/50 md:hidden"
                    >
                      <ArrowDown className="h-4 w-4" />
                    </div>
                    {idx % 3 !== 2 && (
                      <div
                        aria-hidden="true"
                        className="pointer-events-none absolute -right-3 top-1/2 z-10 hidden -translate-y-1/2 rounded-full border border-cyan-400/30 bg-[#0b1018] p-1 text-cyan-300 lg:flex"
                      >
                        <ArrowRight className="h-3.5 w-3.5" />
                      </div>
                    )}
                  </>
                )}
              </motion.div>
            );
          })}
        </div>

        {/* Selected Stage Inspector Bar */}
        <div
          aria-live="polite"
          className="mt-6 glass-panel-subtle flex flex-col justify-between gap-4 rounded-2xl p-5 sm:flex-row sm:items-center"
        >
          <div>
            <p className="font-mono text-xs uppercase tracking-wider text-cyan-300">
              {PIPELINE_STEPS[activeIndex].step} · {PIPELINE_STEPS[activeIndex].title}
            </p>
            <p className="mt-1 text-sm text-slate-200">{PIPELINE_STEPS[activeIndex].detail}</p>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <button
              type="button"
              onClick={() =>
                setActiveIndex((prev) => (prev - 1 + PIPELINE_STEPS.length) % PIPELINE_STEPS.length)
              }
              className="rounded-lg border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs font-medium text-slate-200 transition hover:bg-white/[0.08] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
            >
              Previous Stage
            </button>
            <button
              type="button"
              onClick={() => setActiveIndex((prev) => (prev + 1) % PIPELINE_STEPS.length)}
              className="rounded-lg border border-cyan-400/30 bg-cyan-500/15 px-3 py-1.5 text-xs font-medium text-cyan-200 transition hover:bg-cyan-500/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
            >
              Next Stage
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
