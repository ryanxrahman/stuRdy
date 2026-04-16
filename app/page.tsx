import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { BarChart3, BookOpen, Clock, Flame, ArrowRight } from "lucide-react";
import { getSession } from "@/lib/auth";
import { getDb } from "@/lib/mongodb";
import ProgressChart from "./(dashboard)/[subject]/ProgressChart";
import SubjectBarChart from "@/components/SubjectBarChart";
import ContributionMap from "@/components/ContributionMap";
import StudyGoal from "@/components/StudyGoal";

type SessionDoc = {
  _id?: any;
  date: Date | string;
  duration: number;
  subjectId?: { toString(): string } | string;
};

export default async function Home() {
  const session = await getSession();

  if (session) {
    redirect("/dashboard");
  }

  const db = await getDb();

  const profileEmail = process.env.LANDING_STATS_EMAIL || process.env.PORTFOLIO_EMAIL;
  const profileUser = profileEmail
    ? await db.collection("users").findOne({ email: profileEmail })
    : await db.collection("users").findOne({}, { sort: { createdAt: 1 } });

  const userId = profileUser?._id?.toString();

  const rawSubjects = userId
    ? await db.collection("subjects").find({ userId }).toArray()
    : [];

  const rawSessions = userId
    ? await db.collection<SessionDoc>("sessions").find({ userId }).sort({ date: 1 }).toArray()
    : [];

  const sessions = rawSessions;

  const totalMinutes = Math.round(
    sessions.reduce((acc, s) => acc + ((s.duration || 0) / 60), 0)
  );

  const totalSessions = sessions.length;
  const totalSubjects = rawSubjects.length;

  const uniqueDays = new Set(
    sessions.map((s) => new Date(s.date).toDateString())
  ).size;

  const minutesBySubjectId: Record<string, number> = {};
  sessions.forEach((s) => {
    const subjectKey = s.subjectId?.toString();
    if (!subjectKey) return;
    minutesBySubjectId[subjectKey] = (minutesBySubjectId[subjectKey] || 0) + ((s.duration || 0) / 60);
  });

  const subjectNameById: Record<string, string> = {};
  rawSubjects.forEach((sub: any) => {
    subjectNameById[sub._id.toString()] = sub.name;
  });

  const subjectStats = Object.entries(minutesBySubjectId)
    .map(([id, minutes]) => ({
      name: subjectNameById[id] || "Unknown",
      minutes: Math.round(minutes),
    }))
    .filter((s) => s.minutes > 0)
    .sort((a, b) => b.minutes - a.minutes);

  const topSubject = subjectStats[0]?.name || "Not enough data yet";

  const studyChartDataMap: Record<string, number> = {};
  sessions.forEach((s) => {
    const dateStr = new Date(s.date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
    studyChartDataMap[dateStr] = (studyChartDataMap[dateStr] || 0) + ((s.duration || 0) / 60);
  });

  const studyChartData = Object.entries(studyChartDataMap).map(([date, minutes]) => ({
    date,
    minutes: Math.round(minutes),
  }));

  const contributionSessions = sessions.map(s => ({
    date: new Date(s.date),
    duration: s.duration || 0
  }));

  const todaySessions = sessions.filter(s => {
    const sDate = new Date(s.date);
    const now = new Date();
    return sDate.getDate() === now.getDate() &&
      sDate.getMonth() === now.getMonth() &&
      sDate.getFullYear() === now.getFullYear();
  });
  const todayMinutes = Math.round(todaySessions.reduce((acc, s) => acc + ((s.duration || 0) / 60), 0));

  const journeyStart = new Date("2026-04-07T00:00:00");
  const today = new Date();
  const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const journeyStartDate = new Date(
    journeyStart.getFullYear(),
    journeyStart.getMonth(),
    journeyStart.getDate()
  );
  const MS_PER_DAY = 1000 * 60 * 60 * 24;
  const daysSinceStart = Math.max(
    0,
    Math.floor((todayStart.getTime() - journeyStartDate.getTime()) / MS_PER_DAY)
  );
  const totalHoursStudied = (totalMinutes / 60).toFixed(1);

  return (
    <div className="min-h-screen bg-neutral-900 text-neutral-100 selection:bg-orange-100 selection:text-orange-900">
      <nav className="sticky top-0 z-50 border-b border-white/10 bg-neutral-900/85 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Image src="/study.jpeg" alt="Study logo" width={32} height={32} className="rounded-full" />
            <span className="font-semibold tracking-tight">Study by mr</span>
          </div>

          <div className="flex items-center gap-2">
            <Link href="/login" className="px-4 py-2 rounded-xl text-sm font-semibold hover:bg-white/10 transition-colors">
              Login
            </Link>
            <Link href="/register" className="px-4 py-2 rounded-xl text-sm font-bold bg-white text-black hover:opacity-90 transition-opacity">
              Sign Up
            </Link>
          </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-6 py-10 md:py-14 flex flex-col gap-10">
        <section className="bg-base-200 text-base-content p-8 md:p-10 rounded-[2.5rem] border border-base-300 shadow-sm">
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            <div className="space-y-4">
              <p className="text-xs font-bold uppercase tracking-widest opacity-50">My POV</p>
              <h1 className="text-4xl md:text-5xl font-black tracking-tight leading-tight">
                I built this because I kept losing focus.
              </h1>
              <p className="opacity-70 max-w-xl">
                No fake motivation here — just sessions tracked every day, subjects ranked by time,
                and visible progress. This page shows how I actually study.
              </p>
              <p className="text-sm opacity-60">
                Top studied subject right now: <span className="font-bold opacity-100">{topSubject}</span>
              </p>
              <Link
                href="/register"
                className="inline-flex items-center gap-2 mt-2 px-5 py-3 rounded-2xl bg-violet-500 text-white font-bold text-sm hover:bg-violet-400 transition-colors"
              >
                Start your own study log
                <ArrowRight size={16} />
              </Link>
            </div>

            <div className="rounded-3xl overflow-hidden border border-base-300 bg-base-300/20">
              <Image
                src="/study.jpeg"
                alt="Study preview"
                width={900}
                height={520}
                className="w-full h-auto object-cover"
                priority
              />
            </div>
          </div>
        </section>

        <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { icon: Clock, label: "Total Focus", value: totalMinutes < 60 ? `${totalMinutes}m` : `${(totalMinutes / 60).toFixed(1)}h`, color: "text-violet-400" },
            { icon: Flame, label: "Sessions", value: totalSessions, color: "text-amber-400" },
            { icon: BookOpen, label: "Subjects", value: totalSubjects, color: "text-cyan-400" },
            { icon: BarChart3, label: "Study Days", value: uniqueDays, color: "text-emerald-400" },
          ].map(({ icon: Icon, label, value, color }) => (
            <div key={label} className="bg-base-200 text-base-content rounded-3xl border border-base-300 p-5 flex items-center gap-4">
              <div className={`${color} opacity-90`}>
                <Icon size={22} />
              </div>
              <div>
                <p className="text-xl font-black leading-none">{value}</p>
                <p className="text-xs opacity-50 uppercase tracking-tight font-mono mt-1">{label}</p>
              </div>
            </div>
          ))}
        </section>

        <section className="bg-base-200 text-base-content p-8 md:p-10 rounded-[2.5rem] border border-base-300 shadow-sm">
          <h2 className="text-2xl font-black mb-1">Study Momentum</h2>
          <p className="text-sm opacity-50 mb-6">Same chart style I use inside each subject page.</p>
          <ProgressChart data={studyChartData} />
        </section>

        <section className="bg-base-200 text-base-content p-8 md:p-10 rounded-[2.5rem] border border-base-300 shadow-sm">
          <h2 className="text-2xl font-black mb-1">What I study the most</h2>
          <p className="text-sm opacity-50 mb-6">Subject-wise focus time from real timer sessions.</p>
          <SubjectBarChart data={subjectStats} />
        </section>

        <section className="grid md:grid-cols-2 gap-8">
          <ContributionMap sessions={contributionSessions} />
          <StudyGoal totalStudyMinutes={todayMinutes} />
        </section>

        <section className="bg-base-200 text-base-content p-8 md:p-10 rounded-[2.5rem] border border-base-300 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-widest opacity-50 mb-3">Journey Counter</p>
          <p className="text-2xl md:text-3xl font-black tracking-tight leading-tight">
            It&apos;s been <span className="text-violet-500">{daysSinceStart}</span> days and I have studied <span className="text-emerald-500">{totalHoursStudied}</span> hours.
          </p>
          <p className="text-sm opacity-50 mt-3">Counting from April 7, 2026. when i made this app.</p>
        </section>
      </main>
    </div>
  );
}
