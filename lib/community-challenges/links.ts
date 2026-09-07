import type { LinkAttribution, PublicChallenge } from "./types";

const attributionTokenPattern = /^[a-zA-Z0-9._~-]{1,100}$/;

export function sanitizeAttributionToken(value: unknown) {
  if (typeof value !== "string") return undefined;
  return attributionTokenPattern.test(value) ? value : undefined;
}

export function buildGivebutterDonationUrl(
  challenge: Pick<
    PublicChallenge,
    "givebutterDestinationUrl" | "attributionIdentifier"
  >,
  attribution: LinkAttribution,
  amountCents?: number,
) {
  const url = new URL(challenge.givebutterDestinationUrl);

  if (
    url.protocol !== "https:" ||
    (url.hostname !== "givebutter.com" && !url.hostname.endsWith(".givebutter.com"))
  ) {
    throw new Error("Challenge donation URL must use Givebutter over HTTPS.");
  }

  url.searchParams.set("utm_source", "sports_against_hunger");
  url.searchParams.set(
    "utm_medium",
    sanitizeAttributionToken(attribution.medium) ?? "website",
  );
  url.searchParams.set("utm_campaign", challenge.attributionIdentifier);

  const content = sanitizeAttributionToken(attribution.content);
  if (content) url.searchParams.set("utm_content", content);

  if (
    typeof amountCents === "number" &&
    Number.isSafeInteger(amountCents) &&
    amountCents > 0
  ) {
    url.searchParams.set("amount", (amountCents / 100).toFixed(2));
  }

  return url.toString();
}
