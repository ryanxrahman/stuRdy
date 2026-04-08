import { getDb } from "@/lib/mongodb";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { logoutAction } from "../login/actions";
import AddSubjectForm from "./AddSubjectForm";
import Link from "next/link";

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

  return (
    <div className="flex flex-col items-center min-h-screen p-8">
      <header className="flex justify-between items-center w-full max-w-4xl mb-12">
        <div>
          <h1 className="text-4xl font-bold">Dashboard</h1>
          <p className="opacity-70 text-lg">Logged in as {session.email}</p>
        </div>
        <form action={logoutAction}>
          <button type="submit" className="btn btn-outline btn-error btn-sm">
            Logout
          </button>
        </form>
      </header>
      
      <AddSubjectForm />

      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {subjects.length === 0 ? (
          <p className="col-span-full text-center opacity-50 py-12 border-2 border-dashed border-base-300 rounded-3xl">
            No subjects yet. Add one above to get started!
          </p>
        ) : (
          subjects.map((sub) => (
            <Link 
              key={sub._id.toString()} 
              href={`/${encodeURIComponent(sub.name)}`}
              className="group p-6 bg-base-200 border border-base-300 rounded-2xl hover:border-primary transition-all active:scale-95"
            >
              <h3 className="text-xl font-bold group-hover:text-primary transition-colors">{sub.name}</h3>
              <p className="text-xs opacity-50 mt-2">
                {sub.todos?.length || 0} tasks • Click to open
              </p>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
