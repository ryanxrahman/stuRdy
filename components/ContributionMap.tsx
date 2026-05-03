"use client";

import { useState, useMemo, useEffect } from "react";

type Session = {
    date: Date;
    duration: number;
}

export default function ContributionMap({ sessions }: { sessions: Session[] }) {
    const [hoveredDay, setHoveredDay] = useState<{ date: string, minutes: number } | null>(null);
    const [isSmallScreen, setIsSmallScreen] = useState(false);

    useEffect(() => {
        const handleResize = () => setIsSmallScreen(window.innerWidth < 768);
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Group sessions by date string
    const sessionMap = useMemo(() => {
        const map: Record<string, number> = {};
        sessions.forEach(s => {
            const d = new Date(s.date).toISOString().split('T')[0];
            map[d] = (map[d] || 0) + s.duration;
        });
        return map;
    }, [sessions]);

    // Generate last 365 days (desktop) or last 60 days (mobile)
    const daysToShow = isSmallScreen ? 365 : 365;
    const days = useMemo(() => {
        const result = [];
        const today = new Date();
        for (let i = daysToShow; i >= 0; i--) {
            const d = new Date(today);
            d.setDate(today.getDate() - i);
            const dateStr = d.toISOString().split('T')[0];
            const duration = sessionMap[dateStr] || 0;
            const minutes = Math.floor(duration / 60);
            result.push({ date: dateStr, minutes });
        }
        return result;
    }, [sessionMap, daysToShow]);

    // Group days into week columns (each week is up to 7 days) so we render columns left-to-right
    const weeks = useMemo(() => {
        const cols: { date: string; minutes: number }[][] = [];
        for (let i = 0; i < days.length; i += 7) {
            cols.push(days.slice(i, i + 7));
        }
        return cols;
    }, [days]);

    const getColor = (minutes: number) => {
        if (minutes === 0) return "bg-gray-500 opacity-20";
        if (minutes < 30) return "bg-success opacity-30";
        if (minutes < 60) return "bg-success opacity-60";
        if (minutes < 120) return "bg-success opacity-80";
        return "bg-success opacity-100";
    };

    // Responsive box sizing
    const boxSize = isSmallScreen ? "w-2 h-2" : "w-3 h-3";
    const gap = isSmallScreen ? "gap-0.5" : "gap-1";

    return (
        <div className="relative w-full bg-base-200 rounded-4xl border border-base-300">
            <div className="p-6 md:p-8">
                <h3 className="text-xl font-bold mb-4 md:mb-6 flex flex-col items-start gap-1">
                    Study Contributions
                    <span className="text-xs font-normal opacity-50 font-mono tracking-tighter uppercase">(Last {isSmallScreen ? '365' : '365'} Days)</span>
                </h3>

                <div className="overflow-x-auto pb-2">
                    <div className={`flex ${gap} items-start min-w-max`}>
                        {weeks.map((week, wi) => (
                            <div key={wi} className={`flex flex-col ${gap}`}>
                                {week.map((day) => (
                                    <div
                                        key={day.date}
                                        className={`${boxSize} rounded-sm cursor-help transition-all hover:ring-2 hover:ring-primary/50 ${getColor(day.minutes)}`}
                                        onMouseEnter={() => setHoveredDay(day)}
                                        onMouseLeave={() => setHoveredDay(null)}
                                    />
                                ))}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Tooltip */}
                {hoveredDay && (
                    <div className="absolute top-16 md:top-20 right-4 md:right-8 bg-base-300 border border-base-100 rounded-2xl shadow-2xl z-50 flex flex-col p-3 text-base-content text-xs">
                        <p className="font-bold">{hoveredDay.minutes} min studied</p>
                        <p className="opacity-70 text-[10px]">{new Date(hoveredDay.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                    </div>
                )}

                <div className="mt-4 md:mt-6 flex items-center gap-2 text-xs">
                    <span className="text-[10px] opacity-40 uppercase font-bold tracking-widest">Less</span>
                    <div className={`flex ${gap}`}>
                        <div className="w-2 h-2 rounded-sm bg-gray-500 opacity-20" />
                        <div className="w-2 h-2 rounded-sm bg-success opacity-30" />
                        <div className="w-2 h-2 rounded-sm bg-success opacity-60" />
                        <div className="w-2 h-2 rounded-sm bg-success opacity-80" />
                        <div className="w-2 h-2 rounded-sm bg-success opacity-100" />
                    </div>
                    <span className="text-[10px] opacity-40 uppercase font-bold tracking-widest">More</span>
                </div>
            </div>
        </div>
    );
}
