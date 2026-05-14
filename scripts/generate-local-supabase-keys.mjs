import crypto from "crypto";

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

const secret = process.argv[2] || "super-secret-jwt-token-with-at-least-32-characters";
const exp = Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 365 * 5;

const anon = signHS256(secret, { role: "anon", iss: "supabase", exp });
const service = signHS256(secret, { role: "service_role", iss: "supabase", exp });

console.log("ANON_KEY=");
console.log(anon);
console.log("");
console.log("SERVICE_ROLE_KEY=");
console.log(service);
