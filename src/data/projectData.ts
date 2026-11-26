export type DirectionZone = 'Left' | 'Centre' | 'Right';

export interface GuidedScenario {
  id: string;
  title: string;
  shortLabel: string;
  objectName: string;
  direction: DirectionZone;
  proximityOrStatusLabel: string;
  proximityOrStatusValue: string;
  isHazard?: boolean;
  simulatedConfidence: string;
  voiceFeedback: string;
  audioCueSummary: string;
  hapticSummary: string;
  vibratePattern: number[];
  pulseCount: number;
  pulseIntervalMs: number;
  pitchHz: number;
  sceneType: 'person' | 'chair' | 'obstacle' | 'door' | 'stairs';
}

export const GUIDED_SCENARIOS: GuidedScenario[] = [
  {
    id: 'person-ahead',
    title: 'Scenario 1: Person ahead',
    shortLabel: 'Person ahead',
    objectName: 'Person',
    direction: 'Centre',
    proximityOrStatusLabel: 'Proximity',
    proximityOrStatusValue: 'Near',
    simulatedConfidence: 'Simulated Example (Reference)',
    voiceFeedback: 'Person detected ahead.',
    audioCueSummary: 'Centred stereo cue · Fast dual-pulse (near)',
    hapticSummary: 'Double short pulse (120 ms · pause · 120 ms)',
    vibratePattern: [120, 70, 120],
    pulseCount: 2,
    pulseIntervalMs: 140,
    pitchHz: 540,
    sceneType: 'person',
  },
  {
    id: 'chair-left',
    title: 'Scenario 2: Chair on the left',
    shortLabel: 'Chair on left',
    objectName: 'Chair',
    direction: 'Left',
    proximityOrStatusLabel: 'Proximity',
    proximityOrStatusValue: 'Moderate',
    simulatedConfidence: 'Simulated Example (Reference)',
    voiceFeedback: 'A chair is detected on your left.',
    audioCueSummary: 'Left-panned stereo cue · Gentle single pulse',
    hapticSummary: 'Single medium pulse (160 ms)',
    vibratePattern: [160],
    pulseCount: 1,
    pulseIntervalMs: 220,
    pitchHz: 440,
    sceneType: 'chair',
  },
  {
    id: 'obstacle-right',
    title: 'Scenario 3: Obstacle on the right',
    shortLabel: 'Obstacle on right',
    objectName: 'Obstacle',
    direction: 'Right',
    proximityOrStatusLabel: 'Proximity',
    proximityOrStatusValue: 'Near',
    simulatedConfidence: 'Simulated Example (Reference)',
    voiceFeedback: 'An obstacle is detected on your right.',
    audioCueSummary: 'Right-panned stereo cue · Rapid dual-pulse',
    hapticSummary: 'Two rapid pulses (100 ms · 60 ms · 100 ms)',
    vibratePattern: [100, 60, 100],
    pulseCount: 2,
    pulseIntervalMs: 130,
    pitchHz: 580,
    sceneType: 'obstacle',
  },
  {
    id: 'door-ahead',
    title: 'Scenario 4: Door ahead',
    shortLabel: 'Door ahead',
    objectName: 'Door',
    direction: 'Centre',
    proximityOrStatusLabel: 'Proximity',
    proximityOrStatusValue: 'Moderate',
    simulatedConfidence: 'Simulated Example (Reference)',
    voiceFeedback: 'A door appears to be ahead.',
    audioCueSummary: 'Centred stereo cue · Warm beacon tone',
    hapticSummary: 'Soft confirmation tap (90 ms)',
    vibratePattern: [90],
    pulseCount: 1,
    pulseIntervalMs: 240,
    pitchHz: 494,
    sceneType: 'door',
  },
  {
    id: 'descending-stairs',
    title: 'Scenario 5: Descending stairs',
    shortLabel: 'Descending stairs',
    objectName: 'Possible descending stairs',
    direction: 'Centre',
    proximityOrStatusLabel: 'Status',
    proximityOrStatusValue: 'Potential hazard',
    isHazard: true,
    simulatedConfidence: 'Simulated Example (Reference)',
    voiceFeedback:
      'Possible descending stairs detected. Stop and verify using your established mobility method.',
    audioCueSummary: 'Centred urgent triple-pulse · High-priority alert tone',
    hapticSummary: 'Three urgent pulses (180 ms · 70 ms · 180 ms · 70 ms · 240 ms)',
    vibratePattern: [180, 70, 180, 70, 240],
    pulseCount: 3,
    pulseIntervalMs: 135,
    pitchHz: 680,
    sceneType: 'stairs',
  },
];

export const NAVIGATION_ITEMS = [
  { label: 'Concept', href: '#problem' },
  { label: 'Solution', href: '#solution' },
  { label: 'Architecture', href: '#architecture' },
  { label: 'Live Demo', href: '#demo' },
  { label: 'Technology', href: '#tech-stack' },
  { label: 'Roadmap', href: '#roadmap' },
  { label: 'Safety', href: '#safety' },
];
