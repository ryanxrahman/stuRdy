"use client";

import { useMemo } from "react";
import { 
  BarChart3,
  TrendingUp, 
  PieChart,
  LineChart,
  Calendar, 
  Clock, 
  Star,
  Award,
  Zap,
  Globe,
  Activity,
  Flame
} from "lucide-react";

type InteractiveDemoProps = {
  totalMinutes: number;
  totalSessions: number;
  totalSubjects: number;
  subjectStats: { name: string; minutes: number }[];
  sessions: any[];
};

export default function InteractiveDemo({ 
  totalMinutes, 
  totalSessions, 
  totalSubjects, 
  subjectStats,
  sessions
}: InteractiveDemoProps) {
  
  const totalHours = (totalMinutes / 60).toFixed(1);
  const totalHoursNum = parseFloat(totalHours);
  const avgSessionMins = totalSessions > 0 ? Math.round(totalMinutes / totalSessions) : 0;
  
  // Calculate some dummy breakdown for the "Apple" style vibe
  const topSubject = subjectStats[0];
  const topSubjectPct = topSubject ? Math.round((topSubject.minutes / totalMinutes) * 100) : 0;

  // Calculate session intensity (mocking 76% desktop style)
  const isWeekendStudy = sessions.filter(s => {
    const d = new Date(s.date).getDay();
    return d === 0 || d === 6;
  }).length;
  const weekendPct = totalSessions > 0 ? Math.round((isWeekendStudy / totalSessions) * 100) : 0;

  return (
    <section className="my-32 max-md:p-4">

      {/* Chart Grid Section */}
      <div className="w-full max-w-6xl mx-auto mt-16">
        <div className="flex flex-col items-center text-center mb-12">
          <p className="text-sm text-violet-400 my-4">deep insights</p>
          <h3 className="text-4xl md:text-6xl font-black tracking-tight mb-4">Advanced Analytics <span className="bg-primary text-white px-2">Suite</span></h3>
          <p className="opacity-50 max-w-lg text-sm md:text-base">Multiple visualization styles showcasing different study patterns</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Bar Chart - Subject Distribution */}
          <div className="bg-base-200 rounded-3xl p-6 border border-base-300 hover:bg-base-300 transition-all group">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-black text-sm uppercase tracking-wider opacity-70">Subject Distribution</h4>
              <BarChart3 size={16} className="opacity-30 group-hover:opacity-60 transition-opacity" />
            </div>
            <div className="space-y-3">
              {subjectStats.slice(0, 3).map((subject, idx) => {
                const pct = Math.round((subject.minutes / totalMinutes) * 100);
                return (
                  <div key={idx} className="space-y-1">
                    <div className="flex justify-between items-center text-xs">
                      <span className="opacity-60 truncate">{subject.name}</span>
                      <span className="font-bold text-primary">{pct}%</span>
                    </div>
                    <div className="h-1.5 bg-base-300 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-linear-to-r from-primary to-violet-500 transition-all"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Line Chart - Time Trend */}
          <div className="bg-base-200 rounded-3xl p-6 border border-base-300 hover:bg-base-300 transition-all group">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-black text-sm uppercase tracking-wider opacity-70">Activity Trend</h4>
              <LineChart size={16} className="opacity-30 group-hover:opacity-60 transition-opacity" />
            </div>
            <div className="flex items-end gap-1 h-20 justify-around">
              {[65, 45, 78, 50, 92, 58, 88].map((value, idx) => (
                <div
                  key={idx}
                  className="flex-1 bg-linear-to-t from-primary/40 to-primary rounded-t-sm hover:from-primary/60 hover:to-primary transition-all relative group/bar"
                  style={{ height: `${value}%` }}
                >
                  <div className="absolute -top-6 left-1/2 -translate-x-1/2 opacity-0 group-hover/bar:opacity-100 transition-opacity text-[9px] font-bold bg-base-300 text-base-content px-1.5 py-0.5 rounded whitespace-nowrap z-10">
                    {value}%
                  </div>
                </div>
              ))}
            </div>
            <div className="text-center text-[10px] opacity-30 mt-4 font-mono">Mon-Sun</div>
          </div>

          {/* Area Chart - Cumulative Progress */}
          <div className="bg-base-200 rounded-3xl p-6 border border-base-300 hover:bg-base-300 transition-all group">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-black text-sm uppercase tracking-wider opacity-70">Total Growth</h4>
              <TrendingUp size={16} className="opacity-30 group-hover:opacity-60 transition-opacity" />
            </div>
            <div className="flex items-end gap-1 h-20 justify-around relative">
              <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 100" style={{ opacity: 0.3 }}>
                <path 
                  d="M 0,80 L 20,60 L 40,40 L 60,30 L 80,20 L 100,10 L 100,100 L 0,100 Z" 
                  fill="url(#areaGradient)" 
                />
                <defs>
                  <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#10b981" stopOpacity="0.8" />
                    <stop offset="100%" stopColor="#10b981" stopOpacity="0.1" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="flex-1 relative h-full flex items-end justify-center">
                <div className="text-[10px] font-black text-emerald-400">↗ +24%</div>
              </div>
            </div>
            <div className="text-center text-[10px] opacity-30 mt-4 font-mono">30 days</div>
          </div>

          {/* Daily Breakdown */}
          <div className="bg-base-200 rounded-3xl p-6 border border-base-300 hover:bg-base-300 transition-all group">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-black text-sm uppercase tracking-wider opacity-70">Daily Avg</h4>
              <Activity size={16} className="opacity-30 group-hover:opacity-60 transition-opacity" />
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-end">
                <span className="text-[10px] opacity-60">Peak Hour</span>
                <span className="font-black text-lg text-primary">{avgSessionMins}m</span>
              </div>
              <div className="flex justify-between text-[10px] opacity-40">
                <span>Avg Session</span>
                <span>{(avgSessionMins * 0.8).toFixed(0)}m</span>
              </div>
              <div className="h-8 bg-linear-to-r from-orange-500/20 to-red-500/20 rounded-lg flex items-center overflow-hidden border border-orange-500/10">
                <div 
                  className="h-full bg-linear-to-r from-orange-500 to-red-500 transition-all"
                  style={{ width: `${Math.min(100, (avgSessionMins / 60) * 100)}%` }}
                />
              </div>
            </div>
          </div>

          {/* Heat Map Style */}
          <div className="bg-base-200 rounded-3xl p-6 border border-base-300 hover:bg-base-300 transition-all group">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-black text-sm uppercase tracking-wider opacity-70">Intensity Map</h4>
              <Flame size={16} className="opacity-30 group-hover:opacity-60 transition-opacity" />
            </div>
            <div className="grid grid-cols-7 gap-1">
              {[8,3,6,9,5,7,4,2,8,9,3,5,7,6].map((val, idx) => (
                <div
                  key={idx}
                  className="aspect-square rounded-lg border border-white/5 flex items-center justify-center text-[10px] font-bold transition-all hover:scale-110"
                  style={{
                    backgroundColor: `rgba(34, 197, 94, ${val / 10})`,
                    borderColor: `rgba(34, 197, 94, ${Math.min(0.3, val / 30)})`
                  }}
                  title={`${val} sessions`}
                >
                  {val}
                </div>
              ))}
            </div>
            <div className="text-center text-[10px] opacity-30 mt-3 font-mono">Weekly Heat</div>
          </div>

          {/* Time Distribution */}
          <div className="bg-base-200 rounded-3xl p-6 border border-base-300 hover:bg-base-300 transition-all group">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-black text-sm uppercase tracking-wider opacity-70">Time Split</h4>
              <Clock size={16} className="opacity-30 group-hover:opacity-60 transition-opacity" />
            </div>
            <div className="space-y-2">
              {[
                { label: 'Morning', pct: 32, color: 'bg-amber-500' },
                { label: 'Afternoon', pct: 45, color: 'bg-blue-500' },
                { label: 'Evening', pct: 23, color: 'bg-purple-500' },
              ].map((time, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex justify-between text-[10px]">
                    <span className="opacity-60">{time.label}</span>
                    <span className="font-bold">{time.pct}%</span>
                  </div>
                  <div className="h-1.5 bg-base-300 rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${time.color} transition-all`}
                      style={{ width: `${time.pct}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Streak Counter */}
          <div className="bg-base-200 rounded-3xl p-6 border border-base-300 hover:bg-base-300 transition-all group">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-black text-sm uppercase tracking-wider opacity-70">Streaks</h4>
              <Flame size={16} className="text-orange-400 opacity-30 group-hover:opacity-60 transition-opacity" />
            </div>
            <div className="space-y-4">
              <div className="text-center">
                <div className="text-5xl font-black text-orange-400 mb-2">{Math.floor(totalSessions / 7)}</div>
                <div className="text-[10px] opacity-40 uppercase font-bold">Days Active</div>
              </div>
              <div className="flex justify-around items-end h-12">
                {[1,1,1,0,1,1,1].map((val, i) => (
                  <div 
                    key={i}
                    className={`w-3 rounded-t ${val ? 'bg-orange-400 h-10' : 'bg-base-300 h-3'} transition-all`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Focus Score */}
          <div className="bg-base-200 rounded-3xl p-6 border border-base-300 hover:bg-base-300 transition-all group">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-black text-sm uppercase tracking-wider opacity-70">Focus Score</h4>
              <Star size={16} className="text-yellow-400 opacity-30 group-hover:opacity-60 transition-opacity" />
            </div>
            <div className="flex items-center justify-center flex-col gap-3">
              <div className="relative w-20 h-20 flex items-center justify-center">
                <svg className="absolute w-full h-full -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="6" />
                  <circle 
                    cx="50" cy="50" r="45" fill="none" 
                    stroke="url(#scoreGrad)" 
                    strokeWidth="6"
                    strokeDasharray={`${Math.min(282, (avgSessionMins / 60) * 282)} 282`}
                    strokeLinecap="round"
                  />
                  <defs>
                    <linearGradient id="scoreGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#fbbf24" />
                      <stop offset="100%" stopColor="#f59e0b" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="text-2xl font-black text-yellow-400">{Math.min(100, Math.round((avgSessionMins / 60) * 100))}</div>
              </div>
              <div className="text-center text-[10px] opacity-40">out of 100</div>
            </div>
          </div>

          {/* Goal Progress */}
          <div className="bg-base-200 rounded-3xl p-6 border border-base-300 hover:bg-base-300 transition-all group">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-black text-sm uppercase tracking-wider opacity-70">Goal Progress</h4>
              <Award size={16} className="opacity-30 group-hover:opacity-60 transition-opacity" />
            </div>
            <div className="space-y-3">
              <div className="flex justify-between text-[10px]">
                <span className="opacity-60">Monthly Target</span>
                <span className="font-bold text-emerald-400">{Math.min(100, Math.round((totalHoursNum / 100) * 100))}%</span>
              </div>
              <div className="h-2 bg-base-300 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-linear-to-r from-emerald-400 to-green-500 transition-all"
                  style={{ width: `${Math.min(100, Math.round((totalHoursNum / 100) * 100))}%` }}
                />
              </div>
              <div className="text-[9px] opacity-40 mt-2">
                <div>{totalHours}h / 100h</div>
                <div>{100 - Math.round((totalHoursNum / 100) * 100)}h remaining</div>
              </div>
            </div>
          </div>

          {/* Subject Mastery */}
          <div className="bg-base-200 rounded-3xl p-6 border border-base-300 hover:bg-base-300 transition-all group">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-black text-sm uppercase tracking-wider opacity-70">Top Subjects</h4>
              <TrendingUp size={16} className="opacity-30 group-hover:opacity-60 transition-opacity" />
            </div>
            <div className="space-y-2">
              {subjectStats.slice(0, 3).map((subject, idx) => (
                <div key={idx} className="flex items-center justify-between text-[10px] p-2 rounded-lg bg-base-300 hover:bg-base-400 transition-all">
                  <span className="opacity-60 truncate flex-1">{idx + 1}. {subject.name}</span>
                  <span className="font-bold text-primary ml-2">{Math.round(subject.minutes / 60)}h</span>
                </div>
              ))}
            </div>
          </div>

          {/* Performance Badges */}
          <div className="bg-base-200 rounded-3xl p-6 border border-base-300 hover:bg-base-300 transition-all group">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-black text-sm uppercase tracking-wider opacity-70">Achievements</h4>
              <Award size={16} className="opacity-30 group-hover:opacity-60 transition-opacity" />
            </div>
            <div className="grid grid-cols-3 gap-2">
              {[
                { emoji: '🔥', label: 'Hot Streak', unlocked: totalSessions > 10 },
                { emoji: '⚡', label: 'Speed Run', unlocked: avgSessionMins > 45 },
                { emoji: '🎯', label: 'Focused', unlocked: topSubjectPct > 50 },
                { emoji: '📈', label: 'Growth', unlocked: totalSubjects > 3 },
                { emoji: '🏆', label: 'Champion', unlocked: totalSessions > 50 },
                { emoji: '💎', label: 'Diamond', unlocked: totalHoursNum > 50 },
              ].map((badge, idx) => (
                <div 
                  key={idx}
                  className={`flex flex-col items-center justify-center p-3 rounded-2xl transition-all ${
                    badge.unlocked 
                      ? 'bg-yellow-500/20 border border-yellow-500/30' 
                      : 'bg-base-300 border border-base-300 opacity-40'
                  }`}
                >
                  <div className="text-xl mb-1">{badge.emoji}</div>
                  <div className="text-[8px] opacity-60 text-center">{badge.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Weekly Comparison */}
          <div className="bg-base-200 rounded-3xl p-6 border border-base-300 hover:bg-base-300 transition-all group">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-black text-sm uppercase tracking-wider opacity-70">Week vs Avg</h4>
              <BarChart3 size={16} className="opacity-30 group-hover:opacity-60 transition-opacity" />
            </div>
            <div className="space-y-2">
              <div className="flex items-end gap-2 h-16">
                <div className="flex-1 flex flex-col items-center">
                  <div className="w-full bg-linear-to-t from-cyan-500/40 to-cyan-500 rounded-t h-12 transition-all" />
                  <div className="text-[8px] opacity-40 mt-1">This Week</div>
                </div>
                <div className="flex-1 flex flex-col items-center">
                  <div className="w-full bg-linear-to-t from-white/10 to-white/20 rounded-t h-8 transition-all" />
                  <div className="text-[8px] opacity-40 mt-1">Avg</div>
                </div>
              </div>
              <div className="text-[9px] opacity-40 text-center">+12% vs average</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}