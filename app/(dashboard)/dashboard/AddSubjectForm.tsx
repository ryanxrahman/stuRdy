"use client";

import { useActionState, useEffect, useRef } from "react";
import { createSubject } from "@/app/(dashboard)/dashboard/subject-actions";
import BtnPrimary from "@/components/btn/BtnPrimary";
import toast from "react-hot-toast";
import BtnFirst from "@/components/btn/BtnFirst";


export default function AddSubjectForm({active}: {active?: boolean}) {
    const [state, formAction, isPending] = useActionState(createSubject, null);
    const formRef = useRef<HTMLFormElement>(null);
    const submittedSubjectNameRef = useRef("");

    useEffect(() => {
        if (state?.success) {
            const subjectName = submittedSubjectNameRef.current.trim();
            if (subjectName) {
                toast.success(`${subjectName} subject is added`);
            }
            formRef.current?.reset();
            submittedSubjectNameRef.current = "";
        }
    }, [state]);

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        const formData = new FormData(event.currentTarget);
        const subjectName = formData.get("name");
        submittedSubjectNameRef.current = typeof subjectName === "string" ? subjectName : "";
    };

    return (
        <form ref={formRef} action={formAction} onSubmit={handleSubmit} className="flex gap-2 max-md:flex-col w-full">
            <div className="flex-1">
                <input 
                    autoFocus={active}
                    name="name"
                    type="text" 
                    placeholder="Enter subject name (e.g. Math)" 
                    className="input rounded-xl w-full"
                    required 
                />
                {state?.error && <p className="text-error text-xs mt-1">{state.error}</p>}
            </div>
            <BtnFirst type="submit" disabled={isPending}>
                {isPending ? "Adding..." : "Add Subject"}
            </BtnFirst>
        </form>
    );
}
