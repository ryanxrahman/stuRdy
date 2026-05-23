"use client";

import { useMemo, useState } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type Subject = {
  _id: string;
  name: string;
};

type Session = {
  date: string;
  duration: number;
  subjectId: string;
};

type Series = {
  key: string;
  id: string;
  name: string;
  color: string;
  totalMinutes: number;
};

type ChartRow = {
  date: string;
} & Record<string, number | string>;

type TooltipPayloadItem = {
  name?: string;
  value?: number;
  color?: string;
};

type SubjectTooltipProps = {
  active?: boolean;
  payload?: TooltipPayloadItem[];
  label?: string;
};

const PALETTE = [
  "#8b5cf6",
  "#06b6d4",
  "#22c55e",
  "#f59e0b",
  "#ef4444",
  "#6366f1",
  "#14b8a6",
  "#f97316",
  "#ec4899",
  "#84cc16",
];

function SubjectAreaTooltip({ active, payload, label }: SubjectTooltipProps) {
  if (!active || !payload?.length) return null;

  const sorted = [...payload]
    .filter((item) => typeof item.value === "number" && item.value > 0)
    .sort((a, b) => (b.value ?? 0) - (a.value ?? 0));

  return (
    <div className="bg-neutral-900 text-neutral-100 px-4 py-3 rounded-xl shadow-2xl border border-white/10 min-w-52">
      <p className="text-xs uppercase tracking-wider opacity-60 mb-2">{label}</p>
      {sorted.length === 0 ? (
        <p className="text-sm opacity-70">No study sessions</p>
      ) : (
        <div className="space-y-1.5">
          {sorted.map((item) => (
            <div key={`${item.name}-${item.value}`} className="flex items-center justify-between gap-4 text-sm">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="opacity-90">{item.name}</span>
              </div>
              <span className="font-semibold">{Math.round(item.value ?? 0)}m</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function SubjectsAreaChart({
  sessions,
  subjects,
}: {
  sessions: Session[];
  subjects: Subject[];
}) {
  const [activeSeriesKey, setActiveSeriesKey] = useState<string | null>(null);

  const { chartData, series } = useMemo(() => {
    const subjectNameById = new Map(subjects.map((sub) => [sub._id, sub.name]));
    const minutesByDateAndSubject: Record<string, Record<string, number>> = {};
    const totalsBySubjectId: Record<string, number> = {};

    const days: string[] = [];
    for (let i = 20; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, "0");
      const day = String(d.getDate()).padStart(2, "0");
      days.push(`${year}-${month}-${day}`);
    }

    days.forEach((day) => {
      minutesByDateAndSubject[day] = {};
    });

    sessions.forEach((session) => {
      const d = new Date(session.date);
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, "0");
      const day = String(d.getDate()).padStart(2, "0");
      const sessionDay = `${year}-${month}-${day}`;

      if (!minutesByDateAndSubject[sessionDay]) return;

      const subjectId = session.subjectId;
      if (!subjectNameById.has(subjectId)) return;

      const minutes = Math.max(0, Math.round((session.duration || 0) / 60));
      minutesByDateAndSubject[sessionDay][subjectId] =
        (minutesByDateAndSubject[sessionDay][subjectId] || 0) + minutes;
      totalsBySubjectId[subjectId] = (totalsBySubjectId[subjectId] || 0) + minutes;
    });

    const activeSubjectIds = Object.keys(totalsBySubjectId)
      .filter((id) => totalsBySubjectId[id] > 0)
      .sort((a, b) => totalsBySubjectId[b] - totalsBySubjectId[a]);

    const nextSeries: Series[] = activeSubjectIds.map((id, index) => ({
      key: `sub_${id}`,
      id,
      name: subjectNameById.get(id) || "Unknown",
      color: PALETTE[index % PALETTE.length],
      totalMinutes: totalsBySubjectId[id],
    }));

    const nextChartData: ChartRow[] = days.map((dayIso) => {
      const label = new Date(dayIso).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });

      const row: ChartRow = { date: label };
      nextSeries.forEach((s) => {
        row[s.key] = minutesByDateAndSubject[dayIso][s.id] || 0;
      });

      return row;
    });

    return { chartData: nextChartData, series: nextSeries };
  }, [sessions, subjects]);

  if (series.length === 0) {
    return (
      <section className="bg-base-200 rounded-4xl border border-base-300 p-8">
        <h2 className="text-xl font-bold mb-1">Subject Flow</h2>
        <p className="text-xs opacity-50 mb-6 uppercase tracking-tight font-mono">
          Multi-subject area chart (last 21 days)
        </p>
        <div className="h-72 flex items-center justify-center text-sm opacity-50 italic">
          No subject sessions yet.
        </div>
      </section>
    );
  }

  const activeSeries = series.find((s) => s.key === activeSeriesKey) || null;

  return (
    <section className="bg-base-200 rounded-4xl border border-base-300 p-8">
      <div className="mb-6">
        <h2 className="text-xl font-bold mb-1">Subject Flow</h2>
        <p className="text-xs opacity-50 uppercase tracking-tight font-mono">
          One chart, all subjects • hover a line to focus
        </p>
      </div>

      <div className="w-full h-80 -ml-3">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={chartData}
            onMouseLeave={() => setActiveSeriesKey(null)}
            margin={{ top: 8, right: 12, left: 0, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.15} />
            <XAxis dataKey="date" tick={{ fontSize: 12, opacity: 0.7 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 12, opacity: 0.7 }} axisLine={false} tickLine={false} />
            <Tooltip content={<SubjectAreaTooltip />} />

            {series.map((s) => {
              const faded = Boolean(activeSeriesKey) && activeSeriesKey !== s.key;

              return (
                <Area
                  key={s.key}
                  type="monotone"
                  dataKey={s.key}
                  name={s.name}
                  stroke={s.color}
                  fill={s.color}
                  strokeWidth={activeSeriesKey === s.key ? 3 : 2}
                  strokeOpacity={faded ? 0.2 : 1}
                  fillOpacity={faded ? 0.03 : 0.16}
                  activeDot={{ r: 4 }}
                  connectNulls
                  onMouseEnter={() => setActiveSeriesKey(s.key)}
                />
              );
            })}
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        {series.map((s) => {
          const muted = Boolean(activeSeriesKey) && activeSeriesKey !== s.key;

          return (
            <button
              key={`${s.key}-legend`}
              type="button"
              onMouseEnter={() => setActiveSeriesKey(s.key)}
              onMouseLeave={() => setActiveSeriesKey(null)}
              className={`px-3 py-1.5 rounded-full text-xs border transition-opacity ${muted ? "opacity-30" : "opacity-100"}`}
              style={{ borderColor: `${s.color}66`, color: s.color, backgroundColor: `${s.color}14` }}
            >
              {s.name}
            </button>
          );
        })}
      </div>

      <div className="mt-4 text-sm opacity-70">
        {activeSeries ? (
          <p>
            <span className="font-semibold" style={{ color: activeSeries.color }}>
              {activeSeries.name}
            </span>{" "}
            total in view: <span className="font-semibold">{Math.round(activeSeries.totalMinutes)} minutes</span>
          </p>
        ) : (
          <p>Hover any subject area/legend to highlight it and dim others.</p>
        )}
      </div>
    </section>
  );
}
