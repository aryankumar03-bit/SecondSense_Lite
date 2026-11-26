import { MotionConfig } from 'framer-motion';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { ProblemSection } from './components/ProblemSection';
import { SolutionSection } from './components/SolutionSection';
import { ArchitectureSection } from './components/ArchitectureSection';
import { DemoSection } from './components/DemoSection';
import { TechStackSection } from './components/TechStackSection';
import { RoadmapSection } from './components/RoadmapSection';
import { SafetySection } from './components/SafetySection';
import { Footer } from './components/Footer';

export function App() {
  return (
    <MotionConfig reducedMotion="user">
      <div className="min-h-screen bg-[#07090d] text-slate-100">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-cyan-400 focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-slate-950"
        >
          Skip to main content
        </a>

        <Navbar />

        <main id="main-content">
          <HeroSection />
          <ProblemSection />
          <SolutionSection />
          <ArchitectureSection />
          <DemoSection />
          <TechStackSection />
          <RoadmapSection />
          <SafetySection />
        </main>

        <Footer />
      </div>
    </MotionConfig>
  );
}

export default App;
