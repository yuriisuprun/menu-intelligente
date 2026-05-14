import fs from "fs";
import path from "path";
import crypto from "crypto";

function loadEnvFile(filePath) {
  if (!fs.existsSync(filePath)) return;
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
    if (!process.env[key]) {
      process.env[key] = value;
    }
  }
}

loadEnvFile(path.resolve(process.cwd(), ".env.local"));
loadEnvFile(path.resolve(process.cwd(), ".env"));
loadEnvFile(path.resolve(process.cwd(), ".env.docker"));
loadEnvFile(path.resolve(process.cwd(), ".env.docker.local"));

const baseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "http://127.0.0.1:54321";

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

function getFallbackKey(role) {
  const secret = process.env.JWT_SECRET;
  if (!secret) return null;
  const exp = Math.floor(Date.now() / 1000) + 60 * 60;
  return signHS256(secret, { role, iss: "supabase", exp });
}

const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || getFallbackKey("anon");
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || getFallbackKey("service_role");

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

async function call(path, key) {
  const response = await fetch(`${baseUrl}${path}`, {
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`
    }
  });
  const text = await response.text();
  return { response, text };
}

async function main() {
  assert(anonKey, "NEXT_PUBLIC_SUPABASE_ANON_KEY is required (or set JWT_SECRET in .env.docker)");
  assert(serviceRoleKey, "SUPABASE_SERVICE_ROLE_KEY is required (or set JWT_SECRET in .env.docker)");

  const health = await fetch(`${baseUrl}/`);
  assert(health.ok, `PostgREST is not reachable at ${baseUrl}`);

  const anon = await call("/tenants?select=id,slug&limit=1", anonKey);
  assert(anon.response.ok, `Anon request failed (${anon.response.status}): ${anon.text}`);

  const service = await call("/tenants?select=id,slug&limit=1", serviceRoleKey);
  assert(service.response.ok, `Service role request failed (${service.response.status}): ${service.text}`);

  const rows = JSON.parse(service.text);
  assert(Array.isArray(rows), "Unexpected service role response shape");

  console.log("Docker smoke test passed");
  console.log(`PostgREST: ${baseUrl}`);
  console.log(`Anon status: ${anon.response.status}`);
  console.log(`Service rows returned: ${rows.length}`);
}

main().catch((error) => {
  console.error(`Docker smoke test failed: ${error.message}`);
  process.exit(1);
});
