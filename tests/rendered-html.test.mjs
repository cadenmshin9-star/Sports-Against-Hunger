import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

async function render() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request("http://localhost/", {
      headers: { accept: "text/html" },
    }),
    {
      ASSETS: {
        fetch: async () => new Response("Not found", { status: 404 }),
      },
    },
    {
      waitUntil() {},
      passThroughOnException() {},
    },
  );
}

test("server-renders the Sports Against Hunger sponsorship experience", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /<title>Sports Against Hunger \| Play With Purpose<\/title>/i);
  assert.match(html, /Every play can/);
  assert.match(html, /feed a family\./i);
  assert.match(html, /href="#contact">Become a sponsor/i);
  assert.match(html, /href="tel:\+16615938857"/i);
  assert.match(html, /href="mailto:cadenmshin9@gmail\.com/i);
  assert.match(html, /Valencia High School/);
  assert.match(html, /Hunger is local\./);
  assert.match(html, /So is the/);
  assert.match(html, /Sports Against Hunger is a student-led network designed to make/);
  assert.match(html, /Schools bring the energy\. Businesses make capped commitments\./);
  assert.match(html, /Three pillars\./);
  assert.match(html, />Compete</);
  assert.match(html, />Unite</);
  assert.match(html, />Give Back</);
  assert.match(html, /Preemptive Q&amp;A/);
  assert.match(html, /Does Sports Against Hunger handle money\?/);
  assert.match(html, /How are meals calculated\?/);
  assert.match(html, /Dignity first/);
  assert.match(html, /Pantry-led impact/);
  assert.match(html, /aria-label="Back to top"/);
  assert.doesNotMatch(html, /id="ethics"/);
  assert.doesNotMatch(html, /Why would businesses be interested\?/);
  assert.doesNotMatch(html, /How does money get divided/i);
  assert.doesNotMatch(html, /Valencia, California/);
});

test("keeps unconfirmed impact data explicit and accessible", async () => {
  const [page, css, layout] = await Promise.all([
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/globals.css", import.meta.url), "utf8"),
    readFile(new URL("../app/layout.tsx", import.meta.url), "utf8"),
  ]);

  assert.match(page, /value: "0", label: "verified meals"/);
  assert.match(page, /value: "0", label: "games tracked"/);
  assert.match(page, /value: "0", label: "founding sponsors"/);
  assert.match(page, /Partner reveal coming soon/);
  assert.match(page, /Goal announced after pantry approval/);
  assert.match(page, /Illustrative only\./);
  assert.match(page, /Sports<\/strong>\s*<strong>Against<\/strong>\s*<strong>Hunger/);
  assert.match(page, /className="hero-visual__canvas"/);
  assert.match(page, /className="loader__tiles"/);
  assert.match(page, /setLoaderProgress/);
  assert.match(page, /className="ethics-answer__grid"/);
  assert.match(page, /Dignity first/);
  assert.match(page, /Pantry-led impact/);
  assert.match(css, /prefers-reduced-motion:\s*reduce/);
  assert.match(css, /\[data-reveal\]\.is-visible/);
  assert.match(css, /\.valencia-crest/);
  assert.match(css, /\.hero-visual__canvas/);
  assert.match(css, /\.loader__tiles/);
  assert.match(css, /\.back-to-top/);
  assert.match(css, /--paper:\s*#e4e9e0/);
  assert.match(layout, /images: \[\{ url: socialImage, width: 1200, height: 630 \}\]/);

  await access(new URL("../public/og.png", import.meta.url));
});
