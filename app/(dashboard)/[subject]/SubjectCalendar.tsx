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
  addDays,
  differenceInDays,
  parseISO
} from 'date-fns';
import { ChevronLeft, ChevronRight, Flame, Clock } from 'lucide-react';

interface Session {
  _id: string;
  date: string;
  duration: number;
}

export default function SubjectCalendar({ sessions }: { sessions: Session[] }) {
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

  // Calculate Streak
  const calculateStreak = () => {
    if (sessions.length === 0) return 0;
    
    const dates = sessions.map(s => format(parseISO(s.date), 'yyyy-MM-dd'));
    const uniqueDates = Array.from(new Set(dates)).sort((a, b) => b.localeCompare(a));
    
    let streak = 0;
    let today = new Date();
    today.setHours(0, 0, 0, 0);
    
    let lastDate = parseISO(uniqueDates[0]);
    lastDate.setHours(0, 0, 0, 0);

    const diff = differenceInDays(today, lastDate);
    
    if (diff > 1) return 0; // Streak broken

    streak = 1;
    for (let i = 0; i < uniqueDates.length - 1; i++) {
      const d1 = parseISO(uniqueDates[i]);
      const d2 = parseISO(uniqueDates[i+1]);
      if (differenceInDays(d1, d2) === 1) {
        streak++;
      } else {
        break;
      }
    }
    return streak;
  };

  const getSessionsForDay = (day: Date) => {
    return sessions.filter(s => isSameDay(parseISO(s.date), day));
  };

  const totalMonthlyMinutes = sessions
    .filter(s => isSameMonth(parseISO(s.date), currentMonth))
    .reduce((acc, s) => acc + (s.duration / 60), 0);

  return (
    <div className="bg-base-200 p-8 rounded-[2.5rem] border border-base-300 shadow-sm flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Study Calendar</h2>
          <p className="text-sm opacity-50 font-mono uppercase tracking-tighter">Your monthly journey</p>
        </div>
        
        <div className="flex items-center gap-6">
          <div className="flex flex-col items-end">
             <div className="flex items-center gap-1 text-orange-500 font-black">
                <Flame size={20} fill="currentColor" />
                <span className="text-xl">{calculateStreak()}</span>
             </div>
             <p className="text-[10px] opacity-50 uppercase font-bold tracking-widest">Day Streak</p>
          </div>

          <div className="flex flex-col items-end">
             <div className="flex items-center gap-1 text-primary font-black text-xl">
                <Clock size={16} />
                <span>{Math.round(totalMonthlyMinutes < 60 ? totalMonthlyMinutes : totalMonthlyMinutes / 60)}{totalMonthlyMinutes < 60 ? 'm' : 'h'}</span>
             </div>
             <p className="text-[10px] opacity-50 uppercase font-bold tracking-widest">This Month</p>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between bg-base-100 p-4 rounded-3xl border border-base-300">
        <button onClick={onPrevMonth} className="hover:text-primary cursor-pointer transition-colors p-1">
          <ChevronLeft size={24} />
        </button>
        <span className="font-bold text-lg uppercase tracking-tight">{format(currentMonth, 'MMMM yyyy')}</span>
        <button onClick={onNextMonth} className="hover:text-primary cursor-pointer transition-colors p-1">
          <ChevronRight size={24} />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-2">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d: string) => (
          <div key={d} className="text-center text-[10px] font-bold opacity-30 uppercase py-2 ls-widest">{d}</div>
        ))}
        {calendarDays.map((day: Date, idx: number) => {
          const daySessions = getSessionsForDay(day);
          const hasSessions = daySessions.length > 0;
          const isSelected = isSameMonth(day, currentMonth);
          const totalDayMinutes = daySessions.reduce((acc, s) => acc + (s.duration / 60), 0);
          
          return (
            <div 
              key={idx} 
              className={`
                aspect-square rounded-2xl flex flex-col items-center justify-center relative transition-all group
                ${!isSelected ? 'opacity-20 italic' : ''}
                ${hasSessions ? 'bg-primary/10 border border-primary/20' : 'bg-base-100/50 border border-base-300'}
                ${isSameDay(day, new Date()) ? 'ring-2 ring-primary ring-offset-2 ring-offset-base-200' : ''}
              `}
            >
              <span className={`text-sm font-bold ${hasSessions ? 'text-primary' : 'opacity-40'}`}>
                {format(day, 'd')}
              </span>
              
              {hasSessions && (
                <div className="absolute bottom-1.5 flex flex-col items-center">
                  <div className="w-1 h-1 rounded-full bg-primary" />
                  <span className="text-[8px] font-black hidden group-hover:block absolute -top-10 bg-base-300 px-2 py-1 rounded shadow-lg whitespace-nowrap z-10 border border-base-300">
                     {Math.round(totalDayMinutes)} mins
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
