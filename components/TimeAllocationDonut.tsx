"use client";

import { useMemo, useState } from 'react';
import { 
    PieChart, 
    Pie, 
    Cell, 
    Tooltip, 
    ResponsiveContainer
} from 'recharts';

type SubjectData = {
    name: string;
    minutes: number;
}

type EnrichedSubjectData = SubjectData & {
    percent: number;
    color: string;
    gradientId: string;
};

const COLORS = [
    '#8b5cf6', // purple
    '#06b6d4', // cyan
    '#10b981', // emerald
    '#f59e0b', // amber
    '#ef4444', // red
    '#ec4899', // pink
    '#6366f1', // indigo
    '#14b8a6', // teal
];

function formatMinutes(minutes: number) {
    if (minutes < 60) return `${minutes}m`;
    return `${(minutes / 60).toFixed(1)}h`;
}

type TooltipPayloadItem = {
    value: number;
    payload: EnrichedSubjectData;
};

type CustomTooltipProps = {
    active?: boolean;
    payload?: TooltipPayloadItem[];
};

export default function TimeAllocationDonut({ data }: { data: SubjectData[] }) {
    const [activeIndex, setActiveIndex] = useState<number | null>(null);
    const totalMinutes = data.reduce((acc, d) => acc + d.minutes, 0);

    if (data.length === 0 || totalMinutes === 0) {
        return (
            <div className="flex flex-col items-center justify-center p-12 text-center opacity-40 italic h-full">
                Start studying to see your time breakdown!
            </div>
        );
    }

    const enrichedData = useMemo(
        () => data
            .filter(d => d.minutes > 0)
            .map((d, i) => ({
                ...d,
                percent: Math.round((d.minutes / totalMinutes) * 100),
                color: COLORS[i % COLORS.length],
                gradientId: `donut-grad-${i}`,
            })),
        [data, totalMinutes]
    );

    const highlighted = activeIndex !== null ? enrichedData[activeIndex] : null;

    return (
        <div className="flex flex-col items-center gap-4">
            <div className="w-full h-65 min-h-65 relative rounded-3xl bg-linear-to-b from-base-100/70 to-transparent">
                <ResponsiveContainer width="99%" height="100%">
                    <PieChart>
                        <defs>
                            {enrichedData.map((item) => (
                                <linearGradient key={item.gradientId} id={item.gradientId} x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor={item.color} stopOpacity={1}/>
                                    <stop offset="100%" stopColor={item.color} stopOpacity={0.6}/>
                                </linearGradient>
                            ))}
                        </defs>
                        <Pie
                            data={enrichedData}
                            cx="50%"
                            cy="50%"
                            innerRadius={75}
                            outerRadius={110}
                            paddingAngle={4}
                            cornerRadius={6}
                            dataKey="minutes"
                            strokeWidth={0}
                            onMouseEnter={(_, index) => setActiveIndex(index)}
                            onMouseLeave={() => setActiveIndex(null)}
                            isAnimationActive
                            animationDuration={750}
                            animationEasing="ease-out"
                        >
                            {enrichedData.map((item, i) => (
                                <Cell
                                    key={item.gradientId}
                                    fill={`url(#${item.gradientId})`}
                                    style={{
                                        filter: activeIndex === i ? `drop-shadow(0 0 8px ${item.color}88)` : 'none',
                                        opacity: activeIndex === null || activeIndex === i ? 1 : 0.45,
                                        transition: 'filter 180ms ease-out',
                                    }}
                                />
                            ))}
                        </Pie>
                    </PieChart>
                </ResponsiveContainer>
                {/* Center label */}
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <p className="text-3xl font-black tabular-nums" style={{ color: highlighted?.color }}>
                        {highlighted ? formatMinutes(highlighted.minutes) : formatMinutes(totalMinutes)}
                    </p>
                    <p className="text-xs opacity-50 uppercase font-bold tracking-widest">
                        {highlighted ? highlighted.name : 'Total'}
                    </p>
                </div>
            </div>

            {/* Legend grid */}
            <div className="grid grid-cols-2 gap-2 w-full">
                {enrichedData.map((d, i) => (
                    <div
                        key={d.gradientId}
                        className={`flex items-center gap-2 text-xs rounded-xl px-2 py-1.5 transition-colors ${activeIndex === i ? 'bg-base-300/60' : ''}`}
                    >
                        <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: d.color }} />
                        <span className={`truncate font-medium ${activeIndex === i ? 'opacity-100' : 'opacity-70'}`}>{d.name}</span>
                        <span className={`ml-auto font-black ${activeIndex === i ? 'opacity-90' : 'opacity-50'}`}>{d.percent}%</span>
                    </div>
                ))}
            </div>
        </div>
    );
}
