"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

type Session = {
  date: string;
  duration: number;
};

type SubjectMiniChartProps = {
  sessions: Session[];
  subjectName: string;
};

export default function SubjectMiniChart({ sessions, subjectName }: SubjectMiniChartProps) {
  if (sessions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-6 text-center opacity-40 text-sm italic h-40">
        No study sessions yet
      </div>
    );
  }

  // Prepare data for chart - last 7 days
  const chartData: { date: string; minutes: number }[] = [];
  const last7Days: { [key: string]: number } = {};

  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateStr = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    last7Days[dateStr] = 0;
  }

  sessions.forEach(s => {
    const d = new Date(s.date);
    const dateStr = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    if (dateStr in last7Days) {
      last7Days[dateStr] += s.duration / 60;
    }
  });

  Object.entries(last7Days).forEach(([date, minutes]) => {
    chartData.push({ date, minutes: Math.round(minutes) });
  });

  const maxMinutes = Math.max(...chartData.map(d => d.minutes), 1);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const mins = payload[0].value;
      return (
        <div className="bg-black text-white px-3 py-1 rounded-lg text-xs shadow-lg">
          <p>{mins}m</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full h-40 -ml-8">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} vertical={false} />
          <XAxis 
            dataKey="date" 
            tick={{ fontSize: 11, opacity: 0.5 }}
            axisLine={false}
          />
          <YAxis 
            tick={{ fontSize: 11, opacity: 0.5 }}
            axisLine={false}
            domain={[0, Math.ceil(maxMinutes / 10) * 10]}
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="minutes" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
