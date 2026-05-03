import { drizzle } from "drizzle-orm/bun-sql";
import * as schema from "./schema";

const DATABASE_URL = process.env["DATABASE_URL"];
if (!DATABASE_URL) throw new Error("DATABASE_URL is required");

export const db = drizzle({
  connection: DATABASE_URL,
  schema,
});

export type Database = typeof db;
