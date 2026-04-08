"use server";

import { getDb } from "@/lib/mongodb";
import { getSession } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { ObjectId } from "mongodb";

export async function createSubject(prevState: any, formData: FormData) {
  const session = await getSession();
  if (!session) return { error: "Unauthorized" };

  const name = formData.get("name") as string;
  if (!name) return { error: "Subject name is required" };

  try {
    const db = await getDb();
    
    // Check if subject exists for this user
    const existing = await db.collection("subjects").findOne({ 
      userId: session.userId,
      name: { $regex: new RegExp(`^${name}$`, "i") }
    });

    if (existing) return { error: "Subject already exists" };

    await db.collection("subjects").insertOne({
      userId: session.userId,
      name,
      todos: [],
      notes: "",
      createdAt: new Date(),
    });

    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    console.error("Create subject error:", error);
    return { error: "Failed to create subject" };
  }
}

export async function addTodo(subjectId: string, text: string) {
  const session = await getSession();
  if (!session) return { error: "Unauthorized" };

  try {
    const db = await getDb();
    const todoId = new ObjectId().toString();
    
    await db.collection("subjects").updateOne(
      { _id: new ObjectId(subjectId), userId: session.userId },
      { $push: { todos: { id: todoId, text: text, completed: false, createdAt: new Date() } } as any }
    );

    revalidatePath("/[subject]");
    return { success: true };
  } catch (error) {
    return { error: "Failed to add todo" };
  }
}

export async function toggleTodo(subjectId: string, todoId: string, completed: boolean) {
  const session = await getSession();
  if (!session) return { error: "Unauthorized" };

  try {
    const db = await getDb();
    await db.collection("subjects").updateOne(
      { _id: new ObjectId(subjectId), userId: session.userId, "todos.id": todoId },
      { $set: { "todos.$.completed": completed } }
    );

    revalidatePath("/[subject]");
    return { success: true };
  } catch (error) {
    return { error: "Failed to toggle todo" };
  }
}

export async function saveNotes(subjectId: string, notes: string) {
  const session = await getSession();
  if (!session) return { error: "Unauthorized" };

  try {
    const db = await getDb();
    await db.collection("subjects").updateOne(
      { _id: new ObjectId(subjectId), userId: session.userId },
      { $set: { notes, updatedAt: new Date() } }
    );

    revalidatePath("/[subject]");
    return { success: true };
  } catch (error) {
    return { error: "Failed to save notes" };
  }
}

export async function deleteSubject(subjectId: string) {
  const session = await getSession();
  if (!session) return { error: "Unauthorized" };

  try {
    const db = await getDb();
    await db.collection("subjects").deleteOne({
      _id: new ObjectId(subjectId),
      userId: session.userId,
    });

    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    return { error: "Failed to delete subject" };
  }
}

export async function deleteTodoAction(subjectId: string, todoId: string) {
  const session = await getSession();
  if (!session) return { error: "Unauthorized" };

  try {
    const db = await getDb();
    await db.collection("subjects").updateOne(
      { _id: new ObjectId(subjectId), userId: session.userId },
      { $pull: { todos: { id: todoId } } as any }
    );

    revalidatePath("/[subject]");
    return { success: true };
  } catch (error) {
    return { error: "Failed to delete todo" };
  }
}
