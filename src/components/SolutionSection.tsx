import { useState } from 'react';
import { motion } from 'framer-motion';
import { ScanEye, MoveHorizontal, Layers, AudioWaveform, Mic, Info } from 'lucide-react';

const VOICE_EXAMPLES = [
  {
    command: "What's ahead?",
    intent: 'Summarises prioritised objects currently detected in front of the camera.',
  },
  {
    command: 'Find a chair.',
    intent: 'Highlights whether seating is detected and indicates left, centre, or right.',
  },
  {
    command: 'Read that sign.',
    intent: 'Triggers planned on-device OCR to read visible text aloud.',
  },
  {
    command: 'Where is the door?',
    intent: 'Checks detections for doorways and provides directional audio guidance.',
  },
];

export function SolutionSection() {
  const [selectedCommand, setSelectedCommand] = useState(VOICE_EXAMPLES[0]);

  return (
    <section
      id="solution"
      aria-labelledby="solution-heading"
      className="border-b border-white/[0.06] py-20 sm:py-24"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <p className="font-mono text-xs uppercase tracking-widest text-cyan-300">
            02 · Our Solution
          </p>
          <h2
            id="solution-heading"
            className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-4xl"
          >
            Introducing EchoField.
          </h2>
          <p className="mt-4 text-base leading-relaxed text-slate-300">
            Designed around five interconnected assistive capabilities that convert camera input into
            calm, non-visual awareness without demanding screen interaction.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Card 1 */}
          <motion.article
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            className="glass-panel rounded-2xl p-6"
          >
            <div className="flex items-center justify-between">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-cyan-400/25 bg-cyan-500/10 text-cyan-300">
                <ScanEye className="h-5 w-5" aria-hidden="true" />
              </span>
              <span className="font-mono text-[11px] uppercase text-slate-500">Capability 01</span>
            </div>
            <h3 className="mt-5 text-lg font-semibold text-white">AI Object Awareness</h3>
            <p className="mt-2.5 text-sm leading-relaxed text-slate-300">
              The camera captures the environment. An object detection model identifies objects such
              as people, chairs, doors, vehicles, and other everyday surroundings.
            </p>
          </motion.article>

          {/* Card 2 */}
          <motion.article
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ delay: 0.05 }}
            className="glass-panel rounded-2xl p-6"
          >
            <div className="flex items-center justify-between">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-cyan-400/25 bg-cyan-500/10 text-cyan-300">
                <MoveHorizontal className="h-5 w-5" aria-hidden="true" />
              </span>
              <span className="font-mono text-[11px] uppercase text-slate-500">Capability 02</span>
            </div>
            <h3 className="mt-5 text-lg font-semibold text-white">Directional Awareness</h3>
            <p className="mt-2.5 text-sm leading-relaxed text-slate-300">
              The system estimates whether a detected object is towards the left, centre, or right
              of the camera view so feedback reflects spatial placement.
            </p>
            <div className="mt-4 grid grid-cols-3 gap-2 text-center font-mono text-[11px]">
              <span className="rounded-lg border border-white/10 bg-white/[0.03] py-1.5 text-slate-300">
                Left
              </span>
              <span className="rounded-lg border border-cyan-400/30 bg-cyan-500/10 py-1.5 text-cyan-200">
                Centre
              </span>
              <span className="rounded-lg border border-white/10 bg-white/[0.03] py-1.5 text-slate-300">
                Right
              </span>
            </div>
          </motion.article>

          {/* Card 3 */}
          <motion.article
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ delay: 0.1 }}
            className="glass-panel rounded-2xl p-6"
          >
            <div className="flex items-center justify-between">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-cyan-400/25 bg-cyan-500/10 text-cyan-300">
                <Layers className="h-5 w-5" aria-hidden="true" />
              </span>
              <span className="font-mono text-[11px] uppercase text-slate-500">Capability 03</span>
            </div>
            <h3 className="mt-5 text-lg font-semibold text-white">Proximity Awareness</h3>
            <p className="mt-2.5 text-sm leading-relaxed text-slate-300">
              Depth estimation is intended to help distinguish relatively nearer and farther
              objects in the scene to prioritise what matters most.
            </p>
            <div className="mt-4 flex items-start gap-2 rounded-xl border border-amber-400/20 bg-amber-500/[0.06] p-3 text-xs text-amber-200/90">
              <Info className="mt-0.5 h-4 w-4 shrink-0 text-amber-300" aria-hidden="true" />
              <span>
                Note: Monocular depth estimation provides relative depth cues only—it does not
                guarantee accurate physical distances in metres.
              </span>
            </div>
          </motion.article>

          {/* Card 4 */}
          <motion.article
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ delay: 0.15 }}
            className="glass-panel rounded-2xl p-6 lg:col-span-1"
          >
            <div className="flex items-center justify-between">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-teal-400/25 bg-teal-500/10 text-teal-300">
                <AudioWaveform className="h-5 w-5" aria-hidden="true" />
              </span>
              <span className="font-mono text-[11px] uppercase text-slate-500">Capability 04</span>
            </div>
            <h3 className="mt-5 text-lg font-semibold text-white">Audio and Haptic Feedback</h3>
            <p className="mt-2.5 text-sm leading-relaxed text-slate-300">
              Translates visual context into non-visual signals designed to remain unobtrusive:
            </p>
            <ul className="mt-3 space-y-2 text-xs text-slate-300">
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-cyan-400" aria-hidden="true" />
                Audio direction indicates where an object is.
              </li>
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-cyan-400" aria-hidden="true" />
                Faster pulse patterns can indicate greater proximity or urgency.
              </li>
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-cyan-400" aria-hidden="true" />
                Spoken labels concisely identify objects.
              </li>
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-cyan-400" aria-hidden="true" />
                Vibration provides a discreet tactile channel.
              </li>
            </ul>
          </motion.article>

          {/* Card 5 (Spans 2 columns on large screens for interactive voice command preview) */}
          <motion.article
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ delay: 0.2 }}
            className="glass-panel rounded-2xl p-6 md:col-span-2 lg:col-span-2"
          >
            <div className="flex items-center justify-between">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-teal-400/25 bg-teal-500/10 text-teal-300">
                <Mic className="h-5 w-5" aria-hidden="true" />
              </span>
              <span className="font-mono text-[11px] uppercase text-slate-500">
                Capability 05 · Planned Feature
              </span>
            </div>
            <h3 className="mt-5 text-lg font-semibold text-white">
              Voice Interaction and Text Reading
            </h3>
            <p className="mt-2.5 text-sm leading-relaxed text-slate-300">
              In the target mobile system, voice commands allow users to query their surroundings
              hands-free, while OCR and speech synthesis help make printed signs and labels
              accessible. Select a planned command below to preview its intended role:
            </p>

            <div className="mt-5 flex flex-wrap gap-2" role="group" aria-label="Planned voice commands">
              {VOICE_EXAMPLES.map((item) => {
                const active = selectedCommand.command === item.command;
                return (
                  <button
                    key={item.command}
                    type="button"
                    onClick={() => setSelectedCommand(item)}
                    aria-pressed={active}
                    className={`rounded-full border px-3.5 py-1.5 text-xs font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 ${
                      active
                        ? 'border-cyan-400/60 bg-cyan-500/20 text-cyan-100'
                        : 'border-white/10 bg-white/[0.03] text-slate-300 hover:border-white/25 hover:text-white'
                    }`}
                  >
                    &ldquo;{item.command}&rdquo;
                  </button>
                );
              })}
            </div>

            <div className="mt-4 rounded-xl border border-white/[0.08] bg-[#070b12] p-4">
              <p className="font-mono text-[11px] uppercase tracking-wider text-teal-300">
                Intended System Response
              </p>
              <p className="mt-1.5 text-sm text-slate-200">{selectedCommand.intent}</p>
            </div>
          </motion.article>
        </div>
      </div>
    </section>
  );
}
