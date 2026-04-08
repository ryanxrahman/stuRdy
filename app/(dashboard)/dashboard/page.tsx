import { getDb } from "@/lib/mongodb";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { logoutAction } from "@/app/login/actions";
import AddSubjectForm from "./AddSubjectForm";
import Link from "next/link";
import { Trash2 } from "lucide-react";
import { deleteSubject } from "./subject-actions";
import ContributionMap from "@/components/ContributionMap";

export default async function Dashboard() {
  const session = await getSession();

  if (!session) {
    redirect("/login");
  }

  const db = await getDb();
  const subjects = await db.collection("subjects")
    .find({ userId: session.userId })
    .sort({ createdAt: -1 })
    .toArray();

  // Fetch all sessions for contribution map and serialize for Client Component
  const rawSessions = await db.collection("sessions")
    .find({ userId: session.userId })
    .sort({ date: 1 })
    .toArray();

  const sessions = rawSessions.map(s => ({
    date: s.date.toISOString(),
    duration: s.duration
  }));

  return (
    <div className="flex flex-col gap-10 p-8 max-w-6xl mx-auto">
      <header>
        <h1 className="text-6xl font-black italic tracking-tighter">Command Center</h1>
        <p className="opacity-50 text-sm mt-2">Track. Execute. Dominate.</p>
      </header>

      <section>
        <ContributionMap sessions={sessions} />
      </section>

      <div className="bg-base-200 p-8 rounded-[2.5rem] border border-base-300">
        <h2 className="text-2xl font-bold mb-6">New Subject</h2>
        <AddSubjectForm />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {subjects.length === 0 ? (
          <p className="col-span-full text-center opacity-50 py-12 border-2 border-dashed border-base-300 rounded-3xl">
            No subjects yet. Add one above to get started!
          </p>
        ) : (
          subjects.map((sub) => (
            <div key={sub._id.toString()} className="group relative">
                <Link 
                href={`/${encodeURIComponent(sub.name)}`}
                className="block p-6 bg-base-200 border border-base-300 rounded-3xl hover:border-primary transition-all active:scale-95 shadow-sm hover:shadow-md"
                >
                    <h3 className="text-xl font-bold group-hover:text-primary transition-colors">{sub.name}</h3>
                    <p className="text-xs opacity-50 mt-2">
                        {sub.todos?.length || 0} tasks • Click to open
                    </p>
                </Link>
                
                <form 
                    action={async () => {
                        "use server";
                        await deleteSubject(sub._id.toString());
                    }} 
                    className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                    <button 
                        type="submit" 
                        className="btn btn-ghost btn-circle btn-xs text-error hover:bg-error/10"
                        title="Delete Subject"
                    >
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
