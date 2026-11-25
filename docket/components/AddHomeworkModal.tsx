"use client";

import { useEffect, useState, useTransition } from "react";
import { createPortal } from "react-dom";
import { addAssignment, updateAssignment } from "@/lib/actions/assignments";
import { isoDateFromOffset, isoDateForNextWeekday } from "@/lib/dates";
import { ColorDot } from "@/components/ui";

type ClassOption = { id: string; name: string; accent_color: string };

type ExistingAssignment = {
  id: string;
  class_id: string;
  title: string;
  description: string | null;
  due_date: string;
  recurrence_interval_weeks?: number | null;
  recurrence_monthly?: boolean;
};

type RepeatEvery = 1 | 2 | "month";

const QUICK_DUES = [
  { label: "Today", value: () => isoDateFromOffset(0) },
  { label: "Tomorrow", value: () => isoDateFromOffset(1) },
  { label: "Friday", value: () => isoDateForNextWeekday(5) },
];

const DAY_LABELS = ["S", "M", "T", "W", "T", "F", "S"];
const INTERVAL_OPTIONS: { value: RepeatEvery; label: string }[] = [
  { value: 1, label: "Week" },
  { value: 2, label: "2 weeks" },
  { value: "month", label: "Month" },
];
const ORDINALS = ["first", "second", "third", "fourth", "last"];

function weekdayOf(iso: string): number {
  return new Date(iso + "T00:00:00").getDay();
}

function isQuickDue(iso: string): boolean {
  return QUICK_DUES.some((quickDue) => quickDue.value() === iso);
}

function repeatEveryOf(assignment?: ExistingAssignment): RepeatEvery {
  if (assignment?.recurrence_monthly) return "month";
  return assignment?.recurrence_interval_weeks === 2 ? 2 : 1;
}

function monthlyPhrase(iso: string): string {
  const date = new Date(iso + "T00:00:00");
  const ordinal = Math.min(Math.ceil(date.getDate() / 7), 5);
  const weekday = date.toLocaleDateString("en-US", { weekday: "long" });
  return `${ORDINALS[ordinal - 1]} ${weekday}`;
}

