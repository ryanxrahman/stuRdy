"use client";

import { useMemo, useState } from "react";
import { ComposedChart, Area, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";

type Session = {
  date: string;
  duration: number;
  subjectId: string;
};

type Subject = {
  _id: string;
  name: string;
};

type StudyTrendProps = {
  sessions: Session[];
  subjects: Subject[];
};

type TooltipPayload = {
  value?: number;
};

type CustomTooltipProps = {
  active?: boolean;
  payload?: TooltipPayload[];
  label?: string;
  subjectsByDate?: Record<string, { name: string; minutes: number }[]>;
  subjectColors?: Record<string, string>;
};

function CustomTooltip({ active, payload, label, subjectsByDate, subjectColors }: CustomTooltipProps) {
  if (active && payload && payload.length) {
    const mins = payload.find((item) => item?.value !== undefined)?.value ?? 0;
    const subjects = (label && subjectsByDate?.[label]) || [];
    return (
      <div className="bg-base-300 border border-base-100 rounded-2xl shadow-2xl z-50 min-w-40 flex flex-col p-3">
        <p className="text-[10px] font-bold opacity-50 mb-2 uppercase border-b border-base-100 pb-1">
          {label || ""}
        </p>
        <div className="flex flex-col">
          {subjects.length > 0 ? (
            subjects.map((subject, i) => (
              <div key={subject.name} className="flex items-center text-base-content justify-between gap-4 text-xs mb-1 last:mb-0">
                <div className="flex items-center gap-1.5 overflow-hidden">
                  <div
                    className="w-2 h-2 rounded-full shrink-0"
                    style={{ backgroundColor: subjectColors?.[subject.name] || "#f08a6c" }}
                  />
                  <span className="font-medium truncate">{subject.name}</span>
                </div>
                <span className="font-bold shrink-0">{subject.minutes}m</span>
              </div>
            ))
          ) : (
            <div className="flex items-center text-base-content justify-between gap-4 text-xs">
              <div className="flex items-center gap-1.5 overflow-hidden">
                <div className="w-2 h-2 rounded-full shrink-0 bg-[#f08a6c]" />
                <span className="font-medium">Study</span>
              </div>
              <span className="font-bold shrink-0">{mins}m</span>
            </div>
          )}
        </div>
      </div>
    );
  }
  return null;
}

export default function StudyTrend({ sessions, subjects }: StudyTrendProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const subjectNameById = useMemo(() => {
    return subjects.reduce<Record<string, string>>((acc, subject) => {
      acc[subject._id] = subject.name;
      return acc;
    }, {});
  }, [subjects]);

  const subjectColors = useMemo(() => {
    const palette = ["#22c55e", "#6366f1", "#f43f5e", "#06b6d4", "#f59e0b", "#a855f7"];
    return subjects.reduce<Record<string, string>>((acc, subject, index) => {
      acc[subject.name] = palette[index % palette.length];
      return acc;
    }, {});
  }, [subjects]);
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
  const chartData: { date: string; minutes: number; barMinutes: number; areaMinutes: number }[] = [];
  const last14Days: { [key: string]: { total: number; subjects: Record<string, number> } } = {};

  for (let i = 13; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateStr = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    last14Days[dateStr] = { total: 0, subjects: {} };
  }

  sessions.forEach(s => {
    const d = new Date(s.date);
    const dateStr = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    if (dateStr in last14Days) {
  const subjectName = subjectNameById[s.subjectId] || "Unknown";
      const minutes = s.duration / 60;
      last14Days[dateStr].total += minutes;
      last14Days[dateStr].subjects[subjectName] = (last14Days[dateStr].subjects[subjectName] || 0) + minutes;
    }
  });

  const subjectsByDate: Record<string, { name: string; minutes: number }[]> = {};

  Object.entries(last14Days).forEach(([date, data]) => {
    const rounded = Math.round(data.total);
    const gap = 50;
    chartData.push({ date, minutes: rounded, barMinutes: rounded, areaMinutes: rounded + gap });
    subjectsByDate[date] = Object.entries(data.subjects)
      .map(([name, mins]) => ({ name, minutes: Math.round(mins) }))
      .filter((entry) => entry.minutes > 0)
      .sort((a, b) => b.minutes - a.minutes);
  });

  return (
    <div className="flex flex-col gap-5 bg-base-200 rounded-4xl border border-base-300 p-8">
      <div>
        <h2 className="text-xl font-bold mb-1">Study Trend</h2>
        <p className="text-xs font-normal opacity-50 font-mono tracking-tighter uppercase">(Last 14 Days)</p>
      </div>
      <div className="w-full h-72 outline-none **:outline-none">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={chartData}
            margin={{ top: 10, right: 30, left: -20, bottom: 0 }}
            tabIndex={-1}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            <defs>
              <linearGradient id="trendArea" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#9bd3ff" stopOpacity={0.35} />
                <stop offset="90%" stopColor="#9bd3ff" stopOpacity={0.05} />
                <stop offset="100%" stopColor="#9bd3ff" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="2 4" stroke="#4b5563" opacity={0.20} vertical={false} />
            <XAxis 
  dataKey="date"
  padding={{ left: 0, right: 0 }}
  domain={['dataMin', 'dataMax']}
  tick={{ fontSize: 12, opacity: 0.6 }}
  axisLine={false}
  tickLine={false}
/>

<YAxis 
  width={45}   // reduce this (default is bigger → causes left gap)
  tick={{ fontSize: 12, opacity: 0.6 }}
  axisLine={false}
  tickLine={false}
/>
            <Tooltip content={<CustomTooltip subjectsByDate={subjectsByDate} subjectColors={subjectColors} />} />
            <Bar
              dataKey="barMinutes"
              barSize={24}
              radius={[6, 6, 0, 0]}
              fill="#10b981"
            >
              {chartData.map((entry, index) => (
                <Cell
                  key={`bar-${entry.date}`}
                  className="transition-opacity duration-800"
                  style={{ transition: 'fill-opacity 800ms' }}
                  fillOpacity={hoveredIndex === null ? 1 : hoveredIndex === index ? 1 : 0.3}
                  onMouseEnter={() => setHoveredIndex(index)}
                />
              ))}
            </Bar>
            <Area 
              type="monotone" 
              dataKey="areaMinutes" 
              stroke="#9bd3ff" 
              strokeWidth={3}
              fillOpacity={1} 
              fill="url(#trendArea)" 
              dot={false}
              activeDot={{ r: 5, fill: "#9bd3ff", stroke: "#0f172a", strokeWidth: 2 }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
