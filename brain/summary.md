# IdeaDNA Workspace Summary & Memory

## Project Overview
AI-Powered Idea Evolution Platform. Next.js 14 + Python FastAPI + SQLite (dev) / PostgreSQL (prod) + OpenAI.

## Frontend (Next.js 14 + Tailwind CSS + Framer Motion)
| Route | Page | Notes |
|---|---|---|
| `/` | Landing — glassmorphic navbar, video hero, animated heading, search pill, clean footer | 🆕 Redesigned |
| `/login` | Sign-in with email/password + OAuth | — |
| `/register` | Sign-up flow | — |
| `/onboarding` | 7-step wizard (skill, budget, team, timeline, tech, industry) + Review & Confirm | — |
| `/dashboard` | Project management, stats, search, filters | — |
| `/generate` | Idea Generator v2 — platform selector, input, pipeline, scoring | — |
| `/evolve` | Evolution Engine — critic report, React Flow tree | — |
| `/analyze` | Code Archaeology — 3 input tabs, 6-agent pipeline | — |
| `/project/[id]` | Deep-dive — blueprint accordion, UI mockup | — |
| `/sources` | Data source management | — |

## Design System (Current)
- **Colors**: `#EDEEF5` bg-base (off-white), `#9fff00` brand-green (selection), `#1a1a1a` text
- **Typography**: Inter (sans) + Outfit (display) via `next/font/google`
- **Glassmorphism**: `bg-gradient-to-b from-[#f1f1f1]/80 to-transparent backdrop-blur-[2px]`
- **Selection**: `selection:bg-brand-green selection:text-black`
- **Components**: Navbar (fixed, 12-col grid, animated hamburger, mobile drawer via AnimatePresence), Footer (4-col grid with Services/Resources/Company)
- **3D Components** (removed from landing, kept on other pages): `ThreeBackground`, `DnaCanvas`

## Backend (Python FastAPI)

### Architecture
- **FastAPI** app with CORS middleware, health check, 6 routers
- **SQLAlchemy** ORM — runs on PostgreSQL with pgvector OR SQLite (auto-detected via `database.py`)
- **10 database tables**: `users`, `curated_ideas`, `projects`, `ideas`, `blueprints`, `ui_mockups`, `enhanced_ideas`, `archaeology_reports`, plus alembic migrations

### SQLite Adaptation
- PostgreSQL not available on dev machine → SQLite fallback
- `Vector()` factory function in `models/idea.py` returns `PGVector` (PostgreSQL) or `JSON` (SQLite)
- `retriever.py` skips pgvector queries when `USE_PGVECTOR=False`
- `Config.env_file = ".env"` reads from backend directory

### 6-Agent Generator Pipeline
1. **InputParserAgent** (temp 0.3): Extracts problem_statement, platform, audience, tone, keywords
2. **RetrieverAgent** (no AI): Semantic search in curated_ideas (pgvector) or fallback ORDER BY innovation_score
3. **RankerAgent** (no AI): Weighted ranking algorithm
4. **UpgradeAgent** (temp 0.6): Personalizes curated ideas for user profile
5. **ScorerAgent** (temp 0.2): 8-dimension scoring (originality, feasibility, market, complexity, scalability, revenue, competitive_edge, time_to_market) → overall + verdict
6. **OutputFormatterAgent** (no AI): Formats cards with colors, badges, icons

**Fallback when no curated ideas**: `GenerationService` generates fresh ideas from scratch using OpenAI (or mock data if API fails/quota exhausted)

### Additional Agents
- **BlueprintArchitectAgent** (temp 0.4): 7-section production blueprint — lazy-loaded on idea selection
- **UIDesignerAgent** (temp 0.5): HTML/CSS Tailwind landing page with 5 style variants, 4 screen types — lazy-loaded
- **CriticAgent** (temp 0.3) + **EvolverAgent** (temp 0.6): Evolution engine with React Flow visualization
- **Archaeology Pipeline** (6 agents): CodeParser, PatternDetector, IdeaHistorian, DevPsychologist, Scorer, Evolver

### API Endpoints (v2.0)
**Generator Pipeline**: `POST /generator/full`, `POST /generator/parse`
**Projects**: `POST /projects`, `GET /projects`, `GET /projects/{id}`, `GET /projects/{id}/ideas`, `DELETE /projects/{id}`
**Ideas**: `POST /ideas/generate`, `POST /ideas/select?project_id=X`, `GET /ideas/{id}/blueprint`, `GET /ideas/{id}/mockup`, `GET /ideas/trending`, `GET /ideas/similar`, `POST /ideas/{id}/feedback`
**Curated**: `GET /curated`, `GET /curated/platforms`, `GET /curated/trending`, `POST /curated/submit`
**User**: `GET /user/profile`, `POST /user/profile`, `PATCH /user/profile`, `GET /user/projects`, `GET /user/stats`
**Evolution**: 7 endpoints for evolution engine
**Archaeology**: `POST /analyze`, `GET /report/{project_id}`
**Export**: `GET /export/blueprint/{id}/{format}`, `GET /export/mockup/{id}`
**Score**: `POST /score/idea`, `POST /score/batch`, `GET /score/benchmarks`
**Mockup**: `POST /mockup/generate`, `POST /mockup/component`, `GET /mockup/styles`, `GET /mockup/screens`
**Health**: `GET /health`

