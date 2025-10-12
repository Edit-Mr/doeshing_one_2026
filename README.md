# Doeshing — Editorial Portfolio

Magazine-style personal site built with Next.js 15, Tailwind CSS, and Prisma. The experience blends broadsheet-inspired layouts with modern web tooling to showcase blog posts, case studies, a résumé, and contact information.

## ✨ Highlights

- Multi-column editorial layout with serif/sans typography pairings and accent red detailing
- Blog engine backed by Supabase (Postgres) via Prisma with search, tag filters, view tracking, and related articles
- Markdown-driven project case studies rendered via a unified/rehype pipeline
- Comprehensive CV page with printable styles and timeline layout
- API routes for blog listing, CRUD-ready endpoints, and view aggregation hooks
- Accessible navigation, skip links, responsive design from 320px to 1440px+

## 🧱 Tech Stack

- **Framework:** Next.js 15 (App Router, React 19)
- **Styling:** Tailwind CSS 3 with typography plugin and custom magazine tokens
- **Database:** Supabase (Postgres) managed through Prisma ORM
- **Content:** Prisma-backed blog posts + Markdown/MDX project content
- **Auth Ready:** Prisma schema ships with NextAuth-compatible tables for future admin tooling
- **Tooling:** TypeScript, Biome, Zod, unified/remark/rehype, Shiki

## 📁 Project Structure

```
src/
  app/                App Router pages + API routes
    blog/             Blog list + detail + loading state
    projects/         Project list + detail driven by Markdown content
    cv/               Résumé page
    contact/          Contact info + clipboard helper
    api/              REST endpoints for blog posts + view tracking
  components/         Layout, blog, project, and UI primitives
  lib/                Prisma client, data helpers, markdown utilities
  styles/             Tailwind global layers
  types/              Shared type definitions
content/projects/     Markdown case studies (frontmatter + prose)
prisma/               Prisma schema + seed script
public/images/        Editorial placeholder artwork + icons
```

## 🚀 Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

Copy the template and update values for your setup:

```bash
cp .env.example .env
```

- `DATABASE_URL` — Supabase Postgres URL (`postgresql://USER:PASSWORD@HOST:5432/postgres?pgbouncer=true&connection_limit=1`)
- `NEXTAUTH_SECRET` / `NEXTAUTH_URL` — reserved for future admin routes
- `NEXT_PUBLIC_SITE_URL` — public base URL used for metadata + sharing

If you're using Supabase:

```bash
supabase init
supabase link --project-ref <project-ref>
supabase db credentials get
```

Copy the pooled `connectionString` into `DATABASE_URL`.

The project exposes a typed Supabase helper at `src/lib/supabase.ts`:

```ts
import { getSupabaseClient } from "@/lib/supabase";

const supabase = getSupabaseClient();            // uses anon key by default
const supabaseAdmin = getSupabaseClient({ serviceRole: true }); // requires SUPABASE_SERVICE_ROLE_KEY

const { data, error } = await supabase.from("posts").select("*");

// To enable end-to-end type safety, replace src/types/supabase.ts by running:
// supabase gen types typescript --project-id <project-ref> > src/types/supabase.ts
```

Make sure `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` (and `SUPABASE_SERVICE_ROLE_KEY` when needed) are configured before using the helper.

### 3. Prepare the database

```bash
npm run prisma:migrate
npm run prisma:generate
npm run db:seed
```

The seed script populates authors, tags, and three demo posts with stylized content.

### 4. Run the development server

```bash
npm run dev
```

Visit `http://localhost:3000` to explore the editorial layout. Biome linting keeps formatting consistent:

```bash
npm run lint
npm run format
```

## 📝 Content Authoring

- **Blog posts:** Stored in Supabase via Prisma. Use the `/api/blog` endpoints or Prisma Studio to create entries. Markdown in the `content` column is rendered with typographic enhancements, Shiki-powered code blocks, and automatic table of contents generation.
- **Projects:** Add `.md` or `.mdx` files to `content/projects/`. Frontmatter supports `{ title, description, tags, image, github, demo, date, featured, status }`. Content is processed through unified/remark/rehype for typography, code highlighting, and TOC data.

## 🔌 API Endpoints

| Method | Endpoint                  | Description                              |
| ------ | ------------------------- | ---------------------------------------- |
| GET    | `/api/blog`               | Paginated, filterable list of posts      |
| GET    | `/api/blog/:id`           | Details for a specific post (author/tags)|
| PUT    | `/api/blog/:id`           | Update title/content/tags/published flag |
| DELETE | `/api/blog/:id`           | Remove a post                            |
| POST   | `/api/views`              | Increment a post view count              |

Query parameters for the list endpoint mirror the UI: `page`, `tag`, `search`, `sort=latest|views`, `perPage`.

## 🧩 UI Components

- **Layout:** `Header`, `Navigation`, `Footer` implement the broadsheet look with datelines and accent separators.
- **Blog:** `BlogGrid`, `BlogCard`, `TagFilter`, `TableOfContents`, `ShareButtons` power the reading experience.
- **Projects:** `ProjectGrid`, `ProjectCard` render feature cards from Markdown sources.
- **UI:** `Button`, `Badge`, `Card`, `Pagination`, `SearchButton`, and `RenderedMarkdown` provide reusable primitives.

## 📄 Deployment Notes

- Tailwind + typography plugin is fully static and deployment ready for Vercel.
- Grab the Supabase pooled URL via `supabase db credentials get`, then run the migrate/generate scripts whenever the schema changes.
- `NEXT_PUBLIC_SITE_URL` should point to the deployed host to ensure accurate Open Graph links.
- NextAuth tables are already modeled in Prisma for future admin routes; enable when needed.

## 🤝 Conventions

- TypeScript strict mode is enabled; prefer explicit types.
- All markdown rendering passes through sanitizing rehype pipelines before hydration.
- Boostrapped styles favor accessible semantic HTML, focus states, and skip links.

Happy shipping! 📰
