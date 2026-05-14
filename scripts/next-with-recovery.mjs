import fs from "node:fs/promises";
import path from "node:path";
import { spawn } from "node:child_process";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const nextBin = require.resolve("next/dist/bin/next");
const mode = process.argv[2];
const validModes = new Set(["dev", "build", "start"]);

if (!validModes.has(mode)) {
  console.error(`Invalid mode "${mode}". Use one of: dev, build, start.`);
  process.exit(1);
}

const shouldRecover = (output) => {
  const normalized = output.toLowerCase();
  return (
    normalized.includes("cannot find module './") &&
    normalized.includes(".next\\server\\webpack-runtime.js")
  );
};

const runNext = async () => {
  const child = spawn(process.execPath, [nextBin, mode], {
    cwd: process.cwd(),
    env: process.env,
    stdio: ["inherit", "pipe", "pipe"]
  });

  let collected = "";
  child.stdout.on("data", (chunk) => {
    const text = chunk.toString();
    collected += text;
    process.stdout.write(chunk);
  });
  child.stderr.on("data", (chunk) => {
    const text = chunk.toString();
    collected += text;
    process.stderr.write(chunk);
  });

  return new Promise((resolve) => {
    child.on("exit", (code) => resolve({ code: code ?? 1, output: collected }));
  });
};

const cleanNextArtifacts = async () => {
  const nextDir = path.join(process.cwd(), ".next");
  await fs.rm(nextDir, { recursive: true, force: true });
};

const firstRun = await runNext();
if (firstRun.code === 0) {
  process.exit(0);
}

if (!shouldRecover(firstRun.output)) {
  process.exit(firstRun.code);
}

console.warn("Detected stale Next.js build artifacts. Cleaning .next and retrying once...");
await cleanNextArtifacts();
const secondRun = await runNext();
process.exit(secondRun.code);
