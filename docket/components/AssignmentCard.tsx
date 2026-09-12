"use client";

import { useState, useTransition } from "react";
import { toggleAssignmentComplete, deleteAssignment } from "@/lib/actions/assignments";
import { relativeDueLabel } from "@/lib/dates";
import { ColorDot } from "@/components/ui";
import { AddHomeworkModal } from "@/components/AddHomeworkModal";

export type AssignmentData = {
  id: string;
  class_id: string;
  title: string;
  description: string | null;
  due_date: string;
  completed: boolean;
  created_by_name: string;
};

export function AssignmentCard({
  assignment,
  className,
  accentColor,
  showClassName = false,
  editableClasses,
}: {
  assignment: AssignmentData;
  className?: string;
  accentColor: string;
  showClassName?: boolean;
  editableClasses: { id: string; name: string; accent_color: string }[];
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [pending, startTransition] = useTransition();
  const [completed, setCompleted] = useState(assignment.completed);

  function handleToggle() {
    const next = !completed;
    setCompleted(next);
    startTransition(async () => {
      try {
        await toggleAssignmentComplete({
          id: assignment.id,
          classId: assignment.class_id,
          completed: next,
        });
      } catch {
        setCompleted(!next);
      }
    });
  }

  function handleDelete() {
    setMenuOpen(false);
    startTransition(() => {
      deleteAssignment({ id: assignment.id, classId: assignment.class_id });
    });
  }

  const overdue = !completed && relativeDueLabel(assignment.due_date).includes("overdue");

  return (
    <div className="card flex items-start gap-3 animate-fade-in">
      <button
        onClick={handleToggle}
        disabled={pending}
        aria-label={completed ? "Mark incomplete" : "Mark complete"}
        className={`mt-0.5 w-5 h-5 shrink-0 rounded-full border-2 flex items-center justify-center transition-colors ${
          completed ? "bg-ink border-ink" : "border-faint hover:border-ink"
        }`}
      >
        {completed && (
          <svg viewBox="0 0 16 16" className="w-3 h-3 text-paper animate-check-pop" fill="none">
            <path d="M3 8l3.5 3.5L13 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </button>

      <div className="flex-1 min-w-0">
        {showClassName && className && (
          <div className="flex items-center gap-1.5 mb-1">
            <ColorDot colorId={accentColor} size={7} />
            <span className="text-xs text-muted">{className}</span>
          </div>
        )}
        <p className={`text-[15px] leading-snug ${completed ? "text-faint line-through" : "text-ink"}`}>
          {assignment.title}
        </p>
        {assignment.description && (
          <p className="text-sm text-muted mt-0.5">{assignment.description}</p>
        )}
        <div className="flex items-center gap-2 mt-1.5">
          <span className={`font-serif text-sm ${overdue ? "text-danger" : "text-muted"}`}>
            {relativeDueLabel(assignment.due_date)}
          </span>
          <span className="text-faint text-xs">·</span>
          <span className="text-xs text-faint">Added by {assignment.created_by_name}</span>
        </div>
      </div>

      <div className="relative">
        <button
          onClick={() => setMenuOpen((v) => !v)}
          className="text-faint hover:text-ink px-1 py-1 rounded"
          aria-label="Assignment options"
        >
          •••
        </button>
        {menuOpen && (
          <>
            <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
            <div className="absolute right-0 mt-1 w-40 rounded-xl border border-hairline bg-paper shadow-sm z-20 overflow-hidden">
              <AddHomeworkModal
                classes={editableClasses}
                lockedClassId={assignment.class_id}
                existing={{
                  id: assignment.id,
                  class_id: assignment.class_id,
                  title: assignment.title,
                  description: assignment.description,
                  due_date: assignment.due_date,
                }}
                trigger={(openModal) => (
                  <button
                    className="w-full text-left px-4 py-2.5 text-sm hover:bg-wash"
                    onClick={() => {
                      setMenuOpen(false);
                      openModal();
                    }}
                  >
                    Edit
                  </button>
                )}
              />
              <button
                className="w-full text-left px-4 py-2.5 text-sm hover:bg-wash"
                onClick={() => {
                  setMenuOpen(false);
                  handleToggle();
                }}
              >
                {completed ? "Mark incomplete" : "Mark complete"}
              </button>
              <button
                className="w-full text-left px-4 py-2.5 text-sm hover:bg-wash text-danger"
                onClick={handleDelete}
              >
                Delete
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}