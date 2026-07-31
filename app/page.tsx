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

const sportObjects = [
  { label: "FOOTBALL", play: "TOUCHDOWN", primary: "#ffd56a", accent: "#ff6a2a" },
  { label: "BASKETBALL", play: "THREE-POINTER", primary: "#ff8a31", accent: "#fff0b2" },
  { label: "SOCCER BALL", play: "GOAL", primary: "#f7f7e8", accent: "#b8ff46" },
  { label: "BASEBALL", play: "HOME RUN", primary: "#fff4d5", accent: "#ff5a3d" },
  { label: "TENNIS BALL", play: "ACE", primary: "#dfff45", accent: "#fffbe6" },
  { label: "HOCKEY PUCK", play: "GOAL", primary: "#6dd6ff", accent: "#dfff45" },
] as const;

type SportPoint = {
  x: number;
  y: number;
  z: number;
  emphasis: number;
};

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

function seeded(index: number, salt = 0) {
  const value = Math.sin((index + 1) * 12.9898 + salt * 78.233) * 43758.5453;
  return value - Math.floor(value);
}

function spherePoint(index: number, count: number, radius = 1): SportPoint {
  const y = 1 - (2 * (index + 0.5)) / count;
  const ring = Math.sqrt(Math.max(0, 1 - y * y));
  const angle = index * Math.PI * (3 - Math.sqrt(5));
  return {
    x: Math.cos(angle) * ring * radius,
    y: y * radius,
    z: Math.sin(angle) * ring * radius,
    emphasis: 0,
  };
}

function rotatePoint(
  point: SportPoint,
  xRotation: number,
  yRotation: number,
  zRotation: number,
): SportPoint {
  const cosX = Math.cos(xRotation);
  const sinX = Math.sin(xRotation);
  const cosY = Math.cos(yRotation);
  const sinY = Math.sin(yRotation);
  const cosZ = Math.cos(zRotation);
  const sinZ = Math.sin(zRotation);
  const y1 = point.y * cosX - point.z * sinX;
  const z1 = point.y * sinX + point.z * cosX;
  const x2 = point.x * cosY + z1 * sinY;
  const z2 = -point.x * sinY + z1 * cosY;

  return {
    x: x2 * cosZ - y1 * sinZ,
    y: x2 * sinZ + y1 * cosZ,
    z: z2,
    emphasis: point.emphasis,
  };
}

