"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { buildGivebutterDonationUrl } from "@/lib/community-challenges/links";
import type {
  ChallengeSnapshot,
  LinkAttribution,
} from "@/lib/community-challenges/types";
import styles from "./give.module.css";

type GiveExperienceProps = {
  initialSnapshot: ChallengeSnapshot;
  linkAttribution: LinkAttribution;
};

const mealChoices = [5, 10, 20];

export default function GiveExperience({
  initialSnapshot,
  linkAttribution,
}: GiveExperienceProps) {
  const [snapshot, setSnapshot] = useState(initialSnapshot);
  const [counterBump, setCounterBump] = useState(false);
  const previousMealCount = useRef(initialSnapshot.mealCount);
  const bumpTimeout = useRef<number | null>(null);

  useEffect(() => {
    let active = true;

    const refresh = async () => {
      try {
        const response = await fetch(
          `/api/challenges/${encodeURIComponent(initialSnapshot.challenge.slug)}`,
          { cache: "no-store" },
        );
        if (!response.ok) return;

        const next = (await response.json()) as ChallengeSnapshot;
        if (!active) return;

        if (next.mealCount > previousMealCount.current) {
          if (bumpTimeout.current !== null) {
            window.clearTimeout(bumpTimeout.current);
          }
          setCounterBump(true);
          bumpTimeout.current = window.setTimeout(() => {
            setCounterBump(false);
            bumpTimeout.current = null;
          }, 500);
        }

        previousMealCount.current = next.mealCount;
        setSnapshot(next);
      } catch {
        // Preserve the last confirmed total through transient network errors.
      }
    };

    const refreshTimer = window.setInterval(refresh, 10_000);
    return () => {
      active = false;
      window.clearInterval(refreshTimer);
      if (bumpTimeout.current !== null) {
        window.clearTimeout(bumpTimeout.current);
      }
    };
  }, [initialSnapshot.challenge.slug]);

  const { challenge } = snapshot;
  const quickActions = mealChoices.map((meals) => {
    const amountCents = meals * challenge.mealValueCents;
    return {
      meals,
      amountCents,
      url: buildGivebutterDonationUrl(
        challenge,
        {
          ...linkAttribution,
          content: linkAttribution.content ?? `give-${meals}-meals`,
        },
        amountCents,
      ),
    };
  });
  const customUrl = buildGivebutterDonationUrl(challenge, {
    ...linkAttribution,
    content: linkAttribution.content ?? "give-custom",
  });

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <div className={styles.container}>
          <Link
            className={styles.brand}
            href="/"
            aria-label="Sports Against Hunger home"
          >
            <Image
              alt=""
              height={42}
              priority
              src="/sports-against-hunger-emblem.webp"
              width={42}
            />
            <span>Sports Against Hunger</span>
          </Link>
          <span className={styles.pageLabel}>Individual giving</span>
        </div>
      </header>

      <section className={`${styles.hero} ${styles.container}`}>
        <div className={styles.introduction}>
          <span className={styles.eyebrow}>Give directly. See the impact.</span>
          <h1>{challenge.title}</h1>
          <p>
            Individual donations support the Santa Clarita Valley Food Pantry.
            Choose a meal amount below, then complete your gift securely through
            Givebutter.
          </p>
        </div>

        <div className={styles.impactCard}>
          <div className={styles.impactHeading}>
            <span>Verified community impact</span>
            <span
              className={`${styles.status} ${
                snapshot.trackingState === "connected" ? styles.connected : ""
              }`}
            >
              {snapshot.trackingState === "connected"
                ? "Tracking active"
                : "Setup in progress"}
            </span>
          </div>

          <div className={`${styles.total} ${counterBump ? styles.totalBump : ""}`}>
            <strong aria-hidden="true">
              {snapshot.mealCount.toLocaleString("en-US")}
            </strong>
            <span>meals funded</span>
            <span className={styles.srOnly} aria-live="polite">
              Verified community total: {snapshot.mealCount.toLocaleString("en-US")} meals.
            </span>
          </div>

          <div className={styles.impactMeta}>
            <span>
              {snapshot.confirmedTransactionCount.toLocaleString("en-US")} confirmed{" "}
              {snapshot.confirmedTransactionCount === 1 ? "gift" : "gifts"}
            </span>
            <span>Updated automatically</span>
          </div>

          {snapshot.trackingState !== "connected" && (
            <p className={styles.connectionNotice} role="status">
              {snapshot.trackingState === "unavailable"
                ? "The verified total is temporarily unavailable. Donation links remain available."
                : "The live total will begin updating after the secure database and Givebutter webhook are connected."}
            </p>
          )}
        </div>
      </section>

      <section className={styles.givingSection} aria-labelledby="give-title">
        <div className={styles.container}>
          <div className={styles.sectionHeading}>
            <div>
              <span className={styles.eyebrow}>Choose an amount</span>
              <h2 id="give-title">How many meals would you like to give?</h2>
            </div>
            <p>
              For this tracker, every ${(challenge.mealValueCents / 100).toFixed(2)} in
              net attributed donations counts as one whole meal.
            </p>
          </div>

          <div className={styles.actionGrid}>
            {quickActions.map(({ meals, amountCents, url }) => (
              <a className={styles.action} href={url} key={meals}>
                <strong>{meals} meals</strong>
                <span>${(amountCents / 100).toFixed(2)}</span>
                <small>Donate on Givebutter <b aria-hidden="true">↗</b></small>
              </a>
            ))}
            <a className={`${styles.action} ${styles.customAction}`} href={customUrl}>
              <strong>Custom gift</strong>
              <span>Choose an amount</span>
              <small>Donate on Givebutter <b aria-hidden="true">↗</b></small>
            </a>
          </div>

          <div className={styles.trustPanel}>
            <Image
              alt="Santa Clarita Valley Food Pantry"
              height={58}
              src="/scv-food-pantry-logo.jpg"
              width={82}
            />
            <p>
              <strong>Donations are made directly to SCV Food Pantry.</strong>{" "}
              Givebutter processes the payment and provides the tax receipt. Sports
              Against Hunger never receives card details or holds donated funds.
            </p>
          </div>
        </div>
      </section>

      <section className={`${styles.trackingSection} ${styles.container}`}>
        <div>
          <span className={styles.eyebrow}>Transparent tracking</span>
          <h2>What the public total includes</h2>
        </div>
        <ul>
          <li>Completed gifts made through Sports Against Hunger donation links.</li>
          <li>Refunds are deducted before the meal total is calculated.</li>
          <li>The tracker stores transaction facts, not donor names or contact details.</li>
        </ul>
      </section>

      <footer className={styles.footer}>
        <div className={styles.container}>
          <span>Sports Against Hunger</span>
          <Link href="/">Back to the main site</Link>
        </div>
      </footer>
    </main>
  );
}
