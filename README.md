# Sports Against Hunger

The `/give` route is an evergreen individual-donation page for Sports Against
Hunger. Donors choose a meal amount, complete the donation directly on the Santa
Clarita Valley Food Pantry's Givebutter Giving Hub, and return to a public total
that reflects verified attributed gifts after refunds.

The page deliberately has no game, opponent, countdown, or fixed goal. The data
model keeps optional event fields so future campaigns can be introduced without
changing the transaction ledger.

## What is implemented

- `/give`: public individual-giving experience with 5-, 10-, 20-meal, and custom
  donation links
- `/api/challenges/[slug]`: cache-aware public aggregate used for live refreshes
- `/api/webhooks/givebutter`: authenticated ingestion for
  `transaction.succeeded` and `refund.created`
- Postgres/Drizzle ledger with unique external transaction and refund IDs
- aggregate-first meal calculation using integer cents
- defensive UTM parsing that only counts confident Sports Against Hunger
  attribution
- a visible configuration-required state until the database and webhook are
  connected

## Tracking contract

All generated donation links use:

```text
utm_source=sports_against_hunger
utm_campaign=sports-against-hunger-individual-giving
utm_medium=<channel>
utm_content=<placement or selected amount>
```

The public total counts a transaction only when all of these are true:

- the event is `transaction.succeeded`
- the transaction is in USD and has a positive donor-selected `amount`
- `utm_source` exactly matches `sports_against_hunger`
- `utm_campaign` matches a configured giving record
- the UTM payload has no conflicting source or campaign values
- the transaction occurred on or after the record's start time and, when an
  optional deadline exists, on or before that deadline

The tracker uses Givebutter's `amount` field. It does not substitute fee,
fee-covered, donated, or payout fields, so processing fees never become meal
impact. Money is converted to integer cents at the webhook boundary. Refunds are
capped at their original transaction amount when calculating totals.

```text
net cents = sum(counted transaction amount) - sum(applicable refunds)
meals = floor(net cents / meal value cents)
```

The current meal value is 228 cents. Amounts are aggregated before rounding, so
two attributed $1.14 gifts produce one meal.

## Privacy and security

The ledger stores only the minimum transaction facts needed for attribution,
idempotency, and refund reconciliation:

- external transaction/refund IDs
- giving-record ID
- amount, currency, status, and timestamps
- recognized UTM source, campaign, medium, and content
- a privacy-safe description of unrecognized UTM structure

It does not store donor names, email addresses, phone numbers, postal addresses,
payment details, comments, or raw webhook bodies. The Givebutter `Signature`
header is compared against a server-only secret using a timing-safe equality
check. Webhook bodies are limited to 1 MB and never returned or logged.

## Local setup

Prerequisites: Node.js 22.13 or later and a Postgres database. Neon works locally
and on Vercel through its serverless HTTP driver.

1. Copy `.env.example` to `.env.local`.
2. Set `DATABASE_URL` to a development Postgres connection string.
3. Set `GIVEBUTTER_WEBHOOK_SECRET` to a development-only fixture secret.
4. Apply the migration with `npm run db:migrate`.
5. Start the app with `npm run dev`.

Without either server variable, `/give` still renders and links directly to the
Pantry. Its total remains in the honest setup-in-progress state and the webhook
returns `503 webhook_not_configured` when the signing secret is absent.

## Fixture verification

With the local server and database running:

```bash
npm run fixture:givebutter -- transaction-succeeded http://localhost:3000
npm run fixture:givebutter -- transaction-succeeded http://localhost:3000
npm run fixture:givebutter -- refund-created http://localhost:3000
```

Expected behavior:

- the first transaction is inserted and adds 10 meals
- replaying it returns success as a duplicate and does not change the total
- the partial $4.56 refund reduces the total to 8 meals
- fixture `donated`, `fee`, `fee_covered`, `payout`, and refund `reason` values
  are not persisted

Run the static checks with:

```bash
npm run typecheck
npm run lint
npm run test:unit
npm run build:vercel
```

## Vercel deployment

1. Import the repository into Vercel.
2. Provision a Neon Postgres database from the Vercel Marketplace, or add an
   existing serverless Postgres `DATABASE_URL`.
3. Add `DATABASE_URL` to the Production and Preview environments as appropriate.
4. Run `npm run db:migrate` once against the production database.
5. Deploy. `vercel.json` uses the native Next.js production build.

Do not add `GIVEBUTTER_WEBHOOK_SECRET` until Givebutter has created the production
webhook and provided its per-webhook secret.

## Final SCV Food Pantry step

After the production URL and database are ready, the Pantry administrator only
needs to:

1. Create a Givebutter webhook pointing to
   `https://www.sportsagainsthunger.org/api/webhooks/givebutter`.
2. Enable exactly `transaction.succeeded` and `refund.created`.
3. Send the generated webhook secret through a secure channel.

Add that secret to Vercel as `GIVEBUTTER_WEBHOOK_SECRET` and redeploy. No
Givebutter API key and no donor-data export are required.
