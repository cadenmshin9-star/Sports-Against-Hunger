"use client";

import { useEffect, useState } from "react";

const navItems = [
  ["Mission", "#mission"],
  ["Impact", "#impact"],
  ["Playbook", "#playbook"],
  ["Partners", "#partners"],
];

const impactStats = [
  { value: "0", label: "verified meals", note: "Tracker activates with the pilot" },
  { value: "0", label: "games tracked", note: "Official results only" },
  { value: "0", label: "founding sponsors", note: "Partner reveal coming soon" },
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

function Arrow() {
  return <span aria-hidden="true">↗</span>;
}

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = window.setTimeout(() => setLoading(false), 1450);
    const updateProgress = () => {
      const scrollable =
        document.documentElement.scrollHeight - window.innerHeight;
      setProgress(scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0);
    };

    updateProgress();
    window.addEventListener("scroll", updateProgress, { passive: true });

    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("scroll", updateProgress);
    };
  }, []);

  return (
    <>
      <div
        className={`loader ${loading ? "" : "loader--hidden"}`}
        aria-hidden={!loading}
      >
        <div className="loader__mark">
          <span>SAH</span>
          <i />
        </div>
        <p>Turning school spirit into shared meals</p>
        <div className="loader__track">
          <span />
        </div>
      </div>

      <div className="scroll-progress" aria-hidden="true">
        <span style={{ width: `${progress}%` }} />
      </div>

      <header className="site-header">
        <a className="wordmark" href="#top" aria-label="Sports Against Hunger home">
          <span className="wordmark__badge">S</span>
          <span>Sports Against Hunger</span>
        </a>
        <nav aria-label="Main navigation">
          {navItems.map(([label, href]) => (
            <a key={href} href={href}>
              {label}
            </a>
          ))}
        </nav>
        <a className="header-cta" href="#playbook">
          See the model <Arrow />
        </a>
      </header>

      <main id="top">
        <section className="hero" aria-labelledby="hero-title">
          <div className="hero__eyebrow">
            <span className="status-dot" />
            Student-led pilot · Valencia, California
          </div>

          <h1 id="hero-title">
            Every play can
            <span className="hero__accent"> feed a family.</span>
          </h1>

          <div className="hero__lower">
            <p className="hero__intro">
              We connect high school athletics, local businesses, and food
              pantries to turn verified team achievements into dependable meals.
            </p>
            <a className="circle-link" href="#mission" aria-label="Explore our mission">
              <span>Explore</span>
              <Arrow />
            </a>
          </div>

          <div className="hero-field" aria-hidden="true">
            <div className="hero-field__line hero-field__line--one" />
            <div className="hero-field__line hero-field__line--two" />
            <div className="hero-field__center">
              <span>1</span>
              <small>team achievement</small>
            </div>
            <div className="hero-field__result">
              <span>=</span>
              <strong>REAL<br />MEALS</strong>
            </div>
            <div className="ball ball--one" />
            <div className="ball ball--two" />
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

        <section className="mission section-shell" id="mission">
          <div className="section-index">01 / Mission</div>
          <div className="mission__statement">
            <p>Our north star</p>
            <h2>
              Hunger is local.
              <br />
              So is the <em>power to help.</em>
            </h2>
          </div>
          <div className="mission__story">
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

          <div className="role-grid">
            <article>
              <span>THE SCHOOL</span>
              <strong>Creates the moment</strong>
              <p>Teams, verified results, school spirit, and trusted adult oversight.</p>
            </article>
            <article>
              <span>THE SPONSOR</span>
              <strong>Backs the promise</strong>
              <p>A clear contribution, a firm seasonal cap, and community visibility.</p>
            </article>
            <article>
              <span>THE PANTRY</span>
              <strong>Guides the impact</strong>
              <p>Directly receives support and determines how meals are counted.</p>
            </article>
          </div>
        </section>

        <section className="impact" id="impact" aria-labelledby="impact-title">
          <div className="impact__top section-shell">
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

          <div className="impact-grid section-shell">
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
                <strong>Valencia pilot</strong>
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
          <div className="playbook__heading">
            <h2>Simple enough to explain.<br />Strong enough to trust.</h2>
            <p>
              A repeatable three-part model keeps the campaign exciting without
              making community support depend entirely on winning.
            </p>
          </div>

          <div className="playbook-list">
            {playbook.map((item) => (
              <article key={item.number}>
                <span>{item.number}</span>
                <h3>{item.title}</h3>
                <p>{item.body}</p>
                <i aria-hidden="true">→</i>
              </article>
            ))}
          </div>

          <div className="example-card">
            <div className="example-card__label">A SAMPLE PLAY</div>
            <div className="example-card__equation">
              <span>1</span>
              <small>touchdown</small>
              <i>×</i>
              <span>100</span>
              <small>meals unlocked</small>
            </div>
            <p>
              Illustrative only. The food-pantry partner sets the official
              meal calculation, and each sponsor sets a maximum commitment.
            </p>
          </div>
        </section>

        <section className="dashboard section-shell" id="dashboard">
          <div className="section-index">04 / Games & achievements</div>
          <div className="placeholder">
            <span className="placeholder__tag">SCHEDULE LOCKER</span>
            <h2>The next play<br />starts here.</h2>
            <p>
              Game schedules and verified achievements will appear once the
              Valencia pilot receives approval.
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
            <div className="partners__copy">
              <span>THE FIRST TEAM IS FORMING</span>
              <h2>Local brands.<br />Lasting impact.</h2>
              <p>
                Founding sponsor recognition will live here after every
                partnership is approved and its commitment is confirmed.
              </p>
            </div>
            <div className="partner-slots" aria-label="Founding partner spaces">
              <div><span>01</span><strong>Your mark could start here</strong></div>
              <div><span>02</span><strong>Founding partner</strong></div>
              <div><span>03</span><strong>Community partner</strong></div>
            </div>
          </div>
        </section>

        <section className="trust section-shell" id="transparency">
          <div className="section-index">06 / Transparency</div>
          <div className="trust__header">
            <h2>Proof over promises.</h2>
            <p>
              This section will publish the records that make the program
              accountable as soon as the pilot is active.
            </p>
          </div>
          <div className="trust-grid">
            <article><span>01</span><strong>Verified results</strong><small>Awaiting pilot launch</small></article>
            <article><span>02</span><strong>Partner receipts</strong><small>Awaiting pilot launch</small></article>
            <article><span>03</span><strong>Impact reports</strong><small>Awaiting pilot launch</small></article>
          </div>
        </section>

        <section className="faq section-shell" id="faq">
          <div className="section-index">07 / FAQ</div>
          <div className="faq__empty">
            <span>QUESTIONS, ANSWERED CLEARLY</span>
            <h2>The FAQ is being shaped with school and pantry guidance.</h2>
            <p>Every answer will reflect the approved pilot—not assumptions.</p>
          </div>
        </section>

        <section className="final-cta">
          <div className="final-cta__orb" aria-hidden="true">SAH</div>
          <div className="final-cta__content">
            <span>A SMALL PILOT. A REAL START.</span>
            <h2>Let’s put purpose<br />on the scoreboard.</h2>
            <a href="#top">Back to the start <Arrow /></a>
          </div>
        </section>
      </main>

      <footer>
        <a className="wordmark wordmark--footer" href="#top">
          <span className="wordmark__badge">S</span>
          <span>Sports Against Hunger</span>
        </a>
        <p>Student-led · Community-guided · Built for measurable impact</p>
        <span>© 2026</span>
      </footer>
    </>
  );
}
