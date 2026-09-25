"use client";

import { useState, useTransition } from "react";
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
};

const QUICK_DUES = [
  { label: "Today", value: () => isoDateFromOffset(0) },
  { label: "Tomorrow", value: () => isoDateFromOffset(1) },
  { label: "Friday", value: () => isoDateForNextWeekday(5) },
];

export function AddHomeworkModal({
  classes,
  lockedClassId,
  existing,
  trigger,
}: {
  classes: ClassOption[];
  lockedClassId?: string;
  existing?: ExistingAssignment;
  trigger?: (open: () => void) => React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const [classId, setClassId] = useState(existing?.class_id ?? lockedClassId ?? classes[0]?.id ?? "");
  const [title, setTitle] = useState(existing?.title ?? "");
  const [description, setDescription] = useState(existing?.description ?? "");
  const [dueDate, setDueDate] = useState(existing?.due_date ?? isoDateFromOffset(1));
  const [customDate, setCustomDate] = useState(false);
  const [recurring, setRecurring] = useState(false);

  function close() {
    setOpen(false);
    setError(null);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim() || !classId) return;
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
          });
        } else {
          await addAssignment({ classId, title, description, dueDate, recurring });
        }
        setOpen(false);
        setTitle("");
        setDescription("");
        setCustomDate(false);
        setRecurring(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong.");
      }
    });
  }

  return (
    <>
      {trigger ? (
        trigger(() => setOpen(true))
      ) : (
        <button className="btn-primary" onClick={() => setOpen(true)}>
          + Add homework
        </button>
      )}

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-ink/30 animate-fade-in"
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

            {!existing && (
              <label className="flex items-center gap-2.5 mb-6 text-[15px] text-ink cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={recurring}
                  onChange={(e) => setRecurring(e.target.checked)}
                  className="w-4 h-4 rounded border-hairline accent-ink"
                />
                Repeats weekly
              </label>
            )}

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
      )}
    </>
  );
}

export function ClassOptionDot({ colorId }: { colorId: string }) {
  return <ColorDot colorId={colorId} />;
}