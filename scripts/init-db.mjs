/**
 * Run this once to create the database tables:
 *   npm run db:init
 *
 * Reads DATABASE_URL from .env
 */
import pg from "pg";
import { readFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

// Load .env manually
const envPath = resolve(__dirname, "..", ".env");
try {
  const envFile = readFileSync(envPath, "utf-8");
  for (const line of envFile.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eqIdx = trimmed.indexOf("=");
    if (eqIdx === -1) continue;
    const key = trimmed.slice(0, eqIdx).trim();
    let val = trimmed.slice(eqIdx + 1).trim();
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1);
    }
    if (!process.env[key]) process.env[key] = val;
  }
} catch {
  // .env file not found — rely on existing env vars
}

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });

const sql = `
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS counters (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  current_count INTEGER DEFAULT 0,
  target INTEGER DEFAULT 100,
  lifetime_count INTEGER DEFAULT 0,
  last_updated TIMESTAMP DEFAULT NOW()
);
`;

async function main() {
  console.log("Connecting to database…");
  await pool.query(sql);
  console.log("✅ Tables created successfully.");
  await pool.end();
}

main().catch((err) => {
  console.error("❌ Failed to initialize database:", err);
  process.exit(1);
});
