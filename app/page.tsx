
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";

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
          <BookOpen className="w-5 h-5 text-orange-600" />
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

        <div className="max-w-4xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-900/20 text-orange-400 text-[10px] font-bold uppercase tracking-widest mb-10 border border-orange-500/20 animate-fade-in">
            <Sparkles className="w-3 h-3" />
            <span>Built for the high-performance student</span>
          </div>
          
          <h1 className="text-6xl md:text-9xl font-extrabold tracking-tighter leading-[0.85] mb-12 text-white">
            The study <br />
            habit <span className="text-orange-500 font-serif italic font-normal tracking-normal pr-4">that</span> sticks.
          </h1>
          
          <p className="text-xl md:text-2xl text-white/50 max-w-xl mx-auto mb-16 font-medium leading-tight">
            An intentionally designed ecosystem for those who value deep focus, mastery, and organized progress.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Link href="/register" className="group bg-white text-black px-10 py-5 rounded-3xl text-lg font-bold hover:bg-orange-600 hover:text-white transition-all flex items-center gap-3">
              Get Started Free <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <a href="#vision" className="text-sm font-extrabold border-b-2 border-white/10 hover:border-white transition-all py-1 text-white">
              Read Our Vision
            </a>
          </div>
        </div>

        <div className="absolute bottom-12 flex flex-col items-center gap-2 opacity-30 text-white">
          <span className="text-[10px] font-bold uppercase tracking-widest">Keep Reading</span>
          <ChevronDown className="w-4 h-4 animate-bounce" />
        </div>
      </section>
    </div>
  );
}
