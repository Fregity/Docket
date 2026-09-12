"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { isNextRedirectError } from "@/lib/errors";
import { createClass } from "@/lib/actions/classes";
import { ACCENT_COLORS } from "@/lib/colors";

export default function NewClassPage() {
  const [name, setName] = useState("");
  const [period, setPeriod] = useState("");
  const [teacher, setTeacher] = useState("");
  const [color, setColor] = useState<string>(ACCENT_COLORS[0].id);
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    setError(null);
    startTransition(async () => {
      try {
        await createClass({ name, period, teacher, accentColor: color });
      } catch (err) {
        if (isNextRedirectError(err)) throw err;
        setError(err instanceof Error ? err.message : "Something went wrong.");
      }
    });
  }

  return (
    <main className="min-h-screen px-6 py-10 max-w-md mx-auto">
      <Link href="/classes" className="text-sm text-muted">
        ← Back
      </Link>
      <h1 className="font-serif text-3xl mt-4 mb-8">Create a class</h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label className="label">Class name</label>
          <input
            className="input"
            placeholder="History"
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoFocus
            required
          />
        </div>

        <div>
          <label className="label">Period (optional)</label>
          <input className="input" placeholder="1" value={period} onChange={(e) => setPeriod(e.target.value)} />
        </div>

        <div>
          <label className="label">Teacher (optional)</label>
          <input
            className="input"
            placeholder="Mr. Smith"
            value={teacher}
            onChange={(e) => setTeacher(e.target.value)}
          />
        </div>

        <div>
          <label className="label">Color</label>
          <div className="flex flex-wrap gap-2.5">
            {ACCENT_COLORS.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => setColor(c.id)}
                aria-label={c.label}
                className="w-8 h-8 rounded-full flex items-center justify-center"
                style={{
                  backgroundColor: c.hex,
                  outline: color === c.id ? "2px solid rgb(var(--ink))" : "none",
                  outlineOffset: 2,
                }}
              />
            ))}
          </div>
        </div>

        {error && <p className="text-sm text-danger">{error}</p>}

        <button type="submit" className="btn-primary mt-3" disabled={pending}>
          {pending ? "Creating…" : "Create class"}
        </button>
      </form>
    </main>
  );
}