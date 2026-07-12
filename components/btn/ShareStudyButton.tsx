"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ExternalLink, Share2 } from "lucide-react";
import BtnThird from "@/components/btn/BtnThird";

type ShareSubject = {
    name: string;
    hours: number;
};

type SharePeriod = {
    label: string;
    days: number;
    totalHours: number;
    subjects: ShareSubject[];
};

type ShareStudyButtonProps = {
    periods: SharePeriod[];
};

function formatHours(hours: number) {
    const rounded = Math.round(hours * 10) / 10;
    return Number.isInteger(rounded) ? `${rounded}` : rounded.toFixed(1);
}

function buildShareText(period: SharePeriod) {
    const subjectLines = period.subjects.length > 0
        ? period.subjects.map((subject) => `${subject.name}: ${formatHours(subject.hours)} hours`)
        : ["No subjects tracked yet"];

    return [
        `I studied ${formatHours(period.totalHours)} hours in ${period.days} days.`,
        "",
        "And here are the subjects:",
        ...subjectLines,
        "",
        "That's it.",
    ].join("\n");
}

function openXShare(period: SharePeriod) {
    const text = buildShareText(period);
    const shareUrl = `https://x.com/intent/tweet?text=${encodeURIComponent(text)}`;
    window.open(shareUrl, "_blank", "noopener,noreferrer");
}

export default function ShareStudyButton({ periods }: ShareStudyButtonProps) {
    const [isOpen, setIsOpen] = useState(false);
    const wrapperRef = useRef<HTMLDivElement | null>(null);

    const defaultPeriod = useMemo(() => periods[0] || null, [periods]);

    useEffect(() => {
        const handlePointerDown = (event: PointerEvent) => {
            if (!wrapperRef.current) return;
            if (!wrapperRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener("pointerdown", handlePointerDown);
        return () => {
            document.removeEventListener("pointerdown", handlePointerDown);
        };
    }, []);

    const handleShare = (period: SharePeriod) => {
        openXShare(period);
        setIsOpen(false);
    };

    if (!defaultPeriod) {
        return (
            <BtnThird icon={<Share2 size={14} />} disabled>
                Share
            </BtnThird>
        );
    }

    return (
        <div
            ref={wrapperRef}
            className="relative"
            onMouseEnter={() => setIsOpen(true)}
            onFocusCapture={() => setIsOpen(true)}
        >
            <BtnThird
                icon={<Share2 size={14} />}
                onClick={() => setIsOpen((prev) => !prev)}
            >
                Share
            </BtnThird>

            <div
                className={`absolute right-0 top-full z-40 mt-5 w-80 rounded-2xl border border-base-300 bg-base-100 p-3 shadow-2xl transition-all duration-150 ${isOpen ? "translate-y-0 opacity-100 pointer-events-auto" : "translate-y-1 opacity-0 pointer-events-none"}`}
            >
                <div className="mb-3 flex items-center justify-between gap-3">
                    <div>
                        <p className="text-xs font-bold uppercase tracking-widest opacity-50">Share to X</p>
                        <p className="text-sm opacity-60">Pick a time range</p>
                    </div>
                </div>

                <div className="space-y-2">
                    {periods.map((period) => (
                        <button
                            key={period.label}
                            type="button"
                            onClick={() => handleShare(period)}
                            className="w-full cursor-pointer rounded-xl border border-base-300 px-3 py-2 text-left transition-colors hover:bg-base-200"
                        >
                            <div className="flex items-center justify-between gap-3">
                                <span className="font-semibold">{period.label}</span>

                            </div>
                            <p className="mt-1 text-xs opacity-60">
                                <span className="text-green-500 font-bold">{formatHours(period.totalHours)} hours total</span> · {period.subjects.length} subjects
                            </p>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}
