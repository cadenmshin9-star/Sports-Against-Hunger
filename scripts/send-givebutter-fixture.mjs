import { readFile } from "node:fs/promises";

try {
  process.loadEnvFile?.(".env.local");
} catch {
  // Environment variables may already be set by the calling shell.
}

const fixtureName = process.argv[2] ?? "transaction-succeeded";
const baseUrl = process.argv[3] ?? "http://localhost:3000";
const secret = process.env.GIVEBUTTER_WEBHOOK_SECRET;

if (!/^[a-z-]+$/.test(fixtureName)) {
  throw new Error("Fixture name may contain lowercase letters and hyphens only.");
}
if (!secret) {
  throw new Error("Set GIVEBUTTER_WEBHOOK_SECRET to a local-only test value first.");
}

const fixtureUrl = new URL(
  `../tests/fixtures/givebutter/${fixtureName}.json`,
  import.meta.url,
);
const body = await readFile(fixtureUrl, "utf8");
const response = await fetch(`${baseUrl}/api/webhooks/givebutter`, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Signature: secret,
  },
  body,
});

console.log(response.status, await response.text());
if (!response.ok) process.exitCode = 1;
