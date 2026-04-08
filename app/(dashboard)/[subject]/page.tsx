import { getDb } from "@/lib/mongodb";
import { getSession } from "@/lib/auth";
import { redirect, notFound } from "next/navigation";
import TodoList from "./TodoList";
import NotesSection from "./NotesSection";
import Timer from "./Timer";
import ProgressChart from "./ProgressChart";
import { ObjectId } from "mongodb";

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

  // Fetch session data for analytics
  const rawSessions = await db.collection("sessions")
    .find({ subjectId: subject._id, userId: session.userId })
    .sort({ date: 1 })
    .toArray();

  // Aggregate sessions by date
  const chartDataMap: Record<string, number> = {};
  rawSessions.forEach((s) => {
    const dateStr = new Date(s.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    chartDataMap[dateStr] = (chartDataMap[dateStr] || 0) + (s.duration / 60); // convert to minutes
  });

  const chartData = Object.entries(chartDataMap).map(([date, minutes]) => ({
    date,
    minutes: Math.round(minutes)
  }));

  return (
    <div className="flex flex-col min-h-screen p-8 max-w-5xl mx-auto gap-8">
      <header>
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

      {/* Timer Section */}
      <section className="bg-base-200 p-8 rounded-3xl border border-base-300">
        <h2 className="text-2xl font-bold mb-4">Study Timer</h2>
        <Timer subjectId={subject._id.toString()} />
      </section>

      {/* Analytics Section */}
      <section className="bg-base-200 p-8 rounded-3xl border border-base-300">
        <h2 className="text-2xl font-bold mb-4">Study Consistency</h2>
        <p className="opacity-50 text-sm mb-6">Daily study duration in minutes</p>
        <ProgressChart data={chartData} />
      </section>
    </div>
  );
}
