"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { Plus, X } from "lucide-react";
import AddSubjectForm from "./AddSubjectForm";

export default function AddSubjectHeaderButton() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {

      const target = e.target as HTMLElement;
      if (target.isContentEditable || ["input", "textarea", "select"].includes(target.tagName.toLowerCase())) {
        return;
      }
      if (e.key.toLowerCase() === "a") {
        setIsOpen((prev) => !prev);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="btn btn-primary rounded-xl gap-2"
      >
        <Plus size={16} />
        Add Subject
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
                <h3 className="font-bold text-lg">Add Subject</h3>
                <button
                  type="button"
                  className="btn btn-sm btn-ghost btn-circle"
                  onClick={() => setIsOpen(false)}
                  aria-label="Close add subject popup"
                >
                  <X size={16} />
                </button>
              </div>
              <AddSubjectForm />
            </div>
          </div>,
          document.body
        )}
    </>
  );
}
