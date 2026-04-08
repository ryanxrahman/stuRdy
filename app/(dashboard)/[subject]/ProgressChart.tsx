"use client";

import { 
    LineChart, 
    Line, 
    XAxis, 
    YAxis, 
    CartesianGrid, 
    Tooltip, 
    ResponsiveContainer, 
    Area, 
    AreaChart
} from 'recharts';

type SessionData = {
    date: string;
    minutes: number;
}

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
                <AreaChart data={data}>
                    <defs>
                        <linearGradient id="colorMinutes" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#6b7280" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="#6b7280" stopOpacity={0}/>
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#374151" opacity={0.2} />
                    <XAxis 
                        dataKey="date" 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fill: '#6b7280', fontSize: 12 }}
                        dy={10}
                    />
                    <YAxis 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fill: '#6b7280', fontSize: 12 }}
                        label={{ value: 'Minutes', angle: -90, position: 'insideLeft', fill: '#6b7280', fontSize: 12 }}
                    />
                    <Tooltip 
                        contentStyle={{ 
                            backgroundColor: '#1f2937', 
                            border: 'none', 
                            borderRadius: '12px',
                            color: '#fff'
                        }}
                    />
                    <Area 
                        type="monotone" 
                        dataKey="minutes" 
                        stroke="#6b7280" 
                        strokeWidth={3}
                        fillOpacity={1} 
                        fill="url(#colorMinutes)" 
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
}
