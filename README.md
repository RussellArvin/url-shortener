# URL Shortener

A URL shortening service in the spirit of bit.ly. Submit a long URL, get a short one back; visit the short one, get redirected.

**Live demo:** https://url.russellarvin.com

## What it does

- **Shorten** — POST a URL to `/api/links`, get back a slug (random 7 chars, or your own custom slug 1–30 chars from `a-z 0-9 _ -`)
- **Redirect** — `GET /:slug` → 302 to the original URL
- **Manage** — sign in to see your links, copy them, delete them
- **Persist** — links live in PostgreSQL; soft-deleted slugs return 404 but can be restored from the database
- **Cached redirects** — Redis cache-aside with 7-day TTL keeps hot links off the database
- **Responsive UI** — Tailwind + shadcn, light/dark theme with the View Transitions API
- **Reserved paths** — slugs that would collide with the app (`api`, `links`, `assets`, `health`) are blocked at validation
- **Type-safe end-to-end** — the frontend imports server route types via Hono RPC, so request/response shapes can't drift

## Tech stack

| Layer                 | Choice                                                            |
| --------------------- | ----------------------------------------------------------------- |
| Runtime               | Bun (workspaces, native TS, `bun:test`, `Bun.redis`, `Bun.serve`) |
| Server                | Hono, better-auth, Drizzle ORM                                    |
| Database              | PostgreSQL via `drizzle-orm/bun-sql`                              |
| Cache                 | Redis                                                             |
| Frontend              | React 19, Vite, Tailwind CSS v4, shadcn/ui                        |
| Forms / data / tables | TanStack Form, Query, Table                                       |
| Routing               | React Router v7                                                   |
| Toasts                | sonner                                                            |
| Testing               | `bun:test` (integration), Playwright (e2e)                        |

## Project structure

```
packages/
  app/        React + Vite frontend
  server/     Hono API + /:slug redirect — also serves the built SPA in prod
  database/   Drizzle schema + migrations
  e2e/        Playwright happy-path tests
```

In production a single Hono process serves the built SPA at `/` and `/links`, the API at `/api/*`, the slug redirect at `/:slug` — all on one origin.

## Local development

### Prerequisites

- Bun ≥ 1.3
- Docker (for Postgres + Redis)

### Setup

```bash
bun install

# Env files (see *.env.example for the variables expected)
cp packages/server/.env.example packages/server/.env
cp packages/database/.env.example packages/database/.env

# Postgres + Redis
docker compose up -d

# Apply migrations
bun run drizzle:migrate

# (Optional) Seed a user + a few links
bun run db:seed
# → login: test@test.com / password1234
```

### Run

```bash
bun run dev
```

- Frontend: http://localhost:5173
- API + redirects: http://localhost:3000

## Scripts

| Command                           | Purpose                                          |
| --------------------------------- | ------------------------------------------------ |
| `bun run dev`                     | Start server + frontend                          |
| `bun run build`                   | Vite-build the frontend into `packages/app/dist` |
| `bun run test`                    | Integration tests (server)                       |
| `bun run test:e2e`                | Playwright happy path                            |
| `bun run typecheck`               | `tsc --noEmit` across packages                   |
| `bun run lint` / `lint:fix`       | ESLint                                           |
| `bun run format` / `format:check` | Prettier                                         |
| `bun run db:seed`                 | Seed test user + sample links into dev DB        |
| `bun run drizzle:generate`        | Generate a migration from schema changes         |
| `bun run drizzle:migrate`         | Apply pending migrations to dev DB               |
| `bun run drizzle:migrate:test`    | Apply migrations to the test DB                  |
| `bun run drizzle:studio`          | Open Drizzle Studio                              |

## Testing

**Integration tests** run against a real Postgres + Redis using a separate `url_shortener_test` database (Redis DB index 1). One-time setup:

```bash
docker exec url-shortener-postgres \
  psql -U user -d postgres -c "CREATE DATABASE url_shortener_test;"
bun run drizzle:migrate:test
```

Then:

```bash
bun run test
```

Coverage: auth required, create with random/custom slug, reserved slug rejection, duplicate slug → 409, ownership-scoped list and delete, redirect cache hit/miss, soft-deleted slug → 404.

**End-to-end** uses Playwright. Install browsers once:

```bash
cd packages/e2e && bun run install:browsers
```

Run with the dev server already up (or let Playwright spawn it):

```bash
bun run test:e2e
```

## Deployment

The repo's `railway.toml` is a single-service config: build the SPA, run pending Drizzle migrations as a `preDeployCommand`, then start the Hono server which serves the SPA, the API, and slug redirects from one origin. Failed migrations abort the deploy and the previous version stays live.

### Required environment variables

| Variable             | Notes                                               |
| -------------------- | --------------------------------------------------- |
| `DATABASE_URL`       | Postgres connection string                          |
| `REDIS_URL`          | Redis connection string                             |
| `BETTER_AUTH_SECRET` | 32+ chars — generate with `openssl rand -base64 32` |
| `BETTER_AUTH_URL`    | Public URL of the deploy                            |
| `WEB_URL`            | Same as `BETTER_AUTH_URL` (single-origin)           |

### Deploy to Railway

[![Deploy on Railway](https://railway.com/button.svg)](https://railway.com/deploy/kVeVsN?referralCode=4FPEt4&utm_medium=integration&utm_source=template&utm_campaign=generic)

One click provisions the app service, Postgres, and Redis with all environment variables wired up. `BETTER_AUTH_SECRET` is auto-generated; `DATABASE_URL` and `REDIS_URL` reference the provisioned databases via `${{Postgres.DATABASE_URL}}` / `${{Redis.REDIS_URL}}`; `BETTER_AUTH_URL` and `WEB_URL` use `${{RAILWAY_PUBLIC_DOMAIN}}`. On every deploy, `preDeployCommand` runs pending Drizzle migrations — failed migrations abort the deploy and the previous version stays live.

After the first deploy, optionally:

- **Co-locate services in one region** — dashboard → Service → Settings → Region. Cache-miss redirects round-trip to Postgres, so cross-region adds latency.
- **Disable public networking on Postgres + Redis** — Service → Settings → Networking. The `${{Postgres.DATABASE_URL}}` reference keeps working (it resolves to the internal hostname). Tradeoff: `railway run` from your laptop can no longer reach the DBs.

### Other hosts

The build is a plain `vite build` + `bun src/index.ts`; anywhere that runs Bun and provides Postgres + Redis works. Set the env vars above and:

```bash
bun install --frozen-lockfile
bun run --filter '@url-shortener/app' build
bun run --filter '@url-shortener/server' start
```

## Conventions

- **Commits** — `type: description` (lowercase). Types: `feat`, `fix`, `chore`, `docs`, `refactor`, `perf`, `test`, `build`, `ci`, `revert`. Enforced by a husky `commit-msg` hook.
- **Pre-commit** — typecheck + lint + format. Fix with `bun run lint:fix && bun run format`.
- **TypeScript** — strict mode plus `noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`, `verbatimModuleSyntax`, `noUnusedLocals`, `noUnusedParameters`.
- **No raw SQL in routes** — `db.execute()` is banned by ESLint; use the Drizzle query builder.

[better-auth]: https://www.better-auth.com/
