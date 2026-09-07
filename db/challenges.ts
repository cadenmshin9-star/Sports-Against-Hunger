import { and, desc, eq, notInArray, sql } from "drizzle-orm";
import { getDb, isDatabaseConfigured } from "./index";
import {
  communityChallenges,
  donationRefunds,
  donationTransactions,
  type CommunityChallenge,
} from "./schema";
import { defaultChallenge } from "@/lib/community-challenges/default";
import type {
  ChallengeSnapshot,
  PublicChallenge,
  TrackingState,
} from "@/lib/community-challenges/types";
import { calculateMealCount } from "@/lib/givebutter/money";

function toPublicChallenge(challenge: CommunityChallenge): PublicChallenge {
  return {
    id: challenge.id,
    slug: challenge.slug,
    title: challenge.title,
    opponentEventName: challenge.opponentEventName,
    sportEventType: challenge.sportEventType,
    ctaLanguage: challenge.ctaLanguage,
    startAt: challenge.startAt.toISOString(),
    deadlineAt: challenge.deadlineAt?.toISOString() ?? null,
    timezone: challenge.timezone,
    mealValueCents: challenge.mealValueCents,
    mealGoal: challenge.mealGoal,
    status: challenge.status,
    givebutterDestinationUrl: challenge.givebutterDestinationUrl,
    attributionIdentifier: challenge.attributionIdentifier,
  };
}

function trackingState(): TrackingState {
  return process.env.GIVEBUTTER_WEBHOOK_SECRET
    ? "connected"
    : "configuration_required";
}

function fallbackSnapshot(state: TrackingState): ChallengeSnapshot {
  return {
    challenge: defaultChallenge,
    mealCount: 0,
    grossDonationCents: 0,
    refundedCents: 0,
    netDonationCents: 0,
    confirmedTransactionCount: 0,
    trackingState: state,
    asOf: new Date().toISOString(),
  };
}

async function getTotals(challenge: CommunityChallenge) {
  const db = getDb();
  const refundTotals = db
    .select({
      externalTransactionId: donationRefunds.externalTransactionId,
      refundAmountCents: sql<number>`sum(${donationRefunds.refundAmountCents})`
        .mapWith(Number)
        .as("refund_amount_cents"),
    })
    .from(donationRefunds)
    .where(
      notInArray(donationRefunds.status, [
        "failed",
        "canceled",
        "cancelled",
        "rejected",
      ]),
    )
    .groupBy(donationRefunds.externalTransactionId)
    .as("refund_totals");

  const [totals] = await db
    .select({
      grossDonationCents:
        sql<number>`coalesce(sum(${donationTransactions.donationAmountCents}), 0)`
          .mapWith(Number),
      refundedCents:
        sql<number>`coalesce(sum(least(${donationTransactions.donationAmountCents}, coalesce(${refundTotals.refundAmountCents}, 0))), 0)`
          .mapWith(Number),
      netDonationCents:
        sql<number>`coalesce(sum(greatest(${donationTransactions.donationAmountCents} - coalesce(${refundTotals.refundAmountCents}, 0), 0)), 0)`
          .mapWith(Number),
      confirmedTransactionCount: sql<number>`count(*)`.mapWith(Number),
    })
    .from(donationTransactions)
    .leftJoin(
      refundTotals,
      eq(
        donationTransactions.externalTransactionId,
        refundTotals.externalTransactionId,
      ),
    )
    .where(
      and(
        eq(donationTransactions.challengeId, challenge.id),
        eq(donationTransactions.countsTowardChallenge, true),
      ),
    );

  return {
    grossDonationCents: totals?.grossDonationCents ?? 0,
    refundedCents: totals?.refundedCents ?? 0,
    netDonationCents: totals?.netDonationCents ?? 0,
    confirmedTransactionCount: totals?.confirmedTransactionCount ?? 0,
  };
}

async function snapshotFor(challenge: CommunityChallenge): Promise<ChallengeSnapshot> {
  const totals = await getTotals(challenge);
  return {
    challenge: toPublicChallenge(challenge),
    ...totals,
    mealCount: calculateMealCount(
      totals.netDonationCents,
      challenge.mealValueCents,
    ),
    trackingState: trackingState(),
    asOf: new Date().toISOString(),
  };
}

export async function getActiveChallengeSnapshot(): Promise<ChallengeSnapshot> {
  if (!isDatabaseConfigured()) return fallbackSnapshot("configuration_required");

  try {
    const db = getDb();
    const [challenge] = await db
      .select()
      .from(communityChallenges)
      .where(
        and(
          eq(communityChallenges.slug, defaultChallenge.slug),
          eq(communityChallenges.status, "live"),
        ),
      )
      .limit(1);

    if (!challenge) return fallbackSnapshot("configuration_required");
    return snapshotFor(challenge);
  } catch (error) {
    console.error("Unable to load the active community challenge.", {
      error: error instanceof Error ? error.name : "UnknownError",
    });
    return fallbackSnapshot("unavailable");
  }
}

export async function getChallengeSnapshotBySlug(slug: string) {
  if (!isDatabaseConfigured()) {
    return slug === defaultChallenge.slug
      ? fallbackSnapshot("configuration_required")
      : null;
  }

  try {
    const db = getDb();
    const [challenge] = await db
      .select()
      .from(communityChallenges)
      .where(eq(communityChallenges.slug, slug))
      .orderBy(desc(communityChallenges.updatedAt))
      .limit(1);

    return challenge ? snapshotFor(challenge) : null;
  } catch (error) {
    console.error("Unable to load a community challenge snapshot.", {
      error: error instanceof Error ? error.name : "UnknownError",
    });
    return slug === defaultChallenge.slug ? fallbackSnapshot("unavailable") : null;
  }
}

export async function getChallengeByAttribution(attributionIdentifier: string) {
  const db = getDb();
  const [challenge] = await db
    .select()
    .from(communityChallenges)
    .where(eq(communityChallenges.attributionIdentifier, attributionIdentifier))
    .limit(1);
  return challenge ?? null;
}
