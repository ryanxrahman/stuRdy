"use client";

import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { deleteSubject } from "@/app/(dashboard)/dashboard/subject-actions";

type DeleteSubjectButtonProps = {
  subjectId: string;
  subjectName: string;
};

export default function DeleteSubjectButton({ subjectId, subjectName }: DeleteSubjectButtonProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    const ok = window.confirm(`Delete \"${subjectName}\"? This cannot be undone.`);
    if (!ok) return;

    startTransition(async () => {
      const result = await deleteSubject(subjectId);
      if (result?.success) {
        router.push("/dashboard");
        return;
      }
      alert(result?.error || "Failed to delete subject");
    });
  };

  return (
    <button
      type="button"
      onClick={handleDelete}
      disabled={isPending}
      className="btn btn-ghost btn-circle btn-xs text-error hover:bg-error/10"
      title="Delete Subject"
      aria-label={`Delete ${subjectName}`}
    >
      <Trash2 size={16} />
    </button>
  );
}
