
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
      <nav className="fixed top-6 inset-x-0 z-50 mx-auto max-w-fit flex items-center bg-neutral-800/70 backdrop-blur-xl border border-white/5 px-6 py-3 rounded-full shadow-lg shadow-black/20 space-x-8">
        <div className="flex items-center gap-2 pr-4 border-r border-white/10">
          <BookOpen className="w-5 h-5 text-orange-600" />
          <span className="font-semibold tracking-tight text-sm text-white">StudyTracker</span>
        </div>
        <div className="flex gap-6 text-sm font-medium text-white/60">
          <a href="#vision" className="hover:text-white transition-colors">Vision</a>
          <a href="#features" className="hover:text-white transition-colors">Product</a>
          <a href="#start" className="hover:text-white transition-colors">Start</a>
        </div>
        <div className="flex gap-3 pl-4 border-l border-white/10">
          <Link href="/login" className="text-sm font-semibold hover:opacity-70 transition-opacity px-2 py-1 text-white">Login</Link>
          <Link href="/register" className="bg-white text-black px-5 py-2 rounded-full text-xs font-bold hover:scale-105 active:scale-95 transition-all">Sign Up</Link>
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

      {/* Slide 2: The "Vision" - Elegant Content Layout */}
      <section id="vision" className="py-40 bg-neutral-800">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-24 items-center">
          <div className="relative">
            <div className="aspect-4/5 bg-neutral-800 rounded-7xl overflow-hidden border border-white/5 flex items-center justify-center p-12 group">
              <div className="bg-neutral-900 w-full h-full rounded-[2.5rem] shadow-2xl p-8 space-y-6 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-700 ease-out border border-white/5">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-400/20" />
                  <div className="w-3 h-3 rounded-full bg-orange-400/20" />
                  <div className="w-3 h-3 rounded-full bg-green-400/20" />
                </div>
                <div className="space-y-3">
                  <div className="h-6 w-1/3 bg-white/5 rounded-full" />
                  <div className="h-24 w-full bg-orange-500/10 rounded-3xl" />
                  <div className="grid grid-cols-2 gap-4">
                    <div className="h-20 bg-white/5 rounded-3xl" />
                    <div className="h-20 bg-white/5 rounded-3xl" />
                  </div>
                </div>
              </div>
            </div>
            {/* Hand-drawn type element vibe */}
            <div className="absolute -bottom-8 -left-8 bg-orange-500 text-white border-2 border-orange-400/20 px-6 py-4 rounded-3xl font-serif italic text-lg shadow-xl -rotate-6">
              "Finally, a focused tool."
            </div>
          </div>

          <div className="space-y-10">
            <h2 className="text-4xl md:text-6xl font-extrabold tracking-tighter leading-none text-white">
              Not just a tool, <br />
              <span className="text-white/30">but Your companion.</span>
            </h2>
            <p className="text-lg text-white/60 font-medium leading-relaxed">
              We ditched the complex spreadsheets for a human-first experience. Our philosophy is simple: clarity leads to confidence. Every interaction is designed to get you in the zone, not keep you in the app.
            </p>
            <div className="grid grid-cols-1 gap-6">
              {[
                { title: "Mastery, redefined", desc: "Our 'Mastery Radar' visualizes knowledge like a skill tree in your favorite RPG." },
                { title: "Flow state first", desc: "No notifications. No distractions. Just pure focus with our minimal timers." }
              ].map((item, i) => (
                <div key={i} className="flex gap-4 items-start border-l-2 border-orange-500/20 pl-6 py-2">
                  <div>
                    <h4 className="font-bold text-xl mb-1 italic text-white">{item.title}</h4>
                    <p className="text-white/50 text-sm font-medium">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Slide 3: Practical Tools - Grid but soft */}
      <section id="features" className="py-40 bg-neutral-800/50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-end gap-8 mb-24">
            <div className="max-w-xl">
              <h2 className="text-4xl md:text-6xl font-extrabold tracking-tighter leading-none mb-8 italic text-white">Product over Hype.</h2>
              <p className="text-lg text-white/50 font-medium">Functional features that actually improve your grades, not just your screen time.</p>
            </div>
            <Link href="/register" className="text-sm font-bold bg-neutral-800 text-white px-8 py-4 rounded-full border border-white/10 hover:bg-white hover:text-black transition-all">Explore the OS</Link>
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            {[
              { 
                label: "Focus",
                title: "Deep Work Sessions", 
                desc: "Integrated timers designed to keep you in the flow longer.",
                icon: <Clock />,
                theme: "bg-blue-500/10 text-blue-400"
              },
              { 
                label: "Planning",
                title: "Smart Calendar", 
                desc: "Automatic exam countdowns that prioritize your review sessions.",
                icon: <Calendar />,
                theme: "bg-orange-500/10 text-orange-400"
              },
              { 
                label: "Growth",
                title: "Progress Map", 
                desc: "A daily contribution graph showing your consistency through the years.",
                icon: <ShieldCheck />,
                theme: "bg-indigo-500/10 text-indigo-400"
              }
            ].map((feature, i) => (
              <div key={i} className="group p-10 rounded-[3rem] bg-neutral-800 border border-white/5 hover:shadow-2xl hover:shadow-black/20 transition-all duration-500">
                <div className={`w-12 h-12 rounded-2xl ${feature.theme} flex items-center justify-center mb-8 border border-white/5`}>
                  {feature.icon}
                </div>
                <span className="text-[10px] font-bold uppercase tracking-widest opacity-30 mb-2 block text-white">{feature.label}</span>
                <h3 className="text-2xl font-bold mb-4 tracking-tight text-white">{feature.title}</h3>
                <p className="text-white/50 font-medium text-sm leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final Call - Very Minimal */}
      <section id="start" className="py-60 min-h-screen flex items-center justify-center px-6">
        <div className="text-center max-w-4xl space-y-16">
          <h2 className="text-6xl md:text-10xl font-extrabold tracking-tighter leading-[0.8] mb-12 text-white">
            Start <br />
            <span className="text-orange-500 italic font-serif font-normal">studying</span> <br />
            today.
          </h2>
          <div className="flex flex-col sm:flex-row gap-8 justify-center items-center">
            <Link href="/register" className="bg-white text-black px-16 py-8 rounded-5xl text-xl font-bold hover:scale-110 active:scale-95 transition-all shadow-2xl">
              Create My Space
            </Link>
          </div>
          <div className="flex justify-center gap-12 opacity-30 text-[10px] font-bold uppercase tracking-widest mt-12 text-white">
            <span>Free Forever</span>
            <span>|</span>
            <span>No Ads</span>
            <span>|</span>
            <span>Open Source</span>
          </div>
        </div>
      </section>

      {/* Footer: Human-Sized */}
      <footer className="py-20 bg-neutral-800 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6 h-full flex flex-col md:flex-row justify-between items-center gap-12 text-sm font-bold opacity-30 uppercase tracking-widest text-white">
           <div className="flex items-center gap-4">
              <span>&copy; 2026</span>
              <div className="w-1 h-1 bg-white rounded-full" />
              <span>StudyTracker</span>
           </div>
           <div className="flex gap-8">
              <a href="#" className="hover:opacity-100 transition-opacity">Twitter</a>
              <a href="#" className="hover:opacity-100 transition-opacity">Email</a>
              <a href="#" className="hover:opacity-100 transition-opacity">Github</a>
           </div>
        </div>
      </footer>
    </div>
  );
}
