"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type MiniTooltipProps = {
  active?: boolean;
  payload?: Array<{ value?: number }>;
};

function MiniTooltip({ active, payload }: MiniTooltipProps) {
  if (active && payload && payload.length) {
    const mins = payload[0].value ?? 0;
    return (
      <div className="bg-black text-white px-3 py-1 rounded-lg text-xs shadow-lg">
        <p>{Math.round(mins)}m</p>
      </div>
    );
  }

  return null;
}

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
      <div className="flex flex-col items-center justify-center p-3 text-center opacity-40 text-xs italic h-16">
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
  const chartGradientId = `subject-mini-${subjectName.replace(/[^a-zA-Z0-9]/g, "-").toLowerCase()}`;

  return (
    <div className="w-full h-20 -ml-2">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData} margin={{ top: 6, right: 4, left: -22, bottom: 0 }}>
          <defs>
            <linearGradient id={chartGradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.4} />
              <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.05} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} vertical={false} />
          <XAxis dataKey="date" hide axisLine={false} tickLine={false} />
          <YAxis 
            hide
            axisLine={false}
            tickLine={false}
            domain={[0, Math.ceil(maxMinutes / 10) * 10]}
          />
          <Tooltip content={<MiniTooltip />} />
          <Area
            type="monotone"
            dataKey="minutes"
            stroke="#8b5cf6"
            fill={`url(#${chartGradientId})`}
            strokeWidth={2}
            activeDot={{ r: 3 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
