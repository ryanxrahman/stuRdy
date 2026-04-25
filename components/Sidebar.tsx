"use client";

import { useMemo, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { logoutAction } from "@/app/login/actions";
import { LayoutDashboard, BookOpen, LogOut, Plus, X } from "lucide-react";
import SidebarLink from "./SidebarLink";
import { ThemeToggle } from "./ThemeToggle";
import SidebarRoulette from "./SidebarRoulette";
import Image from "next/image";
import AddSubjectForm from "@/app/(dashboard)/dashboard/AddSubjectForm";

type Subject = {
    _id: string;
    name: string;
    totalMinutes?: number;
};

export default function Sidebar({ subjects = [], user }: { subjects?: Subject[], user?: { email?: string } | null | Record<string, unknown> }) {
    const isValidSubject = (sub: Subject): sub is Subject & { _id: { toString(): string } | string; name: string } => {
        return Boolean(sub?._id) && typeof sub?.name === "string";
    };

    const validSubjects = useMemo(() => {
        return subjects
            .filter(isValidSubject)
            .sort((a, b) => (b.totalMinutes || 0) - (a.totalMinutes || 0));
    }, [subjects]);

    const maxMinutes = useMemo(() => {
        return Math.max(...validSubjects.map(s => s.totalMinutes || 0), 1);
    }, [validSubjects]);

    const [isAddOpen, setIsAddOpen] = useState(false);
    const rouletteSubjects = useMemo(
        () =>
            validSubjects.map((s) => ({
                _id: s._id.toString(),
                name: s.name,
            })),
        [validSubjects]
    );

    const userEmail = typeof user?.email === "string" ? user.email : "Unknown user";

    return (
        <>
            <aside className="bg-base-200/50 backdrop-blur-xl h-screen w-64 text-base-content border-r border-base-content/5 flex flex-col">
                <div className="p-6 flex items-center border-b border-base-content/5 mb-8">
                    <Image src="/icon.png" alt="Logo" width={32} height={32} className="inline-block mr-2" />
                    <Link href="/dashboard" className="text-2xl font-black hover:text-primary transition-colors">Study</Link>
                </div>

                <nav className="flex-1 overflow-y-auto px-4 py-2">
                    <div className="text-x flex items-center justify-between font-bold opacity-30 uppercase tracking-widest mb-4 px-2">
                        <p>
                            sidebar
                        </p>
                        <button
                            type="button"
                            onClick={() => setIsAddOpen(true)}
                            className="btn btn-xs btn-ghost btn-circle"
                            aria-label="Add subject"
                            title="Add subject"
                        >
                            <Plus size={14} />
                        </button>
                    </div>
                    <div className="flex flex-col gap-1">
                        <SidebarLink
                            href="/dashboard"
                            className="flex items-center gap-3 p-3 rounded-xl hover:bg-base-200 transition-colors text-sm font-medium"
                        >
                            <LayoutDashboard size={18} className="opacity-70" />
                            Dashboard
                        </SidebarLink>
                        {validSubjects.map((sub) => {
                            const progress = ((sub.totalMinutes || 0) / maxMinutes) * 100;
                            return (
                                <SidebarLink
                                    key={sub._id.toString()}
                                    href={`/${encodeURIComponent(sub.name)}`}
                                    className="relative flex items-center gap-3 p-3 rounded-xl hover:bg-base-content/5 transition-all text-sm font-medium truncate overflow-hidden group/link"
                                >
                                    {/* Progress Bar Background */}
                                    {progress > 0 && (
                                        <div
                                            className="absolute inset-y-0 left-0 bg-gradient-to-r from-violet-500/10 via-primary/5 to-emerald-500/5 transition-all duration-1000 ease-out border-r border-violet-500/10"
                                            style={{ width: `${progress}%` }}
                                        />
                                    )}

                                    <div className="relative flex items-center gap-3 w-full">
                                        <BookOpen size={18} className="opacity-70 shrink-0" />
                                        <span className="truncate flex-1">{sub.name}</span>
                                        {sub.totalMinutes !== undefined && sub.totalMinutes > 0 && (
                                            <span className="text-[10px] opacity-30 group-hover/link:opacity-100 transition-opacity font-mono tracking-tighter bg-base-content/5 px-1.5 rounded">
                                                {sub.totalMinutes < 60 ? `${sub.totalMinutes}m` : `${(sub.totalMinutes / 60).toFixed(1)}h`}
                                            </span>
                                        )}
                                    </div>
                                </SidebarLink>
                            );
                        })}
                    </div>
                </nav>

                <div className="p-4 bg-base-200 mt-auto border-t border-base-content/5">
                    <div className="flex flex-col gap-4">
                        <div className="border max-md:hidden space-y-2 text-xs border-base-content/5 rounded-xl p-3 bg-base-300/30">
                            <h1 className="font-bold opacity-50 uppercase tracking-widest text-[10px]">Shortcuts</h1>
                            <p><span className="bg-base-content/10 font-mono px-1 rounded">A</span> to add a subject</p>
                            <p><span className="bg-base-content/10 font-mono px-1 rounded">S</span> to open start popup</p>
                            <p><span className="bg-base-content/10 font-mono px-1 rounded">D</span> to toggle theme</p>
                        </div>

                        <ThemeToggle />

                        <div className="px-1 overflow-hidden">
                            <p className="text-[10px] opacity-40 uppercase tracking-widest font-bold">Logged in as</p>
                            <p className="text-xs font-bold truncate">{userEmail}</p>
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
            {isAddOpen && typeof window !== "undefined" && createPortal(
                <div
                    className="fixed inset-0 z-50 bg-black/40 backdrop-blur-[1px] flex items-center justify-center p-4"
                    onClick={() => setIsAddOpen(false)}
                >
                    <div
                        className="bg-base-100 p-6 rounded-2xl border border-base-300 w-full max-w-lg"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-bold text-lg">Add Subject</h3>
                            <button
                                type="button"
                                className="btn btn-sm btn-ghost btn-circle"
                                onClick={() => setIsAddOpen(false)}
                                aria-label="Close add subject popup"
                            >
                                <X size={16} />
                            </button>
                        </div>
                        <AddSubjectForm />
                    </div>
                </div>,
                document.body
            )}
        </>
    );
}