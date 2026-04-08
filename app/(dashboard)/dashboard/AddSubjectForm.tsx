"use client";

import { useActionState, useEffect, useRef } from "react";
import { createSubject } from "@/app/(dashboard)/dashboard/subject-actions";
import BtnPrimary from "@/components/btn/BtnPrimary";

export default function AddSubjectForm() {
    const [state, formAction, isPending] = useActionState(createSubject, null);
    const formRef = useRef<HTMLFormElement>(null);

    useEffect(() => {
        if (state?.success) {
            formRef.current?.reset();
        }
    }, [state]);

    return (
        <form ref={formRef} action={formAction} className="flex gap-2 w-full max-w-md mb-8">
            <div className="flex-1">
                <input 
                    name="name"
                    type="text" 
                    placeholder="Enter subject name (e.g. Math)" 
                    className="input w-full"
                    required 
                />
                {state?.error && <p className="text-error text-xs mt-1">{state.error}</p>}
            </div>
            <BtnPrimary type="submit" disabled={isPending}>
                {isPending ? "Adding..." : "Add Subject"}
            </BtnPrimary>
        </form>
    );
}
