# IdeaDNA Workspace Summary & Memory

## Project Overview
AI-Powered Idea Evolution Platform. Next.js 14 + Python FastAPI + PostgreSQL + pgvector + OpenAI.

## Frontend (Next.js 14 + Tailwind CSS)
| Route | Page | 3D? |
|---|---|---|
| `/` | Landing — dark hero band (#213183), 3D canvas, DNA sliders, evolution tree, feature cards | ✅ |
| `/login` | Sign-in with email/password + OAuth | — |
| `/register` | Sign-up flow | — |
| `/onboarding` | 6-question survey (skill, budget, team, timeline, tech, industry) | — |
| `/dashboard` | Project management, stats, search, filters | — |
| `/generate` | **Idea Generator v2** — platform selector (8), problem input, 6-agent pipeline curated DB → AI upgrade → 4D scoring, profile bar, selection → deep-dive trigger | ✅ |
| `/evolve` | Evolution Engine — critic report, React Flow tree, version selection | — |
| `/analyze` | Code Archaeology — 3 input tabs, 6-agent pipeline report | — |
| `/project/[id]` | Deep-dive — 7-section blueprint accordion, UI mockup w/ device toggle | ✅ |
| `/sources` | Data source management (Devpost, PH, GitHub, HN, Reddit) | ✅ |

**3D Components**: `ThreeBackground` (particle field + floating helix), `DnaCanvas` (double helix)

## Design System
- **Colors**: `#f6f5f4` canvas (off-white), hairline `#e6e6e6` borders, Notion Blue `#0075de` CTAs
- **Dark hero band**: `#213183` deep indigo inverted section on landing
- **Sticker palette**: purple `#7b5ea7`, teal `#0e7c7b`, sky `#1a8bbf`, amber `#d4731a`, pink `#b0436f`
- **Notion-style**: notion-shadow (0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)), rounded-[4px] inputs, rounded-xl cards
- **Typography**: Inter font, 12px/14px/16px sizes, monospace for code/tags
- **Components**: Button (4 variants: primary, secondary, ghost, utility, utility-blue), Input, Badge (4 variants: default, purple, teal, sky)
- **Layout**: Navbar (responsive + mobile hamburger), Footer, DashboardLayout (sidebar)

## Backend (Python FastAPI)

### Architecture
- **FastAPI** app with CORS middleware, health check, 3 router mounts
- **SQLAlchemy** ORM with pgvector extension for 1536-dim vector search
- **9 database tables**: `users`, `curated_ideas`, `projects`, `ideas`, `blueprints`, `ui_mockups`, `enhanced_ideas`, plus alembic migrations

### Models (SQLAlchemy + pgvector)

**User**: id, email, name, skill_level, budget, team_size, timeline, tech_prefs, learning_goals, industry, years_of_experience, preferred_platform, style_preference, timestamps. Rel: projects

**CuratedIdea**: id, title, description, problem_statement, solution, key_features (JSON), platform (indexed), sub_category, innovation_score, market_potential, complexity (indexed), suggested_stack (JSON), tags (JSON), source, trending_score, embedding (vector(1536)), timestamps. Indexes: platform, complexity, embedding (GIN)

**Project**: id, user_id (FK), title, description, mode (GENERATOR/EVOLUTION/ARCHAEOLOGY), status (DRAFT/SELECTED/COMPLETED/ARCHIVED), original_input, platform, selected_idea_id (FK→ideas, unique), parent_project_id (FK→projects self-ref), embedding (vector(1536)), timestamps. Rel: user, ideas, selected_idea, blueprint (1:1), ui_mockup (1:1), parent/child projects

**Idea**: id, project_id (FK), source, title, description, problem_statement, solution, key_features (JSON), innovation_score, feasibility_score, difficulty, platform, tags (JSON), suggested_stack (JSON), upgrade_notes (JSON), upvotes, embedding (vector(1536)), is_curated, curated_idea_id (FK→curated_ideas), timestamps. Rel: project, curated_idea, blueprint (1:1), ui_mockup (1:1)

