
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import Image from "next/image";

import Link from "next/link";
import { 
  BookOpen, 
  Trophy, 
  Clock, 
  ChevronDown, 
  CheckCircle2, 
  BarChart3, 
  Calendar, 
  Zap,
  ShieldCheck,
  LayoutDashboard,
  Sparkles,
  ArrowRight
} from "lucide-react";

export default async function Home() {
  const session = await getSession();

  if (session) {
    redirect("/dashboard");
  }

  return (
    <div className="bg-neutral-800 text-white selection:bg-orange-100 selection:text-orange-900 min-h-screen">
      {/* 
        A more "human-designed" layout:
        - Less rigid geometry, more whitespace.
        - Warmer color palette (slight off-whites, oranges, and deep grays).
        - Elegant typography-first approach.
      */}

      {/* Modern, Floating Header */}
      <nav className="fixed top-6 inset-x-0 z-50 mx-auto max-w-fit flex items-center bg-neutral-800/70 backdrop-blur-xl border border-white/5 px-6 py-3 rounded-2xl shadow-lg shadow-black/20 space-x-8">
        <div className="flex items-center gap-2">
         <Image src="/study.jpeg" alt="Logo" width={30} height={30} className="rounded-full" />
          <span className="font-semibold tracking-tight text-sm text-white">Study by mr</span>
        </div>
        <div className="flex gap-3 items-center pl-4 border-l border-white/10">
          <Link href="/login" className="text-sm font-semibold hover:opacity-70 transition-opacity px-2 py-1 text-white">Login</Link>
          <Link href="/register" className="bg-white text-black px-5 py-2 rounded-xl text-xs font-bold hover:scale-105 active:scale-95 transition-all">Sign Up</Link>
        </div>
      </nav>

      {/* Slide 1: Human-Centric Hero */}
      <section className="min-h-screen flex flex-col items-center justify-center px-6 text-center relative pt-20 overflow-hidden">
        {/* Organic shapes for a more human feel */}
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-orange-900/20 rounded-full blur-[120px] -z-10 opacity-60" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-900/20 rounded-full blur-[120px] -z-10 opacity-40" />

      <div className="flex flex-col lg:flex-row items-center gap-12 max-w-5xl">
        <div className="shrink-0">
          <Image src="/study.jpeg" alt="Description" className="rounded-2xl" width={500} height={300} />
        </div>
        <div className="flex flex-col gap-5 items-start">
          <h1 className="items-start text-start text-2xl" >
           Stuggled with <span className="bg-orange-400 text-black">focus.</span> <br /> created this for myself, <br /> but if it can help you too, <br /> then that's a <span className="italic">win</span>.
          </h1>
          <div className="text-start"> 
            <p>
              <Link className="text-orange-400" href="https://www.xrahman.com" target="_blank">xrahman</Link>, if you're reading this, you know what to do.
            </p>
            <p >
              just fucking study, bro.
            </p>
          </div>
        </div>
      </div>
      </section>
    </div>
  );
}
