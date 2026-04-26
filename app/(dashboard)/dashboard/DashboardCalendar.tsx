'use client';

import { useState } from 'react';
import { 
  format, 
  addMonths, 
  subMonths, 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  isSameMonth, 
  isSameDay, 
  eachDayOfInterval, 
  differenceInDays,
  parseISO
} from 'date-fns';
import { ChevronLeft, ChevronRight, Flame, Clock } from 'lucide-react';

interface Session {
  _id: string;
  date: string;
  duration: number;
  subjectId: string;
}

interface Subject {
  _id: string;
  name: string;
}

export default function DashboardCalendar({ sessions, subjects }: { sessions: Session[], subjects: Subject[] }) {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const onNextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const onPrevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);

  const calendarDays = eachDayOfInterval({
    start: startDate,
    end: endDate,
  });

  // Assign fixed colors to subjects
  const subjectColors = [
    'bg-violet-500', 'bg-emerald-500', 'bg-blue-500', 'bg-amber-500', 
    'bg-rose-500', 'bg-cyan-500', 'bg-indigo-500', 'bg-orange-500'
  ];

  const getSubjectColor = (id: string) => {
    const index = subjects.findIndex(s => s._id === id);
    return subjectColors[index % subjectColors.length];
  };

  const getSubjectName = (id: string) => {
    return subjects.find(s => s._id === id)?.name || 'Unknown';
  };

  const calculateStreak = () => {
    if (sessions.length === 0) return 0;
    const dates = sessions.map(s => format(parseISO(s.date), 'yyyy-MM-dd'));
    const uniqueDates = Array.from(new Set(dates)).sort((a, b) => b.localeCompare(a));
    let streak = 0;
    let today = new Date();
    today.setHours(0, 0, 0, 0);
    let lastDate = parseISO(uniqueDates[0]);
    lastDate.setHours(0, 0, 0, 0);
    if (differenceInDays(today, lastDate) > 1) return 0;
    streak = 1;
    for (let i = 0; i < uniqueDates.length - 1; i++) {
      const d1 = parseISO(uniqueDates[i]);
      const d2 = parseISO(uniqueDates[i+1]);
      if (differenceInDays(d1, d2) === 1) streak++;
      else break;
    }
    return streak;
  };

  const dayData = (day: Date) => {
    const daySessions = sessions.filter(s => isSameDay(parseISO(s.date), day));
    const sessionsBySubject: Record<string, number> = {};
    daySessions.forEach(s => {
      sessionsBySubject[s.subjectId] = (sessionsBySubject[s.subjectId] || 0) + (s.duration / 60);
    });
    return Object.entries(sessionsBySubject).map(([id, mins]) => ({ id, mins }));
  };

  const totalMonthlyMinutes = sessions
    .filter(s => isSameMonth(parseISO(s.date), currentMonth))
    .reduce((acc, s) => acc + (s.duration / 60), 0);

  return (
    <div className="bg-base-200 p-8 rounded-[2.5rem] border border-base-300 shadow-sm flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Global Study Log</h2>
          <p className="text-sm opacity-50 font-mono uppercase tracking-tighter">All subjects combined</p>
        </div>
        
        <div className="flex items-center gap-6">
          <div className="flex flex-col items-end">
             <div className="flex items-center gap-1 text-orange-500 font-black">
                <Flame size={20} fill="currentColor" />
                <span className="text-xl">{calculateStreak()}</span>
             </div>
             <p className="text-[10px] opacity-50 uppercase font-bold tracking-widest">Global Streak</p>
          </div>

          <div className="flex flex-col items-end">
             <div className="flex items-center gap-1 text-primary font-black text-xl">
                <Clock size={16} />
                <span>{Math.round(totalMonthlyMinutes < 60 ? totalMonthlyMinutes : totalMonthlyMinutes / 60)}{totalMonthlyMinutes < 60 ? 'm' : 'h'}</span>
             </div>
             <p className="text-[10px] opacity-50 uppercase font-bold tracking-widest">Total Month</p>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between bg-base-100 p-4 rounded-3xl border border-base-300">
        <button onClick={onPrevMonth} className="hover:text-primary transition-colors p-1">
          <ChevronLeft size={24} />
        </button>
        <span className="font-bold text-lg uppercase tracking-tight">{format(currentMonth, 'MMMM yyyy')}</span>
        <button onClick={onNextMonth} className="hover:text-primary transition-colors p-1">
          <ChevronRight size={24} />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-2">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
          <div key={d} className="text-center text-[10px] font-bold opacity-30 uppercase py-2 tracking-widest">{d}</div>
        ))}
        {calendarDays.map((day, idx) => {
          const stats = dayData(day);
          const hasSessions = stats.length > 0;
          const isSelectedMonth = isSameMonth(day, currentMonth);
          
          return (
            <div 
              key={idx} 
              className={`
                aspect-square rounded-2xl flex flex-col items-center justify-center relative transition-all group
                ${!isSelectedMonth ? 'opacity-20 italic' : ''}
                ${hasSessions ? 'bg-base-100/30' : 'bg-base-100/50 border border-base-300'}
                ${isSameDay(day, new Date()) ? 'ring-2 ring-primary ring-offset-2 ring-offset-base-200' : ''}
              `}
            >
              <span className={`text-xs font-bold z-10 ${hasSessions ? 'text-white drop-shadow-md' : 'opacity-40'}`}>
                {format(day, 'd')}
              </span>
              
              {hasSessions && (
                <div className="absolute inset-0 flex flex-col overflow-hidden rounded-2xl">
                  {stats.map((stat, i) => (
                    <div 
                      key={i} 
                      style={{ height: `${(1 / stats.length) * 100}%` }}
                      className={`${getSubjectColor(stat.id)} opacity-80`}
                    />
                  ))}
                </div>
              )}

              {/* Hover Tooltip */}
              {hasSessions && (
                <div className="hidden group-hover:flex absolute bottom-full left-1/2 -translate-x-1/2 mb-2 p-3 bg-base-300 border border-base-100 rounded-2xl shadow-2xl z-50 min-w-40 flex-col">
                  <p className="text-[10px] font-bold opacity-50 mb-2 uppercase border-b border-base-100 pb-1">{format(day, 'MMM d, yyyy')}</p>
                  {stats.map((stat, i) => (
                    <div key={i} className="flex items-center justify-between gap-4 text-xs mb-1 last:mb-0 text-white">
                      <div className="flex items-center gap-1.5 overflow-hidden">
                         <div className={`w-2 h-2 rounded-full shrink-0 ${getSubjectColor(stat.id)}`} />
                         <span className="font-medium truncate">{getSubjectName(stat.id)}</span>
                      </div>
                      <span className="font-bold shrink-0">{Math.round(stat.mins)}m</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
