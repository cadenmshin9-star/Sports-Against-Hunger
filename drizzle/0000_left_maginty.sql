CREATE TYPE "public"."challenge_status" AS ENUM('draft', 'live', 'ended', 'archived');--> statement-breakpoint
CREATE TABLE "community_challenges" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" varchar(160) NOT NULL,
	"title" varchar(240) NOT NULL,
	"opponent_event_name" varchar(240),
	"sport_event_type" varchar(80) NOT NULL,
	"cta_language" varchar(80) NOT NULL,
	"start_at" timestamp with time zone NOT NULL,
	"deadline_at" timestamp with time zone,
	"timezone" varchar(80) NOT NULL,
	"meal_value_cents" integer DEFAULT 228 NOT NULL,
	"meal_goal" integer,
	"status" "challenge_status" DEFAULT 'draft' NOT NULL,
	"givebutter_destination_url" text NOT NULL,
	"attribution_identifier" varchar(160) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "community_challenges_meal_value_positive" CHECK ("community_challenges"."meal_value_cents" > 0),
	CONSTRAINT "community_challenges_meal_goal_positive" CHECK ("community_challenges"."meal_goal" is null or "community_challenges"."meal_goal" > 0),
	CONSTRAINT "community_challenges_deadline_after_start" CHECK ("community_challenges"."deadline_at" is null or "community_challenges"."deadline_at" > "community_challenges"."start_at")
);
--> statement-breakpoint
CREATE TABLE "donation_refunds" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"external_refund_id" varchar(191) NOT NULL,
	"external_transaction_id" varchar(191) NOT NULL,
	"status" varchar(40) NOT NULL,
	"refund_type" varchar(80),
	"refund_amount_cents" integer NOT NULL,
	"refunded_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "donation_refunds_amount_positive" CHECK ("donation_refunds"."refund_amount_cents" > 0)
);
--> statement-breakpoint
CREATE TABLE "donation_transactions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"challenge_id" uuid NOT NULL,
	"external_transaction_id" varchar(191) NOT NULL,
	"givebutter_campaign_id" varchar(191),
	"givebutter_campaign_code" varchar(191),
	"status" varchar(40) NOT NULL,
	"donation_amount_cents" integer NOT NULL,
	"currency" varchar(3) NOT NULL,
	"transacted_at" timestamp with time zone,
	"counts_toward_challenge" boolean DEFAULT false NOT NULL,
	"exclusion_reason" varchar(80),
	"utm_source" varchar(191) NOT NULL,
	"utm_campaign" varchar(191) NOT NULL,
	"utm_medium" varchar(191),
	"utm_content" varchar(191),
	"utm_shape" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "donation_transactions_amount_nonnegative" CHECK ("donation_transactions"."donation_amount_cents" >= 0)
);
--> statement-breakpoint
ALTER TABLE "donation_transactions" ADD CONSTRAINT "donation_transactions_challenge_id_community_challenges_id_fk" FOREIGN KEY ("challenge_id") REFERENCES "public"."community_challenges"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "community_challenges_slug_unique" ON "community_challenges" USING btree ("slug");--> statement-breakpoint
CREATE UNIQUE INDEX "community_challenges_attribution_unique" ON "community_challenges" USING btree ("attribution_identifier");--> statement-breakpoint
CREATE INDEX "community_challenges_status_deadline_idx" ON "community_challenges" USING btree ("status","deadline_at");--> statement-breakpoint
CREATE UNIQUE INDEX "donation_refunds_external_id_unique" ON "donation_refunds" USING btree ("external_refund_id");--> statement-breakpoint
CREATE INDEX "donation_refunds_transaction_idx" ON "donation_refunds" USING btree ("external_transaction_id");--> statement-breakpoint
CREATE UNIQUE INDEX "donation_transactions_external_id_unique" ON "donation_transactions" USING btree ("external_transaction_id");--> statement-breakpoint
CREATE INDEX "donation_transactions_challenge_counted_idx" ON "donation_transactions" USING btree ("challenge_id","counts_toward_challenge");--> statement-breakpoint
INSERT INTO "community_challenges" (
	"id",
	"slug",
	"title",
	"opponent_event_name",
	"sport_event_type",
	"cta_language",
	"start_at",
	"deadline_at",
	"timezone",
	"meal_value_cents",
	"meal_goal",
	"status",
	"givebutter_destination_url",
	"attribution_identifier"
) VALUES (
	'8e907c87-82a7-49d1-a412-fd35b9fe2b77',
	'individual-giving',
	'Help provide meals to local families.',
	NULL,
	'individual-giving',
	'give',
	'2026-09-01T07:00:00.000Z',
	NULL,
	'America/Los_Angeles',
	228,
	NULL,
	'live',
	'https://givebutter.com/santa-clarita-valley-food-pantry/donate',
	'sports-against-hunger-individual-giving'
) ON CONFLICT DO NOTHING;
