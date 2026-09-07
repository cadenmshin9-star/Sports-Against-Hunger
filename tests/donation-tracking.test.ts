import assert from "node:assert/strict";
import { readdir, readFile } from "node:fs/promises";
import test from "node:test";
import {
  buildGivebutterDonationUrl,
  sanitizeAttributionToken,
} from "../lib/community-challenges/links";
import { defaultChallenge } from "../lib/community-challenges/default";
import { normalizeGivebutterUtm } from "../lib/givebutter/attribution";
import {
  calculateMealCount,
  parseGivebutterAmountToCents,
} from "../lib/givebutter/money";
import { verifyGivebutterSignature } from "../lib/givebutter/signature";

test("converts Givebutter major-unit amounts to integer cents", () => {
  assert.equal(parseGivebutterAmountToCents("$1,234.50"), 123450);
  assert.equal(parseGivebutterAmountToCents("22.8"), 2280);
  assert.equal(parseGivebutterAmountToCents(11.4), 1140);
  assert.equal(parseGivebutterAmountToCents("1.234"), null);
  assert.equal(parseGivebutterAmountToCents(-1), null);
});

test("calculates whole meals after aggregating net cents", () => {
  assert.equal(calculateMealCount(114 + 114, 228), 1);
  assert.equal(calculateMealCount(2280 - 456, 228), 8);
  assert.equal(calculateMealCount(227, 228), 0);
});

test("uses an open-ended individual-giving record by default", () => {
  assert.equal(defaultChallenge.slug, "individual-giving");
  assert.equal(defaultChallenge.opponentEventName, null);
  assert.equal(defaultChallenge.deadlineAt, null);
  assert.equal(defaultChallenge.mealGoal, null);
  assert.doesNotMatch(defaultChallenge.title, /kickoff|game|opponent/i);
});

test("normalizes object, pair-array, JSON, and query-string UTMs", () => {
  const cases = [
    {
      utm_source: "sports_against_hunger",
      utm_campaign: "individual-giving",
    },
    [
      { name: "utm_source", value: "sports_against_hunger" },
      { name: "utm_campaign", value: "individual-giving" },
    ],
    JSON.stringify({ source: "sports_against_hunger", campaign: "individual-giving" }),
    "utm_source=sports_against_hunger&utm_campaign=individual-giving",
  ];

  for (const value of cases) {
    const normalized = normalizeGivebutterUtm(value);
    assert.equal(normalized.confident, true);
    assert.equal(normalized.source, "sports_against_hunger");
    assert.equal(normalized.campaign, "individual-giving");
  }
});

test("rejects conflicting attribution and keeps unknown shape privacy-safe", () => {
  const normalized = normalizeGivebutterUtm({
    utm_source: "sports_against_hunger",
    nested: { utm_source: "someone_else", donor_email: "private@example.com" },
    utm_campaign: "individual-giving",
  });

  assert.equal(normalized.confident, false);
  assert.ok(normalized.issues.includes("conflicting_source"));
  assert.doesNotMatch(normalized.shape, /private@example\.com|donor_email/);
});

test("builds Givebutter links that preserve safe channel attribution", () => {
  const href = buildGivebutterDonationUrl(
    {
      givebutterDestinationUrl: "https://givebutter.com/pantry/donate?existing=1",
      attributionIdentifier: "individual-giving",
    },
    { medium: "qr", content: "community-flyer" },
    1140,
  );
  const url = new URL(href);

  assert.equal(url.searchParams.get("existing"), "1");
  assert.equal(url.searchParams.get("utm_source"), "sports_against_hunger");
  assert.equal(url.searchParams.get("utm_medium"), "qr");
  assert.equal(url.searchParams.get("utm_campaign"), "individual-giving");
  assert.equal(url.searchParams.get("utm_content"), "community-flyer");
  assert.equal(url.searchParams.get("amount"), "11.40");
  assert.equal(sanitizeAttributionToken("community-flyer"), "community-flyer");
  assert.equal(sanitizeAttributionToken("bad value"), undefined);
});

test("compares the configured Signature value exactly", () => {
  assert.equal(verifyGivebutterSignature("local-secret", "local-secret"), true);
  assert.equal(verifyGivebutterSignature("local-secret ", "local-secret"), false);
  assert.equal(verifyGivebutterSignature("wrong", "local-secret"), false);
});

test("migration enforces transaction and refund idempotency", async () => {
  const migrationDirectory = new URL("../drizzle/", import.meta.url);
  const [migrationName] = (await readdir(migrationDirectory)).filter((name) =>
    name.endsWith(".sql"),
  );
  assert.ok(migrationName, "expected a generated SQL migration");
  const migration = await readFile(
    new URL(migrationName, migrationDirectory),
    "utf8",
  );
  assert.match(migration, /donation_transactions_external_id_unique/);
  assert.match(migration, /donation_refunds_external_id_unique/);
  assert.match(migration, /counts_toward_challenge/);
  assert.match(migration, /sports-against-hunger-individual-giving/);
});
