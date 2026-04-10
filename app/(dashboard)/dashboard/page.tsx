import { getDb } from "@/lib/mongodb";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import AddSubjectForm from "./AddSubjectForm";
import Link from "next/link";
import { Trash2, Flame, Clock, BookMarked, Trophy } from "lucide-react";
import { deleteSubject } from "./subject-actions";
import ContributionMap from "@/components/ContributionMap";
import SubjectMasteryRadar from "@/components/SubjectMasteryRadar";
import TimeAllocationDonut from "@/components/TimeAllocationDonut";
import SubjectBarChart from "@/components/SubjectBarChart";
import StudyGoal from "@/components/StudyGoal";

export default async function Dashboard() {
  const session = await getSession();

  if (!session) {
    redirect("/login");
  }

  const db = await getDb();
  const rawSubjects = await db.collection("subjects")
    .find({ userId: session.userId })
    .sort({ createdAt: -1 })
    .toArray();
  const subjects = JSON.parse(JSON.stringify(rawSubjects));

  const rawSessions = await db.collection("sessions")
    .find({ userId: session.userId })
    .sort({ date: 1 })
    .toArray();
  const sessions = JSON.parse(JSON.stringify(rawSessions));

  // Filter sessions for TODAY only for the Daily Mission
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const dailyStudyMinutes = sessions
    .filter((s: any) => new Date(s.date) >= today)
    .reduce((acc: number, s: any) => acc + (s.duration / 60), 0);

  // Advanced metrics
  const subjectStats = subjects.map((sub: any) => {
    const subSessions = sessions.filter((s: any) => s.subjectId === sub._id);
    const totalSeconds = subSessions.reduce((acc: number, s: any) => acc + s.duration, 0);
    const totalMinutes = totalSeconds / 60;
    const completedTodos = sub.todos?.filter((t: any) => t.completed).length || 0;
    const totalTodos = sub.todos?.length || 0;
    
    // Mastery score calculation:
    // Use raw seconds for better precision
    // 1 hour = 3600 seconds
    const studyHours = totalSeconds / 3600;
    
    // Scale it up: 100 points per hour
    let timeScore = studyHours * 100;
    
    // Task bonus: up to 50 points
    const taskBonus = (totalTodos > 0 ? (completedTodos / totalTodos) : 0) * 50;
    
    const masteryScore = Math.round(timeScore + taskBonus);

    return {
      name: sub.name,
      minutes: Math.round(totalMinutes),
      mastery: Math.max(masteryScore, 2),
    };
  });

  const totalStudyMinutes = subjectStats.reduce((acc: number, s: any) => acc + s.minutes, 0);
  const totalSubjects = subjects.length;
  const totalTasks = subjects.reduce((acc: number, s: any) => acc + (s.todos?.length || 0), 0);
  const totalSessions = sessions.length;

  return (
    <div className="flex flex-col gap-10 p-8 max-w-6xl mx-auto pb-20 ">
      {/* Header */}
      <header className="flex flex-col gap-1">
        <h1 className="text-6xl font-black italic tracking-tighter">Command Center</h1>
        <p className="opacity-50 text-sm">Track. Execute. Dominate.</p>
      </header>



      {/* Quick Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { icon: Clock, label: "Total Study", value: totalStudyMinutes < 60 ? `${totalStudyMinutes}m` : `${(totalStudyMinutes/60).toFixed(1)}h`, color: "text-violet-400" },
          { icon: BookMarked, label: "Subjects", value: totalSubjects, color: "text-cyan-400" },
          { icon: Trophy, label: "Tasks", value: totalTasks, color: "text-emerald-400" },
          { icon: Flame, label: "Sessions", value: totalSessions, color: "text-amber-400" },
        ].map(({ icon: Icon, label, value, color }) => (
          <div key={label} className="bg-base-200 rounded-3xl border border-base-300 p-5 flex items-center gap-4">
            <div className={`${color} opacity-80`}>
              <Icon size={24} />
            </div>
            <div>
              <p className="text-xl font-black">{value}</p>
              <p className="text-xs opacity-40 font-bold uppercase tracking-widest">{label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Contribution Heatmap */}
      <section>
        <ContributionMap sessions={sessions} />
      </section>

      {/* Analytics Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-base-200 rounded-4xl border border-base-300 p-8">
          <h2 className="text-xl font-bold mb-1">Time Split</h2>
          <p className="text-xs opacity-40 mb-6 uppercase tracking-widest font-bold">By Subject</p>
          <TimeAllocationDonut data={subjectStats} />
        </div>

        <div className="bg-base-200 rounded-4xl border border-base-300 p-8">
          <h2 className="text-xl font-bold mb-1">Mastery Radar</h2>
          <p className="text-xs opacity-40 mb-6 uppercase tracking-widest font-bold">Skill Balance</p>
          <SubjectMasteryRadar data={subjectStats} />
        </div>
      </div>

      {/* Subject Leaderboard */}
      <div className="bg-base-200 rounded-4xl border border-base-300 p-8">
        <h2 className="text-xl font-bold mb-1">Study Leaderboard</h2>
        <p className="text-xs opacity-40 mb-6 uppercase tracking-widest font-bold">Ranked by time invested</p>
        <SubjectBarChart data={subjectStats} />
      </div>

                    {/* Daily Study Goal */}
      <StudyGoal totalStudyMinutes={Math.round(dailyStudyMinutes)} />

      <div className="grid grid-cols-1 gap-8 mb-8">
        <div className="bg-base-200 rounded-4xl border border-base-300 p-8 shadow-sm">
          <h2 className="text-2xl font-bold mb-6">New Subject</h2>
          <AddSubjectForm />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {subjects.length === 0 ? (
          <p className="col-span-full text-center opacity-50 py-12 border-2 border-dashed border-base-300 rounded-3xl">
            No subjects yet. Add one above to get started!
          </p>
        ) : (
          subjects.map((sub: any) => (
            <div key={sub._id.toString()} className="group relative">
              <Link 
                href={`/${encodeURIComponent(sub.name)}`}
                className="block p-6 bg-base-200 border border-base-300 rounded-3xl hover:border-primary transition-all active:scale-95 shadow-sm hover:shadow-md"
              >
                <h3 className="text-xl font-bold group-hover:text-primary transition-colors">{sub.name}</h3>
                <p className="text-xs opacity-50 mt-2">
                  {sub.todos?.filter((t: any) => t.completed).length || 0}/{sub.todos?.length || 0} tasks done • Click to open
                </p>
              </Link>
              <form 
                action={async () => { "use server"; await deleteSubject(sub._id.toString()); }} 
                className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <button type="submit" className="btn btn-ghost btn-circle btn-xs text-error hover:bg-error/10" title="Delete Subject">
                  <Trash2 size={16} />
                </button>
              </form>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
