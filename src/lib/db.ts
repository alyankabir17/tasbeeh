import "server-only";
import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL!);

/** Run a query and return rows */
export async function query<T = Record<string, unknown>>(
  text: string,
  params?: unknown[]
): Promise<T[]> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const rows = await (sql as any)(text, params);
  return rows as T[];
}

/** Run a query and return the first row or null */
export async function queryOne<T = Record<string, unknown>>(
  text: string,
  params?: unknown[]
): Promise<T | null> {
  const rows = await query<T>(text, params);
  return rows[0] ?? null;
}

