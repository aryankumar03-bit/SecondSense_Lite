import { motion } from 'framer-motion';
import { ArrowRight, Play, Volume2, Vibrate, Camera, Cpu } from 'lucide-react';

export function HeroSection() {
  return (
    <section
      id="top"
      aria-labelledby="hero-heading"
      className="relative overflow-hidden border-b border-white/[0.06] pt-14 pb-20 sm:pt-20 sm:pb-28"
    >
      {/* Subtle atmospheric glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-40 left-1/2 h-[480px] w-[820px] -translate-x-1/2 rounded-full bg-cyan-500/[0.08] blur-[120px]"
      />
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 subtle-grid opacity-50" />

      <div className="relative mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 px-4 sm:px-6 lg:grid-cols-12 lg:gap-10 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55 }}
          className="lg:col-span-6"
        >
          <div className="inline-flex items-center gap-2.5 rounded-full border border-cyan-400/30 bg-cyan-500/10 px-3.5 py-1.5 text-xs font-medium tracking-wider text-cyan-200">
            <span className="h-2 w-2 rounded-full bg-cyan-400 animate-pulse" aria-hidden="true" />
            <span className="font-mono uppercase">EPICS PROJECT — INITIAL PROTOTYPE</span>
          </div>

          <h1
            id="hero-heading"
            className="mt-6 text-4xl font-semibold tracking-tight text-white sm:text-5xl lg:text-[3.4rem] lg:leading-[1.08]"
          >
            See the world differently.{' '}
            <span className="bg-gradient-to-r from-cyan-300 via-teal-200 to-slate-200 bg-clip-text text-transparent">
              Navigate it confidently.
            </span>
          </h1>

          <p className="mt-6 max-w-2xl text-base leading-relaxed text-slate-300 sm:text-lg">
            EchoField is an AI-assisted accessibility concept that transforms a smartphone into an
            intelligent environmental awareness companion for people who are blind or visually
            impaired.
          </p>

          <p className="mt-3 text-sm font-medium text-teal-300/90">
            An Extra Sense for Independent Mobility — designed to complement a white cane, not replace it.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <a
              href="#problem"
              className="inline-flex items-center gap-2 rounded-full bg-cyan-400 px-6 py-3 text-sm font-semibold text-slate-950 shadow-[0_0_28px_-4px_rgba(34,211,238,0.55)] transition hover:bg-cyan-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300 focus-visible:ring-offset-2 focus-visible:ring-offset-[#07090d]"
            >
              Explore the Concept
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </a>

            <a
              href="#demo"
              className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.04] px-6 py-3 text-sm font-semibold text-white transition hover:border-cyan-400/40 hover:bg-white/[0.08] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#07090d]"
            >
              <Play className="h-4 w-4 text-cyan-300" aria-hidden="true" />
              Experience the Demo
            </a>
          </div>

          <div className="mt-10 grid grid-cols-3 gap-4 border-t border-white/[0.08] pt-6 text-xs text-slate-400 sm:max-w-lg">
            <div>
              <p className="font-mono text-[11px] uppercase tracking-wider text-slate-500">Input</p>
              <p className="mt-1 font-medium text-slate-200">Smartphone Camera &amp; Sensors</p>
            </div>
            <div>
              <p className="font-mono text-[11px] uppercase tracking-wider text-slate-500">Analysis</p>
              <p className="mt-1 font-medium text-slate-200">Object &amp; Relative Depth</p>
            </div>
            <div>
              <p className="font-mono text-[11px] uppercase tracking-wider text-slate-500">Feedback</p>
              <p className="mt-1 font-medium text-slate-200">Audio, Speech &amp; Haptics</p>
            </div>
          </div>
        </motion.div>

        {/* Visual Representation: Chest-mounted smartphone + FOV + Detection + Audio/Haptic Feedback */}
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.65, delay: 0.1 }}
          className="lg:col-span-6"
        >
          <div className="glass-panel relative overflow-hidden rounded-3xl p-5 shadow-glow sm:p-6">
            <div className="mb-4 flex items-center justify-between border-b border-white/[0.07] pb-3">
              <div className="flex items-center gap-2">
                <Camera className="h-4 w-4 text-cyan-300" aria-hidden="true" />
                <span className="font-mono text-xs uppercase tracking-wider text-slate-300">
                  Conceptual System Illustration
                </span>
              </div>
              <span className="rounded-full border border-teal-400/30 bg-teal-500/10 px-2.5 py-0.5 font-mono text-[10px] uppercase text-teal-300">
                Non-Visual Output Loop
              </span>
            </div>

            <div className="relative rounded-2xl border border-white/[0.07] bg-[#06090f] p-4">
              <svg
                viewBox="0 0 640 380"
                role="img"
                aria-label="Illustration of a chest-mounted smartphone observing surroundings, drawing AI detection boxes around a person and chair, and sending directional audio and haptic feedback."
                className="h-auto w-full"
              >
                <defs>
                  <linearGradient id="fovGrad" x1="0%" y1="50%" x2="100%" y2="50%">
                    <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.28" />
                    <stop offset="65%" stopColor="#14b8a6" stopOpacity="0.09" />
                    <stop offset="100%" stopColor="#14b8a6" stopOpacity="0.01" />
                  </linearGradient>
                  <linearGradient id="phoneBody" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#1e293b" />
                    <stop offset="100%" stopColor="#0f172a" />
                  </linearGradient>
                </defs>

                {/* Horizon & perspective floor lines */}
                <line x1="20" y1="305" x2="620" y2="305" stroke="rgba(148,163,184,0.16)" strokeWidth="1" />
                <line x1="160" y1="305" x2="290" y2="215" stroke="rgba(148,163,184,0.08)" strokeWidth="1" />
                <line x1="600" y1="305" x2="360" y2="215" stroke="rgba(148,163,184,0.08)" strokeWidth="1" />

                {/* Camera Field-of-View Cone */}
                <polygon points="154,174 590,52 590,320" fill="url(#fovGrad)" />
                <line
                  x1="154"
                  y1="174"
                  x2="590"
                  y2="52"
                  stroke="rgba(34,211,238,0.45)"
                  strokeDasharray="5 5"
                  strokeWidth="1.2"
                />
                <line
                  x1="154"
                  y1="174"
                  x2="590"
                  y2="320"
                  stroke="rgba(34,211,238,0.45)"
                  strokeDasharray="5 5"
                  strokeWidth="1.2"
                />

                {/* User Silhouette with Chest-Mounted Smartphone */}
                <g transform="translate(52, 72)">
                  {/* Head */}
                  <circle cx="54" cy="36" r="22" fill="#131c2b" stroke="#334155" strokeWidth="1.5" />
                  {/* Torso */}
                  <path
                    d="M22,74 C22,62 86,62 86,74 L92,202 L16,202 Z"
                    fill="#111927"
                    stroke="#334155"
                    strokeWidth="1.5"
                  />
                  {/* Chest mount strap */}
                  <line x1="24" y1="95" x2="86" y2="108" stroke="#0891b2" strokeWidth="3" opacity="0.7" />
                  <line x1="86" y1="95" x2="24" y2="108" stroke="#0891b2" strokeWidth="3" opacity="0.7" />
                  {/* Smartphone device mounted forward */}
                  <rect
                    x="74"
                    y="82"
                    width="28"
                    height="46"
                    rx="5"
                    fill="url(#phoneBody)"
                    stroke="#22d3ee"
                    strokeWidth="1.8"
                  />
                  <circle cx="96" cy="96" r="4" fill="#22d3ee" />
                  <circle cx="96" cy="96" r="8" fill="none" stroke="#22d3ee" strokeOpacity="0.45" />

                  {/* Haptic vibration arcs near chest/phone */}
                  <path
                    d="M66,92 Q58,105 66,118"
                    fill="none"
                    stroke="#2dd4bf"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                  <path
                    d="M59,86 Q48,105 59,124"
                    fill="none"
                    stroke="#2dd4bf"
                    strokeWidth="1.5"
                    strokeOpacity="0.65"
                    strokeLinecap="round"
                  />

                  {/* Spatial audio waves near ear */}
                  <path
                    d="M24,26 Q14,36 24,46"
                    fill="none"
                    stroke="#38bdf8"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                  <path
                    d="M17,19 Q4,36 17,53"
                    fill="none"
                    stroke="#38bdf8"
                    strokeWidth="1.5"
                    strokeOpacity="0.55"
                    strokeLinecap="round"
                  />

                  {/* Complementary White Cane */}
                  <line
                    x1="88"
                    y1="158"
                    x2="162"
                    y2="233"
                    stroke="#cbd5e1"
                    strokeWidth="2.4"
                    strokeLinecap="round"
                  />
                  <circle cx="163" cy="234" r="3.5" fill="#f8fafc" />
                </g>

                {/* Detected Object 1: Chair (Left/Foreground) */}
                <g transform="translate(278, 178)">
                  <rect x="18" y="28" width="44" height="50" rx="4" fill="rgba(15,23,42,0.7)" stroke="#475569" strokeWidth="1.5" />
                  <line x1="22" y1="78" x2="22" y2="112" stroke="#475569" strokeWidth="3" />
                  <line x1="58" y1="78" x2="58" y2="112" stroke="#475569" strokeWidth="3" />
                  <rect
                    x="0"
                    y="0"
                    width="80"
                    height="122"
                    rx="6"
                    fill="rgba(20,184,166,0.06)"
                    stroke="#2dd4bf"
                    strokeWidth="1.8"
                  />
                  <rect x="0" y="-20" width="84" height="20" rx="4" fill="#0d9488" />
                  <text x="6" y="-6" fill="#f8fafc" fontSize="10.5" fontFamily="JetBrains Mono, monospace">
                    Chair · Left
                  </text>
                </g>

                {/* Detected Object 2: Person (Centre) */}
                <g transform="translate(414, 102)">
                  <circle cx="44" cy="36" r="15" fill="#1e293b" stroke="#64748b" strokeWidth="1.5" />
                  <path
                    d="M22,64 C22,52 66,52 66,64 L70,132 L18,132 Z"
                    fill="#1e293b"
                    stroke="#64748b"
                    strokeWidth="1.5"
                  />
                  <line x1="33" y1="132" x2="31" y2="188" stroke="#64748b" strokeWidth="5" strokeLinecap="round" />
                  <line x1="55" y1="132" x2="57" y2="188" stroke="#64748b" strokeWidth="5" strokeLinecap="round" />
                  <rect
                    x="0"
                    y="0"
                    width="88"
                    height="196"
                    rx="6"
                    fill="rgba(34,211,238,0.08)"
                    stroke="#22d3ee"
                    strokeWidth="2"
                  />
                  <rect x="0" y="-22" width="106" height="22" rx="4" fill="#0891b2" />
                  <text x="6" y="-7" fill="#f8fafc" fontSize="10.5" fontFamily="JetBrains Mono, monospace">
                    Person · Centre
                  </text>
                </g>

                {/* Detected Object 3: Doorway (Right/Background) */}
                <g transform="translate(534, 88)">
                  <rect x="8" y="8" width="56" height="132" rx="2" fill="rgba(15,23,42,0.55)" stroke="#475569" strokeWidth="1.5" />
                  <circle cx="54" cy="78" r="2.5" fill="#94a3b8" />
                  <rect
                    x="0"
                    y="0"
                    width="72"
                    height="148"
                    rx="6"
                    fill="rgba(56,189,248,0.05)"
                    stroke="#38bdf8"
                    strokeWidth="1.5"
                    strokeDasharray="4 3"
                  />
                  <rect x="-10" y="-20" width="84" height="20" rx="4" fill="#1e293b" stroke="#38bdf8" strokeWidth="1" />
                  <text x="-4" y="-6" fill="#bae6fd" fontSize="10" fontFamily="JetBrains Mono, monospace">
                    Door · Right
                  </text>
                </g>

                {/* Labels */}
                <text x="22" y="352" fill="#94a3b8" fontSize="11" fontFamily="Inter, sans-serif">
                  Smartphone + White Cane (Complementary)
                </text>
                <text
                  x="618"
                  y="352"
                  textAnchor="end"
                  fill="#67e8f9"
                  fontSize="11"
                  fontFamily="JetBrains Mono, monospace"
                >
                  Camera FOV → Detection → Audio/Haptic Cue
                </text>
              </svg>
            </div>

            {/* Live Conceptual Output Strip */}
            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
              <div className="rounded-xl border border-white/[0.07] bg-white/[0.02] p-3">
                <div className="flex items-center gap-2 text-xs font-medium text-cyan-300">
                  <Cpu className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>Scene Analysis</span>
                </div>
                <p className="mt-1 text-xs text-slate-300">Objects &amp; horizontal position</p>
              </div>
              <div className="rounded-xl border border-white/[0.07] bg-white/[0.02] p-3">
                <div className="flex items-center gap-2 text-xs font-medium text-teal-300">
                  <Volume2 className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>Spatial Audio + Speech</span>
                </div>
                <p className="mt-1 text-xs text-slate-300">&ldquo;Person detected ahead.&rdquo;</p>
              </div>
              <div className="rounded-xl border border-white/[0.07] bg-white/[0.02] p-3">
                <div className="flex items-center gap-2 text-xs font-medium text-cyan-200">
                  <Vibrate className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>Haptic Pulses</span>
                </div>
                <p className="mt-1 text-xs text-slate-300">Non-visual urgency cues</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
