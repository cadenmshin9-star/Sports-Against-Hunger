import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

export class DatabaseConfigurationError extends Error {
  constructor() {
    super("Donation tracking requires DATABASE_URL.");
    this.name = "DatabaseConfigurationError";
  }
}

function createDb() {
  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) throw new DatabaseConfigurationError();

  return drizzle(neon(databaseUrl), { schema });
}

let database: ReturnType<typeof createDb> | null = null;

export function isDatabaseConfigured() {
  return Boolean(process.env.DATABASE_URL);
}

export function getDb() {
  database ??= createDb();
  return database;
}
