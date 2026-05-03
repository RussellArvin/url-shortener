Bun workspace monorepo. All tooling runs from the root.

## Architecture

- Bun workspaces with `packages/*`
- Packages: `@url-shortener/server` (Hono), `@url-shortener/database` (Drizzle + Postgres), `@url-shortener/app` (React + Vite), `@url-shortener/e2e` (Playwright)
- Cross-package imports use `workspace:*`; packages export raw `.ts` — no build step
- Dev tooling at root: TypeScript, ESLint, Prettier, Husky

## Commands

- `bun install` — install all workspace dependencies
- `bun run dev` — start all packages in dev mode
- `bun test` — run all tests
- `bun test packages/server/` — run tests for a specific package
- `bun run typecheck` — `tsc --noEmit` across all packages
- `bun run lint` / `bun run lint:fix` — ESLint
- `bun run format` / `bun run format:check` — Prettier
- `bun run drizzle:generate` — generate migration from schema changes
- `bun run drizzle:migrate` — apply pending migrations
- `bun run drizzle:push` — push schema directly (dev only)
- `bun run drizzle:studio` — open Drizzle Studio GUI

## Do NOT Use

- `npm`, `yarn`, `pnpm`, `node`, `ts-node`, `npx` — use `bun`
- `express` — use `hono`
- `dotenv` — Bun auto-loads `.env`
- `pg`, `postgres.js` — use `drizzle-orm/bun-sql`
- `jest`, `vitest` — use `bun:test`
- `ws` — `WebSocket` is built-in
- `better-sqlite3` — use `bun:sqlite`

## Commit Convention

Format: `type: description` (lowercase)

Types: `feat`, `fix`, `chore`, `docs`, `style`, `refactor`, `perf`, `test`, `build`, `ci`, `revert`

Enforced by husky commit-msg hook — commits are rejected if they don't match.

## Pre-commit Checks

Runs automatically: `tsc --noEmit`, `eslint .`, `prettier --check .`

Fix before committing: `bun run lint:fix && bun run format`

## Adding a New Package

1. Create `packages/<name>/package.json`:
   ```json
   {
     "name": "@url-shortener/<name>",
     "version": "0.0.0",
     "private": true,
     "type": "module",
     "exports": {
       ".": "./src/index.ts",
       "./*": "./src/*.ts"
     }
   }
   ```
2. Create `packages/<name>/tsconfig.json`:
   ```json
   {
     "extends": "../../tsconfig.base.json",
     "include": ["src/**/*.ts"]
   }
   ```
3. Add source in `src/`, tests in `src/__tests__/`
4. Other packages depend on it via `"@url-shortener/<name>": "workspace:*"` in their package.json
5. Run `bun install` to link

## Adding Routes (app package)

Routes go in `packages/server/src/index.ts` using Hono:

```ts
app.get("/path/:param", (c) => {
  const param = c.req.param("param");
  const query = c.req.query("key");
  return c.json({ data: param });
});
```

Return errors with status: `c.json({ error: "message" }, 400)`

## Testing

- Framework: `bun:test`
- File convention: `src/__tests__/<name>.test.ts`
- Run: `bun test` (all) or `bun test packages/<name>/` (specific)

```ts
import { test, expect, describe } from "bun:test";

describe("feature", () => {
  test("does something", () => {
    expect(result).toBe(expected);
  });
});
```

Hono routes are tested with `app.request()` — no live server needed:

```ts
import { app } from "../index";

const res = await app.request("/path");
const json = await res.json();
expect(res.status).toBe(200);
```

## TypeScript Strictness

These non-obvious strict flags are enabled:

- `noUncheckedIndexedAccess` — array/object index access returns `T | undefined`
- `exactOptionalPropertyTypes` — can't assign `undefined` to optional props, omit the key instead
- `verbatimModuleSyntax` — use `import type` for type-only imports
- `noUnusedLocals` / `noUnusedParameters` — no unused variables or params

## Formatting

Semicolons, double quotes, 2-space indent, trailing commas, 80 char width.