**Blueprint**: id, idea_id (FK, unique), project_id (FK, unique), overview, prd (JSON), tech_stack (JSON), database_schema (JSON), api_design (JSON), user_flow (JSON), implementation_plan (JSON), markdown, openapi_spec, mermaid_diagrams (JSON), timestamps. Rel: idea, project

**UiMockup**: id, idea_id (FK, unique), project_id (FK, unique), html, css, components (JSON), style_variant, mobile_notes, tablet_notes, timestamps. Rel: idea, project

**EnhancedIdea**: id, original_idea_id (FK→ideas), enhanced_title, enhanced_description, target_audience, monetization, tech_stack (JSON), market_potential, difficulty, unique_angle, competitors (JSON), mvp_timeline, generated_by, timestamps, user_feedback

### 6-Agent Generator Pipeline
1. **InputParserAgent** (temp 0.3, GPT-4): Extracts problem_statement, platform, target_audience, constraints, tone, keywords
2. **RetrieverAgent** (no AI, pgvector): Semantic search in curated_ideas with platform filter + user constraint filtering (skill/budget)
3. **RankerAgent** (no AI, algorithm): Weighted ranking: similarity*0.15 + innovation*0.25 + market*0.15 + diff_match*0.30 + trending*0.05 + tech_pref*0.10
4. **UpgradeAgent** (temp 0.6, GPT-4): Personalizes curated idea for user profile (skill/budget/team/timeline/tech_prefs)
5. **ScorerAgent** (temp 0.2, GPT-4): 4-dimension scoring: originality, feasibility, market_potential, complexity_match → overall + verdict
6. **OutputFormatterAgent** (no AI): Formats cards with colors, badges, icons, UI-ready structure

### Additional Agents
- **BlueprintArchitectAgent** (temp 0.4, GPT-4): 7-section production blueprint (overview, PRD, tech_stack, db_schema, api_design, user_flow, implementation_plan) — lazy-loaded on idea selection
- **UIDesignerAgent** (temp 0.5, GPT-4): Full HTML/CSS landing page with Tailwind CDN, dark theme, 7 sections — lazy-loaded on idea selection

### API Endpoints (v2.0)

**Generator Pipeline**:
- `POST /api/generator/full` — Run full 6-agent pipeline
- `POST /api/generator/parse` — Run InputParserAgent only

**Projects**:
- `POST /api/projects` — Create project
- `GET /api/projects` — List user projects
- `GET /api/projects/{id}` — Get project
- `GET /api/projects/{id}/ideas` — List project ideas

**Idea Selection (lazy-loaded)**:
- `POST /api/ideas/select?project_id=X` — Select idea, triggers BlueprintArchitect + UIDesigner
- `GET /api/ideas/{id}/blueprint` — Get blueprint (after selection)
- `GET /api/ideas/{id}/mockup` — Get UI mockup (after selection)

**Curated Ideas**:
- `GET /api/curated` — List curated ideas (filter by platform/complexity)
- `GET /api/curated/platforms` — List all platform categories
- `GET /api/curated/trending` — Get trending curated ideas
- `POST /api/curated/submit` — Submit new curated idea

**Backward Compat / Legacy**:
- `GET /api/ideas` — List ideas (source/category filter)
- `GET /api/ideas/{id}` — Get idea by ID
- `POST /api/ideas/generate` — Full generate with project creation
- `GET /api/ideas/similar` — Vector similarity search
- `GET /api/ideas/trending` — Trending ideas
- `POST /api/ideas/{id}/feedback` — Upvote/downvote
- `GET /api/categories` — List distinct platforms

**User**:
- `GET /api/user/profile` — Get user profile
- `POST /api/user/profile` — Create or update user profile

**Fetch (data sources)**:
- `POST /api/cron/fetch-all` — Fetch from all 5 sources (Devpost, PH, GitHub, HN, Reddit)
- `POST /api/cron/fetch/{source}` — Fetch from single source

**Health**: `GET /health` — Returns `{"status": "healthy", "version": "2.0.0"}`

