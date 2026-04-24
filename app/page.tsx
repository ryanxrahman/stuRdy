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
import BtnPrimary from "@/components/btn/BtnPrimary";
import BtnSecond from "@/components/btn/BtnSecond";
import BtnThird from "@/components/btn/BtnThird";

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
   <main className="max-w-6xl mx-auto w-full ">
    <section className="flex items-center p-3 max-md:p-1 justify-between">
       <div className="flex gap-2">
        <Image src={"/icon.png"} alt="app logo" width={25} height={25}/>
        <div className="font-bold">study by MR</div>
       </div>
       <div className="flex items-center gap-4">
          <a className="link link-hover hover:text-primary" href="">stats</a>
          <a className="link link-hover hover:text-primary" href="">review</a>
       </div>
       <div className="flex gap-4 items-center">
          <Link href={"/login"}>
            <BtnThird>Log in</BtnThird>
          </Link>
          <Link href={"/register"}>
            <BtnSecond>Sign Up</BtnSecond>
          </Link>
       </div>
    </section>
   </main>
  );
}
