"use client";

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { TrendingUp, Zap, Clock, Activity } from 'lucide-react';

type Session = {
  date: string;
  duration: number;
  subjectId: string;
};

type StudyStatsProps = {
  sessions: Session[];
};

export default function StudyStats({ sessions }: StudyStatsProps) {
  if (sessions.length === 0) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-base-200 rounded-4xl border border-base-300 p-8">
          <h2 className="text-xl font-bold mb-1">Study Stats</h2>
          <p className="text-xs opacity-40 mb-6 uppercase tracking-widest font-bold">Overview</p>
          <div className="flex flex-col items-center justify-center p-12 text-center opacity-40 italic h-full">
            No study sessions yet. Start your first timer!
          </div>
        </div>
      </div>
    );
  }

  // Calculate statistics
  const totalSeconds = sessions.reduce((acc, s) => acc + s.duration, 0);
  const totalMinutes = totalSeconds / 60;
  const totalHours = totalMinutes / 60;
  const avgSessionMinutes = Math.round(totalMinutes / sessions.length);

  // Calculate streak (consecutive days studied)
  const uniqueDates = new Set(sessions.map(s => new Date(s.date).toDateString()));
  const sortedDates = Array.from(uniqueDates)
    .map(d => new Date(d))
    .sort((a, b) => b.getTime() - a.getTime());

  let currentStreak = 0;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  for (let i = 0; i < sortedDates.length; i++) {
    const checkDate = new Date(today);
    checkDate.setDate(checkDate.getDate() - i);
    
    const hasSession = sortedDates.some(d => d.toDateString() === checkDate.toDateString());
    if (hasSession) {
      currentStreak++;
    } else if (i === 0) {
      break;
    } else {
      break;
    }
  }

  // Prepare data for chart - last 14 days
  const chartData: { date: string; minutes: number; }[] = [];
  const last14Days: { [key: string]: number } = {};

  for (let i = 13; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateStr = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    last14Days[dateStr] = 0;
  }

  sessions.forEach(s => {
    const d = new Date(s.date);
    const dateStr = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    if (dateStr in last14Days) {
      last14Days[dateStr] += s.duration / 60;
    }
  });

  Object.entries(last14Days).forEach(([date, minutes]) => {
    chartData.push({ date, minutes: Math.round(minutes) });
  });

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const mins = payload[0].value;
      return (
        <div className="bg-black text-white px-4 py-2 rounded-xl text-sm shadow-2xl">
          <p className="opacity-80">{mins}m</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Stats Cards */}
      <div className="bg-base-200 rounded-4xl border border-base-300 p-8">
        <h2 className="text-xl font-bold mb-6">Study Stats</h2>
        
        <div className="space-y-4">
          {/* Total Time */}
          <div className="flex items-start justify-between p-4 bg-base-300/50 rounded-2xl">
            <div className="flex gap-3">
              <Clock className="text-violet-400 opacity-80 shrink-0" size={20} />
              <div>
                <p className="text-xs opacity-50 font-bold uppercase tracking-wider">Total Studied</p>
                <p className="text-2xl font-black">
                  {totalHours.toFixed(1)}h
                </p>
                <p className="text-xs opacity-40 mt-1">{totalMinutes.toFixed(0)} minutes</p>
              </div>
            </div>
          </div>

          {/* Streak */}
          <div className="flex items-start justify-between p-4 bg-base-300/50 rounded-2xl">
            <div className="flex gap-3">
              <Zap className="text-amber-400 opacity-80 shrink-0" size={20} />
              <div>
                <p className="text-xs opacity-50 font-bold uppercase tracking-wider">Current Streak</p>
                <p className="text-2xl font-black">{currentStreak}d</p>
                <p className="text-xs opacity-40 mt-1">consecutive days</p>
              </div>
            </div>
          </div>

          {/* Average Session */}
          <div className="flex items-start justify-between p-4 bg-base-300/50 rounded-2xl">
            <div className="flex gap-3">
              <Activity className="text-emerald-400 opacity-80 shrink-0" size={20} />
              <div>
                <p className="text-xs opacity-50 font-bold uppercase tracking-wider">Avg Session</p>
                <p className="text-2xl font-black">{avgSessionMinutes}m</p>
                <p className="text-xs opacity-40 mt-1">{sessions.length} total sessions</p>
              </div>
            </div>
          </div>

          {/* Productivity */}
          <div className="flex items-start justify-between p-4 bg-base-300/50 rounded-2xl">
            <div className="flex gap-3">
              <TrendingUp className="text-cyan-400 opacity-80 shrink-0" size={20} />
              <div>
                <p className="text-xs opacity-50 font-bold uppercase tracking-wider">Active Days</p>
                <p className="text-2xl font-black">{uniqueDates.size}</p>
                <p className="text-xs opacity-40 mt-1">days with sessions</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="bg-base-200 rounded-4xl border border-base-300 p-8">
        <h2 className="text-xl font-bold mb-1">Study Trend</h2>
        <p className="text-xs opacity-40 mb-6 uppercase tracking-widest font-bold">Last 14 Days</p>
        <div className="w-full h-62.5">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorMinutes" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.15} />
              <XAxis 
                dataKey="date" 
                tick={{ fontSize: 12, opacity: 0.6 }}
                axisLine={false}
              />
              <YAxis 
                tick={{ fontSize: 12, opacity: 0.6 }}
                axisLine={false}
                label={{ value: 'Minutes', angle: -90, position: 'insideLeft' }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area 
                type="monotone" 
                dataKey="minutes" 
                stroke="#8b5cf6" 
                strokeWidth={2}
                fillOpacity={1} 
                fill="url(#colorMinutes)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
