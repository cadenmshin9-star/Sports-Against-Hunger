/**
 * Givebutter's `amount` is the amount the donor chose to donate. We count that
 * field—not `fee`, `fee_covered`, `donated`, or `payout`—so processing fees and
 * fee-coverage add-ons never become public meal impact.
 *
 * Givebutter represents webhook money in major currency units. Convert it once
 * at the boundary and keep integer cents everywhere else.
 */
export function parseGivebutterAmountToCents(value: unknown) {
  if (typeof value === "number") {
    if (!Number.isFinite(value) || value < 0) return null;
    return parseGivebutterAmountToCents(String(value));
  }

  if (typeof value !== "string") return null;

  const normalized = value.trim().replace(/^\$/, "").replaceAll(",", "");
  const match = /^(\d+)(?:\.(\d{1,2}))?$/.exec(normalized);
  if (!match) return null;

  const dollars = Number.parseInt(match[1], 10);
  const cents = Number.parseInt((match[2] ?? "").padEnd(2, "0"), 10) || 0;
  const total = dollars * 100 + cents;

  return Number.isSafeInteger(total) ? total : null;
}

export function calculateMealCount(netDonationCents: number, mealValueCents: number) {
  if (
    !Number.isSafeInteger(netDonationCents) ||
    !Number.isSafeInteger(mealValueCents) ||
    netDonationCents < 0 ||
    mealValueCents <= 0
  ) {
    return 0;
  }

  // Aggregate first, then round down. Two $1.14 gifts correctly equal one meal.
  return Math.floor(netDonationCents / mealValueCents);
}
