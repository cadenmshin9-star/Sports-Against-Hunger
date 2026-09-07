import { processGivebutterWebhook, WebhookPayloadError } from "@/lib/givebutter/processor";
import { verifyGivebutterSignature } from "@/lib/givebutter/signature";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const maximumBodyBytes = 1_000_000;

function json(body: Record<string, unknown>, status = 200) {
  return Response.json(body, {
    status,
    headers: { "Cache-Control": "no-store" },
  });
}

export async function POST(request: Request) {
  const secret = process.env.GIVEBUTTER_WEBHOOK_SECRET;
  if (!secret) {
    return json({ ok: false, error: "webhook_not_configured" }, 503);
  }

  const signature = request.headers.get("Signature");
  if (!signature || !verifyGivebutterSignature(signature, secret)) {
    return json({ ok: false, error: "unauthorized" }, 401);
  }

  const contentLength = Number(request.headers.get("content-length") ?? "0");
  if (Number.isFinite(contentLength) && contentLength > maximumBodyBytes) {
    return json({ ok: false, error: "payload_too_large" }, 413);
  }

  const rawBody = await request.text();
  if (Buffer.byteLength(rawBody, "utf8") > maximumBodyBytes) {
    return json({ ok: false, error: "payload_too_large" }, 413);
  }

  let payload: unknown;
  try {
    payload = JSON.parse(rawBody);
  } catch {
    return json({ ok: false, error: "invalid_json" }, 400);
  }

  try {
    const result = await processGivebutterWebhook(payload);
    return json({ ok: true, ...result });
  } catch (error) {
    if (error instanceof WebhookPayloadError) {
      return json({ ok: false, error: "invalid_payload" }, 422);
    }

    console.error("Givebutter webhook processing failed.", {
      error: error instanceof Error ? error.name : "UnknownError",
    });
    return json({ ok: false, error: "processing_failed" }, 500);
  }
}
