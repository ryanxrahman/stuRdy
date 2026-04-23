"use client";

import { useState } from "react";
import { createPortal } from "react-dom";
import { Play, X } from "lucide-react";
import { useRouter } from "next/navigation";

type SubjectOption = {
  _id: string;
  name: string;
};

type StartStudyHeaderButtonProps = {
  subjects: SubjectOption[];
};

export default function StartStudyHeaderButton({ subjects }: StartStudyHeaderButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const handleStartSubject = (subjectName: string) => {
    setIsOpen(false);
    router.push(`/${encodeURIComponent(subjectName)}?autostart=1`);
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="btn btn-success rounded-xl text-white gap-2"
      >
        <Play size={14} strokeWidth={2} />
        Start
      </button>

      {isOpen &&
        typeof window !== "undefined" &&
        createPortal(
          <div
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-[1px] flex items-center justify-center p-4"
            onClick={() => setIsOpen(false)}
          >
            <div
              className="bg-base-100 p-6 rounded-2xl border border-base-300 w-full max-w-lg"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-lg">Start Study</h3>
                <button
                  type="button"
                  className="btn btn-sm btn-ghost btn-circle"
                  onClick={() => setIsOpen(false)}
                  aria-label="Close start study popup"
                >
                  <X size={16} />
                </button>
              </div>

              {subjects.length === 0 ? (
                <p className="text-sm opacity-60">No subjects found. Add one first.</p>
              ) : (
                <div className="max-h-80 overflow-y-auto space-y-2">
                  {subjects.map((subject) => (
                    <button
                      key={subject._id}
                      type="button"
                      onClick={() => handleStartSubject(subject.name)}
                      className="btn btn-ghost border border-base-300 rounded-xl w-full justify-start"
                    >
                      <Play size={14} />
                      {subject.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>,
          document.body
        )}
    </>
  );
}
