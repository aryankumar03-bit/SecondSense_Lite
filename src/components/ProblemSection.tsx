import { motion } from 'framer-motion';
import {
  UserSearch,
  AlertTriangle,
  Compass,
  FileText,
  DoorOpen,
  Activity,
  CheckCircle2,
  Plus,
} from 'lucide-react';

const CHALLENGES = [
  {
    icon: UserSearch,
    title: 'Identifying objects & people',
    description:
      'Understanding what objects, furniture, or people are present in unfamiliar indoor and outdoor surroundings.',
  },
  {
    icon: AlertTriangle,
    title: 'Head and torso height obstacles',
    description:
      'Overhanging branches, open cabinet doors, or elevated signage often lie above the reach of a ground cane.',
  },
  {
    icon: Compass,
    title: 'Direction & relative proximity',
    description:
      'Knowing whether an obstacle lies to the left, centre, or right, and whether it is relatively close or farther away.',
  },
  {
    icon: FileText,
    title: 'Signs, labels & printed text',
    description:
      'Reading room numbers, bus boards, notices, and everyday labels without needing constant assistance.',
  },
  {
    icon: DoorOpen,
    title: 'Entrances, exits & familiar objects',
    description:
      'Locating doorways, seating, counters, or everyday items in crowded or newly visited spaces.',
  },
  {
    icon: Activity,
    title: 'Dynamic environmental changes',
    description:
      'Responding as people move, doors open, or surroundings shift while walking.',
  },
];

const WHITE_CANE_TRAITS = [
  'Tactile ground-level feedback.',
  'Physical contact with obstacles.',
  'No battery requirement.',
];

const SECONDSENSE_TRAITS = [
  'Camera-based environmental awareness.',
  'Semantic object identification.',
  'Potential awareness of head-height obstacles.',
  'Audio and haptic information.',
];

export function ProblemSection() {
  return (
    <section
      id="problem"
      aria-labelledby="problem-heading"
      className="border-b border-white/[0.06] py-20 sm:py-24"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <p className="font-mono text-xs uppercase tracking-widest text-cyan-300">
            01 · The Problem
          </p>
          <h2
            id="problem-heading"
            className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-4xl"
          >
            Everyday navigation should not require constant uncertainty.
          </h2>
          <p className="mt-4 text-base leading-relaxed text-slate-300">
            Independent mobility involves continuous awareness of obstacles, spatial layout, and
            contextual cues. When visual information is unavailable, key details beyond physical
            touch remain hard to perceive quickly.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {CHALLENGES.map((item, idx) => {
            const Icon = item.icon;
            return (
              <motion.article
                key={item.title}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.4, delay: idx * 0.05 }}
                className="glass-panel rounded-2xl p-6 transition hover:border-cyan-400/25"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-cyan-300">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </div>
                <h3 className="mt-4 text-base font-semibold text-white">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-400">{item.description}</p>
              </motion.article>
            );
          })}
        </div>

        {/* White Cane + SecondSense Complementary Comparison */}
        <div className="mt-14 glass-panel rounded-3xl p-6 sm:p-8">
          <div className="max-w-3xl">
            <span className="font-mono text-xs uppercase tracking-wider text-teal-300">
              Complementary Mobility Model
            </span>
            <h3 className="mt-2 text-xl font-semibold text-white sm:text-2xl">
              Supporting the white cane, never replacing it.
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-slate-300 sm:text-base">
              A white cane remains an essential mobility aid. However, it primarily provides tactile
              information about the ground-level environment within its reach. SecondSense explores
              how smartphone-based environmental awareness could complement this information.
            </p>
          </div>

          <div className="mt-8 grid grid-cols-1 items-stretch gap-5 lg:grid-cols-11">
            <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 lg:col-span-5">
              <div className="flex items-center justify-between">
                <h4 className="font-mono text-sm font-semibold uppercase tracking-wider text-slate-200">
                  White Cane
                </h4>
                <span className="rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-0.5 text-[11px] text-slate-300">
                  Primary Mobility Aid
                </span>
              </div>
              <ul className="mt-5 space-y-3">
                {WHITE_CANE_TRAITS.map((trait) => (
                  <li key={trait} className="flex items-start gap-3 text-sm text-slate-300">
                    <CheckCircle2
                      className="mt-0.5 h-4 w-4 shrink-0 text-slate-400"
                      aria-hidden="true"
                    />
                    <span>{trait}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex items-center justify-center lg:col-span-1">
              <div className="flex h-10 w-10 items-center justify-center rounded-full border border-cyan-400/30 bg-cyan-500/10 text-cyan-300">
                <Plus className="h-5 w-5" aria-hidden="true" />
                <span className="sr-only">Complemented by</span>
              </div>
            </div>

            <div className="rounded-2xl border border-cyan-400/25 bg-cyan-500/[0.04] p-6 lg:col-span-5">
              <div className="flex items-center justify-between">
                <h4 className="font-mono text-sm font-semibold uppercase tracking-wider text-cyan-300">
                  SecondSense
                </h4>
                <span className="rounded-full border border-cyan-400/30 bg-cyan-500/10 px-2.5 py-0.5 text-[11px] text-cyan-200">
                  Proposed Companion
                </span>
              </div>
              <ul className="mt-5 space-y-3">
                {SECONDSENSE_TRAITS.map((trait) => (
                  <li key={trait} className="flex items-start gap-3 text-sm text-slate-200">
                    <CheckCircle2
                      className="mt-0.5 h-4 w-4 shrink-0 text-cyan-400"
                      aria-hidden="true"
                    />
                    <span>{trait}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
