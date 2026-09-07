type UtmField = "source" | "medium" | "campaign" | "term" | "content";

export interface NormalizedUtm {
  source?: string;
  medium?: string;
  campaign?: string;
  term?: string;
  content?: string;
  confident: boolean;
  issues: string[];
  shape: string;
}

const fieldAliases: Record<string, UtmField | undefined> = {
  source: "source",
  campaign_source: "source",
  utm_source: "source",
  medium: "medium",
  campaign_medium: "medium",
  utm_medium: "medium",
  campaign: "campaign",
  campaign_name: "campaign",
  utm_campaign: "campaign",
  term: "term",
  campaign_term: "term",
  utm_term: "term",
  content: "content",
  campaign_content: "content",
  utm_content: "content",
};

function normalizeKey(value: string) {
  return value
    .trim()
    .replace(/([a-z0-9])([A-Z])/g, "$1_$2")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
}

function fieldForKey(value: string) {
  return fieldAliases[normalizeKey(value)];
}

function scalarString(value: unknown) {
  if (typeof value === "string") {
    const trimmed = value.trim();
    return trimmed && trimmed.length <= 300 ? trimmed : undefined;
  }

  if (typeof value === "number" && Number.isFinite(value)) return String(value);
  return undefined;
}

function describeShape(value: unknown, depth = 0): unknown {
  if (depth > 5) return "depth_limit";
  if (value === null) return "null";
  if (Array.isArray(value)) {
    return { array: value.slice(0, 8).map((item) => describeShape(item, depth + 1)) };
  }
  if (typeof value !== "object") return typeof value;

  const entries = Object.entries(value as Record<string, unknown>).slice(0, 30);
  const known: Record<string, unknown> = {};
  let unknownKeys = 0;

  for (const [key, child] of entries) {
    const field = fieldForKey(key);
    const normalizedKey = normalizeKey(key);
    if (field) known[`utm_${field}`] = describeShape(child, depth + 1);
    else if (["key", "name", "parameter", "field", "value", "data"].includes(normalizedKey)) {
      known[normalizedKey] = describeShape(child, depth + 1);
    } else {
      unknownKeys += 1;
    }
  }

  if (unknownKeys) known.unknown_keys = unknownKeys;
  return known;
}

export function describeUtmShape(value: unknown) {
  return JSON.stringify(describeShape(value)).slice(0, 2000);
}

export function normalizeGivebutterUtm(value: unknown): NormalizedUtm {
  const candidates: Record<UtmField, Set<string>> = {
    source: new Set(),
    medium: new Set(),
    campaign: new Set(),
    term: new Set(),
    content: new Set(),
  };
  const visited = new Set<object>();

  const add = (field: UtmField, candidate: unknown) => {
    const text = scalarString(candidate);
    if (text) candidates[field].add(text);
  };

  const visit = (current: unknown, contextField?: UtmField, depth = 0) => {
    if (depth > 8 || current === null || current === undefined) return;

    if (typeof current === "string") {
      if (contextField) add(contextField, current);

      const trimmed = current.trim();
      if (/^[{[]/.test(trimmed)) {
        try {
          visit(JSON.parse(trimmed), undefined, depth + 1);
        } catch {
          // It may be a query string instead of JSON.
        }
      }

      if (trimmed.includes("=")) {
        const query = trimmed.includes("?") ? trimmed.slice(trimmed.indexOf("?") + 1) : trimmed;
        for (const [key, paramValue] of new URLSearchParams(query)) {
          const field = fieldForKey(key);
          if (field) add(field, paramValue);
        }
      }
      return;
    }

    if (typeof current !== "object") {
      if (contextField) add(contextField, current);
      return;
    }

    if (visited.has(current)) return;
    visited.add(current);

    if (Array.isArray(current)) {
      for (const item of current.slice(0, 50)) visit(item, undefined, depth + 1);
      return;
    }

    const record = current as Record<string, unknown>;
    const pairKey = scalarString(
      record.key ?? record.name ?? record.parameter ?? record.field,
    );
    const pairField = pairKey ? fieldForKey(pairKey) : undefined;
    if (pairField) add(pairField, record.value ?? record.data);

    for (const [key, child] of Object.entries(record).slice(0, 80)) {
      const field = fieldForKey(key);
      if (field) add(field, child);
      if (!(pairField && ["value", "data"].includes(normalizeKey(key)))) {
        visit(child, field, depth + 1);
      }
    }
  };

  visit(value);

  const issues: string[] = [];
  const pick = (field: UtmField) => {
    const values = [...candidates[field]];
    if (values.length > 1) issues.push(`conflicting_${field}`);
    return values.length === 1 ? values[0] : undefined;
  };

  const normalized = {
    source: pick("source"),
    medium: pick("medium"),
    campaign: pick("campaign"),
    term: pick("term"),
    content: pick("content"),
  };

  return {
    ...normalized,
    confident: Boolean(normalized.source && normalized.campaign && issues.length === 0),
    issues,
    shape: describeUtmShape(value),
  };
}
