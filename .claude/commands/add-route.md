Add a new API route to the app package for: $ARGUMENTS

Follow the existing patterns in this repo:

1. Add the route handler in `packages/server/src/index.ts` using Hono conventions
2. Use `c.json()` for responses, `c.req.param()` for path params, `c.req.query()` for query params
3. Return errors with status codes: `c.json({ error: "message" }, 400)`
4. Add corresponding tests in `packages/server/src/__tests__/routes.test.ts` using `app.request()` — no live server
5. If the route needs database access, import from `@url-shortener/database` and `@url-shortener/database/schema` — use Drizzle query builder only (db.select(), db.insert(), etc.), never db.execute()

Run `bun test packages/server/` after implementation to verify the tests pass.

Ask me for the route details (method, path, request/response shape) before writing code.
