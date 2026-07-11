import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { getDb } from "@/lib/mongodb";
import { getSession } from "@/lib/auth";
import { ObjectId } from "mongodb";



export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { currentPassword, newPassword } = await req.json();

    if (!currentPassword || !newPassword) {
      return NextResponse.json({ error: "Invalid data" }, { status: 400 });
    }

    // Here you would typically fetch the user's current password hash from your database
    // For demonstration purposes, let's assume we have a function `getUserPasswordHash` that does this
    const userPasswordHash = await getUserPasswordHash(session.userId);

    const isCurrentPasswordValid = await bcrypt.compare(currentPassword, userPasswordHash);
    console.log("Is current password valid:", isCurrentPasswordValid);
    if (!isCurrentPasswordValid) {
      return NextResponse.json({ error: "Current password is incorrect" }, { status: 400 });
    }

    const newHashedPassword = await bcrypt.hash(newPassword, 10);
    await updateUserPassword(session.userId, newHashedPassword);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("API Change password error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// Mock functions for demonstration purposes
async function getUserPasswordHash(userId: string): Promise<string> {


    const session = await getSession();
    if (!session) {
      throw new Error("Unauthorized");
    }
  // Replace this with actual database logic to fetch the user's password hash
  const db = await getDb();
  const user = await db.collection("users").findOne({ _id: new ObjectId(userId) });
  console.log("Fetched user from DB:", user);
  return user?.password|| "";
}

async function updateUserPassword(userId: string, newHashedPassword: string): Promise<void> {
    const session = await getSession();
    if (!session) {
      throw new Error("Unauthorized");
    }
    // Replace this with actual database logic to update the user's password
    const db = await getDb();
    await db.collection("users").updateOne({ _id: new ObjectId(userId) }, { $set: { password: newHashedPassword } });
    console.log(`Updated password for user ${userId} in DB.`);
  // Replace this with actual database logic to update the user's password
  console.log(`Updating password for user ${userId} to new hash: ${newHashedPassword}`);
}