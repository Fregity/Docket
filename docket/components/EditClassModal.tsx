"use client";

import { useState, useTransition } from "react";
import { updateClass } from "@/lib/actions/classes";
import { ACCENT_COLORS } from "@/lib/colors";

type ClassInfo = {
  id: string;
  name: string;
  period: string | null;
  teacher: string | null;
  accent_color: string;
};

export function EditClassModal({ cls }: { cls: ClassInfo }) {
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const [name, setName] = useState(cls.name);
  const [period, setPeriod] = useState(cls.period ?? "");
  const [teacher, setTeacher] = useState(cls.teacher ?? "");
  const [color, setColor] = useState(cls.accent_color);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    setError(null);
    startTransition(async () => {
      try {
        await updateClass({ classId: cls.id, name, period, teacher, accentColor: color });
        setOpen(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong.");
      }
    });
  }

  return (
    <>
      <button className="btn-secondary" onClick={() => setOpen(true)}>
        Edit class
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-ink/30 animate-fade-in"
          onClick={() => setOpen(false)}
        >
          <form
            onClick={(e) => e.stopPropagation()}
            onSubmit={handleSubmit}
            className="w-full sm:max-w-sm bg-paper rounded-t-2xl sm:rounded-2xl border border-hairline p-6 sm:p-7 max-h-[90vh] overflow-y-auto"
          >
            <h2 className="font-serif text-2xl mb-5">Edit class</h2>

            <div className="mb-4">
              <label className="label">Class name</label>
              <input className="input" value={name} onChange={(e) => setName(e.target.value)} required />
            </div>

            <div className="mb-4">
              <label className="label">Period (optional)</label>
              <input className="input" value={period} onChange={(e) => setPeriod(e.target.value)} />
            </div>

            <div className="mb-4">
              <label className="label">Teacher (optional)</label>
              <input className="input" value={teacher} onChange={(e) => setTeacher(e.target.value)} />
            </div>

            <div className="mb-6">
              <label className="label">Color</label>
              <div className="flex flex-wrap gap-2.5">
                {ACCENT_COLORS.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setColor(c.id)}
                    aria-label={c.label}
                    className="w-8 h-8 rounded-full"
                    style={{
                      backgroundColor: c.hex,
                      outline: color === c.id ? "2px solid rgb(var(--ink))" : "none",
                      outlineOffset: 2,
                    }}
                  />
                ))}
              </div>
            </div>

            {error && <p className="text-sm mb-4 text-danger">{error}</p>}

            <div className="flex gap-3">
              <button type="button" className="btn-secondary flex-1" onClick={() => setOpen(false)}>
                Cancel
              </button>
              <button type="submit" className="btn-primary flex-1" disabled={pending}>
                {pending ? "Saving…" : "Save changes"}
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}