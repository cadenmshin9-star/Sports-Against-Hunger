"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";

const navItems = [
  ["About", "#about"],
  ["Impact", "#impact"],
  ["Playbook", "#playbook"],
  ["Partners", "#partners"],
  ["Q & A", "#faq"],
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
  { label: "FOOTBALL", primary: "#ffd56a", accent: "#ff6a2a" },
  { label: "BASKETBALL", primary: "#ff8a31", accent: "#fff0b2" },
  { label: "SOCCER BALL", primary: "#f7f7e8", accent: "#151d1f" },
  { label: "BASEBALL BAT", primary: "#f2ad58", accent: "#fff4d5" },
  { label: "TENNIS RACKET", primary: "#dfff45", accent: "#72e6ff" },
  { label: "RUNNING SHOE", primary: "#72e6ff", accent: "#ffd56a" },
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

function WallSticker({
  kind,
  label,
}: {
  kind: string;
  label: string;
}) {
  return (
    <span
      aria-label={label}
      className={`wall-sticker wall-sticker--${kind}`}
      role="img"
      tabIndex={0}
    >
      <i aria-hidden="true" />
      <b aria-hidden="true" />
      <em aria-hidden="true" />
    </span>
  );
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
  const detailCount = Math.floor(
    count *
      (kind === 1
        ? 0.34
        : kind === 2
          ? 0.38
          : kind === 3
            ? 0.31
            : kind === 4
              ? 0.34
              : 0.18),
  );
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
    } else if (kind === 3) {
      const batProgress = index / Math.max(1, surfaceCount - 1);
      const axial = -1.36 + batProgress * 2.72;
      const radius =
        batProgress < 0.09
          ? 0.18 - (batProgress / 0.09) * 0.075
          : batProgress < 0.4
            ? 0.095 + Math.sin(batProgress * Math.PI * 5) * 0.008
            : batProgress < 0.62
              ? 0.1 + Math.pow((batProgress - 0.4) / 0.22, 0.72) * 0.2
              : 0.3 + Math.sin(((batProgress - 0.62) / 0.38) * Math.PI) * 0.025;
      const angle = seeded(index, 41) * Math.PI * 2;
      const radial = Math.sqrt(seeded(index, 42)) * radius;
      points.push(
        rotatePoint(
          {
            x: axial,
            y: Math.cos(angle) * radial,
            z: Math.sin(angle) * radial,
            emphasis: batProgress < 0.39 && index % 13 === 0 ? 0.48 : 0,
          },
          -0.12,
          0.18,
          -0.58,
        ),
      );
    } else if (kind === 4) {
      const racketProgress = index / Math.max(1, surfaceCount - 1);
      let racketPoint: SportPoint;

      if (racketProgress < 0.3) {
        const angle = (racketProgress / 0.3) * Math.PI * 2;
        const edgeNoise = (seeded(index, 47) - 0.5) * 0.025;
        racketPoint = {
          x: Math.cos(angle) * (0.7 + edgeNoise),
          y: -0.45 + Math.sin(angle) * (0.9 + edgeNoise),
          z: (seeded(index, 48) - 0.5) * 0.11,
          emphasis: 0.75,
        };
      } else if (racketProgress < 0.76) {
        const gridLine = Math.min(9, Math.floor(seeded(index, 53) * 10));
        const along = seeded(index, 54);
        const vertical = index % 2 === 0;

        if (vertical) {
          const x = -0.56 + gridLine * (1.12 / 9);
          const halfHeight =
            0.9 * Math.sqrt(Math.max(0, 1 - (x * x) / (0.7 * 0.7)));
          racketPoint = {
            x,
            y: -0.45 - halfHeight + along * halfHeight * 2,
            z: 0.035,
            emphasis: 0.32,
          };
        } else {
          const y = -1.17 + gridLine * (1.44 / 9);
          const normalizedY = (y + 0.45) / 0.9;
          const halfWidth =
            0.7 * Math.sqrt(Math.max(0, 1 - normalizedY * normalizedY));
          racketPoint = {
            x: -halfWidth + along * halfWidth * 2,
            y,
            z: 0.035,
            emphasis: 0.32,
          };
        }
      } else {
        const handleProgress = (racketProgress - 0.76) / 0.24;
        racketPoint = {
          x: (seeded(index, 49) - 0.5) * (0.15 - handleProgress * 0.025),
          y: 0.38 + handleProgress * 1.28,
          z: (seeded(index, 50) - 0.5) * 0.11,
          emphasis: handleProgress > 0.72 ? 0.8 : 0.45,
        };
      }

      points.push(rotatePoint(racketPoint, -0.03, 0.04, -0.38));
    } else if (kind === 5) {
      const x = -1.28 + seeded(index, 4) * 2.58;
      const normalizedX = (x + 1.28) / 2.58;
      const top =
        x < -0.55
          ? -0.58 - normalizedX * 0.2
          : -0.53 + Math.pow(normalizedX, 1.35) * 0.54;
      const bottom = 0.37 - Math.max(0, x - 0.72) * 0.08;
      const edge = seeded(index, 5);
      const y =
        edge < 0.52
          ? edge < 0.26
            ? top
            : bottom
          : top + seeded(index, 6) * (bottom - top);
      const toeTaper = 0.52 + Math.sin(normalizedX * Math.PI) * 0.2;
      const z =
        edge >= 0.52
          ? (edge < 0.76 ? -1 : 1) * toeTaper
          : (seeded(index, 7) - 0.5) * toeTaper * 2;
      points.push(
        rotatePoint(
          {
            x,
            y,
            z,
            emphasis: index % 21 === 0 ? 0.4 : 0,
          },
          -0.08,
          -0.12,
          -0.1,
        ),
      );
    } else {
      const fuzzy = kind === 4 ? (seeded(index, 7) - 0.5) * 0.055 : 0;
      points.push({
        x: sphere.x * (1 + fuzzy),
        y: sphere.y * (1 + fuzzy),
        z: sphere.z * (1 + fuzzy),
            emphasis: 0,
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
      const seamIndex = Math.floor(index / 4);
      const seamLength = Math.max(2, Math.ceil(detailCount / 4));
      const angle = (seamIndex / (seamLength - 1)) * Math.PI * 2;
      const vertical = {
        x: 0,
        y: Math.cos(angle),
        z: Math.sin(angle),
        emphasis: 1,
      };
      const point =
        seam === 0
          ? vertical
          : seam === 1
            ? { x: Math.cos(angle), y: 0, z: Math.sin(angle), emphasis: 1 }
            : rotatePoint(vertical, 0, 0, seam === 2 ? 0.68 : -0.68);
      points.push({ ...point, emphasis: 1 });
    } else if (kind === 2) {
      const patchCount = 12;
      const patchIndex = index % patchCount;
      const center = spherePoint(patchIndex, patchCount, 0.985);
      const reference = Math.abs(center.y) < 0.88
        ? { x: 0, y: 1, z: 0 }
        : { x: 1, y: 0, z: 0 };
      const tangentXRaw = center.y * reference.z - center.z * reference.y;
      const tangentYRaw = center.z * reference.x - center.x * reference.z;
      const tangentZRaw = center.x * reference.y - center.y * reference.x;
      const tangentLength = Math.hypot(tangentXRaw, tangentYRaw, tangentZRaw);
      const tangentX = tangentXRaw / tangentLength;
      const tangentY = tangentYRaw / tangentLength;
      const tangentZ = tangentZRaw / tangentLength;
      const bitangentX = center.y * tangentZ - center.z * tangentY;
      const bitangentY = center.z * tangentX - center.x * tangentZ;
      const bitangentZ = center.x * tangentY - center.y * tangentX;
      const patchAngle = seeded(index, 61) * Math.PI * 2;
      const patchRadius = Math.sqrt(seeded(index, 62)) * 0.19;
      const x = center.x +
        (tangentX * Math.cos(patchAngle) + bitangentX * Math.sin(patchAngle)) *
          patchRadius;
      const y = center.y +
        (tangentY * Math.cos(patchAngle) + bitangentY * Math.sin(patchAngle)) *
          patchRadius;
      const z = center.z +
        (tangentZ * Math.cos(patchAngle) + bitangentZ * Math.sin(patchAngle)) *
          patchRadius;
      const length = Math.hypot(x, y, z);
      points.push({
        x: x / length,
        y: y / length,
        z: z / length,
        emphasis: 1,
      });
    } else if (kind === 3) {
      let batDetail: SportPoint;
      if (progress < 0.55) {
        const gripProgress = progress / 0.55;
        const gripAngle = gripProgress * Math.PI * 14;
        batDetail = {
          x: -1.2 + gripProgress * 0.82,
          y: Math.cos(gripAngle) * 0.108,
          z: Math.sin(gripAngle) * 0.108,
          emphasis: 1,
        };
      } else if (progress < 0.72) {
        const knobProgress = (progress - 0.55) / 0.17;
        const knobAngle = knobProgress * Math.PI * 6;
        batDetail = {
          x: -1.34 + Math.sin(knobProgress * Math.PI) * 0.025,
          y: Math.cos(knobAngle) * 0.17,
          z: Math.sin(knobAngle) * 0.17,
          emphasis: 1,
        };
      } else if (progress < 0.9) {
        const markProgress = (progress - 0.72) / 0.18;
        batDetail = {
          x: 0.16 + markProgress * 0.62,
          y: Math.sin(markProgress * Math.PI * 2) * 0.07,
          z: 0.305,
          emphasis: 1,
        };
      } else {
        const capProgress = (progress - 0.9) / 0.1;
        const capAngle = capProgress * Math.PI * 2;
        batDetail = {
          x: 1.36,
          y: Math.cos(capAngle) * 0.3,
          z: Math.sin(capAngle) * 0.3,
          emphasis: 1,
        };
      }
      points.push(rotatePoint(batDetail, -0.12, 0.18, -0.58));
    } else if (kind === 4) {
      const isThroat = progress < 0.5;
      const throatProgress = isThroat ? seeded(index, 55) : 0;
      const side = index % 2 === 0 ? -1 : 1;
      const detailPoint = isThroat
        ? {
            x: side * (0.36 - throatProgress * 0.27),
            y: 0.3 + throatProgress * 0.48,
            z: 0.07,
            emphasis: 1,
          }
        : {
            x: Math.sin(index * 1.7) * 0.075,
            y: 0.76 + ((progress - 0.5) / 0.5) * 0.86,
            z: Math.cos(index * 1.7) * 0.055,
            emphasis: 1,
          };
      points.push(rotatePoint(detailPoint, -0.03, 0.04, -0.38));
    } else {
      let shoeDetail: SportPoint;
      if (progress < 0.28) {
        const soleProgress = progress / 0.28;
        const side = index % 2 === 0 ? -1 : 1;
        shoeDetail = {
          x: -1.22 + soleProgress * 2.5,
          y: 0.31 - Math.max(0, soleProgress - 0.78) * 0.14,
          z: side * 0.53,
          emphasis: 1,
        };
      } else if (progress < 0.65) {
        const laceProgress = (progress - 0.28) / 0.37;
        const lace = Math.min(6, Math.floor(laceProgress * 7));
        const across = (laceProgress * 7) % 1;
        shoeDetail = {
          x: -0.58 + lace * 0.18,
          y: -0.43 + lace * 0.058,
          z: -0.38 + across * 0.76,
          emphasis: 1,
        };
      } else if (progress < 0.86) {
        const panelProgress = (progress - 0.65) / 0.21;
        shoeDetail = {
          x: -0.98 + panelProgress * 1.86,
          y: -0.02 - Math.sin(panelProgress * Math.PI) * 0.22,
          z: 0.54,
          emphasis: 1,
        };
      } else {
        const ventProgress = (progress - 0.86) / 0.14;
        const row = index % 3;
        shoeDetail = {
          x: 0.66 + ventProgress * 0.5,
          y: -0.1 + row * 0.09,
          z: 0.46 + Math.sin(ventProgress * Math.PI) * 0.08,
          emphasis: 1,
        };
      }
      points.push(rotatePoint(shoeDetail, -0.08, -0.12, -0.1));
    }
  }

  return points.slice(0, count);
}

function drawSolidSport(
  context: CanvasRenderingContext2D,
  kind: number,
  centerX: number,
  centerY: number,
  scale: number,
  time: number,
) {
  context.save();
  context.translate(centerX, centerY);
  const float = Math.sin(time * 0.0011) * scale * 0.018;
  context.translate(0, float);
  context.rotate(kind === 0 ? -0.42 : kind === 5 ? -0.1 : 0);
  context.lineCap = "round";
  context.lineJoin = "round";

  if (kind === 0) {
    const football = new Path2D();
    football.moveTo(-scale * 1.5, 0);
    football.bezierCurveTo(
      -scale * 0.8,
      -scale * 0.75,
      scale * 0.8,
      -scale * 0.75,
      scale * 1.5,
      0,
    );
    football.bezierCurveTo(
      scale * 0.8,
      scale * 0.75,
      -scale * 0.8,
      scale * 0.75,
      -scale * 1.5,
      0,
    );
    const leather = context.createLinearGradient(
      -scale * 1.3,
      -scale * 0.5,
      scale * 1.3,
      scale * 0.55,
    );
    leather.addColorStop(0, "#6f2719");
    leather.addColorStop(0.46, "#bf5a28");
    leather.addColorStop(0.72, "#8c351d");
    leather.addColorStop(1, "#4e1b19");
    context.fillStyle = leather;
    context.fill(football);
    context.save();
    context.clip(football);
    context.fillStyle = "rgba(255,225,173,.22)";
    for (let dot = 0; dot < 88; dot += 1) {
      const x = (seeded(dot, 31) - 0.5) * scale * 2.85;
      const y = (seeded(dot, 32) - 0.5) * scale * 1.1;
      context.beginPath();
      context.arc(x, y, Math.max(0.55, scale * 0.006), 0, Math.PI * 2);
      context.fill();
    }
    context.strokeStyle = "#f4e7c7";
    context.lineWidth = Math.max(3, scale * 0.045);
    [-0.92, 0.92].forEach((offset) => {
      context.beginPath();
      context.moveTo(scale * offset, -scale * 0.42);
      context.lineTo(scale * offset, scale * 0.42);
      context.stroke();
    });
    context.lineWidth = Math.max(2, scale * 0.026);
    context.beginPath();
    context.moveTo(-scale * 0.48, 0);
    context.lineTo(scale * 0.48, 0);
    context.stroke();
    for (let lace = -3; lace <= 3; lace += 1) {
      context.beginPath();
      context.moveTo(scale * lace * 0.12, -scale * 0.13);
      context.lineTo(scale * lace * 0.12, scale * 0.13);
      context.stroke();
    }
    context.restore();
    context.strokeStyle = "rgba(255,245,218,.48)";
    context.lineWidth = Math.max(1, scale * 0.012);
    context.stroke(football);
  } else if (kind === 1) {
    const radius = scale;
    const ball = new Path2D();
    ball.arc(0, 0, radius, 0, Math.PI * 2);
    const rubber = context.createRadialGradient(
      -radius * 0.35,
      -radius * 0.4,
      radius * 0.08,
      0,
      0,
      radius,
    );
    rubber.addColorStop(0, "#ffb24a");
    rubber.addColorStop(0.55, "#e87522");
    rubber.addColorStop(1, "#8d2f18");
    context.fillStyle = rubber;
    context.fill(ball);
    context.save();
    context.clip(ball);
    context.fillStyle = "rgba(70,25,15,.34)";
    for (let dot = 0; dot < 110; dot += 1) {
      const angle = seeded(dot, 35) * Math.PI * 2;
      const radial = Math.sqrt(seeded(dot, 36)) * radius * 0.95;
      context.beginPath();
      context.arc(
        Math.cos(angle) * radial,
        Math.sin(angle) * radial,
        Math.max(0.5, scale * 0.006),
        0,
        Math.PI * 2,
      );
      context.fill();
    }
    context.strokeStyle = "#32170f";
    context.lineWidth = Math.max(3, scale * 0.04);
    context.beginPath();
    context.moveTo(-radius, 0);
    context.lineTo(radius, 0);
    context.moveTo(0, -radius);
    context.bezierCurveTo(-radius * 0.32, -radius * 0.28, -radius * 0.32, radius * 0.28, 0, radius);
    context.moveTo(0, -radius);
    context.bezierCurveTo(radius * 0.32, -radius * 0.28, radius * 0.32, radius * 0.28, 0, radius);
    context.moveTo(-radius * 0.72, -radius * 0.72);
    context.bezierCurveTo(-radius * 0.22, -radius * 0.2, radius * 0.22, radius * 0.2, radius * 0.72, radius * 0.72);
    context.stroke();
    context.restore();
  } else if (kind === 2) {
    const radius = scale;
    const ball = new Path2D();
    ball.arc(0, 0, radius, 0, Math.PI * 2);
    const shell = context.createRadialGradient(
      -radius * 0.34,
      -radius * 0.42,
      radius * 0.04,
      0,
      0,
      radius,
    );
    shell.addColorStop(0, "#ffffff");
    shell.addColorStop(0.62, "#ecebdc");
    shell.addColorStop(1, "#979e9a");
    context.fillStyle = shell;
    context.fill(ball);
    context.save();
    context.clip(ball);
    const patches = [
      [0, 0, 0],
      [-0.57, -0.38, -0.18],
      [0.59, -0.35, 0.2],
      [-0.48, 0.52, 0.18],
      [0.52, 0.5, -0.2],
    ];
    patches.forEach(([x, y, rotation]) => {
      context.save();
      context.translate(x * radius, y * radius);
      context.rotate(rotation);
      context.beginPath();
      for (let edge = 0; edge < 5; edge += 1) {
        const angle = -Math.PI / 2 + (edge / 5) * Math.PI * 2;
        const px = Math.cos(angle) * radius * 0.19;
        const py = Math.sin(angle) * radius * 0.19;
        if (edge === 0) context.moveTo(px, py);
        else context.lineTo(px, py);
      }
      context.closePath();
      context.fillStyle = "#1b2324";
      context.fill();
      context.strokeStyle = "rgba(27,35,36,.42)";
      context.lineWidth = Math.max(1, scale * 0.012);
      for (let edge = 0; edge < 5; edge += 1) {
        const angle = -Math.PI / 2 + (edge / 5) * Math.PI * 2;
        context.beginPath();
        context.moveTo(Math.cos(angle) * radius * 0.19, Math.sin(angle) * radius * 0.19);
        context.lineTo(Math.cos(angle) * radius * 0.43, Math.sin(angle) * radius * 0.43);
        context.stroke();
      }
      context.restore();
    });
    context.restore();
  } else if (kind === 3) {
    const radius = scale;
    const ball = new Path2D();
    ball.arc(0, 0, radius, 0, Math.PI * 2);
    const hide = context.createRadialGradient(
      -radius * 0.35,
      -radius * 0.4,
      radius * 0.04,
      0,
      0,
      radius,
    );
    hide.addColorStop(0, "#fffdf0");
    hide.addColorStop(0.7, "#f0ead8");
    hide.addColorStop(1, "#b9ab94");
    context.fillStyle = hide;
    context.fill(ball);
    context.save();
    context.clip(ball);
    context.strokeStyle = "#d8493d";
    context.lineWidth = Math.max(2, scale * 0.026);
    [-1, 1].forEach((side) => {
      context.beginPath();
      context.moveTo(-radius * 0.78, side * radius * 0.17);
      context.bezierCurveTo(
        -radius * 0.28,
        side * radius * 0.78,
        radius * 0.28,
        -side * radius * 0.78,
        radius * 0.78,
        -side * radius * 0.17,
      );
      context.stroke();
      for (let stitch = 0; stitch < 10; stitch += 1) {
        const t = stitch / 9;
        const x = -radius * 0.72 + t * radius * 1.44;
        const y =
          side *
          radius *
          (0.2 * Math.cos(t * Math.PI * 2) + 0.19 * Math.sin(t * Math.PI));
        context.beginPath();
        context.moveTo(x - scale * 0.035, y - scale * 0.05);
        context.lineTo(x + scale * 0.035, y + scale * 0.05);
        context.stroke();
      }
    });
    context.restore();
  } else if (kind === 4) {
    const radius = scale;
    const ball = new Path2D();
    ball.arc(0, 0, radius, 0, Math.PI * 2);
    const felt = context.createRadialGradient(
      -radius * 0.32,
      -radius * 0.42,
      radius * 0.03,
      0,
      0,
      radius,
    );
    felt.addColorStop(0, "#f1ff75");
    felt.addColorStop(0.58, "#c6ee2d");
    felt.addColorStop(1, "#6d9a21");
    context.fillStyle = felt;
    context.fill(ball);
    context.save();
    context.clip(ball);
    context.strokeStyle = "#f6ffe2";
    context.lineWidth = Math.max(4, scale * 0.055);
    context.beginPath();
    context.moveTo(-radius * 0.88, -radius * 0.46);
    context.bezierCurveTo(
      -radius * 0.15,
      -radius * 0.2,
      -radius * 0.15,
      radius * 0.2,
      -radius * 0.88,
      radius * 0.46,
    );
    context.moveTo(radius * 0.88, -radius * 0.46);
    context.bezierCurveTo(
      radius * 0.15,
      -radius * 0.2,
      radius * 0.15,
      radius * 0.2,
      radius * 0.88,
      radius * 0.46,
    );
    context.stroke();
    context.fillStyle = "rgba(255,255,255,.2)";
    for (let fuzz = 0; fuzz < 68; fuzz += 1) {
      const angle = seeded(fuzz, 39) * Math.PI * 2;
      const radial = Math.sqrt(seeded(fuzz, 40)) * radius * 0.98;
      context.fillRect(
        Math.cos(angle) * radial,
        Math.sin(angle) * radial,
        1,
        1,
      );
    }
    context.restore();
  } else {
    const shoe = new Path2D();
    shoe.moveTo(-scale * 1.3, scale * 0.32);
    shoe.lineTo(-scale * 1.34, -scale * 0.38);
    shoe.quadraticCurveTo(-scale * 1.28, -scale * 0.7, -scale * 0.94, -scale * 0.76);
    shoe.lineTo(-scale * 0.62, -scale * 0.5);
    shoe.quadraticCurveTo(-scale * 0.18, -scale * 0.44, scale * 0.2, -scale * 0.25);
    shoe.quadraticCurveTo(scale * 0.72, scale * 0.02, scale * 1.24, scale * 0.08);
    shoe.quadraticCurveTo(scale * 1.4, scale * 0.12, scale * 1.3, scale * 0.34);
    shoe.lineTo(scale * 1.15, scale * 0.43);
    shoe.lineTo(-scale * 1.16, scale * 0.43);
    shoe.closePath();
    const mesh = context.createLinearGradient(
      -scale * 1.2,
      -scale * 0.7,
      scale * 1.25,
      scale * 0.35,
    );
    mesh.addColorStop(0, "#143f69");
    mesh.addColorStop(0.4, "#1e87a6");
    mesh.addColorStop(0.72, "#62d6d2");
    mesh.addColorStop(1, "#dfff45");
    context.fillStyle = mesh;
    context.fill(shoe);
    context.save();
    context.clip(shoe);
    context.strokeStyle = "rgba(255,255,255,.18)";
    context.lineWidth = 1;
    for (let line = -8; line <= 8; line += 1) {
      context.beginPath();
      context.moveTo(-scale * 1.4, line * scale * 0.1);
      context.lineTo(scale * 1.4, (line - 5) * scale * 0.1);
      context.stroke();
    }
    context.fillStyle = "rgba(12,39,66,.5)";
    context.beginPath();
    context.moveTo(-scale * 1.28, -scale * 0.38);
    context.lineTo(-scale * 0.93, -scale * 0.62);
    context.lineTo(-scale * 0.68, scale * 0.27);
    context.lineTo(-scale * 1.24, scale * 0.31);
    context.closePath();
    context.fill();
    context.fillStyle = "rgba(255,213,106,.88)";
    context.beginPath();
    context.moveTo(-scale * 0.62, scale * 0.04);
    context.quadraticCurveTo(-scale * 0.05, -scale * 0.12, scale * 0.68, scale * 0.16);
    context.quadraticCurveTo(scale * 0.04, scale * 0.09, -scale * 0.58, scale * 0.19);
    context.closePath();
    context.fill();
    context.restore();
    context.fillStyle = "#f2f1de";
    context.fillRect(-scale * 1.25, scale * 0.29, scale * 2.5, scale * 0.16);
    context.strokeStyle = "#f7f7ee";
    context.lineWidth = Math.max(2, scale * 0.03);
    for (let lace = 0; lace < 6; lace += 1) {
      const x = -scale * 0.62 + lace * scale * 0.17;
      context.beginPath();
      context.moveTo(x - scale * 0.12, -scale * 0.4 + lace * scale * 0.055);
      context.lineTo(x + scale * 0.12, -scale * 0.31 + lace * scale * 0.055);
      context.stroke();
    }
    context.strokeStyle = "rgba(255,255,255,.5)";
    context.lineWidth = Math.max(1, scale * 0.012);
    context.stroke(shoe);
  }

  context.restore();
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
    const pointer = {
      x: 0,
      y: 0,
      screenX: -1000,
      screenY: -1000,
      velocityX: 0,
      velocityY: 0,
      down: false,
      active: false,
    };
    let width = 0;
    let height = 0;
    let frame = 0;
    let canvasVisible = true;
    let activeSport = 0;
    let lastMorph = performance.now();
    let fizzleStart = -1;
    let revealStart = -1;
    let releasePulseStart = -1;
    let woundStrength = 0;
    let transitionTimer = 0;
    const transitionDuration = 880;
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
          particle.x = (seeded(index, activeSport + 20) - 0.5) * 0.18;
          particle.y = (seeded(index, activeSport + 21) - 0.5) * 0.18;
          particle.z = (seeded(index, activeSport + 22) - 0.5) * 0.18;
        }
      });
      lastMorph = performance.now();
      revealStart = immediate ? -1 : performance.now();
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
      }, transitionDuration);
    };

    const createParticles = () => {
      const count =
        width < 540 ? 520 : Math.min(980, Math.floor(width * 1.3));
      const targets = makeSportShape(activeSport, count);
      particles = targets.map((target, index) => ({
        x: target.x + (seeded(index, 12) - 0.5) * 2.4,
        y: target.y + (seeded(index, 13) - 0.5) * 2.4,
        z: target.z + (seeded(index, 14) - 0.5) * 2.4,
        target,
        size: 0.94 + seeded(index, 15) * 1.82,
        phase: seeded(index, 16) * Math.PI * 2,
      }));
      setSport(activeSport, true);
    };

    const resize = () => {
      const bounds = canvas.getBoundingClientRect();
      const ratio = Math.min(window.devicePixelRatio || 1, 1.5);
      width = bounds.width;
      height = bounds.height;
      canvas.width = Math.floor(width * ratio);
      canvas.height = Math.floor(height * ratio);
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      createParticles();
    };

    const render = (time = 0) => {
      if (!canvasVisible || document.hidden) {
        frame = window.requestAnimationFrame(render);
        return;
      }
      context.clearRect(0, 0, width, height);
      const centerX = width * 0.52;
      const centerY = height * 0.49;
      const scale =
        Math.min(width, height) *
        (activeSport === 0
          ? 0.25
          : activeSport === 4
            ? 0.205
            : activeSport === 5
              ? 0.225
              : 0.235);
      const morphEnergy = Math.max(0, 1 - (time - lastMorph) / 2100);
      const fizzleProgress =
        fizzleStart < 0
          ? 0
          : Math.min(
              1,
              Math.max(0, (time - fizzleStart) / transitionDuration),
            );
      const revealProgress =
        revealStart < 0
          ? 1
          : Math.min(1, Math.max(0, (time - revealStart) / 1500));
      if (revealStart >= 0 && revealProgress >= 1) revealStart = -1;
      const palette = sportObjects[activeSport];
      const rotationY =
        (prefersReducedMotion ? 0.08 : time * 0.00017) +
        pointer.x * 0.055;
      const rotationX = -0.06 + pointer.y * 0.045;
      const rotationZ =
        (activeSport === 5 ? 0 : Math.sin(time * 0.00022) * 0.045) +
        (pointer.down ? pointer.velocityX * 0.0007 : 0);
      const fizzleEase =
        fizzleProgress *
        fizzleProgress *
        fizzleProgress *
        (fizzleProgress * (fizzleProgress * 6 - 15) + 10);
      const revealEase = 1 - Math.pow(1 - revealProgress, 3);
      const transitionAlpha =
        fizzleProgress > 0
          ? Math.pow(1 - fizzleEase, 0.82)
          : revealEase;
      const forceRadius = Math.max(92, Math.min(154, width * 0.2));
      woundStrength +=
        ((pointer.down ? 1 : 0) - woundStrength) *
        (pointer.down ? 0.13 : 0.08);
      const releaseProgress =
        releasePulseStart < 0
          ? 1
          : Math.min(1, (time - releasePulseStart) / 720);
      if (releasePulseStart >= 0 && releaseProgress >= 1) {
        releasePulseStart = -1;
      }
      const releasePulse =
        releasePulseStart < 0
          ? 0
          : Math.sin(releaseProgress * Math.PI) * (1 - releaseProgress);
      pointer.velocityX *= 0.92;
      pointer.velocityY *= 0.92;

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

      if (pointer.active) {
        const gravityAura = context.createRadialGradient(
          pointer.screenX,
          pointer.screenY,
          0,
          pointer.screenX,
          pointer.screenY,
          forceRadius,
        );
        gravityAura.addColorStop(
          0,
          pointer.down ? `${palette.accent}30` : `${palette.primary}18`,
        );
        gravityAura.addColorStop(0.35, `${palette.accent}0d`);
        gravityAura.addColorStop(1, "rgba(255,255,255,0)");
        context.fillStyle = gravityAura;
        context.fillRect(0, 0, width, height);
      }

      const basePath = new Path2D();
      const detailPath = new Path2D();
      const cosX = Math.cos(rotationX);
      const sinX = Math.sin(rotationX);
      const cosY = Math.cos(rotationY);
      const sinY = Math.sin(rotationY);
      const cosZ = Math.cos(rotationZ);
      const sinZ = Math.sin(rotationZ);

      particles.forEach((particle, index) => {
        const spring = 0.03 + (1 - morphEnergy) * 0.016;
        particle.x += (particle.target.x - particle.x) * spring;
        particle.y += (particle.target.y - particle.y) * spring;
        particle.z += (particle.target.z - particle.z) * spring;
        const drift = prefersReducedMotion
          ? 0
          : Math.sin(time * 0.0012 + particle.phase) * 0.008;
        const localX = particle.x + drift;
        const localY = particle.y + drift * 0.6;
        const y1 = localY * cosX - particle.z * sinX;
        const z1 = localY * sinX + particle.z * cosX;
        const x2 = localX * cosY + z1 * sinY;
        const z2 = -localX * sinY + z1 * cosY;
        const rotatedX = x2 * cosZ - y1 * sinZ;
        const rotatedY = x2 * sinZ + y1 * cosZ;
        const perspective = 3.9 / (3.9 - z2);
        let screenX = centerX + rotatedX * scale * perspective;
        let screenY = centerY + rotatedY * scale * perspective;
        if (fizzleProgress > 0) {
          const localScreenX = screenX - centerX;
          const localScreenY = screenY - centerY;
          const spiral = fizzleEase * 0.82;
          const compact = 1 - fizzleEase * 0.91;
          const cosSpiral = Math.cos(spiral);
          const sinSpiral = Math.sin(spiral);
          screenX =
            centerX +
            (localScreenX * cosSpiral - localScreenY * sinSpiral) * compact;
          screenY =
            centerY +
            (localScreenX * sinSpiral + localScreenY * cosSpiral) * compact;
        }
        let interactionEnergy = 0;
        if (pointer.active && fizzleProgress === 0) {
          const pointerDx = screenX - pointer.screenX;
          const pointerDy = screenY - pointer.screenY;
          const pointerDistance = Math.hypot(pointerDx, pointerDy);
          if (pointerDistance < forceRadius) {
            const force = Math.pow(1 - pointerDistance / forceRadius, 2);
            const normalX = pointerDx / Math.max(1, pointerDistance);
            const normalY = pointerDy / Math.max(1, pointerDistance);
            const radialShift = (pointer.down ? -28 : 21) * force;
            screenX += normalX * radialShift;
            screenY += normalY * radialShift;
            if (pointer.down) {
              const split =
                Math.sin(index * 12.9898 + particle.phase * 4.1) >= 0 ? 1 : -1;
              const shear = woundStrength * force * (12 + morphEnergy * 5);
              screenX += -normalY * split * shear;
              screenY += normalX * split * shear;
            }
            interactionEnergy = force;
          }
        }
        if (releasePulse > 0) {
          const implode = 1 - releasePulse * 0.28;
          screenX = centerX + (screenX - centerX) * implode;
          screenY = centerY + (screenY - centerY) * implode;
        }
        const size = Math.max(
          0.55,
          particle.size *
            perspective *
            (0.9 + (z2 + 1) * 0.14) *
            (1 + interactionEnergy * woundStrength * 0.55),
        );
        const path =
          particle.target.emphasis > 0.55 ? detailPath : basePath;
        path.moveTo(screenX + size, screenY);
        path.arc(screenX, screenY, size, 0, Math.PI * 2);
      });

      context.globalCompositeOperation = "lighter";
      context.globalAlpha = transitionAlpha * 0.78;
      context.fillStyle = palette.primary;
      context.fill(basePath);
      context.globalAlpha = transitionAlpha;
      context.fillStyle = palette.accent;
      context.fill(detailPath);
      context.globalCompositeOperation = "source-over";
      context.globalAlpha = 1;

      if (pointer.active && woundStrength > 0.02 && transitionAlpha > 0.03) {
        const woundX =
          centerX +
          Math.max(-scale * 0.54, Math.min(scale * 0.54, pointer.screenX - centerX));
        const woundY =
          centerY +
          Math.max(-scale * 0.54, Math.min(scale * 0.54, pointer.screenY - centerY));
        const seamAngle =
          Math.atan2(pointer.screenY - centerY, pointer.screenX - centerX) +
          Math.PI / 2;
        const seamLength = scale * (0.58 + woundStrength * 0.28);
        const seamDx = Math.cos(seamAngle) * seamLength;
        const seamDy = Math.sin(seamAngle) * seamLength;
        const controlX = woundX + pointer.velocityX * 0.75;
        const controlY = woundY + pointer.velocityY * 0.75;
        const woundGradient = context.createLinearGradient(
          woundX - seamDx,
          woundY - seamDy,
          woundX + seamDx,
          woundY + seamDy,
        );
        woundGradient.addColorStop(0, `${palette.accent}00`);
        woundGradient.addColorStop(0.32, palette.accent);
        woundGradient.addColorStop(0.52, "#fffbe8");
        woundGradient.addColorStop(0.72, palette.primary);
        woundGradient.addColorStop(1, `${palette.primary}00`);
        context.save();
        context.strokeStyle = woundGradient;
        context.lineCap = "round";
        context.lineWidth = 2.2 + woundStrength * 2.4;
        context.globalAlpha = transitionAlpha * woundStrength;
        context.shadowColor = palette.accent;
        context.shadowBlur = 18 + woundStrength * 24;
        context.beginPath();
        context.moveTo(woundX - seamDx, woundY - seamDy);
        context.quadraticCurveTo(
          controlX,
          controlY,
          woundX + seamDx,
          woundY + seamDy,
        );
        context.stroke();
        context.strokeStyle = "rgba(255,255,255,.82)";
        context.lineWidth = 0.75;
        context.shadowBlur = 0;
        context.beginPath();
        context.moveTo(woundX - seamDx * 0.86, woundY - seamDy * 0.86);
        context.quadraticCurveTo(
          controlX + Math.sin(time * 0.008) * 7,
          controlY + Math.cos(time * 0.007) * 7,
          woundX + seamDx * 0.86,
          woundY + seamDy * 0.86,
        );
        context.stroke();
        context.restore();
      } else if (pointer.active && transitionAlpha > 0.03) {
        context.save();
        context.translate(pointer.screenX, pointer.screenY);
        context.rotate(Math.atan2(pointer.velocityY, pointer.velocityX || 1));
        context.strokeStyle = `${palette.accent}b8`;
        context.lineWidth = 1.3;
        context.setLineDash([8, 7]);
        context.lineDashOffset = -time * 0.018;
        context.beginPath();
        context.arc(0, 0, 19 + Math.sin(time * 0.005) * 2, -0.82, 0.82);
        context.moveTo(-15, -12);
        context.arc(0, 0, 19, Math.PI - 0.62, Math.PI + 0.62);
        context.stroke();
        context.restore();
      }

      if (!prefersReducedMotion) {
        frame = window.requestAnimationFrame(render);
      }
    };

    const onPointerMove = (event: PointerEvent) => {
      const bounds = canvas.getBoundingClientRect();
      const nextX = event.clientX - bounds.left;
      const nextY = event.clientY - bounds.top;
      pointer.velocityX =
        (nextX - (pointer.active ? pointer.screenX : nextX)) * 0.58 +
        pointer.velocityX * 0.42;
      pointer.velocityY =
        (nextY - (pointer.active ? pointer.screenY : nextY)) * 0.58 +
        pointer.velocityY * 0.42;
      pointer.screenX = nextX;
      pointer.screenY = nextY;
      pointer.x = (pointer.screenX / Math.max(1, width) - 0.5) * 2;
      pointer.y = (pointer.screenY / Math.max(1, height) - 0.5) * 2;
      pointer.active = true;
      if (prefersReducedMotion) render(performance.now());
    };
    const onPointerLeave = () => {
      if (pointer.down) return;
      pointer.active = false;
      pointer.x = 0;
      pointer.y = 0;
      if (prefersReducedMotion) render(performance.now());
    };
    const onPointerDown = (event: PointerEvent) => {
      onPointerMove(event);
      pointer.down = true;
      canvas.setPointerCapture?.(event.pointerId);
      if (prefersReducedMotion) render(performance.now());
    };
    const onPointerUp = (event: PointerEvent) => {
      if (!pointer.down) return;
      pointer.down = false;
      releasePulseStart = performance.now();
      setSport(activeSport + 1);
      if (canvas.hasPointerCapture?.(event.pointerId)) {
        canvas.releasePointerCapture(event.pointerId);
      }
      if (prefersReducedMotion) render(performance.now());
    };
    const onPointerCancel = (event: PointerEvent) => {
      pointer.down = false;
      pointer.active = false;
      if (canvas.hasPointerCapture?.(event.pointerId)) {
        canvas.releasePointerCapture(event.pointerId);
      }
    };
    const onFocus = () => {
      pointer.screenX = width * 0.54;
      pointer.screenY = height * 0.49;
      pointer.active = true;
      if (prefersReducedMotion) render(performance.now());
    };
    const onBlur = () => {
      pointer.active = false;
      pointer.down = false;
      pointer.x = 0;
      pointer.y = 0;
      if (prefersReducedMotion) render(performance.now());
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Enter" && event.key !== " ") return;
      event.preventDefault();
      setSport(activeSport + 1);
    };

    const observer = new ResizeObserver(resize);
    const visibilityObserver = new IntersectionObserver(
      ([entry]) => {
        canvasVisible = entry?.isIntersecting ?? true;
      },
      { rootMargin: "120px" },
    );
    observer.observe(canvas);
    visibilityObserver.observe(canvas);
    canvas.addEventListener("pointermove", onPointerMove);
    canvas.addEventListener("pointerleave", onPointerLeave);
    canvas.addEventListener("pointerdown", onPointerDown);
    canvas.addEventListener("pointerup", onPointerUp);
    canvas.addEventListener("pointercancel", onPointerCancel);
    canvas.addEventListener("focus", onFocus);
    canvas.addEventListener("blur", onBlur);
    canvas.addEventListener("keydown", onKeyDown);
    resize();
    render();
    const sportTimer = prefersReducedMotion
      ? 0
      : window.setInterval(() => {
          if (!pointer.down) setSport(activeSport + 1);
        }, 11200);

    return () => {
      observer.disconnect();
      visibilityObserver.disconnect();
      canvas.removeEventListener("pointermove", onPointerMove);
      canvas.removeEventListener("pointerleave", onPointerLeave);
      canvas.removeEventListener("pointerdown", onPointerDown);
      canvas.removeEventListener("pointerup", onPointerUp);
      canvas.removeEventListener("pointercancel", onPointerCancel);
      canvas.removeEventListener("focus", onFocus);
      canvas.removeEventListener("blur", onBlur);
      canvas.removeEventListener("keydown", onKeyDown);
      if (sportTimer) window.clearInterval(sportTimer);
      if (transitionTimer) window.clearTimeout(transitionTimer);
      window.cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="hero-visual__canvas"
      aria-describedby="hero-art-instructions"
      aria-label="Interactive gravity-distorted particle sports artwork"
      role="button"
      tabIndex={0}
    />
  );
}

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [loaderProgress, setLoaderProgress] = useState(0);
  const [progress, setProgress] = useState(0);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [openQuestion, setOpenQuestion] = useState<number | null>(null);

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
            <p className="hero__location">Based in Santa Clarita, California.</p>
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
            <p className="sr-only" id="hero-art-instructions">
              Move over the artwork to bend its particles. Press and hold to
              tear open a gravity seam, then release to rebuild the next sports
              object. Press Enter or Space to advance with a keyboard.
            </p>
          </div>

          <div className="hero-tech__status" aria-hidden="true">
            <span>PILOT STATUS</span>
            <strong>PRE-SEASON</strong>
            <i />
            <span>SCROLL TO EXPLORE</span>
          </div>
        </section>

        <div className="hero-transition">
          <i aria-hidden="true" /><i aria-hidden="true" /><i aria-hidden="true" />
          <WallSticker
            kind="feed"
            label="Plate, fork, and spoon sticker"
          />
        </div>

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
          <WallSticker
            kind="valley"
            label="Santa Clarita mountains and sun sticker"
          />
          <WallSticker
            kind="hands"
            label="Hands holding wheat sticker"
          />
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
          <WallSticker
            kind="score"
            label="Basketball sticker"
          />
          <WallSticker
            kind="receipt"
            label="Verified contribution receipt sticker"
          />
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
          <WallSticker
            kind="clipboard"
            label="Three-step playbook clipboard sticker"
          />
          <WallSticker
            kind="pantry"
            label="Grocery bag and produce sticker"
          />
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
          <WallSticker
            kind="bolt"
            label="Running shoe sticker"
          />
          <WallSticker
            kind="calendar"
            label="Game schedule calendar sticker"
          />
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
          <WallSticker
            kind="heart"
            label="Heart sticker"
          />
          <WallSticker
            kind="handshake"
            label="Community partnership handshake sticker"
          />
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
          <WallSticker
            kind="speech"
            label="Questions and answers speech bubble sticker"
          />
          <div className="section-index">06 / Preemptive Q&amp;A</div>
          <div className="faq__heading" data-reveal>
            <span>THE QUESTIONS WORTH ASKING EARLY</span>
            <h2>Preemptive Q&amp;A.</h2>
            <p>Clear answers now. Verified details as the pilot takes shape.</p>
          </div>
          <div className="faq-list" data-reveal>
            {questions.map((item, index) => {
              const isOpen = openQuestion === index;
              const buttonId = `faq-button-${index + 1}`;
              const panelId = `faq-panel-${index + 1}`;

              return (
                <article
                  className={`faq-item ${isOpen ? "is-open" : ""}`}
                  key={item.question}
                >
                  <h3>
                    <button
                      aria-controls={panelId}
                      aria-expanded={isOpen}
                      id={buttonId}
                      onClick={() =>
                        setOpenQuestion((current) =>
                          current === index ? null : index,
                        )
                      }
                      type="button"
                    >
                      <span>{String(index + 1).padStart(2, "0")}</span>
                      <strong>{item.question}</strong>
                      <i aria-hidden="true">+</i>
                    </button>
                  </h3>
                  <div
                    aria-hidden={!isOpen}
                    aria-labelledby={buttonId}
                    className="faq-answer-shell"
                    id={panelId}
                    role="region"
                  >
                    <div className="faq-answer-inner">
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
                        <p className="faq-answer">{item.answer}</p>
                      )}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        <section className="final-cta contact" id="contact" aria-labelledby="contact-title">
          <WallSticker
            kind="sunset"
            label="Soccer ball at sunset sticker"
          />
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
