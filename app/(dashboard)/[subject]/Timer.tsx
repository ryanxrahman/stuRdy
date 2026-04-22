"use client";

import { useCallback, useEffect, useMemo, useState, useTransition, useRef } from "react";
import toast from "react-hot-toast";
import { Play, Pause, RotateCcw, CheckCircle } from "lucide-react";
import { saveStudySession } from "../dashboard/subject-actions";

export default function Timer({ subjectId }: { subjectId: string }) {
    const [isPending, startTransition] = useTransition();

    const storageKeys = useMemo(
        () => ({
            startTime: `study-timer:${subjectId}:startTime`,
            isRunning: `study-timer:${subjectId}:isRunning`,
        }),
        [subjectId]
    );

    const [initialTimerState] = useState<{
        seconds: number;
        isActive: boolean;
        startTime: number | null;
    }>(() => {
        if (typeof window === "undefined") {
            return { seconds: 0, isActive: false, startTime: null };
        }

        const persistedIsRunning = localStorage.getItem(storageKeys.isRunning) === "true";
        const rawStartTime = localStorage.getItem(storageKeys.startTime);
        const parsedStartTime = rawStartTime ? Number(rawStartTime) : NaN;

        if (!persistedIsRunning) {
            localStorage.removeItem(storageKeys.startTime);
            localStorage.removeItem(storageKeys.isRunning);
            return { seconds: 0, isActive: false, startTime: null };
        }

        if (!Number.isFinite(parsedStartTime) || parsedStartTime <= 0 || parsedStartTime > Date.now()) {
            localStorage.removeItem(storageKeys.startTime);
            localStorage.removeItem(storageKeys.isRunning);
            return { seconds: 0, isActive: false, startTime: null };
        }

        const elapsed = Math.max(0, Math.floor((Date.now() - parsedStartTime) / 1000));
        return { seconds: elapsed, isActive: true, startTime: parsedStartTime };
    });

    const [seconds, setSeconds] = useState(initialTimerState.seconds);
    const [isActive, setIsActive] = useState(initialTimerState.isActive);
    const [startTime, setStartTime] = useState<number | null>(initialTimerState.startTime);

    const formatTime = (totalSeconds: number) => {
        const hrs = Math.floor(totalSeconds / 3600);
        const mins = Math.floor((totalSeconds % 3600) / 60);
        const secs = totalSeconds % 60;
        return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const clearPersistedTimer = useCallback(() => {
        localStorage.removeItem(storageKeys.startTime);
        localStorage.removeItem(storageKeys.isRunning);
    }, [storageKeys.isRunning, storageKeys.startTime]);

    const persistRunningTimer = useCallback((start: number) => {
        localStorage.setItem(storageKeys.startTime, String(start));
        localStorage.setItem(storageKeys.isRunning, "true");
    }, [storageKeys.isRunning, storageKeys.startTime]);

    useEffect(() => {
        let interval: ReturnType<typeof setInterval> | null = null;
        
        if (isActive && startTime !== null) {
            interval = setInterval(() => {
                const currentSeconds = Math.max(0, Math.floor((Date.now() - startTime) / 1000));
                setSeconds(currentSeconds);
                document.title = ` ${formatTime(currentSeconds)}`;
            }, 250);
        } else {
            document.title = "Study App";
        }

        return () => {
            if (interval) clearInterval(interval);
            document.title = "Study App";
        };
    }, [isActive, startTime]);

    // Use a ref to always have the latest state for the unload/visibility handler
    const stateRef = useRef({ isActive, seconds, subjectId });
    const hasSavedRef = useRef(false);

    useEffect(() => {
        stateRef.current = { isActive, seconds, subjectId };
    }, [isActive, seconds, subjectId]);

    useEffect(() => {
        const handleBackgroundSave = () => {
            const { isActive: running, seconds: elapsed, subjectId: sid } = stateRef.current;
            
            if (!running || elapsed <= 0 || hasSavedRef.current) return;

            // Prepare data
            const body = JSON.stringify({ subjectId: sid, duration: elapsed });
            const url = "/api/study/session";

            // Mark as saved immediately to prevent duplicate runs
            hasSavedRef.current = true;

            // Clear local storage IMMEDIATELY
            localStorage.removeItem(storageKeys.startTime);
            localStorage.removeItem(storageKeys.isRunning);

            // Send to backend
            if (typeof navigator !== "undefined" && navigator.sendBeacon) {
                navigator.sendBeacon(url, new Blob([body], { type: "application/json" }));
            } else {
                fetch(url, {
                    method: "POST",
                    body,
                    headers: { "Content-Type": "application/json" },
                    keepalive: true,
                });
            }
        };

        const onVisibilityChange = () => {
            if (document.visibilityState === "hidden") {
                handleBackgroundSave();
            }
        };

        window.addEventListener("beforeunload", handleBackgroundSave);
        document.addEventListener("visibilitychange", onVisibilityChange);

        return () => {
            window.removeEventListener("beforeunload", handleBackgroundSave);
            document.removeEventListener("visibilitychange", onVisibilityChange);
        };
    }, [storageKeys.isRunning, storageKeys.startTime]);

    const toggle = () => {
        if (isActive) {
            setIsActive(false);
            setStartTime(null);
            clearPersistedTimer();
            return;
        }

        // Reset hasSaved when starting a new session
        hasSavedRef.current = false;

        // Start from now, adjusted by already elapsed seconds for pause/resume behavior.
        const newStartTime = Date.now() - seconds * 1000;
        setStartTime(newStartTime);
        setIsActive(true);
        persistRunningTimer(newStartTime);
    };
    
    const reset = () => {
        setIsActive(false);
        setStartTime(null);
        setSeconds(0);
        hasSavedRef.current = false;
        clearPersistedTimer();
    };

    const handleFinish = () => {
        if (seconds === 0 || hasSavedRef.current) return;
        
        hasSavedRef.current = true; // Mark as saved
        setIsActive(false);
        setStartTime(null);
        clearPersistedTimer();
        startTransition(async () => {
            const result = await saveStudySession(subjectId, seconds);
            if (result.success) {
                setSeconds(0);
                toast.success("Study session saved successfully!");
            } else {
                hasSavedRef.current = false; // Allow retry if it failed? 
                // Actually if it failed, they might try again.
                toast.error("Failed to save session.");
            }
        });
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
