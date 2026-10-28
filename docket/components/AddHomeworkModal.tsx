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
  return QUICK_DUES.some((q) => q.value() === iso);
}

function repeatEveryOf(e?: ExistingAssignment): RepeatEvery {
  if (e?.recurrence_monthly) return "month";
  return e?.recurrence_interval_weeks === 2 ? 2 : 1;
}

function monthlyPhrase(iso: string): string {
  const d = new Date(iso + "T00:00:00");
  const n = Math.min(Math.ceil(d.getDate() / 7), 5);
  const weekday = d.toLocaleDateString("en-US", { weekday: "long" });
  return `${ORDINALS[n - 1]} ${weekday}`;
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

  const [classId, setClassId] = useState(existing?.class_id ?? lockedClassId ?? classes[0]?.id ?? "");
  const [title, setTitle] = useState(existing?.title ?? "");
  const [description, setDescription] = useState(existing?.description ?? "");
  const [dueDate, setDueDate] = useState(existing?.due_date ?? isoDateFromOffset(1));
  const [customDate, setCustomDate] = useState(existing ? !isQuickDue(existing.due_date) : false);
  const [showRecurrence, setShowRecurrence] = useState(
    existing?.recurrence_interval_weeks != null || existing?.recurrence_monthly === true
  );
  const [recurringDays, setRecurringDays] = useState<number[]>([]);
  const [repeatEvery, setRepeatEvery] = useState<RepeatEvery>(repeatEveryOf(existing));
  const [repeatChanged, setRepeatChanged] = useState(false);

  // The edit modal stays mounted between uses (so it survives its dropdown
  // closing), which means its fields would otherwise keep whatever was last
  // typed, even from a cancelled edit. Re-sync from the saved assignment
  // every time it opens.
  useEffect(() => {
    if (!open || !existing) return;
    setClassId(existing.class_id);
    setTitle(existing.title);
    setDescription(existing.description ?? "");
    setDueDate(existing.due_date);
    setCustomDate(!isQuickDue(existing.due_date));
    setShowRecurrence(existing.recurrence_interval_weeks != null || existing.recurrence_monthly === true);
    setRepeatEvery(repeatEveryOf(existing));
    setRepeatChanged(false);
    setError(null);
  }, [open]);

  const weekdayName = dueDate
    ? new Date(dueDate + "T00:00:00").toLocaleDateString("en-US", { weekday: "long" })
    : "";

  function toggleRecurrence(checked: boolean) {
    setShowRecurrence(checked);
    setRepeatChanged(true);
    if (checked && !existing && recurringDays.length === 0) {
      setRecurringDays([weekdayOf(dueDate)]);
    }
  }

  function toggleDay(day: number) {
    setRecurringDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day].sort()
    );
  }

  function close() {
    setOpen(false);
    setError(null);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim() || !classId) return;
    if (showRecurrence && !existing && repeatEvery !== "month" && recurringDays.length === 0) {
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
                    showRecurrence && repeatEvery !== "month" ? repeatEvery : null,
                  recurrenceMonthly: showRecurrence && repeatEvery === "month",
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
              showRecurrence && repeatEvery !== "month" ? recurringDays : undefined,
            recurringIntervalWeeks: repeatEvery === "month" ? 1 : repeatEvery,
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
        setError(err instanceof Error ? err.message : "Something went wrong.");
      }
    });
  }

  const modalContent = open && (
    <div
      className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center bg-ink/30 animate-fade-in"
      onClick={close}
    >
      <form
        onClick={(e) => e.stopPropagation()}
        onSubmit={handleSubmit}
        className="w-full sm:max-w-md bg-paper rounded-t-2xl sm:rounded-2xl border border-hairline p-6 sm:p-7 max-h-[90vh] overflow-y-auto"
      >
        <h2 className="font-serif text-2xl mb-5">
          {existing ? "Edit homework" : "Add homework"}
        </h2>

        {!lockedClassId && (
          <div className="mb-4">
            <label className="label">Class</label>
            <select
              className="input"
              value={classId}
              onChange={(e) => setClassId(e.target.value)}
              required
            >
              {classes.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
        )}

        <div className="mb-4">
          <label className="label">What&rsquo;s the homework?</label>
          <input
            className="input"
            placeholder="e.g. Pages 312–313 #1–20 odd"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            autoFocus
            required
          />
        </div>

        <div className="mb-4">
          <label className="label">Due</label>
          <div className="flex flex-wrap gap-2">
            {QUICK_DUES.map((q) => {
              const val = q.value();
              const active = !customDate && dueDate === val;
              return (
                <button
                  key={q.label}
                  type="button"
                  onClick={() => {
                    setDueDate(val);
                    setCustomDate(false);
                  }}
                  className={`rounded-xl px-4 py-2 text-sm border transition-colors ${
                    active
                      ? "bg-ink text-paper border-ink"
                      : "border-hairline text-ink hover:bg-wash"
                  }`}
                >
                  {q.label}
                </button>
              );
            })}
            <button
              type="button"
              onClick={() => setCustomDate(true)}
              className={`rounded-xl px-4 py-2 text-sm border transition-colors ${
                customDate
                  ? "bg-ink text-paper border-ink"
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
              onChange={(e) => setDueDate(e.target.value)}
              required
            />
          )}
        </div>

        <div className="mb-6">
          <label className="label">Details (optional)</label>
          <input
            className="input"
            placeholder="e.g. Study for trig quiz"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div className="mb-6">
          <label className="flex items-center gap-2.5 mb-3 text-[15px] text-ink cursor-pointer select-none">
            <input
              type="checkbox"
              checked={showRecurrence}
              onChange={(e) => toggleRecurrence(e.target.checked)}
              className="w-4 h-4 rounded border-hairline accent-ink"
            />
            Repeats
          </label>

          {showRecurrence && (
            <div className="pl-0.5">
              {repeatEvery === "month" ? (
                dueDate && (
                  <p className="text-sm text-muted mb-4">
                    Repeats on the {monthlyPhrase(dueDate)} of each month
                  </p>
                )
              ) : existing ? (
                weekdayName && (
                  <p className="text-sm text-muted mb-4">Repeats on {weekdayName}s</p>
                )
              ) : (
                <>
                  <label className="label">Repeats on</label>
                  <div className="flex gap-1.5 mb-4">
                    {DAY_LABELS.map((label, day) => (
                      <button
                        key={day}
                        type="button"
                        onClick={() => toggleDay(day)}
                        className={`w-8 h-8 rounded-full text-xs font-medium transition-colors ${
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
              <div className="flex gap-2">
                {INTERVAL_OPTIONS.map((opt) => (
                  <button
                    key={String(opt.value)}
                    type="button"
                    onClick={() => {
                      setRepeatEvery(opt.value);
                      setRepeatChanged(true);
                    }}
                    className={`rounded-xl px-4 py-2 text-sm border transition-colors ${
                      repeatEvery === opt.value
                        ? "bg-ink text-paper border-ink"
                        : "border-hairline text-ink hover:bg-wash"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {error && <p className="text-sm mb-4 text-danger">{error}</p>}

        <div className="flex gap-3">
          <button type="button" className="btn-secondary flex-1" onClick={close}>
            Cancel
          </button>
          <button type="submit" className="btn-primary flex-1" disabled={pending}>
            {pending ? "Saving…" : existing ? "Save changes" : "Add homework"}
          </button>
        </div>
      </form>
    </div>
  );

  return (
    <>
      {trigger
        ? trigger(() => setOpen(true))
        : controlledOpen === undefined && (
            <button className="btn-primary" onClick={() => setOpen(true)}>
              + Add homework
            </button>
          )}

      {open && typeof document !== "undefined" && createPortal(modalContent, document.body)}
    </>
  );
}

export function ClassOptionDot({ colorId }: { colorId: string }) {
  return <ColorDot colorId={colorId} />;
    }
