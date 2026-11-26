# SecondSense

**An Extra Sense for Independent Mobility**

SecondSense is an Engineering Projects in Community Service (EPICS) academic concept and early-stage browser prototype exploring AI-assisted environmental awareness for people who are blind or visually impaired. It is designed to **complement a white cane, not replace it**, by translating camera observations into non-visual feedback (spoken descriptions, directional stereo audio cues, pulse patterns, and haptics).

> **Project Stage:** EPICS Review 1 — Initial Prototype & Presentation Website.  
> This repository contains the web presentation and early browser prototype, **not** the final Android application.

---

## What This Prototype Demonstrates

1. **Problem & Complementary Mobility Model**
   - Explains daily navigation challenges beyond ground-level cane reach (e.g., torso/head-height obstacles, identifying people/seating/doorways, reading signs) and how smartphone-based awareness complements a traditional white cane.
2. **Proposed 6-Stage System Architecture**
   - Interactive breakdown of the target pipeline: Camera Input → Computer Vision → Relative Depth Estimation → Sensor & Context Processing → Target Prioritisation → Non-Visual User Feedback.
3. **Interactive SecondSense Demonstration**
   - **Mode 1 — Real-Time Webcam Object Detection (`Early Browser Prototype`):**
     - Uses `navigator.mediaDevices.getUserMedia()` for local webcam access (frames stay in the browser and are never sent to an external server).
     - Runs TensorFlow.js with the **COCO-SSD** (`lite_mobilenet_v2`) model locally in the browser at a throttled interval (~3 FPS).
     - Draws bounding boxes with confidence scores and reports horizontal camera-view zones (`left side of camera view`, `centre of camera view`, `right side of camera view`).
     - Supports cooldown-guarded Web Speech synthesis, directional Web Audio stereo panning (`StereoPannerNode`), and `navigator.vibrate` testing where supported.
     - *Scope note:* Does not perform reliable depth estimation, metric distance measurement, staircase detection, or collision avoidance.
   - **Mode 2 — Guided Simulation (`Predefined Examples`):**
     - Five selectable mobility scenarios (person ahead, chair on left, obstacle on right, door ahead, possible descending stairs) demonstrating intended speech, directional stereo audio, and haptic cue behaviour without requiring a webcam or live AI model.
4. **Technology Stack, Evaluation Roadmap & Safety Boundaries**
   - Separates active browser-prototype technologies from planned Android (`Kotlin`, `CameraX`, `TensorFlow Lite`, `YOLO`, `Depth Anything V2`, on-device `OCR`) milestones across Reviews 1–3, alongside explicit safety limitations.

---

## Tech Stack (Website Prototype)

- **Frontend:** React 18, TypeScript, Vite 6, Tailwind CSS 3
- **UI & Motion:** Lucide React, Framer Motion (with `prefers-reduced-motion` support)
- **Browser ML & Device APIs:** `@tensorflow/tfjs`, `@tensorflow-models/coco-ssd`, `getUserMedia`, Web Speech API (`speechSynthesis`), Web Audio API (`AudioContext` + `StereoPannerNode`), Vibration API (`navigator.vibrate`)

---

## Running Locally

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or newer recommended)
- Google Chrome or another modern browser (use `http://localhost:5173/` for webcam access)

### Setup & Start

```bash
git clone https://github.com/aryankumar03-bit/SecondSense_Lite.git
cd SecondSense_Lite
npm install
npm run dev
```

Open **http://localhost:5173/** in your browser.

### Production Build

```bash
npm run build
npm run preview
```

---

## Deploying to Share Online

Because webcam access (`getUserMedia`) requires **HTTPS** outside `localhost`, deploy the built site to an HTTPS host such as **Vercel** or **Netlify**:

- **Build command:** `npm run build`
- **Output directory:** `dist`

---

## Safety & Limitations

> **Important:** SecondSense aims to provide additional environmental awareness. It is not a certified navigation device and must not be relied upon as the sole means of mobility or hazard avoidance.

- Always intended to complement an established mobility aid such as a white cane.
- Cannot guarantee detection of every obstacle; camera performance varies with lighting, occlusion, and framing.
- Browser prototype reports 2D camera-view regions only—not calibrated physical distances.

---

## Reference & Credits

- **Architectural Inspiration:** [GargBhavya-tech/secondsense](https://github.com/GargBhavya-tech/secondsense)
- **Team Members:** `[Edit in README.md and src/components/Footer.tsx]`
- **Faculty Supervisor:** `[Edit in README.md and src/components/Footer.tsx]`
