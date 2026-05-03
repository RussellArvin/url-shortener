# bun-mono-template

A minimal Bun workspace monorepo template with TypeScript, Hono, Drizzle, and strict tooling. Optimized for AI-assisted development with Claude Code.

## Quick Start

```bash
bun install
bun run dev
```

## Structure

```
packages/
  shared/     @url-shortener/shared    — shared types and utilities
  server/     @url-shortener/server    — Hono API server (port 3000)
  database/   @url-shortener/database  — Drizzle ORM + PostgreSQL
```

Cross-package imports via `workspace:*`:

```ts
import { APP_NAME } from "@url-shortener/shared";
import { db } from "@url-shortener/database";
```

## Scripts

| Command                    | Description                            |
| -------------------------- | -------------------------------------- |
| `bun run dev`              | Start all packages in dev mode         |
| `bun test`                 | Run all tests                          |
| `bun run typecheck`        | TypeScript type checking               |
| `bun run lint`             | ESLint                                 |
| `bun run format`           | Prettier                               |
| `bun run drizzle:generate` | Generate migration from schema changes |
| `bun run drizzle:migrate`  | Apply pending migrations               |
| `bun run drizzle:push`     | Push schema directly (dev only)        |
| `bun run drizzle:studio`   | Open Drizzle Studio                    |

## Tooling

- **TypeScript** — strict mode with additional safety flags
- **ESLint** — strict type-checked rules, Prettier integration, raw SQL banned in app
- **Prettier** — semicolons, double quotes, 2 spaces, trailing commas, 80 chars
- **Husky** — pre-commit (typecheck + lint + format), commit-msg (conventional commits)

## Commit Convention

```
type: description
```

Types: `feat`, `fix`, `chore`, `docs`, `style`, `refactor`, `perf`, `test`, `build`, `ci`, `revert`

## Claude Code

This template includes Claude Code configuration for AI-assisted development:

- **`/project:add-table <name>`** — scaffold a Drizzle database table
- **`/project:add-route <description>`** — add a Hono route with tests
- **`/project:add-package <name>`** — scaffold a new workspace package
- Pre-approved permissions for all `bun` commands
- Schema change reminders for migration generation

## Renaming the Scope

Packages use `@url-shortener` as the scope. To rename to your project:

```bash
sed -i '' 's/@url-shortener/@myapp/g' package.json packages/*/package.json
bun install
```

## Adding a New Package

```bash
# Use Claude Code
/project:add-package my-package

# Or manually:
mkdir -p packages/my-package/src
# Add package.json, tsconfig.json, src/index.ts
bun install
```

## Database Setup

Set `DATABASE_URL` in `.env`:

```
DATABASE_URL=postgresql://user:pass@localhost:5432/mydb
```

Add tables in `packages/database/src/schema/`, one file per table, then:

```bash
bun run drizzle:generate
bun run drizzle:migrate
```
