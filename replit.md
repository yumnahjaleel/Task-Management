# replit.md

## Overview

TaskFlow is a modern, full-stack Task Manager Web App designed for productivity. It combines classic task management (create, edit, delete, organize tasks with priorities, due dates, tags, projects, and subtasks) with AI-enhanced features like natural language task creation and AI-powered task breakdown. The app aims for a minimal, calm, polished aesthetic with smooth animations and responsive design.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend
- **Framework**: React 18 with TypeScript (no SSR — `rsc: false`)
- **Routing**: Wouter (lightweight client-side router)
- **State Management**: TanStack React Query for server state; local React state for UI
- **UI Components**: shadcn/ui (new-york style) built on Radix UI primitives
- **Styling**: Tailwind CSS with CSS variables for theming (light/dark mode support), custom color palette using HSL variables defined in `client/src/index.css`
- **Animations**: Framer Motion for micro-interactions and transitions
- **Build Tool**: Vite with React plugin
- **Path Aliases**: `@/` maps to `client/src/`, `@shared/` maps to `shared/`
- **Key Pages**: Dashboard (`/`), Today view (`/today`), Important (`/important`), Project view (`/project/:id`), 404
- **Key Components**: Layout, Sidebar, MobileNav, QuickAdd (smart task input with AI), TaskCard, TaskDialog

### Backend
- **Runtime**: Node.js with Express 5
- **Language**: TypeScript, executed via `tsx` in dev
- **Build**: esbuild for server bundle, Vite for client bundle (see `script/build.ts`)
- **API Design**: RESTful JSON API under `/api/` prefix. API contract is defined in `shared/routes.ts` using Zod schemas — shared between client and server for type safety and validation
- **Dev Server**: Vite dev server runs as middleware on the Express server with HMR via `server/vite.ts`
- **Production**: Static files served from `dist/public/` with SPA fallback

### Database
- **Database**: PostgreSQL (required — `DATABASE_URL` environment variable)
- **ORM**: Drizzle ORM with `drizzle-zod` for schema-to-Zod validation
- **Schema Location**: `shared/schema.ts` (tasks, projects, tags, taskTags tables) and `shared/models/chat.ts` (conversations, messages tables)
- **Migrations**: Drizzle Kit with `drizzle-kit push` command (no migration files, direct push)
- **Key Tables**:
  - `tasks` — title, description, priority (low/medium/high), status (todo/in_progress/completed/archived), dueDate, projectId, position, parentId (subtasks)
  - `projects` — name, slug, color
  - `tags` — name, color
  - `task_tags` — many-to-many junction table
  - `conversations` / `messages` — for AI chat integration

### API Routes
- `GET/POST /api/tasks` — list and create tasks (with filtering by projectId, status, search)
- `GET/PUT/DELETE /api/tasks/:id` — get, update, delete individual tasks
- `GET/POST /api/projects` — list and create projects
- `DELETE /api/projects/:id` — delete project
- `GET/POST /api/tags` — list and create tags
- `POST /api/ai/process` — AI natural language task processing
- `POST /api/ai/breakdown` — AI task breakdown into subtasks
- `/api/conversations` — chat conversation management (Replit AI integration)

### AI Integration
- **Provider**: OpenAI-compatible API via Replit AI Integrations
- **Environment Variables**: `AI_INTEGRATIONS_OPENAI_API_KEY`, `AI_INTEGRATIONS_OPENAI_BASE_URL`
- **Features**: Natural language task creation, task breakdown into subtasks, smart suggestions
- **Replit Integration Modules**: Located in `server/replit_integrations/` — includes chat, audio (voice), image generation, and batch processing utilities

### Shared Code
- `shared/schema.ts` — Database schema and Zod insert schemas (single source of truth)
- `shared/routes.ts` — API contract with paths, methods, input/output Zod schemas
- `shared/models/chat.ts` — Chat-related database schema

### Client-Side Patterns
- Custom hooks in `client/src/hooks/` wrap TanStack Query mutations/queries for tasks, projects, tags, and AI features
- `client/src/lib/queryClient.ts` — Centralized query client with `apiRequest` helper
- `client/src/lib/taskParser.ts` — Simple NLP parser for natural language date extraction ("tomorrow", "today")
- `client/src/lib/localStorage.ts` — Legacy local storage utils (app has since moved to server-backed storage)
- Toast notifications via shadcn/ui toast system

## External Dependencies

- **PostgreSQL** — Primary database, connected via `DATABASE_URL` env var, using `pg` Pool
- **OpenAI API** (via Replit AI Integrations) — Used for natural language task processing and task breakdown. Configured via `AI_INTEGRATIONS_OPENAI_API_KEY` and `AI_INTEGRATIONS_OPENAI_BASE_URL`
- **connect-pg-simple** — PostgreSQL session store (available but sessions not yet fully wired)
- **Key npm packages**: express, drizzle-orm, drizzle-zod, @tanstack/react-query, wouter, framer-motion, date-fns, zod, openai, shadcn/ui component library (Radix UI primitives), recharts, vaul (drawer), cmdk (command palette), embla-carousel-react
- **Google Fonts**: Inter (body), Outfit (headings), DM Sans, Fira Code, Geist Mono, Architects Daughter (loaded in index.html/CSS)