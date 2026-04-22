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

  const rawSubjects = await db.collection("subjects")
    .find({ userId: session.userId })
    .toArray();

  const rawSessions = await db.collection("sessions")
    .find({ userId: session.userId })
    .toArray();

  const subjects = JSON.parse(JSON.stringify(rawSubjects));
  const sessions = JSON.parse(JSON.stringify(rawSessions));

  const sidebarSubjects = subjects.map((subject: any) => {
    const subjectIdStr = subject._id;
    const totalSeconds = sessions
      .filter((s: any) => s.subjectId === subjectIdStr)
      .reduce((acc: number, s: any) => acc + (s.duration || 0), 0);
    
    return {
      _id: subjectIdStr,
      name: typeof subject.name === "string" ? subject.name : "Untitled",
      totalMinutes: Math.round(totalSeconds / 60),
    };
  });

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
