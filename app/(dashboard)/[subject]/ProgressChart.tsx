"use client";

import { useMemo } from "react";
import {
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Area,
    AreaChart,
    Line,
    LineChart,
} from 'recharts';

type SingleSeriesData = {
    date: string;
    minutes: number;
}

type Session = {
    date: string;
    duration: number;
    subjectId: string;
};

type Subject = {
    _id: string;
    name: string;
};

type Series = {
    key: string;
    id: string;
    name: string;
    color: string;
    isActive: boolean;
};

type MultiSeriesChartRow = {
    date: string;
} & Record<string, string | number>;

const LIGHT_COLORS = ["#93c5fd", "#a7f3d0", "#fcd34d", "#f9a8d4", "#c4b5fd", "#fdba74", "#99f6e4", "#fda4af"];

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-base-300 p-4 rounded-2xl border border-base-100 shadow-2xl backdrop-blur-md">
                <p className="text-[10px] uppercase tracking-widest font-bold opacity-50 mb-1">{label}</p>
                <div className="flex items-end gap-2">
                    <span className="text-2xl font-black text-primary leading-none">
                        {payload[0].value}
                    </span>
                    <span className="text-[10px] font-bold opacity-40 pb-1">MINUTES</span>
                </div>
            </div>
        );
    }
    return null;
};

const MultiSeriesTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload?.length) return null;

    const items = payload
        .filter((item: any) => typeof item.value === "number" && (item.value ?? 0) > 0)
        .sort((a: any, b: any) => (b.value ?? 0) - (a.value ?? 0));

    return (
        <div className="bg-base-300 p-4 rounded-2xl border border-base-100 shadow-2xl backdrop-blur-md min-w-48">
            <p className="text-[10px] uppercase tracking-widest font-bold opacity-50 mb-2">{label}</p>
            {items.length > 0 ? (
                <div className="space-y-1.5">
                    {items.map((item: any) => (
                        <div key={`${item.name}-${item.value}`} className="flex items-center justify-between gap-4 text-sm">
                            <div className="flex items-center gap-2 overflow-hidden">
                                <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                                <span className="truncate">{item.name}</span>
                            </div>
                            <span className="font-bold shrink-0">{Math.round(item.value ?? 0)}m</span>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-sm opacity-50">No study sessions</p>
            )}
        </div>
    );
};

export default function ProgressChart(props: {
    data?: SingleSeriesData[];
    sessions?: Session[];
    subjects?: Subject[];
    activeSubjectId?: string;
}) {
    const multiSeriesChart = useMemo(() => {
        if (!props.sessions || !props.subjects || !props.activeSubjectId) {
            return null;
        }

        const subjectNameById = new Map(props.subjects.map((subject) => [subject._id, subject.name]));
        const totalsBySubjectId: Record<string, number> = {};
        const minutesByDateAndSubject: Record<string, Record<string, number>> = {};
        const dateKeys = new Set<string>();

        props.sessions.forEach((session) => {
            const sessionDate = new Date(session.date);
            const dateKey = sessionDate.toISOString().slice(0, 10);
            const subjectId = String(session.subjectId);

            if (!subjectNameById.has(subjectId)) return;

            dateKeys.add(dateKey);
            minutesByDateAndSubject[dateKey] ||= {};

            const minutes = Math.max(0, Math.round((session.duration || 0) / 60));
            minutesByDateAndSubject[dateKey][subjectId] = (minutesByDateAndSubject[dateKey][subjectId] || 0) + minutes;
            totalsBySubjectId[subjectId] = (totalsBySubjectId[subjectId] || 0) + minutes;
        });

        const series = props.subjects
            .filter((subject) => (totalsBySubjectId[subject._id] || 0) > 0)
            .map((subject, index) => ({
                key: `subject_${subject._id}`,
                id: subject._id,
                name: subjectNameById.get(subject._id) || subject.name,
                color: subject._id === props.activeSubjectId ? "#111827" : LIGHT_COLORS[index % LIGHT_COLORS.length],
                isActive: subject._id === props.activeSubjectId,
            }))
            .sort((a, b) => {
                if (a.isActive === b.isActive) return 0;
                return a.isActive ? -1 : 1;
            });

        const chartData = Array.from(dateKeys)
            .sort((a, b) => new Date(a).getTime() - new Date(b).getTime())
            .map((dateKey) => {
                const label = new Date(dateKey).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                });

                const row: MultiSeriesChartRow = { date: label };
                series.forEach((seriesItem) => {
                    row[seriesItem.key] = minutesByDateAndSubject[dateKey]?.[seriesItem.id] || 0;
                });
                return row;
            });

        return { chartData, series };
    }, [props.activeSubjectId, props.sessions, props.subjects]);

    if (multiSeriesChart) {
        const { chartData, series } = multiSeriesChart;

        if (series.length === 0) {
            return (
                <div className="flex flex-col items-center justify-center p-12 text-center opacity-40 italic">
                    No subject study data yet. Start a session to see all subjects here.
                </div>
            );
        }

        return (
            <div className="w-full h-80 mt-4">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 25 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.12} />
                        <XAxis
                            dataKey="date"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#6b7280', fontSize: 11, fontWeight: 500 }}
                            dy={10}
                        />
                        <YAxis
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#6b7280', fontSize: 11 }}
                            width={28}
                        />
                        <Tooltip content={<MultiSeriesTooltip />} />
                        {series.map((seriesItem) => (
                            <Line
                                key={seriesItem.key}
                                type="monotone"
                                dataKey={seriesItem.key}
                                name={seriesItem.name}
                                stroke={seriesItem.color}
                                strokeWidth={seriesItem.isActive ? 4 : 2.5}
                                strokeOpacity={seriesItem.isActive ? 1 : 0.55}
                                dot={{ r: seriesItem.isActive ? 4 : 3, fill: seriesItem.color, strokeWidth: 0 }}
                                activeDot={{ r: 6, strokeWidth: 0 }}
                                connectNulls
                            />
                        ))}
                    </LineChart>
                </ResponsiveContainer>
            </div>
        );
    }

    const data = props.data || [];

    if (data.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center p-12 text-center opacity-40 italic">
                No session data yet. Start studying to see your progress!
            </div>
        );
    }

    return (
        <div className="w-full h-75 mt-4">
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 25 }}>
                    <defs>
                        <linearGradient id="colorPrimary" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="var(--p, #3b82f6)" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="var(--p, #3b82f6)" stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <XAxis
                        dataKey="date"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: '#6b7280', fontSize: 11, fontWeight: 500 }}
                        dy={10}
                    />
                    <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: '#6b7280', fontSize: 11 }}
                        hide
                    />
                    <Tooltip
                        content={<CustomTooltip />}
                        cursor={{ stroke: 'var(--p)', strokeWidth: 1, strokeDasharray: '5 5' }}
                    />
                    <Area
                        type="monotone"
                        dataKey="minutes"
                        stroke="var(--p, #3b82f6)"
                        strokeWidth={4}
                        fillOpacity={1}
                        fill="url(#colorPrimary)"
                        animationDuration={1500}
                        dot={{ r: 4, fill: 'var(--p)', strokeWidth: 2, stroke: '#1f2937' }}
                        activeDot={{ r: 6, strokeWidth: 0 }}
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
}
