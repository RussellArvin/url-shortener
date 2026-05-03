Drizzle ORM with PostgreSQL via `drizzle-orm/bun-sql`.

## Schema Convention

- One file per table: `src/schema/<tablename>.ts`
- Barrel export from `src/schema/index.ts` — add `export * from "./<tablename>"` for each new table
- Use `pgTable` from `drizzle-orm/pg-core`
- Column naming: `snake_case` in DB, `camelCase` in TypeScript
- Every table should include:
  - `id` — `uuid().primaryKey().defaultRandom()`
  - `createdAt` — `timestamp("created_at").defaultNow().notNull()`
  - `updatedAt` — `timestamp("updated_at").defaultNow().notNull()`

## Adding a New Table

1. Create `src/schema/<tablename>.ts` with `pgTable()` definition
2. Add `export * from "./<tablename>"` to `src/schema/index.ts`
3. Run `bun run drizzle:generate` to create a SQL migration
4. Run `bun run drizzle:migrate` to apply it (or `drizzle:push` for dev)

## Environment

- Requires `DATABASE_URL` env var (Postgres connection string)
- Bun auto-loads `.env` — no dotenv needed
- Never commit `.env` files

## Querying

```ts
import { db } from "@repo/database";
import { myTable } from "@repo/database/schema";
import { eq } from "drizzle-orm";

// Select
const all = await db.select().from(myTable);
const one = await db.select().from(myTable).where(eq(myTable.id, id));

// Insert
await db.insert(myTable).values({ ... });

// Update
await db.update(myTable).set({ ... }).where(eq(myTable.id, id));

// Delete
await db.delete(myTable).where(eq(myTable.id, id));
```

## Drizzle Commands

- `bun run drizzle:generate` — generate migration from schema changes
- `bun run drizzle:migrate` — apply pending migrations
- `bun run drizzle:push` — push schema directly to DB (dev only, no migration file)
- `bun run drizzle:studio` — open Drizzle Studio GUI
