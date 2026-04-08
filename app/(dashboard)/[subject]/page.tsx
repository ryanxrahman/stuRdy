import { getDb } from "@/lib/mongodb";
import { getSession } from "@/lib/auth";
import { redirect, notFound } from "next/navigation";
import TodoList from "./TodoList";
import NotesSection from "./NotesSection";

export default async function SubjectPage({ params }: { params: Promise<{ subject: string }> }) {
  const { subject: subjectNameEncoded } = await params;
  const subjectName = decodeURIComponent(subjectNameEncoded);
  const session = await getSession();

  if (!session) {
    redirect("/login");
  }

  const db = await getDb();
  const subject = await db.collection("subjects").findOne({
    userId: session.userId,
    name: { $regex: new RegExp(`^${subjectName}$`, "i") }
  });

  if (!subject) {
    notFound();
  }

  return (
    <div className="flex flex-col">
      <header className="mb-8">
        <h1 className="text-5xl font-black">{subject.name}</h1>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column: Todo List */}
        <section className="bg-base-200 p-6 rounded-3xl border border-base-300">
          <h2 className="text-2xl font-bold mb-6">Tasks</h2>
          <TodoList subjectId={subject._id.toString()} initialTodos={subject.todos || []} />
        </section>

        {/* Right Column: Notes */}
        <section className="bg-base-200 p-6 rounded-3xl border border-base-300 flex flex-col h-full min-h-[400px]">
          <h2 className="text-2xl font-bold mb-6">Notes</h2>
          <NotesSection subjectId={subject._id.toString()} initialNotes={subject.notes || ""} />
        </section>
      </div>
    </div>
  );
}
