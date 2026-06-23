# IdeaDNA Workspace Summary & Memory

This file serves as a persistent "memory block" for the IdeaDNA project, detailing the architecture, components, design system, and code structure. Reading this file prevents the agent from having to analyze the entire code tree repeatedly.

---

## 1. Project Overview & Aesthetics
- **Platform Name**: IdeaDNA (AI concept mapping and blueprint platform).
- **Core Aesthetic**: Premium Notion-style design framework.
  - **Background**: Warm, paper-soft off-white canvas `#f6f5f4`.
  - **Borders**: Hairline borders `#e6e6e6` with subtle layered shadows.
  - **Text**: Crisp `#000000` text with tight letter-spacing for headers.
  - **Primary CTA**: Notion Blue `#0075de` pill buttons (rounded-full).
  - **Sticker Palette Accent**: Small decorative category tags (Sticker Purple `#d6b6f6`, Sticker Teal `#2a9d99`, Sticker Sky `#62aef0`).

---

## 2. Technology Stack
- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS v3
- **3D Render Context**: React Three Fiber (R3F) & Three.js (React 18 compatible)
- **Flow Chart Diagrams**: React Flow (v11)
- **Transitions/Hover Effects**: Framer Motion

---

## 3. Directory & File Mapping

### Core Styles & Layout
- **[globals.css](file:///C:/Users/af261/.gemini/antigravity/scratch/ideadna-landing/src/app/globals.css)**:
  - Custom scrollbar, Notion-style shadows (`notion-shadow`, `notion-shadow-sm`, `notion-shadow-lg`), and glassmorphism.
  - Custom overrides for React Flow nodes, edges (glowing/dashing connector paths), and controls to fit the Notion interface.
- **[tailwind.config.ts](file:///C:/Users/af261/.gemini/antigravity/scratch/ideadna-landing/tailwind.config.ts)**:
  - Extends colors: `notionBg`, `notionBorder`, `notionBlue`, `notionGray`, `stickerPurple`, `stickerTeal`, `stickerSky`.
  - Configures standard sans-serif font system (Inter primary).
- **[layout.tsx](file:///C:/Users/af261/.gemini/antigravity/scratch/ideadna-landing/src/app/layout.tsx)**:
  - Native loading of Inter font to optimize page performance.
  - Sets up SEO Metadata (title tags, descriptions, keywords).

### Key Components
- **[DnaCanvas.tsx](file:///C:/Users/af261/.gemini/antigravity/scratch/ideadna-landing/src/components/DnaCanvas.tsx)** (Dynamic Import: `ssr: false`):
  - Renders a double-helix wireframe using lines, custom nodes, and point attributes.
  - Lerps camera `position` and `lookAt` dynamically based on window scroll progress.
  - Listens to mouse position pointers to trigger a subtle orbit effect.
  - Manages a high-performance particle emitter using mutable references (`THREE.Points`). Spawns a burst of random color particles when a new concept is mutated.
- **[EvolutionTree.tsx](file:///C:/Users/af261/.gemini/antigravity/scratch/ideadna-landing/src/components/EvolutionTree.tsx)** (Dynamic Import: `ssr: false`):
  - Renders React Flow graph connections inside a simulated json file container window.
  - Features custom Notion nodes representing idea mutation phases.
- **[IdeaCards.tsx](file:///C:/Users/af261/.gemini/antigravity/scratch/ideadna-landing/src/components/IdeaCards.tsx)**:
  - 3-column features overlay.
  - Framer Motion `motion.div` configured to lift by `y: -6` on hover with a smooth spring physics curve.

### Main View
- **[page.tsx](file:///C:/Users/af261/.gemini/antigravity/scratch/ideadna-landing/src/app/page.tsx)**:
  - Sticky header navigation.
  - Hero layout detailing IdeaDNA features.
  - **Idea Generator**: A glassmorphic text input box. Submitting an idea increments `triggerMutation` (launching the WebGL 3D canvas particle explosion) and dynamically appends a custom mutation node/edge connected to the Evolution Tree.
  - **DNA Explorer**: Interactive ranges/sliders that update helix scale parameters in real time.

---

## 4. Run & Development Commands
- **Local Dev Server**: `npm run dev` (Runs on [http://localhost:3000](http://localhost:3000))
- **Production Build**: `npm run build` (Ensured to compile 100% warning-free)
