import { getDb } from "@/lib/mongodb";
import { getSession } from "@/lib/auth";
import Link from "next/link";
import { logoutAction } from "@/app/login/actions";
import { LayoutDashboard, BookOpen, LogOut } from "lucide-react";
import SidebarLink from "./SidebarLink";
import { ThemeToggle } from "./ThemeToggle";

export default async function Sidebar() {
    const session = await getSession();
    if (!session) return null;

    const db = await getDb();
    const subjects = await db.collection("subjects")
        .find({ userId: session.userId })
        .sort({ name: 1 })
        .toArray();

    return (
        <aside className="fixed bg-base-100 left-0 top-0 h-screen w-64 text-base-content border-r border-base-300 flex flex-col z-50">
            <div className="p-6">
                <Link href="/dashboard" className="text-2xl font-black hover:text-primary transition-colors">STUDY</Link>
            </div>

            <nav className="flex-1 overflow-y-auto px-4 py-2">
                <div className="text-xs font-bold opacity-30 uppercase tracking-widest mb-4 px-2">Subjects</div>
                <div className="flex flex-col gap-1">
                    <SidebarLink 
                        href="/dashboard"
                        className="flex items-center gap-3 p-3 rounded-xl hover:bg-base-200 transition-colors text-sm font-medium"
                    >
                        <LayoutDashboard size={18} className="opacity-70" />
                        Dashboard
                    </SidebarLink>
                    {subjects.map((sub) => (
                        <SidebarLink 
                            key={sub._id.toString()} 
                            href={`/${encodeURIComponent(sub.name)}`}
                            className="flex items-center gap-3 p-3 rounded-xl hover:bg-base-200 transition-colors text-sm font-medium truncate"
                        >
                            <BookOpen size={18} className="opacity-70" />
                            {sub.name}
                        </SidebarLink>
                    ))}
                </div>
            </nav>

            <div className="p-4 bg-base-200 mt-auto">
                <div className="flex flex-col gap-2">
                    <ThemeToggle />
                    <div className="px-2">
                        <p className="text-xs opacity-50 truncate">Logged in as</p>
                        <p className="text-sm font-bold truncate">{session.email}</p>
                    </div>
                    <form action={logoutAction} className="w-full">
                        <button type="submit" className="btn btn-error btn-outline btn-sm w-full rounded-xl flex items-center justify-center gap-2">
                            <LogOut size={14} />
                            Logout
                        </button>
                    </form>
                </div>
            </div>
        </aside>
    );
}
