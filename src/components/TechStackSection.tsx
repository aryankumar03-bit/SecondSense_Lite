import { motion } from 'framer-motion';
import { Eye, Smartphone, Cpu, Compass, Volume2, FileText } from 'lucide-react';

const STACK_GROUPS = [
  {
    category: 'COMPUTER VISION',
    icon: Eye,
    items: [
      {
        name: 'YOLO Object Detection',
        role: 'Planned mobile model for real-time identification of obstacles, people, and indoor/outdoor objects.',
        tag: 'Planned Mobile Target',
      },
      {
        name: 'Depth Anything V2',
        role: 'Planned monocular depth model to estimate relative near vs. far scene structure.',
        tag: 'Planned Mobile Target',
      },
    ],
  },
  {
    category: 'ANDROID DEVELOPMENT',
    icon: Smartphone,
    items: [
      {
        name: 'Kotlin',
        role: 'Primary target language for safe, modern Android application logic.',
        tag: 'Planned Mobile Target',
      },
      {
        name: 'Android Studio',
        role: 'Development environment for building, profiling, and testing the companion mobile app.',
        tag: 'Planned Mobile Target',
      },
      {
        name: 'CameraX',
        role: 'Android Jetpack camera API for consistent low-latency frame capture and analysis.',
        tag: 'Planned Mobile Target',
      },
    ],
  },
  {
    category: 'MACHINE LEARNING',
    icon: Cpu,
    items: [
      {
        name: 'TensorFlow Lite',
        role: 'Lightweight on-device inference runtime intended for mobile deployment.',
        tag: 'Planned Mobile Target',
      },
      {
        name: 'On-Device Inference',
        role: 'Processes frames locally on the device for privacy and offline responsiveness. (Browser demo uses TensorFlow.js COCO-SSD.)',
        tag: 'Prototype: TF.js in Browser',
      },
      {
        name: 'Qualcomm AI Engine / QNN',
        role: 'Hardware acceleration path where compatible mobile NPU/DSP hardware is available.',
        tag: 'Optional Hardware Acceleration',
      },
    ],
  },
  {
    category: 'SENSORS',
    icon: Compass,
    items: [
      {
        name: 'Smartphone Camera',
        role: 'Primary optical sensor capturing forward-facing scene frames.',
        tag: 'Prototype: Laptop Webcam',
      },
      {
        name: 'Accelerometer & Gyroscope',
        role: 'Motion and orientation sensors intended to contextualise walking movement and camera tilt.',
        tag: 'Planned Mobile Target',
      },
      {
        name: 'Barometer (where available)',
        role: 'Optional elevation-change context on supported devices to supplement scene awareness.',
        tag: 'Optional Sensor',
      },
    ],
  },
  {
    category: 'ACCESSIBILITY OUTPUT',
    icon: Volume2,
    items: [
      {
        name: 'Text-to-Speech (TTS)',
        role: 'Converts object detections and scene alerts into concise spoken descriptions.',
        tag: 'Active in Web Prototype',
      },
      {
        name: 'Spatial Audio',
        role: 'Positions audio cues across left, centre, and right channels for directional awareness.',
        tag: 'Active in Web Prototype',
      },
      {
        name: 'Haptic Feedback',
        role: 'Delivers vibration pulse patterns for discreet non-visual urgency cues.',
        tag: 'Active Where Supported',
      },
      {
        name: 'Speech Recognition',
        role: 'Hands-free voice query interface for asking about surroundings or reading text.',
        tag: 'Planned Mobile Target',
      },
    ],
  },
  {
    category: 'OCR',
    icon: FileText,
    items: [
      {
        name: 'On-Device Text Recognition',
        role: 'Extracts visible text from signs, doors, and labels without requiring cloud connectivity.',
        tag: 'Planned Capability',
      },
      {
        name: 'Hindi and English Text Reading',
        role: 'Planned bilingual text-to-speech support for everyday Indian and English signage.',
        tag: 'Planned Capability',
      },
    ],
  },
];

export function TechStackSection() {
  return (
    <section
      id="tech-stack"
      aria-labelledby="stack-heading"
      className="border-b border-white/[0.06] py-20 sm:py-24"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <p className="font-mono text-xs uppercase tracking-widest text-cyan-300">
            05 · Technology Stack
          </p>
          <h2
            id="stack-heading"
            className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-4xl"
          >
            Intended technologies &amp; browser prototype stack.
          </h2>
          <p className="mt-4 text-base leading-relaxed text-slate-300">
            Our EPICS website prototype demonstrates real-time browser vision (TensorFlow.js
            COCO-SSD) and Web Audio/Speech/Vibration APIs, while establishing the target Android and
            on-device ML stack for subsequent project stages.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {STACK_GROUPS.map((group, idx) => {
            const Icon = group.icon;
            return (
              <motion.section
                key={group.category}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{ duration: 0.35, delay: idx * 0.05 }}
                aria-label={group.category}
                className="glass-panel flex flex-col rounded-2xl p-6"
              >
                <div className="flex items-center gap-3 border-b border-white/[0.07] pb-4">
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-cyan-400/25 bg-cyan-500/10 text-cyan-300">
                    <Icon className="h-4 w-4" aria-hidden="true" />
                  </span>
                  <h3 className="font-mono text-xs font-semibold tracking-widest text-white">
                    {group.category}
                  </h3>
                </div>

                <ul className="mt-5 space-y-4">
                  {group.items.map((item) => (
                    <li key={item.name} className="space-y-1">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <span className="text-sm font-semibold text-slate-100">{item.name}</span>
                        <span
                          className={`rounded-full px-2 py-0.5 font-mono text-[10px] ${
                            item.tag.includes('Active') || item.tag.includes('Prototype')
                              ? 'border border-teal-400/30 bg-teal-500/10 text-teal-200'
                              : 'border border-white/10 bg-white/[0.03] text-slate-400'
                          }`}
                        >
                          {item.tag}
                        </span>
                      </div>
                      <p className="text-xs leading-relaxed text-slate-400">{item.role}</p>
                    </li>
                  ))}
                </ul>
              </motion.section>
            );
          })}
        </div>
      </div>
    </section>
  );
}
