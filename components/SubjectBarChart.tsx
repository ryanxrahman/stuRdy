"use client";

import { 
    BarChart, 
    Bar, 
    XAxis, 
    YAxis, 
    CartesianGrid, 
    Tooltip, 
    ResponsiveContainer,
    Cell
} from 'recharts';

type SubjectData = {
    name: string;
    minutes: number;
}

const COLORS = ['#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#ef4444', '#ec4899', '#6366f1', '#14b8a6'];

const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
        const mins = payload[0].value;
        return (
            <div className="bg-black text-white px-4 py-2 rounded-xl text-sm shadow-2xl">
                <p className="font-bold">{payload[0].payload.name}</p>
                <p className="opacity-80">{mins < 60 ? `${mins}m` : `${(mins/60).toFixed(1)}h`}</p>
            </div>
        );
    }
    return null;
};

export default function SubjectBarChart({ data }: { data: SubjectData[] }) {
    if (data.length === 0) return (
        <div className="flex flex-col items-center justify-center p-12 text-center opacity-40 italic h-full">
            No study sessions yet. Start your first timer!
        </div>
    );

    const sorted = [...data].sort((a, b) => b.minutes - a.minutes);

    return (
        <div className="w-full h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={sorted} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#374151" opacity={0.15} />
                    <XAxis 
                        type="number" 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fill: '#6b7280', fontSize: 11 }}
                        tickFormatter={(v) => v < 60 ? `${v}m` : `${Math.round(v/60)}h`}
                    />
                    <YAxis 
                        type="category" 
                        dataKey="name" 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fill: '#6b7280', fontSize: 12, fontWeight: 'bold' }}
                        width={80}
                    />
                    <Tooltip content={<CustomTooltip />} cursor={{ fill: '#ffffff08' }} />
                    <Bar dataKey="minutes" radius={[0, 8, 8, 0]} maxBarSize={28}>
                        {sorted.map((_, i) => (
                            <Cell key={i} fill={COLORS[i % COLORS.length]} />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}
