import Sidebar from "@/components/Sidebar";
import SidebarMobile from "@/components/SidebarMobile";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getDb } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  if (!session) {
    redirect("/login");
  }

  const db = await getDb();

  const user = ObjectId.isValid(session.userId)
    ? await db.collection("users").findOne({ _id: new ObjectId(session.userId) })
    : await db.collection("users").findOne({ email: session.email });

  const subjects = await db.collection("subjects")
    .find({ userId: session.userId })
    .sort({ name: 1 })
    .toArray();

  const sidebarSubjects = subjects.map((subject) => ({
    _id: subject._id.toString(),
    name: typeof subject.name === "string" ? subject.name : "Untitled",
  }));

  const sidebarUser = {
    email: typeof user?.email === "string" ? user.email : session.email,
  };

  return (
    <div className="flex min-h-screen bg-base-100">
      <SidebarMobile>
        <Sidebar subjects={sidebarSubjects} user={sidebarUser} />
      </SidebarMobile>
      <main className="flex-1 lg:ml-64 p-4 lg:p-8 w-full overflow-x-hidden pt-20 lg:pt-8">
        <div className="max-w-6xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
