'use client';

import { useState, useSyncExternalStore } from 'react';
import { Edit2, Check, X, Zap, Target } from 'lucide-react';

interface StudyGoalProps {
  totalStudyMinutes: number;
}

const STUDY_GOAL_KEY = 'study-goal';
const STUDY_GOAL_EVENT = 'study-goal-change';

function readStoredGoal() {
  if (typeof window === 'undefined') return 120;
  const savedGoal = localStorage.getItem(STUDY_GOAL_KEY);
  const parsed = savedGoal ? parseInt(savedGoal, 10) : NaN;
  return Number.isNaN(parsed) || parsed <= 0 ? 120 : parsed;
}

function subscribeToGoalStore(onStoreChange: () => void) {
  if (typeof window === 'undefined') return () => {};

  const onStorage = () => onStoreChange();
  const onCustom = () => onStoreChange();

  window.addEventListener('storage', onStorage);
  window.addEventListener(STUDY_GOAL_EVENT, onCustom);

  return () => {
    window.removeEventListener('storage', onStorage);
    window.removeEventListener(STUDY_GOAL_EVENT, onCustom);
  };
}

export default function StudyGoal({
  totalStudyMinutes,
}: StudyGoalProps) {
  const goal = useSyncExternalStore(subscribeToGoalStore, readStoredGoal, () => 120);
  const [isEditing, setIsEditing] = useState(false);
  const [tempGoal, setTempGoal] = useState<string>('120');

  const handleSave = () => {
    const newGoal = parseInt(tempGoal);
    if (!isNaN(newGoal) && newGoal > 0) {
      localStorage.setItem(STUDY_GOAL_KEY, newGoal.toString());
      window.dispatchEvent(new Event(STUDY_GOAL_EVENT));
      setIsEditing(false);
    }
  };

  const progress = Math.min(Math.round((totalStudyMinutes / goal) * 100), 100);
  const minutesLeft = Math.max(0, goal - totalStudyMinutes);
  const overGoalMinutes = Math.max(0, totalStudyMinutes - goal);
  const progressColor = progress >= 100 ? '#10b981' : '#8b5cf6';

  return (
    <div className="relative group bg-base-200 border border-base-300 rounded-4xl p-8 overflow-hidden">
      
      <div className="flex flex-col">
        <div className="flex items-center justify-between w-full">
          {/* Header with status badge */}
          <div className="flex flex-col gap-1">
            <h2 className="text-xl font-bold">Daily Mission</h2>
            <p className="text-xs opacity-50 uppercase tracking-tight font-mono">
            Focus on one clear target for today
          </p>
          </div>
          {isEditing ? (
            <div className="flex items-center gap-2 bg-base-300/80 backdrop-blur-sm p-1.5 rounded-2xl border border-base-content/5 shadow-lg">
              <input
                type="number"
                value={tempGoal}
                onChange={(e) => setTempGoal(e.target.value)}
                className="bg-transparent w-20 px-3 py-1.5 outline-none font-bold text-center text-sm"
                autoFocus
                onKeyDown={(e) => e.key === 'Enter' && handleSave()}
              />
              <span className="text-[9px] font-bold opacity-30 uppercase pr-1">min</span>
              <button 
                onClick={handleSave}
                className="p-1.5 bg-emerald-500/15 text-emerald-500 rounded-lg hover:bg-emerald-500/25 transition-colors"
              >
                <Check size={14} strokeWidth={3} />
              </button>
              <button 
                onClick={() => { setIsEditing(false); setTempGoal(goal.toString()); }}
                className="p-1.5 bg-rose-500/15 text-rose-500 rounded-lg hover:bg-rose-500/25 transition-colors"
              >
                <X size={14} strokeWidth={3} />
              </button>
            </div>
          ) : (
            <div 
              onClick={() => {
                setTempGoal(String(goal));
                setIsEditing(true);
              }}
              className="flex flex-col items-end cursor-pointer group/target px-3 py-2 rounded-2xl hover:bg-base-300/40 transition-colors duration-300"
            >
              <div className="flex items-center gap-2">
                <span className="text-3xl font-black tracking-tighter leading-none">{goal}m</span>
                <Edit2 size={14} className="opacity-20 group-hover/target:opacity-50 transition-opacity duration-300" />
              </div>
              <span className="text-[10px] font-bold opacity-30 uppercase tracking-widest mt-1">Target</span>
            </div>
          )}
             </div>

          {/* Main content card */}
          <div className="mt-6 rounded-3xl bg-linear-to-br from-base-300/40 via-base-300/20 to-base-100/10 border border-base-content/8 backdrop-blur-sm p-6">
            <div className="space-y-5">

              {/* Status message */}
              <p className="text-sm opacity-70 font-medium">
                {progress >= 100
                  ? `🎉 Excellent! You're ${overGoalMinutes}m above your daily target.`
                  : `${minutesLeft}m remaining to hit your daily target.`}
              </p>

              {/* Progress bar with enhanced styling */}
              <div>
                <div className="relative h-3 rounded-full bg-base-100/40 overflow-hidden border border-base-content/5 shadow-inner">
                  <div
                    className="h-full rounded-full transition-all duration-1000 ease-out shadow-lg"
                    style={{
                      width: `${progress}%`,
                      backgroundColor: progressColor,
                      boxShadow: `0 0 20px ${progressColor}40`,
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
     

      
      </div>
    </div>
  );
}
