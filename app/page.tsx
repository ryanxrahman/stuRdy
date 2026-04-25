import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { BarChart3, BookOpen, Clock, Flame, ArrowRight, Check, Cross, X } from "lucide-react";
import { getSession } from "@/lib/auth";
import { getDb } from "@/lib/mongodb";
import ProgressChart from "./(dashboard)/[subject]/ProgressChart";
import SubjectBarChart from "@/components/SubjectBarChart";
import ContributionMap from "@/components/ContributionMap";
import StudyGoal from "@/components/StudyGoal";
import BtnPrimary from "@/components/btn/BtnPrimary";
import BtnSecond from "@/components/btn/BtnSecond";
import BtnThird from "@/components/btn/BtnThird";
import { ThemeToggle } from "@/components/ThemeToggle";
import { ThemeToggleForDashboard } from "@/components/ThemeToggleForDashboard";
import ThemeImage from "@/components/ThemeImage";
import SubjectsAreaChart from "@/components/SubjectsAreaChart";

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
  const totalHoursStudiedNum = parseFloat(totalHoursStudied);

  const areaChartSubjects = rawSubjects.map((sub: any) => ({
    _id: String(sub._id),
    name: typeof sub.name === "string" ? sub.name : "Untitled",
  }));

  const areaChartSessions = sessions.map((s: any) => ({
    date: String(s.date),
    duration: Number(s.duration || 0),
    subjectId: String(s.subjectId || ""),
  }));

  const otherStudyTracker = [
    "no charts no graphs no data",
    "just tasks no real insights",
    "no clear progress tracking",
    "boring plain study experience",
    "no motivation to improve"
  ];

  const studyTrackerByMR = [
    "beautiful charts show your progress",
    "insightful graphs reveal study patterns",
    "actionable data improves your consistency",
    "clear tracking keeps you focused",
    "smart insights help you grow"
  ];

  return (
    <main className="max-w-7xl mx-auto w-full ">
      <section className="flex max-w-4xl mx-auto items-center p-4 max-md:p-1 justify-between">
        <div className="flex gap-2">
          <Image src={"/icon.png"} alt="app logo" width={25} height={25} />
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
          <ThemeToggleForDashboard />
        </div>
      </section>
      <section className="my-30 flex flex-col items-center justify-center gap-10">
        <div className="flex flex-col items-center justify-center gap-2">
          <p className="text-xs text-primary">
            opensource study-tracker
          </p>
          <h1 className="text-6xl font-bold tracking-tight">
            <span className="">Visualize</span> Your <span className="uppercase bg-primary px-2 text-white">Academic</span> Progress
          </h1>
          <p className="text-sm my-5">
            Turn study data into clear, actionable insights
          </p>
        </div>
        <div>
          <ThemeImage 
            lightSrc="/herolight.png" 
            darkSrc="/herodark.png" 
            alt="app logo" 
            width={1400} 
            height={1400} 
            className="rounded-4xl outline-4 outline-base-300"
          />
        </div>
      </section>
      <section className="space-y-10 my-40">
        <div className="text-center">
          <p className="text-sm text-violet-400 mt-4">smart insights help you grow</p>
            <h1 className="text-6xl tracking-tight text-center font-bold">
               <span className="text-5xl">Progress you can see,</span> <br /> <span className="uppercase text-white bg-primary px-2">results</span> you can feel!
            </h1>
            
          </div>
        <div className="max-w-5xl mx-auto my-20 flex flex-col gap-8">
          
          <div className="bg-base-200 text-base-content p-8 md:p-10 rounded-[2.5rem] border border-base-300 shadow-sm">
            <h2 className="text-2xl font-black mb-1">Realtime stats of mr</h2>
            <p className="text-sm opacity-50 mb-6">Subject-wise focus time from real timer sessions.</p>
            <SubjectBarChart data={subjectStats} />
          </div>
           
            <section className="bg-base-200 text-base-content p-8 md:p-10 rounded-[2.5rem] border border-base-300 shadow-sm">
              <h2 className="text-2xl font-black mb-1">Study Momentum</h2>
              <p className="text-sm opacity-50 mb-6">Same chart style I use inside each subject page.</p>
              <ProgressChart data={studyChartData} />
            </section>
        </div>
      </section>


      <section className="max-w-7xl mx-auto my-20 flex flex-col gap-8">
        <div className="max-w-5xl mx-auto space-y-10">
          <div className="text-center space-y-8">
             <p className="text-violet-400 text-sm">feel the impact</p>
            <h1 className="text-7xl font-bold tracking-tight text-center">
             See the <span className="text-primary bg-primary dark:text-white px-2">Charts</span>
            </h1>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
              <ContributionMap sessions={contributionSessions} />
              <section className="bg-base-200 text-base-content p-8 md:p-10 rounded-[2.5rem] border border-base-300 shadow-sm">
                <h2 className="text-2xl font-bold mb-1">Weekly stats of mr</h2>
                <p className="text-sm opacity-50 mb-6 uppercase tracking-tight font-mono">Real-time update from my sessions</p>
                 <div className="grid grid-cols-2 gap-4">
                 {[
            { icon: Clock, label: "Total Study", value: totalHoursStudiedNum < 1 ? `${totalMinutes}m` : `${(totalHoursStudiedNum)}h`, color: "text-violet-400" },
            { icon: BookOpen, label: "Subjects", value: totalSubjects, color: "text-cyan-400" },
            { icon: Check, label: "Tasks Done", value: totalSessions, color: "text-emerald-400" },
            { icon: Flame, label: "Sessions", value: totalSessions, color: "text-amber-400" },
          ].map(({ icon: Icon, label, value, color }) => (
            <div key={label} className="bg-base-100 rounded-3xl border border-base-300 p-5 flex items-center gap-4">
              <div className={`${color} opacity-80`}>
                <Icon size={14} />
              </div>
              <div>
                <p className="text-lg font-black">{value}</p>
                <p className="text-[10px] opacity-50 font-mono tracking-tight uppercase">{label}</p>
              </div>
            </div>
          ))}
                 </div>
              </section>
            </div>
        </div>
         
            <SubjectsAreaChart sessions={areaChartSessions} subjects={areaChartSubjects} />
      </section>

    
     

    </main>
  );
}
