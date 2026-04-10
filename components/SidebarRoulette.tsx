'use client';

import React, { useState } from 'react';
import { Shuffle, HelpCircle } from 'lucide-react';

interface Subject {
  _id: string;
  name: string;
}

interface RandomSubjectPickerProps {
  subjects: Subject[];
}

export default function SidebarRoulette({ subjects }: RandomSubjectPickerProps) {
  const [isSpinning, setIsSpinning] = useState(false);
  const [displaySubject, setDisplaySubject] = useState<string>('Roulette');
  const [displayHours, setDisplayHours] = useState<string | null>(null);

  const pickRandom = () => {
    if (subjects.length === 0) return;
    
    setIsSpinning(true);
    setDisplayHours(null);

    let count = 0;
    const maxCycles = 15;
    
    const interval = setInterval(() => {
      const randomSub = subjects[Math.floor(Math.random() * subjects.length)];
      setDisplaySubject(randomSub.name);
      count++;
      
      if (count >= maxCycles) {
        clearInterval(interval);
        const finalSub = subjects[Math.floor(Math.random() * subjects.length)];
        const finalHour = Math.floor(Math.random() * 4) + 1; // 1-4 hours
        
        setDisplaySubject(finalSub.name);
        setDisplayHours(finalHour.toString());
        setIsSpinning(false);
      }
    }, 80);
  };

  return (
    <div className="bg-base-300/50 rounded-2xl p-3 border border-base-content/5 mb-2">
      <div className="flex items-center justify-between mb-2 px-1 text-base-content">
        <span className="text-[10px] font-bold opacity-30 uppercase tracking-widest flex items-center gap-1">
Roulette
        </span>
        {displayHours && !isSpinning && (
          <span className="text-[10px] font-bold bg-primary/10 text-primary px-2 py-0.5 rounded-full border border-primary/20">
            {displayHours}h Session
          </span>
        )}
      </div>

      <div 
        onClick={!isSpinning ? pickRandom : undefined}
        className={`
          group relative flex items-center justify-center py-3 px-2 rounded-xl bg-base-100 border border-base-content/5 
          transition-all active:scale-95 cursor-pointer overflow-hidden
          ${isSpinning ? 'opacity-80' : 'hover:border-primary/30'}
        `}
      >
        <div className={`text-center transition-all duration-75 ${isSpinning ? 'blur-[1px] scale-95 opacity-50' : ''}`}>
          <p className={`text-xs font-bold truncate max-w-35 text-base-content ${!displayHours && !isSpinning ? 'opacity-40' : ''}`}>
            {displaySubject}
          </p>
        </div>

        {!isSpinning && !displayHours && (
          <HelpCircle size={12} className="absolute right-2 text-base-content/10 group-hover:text-primary/50 transition-colors" />
        )}
        
        {isSpinning && (
           <div className="absolute inset-0 bg-primary/5 animate-pulse" />
        )}
      </div>
    </div>
  );
}