export function AddHomeworkModal({
  classes,
  lockedClassId,
  existing,
  trigger,
  open: controlledOpen,
  onOpenChange,
}: {
  classes: ClassOption[];
  lockedClassId?: string;
  existing?: ExistingAssignment;
  trigger?: (open: () => void) => React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}) {
  const [internalOpen, setInternalOpen] = useState(false);
  const open = controlledOpen !== undefined ? controlledOpen : internalOpen;
  const setOpen = onOpenChange ?? setInternalOpen;
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const [classId, setClassId] = useState(
    existing?.class_id ?? lockedClassId ?? classes[0]?.id ?? ""
  );
  const [title, setTitle] = useState(existing?.title ?? "");
  const [description, setDescription] = useState(existing?.description ?? "");
  const [dueDate, setDueDate] = useState(
    existing?.due_date ?? isoDateFromOffset(1)
  );
  const [customDate, setCustomDate] = useState(
    existing ? !isQuickDue(existing.due_date) : false
  );
  const [showRecurrence, setShowRecurrence] = useState(
    existing?.recurrence_interval_weeks != null ||
      existing?.recurrence_monthly === true
  );
  const [recurringDays, setRecurringDays] = useState<number[]>([]);
  const [repeatEvery, setRepeatEvery] = useState<RepeatEvery>(
    repeatEveryOf(existing)
  );
  const [repeatChanged, setRepeatChanged] = useState(false);

  useEffect(() => {
    if (!open || !existing) return;
    setClassId(existing.class_id);
    setTitle(existing.title);
    setDescription(existing.description ?? "");
    setDueDate(existing.due_date);
    setCustomDate(!isQuickDue(existing.due_date));
    setShowRecurrence(
      existing.recurrence_interval_weeks != null ||
        existing.recurrence_monthly === true
    );
    setRepeatEvery(repeatEveryOf(existing));
    setRepeatChanged(false);
    setError(null);
  }, [open, existing]);

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !pending) {
        setOpen(false);
        setError(null);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open, pending, setOpen]);

  const weekdayName = dueDate
    ? new Date(dueDate + "T00:00:00").toLocaleDateString("en-US", {
        weekday: "long",
      })
    : "";

  function toggleRecurrence(checked: boolean) {
    setShowRecurrence(checked);
    setRepeatChanged(true);
    if (checked && !existing && recurringDays.length === 0) {
      setRecurringDays([weekdayOf(dueDate)]);
    }
  }

  function toggleDay(day: number) {
    setRecurringDays((previous) =>
      previous.includes(day)
        ? previous.filter((item) => item !== day)
        : [...previous, day].sort()
    );
  }

  function close() {
    if (pending) return;
    setOpen(false);
    setError(null);
  }

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (pending || !title.trim() || !classId) return;

    if (
      showRecurrence &&
      !existing &&
      repeatEvery !== "month" &&
      recurringDays.length === 0
    ) {
      setError("Pick at least one day it repeats on.");
      return;
    }

    setError(null);

    startTransition(async () => {
      try {
        if (existing) {
          await updateAssignment({
            id: existing.id,
            classId,
            title,
            description,
            dueDate,
            ...(repeatChanged
              ? {
                  recurrenceIntervalWeeks:
                    showRecurrence && repeatEvery !== "month"
                      ? repeatEvery
                      : null,
                  recurrenceMonthly:
                    showRecurrence && repeatEvery === "month",
                }
              : {}),
          });
        } else {
          await addAssignment({
            classId,
            title,
            description,
            dueDate,
            recurringDays:
              showRecurrence && repeatEvery !== "month"
                ? recurringDays
                : undefined,
            recurringIntervalWeeks:
              repeatEvery === "month" ? 1 : repeatEvery,
            recurringMonthly: showRecurrence && repeatEvery === "month",
          });
        }

        setOpen(false);

        if (!existing) {
          setTitle("");
          setDescription("");
          setCustomDate(false);
          setShowRecurrence(false);
          setRecurringDays([]);
          setRepeatEvery(1);
        }
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Something went wrong."
        );
      }
    });
  }

  const modalContent = open ? (
    <div
      className="fixed inset-0 z-[130] flex items-end justify-center bg-ink/35 px-0 pt-[env(safe-area-inset-top)] sm:items-center sm:px-4 sm:py-6"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) close();
      }}
    >
      <form
        role="dialog"
        aria-modal="true"
        aria-labelledby="assignment-modal-title"
        onSubmit={handleSubmit}
        className="modal-panel-enter max-h-[calc(100dvh_-_env(safe-area-inset-top)_-_env(safe-area-inset-bottom))] w-full overflow-y-auto overscroll-contain rounded-t-2xl border border-hairline bg-paper px-5 pb-[calc(1.25rem+env(safe-area-inset-bottom))] pt-6 shadow-xl sm:max-h-[min(90dvh,48rem)] sm:max-w-md sm:rounded-2xl sm:p-7"
      >
        <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-hairline sm:hidden" />
        <h2 id="assignment-modal-title" className="mb-5 font-serif text-2xl">
          {existing ? "Edit homework" : "Add homework"}
        </h2>

        {!lockedClassId && (
          <div className="mb-4">
            <label className="label" htmlFor="assignment-class">
              Class
            </label>
            <select
              id="assignment-class"
              className="input"
              value={classId}
              onChange={(event) => setClassId(event.target.value)}
              required
              disabled={pending}
            >
              {classes.map((cls) => (
                <option key={cls.id} value={cls.id}>
                  {cls.name}
                </option>
              ))}
            </select>
          </div>
        )}

        <div className="mb-4">
          <label className="label" htmlFor="assignment-title">
            What&rsquo;s the homework?
          </label>
          <input
            id="assignment-title"
            className="input"
            placeholder="e.g. Pages 312–313 #1–20 odd"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            autoFocus
            required
            disabled={pending}
          />
        </div>

        <div className="mb-4">
          <span className="label">Due</span>
          <div className="flex flex-wrap gap-2">
            {QUICK_DUES.map((quickDue) => {
              const value = quickDue.value();
              const active = !customDate && dueDate === value;
              return (
                <button
                  key={quickDue.label}
                  type="button"
                  onClick={() => {
                    setDueDate(value);
                    setCustomDate(false);
                  }}
                  disabled={pending}
                  className={`min-h-11 rounded-xl border px-4 py-2 text-sm transition-colors ${
                    active
                      ? "border-ink bg-ink text-paper"
                      : "border-hairline text-ink hover:bg-wash"
                  }`}
                >
                  {quickDue.label}
                </button>
              );
            })}
            <button
              type="button"
              onClick={() => setCustomDate(true)}
              disabled={pending}
              className={`min-h-11 rounded-xl border px-4 py-2 text-sm transition-colors ${
                customDate
                  ? "border-ink bg-ink text-paper"
                  : "border-hairline text-ink hover:bg-wash"
              }`}
            >
              Custom
            </button>
          </div>
          {customDate && (
            <input
              type="date"
              className="input mt-2"
              value={dueDate}
              onChange={(event) => setDueDate(event.target.value)}
              required
              disabled={pending}
            />
          )}
        </div>

        <div className="mb-6">
          <label className="label" htmlFor="assignment-description">
            Details (optional)
          </label>
          <input
            id="assignment-description"
            className="input"
            placeholder="e.g. Study for trig quiz"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            disabled={pending}
          />
        </div>

        <div className="mb-6">
          <label className="mb-3 flex min-h-11 cursor-pointer select-none items-center gap-2.5 text-[15px] text-ink">
            <input
              type="checkbox"
              checked={showRecurrence}
              onChange={(event) => toggleRecurrence(event.target.checked)}
              className="h-5 w-5 rounded border-hairline accent-ink"
              disabled={pending}
            />
            Repeats
          </label>

          {showRecurrence && (
            <div className="pl-0.5">
              {repeatEvery === "month" ? (
                dueDate && (
                  <p className="mb-4 text-sm text-muted">
                    Repeats on the {monthlyPhrase(dueDate)} of each month
                  </p>
                )
              ) : existing ? (
                weekdayName && (
                  <p className="mb-4 text-sm text-muted">
                    Repeats on {weekdayName}s
                  </p>
                )
              ) : (
                <>
                  <label className="label">Repeats on</label>
                  <div className="mb-4 flex flex-wrap gap-1.5">
                    {DAY_LABELS.map((label, day) => (
                      <button
                        key={day}
                        type="button"
                        onClick={() => toggleDay(day)}
                        disabled={pending}
                        aria-pressed={recurringDays.includes(day)}
                        aria-label={`Repeat on ${
                          ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"][day]
                        }`}
                        className={`h-11 w-11 rounded-full text-xs font-medium transition-colors ${
                          recurringDays.includes(day)
                            ? "bg-ink text-paper"
                            : "border border-hairline text-muted hover:bg-wash"
                        }`}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </>
              )}

              <label className="label">Every</label>
              <div className="flex flex-wrap gap-2">
                {INTERVAL_OPTIONS.map((option) => (
                  <button
                    key={String(option.value)}
                    type="button"
                    onClick={() => {
                      setRepeatEvery(option.value);
                      setRepeatChanged(true);
                    }}
                    disabled={pending}
                    aria-pressed={repeatEvery === option.value}
                    className={`min-h-11 rounded-xl border px-4 py-2 text-sm transition-colors ${
                      repeatEvery === option.value
                        ? "border-ink bg-ink text-paper"
                        : "border-hairline text-ink hover:bg-wash"
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {error && (
          <p role="alert" className="mb-4 text-sm text-danger">
            {error}
          </p>
        )}

        <div className="flex gap-3">
          <button
            type="button"
            className="btn-secondary flex-1"
            onClick={close}
            disabled={pending}
          >
            Cancel
          </button>
          <button type="submit" className="btn-primary flex-1" disabled={pending}>
            {pending ? "Saving…" : existing ? "Save changes" : "Add homework"}
          </button>
        </div>
      </form>
    </div>
  ) : null;

  return (
    <>
      {trigger
        ? trigger(() => setOpen(true))
        : controlledOpen === undefined && (
            <button
              type="button"
              className="btn-primary"
              onClick={() => setOpen(true)}
            >
              + Add homework
            </button>
          )}

      {open &&
        typeof document !== "undefined" &&
        createPortal(modalContent, document.body)}
    </>
  );
}

export function ClassOptionDot({ colorId }: { colorId: string }) {
  return <ColorDot colorId={colorId} />;
}
