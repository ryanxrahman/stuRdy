import { getDb } from "@/lib/mongodb";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const email = searchParams.get("email");

  if (!email) {
    return new Response(JSON.stringify({ error: "Email required" }), { status: 400, headers: { "Content-Type": "application/json" } });
  }

  try {
    const db = await getDb();

    const user = await db.collection("users").findOne({ email });
    if (!user) {
      return Response.json([]);
    }

    // userId is stored as a string in sessions, not ObjectId
    const userId = user._id.toString();

    const contributions = await db
      .collection("sessions")
      .find({ userId: userId })
      .sort({ date: -1 })
      .toArray();

    const safeData = contributions.map(c => ({
      date: c.date instanceof Date ? c.date.toISOString() : c.date,
      duration: c.duration || 0,
    }));

    return Response.json(safeData);
  } catch (e) {
    console.error("Contribution API error:", e);
    return new Response(JSON.stringify({ error: "Internal Server Error", details: e instanceof Error ? e.message : "Unknown error" }), { status: 500, headers: { "Content-Type": "application/json" } });
  }
}