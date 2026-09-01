# Woolen Bluebird

A storytelling and community platform for makers. See [PRD.md](./PRD.md) for the full V1 specification.

## Status

**Phase 1 — Foundation** is complete: monorepo scaffold, routing shell, global layout, and design tokens.

**Phase 2 — Content Model + Database + Seed Data** is complete: Prisma content models, an initial migration, development seed data, and a read-only public REST API (`/api/stories`, `/api/makers`, `/api/categories`, `/api/gatherings`).

**Phase 3A — Made Whole** and **Phase 3B — Maker Directory** are complete: both sections are real, API-backed pages (landing + detail) with URL-based filtering, loading/error/empty states, and the established visual language. Stories and makers are cross-linked (a story's maker name links to their profile; a maker's profile lists their published stories).

**Phase 3C — Homepage** is complete: a real, API-backed homepage (hero, philosophy, featured stories, featured makers, a Gather preview, a Share Your Story CTA, and a closing statement).

**Phase 4A — Story Submission** is complete: `/submit-story` is a real, validated form (`POST /api/story-submissions`) that creates `StorySubmission` rows in `PENDING` status. Both `permissionToContact` (optional) and `publicationPermission` (required — rejected server-side if not `true`) are enforced.

**Phase 4B — Maker Submission** is complete: `/submit-maker` is a real, validated form (`POST /api/maker-submissions`) that creates `MakerSubmission` rows in `PENDING` status, with the same required-listing-permission / optional-contact-permission pattern as Story Submission. The Maker Directory page links to it. Shared submission-form CSS and server-side validation helpers were extracted so both forms (and any future one) stay in sync.

**Phase 5A — About / Origin Story** is complete: a real, static About page telling Woolen Bluebird's origin and larger vision, structured around the PRD's "was my story → collection of stories → community" progression, and linking out to Made Whole, the Maker Directory, Share Your Story, and Gather.

**Journal** is complete: `/journal` and `/journal/:slug` are real, API-backed pages reusing the existing Story model (`type: JOURNAL`) rather than a separate content model. Journal entries are intentionally excluded from Made Whole, the homepage's Featured Stories, and story-to-story "related stories" — Journal is Arianne's own ongoing voice, kept distinct from the wider-community Made Whole collection.

**Phase 5B — Admin / Review System** is complete: a private `/admin` area, gated by real authentication (single-administrator credentials in environment variables, bcrypt + a signed httpOnly JWT cookie session — no public user accounts). Admins can list, open, and review pending `StorySubmission`/`MakerSubmission` records (approve/reject with private review notes), then, separately, **publish** an approved submission — editing/cleaning up its content first — into a real `Story` or `Maker`. Publishing is idempotent (re-publishing an already-published submission returns the existing content rather than creating a duplicate) and preserves the link back to the original submission (`publishedStoryId` / `convertedToMakerId`). See `server/scripts/hash-password.js` and `server/scripts/generate-jwt-secret.js` for generating the required `ADMIN_*` env vars.

Gather is still a Phase 1 placeholder.

## Stack

- **Client**: React + Vite + React Router, plain CSS with custom-property design tokens
- **Server**: Node.js + Express
- **Database**: PostgreSQL via Prisma

## Prerequisites

- Node.js **22.6+** (Node 24 recommended — this project was scaffolded and tested on 24.14.0)
- PostgreSQL (local install, Docker, or a hosted instance) — required as of Phase 2. Without it, the client-only parts of the app still boot, but every `/api/*` content route will fail and `/api/health/db` will report the database as unreachable.

## Setup

From the repo root:

```bash
npm install
```

This installs both workspaces (`client` and `server`) via npm workspaces.

Copy the environment file templates:

```bash
cp server/.env.example server/.env
cp client/.env.example client/.env
```

Edit `server/.env` if your local Postgres connection details differ from the default.

To use the admin area (`/admin`), also set `ADMIN_EMAIL`, `ADMIN_PASSWORD_HASH`, and `ADMIN_JWT_SECRET` in `server/.env` — never commit real values for these (only empty names belong in `.env.example`):

```bash
cd server
npm run admin:hash-password       # prompts for a password, prints ADMIN_PASSWORD_HASH
npm run admin:generate-jwt-secret # prints a fresh, random ADMIN_JWT_SECRET
```

## Database setup

You need a running PostgreSQL server reachable at the connection string in `server/.env` (default: a `postgres`/`postgres` role and a `woolenbluebird` database on `localhost:5432`).

If you don't already have Postgres installed, on macOS the quickest path is Homebrew:

```bash
brew install postgresql@16

# Start it in the foreground (Ctrl+C to stop), or in the background with pg_ctl:
LC_ALL="en_US.UTF-8" /opt/homebrew/opt/postgresql@16/bin/postgres -D /opt/homebrew/var/postgresql@16
# or, to run it as a background process for this session:
/opt/homebrew/opt/postgresql@16/bin/pg_ctl -D /opt/homebrew/var/postgresql@16 -l /tmp/pg16.log start

# One-time setup of the role/database matching server/.env:
/opt/homebrew/opt/postgresql@16/bin/createuser -s postgres  # or set a password to match .env
/opt/homebrew/opt/postgresql@16/bin/createdb -O postgres woolenbluebird
```

