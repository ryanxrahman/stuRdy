"use client";

import { useState, useEffect, useTransition } from "react";
import { Play, Pause, RotateCcw, CheckCircle } from "lucide-react";
import { saveStudySession } from "../dashboard/subject-actions";

export default function Timer({ subjectId }: { subjectId: string }) {
    const [seconds, setSeconds] = useState(0);
    const [isActive, setIsActive] = useState(false);
    const [accumulatedSeconds, setAccumulatedSeconds] = useState(0);
    const [isPending, startTransition] = useTransition();

    useEffect(() => {
        let interval: NodeJS.Timeout | null = null;
        
        if (isActive) {
            const sessionStartTime = Date.now();
            const initialSeconds = accumulatedSeconds;
            
            interval = setInterval(() => {
                const now = Date.now();
                const elapsedSeconds = Math.floor((now - sessionStartTime) / 1000);
                setSeconds(initialSeconds + elapsedSeconds);
            }, 100); // Check every 0.1s for extreme accuracy
        }

        return () => {
            if (interval) clearInterval(interval);
        };
    }, [isActive, accumulatedSeconds]);

    const toggle = () => {
        if (isActive) {
            setAccumulatedSeconds(seconds);
        }
        setIsActive(!isActive);
    };
    
    const reset = () => {
        setIsActive(false);
        setSeconds(0);
        setAccumulatedSeconds(0);
    };

    const handleFinish = () => {
        if (seconds === 0) return;
        
        setIsActive(false);
        startTransition(async () => {
            const result = await saveStudySession(subjectId, seconds);
            if (result.success) {
                setSeconds(0);
                setAccumulatedSeconds(0);
                alert("Study session saved successfully!");
            } else {
                alert("Failed to save session.");
            }
        });
    };

    const formatTime = (totalSeconds: number) => {
        const hrs = Math.floor(totalSeconds / 3600);
        const mins = Math.floor((totalSeconds % 3600) / 60);
        const secs = totalSeconds % 60;
        return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <div className="flex flex-col items-center gap-6 py-8">
            <div className="text-7xl font-mono font-black tracking-tighter tabular-nums bg-base-100 px-8 py-4 rounded-3xl border border-base-300 shadow-inner">
                {formatTime(seconds)}
            </div>

            <div className="flex gap-4">
                <button 
                    onClick={toggle} 
                    className={`btn btn-circle btn-lg ${isActive ? 'btn-outline' : 'btn-primary'}`}
                >
                    {isActive ? <Pause size={24} /> : <Play size={24} />}
                </button>

                <button 
                    onClick={reset} 
                    className="btn btn-circle btn-lg btn-ghost border border-base-300"
                >
                    <RotateCcw size={24} />
                </button>

                <button 
                    onClick={handleFinish} 
                    disabled={seconds === 0 || isPending}
                    className="btn btn-lg btn-success rounded-full px-8 flex items-center gap-2"
                >
                    <CheckCircle size={20} />
                    {isPending ? "Saving..." : "Finish Session"}
                </button>
            </div>
        </div>
    );
}
