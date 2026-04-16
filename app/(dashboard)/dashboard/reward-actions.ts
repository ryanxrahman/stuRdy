"use server";

import { getDb } from "@/lib/mongodb";
import { getSession } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { ObjectId } from "mongodb";

export interface RewardLevel {
  id: string;
  targetHours: number;
  reward: string;
}

export async function getRewardLevels() {
  const session = await getSession();
  if (!session) return { error: "Unauthorized", data: null };

  try {
    const db = await getDb();
    
    const user = await db.collection("users").findOne({ _id: new ObjectId(session.userId) });
    if (!user) return { error: "User not found", data: null };

    const rewardLevels = user.rewardLevels || [];
    return { success: true, data: rewardLevels };
  } catch (error) {
    console.error("Get reward levels error:", error);
    return { error: "Failed to fetch reward levels", data: null };
  }
}

export async function addRewardLevel(targetHours: number, reward: string) {
  const session = await getSession();
  if (!session) return { error: "Unauthorized" };

  if (!targetHours || targetHours <= 0) return { error: "Invalid hours" };
  if (!reward || !reward.trim()) return { error: "Reward description is required" };

  try {
    const db = await getDb();
    const rewardId = `reward-${Date.now()}`;

    await db.collection("users").updateOne(
      { _id: new ObjectId(session.userId) },
      {
        $push: {
          rewardLevels: {
            id: rewardId,
            targetHours,
            reward: reward.trim(),
            createdAt: new Date(),
          },
        } as any,
      }
    );

    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    console.error("Add reward level error:", error);
    return { error: "Failed to add reward level" };
  }
}

export async function updateRewardLevel(id: string, targetHours: number, reward: string) {
  const session = await getSession();
  if (!session) return { error: "Unauthorized" };

  if (!targetHours || targetHours <= 0) return { error: "Invalid hours" };
  if (!reward || !reward.trim()) return { error: "Reward description is required" };

  try {
    const db = await getDb();

    await db.collection("users").updateOne(
      { _id: new ObjectId(session.userId), "rewardLevels.id": id },
      {
        $set: {
          "rewardLevels.$[elem].targetHours": targetHours,
          "rewardLevels.$[elem].reward": reward.trim(),
          "rewardLevels.$[elem].updatedAt": new Date(),
        },
      },
      { arrayFilters: [{ "elem.id": id }] } as any
    );

    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    console.error("Update reward level error:", error);
    return { error: "Failed to update reward level" };
  }
}

export async function deleteRewardLevel(id: string) {
  const session = await getSession();
  if (!session) return { error: "Unauthorized" };

  try {
    const db = await getDb();

    await db.collection("users").updateOne(
      { _id: new ObjectId(session.userId) },
      { $pull: { rewardLevels: { id } } as any }
    );

    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    console.error("Delete reward level error:", error);
    return { error: "Failed to delete reward level" };
  }
}
