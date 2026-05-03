/**
 * Smoke-test public.cmo_simulation_runs via PostgREST (uses .env.local).
 * Does not print keys. Logs JWT "role" claim for service vs anon key (sanity check).
 */
import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");

function parseDotEnv(filePath) {
  const env = {};
  const raw = readFileSync(filePath, "utf8");
  for (const line of raw.split("\n")) {
    const t = line.trim();
    if (!t || t.startsWith("#")) continue;
    const eq = t.indexOf("=");
    if (eq === -1) continue;
    const key = t.slice(0, eq).trim();
    let val = t.slice(eq + 1).trim();
    if (
      (val.startsWith('"') && val.endsWith('"')) ||
      (val.startsWith("'") && val.endsWith("'"))
    ) {
      val = val.slice(1, -1);
    }
    env[key] = val;
  }
  return env;
}

function jwtRole(jwt) {
  try {
    const part = jwt.split(".")[1];
    const json = Buffer.from(part, "base64url").toString("utf8");
    return /** @type {{ role?: string }} */ (JSON.parse(json)).role ?? "unknown";
  } catch {
    return "invalid_jwt";
  }
}

const envPath = resolve(root, ".env.local");
const env = parseDotEnv(envPath);
const url = env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const serviceKey = env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !anonKey) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local");
  process.exit(1);
}

const probeKey = serviceKey || anonKey;
const supabase = createClient(url, probeKey);

const { data, error } = await supabase.from("cmo_simulation_runs").select("run_id").limit(1);

const out = {
  host: new URL(url).host,
  anonJwtRole: jwtRole(anonKey),
  serviceKeyConfigured: Boolean(serviceKey),
  serviceJwtRole: serviceKey ? jwtRole(serviceKey) : null,
  tableProbe: error
    ? {
        ok: false,
        message: error.message,
        code: error.code,
        details: error.details,
        hint: error.hint,
      }
    : { ok: true, sampleRowsReturned: data?.length ?? 0 },
};

console.log(JSON.stringify(out, null, 2));
