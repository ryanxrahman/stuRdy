import { getDb } from "@/lib/mongodb";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { logoutAction } from "@/app/login/actions";
import AddSubjectForm from "./AddSubjectForm";
import Link from "next/link";
import { Trash2 } from "lucide-react";
import { deleteSubject } from "./subject-actions";

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
    <div className="flex flex-col">
      <div className="mb-12">
        <h1 className="text-4xl font-bold">Subjects</h1>
        <p className="opacity-70 text-lg">Manage your study subjects and tasks.</p>
      </div>
      
      <AddSubjectForm />

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
