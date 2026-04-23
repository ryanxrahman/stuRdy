"use client";

import { useRouter } from "next/navigation";
import type { KeyboardEvent } from "react";
import SubjectMiniChart from "./SubjectMiniChart";
import DeleteSubjectButton from "./DeleteSubjectButton";

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

  if (subjects.length === 0) {
    return (
      <p className="col-span-full text-center opacity-50 py-12 border-2 border-dashed border-base-300 rounded-3xl">
        No subjects yet. Add one above to get started!
      </p>
    );
  }

  return (
    <section className="bg-base-200 rounded-4xl border border-base-300 p-6 md:p-8">
      <div className="mb-5">
        <h2 className="text-xl font-bold mb-1">Subjects Overview</h2>
        <p className="text-xs opacity-50 uppercase tracking-tight font-mono">
          Click any row to open a subject page
        </p>
      </div>

      <div className="overflow-x-auto">
  <table className="table table-sm table-zebra table-pin-rows">
          <thead>
            <tr>
              <th>Subject</th>
              <th>Total Hours</th>
              <th>Longest Session</th>
              <th>Last Study</th>
              <th>Tasks Done</th>
              <th className="min-w-56">Area Chart</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            {subjects.map((sub) => {
              const stat = subjectStats.find((s) => s.name === sub.name);
              const completedTodos = sub.todos?.filter((t) => t.completed).length || 0;
              const totalTodos = sub.todos?.length || 0;
              const subjectSessions = sessions
                .filter((s) => s.subjectId === sub._id.toString())
                .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

              const totalMinutes = stat?.minutes || 0;
              const totalHoursLabel = totalMinutes === 0 ? "0h" : `${(totalMinutes / 60).toFixed(1)}h`;

              const longestSessionMins = subjectSessions.length
                ? Math.max(...subjectSessions.map((s) => Math.round((s.duration || 0) / 60)))
                : 0;
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
                  <td>
                    <span className="font-medium text-primary">{totalHoursLabel}</span>
                  </td>
                  <td>{longestHoursLabel}</td>
                  <td className="text-xs md:text-sm">{lastStudyLabel}</td>
                  <td>
                    {completedTodos}/{totalTodos}
                  </td>
                  <td>
                    <div className="w-full max-w-72">
                      <SubjectMiniChart sessions={subjectSessions} subjectName={sub.name} />
                    </div>
                  </td>
                  <td>
                    <div
                      className="scale-90 origin-center"
                      onClick={(e) => e.stopPropagation()}
                      onKeyDown={(e) => e.stopPropagation()}
                    >
                      <DeleteSubjectButton subjectId={sub._id.toString()} subjectName={sub.name} />
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
