import { getDb } from "@/lib/mongodb";
import { getSession } from "@/lib/auth";
import { redirect, notFound } from "next/navigation";
import TodoList from "./TodoList";
import NotesSection from "./NotesSection";
import Timer from "./Timer";
import ProgressChart from "./ProgressChart";
import ExamsList from "./ExamsList";
import ExamChart from "./ExamChart";
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

  // Aggregate sessions by date for study chart
  const studyChartDataMap: Record<string, number> = {};
  rawSessions.forEach((s) => {
    const dateStr = new Date(s.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    studyChartDataMap[dateStr] = (studyChartDataMap[dateStr] || 0) + (s.duration / 60);
  });

  const studyChartData = Object.entries(studyChartDataMap).map(([date, minutes]) => ({
    date,
    minutes: Math.round(minutes)
  }));

  // Prepare exam chart data
  const examChartData = (subject.exams || []).map((e: any) => ({
    name: e.name,
    score: e.score
  }));

  return (
    <div className="flex flex-col min-h-screen p-8 max-w-6xl mx-auto gap-12">
      <header>
        <h1 className="text-6xl font-black tracking-tight">{subject.name}</h1>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column: Todo List */}
        <section className="bg-base-200 p-8 rounded-[2.5rem] border border-base-300 shadow-sm">
          <h2 className="text-2xl font-bold mb-6">Daily Quests</h2>
          <TodoList subjectId={subject._id.toString()} initialTodos={subject.todos || []} />
        </section>

        {/* Right Column: Notes */}
        <section className="bg-base-200 p-8 rounded-[2.5rem] border border-base-300 shadow-sm flex flex-col h-full min-h-[400px]">
          <h2 className="text-2xl font-bold mb-6">Subject Vault</h2>
          <NotesSection subjectId={subject._id.toString()} initialNotes={subject.notes || ""} />
        </section>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Exam Records */}
        <section className="bg-base-200 p-8 rounded-[2.5rem] border border-base-300 shadow-sm">
          <h2 className="text-2xl font-bold mb-6">Academic Records</h2>
          <ExamsList subjectId={subject._id.toString()} initialExams={subject.exams || []} />
        </section>

        {/* Timer Section */}
        <section className="bg-base-200 p-8 rounded-[2.5rem] border border-base-300 shadow-sm flex flex-col items-center justify-center">
          <h2 className="text-2xl font-bold mb-4">Focus Zone</h2>
          <Timer subjectId={subject._id.toString()} />
        </section>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Study Analytics */}
        <section className="bg-base-200 p-10 rounded-[2.5rem] border border-base-300 shadow-sm">
            <h2 className="text-2xl font-bold mb-2">Study Momentum</h2>
            <p className="opacity-50 text-sm mb-6">Time investment per day</p>
            <ProgressChart data={studyChartData} />
        </section>

        {/* Exam Analytics */}
        <section className="bg-base-200 p-10 rounded-[2.5rem] border border-base-300 shadow-sm">
            <h2 className="text-2xl font-bold mb-2">Grade Trajectory</h2>
            <p className="opacity-50 text-sm mb-6">Exam performance over time</p>
            <ExamChart data={examChartData} />
        </section>
      </div>
    </div>
  );
}
