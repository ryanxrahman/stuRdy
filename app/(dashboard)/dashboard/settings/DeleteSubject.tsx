"use client";

import DeleteSubjectButton from "@/components/DeleteSubjectButton";
import { Trash } from "lucide-react";


type Subject = {
    _id: string;
    name: string;
    totalMinutes?: number;
};

export default function DeleteSubject({ subjects }: { subjects: Subject[] }) {
    return (
        <div className={`flex flex-col gap-5 bg-base-200 rounded-4xl border border-base-300 p-8 `}>
             <h1 className="flex gap-2 items-center "><Trash size="15"/>Delete Subject Permanently</h1>
            {
                subjects.length === 0 ? (
                    <p className="text-center text-base-content/70">No subjects found.</p>
                ) : (
                    <div className="flex flex-col gap-3">
                        {subjects.map((subject) => (
                            <div key={subject._id} className="flex items-center justify-between gap-3 rounded-lg border border-base-300 bg-base-100 p-3">
                                <span>{subject.name}</span>
                                <DeleteSubjectButton subjectId={subject._id} subjectName={subject.name} />
                            </div>  

                        ))}
                    </div>
                )
            }
        </div>
    )
}