### Frontend API Client (`src/lib/api.ts`)
- All calls wrapped with 5s AbortController timeout
- Response format: `{ success, data }` (changed from `{ status, data }`)
- 16 React Query hooks in `src/lib/hooks.ts`

## Current Session Changes (Landing Redesign + Bugfixes)

### Landing Page Redesign
- **Background**: Changed from `#f6f5f4` to `#EDEEF5` (bg-base)
- **Brand**: "IdeaDNA" → "mėntality" with clover/flower SVG icon
- **Fonts**: Added Outfit as `font-display` alongside Inter
- **Navbar**: Fixed glassmorphic, 12-col grid, "service/patient resources/about us/education center" nav links, "find help" + "get started →" CTA, animated hamburger with AnimatePresence mobile drawer
- **Hero**: CloudFront video background, `min-h-[140vh]`, gradient mask, animated heading with eye/pupil inline icon, search pill ("Ask me anything..."), Start Free + Sign In buttons
- **Edge Anchors**: Language pill (pl—en) on right edge, "2024" bottom-left, "mental health tools" bottom-right
- **Footer**: 4-column grid with brand + Services (Therapy, Counseling, Support Groups, Crisis Helpline) + Resources (Articles, Guides, Self Assessments, Education Center) + Company (About, Careers, Contact, Privacy Policy)
- **Removed**: 3D Explorer, DNA helix, evolution tree, feature cards from landing page

### Backend Bugfixes
- **Route ordering**: Moved `GET /ideas/trending` and `GET /ideas/similar` before `GET /ideas/{idea_id}` to fix 422 error (path param was catching "trending")
- **GenerationService**: Added fallback to generate ideas from scratch via OpenAI when curated DB is empty
- **Fetch router**: Wrapped in try/except for Python 3.14 compatibility (`from typing import list, dict` removed)
- **schemas/__init__.py**: Updated to import correct schema classes
- **response_model**: Removed from endpoints returning `{success: true}` dicts to avoid serialization mismatch

### Config Fixes
- **tsconfig.json**: Changed `include` from `"**/*.ts", "**/*.tsx"` to `"./src/**/*.ts", "./src/**/*.tsx"` to exclude `pgsql/` directory
- **Tailwind**: Added `bg-base: #EDEEF5`, `brand-green: #9fff00`, `font-display: Outfit`

### API Response Alignment
All endpoints changed from `{ status: "success", data }` to `{ success: true, data }` per Rules doc

### Current Status
- **Frontend**: Running on `http://localhost:3000` — all 8 pages return 200
- **Backend**: Running on `http://localhost:8000` — all endpoints return 200/404 gracefully
- **OpenAI**: Key valid but quota exhausted (429) — all agents return realistic mock data
- **Database**: SQLite with 0 curated ideas — GenerationService fills the gap
- **Build**: `npm run build` passes with zero errors across 18 routes
- **pgvector**: Disabled on SQLite — falls back to `ORDER BY innovation_score DESC`

## Files Changed (This Session)
- `tailwind.config.ts` — New colors/fonts
- `src/app/globals.css` — #EDEEF5 bg, green selection
- `src/app/layout.tsx` — Inter + Outfit fonts, selection classes
- `src/app/page.tsx` — Simplified to just `<Hero />`
- `src/components/Hero.tsx` — **New**: Video hero with animations
- `src/components/layout/Navbar.tsx` — **Rewritten**: Glassmorphic design
- `src/components/layout/Footer.tsx` — **Rewritten**: 4-col useful links
- `tsconfig.json` — Fixed include pattern
- `backend/app/services/generation_service.py` — **New**: AI idea generation from scratch
- `backend/app/services/idea_service.py` — Added fallback to GenerationService
- `backend/app/api/ideas.py` — Fixed route ordering, removed response_model
- `backend/app/schemas/__init__.py` — Updated imports
- `backend/main.py` — Wrapped fetch router import

## Known Issues
- OpenAI API quota exhausted — all agents return mock data
- pgvector disabled on SQLite — no semantic search
- Data fetchers require API keys (Product Hunt, GitHub, Reddit) — fallback to mock
- Clerk authentication not implemented — mock login/register only

## Next Steps
1. Add OpenAI billing credits for real AI generation
2. Seed curated ideas table with 500+ entries
3. Install PostgreSQL + pgvector for production
4. Implement Clerk/NextAuth authentication
5. Build missing pages: /service, /resources, /about, /education, /help
