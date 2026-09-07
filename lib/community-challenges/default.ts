import type { PublicChallenge } from "./types";

// This public fallback also seeds the first database migration. It keeps /give
// honest and usable before DATABASE_URL and the pantry webhook secret exist.
export const defaultChallenge: PublicChallenge = {
  id: "8e907c87-82a7-49d1-a412-fd35b9fe2b77",
  slug: "individual-giving",
  title: "Help provide meals to local families.",
  opponentEventName: null,
  sportEventType: "individual-giving",
  ctaLanguage: "give",
  startAt: "2026-09-01T07:00:00.000Z",
  deadlineAt: null,
  timezone: "America/Los_Angeles",
  mealValueCents: 228,
  mealGoal: null,
  status: "live",
  givebutterDestinationUrl:
    "https://givebutter.com/santa-clarita-valley-food-pantry/donate",
  attributionIdentifier: "sports-against-hunger-individual-giving",
};
