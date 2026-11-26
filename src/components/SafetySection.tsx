import { ShieldAlert, AlertOctagon } from 'lucide-react';

const LIMITATIONS = [
  'EchoField is designed to complement a white cane, not replace it.',
  'The system cannot guarantee the detection of every obstacle.',
  'Camera performance may be affected by lighting, occlusion, and camera positioning.',
  'Depth estimation may be inaccurate and does not measure exact physical distance.',
  'Audio feedback should not unnecessarily block environmental sounds.',
  'Real-world usability must be evaluated with people with visual impairments.',
  'The system must never independently tell users that it is safe to cross a road or proceed through a potentially hazardous situation.',
];

export function SafetySection() {
  return (
    <section
      id="safety"
      aria-labelledby="safety-heading"
      className="border-b border-white/[0.06] py-20 sm:py-24"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <p className="font-mono text-xs uppercase tracking-widest text-amber-300">
            07 · Safety, Ethics &amp; Limitations
          </p>
          <h2
            id="safety-heading"
            className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-4xl"
          >
            Assistive technology must be honest about its limitations.
          </h2>
          <p className="mt-4 text-base leading-relaxed text-slate-300">
            Responsible accessibility engineering requires transparent boundaries, conservative
            guarantees, and user-centred validation before any real-world reliance.
          </p>
        </div>

        {/* Prominent Safety Banner */}
        <div
          role="note"
          aria-label="Important safety notice"
          className="mt-10 rounded-2xl border border-amber-400/35 bg-amber-500/[0.08] p-6 sm:p-7"
        >
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-amber-400/40 bg-amber-500/15 text-amber-300">
              <AlertOctagon className="h-6 w-6" aria-hidden="true" />
            </div>
            <div>
              <p className="font-mono text-xs font-semibold uppercase tracking-widest text-amber-300">
                Critical Safety Boundary
              </p>
              <p className="mt-2 text-base font-medium leading-relaxed text-amber-50 sm:text-lg">
                EchoField aims to provide additional environmental awareness. It is not a certified
                navigation device and must not be relied upon as the sole means of mobility or
                hazard avoidance.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2">
          {LIMITATIONS.map((point, index) => (
            <div
              key={point}
              className="glass-panel flex items-start gap-3.5 rounded-2xl p-5"
            >
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/[0.04] font-mono text-xs font-semibold text-cyan-300">
                {index + 1}
              </span>
              <div className="flex items-start gap-2.5">
                <ShieldAlert
                  className="mt-0.5 h-4 w-4 shrink-0 text-amber-300/80"
                  aria-hidden="true"
                />
                <p className="text-sm leading-relaxed text-slate-200">{point}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
