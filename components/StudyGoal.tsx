'use client';

import { useState, useEffect } from 'react';
import { Target, Edit2, Check, X } from 'lucide-react';

interface StudyGoalProps {
  totalStudyMinutes: number;
}

export default function StudyGoal({ totalStudyMinutes }: StudyGoalProps) {
  const [goal, setGoal] = useState<number>(120); // Default 2 hours
  const [isEditing, setIsEditing] = useState(false);
  const [tempGoal, setTempGoal] = useState<string>("120");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const savedGoal = localStorage.getItem('study-goal');
    if (savedGoal) {
      setGoal(parseInt(savedGoal));
      setTempGoal(savedGoal);
    }
    setMounted(true);
  }, []);

  const handleSave = () => {
    const newGoal = parseInt(tempGoal);
    if (!isNaN(newGoal) && newGoal > 0) {
      setGoal(newGoal);
      localStorage.setItem('study-goal', newGoal.toString());
      setIsEditing(false);
    }
  };

  if (!mounted) return null;

  const progress = Math.min(Math.round((totalStudyMinutes / goal) * 100), 100);
  const hoursLeft = Math.max(0, (goal - totalStudyMinutes) / 60);

  return (
    <div className="bg-base-200 border border-base-300 rounded-[2.5rem] p-8 relative overflow-hidden group">
      {/* Playful background element */}
      <div className={`absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 blur-3xl transition-all duration-1000 ${progress === 100 ? 'bg-emerald-500/20 scale-150' : ''}`} />
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative z-10">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-2xl ${progress === 100 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-primary/10 text-primary'}`}>
              <Target size={24} />
            </div>
            <h2 className="text-2xl font-black italic tracking-tight">Daily Mission</h2>
          </div>
          <p className="opacity-50 text-sm font-medium">
            {progress === 100 
              ? "Mission accomplished! You're unstoppable today." 
              : `You've conquered ${totalStudyMinutes}m. Just ${Math.ceil(hoursLeft * 60)}m more to reach your peak.`}
          </p>
        </div>

        <div className="flex flex-col items-end gap-1">
          {isEditing ? (
            <div className="flex items-center gap-2 bg-base-300 p-1 rounded-2xl border border-base-content/5">
              <input
                type="number"
                value={tempGoal}
                onChange={(e) => setTempGoal(e.target.value)}
                className="bg-transparent w-20 px-3 py-1 outline-none font-bold text-center"
                autoFocus
                onKeyDown={(e) => e.key === 'Enter' && handleSave()}
              />
              <span className="text-xs font-bold opacity-30 uppercase pr-2">min</span>
              <button 
                onClick={handleSave}
                className="p-2 bg-emerald-500/20 text-emerald-400 rounded-xl hover:bg-emerald-500/30 transition-colors"
              >
                <Check size={16} strokeWidth={3} />
              </button>
              <button 
                onClick={() => { setIsEditing(false); setTempGoal(goal.toString()); }}
                className="p-2 bg-rose-500/20 text-rose-400 rounded-xl hover:bg-rose-500/30 transition-colors"
              >
                <X size={16} strokeWidth={3} />
              </button>
            </div>
          ) : (
            <div 
              onClick={() => setIsEditing(true)}
              className="group/btn flex items-center gap-3 cursor-pointer bg-base-300/50 hover:bg-base-300 px-5 py-3 rounded-2xl border border-base-content/5 transition-all active:scale-95"
            >
              <div className="flex flex-col items-end">
                <span className="text-2xl font-black tracking-tighter leading-none">{goal}m</span>
                <span className="text-[10px] font-bold opacity-30 uppercase tracking-widest">Target</span>
              </div>
              <Edit2 size={14} className="opacity-0 group-hover/btn:opacity-50 transition-opacity" />
            </div>
          )}
        </div>
      </div>

      {/* Progress Bar Container */}
      <div className="mt-8 relative h-6 bg-base-300 rounded-full overflow-hidden border border-base-content/5 p-1">
        <div 
          className={`h-full rounded-full transition-all duration-1000 ease-out relative overflow-hidden ${
            progress === 100 ? 'bg-linear-to-r from-emerald-500 to-teal-400' : 'bg-linear-to-r from-primary to-violet-500'
          }`}
          style={{ width: `${progress}%` }}
        >
          {/* Animated shine effect */}
          <div className="absolute inset-0 bg-white/20 -translate-x-full animate-[shimmer_2s_infinite]" 
               style={{ backgroundImage: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)' }} />
          
          {/* Progress label */}
          {progress > 10 && (
            <span className="absolute inset-y-0 right-3 flex items-center text-[10px] font-black text-white uppercase tracking-tighter mix-blend-overlay">
              {progress}% DONE
            </span>
          )}
        </div>
      </div>

      {progress === 100 && (
        <div className="mt-4 flex justify-center animate-bounce">
          <span className="text-[10px] font-black italic bg-emerald-500/10 text-emerald-500 px-4 py-1 rounded-full border border-emerald-500/20">
            ELITE STATUS ACHIEVED ⚡️
          </span>
        </div>
      )}
    </div>
  );
}
