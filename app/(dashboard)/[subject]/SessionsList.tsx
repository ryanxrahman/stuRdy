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

    const getSessionIntensity = (seconds: number) => {
        const mins = seconds / 60;
        if (mins < 10) return "bg-primary/5 text-primary border-primary/10";
        if (mins < 30) return "bg-primary/20 text-primary border-primary/20";
        if (mins < 60) return "bg-primary/40 text-primary border-primary/30";
        if (mins < 120) return "bg-primary/60 text-white border-primary/40";
        return "bg-primary/80 text-white border-primary/50";
    };

    return (
        <div className="flex flex-col gap-4">
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3 mt-2">
                {initialSessions.length === 0 && (
                    <p className="opacity-50 italic text-xs col-span-full">No sessions recorded yet.</p>
                )}
                {[...initialSessions].reverse().map((session) => (
                    <div
                        key={session._id}
                        className={`group relative border rounded-xl flex sm:flex-col items-center sm:justify-center p-3 sm:p-4 text-left sm:text-center transition-all sm:aspect-square ${getSessionIntensity(session.duration)}`}
                    >
                        {/* Time/Date Content */}
                        <div className="flex-1 sm:flex-none flex flex-col sm:items-center">
                            <div className="text-[10px] sm:text-xs font-medium opacity-70 mb-0.5 leading-none">
                                {new Date(session.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                            </div>
                            <div className="text-[11px] sm:text-sm font-bold opacity-60 mb-1 leading-none">
                                {new Date(session.date).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true })}
                            </div>
                            <div className={`text-sm sm:text-4xl font-black leading-none mt-1 sm:mt-0 ${session.duration >= 3600 ? 'text-white' : 'text-primary'}`}>
                                {Math.floor(session.duration / 60) || 1}m
                            </div>
                        </div>

                        {/* Delete Button */}
                        <button
                            onClick={() => handleDelete(session._id)}
                            className={`btn btn-square btn-ghost btn-sm sm:btn-xs transition-all sm:absolute sm:top-1 sm:right-1 sm:opacity-0 sm:group-hover:opacity-100 ${session.duration >= 3600 ? 'text-white/70 hover:text-white' : 'text-error/70 hover:text-error'}`}
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
