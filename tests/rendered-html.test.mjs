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
  assert.match(html, /<title>Sports Against Hunger \| Game-Day Hunger Relief<\/title>/i);
  assert.match(
    html,
    />Every play<\/span><span[^>]*>can feed a<\/span><span[^>]*>family\.<\/span>/i,
  );
  assert.match(html, /Athletic achievement/);
  assert.match(html, /Direct to the Pantry/);
  assert.match(html, /direct contributions to local food partners/i);
  assert.match(
    html,
    /<a class="header-cta" href="#contact">[\s\S]*?Become a sponsor[\s\S]*?<\/a>/i,
  );
  assert.doesNotMatch(html, /href="tel:/i);
  assert.doesNotMatch(html, /661-593-8857|cadenmshin9@gmail\.com/i);
  assert.match(html, /href="mailto:sportsagainsthunger@gmail\.com/i);
  assert.match(html, /Valencia High School/);
  assert.match(html, /SCV Food Pantry/);
  assert.match(html, /Copper Hill BBQ/);
  assert.match(html, /Game sponsored by Copper Hill BBQ/i);
  assert.match(html, /Sports Against Hunger on Instagram/);
  assert.match(html, /href="https:\/\/copperhillbbq\.com\/"/);
  assert.match(html, /href="https:\/\/www\.instagram\.com\/copperhillbbq\?/);
  assert.match(html, /href="https:\/\/www\.instagram\.com\/sportsagainsthunger\.vhs\?/);
  assert.match(html, /href="https:\/\/www\.scvfoodpantry\.org\/"/);
  assert.match(html, /aria-label="Santa Clarita Valley Food Pantry"/);
  assert.match(html, /Built by students\. Backed by community\./);
  assert.match(html, /Hunger is local\./);
  assert.match(html, /So is the/);
  assert.match(html, /Sports Against Hunger is a student-led network designed to make/);
  assert.match(html, /Schools bring the energy\. Businesses make capped commitments\./);
  assert.match(html, /Three pillars\./);
  assert.match(html, /Sports Against Hunger/);
  assert.match(html, /everyone can help lead the effort/i);
  assert.doesNotMatch(html, /Students &amp; teams/);
  assert.doesNotMatch(html, /WHEN THE SEASON GOES LIVE/i);
  assert.match(html, />Compete</);
  assert.match(html, />Unite</);
  assert.match(html, />Give Back</);
  assert.match(html, /UPCOMING HOME GAME/);
  assert.match(html, /Valencia High School versus Chaminade High School/);
  assert.match(html, /matchup-card__team--valencia/);
  assert.match(html, /matchup-card__team--chaminade/);
  assert.match(html, /1 meal = \$2\.28/);
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
  assert.doesNotMatch(html, /West Hills|Home team \/ Santa Clarita/i);
});

test("keeps unconfirmed impact data explicit and accessible", async () => {
  const [page, css, layout] = await Promise.all([
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/globals.css", import.meta.url), "utf8"),
    readFile(new URL("../app/layout.tsx", import.meta.url), "utf8"),
  ]);

  assert.match(page, /value: "0", label: "verified meals"/);
  assert.match(page, /note: "1 meal = \$2\.28"/);
  assert.match(page, /value: "0", label: "games tracked"/);
  assert.match(page, /value: "1", label: "founding sponsor"/);
  assert.match(page, /note: "Copper Hill BBQ"/);
  assert.match(page, /Home opener · August 28/);
  assert.match(page, /Pledge details appear only after they are confirmed\./);
  assert.match(page, /Athletic achievement/);
  assert.doesNotMatch(page, /\$\d+\s+per\s+(touchdown|goal|hit)/i);
  assert.match(page, /Sports<\/strong>\s*<strong>Against<\/strong>\s*<strong>Hunger/);
  assert.match(page, /className="hero-visual__canvas"/);
  assert.match(page, /label: "FOOTBALL"/);
  assert.match(page, /label: "BASKETBALL"/);
  assert.match(page, /label: "SOCCER BALL"/);
  assert.match(page, /label: "BASEBALL BAT"/);
  assert.doesNotMatch(page, /label: "BASEBALL GLOVE"/);
  assert.match(page, /label: "TENNIS RACKET"/);
  assert.match(page, /label: "RUNNING SHOE"/);
  assert.match(page, /fizzleStart/);
  assert.match(page, /woundStrength/);
  assert.match(page, /releasePulseStart/);
  assert.match(page, /width < 540 \? 380 : Math\.min\(780/);
  assert.match(page, /desynchronized: true/);
  assert.match(page, /scheduleResize/);
  assert.match(page, /scrollProgressRef/);
  assert.match(page, /pointer\.down/);
  assert.match(page, /quadraticCurveTo/);
  assert.match(page, /patchCount = 12/);
  assert.match(page, /bitangentX/);
  assert.match(page, /function runningShoeProfile/);
  assert.match(page, /const forefoot = Math\.exp/);
  assert.match(page, /const isSole = progress < 0\.52/);
  assert.match(page, /top = blend\(-0\.31, -0\.61/);
  assert.match(page, /if \(pointer\.down\) event\.preventDefault\(\)/);
  assert.match(page, /const perspectiveDistance = compactViewport \? 4\.6 : 3\.9/);
  assert.match(css, /touch-action:\s*none/);
  assert.match(css, /min-height:\s*clamp\(340px, 96vw, 430px\)/);
  assert.match(
    css,
    /orientation:\s*landscape[\s\S]*?max-height:\s*650px[\s\S]*?grid-template-columns:\s*minmax\(0, 54%\) minmax\(0, 46%\)[\s\S]*?\.hero-visual[\s\S]*?grid-column:\s*2/,
  );
  assert.match(css, /--valencia-purple:\s*#552583/);
  assert.match(css, /--valencia-gold:\s*#ffc72c/);
  assert.match(css, /--chaminade-navy:\s*#002b5c/);
  assert.match(css, /--chaminade-orange:\s*#f58220/);
  assert.doesNotMatch(page, /orientation\.lock/);
  assert.doesNotMatch(page, /\bpilot\b/i);
  assert.match(page, /sports-against-hunger-emblem\.webp/);
  assert.match(page, /copper-hill-bbq-logo\.webp/);
  assert.match(page, /\/instagram\.svg/);
  assert.match(page, /sportsagainsthunger\.vhs/);
  assert.match(page, /copperhillbbq\.com/);
  assert.doesNotMatch(css, /\.playbook-list article:hover\s*\{[^}]*padding-/);
  assert.doesNotMatch(page, /sports-sprite\.png/);
  assert.doesNotMatch(page, /publicSportModels/);
  assert.doesNotMatch(page, /sketchfab\.com\/models/);
  assert.doesNotMatch(page, /className="hero-model-stack"/);
  assert.match(page, /fizzleEase/);
  assert.match(page, /role="button"/);
  assert.doesNotMatch(page, /lensRadius/);
  assert.match(page, /className="hero-transition"/);
  assert.match(page, /className="brand-lightbox"/);
  assert.match(page, /className="contact__instagram-icon"/);
  assert.match(page, /wall-sticker--\$\{kind\}/);
  assert.match(page, /kind="feed"/);
  assert.match(page, /kind="pantry"/);
  assert.match(page, /kind="hands"/);
  assert.match(page, /kind="clipboard"/);
  assert.match(page, /kind="receipt"/);
  assert.match(page, /kind="calendar"/);
  assert.doesNotMatch(page, /kind="handshake"/);
  assert.match(page, /kind="speech"/);
  assert.match(page, /kind="meal"/);
  assert.match(page, /kind="whistle"/);
  assert.match(page, /kind="trophy"/);
  assert.match(page, /Plate, fork, and spoon sticker/);
  assert.match(page, /Warm meal bowl sticker/);
  assert.match(page, /Soccer ball at sunset sticker/);
  assert.doesNotMatch(page, /PLAY \/ FEED \/ REPEAT/);
  assert.doesNotMatch(page, /POINTS → PLATES/);
  assert.doesNotMatch(page, /NO EMPTY PLATES/);
  assert.doesNotMatch(page, /LOVE YOUR BLOCK/);
  assert.doesNotMatch(page, /meal-sticker--plate/);
  assert.doesNotMatch(page, /className="meal-flow"/);
  assert.match(page, /className="loader__tiles"/);
  assert.doesNotMatch(page, /setLoaderProgress/);
  assert.match(page, /loaderBarRef/);
  assert.match(page, /loaderTextRef/);
  assert.match(page, /className="ethics-answer__grid"/);
  assert.match(page, /className="faq-answer-shell"/);
  assert.doesNotMatch(page, /ethics-answer__ledger/);
  assert.match(page, /Dignity first/);
  assert.match(page, /Pantry-led impact/);
  assert.match(css, /prefers-reduced-motion:\s*reduce/);
  assert.match(css, /\[data-reveal\]\.is-visible/);
  assert.match(css, /\.valencia-crest/);
  assert.match(css, /\.partner-slots__pantry/);
  assert.match(css, /\.hero-visual__canvas/);
  assert.doesNotMatch(css, /\.hero-sport-field/);
  assert.doesNotMatch(css, /\.hero-model\.is-active/);
  assert.doesNotMatch(css, /\.hero-model__scan/);
  assert.doesNotMatch(css, /\.sport-cursor/);
  assert.match(css, /\.faq-item\.is-open \.faq-answer-shell/);
  assert.match(css, /\.wall-sticker--feed/);
  assert.match(css, /\.wall-sticker--pantry/);
  assert.match(css, /\.wall-sticker--sunset/);
  assert.match(css, /\.wall-sticker--clipboard/);
  assert.match(css, /\.wall-sticker--receipt/);
  assert.match(css, /\.wall-sticker--calendar/);
  assert.match(css, /\.wall-sticker--handshake/);
  assert.match(css, /\.wall-sticker--speech/);
  assert.match(css, /\.wall-sticker--meal/);
  assert.match(css, /\.wall-sticker--whistle/);
  assert.match(css, /\.wall-sticker--trophy/);
  assert.match(css, /\.wall-sticker:hover::after/);
  assert.match(css, /\.hero-transition/);
  assert.match(css, /\.dashboard \.wall-sticker--calendar\s*\{\s*display:\s*none/);
  assert.match(css, /\.brand-lightbox/);
  assert.match(css, /data-reveal="swoosh-left"/);
  assert.match(css, /\.loader__tiles/);
  assert.match(css, /\.back-to-top/);
  assert.match(css, /--paper:\s*#e4e9e0/);
  assert.match(layout, /images: \[\{ url: socialImage, width: 1200, height: 630 \}\]/);
  assert.match(layout, /@vercel\/analytics\/next/);
  assert.match(layout, /<Analytics\s*\/>/);

  await access(new URL("../public/og.png", import.meta.url));
  await access(new URL("../public/sports-against-hunger-emblem.webp", import.meta.url));
  await access(new URL("../public/copper-hill-bbq-logo.webp", import.meta.url));
  await access(new URL("../public/instagram.svg", import.meta.url));
});
