import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import { getSession } from "@/lib/auth";
import { ObjectId } from "mongodb";

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { subjectId, duration } = await req.json();

    if (!subjectId || !duration || duration <= 0) {
      return NextResponse.json({ error: "Invalid data" }, { status: 400 });
    }

    const db = await getDb();
    await db.collection("sessions").insertOne({
      subjectId: new ObjectId(subjectId),
      userId: session.userId,
      duration: Number(duration),
      date: new Date(),
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("API Save session error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