function makeSportShape(kind: number, count: number): SportPoint[] {
  const detailCount = Math.floor(count * (kind === 2 ? 0.28 : 0.18));
  const surfaceCount = count - detailCount;
  const points: SportPoint[] = [];

  for (let index = 0; index < surfaceCount; index += 1) {
    const sphere = spherePoint(index, surfaceCount);

    if (kind === 0) {
      const tapered = Math.pow(Math.max(0.04, 1 - sphere.x * sphere.x), 0.34);
      points.push(
        rotatePoint(
          {
            x: sphere.x * 1.48,
            y: sphere.y * 0.7 * tapered,
            z: sphere.z * 0.7 * tapered,
            emphasis: index % 19 === 0 ? 0.45 : 0,
          },
          -0.08,
          0.08,
          -0.42,
        ),
      );
    } else if (kind === 5) {
      const angle = seeded(index, 4) * Math.PI * 2;
      const isSide = index < surfaceCount * 0.58;
      if (isSide) {
        points.push({
          x: Math.cos(angle) * 1.05,
          y: (seeded(index, 9) - 0.5) * 0.47,
          z: Math.sin(angle) * 1.05,
          emphasis: index % 17 === 0 ? 0.35 : 0,
        });
      } else {
        const radius = Math.sqrt(seeded(index, 2)) * 1.05;
        points.push({
          x: Math.cos(angle) * radius,
          y: seeded(index, 6) > 0.5 ? -0.235 : 0.235,
          z: Math.sin(angle) * radius,
          emphasis: 0,
        });
      }
    } else {
      const fuzzy = kind === 4 ? (seeded(index, 7) - 0.5) * 0.055 : 0;
      points.push({
        x: sphere.x * (1 + fuzzy),
        y: sphere.y * (1 + fuzzy),
        z: sphere.z * (1 + fuzzy),
        emphasis: kind === 2 && index % 23 === 0 ? 0.25 : 0,
      });
    }
  }

  for (let index = 0; index < detailCount; index += 1) {
    const progress = index / Math.max(1, detailCount - 1);

    if (kind === 0) {
      const longSeam = index < detailCount * 0.34;
      if (longSeam) {
        const x = -0.58 + (index / Math.max(1, detailCount * 0.34 - 1)) * 1.16;
        points.push(
          rotatePoint(
            { x, y: -0.03, z: 0.68, emphasis: 1 },
            -0.08,
            0.08,
            -0.42,
          ),
        );
      } else {
        const laceIndex = index - Math.floor(detailCount * 0.34);
        const laceCount = detailCount - Math.floor(detailCount * 0.34);
        const lace = Math.floor((laceIndex / Math.max(1, laceCount)) * 7);
        const across = ((laceIndex * 7) % Math.max(1, laceCount)) / Math.max(1, laceCount);
        points.push(
          rotatePoint(
            {
              x: -0.42 + lace * 0.14,
              y: -0.12 + across * 0.24,
              z: 0.69,
              emphasis: 1,
            },
            -0.08,
            0.08,
            -0.42,
          ),
        );
      }
    } else if (kind === 1) {
      const seam = index % 4;
      const angle = progress * Math.PI * 8;
      const point =
        seam === 0
          ? { x: 0, y: Math.cos(angle), z: Math.sin(angle) }
          : seam === 1
            ? { x: Math.cos(angle), y: 0, z: Math.sin(angle) }
            : seam === 2
              ? { x: Math.cos(angle), y: Math.sin(angle) * 0.52, z: Math.sin(angle) * 0.84 }
              : { x: Math.cos(angle) * 0.54, y: Math.sin(angle), z: Math.cos(angle) * 0.84 };
      points.push({ ...point, emphasis: 1 });
    } else if (kind === 2) {
      const patchCenters = [
        [0, 0, 0.98],
        [-0.58, -0.34, 0.7],
        [0.58, -0.34, 0.7],
        [-0.5, 0.48, 0.7],
        [0.5, 0.48, 0.7],
      ];
      const patch = patchCenters[index % patchCenters.length];
      const angle =
        (Math.floor(index / patchCenters.length) /
          Math.ceil(detailCount / patchCenters.length)) *
        Math.PI *
        10;
      const radius = 0.17 + 0.04 * Math.sin(angle * 5);
      const x = patch[0] + Math.cos(angle) * radius;
      const y = patch[1] + Math.sin(angle) * radius;
      points.push({
        x,
        y,
        z: Math.sqrt(Math.max(0.08, 1 - x * x - y * y)),
        emphasis: 1,
      });
    } else if (kind === 3 || kind === 4) {
      const side = index < detailCount / 2 ? -1 : 1;
      const angle = progress * Math.PI * 4;
      const x = Math.cos(angle) * 0.72;
      const y = Math.sin(angle) * 0.58 + side * 0.19 * Math.cos(angle * 2);
      points.push({
        x,
        y,
        z: Math.sqrt(Math.max(0.08, 1 - x * x - y * y)),
        emphasis: 1,
      });
    } else {
      const angle = progress * Math.PI * 6;
      const logoLine = index < detailCount / 2;
      points.push({
        x: logoLine ? -0.62 + progress * 2.48 : Math.cos(angle) * 0.48,
        y: -0.255,
        z: logoLine ? 0.2 : Math.sin(angle) * 0.48,
        emphasis: 1,
      });
    }
  }

  return points.slice(0, count);
}

function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cursor = cursorRef.current;
    if (!cursor || window.matchMedia("(pointer: coarse)").matches) return;

    let targetX = -100;
    let targetY = -100;
    let ringX = -100;
    let ringY = -100;
    let frame = 0;

    const render = () => {
      ringX += (targetX - ringX) * 0.18;
      ringY += (targetY - ringY) * 0.18;
      cursor.style.setProperty("--cursor-x", `${targetX}px`);
      cursor.style.setProperty("--cursor-y", `${targetY}px`);
      cursor.style.setProperty("--ring-x", `${ringX}px`);
      cursor.style.setProperty("--ring-y", `${ringY}px`);
      frame = window.requestAnimationFrame(render);
    };
    const onMove = (event: PointerEvent) => {
      targetX = event.clientX;
      targetY = event.clientY;
      cursor.classList.add("is-visible");
    };
    const onOver = (event: PointerEvent) => {
      const target = event.target as HTMLElement;
      cursor.classList.toggle(
        "is-hovering",
        Boolean(target.closest("a, button, summary, .hero-visual")),
      );
    };
    const onDown = () => cursor.classList.add("is-pressed");
    const onUp = () => cursor.classList.remove("is-pressed");
    const onLeave = () => cursor.classList.remove("is-visible");

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerover", onOver, { passive: true });
    window.addEventListener("pointerdown", onDown, { passive: true });
    window.addEventListener("pointerup", onUp, { passive: true });
    document.documentElement.addEventListener("mouseleave", onLeave);
    frame = window.requestAnimationFrame(render);

    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerover", onOver);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      document.documentElement.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return (
    <div ref={cursorRef} className="sport-cursor" aria-hidden="true">
      <i />
      <span>PLAY</span>
    </div>
  );
}