### AI Agents Configuration
| Agent | Temp | Model | Purpose |
|-------|------|-------|---------|
| InputParser | 0.3 | GPT-4 | Structured extraction from raw input |
| Retriever | N/A | pgvector | Semantic search in curated DB |
| Ranker | N/A | Algorithm | Weighted ranking by user profile |
| Upgrade | 0.6 | GPT-4 | Personalize curated ideas |
| Scorer | 0.2 | GPT-4 | 4-dimension objective scoring |
| BlueprintArchitect | 0.4 | GPT-4 | 7-section production blueprint |
| UIDesigner | 0.5 | GPT-4 | HTML/CSS landing page mockup |

### Data Fetchers
- **DevpostFetcher**: bs4 scrape of hackathon projects
- **ProductHuntFetcher**: GraphQL API (free tier)
- **GitHubFetcher**: REST API with token auth
- **HackerNewsFetcher**: Firebase API (unlimited)
- **RedditFetcher**: OAuth API

### Seed Data
- `backend/seed_curated.py` — 500+ curated ideas across 8 platforms (WEB, MOBILE, AI_ML, BLOCKCHAIN, IOT, DESKTOP, EXTENSION, API_BACKEND)
- Each platform has 12-15 hand-curated ideas with innovation_score, market_potential, complexity, suggested_stack, tags, source

### Files
- `backend/main.py` — FastAPI entry point
- `backend/seed_curated.py` — Curated DB seed script
- `backend/app/models/idea.py` — All 9 SQLAlchemy models with pgvector
- `backend/app/schemas/idea.py` — Pydantic schemas (UserProfile, CuratedIdeaResponse, ProjectResponse, IdeaCard, BlueprintResponse, UiMockupResponse, GenerateRequest, etc.)
- `backend/app/agents/` — 9 agents (input_parser, retriever, ranker, upgrade, scorer, output_formatter, blueprint_architect, ui_designer, embedding)
- `backend/app/services/idea_service.py` — Full business logic with 6-agent pipeline orchestration
- `backend/app/api/ideas.py` — All REST endpoints
- `backend/app/api/users.py` — User profile CRUD
- `backend/app/api/fetch.py` — Data source fetch endpoints
- `backend/app/config.py` — Settings with env loading
- `backend/app/database.py` — SQLAlchemy engine + session
- `backend/app/fetchers/` — 5 data source fetchers

## Frontend API Client (`src/lib/api.ts`)
- `userApi`: getProfile, createOrUpdateProfile
- `generatorApi`: full (6-agent pipeline)
- `curatedApi`: list, platforms, trending
- `projectApi`: list, create, get, ideas
- `ideaApi`: list, get, select (triggers blueprint+mockup), blueprint, mockup, generate, similar, trending, vote, categories

## Key Design Decisions
1. **Curated DB + AI Upgrade hybrid** (not pure AI generation) — quality guaranteed from 500+ curated ideas, personalized via AI
2. **pgvector over Pinecone/Weaviate** — self-hosted, no extra costs
3. **6-agent pipeline** replaces simple prompt-to-idea approach
4. **Lazy-loading** — blueprint + mockup generated ONLY on idea selection (80% cost reduction)
5. **GPT-4 `response_format: {"type": "json_object"}`** for structured AI output
6. **User profile injection** into every agent prompt for personalization
7. **Profile bar** on generate page shows skill level, budget, team size, timeline

## Known Issues / Blocked
- Backend requires PostgreSQL + pgvector extension to run; cannot start without DB
- OpenAI API key required for real AI enhancement; falls back to mock data
- Data fetchers require API keys (Product Hunt, GitHub, Reddit)
- All frontend pages use fallback mock data when API is unavailable
- Onboarding page stores UserProfile with lowercase values (beginner, intermediate) but backend expects uppercase (BEGINNER, INTERMEDIATE) — mapping needed

## Next Steps
1. Configure backend `.env` with DATABASE_URL, OPENAI_API_KEY, GITHUB_TOKEN, etc.
2. Run `uvicorn main:app --reload --port 8000` in `backend/` directory
3. Run `python seed_curated.py` to populate curated database
4. Set `NEXT_PUBLIC_API_URL=http://localhost:8000` in frontend `.env.local`
5. Add Clerk/NextAuth authentication integration
6. Build remaining features: Evolution Engine (Guide 2), Code Archaeology (Guide 3), Evolution Tree visualization, D3.js radar chart, export functionality
