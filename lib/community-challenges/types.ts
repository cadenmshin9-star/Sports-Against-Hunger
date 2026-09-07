export type ChallengeStatus = "draft" | "live" | "ended" | "archived";
export type TrackingState = "connected" | "configuration_required" | "unavailable";

export interface PublicChallenge {
  id: string;
  slug: string;
  title: string;
  opponentEventName: string | null;
  sportEventType: string;
  ctaLanguage: string;
  startAt: string;
  deadlineAt: string | null;
  timezone: string;
  mealValueCents: number;
  mealGoal: number | null;
  status: ChallengeStatus;
  givebutterDestinationUrl: string;
  attributionIdentifier: string;
}

export interface ChallengeSnapshot {
  challenge: PublicChallenge;
  mealCount: number;
  grossDonationCents: number;
  refundedCents: number;
  netDonationCents: number;
  confirmedTransactionCount: number;
  trackingState: TrackingState;
  asOf: string;
}

export interface LinkAttribution {
  medium: string;
  content?: string;
}
