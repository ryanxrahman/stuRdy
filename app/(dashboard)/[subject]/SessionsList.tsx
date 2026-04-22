"use client";

import { useTransition } from "react";
import { deleteSession } from "../dashboard/subject-actions";
import { Trash2 as TrashIcon, Clock as ClockIcon, Calendar as CalendarIcon } from "lucide-react";
import toast from "react-hot-toast";

interface Session {
    _id: string;
    duration: number;
    date: string;
}

export default function SessionsList({ initialSessions }: { initialSessions: Session[] }) {
    const [isPending, startTransition] = useTransition();

    const formatDuration = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        if (mins === 0) return `${secs}s`;
        return `${mins}m ${secs}s`;
    };

    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const handleDelete = (sessionId: string) => {
        if (!confirm("Are you sure you want to delete this session?")) return;

        startTransition(async () => {
            const result = await deleteSession(sessionId);
            if (result.success) {
                toast.success("Session deleted");
            } else {
                toast.error("Failed to delete");
            }
        });
    };

    return (
        <div className="flex flex-col gap-4">
            <div className="grid grid-cols-1 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3 mt-2">
                {initialSessions.length === 0 && (
                    <p className="opacity-50 italic text-xs col-span-full">No sessions recorded yet.</p>
                )}
                {[...initialSessions].reverse().map((session) => (
                    <div
                        key={session._id}
                        className="group relative bg-primary/5 border border-primary/20 rounded-xl flex sm:flex-col items-center sm:justify-center p-3 sm:p-4 text-left sm:text-center transition-all sm:aspect-square"
                    >
                        {/* Time/Date Content */}
                        <div className="flex-1 sm:flex-none flex flex-col sm:items-center">
                            <div className="text-[10px] sm:text-[10px] font-medium opacity-60 mb-0.5 leading-none">
                                {new Date(session.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                            </div>
                            <div className="text-[11px] sm:text-[18px] font-bold opacity-40 mb-1 leading-none">
                                {new Date(session.date).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true })}
                            </div>
                            <div className="text-sm sm:text-xs font-black text-primary leading-none mt-1 sm:mt-0">
                                {Math.floor(session.duration / 60) || 1}m
                            </div>
                        </div>

                        {/* Delete Button */}
                        <button
                            onClick={() => handleDelete(session._id)}
                            className="btn btn-square btn-ghost btn-sm sm:btn-xs text-error/70 hover:text-error transition-all sm:absolute sm:top-1 sm:right-1 sm:opacity-0 sm:group-hover:opacity-100"
                            disabled={isPending}
                        >
                            <TrashIcon size={14} className="sm:w-3 sm:h-3" />
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}
