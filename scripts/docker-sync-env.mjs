import fs from "fs";
import path from "path";
import crypto from "crypto";

function loadEnvFile(filePath) {
  const env = {};
  if (!fs.existsSync(filePath)) return env;
  const content = fs.readFileSync(filePath, "utf8");
  for (const rawLine of content.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) continue;
    const eq = line.indexOf("=");
    if (eq <= 0) continue;
    const key = line.slice(0, eq).trim();
    let value = line.slice(eq + 1).trim();
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    env[key] = value;
  }
  return env;
}

function base64Url(input) {
  return Buffer.from(input)
    .toString("base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
}

function signHS256(secret, payload) {
  const header = { alg: "HS256", typ: "JWT" };
  const encodedHeader = base64Url(JSON.stringify(header));
  const encodedPayload = base64Url(JSON.stringify(payload));
  const data = `${encodedHeader}.${encodedPayload}`;
  const signature = crypto
    .createHmac("sha256", secret)
    .update(data)
    .digest("base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
  return `${data}.${signature}`;
}

function upsertLine(lines, key, value) {
  const idx = lines.findIndex((line) => line.trim().startsWith(`${key}=`));
  const next = `${key}=${value}`;
  if (idx >= 0) lines[idx] = next;
  else lines.push(next);
}

function ensureEnvLocal() {
  const cwd = process.cwd();
  const envDockerPath = path.resolve(cwd, ".env.docker");
  const envLocalPath = path.resolve(cwd, ".env.local");
  const envExamplePath = path.resolve(cwd, ".env.example");
  const envDockerExamplePath = path.resolve(cwd, ".env.docker.example");

  if (!fs.existsSync(envDockerPath) && fs.existsSync(envDockerExamplePath)) {
    fs.copyFileSync(envDockerExamplePath, envDockerPath);
    console.log("Created .env.docker from .env.docker.example");
  }

  const envDocker = loadEnvFile(envDockerPath);
  const envLocal = loadEnvFile(envLocalPath);
  const envExample = loadEnvFile(envExamplePath);

  const jwtSecret =
    envDocker.JWT_SECRET ||
    process.env.JWT_SECRET ||
    "super-secret-jwt-token-with-at-least-32-characters";

  const exp = Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 365 * 5;
  const anon = signHS256(jwtSecret, { role: "anon", iss: "supabase", exp });
  const service = signHS256(jwtSecret, { role: "service_role", iss: "supabase", exp });

  const localUrl =
    envLocal.NEXT_PUBLIC_SUPABASE_URL ||
    envDocker.NEXT_PUBLIC_SUPABASE_URL ||
    "http://127.0.0.1:54321";

  const rawLocal = fs.existsSync(envLocalPath) ? fs.readFileSync(envLocalPath, "utf8") : "";
  const lines = rawLocal ? rawLocal.split(/\r?\n/) : [];

  upsertLine(lines, "NEXT_PUBLIC_SUPABASE_URL", localUrl);
  upsertLine(lines, "NEXT_PUBLIC_SUPABASE_ANON_KEY", anon);
  upsertLine(lines, "SUPABASE_SERVICE_ROLE_KEY", service);
  upsertLine(lines, "NEXT_PUBLIC_TENANT_SLUG", envLocal.NEXT_PUBLIC_TENANT_SLUG || envExample.NEXT_PUBLIC_TENANT_SLUG || "tavola-demo");
  upsertLine(lines, "GROQ_MODEL", envLocal.GROQ_MODEL || envExample.GROQ_MODEL || "llama-3.1-8b-instant");
  upsertLine(lines, "NEXT_PUBLIC_APP_URL", envLocal.NEXT_PUBLIC_APP_URL || envExample.NEXT_PUBLIC_APP_URL || "http://localhost:3000");

  fs.writeFileSync(envLocalPath, lines.join("\n").trimEnd() + "\n", "utf8");
  console.log(`Updated ${envLocalPath}`);
  console.log("Set NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY.");
}

try {
  ensureEnvLocal();
} catch (error) {
  console.error(`docker-sync-env failed: ${error.message}`);
  process.exit(1);
}
