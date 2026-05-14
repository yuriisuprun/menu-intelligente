const baseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "http://127.0.0.1:54321";
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

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
  assert(anonKey, "NEXT_PUBLIC_SUPABASE_ANON_KEY is required");
  assert(serviceRoleKey, "SUPABASE_SERVICE_ROLE_KEY is required");

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
