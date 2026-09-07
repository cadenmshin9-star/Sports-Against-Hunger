import type { Metadata } from "next";
import { getActiveChallengeSnapshot } from "@/db/challenges";
import { sanitizeAttributionToken } from "@/lib/community-challenges/links";
import GiveExperience from "./GiveExperience";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Give Meals | Sports Against Hunger",
  description:
    "Donate directly to SCV Food Pantry through Givebutter and see the verified meal impact of individual Sports Against Hunger gifts.",
  alternates: { canonical: "/give" },
};

type GivePageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

function first(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function GivePage({ searchParams }: GivePageProps) {
  const [snapshot, parameters] = await Promise.all([
    getActiveChallengeSnapshot(),
    searchParams,
  ]);
  const medium =
    sanitizeAttributionToken(first(parameters.utm_medium)) ?? "website";
  const content = sanitizeAttributionToken(first(parameters.utm_content));

  return (
    <GiveExperience
      initialSnapshot={snapshot}
      linkAttribution={{ medium, content }}
    />
  );
}
