"use client";

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

type Session = {
  date: string;
  duration: number;
  subjectId: string;
};

type StudyTrendProps = {
  sessions: Session[];
};

export default function StudyTrend({ sessions }: StudyTrendProps) {
  if (sessions.length === 0) {
    return (
      <div className="bg-base-200 rounded-4xl border border-base-300 p-8">
        <h2 className="text-xl font-bold mb-1">Study Trend</h2>
        <p className="text-xs opacity-40 mb-6 uppercase tracking-widest font-bold">Last 14 Days</p>
        <div className="flex flex-col items-center justify-center p-12 text-center opacity-40 italic h-80">
          No study sessions yet. Start your first timer!
        </div>
      </div>
    );
  }

  // Prepare data for chart - last 14 days
  const chartData: { date: string; minutes: number }[] = [];
  const last14Days: { [key: string]: number } = {};

  for (let i = 13; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateStr = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    last14Days[dateStr] = 0;
  }

  sessions.forEach(s => {
    const d = new Date(s.date);
    const dateStr = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    if (dateStr in last14Days) {
      last14Days[dateStr] += s.duration / 60;
    }
  });

  Object.entries(last14Days).forEach(([date, minutes]) => {
    chartData.push({ date, minutes: Math.round(minutes) });
  });

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const mins = payload[0].value;
      return (
        <div className="bg-black text-white px-4 py-2 rounded-xl text-sm shadow-2xl">
          <p className="opacity-80">{mins}m</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-base-200 rounded-4xl border border-base-300 p-8">
      <h2 className="text-xl font-bold mb-1">Study Trend</h2>
      <p className="text-xs opacity-40 mb-6 uppercase tracking-widest font-bold">Last 14 Days</p>
      <div className="w-full h-62.5">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="colorMinutes" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.15} />
            <XAxis 
              dataKey="date" 
              tick={{ fontSize: 12, opacity: 0.6 }}
              axisLine={false}
            />
            <YAxis 
              tick={{ fontSize: 12, opacity: 0.6 }}
              axisLine={false}
              label={{ value: 'Minutes', angle: -90, position: 'insideLeft' }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area 
              type="monotone" 
              dataKey="minutes" 
              stroke="#8b5cf6" 
              strokeWidth={2}
              fillOpacity={1} 
              fill="url(#colorMinutes)" 
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
