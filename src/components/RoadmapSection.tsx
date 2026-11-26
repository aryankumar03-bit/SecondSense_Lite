import { motion } from 'framer-motion';
import { CheckCircle2, CircleDot, Clock } from 'lucide-react';

const ROADMAP_STAGES = [
  {
    phase: 'REVIEW 1 — INITIAL PROTOTYPE',
    statusLabel: 'Current Evaluation Stage',
    statusType: 'current' as const,
    icon: CircleDot,
    milestones: [
      'Define the problem and objectives.',
      'Establish the system architecture.',
      'Develop the project presentation website.',
      'Demonstrate the proposed camera-to-feedback interaction through live webcam object detection and a guided simulation.',
      'Finalise the initial technology stack.',
    ],
  },
  {
    phase: 'REVIEW 2 — CORE FUNCTIONALITY',
    statusLabel: 'Next Evaluation Stage',
    statusType: 'planned' as const,
    icon: Clock,
    milestones: [
      'Develop the initial Android camera interface.',
      'Integrate an actual on-device object detection model.',
      'Implement basic object identification.',
      'Add spoken feedback.',
      'Begin testing in controlled environments.',
    ],
  },
  {
    phase: 'REVIEW 3 — INTEGRATION AND VALIDATION',
    statusLabel: 'Final Evaluation Stage',
    statusType: 'planned' as const,
    icon: Clock,
    milestones: [
      'Improve the object recognition pipeline.',
      'Explore depth and directional feedback.',
      'Integrate additional accessibility features where feasible.',
      'Conduct controlled usability testing.',
      'Document limitations, results, and future scope.',
    ],
  },
];

export function RoadmapSection() {
  return (
    <section
      id="roadmap"
      aria-labelledby="roadmap-heading"
      className="border-b border-white/[0.06] py-20 sm:py-24"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <p className="font-mono text-xs uppercase tracking-widest text-cyan-300">
            06 · Development Roadmap
          </p>
          <h2
            id="roadmap-heading"
            className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-4xl"
          >
            Phased EPICS academic evaluation roadmap.
          </h2>
          <p className="mt-4 text-base leading-relaxed text-slate-300">
            A structured three-stage progression from problem definition and browser-based proof of
            concept to mobile integration and controlled validation.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-6 lg:grid-cols-3">
          {ROADMAP_STAGES.map((stage, idx) => {
            const Icon = stage.icon;
            const isCurrent = stage.statusType === 'current';
            return (
              <motion.article
                key={stage.phase}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.4, delay: idx * 0.08 }}
                className={`relative flex flex-col rounded-3xl border p-6 sm:p-7 ${
                  isCurrent
                    ? 'border-cyan-400/45 bg-gradient-to-b from-cyan-500/[0.09] to-surface/90 shadow-glow'
                    : 'glass-panel'
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span
                    className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 font-mono text-[11px] uppercase tracking-wider ${
                      isCurrent
                        ? 'border border-cyan-400/40 bg-cyan-500/15 text-cyan-200'
                        : 'border border-white/10 bg-white/[0.03] text-slate-400'
                    }`}
                  >
                    <Icon className="h-3.5 w-3.5" aria-hidden="true" />
                    {stage.statusLabel}
                  </span>
                  <span className="font-mono text-xs text-slate-500">0{idx + 1}</span>
                </div>

                <h3 className="mt-5 font-mono text-base font-semibold tracking-wide text-white">
                  {stage.phase}
                </h3>

                <ul className="mt-5 space-y-3">
                  {stage.milestones.map((milestone) => (
                    <li key={milestone} className="flex items-start gap-2.5 text-sm text-slate-300">
                      <CheckCircle2
                        className={`mt-0.5 h-4 w-4 shrink-0 ${
                          isCurrent ? 'text-cyan-400' : 'text-slate-500'
                        }`}
                        aria-hidden="true"
                      />
                      <span>{milestone}</span>
                    </li>
                  ))}
                </ul>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
