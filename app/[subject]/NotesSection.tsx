"use client";

import { useState, useTransition, useEffect } from "react";
import { saveNotes } from "../dashboard/subject-actions";

export default function NotesSection({ subjectId, initialNotes }: { subjectId: string, initialNotes: string }) {
    const [notes, setNotes] = useState(initialNotes);
    const [isPending, startTransition] = useTransition();
    const [lastSaved, setLastSaved] = useState<Date | null>(null);

    const handleSave = () => {
        startTransition(async () => {
            const result = await saveNotes(subjectId, notes);
            if (result.success) {
                setLastSaved(new Date());
            }
        });
    };

    // Optional: Auto-save on blur or after delay
    useEffect(() => {
        const timer = setTimeout(() => {
            if (notes !== initialNotes && !isPending) {
                // handleSave(); // could enable auto-save here
            }
        }, 3000);
        return () => clearTimeout(timer);
    }, [notes]);

    return (
        <div className="flex flex-col flex-1 gap-4">
            <textarea 
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Write your notes here..." 
                className="textarea textarea-bordered flex-1 w-full text-lg leading-relaxed resize-none bg-base-100"
            />
            
            <div className="flex justify-between items-center mt-2">
                <span className="text-xs opacity-50">
                    {lastSaved ? `Last saved: ${lastSaved.toLocaleTimeString()}` : 'Not saved yet'}
                </span>
                <button 
                    onClick={handleSave} 
                    className="btn btn-primary" 
                    disabled={isPending || notes === initialNotes}
                >
                    {isPending ? "Saving..." : "Save Notes"}
                </button>
            </div>
        </div>
    );
}
