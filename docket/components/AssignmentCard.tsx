"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import {
  toggleAssignmentComplete,
  deleteAssignment,
} from "@/lib/actions/assignments";
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
  recurrence_interval_weeks?: number | null;
  recurrence_monthly?: boolean;
};

type MenuPosition = { top: number; left: number };

export function AssignmentCard({
  assignment,
  className,
  accentColor,
  showClassName = false,
  editableClasses,
  readOnly = false,
}: {
  assignment: AssignmentData;
  className?: string;
  accentColor: string;
  showClassName?: boolean;
  editableClasses: { id: string; name: string; accent_color: string }[];
  readOnly?: boolean;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [menuPos, setMenuPos] = useState<MenuPosition | null>(null);
  const [completed, setCompleted] = useState(assignment.completed);
  const [editOpen, setEditOpen] = useState(false);
  const [savingCompletion, setSavingCompletion] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [removed, setRemoved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  function calculateMenuPosition(): MenuPosition | null {
    const rect = menuButtonRef.current?.getBoundingClientRect();
    if (!rect) return null;

    const menuWidth = 176;
    const menuHeight = 148;
    const gap = 8;
    const left = Math.max(
      8,
      Math.min(rect.right - menuWidth, window.innerWidth - menuWidth - 8)
    );
    const roomBelow = window.innerHeight - rect.bottom;
    const top =
      roomBelow >= menuHeight + gap
        ? rect.bottom + gap
        : Math.max(8, rect.top - menuHeight - gap);

    return { top, left };
  }

  function openMenu() {
    setMenuPos(calculateMenuPosition());
    setMenuOpen(true);
  }

  useEffect(() => {
    if (!menuOpen) return;

    const reposition = () => setMenuPos(calculateMenuPosition());
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };

    window.addEventListener("resize", reposition);
    window.addEventListener("scroll", reposition, true);
    window.addEventListener("keydown", closeOnEscape);

    return () => {
      window.removeEventListener("resize", reposition);
      window.removeEventListener("scroll", reposition, true);
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [menuOpen]);

  async function handleToggle() {
    if (savingCompletion || deleting) return;

    const previous = completed;
    const next = !previous;
    setCompleted(next);
    setSavingCompletion(true);
    setError(null);

    try {
      await toggleAssignmentComplete({
        id: assignment.id,
        classId: assignment.class_id,
        completed: next,
      });
    } catch (err) {
      setCompleted(previous);
      setError(
        err instanceof Error ? err.message : "Couldn't update this assignment."
      );
    } finally {
      setSavingCompletion(false);
    }
  }

  async function handleDelete() {
    if (deleting) return;

    setMenuOpen(false);
    setDeleting(true);
    setRemoved(true);
    setError(null);

    try {
      await deleteAssignment({
        id: assignment.id,
        classId: assignment.class_id,
      });
    } catch (err) {
      setRemoved(false);
      setError(
        err instanceof Error ? err.message : "Couldn't delete this assignment."
      );
    } finally {
      setDeleting(false);
    }
  }

  const overdue =
    !completed &&
    relativeDueLabel(assignment.due_date, completed).includes("overdue");

  if (removed) return null;

  const menuContent =
    menuOpen && menuPos ? (
      <>
        <button
          type="button"
          aria-label="Close assignment menu"
          className="fixed inset-0 z-[90] cursor-default"
          onClick={() => setMenuOpen(false)}
        />
        <div
          role="menu"
          aria-label="Assignment options"
          style={{ position: "fixed", top: menuPos.top, left: menuPos.left }}
          className="z-[91] w-44 overflow-hidden rounded-xl border border-hairline bg-paper shadow-lg"
        >
          <button
            type="button"
            role="menuitem"
            className="min-h-11 w-full px-4 py-2.5 text-left text-sm hover:bg-wash"
            onClick={() => {
              setMenuOpen(false);
              setEditOpen(true);
            }}
          >
            Edit
          </button>
          <button
            type="button"
            role="menuitem"
            className="min-h-11 w-full px-4 py-2.5 text-left text-sm hover:bg-wash"
            onClick={() => {
              setMenuOpen(false);
              void handleToggle();
            }}
          >
            {completed ? "Mark incomplete" : "Mark complete"}
          </button>
          <button
            type="button"
            role="menuitem"
            className="min-h-11 w-full px-4 py-2.5 text-left text-sm text-danger hover:bg-wash"
            onClick={() => void handleDelete()}
          >
            Delete
          </button>
        </div>
      </>
    ) : null;

  return (
    <article
      className={`card flex min-w-0 items-start gap-3 transition-[opacity,transform] duration-150 ${
        deleting ? "pointer-events-none opacity-50" : "opacity-100"
      }`}
    >
      {readOnly ? (
        <span
          aria-hidden="true"
          className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 ${
            completed ? "border-ink bg-ink" : "border-faint"
          }`}
        />
      ) : (
        <button
          type="button"
          onClick={() => void handleToggle()}
          disabled={savingCompletion || deleting}
          aria-label={completed ? "Mark incomplete" : "Mark complete"}
          aria-pressed={completed}
          className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 transition-colors disabled:opacity-60 ${
            completed
              ? "border-ink bg-ink"
              : "border-faint hover:border-ink"
          }`}
        >
          {completed && (
            <svg
              viewBox="0 0 16 16"
              className="h-3 w-3 text-paper"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M3 8l3.5 3.5L13 5"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}
        </button>
      )}

      <div className="min-w-0 flex-1">
        {showClassName && className && (
          <div className="mb-1 flex min-w-0 items-center gap-1.5">
            <ColorDot colorId={accentColor} size={7} />
            <span className="truncate text-xs text-muted">{className}</span>
          </div>
        )}

        <p
          className={`break-words text-[15px] leading-snug ${
            completed ? "text-faint line-through" : "text-ink"
          }`}
        >
          {assignment.title}
        </p>

        {assignment.description && (
          <p className="mt-1 break-words text-sm text-muted">
            {assignment.description}
          </p>
        )}

        <div className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1">
          <span
            className={`font-serif text-sm ${
              overdue ? "text-danger" : "text-muted"
            }`}
          >
            {relativeDueLabel(assignment.due_date, completed)}
          </span>
          {assignment.recurrence_monthly && (
            <span className="text-xs text-faint">↻ Monthly</span>
          )}
          {!assignment.recurrence_monthly &&
            assignment.recurrence_interval_weeks === 1 && (
              <span className="text-xs text-faint">↻ Weekly</span>
            )}
          {!assignment.recurrence_monthly &&
            assignment.recurrence_interval_weeks != null &&
            assignment.recurrence_interval_weeks > 1 && (
              <span className="text-xs text-faint">
                ↻ Every {assignment.recurrence_interval_weeks} weeks
              </span>
            )}
          <span className="text-xs text-faint">·</span>
          <span className="break-words text-xs text-faint">
            Added by {assignment.created_by_name}
          </span>
        </div>

        {error && (
          <p role="alert" className="mt-2 text-xs text-danger">
            {error}
          </p>
        )}
      </div>

      {!readOnly && (
        <>
          <button
            ref={menuButtonRef}
            type="button"
            onClick={() => (menuOpen ? setMenuOpen(false) : openMenu())}
            disabled={deleting}
            aria-label="Assignment options"
            aria-haspopup="menu"
            aria-expanded={menuOpen}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-lg leading-none text-faint transition-colors hover:bg-wash hover:text-ink disabled:opacity-50"
          >
            •••
          </button>
          {typeof document !== "undefined" &&
            createPortal(menuContent, document.body)}

          <AddHomeworkModal
            classes={editableClasses}
            lockedClassId={assignment.class_id}
            existing={{
              id: assignment.id,
              class_id: assignment.class_id,
              title: assignment.title,
              description: assignment.description,
              due_date: assignment.due_date,
              recurrence_interval_weeks:
                assignment.recurrence_interval_weeks ?? null,
              recurrence_monthly: assignment.recurrence_monthly ?? false,
            }}
            open={editOpen}
            onOpenChange={setEditOpen}
          />
        </>
      )}
    </article>
  );
}
