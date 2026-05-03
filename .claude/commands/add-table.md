Create a new Drizzle database table named "$ARGUMENTS" in the database package.

Follow the schema conventions in packages/database/CLAUDE.md exactly:

1. Create `packages/database/src/schema/$ARGUMENTS.ts` with a `pgTable()` definition
2. Use snake_case for DB column names, camelCase for TypeScript
3. Include the standard columns: id (uuid, primaryKey, defaultRandom), createdAt (timestamp, defaultNow, notNull), updatedAt (timestamp, defaultNow, notNull)
4. Add `export * from "./$ARGUMENTS"` to `packages/database/src/schema/index.ts`
5. Run `bun run drizzle:generate` to create the migration

Ask me what columns the table should have before writing any code.
