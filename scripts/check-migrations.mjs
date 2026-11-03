import { readdirSync } from "node:fs";
import { join } from "node:path";

const directory = join(process.cwd(), "supabase", "migrations");
const files = readdirSync(directory).filter((file) => file.endsWith(".sql")).sort();

const invalid = files.filter((file) => !/^\d{14}_[a-z0-9_]+\.sql$/.test(file));
const versions = files.map((file) => file.slice(0, 14));
const duplicates = versions.filter((version, index) => versions.indexOf(version) !== index);

if (files.length === 0) {
  console.error("No SQL migrations were found.");
  process.exit(1);
}
if (invalid.length > 0) {
  console.error("Migration filenames must use a 14-digit timestamp and lowercase snake_case:", invalid);
  process.exit(1);
}
if (duplicates.length > 0) {
  console.error("Duplicate migration versions were found:", [...new Set(duplicates)]);
  process.exit(1);
}

console.log(`Validated ${files.length} migration filenames; no duplicate versions found.`);
