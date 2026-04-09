"use client";

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
  LayoutDashboard
} from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-base-100 selection:bg-primary selection:text-primary-content">
      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 bg-base-100/80 backdrop-blur-md border-b border-base-200">
        <div className="max-w-7xl mx-auto px-6 h-16 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-primary-content" />
            </div>
            <span className="text-xl font-bold tracking-tight">StudyTracker</span>
          </div>
          <div className="hidden md:flex gap-8 text-sm font-medium opacity-70">
            <a href="#features" className="hover:text-primary transition-colors">Features</a>
            <a href="#analytics" className="hover:text-primary transition-colors">Analytics</a>
            <a href="#workflow" className="hover:text-primary transition-colors">Workflow</a>
          </div>
          <div className="flex gap-4">
            <Link href="/login" className="btn btn-ghost btn-sm">Login</Link>
            <Link href="/register" className="btn btn-primary btn-sm px-6">Join Now</Link>
          </div>
        </div>
      </nav>

      {/* Hero Section - Slide 1: The Promise */}
      <section className="min-h-screen flex flex-col items-center justify-center relative pt-16 overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-3xl animate-pulse delay-700" />
        </div>

        <div className="max-w-5xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/5 text-primary text-sm font-medium mb-8 border border-primary/10">
            <Zap className="w-4 h-4" />
            <span>Redefining academic productivity</span>
          </div>
          <h1 className="text-6xl md:text-8xl font-black mb-8 tracking-tighter leading-none mt-4">
            Study <span className="text-primary italic">Smarter</span>, <br />
            Not Harder.
          </h1>
          <p className="text-xl md:text-2xl text-base-content/70 max-w-2xl mx-auto mb-12 leading-relaxed">
            The all-in-one ecosystem designed for high-performance students. 
            Track mastery, visualize progress, and conquer your exams.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/register" className="btn btn-primary btn-lg px-12 text-lg shadow-xl shadow-primary/20">
              Start Your Journey
            </Link>
            <Link href="#features" className="btn btn-ghost btn-lg gap-2">
              See how it works <ChevronDown className="w-5 h-5 animate-bounce" />
            </Link>
          </div>
        </div>
      </section>

      {/* Section 2: Advanced Analytics & Mastery - The "Long" content */}
      <section id="features" className="py-32 bg-base-200/50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
                Visualizing Your <span className="text-primary underline decoration-primary/30">Knowledge</span>.
              </h2>
              <p className="text-lg text-base-content/70 leading-relaxed">
                Stop guessing where you stand. Our advanced mastery algorithm tracks your performance across every subject, giving you a real-time heatmap of your academic strengths and weaknesses.
              </p>
              
              <div className="space-y-6">
                {[
                  { icon: <BarChart3 />, title: "Precision Analytics", desc: "Detailed breakdown of exam performance and preparation levels." },
                  { icon: <Trophy />, title: "Mastery Radar", desc: "Intuitive charts showing subject proficiency at a glance." },
                  { icon: <LayoutDashboard />, title: "Centralized Hub", desc: "One dashboard for all your subjects, notes, and schedules." }
                ].map((item, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="w-12 h-12 shrink-0 rounded-xl bg-white flex items-center justify-center shadow-sm text-primary">
                      {item.icon}
                    </div>
                    <div>
                      <h4 className="font-bold text-lg">{item.title}</h4>
                      <p className="text-base-content/60">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="relative group">
              <div className="absolute -inset-4 bg-primary/20 rounded-3xl blur-2xl group-hover:bg-primary/30 transition-all duration-500 opacity-50" />
              <div className="relative bg-base-100 border border-base-300 rounded-4xl shadow-2xl p-8 overflow-hidden">
                <div className="flex justify-between items-center mb-10">
                  <div className="h-2 w-24 bg-base-200 rounded" />
                  <div className="h-8 w-8 bg-primary/10 rounded-full animate-ping" />
                </div>
                <div className="space-y-4">
                  <div className="h-8 w-full bg-base-200 rounded-lg animate-pulse" />
                  <div className="h-32 w-full bg-primary/5 rounded-2xl flex items-center justify-center">
                    <BarChart3 className="w-12 h-12 text-primary/20" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="h-24 bg-success/5 rounded-2xl border border-success/10 flex flex-col p-4 justify-between">
                      <span className="text-xs font-bold text-success uppercase">Mastery</span>
                      <span className="text-2xl font-black">94%</span>
                    </div>
                    <div className="h-24 bg-warning/5 rounded-2xl border border-warning/10 flex flex-col p-4 justify-between">
                      <span className="text-xs font-bold text-warning uppercase">Focus</span>
                      <span className="text-2xl font-black">2.4h</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 3: The Workflow - Optimized for Results */}
      <section id="workflow" className="py-32">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Built for the <span className="opacity-40">Modern Student</span>.</h2>
            <p className="text-xl text-base-content/60">A streamlined workflow that removes friction and lets you focus on what actually matters: learning.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { 
                title: "Deep Work Sessions", 
                desc: "Integrated pomodoro timers designed to induce flow state and maximize retention.",
                icon: <Clock />,
                color: "text-blue-500",
                bg: "bg-blue-50"
              },
              { 
                title: "Smart Scheduling", 
                desc: "Never miss a deadline. Automated reminders for upcoming exams and review sessions.",
                icon: <Calendar />,
                color: "text-emerald-500",
                bg: "bg-emerald-50"
              },
              { 
                title: "Progress Shield", 
                desc: "Our daily contribution maps keep you accountable and consistent in your efforts.",
                icon: <ShieldCheck />,
                color: "text-purple-500",
                bg: "bg-purple-50"
              }
            ].map((feature, i) => (
              <div key={i} className="group p-8 rounded-5xl bg-base-100 hover:bg-base-200 border border-base-200 transition-all duration-300">
                <div className={`w-14 h-14 rounded-2xl ${feature.bg} ${feature.color} flex items-center justify-center mb-8 group-hover:scale-110 transition-transform`}>
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-bold mb-4">{feature.title}</h3>
                <p className="text-base-content/60 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-24 p-12 rounded-6xl bg-neutral text-neutral-content text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 blur-[100px]" />
            <h2 className="text-4xl md:text-5xl font-bold mb-8 relative z-10">Ready to transform your study habits?</h2>
            <div className="flex flex-col sm:flex-row gap-4 justify-center relative z-10">
              <Link href="/register" className="btn btn-primary btn-lg px-12 hover:scale-105 transition-transform">
                Get Started Now
              </Link>
              <Link href="/login" className="btn btn-outline btn-lg px-12 hover:bg-white hover:text-black">
                Existing Account
              </Link>
            </div>
            <div className="mt-8 flex justify-center gap-6 opacity-50 relative z-10">
              <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4" /> Free to use</div>
              <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4" /> No Credit Card</div>
              <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4" /> Secure Data</div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 border-t border-base-200 text-center">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-primary rounded flex items-center justify-center">
                <BookOpen className="w-3 h-3 text-primary-content" />
              </div>
              <span className="text-lg font-bold">StudyTracker</span>
            </div>
            <p className="opacity-50 text-sm max-w-sm">
              Empowering students to achieve academic excellence through data-driven insights and focused study workflows.
            </p>
            <div className="h-px w-20 bg-base-300 mt-8" />
            <p className="text-xs opacity-40 mt-8">
              &copy; 2026 StudyTracker. Developed by rahscripts. Built with Next.js & Tailwind.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
