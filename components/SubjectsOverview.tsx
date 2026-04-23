"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import type { KeyboardEvent } from "react";
import SubjectMiniChart from "./SubjectMiniChart";

type Subject = {
  _id: string;
  name: string;
  todos?: Array<{ completed: boolean }>;
};

type SubjectData = {
  name: string;
  minutes: number;
  mastery: number;
};

type Session = {
  subjectId: string;
  duration: number;
  date: string;
};

type SubjectsOverviewProps = {
  subjects: Subject[];
  subjectStats: SubjectData[];
  sessions: Session[];
};

type SortFilter = "added" | "total-study" | "longest-study" | "last-study" | "name";

function formatTimeAgo(dateInput: string): string {
  const date = new Date(dateInput);
  const diffMs = Date.now() - date.getTime();

  if (Number.isNaN(date.getTime()) || diffMs < 0) return "Just now";

  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  if (diffMinutes < 1) return "Just now";
  if (diffMinutes < 60) return `${diffMinutes} min ago`;

  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) return `${diffHours} hr ago`;

  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 30) return `${diffDays} day${diffDays === 1 ? "" : "s"} ago`;

  const diffMonths = Math.floor(diffDays / 30);
  if (diffMonths < 12) return `${diffMonths} month${diffMonths === 1 ? "" : "s"} ago`;

  const diffYears = Math.floor(diffDays / 365);
  return `${diffYears} year${diffYears === 1 ? "" : "s"} ago`;
}

export default function SubjectsOverview({ subjects, subjectStats, sessions }: SubjectsOverviewProps) {
  const router = useRouter();
  const [sortFilter, setSortFilter] = useState<SortFilter>("added");

  const sortedRows = useMemo(() => {
    const rows = subjects.map((sub, index) => {
      const stat = subjectStats.find((s) => s.name === sub.name);
      const subjectSessions = sessions
        .filter((s) => s.subjectId === sub._id.toString())
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

      const totalMinutes = stat?.minutes || 0;
      const longestSessionMins = subjectSessions.length
        ? Math.max(...subjectSessions.map((s) => Math.round((s.duration || 0) / 60)))
        : 0;
      const lastSession = subjectSessions.at(-1);
      const lastStudyTs = lastSession ? new Date(lastSession.date).getTime() : 0;

      return {
        sub,
        index,
        subjectSessions,
        totalMinutes,
        longestSessionMins,
        lastStudyTs,
      };
    });

    const sorted = [...rows];

    switch (sortFilter) {
      case "total-study":
        sorted.sort((a, b) => b.totalMinutes - a.totalMinutes);
        break;
      case "longest-study":
        sorted.sort((a, b) => b.longestSessionMins - a.longestSessionMins);
        break;
      case "last-study":
        sorted.sort((a, b) => b.lastStudyTs - a.lastStudyTs);
        break;
      case "name":
        sorted.sort((a, b) => a.sub.name.localeCompare(b.sub.name));
        break;
      case "added":
      default:
        sorted.sort((a, b) => a.index - b.index);
        break;
    }

    return sorted;
  }, [subjects, subjectStats, sessions, sortFilter]);

  if (subjects.length === 0) {
    return (
      <p className="col-span-full text-center opacity-50 py-12 border-2 border-dashed border-base-300 rounded-3xl">
        No subjects yet. Add one above to get started!
      </p>
    );
  }

  return (
    <section className="bg-base-200 rounded-4xl border border-base-300 p-6 md:p-8">
      <div className="mb-5 flex items-start justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold mb-1">Subjects Overview</h2>
          <p className="text-xs opacity-50 uppercase tracking-tight font-mono">
            Click any row to open a subject page
          </p>
        </div>

        <div className="min-w-40">
          <label className="text-[10px] opacity-60 uppercase tracking-wider font-mono mb-1 block">
            Sort by
          </label>
          <select
            className="select select-sm select-bordered w-full"
            value={sortFilter}
            onChange={(e) => setSortFilter(e.target.value as SortFilter)}
            aria-label="Sort subjects"
          >
            <option value="added">Last Added</option>
            <option value="total-study">Total Study</option>
            <option value="longest-study">Longest Study</option>
            <option value="last-study">Last Study</option>
            <option value="name">Subject Name (A-Z)</option>
          </select>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="table table-sm table-zebra table-pin-rows w-full">
          <thead>
            <tr>
              <th>Subject</th>
              <th className="hidden md:table-cell">Total Hours</th>
              <th className="hidden md:table-cell">Longest Session</th>
              <th className="hidden md:table-cell">Last Study</th>
              <th className=" min-w-56">Area Chart</th>
            </tr>
          </thead>
          <tbody>
            {sortedRows.map(({ sub, subjectSessions, totalMinutes, longestSessionMins }) => {
              const totalHoursLabel = totalMinutes === 0 ? "0h" : `${(totalMinutes / 60).toFixed(1)}h`;

              const longestHoursLabel =
                longestSessionMins === 0
                  ? "—"
                  : longestSessionMins < 60
                    ? `${longestSessionMins}m`
                    : `${(longestSessionMins / 60).toFixed(1)}h`;

              const lastSession = subjectSessions.at(-1);
              const lastStudyLabel = lastSession
                ? formatTimeAgo(lastSession.date)
                : "Never";

              const handleNavigate = () => {
                router.push(`/${encodeURIComponent(sub.name)}`);
              };

              const handleNavigateKeyDown = (e: KeyboardEvent<HTMLTableRowElement>) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  handleNavigate();
                }
              };

              return (
                <tr
                  key={sub._id.toString()}
                  role="button"
                  tabIndex={0}
                  onClick={handleNavigate}
                  onKeyDown={handleNavigateKeyDown}
                  className="cursor-pointer hover:bg-base-300/50 focus-visible:outline-2 focus-visible:outline-primary [&>td]:py-2"
                >
                  <td className="font-semibold">{sub.name}</td>
                  <td className="hidden md:table-cell">
                    <span className="font-medium text-primary">{totalHoursLabel}</span>
                  </td>
                  <td className="hidden md:table-cell">{longestHoursLabel}</td>
                  <td className="hidden md:table-cell text-xs md:text-sm">{lastStudyLabel}</td>
                  <td className="">
                    <div className="w-full">
                      <SubjectMiniChart sessions={subjectSessions} subjectName={sub.name} />
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}
