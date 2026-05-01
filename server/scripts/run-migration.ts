import { neon } from "@neondatabase/serverless";
import { readFileSync } from "fs";
import { join } from "path";
import dotenv from "dotenv";

dotenv.config();

async function runMigration() {
  const sql = neon(process.env.DATABASE_URL!);

  const migrationSQL = readFileSync(
    join(process.cwd(), "drizzle", "0001_clerk_auth_migration.sql"),
    "utf-8"
  );

  // Parse and execute statements one by one
  const statements = migrationSQL
    .split("\n")
    .filter((line) => !line.trim().startsWith("--") && line.trim() !== "")
    .join("\n")
    .split(";")
    .map((s) => s.trim())
    .filter((s) => s.length > 0);

  for (const statement of statements) {
    console.log(`▶ ${statement.substring(0, 70)}...`);
    await sql.query(statement);
  }

  console.log("✅ Migration 0001 applied successfully!");
  process.exit(0);
}

runMigration().catch((err) => {
  console.error("❌ Migration failed:", err);
  process.exit(1);
});
