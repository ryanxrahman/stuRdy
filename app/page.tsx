import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { getDb } from "@/lib/mongodb";
import ProgressChart from "./(dashboard)/[subject]/ProgressChart";
import SubjectBarChart from "@/components/SubjectBarChart";
import ContributionMap from "@/components/ContributionMap";
import BtnSecond from "@/components/btn/BtnSecond";
import BtnThird from "@/components/btn/BtnThird";
import { ThemeToggleForDashboard } from "@/components/ThemeToggleForDashboard";
import ThemeImage from "@/components/ThemeImage";
import SubjectsAreaChart from "@/components/SubjectsAreaChart";
import BtnFirst from "@/components/btn/BtnFirst";
import DashboardCalendar from "./(dashboard)/dashboard/DashboardCalendar";
import StudyTrend from "@/components/StudyTrend";

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

  return (
    <main className="max-w-7xl mx-auto w-full max-md:p-4">
      <section className="flex max-w-4xl mx-auto items-center p-4 justify-between">
        <div className="flex gap-2">
          <Image src={"/icon.png"} alt="app logo" width={25} height={25} />
          <div className="font-bold">stuRdy</div>
        </div>
        <div className="flex items-center gap-4 max-md:hidden">
          <a className="link link-hover hover:text-primary" href="">stats</a>
          <a className="link link-hover hover:text-primary" href="">review</a>
        </div>
        <div className="flex gap-4 items-center">
           
          <Link className="max-sm:hidden" href={"/login"}>
            <BtnThird>Log in</BtnThird>
          </Link>
          <Link href={"/register"}>
            <BtnSecond>Sign Up</BtnSecond>
          </Link>
          <ThemeToggleForDashboard />
        </div>
      </section>
      <section className="my-30 space-y-10 mx-auto">
        <div className="flex flex-col items-center justify-center gap-2">
          <Link target="_blank" href={"https://github.com/rahscripts/study"}>
            <div className="flex items-center gap-1 link text-primary link-hover hover:text-primary">
              <svg width={12} height={12} fill="currentColor" role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><title>GitHub</title><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>
              <p className="text-xs text-primary">
                opensource study-tracker
              </p>
            </div>
          </Link>
          <h1 className="text-6xl font-bold tracking-tight text-center max-md:text-4xl">
            <span className="">Visualize</span> Your <br className="md:hidden"/> <span className="uppercase bg-primary px-2 text-white">Academic</span> Progress
          </h1>
          <p className="opacity-60 max-w-lg mx-auto my-5 text-sm md:text-base">
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
            <h1 className="text-6xl max-md:text-4xl tracking-tight text-center font-bold">
               <span className="text-5xl max-md:text-2xl">Progress you can see,</span> <br /> <span className="uppercase text-white bg-primary px-2">results</span> you can feel!
            </h1>
            <p className="opacity-60 max-w-lg mx-auto text-sm md:text-base my-5">Track your study sessions and see the impact on your learning journey.</p>
            
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
             <p className="text-sm text-violet-400 my-4">feel the impact</p>
            <h1 className="text-4xl md:text-5xl font-black tracking-tight text-center mb-4">
             See the <span className="text-primary bg-primary dark:text-white px-2">Charts</span>
            </h1>
            <p className="opacity-60 max-w-lg mx-auto text-sm md:text-base">Visualize your study progress with real-time analytics</p>
          </div>
              <div className="max-lg:hidden">
                <ContributionMap sessions={contributionSessions} />
              </div>
        </div>
         
            <SubjectsAreaChart sessions={areaChartSessions} subjects={areaChartSubjects} />
      </section>

      <section className="my-40 max-w-5xl mx-auto space-y-10">
        <div className="text-center space-y-4">
          <p className="text-sm text-violet-400 my-4">consistency over time</p>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight text-center mb-4">
            The <span className="text-primary bg-primary dark:text-white px-2">Global</span> Study Log
          </h1>
          <p className="opacity-50 max-w-lg mx-auto text-sm md:text-base">Real-time breakdown of my study distribution</p>
        </div>
        
        <DashboardCalendar 
          sessions={sessions.map((s: any) => ({
            _id: String(s._id),
            date: s.date instanceof Date ? s.date.toISOString() : String(s.date),
            duration: Number(s.duration),
            subjectId: String(s.subjectId)
          }))}
          subjects={rawSubjects.map((s: any) => ({
            _id: String(s._id),
            name: String(s.name)
          }))} 
        />
      </section>

      <section  className=" max-w-4xl mx-auto items-center p-4 my-30">
        <div className="flex items-baseline justify-between gap-10 max-md:flex-col max-md:justify-center max-md:items-center">
          <div className="flex flex-col gap-2 items-start max-md:items-center max-md:gap-5">
               <div className="flex gap-2 items-center">
          <Image src={"/icon.png"} alt="app logo" width={25} height={25} />
          <div className="font-bold">stuRdy</div>
        </div>
         <div className="text-sm max-md:text-center">
          <p>Empowering your study journey with data-driven insights.</p>
          <p className="text-sm">Turn study data into clear, actionable insights</p>
         </div>
         <div className="flex items-center gap-2">
          <Link href={"/register"}>
            <BtnFirst>Start Studying</BtnFirst>
          </Link>
          <Link href={"/login"}>
            <BtnSecond>Log in</BtnSecond>
          </Link>
          <ThemeToggleForDashboard />
         </div>
          </div>
          <div className="flex max-md:items-center flex-col text-center md:items-end gap-2">
            <h1 className="font-bold">by the maker:</h1>

           <div className="flex flex-col gap-2 md:text-end text-sm">
             { [
                { icon: "booksofme", link: "https://booksofme.com" },
                { icon: "elevatepr", link: "https://elevatepr.fit" },
                { icon: "xrahman", link: "https://xrahman.com" },
              ].map(({ icon, link }) => (
                <Link
                  key={icon}
                  href={link}
                  className="link link-hover hover:text-primary"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {icon}
                </Link>
              ))
             }
           </div>
          </div>

        </div>
        <div className="flex items-baseline justify-between max-md:justify-center max-md:items-center max-md:gap-10 max-md:flex-col text-sm mt-10">
             <div className="max-md:text-center flex flex-col gap-2 md:gap-0">
               <p>Hey, I’m <a target="_blank" className="text-primary link link-hover" href="https://xrahman.com">Rahman</a>. <br className="md:hidden"/> I built this small app to study better.</p>
               <p>The charts above show my real-time stats. <br className="md:hidden"/> I’ve studied <span className="text-emerald-500">{totalHoursStudied}</span> hours so far.</p>
             </div>
             <div className="flex items-center gap-4 max-md:justify-center">
              <Link className="" target="_blank" href={"https://github.com/ryanxrahman/study"}>
                <svg width={20} height={20 } className="text-3xl" fill="currentColor" role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><title>GitHub</title><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>
              </Link>
              <Link className="" target="_blank" href={"https://x.com/ryanxrahman"}>
                <svg width={20} height={20} role="img" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><title>X</title><path d="M14.234 10.162 22.977 0h-2.072l-7.591 8.824L7.251 0H.258l9.168 13.343L.258 24H2.33l8.016-9.318L16.749 24h6.993zm-2.837 3.299-.929-1.329L3.076 1.56h3.182l5.965 8.532.929 1.329 7.754 11.09h-3.182z"/></svg>
              </Link>
             </div>
        </div>
      </section>

      <section className="max-w-full pointer-events-none mx-auto mt-20">
        <StudyTrend 
          sessions={areaChartSessions} 
          subjects={areaChartSubjects} 
          landing={true}
        />
      </section>

    </main>
  );
}
