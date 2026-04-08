"use client";

import { 
    PieChart, 
    Pie, 
    Cell, 
    Tooltip, 
    ResponsiveContainer,
    Legend
} from 'recharts';

type SubjectData = {
    name: string;
    minutes: number;
}

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

const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-black text-white px-4 py-2 rounded-xl text-sm shadow-2xl">
                <p className="font-bold">{payload[0].name}</p>
                <p className="opacity-80">{formatMinutes(payload[0].value)} studied</p>
                <p className="opacity-50">{payload[0].payload.percent}% of total</p>
            </div>
        );
    }
    return null;
};

export default function TimeAllocationDonut({ data }: { data: SubjectData[] }) {
    const totalMinutes = data.reduce((acc, d) => acc + d.minutes, 0);

    if (data.length === 0 || totalMinutes === 0) {
        return (
            <div className="flex flex-col items-center justify-center p-12 text-center opacity-40 italic h-full">
                Start studying to see your time breakdown!
            </div>
        );
    }

    const enrichedData = data
        .filter(d => d.minutes > 0)
        .map(d => ({
            ...d,
            percent: Math.round((d.minutes / totalMinutes) * 100)
        }));

    return (
        <div className="flex flex-col items-center gap-4">
            <div className="w-full h-[260px] relative">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <defs>
                            {enrichedData.map((_, i) => (
                                <linearGradient key={i} id={`donut-grad-${i}`} x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor={COLORS[i % COLORS.length]} stopOpacity={1}/>
                                    <stop offset="100%" stopColor={COLORS[i % COLORS.length]} stopOpacity={0.6}/>
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
                        >
                            {enrichedData.map((_, i) => (
                                <Cell key={i} fill={`url(#donut-grad-${i})`} />
                            ))}
                        </Pie>
                        <Tooltip content={<CustomTooltip />} />
                    </PieChart>
                </ResponsiveContainer>
                {/* Center label */}
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <p className="text-3xl font-black tabular-nums">{formatMinutes(totalMinutes)}</p>
                    <p className="text-xs opacity-40 uppercase font-bold tracking-widest">Total</p>
                </div>
            </div>

            {/* Legend grid */}
            <div className="grid grid-cols-2 gap-2 w-full">
                {enrichedData.map((d, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs">
                        <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                        <span className="truncate opacity-70 font-medium">{d.name}</span>
                        <span className="ml-auto font-black opacity-50">{d.percent}%</span>
                    </div>
                ))}
            </div>
        </div>
    );
}
