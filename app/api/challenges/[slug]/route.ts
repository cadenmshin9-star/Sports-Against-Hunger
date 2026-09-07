import { getChallengeSnapshotBySlug } from "@/db/challenges";

export const dynamic = "force-dynamic";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  if (!/^[a-z0-9-]{1,160}$/.test(slug)) {
    return Response.json({ error: "not_found" }, { status: 404 });
  }

  const snapshot = await getChallengeSnapshotBySlug(slug);
  if (!snapshot) return Response.json({ error: "not_found" }, { status: 404 });

  return Response.json(snapshot, {
    headers: {
      "Cache-Control": "public, max-age=0, s-maxage=5, stale-while-revalidate=15",
    },
  });
}
