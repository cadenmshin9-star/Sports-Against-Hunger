import { sql } from "drizzle-orm";
import {
  boolean,
  check,
  index,
  integer,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

export const challengeStatus = pgEnum("challenge_status", [
  "draft",
  "live",
  "ended",
  "archived",
]);

export const communityChallenges = pgTable(
  "community_challenges",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    slug: varchar("slug", { length: 160 }).notNull(),
    title: varchar("title", { length: 240 }).notNull(),
    opponentEventName: varchar("opponent_event_name", { length: 240 }),
    sportEventType: varchar("sport_event_type", { length: 80 }).notNull(),
    ctaLanguage: varchar("cta_language", { length: 80 }).notNull(),
    startAt: timestamp("start_at", { withTimezone: true, mode: "date" }).notNull(),
    deadlineAt: timestamp("deadline_at", { withTimezone: true, mode: "date" }),
    timezone: varchar("timezone", { length: 80 }).notNull(),
    mealValueCents: integer("meal_value_cents").default(228).notNull(),
    mealGoal: integer("meal_goal"),
    status: challengeStatus("status").default("draft").notNull(),
    givebutterDestinationUrl: text("givebutter_destination_url").notNull(),
    attributionIdentifier: varchar("attribution_identifier", { length: 160 }).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true, mode: "date" })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true, mode: "date" })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    uniqueIndex("community_challenges_slug_unique").on(table.slug),
    uniqueIndex("community_challenges_attribution_unique").on(
      table.attributionIdentifier,
    ),
    index("community_challenges_status_deadline_idx").on(
      table.status,
      table.deadlineAt,
    ),
    check("community_challenges_meal_value_positive", sql`${table.mealValueCents} > 0`),
    check(
      "community_challenges_meal_goal_positive",
      sql`${table.mealGoal} is null or ${table.mealGoal} > 0`,
    ),
    check(
      "community_challenges_deadline_after_start",
      sql`${table.deadlineAt} is null or ${table.deadlineAt} > ${table.startAt}`,
    ),
  ],
);

export const donationTransactions = pgTable(
  "donation_transactions",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    challengeId: uuid("challenge_id")
      .notNull()
      .references(() => communityChallenges.id, { onDelete: "restrict" }),
    externalTransactionId: varchar("external_transaction_id", { length: 191 }).notNull(),
    givebutterCampaignId: varchar("givebutter_campaign_id", { length: 191 }),
    givebutterCampaignCode: varchar("givebutter_campaign_code", { length: 191 }),
    status: varchar("status", { length: 40 }).notNull(),
    donationAmountCents: integer("donation_amount_cents").notNull(),
    currency: varchar("currency", { length: 3 }).notNull(),
    transactedAt: timestamp("transacted_at", { withTimezone: true, mode: "date" }),
    countsTowardChallenge: boolean("counts_toward_challenge").default(false).notNull(),
    exclusionReason: varchar("exclusion_reason", { length: 80 }),
    utmSource: varchar("utm_source", { length: 191 }).notNull(),
    utmCampaign: varchar("utm_campaign", { length: 191 }).notNull(),
    utmMedium: varchar("utm_medium", { length: 191 }),
    utmContent: varchar("utm_content", { length: 191 }),
    utmShape: text("utm_shape"),
    createdAt: timestamp("created_at", { withTimezone: true, mode: "date" })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true, mode: "date" })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    uniqueIndex("donation_transactions_external_id_unique").on(
      table.externalTransactionId,
    ),
    index("donation_transactions_challenge_counted_idx").on(
      table.challengeId,
      table.countsTowardChallenge,
    ),
    check("donation_transactions_amount_nonnegative", sql`${table.donationAmountCents} >= 0`),
  ],
);

export const donationRefunds = pgTable(
  "donation_refunds",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    externalRefundId: varchar("external_refund_id", { length: 191 }).notNull(),
    externalTransactionId: varchar("external_transaction_id", { length: 191 }).notNull(),
    status: varchar("status", { length: 40 }).notNull(),
    refundType: varchar("refund_type", { length: 80 }),
    refundAmountCents: integer("refund_amount_cents").notNull(),
    refundedAt: timestamp("refunded_at", { withTimezone: true, mode: "date" }),
    createdAt: timestamp("created_at", { withTimezone: true, mode: "date" })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true, mode: "date" })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    uniqueIndex("donation_refunds_external_id_unique").on(table.externalRefundId),
    index("donation_refunds_transaction_idx").on(table.externalTransactionId),
    check("donation_refunds_amount_positive", sql`${table.refundAmountCents} > 0`),
  ],
);

export type CommunityChallenge = typeof communityChallenges.$inferSelect;
export type NewDonationTransaction = typeof donationTransactions.$inferInsert;
export type NewDonationRefund = typeof donationRefunds.$inferInsert;
