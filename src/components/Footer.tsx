import { Eye, ExternalLink, Users, GraduationCap } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-[#05070b] py-16 text-slate-300">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 border-b border-white/[0.08] pb-12 lg:grid-cols-12">
          {/* Brand & Academic Context */}
          <div className="lg:col-span-5">
            <div className="flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-cyan-400/30 bg-cyan-500/10 text-cyan-300">
                <Eye className="h-5 w-5" aria-hidden="true" />
              </span>
              <div>
                <p className="text-base font-semibold text-white">SecondSense</p>
                <p className="text-xs text-teal-300">An Extra Sense for Independent Mobility.</p>
              </div>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-slate-400">
              Engineering Projects in Community Service (EPICS) — Early-stage academic concept and
              browser prototype exploring AI-assisted environmental awareness for people who are
              blind or visually impaired.
            </p>
            <div className="mt-5">
              <a
                href="https://github.com/GargBhavya-tech/secondsense"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-3.5 py-2 text-xs font-medium text-cyan-200 transition hover:border-cyan-400/40 hover:bg-cyan-500/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
              >
                <span>GitHub Reference &amp; Architectural Inspiration</span>
                <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
              </a>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="lg:col-span-3">
            <h2 className="font-mono text-xs font-semibold uppercase tracking-widest text-white">
              Project Sections
            </h2>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li>
                <a href="#top" className="text-slate-400 transition hover:text-cyan-300">
                  Project Overview
                </a>
              </li>
              <li>
                <a href="#problem" className="text-slate-400 transition hover:text-cyan-300">
                  The Problem
                </a>
              </li>
              <li>
                <a href="#solution" className="text-slate-400 transition hover:text-cyan-300">
                  Core Concept
                </a>
              </li>
              <li>
                <a href="#architecture" className="text-slate-400 transition hover:text-cyan-300">
                  System Architecture
                </a>
              </li>
              <li>
                <a href="#demo" className="text-slate-400 transition hover:text-cyan-300">
                  Interactive Demo
                </a>
              </li>
              <li>
                <a href="#tech-stack" className="text-slate-400 transition hover:text-cyan-300">
                  Technology
                </a>
              </li>
              <li>
                <a href="#roadmap" className="text-slate-400 transition hover:text-cyan-300">
                  Development Roadmap
                </a>
              </li>
            </ul>
          </div>

          {/* Editable Team & Supervisor Placeholders */}
          <div className="lg:col-span-4">
            <h2 className="font-mono text-xs font-semibold uppercase tracking-widest text-white">
              EPICS Team &amp; Supervision (Editable Placeholders)
            </h2>
            <div className="mt-4 space-y-3 rounded-2xl border border-dashed border-white/15 bg-white/[0.02] p-4 text-xs">
              <div className="flex items-start gap-2.5">
                <Users className="mt-0.5 h-4 w-4 shrink-0 text-cyan-300" aria-hidden="true" />
                <div>
                  <p className="font-semibold text-slate-200">Project Team Members</p>
                  <ul className="mt-1 space-y-1 text-slate-400">
                    <li>[Edit: Team Member 1 — Name &amp; Roll No.]</li>
                    <li>[Edit: Team Member 2 — Name &amp; Roll No.]</li>
                    <li>[Edit: Team Member 3 — Name &amp; Roll No.]</li>
                    <li>[Edit: Team Member 4 — Name &amp; Roll No.]</li>
                  </ul>
                </div>
              </div>
              <div className="border-t border-white/[0.07] pt-3 flex items-start gap-2.5">
                <GraduationCap
                  className="mt-0.5 h-4 w-4 shrink-0 text-teal-300"
                  aria-hidden="true"
                />
                <div>
                  <p className="font-semibold text-slate-200">Faculty Supervisor</p>
                  <p className="mt-0.5 text-slate-400">
                    [Edit: Faculty Supervisor Name — Department / Institution]
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 flex flex-col items-start justify-between gap-3 text-xs text-slate-500 sm:flex-row sm:items-center">
          <p>
            SecondSense · EPICS Academic Prototype. Conceptual mobile features are under active
            development.
          </p>
          <p className="font-mono">Built with React, TypeScript, TensorFlow.js &amp; Web APIs</p>
        </div>
      </div>
    </footer>
  );
}