function HeroFieldCanvas({
  onSportChange,
}: {
  onSportChange: (index: number) => void;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext("2d");
    if (!context) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const pointer = {
      x: 0,
      y: 0,
      screenX: -1000,
      screenY: -1000,
      active: false,
    };
    let width = 0;
    let height = 0;
    let frame = 0;
    let activeSport = 0;
    let lastMorph = performance.now();
    let fizzleStart = -1;
    let revealStart = -1;
    let transitionTimer = 0;
    let particles: Array<{
      x: number;
      y: number;
      z: number;
      target: SportPoint;
      size: number;
      phase: number;
    }> = [];

    const applySport = (nextSport: number, immediate = false) => {
      activeSport = nextSport % sportObjects.length;
      const targets = makeSportShape(activeSport, particles.length);
      particles.forEach((particle, index) => {
        particle.target = targets[index];
        if (immediate) {
          particle.x = targets[index].x;
          particle.y = targets[index].y;
          particle.z = targets[index].z;
        } else {
          const scatter = 1.5 + seeded(index, activeSport + 20) * 0.8;
          particle.x = targets[index].x * scatter;
          particle.y = targets[index].y * scatter;
          particle.z = targets[index].z * scatter;
        }
      });
      lastMorph = performance.now();
      revealStart = immediate ? -1 : performance.now();
      onSportChange(activeSport);
    };

    const setSport = (nextSport: number, immediate = false) => {
      if (immediate || prefersReducedMotion) {
        applySport(nextSport, true);
        return;
      }
      if (fizzleStart >= 0) return;
      fizzleStart = performance.now();
      transitionTimer = window.setTimeout(() => {
        applySport(nextSport);
        fizzleStart = -1;
      }, 560);
    };

    const createParticles = () => {
      const count = width < 540 ? 620 : Math.min(1180, Math.floor(width * 1.6));
      const targets = makeSportShape(activeSport, count);
      particles = targets.map((target, index) => ({
        x: target.x + (seeded(index, 12) - 0.5) * 2.4,
        y: target.y + (seeded(index, 13) - 0.5) * 2.4,
        z: target.z + (seeded(index, 14) - 0.5) * 2.4,
        target,
        size: 0.62 + seeded(index, 15) * 1.45,
        phase: seeded(index, 16) * Math.PI * 2,
      }));
      setSport(activeSport, true);
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
      const centerX = width * 0.5;
      const centerY = height * 0.48;
      const scale =
        Math.min(width, height) * (activeSport === 0 ? 0.265 : 0.245);
      const morphEnergy = Math.max(0, 1 - (time - lastMorph) / 1350);
      const fizzleProgress =
        fizzleStart < 0
          ? 0
          : Math.min(1, Math.max(0, (time - fizzleStart) / 560));
      const revealProgress =
        revealStart < 0
          ? 1
          : Math.min(1, Math.max(0, (time - revealStart) / 760));
      if (revealStart >= 0 && revealProgress >= 1) revealStart = -1;
      const palette = sportObjects[activeSport];
      const rotationY =
        (prefersReducedMotion ? 0.2 : time * 0.00018) + pointer.x * 0.28;
      const rotationX = -0.08 + pointer.y * 0.2;
      const rotationZ =
        activeSport === 5 ? -0.18 : Math.sin(time * 0.00022) * 0.06;

      const aura = context.createRadialGradient(
        centerX,
        centerY,
        5,
        centerX,
        centerY,
        scale * 1.8,
      );
      aura.addColorStop(0, `${palette.primary}30`);
      aura.addColorStop(0.45, `${palette.accent}12`);
      aura.addColorStop(1, "rgba(255,255,255,0)");
      context.fillStyle = aura;
      context.fillRect(0, 0, width, height);

      context.save();
      context.translate(centerX, centerY);
      context.strokeStyle = "rgba(255,255,255,.12)";
      context.setLineDash([3, 10]);
      for (let ring = 1; ring <= 3; ring += 1) {
        context.beginPath();
        context.ellipse(
          0,
          0,
          scale * (0.62 + ring * 0.29),
          scale * (0.2 + ring * 0.08),
          -0.14,
          0,
          Math.PI * 2,
        );
        context.stroke();
      }
      context.restore();

      const projected = particles.map((particle, index) => {
        const spring = 0.046 + morphEnergy * 0.038;
        particle.x += (particle.target.x - particle.x) * spring;
        particle.y += (particle.target.y - particle.y) * spring;
        particle.z += (particle.target.z - particle.z) * spring;
        const drift = prefersReducedMotion
          ? 0
          : Math.sin(time * 0.0012 + particle.phase) * 0.008;
        const rotated = rotatePoint(
          {
            x: particle.x + drift,
            y: particle.y + drift * 0.6,
            z: particle.z,
            emphasis: particle.target.emphasis,
          },
          rotationX,
          rotationY,
          rotationZ,
        );
        const perspective = 3.9 / (3.9 - rotated.z);
        let screenX = centerX + rotated.x * scale * perspective;
        let screenY = centerY + rotated.y * scale * perspective;
        if (fizzleProgress > 0) {
          const burst = fizzleProgress * fizzleProgress * scale * 0.78;
          const magnitude = Math.max(0.2, Math.sqrt(rotated.x ** 2 + rotated.y ** 2));
          screenX +=
            (rotated.x / magnitude) * burst +
            Math.sin(index * 2.17 + time * 0.012) * fizzleProgress * 18;
          screenY +=
            (rotated.y / magnitude) * burst +
            Math.cos(index * 1.73 + time * 0.01) * fizzleProgress * 18;
        }
        const dx = screenX - pointer.screenX;
        const dy = screenY - pointer.screenY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (pointer.active && distance < 88 && distance > 0) {
          const repel = Math.pow((88 - distance) / 88, 1.6) * 30;
          screenX += (dx / distance) * repel;
          screenY += (dy / distance) * repel;
        }
        return {
          x: screenX,
          y: screenY,
          z: rotated.z,
          size:
            particle.size *
            perspective *
            (0.88 + (rotated.z + 1) * 0.2),
          emphasis: rotated.emphasis,
          nearPointer: pointer.active && distance < 88,
          transitionAlpha:
            fizzleProgress > 0
              ? Math.pow(1 - fizzleProgress, 1.35)
              : Math.pow(revealProgress, 0.72),
        };
      });

      projected.sort((a, b) => a.z - b.z);
      context.globalCompositeOperation = "lighter";
      projected.forEach((particle) => {
        const depth = Math.max(
          0.22,
          Math.min(1, (particle.z + 1.15) / 2.3),
        );
        context.beginPath();
        context.fillStyle = particle.nearPointer
          ? "#ffffff"
          : particle.emphasis > 0.55
            ? palette.accent
            : palette.primary;
        context.globalAlpha =
          (particle.nearPointer
            ? 1
            : 0.26 + depth * 0.68 + particle.emphasis * 0.12) *
          particle.transitionAlpha;
        if (particle.emphasis > 0.55 || particle.nearPointer) {
          context.shadowBlur = particle.nearPointer ? 18 : 9;
          context.shadowColor = particle.nearPointer
            ? "#ffffff"
            : palette.accent;
        } else {
          context.shadowBlur = 0;
        }
        context.arc(
          particle.x,
          particle.y,
          Math.max(
            0.38,
            (particle.size + particle.emphasis * 0.5) *
              (0.7 + particle.transitionAlpha * 0.3),
          ),
          0,
          Math.PI * 2,
        );
        context.fill();
      });
      context.globalAlpha = 1;
      context.globalCompositeOperation = "source-over";
      context.shadowBlur = 0;

      if (!prefersReducedMotion) {
        frame = window.requestAnimationFrame(render);
      }
    };

    const onPointerMove = (event: PointerEvent) => {
      const bounds = canvas.getBoundingClientRect();
      pointer.screenX = event.clientX - bounds.left;
      pointer.screenY = event.clientY - bounds.top;
      pointer.x = (pointer.screenX / Math.max(1, width) - 0.5) * 2;
      pointer.y = (pointer.screenY / Math.max(1, height) - 0.5) * 2;
      pointer.active = true;
    };
    const onPointerLeave = () => {
      pointer.active = false;
      pointer.x = 0;
      pointer.y = 0;
    };
    const onPointerDown = () => setSport(activeSport + 1);

    const observer = new ResizeObserver(resize);
    observer.observe(canvas);
    canvas.addEventListener("pointermove", onPointerMove);
    canvas.addEventListener("pointerleave", onPointerLeave);
    canvas.addEventListener("pointerdown", onPointerDown);
    resize();
    render();
    const sportTimer = prefersReducedMotion
      ? 0
      : window.setInterval(() => setSport(activeSport + 1), 4700);

    return () => {
      observer.disconnect();
      canvas.removeEventListener("pointermove", onPointerMove);
      canvas.removeEventListener("pointerleave", onPointerLeave);
      canvas.removeEventListener("pointerdown", onPointerDown);
      if (sportTimer) window.clearInterval(sportTimer);
      if (transitionTimer) window.clearTimeout(transitionTimer);
      window.cancelAnimationFrame(frame);
    };
  }, [onSportChange]);

  return (
    <canvas
      ref={canvasRef}
      className="hero-visual__canvas"
      aria-label="Interactive 3D particle sports object. Click to cycle through six sports."
      role="img"
    />
  );
}

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [loaderProgress, setLoaderProgress] = useState(0);
  const [progress, setProgress] = useState(0);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [activeSport, setActiveSport] = useState(0);

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
      <CustomCursor />
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
            <HeroFieldCanvas onSportChange={setActiveSport} />
            <div className="hero-visual__topline">
              <span>3D IMPACT OBJECT / {String(activeSport + 1).padStart(2, "0")}</span>
              <strong>LIVE · AUTO LOOP</strong>
            </div>
            <div className="hero-visual__identity" aria-live="polite">
              <small>NOW IN PLAY</small>
              <strong>{sportObjects[activeSport].label}</strong>
            </div>
            <div className="hero-visual__score">
              <span>1</span>
              <p>
                <strong>{sportObjects[activeSport].play}</strong>
                <small>CAN HELP UNLOCK VERIFIED MEALS</small>
              </p>
            </div>
            <div className="hero-visual__sport-dots" aria-hidden="true">
              {sportObjects.map((sport, index) => (
                <i
                  key={sport.label}
                  className={index === activeSport ? "is-active" : ""}
                />
              ))}
            </div>
            <div className="hero-visual__meal-signal" aria-hidden="true">
              <span>PLAY</span><i>→</i><span>PARTNER</span><i>→</i><strong>MEALS</strong>
            </div>
            <div className="hero-visual__prompt">
              MOVE TO BEND THE PARTICLES<br />CLICK TO SWITCH SPORT
            </div>
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
          <div className="mission__statement" data-reveal="swoosh-left">
            <p>Our north star</p>
            <h2>
              Hunger is local.
              <br />
              So is the <em>power to help.</em>
            </h2>
          </div>
          <div className="mission__story" data-reveal="swoosh-right">
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

          <div className="pillar-intro" data-reveal="swoosh-left">
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

        <section className="meal-flow" aria-labelledby="meal-flow-title">
          <div className="meal-flow__copy" data-reveal="swoosh-left">
            <span>THE MEAL CONNECTION</span>
            <h2 id="meal-flow-title">
              A big play becomes<br /><em>something you can share.</em>
            </h2>
            <p>
              Sponsors back a verified achievement. The food partner confirms
              what that support provides. The result is practical help, not an
              abstract promise.
            </p>
          </div>
          <div className="meal-flow__visual" data-reveal="swoosh-right" aria-hidden="true">
            <div className="meal-flow__orbit">
              <span>01</span><span>02</span><span>03</span>
              <div className="meal-flow__plate">
                <i /><i /><i /><i /><i /><i /><i /><i />
                <strong>MEAL</strong>
              </div>
            </div>
            <div className="meal-flow__steps">
              <span><b>PLAY</b><small>Official result</small></span>
              <i>→</i>
              <span><b>VERIFY</b><small>Partner confirms</small></span>
              <i>→</i>
              <span><b>PROVIDE</b><small>Useful support</small></span>
            </div>
          </div>
        </section>

        <section className="playbook section-shell" id="playbook">
          <div className="section-index">03 / The playbook</div>
          <div className="playbook__heading" data-reveal="swoosh-left">
            <h2>Simple enough to explain.<br />Strong enough to trust.</h2>
            <p>
              A repeatable three-part model keeps the campaign exciting without
              making community support depend entirely on winning.
            </p>
          </div>

          <div className="playbook-list" data-reveal="swoosh-right">
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
