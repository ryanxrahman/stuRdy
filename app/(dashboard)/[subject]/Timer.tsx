"use client";

import { useCallback, useEffect, useMemo, useState, useRef } from "react";
import toast from "react-hot-toast";
import { Play, Pause, RotateCcw, CheckCircle, Expand, Shrink } from "lucide-react";
import { saveStudySession } from "../dashboard/subject-actions";
import { useSearchParams } from "next/navigation";
import { createPortal } from "react-dom";
import Celebration from "@/components/firework-js/Celebration";

export default function Timer({ subjectId }: { subjectId: string }) {
    const searchParams = useSearchParams();
    const [isStopwatchSaving, setIsStopwatchSaving] = useState(false);
    const [isCountdownSaving, setIsCountdownSaving] = useState(false);

    const storageKeys = useMemo(
        () => ({
            stopwatchStartTime: `study-timer:${subjectId}:stopwatch:startTime`,
            stopwatchIsRunning: `study-timer:${subjectId}:stopwatch:isRunning`,
            countdownIsRunning: `study-timer:${subjectId}:countdown:isRunning`,
            countdownEndTime: `study-timer:${subjectId}:countdown:endTime`,
            countdownRemaining: `study-timer:${subjectId}:countdown:remaining`,
            countdownTotal: `study-timer:${subjectId}:countdown:total`,
        }),
        [subjectId]
    );

    const [initialStopwatchState] = useState<{
        seconds: number;
        isActive: boolean;
        startTime: number | null;
    }>(() => {
        if (typeof window === "undefined") {
            return { seconds: 0, isActive: false, startTime: null };
        }

        const persistedIsRunning = localStorage.getItem(storageKeys.stopwatchIsRunning) === "true";
        const rawStartTime = localStorage.getItem(storageKeys.stopwatchStartTime);
        const parsedStartTime = rawStartTime ? Number(rawStartTime) : NaN;

        if (!persistedIsRunning) {
            localStorage.removeItem(storageKeys.stopwatchStartTime);
            localStorage.removeItem(storageKeys.stopwatchIsRunning);
            return { seconds: 0, isActive: false, startTime: null };
        }

        if (!Number.isFinite(parsedStartTime) || parsedStartTime <= 0 || parsedStartTime > Date.now()) {
            localStorage.removeItem(storageKeys.stopwatchStartTime);
            localStorage.removeItem(storageKeys.stopwatchIsRunning);
            return { seconds: 0, isActive: false, startTime: null };
        }

        const elapsed = Math.max(0, Math.floor((Date.now() - parsedStartTime) / 1000));
        return { seconds: elapsed, isActive: true, startTime: parsedStartTime };
    });

    const [initialCountdownState] = useState<{
        remainingSeconds: number;
        totalSeconds: number;
        isActive: boolean;
        endTime: number | null;
    }>(() => {
        if (typeof window === "undefined") {
            return { remainingSeconds: 0, totalSeconds: 0, isActive: false, endTime: null };
        }

        const persistedIsRunning = localStorage.getItem(storageKeys.countdownIsRunning) === "true";
        const rawEndTime = localStorage.getItem(storageKeys.countdownEndTime);
        const rawRemaining = localStorage.getItem(storageKeys.countdownRemaining);
        const rawTotal = localStorage.getItem(storageKeys.countdownTotal);

        const parsedEndTime = rawEndTime ? Number(rawEndTime) : NaN;
        const parsedRemaining = rawRemaining ? Number(rawRemaining) : NaN;
        const parsedTotal = rawTotal ? Number(rawTotal) : NaN;

        if (persistedIsRunning && Number.isFinite(parsedEndTime) && parsedEndTime > Date.now()) {
            const remaining = Math.max(0, Math.ceil((parsedEndTime - Date.now()) / 1000));
            const total = Number.isFinite(parsedTotal) ? Math.max(parsedTotal, remaining) : remaining;
            return { remainingSeconds: remaining, totalSeconds: total, isActive: true, endTime: parsedEndTime };
        }

        if (!persistedIsRunning && Number.isFinite(parsedRemaining) && parsedRemaining > 0) {
            return {
                remainingSeconds: Math.floor(parsedRemaining),
                totalSeconds: Number.isFinite(parsedTotal) ? Math.max(Math.floor(parsedTotal), Math.floor(parsedRemaining)) : Math.floor(parsedRemaining),
                isActive: false,
                endTime: null,
            };
        }

        localStorage.removeItem(storageKeys.countdownIsRunning);
        localStorage.removeItem(storageKeys.countdownEndTime);
        localStorage.removeItem(storageKeys.countdownRemaining);
        localStorage.removeItem(storageKeys.countdownTotal);

        return { remainingSeconds: 0, totalSeconds: 0, isActive: false, endTime: null };
    });

    const [stopwatchSeconds, setStopwatchSeconds] = useState(initialStopwatchState.seconds);
    const [isStopwatchActive, setIsStopwatchActive] = useState(initialStopwatchState.isActive);
    const [stopwatchStartTime, setStopwatchStartTime] = useState<number | null>(initialStopwatchState.startTime);

    const [countdownSeconds, setCountdownSeconds] = useState(initialCountdownState.remainingSeconds);
    const [countdownTotalSeconds, setCountdownTotalSeconds] = useState(initialCountdownState.totalSeconds);
    const [isCountdownActive, setIsCountdownActive] = useState(initialCountdownState.isActive);
    const [countdownEndTime, setCountdownEndTime] = useState<number | null>(initialCountdownState.endTime);
    const [customMinutes, setCustomMinutes] = useState("60");
    const [isStopwatchFullscreen, setIsStopwatchFullscreen] = useState(false);
    const [isCountdownFullscreen, setIsCountdownFullscreen] = useState(false);
    const [triggerCelebration, setTriggerCelebration] = useState(false); //trigger celebration when stopwatch reaches a particular time.

    const countdownCompletedRef = useRef(false);
    const hasHandledAutoStartRef = useRef(false);
    const stopwatchContainerRef = useRef<HTMLDivElement>(null);
    const countdownContainerRef = useRef<HTMLDivElement>(null);

    const formatTime = (totalSeconds: number) => {
        const hrs = Math.floor(totalSeconds / 3600);
        const mins = Math.floor((totalSeconds % 3600) / 60);
        const secs = totalSeconds % 60;
        return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const toggleFullscreen = (containerRef: React.RefObject<HTMLDivElement | null>, isFullscreen: boolean, setFullscreen: (val: boolean) => void) => {
        setFullscreen(!isFullscreen);
    };

    const clearPersistedStopwatch = useCallback(() => {
        localStorage.removeItem(storageKeys.stopwatchStartTime);
        localStorage.removeItem(storageKeys.stopwatchIsRunning);
    }, [storageKeys.stopwatchIsRunning, storageKeys.stopwatchStartTime]);

    const persistRunningStopwatch = useCallback((start: number) => {
        localStorage.setItem(storageKeys.stopwatchStartTime, String(start));
        localStorage.setItem(storageKeys.stopwatchIsRunning, "true");
    }, [storageKeys.stopwatchIsRunning, storageKeys.stopwatchStartTime]);

    const clearPersistedCountdown = useCallback(() => {
        localStorage.removeItem(storageKeys.countdownIsRunning);
        localStorage.removeItem(storageKeys.countdownEndTime);
        localStorage.removeItem(storageKeys.countdownRemaining);
        localStorage.removeItem(storageKeys.countdownTotal);
    }, [storageKeys.countdownEndTime, storageKeys.countdownIsRunning, storageKeys.countdownRemaining, storageKeys.countdownTotal]);

    const persistRunningCountdown = useCallback((endTime: number, totalSeconds: number) => {
        localStorage.setItem(storageKeys.countdownIsRunning, "true");
        localStorage.setItem(storageKeys.countdownEndTime, String(endTime));
        localStorage.setItem(storageKeys.countdownRemaining, String(Math.max(0, Math.ceil((endTime - Date.now()) / 1000))));
        localStorage.setItem(storageKeys.countdownTotal, String(totalSeconds));
    }, [storageKeys.countdownEndTime, storageKeys.countdownIsRunning, storageKeys.countdownRemaining, storageKeys.countdownTotal]);

    const persistPausedCountdown = useCallback((remainingSeconds: number, totalSeconds: number) => {
        localStorage.setItem(storageKeys.countdownIsRunning, "false");
        localStorage.removeItem(storageKeys.countdownEndTime);
        localStorage.setItem(storageKeys.countdownRemaining, String(Math.max(0, remainingSeconds)));
        localStorage.setItem(storageKeys.countdownTotal, String(Math.max(0, totalSeconds)));
    }, [storageKeys.countdownEndTime, storageKeys.countdownIsRunning, storageKeys.countdownRemaining, storageKeys.countdownTotal]);

    const saveSession = useCallback(async (durationSeconds: number, successMessage: string) => {
        const result = await saveStudySession(subjectId, durationSeconds);
        if (result.success) {
            toast.success(successMessage);
            return true;
        }

        toast.error("Failed to save session.");
        return false;
    }, [subjectId]);

    useEffect(() => {
        let interval: ReturnType<typeof setInterval> | null = null;

        if (isStopwatchActive && stopwatchStartTime !== null) {
            interval = setInterval(() => {
                const currentSeconds = Math.max(0, Math.floor((Date.now() - stopwatchStartTime) / 1000));
                setStopwatchSeconds(currentSeconds);
            }, 250);
        }

        return () => {
            if (interval) clearInterval(interval);
        };
    }, [isStopwatchActive, stopwatchStartTime]);

    useEffect(() => {
        let interval: ReturnType<typeof setInterval> | null = null;

        if (isCountdownActive && countdownEndTime !== null) {
            countdownCompletedRef.current = false;
            interval = setInterval(() => {
                const remaining = Math.max(0, Math.ceil((countdownEndTime - Date.now()) / 1000));
                setCountdownSeconds(remaining);

                if (remaining <= 0 && !countdownCompletedRef.current) {
                    countdownCompletedRef.current = true;
                    setIsCountdownActive(false);
                    setCountdownEndTime(null);
                    clearPersistedCountdown();

                    if (countdownTotalSeconds > 0) {
                        setIsCountdownSaving(true);
                        saveSession(countdownTotalSeconds, "Countdown completed and saved!")
                            .then((saved) => {
                                if (saved) {
                                    setCountdownSeconds(0);
                                    setCountdownTotalSeconds(0);
                                } else {
                                    countdownCompletedRef.current = false;
                                }
                            })
                            .finally(() => {
                                setIsCountdownSaving(false);
                            });
                    }
                }
            }, 250);
        }

        return () => {
            if (interval) clearInterval(interval);
        };
    }, [clearPersistedCountdown, countdownEndTime, countdownTotalSeconds, isCountdownActive, saveSession]);

    useEffect(() => {
        if (isCountdownActive) {
            document.title = `⏳ ${formatTime(countdownSeconds)}`;
            return;
        }

        if (isStopwatchActive) {
            document.title = `⏱ ${formatTime(stopwatchSeconds)}`;
            return;
        }

        document.title = "Study App";
        return () => {
            document.title = "Study App";
        };
    }, [countdownSeconds, isCountdownActive, isStopwatchActive, stopwatchSeconds]);

    // Use a ref to always have the latest state for the unload/visibility handler
    const stateRef = useRef({
        subjectId,
        isStopwatchActive,
        stopwatchSeconds,
        isCountdownActive,
        countdownSeconds,
        countdownTotalSeconds,
    });
    const stopwatchHasSavedRef = useRef(false);
    const countdownHasSavedRef = useRef(false);

    useEffect(() => {
        stateRef.current = {
            subjectId,
            isStopwatchActive,
            stopwatchSeconds,
            isCountdownActive,
            countdownSeconds,
            countdownTotalSeconds,
        };
    }, [countdownSeconds, countdownTotalSeconds, isCountdownActive, isStopwatchActive, stopwatchSeconds, subjectId]);

    useEffect(() => {
        const sendDurationToBackend = (duration: number, sid: string) => {
            if (duration <= 0) return;

            const body = JSON.stringify({ subjectId: sid, duration });
            const url = "/api/study/session";

            if (typeof navigator !== "undefined" && navigator.sendBeacon) {
                navigator.sendBeacon(url, new Blob([body], { type: "application/json" }));
                return;
            }

            fetch(url, {
                method: "POST",
                body,
                headers: { "Content-Type": "application/json" },
                keepalive: true,
            });
        };

        const handleBackgroundSave = () => {
            const {
                isStopwatchActive: stopwatchRunning,
                stopwatchSeconds: elapsedStopwatch,
                isCountdownActive: countdownRunning,
                countdownSeconds: remainingCountdown,
                countdownTotalSeconds: totalCountdown,
                subjectId: sid,
            } = stateRef.current;

            if (stopwatchRunning && elapsedStopwatch > 0 && !stopwatchHasSavedRef.current) {
                stopwatchHasSavedRef.current = true;
                clearPersistedStopwatch();
                sendDurationToBackend(elapsedStopwatch, sid);
            }

            if (countdownRunning && totalCountdown > 0 && !countdownHasSavedRef.current) {
                const elapsedCountdown = Math.max(0, totalCountdown - remainingCountdown);
                if (elapsedCountdown > 0) {
                    countdownHasSavedRef.current = true;
                    clearPersistedCountdown();
                    sendDurationToBackend(elapsedCountdown, sid);
                }
            }
        };

        window.addEventListener("beforeunload", handleBackgroundSave);
        window.addEventListener("pagehide", handleBackgroundSave);

        return () => {
            window.removeEventListener("beforeunload", handleBackgroundSave);
            window.removeEventListener("pagehide", handleBackgroundSave);
        };
    }, [clearPersistedCountdown, clearPersistedStopwatch]);

    const toggleStopwatch = () => {
        if (isStopwatchActive) {
            setIsStopwatchActive(false);
            setStopwatchStartTime(null);
            clearPersistedStopwatch();
            return;
        }

        stopwatchHasSavedRef.current = false;

        const newStartTime = Date.now() - stopwatchSeconds * 1000;
        setStopwatchStartTime(newStartTime);
        setIsStopwatchActive(true);
        persistRunningStopwatch(newStartTime);
    };

    const startStopwatch = useCallback(() => {
        if (isStopwatchActive) return;

        stopwatchHasSavedRef.current = false;
        const newStartTime = Date.now() - stopwatchSeconds * 1000;
        setStopwatchStartTime(newStartTime);
        setIsStopwatchActive(true);
        persistRunningStopwatch(newStartTime);
    }, [isStopwatchActive, persistRunningStopwatch, stopwatchSeconds]);

    const resetStopwatch = () => {
        setTriggerCelebration(false);
        setIsStopwatchActive(false);
        setStopwatchStartTime(null);
        setStopwatchSeconds(0);
        stopwatchHasSavedRef.current = false;
        clearPersistedStopwatch();
        //STOPWATCHHHHHHHHH!!!!1
    };

    const handleStopwatchFinish = async () => {
        if (stopwatchSeconds === 0 || stopwatchHasSavedRef.current) return;

        stopwatchHasSavedRef.current = true;
        setIsStopwatchActive(false);
        setStopwatchStartTime(null);
        clearPersistedStopwatch();

        setIsStopwatchSaving(true);
        const saved = await saveSession(stopwatchSeconds, "Study session saved successfully!");
        setIsStopwatchSaving(false);

        if (saved) {
            setStopwatchSeconds(0);
            return;
        }

        stopwatchHasSavedRef.current = false;
    };

    const startCountdown = (durationSeconds: number) => {
        if (!Number.isFinite(durationSeconds) || durationSeconds <= 0) {
            toast.error("Please choose a valid countdown duration.");
            return;
        }

        countdownHasSavedRef.current = false;
        countdownCompletedRef.current = false;

        const endTime = Date.now() + durationSeconds * 1000;
        setCountdownTotalSeconds(durationSeconds);
        setCountdownSeconds(durationSeconds);
        setCountdownEndTime(endTime);
        setIsCountdownActive(true);
        persistRunningCountdown(endTime, durationSeconds);
    };

    const toggleCountdown = () => {
        if (isCountdownActive && countdownEndTime !== null) {
            const remaining = Math.max(0, Math.ceil((countdownEndTime - Date.now()) / 1000));
            setCountdownSeconds(remaining);
            setIsCountdownActive(false);
            setCountdownEndTime(null);
            persistPausedCountdown(remaining, countdownTotalSeconds);
            return;
        }

        if (countdownSeconds <= 0) {
            toast.error("Pick a duration to start the countdown.");
            return;
        }

        const endTime = Date.now() + countdownSeconds * 1000;
        setCountdownEndTime(endTime);
        setIsCountdownActive(true);
        persistRunningCountdown(endTime, countdownTotalSeconds || countdownSeconds);
    };

    const resetCountdown = () => {

        setIsCountdownActive(false);
        setCountdownEndTime(null);
        setCountdownSeconds(0);
        setCountdownTotalSeconds(0);
        countdownHasSavedRef.current = false;
        countdownCompletedRef.current = false;
        clearPersistedCountdown();


    };

    const handleCountdownManualSave = async () => {
        if (countdownTotalSeconds <= 0 || countdownHasSavedRef.current) return;

        const elapsed = Math.max(0, countdownTotalSeconds - countdownSeconds);
        if (elapsed <= 0) {
            toast.error("No countdown time to save yet.");
            return;
        }

        countdownHasSavedRef.current = true;
        setIsCountdownActive(false);
        setCountdownEndTime(null);
        clearPersistedCountdown();

        setIsCountdownSaving(true);
        const saved = await saveSession(elapsed, "Countdown session saved!");
        setIsCountdownSaving(false);

        if (saved) {
            setCountdownSeconds(0);
            setCountdownTotalSeconds(0);
            return;
        }

        countdownHasSavedRef.current = false;
    };

    const handleStartCustomCountdown = () => {
        const minutes = Number(customMinutes);
        if (!Number.isFinite(minutes) || minutes <= 0) {
            toast.error("Enter valid custom minutes.");
            return;
        }

        startCountdown(Math.floor(minutes * 60));
    };

    useEffect(() => {
        const shouldAutoStart = searchParams.get("autostart") === "1";
        if (!shouldAutoStart || hasHandledAutoStartRef.current || isStopwatchActive) return;

        const timerId = window.setTimeout(() => {
            startStopwatch();
            toast.success("Timer started");

            hasHandledAutoStartRef.current = true;
            const nextUrl = new URL(window.location.href);
            nextUrl.searchParams.delete("autostart");
            window.history.replaceState({}, "", `${nextUrl.pathname}${nextUrl.search}${nextUrl.hash}`);
        }, 0);

        return () => {
            window.clearTimeout(timerId);
        };
    }, [isStopwatchActive, searchParams, startStopwatch]);




    useEffect(() => {
        if (stopwatchSeconds === 0 || stopwatchSeconds % 3600 !== 0) return;

        const hours = stopwatchSeconds / 3600;

        setTriggerCelebration(true);
        toast.success(`🎉 Congratulations! You've studied for ${hours} hour${hours > 1 ? "s" : ""}!`);

        const timeout = setTimeout(() => {
            setTriggerCelebration(false);
        }, 10000);

        return () => clearTimeout(timeout);
    }, [stopwatchSeconds]);




    return (
        <div className="w-full py-6">
            <Celebration trigger={triggerCelebration} />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full">
                {/* Stopwatch card */}
                <div className="bg-base-100 relative rounded-3xl border border-base-300 shadow-inner p-6 flex flex-col items-center gap-5 justify-center">
                    <button
                        onClick={() => setIsStopwatchFullscreen(true)}
                        className="absolute top-4 right-4 cursor-pointer rounded-md p-1 text-primary hover:bg-base-300 transition-colors"
                    >
                        <Expand size={18} />
                    </button>
                    <p className="text-sm uppercase tracking-widest opacity-60 mt-2">Stopwatch</p>
                    <div className="text-5xl sm:text-6xl font-mono font-black tracking-tighter tabular-nums text-center wrap-break-word">
                        {formatTime(stopwatchSeconds)}
                    </div>
                    <div className="flex flex-wrap justify-center gap-3">
                        <button onClick={toggleStopwatch} className={`btn btn-circle btn-lg ${isStopwatchActive ? 'btn-outline' : 'btn-primary'}`}>
                            {isStopwatchActive ? <Pause size={24} /> : <Play size={24} />}
                        </button>
                        <button onClick={resetStopwatch} className="btn btn-circle btn-lg btn-ghost border border-base-300">
                            <RotateCcw size={24} />
                        </button>
                        <button onClick={handleStopwatchFinish} disabled={stopwatchSeconds === 0 || isStopwatchSaving} className="btn btn-lg btn-success rounded-full px-6 flex items-center gap-2">
                            <CheckCircle size={20} />
                            {isStopwatchSaving ? "Saving..." : "Save"}
                        </button>
                    </div>
                </div>

                {/* Countdown card */}
                <div className="bg-base-100 relative rounded-3xl border border-base-300 shadow-inner p-6 flex flex-col gap-5 items-center justify-center">
                    <button
                        onClick={() => setIsCountdownFullscreen(true)}
                        className="absolute top-4 right-4 cursor-pointer rounded-md p-1 text-primary hover:bg-base-300 transition-colors"
                    >
                        <Expand size={18} />
                    </button>
                    <p className="text-sm uppercase tracking-widest opacity-60">Countdown</p>
                    <div className="text-5xl sm:text-6xl text-center font-mono font-black tracking-tighter tabular-nums wrap-break-word">
                        {formatTime(countdownSeconds)}
                    </div>
                    <div className="flex flex-wrap gap-2 justify-center">
                        {[25, 60, 120].map((minutes) => (
                            <button key={minutes} onClick={() => startCountdown(minutes * 60)} className="btn btn-sm btn-outline">
                                {minutes >= 60 ? `${minutes / 60}h` : `${minutes}m`}
                            </button>
                        ))}
                    </div>
                    <div className="flex gap-2 justify-center">
                        <input
                            type="number"
                            min={1}
                            step={1}
                            value={customMinutes}
                            onChange={(e) => setCustomMinutes(e.target.value)}
                            className="input input-bordered w-28 text-center"
                            placeholder="minutes"
                        />
                        <button onClick={handleStartCustomCountdown} className="btn btn-primary btn-sm">
                            Start custom
                        </button>
                    </div>
                    <div className="flex flex-wrap justify-center gap-3">
                        <button onClick={toggleCountdown} className={`btn btn-circle btn-lg ${isCountdownActive ? 'btn-outline' : 'btn-primary'}`} disabled={countdownSeconds === 0 && countdownTotalSeconds === 0}>
                            {isCountdownActive ? <Pause size={24} /> : <Play size={24} />}
                        </button>
                        <button onClick={resetCountdown} className="btn btn-circle btn-lg btn-ghost border border-base-300">
                            <RotateCcw size={24} />
                        </button>
                        <button onClick={handleCountdownManualSave} disabled={countdownTotalSeconds === 0 || isCountdownSaving} className="btn btn-lg btn-success rounded-full px-6 flex items-center gap-2">
                            <CheckCircle size={20} />
                            {isCountdownSaving ? "Saving..." : "Save"}
                        </button>
                    </div>
                </div>
            </div>

            {/* Stopwatch portal */}
            {isStopwatchFullscreen && createPortal(
                <div className="fixed top-0 left-0 w-full h-full  z-[9999] bg-base-100 flex flex-col items-center justify-center gap-5">
                    <button onClick={() => setIsStopwatchFullscreen(false)} className="absolute top-4 right-4 cursor-pointer rounded-md p-1 text-primary hover:bg-base-300 transition-colors">
                        <Shrink size={18} />
                    </button>
                    <div className="flex flex-col items-center scale-200 gap-5">
                        <p className="text-sm uppercase tracking-widest opacity-60">Stopwatch</p>
                        <div className="text-5xl sm:text-6xl font-mono font-black tracking-tighter tabular-nums text-center">
                            {formatTime(stopwatchSeconds)}
                        </div>
                        <div className="flex flex-wrap justify-center gap-3">
                            <button onClick={toggleStopwatch} className={`btn btn-circle btn-lg ${isStopwatchActive ? 'btn-outline' : 'btn-primary'}`}>
                                {isStopwatchActive ? <Pause size={24} /> : <Play size={24} />}
                            </button>
                            <button onClick={resetStopwatch} className="btn btn-circle btn-lg btn-ghost border border-base-300">
                                <RotateCcw size={24} />
                            </button>
                            <button onClick={handleStopwatchFinish} disabled={stopwatchSeconds === 0 || isStopwatchSaving} className="btn btn-lg btn-success rounded-full px-6 flex items-center gap-2">
                                <CheckCircle size={20} />
                                {isStopwatchSaving ? "Saving..." : "Save"}
                            </button>
                        </div>
                    </div>
                </div>,
                document.body
            )}

            {/* Countdown portal */}
            {isCountdownFullscreen && createPortal(
                <div className="fixed top-0 left-0 w-full h-full z-[9999] bg-base-100 flex flex-col items-center justify-center gap-5">
                    <button onClick={() => setIsCountdownFullscreen(false)} className="absolute top-4 right-4 cursor-pointer rounded-md p-1 text-primary hover:bg-base-300 transition-colors">
                        <Shrink size={18} />
                    </button>
                    <div className="flex flex-col items-center scale-200 gap-5">
                        <p className="text-sm uppercase tracking-widest opacity-60">Countdown</p>
                        <div className="text-5xl sm:text-6xl text-center font-mono font-black tracking-tighter tabular-nums">
                            {formatTime(countdownSeconds)}
                        </div>
                        <div className="flex flex-wrap gap-2 justify-center">
                            {[25, 60, 120].map((minutes) => (
                                <button key={minutes} onClick={() => startCountdown(minutes * 60)} className="btn btn-sm btn-outline">
                                    {minutes >= 60 ? `${minutes / 60}h` : `${minutes}m`}
                                </button>
                            ))}
                        </div>
                        <div className="flex gap-2 justify-center">
                            <input
                                type="number"
                                min={1}
                                step={1}
                                value={customMinutes}
                                onChange={(e) => setCustomMinutes(e.target.value)}
                                className="input input-bordered w-28 text-center"
                                placeholder="minutes"
                            />
                            <button onClick={handleStartCustomCountdown} className="btn btn-primary btn-sm">
                                Start custom
                            </button>
                        </div>
                        <div className="flex flex-wrap justify-center gap-3">
                            <button onClick={toggleCountdown} className={`btn btn-circle btn-lg ${isCountdownActive ? 'btn-outline' : 'btn-primary'}`} disabled={countdownSeconds === 0 && countdownTotalSeconds === 0}>
                                {isCountdownActive ? <Pause size={24} /> : <Play size={24} />}
                            </button>
                            <button onClick={resetCountdown} className="btn btn-circle btn-lg btn-ghost border border-base-300">
                                <RotateCcw size={24} />
                            </button>
                            <button onClick={handleCountdownManualSave} disabled={countdownTotalSeconds === 0 || isCountdownSaving} className="btn btn-lg btn-success rounded-full px-6 flex items-center gap-2">
                                <CheckCircle size={20} />
                                {isCountdownSaving ? "Saving..." : "Save"}
                            </button>
                        </div>
                    </div>
                </div>,
                document.body
            )}
        </div>
    );
}
