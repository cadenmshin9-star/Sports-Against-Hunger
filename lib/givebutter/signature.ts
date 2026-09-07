import { createHash, timingSafeEqual } from "node:crypto";

export function verifyGivebutterSignature(received: string, expected: string) {
  const receivedDigest = createHash("sha256").update(received).digest();
  const expectedDigest = createHash("sha256").update(expected).digest();
  return timingSafeEqual(receivedDigest, expectedDigest);
}