(If you'd rather have Postgres always available in the background, use `brew services start postgresql@16` instead — this project doesn't require that, it only needs the server running while you use it.)

Once Postgres is reachable, from `server/`:

```bash
npm run prisma:migrate   # applies prisma/migrations against your database (use `prisma migrate deploy` in CI/prod)
npm run db:seed          # loads development seed data — safe to re-run any time
```

The seed script is idempotent (it upserts everything), so re-running it won't create duplicates. See "A note on seed data" below for what it creates.

## Running locally

From the repo root, start both the client and server together:

```bash
npm run dev
```

- Client: http://localhost:5173
- Server: http://localhost:4000

Or run them individually:

```bash
npm run dev:client
npm run dev:server
```

## Verifying the server

```bash
curl http://localhost:4000/api/health
# {"status":"ok"}

curl http://localhost:4000/api/health/db
# {"status":"ok"}                          — if Postgres is reachable
# {"status":"error","message":"..."}       — if not (run through Database setup above)

curl http://localhost:4000/api/stories
curl http://localhost:4000/api/stories/how-woolen-bluebird-began
curl http://localhost:4000/api/makers
curl http://localhost:4000/api/categories
curl http://localhost:4000/api/gatherings
```

## API

The `GET` routes below are public and read-only — no auth. The two `POST` submission endpoints are intentionally one-way: there's no matching `GET` to list or read submissions back.

| Route | Notes |
| --- | --- |
| `GET /api/stories` | Published stories only. Filters: `?type=`, `?category=` (slug), `?maker=` (slug). Paginated: `?limit=`, `?offset=`. |
| `GET /api/stories/:slug` | Single published story, includes up to 3 `relatedStories` (same maker or category). 404 if missing/unpublished. |
| `GET /api/makers` | Approved/featured makers only. Filters: `?category=` (slug), `?location=` (substring, case-insensitive). Paginated. |
| `GET /api/makers/:slug` | Single approved/featured maker, includes their published `stories`. 404 if missing/pending/archived. |
| `GET /api/categories` | Full category list. |
| `GET /api/gatherings` | Published gatherings only, soonest first. |
| `POST /api/story-submissions` | Creates a `StorySubmission` with `status: PENDING`. `publicationPermission` must be `true` or the request is rejected. Validates every field server-side regardless of what the client sent. Returns `{ data: { id, status, createdAt } }` on success (201) — never echoes back the submitted name/email/story. On validation failure, returns 400 with `{ error, fieldErrors: { field: message } }`. |
| `POST /api/maker-submissions` | Creates a `MakerSubmission` with `status: PENDING`. Same shape and `publicationPermission`-required rule as story submissions. At least one craft/making category is required (unlike Story Submission, where it's optional). |

List endpoints return `{ data: [...], meta: { total, limit, offset } }`; detail endpoints return the object directly, or `{ error: "..." }` with a 404/400/500 status.

## Project structure

```text
client/
  src/
    components/   Layout, Nav, Footer (shared shell)
    pages/        One placeholder component per route
    styles/       tokens.css (design tokens), global.css (base styles)
    App.jsx        Route definitions
    main.jsx       App entry point
server/
  src/
    index.js       Express app + health-check + API routes
    db.js          Prisma client singleton
    routes/        stories.js, makers.js, categories.js, gatherings.js
    lib/           pagination, shared Prisma `select` shapes, asyncHandler
    generated/     Prisma client output (generated, gitignored)
  prisma/
    schema.prisma  Datasource, generator, and content models
    migrations/    20260819000000_init — initial schema
    seed.js         Development seed data (see below)
```

## A note on seed data

`server/prisma/seed.js` creates:

- the real V1 category taxonomy (Fiber Arts, Woodworking, Pottery & Ceramics, etc.)
- Woolen Bluebird's actual origin story ("How Woolen Bluebird Began") as real, published content
- several placeholder stories, makers, and gatherings, each named with a `[DEV]` prefix, with `isDevelopmentContent: true` set, and with body copy that says outright it's placeholder — none of it should be mistaken for a real person or real community member
- one placeholder `StorySubmission` and one placeholder `MakerSubmission` in `PENDING` status, so the review queue has something in it for later admin-phase testing

Delete the `[DEV]`-prefixed rows (`isDevelopmentContent: true`) once real content replaces them — they're only there so the frontend and API have something to render during development.

## A note on the Prisma client

This project uses Prisma's newer `prisma-client` generator, which outputs native
TypeScript (`server/src/generated/prisma/*.ts`) instead of the older
`prisma-client-js` output. Node 22.6+ can import these files directly (no
build step, no `ts-node`) via native TypeScript type-stripping, which is why
the server's `dev`/`start` scripts pass `--experimental-strip-types`. If you
change generators later, that flag can be removed.

## Next steps

Phase 3 (wiring the existing React pages up to this API), Phase 3's submission
forms, and later phases are described in [PRD.md](./PRD.md) §36. Do not start
them without explicit sign-off — each phase should be reviewed before moving
to the next.
