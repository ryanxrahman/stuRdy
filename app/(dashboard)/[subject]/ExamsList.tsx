"use client";

import { useState, useTransition, useEffect } from "react";
import { addExamRecord, deleteExamRecord } from "@/app/(dashboard)/dashboard/subject-actions";
import { Trash2, Trophy } from "lucide-react";

type Exam = {
    id: string;
    name: string;
    score: number;
    date: Date;
}

export default function ExamsList({ subjectId, initialExams }: { subjectId: string, initialExams: Exam[] }) {
    const [mounted, setMounted] = useState(false);
    const [exams, setExams] = useState(initialExams);
    const [name, setName] = useState("");
    const [score, setScore] = useState("");
    const [isPending, startTransition] = useTransition();

    useEffect(() => {
        setMounted(true);
    }, []);

    const handleAdd = (e: React.FormEvent) => {
        e.preventDefault();
        if (!name || !score) return;

        const scoreNum = parseFloat(score);
        startTransition(async () => {
            const result = await addExamRecord(subjectId, name, scoreNum);
            if (result.success) {
                setExams([...exams, { id: Math.random().toString(), name, score: scoreNum, date: new Date() }]);
                setName("");
                setScore("");
            }
        });
    };

    const handleDelete = (id: string) => {
        if (!confirm("Delete this exam record?")) return;
        startTransition(async () => {
            await deleteExamRecord(subjectId, id);
            setExams(exams.filter(e => e.id !== id));
        });
    };

    return (
        <div className="flex flex-col gap-6">
            <form onSubmit={handleAdd} className="flex gap-2 bg-base-100 p-4 rounded-2xl border border-base-300">
                <div className="flex-1 flex flex-col gap-1">
                    <input 
                        type="text" 
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Exam Name (e.g. Midterm)" 
                        className="input input-sm w-full"
                        required
                    />
                </div>
                <div className="w-24">
                    <input 
                        type="number" 
                        value={score}
                        onChange={(e) => setScore(e.target.value)}
                        placeholder="Marks" 
                        className="input input-sm w-full"
                        required
                    />
                </div>
                <button type="submit" className="btn btn-sm btn-primary" disabled={isPending}>
                    {isPending ? "..." : "Add"}
                </button>
            </form>

            <div className="grid grid-cols-1 gap-2">
                {(!mounted || exams.length === 0) && (
                    <p className="text-center opacity-30 text-sm italic py-4">
                        {(!mounted ? "Loading records..." : "No exam records yet")}
                    </p>
                )}
                {mounted && exams.map((exam) => (
                    <div key={exam.id} className="flex items-center gap-4 bg-base-100 p-3 rounded-xl border border-base-300 group/exam">
                        <div className="bg-primary/10 p-2 rounded-lg text-primary">
                            <Trophy size={16} />
                        </div>
                        <div className="flex-1">
                            <p className="text-sm font-bold">{exam.name}</p>
                            <p className="text-xs opacity-50">{new Date(exam.date).toLocaleDateString()}</p>
                        </div>
                        <div className="text-right">
                            <p className="text-lg font-black">{exam.score}</p>
                        </div>
                        <button 
                            onClick={() => handleDelete(exam.id)}
                            className="btn btn-ghost btn-circle btn-xs text-error opacity-0 group-hover/exam:opacity-100 transition-opacity"
                        >
                            <Trash2 size={14} />
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}
