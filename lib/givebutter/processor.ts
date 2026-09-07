import { getChallengeByAttribution } from "@/db/challenges";
import {
  insertDonationRefund,
  insertDonationTransaction,
} from "@/db/webhook-ledger";
import type { CommunityChallenge } from "@/db/schema";
import { normalizeGivebutterUtm } from "./attribution";
import { parseGivebutterAmountToCents } from "./money";

export class WebhookPayloadError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "WebhookPayloadError";
  }
}

export interface WebhookProcessingResult {
  accepted: boolean;
  duplicate?: boolean;
  ignored?: boolean;
  reason?: string;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value && typeof value === "object" && !Array.isArray(value));
}

function readText(value: unknown, maximumLength: number) {
  if (typeof value === "string" || typeof value === "number") {
    const text = String(value).trim();
    if (text && text.length <= maximumLength) return text;
  }
  return undefined;
}

function requiredText(value: unknown, field: string, maximumLength = 191) {
  const text = readText(value, maximumLength);
  if (!text) throw new WebhookPayloadError(`Invalid ${field}.`);
  return text;
}

function optionalText(value: unknown, maximumLength = 191) {
  return readText(value, maximumLength);
}

function readDate(value: unknown) {
  if (typeof value !== "string" && typeof value !== "number") return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

function countDecision(
  challenge: CommunityChallenge,
  status: string,
  currency: string,
  amountCents: number,
  transactedAt: Date | null,
) {
  if (status !== "succeeded") return "transaction_not_succeeded";
  if (currency !== "USD") return "unsupported_currency";
  if (amountCents <= 0) return "nonpositive_amount";
  if (!transactedAt) return "missing_transaction_time";
  if (challenge.status === "draft" || challenge.status === "archived") {
    return "challenge_not_countable";
  }
  if (transactedAt < challenge.startAt) return "before_challenge_start";
  if (challenge.deadlineAt && transactedAt > challenge.deadlineAt) {
    return "after_challenge_deadline";
  }
  return null;
}

async function processTransaction(data: Record<string, unknown>) {
  const externalTransactionId = requiredText(data.id, "transaction id");
  const utm = normalizeGivebutterUtm(
    data.utm_parameters ?? data.utmParameters,
  );

  if (
    !utm.confident ||
    utm.source !== "sports_against_hunger" ||
    !utm.campaign
  ) {
    console.warn("Ignored a transaction with unrecognized SAH attribution.", {
      transactionId: externalTransactionId,
      utmShape: utm.shape,
      issues: utm.issues,
    });
    return {
      accepted: true,
      ignored: true,
      reason: "attribution_not_confident",
    } satisfies WebhookProcessingResult;
  }

  const challenge = await getChallengeByAttribution(utm.campaign);
  if (!challenge) {
    console.warn("Ignored a transaction for an unknown SAH challenge.", {
      transactionId: externalTransactionId,
      utmShape: utm.shape,
    });
    return {
      accepted: true,
      ignored: true,
      reason: "challenge_not_found",
    } satisfies WebhookProcessingResult;
  }

  // Intentionally do not fall back to `donated` or `payout`: those fields are
  // fee-adjusted and do not represent the donor-selected charitable amount.
  const donationAmountCents = parseGivebutterAmountToCents(data.amount);
  if (donationAmountCents === null) {
    throw new WebhookPayloadError("Invalid transaction amount.");
  }

  const status = requiredText(data.status ?? "succeeded", "transaction status", 40)
    .toLowerCase();
  const currency = requiredText(data.currency, "transaction currency", 3)
    .toUpperCase();
  const transactedAt = readDate(data.transacted_at ?? data.transactedAt ?? data.created_at);
  const exclusionReason = countDecision(
    challenge,
    status,
    currency,
    donationAmountCents,
    transactedAt,
  );

  const inserted = await insertDonationTransaction({
    challengeId: challenge.id,
    externalTransactionId,
    givebutterCampaignId: optionalText(data.campaign_id ?? data.campaignId),
    givebutterCampaignCode: optionalText(data.campaign_code ?? data.campaignCode),
    status,
    donationAmountCents,
    currency,
    transactedAt,
    countsTowardChallenge: exclusionReason === null,
    exclusionReason,
    utmSource: utm.source,
    utmCampaign: utm.campaign,
    utmMedium: optionalText(utm.medium),
    utmContent: optionalText(utm.content),
    utmShape: utm.shape,
  });

  return {
    accepted: true,
    duplicate: !inserted,
    reason: exclusionReason ?? undefined,
  } satisfies WebhookProcessingResult;
}

async function processRefund(data: Record<string, unknown>) {
  const externalRefundId = requiredText(data.id, "refund id");
  const externalTransactionId = requiredText(
    data.transaction_id ?? data.transactionId,
    "refunded transaction id",
  );
  const refundAmountCents = parseGivebutterAmountToCents(
    data.amount ?? data.refund_amount ?? data.refundAmount,
  );

  if (refundAmountCents === null || refundAmountCents <= 0) {
    throw new WebhookPayloadError("Invalid refund amount.");
  }

  const status = requiredText(data.status ?? "created", "refund status", 40)
    .toLowerCase();
  const inserted = await insertDonationRefund({
    externalRefundId,
    externalTransactionId,
    status,
    refundType: optionalText(data.refund_type ?? data.refundType ?? data.type, 80),
    refundAmountCents,
    refundedAt: readDate(data.created_at ?? data.createdAt ?? data.updated_at),
  });

  return {
    accepted: true,
    duplicate: !inserted,
  } satisfies WebhookProcessingResult;
}

export async function processGivebutterWebhook(payload: unknown) {
  if (!isRecord(payload)) throw new WebhookPayloadError("Webhook body must be an object.");

  const event = requiredText(
    payload.event ?? payload.event_type ?? payload.type,
    "event type",
    80,
  );
  if (!isRecord(payload.data)) throw new WebhookPayloadError("Webhook data must be an object.");

  if (event === "transaction.succeeded") return processTransaction(payload.data);
  if (event === "refund.created") return processRefund(payload.data);

  return {
    accepted: true,
    ignored: true,
    reason: "event_not_subscribed",
  } satisfies WebhookProcessingResult;
}
