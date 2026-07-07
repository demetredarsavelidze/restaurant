import "dotenv/config";
import { readFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { closePool, getPool } from "../utils/sqlServer.js";

const __dirname = dirname(fileURLToPath(import.meta.url));

const splitBatches = (script: string) =>
  script
    .split(/^\s*GO\s*$/gim)
    .map((batch) => batch.trim())
    .filter(Boolean);

async function main() {
  const schema = await readFile(join(__dirname, "schema.sql"), "utf8");
  const pool = await getPool();

  for (const batch of splitBatches(schema)) {
    await pool.request().batch(batch);
  }

  console.log("SQL Server schema initialized successfully.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await closePool();
  });
