"use client";

import { useState, useMemo } from "react";

type Session = {
    date: Date;
    duration: number;
}

export default function ContributionMap({ sessions }: { sessions: Session[] }) {
    const [hoveredDay, setHoveredDay] = useState<{ date: string, minutes: number } | null>(null);

    // Group sessions by date string
    const sessionMap = useMemo(() => {
        const map: Record<string, number> = {};
        sessions.forEach(s => {
            const d = new Date(s.date).toISOString().split('T')[0];
            map[d] = (map[d] || 0) + s.duration;
        });
        return map;
    }, [sessions]);

    // Generate last 365 days
    const days = useMemo(() => {
        const result = [];
        const today = new Date();
        for (let i = 365; i >= 0; i--) {
            const d = new Date(today);
            d.setDate(today.getDate() - i);
            const dateStr = d.toISOString().split('T')[0];
            const duration = sessionMap[dateStr] || 0;
            const minutes = Math.floor(duration / 60);
            result.push({ date: dateStr, minutes });
        }
        return result;
    }, [sessionMap]);

    // Group days into week columns (each week is up to 7 days) so we render columns left-to-right
    const weeks = useMemo(() => {
        const cols: { date: string; minutes: number }[][] = [];
        for (let i = 0; i < days.length; i += 7) {
            cols.push(days.slice(i, i + 7));
        }
        return cols;
    }, [days]);

    const getColor = (minutes: number) => {
        if (minutes === 0) return "bg-base-300 opacity-20";
        if (minutes < 30) return "bg-primary opacity-30";
        if (minutes < 60) return "bg-primary opacity-60";
        if (minutes < 120) return "bg-primary opacity-80";
        return "bg-primary opacity-100";
    };

    return (
        <div className="relative w-full overflow-hidden p-6 bg-base-200 rounded-[2.5rem] border border-base-300">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                Study Contributions
                <span className="text-xs font-normal opacity-50 font-mono tracking-tighter uppercase">(Last 365 Days)</span>
            </h3>

            <div className="flex gap-[6px] items-start">
                {weeks.map((week, wi) => (
                    <div key={wi} className="flex flex-col gap-[3px]">
                        {week.map((day) => (
                            <div
                                key={day.date}
                                className={`w-[12px] h-[12px] rounded-sm cursor-help transition-all hover:ring-2 hover:ring-primary/50 ${getColor(day.minutes)}`}
                                onMouseEnter={() => setHoveredDay(day)}
                                onMouseLeave={() => setHoveredDay(null)}
                            />
                        ))}
                    </div>
                ))}
            </div>

            {/* Tooltip */}
            {hoveredDay && (
                <div className="absolute top-4 right-8 bg-black text-white px-4 py-2 rounded-xl text-xs shadow-2xl animate-in fade-in zoom-in duration-200 z-10">
                    <p className="font-bold">{hoveredDay.minutes} min studied</p>
                    <p className="opacity-70">{new Date(hoveredDay.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
                </div>
            )}

            <div className="mt-4 flex items-center gap-2">
                <span className="text-[10px] opacity-40 uppercase font-bold tracking-widest">Less</span>
                <div className="flex gap-[3px]">
                    <div className="w-[10px] h-[10px] rounded-sm bg-base-300 opacity-20" />
                    <div className="w-[10px] h-[10px] rounded-sm bg-primary opacity-30" />
                    <div className="w-[10px] h-[10px] rounded-sm bg-primary opacity-60" />
                    <div className="w-[10px] h-[10px] rounded-sm bg-primary opacity-80" />
                    <div className="w-[10px] h-[10px] rounded-sm bg-primary opacity-100" />
                </div>
                <span className="text-[10px] opacity-40 uppercase font-bold tracking-widest">More</span>
            </div>
        </div>
    );
}
