"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";

const navItems = [
  ["About", "#about"],
  ["Impact", "#impact"],
  ["Playbook", "#playbook"],
  ["Partners", "#partners"],
  ["Contact", "#contact"],
];

const impactStats = [
  { value: "0", label: "verified meals", note: "Tracker activates with the pilot" },
  { value: "0", label: "games tracked", note: "Official results only" },
  { value: "0", label: "founding sponsors", note: "Partner reveal coming soon" },
];

const pillars = [
  {
    number: "01",
    title: "Compete",
    body: "Inspire excellence in athletics and turn game-day effort into shared purpose.",
  },
  {
    number: "02",
    title: "Unite",
    body: "Connect students, families, local businesses, and community partners.",
  },
  {
    number: "03",
    title: "Give Back",
    body: "Transform school spirit into practical, verified support for local families.",
  },
];

const incentives = [
  {
    label: "School",
    title: "Stronger game days",
    body: "More school spirit, student ownership, and positive local-business relationships.",
  },
  {
    label: "Students & teams",
    title: "Real leadership reps",
    body: "Meaningful roles in events, storytelling, outreach, and impact reporting.",
  },
  {
    label: "Sponsors",
    title: "Visible local purpose",
    body: "Game-day recognition, community goodwill, and a clear report of verified impact.",
  },
  {
    label: "Food partner",
    title: "Support that fits",
    body: "Direct, pantry-led contributions based on what families actually need.",
  },
];

const playbook = [
  {
    number: "01",
    title: "A business commits",
    body: "A local sponsor chooses a clear, capped commitment tied to a team achievement.",
  },
  {
    number: "02",
    title: "The team delivers",
    body: "An official touchdown, goal, hit, or milestone unlocks part of that commitment.",
  },
  {
    number: "03",
    title: "The pantry confirms",
    body: "Funds move directly to the approved food partner, which verifies the real impact.",
  },
];

const ethics = [
  {
    number: "01",
    title: "Dignity first",
    body: "Families are never turned into marketing material. Privacy and respect lead every story.",
  },
  {
    number: "02",
    title: "Pantry-led impact",
    body: "The food partner decides what support is useful and how meal impact is calculated.",
  },
  {
    number: "03",
    title: "Fair, safe participation",
    body: "Students get meaningful leadership with adult oversight, clear boundaries, and no pay-to-play pressure.",
  },
  {
    number: "04",
    title: "Accountable partners",
    body: "Sponsors are screened, commitments are capped, and confirmed results are reported honestly.",
  },
];

const questions = [
  {
    kind: "text",
    question: "Does Sports Against Hunger handle money?",
    answer:
      "No. The program is designed as a closed financial flow: sponsor support moves directly to the approved food partner. Students coordinate the campaign and its reporting, not the funds.",
  },
  {
    kind: "ethics",
    question: "What are Sports Against Hunger’s ethics?",
    answer:
      "The standard is simple: protect people, follow the food partner’s lead, and publish only what can be proved.",
  },
  {
    kind: "text",
    question: "How are meals calculated?",
    answer:
      "The approved food partner sets the official dollar-to-meal calculation. Sports Against Hunger publishes that method with the verified results once the pilot is active.",
  },
];

const loaderTiles = Array.from({ length: 96 });

function Arrow() {
  return <span aria-hidden="true">↗</span>;
}

function Playmark() {
  return (
    <span className="playmark" aria-hidden="true">
      <span>SAH</span>
      <i />
    </span>
  );
}

function HeroFieldCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext("2d");
    if (!context) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const pointer = { x: -1000, y: -1000, active: false };
    let width = 0;
    let height = 0;
    let frame = 0;
    let particles: Array<{
      x: number;
      y: number;
      tx: number;
      ty: number;
      size: number;
      phase: number;
      accent: boolean;
    }> = [];

    const createParticles = () => {
      const next = [];
      const count = Math.max(120, Math.min(280, Math.floor(width / 2.2)));
      const centerX = width * 0.54;
      const centerY = height * 0.52;
      const ballWidth = width * 0.58;
      const ballHeight = height * 0.26;

      for (let index = 0; index < count; index += 1) {
        const progress = (index / count) * Math.PI * 2;
        const radiusNoise = 0.82 + Math.random() * 0.22;
        const tx =
          centerX + Math.cos(progress) * ballWidth * 0.5 * radiusNoise;
        const ty =
          centerY + Math.sin(progress) * ballHeight * 0.5 * radiusNoise;
        next.push({
          x: tx + (Math.random() - 0.5) * 80,
          y: ty + (Math.random() - 0.5) * 80,
          tx,
          ty,
          size: 0.8 + Math.random() * 1.8,
          phase: Math.random() * Math.PI * 2,
          accent: index % 13 === 0,
        });
      }

      for (let index = 0; index < 54; index += 1) {
        const lane = index % 6;
        const column = Math.floor(index / 6);
        const tx = centerX - ballWidth * 0.12 + column * (ballWidth * 0.03);
        const ty = centerY - ballHeight * 0.15 + lane * (ballHeight * 0.06);
        next.push({
          x: tx,
          y: ty,
          tx,
          ty,
          size: 1.25,
          phase: index * 0.31,
          accent: lane === 2 || lane === 3,
        });
      }

      particles = next;
    };

    const resize = () => {
      const bounds = canvas.getBoundingClientRect();
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      width = bounds.width;
      height = bounds.height;
      canvas.width = Math.floor(width * ratio);
      canvas.height = Math.floor(height * ratio);
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      createParticles();
    };

    const render = (time = 0) => {
      context.clearRect(0, 0, width, height);
      const centerX = width * 0.54;
      const centerY = height * 0.52;

      context.save();
      context.strokeStyle = "rgba(255,255,255,.08)";
      context.lineWidth = 1;
      for (let line = -2; line <= 2; line += 1) {
        context.beginPath();
        context.moveTo(0, centerY + line * 54);
        context.lineTo(width, centerY + line * 54 - width * 0.12);
        context.stroke();
      }
      context.restore();

      particles.forEach((particle) => {
        const drift = prefersReducedMotion ? 0 : Math.sin(time * 0.0014 + particle.phase) * 3;
        const targetX = particle.tx + drift;
        const targetY = particle.ty + drift * 0.45;
        particle.x += (targetX - particle.x) * 0.045;
        particle.y += (targetY - particle.y) * 0.045;

        const dx = particle.x - pointer.x;
        const dy = particle.y - pointer.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (pointer.active && distance < 95 && distance > 0) {
          const force = (95 - distance) / 95;
          particle.x += (dx / distance) * force * 8;
          particle.y += (dy / distance) * force * 8;
        }

        context.beginPath();
        context.fillStyle = particle.accent
          ? "rgba(255,90,31,.95)"
          : distance < 95 && pointer.active
            ? "rgba(223,255,69,.95)"
            : "rgba(255,255,255,.72)";
        context.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        context.fill();
      });

      context.beginPath();
      context.arc(centerX, centerY, 7, 0, Math.PI * 2);
      context.strokeStyle = "rgba(223,255,69,.85)";
      context.lineWidth = 1.5;
      context.stroke();

      if (!prefersReducedMotion) {
        frame = window.requestAnimationFrame(render);
      }
    };

    const onPointerMove = (event: PointerEvent) => {
      const bounds = canvas.getBoundingClientRect();
      pointer.x = event.clientX - bounds.left;
      pointer.y = event.clientY - bounds.top;
      pointer.active = true;
    };
    const onPointerLeave = () => {
      pointer.active = false;
    };

    const observer = new ResizeObserver(resize);
    observer.observe(canvas);
    canvas.addEventListener("pointermove", onPointerMove);
    canvas.addEventListener("pointerleave", onPointerLeave);
    resize();
    render();

    return () => {
      observer.disconnect();
      canvas.removeEventListener("pointermove", onPointerMove);
      canvas.removeEventListener("pointerleave", onPointerLeave);
      window.cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="hero-visual__canvas"
      aria-label="Interactive particle football representing a team achievement"
      role="img"
    />
  );
}

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [loaderProgress, setLoaderProgress] = useState(0);
  const [progress, setProgress] = useState(0);
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    let loaderFrame = 0;
    const loaderStart = performance.now();
    const loaderDuration = 1700;
    const animateLoader = (time: number) => {
      const nextProgress = Math.min(
        100,
        Math.round(((time - loaderStart) / loaderDuration) * 100),
      );
      setLoaderProgress(nextProgress);
      if (nextProgress < 100) {
        loaderFrame = window.requestAnimationFrame(animateLoader);
      }
    };
    loaderFrame = window.requestAnimationFrame(animateLoader);
    const timer = window.setTimeout(() => setLoading(false), 1825);
    const updateProgress = () => {
      const scrollable =
        document.documentElement.scrollHeight - window.innerHeight;
      setProgress(scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0);
      setShowBackToTop(window.scrollY > window.innerHeight * 0.85);
    };
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -7% 0px" },
    );
    const revealElements = document.querySelectorAll("[data-reveal]");

    updateProgress();
    revealElements.forEach((element) => revealObserver.observe(element));
    window.addEventListener("scroll", updateProgress, { passive: true });

    return () => {
      window.clearTimeout(timer);
      window.cancelAnimationFrame(loaderFrame);
      revealObserver.disconnect();
      window.removeEventListener("scroll", updateProgress);
    };
  }, []);

  return (
    <>
      <div
        className={`loader ${loading ? "" : "loader--hidden"}`}
        aria-hidden={!loading}
      >
        <div className="loader__tiles" aria-hidden="true">
          {loaderTiles.map((_, index) => (
            <i
              key={index}
              style={
                {
                  "--tile-delay": `${(index % 12) * 18 + Math.floor(index / 12) * 24}ms`,
                } as CSSProperties
              }
            />
          ))}
        </div>
        <div className="loader__hud">
          <span>COMMUNITY IMPACT SYSTEM</span>
          <strong>PRE-SEASON / 001</strong>
          <span>PLAY WITH PURPOSE</span>
        </div>
        <div className="loader__stage">
          <span className="loader__orbit loader__orbit--one" aria-hidden="true" />
          <span className="loader__orbit loader__orbit--two" aria-hidden="true" />
          <span className="loader__play" aria-hidden="true" />
          <div className="loader__identity" aria-label="Sports Against Hunger">
            <small>WELCOME TO</small>
            <strong>Sports</strong>
            <strong>Against</strong>
            <strong>Hunger</strong>
            <i />
          </div>
        </div>
        <div className="loader__progress">
          <span>WARMING UP THE FIELD</span>
          <div><i style={{ width: `${loaderProgress}%` }} /></div>
          <strong>{String(loaderProgress).padStart(3, "0")}%</strong>
        </div>
      </div>

      <div className="scroll-progress" aria-hidden="true">
        <span style={{ width: `${progress}%` }} />
      </div>

      <a
        className={`back-to-top ${showBackToTop ? "back-to-top--visible" : ""}`}
        href="#top"
        aria-label="Back to top"
      >
        <span>Back to top</span>
        <i aria-hidden="true">↑</i>
      </a>

      <header className="site-header">
        <a className="wordmark" href="#top" aria-label="Sports Against Hunger home">
          <Playmark />
          <span>Sports Against Hunger</span>
        </a>
        <nav aria-label="Main navigation">
          {navItems.map(([label, href]) => (
            <a key={href} href={href}>
              {label}
            </a>
          ))}
        </nav>
        <a className="header-cta" href="#contact">
          Become a sponsor <Arrow />
        </a>
      </header>

      <main id="top">
        <section className="hero hero-tech" aria-labelledby="hero-title">
          <div className="hero-tech__grid" aria-hidden="true" />
          <div className="hero-tech__frame" aria-hidden="true">
            <i /><i /><i /><i />
          </div>

          <div className="hero-tech__copy">
            <div className="hero__eyebrow">
              <span className="status-dot" />
              Student-led / school-powered / community-backed
            </div>
            <span className="hero-tech__kicker">LOCAL IMPACT NETWORK / 001</span>
            <h1 id="hero-title">
              <span>Every</span>
              <span>play can</span>
              <span>feed a</span>
              <span className="hero-tech__accent">family.</span>
            </h1>
            <p className="hero__intro">
              High school athletics, local businesses, and food partners—moving
              together to turn verified achievements into dependable support.
            </p>
            <div className="hero__actions">
              <a className="hero-sponsor" href="#contact">
                Sponsor a play <Arrow />
              </a>
              <a className="hero-secondary" href="#about">
                See how it works <span aria-hidden="true">↓</span>
              </a>
            </div>
          </div>

          <div className="hero-visual">
            <HeroFieldCanvas />
            <div className="hero-visual__topline">
              <span>INTERACTIVE PLAY MAP</span>
              <strong>LIVE MOTION</strong>
            </div>
            <div className="hero-visual__score">
              <span>01</span>
              <p><strong>TEAM ACHIEVEMENT</strong><small>UNLOCKS VERIFIED SUPPORT</small></p>
            </div>
            <div className="hero-visual__prompt">MOVE YOUR CURSOR / SHIFT THE PLAY</div>
          </div>

          <div className="hero-tech__status" aria-hidden="true">
            <span>PILOT STATUS</span>
            <strong>PRE-SEASON</strong>
            <i />
            <span>SCROLL TO EXPLORE</span>
          </div>
        </section>

        <div className="marquee" aria-hidden="true">
          <div className="marquee__track">
            <span>PLAY WITH PURPOSE</span><i>✦</i>
            <span>LOCAL ACTION</span><i>✦</i>
            <span>VERIFIED IMPACT</span><i>✦</i>
            <span>PLAY WITH PURPOSE</span><i>✦</i>
            <span>LOCAL ACTION</span><i>✦</i>
            <span>VERIFIED IMPACT</span><i>✦</i>
          </div>
        </div>

        <section className="mission section-shell" id="about">
          <div className="section-index">01 / About</div>
          <div className="mission__statement" data-reveal>
            <p>Our north star</p>
            <h2>
              Hunger is local.
              <br />
              So is the <em>power to help.</em>
            </h2>
          </div>
          <div className="mission__story" data-reveal>
            <p className="mission__lead">
              Sports Against Hunger is a student-led network designed to make
              generosity visible, measurable, and part of the game-day ritual.
            </p>
            <p>
              Schools bring the energy. Businesses make capped commitments.
              Food pantries define what support is useful and verify every
              contribution. Students coordinate the story—not the money.
            </p>
          </div>

          <div className="pillar-intro" data-reveal>
            <span>THE IDEOLOGY</span>
            <h3>Three pillars.<br /><em>One shared win.</em></h3>
            <p>
              Every part of the model should make the game more meaningful
              without making community support depend entirely on winning.
            </p>
          </div>

          <div className="pillar-grid" data-reveal>
            {pillars.map((pillar) => (
              <article key={pillar.number}>
                <span>{pillar.number}</span>
                <h3>{pillar.title}</h3>
                <p>{pillar.body}</p>
              </article>
            ))}
          </div>

          <div className="incentives" data-reveal>
            <div className="incentives__heading">
              <span>EVERY PARTY HAS A REASON TO PLAY</span>
              <h3>Aligned incentives.<br />Shared accountability.</h3>
            </div>
            <div className="incentive-grid">
              {incentives.map((item) => (
                <article key={item.label}>
                  <span>{item.label}</span>
                  <strong>{item.title}</strong>
                  <p>{item.body}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="impact" id="impact" aria-labelledby="impact-title">
          <div className="impact__top section-shell" data-reveal>
            <div className="section-index section-index--light">02 / Live impact</div>
            <div>
              <span className="impact__live"><i /> Pilot tracker</span>
              <h2 id="impact-title">The scoreboard that matters.</h2>
              <p>
                Only confirmed achievements and verified partner contributions
                appear here. The first numbers arrive when the pilot begins.
              </p>
            </div>
          </div>

          <div className="impact-grid section-shell" data-reveal>
            {impactStats.map((stat) => (
              <article key={stat.label}>
                <span className="impact-grid__value">{stat.value}</span>
                <div>
                  <strong>{stat.label}</strong>
                  <small>{stat.note}</small>
                </div>
              </article>
            ))}
          </div>

          <div className="season-card section-shell">
            <div className="season-card__head">
              <div>
                <span>SEASON 01</span>
                <strong>Pilot season</strong>
              </div>
              <span className="season-card__status">PRE-SEASON</span>
            </div>
            <div className="season-card__bar"><span /></div>
            <div className="season-card__foot">
              <span>0 verified meals</span>
              <span>Goal announced after pantry approval</span>
            </div>
          </div>
        </section>

        <section className="playbook section-shell" id="playbook">
          <div className="section-index">03 / The playbook</div>
          <div className="playbook__heading" data-reveal>
            <h2>Simple enough to explain.<br />Strong enough to trust.</h2>
            <p>
              A repeatable three-part model keeps the campaign exciting without
              making community support depend entirely on winning.
            </p>
          </div>

          <div className="playbook-list" data-reveal>
            {playbook.map((item) => (
              <article key={item.number}>
                <span>{item.number}</span>
                <h3>{item.title}</h3>
                <p>{item.body}</p>
                <i aria-hidden="true">→</i>
              </article>
            ))}
          </div>

          <div className="example-card" data-reveal>
            <div className="example-card__label">A SAMPLE PLAY</div>
            <div className="example-card__equation">
              <span>1</span>
              <small>verified achievement</small>
              <i>×</i>
              <span className="example-card__variable">—</span>
              <small>approved sponsor rate</small>
            </div>
            <p>
              Illustrative only. The food partner sets the official meal
              calculation, and each sponsor sets a maximum commitment.
            </p>
          </div>
        </section>

        <section className="dashboard section-shell" id="dashboard">
          <div className="section-index">04 / Games & achievements</div>
          <div className="placeholder" data-reveal>
            <span className="placeholder__tag">SCHEDULE LOCKER</span>
            <h2>The next play<br />starts here.</h2>
            <p>
              Game schedules and verified achievements will appear once the
              pilot receives approval.
            </p>
            <div className="placeholder__lines" aria-hidden="true">
              <i /><i /><i />
            </div>
            <span className="placeholder__corner">COMING SOON · 2026</span>
          </div>
        </section>

        <section className="partners" id="partners">
          <div className="partners__inner section-shell">
            <div className="section-index section-index--light">05 / Founding partners</div>
            <div className="partners__copy" data-reveal>
              <span>THE FIRST TEAM IS FORMING</span>
              <h2>Local brands.<br />Lasting impact.</h2>
              <p>
                Founding sponsor recognition will live here after every
                partnership is approved and its commitment is confirmed.
              </p>
            </div>
            <div className="partner-slots" aria-label="Partner spaces" data-reveal>
              <div className="partner-slots__school">
                <div className="valencia-lockup">
                  <span className="valencia-crest" aria-hidden="true"><i>V</i></span>
                  <span className="valencia-word">VALENCIA <b>VIKINGS</b></span>
                </div>
                <span>PARTNERED SCHOOL</span>
                <strong>Valencia High School</strong>
                <small>Student and athletics partner</small>
              </div>
              <div><span>FOUNDING SPONSOR</span><strong>Your mark could start here</strong></div>
              <div><span>COMMUNITY PARTNER</span><strong>Partner reveal coming soon</strong></div>
            </div>
          </div>
        </section>

        <section className="faq section-shell" id="faq">
          <div className="section-index">06 / Preemptive Q&amp;A</div>
          <div className="faq__heading" data-reveal>
            <span>THE QUESTIONS WORTH ASKING EARLY</span>
            <h2>Preemptive Q&amp;A.</h2>
            <p>Clear answers now. Verified details as the pilot takes shape.</p>
          </div>
          <div className="faq-list" data-reveal>
            {questions.map((item, index) => (
              <details key={item.question}>
                <summary>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <strong>{item.question}</strong>
                  <i aria-hidden="true">+</i>
                </summary>
                {item.kind === "ethics" ? (
                  <div className="ethics-answer">
                    <p>{item.answer}</p>
                    <div className="ethics-answer__grid">
                      {ethics.map((principle) => (
                        <article key={principle.number}>
                          <span>{principle.number}</span>
                          <strong>{principle.title}</strong>
                          <p>{principle.body}</p>
                        </article>
                      ))}
                    </div>
                    <div className="ethics-answer__ledger">
                      <span>WHEN THE PILOT GOES LIVE</span>
                      <p>Verified results</p>
                      <p>Partner receipts</p>
                      <p>Impact reports</p>
                      <strong>COMING SOON</strong>
                    </div>
                  </div>
                ) : (
                  <p>{item.answer}</p>
                )}
              </details>
            ))}
          </div>
        </section>

        <section className="final-cta contact" id="contact" aria-labelledby="contact-title">
          <div className="final-cta__orb" aria-hidden="true">
            <span>SAH</span>
            <i />
          </div>
          <div className="final-cta__content" data-reveal>
            <span>BUSINESS SPONSORSHIPS</span>
            <h2 id="contact-title">Put purpose<br />on the scoreboard.</h2>
            <p>
              Interested in sponsoring a team achievement? Start with a simple
              conversation—no technical setup and no commitment required.
            </p>
            <div className="contact__links">
              <a href="tel:+16615938857">
                <span>Call</span>
                <strong>661-593-8857</strong>
                <Arrow />
              </a>
              <a href="mailto:cadenmshin9@gmail.com?subject=Sports%20Against%20Hunger%20Sponsorship">
                <span>Email</span>
                <strong>cadenmshin9@gmail.com</strong>
                <Arrow />
              </a>
            </div>
            <a className="contact__back" href="#top">Back to the start <Arrow /></a>
          </div>
        </section>
      </main>

      <footer>
        <a className="wordmark wordmark--footer" href="#top">
          <Playmark />
          <span>Sports Against Hunger</span>
        </a>
        <p>Student-led · Community-guided · Built for measurable impact</p>
        <span>© 2026</span>
      </footer>
    </>
  );
}
