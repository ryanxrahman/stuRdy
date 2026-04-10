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
    <div className="bg-base-200 border border-base-300 rounded-4xl p-8 relative overflow-hidden group">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative z-10">
        <div className="flex flex-col gap-1">
          <h2 className="text-xl font-bold">Daily Mission</h2>
          <p className="text-xs opacity-50 uppercase tracking-widest font-bold">
            {progress === 100 
              ? "Mission accomplished! You're unstoppable today." 
              : `CONQUERED ${totalStudyMinutes}M. ${Math.ceil(hoursLeft * 60)}M TO PEAK.`}
          </p>
        </div>

        <div className="flex flex-col items-end gap-1">
          {isEditing ? (
            <div className="flex items-center gap-2 bg-base-300 p-1 rounded-2xl border border-base-content/5">
              <input
                type="number"
                value={tempGoal}
                onChange={(e) => setTempGoal(e.target.value)}
                className="bg-transparent w-20 px-3 py-1 outline-none font-bold text-center text-sm"
                autoFocus
                onKeyDown={(e) => e.key === 'Enter' && handleSave()}
              />
              <span className="text-[10px] font-bold opacity-30 uppercase pr-2">min</span>
              <button 
                onClick={handleSave}
                className="p-1.5 bg-emerald-500/10 text-emerald-500 rounded-lg hover:bg-emerald-500/20 transition-colors"
              >
                <Check size={14} strokeWidth={3} />
              </button>
              <button 
                onClick={() => { setIsEditing(false); setTempGoal(goal.toString()); }}
                className="p-1.5 bg-rose-500/10 text-rose-500 rounded-lg hover:bg-rose-500/20 transition-colors"
              >
                <X size={14} strokeWidth={3} />
              </button>
            </div>
          ) : (
            <div 
              onClick={() => setIsEditing(true)}
              className="flex flex-col items-end cursor-pointer group/target"
            >
              <div className="flex items-center gap-2">
                <span className="text-2xl font-black tracking-tighter leading-none">{goal}m</span>
                <Edit2 size={12} className="opacity-0 group-hover/target:opacity-30 transition-opacity" />
              </div>
              <span className="text-[10px] font-bold opacity-30 uppercase tracking-widest">Target</span>
            </div>
          )}
        </div>
      </div>

      {/* Progress Bar Container */}
      <div className="mt-8 relative h-3 bg-base-300 rounded-full overflow-hidden border border-base-content/5">
        <div 
          className={`h-full rounded-full transition-all duration-1000 ease-out relative ${
            progress === 100 ? 'bg-emerald-500' : 'bg-primary'
          }`}
          style={{ width: `${progress}%` }}
        >
        </div>
      </div>

      {progress === 100 && (
        <div className="mt-4 flex justify-start">
          <span className="text-[10px] font-bold uppercase tracking-widest opacity-40 italic">
            ELITE STATUS ACHIEVED
          </span>
        </div>
      )}
    </div>
  );
}
