"use client";

import {
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Area,
    AreaChart,
    Stop
} from 'recharts';

type SessionData = {
    date: string;
    minutes: number;
}

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

export default function ProgressChart({ data }: { data: SessionData[] }) {
    if (data.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center p-12 text-center opacity-40 italic">
                No session data yet. Start studying to see your progress!
            </div>
        );
    }

    return (
        <div className="w-full h-[300px] mt-4">
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
