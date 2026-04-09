'use client';

import React, { useState, useEffect } from 'react';
import { Shuffle, Clock, BookOpen } from 'lucide-react';

interface Subject {
  _id: string;
  name: string;
}

interface RandomSubjectPickerProps {
  subjects: Subject[];
}

export default function RandomSubjectPicker({ subjects }: RandomSubjectPickerProps) {
  const [isSpinning, setIsSpinning] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [selectedHours, setSelectedHours] = useState<number | null>(null);
  const [displaySubject, setDisplaySubject] = useState<string>('???');
  const [displayHours, setDisplayHours] = useState<string>('?');

  const pickRandom = () => {
    if (subjects.length === 0) return;
    
    setIsSpinning(true);
    setSelectedSubject(null);
    setSelectedHours(null);

    let count = 0;
    const maxCycles = 20; // Number of "scrolls"
    
    const interval = setInterval(() => {
      const randomSub = subjects[Math.floor(Math.random() * subjects.length)];
      const randomHour = Math.floor(Math.random() * 5); // 0 to 4
      
      setDisplaySubject(randomSub.name);
      setDisplayHours(randomHour.toString());
      
      count++;
      
      if (count >= maxCycles) {
        clearInterval(interval);
        const finalSub = subjects[Math.floor(Math.random() * subjects.length)];
        const finalHour = Math.floor(Math.random() * 5); // 0 to 4
        
        setSelectedSubject(finalSub.name);
        setSelectedHours(finalHour);
        setDisplaySubject(finalSub.name);
        setDisplayHours(finalHour.toString());
        setIsSpinning(false);
      }
    }, 100);
  };

  return (
    <div className="bg-base-200 p-8 rounded-4xl border border-base-300 shadow-sm flex flex-col h-full">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          Study Roulette
        </h2>
      </div>

      <div className="flex-1 flex flex-col justify-between space-y-6">
        <div className="flex flex-col items-center justify-center py-10 bg-base-100 rounded-3xl border border-dashed border-base-300">
          <div className="text-center mb-6">
            <p className="text-xs opacity-50 uppercase tracking-widest font-bold mb-2">Target Subject</p>
            <h3 className={`text-3xl font-black transition-all ${isSpinning ? 'blur-[2px] opacity-70 scale-95' : 'scale-100 italic'}`}>
              {displaySubject}
            </h3>
          </div>
          
          <div className="text-center">
            <p className="text-xs opacity-50 uppercase tracking-widest font-bold mb-2">Session Length</p>
            <div className={`flex items-center justify-center gap-2 text-4xl font-black text-primary ${isSpinning ? 'blur-[2px] opacity-70 scale-95' : 'scale-100'}`}>
               {displayHours} <span className="text-xl font-bold opacity-40 italic">HRS</span>
            </div>
          </div>
        </div>

        <button
          onClick={pickRandom}
          disabled={isSpinning || subjects.length === 0}
          className="btn btn-primary btn-lg w-full rounded-2xl shadow-lg hover:shadow-primary/20 transition-all active:scale-95"
        >
          {isSpinning ? (
            <>
              <span className="loading loading-spinner"></span>
              Deciding...
            </>
          ) : (
            <>
              What should I study?
            </>
          )}
        </button>
        
        {subjects.length === 0 && (
          <p className="text-xs text-center text-error font-medium">Add some subjects first!</p>
        )}
      </div>
    </div>
  );
}
